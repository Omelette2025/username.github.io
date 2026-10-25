'use strict';
(()=>{
 const config=window.PortfolioResumes,select=document.getElementById('resumeType');if(!config||!select)return;
 const defaultResume=config.resumes.find(r=>r.id===config.defaultId);if(!defaultResume)return;
 const setLink=(link,resume)=>{link.href=resume.path;link.download=resume.path.split('/').pop();link.setAttribute('aria-label','Download '+resume.name+' resume (PDF)')};
 document.querySelectorAll('[data-resume-default]').forEach(link=>setLink(link,defaultResume));
 select.replaceChildren(...config.resumes.map(resume=>{const option=document.createElement('option');option.value=resume.id;option.textContent=resume.name;return option}));
 select.value=defaultResume.id;
 function update(){const resume=config.resumes.find(r=>r.id===select.value);if(!resume)return;setLink(document.getElementById('selectedResumeDownload'),resume);document.getElementById('resumeDescription').textContent=resume.description;document.getElementById('resumeFormat').textContent=resume.name+' · PDF · 2 pages';const preview=document.getElementById('selectedResumePreview');preview.href=resume.path;preview.setAttribute('aria-label','Open '+resume.name+' resume in a new tab')}
 select.addEventListener('change',update);update();
})();
