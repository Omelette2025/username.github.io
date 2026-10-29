import {createHmac, timingSafeEqual, randomBytes, scrypt} from 'node:crypto';
import {promisify} from 'node:util';
const derive = promisify(scrypt);
export const KINDS = new Set(['page_view','project_click','project_view','resume_download','outbound_click','engagement','demo_open']);
export const PROJECTS = new Set(['legacy-0','legacy-1','legacy-2','legacy-3','legacy-4','legacy-5','legacy-7','legacy-8','legacy-9','pandarithm','drawing','audit','batch','lifeos','mec-html-suite','cad-to-boq']);
export const RESUMES = new Set(['general','structural','graduate','cost','quantity','automation']);
export const SECTIONS = new Set(['home','resume','pandarithm','featured','about','now','supporting','workflow','projects','experience','education','personal','contact']);
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export const ADMIN_COOKIE = '__Host-portfolio-admin';
export const LOGIN_COOKIE = '__Host-portfolio-login';
export function config(env=process.env) {
  const origin = env.ANALYTICS_ORIGIN;
  const environment = env.ANALYTICS_ENVIRONMENT || (env.CONTEXT === 'deploy-preview' ? 'preview' : 'production');
  return {enabled:env.ANALYTICS_ENABLED==='true', origin, environment,
    secret:env.ANALYTICS_SESSION_SECRET || '', passwordHash:env.ANALYTICS_ADMIN_PASSWORD_HASH || '',
    ready:env.ANALYTICS_ENABLED==='true' && /^https?:\/\//.test(origin||'') && (env.ANALYTICS_SESSION_SECRET||'').length>=32 && /^[a-z-]{1,30}$/.test(environment)};
}
export const securityHeaders = {
  'Cache-Control':'private, no-store', 'Vary':'Cookie', 'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY', 'Referrer-Policy':'same-origin', 'X-Robots-Tag':'noindex, nofollow',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
};
export function json(value,status=200,extra={}) { return new Response(JSON.stringify(value),{status,headers:{...securityHeaders,'Content-Type':'application/json; charset=utf-8',...extra}}); }
export function sameOrigin(req,cfg) {return req.headers.get('origin')===cfg.origin && !['cross-site','same-site'].includes(req.headers.get('sec-fetch-site'));}
export function isBot(req) { return /bot\b|crawler|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit/i.test(req.headers.get('user-agent')||''); }
export const digest = (value,secret)=>createHmac('sha256',secret).update(value).digest('hex');
export function equal(a,b) {const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length && timingSafeEqual(x,y);}
export function sign(payload,secret) {const body=Buffer.from(JSON.stringify(payload)).toString('base64url');return body+'.'+digest(body,secret);}
export function readSigned(value,secret,now=Date.now()) {try {const [body,sig,...rest]=value.split('.');if(rest.length||!equal(sig,digest(body,secret)))return null;const p=JSON.parse(Buffer.from(body,'base64url'));return p.exp>now&&p.iat<=now+5000?p:null;}catch{return null;}}
export function cookies(req) {return Object.fromEntries((req.headers.get('cookie')||'').split(';').map(x=>x.trim().split('=')).filter(x=>x.length===2));}
export const cookie = (name,value,age)=>`${name}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${age}`;
export function admin(req,cfg,now=Date.now()) {const p=readSigned(cookies(req)[ADMIN_COOKIE]||'',cfg.secret,now);return p?.type==='admin'&&p.environment===cfg.environment?p:null;}
export function newToken(type,cfg,seconds,now=Date.now()) {const p={type,environment:cfg.environment,iat:now,exp:now+seconds*1000,csrf:randomBytes(24).toString('hex')};return {payload:p,value:sign(p,cfg.secret)};}
export async function passwordMatches(password,encoded) {
  const [salt,hash]=String(encoded).split(':');
  if(!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(hash||'')||typeof password!=='string'||password.length>256)return false;
  return equal((await derive(password,salt,64)).toString('hex'),hash);
}
export function sourceBucket(value,origin) {
  if(!value)return 'direct';
  try {const h=new URL(value).hostname.toLowerCase();if(h===new URL(origin).hostname)return 'internal';
    if(/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.[a-z.]+|baidu\.com)$/.test(h))return 'search';
    if(/(^|\.)(linkedin\.com|facebook\.com|instagram\.com|twitter\.com|x\.com|reddit\.com|t\.co)$/.test(h))return 'social';
    // Only a public hostname; never preserve referral paths, queries or fragments.
    return /^[a-z0-9.-]{1,150}$/.test(h)&&!/^\d+(\.\d+){3}$/.test(h)?h:'referral';
  }catch{return 'direct';}
}
export function validateBatch(body,req,cfg,now=Date.now()) {
  if(!body||Object.keys(body).some(k=>!['visitorId','sessionId','device','referrer','events','consent'].includes(k)))throw Error('Invalid payload');
  if(body.consent!==true||!UUID.test(body.visitorId||'')||!UUID.test(body.sessionId||'')||!Array.isArray(body.events)||!body.events.length||body.events.length>32)throw Error('Invalid batch');
  if(!['desktop','tablet','mobile'].includes(body.device)||typeof body.referrer!=='string'||body.referrer.length>300)throw Error('Invalid dimensions');
  const visitor_key=digest('visitor:'+body.visitorId,cfg.secret),source=sourceBucket(body.referrer,cfg.origin);
  return body.events.map(e=>{
    if(!e||Object.keys(e).some(k=>!['id','kind','at','project','resume','target','section','start','end'].includes(k))||!UUID.test(e.id||'')||!KINDS.has(e.kind))throw Error('Invalid event');
    if(!Number.isFinite(e.at)||e.at>now+5000||e.at<now-86400000)throw Error('Event outside retry window');
    if(e.project!==undefined&&!PROJECTS.has(e.project))throw Error('Unknown project');
    if(e.resume!==undefined&&!RESUMES.has(e.resume))throw Error('Unknown resume');
    if(e.section!==undefined&&!SECTIONS.has(e.section))throw Error('Unknown section');
    if(e.target!==undefined&&(!/^[a-z0-9.-]{1,150}$/.test(e.target)||!e.target.includes('.')||/^\d+(\.\d+){3}$/.test(e.target)))throw Error('Invalid outbound domain');
    if(['project_click','project_view','demo_open'].includes(e.kind)&&!e.project)throw Error('Project required');
    if(e.kind==='resume_download'&&!e.resume)throw Error('Resume required');
    if(e.kind==='outbound_click'&&!e.target)throw Error('Domain required');
    let start_at=null,end_at=null;
    if(e.kind==='engagement') {
      if(!e.section||!Number.isFinite(e.start)||!Number.isFinite(e.end)||e.end<=e.start||e.end-e.start>15000||e.start<now-600000||e.end>now+5000)throw Error('Invalid engagement interval');
      start_at=new Date(e.start).toISOString();end_at=new Date(Math.min(e.end,now)).toISOString();
      if(end_at<=start_at)throw Error('Empty engagement interval');
    } else if(e.start!==undefined||e.end!==undefined)throw Error('Unexpected interval');
    return {event_id:e.id,session_id:body.sessionId,visitor_key,kind:e.kind,occurred_at:new Date(Math.min(e.at,now)).toISOString(),project_id:e.project||null,resume_id:e.resume||null,target:e.target||null,section_id:e.section||null,start_at,end_at,device:body.device,source};
  });
}
