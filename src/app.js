/* ===== Means & Ends game engine ===== */
'use strict';
const KEY='meansandends.v1';
const QS=prepContent();
const MAXH=5,HEART_MS=30*60*1000,SRS_GAP=[1,3,7,14,30];
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
const reduce=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pickOne=a=>a[Math.floor(Math.random()*a.length)];
const pad=n=>String(n).padStart(2,'0');
const dstr=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>dstr(new Date());
const addDays=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return dstr(d)};
const weekStart=()=>{const d=new Date();const k=(d.getDay()+6)%7;d.setDate(d.getDate()-k);return dstr(d)};

/* ---------- icons ---------- */
const IC={
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>',
 x:'<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
 star:'<path d="M12 2.5l2.8 6.1 6.7.7-5 4.5 1.4 6.6L12 17l-5.9 3.4 1.4-6.6-5-4.5 6.7-.7z"/>',
 lock:'<path d="M7 10V7a5 5 0 0 1 10 0v3h.5A1.5 1.5 0 0 1 19 11.5v8a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-8A1.5 1.5 0 0 1 6.5 10zm2.5 0h5V7a2.5 2.5 0 0 0-5 0z"/>',
 flame:'<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/>',
 heart:'<path d="M12 21s-8-5.2-8-11.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.8 12 21 12 21z"/>',
 down:'<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
 up:'<path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
 book:'<path d="M3 5.5C3 4.1 4.1 3 5.5 3H11v16H5.5A2.5 2.5 0 0 0 3 21.5zM21 5.5C21 4.1 19.9 3 18.5 3H13v16h5.5a2.5 2.5 0 0 1 2.5 2.5z"/>',
 bell:'<path d="M2 10h2.5V8a1.5 1.5 0 0 1 3 0v8a1.5 1.5 0 0 1-3 0v-2H2zm20 0h-2.5V8a1.5 1.5 0 0 0-3 0v8a1.5 1.5 0 0 0 3 0v-2H22zM8.5 10.5h7v3h-7z"/>',
 friends:'<circle cx="9" cy="8" r="4"/><path d="M1.5 20a7.5 7.5 0 0 1 15 0v1h-15z"/><circle cx="17.5" cy="8.5" r="3"/><path d="M18 13.5a6 6 0 0 1 4.5 6V21h-4.3v-1a9 9 0 0 0-2-5.7c.6-.5 1.2-.8 1.8-.8z"/>',
 user:'<circle cx="12" cy="7.5" r="4.5"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0v.5h-17z"/>',
 doc:'<path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V9h5.5zM8 13v2h8v-2zm0 4v2h5v-2z"/>',
 chart:'<path d="M4 20V10h4v10zm6 0V4h4v16zm6 0v-7h4v7z"/>',
 pin:'<path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.500z"/>',
 pen:'<path d="M4 20l1-5L16.5 3.5a2.100 2.100 0 0 1 3 0l1 1a2.100 2.100 0 0 1 0 3L9 19z"/>',
 bulb:'<path d="M12 2a7 7 0 0 1 4 12.700V17H8v-2.300A7 7 0 0 1 12 2zM8.500 19h7v1.500a1.500 1.500 0 0 1-1.500 1.500h-4a1.500 1.500 0 0 1-1.500-1.500z"/>',
 trophy:'<path d="M7 3h10v2h4v3a5 5 0 0 1-4.600 5A5.500 5.500 0 0 1 13 15.900V19h3.500v2h-9v-2H11v-3.100A5.500 5.500 0 0 1 7.600 13 5 5 0 0 1 3 8V5h4zm0 4H5v1a3 3 0 0 0 2 2.800zm10 0v3.800A3 3 0 0 0 19 8V7z"/>'
};
const ic=(n,s)=>'<svg width="'+(s||22)+'" height="'+(s||22)+'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+IC[n]+'</svg>';

/* ---------- state ---------- */
let st;
function fresh(){return {v:1,name:'',track:'g8',xp:0,days:{},goal:20,streak:0,lastDay:'',hearts:MAXH,heartAt:0,done:{},cp:{},srs:{},mistakes:[],theme:'auto',ob:false,lb:{joined:false,id:'',name:''},rem:{on:false,freq:'off',hour:19,id:'',key:''},right:0,wrong:0}}
function load(){st=fresh();try{const o=JSON.parse(localStorage.getItem(KEY)||'null');if(o&&o.v===1){Object.assign(st,o);st.lb=Object.assign(fresh().lb,o.lb||{});st.rem=Object.assign(fresh().rem,o.rem||{})}}catch(e){}
 if(!TRACKS.some(t=>t.id===st.track))st.track='g8';
 /* The Live Desk is rewritten each month: when its date stamp changes, it opens up to be played again. */
 const lv=UNITS.find(u=>u.id==='live');if(lv&&st.liveStamp!==lv.stamp){Object.keys(st.done).forEach(k=>{if(k.indexOf('live/')===0)delete st.done[k]});delete st.cp.live;st.mistakes=st.mistakes.filter(id=>id.indexOf('live.')!==0);st.liveStamp=lv.stamp}
st.mistakes=st.mistakes.filter(id=>QS[id])}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}lbPush();remPush()}
function heartsTick(){if(st.hearts>=MAXH){st.heartAt=0;return}if(!st.heartAt)st.heartAt=Date.now();const n=Math.floor((Date.now()-st.heartAt)/HEART_MS);if(n>0){st.hearts=Math.min(MAXH,st.hearts+n);st.heartAt=st.hearts>=MAXH?0:st.heartAt+n*HEART_MS}}
function loseHeart(){heartsTick();if(st.hearts>0){st.hearts--;if(!st.heartAt)st.heartAt=Date.now()}}
function nextHeartIn(){if(st.hearts>=MAXH||!st.heartAt)return '';const ms=Math.max(0,st.heartAt+HEART_MS-Date.now());return Math.floor(ms/60000)+':'+pad(Math.floor(ms/1000)%60)}
function dayXP(){return st.days[today()]||0}
function liveStreak(){return (st.lastDay===today()||st.lastDay===addDays(today(),-1))?st.streak:0}
function addXP(n){const t=today();st.xp+=n;st.days[t]=(st.days[t]||0)+n;if(st.lastDay!==t){st.streak=st.lastDay===addDays(t,-1)?st.streak+1:1;st.lastDay=t}}
function weekXP(){const ws=weekStart();let t=0;for(let i=0;i<7;i++)t+=st.days[addDays(ws,i)]||0;return t}
function addMistake(id){if(!st.mistakes.includes(id))st.mistakes.push(id);st.srs[id]={box:0,due:today()}}
function srsRight(id){const s=st.srs[id];if(!s)return;s.box++;if(s.box>=SRS_GAP.length){delete st.srs[id];st.mistakes=st.mistakes.filter(x=>x!==id)}else s.due=addDays(today(),SRS_GAP[s.box])}
function weakDue(){const t=today();return st.mistakes.filter(id=>QS[id]&&(!st.srs[id]||st.srs[id].due<=t))}
function applyTheme(){let t=st.theme;if(t==='auto'){try{t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){t='light'}}document.documentElement.dataset.theme=t;const m=$('meta[name=theme-color]');if(m)m.content=t==='dark'?'#1B1233':'#FFF1E9'}

/* ---------- course model ---------- */
const trackUnits=id=>UNITS.filter(u=>u.track===id);
const lkey=(u,i)=>u.id+'/'+i;
const lessonDone=(u,i)=>!!st.done[lkey(u,i)];
const unitDone=u=>!!st.cp[u.id];
function unitOpen(u){const us=trackUnits(u.track);const i=us.indexOf(u);return i<=0||unitDone(us[i-1])}
function unitNodes(u){const ns=u.lessons.map((l,i)=>({u,li:i,cp:false,done:lessonDone(u,i)}));ns.push({u,li:-1,cp:true,done:unitDone(u)});return ns}
function nextNode(track){for(const u of trackUnits(track||st.track)){if(!unitOpen(u))break;const n=unitNodes(u).find(n=>!n.done);if(n)return n}return null}
function doneUnits(){return UNITS.filter(unitDone).length}

/* ---------- mascot voices: always labeled as theirs ---------- */
const NAME={gus:'Gus',hazel:'Hazel'};
const label=w=>w==='gus'?"Gus's take":'Hazel says';
const LINES={
 gus:{
  right:["Correct. Don't let it go to your head. That's my job.","Fine. You know things. I also know things. Mostly where the fries are.","Right answer. I'd clap but these are wings.","Look at you, redistributing knowledge into your own brain.","Nailed it. The ferry crowd would be so impressed.","Correct! I was going to say that. After you said it.","Property is theft. That answer, though, you earned."],
  wrong:["Bold. Wrong, but bold.","I've seen pigeons do better. Not many. But some.","That answer has the same energy as a dropped ice cream.","Oof. Even Proudhon would wince, and he argued with everybody.","Wrong, comrade. Happens to the best of us. And also to you.","I'm not mad. I'm just going to stare at the Sound for a while."],
  combo:["Okay, now you're showing off.","A streak! Somebody alert the dockworkers.","You're on fire. Not literally. I checked.","This is getting suspicious. Are you reading ahead?","At this rate you'll be quoting volume three by Friday."],
  poke:["Hey! Hands off the plumage.","I'm thinking about fries. And surplus value. Mostly fries.","Proudhon said property is theft. I say a fry on the ground is a commons.","What? I'm supervising.","I once read half of Capital. The half with the pictures. There were none.","Tap the lesson, not the bird.","Every gull for themselves? No. We flock. Look it up."],
  hearts:["Out of hearts? I wasn't worried. I'm never worried. Stop looking at me.","Whatever. Hearts grow back. Allegedly.","I don't care. I'm only standing this close because of the wind."],
  done:["Lesson done. I contributed by being present.","Finished! I'm telling the other gulls. They won't care, but still."],
  path:["This is my spot. The lesson is your spot.","Keep walking. I'll hop."]
 },
 hazel:{
  right:["Yes! That one's yours now.","Lovely work. You built that answer log by log.","Exactly right. I knew you had it.","Well done. That idea trips up a lot of people.","You're really getting the hang of this."],
  wrong:["So close. This one is tricky, and you'll see it again.","That's okay. Mixing these up is how everybody starts.","Not this time. Read the answer once and it will stick.","Good try. Mistakes are just lumber for the next dam.","Don't worry. We'll come back to it together."],
  combo:["Look at you go!","That's a whole run of right answers. I'm so proud.","You're building something sturdy here."],
  poke:["Oh! Hello, friend.","However today goes, you showed up. That counts.","A little learning every day builds a very big dam.","I'm glad you're here.","Ready when you are. No rush.","Fun fact: beavers share the work. I'm just saying."],
  hearts:["Come here. Everybody runs out sometimes. A quick practice earns one back.","It's okay. Rest a minute, or practice with me to earn a heart."],
  done:["You finished! I'm so glad you came today.","Another lesson built. Look how far the path goes now."],
  today:["Ready for the next one? I'll be right here.","One lesson today keeps the streak cozy."]
 }
};
const say=(w,k)=>pickOne(LINES[w][k]);
function bubble(w,text){return '<div class="bub'+(w==='hazel'?' hz':'')+'"><b>'+label(w)+'</b>'+esc(text)+'</div>'}

