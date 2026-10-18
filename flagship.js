'use strict';
(()=>{
 const tabs=[...document.querySelectorAll('[data-platform]')];
 const panels={overview:'platformOverview',beam:'platformBeam',method:'platformMethod',next:'platformNext'};
 function select(tab){tabs.forEach(button=>{const selected=button===tab;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;document.getElementById(panels[button.dataset.platform]).hidden=!selected});}
 tabs.forEach(tab=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();const index=event.key==='Home'?0:event.key==='End'?tabs.length-1:(tabs.indexOf(tab)+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(tabs[index]);tabs[index].focus()})});
 const images=[{src:'assets/img/pandarithm-home.png',alt:'Pandarithm local home interface and module selection'},{src:'assets/img/pandarithm-beam.png',alt:'Pandarithm local beam input interface and model preview; no calculation results shown'}];
 document.querySelectorAll('[data-platform-image]').forEach(button=>button.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('portfolio-gallery-open',{detail:{images,index:button.dataset.platformImage==='beam'?1:0,title:'Pandarithm · Local interface preview',trigger:button}}))));
})();
