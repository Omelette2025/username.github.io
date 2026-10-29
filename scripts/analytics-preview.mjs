// Development-only persistent PostgreSQL preview. Never connects to a production DB.
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {randomBytes,scryptSync} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {handlers} from '../netlify/analytics/handlers.mjs';
if(process.env.NETLIFY)throw Error('The local analytics preview must not run on Netlify.');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),port=Number(process.env.PORT||8790),origin=(process.env.ANALYTICS_PREVIEW_TLS_KEY?'https':'http')+'://127.0.0.1:'+port;
const data=path.resolve(process.env.ANALYTICS_PREVIEW_DATA||path.join(root,'../SESSION_ANALYTICS_RESUMES_2026-10-28/preview-postgres'));
if(data.startsWith(root+path.sep))throw Error('Keep development database files outside the published portfolio directory.');
const pg=new PGlite(data);await pg.exec(fs.readFileSync(path.join(root,'netlify/analytics/schema.sql'),'utf8'));
const salt=randomBytes(16).toString('hex'),pw=process.env.ANALYTICS_PREVIEW_PASSWORD;
const env={ANALYTICS_ENABLED:'true',ANALYTICS_ORIGIN:origin,ANALYTICS_ENVIRONMENT:process.env.ANALYTICS_PREVIEW_ENVIRONMENT||'development',ANALYTICS_SESSION_SECRET:randomBytes(32).toString('hex'),ANALYTICS_ADMIN_PASSWORD_HASH:pw?salt+':'+scryptSync(pw,salt,64).toString('hex'):''};
const app=handlers({env,query:async(sql,params)=>(await pg.query(sql,params)).rows});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.mp4':'video/mp4','.webm':'video/webm','.vtt':'text/vtt','.md':'text/plain'};
const serve=async(req,res)=>{
 try {
  const u=new URL(req.url,origin),name=decodeURIComponent(u.pathname),routes={'/api/analytics/open':'open','/api/analytics/events':'collect','/api/analytics/counter':'counter','/api/analytics/report':'report','/analytics':'owner','/analytics/login':'owner','/analytics/logout':'owner'};
  if(routes[name]) {
   const chunks=[];let length=0;for await(const c of req){length+=c.length;if(length>32768){res.writeHead(413);return res.end();}chunks.push(c);}
   const request=new Request(u,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
   const result=await app[routes[name]](request);res.writeHead(result.status,{...Object.fromEntries(result.headers),...(result.headers.getSetCookie().length?{'set-cookie':result.headers.getSetCookie()}:{})});return res.end(Buffer.from(await result.arrayBuffer()));
  }
  if(/^\/(?:netlify|scripts|tests|node_modules|\.analytics-local|\.env|\.git)(?:\/|\.|$)/.test(name)){res.writeHead(404);return res.end('Not found');}
  let file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)&&file!==root)throw Error();if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const stat=fs.statSync(file);if(!stat.isFile())throw Error();
  const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):stat.size-1,stat.size-1);if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':'bytes */'+stat.size});return res.end();}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}
  else {res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);}
 }catch{res.writeHead(404);res.end('Not found');}
};
const server=process.env.ANALYTICS_PREVIEW_TLS_KEY?https.createServer({key:fs.readFileSync(process.env.ANALYTICS_PREVIEW_TLS_KEY),cert:fs.readFileSync(process.env.ANALYTICS_PREVIEW_TLS_CERT)},serve):http.createServer(serve);
server.listen(port,'127.0.0.1',()=>console.log('Development analytics preview: '+origin+' (isolated local data; no production connection)'));
async function stop(){server.close();await pg.close();process.exit(0);}process.on('SIGINT',stop);process.on('SIGTERM',stop);