/* ---------- toast and modal ---------- */
let toastT;
function toast(html,ms){const o=$('.toast');if(o)o.remove();const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.innerHTML=html;document.body.appendChild(d);clearTimeout(toastT);toastT=setTimeout(()=>d.remove(),ms||2600)}
function modal(html){closeModal();const d=document.createElement('div');d.className='modal';d.innerHTML='<div class="mbox" role="dialog" aria-modal="true"><button class="x" data-a="close" aria-label="Close">'+ic('x',18)+'</button>'+html+'</div>';d.addEventListener('click',e=>{if(e.target===d)closeModal()});document.body.appendChild(d);Mascots.sync(d)}
function closeModal(){const m=$('.modal');if(m)m.remove()}

/* ---------- scenery for the lesson path ---------- */
const PROP={
 tree:'<rect x="-3" y="14" width="6" height="22" rx="3" style="fill:var(--trunk)"/><circle cx="0" cy="4" r="22" fill="url(#sc-tree)"/>',
 pine:'<rect x="-3" y="20" width="6" height="16" rx="3" style="fill:var(--trunk)"/><path d="M0 -30 L18 2 L8 2 L22 24 L-22 24 L-8 2 L-18 2Z" fill="url(#sc-tree)"/>',
 library:'<path d="M-36 -2 L0 -24 L36 -2Z" style="fill:var(--roof)"/><rect x="-32" y="-2" width="64" height="38" rx="4" style="fill:var(--bldg)"/><g style="fill:var(--bldg2)"><rect x="-24" y="4" width="6" height="28" rx="3"/><rect x="-10" y="4" width="6" height="28" rx="3"/><rect x="4" y="4" width="6" height="28" rx="3"/><rect x="18" y="4" width="6" height="28" rx="3"/><rect x="-36" y="34" width="72" height="6" rx="3"/></g>',
 stall:'<rect x="-28" y="2" width="56" height="30" rx="4" style="fill:var(--bldg)"/><path d="M-32 2 L-24 -16 L24 -16 L32 2Z" fill="#F2603A"/><path d="M-24 -16 L-18 2 M-12 -16 L-8 2 M0 -16 L0 2 M12 -16 L8 2 M24 -16 L18 2" stroke="#fff" stroke-width="5" opacity=".85"/><rect x="-20" y="10" width="40" height="8" rx="4" fill="#F7C531"/>',
 factory:'<rect x="-34" y="0" width="68" height="34" rx="4" style="fill:var(--bldg)"/><path d="M-34 0 L-34 -14 L-14 0 L-14 -14 L6 0Z" style="fill:var(--bldg2)"/><rect x="12" y="-34" width="12" height="36" rx="3" style="fill:var(--roof)"/><circle cx="20" cy="-42" r="7" style="fill:var(--bldg2)" opacity=".8"/><circle cx="29" cy="-52" r="9" style="fill:var(--bldg2)" opacity=".55"/><g fill="#F7C531"><rect x="-26" y="12" width="10" height="10" rx="2"/><rect x="-10" y="12" width="10" height="10" rx="2"/><rect x="6" y="12" width="10" height="10" rx="2"/></g>',
 houses:'<rect x="-34" y="4" width="30" height="28" rx="4" style="fill:var(--bldg)"/><path d="M-38 6 L-19 -12 L0 6Z" fill="#F2603A"/><rect x="2" y="-4" width="32" height="36" rx="4" style="fill:var(--bldg)"/><path d="M-2 -2 L18 -22 L38 -2Z" style="fill:var(--roof)"/><rect x="-24" y="14" width="10" height="18" rx="3" style="fill:var(--bldg2)"/><rect x="12" y="8" width="10" height="10" rx="2" fill="#F7C531"/>',
 tower:'<rect x="-22" y="-44" width="44" height="80" rx="6" style="fill:var(--bldg)"/><g style="fill:var(--bldg2)"><rect x="-14" y="-36" width="10" height="10" rx="2"/><rect x="4" y="-36" width="10" height="10" rx="2"/><rect x="-14" y="-18" width="10" height="10" rx="2"/><rect x="-14" y="0" width="10" height="10" rx="2"/><rect x="4" y="0" width="10" height="10" rx="2"/></g><rect x="4" y="-18" width="10" height="10" rx="2" fill="#F7C531"/><rect x="-6" y="20" width="12" height="16" rx="3" style="fill:var(--roof)"/>',
 ship:'<path d="M-44 14 L44 14 L34 32 L-34 32Z" fill="#F2603A"/><rect x="-26" y="-6" width="18" height="20" rx="2" style="fill:var(--bldg)"/><rect x="-6" y="-12" width="18" height="26" rx="2" style="fill:var(--roof)"/><rect x="14" y="-2" width="16" height="16" rx="2" fill="#5FE0CC"/><path d="M-50 36 q12 -8 25 0 t25 0 t25 0 t25 0" fill="none" style="stroke:var(--water)" stroke-width="5" stroke-linecap="round"/>',
 crane:'<rect x="-4" y="-40" width="8" height="76" rx="3" style="fill:var(--roof)"/><rect x="-30" y="-44" width="70" height="8" rx="3" fill="#F2603A"/><path d="M32 -36 L32 -8" style="stroke:var(--trunk)" stroke-width="2.500"/><rect x="24" y="-8" width="16" height="12" rx="2" fill="#5FE0CC"/><rect x="-16" y="30" width="32" height="8" rx="3" style="fill:var(--bldg2)"/>',
 needle:'<path d="M-3 36 L-2 -18 L2 -18 L3 36Z" style="fill:var(--bldg2)"/><path d="M-10 36 Q-3 4 -2 -14 M10 36 Q3 4 2 -14" fill="none" style="stroke:var(--bldg2)" stroke-width="3"/><ellipse cx="0" cy="-22" rx="20" ry="6" style="fill:var(--bldg)"/><ellipse cx="0" cy="-26" rx="13" ry="4" fill="#F2603A"/><rect x="-1" y="-48" width="2" height="22" style="fill:var(--roof)"/>',
 mountain:'<path d="M-46 36 L-10 -34 L8 -4 L20 -20 L48 36Z" style="fill:var(--roof)"/><path d="M-10 -34 L-22 -10 L-12 -16 L-6 -8 L2 -14Z" style="fill:var(--bldg)"/>',
 wheat:'<g style="stroke:var(--trunk)" stroke-width="3" stroke-linecap="round"><path d="M-18 36 L-18 0"/><path d="M0 36 L0 -8"/><path d="M18 36 L18 2"/></g><g fill="#F7C531"><ellipse cx="-18" cy="-6" rx="6" ry="13"/><ellipse cx="0" cy="-14" rx="6" ry="13"/><ellipse cx="18" cy="-4" rx="6" ry="13"/></g>',
 books:'<rect x="-30" y="16" width="60" height="16" rx="4" fill="#F2603A"/><rect x="-24" y="2" width="52" height="14" rx="4" fill="#5FE0CC"/><rect x="-28" y="-12" width="48" height="14" rx="4" fill="#F7C531"/><rect x="-22" y="20" width="24" height="3" rx="1.500" fill="#fff" opacity=".7"/>',
 gear:'<circle cx="0" cy="6" r="24" style="fill:var(--roof)"/><g style="fill:var(--roof)"><rect x="-6" y="-26" width="12" height="64" rx="3"/><rect x="-32" y="0" width="64" height="12" rx="3"/><rect x="-6" y="-26" width="12" height="64" rx="3" transform="rotate(45 0 6)"/><rect x="-6" y="-26" width="12" height="64" rx="3" transform="rotate(-45 0 6)"/></g><circle cx="0" cy="6" r="10" style="fill:var(--bldg)"/>',
 ballot:'<rect x="-28" y="-2" width="56" height="38" rx="6" style="fill:var(--bldg)"/><rect x="-16" y="4" width="32" height="5" rx="2.500" style="fill:var(--roof)"/><rect x="-10" y="-24" width="22" height="26" rx="3" fill="#F7C531" transform="rotate(8 0 -10)"/><path d="M-8 22 l5 5 l10 -11" fill="none" stroke="#F2603A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
 globe:'<circle cx="0" cy="2" r="28" fill="#5FE0CC"/><path d="M-18 -10 q10 -8 18 0 q4 8 -6 12 q-10 2 -12 -12z M6 8 q12 -4 16 6 q-4 10 -14 8z" fill="#0D7C6F" opacity=".7"/><ellipse cx="-10" cy="-12" rx="9" ry="5" fill="#fff" opacity=".35"/><rect x="-14" y="30" width="28" height="6" rx="3" style="fill:var(--roof)"/>',
 press:'<rect x="-30" y="-6" width="60" height="42" rx="6" style="fill:var(--bldg)"/><rect x="-22" y="-22" width="44" height="20" rx="3" fill="#fff" stroke="#E4E0F2"/><g style="stroke:var(--roof)" stroke-width="3" stroke-linecap="round"><path d="M-16 -15 L16 -15"/><path d="M-16 -9 L8 -9"/></g><rect x="-22" y="6" width="44" height="8" rx="4" fill="#F2603A"/><circle cx="18" cy="24" r="4" fill="#5FE0CC"/>'
};
const SCENES={meadow:['tree','stall','library','tree','houses'],mill:['factory','houses','gear','pine','tower'],books:['library','books','tree','press','pine'],world:['globe','mountain','ship','pine','wheat'],usa:['ballot','houses','factory','tree','press'],coop:['stall','wheat','houses','tree','ballot'],harbor:['ship','crane','needle','pine','mountain'],city:['tower','needle','houses','tree','crane'],peaks:['mountain','pine','books','pine','gear'],news:['press','globe','ballot','tower','books']};
const XS=[148,258,184,276,166,246];
function geom(n){const pts=[];for(let i=0;i<n;i++)pts.push([XS[i%XS.length],78+i*112]);return {pts,H:78+(n-1)*112+86}}
function stageHTML(u,cur){
 const ns=unitNodes(u),g=geom(ns.length),H=g.H,open=unitOpen(u);
 let d='M'+g.pts[0][0]+' 0 L'+g.pts[0][0]+' '+g.pts[0][1];
 for(let i=1;i<g.pts.length;i++){const a=g.pts[i-1],b=g.pts[i];d+=' C'+a[0]+' '+(a[1]+56)+' '+b[0]+' '+(b[1]-56)+' '+b[0]+' '+b[1]}
 d+=' L'+g.pts[g.pts.length-1][0]+' '+H;
 const props=SCENES[u.scene]||SCENES.meadow;let sc='';
 g.pts.forEach((p,i)=>{if(cur&&cur.i===i)return;const px=p[0]<215?326:58;sc+='<g transform="translate('+px+' '+(p[1]-6)+')">'+PROP[props[i%props.length]]+'</g>'});
 sc+='<g transform="translate(34 '+(H-40)+') scale(.8)">'+PROP.tree+'</g><g transform="translate(360 30) scale(.7)">'+PROP.pine+'</g>';
 let h='<div class="stage" style="aspect-ratio:390/'+H+'" data-unit="'+u.id+'"><svg viewBox="0 0 390 '+H+'" preserveAspectRatio="none" aria-hidden="true">'+
  '<path d="M0 60 C80 20 170 50 230 30 C300 8 350 30 390 20 L390 '+H+' L0 '+H+'Z" fill="url(#sc-h2)"/><path d="M0 '+(H*.42)+' C90 '+(H*.42-30)+' 160 '+(H*.42+10)+' 250 '+(H*.42-20)+' C320 '+(H*.42-42)+' 360 '+(H*.42-20)+' 390 '+(H*.42-30)+' L390 '+H+' L0 '+H+'Z" fill="url(#sc-h1)"/>'+sc+
  '<path d="'+d+'" fill="none" style="stroke:var(--roade)" stroke-width="46" stroke-linecap="round"/><path d="'+d+'" fill="none" style="stroke:var(--road)" stroke-width="38" stroke-linecap="round"/><path d="'+d+'" fill="none" style="stroke:var(--roadd)" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/></svg>';
 ns.forEach((n,i)=>{const p=g.pts[i],isCur=!!cur&&cur.i===i,cls=n.done?'done':isCur?'cur':'lock';
  const name=n.cp?'Unit checkpoint':'Lesson '+(i+1)+': '+u.lessons[i].t;
  const icon=n.done?(n.cp?ic('trophy',30):ic('check',28)):isCur?(n.cp?ic('trophy',32):ic('star',32)):ic('lock',24);
  const pos='left:'+(p[0]/390*100).toFixed(2)+'%;top:'+(p[1]/H*100).toFixed(2)+'%';
  if(isCur){h+='<div class="tip" style="left:'+(p[0]/390*100).toFixed(2)+'%;top:'+((p[1]-50)/H*100).toFixed(2)+'%">'+(n.cp?'Checkpoint':'Start')+'</div>';
   const wx=p[0]<215?p[0]+104:p[0]-104;
   h+='<div class="walker" id="walker" data-at="'+u.id+':'+i+'" style="left:'+(wx/390*100).toFixed(2)+'%;top:'+((p[1]+38)/H*100).toFixed(2)+'%">'+Mascots.html('gus','idle',118,'walker',' data-tap="gus" data-ctx="path" role="button" tabindex="0" aria-label="Gus the seagull. Tap for his take."')+'</div>'}
  h+='<button class="node '+cls+(n.cp?' cp':'')+'" style="'+pos+'" data-a="node" data-u="'+u.id+'" data-i="'+i+'" aria-label="'+esc(name)+(n.done?', done':isCur?', up next':', locked')+'"'+(isCur?' id="curnode"':'')+'>'+icon+'</button>'});
 return h+'</div>'}
const SCDEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="sc-h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--h1)"/><stop offset="1" style="stop-color:var(--h2)"/></linearGradient><linearGradient id="sc-h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--h3)"/><stop offset="1" style="stop-color:var(--h4)"/></linearGradient><radialGradient id="sc-tree" cx="35%" cy="30%" r="75%"><stop offset="0" style="stop-color:var(--tree1)"/><stop offset="1" style="stop-color:var(--tree2)"/></radialGradient></defs></svg>';

/* ---------- views ---------- */
let tab='learn',lastWalk=null;
const VIEWS={};
function ring(){const p=Math.min(1,dayXP()/st.goal),c=2*Math.PI*14;return '<svg width="30" height="30" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14" fill="none" style="stroke:var(--track)" stroke-width="5.500"/><circle cx="18" cy="18" r="14" fill="none" style="stroke:var(--acc)" stroke-width="5.500" stroke-linecap="round" stroke-dasharray="'+(c*p).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 18 18)"/></svg>'}
function topHTML(){heartsTick();const tr=TRACKS.find(t=>t.id===st.track),left=Math.max(0,st.goal-dayXP());
 return '<div class="topin"><div class="toprow"><button class="pill" data-a="tracks" aria-label="Level: '+esc(tr.name)+'. Change level">'+esc(tr.name)+ic('down',16)+'</button><div class="stats">'+
 '<button class="stat" data-a="tab" data-t="me" aria-label="Daily goal: '+dayXP()+' of '+st.goal+' XP">'+ring()+'<span class="num">'+dayXP()+'<small>/'+st.goal+'</small></span></button>'+
 '<div class="stat flame" aria-label="'+liveStreak()+' day streak">'+ic('flame')+'<span class="num">'+liveStreak()+'</span></div>'+
 '<button class="stat heart" data-a="hearts" aria-label="'+st.hearts+' hearts">'+ic('heart')+'<span class="num">'+st.hearts+'</span></button></div></div>'+
 (tab==='learn'?'<button class="slim" data-a="totop" id="slim" hidden>'+(left?left+' XP to go today':'Daily goal met')+' · Back to Today'+ic('up',12)+'</button>':'')+'</div>'}
function navHTML(){return '<div class="navin">'+[['learn','Learn','book'],['practice','Practice','bell'],['friends','Friends','friends'],['me','Profile','user']].map(t=>'<button class="tab'+(tab===t[0]?' on':'')+'" data-a="tab" data-t="'+t[0]+'"'+(tab===t[0]?' aria-current="page"':'')+'><i>'+ic(t[2],24)+'</i>'+t[1]+'</button>').join('')+'</div>'}
VIEWS.learn=function(){
 const us=trackUnits(st.track),nx=nextNode(),tr=TRACKS.find(t=>t.id===st.track);let h='';
 let up,ttl,sub;
 if(!us.length){up='Coming soon';ttl=tr.name;sub='Lessons for this level are on the way.'}
 else if(nx){const n=nx,ui=us.indexOf(n.u)+1;up=n.cp?'Up next · Unit '+ui+' checkpoint':'Up next · Lesson '+(n.li+1);ttl=n.cp?n.u.title:n.u.lessons[n.li].t;sub=n.cp?'Show what you learned in this unit.':n.u.lessons[n.li].sub||n.u.title}
 else{up='All done';ttl='You finished '+tr.name;sub='Pick another level, or keep sharp in Practice.'}
 h+='<section class="card today" id="today"><div class="todayrow"><div class="todaym">'+Mascots.html('hazel','idle',156,'today',' data-tap="hazel" data-ctx="today" role="button" tabindex="0" aria-label="Hazel the beaver. Tap to hear from her."')+'</div><div class="todayt"><span class="kicker">'+esc(up)+'</span><b>'+esc(ttl)+'</b><span>'+esc(sub)+'</span></div></div>'+
  (nx?'<button class="btn" data-a="go">'+(st.xp?'Continue':'Start')+ic('arrow',20)+'</button>':us.length?'<button class="btn" data-a="tracks">Choose a level'+ic('arrow',20)+'</button>':'')+'</section>';
 us.forEach((u,i)=>{const open=unitOpen(u),cur=nx&&nx.u===u?{i:unitNodes(u).findIndex(n=>!n.done)}:null;
  h+='<section class="uhead"><div class="row"><span class="chip">'+esc(tr.name)+' · Unit '+(i+1)+' of '+us.length+(u.stamp?' · '+esc(u.stamp):'')+'</span><div style="display:flex;gap:8px"><button class="btn ghost sm" data-a="guide" data-u="'+u.id+'">Guide</button>'+(open&&!unitDone(u)&&u.lessons.some((l,j)=>!lessonDone(u,j))?'<button class="btn ghost sm" data-a="testout" data-u="'+u.id+'">Test out</button>':'')+'</div></div><h2>'+esc(u.title)+'</h2><p>'+esc(u.blurb)+'</p></section>';
  h+=stageHTML(u,cur)});
 return h};
VIEWS.practice=function(){const due=weakDue().length,seen=UNITS.some(u=>u.lessons.some((l,i)=>lessonDone(u,i)));
 return '<div class="page"><div class="pagehead">'+Mascots.html('hazel','idle',92,'pr',' data-tap="hazel" data-ctx="poke"')+'<div><h1>Practice</h1><p class="muted">Practice never costs hearts, and finishing a round earns one back.</p></div></div>'+
 '<button class="card pcard" data-a="weak"><div><b>Weak spots</b><small>'+(due?due+(due===1?' question is':' questions are')+' ready for another try. Missed questions come back after 1, 3, 7, 14 and 30 days.':st.mistakes.length?'Nothing is due today. '+st.mistakes.length+' saved for later.':'Questions you miss land here so you can try them again.')+'</small></div>'+ic('arrow',22)+'</button>'+
 '<button class="card pcard" data-a="mix"><div><b>Review mix</b><small>'+(seen?'Ten questions pulled from lessons you have finished.':'Finish a lesson first, then review it here.')+'</small></div>'+ic('arrow',22)+'</button>'+
 '<button class="card pcard" data-a="explain"><div><b>Say it your way</b><small>'+(seen?'Three explain-in-your-own-words questions. You grade yourself against a model answer.':'Opens after your first lesson.')+'</small></div>'+ic('arrow',22)+'</button></div>'};
