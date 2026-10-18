/* Nova / WebScale carousel adaptation with continuous, pausable project movement. */
'use strict';
(()=>{
 const root=document.querySelector('[data-carousel]'),track=root?.querySelector('[data-carousel-slider]');if(!track)return;
 const cards=[...track.querySelectorAll('.featured-card')],status=document.getElementById('carouselStatus'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.createElement('button');toggle.type='button';toggle.className='carousel-play';toggle.setAttribute('aria-controls',track.id);root.querySelector('.carousel-controls').insertBefore(toggle,status);
 cards.forEach((card,i)=>{card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',`${i+1} of ${cards.length}`);const copy=card.cloneNode(true);copy.dataset.carouselClone='';copy.setAttribute('aria-hidden','true');copy.removeAttribute('role');copy.removeAttribute('aria-roledescription');copy.removeAttribute('aria-label');copy.removeAttribute('data-id');copy.setAttribute('data-motion-visible','');copy.querySelectorAll('button,a,input,[tabindex]').forEach(e=>e.tabIndex=-1);copy.querySelectorAll('[data-open]').forEach(e=>e.addEventListener('click',()=>card.querySelector('[data-open]').click()));track.append(copy)});
 function manualOnly(){return matchMedia('(max-width:600px)').matches||matchMedia('(hover:none)').matches}
 function motionReduced(){return reduce.matches||document.documentElement.hasAttribute('data-motion-disabled')}
 let paused=false,hover=false,focused=false,visible=false,dialogOpen=false,frame=0,last=0,resumeAt=0,displayFrame=0,carry=0;
 const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
 const cycle=()=>step()*cards.length;
 function label(){toggle.textContent=paused?'Play movement':'Pause movement';toggle.setAttribute('aria-pressed',String(!paused));toggle.disabled=motionReduced();if(motionReduced())toggle.textContent='Motion reduced'}
 function allowed(){return !manualOnly()&&!paused&&!hover&&!focused&&visible&&!document.hidden&&!dialogOpen&&!motionReduced()&&document.body.dataset.switching!=='true'}
 function updateStatus(){cancelAnimationFrame(displayFrame);displayFrame=requestAnimationFrame(()=>{const i=Math.min(cards.length-1,Math.floor((track.scrollLeft%cycle()+2)/step()));status.textContent=String(i+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0')})}
 function tick(now){frame=0;if(!allowed()){last=0;root.dataset.carouselRunning='false';status.setAttribute('aria-live','polite');return}root.dataset.carouselRunning='true';status.setAttribute('aria-live','off');if(last&&now>=resumeAt){carry+=Math.min(now-last,50)*.038;const advance=Math.floor(carry);carry-=advance;let x=track.scrollLeft+advance;if(x>=cycle())x-=cycle();track.scrollLeft=x}last=now;frame=requestAnimationFrame(tick)}
 function sync(){label();if(allowed()&&!frame){last=0;frame=requestAnimationFrame(tick)}else if(!allowed()){cancelAnimationFrame(frame);frame=0;last=0;root.dataset.carouselRunning='false'}}
 function go(direction){resumeAt=performance.now()+6500;let limit=(motionReduced()||manualOnly())?track.scrollWidth-track.clientWidth:cycle()-step();let next=track.scrollLeft%cycle()+direction*step();if(direction>0&&next>limit+3)next=0;if(direction<0&&next<0)next=limit;track.scrollTo({left:Math.max(0,Math.min(limit,next)),behavior:motionReduced()?'instant':'smooth'})}
 root.querySelector('[data-carousel-prev]').addEventListener('click',()=>go(-1));root.querySelector('[data-carousel-next]').addEventListener('click',()=>go(1));toggle.addEventListener('click',()=>{paused=!paused;sync()});
 root.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync()}});root.addEventListener('pointerleave',()=>{hover=false;sync()});root.addEventListener('focusin',()=>{focused=true;sync()});root.addEventListener('focusout',()=>{queueMicrotask(()=>{focused=root.contains(document.activeElement);sync()})});
 track.addEventListener('pointerdown',()=>{resumeAt=performance.now()+8000});track.addEventListener('wheel',()=>{resumeAt=performance.now()+8000},{passive:true});
 track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowRight'?1:-1)}else if(e.key==='Home'||e.key==='End'){e.preventDefault();track.scrollTo({left:e.key==='Home'?0:(motionReduced()?track.scrollWidth-track.clientWidth:cycle()-step()),behavior:motionReduced()?'instant':'smooth'})}});
 track.addEventListener('scroll',updateStatus,{passive:true});new ResizeObserver(()=>{updateStatus();sync()}).observe(track);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.1}).observe(track);
 document.addEventListener('visibilitychange',sync);function refreshMotion(){track.querySelectorAll('[data-carousel-clone]').forEach(e=>e.hidden=motionReduced());track.scrollLeft=track.scrollLeft%cycle();sync()}reduce.addEventListener('change',refreshMotion);window.addEventListener('portfolio-motion-change',refreshMotion);
 const modalState=()=>{dialogOpen=!!document.querySelector('dialog[open]');sync()};document.querySelectorAll('dialog').forEach(d=>new MutationObserver(modalState).observe(d,{attributes:true,attributeFilter:['open']}));new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-switching']});
 track.querySelectorAll('[data-carousel-clone]').forEach(e=>e.hidden=motionReduced());label();updateStatus();
})();
