(function(root){
  'use strict';
  function createClock({now=()=>Date.now(),emit,section=()=> 'home',idleMs=30000,visible=true}) {
    let lastTick=now(),lastActivity=lastTick,shown=visible;
    function tick() {
      const end=now(),start=Math.max(lastTick,end-2000),activeEnd=Math.min(end,lastActivity+idleMs);
      if(shown&&activeEnd>start)emit({start,end:activeEnd,section:section()});
      lastTick=end;
    }
    return {tick,activity(){tick();lastActivity=now();},visibility(value){tick();shown=value;lastTick=now();},reset(){lastTick=now();lastActivity=lastTick;}};
  }
  root.PortfolioAnalyticsClock={createClock};
  if(typeof module==='object'&&module.exports)module.exports={createClock};
})(typeof window==='object'?window:globalThis);