VIEWS.me=function(){const ws=weekStart(),ds=['M','T','W','T','F','S','S'],vals=ds.map((x,i)=>st.days[addDays(ws,i)]||0),mx=Math.max(st.goal,...vals);
 const acc=st.right+st.wrong?Math.round(st.right/(st.right+st.wrong)*100):0;
 return '<div class="page"><div class="pagehead">'+Mascots.html('gus','idle',92,'me',' data-tap="gus" data-ctx="poke"')+'<div><h1>'+esc(st.name||'Your profile')+'</h1><p class="muted">Everything here is your own real progress.</p></div></div>'+
 '<div class="tiles"><div class="tile"><b class="num">'+st.xp+'</b><small>Total XP</small></div><div class="tile"><b class="num">'+liveStreak()+'</b><small>Day streak</small></div><div class="tile"><b class="num">'+doneUnits()+'</b><small>Units done</small></div></div>'+
 '<div class="card"><h3 style="margin-bottom:12px">This week</h3><div class="week">'+vals.map((v,i)=>'<div class="'+(v?'':'z')+'"><i style="height:'+Math.max(6,Math.round(v/mx*64))+'px"></i>'+ds[i]+'</div>').join('')+'</div><p class="muted" style="font-size:14.500px;margin-top:10px">'+weekXP()+' XP this week'+(st.right+st.wrong?' · '+acc+'% of answers right on the first try':'')+'</p></div>'+
 '<div class="card"><h3 style="margin-bottom:6px">Settings</h3>'+
 '<div class="setrow"><span>Name</span><input class="textin" style="max-width:180px" data-in="name" maxlength="24" value="'+esc(st.name)+'" aria-label="Your name"></div>'+
 '<div class="setrow"><span>Daily goal</span><select data-in="goal" aria-label="Daily goal">'+[10,20,30,50].map(g=>'<option value="'+g+'"'+(st.goal===g?' selected':'')+'>'+g+' XP</option>').join('')+'</select></div>'+
 '<div class="setrow"><span>Appearance</span><select data-in="theme" aria-label="Appearance">'+[['auto','Match my device'],['light','Light'],['dark','Dark']].map(g=>'<option value="'+g[0]+'"'+(st.theme===g[0]?' selected':'')+'>'+g[1]+'</option>').join('')+'</select></div>'+remRow()+'</div>'+
 '<div class="card"><h3 style="margin-bottom:8px">How this app stays honest</h3><p class="muted" style="font-size:15.500px">Lesson facts are written to be neutral and include what critics say and what went wrong, alongside the arguments in favor. Gus and Hazel have opinions, and every one of them is labeled as theirs. The Live Desk unit is refreshed on the 1st of each month.</p></div>'+
 '<details><summary>Start over</summary><p class="muted" style="font-size:15px;margin-bottom:10px">This erases your progress on this device. It cannot be undone.</p><button class="btn ghost sm" data-a="reset">Erase my progress</button></details>'+
 '<p class="muted" style="font-size:13px;text-align:center">Means &amp; Ends · version '+esc(window.ME_BUILD||'dev')+'</p></div>'};

function render(){
 if(!st.ob){$('#top').innerHTML='';$('#nav').innerHTML='';$('#top').hidden=$('#nav').hidden=true;$('#app').innerHTML=onboardHTML();$('#app').style.paddingTop='24px';Mascots.sync();return}
 $('#app').style.paddingTop='';$('#top').hidden=$('#nav').hidden=false;
 $('#top').innerHTML=topHTML();$('#nav').innerHTML=navHTML();$('#app').innerHTML=VIEWS[tab]();
 Mascots.sync();if(tab==='learn'){walk();onScroll()}}
function walk(){const w=$('#walker');if(!w)return;const at=w.dataset.at,m=w.querySelector('.mascot');
 if(lastWalk&&lastWalk.at!==at&&!reduce()){const same=lastWalk.at.split(':')[0]===at.split(':')[0];const L=w.style.left,T=w.style.top;
  if(same){w.style.transition='none';w.style.left=lastWalk.left;w.style.top=lastWalk.top;w.offsetWidth;w.style.transition='';requestAnimationFrame(()=>{w.style.left=L;w.style.top=T})}
  Mascots.setPose(m,'hop');setTimeout(()=>Mascots.setPose(m,'idle'),1300);lastWalk={at,left:L,top:T}}
 else lastWalk={at,left:w.style.left,top:w.style.top}}
function onScroll(){const s=$('#slim'),t=$('#today');if(!s||!t)return;s.hidden=t.getBoundingClientRect().bottom>110}
function toCurrent(smooth){const n=$('#curnode');if(n)n.scrollIntoView({block:'center',behavior:smooth&&!reduce()?'smooth':'auto'})}

/* ---------- onboarding ---------- */
let obStep=0;
function onboardHTML(){
 if(obStep===0)return '<div class="page" style="min-height:calc(100dvh - 60px);justify-content:center;text-align:center;align-items:center"><div class="duo">'+Mascots.html('hazel','cheer',150,'ob1')+Mascots.html('gus','idle',150,'ob2')+'</div><h1 style="font-size:40px">Means &amp; Ends</h1><p class="muted" style="font-size:18px;max-width:340px">Learn what socialism and communism are, where they came from, what worked, what failed, and what people argue about today.</p><div class="card" style="text-align:left;display:flex;flex-direction:column;gap:10px;width:100%"><p><b>Hazel</b> is a beaver. She is kind and on your side.</p><p><b>Gus</b> is a seagull. He steals fries and has opinions.</p><p class="muted" style="font-size:15.500px">The lessons stick to facts and include the critics. When Gus or Hazel share an opinion, it is always labeled as theirs.</p></div><button class="btn" data-a="ob-next">Get started'+ic('arrow',20)+'</button></div>';
 if(obStep===1)return '<div class="page"><div class="pagehead">'+Mascots.html('hazel','think',100,'ob1')+'<div><h1>Pick a starting level</h1><p class="muted">You can switch any time.</p></div></div>'+TRACKS.slice(0,4).map(t=>'<button class="trk'+(st.track===t.id?' on':'')+'" data-a="ob-track" data-t="'+t.id+'"><div><b>'+esc(t.name)+'</b><small>'+esc(t.sub)+'</small></div></button>').join('')+'<p class="muted" style="font-size:15px">New to all of this? Start with 8th grade. It assumes you know nothing yet, and that is fine.</p><button class="btn" data-a="ob-next">Next'+ic('arrow',20)+'</button></div>';
 return '<div class="page"><div class="pagehead">'+Mascots.html('gus','think',100,'ob2')+'<div><h1>Set a daily goal</h1><p class="muted">One lesson is about 15 XP.</p></div></div>'+[[10,'Easygoing','About one short lesson a day'],[20,'Steady','A lesson and a little practice'],[30,'Serious','Two lessons a day'],[50,'All in','Gus says: prove it']].map(g=>'<button class="trk'+(st.goal===g[0]?' on':'')+'" data-a="ob-goal" data-g="'+g[0]+'"><div><b>'+g[1]+' · '+g[0]+' XP</b><small>'+g[2]+'</small></div></button>').join('')+'<button class="btn" data-a="ob-done">Start learning'+ic('arrow',20)+'</button></div>'}

/* ---------- sessions ---------- */
let S=null; // the running session
const inSession=()=>!!S;
window.ME_inSession=inSession;
function buildLesson(u,li){const items=u.lessons[li].items,steps=[];for(let i=0;i<items.length;i+=2){const pair=items.slice(i,i+2);steps.push({k:'teach',facts:pair.map(q=>q.teach)});pair.forEach(q=>steps.push({k:'q',q}))}return steps}
function start(o){heartsTick();if(o.hearts&&st.hearts<=0){S=Object.assign({steps:[],i:0,right:0,wrong:0,combo:0,best:0,first:0,asked:0},o);S.out=true;openOv();renderS();return}
 S=Object.assign({i:0,right:0,wrong:0,combo:0,best:0,first:0,asked:0,phase:'ask',V:null,retry:{}},o);S.total=S.steps.length;openOv();newView();renderS()}
function startNode(u,i){const ns=unitNodes(u),n=ns[i];
 if(n.cp)return start({mode:'cp',u,hearts:true,title:u.title+' checkpoint',steps:cpSteps(u)});
 start({mode:'lesson',u,li:i,hearts:true,title:u.lessons[i].t,steps:buildLesson(u,i)})}
function cpSteps(u){const pool=u.qs.filter(q=>q.t!=='ex');const n=Math.min(pool.length,Math.max(8,Math.round(pool.length*.6)),12);return shuffle(pool).slice(0,n).map(q=>({k:'q',q}))}
function openOv(){$('#ov').classList.add('on');document.body.style.overflow='hidden'}
function closeOv(){S=null;$('#ov').classList.remove('on');document.body.style.overflow='';$('#sroot').innerHTML='';Mascots.forget('s-');render();pendingReload()}
function newView(){const stp=S.steps[S.i];S.phase='ask';S.res=null;if(!stp||stp.k!=='q'){S.V=null;return}const q=stp.q;
 if(q.t==='mc')S.V={ord:shuffle(q.o.map((x,i)=>i)),sel:-1};
 else if(q.t==='tf')S.V={sel:null};
 else if(q.t==='pick'){const all=q.yes.map(x=>[x,1]).concat(q.no.map(x=>[x,0]));S.V={opts:shuffle(all),sel:{}}}
 else if(q.t==='pair')S.V={L:shuffle(q.p.map((x,i)=>i)),R:shuffle(q.p.map((x,i)=>i)),link:{},selL:-1};
 else if(q.t==='sort'){const gs=Object.keys(q.g),items=[];gs.forEach((g,gi)=>q.g[g].forEach(x=>items.push({x,g:gi})));S.V={gs,items:shuffle(items),place:{},sel:-1}}
 else if(q.t==='ord'){let o=shuffle(q.o.map((x,i)=>i));if(o.every((x,i)=>x===i))o.reverse();S.V={ord:o,pick:[]}}
 else if(q.t==='ex')S.V={text:'',shown:false}}
function canCheck(){const V=S.V,q=S.steps[S.i].q;
 return q.t==='mc'?V.sel>=0:q.t==='tf'?V.sel!==null:q.t==='pick'?Object.keys(V.sel).some(k=>V.sel[k]):q.t==='pair'?Object.keys(V.link).length===q.p.length:q.t==='sort'?Object.keys(V.place).length===V.items.length:q.t==='ord'?V.pick.length===q.o.length:false}
