'use strict';
(() => {
 const catalogue=JSON.parse(document.getElementById('portfolioData').textContent);
 const esc=value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function history(project,compact=false){
  if(!project.evolution)return '';
  const stages=project.evolution;
  return `<section class="project-evolution${compact?' evolution-overview':''}" aria-label="${esc(project.title)} development history"><p class="eyebrow">One project, evolving scope</p><h3>${esc(project.title)}</h3><p class="evolution-note">${esc(project.evolutionNote)}</p><ol class="evolution-track">${stages.map((stage,i)=>`<li class="evolution-stage${i===stages.length-1?' evolution-current':''}"><span class="evolution-marker" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><span class="evolution-era">${i===stages.length-1?'Current project':'Earlier stage'}</span><span class="evolution-period">${esc(stage.period)}</span><h4>${esc(stage.title)}</h4><p>${esc(stage.text)}</p>${stage.includes?`<div class="evolution-inputs"><span>Joined in this suite</span><ul>${stage.includes.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}</div></li>`).join('')}</ol></section>`;
 }
 const container=document.getElementById('projectEvolution');
 if(container){container.innerHTML=`<div class="evolution-heading"><p class="eyebrow">Project lineage</p><h3>Built in stages.<br>Connected by the work.</h3><p>Earlier tools became parts of broader systems. These are development paths, rather than separate current projects.</p></div><div class="evolution-columns">${['mec-html-suite','lifeos'].map(id=>history(catalogue.projects.find(p=>p.id===id),true)).join('')}</div>`}
 window.addEventListener('portfolio-project-open',event=>{
  const project=catalogue.projects.find(p=>p.id===event.detail.id);
  if(!project?.evolution)return;
  const gallery=document.querySelector('#dialogContent .case-gallery');
  if(gallery)gallery.insertAdjacentHTML('afterend',history(project));
 });
})();
