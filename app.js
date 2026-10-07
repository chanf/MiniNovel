const icons = {
  book: '<path d="M4 5.5C6.5 4 9 4 12 6c3-2 5.5-2 8-.5v14c-2.5-1.5-5-1.5-8 .5-3-2-5.5-2-8-.5z"/><path d="M12 6v14"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
  script: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11v1a7 7 0 0 0 14 0v-1M12 19v3M8 22h8"/>',
  video: '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  settings: '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  play: '<path d="m8 4 12 8-12 8z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 2v4M18 4h4"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5M5.3 7a8 8 0 0 1 13.2-2L20 7M4 17l1.5 2A8 8 0 0 0 19 17"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10H3z"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  undo: '<path d="M3 10h11a6 6 0 0 1 0 12M3 10l5-5M3 10l5 5"/>',
  history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>',
  monitor: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>',
  send: '<path d="m3 3 19 9-19 9 4-9zM7 12h15"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',
  grip: '<circle cx="9" cy="5" r=".7"/><circle cx="15" cy="5" r=".7"/><circle cx="9" cy="12" r=".7"/><circle cx="15" cy="12" r=".7"/><circle cx="9" cy="19" r=".7"/><circle cx="15" cy="19" r=".7"/>',
  manual: '<path d="M12 6.5C10 4.9 7.2 4.7 4 6v13.5c3.2-1.3 6-1.1 8 .5 2-1.6 4.8-1.8 8-.5V6c-3.2-1.3-6-1.1-8 .5z"/><path d="M12 6.5V20"/>',
};
function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
let artIndex = 0;
function artwork(kind = 'station', label = '雨夜车站场景插画') {
  const id = `art-${++artIndex}`;
  const letter = kind === 'letter';
  const distant = kind === 'road';
  let rain = '';
  for (let i = 0; i < 56; i++) { const x = (i * 83 + 19) % 800, y = (i * 97 + 14) % 500; rain += `<path d="m${x} ${y} -9 23"/>`; }
  let windows = '';
  for(let i=0;i<19;i++) windows += `<rect x="${15+i*43}" y="${110+(i%3)*30}" width="${12+i%4*3}" height="${16+i%3*4}" fill="${i%3?'#426473':'#d3b07a'}" opacity=".7"/>`;
  return `<svg class="scene-art" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <defs>
      <linearGradient id="${id}-sky" x2="0" y2="1"><stop stop-color="#182b42"/><stop offset=".7" stop-color="#3f6876"/><stop offset="1" stop-color="#a4afa0"/></linearGradient>
      <linearGradient id="${id}-road" x2=".1" y2="1"><stop stop-color="#254e5c"/><stop offset="1" stop-color="#122b40"/></linearGradient>
      <linearGradient id="${id}-light" x2="0" y2="1"><stop stop-color="#ffe3a1" stop-opacity=".7"/><stop offset="1" stop-color="#ffc972" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}-glow"><stop stop-color="#ffe2a8" stop-opacity=".7"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>
      <filter id="${id}-blur"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <rect width="800" height="500" fill="url(#${id}-sky)"/>
    <path d="M0 125 60 120 60 80 112 80 112 143 145 143 145 62 197 62 197 138 235 138 235 102 288 102 288 147 328 147 328 47 358 47 358 146 408 146 408 96 466 96 466 132 540 132 540 60 602 60 602 143 640 143 640 104 701 104 701 132 800 132V280H0Z" fill="#233c50"/>
    ${windows}
    <path d="M0 227Q175 189 370 224T800 211V300H0" fill="#243f4d"/>
    <rect y="289" width="800" height="211" fill="url(#${id}-road)"/>
    <path d="m0 346 800-21M0 415l800-41M145 500l334-212M580 500l-53-212" stroke="#77a4a8" opacity=".22" stroke-width="2"/>
    <path d="m97 373 77-3m330 54 86-7m-390 39 80-2m329-90 104-6m-355 11 91-4" stroke="#b5c2b2" opacity=".34" stroke-width="3"/>
    ${!letter ? `<ellipse cx="${distant?560:575}" cy="220" rx="175" ry="145" fill="url(#${id}-glow)"/>
    <path d="m514 193-48 289h211l-91-289" fill="url(#${id}-light)" opacity=".3"/>
    <path d="M45 65v235M51 93Q6 57 0 121M47 111Q100 64 140 119M40 145Q12 97 0 178" stroke="#132d38" stroke-width="13" fill="none"/>
    <path d="M6 4q128 41 153 91Q78 127 0 93M0 111q84-11 127 36-70 52-127 38" fill="#173a44"/>
    <path d="M477 143h243v14H477z" fill="#152d3d"/><path d="m462 146 40-26h223l33 26z" fill="#213e4a"/>
    <path d="M493 158v161M731 155v162" stroke="#152d3d" stroke-width="9"/>
    <rect x="505" y="166" width="192" height="132" fill="#8baca7" opacity=".14"/><path d="M602 165v133" stroke="#183748" stroke-width="5"/>
    <rect x="516" y="186" width="49" height="61" rx="1" fill="#c8c8a9"/><rect x="522" y="194" width="37" height="4" fill="#73817b"/><rect x="522" y="204" width="25" height="3" fill="#73817b"/><rect x="522" y="222" width="32" height="17" fill="#8ca3a0"/>
    <path d="M544 275h142v8H544zM556 283v25M675 283v25" stroke="#1a3440" stroke-width="6"/>
    <path d="M409 80v241" stroke="#203d48" stroke-width="7"/><rect x="386" y="69" width="45" height="8" rx="3" fill="#c8d2b4"/>
    <ellipse cx="410" cy="82" rx="56" ry="55" fill="url(#${id}-glow)"/>
    <rect x="717" y="151" width="6" height="30" fill="#d9bf83"/><rect x="551" y="151" width="59" height="4" fill="#f4dc9f"/>
    ${!distant?`<ellipse cx="344" cy="407" rx="55" ry="7" fill="#102738" opacity=".7"/>
    <path d="M311 226q26-30 55 0l-5 84-48 1z" fill="#deb494"/><path d="M319 307l-3 82M351 307l7 82" stroke="#132b3c" stroke-width="14"/><path d="m314 389-10 9h21m31-8 14 7h-23" stroke="#112536" stroke-width="8"/>
    <circle cx="337" cy="205" r="18" fill="#dfb59d"/><path d="M319 202q-6-24 18-25 25-1 23 23l-10-8-25 8z" fill="#1a2b35"/>
    <path d="M315 239q-13 21-7 45l15 1M359 237l21 34" stroke="#d6ac8d" stroke-width="12" fill="none"/>
    <path d="M383 198v82q0 15-9 10" stroke="#27373a" stroke-width="3" fill="none"/>
    <path d="M303 200q26-80 100-53 45 15 54 51-38-15-51 0-27-13-51 1-24-14-52 1z" fill="#435e67"/><path d="M382 135q-14 18-27 64M382 135q21 23 24 63" stroke="#8b9a96" opacity=".45" fill="none"/>
    <path d="m370 274 24 5-6 34-28-5z" fill="#d0bf99"/><path d="m370 274 10 17 14-12" fill="none" stroke="#9f947f"/>`: `<path d="M199 225q13-13 25 0l4 48h-32z" fill="#cdad87"/><circle cx="212" cy="209" r="11" fill="#d5b496"/><path d="m201 271-3 42m23-42 6 40" stroke="#192c3c" stroke-width="9"/><path d="M161 214q43-71 99 0z" fill="#637e86"/>`}`:''}
    ${letter?`<rect width="800" height="500" fill="#132b3c" opacity=".43"/><ellipse cx="539" cy="253" rx="225" ry="219" fill="url(#${id}-glow)"/><path d="M0 416 380 153l299 169-123 178H0" fill="#314857"/><path d="m176 193 352-29 49 234-355 43z" fill="#e5d2ae"/><path d="m176 193 203 104 149-133" stroke="#a89477" stroke-width="2" fill="none"/><path d="m222 441 139-134m216 91-145-102" stroke="#b9a183" stroke-width="2"/><path d="m423 354 75-9m-69 19 60-7" stroke="#8c7562" stroke-width="3" opacity=".6"/><rect x="451" y="186" width="40" height="46" fill="#577579" transform="rotate(-5 451 186)"/><path d="M0 500V346q39-65 75-35l87 61q32 26 59 36l56 45q28 35-13 47" fill="#c6a58e"/><path d="m93 379 99 61m-109-27 89 51" stroke="#a08071" stroke-width="3" opacity=".45"/><circle cx="665" cy="110" r="27" fill="#edd199" filter="url(#${id}-blur)"/>`:''}
    <g stroke="#afc4c6" stroke-width="1" opacity=".23">${rain}</g>
    <path d="M0 485q250-40 433-10t367-15" stroke="#7eacae" opacity=".25" fill="none" stroke-width="2"/>
  </svg>`;
}
let scenes = [];
let characters = {};
let projectList = [];
const state = {page:'script',scene:0,tab:'dialogue',shot:0,agent:false,prompt:'',playing:false,project:null,episode:null,character:null,loadingProject:false};
const capabilityInfo = {
  text:{name:'文本生成',icon:'script',description:'故事构思、分幕剧本与文字润色',placeholder:'custom-text-model'},
  image:{name:'图片生成',icon:'image',description:'人物参考、场景插画与图片编辑',placeholder:'custom-image-model'},
  video:{name:'视频生成',icon:'video',description:'为镜头生成动态画面',placeholder:'custom-video-model'},
};
state.capability='text';
state.providers={
  text:[{id:'agnes-text',name:'Agnes AI',url:'https://apihub.agnes-ai.com/v1',models:['agnes-2.5-flash','agnes-2.0-flash']},{id:'custom-text',name:'备用供应商（示例）',url:'https://api.example.com/v1',models:['custom-text-model']}],
  image:[{id:'agnes-image',name:'Agnes AI',url:'https://apihub.agnes-ai.com/v1',models:['agnes-image-2.1-flash','agnes-image-2.0-flash']}],
  video:[{id:'agnes-video',name:'Agnes AI',url:'https://apihub.agnes-ai.com/v1',models:['agnes-video-v2.0']}],
};
state.defaults={text:{provider:'agnes-text',model:'agnes-2.5-flash'},image:{provider:'agnes-image',model:'agnes-image-2.1-flash'},video:{provider:'agnes-video',model:'agnes-video-v2.0'}};
state.backend={status:'loading',credentialsAvailable:false,error:''};
state.character='lin';
async function api(path,options={}){
  const response=await fetch(`/api${path}`,{...options,headers:{'Content-Type':'application/json',...options.headers}});
  const data=await response.json();
  if(!response.ok)throw new Error(typeof data.detail==='string'?data.detail:'请求失败，请重试');
  return data;
}
function applySettings(data){state.providers=data.providers;state.defaults=data.defaults;state.backend.credentialsAvailable=data.credentialsAvailable;}
async function loadSettings(){
  state.backend.status='loading';
  try{applySettings(await api('/settings'));state.backend.status='ready';state.backend.error='';}
  catch(error){state.backend.status='error';state.backend.error=error.message||'无法连接本地服务';}
  render();
}
async function persistDefault(cap,provider,model){
  try{applySettings(await api(`/defaults/${cap}`,{method:'PUT',body:JSON.stringify({provider,model})}));document.getElementById('dialog').close();render();toast('默认模型已保存到本机');}
  catch(error){toast(error.message);}
}
function debounce(){const timers={};return (key,fn,wait=700)=>{clearTimeout(timers[key]);timers[key]=setTimeout(fn,wait);};}
const scheduleSave=debounce();
function paragraphCount(key){return scenes.reduce((n,s)=>n+s.paragraphs.filter(p=>p.characterId===key).length,0);}
function totalParagraphs(){return scenes.reduce((n,s)=>n+s.paragraphs.length,0);}
function estimatedSeconds(){const total=scenes.reduce((n,s)=>n+s.paragraphs.reduce((m,p)=>m+p.text.length,0),0);return Math.max(1,Math.round(total/5));}
function formatSeconds(sec){return `${Math.floor(sec/60)} 分 ${String(sec%60).padStart(2,'0')} 秒`;}
function shotArt(shot,index){return shot.imageUrl?`<img class="scene-art" src="${escapeHtml(shot.imageUrl)}" alt="镜头画面">`:artwork(['station','letter','road'][index%3]);}
function firstNarration(){for(const s of scenes){const p=s.paragraphs.find(p=>p.kind==='narration');if(p)return p.text;}return '';}
async function loadProjectList(){try{projectList=await api('/projects');}catch(error){projectList=[];}}
async function openProject(id){
  state.loadingProject=true;render();
  try{
    const data=await api(`/projects/${id}/content`);
    state.project={id,name:data.projectName,synopsis:data.synopsis,is_demo:data.isDemo};
    characters={};for(const c of data.characters)characters[c.id]={...c,avatarStale:false,_savedPrompt:c.avatarPrompt};
    scenes=data.scenes;state.episode=data.episode;state.scene=0;state.shot=0;state.tab='dialogue';
    state.character=(Object.values(characters).find(c=>!c.isNarrator)||{}).id||null;
  }catch(error){toast(error.message);}
  state.loadingProject=false;render();
}
const voiceDescriptions={Serena:'柔和女声，克制而细腻',Vivian:'明亮女声，轻快清晰',Uncle_Fu:'低沉醇厚，沉稳男声',Dylan:'年轻男声，清晰自然',Eric:'四川口音，活泼沙哑'};
const voiceStyles={Serena:'轻柔、克制，情绪藏在停顿里',Vivian:'明亮、利落，节奏轻快',Uncle_Fu:'平静、舒缓，像在讲一个旧故事',Dylan:'明朗、亲切，像久别重逢',Eric:'爽朗、生动，带一点烟火气'};
function avatar(key, small = false) {
  const c=characters[key];
  if(!c)return `<span class="avatar slate ${small?'small':''}">${icon('help')}</span>`;
  const content=c.isNarrator?icon('mic'):(c.avatarUrl?`<img src="${escapeHtml(c.avatarUrl)}" alt="${escapeHtml(c.name)}的头像" width="44" height="44">`:icon('image'));
  return `<span class="avatar ${c.color} ${small?'small':''} ${c.isNarrator?'narrator-avatar':'portrait-avatar'}">${content}</span>`;
}
function badge(text, kind='neutral') { return `<span class="badge ${kind}">${text}</span>`; }
function btn(text, action, cls='', ico='') { return `<button type="button" class="btn ${cls}" data-action="${action}">${ico?icon(ico):''}${text}</button>`; }
function shell(){
  const nav=[['projects','grid','我的项目'],['characters','book','角色设定'],['script','script','剧本与画面'],['voices','mic','角色配音'],['production','video','视频工作台']];
  return `<aside class="sidebar">
    <a href="#script" class="brand" aria-label="MiniNovel 首页"><span class="brand-mark">${icon('book')}</span><span>MiniNovel<small>让故事被看见</small></span></a>
    <button class="workspace-switch" data-action="workspace"><span class="workspace-symbol">F</span><span>个人创作空间<small>本地工作室</small></span>${icon('down')}</button>
    <div class="nav-label">工作台</div>
    <nav class="primary-nav" aria-label="主导航">${nav.map(([p,i,t])=>`<a href="#${p}" class="nav-item ${state.page===p?'active':''}">${icon(i)}<span>${t}</span>${p==='script'?'<span class="nav-dot"></span>':''}</a>`).join('')}</nav>
    <div class="sidebar-divider"></div><div class="nav-label">创作资源</div>
    <nav class="resource-nav" aria-label="创作资源"><a href="#manual" class="nav-item ${state.page==='manual'?'active':''}">${icon('manual')}<span>使用手册</span></a><a href="#skills" class="nav-item ${state.page==='skills'?'active':''}">${icon('layers')}<span>我的 Skills</span><span class="nav-count">4</span></a><a href="#settings" class="nav-item ${state.page==='settings'?'active':''}">${icon('settings')}<span>模型与设置</span></a></nav>
    <div class="sidebar-bottom"><div class="local-status"><span class="status-light"></span><span>本地创作模式<small>素材保存在你的设备上</small></span>${icon('monitor')}</div><button class="profile" data-action="help"><span class="profile-avatar">F</span><span>Feng<small>创作者</small></span>${icon('help')}</button></div>
  </aside>
  <div class="main-shell"><header class="topbar"><div class="breadcrumbs"><a href="#projects">我的项目</a>${icon('chevron')}<span>${state.project?escapeHtml(state.project.name):'未打开项目'}</span>${state.episode?badge(escapeHtml(state.episode.title)):''}</div><div class="topbar-actions"><span class="prototype-label">${{'characters':'M2 · 已保存','script':'M2 · 已保存','voices':'原型 · 待接入','production':'原型 · 待接入','projects':'本地项目','skills':'候选配置','settings':'本地配置','manual':'阅读指南'}[state.page]||''}</span><span class="saved">${icon(state.backend.status==='ready'?'check':'clock')} ${state.backend.status==='ready'?'服务已连接':'服务未就绪'}</span><button class="icon-btn" data-action="project-menu" aria-label="项目选项">${icon('more')}</button></div></header>
    ${!state.project&&['characters','script','voices','production'].includes(state.page)?`<section class="page"><div class="resource-note">${icon('monitor')}${state.loadingProject?'正在打开项目…':'尚未打开项目，请从“我的项目”进入。'}</div></section>`:state.page==='characters'?charactersPage():state.page==='script'?scriptPage():state.page==='voices'?voicesPage():state.page==='production'?productionPage():state.page==='projects'?projectsPage():state.page==='skills'?skillsPage():state.page==='manual'?manualPage():settingsPage()}
  </div>`;
}
function pageHeading(title,description,actions=''){return `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;}
function flowSteps(active){return `<div class="workflow" aria-label="制作阶段">${[['角色设定','characters'],['剧本与画面','script'],['角色配音','voices'],['合成与导出','production']].map(([label,page],i)=>`<a href="#${page}" class="workflow-step ${i===active?'current':i<active?'completed':''}"><span class="step-number">${i<active?icon('check'):i+1}</span>${label}${i<3?icon('chevron','step-chevron'):''}</a>`).join('')}<span class="workflow-end">先认识人物，再讲述故事</span></div>`;}
function charactersPage(){
  const key=state.character;
  const cast=Object.entries(characters).filter(([,p])=>!p.isNarrator);
  const confirmed=cast.filter(([,person])=>person.confirmed).length;
  const imageDefault=state.defaults.image,imageProvider=state.providers.image.find(p=>p.id===imageDefault.provider);
  const textDefault=state.defaults.text,textProvider=state.providers.text.find(p=>p.id===textDefault.provider);
  if(!cast.length)return `<section class="page cast-page">
    ${pageHeading('先认识故事里的人','这个项目还没有角色。写下故事想法，或先手动添加人物。',btn('AI 生成角色信息','generate-cast','','spark'))}
    ${flowSteps(0)}
    <div class="cast-story-brief"><span class="cast-brief-icon">${icon('book')}</span><div><strong>${escapeHtml(state.project.name)}</strong><p>${escapeHtml(state.project.synopsis||'还没有故事梗概，先在“项目设定”里写下想法。')}</p></div><button class="text-btn" data-action="project-settings">编辑故事${icon('chevron')}</button></div>
    <div class="empty-cast">${icon('book')}<strong>还没有主要角色</strong><p>接入文本模型后（M4），可以从梗概生成姓名、昵称、角色介绍与头像提示词。现在也可以先手动添加角色。</p>${btn('手动添加角色','add-character','','plus')}</div>
  </section>`;
  const c=characters[key]&&characters[key].id?characters[key]:cast[0][1];
  return `<section class="page cast-page">
    ${pageHeading('先认识故事里的人','从故事梗概提炼主要角色，确认人物信息，再为他们生成头像。',btn('AI 生成角色信息','generate-cast','','spark')+btn('确认并进入剧本','confirm-cast','primary','arrow'))}
    ${flowSteps(0)}
    <div class="cast-story-brief"><span class="cast-brief-icon">${icon('book')}</span><div><strong>${escapeHtml(state.project.name)}</strong><p>${escapeHtml(state.project.synopsis||'还没有故事梗概。')}</p></div><button class="text-btn" data-action="project-settings">编辑故事${icon('chevron')}</button></div>
    <div class="cast-layout">
      <aside class="cast-list-panel"><div class="panel-heading"><h2>主要角色 <span>${cast.length}</span></h2><button class="icon-btn" data-action="add-character" aria-label="添加角色">${icon('plus')}</button></div><p class="cast-list-hint">${confirmed} / ${cast.length} 位资料已确认</p><div class="cast-list">${cast.map(([k,person])=>`<button class="cast-list-item ${k===key?'selected':''}" data-action="select-character" data-character="${k}">${avatar(k)}<span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(person.role)} · ${escapeHtml(person.nickname||'未设置昵称')}</small></span>${person.confirmed?icon('check','cast-confirm-icon'):''}</button>`).join('')}</div><div class="cast-narrator-note">${icon('mic')}<div><strong>旁白单独配音</strong><p>不作为出场人物，不需要生成头像。</p></div></div></aside>
      <section class="cast-profile-panel"><div class="cast-profile-heading"><div><span class="scene-kicker">人物资料</span><h2>${escapeHtml(c.name)}</h2></div>${badge(c.confirmed?'已确认':'待确认',c.confirmed?'green':'neutral')}</div>
      <div class="cast-fields"><div class="form-grid"><div><label class="field-label" for="character-name">姓名</label><input id="character-name" data-character-field="name" value="${escapeHtml(c.name)}" maxlength="40"></div><div><label class="field-label" for="character-nickname">昵称</label><input id="character-nickname" data-character-field="nickname" value="${escapeHtml(c.nickname||'')}" placeholder="人物的别名或常用称呼" maxlength="40"></div></div><label class="field-label" for="character-role">故事身份</label><select id="character-role" data-character-field="role">${['主角','重要配角','关键角色','配角'].map(r=>`<option ${r===(c.role||'配角')?'selected':''}>${r}</option>`).join('')}</select><label class="field-label" for="character-bio">角色介绍</label><textarea id="character-bio" rows="5" data-character-field="bio">${escapeHtml(c.bio||'')}</textarea><p class="cast-field-help">记录背景、性格、人物关系，以及这个角色在故事中的作用。</p>
      <div class="cast-prompt-label"><label class="field-label" for="character-avatar">头像生成提示词</label><span>${icon('image')}图片模型使用</span></div><textarea id="character-avatar" rows="6" data-character-field="avatarPrompt">${escapeHtml(c.avatarPrompt||'')}</textarea><p class="cast-field-help">描述外貌、服装、表情和画风。头像提示词是文字，生成结果单独保存。</p><div class="cast-text-model">${icon('spark')}角色信息由文本模型生成<span>${escapeHtml(textProvider.name)} / ${escapeHtml(textDefault.model)}</span></div></div>
      <div class="cast-profile-footer"><span>资料编辑后自动保存到本机</span>${btn(c.confirmed?'资料已确认':'确认角色资料','confirm-character',c.confirmed?'confirmed-btn':'primary','check')}</div></section>
      <aside class="cast-avatar-panel"><div class="panel-heading"><h2>角色头像</h2>${badge(c.avatarUrl?'已采用示例图':'待生成')}</div><div class="cast-avatar-content"><div class="cast-portrait">${c.avatarUrl?`<img src="${escapeHtml(c.avatarUrl)}" alt="${escapeHtml(c.name)}的肖像">`:`<span class="cast-portrait-empty">${icon('image')}</span>`}<span>电影感插画 / 1:1</span></div><div class="avatar-usage-preview"><span>在工作台中显示</span><div>${avatar(key,true)}${avatar(key)}<strong>${escapeHtml(c.name)}</strong></div></div><div class="avatar-state ${c.avatarStale?'stale':''}">${icon(c.avatarStale?'clock':'image')}<span>${c.avatarStale?'提示词已修改，当前示例图尚未更新':c.avatarUrl?'当前为本地绘制的示例头像':'填写提示词后，接入图片模型即可生成（M5）'}</span></div><div class="cast-image-model"><span>头像生成模型</span><strong>${escapeHtml(imageProvider.name)}</strong><small>${escapeHtml(imageDefault.model)}</small></div>${btn('按提示词生成头像','generate-avatar','primary full-width','spark')}<button class="text-btn cast-model-link" data-action="avatar-model-settings">切换默认图片模型${icon('chevron')}</button><div class="cast-avatar-tip">${icon('help')}采用同一头像用于剧本对白、角色列表和配音页面。场景插画可引用角色外观资料。</div></div></aside>
    </div>
    <div class="cast-process-note">${icon('spark')}AI 拟定资料与头像提示词<span>${icon('chevron')}</span>你编辑并确认人物<span>${icon('chevron')}</span>图片模型生成头像<span>${icon('chevron')}</span>进入分幕创作</div>
  </section>`;
}
function scriptPage(){
  if(!scenes.length)return `<section class="page script-page">${pageHeading('剧本与画面','还没有分幕内容。先在角色设定确认人物，之后由 AI 生成分幕（M4），或添加第一幕。',btn('添加第一幕','add-scene','','plus')+btn('返回角色','go-cast','','back'))}${flowSteps(1)}</section>`;
  const scene=scenes[state.scene]||scenes[0];
  const done=scenes.filter(s=>s.status==='done').length;
  return `<section class="page script-page">
    ${pageHeading('剧本与画面','把故事拆成一幕一幕，让文字与画面一起发生。',btn('项目设定','project-settings','', 'settings')+btn('进入配音','go-voices','primary','arrow'))}
    ${flowSteps(1)}
    <div class="editor-layout">
      <aside class="scene-panel"><div class="panel-heading"><h2>分幕剧本 <span>${scenes.length}</span></h2><button class="icon-btn" data-action="add-scene" aria-label="添加一幕">${icon('plus')}</button></div><div class="scene-progress"><span>内容确认</span><strong>${done} / ${scenes.length} 幕</strong><div class="progress-track"><span style="width:${Math.round(done/scenes.length*100)}%"></span></div></div>
      <div class="scene-list">${scenes.map((s,i)=>`<button class="scene-item ${state.scene===i?'selected':''}" data-action="scene" data-index="${i}"><span class="scene-number">${String(i+1).padStart(2,'0')}</span><span class="scene-copy"><strong>${escapeHtml(s.title)}</strong><small>${escapeHtml(s.place||'未设置地点')}</small><span class="scene-meta">${icon('script')}${s.paragraphs.length} 段<span class="scene-state ${s.status==='done'?'done':''}">${s.status==='done'?'已确认':'待编辑'}</span></span></span></button>`).join('')}</div>
      <div class="scene-panel-bottom"><div class="story-duration">${icon('clock')}预计总时长 <strong>${formatSeconds(estimatedSeconds())}</strong></div><button class="text-btn" data-action="outline">${icon('script')}查看故事大纲${icon('chevron')}</button></div></aside>
      <section class="script-panel"><div class="scene-header"><div><span class="scene-kicker">第 ${String(state.scene+1).padStart(2,'0')} 幕</span><h2>${escapeHtml(scene.title)}</h2><div class="scene-location">${escapeHtml(scene.place||'未设置地点')}<span>${scene.paragraphs.length} 段对白</span></div></div><button class="icon-btn" data-action="history" aria-label="查看版本历史">${icon('history')}</button></div>
      <div class="editor-tabs" role="tablist"><button role="tab" aria-selected="${state.tab==='dialogue'}" class="${state.tab==='dialogue'?'active':''}" data-action="tab" data-tab="dialogue">对白与旁白<span>${scene.paragraphs.length}</span></button><button role="tab" aria-selected="${state.tab==='notes'}" class="${state.tab==='notes'?'active':''}" data-action="tab" data-tab="notes">场景说明</button><div class="editor-tabs-end">${btn('润色本幕','polish','small-btn','spark')}</div></div>
      <div class="dialogue-list">${state.tab==='notes'?`<div class="scene-notes"><h3>场景说明</h3><p>${escapeHtml(scene.summary||'还没有场景说明。')}</p><span class="note-hint">${icon('lock')}场景说明不参与配音与字幕</span></div>`:scene.paragraphs.map((p,i)=>{const sp=characters[p.characterId];return `<article class="dialogue-block ${p.kind==='narration'?'narration':''}"><div class="dialogue-label">${avatar(p.characterId,true)}<strong>${escapeHtml(sp?sp.name:'未知说话人')}</strong>${p.kind==='narration'?badge('旁白'):''}<span class="emotion">${escapeHtml(p.emotion||'平静')}</span><button class="icon-btn" data-action="paragraph-menu" data-index="${i}" aria-label="编辑第${i+1}段">${icon('more')}</button></div><div contenteditable="true" role="textbox" aria-label="第${i+1}段文案" spellcheck="false" data-paragraph="${i}" class="paragraph-text">${escapeHtml(p.text)}</div><div class="paragraph-bottom"><span>${p.kind==='narration'?'环境与剧情介绍':'角色对白'}</span><span>${p.text.length} 字</span></div></article>`;}).join('')}
      <button class="add-paragraph" data-action="add-paragraph">${icon('plus')}添加对白或旁白</button></div>
      <div class="script-footer"><span>${icon('check')}点击文字即可编辑，自动保存</span>${btn(scene.status==='done'?'本幕已确认':'确认本幕内容','confirm-scene',scene.status==='done'?'confirmed-btn':'primary small-btn',scene.status==='done'?'check':'lock')}</div></section>
      <aside class="visual-panel"><div class="panel-heading"><h2>场景画面 <span>${scene.shots.length}</span></h2><button class="icon-btn" data-action="add-shot" aria-label="添加镜头">${icon('plus')}</button></div><div class="visual-scroll"><div class="shot-topline"><strong>镜头 ${String(state.shot+1).padStart(2,'0')}</strong>${badge(scene.shots[state.shot]&&scene.shots[state.shot].imageUrl?'示例图':'待生成')}<button class="icon-btn" data-action="shot-menu" aria-label="镜头选项">${icon('more')}</button></div>
      <div class="main-art">${shotArt(scene.shots[state.shot]||{imageUrl:''},state.shot)}<span class="art-dimension">16:9</span><button class="art-expand" data-action="expand-art" aria-label="放大画面">${icon('external')}</button></div>
      <div class="shot-thumbnails">${scene.shots.map((s,i)=>`<button class="shot-thumb ${state.shot===i?'selected':''}" data-action="shot" data-index="${i}" aria-label="选择镜头${i+1}">${shotArt(s,i)}<span>${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div>
      <div class="shot-binding"><span>${icon('script')}关联段落</span><button data-action="binding">${scene.shots[state.shot]?'按镜头区间播放':'本幕结尾'}${icon('down')}</button></div>
      <div class="prompt-heading"><label for="image-prompt">画面提示词</label><span>${icon('spark')}插画 Skill</span></div><textarea id="image-prompt" rows="5" data-shot-prompt="${state.shot}">${escapeHtml((scene.shots[state.shot]||{}).prompt||'')}</textarea><div class="reference-row"><span>人物参考</span><button data-action="characters">${(()=>{const first=Object.values(characters).find(c=>!c.isNarrator);return first?avatar(first.id,true):'';})()}主要角色${icon('chevron')}</button></div><div class="model-line"><span class="model-dot"></span>${escapeHtml(state.providers.image.find(p=>p.id===state.defaults.image.provider).name)} · ${escapeHtml(state.defaults.image.model)}<span>电影感插画</span></div><div class="image-actions">${btn('重新生成','regenerate','primary','refresh')}${btn('上传替换','upload','','image')}</div>
      <button class="dynamic-link" data-action="dynamic">${icon('video')}让画面动起来<span>可选</span>${icon('chevron')}</button>
      <div class="visual-tip">${icon('help')}文字、声音和字幕分别保存，画面里不需要写入台词。提示词编辑后自动保存。</div></div></aside>
    </div>
    <div class="agent-bar"><span class="agent-orb">${icon('spark')}</span><div><strong>创作助手</strong><span>试试“让对白更克制一些”</span></div><span class="scope-chip">作用于第 ${state.scene+1} 幕</span>${btn('与 Agent 一起修改','agent','','spark')}</div>
  </section>${state.agent?agentPanel():''}`;
}
function voicesPage(){
  const entries=Object.entries(characters);
  return `<section class="page voices-page">${pageHeading('为角色找到声音','先听见人物，再让每一句对白有自己的温度。音色选择会保存到角色档案。',btn('返回剧本','go-script','','back')+btn('批量生成配音','batch-voice','primary','mic'))}${flowSteps(2)}
    <div class="voice-intro"><div class="voice-intro-symbol">${icon('mic')}</div><div><strong>声音，也是一种人物设定。</strong><p>为每位角色选择音色。旁白独立配音，同一角色的声音贯穿整集。实际生成在 M6 接入。</p></div><span class="engine-status"><span class="status-light"></span>本地 Qwen3-TTS <span>待连接</span></span></div>
    <div class="voices-layout"><div class="character-voices">${entries.map(([key,c])=>{const voice=c.voice||(c.isNarrator?'Uncle_Fu':'Serena');return `<article class="voice-card"><div class="voice-character">${avatar(key)}<div><h2>${escapeHtml(c.name)}${c.isNarrator?badge('旁白'):''}</h2><p>${c.isNarrator?'贯穿全篇，平静地讲述故事':escapeHtml((c.bio||c.role||'角色介绍待补充').slice(0,22))}</p></div><span class="segment-count">${paragraphCount(key)} 段</span></div><div class="voice-select-row"><label for="voice-${key}">角色音色</label><select id="voice-${key}" data-voice="${key}">${['Serena','Vivian','Uncle_Fu','Dylan','Eric'].map(v=>`<option ${voice===v?'selected':''}>${v}</option>`).join('')}</select><button class="voice-preview" data-action="voice-preview" data-character="${key}" aria-label="试听${escapeHtml(c.name)}音色">${icon('play')}试听</button></div><div class="voice-detail"><span>${voiceDescriptions[voice]||'音色描述'}</span>${badge('中文','neutral')}</div><div class="voice-style"><span>演绎风格</span><input aria-label="${escapeHtml(c.name)}演绎风格" placeholder="生成时使用的演绎提示（M6 生效）" value="${escapeHtml(voiceStyles[voice]||'')}"></div></article>`;}).join('')}</div>
    <aside class="voice-sidebar"><div class="aside-section"><h2>配音计划</h2><div class="plan-row"><span>说话人</span><strong>${entries.length} 位</strong></div><div class="plan-row"><span>对白与旁白</span><strong>${totalParagraphs()} 段</strong></div><div class="plan-row"><span>预计音频</span><strong>${formatSeconds(estimatedSeconds())}</strong></div><div class="plan-divider"></div><div class="plan-row"><span>生成方式</span><strong>本机生成（M6）</strong></div><p class="local-note">${icon('monitor')}音频将在 Mac 上生成，每段保存为独立 MP3；当前仅保存音色选择。</p>${btn('查看待生成段落','voice-lines','full-width','script')}</div><div class="aside-section small-section"><h3>生成前检查</h3><div class="check-line">${icon('check')}角色音色已分配</div><div class="check-line pending">${icon('clock')}还有 ${scenes.filter(s=>s.status!=='done').length} 幕内容待确认</div><a href="#script" class="inline-link">返回剧本确认内容${icon('arrow')}</a></div><div class="quiet-tip"><h3>一个小建议</h3><p>用角色的实际台词试听，比统一的样例更容易找到合适的声音。</p></div></aside></div>
    <div class="sample-audio-strip"><span class="mini-player">${icon('play')}</span><div><strong>旁白试听</strong><p>${escapeHtml((firstNarration()||'暂无旁白文本').slice(0,26))}……</p></div><span class="audio-line"></span><span class="muted">M6 接入 TTS 后可试听</span></div>
  </section>`;
}
function productionPage(){
  const caption=firstNarration()||'字幕示例';
  return `<section class="page production-page">${pageHeading('让故事成为一部作品','检查画面、声音与字幕，留下你满意的那个版本。',btn('导出设置','export-settings','','settings')+btn('导出视频','export','primary','download'))}${flowSteps(3)}
  <div class="production-layout"><div class="preview-section"><div class="preview-heading"><h2>成片预览</h2><div>${badge('16:9')}<span>1080p</span></div></div><div class="video-preview">${shotArt(scenes[0]&&scenes[0].shots[0]||{imageUrl:''},0)}<div class="preview-vignette"></div><button class="large-play" data-action="preview-play" aria-label="预览播放状态">${icon(state.playing?'pause':'play')}</button><div class="preview-caption">${escapeHtml(caption)}</div><span class="preview-scene-label">${state.project?escapeHtml(state.project.name):''} · 第 01 幕</span></div><div class="player-controls"><button class="icon-btn" data-action="preview-play" aria-label="切换播放状态">${icon(state.playing?'pause':'play')}</button><span class="player-time">00:08 <span>/ ${formatSeconds(estimatedSeconds())}</span></span><input aria-label="预览位置" type="range" min="0" max="${estimatedSeconds()}" value="8"><button class="icon-btn" data-action="preview-volume" aria-label="音量设置">${icon('volume')}</button></div><p class="prototype-note">当前为画面与字幕示意；配音、对齐与渲染在 M6–M8 接入。</p></div>
  <aside class="export-panel"><div class="aside-section"><h2>画面与字幕</h2><label class="field-label" for="ratio-select">画面比例</label><select id="ratio-select"><option value="16:9">横屏 16:9</option><option value="9:16">竖屏 9:16</option></select><label class="field-label" for="motion-select">静态画面运动</label><select id="motion-select"><option>轻微推近</option><option>保持静止</option><option>缓慢平移</option></select><div class="setting-toggle"><span>显示字幕</span><button class="toggle on" data-action="subtitle-toggle" aria-label="显示字幕" aria-pressed="true"></button></div><div class="subtitle-example">${escapeHtml(caption)}</div><div class="subtitle-options"><span>白色 / 描边</span><button class="text-btn" data-action="subtitle-settings">编辑样式${icon('chevron')}</button></div></div><div class="aside-section"><h3>导出内容</h3><label class="checkbox-row"><input type="checkbox" checked> MP4 视频</label><label class="checkbox-row"><input type="checkbox" checked> SRT 字幕</label><label class="checkbox-row"><input type="checkbox"> 剧本与素材包</label></div></aside></div>
  <div class="timeline-panel"><div class="timeline-header"><h2>时间轴</h2><span>${icon('lock')}以实际配音时长排列（M7）</span><button class="text-btn" data-action="timeline-zoom">适应窗口${icon('down')}</button></div><div class="timeline-scroll"><div class="timeline-ruler"><span class="track-label"></span>${['00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00'].map(t=>`<span>${t}</span>`).join('')}</div><div class="timeline-row"><span class="track-label">${icon('image')}画面</span><div class="visual-track">${scenes.map((s,i)=>`<button data-action="timeline-scene" data-index="${i}" class="clip"><span class="clip-art">${shotArt(s.shots[0]||{imageUrl:''},i)}</span><strong>${String(i+1).padStart(2,'0')} ${escapeHtml(s.title)}</strong></button>`).join('')||'<span class="muted">暂无分幕</span>'}</div></div><div class="timeline-row"><span class="track-label">${icon('mic')}配音</span><div class="voice-track">${Object.entries(characters).map(([k,c])=>`<span class="voice-clip ${c.color}">${escapeHtml(c.name)}<small>${paragraphCount(k)} 段</small></span>`).join('')}</div></div><div class="timeline-row"><span class="track-label">${icon('script')}字幕</span><div class="subtitle-track">${scenes.slice(0,6).map(s=>`<span>${escapeHtml((s.paragraphs[0]?s.paragraphs[0].text:s.title).slice(0,12))}</span>`).join('')||'<span class="muted">暂无字幕</span>'}</div></div></div></div>
</section>`;}
function projectsPage(){const list=projectList;return `<section class="page projects-page">${pageHeading('你的故事，从这里开始','一些灵感正在生长，一些故事即将被听见。项目数据保存在本机。',btn('新建项目','new-project','primary','plus'))}<div class="project-filter"><div class="project-filter-tabs"><button class="active" data-action="filter-projects">全部项目 <span>${list.length}</span></button><button data-action="filter-projects">最近编辑</button></div><div class="search-field">${icon('search')}<input placeholder="搜索故事" aria-label="搜索项目" data-search="project"></div></div><div class="project-grid">${list.map(p=>`<button class="project-card" data-action="open-project" data-id="${p.id}" data-name="${escapeHtml(p.name)}"><div class="project-cover">${artwork('station')}<span>${p.is_demo?'演示项目':'我的故事'}</span></div><div class="project-info"><div><h2>${escapeHtml(p.name)}</h2>${icon('more')}</div><p>${escapeHtml((p.synopsis||'还没有梗概').slice(0,26))}</p><div class="project-tags">${badge('本地保存')}</div><div class="project-footer"><span><span class="status-dot"></span>${p.archived?'已归档':'进行中'}</span><span>${(p.updated_at||'').slice(0,10)}</span></div></div></button>`).join('')}<button class="new-project-card" data-action="new-project"><span>${icon('plus')}</span><strong>写下下一个故事</strong><p>从一个想法，或一篇已有的小说开始</p></button></div><div class="getting-started"><div><span class="getting-icon">${icon('book')}</span><h2>不必一次写完所有的故事。</h2><p>从一幕开始，慢慢打磨。你的文字、画面和声音，都有自己的位置。</p></div><button class="text-btn" data-action="help">了解创作流程${icon('arrow')}</button></div></section>`;}
function skillsPage(){const skills=[['script','小说创作','story-short-write','从故事构思到分幕草稿，建立人物、冲突与叙事节奏。','oh-story-claudecode'],['spark','去 AI 味','story-deslop','减少生硬表达，保留人物语气，让对白读起来更自然。','oh-story-claudecode'],['image','故事插画','story-to-handdrawn-video','规划人物参考与场景构图，把文字转换为叙事画面。','本地 Skill'],['book','剧本审稿','story-review','检查人物关系、情节衔接和前后设定的一致性。','oh-story-claudecode']];return `<section class="page resource-page">${pageHeading('把成熟的方法，带进创作','按创作阶段组合 Skill，让 Agent 用合适的方法完成每一步。',btn('导入 Skill','import-skill','primary','plus'))}<div class="resource-note">${icon('layers')}当前项目使用 4 个 Skill。以下为候选配置示意，尚未集成执行。</div><div class="skill-grid">${skills.map(([i,title,name,desc,source])=>`<article class="skill-card"><div class="skill-card-top"><span class="skill-icon">${icon(i)}</span><button class="toggle on" data-action="skill-toggle" aria-label="启用${title}" aria-pressed="true"></button></div><h2>${title}</h2><span class="skill-name">${name}</span><p>${desc}</p><div class="skill-source"><span>${source}</span>${badge('待适配')}</div><button class="text-btn" data-action="skill-detail" data-name="${title}">查看配置${icon('chevron')}</button></article>`).join('')}</div><div class="skill-flow"><h2>本集的创作顺序</h2><div>${['小说创作','去 AI 味','剧本审稿','故事插画'].map((s,i)=>`<span>${icon(skills[i][0])}${s}</span>${i<3?icon('arrow'):''}`).join('')}</div><p>每一步产生的内容都可以编辑。已确认的文字与画面由你决定是否修改。</p></div></section>`;}
const manualStages=[
  {n:1,title:'角色设定',page:'characters',color:'#547ba5',steps:['文本模型拟定人物资料','确认姓名、介绍与头像提示词','图片模型生成头像'],chips:['文本模型','图片模型']},
  {n:2,title:'剧本与画面',page:'script',color:'#147d74',steps:['写作 Skill 生成分幕剧本','逐幕编辑对白与旁白','生成镜头画面与动态'],chips:['文本','图片','视频']},
  {n:3,title:'角色配音',page:'voices',color:'#a57c43',steps:['为角色与旁白分配音色','本地 TTS 逐段生成','支持单段重做'],chips:['本地 TTS']},
  {n:4,title:'合成与导出',page:'production',color:'#7866aa',steps:['按音频时长排时间轴','检查字幕与镜头切换','固定快照并导出'],chips:['渲染引擎']},
];
function manualPipelineSvg(){
  const cardW=196,cardY=64,cardH=172,gap=44,mainY=cardY+cardH/2;
  let x=172;const rects=manualStages.map(s=>{const r={...s,x};x+=cardW+gap;return r;});
  const arrow=(x1,x2)=>`<line x1="${x1}" y1="${mainY}" x2="${x2}" y2="${mainY}" stroke="#9db4ad" stroke-width="1.6" marker-end="url(#pf-arrow)"/>`;
  let out=`<svg class="pipeline-svg" viewBox="0 0 1260 320" role="img" aria-label="小说生产管线总流程：从故事想法出发，依次经过角色设定、剧本与画面、角色配音、合成与导出四个阶段，产出成片视频、SRT 字幕与素材包；预览不满意时可返回剧本与画面阶段修改">
    <defs>
      <marker id="pf-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="#9db4ad"/></marker>
      <marker id="pf-arrow-back" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="#b08d57"/></marker>
    </defs>
    <rect x="16" y="104" width="112" height="92" rx="9" fill="#f4f7f8" stroke="#c6d3d1" stroke-dasharray="5 4"/>
    <text x="72" y="145" text-anchor="middle" font-size="12.5" font-weight="600" fill="#43606a">故事想法</text>
    <text x="72" y="164" text-anchor="middle" font-size="9.5" fill="#8a999f">或导入已有小说</text>
    <text x="72" y="180" text-anchor="middle" font-size="9.5" fill="#8a999f">新建一个项目</text>
    ${arrow(134,168)}`;
  for(const r of rects){
    let steps='';
    r.steps.forEach((s,i)=>{steps+=`<circle cx="${r.x+23}" cy="${131+i*21}" r="2.5" fill="${r.color}" opacity=".75"/><text x="${r.x+34}" y="${134.5+i*21}" font-size="10.5" fill="#75868c">${s}</text>`;});
    let chips='',cx=r.x+18;
    for(const t of r.chips){const w=18+t.length*8.2;chips+=`<rect x="${cx}" y="202" width="${w}" height="17" rx="8.5" fill="#f0f4f5" stroke="#e2eaec"/><text x="${cx+w/2}" y="214" text-anchor="middle" font-size="8.5" fill="#8a9aa0">${t}</text>`;cx+=w+6;}
    out+=`<g><rect x="${r.x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="9" fill="#fff" stroke="#dfe6e8"/>
      <circle cx="${r.x+26}" cy="90" r="11" fill="${r.color}"/><text x="${r.x+26}" y="94" text-anchor="middle" font-size="11" font-weight="600" fill="#fff">${r.n}</text>
      <text x="${r.x+45}" y="95" font-size="13" font-weight="600" fill="#3f545c">${r.title}</text>
      <line x1="${r.x+18}" y1="112" x2="${r.x+cardW-18}" y2="112" stroke="#eef2f3"/>
      ${steps}${chips}</g>
      ${rects.indexOf(r)<3?arrow(r.x+cardW+6,r.x+cardW+38):''}`;
  }
  const loopFrom=rects[3].x+cardW/2,loopTo=rects[1].x+cardW/2;
  out+=`${arrow(rects[3].x+cardW+6,1126)}
    <rect x="1132" y="104" width="112" height="92" rx="9" fill="#147d74"/>
    <text x="1188" y="145" text-anchor="middle" font-size="12.5" font-weight="600" fill="#fff">成片视频</text>
    <text x="1188" y="164" text-anchor="middle" font-size="9.5" fill="#d5ebe3">MP4 · SRT 字幕</text>
    <text x="1188" y="180" text-anchor="middle" font-size="9.5" fill="#d5ebe3">剧本与素材包</text>
    <path d="M${loopFrom} 240 V284 H${loopTo} V246" fill="none" stroke="#b08d57" stroke-width="1.4" stroke-dasharray="5 4" marker-end="url(#pf-arrow-back)"/>
    <text x="${(loopFrom+loopTo)/2}" y="279" text-anchor="middle" font-size="10" fill="#a08757" stroke="#fff" stroke-width="4" paint-order="stroke">预览不满意：回到剧本与画面修改</text>
  </svg>`;
  return out;
}
function manualPage(){
  const cards=[
    {ico:'book',page:'characters',title:'① 角色设定',p:'从故事梗概拟定主要人物，确认资料后生成统一头像，作为剧本与插画的参考。'},
    {ico:'script',page:'script',title:'② 剧本与画面',p:'把故事拆成一幕一幕，编辑对白与旁白，为每个镜头撰写画面提示词并生成插画。'},
    {ico:'mic',page:'voices',title:'③ 角色配音',p:'为每位角色和旁白挑选音色，逐段生成声音，可以单独重做某一段。'},
    {ico:'video',page:'production',title:'④ 合成与导出',p:'按实际音频时长排列镜头与字幕，预览确认后导出 MP4、SRT 与素材包。'},
  ];
  return `<section class="page manual-page">
    ${pageHeading('使用手册','了解从故事想法到成片视频的完整路径，以及每一步在哪里完成。')}
    <h2 class="manual-chapter">小说生产管线</h2>
    <p class="manual-intro">一部视频小说按四个阶段推进：先立人物，再写剧本，然后配音，最后合成导出。每个阶段对应左侧导航的一个工作台页面，上一阶段的产出会作为下一阶段的输入。</p>
    <div class="pipeline-card">${manualPipelineSvg()}
      <p class="pipeline-caption">制作对象按「项目 → 剧集 → 幕」组织，一幕包含有序的对白、旁白段落与镜头。虚线表示成片预览不满意时，可回到剧本与画面阶段修改后重新导出。</p>
    </div>
    <div class="manual-stage-grid">${cards.map(c=>`<a class="manual-card" href="#${c.page}"><span class="manual-card-icon">${icon(c.ico)}</span><div><h2>${c.title}</h2><p>${c.p}</p><span class="manual-card-link">进入工作台${icon('arrow')}</span></div></a>`).join('')}</div>
    <div class="resource-note manual-milestone">${icon('clock')}生成能力按里程碑逐步接入：项目管理、模型配置与角色、剧本编辑已可用；AI 生成、本地配音与视频合成将在后续版本开放。</div>
  </section>`;
}
function settingsPage(){
  if(state.backend.status!=='ready')return `<section class="page resource-page">${pageHeading('模型与创作设置','供应商配置与 API Key 保存到本机 SQLite 数据库。')}<div class="resource-note">${icon('monitor')}${state.backend.status==='loading'?'正在加载本地配置…':`无法加载配置：${escapeHtml(state.backend.error)}`}</div>${state.backend.status==='error'?btn('重新连接','reload-settings','','refresh'):''}</section>`;
  const cap=state.capability, info=capabilityInfo[cap], providers=state.providers[cap], selected=state.defaults[cap];
  const defaultProvider=providers.find(p=>p.id===selected.provider);
  return `<section class="page resource-page">${pageHeading('模型与创作设置','每类能力可以接入多个供应商，并独立选择一个默认模型。')}
  <div class="settings-capability-tabs" role="tablist" aria-label="模型能力">${Object.entries(capabilityInfo).map(([key,c])=>`<button role="tab" aria-selected="${cap===key}" class="${cap===key?'active':''}" data-action="capability" data-capability="${key}">${icon(c.icon)}<span>${escapeHtml(c.name)}<small>${state.providers[key].length} 个供应商</small></span></button>`).join('')}</div>
  <div class="settings-layout"><div class="settings-panel providers-panel"><div class="providers-heading"><div><h2>${info.name}供应商</h2><p>${info.description}</p></div>${btn('添加供应商','add-provider','','plus')}</div>
  <div class="default-model-box"><span class="default-symbol">${icon('check')}</span><div><span>默认使用</span><strong>${escapeHtml(defaultProvider.name)}<small>${escapeHtml(selected.model)}</small></strong></div><button class="text-btn" data-action="choose-default">更换默认模型${icon('down')}</button></div>
  <p class="default-model-note">新任务默认使用此模型。切换默认项不会替换已有素材。</p>
  ${providers.map(p=>`<article class="provider-card"><div class="provider-card-heading"><span class="provider-icon">${icon(info.icon)}</span><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.url)}</p></div>${badge(p.hasKey?'密钥已配置':'未配置密钥',p.hasKey?'green':'neutral')}<button class="icon-btn" data-action="edit-provider" data-provider="${p.id}" aria-label="编辑${escapeHtml(p.name)}">${icon('settings')}</button></div><div class="provider-models">${p.models.map(m=>{const chosen=selected.provider===p.id&&selected.model===m;return `<div class="provider-model-row"><span class="model-name">${escapeHtml(m)}</span>${chosen?badge('默认模型','green'):`<button class="set-default-btn" data-action="set-default" data-provider="${p.id}" data-model="${escapeHtml(m)}">设为默认</button>`}</div>`;}).join('')}</div><div class="provider-card-footer"><span>${p.models.length} 个模型</span><button class="text-btn" data-action="edit-provider" data-provider="${p.id}">管理模型${icon('chevron')}</button><button class="text-btn" data-action="test-connection">${icon('refresh')}测试连接</button></div></article>`).join('')}
  <button class="add-provider-row" data-action="add-provider">${icon('plus')}为${info.name}接入另一个供应商</button><p class="prototype-note">供应商与默认模型已持久化到本机。API Key 保存到 SQLite，不回传浏览器；数据库备份包含密钥。实际模型连接测试将在 M3 接入。</p></div>
  <div class="settings-panel local-settings-panel"><h2>本地配音</h2><p>在 Apple Silicon Mac 上生成角色声音。</p><div class="local-engine"><span>${icon('monitor')}</span><div><strong>Qwen3-TTS</strong><small>通过 MLX-Audio 运行</small></div>${badge('待连接')}</div><label class="field-label" for="tts-model">配音模型</label><select id="tts-model"><option>1.7B CustomVoice · 8bit</option><option>0.6B CustomVoice · 8bit</option></select><label class="field-label" for="local-address">本地服务地址</label><input id="local-address" value="http://127.0.0.1:8000"><div class="hardware-summary"><div><span>芯片</span><strong>Apple M1</strong></div><div><span>内存</span><strong>16 GB</strong></div><div><span>生成方式</span><strong>逐段排队</strong></div></div>${btn('检查本地服务','check-local','full-width','refresh')}<p class="local-note">模型下载完成后可本地生成。Web 前端通过应用后端连接本地配音服务。</p><div class="default-summary"><h3>三类默认模型</h3>${Object.entries(capabilityInfo).map(([k,c])=>{const d=state.defaults[k],p=state.providers[k].find(x=>x.id===d.provider);return `<div>${icon(c.icon)}<span>${escapeHtml(c.name)}<small>${escapeHtml(p.name)} / ${escapeHtml(d.model)}</small></span></div>`;}).join('')}</div></div></div></section>`;
}
function providerModal(providerId){
  const cap=state.capability, info=capabilityInfo[cap];
  const provider=providerId?state.providers[cap].find(p=>p.id===providerId):null;
  modal(provider?'编辑供应商':'添加供应商',`<span class="provider-cap-label">${icon(info.icon)}${info.name}</span><label class="field-label" for="provider-name">供应商名称</label><input id="provider-name" value="${provider?escapeHtml(provider.name):''}" placeholder="例如：我的模型网关"><label class="field-label" for="provider-url">API Base URL</label><input id="provider-url" value="${provider?escapeHtml(provider.url):''}" placeholder="https://api.example.com/v1"><label class="field-label" for="provider-protocol">接口类型</label><select id="provider-protocol"><option>兼容接口 / 对应能力适配器</option></select><label class="field-label" for="provider-key">API Key</label><input id="provider-key" type="password" placeholder="${provider?.hasKey?'已保存密钥，留空保留；填写可替换':'输入 API Key，保存在 SQLite'}" autocomplete="off"><label class="field-label" for="provider-model-list">可用模型</label><textarea id="provider-model-list" rows="3" placeholder="每行一个模型 ID">${provider?escapeHtml(provider.models.join('\n')):''}</textarea><p class="muted">配置与密钥保存到 SQLite；密钥不会回传浏览器。留空保留已有密钥。各能力的实际连接测试将在 M3 完成。</p>`,btn('取消','close-modal')+`<button class="btn primary" data-action="save-provider" data-provider="${providerId||''}">${icon('check')}保存配置</button>`);
}
function agentPanel(){return `<aside class="agent-panel"><div class="agent-panel-header"><span class="agent-orb">${icon('spark')}</span><h2>创作助手</h2><button class="icon-btn" data-action="close-agent" aria-label="关闭创作助手">${icon('close')}</button></div><div class="agent-context">${icon('script')}第 ${state.scene+1} 幕 · ${scenes[state.scene].title}</div><div class="agent-messages"><div class="agent-welcome"><span>${icon('book')}</span><h3>一起打磨这一幕</h3><p>告诉我希望改变什么。文字、画面提示词，都可以从一个小地方开始。</p></div>${['让对白更自然一些','减少旁白，保留关键线索','为这幕设计一个特写镜头'].map(t=>`<button class="agent-suggestion" data-action="agent-suggestion" data-text="${t}">${t}${icon('arrow')}</button>`).join('')}</div><form class="agent-input" id="agent-form"><textarea aria-label="对创作助手的要求" placeholder="说说你想怎么修改这一幕…" rows="3"></textarea><div><span>修改建议由你决定是否采纳</span><button class="icon-btn" type="submit" aria-label="发送修改要求">${icon('send')}</button></div></form></aside>`;}
function render(){ document.getElementById('app').innerHTML=shell(); }
function toast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),3500);}
function modal(title,body,footer=''){document.getElementById('dialog-content').innerHTML=`<div class="modal-heading"><h2>${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="关闭弹窗">${icon('close')}</button></div><div class="modal-body">${body}</div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;document.getElementById('dialog').showModal();}
function go(page){history.pushState(null,'',`#${page}`);navigate();}
function navigate(){const p=location.hash.slice(1);state.page=['projects','characters','script','voices','production','skills','settings','manual'].includes(p)?p:'script';state.agent=false;render();}
window.addEventListener('hashchange',navigate);
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href^="#"]');
  if(link){
    const page=link.getAttribute('href').slice(1);
    if(['projects','characters','script','voices','production','skills','settings','manual'].includes(page)){
      e.preventDefault();history.pushState(null,'',`#${page}`);navigate();return;
    }
  }
  const el=e.target.closest('[data-action]');if(!el)return;const a=el.dataset.action;
  if(a==='scene'){state.scene=Number(el.dataset.index);state.tab='dialogue';state.shot=0;render();}
  else if(a==='shot'){state.shot=Number(el.dataset.index);render();}
  else if(a==='tab'){state.tab=el.dataset.tab;render();}
  else if(a==='select-character'){state.character=el.dataset.character;render();}
  else if(a==='confirm-character'){
    const c=characters[state.character];
    if(!c.name.trim()||!c.bio.trim()||!c.avatarPrompt.trim()){toast('请填写姓名、角色介绍和头像提示词');return;}
    api(`/characters/${c.id}`,{method:'PATCH',body:JSON.stringify({confirmed:true})}).then(saved=>{characters[c.id]=saved;render();toast('角色资料已确认并保存');}).catch(e=>toast(e.message));
  }
  else if(a==='confirm-cast'){
    const cast=Object.values(characters).filter(c=>!c.isNarrator);
    const incomplete=cast.find(c=>!c.name.trim()||!c.bio.trim()||!c.avatarPrompt.trim());
    if(incomplete){state.character=incomplete.id;render();toast('请补齐角色姓名、介绍和头像提示词');return;}
    Promise.all(cast.map(c=>api(`/characters/${c.id}`,{method:'PATCH',body:JSON.stringify({confirmed:true})})))
      .then(saved=>{for(const s of saved)characters[s.id]=s;go('script');toast('角色资料已确认，进入剧本工作台');})
      .catch(e=>toast(e.message));
  }
  else if(a==='go-cast')go('characters');
  else if(a==='avatar-model-settings'){state.capability='image';go('settings');}
  else if(a==='generate-cast'){
    const d=state.defaults.text,p=state.providers.text.find(x=>x.id===d.provider);
    modal('AI 生成主要角色',`<div class="modal-notice">${icon('spark')}根据故事梗概拟定角色信息</div><p>为每位主要角色生成姓名、昵称、角色介绍和头像提示词。先审阅资料，再交给图片模型生成头像。</p><div class="plan-row"><span>文本模型</span><strong>${escapeHtml(p.name)} / ${escapeHtml(d.model)}</strong></div><label class="field-label" for="cast-request">补充要求</label><textarea id="cast-request" rows="3">${escapeHtml(state.project.synopsis||'')}</textarea><p class="muted">文本生成将在 M4 接入；当前原型不会调用模型或覆盖已有资料。</p>`,btn('取消','close-modal')+btn('生成角色草稿','demo-generation','primary','spark'));
  }
  else if(a==='generate-avatar'){
    const c=characters[state.character],d=state.defaults.image,p=state.providers.image.find(x=>x.id===d.provider);
    if(!c.avatarPrompt.trim()){toast('请先填写头像生成提示词');return;}
    modal('生成角色头像',`<div class="avatar-generation-brief">${avatar(state.character)}<div><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.nickname||'')}</span></div></div><label class="field-label">将发送给图片模型的提示词</label><p class="avatar-prompt-preview">${escapeHtml(c.avatarPrompt)}</p><div class="plan-row"><span>图片模型</span><strong>${escapeHtml(p.name)} / ${escapeHtml(d.model)}</strong></div><div class="plan-row"><span>生成规格</span><strong>1:1 方形肖像，1 张</strong></div><p class="muted">图片生成将在 M5 接入；新图会作为候选，采用后同步各处头像。</p>`,btn('取消','close-modal')+btn('生成头像','demo-generation','primary','image'));
  }
  else if(a==='add-character')modal('添加角色',`<label class="field-label" for="add-character-name">姓名</label><input id="add-character-name" placeholder="角色姓名"><label class="field-label" for="add-character-nickname">昵称</label><input id="add-character-nickname" placeholder="角色别名"><label class="field-label" for="add-character-role">故事身份</label><select id="add-character-role"><option>主角</option><option>重要配角</option><option>关键角色</option><option selected>配角</option></select><label class="field-label" for="add-character-bio">角色介绍</label><textarea id="add-character-bio" rows="3" placeholder="背景、性格，以及在故事中的作用"></textarea>`,btn('取消','close-modal')+btn('创建角色','create-character','primary','plus'));
  else if(a==='create-character'){
    const name=document.getElementById('add-character-name').value.trim();
    if(!name){toast('请先填写角色姓名');return;}
    const payload={name,nickname:document.getElementById('add-character-nickname').value.trim(),role:document.getElementById('add-character-role').value,bio:document.getElementById('add-character-bio').value.trim(),avatarPrompt:''};
    el.disabled=true;
    api(`/projects/${state.project.id}/characters`,{method:'POST',body:JSON.stringify(payload)})
      .then(saved=>{characters[saved.id]={...saved,avatarStale:false,_savedPrompt:saved.avatarPrompt};state.character=saved.id;document.getElementById('dialog').close();render();toast('角色已创建，编辑资料后会自动保存');})
      .catch(e=>{toast(e.message);el.disabled=false;});
  }
  else if(a==='go-voices')go('voices');
  else if(a==='go-script')go('script');
  else if(a==='close-modal')document.getElementById('dialog').close();
  else if(a==='confirm-scene'){
    const scene=scenes[state.scene];
    if(scene.status==='done'){toast('本幕内容已确认；修改文字后会重新回到待编辑状态。');return;}
    api(`/scenes/${scene.id}`,{method:'PATCH',body:JSON.stringify({status:'done'})})
      .then(()=>{scene.status='done';render();toast('本幕内容已确认');})
      .catch(e=>toast(e.message));
  }
  else if(a==='agent'){state.agent=true;render();}
  else if(a==='close-agent'){state.agent=false;render();}
  else if(a==='agent-suggestion'){document.querySelector('#agent-form textarea').value=el.dataset.text;document.querySelector('#agent-form textarea').focus();}
  else if(a==='skill-toggle'||a==='subtitle-toggle'){const on=el.classList.toggle('on');el.setAttribute('aria-pressed',String(on));if(a==='subtitle-toggle'){document.querySelector('.preview-caption').hidden=!on;document.querySelector('.subtitle-example').style.opacity=on?'1':'.3';}}
  else if(a==='expand-art')modal('镜头预览',`<div class="expanded-art">${artwork(['station','letter','road'][state.shot])}</div><p>镜头 ${state.shot+1} · 电影感插画 · 16:9</p>`);
  else if(a==='preview-play'){state.playing=!state.playing;document.querySelectorAll('[data-action="preview-play"]').forEach(b=>{b.innerHTML=icon(state.playing?'pause':'play');});toast('已切换播放控件状态。当前为视觉原型，没有视频文件。');}
  else if(a==='voice-preview'){const c=characters[el.dataset.character];toast(`已为${c.name}选择 ${c.voice||(c.isNarrator?'Uncle_Fu':'Serena')} 音色；接入 TTS 后可试听（M6）。`);}
  else if(a==='batch-voice')modal('开始批量配音',`<div class="modal-notice">${icon('mic')}配音在 M6 接入本地 TTS</div><p>将为 ${Object.keys(characters).length} 位说话人的 ${totalParagraphs()} 段文字生成独立 MP3。</p><div class="plan-row"><span>引擎</span><strong>本地 Qwen3-TTS 1.7B</strong></div><div class="plan-row"><span>内容状态</span><strong>${scenes.filter(s=>s.status!=='done').length} 幕待确认</strong></div><p class="muted">正式生成前需要确认全部内容并连接本地 TTS 服务。</p>`,btn('返回确认内容','modal-go-script')+btn('了解配音设置','modal-go-settings','primary'));
  else if(a==='modal-go-script'){document.getElementById('dialog').close();go('script');}
  else if(a==='modal-go-settings'){document.getElementById('dialog').close();go('settings');}
  else if(a==='project-settings')modal('项目设定',`<label class="field-label" for="story-name">故事名称</label><input id="story-name" value="${escapeHtml(state.project.name)}"><label class="field-label" for="story-synopsis">故事梗概</label><textarea id="story-synopsis" aria-label="故事梗概" rows="4">${escapeHtml(state.project.synopsis||'')}</textarea><p class="muted">保存到本机数据库。题材、时长与画风等创作参数将在后续里程碑补充。</p>`,btn('取消','close-modal')+btn('保存设定','save-project-settings','primary','check'));
  else if(a==='save-project-settings'){
    const name=document.getElementById('story-name').value.trim(),synopsis=document.getElementById('story-synopsis').value.trim();
    if(!name){toast('故事名称不能为空');return;}
    api(`/projects/${state.project.id}`,{method:'PATCH',body:JSON.stringify({name,synopsis})})
      .then(saved=>{state.project.name=saved.name;state.project.synopsis=saved.synopsis;render();toast('项目设定已保存');})
      .catch(e=>toast(e.message));
  }
  else if(a==='new-project')modal('开始一个新故事',`<p>先写下一点灵感，其他的可以慢慢补齐。新项目从空白开始。</p><label class="field-label" for="new-title">故事名称</label><input id="new-title" placeholder="给故事取个名字"><label class="field-label" for="new-story">故事想法或已有小说</label><textarea id="new-story" placeholder="谁，在什么地方，遇到了什么事？" rows="5"></textarea><div class="import-placeholder">${icon('folder')}导入 TXT 或 Markdown 文稿将在 M4 支持</div>`,btn('取消','close-modal')+btn('创建项目','create-project','primary','plus'));
  else if(a==='create-project'){
    const name=document.getElementById('new-title').value.trim();
    if(!name){toast('请先给故事取个名字');return;}
    el.disabled=true;el.textContent='创建中…';
    api('/projects',{method:'POST',body:JSON.stringify({name,synopsis:document.getElementById('new-story').value.trim()})})
      .then(async saved=>{await loadProjectList();await openProject(saved.id);document.getElementById('dialog').close();go('characters');toast('已创建空白项目，从角色设定开始');})
      .catch(e=>{toast(e.message);el.disabled=false;el.textContent='创建项目';});
  }
  else if(a==='open-project'){el.disabled=true;openProject(el.dataset.id).then(()=>go('characters'));}
  else if(a==='add-scene'){
    api(`/projects/${state.project.id}/scenes`,{method:'POST',body:JSON.stringify({title:`第 ${scenes.length+1} 幕`})})
      .then(created=>{scenes.push({...created,place:'',summary:'',paragraphs:[],shots:[]});state.scene=scenes.length-1;state.tab='dialogue';state.shot=0;render();toast('已添加新的一幕');})
      .catch(e=>toast(e.message));
  }
  else if(a==='add-shot'){
    const scene=scenes[state.scene];
    api(`/scenes/${scene.id}/shots`,{method:'POST',body:JSON.stringify({prompt:''})})
      .then(created=>{scene.shots.push(created);state.shot=scene.shots.length-1;render();toast('已添加镜头，填写提示词后自动保存');})
      .catch(e=>toast(e.message));
  }
  else if(a==='demo-save'){document.getElementById('dialog').close();toast('已记录本次演示操作；正式功能将在后续里程碑接入。');}
  else if(a==='outline')modal('故事大纲',`<p class="modal-lead">${escapeHtml(state.project.name)}</p><p>${escapeHtml(state.project.synopsis||'还没有故事梗概。')}</p><ol class="outline-list">${scenes.map(s=>`<li><strong>${escapeHtml(s.title)}</strong><span>${escapeHtml(s.place||'未设置地点')} · ${s.paragraphs.length} 段</span></li>`).join('')||'<li><strong>还没有分幕</strong></li>'}</ol>`);
  else if(a==='history')modal('本幕版本',`<div class="history-item"><span class="status-dot"></span><div><strong>当前版本</strong><p>人工编辑 · 今天 19:24</p></div>${badge('采用中','green')}</div><div class="history-item"><span class="status-dot neutral"></span><div><strong>初始剧本</strong><p>写作 Skill · 今天 19:10</p></div>${btn('查看','history-preview','small-btn')}</div><p class="muted">以上为版本记录样式示意。</p>`);
  else if(a==='polish')modal('润色这一幕',`<div class="modal-notice">${icon('spark')}去 AI 味 Skill</div><p>保留本幕情节、说话人和关键线索，只调整表达方式。</p><label class="field-label">希望如何修改</label><textarea aria-label="润色要求" rows="3">让对白更口语化，林晚的情绪更克制，减少直接解释心理的句子。</textarea><p class="muted">生成后先对比差异，由你选择采纳。</p>`,btn('取消','close-modal')+btn('生成润色建议','demo-generation','primary','spark'));
  else if(a==='dynamic')modal('让画面动起来',`<div class="modal-art">${artwork(['station','letter','road'][state.shot])}</div><label class="field-label">动态镜头提示词</label><textarea aria-label="动态镜头提示词" rows="3">雨缓缓落下，站台灯光轻轻闪烁，镜头缓慢向人物推近。</textarea><div class="form-grid"><div><label class="field-label">模型</label><select aria-label="视频模型"><option>Agnes Video v2.0</option></select></div><div><label class="field-label">时长</label><select aria-label="镜头时长"><option>约 5 秒</option></select></div></div>`,btn('取消','close-modal')+btn('生成动态镜头','demo-generation','primary','video'));
  else if(a==='export-settings'||a==='export')modal(a==='export'?'导出你的作品':'导出设置',`<div class="modal-notice">${icon('video')}${escapeHtml(state.project?state.project.name:'未打开项目')} · 第 01 集</div><div class="plan-row"><span>画面</span><strong>1920 × 1080 / 30 fps</strong></div><div class="plan-row"><span>格式</span><strong>MP4 · H.264</strong></div><div class="plan-row"><span>字幕</span><strong>内嵌字幕 + SRT</strong></div><p class="muted">原型展示导出流程。完成配音、确认时间轴并接入渲染服务（M8）后，可生成真实视频。</p>`,btn('继续编辑','close-modal')+btn('确认导出设置','demo-save','primary','check'));
  else if(a==='characters'){const first=Object.values(characters).find(c=>!c.isNarrator);if(first)state.character=first.id;go('characters');}
  else if(a==='binding')modal('关联文字段落',`<p>选择这幅画面展示期间播放的文字（镜头绑定在 M7 完整生效）。</p>${scenes[state.scene]?scenes[state.scene].paragraphs.map((p,i)=>`<label class="binding-option"><input type="checkbox" ${i<2?'checked':''}><span><strong>${escapeHtml((characters[p.characterId]||{name:'未知'}).name)}</strong><small>${escapeHtml(p.text)}</small></span></label>`).join(''):'<p class="muted">本幕没有段落。</p>'}`,btn('取消','close-modal')+btn('确认关联','demo-save','primary'));
  else if(a==='voice-lines')modal('待生成段落',`<p>以下为当前幕的配音文本。</p>${scenes[state.scene]?scenes[state.scene].paragraphs.map(p=>{const c=characters[p.characterId]||{};return `<div class="voice-line-item">${avatar(p.characterId,true)}<div><strong>${escapeHtml(c.name||'未知')} <span>${escapeHtml(c.voice||'Serena')}</span></strong><p>${escapeHtml(p.text)}</p></div></div>`;}).join(''):'<p class="muted">本幕没有段落。</p>'}`);
  else if(a==='add-paragraph')modal('添加一段文字',`<label class="field-label">说话人</label><select id="new-speaker" aria-label="新段落说话人">${Object.entries(characters).map(([k,c])=>`<option value="${k}">${escapeHtml(c.name)}</option>`).join('')}</select><label class="field-label">文案</label><textarea id="new-paragraph" rows="4" placeholder="写下这一段对白或旁白…"></textarea>`,btn('取消','close-modal')+btn('添加段落','save-paragraph','primary','plus'));
  else if(a==='save-paragraph'){
    const text=document.getElementById('new-paragraph').value.trim();
    if(!text){toast('请先填写文案');return;}
    const characterId=document.getElementById('new-speaker').value;
    api(`/scenes/${scenes[state.scene].id}/paragraphs`,{method:'POST',body:JSON.stringify({characterId,kind:(characters[characterId]||{}).isNarrator?'narration':'dialogue',text})})
      .then(created=>{scenes[state.scene].paragraphs.push(created);scenes[state.scene].status='draft';document.getElementById('dialog').close();render();toast('已添加段落并保存');})
      .catch(e=>toast(e.message));
  }
  else if(a==='timeline-scene'){const i=Number(el.dataset.index);if(scenes[i]){state.scene=i;state.shot=0;go('script');}}
  else if(a==='help')modal('从一幕开始，完成一部作品',`<ol class="help-list"><li><strong>角色设定</strong><p>根据故事拟定主要人物，编辑姓名、昵称、介绍和头像提示词，再生成头像。</p></li><li><strong>剧本与画面</strong><p>直接编辑对白，切换幕和镜头，对照画面打磨故事。</p></li><li><strong>角色配音</strong><p>为角色和旁白选择声音，逐段试听后批量生成。</p></li><li><strong>视频工作台</strong><p>检查字幕和镜头时间轴，确认后导出作品。</p></li></ol><p class="muted">当前为 UI/UE 原型。所有生成、试听、连接与导出入口仅演示流程。</p>`);
  else if(a==='skill-detail')modal(`${el.dataset.name}配置`,`<p>按创作阶段加载 Skill 的指令与参考资料，保留来源和版本。</p><div class="plan-row"><span>应用范围</span><strong>当前项目</strong></div><div class="plan-row"><span>集成状态</span><strong>候选，待适配</strong></div><p class="muted">原型不执行外部 Skill 或脚本。</p>`);
  else if(a==='import-skill')modal('导入 Skill',`<label class="field-label">仓库地址或本地目录</label><input placeholder="包含 SKILL.md 的来源地址" aria-label="Skill 来源"><div class="import-placeholder">${icon('folder')}选择 Skill 文件夹或压缩包</div><p class="muted">导入后检查依赖、来源和版本，再配置适用阶段。</p>`,btn('取消','close-modal')+btn('检查 Skill','demo-generation','primary'));
  else if(a==='subtitle-settings')modal('字幕样式',`<label class="field-label">字体</label><select aria-label="字幕字体"><option>苹方</option><option>宋体</option></select><label class="field-label">字号</label><input type="range" min="20" max="60" value="32" aria-label="字幕字号"><label class="checkbox-row"><input type="checkbox" checked>显示黑色描边</label><p class="muted">字幕默认位于画面底部安全区。</p>`,btn('关闭','close-modal')+btn('确认样式','demo-save','primary'));
  else if(a==='demo-generation'){document.getElementById('dialog').close();toast('生成流程已展示；此原型未接入生成服务。');}
  else if(a==='filter-projects'){document.querySelectorAll('.project-filter-tabs button').forEach(b=>b.classList.remove('active'));el.classList.add('active');}
  else if(a==='regenerate')toast('单图重生成入口：接入图像服务后，将保存为新的候选版本。');
  else if(a==='project-menu')modal('项目与创作资源',`<div class="menu-shortcuts"><button class="btn full-width" data-action="menu-settings">${icon('settings')}模型与设置</button><button class="btn full-width" data-action="menu-skills">${icon('layers')}我的 Skills</button><button class="btn full-width" data-action="project-settings">${icon('book')}项目设定</button></div>`);
  else if(a==='menu-settings'||a==='menu-skills'){document.getElementById('dialog').close();go(a==='menu-settings'?'settings':'skills');}
  else if(a==='capability'){state.capability=el.dataset.capability;render();}
  else if(a==='add-provider')providerModal();
  else if(a==='edit-provider')providerModal(el.dataset.provider);
  else if(a==='set-default'){persistDefault(state.capability,el.dataset.provider,el.dataset.model);}
  else if(a==='choose-default'){modal('选择默认模型',`<p>为${capabilityInfo[state.capability].name}选择一个默认模型。</p>${state.providers[state.capability].map(p=>`<div class="default-picker-group"><h3>${escapeHtml(p.name)}</h3>${p.models.map(m=>`<button class="default-picker-option" data-action="pick-default" data-provider="${p.id}" data-model="${escapeHtml(m)}">${escapeHtml(m)}${state.defaults[state.capability].provider===p.id&&state.defaults[state.capability].model===m?icon('check'):icon('chevron')}</button>`).join('')}</div>`).join('')}`);}
  else if(a==='pick-default'){persistDefault(state.capability,el.dataset.provider,el.dataset.model);}
  else if(a==='reload-settings')loadSettings();
  else if(a==='save-provider'){
    const name=document.getElementById('provider-name').value.trim(), url=document.getElementById('provider-url').value.trim();
    const models=[...new Set(document.getElementById('provider-model-list').value.split('\n').map(m=>m.trim()).filter(Boolean))];
    if(!name||!url||!models.length){toast('请填写供应商名称、地址和至少一个模型 ID');return;}
    try{const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol))throw new Error();}catch{toast('请填写有效的 HTTP 或 HTTPS 地址');return;}
    const cap=state.capability, providerId=el.dataset.provider;
    const keyInput=document.getElementById('provider-key');
    const payload={capability:cap,name,url,models,apiKey:keyInput.value||null};
    keyInput.value='';el.disabled=true;el.textContent='保存中…';
    api(providerId?`/providers/${providerId}`:'/providers',{method:providerId?'PUT':'POST',body:JSON.stringify(payload)})
      .then(data=>{applySettings(data);document.getElementById('dialog').close();render();toast('供应商配置已保存到本机');})
      .catch(error=>{toast(error.message);el.disabled=false;el.textContent='保存配置';});
  }
  else if(a==='test-connection'||a==='check-local')toast('当前为界面原型，尚未连接模型或本地 TTS 服务。');
  else if(a==='upload')toast('图片替换入口已预留，当前使用本地示例插画。');
  else if(a==='provider')modal(`配置${el.dataset.name}`,`<label class="field-label">供应商</label><select aria-label="供应商"><option>Agnes AI</option><option>自定义兼容供应商</option></select><p class="muted">可按能力独立选择供应商与模型。</p>`,btn('关闭','close-modal'));
  else toast('此操作为原型展示，后续接入对应功能。');
});
document.addEventListener('input',e=>{
  if(e.target.matches('[data-character-field]')){
    const c=characters[state.character],field=e.target.dataset.characterField;
    c[field]=e.target.value;c.confirmed=false;
    if(field==='avatarPrompt'&&c.avatarUrl){c.avatarStale=true;const status=document.querySelector('.avatar-state');if(status){status.classList.add('stale');status.innerHTML=icon('clock')+'<span>提示词已修改，当前示例图尚未更新</span>';}}
    const button=document.querySelector('.cast-profile-footer .btn');if(button){button.className='btn primary';button.innerHTML=icon('check')+'确认角色资料';}
    const selected=document.querySelector('.cast-list-item.selected');if(selected){selected.querySelector('.cast-confirm-icon')?.remove();if(field==='name')selected.querySelector('strong').textContent=c.name;if(field==='nickname')selected.querySelector('small').textContent=`${c.role} · ${c.nickname||'未设置昵称'}`;}
    const hint=document.querySelector('.cast-list-hint');if(hint)hint.textContent=`${Object.values(characters).filter(p=>!p.isNarrator&&p.confirmed).length} / ${Object.values(characters).filter(p=>!p.isNarrator).length} 位资料已确认`;
    if(field==='name'){const heading=document.querySelector('.cast-profile-heading h2');if(heading)heading.textContent=c.name;const usage=document.querySelector('.avatar-usage-preview strong');if(usage)usage.textContent=c.name;}
    const badgeEl=document.querySelector('.cast-profile-heading .badge');if(badgeEl){badgeEl.className='badge neutral';badgeEl.textContent='待确认';}
    scheduleSave(`char-${c.id}-${field}`,()=>{
      api(`/characters/${c.id}`,{method:'PATCH',body:JSON.stringify({[field]:c[field]})}).catch(error=>toast(error.message));
    });
  }
  if(e.target.matches('[data-paragraph]')){
    const scene=scenes[state.scene];
    const p=scene&&scene.paragraphs[Number(e.target.dataset.paragraph)];
    if(p){
      p.text=e.target.textContent;
      if(scene.status==='done'){scene.status='draft';}
      const footer=document.querySelector('.script-footer .btn');if(footer){footer.className='btn primary small-btn';footer.innerHTML=icon('lock')+'确认本幕内容';}
      const item=document.querySelector('.scene-item.selected .scene-state');if(item){item.className='scene-state';item.textContent='待编辑';}
      scheduleSave(`para-${p.id}`,()=>{api(`/paragraphs/${p.id}`,{method:'PATCH',body:JSON.stringify({text:p.text})}).catch(error=>toast(error.message));});
    }
  }
  if(e.target.matches('[data-shot-prompt]')){
    const scene=scenes[state.scene];
    const shot=scene&&scene.shots[Number(e.target.dataset.shotPrompt)];
    if(shot){shot.prompt=e.target.value;scheduleSave(`shot-${shot.id}`,()=>{api(`/shots/${shot.id}`,{method:'PATCH',body:JSON.stringify({prompt:shot.prompt})}).catch(error=>toast(error.message));});}
  }
  if(e.target.matches('[data-search="project"]')){
    const query=e.target.value.trim();
    document.querySelectorAll('.project-card').forEach(card=>{card.hidden=!!query&&!card.dataset.name.includes(query);});
  }
});
document.addEventListener('change',e=>{
  if(e.target.matches('select[data-character-field]')){
    const c=characters[state.character],field=e.target.dataset.characterField;
    c[field]=e.target.value;c.confirmed=false;
    api(`/characters/${c.id}`,{method:'PATCH',body:JSON.stringify({[field]:c[field]})}).then(()=>render()).catch(error=>toast(error.message));
  }
  if(e.target.matches('[data-voice]')){
    const key=e.target.dataset.voice,c=characters[key];
    c.voice=e.target.value;
    api(`/characters/${key}`,{method:'PATCH',body:JSON.stringify({voice:c.voice})}).then(()=>toast('音色已保存到角色档案')).catch(error=>toast(error.message));
  }
  if(e.target.id==='ratio-select'){document.querySelector('.video-preview').classList.toggle('portrait',e.target.value==='9:16');}
});
document.addEventListener('submit',e=>{if(e.target.id==='agent-form'){e.preventDefault();const input=e.target.querySelector('textarea');if(!input.value.trim())return;const messages=document.querySelector('.agent-messages');messages.insertAdjacentHTML('beforeend',`<div class="user-message">${escapeHtml(input.value)}</div><div class="assistant-message">已收到这次修改要求。这里展示对话流程，接入模型后会给出可对比、可采纳的修改建议。</div>`);input.value='';messages.scrollTop=messages.scrollHeight;}});
document.getElementById('dialog').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close();});
navigate();
loadSettings().then(async()=>{
  await loadProjectList();
  const target=projectList.find(p=>p.id==='demo-story')||projectList[0];
  if(target)await openProject(target.id);
  render();
});