const KIND={source:['doc','Read the source'],chart:['chart','Read the chart'],apply:['pin','Real situation'],match:['bulb','Match them up'],sort:['bulb','Sort into groups'],order:['bulb','Put in order'],pick:['bulb','Choose all that fit'],explain:['pen','In your own words'],choice:['bulb','Choose one']};
function qHTML(q){const V=S.V,done=S.phase==='fb';let h='';
 if(q.src)h+='<figure class="fig"><blockquote>“'+esc(q.src.text)+'”</blockquote><figcaption>'+esc(q.src.cite)+'</figcaption></figure>';
 if(q.cs)h+='<figure class="fig case"><p>'+rich(q.cs)+'</p></figure>';
 if(q.data){const mx=Math.max(...q.data.rows.map(r=>r[1]));h+='<figure class="fig"><figcaption style="font-weight:800;color:var(--ink);font-size:15.500px">'+esc(q.data.title)+'</figcaption><div class="bars">'+q.data.rows.map(r=>'<div class="bar"><span>'+esc(r[0])+'</span><i style="width:'+Math.max(3,r[1]/mx*100).toFixed(1)+'%"></i><span class="num">'+esc(r[2]!=null?r[2]:r[1])+'</span></div>').join('')+'</div>'+(q.data.note?'<figcaption>'+esc(q.data.note)+'</figcaption>':'')+'</figure>'}
 h+='<div class="qrow"><h1 id="qh">'+rich(q.q)+'</h1>'+Mascots.html('gus',done?(S.res?'cheer':'facepalm'):'think',104,'s-watch')+'</div>';
 const mk=ok=>'<span class="mk">'+ic(ok?'check':'x',16)+'</span>';
 if(q.t==='mc'){const two=q.o.every(o=>o.length<=26);h+='<div class="opts'+(two?' two':'')+(done?' locked':'')+'" role="radiogroup" aria-labelledby="qh">'+V.ord.map((oi,k)=>{let c='opt';if(done){if(oi===0)c+=' ok';else if(k===V.sel)c+=' bad';else c+=' dim'}else if(k===V.sel)c+=' sel';return '<button class="'+c+'" role="radio" aria-checked="'+(k===V.sel)+'" data-a="sel" data-k="'+k+'">'+rich(q.o[oi])+(done&&oi===0?mk(1):done&&k===V.sel?mk(0):'')+'</button>'}).join('')+'</div>'}
 else if(q.t==='tf'){h+='<div class="opts two'+(done?' locked':'')+'" role="radiogroup" aria-labelledby="qh">'+[true,false].map(v=>{let c='opt';if(done){if(v===q.a)c+=' ok';else if(v===V.sel)c+=' bad';else c+=' dim'}else if(V.sel===v)c+=' sel';return '<button class="'+c+'" role="radio" aria-checked="'+(V.sel===v)+'" data-a="tf" data-v="'+(v?1:0)+'">'+(v?'True':'False')+(done&&v===q.a?mk(1):done&&v===V.sel?mk(0):'')+'</button>'}).join('')+'</div>'}
 else if(q.t==='pick'){h+='<p class="hint">Tap every answer that fits. There may be more than one.</p><div class="opts'+(done?' locked':'')+'">'+V.opts.map((o,k)=>{let c='opt';const on=!!V.sel[k];if(done){if(o[1])c+=' ok';else if(on)c+=' bad';else c+=' dim'}else if(on)c+=' sel';return '<button class="'+c+'" role="checkbox" aria-checked="'+on+'" data-a="pick" data-k="'+k+'">'+rich(o[0])+(done&&o[1]?mk(1):done&&on?mk(0):'')+'</button>'}).join('')+'</div>'}
 else if(q.t==='pair'){h+='<p class="hint">Tap one on the left, then its match on the right.</p><div class="cols'+(done?' locked':'')+'"><div class="opts">'+V.L.map(li=>{const n=Object.keys(V.link).indexOf(String(li));let c='opt';if(done)c+=V.link[li]===li?' ok':' bad';else if(V.selL===li)c+=' sel';return '<button class="'+c+'" data-a="pl" data-i="'+li+'">'+rich(q.p[li][0])+(n>=0?'<span class="n">'+(n+1)+'</span>':'')+'</button>'}).join('')+'</div><div class="opts">'+V.R.map(ri=>{const owner=Object.keys(V.link).find(l=>V.link[l]===ri),n=owner==null?-1:Object.keys(V.link).indexOf(owner);let c='opt';if(done)c+=(owner!=null&&+owner===ri)?' ok':' bad';return '<button class="'+c+'" data-a="pr" data-i="'+ri+'">'+rich(q.p[ri][1])+(n>=0?'<span class="n">'+(n+1)+'</span>':'')+'</button>'}).join('')+'</div></div>';
  if(done&&!S.res)h+='<div class="model"><b>The right matches</b>'+q.p.map(p=>esc(p[0])+' → '+esc(p[1])).join('<br>')+'</div>'}
 else if(q.t==='sort'){h+='<p class="hint">Tap an item, then tap the group it belongs in.</p><div class="pool">'+V.items.map((it,k)=>V.place[k]==null?'<button class="tok'+(V.sel===k?' sel':'')+'" data-a="si" data-k="'+k+'">'+rich(it.x)+'</button>':'').join('')+'</div><div class="buckets'+(V.gs.length===3?' three':'')+(done?' locked':'')+'">'+V.gs.map((g,gi)=>'<div class="bucket'+(V.sel>=0?' hot':'')+'" data-a="sb" data-g="'+gi+'" role="button" tabindex="0" aria-label="Group: '+esc(g)+'"><b>'+esc(g)+'</b>'+V.items.map((it,k)=>V.place[k]===gi?'<button class="tok'+(done?(it.g===gi?' ok':' bad'):'')+'" data-a="su" data-k="'+k+'">'+rich(it.x)+'</button>':'').join('')+'</div>').join('')+'</div>';
  if(done&&!S.res)h+='<div class="model"><b>Where they go</b>'+V.gs.map(g=>'<strong>'+esc(g)+':</strong> '+q.g[g].map(esc).join('; ')).join('<br>')+'</div>'}
 else if(q.t==='ord'){h+='<p class="hint">Tap them in order, first to last. Tap again to undo.</p><div class="opts'+(done?' locked':'')+'">'+V.ord.map(oi=>{const n=V.pick.indexOf(oi);let c='opt';if(done)c+=n===oi?' ok':' bad';else if(n>=0)c+=' sel';return '<button class="'+c+'" data-a="ord" data-i="'+oi+'">'+rich(q.o[oi])+(n>=0?'<span class="n">'+(n+1)+'</span>':'')+'</button>'}).join('')+'</div>';
  if(done&&!S.res)h+='<div class="model"><b>The right order</b>'+q.o.map((x,i)=>(i+1)+'. '+esc(x)).join('<br>')+'</div>'}
 else if(q.t==='ex'){h+='<p class="hint">Write or just think it through, then compare with the model answer. No hearts on the line.</p><textarea class="ans" data-in="ex" aria-label="Your answer" placeholder="Your explanation">'+esc(V.text)+'</textarea>';
  if(V.shown)h+='<div class="model"><b>Model answer</b>'+rich(q.model)+'</div><p class="hint">How close were you?</p><div class="rate"><button class="btn sm ok" data-a="rate" data-r="2">Got it</button><button class="btn sm ghost" data-a="rate" data-r="1">Partly</button><button class="btn sm ghost" data-a="rate" data-r="0">Missed it</button></div>'}
 return h}
function renderS(keepScroll){if(!S)return;const root=$('#sroot');const sc=keepScroll&&root.querySelector('.sbody')?root.querySelector('.sbody').scrollTop:0;
 if(S.out){root.innerHTML=outHTML();Mascots.sync(root);return}
 if(S.result){root.innerHTML=S.result;Mascots.sync(root);countUps(root);return}
 const stp=S.steps[S.i],pct=Math.round(S.i/S.steps.length*100);
 let h='<div class="sess"><div class="shead"><button class="x" data-a="quit" aria-label="Quit">'+ic('x',18)+'</button><div class="prog" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><i style="width:'+pct+'%"></i></div>'+(S.hearts?'<div class="stat heart" id="shearts" aria-label="'+st.hearts+' hearts">'+ic('heart',24)+'<span class="num">'+st.hearts+'</span></div>':'<span class="chip teal">Practice</span>')+'</div>';
 if(stp.k==='teach'){h+='<div class="sbody"><div class="qtop"><span class="chip teal">'+ic('book',16)+'Learn this first</span></div><div class="teach">'+stp.facts.map(f=>'<div class="fact">'+rich(f)+'</div>').join('')+'</div><div style="display:flex;justify-content:flex-end;margin-top:auto">'+Mascots.html('hazel','idle',130,'s-teach',' data-tap="hazel" data-ctx="poke"')+'</div></div><div class="sfoot"><button class="btn" data-a="next">Got it'+ic('arrow',20)+'</button></div>'}
 else{const q=stp.q,k=KIND[q.kind];
  h+='<div class="sbody" id="sbody"><div class="qtop"><span class="chip">'+ic(k[0],16)+k[1]+'</span>'+(S.combo>=3?'<span class="combo">'+ic('flame',16)+S.combo+' in a row</span>':'')+'</div>'+qHTML(q)+'</div>';
  if(S.phase==='ask')h+='<div class="sfoot">'+(q.t==='ex'?(S.V.shown?'':'<button class="btn" data-a="show">Show model answer</button>'):'<button class="btn" data-a="check"'+(canCheck()?'':' disabled')+'>Check</button>')+'</div>';
  else h+=sheetHTML(q)}
 root.innerHTML=h+'</div>';const b=root.querySelector('.sbody');if(b&&keepScroll)b.scrollTop=sc;Mascots.sync(root)}
function answerText(q){return q.t==='mc'?q.o[0]:q.t==='tf'?(q.a?'True':'False'):q.t==='pick'?q.yes.join('; '):''}
function sheetHTML(q){const ok=S.res;
 if(q.t==='ex'){const r=S.rate;return '<div class="sheet ok"><div class="shd"><span class="dot" style="color:#fff">'+ic('pen',18)+'</span><b>'+(r===2?'Nicely put':r===1?'Getting there':'Now you know')+'</b></div><div class="say">'+Mascots.html('hazel',r===2?'cheer':'idle',110,'s-fb')+bubble('hazel',r===2?'Putting it in your own words is the hardest kind of question. Well done.':'Being honest about what you missed is how it sticks. It will come back in Practice.')+'</div><button class="btn ok" data-a="next">Continue</button></div>'}
 let who,pose,line,extra='';
 if(ok){who=S.combo>=3||Math.random()<.6?'gus':'hazel';pose=S.combo>=3?'hyped':'cheer';line=S.combo>=3?say(who,'combo'):(who==='gus'&&q.g)||(who==='hazel'&&q.h)||say(who,'right');extra=' data-combo="'+S.combo+'"'}
 else{line=q.h||say('hazel','wrong')}
 const ans=answerText(q);
 return '<div class="sheet '+(ok?'ok':'bad')+'" role="status"><div class="shd"><span class="dot" style="color:#fff">'+ic(ok?'check':'x',ok?20:16)+'</span><b>'+(ok?(S.combo>=3?S.combo+' in a row!':'Right!'):'Not quite')+'</b><span class="r">'+(ok?'+1 XP':S.hearts?'−1 heart':'')+'</span></div>'+
 '<p>'+(!ok&&ans?'<b>Answer: '+rich(ans)+'.</b> ':'')+rich(q.x||'')+'</p>'+
 (ok?'<div class="say">'+Mascots.html(who,pose,138,'s-fb',extra)+bubble(who,line)+'</div>':'<div class="say" style="align-items:flex-end">'+Mascots.html('hazel','wince',104,'s-fb')+Mascots.html('gus','facepalm',96,'s-fb2')+'<div style="align-self:center;flex:1;min-width:0">'+bubble('hazel',line)+'</div></div>')+
 '<button class="btn '+(ok?'ok':'bad')+'" data-a="next">'+(ok?'Continue':'Got it')+'</button></div>'}
