/* First-party visit count and elapsed document time. No cookies or persistent visitor IDs. */
'use strict';
(()=>{
 if(window.__portfolioAnalytics)return;window.__portfolioAnalytics={initialized:true};
 for(const [store,keys] of [['localStorage',['portfolio-analytics-consent-v1','portfolio-analytics-browser-v1','portfolio-analytics-session-v1']],['sessionStorage',['portfolio-analytics-retry-v1']]])try{keys.forEach(key=>window[store].removeItem(key));}catch{}
 const outputs=[...document.querySelectorAll('[data-visit-count]')];if(!outputs.length)return;
 const id=window.crypto?.randomUUID?.();let started=performance.now(),pending=false,registered=false;
 async function count(){try{const r=await fetch('/api/analytics/counter',{cache:'no-store',credentials:'omit'});if(!r.ok)return;const d=await r.json();if(!d.available||!Number.isSafeInteger(d.pageOpens)||d.pageOpens<0)return;outputs.forEach(el=>{el.textContent=d.pageOpens.toLocaleString()+' '+(d.pageOpens===1?'visit':'visits');el.closest('.visit-counter').title='Recorded page visits. Repeat page openings count separately.';});}catch{}}
 async function send(final=false){if(!id||(!final&&pending))return;pending=true;try{const r=await fetch('/api/analytics/open',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,seconds:Math.min(604800,Math.max(0,Math.floor((performance.now()-started)/1000)))}),keepalive:final});if(r.ok&&!registered){registered=true;await count();}}catch{}finally{pending=false;}}
 count();send();setInterval(()=>send(),15000);window.addEventListener('online',()=>{send();count();});window.addEventListener('pagehide',()=>send(true));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')send(true);else send();});window.addEventListener('pageshow',e=>{if(e.persisted)send();});
})();
