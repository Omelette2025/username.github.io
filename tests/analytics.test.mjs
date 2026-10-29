import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,randomBytes,scryptSync} from 'node:crypto';
import {readFile,mkdtemp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {PGlite} from '@electric-sql/pglite';
import {createRequire} from 'node:module';
import {handlers} from '../netlify/analytics/handlers.mjs';
import {INGEST_SQL,report} from '../netlify/analytics/database.mjs';
import {config,admin,ADMIN_COOKIE,newToken,validateBatch} from '../netlify/analytics/core.mjs';
const require=createRequire(import.meta.url),{createClock}=require('../analytics-clock.js');
const origin='https://portfolio.test',salt=randomBytes(16).toString('hex'),password=randomBytes(20).toString('hex');
const env={ANALYTICS_ENABLED:'true',ANALYTICS_ORIGIN:origin,ANALYTICS_ENVIRONMENT:'test',ANALYTICS_SESSION_SECRET:randomBytes(32).toString('hex'),ANALYTICS_ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex')};
function request(path,body,headers={},method=body?'POST':'GET') {return new Request(origin+path,{method,headers:{'User-Agent':'Mozilla/5.0','Origin':origin,'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});}
function batch(events,options={}) {return {consent:true,visitorId:randomUUID(),sessionId:randomUUID(),device:'desktop',referrer:'https://www.google.com/search?q=do-not-store-this',events,...options};}
const event=(kind,extra={})=>({id:randomUUID(),kind,at:Date.now(),...extra});
test('engagement clock stops when hidden/idle, resumes without counting the gap',()=>{
 let time=0,spans=[];const clock=createClock({now:()=>time,emit:x=>spans.push(x),idleMs:3000});
 for(time=1000;time<=4000;time+=1000)clock.tick();assert.equal(spans.reduce((n,s)=>n+s.end-s.start,0),3000);
 clock.visibility(false);time=20000;clock.tick();assert.equal(spans.length,3);clock.visibility(true);clock.activity();time+=1000;clock.tick();assert.equal(spans.at(-1).end-spans.at(-1).start,1000);
 time+=60000;clock.tick();assert.equal(spans.reduce((n,s)=>n+s.end-s.start,0),4000,'timer throttling must not count a 60s gap');
});
test('real PostgreSQL SQL: deduplication, overlapping tabs, aggregates, persistence and authentication',async t=>{
 const base=fileURLToPath(new URL('../.analytics-local/',import.meta.url));
 const directory=await mkdtemp(base+'postgres-test-');let pg=new PGlite(directory);await pg.exec(await readFile(new URL('../netlify/analytics/schema.sql',import.meta.url),'utf8'));
 const query=async(sql,params)=> (await pg.query(sql,params)).rows;let app=handlers({query,env});let page=batch([event('page_view')]);
 await t.test('automatic opens need no consent or browser identifier and retries deduplicate',async()=>{
  const body={id:randomUUID()};const replies=await Promise.all(Array.from({length:20},()=>app.open(request('/api/analytics/open',body))));assert(replies.every(r=>r.status===200));
  const count=await(await app.counter(request('/api/analytics/counter'))).json();assert.equal(count.pageOpens,1);assert.equal(count.label,'Page opens');
  const rows=await query('SELECT * FROM portfolio_analytics.page_opens',[]);assert.deepEqual(Object.keys(rows[0]).sort(),['environment','event_id','opened_at']);
  assert.equal((await app.open(request('/api/analytics/open',{id:randomUUID(),visitorId:randomUUID()}))).status,400);
  assert.equal((await app.open(request('/api/analytics/open',{id:randomUUID()},{Origin:'https://evil.test'}))).status,403);
  assert.equal((await app.open(request('/api/analytics/open',{id:randomUUID()},{DNT:'1'}))).status,204);
  assert.equal((await app.open(request('/api/analytics/open',{id:randomUUID()},{'Sec-GPC':'1'}))).status,204);
  assert.equal((await app.open(request('/api/analytics/open',{id:randomUUID()},{'User-Agent':'HeadlessChrome'}))).status,204);
  assert.equal((await report(query,'test')).automatic.total,1);
 });
 await t.test('atomic retries count one pageview/session',async()=>{
  const results=await Promise.all(Array.from({length:25},()=>app.collect(request('/api/analytics/events',page))));assert(results.every(r=>r.status===200));
  const total=await(await app.counter(request('/api/analytics/counter'))).json();assert.equal(total.visits,1);
  const [count]=await query('SELECT count(*)::int AS n FROM portfolio_analytics.events',[]);assert.equal(count.n,1);
 });
 await t.test('reload pageviews reuse the session; a new session does not create another unique browser',async()=>{
  await app.collect(request('/api/analytics/events',{...page,events:[event('page_view')]}));
  await app.collect(request('/api/analytics/events',{...page,sessionId:randomUUID(),events:[event('page_view')]}));
  const data=await report(query,'test');assert.equal(data.summary.pageviews,3);assert.equal(data.summary.visits,2);assert.equal(data.summary.unique_visitors,1);assert.equal(Number(data.allTime.visits),2);
 });
 await t.test('concurrent overlapping engagement is unioned, not summed',async()=>{
  const end=Date.now(),start=end-10000;
  const records=[event('engagement',{start,end:end-2000,section:'projects'}),event('engagement',{start:start+2000,end,section:'projects'})];
  await Promise.all(records.map(e=>app.collect(request('/api/analytics/events',{...page,events:[e]}))));
  const data=await report(query,'test');assert.equal(Math.round(data.summary.engaged_seconds),10);assert.equal(Math.round(data.sections[0].engaged_seconds),10);assert(data.summary.average_engaged_seconds<=data.summary.average_elapsed_seconds);
  await app.collect(request('/api/analytics/events',{...page,events:records}));assert.equal(Math.round((await report(query,'test')).summary.engaged_seconds),10);
 });
 await t.test('events are categorized and private/raw request fields are not persisted',async()=>{
  const events=[event('project_click',{project:'pandarithm'}),event('project_view',{project:'pandarithm'}),event('resume_download',{resume:'structural'}),event('outbound_click',{target:'github.com'})];
  const r=await app.collect(request('/api/analytics/events',{...page,events},{'X-Forwarded-For':'198.51.100.15','User-Agent':'Test browser model should not persist'}));assert.equal(r.status,200);
  const data=await report(query,'test');assert.equal(data.projects[0].views,1);assert.equal(data.resumes[0].resume_id,'structural');assert.equal(data.sources[0].source,'search');assert.equal(data.outbound[0].target,'github.com');
  const raw=JSON.stringify(await query('SELECT * FROM portfolio_analytics.events',[]));assert(!raw.includes('198.51.100.15'));assert(!raw.includes('do-not-store-this'));assert(!raw.includes(page.visitorId));assert(!raw.includes('Test browser model'));
  for(const grain of ['day','week','month'])assert((await report(query,'test',30,grain)).traffic.length>0);
 });
 await t.test('bad origins, bots, privacy signals, unknown fields and inflated intervals are rejected',async()=>{
  assert.equal((await app.collect(request('/api/analytics/events',page,{Origin:'https://evil.test'}))).status,403);
  assert.equal((await app.collect(request('/api/analytics/events',page,{'User-Agent':'Googlebot'}))).status,204);
  assert.equal((await app.collect(request('/api/analytics/events',page,{'Sec-GPC':'1'}))).status,204);
  assert.equal((await app.collect(request('/api/analytics/events',{...page,email:'never-store@example.test'}))).status,400);
  assert.equal((await app.collect(request('/api/analytics/events',{...page,events:[event('engagement',{start:Date.now()-60000,end:Date.now(),section:'home'})]}))).status,400);
  assert.equal((await app.collect(request('/api/analytics/events',{...page,events:[event('resume_download',{resume:'invented'})]}))).status,400);
  assert.equal((await app.collect(request('/api/analytics/events',{...page,consent:false}))).status,400);
  const publicData=await(await app.counter(request('/api/analytics/counter'))).json();assert(!JSON.stringify(publicData).includes(page.sessionId));assert.deepEqual(Object.keys(publicData).sort(),['available','coverage','label','pageOpens','since','visits']);
 });
 await t.test('dashboard and report are protected server-side, with CSRF and secure cookies',async()=>{
  assert.equal((await app.report(request('/api/analytics/report'))).status,401);
  const login=await app.owner(request('/analytics')),loginCookie=login.headers.get('set-cookie').split(';')[0],body=await login.text(),csrf=body.match(/name="csrf" value="([^"]+)/)[1];
  assert(!body.includes('analyticsSummary'));assert(login.headers.get('content-security-policy').includes("frame-ancestors 'none'"));
  const submit=(token,pw=password)=>new Request(origin+'/analytics/login',{method:'POST',headers:{Origin:origin,Cookie:loginCookie,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrf:token,password:pw})});
  assert.equal((await app.owner(submit('wrong'))).status,403);assert.equal((await app.owner(submit(csrf,'wrong'))).status,401);
  const signed=await app.owner(submit(csrf));assert.equal(signed.status,303);assert(signed.headers.get('set-cookie').includes('Secure; HttpOnly; SameSite=Strict'));
  const value=signed.headers.get('set-cookie').match(new RegExp(ADMIN_COOKIE+'=([^;]+)'))[1],headers={Cookie:ADMIN_COOKIE+'='+value};
  assert.equal((await app.report(request('/api/analytics/report?days=30&grain=week',null,headers))).status,200);
  assert.equal((await app.report(request('/api/analytics/report?days=31',null,headers))).status,400);
  assert.equal((await app.report(request('/api/analytics/report',null,{Cookie:ADMIN_COOKIE+'='+value+'tamper'}))).status,401);
  assert.equal((await handlers({query,env,clock:()=>Date.now()+7200000}).report(request('/api/analytics/report',null,headers))).status,401);
  const owner=await app.owner(request('/analytics',null,headers));assert((await owner.text()).includes('analyticsSummary'));
 });
 await t.test('database restart preserves real counters and reports',async()=>{
  const before=await report(query,'test');await pg.close();pg=new PGlite(directory);app=handlers({query,env});const after=await report(query,'test');assert.deepEqual(after.summary,before.summary);assert.equal(after.allTime.visits,before.allTime.visits);
 });
 await t.test('retention removes old records without losing lifetime anonymous counters',async()=>{
  await query("UPDATE portfolio_analytics.sessions SET started_at=now()-interval '400 days',last_event_at=now()-interval '399 days'",[]);
  await query("UPDATE portfolio_analytics.events SET occurred_at=now()-interval '400 days'",[]);
  assert.equal((await app.retention()).status,200);const [a]=await query('SELECT count(*)::int AS n FROM portfolio_analytics.sessions',[]);assert.equal(a.n,0);const totals=await(await app.counter(request('/api/analytics/counter'))).json();assert.equal(totals.visits,2);
 });
 await pg.close();
});
test('missing configuration fails closed and does not invent a count',async()=>{
 const app=handlers({env:{}});const r=await app.counter(new Request(origin+'/api/analytics/counter'));assert.equal(r.status,503);const payload=await r.json();assert.equal(payload.available,false);assert(!('visits' in payload));assert.equal((await app.owner(new Request(origin+'/analytics'))).status,503);
});