function check(){if(!S||S.phase!=='ask'||!canCheck())return;const q=S.steps[S.i].q,V=S.V;let ok;
 if(q.t==='mc')ok=V.ord[V.sel]===0;else if(q.t==='tf')ok=V.sel===q.a;
 else if(q.t==='pick')ok=V.opts.every((o,k)=>!!V.sel[k]===!!o[1]);
 else if(q.t==='pair')ok=q.p.every((p,i)=>V.link[i]===i);
 else if(q.t==='sort')ok=V.items.every((it,k)=>V.place[k]===it.g);
 else if(q.t==='ord')ok=V.pick.every((x,i)=>x===i);
 grade(ok)}
function grade(ok){const q=S.steps[S.i].q,again=S.retry[q.id];S.res=ok;S.phase='fb';S.asked++;
 if(ok){S.right++;S.combo++;S.best=Math.max(S.best,S.combo);if(!again){S.first++;st.right++}if(S.mode==='weak'||S.mode==='mix')srsRight(q.id)}
 else{S.wrong++;S.combo=0;if(!again)st.wrong++;addMistake(q.id);if(S.hearts)loseHeart();
  if(S.mode==='lesson'&&!again){S.retry[q.id]=1;S.steps.push({k:'q',q})}}
 save();renderS(true);
 if(ok)confetti(S.combo>=3?70:36);else{const b=$('#sbody');if(b&&!reduce()){b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500)}}
 const sb=$('#sbody');if(sb&&(q.t==='pair'||q.t==='sort'||q.t==='ord')&&!ok)sb.scrollTop=sb.scrollHeight}
function next(){if(!S)return;if(S.hearts&&st.hearts<=0&&S.phase==='fb'&&S.i<S.steps.length-1){S.out=true;S.failed=true;renderS();return}
 S.i++;if(S.i>=S.steps.length)return finish();Mascots.forget('s-fb');newView();renderS()}
function outHTML(){const t=nextHeartIn();return '<div class="sess"><div class="shead"><button class="x" data-a="quit" aria-label="Close">'+ic('x',18)+'</button><div style="flex:1"></div></div><div class="sbody"><div class="center"><div class="duo">'+Mascots.html('hazel','comfort',170,'s-out1')+Mascots.html('gus','notcare',150,'s-out2')+'</div><h1>Out of hearts</h1><p class="muted">'+(S.failed?'Your place in the lesson is not lost for good. Finished lessons stay finished.':'You need at least one heart to start a lesson.')+' A heart comes back every 30 minutes'+(t?' (next one in <span class="num" id="hclock">'+t+'</span>)':'')+', or right away when you finish a practice round.</p>'+bubble('hazel',say('hazel','hearts'))+bubble('gus',say('gus','hearts'))+'</div></div><div class="sfoot" style="display:flex;flex-direction:column;gap:10px"><button class="btn" data-a="earn">Practice to earn a heart</button><button class="btn ghost" data-a="quit">Back to the path</button></div></div>'}
function finish(){const acc=S.asked?Math.round(S.first/Math.max(1,S.asked-Object.keys(S.retry).length)*100):100;let xp=0,title,sub='',unitStamp=false,pass=true;
 const nq=S.steps.filter(s=>s.k==='q').length,score=nq?S.right/nq:1;
 if(S.mode==='lesson'){const was=lessonDone(S.u,S.li);st.done[lkey(S.u,S.li)]=1;xp=(was?5:10)+S.first;title='Lesson complete';sub=S.u.lessons[S.li].t}
 else if(S.mode==='cp'||S.mode==='testout'){pass=score>=(S.mode==='cp'?.8:.85);if(pass){const was=unitDone(S.u);if(S.mode==='testout')S.u.lessons.forEach((l,i)=>st.done[lkey(S.u,i)]=1);st.cp[S.u.id]=1;xp=was?5:20+S.right;title='Unit complete';sub=S.u.title;unitStamp=true}else{xp=S.right;title=S.mode==='cp'?'Not this time':'Not yet';sub='You got '+S.right+' of '+nq+'. '+(S.mode==='cp'?'You need 80% to pass the checkpoint. Review the Guide and try again.':'You need 85% to test out. The lessons will get you there.')}}
 else{xp=5+S.right;title='Practice done';sub='';heartsTick();if(st.hearts<MAXH){st.hearts++;if(st.hearts>=MAXH)st.heartAt=0;sub='You earned a heart back.'}}
 const goalBefore=dayXP()<st.goal;addXP(xp);const goalHit=goalBefore&&dayXP()>=st.goal;save();
 const duo=unitStamp?'<div class="duo">'+Mascots.html('hazel','dance',160,'s-r1')+Mascots.html('gus','dance',160,'s-r2')+'</div>':pass?'<div class="duo">'+Mascots.html(S.mode==='lesson'&&Math.random()<.5?'hazel':'gus','dance',190,'s-r1')+'</div>':'<div class="duo">'+Mascots.html('hazel','comfort',160,'s-r1')+Mascots.html('gus','notcare',140,'s-r2')+'</div>';
 const who=pass?(Math.random()<.5?'gus':'hazel'):'hazel';
 S.result='<div class="sess"><div class="sbody"><div class="center">'+duo+(unitStamp?'<div class="stamp">Unit complete</div><h2>'+esc(sub)+'</h2>':'<h1>'+esc(title)+'</h1>'+(sub?'<p class="muted">'+esc(sub)+'</p>':''))+
  '<div class="tiles"><div class="tile"><b class="num" data-count="'+xp+'">0</b><small>XP earned</small></div><div class="tile"><b class="num"><span data-count="'+Math.min(100,acc)+'">0</span>%</b><small>First try</small></div><div class="tile"><b class="num" data-count="'+liveStreak()+'">0</b><small>Day streak</small></div></div>'+
  (goalHit?'<span class="chip">'+ic('flame',16)+'Daily goal met</span>':'')+bubble(who,pass?say(who,'done'):'Tests are for finding out what to review, and now we know. I believe in you.')+'</div></div><div class="sfoot"><button class="btn" data-a="done">Continue</button></div></div>';
 renderS();if(pass)confetti(unitStamp?140:80)}
function countUps(root){root.querySelectorAll('[data-count]').forEach(el=>{const to=+el.dataset.count;if(reduce()||!to){el.textContent=to;return}const t0=performance.now();(function tick(t){const p=Math.min(1,(t-t0)/900),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(tick)})(t0)})}

/* ---------- confetti: drawn on a canvas that sits behind the lesson content ---------- */
let confRaf=0;
function confetti(n){if(reduce())return;const c=$('#conf');if(!c)return;const dpr=Math.min(2,window.devicePixelRatio||1),W=c.clientWidth,H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);
 const cols=['#F2603A','#F7C531','#5FE0CC','#FF9A6E','#8E7CFF','#27B565'];const ps=[];for(let i=0;i<n;i++)ps.push({x:W/2+(Math.random()-.5)*W*.5,y:H*.42,vx:(Math.random()-.5)*620,vy:-380-Math.random()*520,w:6+Math.random()*7,h:9+Math.random()*9,r:Math.random()*6,vr:(Math.random()-.5)*14,c:cols[i%cols.length]});
 cancelAnimationFrame(confRaf);let last=performance.now(),t=0;
 (function f(now){const dt=Math.min(.033,(now-last)/1000);last=now;t+=dt;x.clearRect(0,0,W,H);const a=Math.max(0,1-Math.max(0,t-.9)/.5);
  ps.forEach(p=>{p.vy+=1500*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.985;p.r+=p.vr*dt;x.save();x.globalAlpha=a;x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore()});
  if(t<1.4)confRaf=requestAnimationFrame(f);else x.clearRect(0,0,W,H)})(last)}

/* ---------- practice ---------- */
function learnedQs(){const out=[];UNITS.forEach(u=>u.lessons.forEach((l,i)=>{if(lessonDone(u,i))l.items.forEach(q=>out.push(q))}));return out}
function startPractice(kind){let qs;
 if(kind==='weak'){qs=weakDue().map(id=>QS[id]);if(!qs.length)return toast(st.mistakes.length?'Nothing is due today. Come back tomorrow.':'No weak spots yet. Questions you miss will show up here.');qs=shuffle(qs).slice(0,10)}
 else if(kind==='explain'){qs=shuffle(learnedQs().filter(q=>q.t==='ex')).slice(0,3);if(!qs.length)return toast('Finish a lesson first.')}
 else{qs=shuffle(learnedQs().filter(q=>q.t!=='ex')).slice(0,10);if(!qs.length)return toast('Finish a lesson first, then review it here.')}
 start({mode:kind==='weak'?'weak':'mix',hearts:false,title:'Practice',steps:qs.map(q=>({k:'q',q}))})}

