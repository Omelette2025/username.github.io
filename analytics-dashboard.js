'use strict';
(()=>{
  let pending=false;
  const $=id=>document.getElementById(id),format=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:1});
  function table(id,rows,columns) {
    const root=$(id);root.replaceChildren();if(!rows.length){const p=document.createElement('p');p.textContent='No recorded data for this period.';root.append(p);return;}
    const table=document.createElement('table'),head=document.createElement('thead'),tr=document.createElement('tr');
    columns.forEach(([label])=>{const th=document.createElement('th');th.scope='col';th.textContent=label;tr.append(th);});head.append(tr);table.append(head);const body=document.createElement('tbody');
    rows.forEach(row=>{const tr=document.createElement('tr');columns.forEach(([,key])=>{const td=document.createElement('td');td.textContent=typeof row[key]==='number'?format(row[key]):String(row[key]??'');tr.append(td);});body.append(tr);});table.append(body);root.append(table);
  }
  function metric(label,value,note) {const article=document.createElement('article'),h=document.createElement('h2'),p=document.createElement('p'),small=document.createElement('small');h.textContent=label;p.textContent=value;small.textContent=note;article.append(h,p,small);return article;}
  async function refresh() {
    if(pending)return;pending=true;$('analyticsReportStatus').textContent='Loading recorded data…';
    try {
      const r=await fetch('/api/analytics/report?days='+$('analyticsDays').value+'&grain='+$('analyticsGrain').value,{cache:'no-store',credentials:'same-origin'});
      if(r.status===401){location.assign('/analytics');return;}if(!r.ok)throw Error();const data=await r.json(),s=data.summary;
      $('analyticsSummary').replaceChildren(metric('Automatic page opens',format(data.automatic.page_opens),'Document loads; no visitor identifier'),metric('Optional page views',format(s.pageviews),'Consented traffic only'),metric('Visits / sessions',format(s.visits),'Selected period'),metric('Approx. unique browsers',format(s.unique_visitors),'Consented browser IDs; not identified people'),metric('Average engaged time',format(s.average_engaged_seconds)+' sec','Visible activity; overlapping tabs merged'),metric('Average elapsed span',format(s.average_elapsed_seconds)+' sec','First to last recorded event, including idle gaps'),metric('Lifetime recorded visits',format(data.allTime.visits),'Opt-in traffic since tracking began'));
      const traffic=data.traffic.map(r=>({...r,page_opens:data.automatic.traffic.find(o=>new Date(o.bucket).toISOString()===new Date(r.bucket).toISOString())?.page_opens||0,bucket:new Date(r.bucket).toISOString().slice(0,10)}));
      table('analyticsTraffic',traffic,[['UTC period','bucket'],['Automatic opens','page_opens'],['Optional visits','visits'],['Unique browsers','unique_visitors'],['Page views','pageviews']]);
      table('analyticsProjects',data.projects,[['Project','project_id'],['Views','views'],['Card clicks','clicks'],['Demos','demos']]);
      table('analyticsResumes',data.resumes,[['Resume','resume_id'],['Download clicks','clicks']]);table('analyticsSources',data.sources,[['Source / domain','source'],['Visits','visits']]);table('analyticsDevices',data.devices,[['Category','device'],['Visits','visits']]);table('analyticsSections',data.sections,[['Section','section_id'],['Engaged seconds','engaged_seconds']]);table('analyticsOutbound',data.outbound,[['Domain','target'],['Clicks','clicks']]);
      const chart=$('analyticsTrend');chart.replaceChildren();const max=Math.max(1,...traffic.map(r=>r.page_opens));
      traffic.forEach(row=>{const bar=document.createElement('div'),label=document.createElement('span'),meter=document.createElement('meter');label.textContent=row.bucket+' · '+row.page_opens+' page opens';meter.min=0;meter.max=max;meter.value=row.page_opens;meter.setAttribute('aria-label',label.textContent);bar.append(label,meter);chart.append(bar);});
      $('analyticsReportStatus').textContent=`${data.days} days · grouped by ${data.grain} · UTC · ${data.coverage}. Lifetime automatic page opens: ${format(data.automatic.total)}. Optional page views: ${format(data.allTime.pageviews)}.`;
    }catch{$('analyticsReportStatus').textContent='Report unavailable. No placeholder counts are shown. Check server configuration or try again.';}finally{pending=false;}
  }
  $('analyticsRefresh').addEventListener('click',refresh);$('analyticsDays').addEventListener('change',refresh);$('analyticsGrain').addEventListener('change',refresh);refresh();
})();
