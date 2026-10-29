import {config,json,securityHeaders,sameOrigin,isBot,validateBatch,admin,newToken,cookies,cookie,equal,passwordMatches,readSigned,ADMIN_COOKIE,LOGIN_COOKIE} from './core.mjs';
import {database,INGEST_SQL,COUNTER_SQL,report,RETENTION_SQL,OPEN_SQL,OPEN_COUNTER_SQL} from './database.mjs';
const escape = x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const html = (body,status=200,headers={})=>new Response(body,{status,headers:{...securityHeaders,'Content-Type':'text/html; charset=utf-8',...headers}});
const shell = (title,body)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title}</title><link rel="stylesheet" href="/analytics.css"></head><body class="analytics-admin"><main>${body}</main></body></html>`;
function loginPage(csrf,message='') {return shell('Private portfolio analytics',`<a href="/">Back to portfolio</a><h1>Private analytics</h1><p>Owner access only. This page does not start visitor tracking.</p><p role="status">${escape(message)}</p><form method="post" action="/analytics/login"><input type="hidden" name="csrf" value="${escape(csrf)}"><label for="analyticsPassword">Dashboard password</label><input id="analyticsPassword" type="password" name="password" autocomplete="current-password" required maxlength="256"><button type="submit">Sign in</button></form>`);}
function dashboardPage(csrf) {return shell('Portfolio analytics',`<header><div><a href="/">Portfolio</a><h1>Visitor analytics</h1><p>Automatic page opens are counted separately from optional detailed analytics. Unique browsers and engaged time are estimates.</p></div><form method="post" action="/analytics/logout"><input type="hidden" name="csrf" value="${escape(csrf)}"><button type="submit">Sign out</button></form></header><section aria-label="Report controls" class="analytics-controls"><label>Period<select id="analyticsDays"><option value="7">Last 7 days</option><option value="30" selected>Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 365 days</option></select></label><label>Group traffic by<select id="analyticsGrain"><option value="day">Day</option><option value="week">Week</option><option value="month">Month</option></select></label><button id="analyticsRefresh">Refresh report</button></section><p id="analyticsReportStatus" role="status">Loading real recorded data…</p><div id="analyticsSummary" class="analytics-metrics"></div><section><h2>Visitor trends</h2><div id="analyticsTrend" role="img" aria-label="Traffic trend chart"></div><div id="analyticsTraffic"></div></section><div class="analytics-report-grid"><section><h2>Most-viewed projects</h2><div id="analyticsProjects"></div></section><section><h2>Resume download clicks</h2><p>A click is not proof of a completed file save.</p><div id="analyticsResumes"></div></section><section><h2>Referral sources</h2><div id="analyticsSources"></div></section><section><h2>Devices</h2><div id="analyticsDevices"></div></section><section><h2>Engagement by section</h2><div id="analyticsSections"></div></section><section><h2>Outbound domains</h2><div id="analyticsOutbound"></div></section></div><p>UTC reporting dates. Basic document opens use no persistent browser identifier. Detailed tracking is opt-in. Tabs, private browsing, cleared storage, bots and blockers affect estimates. Engaged time counts visible activity within a 30-second idle window; overlapping intervals across tabs are merged. Elapsed duration is the first-to-last recorded event span, not engaged time. Detailed events are retained for 365 days; anonymous lifetime visit/page-view numbers remain.</p><script src="/analytics-dashboard.js" defer></script>`);}
export function handlers({query,env=process.env,clock=()=>Date.now()}={}) {
  const cfg=config(env),db=async()=>query||database(env);
  const unavailable=()=>json({available:false,error:'Analytics is not configured.'},503);
  return {
    async open(req) {
      if(req.method!=='POST')return json({error:'Method not allowed'},405,{'Allow':'POST'});
      if(!cfg.ready)return unavailable();
      if(!sameOrigin(req,cfg))return json({error:'Origin not allowed'},403);
      if(isBot(req)||req.headers.get('sec-gpc')==='1'||req.headers.get('dnt')==='1')return new Response(null,{status:204,headers:securityHeaders});
      if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required'},415);
      let id;
      try {const raw=await req.text();if(raw.length>100)return json({error:'Payload too large'},413);const body=JSON.parse(raw);if(Object.keys(body).length!==1||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.id||''))throw Error();id=body.id;}catch{return json({error:'Invalid document event'},400);}
      try {const rows=await(await db())(OPEN_SQL,[cfg.environment,id]);return json({accepted:rows[0].accepted});}catch{return json({error:'Counter temporarily unavailable'},503);}
    },
    async collect(req) {
      if(req.method!=='POST')return json({error:'Method not allowed'},405,{'Allow':'POST'});
      if(!cfg.ready)return unavailable();
      if(!sameOrigin(req,cfg))return json({error:'Origin not allowed'},403);
      if(isBot(req)||req.headers.get('sec-gpc')==='1'||req.headers.get('dnt')==='1')return new Response(null,{status:204,headers:securityHeaders});
      if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required'},415);
      let rows;
      try {const text=await req.text();if(Buffer.byteLength(text)>32768)return json({error:'Payload too large'},413);rows=validateBatch(JSON.parse(text),req,cfg,clock());}catch{return json({error:'Invalid analytics payload'},400);}
      try {const result=await(await db())(INGEST_SQL,[cfg.environment,JSON.stringify(rows)]);return json({accepted:result[0]?.accepted||0});}catch{return json({error:'Analytics temporarily unavailable'},503);}
    },
    async counter(req) {
      if(req.method!=='GET')return json({error:'Method not allowed'},405,{'Allow':'GET'});
      if(!cfg.ready)return unavailable();
      try {const query=await db();const [totals]=await query(OPEN_COUNTER_SQL,[cfg.environment]);const [sessions]=await query(COUNTER_SQL,[cfg.environment]);return json({available:true,pageOpens:Number(totals?.page_opens||0),visits:Number(sessions?.visits||0),label:'Page opens',coverage:'Automatic document loads; privacy signals and bot filters respected',since:totals?.tracking_started?new Date(totals.tracking_started).toISOString().slice(0,10):null});}catch{return unavailable();}
    },
    async report(req) {
      if(req.method!=='GET')return json({error:'Method not allowed'},405,{'Allow':'GET'});
      if(!cfg.ready||!cfg.passwordHash)return unavailable();
      if(!admin(req,cfg,clock()))return json({error:'Sign-in required'},401);
      const u=new URL(req.url),days=Number(u.searchParams.get('days')||30),grain=u.searchParams.get('grain')||'day';
      if(![7,30,90,365].includes(days)||!['day','week','month'].includes(grain))return json({error:'Invalid report period'},400);
      try {return json(await report(await db(),cfg.environment,days,grain));}catch{return json({error:'Report temporarily unavailable'},503);}
    },
    async owner(req) {
      if(!cfg.ready||!cfg.passwordHash)return html(shell('Analytics not configured','<h1>Analytics not configured</h1><p>Database and owner-access setup must be completed before this dashboard can be used.</p><a href="/">Back to portfolio</a>'),503);
      const session=admin(req,cfg,clock());
      if(req.method==='GET') {
        if(session)return html(dashboardPage(session.csrf));
        const token=newToken('login',cfg,300,clock());return html(loginPage(token.payload.csrf),200,{'Set-Cookie':cookie(LOGIN_COOKIE,token.value,300)});
      }
      if(req.method!=='POST')return json({error:'Method not allowed'},405,{'Allow':'GET, POST'});
      if(!sameOrigin(req,cfg))return json({error:'Origin not allowed'},403);
      const body=await req.text();if(body.length>1024)return json({error:'Payload too large'},413);
      const form=new URLSearchParams(body),path=new URL(req.url).pathname;
      if(path.endsWith('/logout')) {
        if(!session||!equal(form.get('csrf'),session.csrf))return json({error:'Invalid request'},403);
        return new Response(null,{status:303,headers:{...securityHeaders,'Location':'/analytics','Set-Cookie':cookie(ADMIN_COOKIE,'',0)}});
      }
      const token=readSigned(cookies(req)[LOGIN_COOKIE]||'',cfg.secret,clock());
      if(!token||token.type!=='login'||token.environment!==cfg.environment||!equal(form.get('csrf'),token.csrf))return json({error:'Invalid sign-in request'},403);
      if(!await passwordMatches(form.get('password'),cfg.passwordHash)) {
        const next=newToken('login',cfg,300,clock());return html(loginPage(next.payload.csrf,'Sign-in failed.'),401,{'Set-Cookie':cookie(LOGIN_COOKIE,next.value,300)});
      }
      const next=newToken('admin',cfg,3600,clock());
      const headers=new Headers({...securityHeaders,'Location':'/analytics'});headers.append('Set-Cookie',cookie(ADMIN_COOKIE,next.value,3600));headers.append('Set-Cookie',cookie(LOGIN_COOKIE,'',0));return new Response(null,{status:303,headers});
    },
    async retention() {
      if(!cfg.ready)return unavailable();
      try {await(await db())(RETENTION_SQL,[cfg.environment]);return json({retentionDays:365});}catch{return json({error:'Retention failed'},503);}
    }
  };
}
