'use strict';
(() => {
  const data = JSON.parse(document.getElementById('portfolioData').textContent);
  const body = document.body;
  const projects = new Map(data.projects.map(p => [p.id, p]));
  const sweep = document.getElementById('portfolioSweep');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const effectsSelect = document.getElementById('effectsSelect');
  let animation = null, generation = 0, activeFilter = 'all';
  const store = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const load = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Only this rectangle animates. No circles, masks, canvas, blur or background loops.
  function transition(change) {
    const token = ++generation;
    if (animation) animation.cancel();
    const start = performance.now();
    body.dataset.switching = 'true';
    if (reduceMotion.matches || document.documentElement.hasAttribute('data-motion-disabled') || !sweep.animate) {
      change(); sweep.hidden = true; body.dataset.switching = 'false';
      window.dispatchEvent(new CustomEvent('portfolio-theme-ready', {detail:{duration:performance.now()-start}}));
      return;
    }
    sweep.hidden = false;
    animation = sweep.animate([{transform:'translateX(-100%)'}, {transform:'translateX(0)'}], {duration:150, easing:'cubic-bezier(.3,0,.7,1)', fill:'forwards'});
    animation.finished.then(() => {
      if (token !== generation) return;
      change();
      animation = sweep.animate([{transform:'translateX(0)'}, {transform:'translateX(100%)'}], {duration:190, easing:'cubic-bezier(.3,0,.7,1)', fill:'forwards'});
      return animation.finished;
    }).then(() => {
      if (token !== generation) return;
      sweep.hidden = true; animation.cancel(); animation = null;
      body.dataset.switching = 'false';
      window.dispatchEvent(new CustomEvent('portfolio-theme-ready', {detail:{duration:performance.now()-start}}));
    }).catch(() => {});
  }
  function setMode(mode) {
    body.dataset.mode = mode;
    document.getElementById('navProfessional').setAttribute('aria-pressed', String(mode === 'professional'));
    document.getElementById('navPersonalized').setAttribute('aria-pressed', String(mode === 'personalized'));
    document.getElementById('personal').hidden = mode === 'professional';
    document.querySelector('.personal-copy').hidden = mode === 'professional';
    document.getElementById('heroCopy').textContent = mode === 'professional'
      ? 'Registered Civil Engineer with experience in structural modeling and analysis, construction cost management and estimation. I also develop engineering software and automation workflows, with verification and review appropriate to each project.'
      : 'Civil engineer first. I connect structural understanding, cost awareness and practical automation, and keep the assumptions and review limits visible.';
    document.querySelector('.hero .availability-note').lastChild.textContent = mode==='personalized'?'Structures, costs & useful tools':'Structures · Cost · Automation';
    setTheme(body.dataset.template);store('portfolio-mode', mode);
  }
  function setTheme(theme) {
    const next = ['all','coding','costing'].includes(theme) ? theme : 'all';
    body.dataset.template = next; document.querySelector('.hero-role').textContent=body.dataset.mode==='personalized'?({all:'CIVIL ENGINEERING · BUILT ON REAL WORK',coding:'CIVIL ENGINEER · ENGINEERING THROUGH TECHNOLOGY',costing:'CIVIL ENGINEER · COST & PROJECT VISIBILITY'}[next]):'REGISTERED CIVIL ENGINEER';store('portfolio-theme', next);
  }
  document.getElementById('navProfessional').addEventListener('click', () => transition(() => setMode('professional')));
  document.getElementById('navPersonalized').addEventListener('click', () => transition(() => setMode('personalized')));
  effectsSelect.addEventListener('change', () => {body.dataset.effects = effectsSelect.value; store('portfolio-effects',effectsSelect.value);});
  setTheme(load('portfolio-theme'));
  setMode(load('portfolio-mode') === 'personalized' ? 'personalized' : 'professional');
  body.dataset.effects = load('portfolio-effects') === 'gentle' ? 'gentle' : 'quiet';
  effectsSelect.value = body.dataset.effects;
  const categoryPriority={structural:['pandarithm','legacy-2','legacy-3','legacy-4','legacy-5','drawing','audit'],costing:['cad-to-boq','mec-html-suite','legacy-1','legacy-7','legacy-8'],automation:['mec-html-suite','pandarithm','cad-to-boq','lifeos','legacy-0','legacy-1','audit','batch','legacy-9']};
  const archiveCards=[...document.querySelectorAll('#projectGrid .project-card')];
  function filterProjects() {
    const query = document.getElementById('projectSearch').value.trim().toLowerCase();
    const ranked=categoryPriority[activeFilter]||[];const ordered=activeFilter==='all'?archiveCards:[...archiveCards].sort((a,b)=>{const ai=ranked.indexOf(a.dataset.id),bi=ranked.indexOf(b.dataset.id);return (ai<0?999:ai)-(bi<0?999:bi)});document.getElementById('projectGrid').append(...ordered);
    let count = 0;
    document.querySelectorAll('#projectGrid .project-card').forEach(card => {
      const matches = (activeFilter === 'all' || (card.dataset.categories || card.dataset.cat).split(' ').includes(activeFilter)) && card.dataset.search.includes(query);
      card.hidden = !matches; if (matches) count++;
    });
    document.getElementById('resultCount').textContent = `Showing ${count} of ${data.projects.length} projects`;
    document.getElementById('noResults').hidden = count !== 0;
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
  }
  // Choosing a discipline is the action that opens its personalized world.
  const categoryThemes={all:'all',structural:'all',costing:'costing',automation:'coding',python:'coding',knowledge:'coding'};
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const chosen=button.dataset.filter;
    const apply=()=>{activeFilter=chosen;filterProjects();if(body.dataset.mode==='personalized')setTheme(categoryThemes[chosen]);};
    if(body.dataset.mode==='personalized' && (body.dataset.template!==categoryThemes[chosen] || body.dataset.switching==='true'))transition(apply);else apply();
  }));
  document.getElementById('projectSearch').addEventListener('input',filterProjects);
  filterProjects();
  const dialog = document.getElementById('projectDialog');
  let openedProject;
  function paragraphSections(p) {
    if(p.sections) return p.sections.map(section=>`<h3>${esc(section.title)}</h3>${section.text?`<p>${esc(section.text)}</p>`:""}${section.items?`<ol>${section.items.map(item=>`<li>${esc(item)}</li>`).join("")}</ol>`:""}`).join("");
    if(p.problem) return `<h3>Problem</h3><p>${esc(p.problem)}</p><h3>Contribution</h3><p>${esc(p.contribution)}</p><h3>Workflow</h3><p>${esc(p.body)}</p>`;
    const text = p.body;
    const parts = text.split(/\b(Context|Role|Process|Results)\b(?=\s)/).filter(Boolean);
    if(parts.length > 2) {
      let result='';
      for(let i=0;i<parts.length;i++) {
        if(['Context','Role','Process','Results'].includes(parts[i])) result += `<h3>${esc(parts[i])}</h3>`;
        else result += `<p>${esc(parts[i].trim())}</p>`;
      }
      return result;
    }
    return `<h3>Workflow</h3><p>${esc(text)}</p>`;
  }
  function openProject(id) {
    id=data.projectAliases?.[id]||id; const p=projects.get(id); if(!p)return; openedProject=p;
    const gallery=p.images.length ? `<div class="case-gallery">${p.images.map(image=>`<div><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"><p class="image-caption">${esc(image.caption||image.alt)}</p><a href="${esc(image.src)}" target="_blank" rel="noopener noreferrer">Open image</a></div>`).join('')}</div>` : p.mediaKind==="progress" ? `<div class="case-progress"><img src="assets/img/panda-progress.svg" alt="Panda-themed work in progress illustration" width="640" height="400"><p>${esc(p.mediaNote)}</p></div>` : `<div class="case-media-notice">${p.mediaNotice==="Confidential"?`<img class="panda-confidential" src="assets/img/panda-confidential.svg" alt="Headphone panda holding a closed lock" width="480" height="300">`:""}<strong>${esc(p.mediaNotice||"Preview unavailable")}</strong><p>${esc(p.mediaNote||"No public screenshot is available yet.")}</p></div>`;
    const factLabels={objective:'Engineering objective',role:'My role',tools:'Tools & methods',deliverables:'Deliverables',verification:'Verification status'};
    const factSheet=p.recruitment?`<dl class="case-facts">${Object.entries(factLabels).map(([key,label])=>`<div><dt>${esc(label)}</dt><dd>${esc(p.recruitment[key])}</dd></div>`).join('')}</dl>`:'';
    document.getElementById('dialogContent').innerHTML = `<p class="eyebrow">${esc(data.categories[p.cat])}</p><h2 id="dialogTitle">${esc(p.title)}</h2><p class="dialog-meta">${esc(p.meta)} · ${esc(p.status)}</p><p>${esc(p.summary)}</p>${factSheet}${gallery}${paragraphSections(p)}${p.contributions.length?`<h3>Key contributions</h3><ul>${p.contributions.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${p.scope?`<p class="case-scope">${esc(p.scope)}</p>`:''}<div class="brief-actions">${p.live?`<a class="button" href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">${esc(p.liveLabel||"Launch application")} <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3h7v7M21 3l-10 10"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></svg></a>`:""}<button class="button primary" id="downloadBrief">Download project brief</button><a href="#contact" id="discussProject">Discuss this work</a></div>`;
    document.getElementById('downloadBrief').addEventListener('click',()=>downloadBrief(p));
    document.getElementById('discussProject').addEventListener('click',()=>dialog.close());
    dialog.showModal();dialog.scrollTop=0;window.dispatchEvent(new CustomEvent("portfolio-project-open",{detail:{id}}));
  }
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.open)));
  document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
  function downloadBrief(p) {
    const sectionText=p.sections?p.sections.map(section=>"## "+section.title+"\n"+(section.text||section.items.map((item,i)=>(i+1)+". "+item).join("\n"))).join("\n\n"):null;
    const recruitmentText=p.recruitment?Object.entries(p.recruitment).map(([key,value])=>'## '+key+'\n'+value).join('\n\n')+'\n\n':'';
    const content = `# ${p.title}\n\n${p.meta} · ${p.status}\n\n${p.summary}\n\n${recruitmentText}${sectionText?sectionText+"\n\n":p.problem?`## Problem\n${p.problem}\n\n## Contribution\n${p.contribution}\n\n`:''}${sectionText?"":"## Workflow\n"+p.body}\n\n${p.contributions.length?'## Key contributions\n'+p.contributions.map(x=>'- '+x).join('\n')+'\n\n':''}${p.scope?'## Scope\n'+p.scope+'\n\n':''}Portfolio updated ${data.updated}.\nContact: dulayruzzel13@gmail.com\n`;
    const blob=new Blob([content],{type:'text/markdown;charset=utf-8'}), url=URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;link.download=p.id+'-project-brief.md';link.click();URL.revokeObjectURL(url);
  }

})();