/* ---------- friends leaderboard (Firestore REST; shares a display name and game stats only) ---------- */
const LB_CFG={projectId:'means-and-ends',apiKey:'AIzaSyD8gZ38ipaRD9aLNzWqWpVgdv3uXGpmNMQ'};
function lbOn(){return !!(LB_CFG.projectId&&LB_CFG.apiKey)&&/github\.io$/.test(location.hostname)||!!window.ME_FORCE_LB}
const fsBase=()=>window.ME_FS_BASE||'https://firestore.googleapis.com/v1';
function lbURL(id){return fsBase()+'/projects/'+encodeURIComponent(LB_CFG.projectId)+'/databases/(default)/documents/players'+(id?'/'+encodeURIComponent(id):'')+'?key='+encodeURIComponent(LB_CFG.apiKey)}
function myRow(){return {name:st.lb.name,xp:st.xp,weekXp:weekXP(),week:weekStart(),streak:liveStreak(),units:doneUnits(),updated:new Date().toISOString()}}
function fsEnc(o){const f={};Object.keys(o).forEach(k=>{const v=o[k];f[k]=typeof v==='number'?{integerValue:String(Math.max(0,Math.round(v)))}:{stringValue:String(v)}});return {fields:f}}
function fsDec(d){const o={};const F=d.fields||{};Object.keys(F).forEach(k=>{const v=F[k];o[k]=v.integerValue!=null?+v.integerValue:v.doubleValue!=null?+v.doubleValue:v.stringValue!=null?v.stringValue:null});o.id=String(d.name||'').split('/').pop();return o}
const LB={rows:null,err:null,loading:false,at:0,mode:'week'};let lbTimer=null;
function lbPush(){if(!lbOn()||!st.lb.joined||!st.lb.id)return;clearTimeout(lbTimer);lbTimer=setTimeout(()=>{try{fetch(lbURL(st.lb.id),{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(fsEnc(myRow()))}).catch(()=>{})}catch(e){}},900)}
function lbLoad(){if(!lbOn()||LB.loading)return;LB.loading=true;LB.at=Date.now();
 fetch(lbURL()+'&pageSize=300').then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{LB.rows=(j.documents||[]).map(fsDec).filter(p=>p.name);LB.err=null})
 .catch(()=>{LB.err='Couldn\'t reach the leaderboard. Check your connection and try again.'}).then(()=>{LB.loading=false;if(tab==='friends'&&!S&&st.ob)render()})}
function newId(){try{if(crypto.randomUUID)return crypto.randomUUID().replace(/-/g,'')}catch(e){}return Date.now().toString(36)+Math.random().toString(36).slice(2,12)+Math.random().toString(36).slice(2,12)}
VIEWS.friends=function(){
 let h='<div class="page"><div class="pagehead">'+Mascots.html('gus','idle',92,'fr',' data-tap="gus" data-ctx="poke"')+'<div><h1>Friends</h1><p class="muted">Real people, real numbers. Nobody here is made up.</p></div></div>';
 if(!lbOn())return h+'<div class="card"><p>The friends leaderboard works in the published app at jaystone9.github.io/means-and-ends.</p></div></div>';
 if(!st.lb.joined)return h+'<div class="card" style="display:flex;flex-direction:column;gap:12px"><h3>Join the leaderboard</h3><p class="muted" style="font-size:15.500px">Pick the name your friends will see. The only things shared are that name and your game stats: XP, streak and units done. Nothing else leaves this device.</p><input class="textin" id="lbName" maxlength="24" placeholder="Display name" value="'+esc(st.lb.name||st.name||'')+'" aria-label="Display name"><button class="btn" data-a="lb-join">Join</button></div></div>';
 if(Date.now()-LB.at>30000)setTimeout(lbLoad,0);
 const wk=weekStart();const rows=(LB.rows||[]).slice();
 if(!rows.some(r=>r.id===st.lb.id))rows.push(Object.assign({id:st.lb.id},myRow()));
 rows.forEach(r=>{if(r.id===st.lb.id)Object.assign(r,myRow());r.wk=r.week===wk?(r.weekXp||0):0});
 const key=LB.mode==='week'?'wk':'xp';rows.sort((a,b)=>(b[key]||0)-(a[key]||0)||(b.xp||0)-(a.xp||0));
 h+='<div class="seg"><button class="'+(LB.mode==='week'?'on':'')+'" data-a="lb-mode" data-m="week" aria-pressed="'+(LB.mode==='week')+'">This week</button><button class="'+(LB.mode==='all'?'on':'')+'" data-a="lb-mode" data-m="all" aria-pressed="'+(LB.mode==='all')+'">All time</button></div>';
 h+='<div class="card">'+rows.map((r,i)=>{const me=r.id===st.lb.id;const n=String(r.name||'Player');
  return '<div class="lbrow'+(me?' me':'')+'"><span class="rank num">'+(i+1)+'</span><span class="av">'+esc(n[0].toUpperCase())+'</span><div class="who"><b>'+esc(n)+(me?' (you)':'')+'</b><small>'+(+r.streak||0)+'-day streak · '+(+r.units||0)+((+r.units===1)?' unit done':' units done')+'</small></div><span class="pts num">'+(+r[key]||0)+'<small>XP</small></span></div>'}).join('')+'</div>';
 if(rows.length<2)h+='<p class="muted" style="font-size:15px">It\'s just you so far. Share the app link with a friend and they will show up here when they join.</p>';
 h+='<p class="muted" style="font-size:14px">'+(LB.loading?'Updating…':LB.err?esc(LB.err):'Weekly XP starts over every Monday.')+' <button class="link" data-a="lb-refresh">Refresh</button></p>';
 h+='<details><summary>Leaderboard settings</summary><div class="setrow"><span>Display name</span><input class="textin" data-in="lbname" maxlength="24" value="'+esc(st.lb.name)+'" aria-label="Display name" style="max-width:180px"></div><div class="setrow"><span>Leave the leaderboard<br><small>Removes your name and stats for everyone</small></span><button class="btn ghost sm" data-a="lb-leave">Leave</button></div></details>';
 return h+'</div>'};

/* ---------- play reminders (Web Push; settings stored in Firestore, sent by a scheduled job) ---------- */
const VAPID_PUBLIC='__VAPID_PUBLIC__';
const REM_FREQ=[['off','Off'],['daily','Daily'],['every2','Every 2 days'],['weekly','Weekly']];
function remSupported(){return VAPID_PUBLIC.length>40&&lbOn()&&'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window&&window.isSecureContext}
function isIOS(){return /iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function isStandalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}
function remURL(id){return fsBase()+'/projects/'+encodeURIComponent(LB_CFG.projectId)+'/databases/(default)/documents/reminders/'+encodeURIComponent(id)+'?key='+encodeURIComponent(LB_CFG.apiKey)}
function lastPlayedDay(){const ds=Object.keys(st.days).filter(d=>st.days[d]>0).sort();return ds.length?ds[ds.length-1]:''}
let remTimer=null,remSub=null;
function remPush(){if(!lbOn()||!st.rem.on||!remSub)return;clearTimeout(remTimer);remTimer=setTimeout(()=>{try{
 const body={endpoint:remSub.endpoint,p256dh:remSub.keys.p256dh,auth:remSub.keys.auth,freq:st.rem.freq,hour:st.rem.hour,tz:Intl.DateTimeFormat().resolvedOptions().timeZone||'America/Los_Angeles',lastPlayed:lastPlayedDay(),updated:new Date().toISOString()};
 const mask=Object.keys(body).map(k=>'updateMask.fieldPaths='+k).join('&');
 fetch(remURL(st.rem.id)+'&'+mask,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(fsEnc(body))}).catch(()=>{})}catch(e){}},1200)}
function b64u(s){const p='='.repeat((4-s.length%4)%4);const b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))}
function remKeyOk(sub){if(st.rem.key!==VAPID_PUBLIC)return false;try{const k=sub.options&&sub.options.applicationServerKey;if(!k)return true;const a=new Uint8Array(k),b=b64u(VAPID_PUBLIC);return a.length===b.length&&a.every((x,i)=>x===b[i])}catch(e){return true}}
/* Re-subscribes on its own whenever the phone's signup has gone stale: missing, expired, or made with an older key. */
async function remSubscribe(){const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
 if(sub&&(!remKeyOk(sub)||(sub.expirationTime&&sub.expirationTime<Date.now()+864e5))){try{await sub.unsubscribe()}catch(e){}sub=null}
 if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUBLIC)});st.rem.key=VAPID_PUBLIC;remSub=sub.toJSON();save();return remSub}
async function remEnable(freq){if(!remSupported())return;
 if(isIOS()&&!isStandalone()){toast('On iPhone, add Means &amp; Ends to your Home Screen first.',4000);render();return}
 let perm=Notification.permission;if(perm==='default'){try{perm=await Notification.requestPermission()}catch(e){perm='denied'}}
 if(perm!=='granted'){st.rem.on=false;st.rem.freq='off';save();toast('Notifications are blocked. Turn them on in your device settings to get reminders.',4000);render();return}
 try{await remSubscribe()}catch(e){toast('Couldn\'t turn on reminders on this device.');render();return}
 if(!st.rem.id)st.rem.id=newId();st.rem.freq=freq;st.rem.on=true;save();remPush();render();toast('Reminders on. Gus will be insufferable about it.')}
function remDisable(){st.rem.on=false;st.rem.freq='off';save();if(lbOn()&&st.rem.id){try{fetch(remURL(st.rem.id),{method:'DELETE'}).catch(()=>{})}catch(e){}}
 navigator.serviceWorker&&navigator.serviceWorker.ready.then(r=>r.pushManager.getSubscription()).then(s=>s&&s.unsubscribe()).catch(()=>{});render()}
function remInit(){if(!remSupported()||!st.rem.on)return;
 if(Notification.permission!=='granted'){st.rem.on=false;st.rem.freq='off';save();return}
 remSubscribe().then(()=>remPush()).catch(()=>{})}
function hourLabel(h){return (h%12||12)+':00 '+(h<12?'AM':'PM')}
function remRow(){
 if(!remSupported())return '<div class="setrow"><span>Play reminders<br><small>Available in the installed app at jaystone9.github.io/means-and-ends</small></span></div>';
 const iosTip=isIOS()&&!isStandalone()?'<br><small>On iPhone: tap Share, then Add to Home Screen, and open it from there.</small>':'';
 const blocked=Notification.permission==='denied'?'<br><small>Notifications are blocked for this app in your device settings.</small>':'';
 return '<div class="setrow"><span>Play reminders<br><small>From Gus, and only if you haven\'t played yet that day</small>'+iosTip+blocked+'</span><select data-in="remfreq" aria-label="Play reminders">'+REM_FREQ.map(f=>'<option value="'+f[0]+'"'+(st.rem.freq===f[0]?' selected':'')+'>'+f[1]+'</option>').join('')+'</select></div>'+
 (st.rem.on?'<div class="setrow"><span>Remind me at</span><select data-in="remhour" aria-label="Reminder time">'+[7,8,9,12,15,17,18,19,20,21].map(x=>'<option value="'+x+'"'+(st.rem.hour===x?' selected':'')+'>'+hourLabel(x)+'</option>').join('')+'</select></div>':'')}

