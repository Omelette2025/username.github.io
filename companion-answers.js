/* Portfolio facts and ordinary-language questions work without an AI service. */
(function(root){
 'use strict';
 const normalize=value=>String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 function create(catalogue){
  let context=null;
  const project=id=>catalogue.projects.find(p=>p.id===id);
  const response=(text,id)=>({text,projectId:id||null});
  const role=entry=>entry?`${entry.title}${entry.company?' at '+entry.company:''} (${entry.date}). ${entry.desc}`:'That role is not recorded in this portfolio.';
  const aliases=[['pandarithm',/\bpandarithm\b/],['mec-html-suite',/\b(mec|helio|expense monitoring|engineering tools suite|pdf extractor|cv extractor|pdf to excel)\b/],['lifeos',/\b(life os|lifeos|second brain|knowledge system|project review|agents)\b/],['cad-to-boq',/\b(cad to boq|estimation tool|estimating tool|estimation automation|quantity extraction)\b/],['legacy-9',/\b(gamified|reviewing tool|review tool|phainon)\b/],['legacy-1',/\b(autocalc|ieei costing)\b/],['legacy-0',/\b(elevator|project lift)\b/],['legacy-2',/\b(project 448|rc building)\b/],['legacy-3',/\b(warehouse|project steel)\b/],['legacy-5',/\b(thesis|seismic|school building)\b/]];
  return {
   answer(input){
    const q=normalize(input);if(!q)return null;
    if((/\b(job|role|work|working|employed|employment|career|experience)\b/.test(q)||/what does (he|ruzzel) do/.test(q))&&!/(how.*(work|working)|workflows?)/.test(q)){
     if(/\b(last|previous|before|prior|former)\b/.test(q)){context=null;return response('Before his current role, he worked as '+role(catalogue.experience[1]));}
     if(/\b(current|currently|now|present|today|job|employed|working)\b/.test(q)||/where.*work|what does (he|ruzzel) do/.test(q)){context=null;return response('His current listed role is '+role(catalogue.experience[0]));}
     if(/\b(career|experience|history)\b/.test(q))return response(catalogue.experience.map(role).join('\n\n'));
    }
    if(/\b(graduate|graduated|graduation|degree|university|college|education|school|studied)\b/.test(q)&&!/thesis|seismic|school building/.test(q)){
     context=null;const degree=catalogue.education.find(e=>/Bachelor/i.test(e.title));
     if(degree){const years=degree.date.match(/\d{4}/g);return response(`He completed ${degree.title} at ${degree.school}${years?.length?' in '+years.at(-1):''}. The listed study period is ${degree.date}.`);}
    }
    if(/\b(best|flagship|main|strongest|favorite|favourite)\b/.test(q)&&/\b(project|tool|work)\b/.test(q)){
     context='pandarithm';return response('Pandarithm is the portfolio’s featured flagship: an engineering analysis and design platform connecting his civil-engineering background with programming. It is a public beta with verification ongoing. MEC is another strong example for workplace cost-control automation; “best” depends on the role you are considering.','pandarithm');
    }
    if(/\b(who is|who s|whos|about|introduce)\b/.test(q)&&/\b(ruzzel|he|him|your creator)\b/.test(q))return response('Ruzzel A. Dulay is a Registered Civil Engineer with experience in structural engineering, cost estimation, cost control and practical automation. His current listed role is '+role(catalogue.experience[0]));
    let id=aliases.find(([,pattern])=>pattern.test(q))?.[0];
    if(!id){const found=catalogue.projects.find(p=>q===normalize(p.title)||q===normalize(p.id));id=found?.id;}
    if(!id&&context&&/\b(it|that|this|more|stack|built|tested|validated|limitations|status|started|history|live|link|demo|video)\b/.test(q))id=context;
    if(id){
     const p=project(id);if(!p)return null;context=id;
     if(/\b(when|start|started|history|evolve|evolved|evolution)\b/.test(q)){
      if(p.evolution)return response(p.evolution.map(s=>`${s.period||'Development stage'}: ${s.title}. ${s.text}`).join('\n\n'),id);
      return response(`${p.title}: ${p.status}. ${p.meta}. An exact start date is not recorded here.`,id);
     }
     if(/\b(video|demo|demonstration)\b/.test(q))return response(`Open ${p.title}’s case study for available media. A Watch Demo action appears only when an actual recording is configured; the current portfolio has no project demo recordings yet.`,id);
     if(/\b(live|launch|url|website|link|try)\b/.test(q))return response(p.live?`You can launch ${p.title} from its case study: ${p.live}`:`No public application link is listed for ${p.title}. Its case study explains the local workflow.`,id);
     const intent=/\b(test|tests|tested|validation|validated|verify|verified)\b/.test(q)?/test|verific/ig:/\b(limit|limits|limitations|complete|finished|safe)\b/.test(q)?/limitation|boundary/ig:/\b(stack|language|languages|technology|technologies|built|architecture)\b/.test(q)?/technolog|architect|implemented workflow foundation/ig:/\b(how|function|features|capabilities|does|more|detail|details)\b/.test(q)?/implemented|workflow|contribution/ig:null;
     if(intent){const sections=(p.sections||[]).filter(s=>{intent.lastIndex=0;return intent.test(s.title)}).slice(0,2);if(sections.length)return response(sections.map(s=>`${s.title}: ${s.text||s.items?.join('; ')}`).join('\n\n'),id);}
     return response(`${p.title}\n${p.summary}\nStatus: ${p.status}. Ask about its features, technology, testing, history or live link.`,id);
    }
    if(/\b(project|projects|portfolio|tools)\b/.test(q))return response('Start with Pandarithm for engineering analysis, CAD-to-BOQ for estimation, MEC Cost Control Suite for workplace automation, Life OS for knowledge and project continuity, or Gamified Reviewing Tool for study workflows. Which would you like to explore?');
    return null;
   }
  };
 }
 const api={create,normalize};root.PortfolioCompanionAnswers=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
