(function(root){
 'use strict';
 function source(value){
  if(typeof value!=='string'||!value.trim())return null;
  const input=value.trim();
  if(!/^[a-z][a-z0-9+.-]*:/i.test(input)&&!input.startsWith('//')){
   if(input.includes('\\')||input.split(/[/?#]/).includes('..')||!/^assets\/projects\/[a-z0-9-]+\/videos\/[a-z0-9_./% -]+\.(mp4|webm)$/i.test(input))return null;
   return {kind:'file',src:input,mime:/\.webm$/i.test(input)?'video/webm':'video/mp4'};
  }
  let url;try{url=new URL(input)}catch{return null}
  if(url.protocol!=='https:')return null;
  const host=url.hostname.toLowerCase().replace(/^www\./,'');let id;
  if(host==='youtu.be')id=url.pathname.slice(1).split('/')[0];
  if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host))id=url.pathname==='/watch'?url.searchParams.get('v'):url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
  if(id&&/^[A-Za-z0-9_-]{11}$/.test(id))return {kind:'youtube',id,src:input};
  if(['vimeo.com','player.vimeo.com'].includes(host)){const match=url.pathname.match(/^\/(?:video\/)?(\d+)\/?$/);if(match)return {kind:'vimeo',id:match[1],src:input}}
  if(!['youtu.be','youtube.com','m.youtube.com','youtube-nocookie.com','vimeo.com','player.vimeo.com'].includes(host)&&/\.(mp4|webm)$/i.test(url.pathname))return {kind:'file',src:url.href,mime:/\.webm$/i.test(url.pathname)?'video/webm':'video/mp4'};
  return null;
 }
 function image(value){if(typeof value!=='string'||!value)return '';if(/^assets\//.test(value)&&!value.includes('..')&&!value.includes('\\')&&/\.(png|jpe?g|webp|svg)$/i.test(value))return value;try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}}
 function seconds(value){if(typeof value==='number')return Number.isFinite(value)&&value>=0?value:null;if(typeof value==='string'&&/^\d+(?::[0-5]?\d){0,2}$/.test(value))return value.split(':').reduce((n,v)=>n*60+Number(v),0);return null}
 function normalize(row){if(!row||!source(row.src))return null;return {...source(row.src),title:typeof row.title==='string'&&row.title.trim()?row.title.trim():'Project demonstration',description:typeof row.description==='string'?row.description:'',poster:image(row.thumbnail||row.poster),chapters:Array.isArray(row.chapters)?row.chapters.map(c=>({time:seconds(c.time),title:typeof c.title==='string'?c.title:'Chapter'})).filter(c=>c.time!==null):[]}}
 function videos(project){const configured=root.PORTFOLIO_PROJECT_MEDIA?.[project]?.videos||[],found=root.PORTFOLIO_DISCOVERED_MEDIA?.[project]?.videos||[];const seen=new Set();return [...configured,...found].filter(row=>{if(!row||seen.has(row.src))return false;seen.add(row.src);return true}).map(normalize).filter(Boolean)}
 const api={source,image,seconds,normalize,videos};root.PortfolioMedia=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:globalThis);