/* ---------- actions ---------- */
function unitById(id){return UNITS.find(u=>u.id===id)}
function guideHTML(u){return '<h2>'+esc(u.title)+'</h2><p class="muted">'+esc(u.blurb)+'</p><div class="guide">'+u.lessons.map((l,i)=>'<h3>'+(i+1)+'. '+esc(l.t)+'</h3><ul>'+l.items.map(q=>'<li>'+rich(q.teach)+'</li>').join('')+'</ul>').join('')+'</div>'}
const ACT={
 tab(el){const t=el.dataset.t;if(t===tab&&t==='learn'){toCurrent(true);return}tab=t;render();if(t==='learn')toCurrent(false);else window.scrollTo(0,0);if(t==='friends')lbLoad()},
 totop(){window.scrollTo({top:0,behavior:reduce()?'auto':'smooth'})},
 go(){const n=nextNode();if(n)startNode(n.u,n.cp?n.u.lessons.length:n.li)},
 node(el){const u=unitById(el.dataset.u),i=+el.dataset.i,ns=unitNodes(u),n=ns[i],nx=nextNode();
  if(nx&&nx.u===u&&((nx.cp&&n.cp)||(!nx.cp&&!n.cp&&nx.li===n.li)))return startNode(u,i);
  if(n.done)return modal('<h2>'+esc(n.cp?u.title+' checkpoint':u.lessons[i].t)+'</h2><p class="muted">'+(n.cp?'You passed this checkpoint.':esc(u.lessons[i].sub||'')+' You finished this lesson.')+'</p><button class="btn" data-a="redo" data-u="'+u.id+'" data-i="'+i+'">'+(n.cp?'Take it again':'Practice it again')+'</button>');
  toast(unitOpen(u)?'Finish the lessons before this one first.':'Pass the checkpoint before this unit to open it.')},
 redo(el){closeModal();startNode(unitById(el.dataset.u),+el.dataset.i)},
 guide(el){modal(guideHTML(unitById(el.dataset.u)))},
 testout(el){const u=unitById(el.dataset.u);modal('<h2>Test out of '+esc(u.title)+'?</h2><p class="muted">Already know this unit? Answer its questions with no lessons first. Score 85% or better and the whole unit is marked done. It costs no hearts, and nothing happens if you miss.</p><button class="btn" data-a="testgo" data-u="'+u.id+'">Start the test</button>')},
 testgo(el){closeModal();const u=unitById(el.dataset.u);start({mode:'testout',u,hearts:false,title:'Test out',steps:cpSteps(u)})},
 tracks(){modal('<h2>Choose a level</h2>'+TRACKS.map(t=>{const us=trackUnits(t.id),d=us.filter(unitDone).length;return '<button class="trk'+(st.track===t.id?' on':'')+'" data-a="track" data-t="'+t.id+'"><div><b>'+esc(t.name)+'</b><small>'+esc(t.sub)+'</small></div><span class="chip">'+d+'/'+us.length+'</span></button>'}).join(''))},
 track(el){st.track=el.dataset.t;save();closeModal();tab='learn';lastWalk=null;render();window.scrollTo(0,0)},
 hearts(){heartsTick();const t=nextHeartIn();modal('<h2>'+st.hearts+' of '+MAXH+' hearts</h2><p class="muted">A wrong answer in a lesson or checkpoint costs one heart. Explaining in your own words and practice never do. One heart comes back every 30 minutes'+(t?' (next in '+t+')':'')+', and finishing a practice round earns one right away.</p>'+(st.hearts<MAXH?'<button class="btn" data-a="earn">Practice to earn a heart</button>':''))},
 earn(){closeModal();const had=!!S;if(had){S=null;$('#ov').classList.remove('on');document.body.style.overflow=''}const qs=learnedQs().filter(q=>q.t!=='ex');if(!qs.length){if(had)render();return toast('Finish your first lesson to unlock practice. Hearts also refill on their own.',3600)}startPractice(weakDue().length?'weak':'mix')},
 weak(){startPractice('weak')},mix(){startPractice('mix')},explain(){startPractice('explain')},
 close(){closeModal()},
 quit(){if(S&&!S.out&&!S.result&&S.i>0)return modal('<h2>Leave this '+(S.mode==='lesson'?'lesson':'round')+'?</h2><p class="muted">Your progress in it will not be saved.</p><button class="btn bad" data-a="quit2">Leave</button><button class="btn ghost" data-a="close">Keep going</button>');closeOv()},
 quit2(){closeModal();closeOv()},
 done(){closeOv();if(tab==='learn')setTimeout(()=>toCurrent(true),60)},
 next(){next()},check(){check()},
 sel(el){S.V.sel=+el.dataset.k;renderS(true)},
 tf(el){S.V.sel=el.dataset.v==='1';renderS(true)},
 pick(el){const k=el.dataset.k;S.V.sel[k]=!S.V.sel[k];renderS(true)},
 pl(el){const i=+el.dataset.i;if(S.V.link[i]!=null){delete S.V.link[i];S.V.selL=-1}else S.V.selL=S.V.selL===i?-1:i;renderS(true)},
 pr(el){const i=+el.dataset.i,V=S.V;const owner=Object.keys(V.link).find(l=>V.link[l]===i);if(owner!=null){delete V.link[owner];if(V.selL<0){renderS(true);return}}if(V.selL>=0){V.link[V.selL]=i;V.selL=-1}renderS(true)},
 si(el){const k=+el.dataset.k;S.V.sel=S.V.sel===k?-1:k;renderS(true)},
 sb(el){if(S.V.sel<0)return;S.V.place[S.V.sel]=+el.dataset.g;S.V.sel=-1;renderS(true)},
 su(el){delete S.V.place[+el.dataset.k];renderS(true)},
 ord(el){const i=+el.dataset.i,p=S.V.pick,n=p.indexOf(i);if(n>=0)p.splice(n,1);else p.push(i);renderS(true)},
 show(){S.V.shown=true;renderS(true);const b=$('#sbody');if(b)b.scrollTop=b.scrollHeight},
 rate(el){const r=+el.dataset.r,q=S.steps[S.i].q;S.rate=r;S.asked++;if(r===2){S.right++;S.first++;srsRight(q.id)}else if(r===0)addMistake(q.id);S.res=true;S.phase='fb';save();renderS(true);if(r===2)confetti(30)},
 'ob-next'(){obStep++;render();window.scrollTo(0,0)},
 'ob-track'(el){st.track=el.dataset.t;render()},
 'ob-goal'(el){st.goal=+el.dataset.g;render()},
 'ob-done'(){st.ob=true;save();render();window.scrollTo(0,0)},
 reset(){modal('<h2>Erase all progress?</h2><p class="muted">Your XP, streak and finished lessons on this device will be gone for good.</p><button class="btn bad" data-a="reset2">Erase everything</button><button class="btn ghost" data-a="close">Keep my progress</button>')},
 reset2(){const lb=st.lb,rem=st.rem;st=fresh();st.lb=lb;st.rem=rem;obStep=0;save();closeModal();tab='learn';render();window.scrollTo(0,0)},
 'lb-join'(){const n=($('#lbName').value||'').trim().slice(0,24);if(!n)return toast('Type a display name first.');st.lb.name=n;if(!st.name)st.name=n;if(!st.lb.id)st.lb.id=newId();st.lb.joined=true;save();LB.at=0;render();lbLoad()},
 'lb-mode'(el){LB.mode=el.dataset.m;render()},
 'lb-refresh'(){LB.at=0;lbLoad();render()},
 'lb-leave'(){modal('<h2>Leave the leaderboard?</h2><p class="muted">Your name and stats will be removed for everyone. Your progress on this device stays.</p><button class="btn bad" data-a="lb-leave2">Leave</button><button class="btn ghost" data-a="close">Stay</button>')},
 'lb-leave2'(){if(lbOn()&&st.lb.id){try{fetch(lbURL(st.lb.id),{method:'DELETE'}).catch(()=>{})}catch(e){}}st.lb.joined=false;save();closeModal();LB.rows=null;render()}
};
document.addEventListener('click',e=>{const m=e.target.closest('[data-tap]');if(m&&!e.target.closest('[data-a]')){Mascots.poke(m);const w=m.dataset.tap,ctx=m.dataset.ctx;const pool=LINES[w][ctx]&&Math.random()<.4?ctx:'poke';toast('<span style="display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;opacity:.75">'+label(w)+'</span>'+esc(say(w,pool)),3400);return}
 const el=e.target.closest('[data-a]');if(!el||el.disabled)return;const f=ACT[el.dataset.a];if(f){e.preventDefault();f(el)}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[role=button][data-a],[data-tap]')){e.preventDefault();e.target.click()}
 if(e.key==='Escape'&&$('.modal'))closeModal();
 if(e.key==='Enter'&&S&&!e.target.matches('textarea,button,input,select')){const b=$('#sroot [data-a=next],#sroot [data-a=check]:not([disabled]),#sroot [data-a=done]');if(b)b.click()}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.in;if(!k)return;const v=e.target.value;
 if(k==='ex'){S.V.text=v;return}
 if(k==='name'){st.name=v.trim().slice(0,24);save()}
 else if(k==='lbname'){const n=v.trim().slice(0,24);if(n){st.lb.name=n;save()}}});
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.in;if(!k)return;const v=e.target.value;
 if(k==='goal'){st.goal=+v;save();render()}
 else if(k==='theme'){st.theme=v;save();applyTheme()}
 else if(k==='remfreq'){if(v==='off')remDisable();else remEnable(v)}
 else if(k==='remhour'){st.rem.hour=+v;save()}});
document.addEventListener('pointermove',e=>Mascots.look(e.clientX,e.clientY),{passive:true});
document.addEventListener('pointerdown',e=>Mascots.look(e.clientX,e.clientY),{passive:true});
window.addEventListener('scroll',onScroll,{passive:true});
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyTheme)}catch(e){}
setInterval(()=>{if(!st)return;const h=st.hearts;heartsTick();const c=$('#hclock');if(c)c.textContent=nextHeartIn()||'0:00';if(st.hearts!==h){save();if(S&&S.out&&!S.failed){closeOv()}else if(!S)render()}},1000);

/* ---------- new version check: reloads on open, never in the middle of a lesson ---------- */
let wantReload=false;
function pendingReload(){if(wantReload&&!S){wantReload=false;location.reload()}}
function versionCheck(){if(!window.ME_BUILD||!window.fetch||location.protocol==='file:')return;fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{t=(t||'').trim();if(t&&/^\d+$/.test(t)&&t!==window.ME_BUILD){if(sessionStorage.getItem('me.reloaded')===t)return;try{sessionStorage.setItem('me.reloaded',t)}catch(e){}wantReload=true;pendingReload()}}).catch(()=>{})}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){versionCheck();heartsTick();if(!S&&st&&st.ob)render()}});
window.addEventListener('pageshow',versionCheck);

/* ---------- boot ---------- */
load();applyTheme();heartsTick();
document.body.insertAdjacentHTML('afterbegin',SCDEFS);
render();save();remInit();versionCheck();
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{})}
