import {neon} from '@neondatabase/serverless';
let connection, url, managed;
export function database(env=process.env) {
  if(env.ANALYTICS_DATABASE_PROVIDER==='netlify')return async(text,params=[])=>{managed ||= import('@netlify/database').then(({getDatabase})=>getDatabase());return (await managed).sql.unsafe(text,params);};
  if(!env.ANALYTICS_DATABASE_URL)throw Error('Analytics database not configured');
  if(url!==env.ANALYTICS_DATABASE_URL){url=env.ANALYTICS_DATABASE_URL;connection=neon(url);}
  return async (text,params=[])=>connection.query(text,params);
}
export const INGEST_SQL = `
WITH input AS (
 SELECT * FROM jsonb_to_recordset($2::jsonb) AS e(event_id uuid, session_id uuid, visitor_key text, kind text,
 occurred_at timestamptz,project_id text,resume_id text,target text,section_id text,start_at timestamptz,end_at timestamptz,device text,source text)
), accepted AS (
 INSERT INTO portfolio_analytics.events(environment,event_id,session_id,visitor_key,kind,occurred_at,project_id,resume_id,target,section_id,active_range,device,source)
 SELECT $1,event_id,session_id,visitor_key,kind,occurred_at,project_id,resume_id,target,section_id,
 CASE WHEN start_at IS NOT NULL THEN tstzrange(start_at,end_at,'[)') ELSE NULL END,device,source FROM input
 ON CONFLICT (environment,event_id) DO NOTHING RETURNING *
), saved_sessions AS (
 INSERT INTO portfolio_analytics.sessions(environment,session_id,visitor_key,started_at,last_event_at,device,source,engaged)
 SELECT $1,session_id,min(visitor_key),min(least(occurred_at,coalesce(lower(active_range),occurred_at))),max(greatest(occurred_at,coalesce(upper(active_range),occurred_at))),(array_agg(device))[1],(array_agg(source))[1],
 coalesce(range_agg(active_range) FILTER (WHERE active_range IS NOT NULL),'{}'::tstzmultirange) FROM accepted GROUP BY session_id
 ON CONFLICT(environment,session_id) DO UPDATE SET
 last_event_at=greatest(portfolio_analytics.sessions.last_event_at,excluded.last_event_at),
 started_at=least(portfolio_analytics.sessions.started_at,excluded.started_at),
 engaged=portfolio_analytics.sessions.engaged+excluded.engaged
 WHERE portfolio_analytics.sessions.visitor_key=excluded.visitor_key
 RETURNING (xmax=0) AS is_new
), saved_sections AS (
 INSERT INTO portfolio_analytics.sections(environment,session_id,section_id,engaged)
 SELECT $1,session_id,section_id,range_agg(active_range) FROM accepted WHERE active_range IS NOT NULL GROUP BY session_id,section_id
 ON CONFLICT(environment,session_id,section_id) DO UPDATE SET engaged=portfolio_analytics.sections.engaged+excluded.engaged
), saved_totals AS (
 INSERT INTO portfolio_analytics.totals(environment,pageviews,visits,tracking_started)
 SELECT $1,count(*) FILTER(WHERE kind='page_view'),(SELECT count(*) FROM saved_sessions WHERE is_new),min(occurred_at)
 FROM accepted HAVING count(*)>0
 ON CONFLICT(environment) DO UPDATE SET pageviews=portfolio_analytics.totals.pageviews+excluded.pageviews,
 visits=portfolio_analytics.totals.visits+excluded.visits,
 tracking_started=least(portfolio_analytics.totals.tracking_started,excluded.tracking_started)
)
SELECT count(*)::int AS accepted FROM accepted`;
export const COUNTER_SQL=`SELECT pageviews::text,visits::text,tracking_started FROM portfolio_analytics.totals WHERE environment=$1`;
export const durationSQL = col=>`coalesce((SELECT sum(extract(epoch FROM upper(r)-lower(r))) FROM unnest(${col}) AS r),0)`;
export async function report(query,environment,days=30,grain='day') {
  if(![7,30,90,365].includes(days)||!['day','week','month'].includes(grain))throw Error('Invalid report period');
  const bound=[environment,days];
  const [total]=await query(COUNTER_SQL,[environment]);
  const [openTotal]=await query(OPEN_COUNTER_SQL,[environment]);
  const [opens]=await query(`SELECT count(*)::int AS page_opens FROM portfolio_analytics.page_opens WHERE environment=$1 AND opened_at>=date_trunc('day',now())-($2::int-1)*interval '1 day'`,bound);
  const openTraffic=await query(`SELECT date_trunc('${grain}',opened_at) AS bucket,count(*)::int AS page_opens FROM portfolio_analytics.page_opens WHERE environment=$1 AND opened_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY 1 ORDER BY 1`,bound);
  const [summary]=await query(`SELECT count(*)::int AS visits,count(DISTINCT visitor_key)::int AS unique_visitors,
    coalesce(avg(${durationSQL('engaged')}),0)::float AS average_engaged_seconds,
    coalesce(avg(extract(epoch FROM last_event_at-started_at)),0)::float AS average_elapsed_seconds,
    coalesce(sum(${durationSQL('engaged')}),0)::float AS engaged_seconds
    FROM portfolio_analytics.sessions WHERE environment=$1 AND started_at>=date_trunc('day',now())-($2::int-1)*interval '1 day'`,bound);
  const [views]=await query(`SELECT count(*)::int AS pageviews FROM portfolio_analytics.events WHERE environment=$1 AND kind='page_view' AND occurred_at>=date_trunc('day',now())-($2::int-1)*interval '1 day'`,bound);
  const traffic=await query(`WITH dates AS (SELECT generate_series(date_trunc('${grain}',date_trunc('day',now())-($2::int-1)*interval '1 day'),date_trunc('${grain}',now()),interval '1 ${grain}') AS bucket),
    sessions AS (SELECT date_trunc('${grain}',started_at) AS bucket,count(*)::int AS visits,count(DISTINCT visitor_key)::int AS unique_visitors FROM portfolio_analytics.sessions WHERE environment=$1 AND started_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY 1),
    views AS (SELECT date_trunc('${grain}',occurred_at) AS bucket,count(*)::int AS pageviews FROM portfolio_analytics.events WHERE environment=$1 AND kind='page_view' AND occurred_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY 1)
    SELECT dates.bucket,coalesce(visits,0) AS visits,coalesce(unique_visitors,0) AS unique_visitors,coalesce(pageviews,0) AS pageviews FROM dates LEFT JOIN sessions USING(bucket) LEFT JOIN views USING(bucket) ORDER BY bucket`,bound);
  const projects=await query(`SELECT project_id,count(*) FILTER(WHERE kind='project_view')::int AS views,count(*) FILTER(WHERE kind='project_click')::int AS clicks,count(*) FILTER(WHERE kind='demo_open')::int AS demos FROM portfolio_analytics.events WHERE environment=$1 AND project_id IS NOT NULL AND occurred_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY project_id ORDER BY views DESC,clicks DESC`,bound);
  const resumes=await query(`SELECT resume_id,count(*)::int AS clicks FROM portfolio_analytics.events WHERE environment=$1 AND kind='resume_download' AND occurred_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY resume_id ORDER BY clicks DESC`,bound);
  const sources=await query(`SELECT source,count(*)::int AS visits FROM portfolio_analytics.sessions WHERE environment=$1 AND started_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY source ORDER BY visits DESC`,bound);
  const devices=await query(`SELECT device,count(*)::int AS visits FROM portfolio_analytics.sessions WHERE environment=$1 AND started_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY device ORDER BY visits DESC`,bound);
  const outbound=await query(`SELECT target,count(*)::int AS clicks FROM portfolio_analytics.events WHERE environment=$1 AND kind='outbound_click' AND occurred_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY target ORDER BY clicks DESC`,bound);
  const sections=await query(`SELECT x.section_id,sum(${durationSQL('x.engaged')})::float AS engaged_seconds FROM portfolio_analytics.sections x JOIN portfolio_analytics.sessions s USING(environment,session_id) WHERE x.environment=$1 AND s.started_at>=date_trunc('day',now())-($2::int-1)*interval '1 day' GROUP BY x.section_id ORDER BY engaged_seconds DESC`,bound);
  return {automatic:{total:Number(openTotal?.page_opens||0),page_opens:opens.page_opens,traffic:openTraffic},days,grain,timezone:'UTC',coverage:'Consenting, non-filtered browser traffic only',allTime:total||{pageviews:'0',visits:'0',tracking_started:null},summary:{...summary,...views},traffic,projects,resumes,sources,devices,outbound,sections};
}
export const RETENTION_SQL=`WITH old_opens AS (DELETE FROM portfolio_analytics.page_opens WHERE environment=$1 AND opened_at<now()-interval '365 days'),old_events AS (DELETE FROM portfolio_analytics.events WHERE environment=$1 AND occurred_at<now()-interval '365 days'),old_sessions AS (DELETE FROM portfolio_analytics.sessions WHERE environment=$1 AND last_event_at<now()-interval '365 days') SELECT 'retention complete' AS status`;

// Automatic document opens: no browser/session ID, cookie, IP, UA, path or referral stored.
export const OPEN_SQL=`WITH accepted AS (
 INSERT INTO portfolio_analytics.page_opens(environment,event_id,opened_at) VALUES($1,$2::uuid,now())
 ON CONFLICT(environment,event_id) DO NOTHING RETURNING opened_at
), total AS (
 INSERT INTO portfolio_analytics.open_totals(environment,page_opens,tracking_started)
 SELECT $1,count(*),min(opened_at) FROM accepted HAVING count(*)>0
 ON CONFLICT(environment) DO UPDATE SET page_opens=portfolio_analytics.open_totals.page_opens+excluded.page_opens
) SELECT count(*)::int AS accepted FROM accepted`;
export const OPEN_COUNTER_SQL=`SELECT page_opens::text,tracking_started FROM portfolio_analytics.open_totals WHERE environment=$1`;
