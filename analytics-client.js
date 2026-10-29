'use strict';
(()=>{
  if(window.__portfolioAnalytics)return;window.__portfolioAnalytics={initialized:true};
  const KEY='portfolio-analytics-consent-v1',VISITOR='portfolio-analytics-browser-v1',SESSION='portfolio-analytics-session-v1',QUEUE='portfolio-analytics-retry-v1';
  const storage=name=>{try{return window[name];}catch{return null;}},local=storage('localStorage'),tab=storage('sessionStorage');
  const DAY=86400000,now=()=>Date.now(),uuid=()=>crypto.randomUUID(),validId=value=>typeof value==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
  const signal=()=>navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1';
  const read=(store,key)=>{try{return JSON.parse(store.getItem(key));}catch{return null;}},write=(store,key,value)=>{try{store.setItem(key,JSON.stringify(value));}catch{}},remove=(store,key)=>{try{store.removeItem(key);}catch{}};
  const consent=()=>{const c=read(local,KEY);return c?.version===1&&c.expires>now()?c.allowed:null;};
  let enabled=false,visitor=null,session=null,queue=[],openInterval=null,sending=false,controller=null,clock=null,lastSharedWrite=0,viewRecorded=false;
  const device=()=>matchMedia('(max-width: 600px)').matches?'mobile':matchMedia('(max-width: 1024px)').matches?'tablet':'desktop';
  const referrer=(()=>{try{return document.referrer?new URL(document.referrer).origin:'';}catch{return '';}})();
  const saveQueue=()=>write(tab,QUEUE,queue.slice(-100));
  function sessionForActivity() {
    const stored=read(local,SESSION)||session,t=now();
    if(validId(stored?.id)&&Number.isFinite(stored.active)&&t-stored.active<1800000&&t>=stored.active-5000)session=stored;else session={id:uuid(),active:t};
    session.active=t;write(local,SESSION,session);return session.id;
  }
  function currentSection() {
    let id='home',best=0;
    document.querySelectorAll('main section[id]').forEach(node=>{const r=node.getBoundingClientRect(),visible=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));if(visible>best){best=visible;id=node.id;}});
    return ['home','resume','pandarithm','featured','about','now','supporting','workflow','projects','experience','education','personal','contact'].includes(id)?id:'home';
  }
  function push(event,sid=session?.id) {if(!enabled||!sid)return;queue.push({sid,event});queue=queue.slice(-100);saveQueue();}
  function seal() {if(!openInterval)return;const span=openInterval;openInterval=null;push({id:uuid(),kind:'engagement',at:span.end,start:span.start,end:span.end,section:span.section},span.sid);}
  function emit(span) {
    if(!enabled||!session)return;
    if(openInterval&&(openInterval.sid!==session.id||openInterval.section!==span.section||span.start>openInterval.end+1||span.end-openInterval.start>10000))seal();
    if(openInterval)openInterval.end=span.end;else openInterval={...span,sid:session.id};
  }
  function event(kind,fields={}) {if(!enabled)return;seal();push({id:uuid(),kind,at:now(),...fields});}
  function payload(items) {return {consent:true,visitorId:visitor.id,sessionId:items[0].sid,device:device(),referrer,events:items.map(x=>x.event)};}
  async function flush(beacon=false) {
    if(!enabled)return;seal();if(sending||!queue.length)return;
    const first=queue[0].sid,items=queue.filter(x=>x.sid===first).slice(0,32),body=JSON.stringify(payload(items));
    if(beacon&&navigator.sendBeacon){navigator.sendBeacon('/api/analytics/events',new Blob([body],{type:'application/json'}));return;}
    sending=true;controller=new AbortController();
    try {const r=await fetch('/api/analytics/events',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true,credentials:'omit',signal:controller.signal});
      if(r.ok||[400,403,413,415].includes(r.status)){const ids=new Set(items.map(x=>x.event.id));queue=queue.filter(x=>!ids.has(x.event.id));saveQueue();}
    }catch{}finally{controller=null;sending=false;}
  }
  function start() {
    if(enabled||signal()||!window.PortfolioAnalyticsClock||!window.crypto?.randomUUID)return;
    visitor=read(local,VISITOR);
    if(!validId(visitor?.id)||!Number.isFinite(visitor.expires)||visitor.expires<=now()){visitor={id:uuid(),expires:now()+30*DAY};write(local,VISITOR,visitor);remove(local,SESSION);session=null;}
    sessionForActivity();const savedQueue=read(tab,QUEUE);queue=(Array.isArray(savedQueue)?savedQueue:[]).filter(x=>x?.event?.at>now()-600000&&x.event.at<=now()+5000).slice(-100);enabled=true;
    clock=PortfolioAnalyticsClock.createClock({now,emit,section:currentSection,visible:document.visibilityState==='visible'&&document.hasFocus()});
    if(!viewRecorded){event('page_view');viewRecorded=true;}flush();
  }
  function stop() {enabled=false;controller?.abort();queue=[];openInterval=null;clock=null;[VISITOR,SESSION].forEach(key=>remove(local,key));remove(tab,QUEUE);visitor=null;session=null;}
  function updateUI() {
    const status=document.getElementById('analyticsConsentStatus');
    if(status)status.textContent=signal()?'Your browser privacy signal disables analytics.':enabled?'Optional analytics are enabled. You can withdraw at any time.':consent()===false?'Optional analytics are off.':'Optional analytics are off until you choose Allow.';
    document.querySelectorAll('[data-analytics-allow]').forEach(b=>{b.disabled=signal();});
  }
  function choose(allowed) {write(local,KEY,{version:1,allowed,expires:now()+365*DAY});if(allowed&&!signal())start();else stop();updateUI();const dialog=document.getElementById('analyticsPreferences');if(dialog?.open)dialog.close();}
  async function counter() {
    const output=document.getElementById('visitorCounter'),note=document.getElementById('visitorCounterScope');if(!output)return;
    try {const r=await fetch('/api/analytics/counter',{cache:'no-store',credentials:'omit'});if(!r.ok)throw Error();const data=await r.json();if(!data.available||!Number.isSafeInteger(data.pageOpens)||data.pageOpens<0)throw Error();output.textContent=data.pageOpens.toLocaleString()+' page '+(data.pageOpens===1?'open':'opens');note.textContent=data.since?'Automatic page opens · since '+new Date(data.since).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'Automatic counter · no page opens recorded yet';}
    catch{output.textContent='Visitor count unavailable';note.textContent='No estimated or placeholder count is shown.';}
  }
  async function recordOpen() {
    if(signal()||!window.crypto?.randomUUID)return counter();
    const id=crypto.randomUUID(); // One transient document event, never persisted in browser storage.
    for(let attempt=0;attempt<3;attempt++) {
      if(signal())break;
      try {const result=await fetch('/api/analytics/open',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({id}),keepalive:true});if(result.ok||result.status<500)break;}catch{}
      if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));
    }
    return counter();
  }
  let lastProjectView={id:null,time:0};
  document.addEventListener('click',e=>{
    const allow=e.target.closest('[data-analytics-allow]'),decline=e.target.closest('[data-analytics-decline]');
    if(allow||decline){choose(Boolean(allow));return;}
    if(e.target.closest('[data-analytics-preferences]')){document.getElementById('analyticsPreferences').showModal();updateUI();return;}
    if(e.target.closest('[data-analytics-close]')){document.getElementById('analyticsPreferences').close();return;}
    if(!enabled||!e.isTrusted)return;
    const project=e.target.closest('[data-open]'),demo=e.target.closest('[data-watch]'),a=e.target.closest('a[href]');
    if(project)event('project_click',{project:project.dataset.open});if(demo)event('demo_open',{project:demo.dataset.watch});
    if(a) {
      let u;try{u=new URL(a.href,location.href);}catch{return;}
      const resume=window.PortfolioResumes?.resumes.find(r=>new URL(r.path,location.href).pathname===u.pathname);
      if(resume&&a.hasAttribute('download'))event('resume_download',{resume:resume.id});
      else if(/^https?:$/.test(u.protocol)&&u.origin!==location.origin)event('outbound_click',{target:u.hostname.toLowerCase()});
    }
  },{capture:true});
  window.addEventListener('portfolio-project-open',e=>{const id=e.detail?.id;if(id&&(id!==lastProjectView.id||now()-lastProjectView.time>500)){event('project_view',{project:id});lastProjectView={id,time:now()};}});
  const activity=()=>{if(!enabled)return;clock.activity();if(now()-lastSharedWrite>1000){sessionForActivity();lastSharedWrite=now();}};
  ['pointerdown','keydown','scroll','touchstart'].forEach(type=>document.addEventListener(type,activity,{passive:true,capture:true}));
  const visibility=()=>{if(!enabled)return;clock.visibility(document.visibilityState==='visible'&&document.hasFocus());seal();flush(document.visibilityState==='hidden');};
  document.addEventListener('visibilitychange',visibility);window.addEventListener('focus',visibility);window.addEventListener('blur',visibility);
  window.addEventListener('pagehide',()=>{clock?.visibility(false);flush(true);});window.addEventListener('pageshow',e=>{if(e.persisted){clock?.reset();visibility();}});
  window.addEventListener('online',()=>flush());window.addEventListener('storage',e=>{if(e.key===KEY){if(consent()===true&&!signal())start();else stop();updateUI();}});
  setInterval(()=>{if(enabled){if(signal()){stop();updateUI();}else if(visitor.expires<=now()){stop();if(consent()===true)start();updateUI();}else clock.tick();}},1000);setInterval(()=>flush(),10000);
  if(signal())stop();else if(consent()===true)start();updateUI();recordOpen();
})();
