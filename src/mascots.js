/* ===== Gus the seagull and Hazel the beaver =====
   Each mascot is one SVG built from separate parts (body, head, wings or arms, tail, eyes, lids, brows, beak or mouth).
   A small spring simulation moves the parts toward a target pose every frame, so motion overshoots and settles
   instead of sliding linearly. With "reduce motion" on, each mascot is drawn once in a still pose and nothing animates. */
const Mascots=(function(){
'use strict';
const reduce=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const STAR='M0 -12 L3.5 -3.5 L12 0 L3.5 3.5 L0 12 L-3.5 3.5 L-12 0 L-3.5 -3.5Z';
const DEFS='<svg width="0" height="0" style="position:absolute;left:-9px;top:-9px" aria-hidden="true" focusable="false"><defs>'+
'<radialGradient id="gus-body" cx="38%" cy="28%" r="78%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF1F7"/><stop offset="1" stop-color="#BCC4D6"/></radialGradient>'+
'<radialGradient id="gus-wing" cx="35%" cy="22%" r="85%"><stop offset="0" stop-color="#E3E7F0"/><stop offset=".6" stop-color="#A7B0C3"/><stop offset="1" stop-color="#737D93"/></radialGradient>'+
'<radialGradient id="gus-beak" cx="30%" cy="25%" r="85%"><stop offset="0" stop-color="#FFEFA6"/><stop offset=".5" stop-color="#FFC233"/><stop offset="1" stop-color="#E08600"/></radialGradient>'+
'<radialGradient id="gus-foot" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFC774"/><stop offset=".6" stop-color="#F28A1E"/><stop offset="1" stop-color="#C2620A"/></radialGradient>'+
'<radialGradient id="gus-eye" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE1EC"/></radialGradient>'+
'<radialGradient id="gus-tip" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#5E6880"/><stop offset="1" stop-color="#262B3A"/></radialGradient>'+
'<linearGradient id="gus-fry" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE68A"/><stop offset="1" stop-color="#E9A72E"/></linearGradient>'+
'<clipPath id="gus-cl"><circle cx="80" cy="82" r="16"/></clipPath><clipPath id="gus-cr"><circle cx="122" cy="80" r="17"/></clipPath>'+
'<radialGradient id="haz-fur" cx="36%" cy="26%" r="80%"><stop offset="0" stop-color="#E2A46A"/><stop offset=".55" stop-color="#B7773F"/><stop offset="1" stop-color="#7A4522"/></radialGradient>'+
'<radialGradient id="haz-belly" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF3E0"/><stop offset=".6" stop-color="#F3D3A6"/><stop offset="1" stop-color="#D8A970"/></radialGradient>'+
'<linearGradient id="haz-tail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A5C38"/><stop offset="1" stop-color="#4A2E1C"/></linearGradient>'+
'<radialGradient id="haz-scarf" cx="35%" cy="25%" r="85%"><stop offset="0" stop-color="#5FE0CC"/><stop offset=".55" stop-color="#1FA595"/><stop offset="1" stop-color="#0D6B60"/></radialGradient>'+
'<radialGradient id="haz-nose" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#7A4E3E"/><stop offset="1" stop-color="#2A1A14"/></radialGradient>'+
'<radialGradient id="haz-eye" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6DED3"/></radialGradient>'+
'<radialGradient id="haz-paw" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#8E5C3A"/><stop offset="1" stop-color="#4E2F1C"/></radialGradient>'+
'<clipPath id="haz-cl"><circle cx="80" cy="66" r="11.5"/></clipPath><clipPath id="haz-cr"><circle cx="120" cy="66" r="11.5"/></clipPath>'+
'<radialGradient id="m-shadow"><stop offset="0" stop-color="#1A1533" stop-opacity=".35"/><stop offset="1" stop-color="#1A1533" stop-opacity="0"/></radialGradient>'+
'<radialGradient id="m-aura"><stop offset="0" stop-color="#FF9A5C" stop-opacity=".9"/><stop offset="1" stop-color="#FF9A5C" stop-opacity="0"/></radialGradient>'+
'</defs></svg>';
const SPARKS='<g data-p="s1"><path d="'+STAR+'" fill="#FF7A5C"/></g><g data-p="s2"><path d="'+STAR+'" fill="#FFC233"/></g><g data-p="s3"><path d="'+STAR+'" fill="#FF7A5C"/></g><g data-p="s4"><path d="'+STAR+'" fill="#FFC233"/></g>';
const GUS='<circle data-p="aura" cx="100" cy="130" r="90" fill="url(#m-aura)" opacity="0"/><ellipse data-p="shadow" cx="100" cy="210" rx="58" ry="11" fill="url(#m-shadow)"/>'+
'<g data-p="flip"><g data-p="root">'+
'<g data-p="tail"><path d="M138 158 C160 146 184 148 194 160 C184 166 180 176 184 186 C168 182 150 180 138 174 Z" fill="url(#gus-wing)"/><path d="M182 152 C190 154 194 158 194 160 C186 166 182 172 184 180 C178 172 178 160 182 152Z" fill="url(#gus-tip)"/></g>'+
'<ellipse cx="80" cy="201" rx="17" ry="8" fill="url(#gus-foot)"/><ellipse cx="120" cy="201" rx="17" ry="8" fill="url(#gus-foot)"/>'+
'<ellipse cx="100" cy="150" rx="60" ry="55" fill="url(#gus-body)"/><ellipse cx="84" cy="132" rx="26" ry="16" fill="#FFFFFF" opacity=".75" transform="rotate(-15 84 132)"/>'+
'<g data-p="wingL"><path d="M50 118 C28 126 20 160 32 188 C37 195 46 195 50 188 C63 166 66 138 50 118Z" fill="url(#gus-wing)"/><path d="M32 188 C37 195 46 195 50 188 C46 178 39 176 32 181Z" fill="url(#gus-tip)"/></g>'+
'<g data-p="wingR"><path d="M150 118 C172 126 180 160 168 188 C163 195 154 195 150 188 C137 166 134 138 150 118Z" fill="url(#gus-wing)"/><path d="M168 188 C163 195 154 195 150 188 C154 178 161 176 168 181Z" fill="url(#gus-tip)"/></g>'+
'<g data-p="head">'+
'<path d="M94 42 C84 24 90 10 102 2 C100 16 104 28 110 42Z" fill="url(#gus-wing)"/><path d="M84 48 C72 38 70 26 74 16 C80 28 88 36 96 44Z" fill="url(#gus-wing)"/><path d="M110 44 C116 32 126 26 136 26 C128 34 122 42 118 48Z" fill="url(#gus-wing)"/>'+
'<circle cx="100" cy="86" r="52" fill="url(#gus-body)"/><ellipse cx="80" cy="56" rx="20" ry="10" fill="#FFFFFF" opacity=".9" transform="rotate(-22 80 56)"/>'+
'<circle cx="80" cy="82" r="16" fill="url(#gus-eye)"/><circle cx="122" cy="80" r="17" fill="url(#gus-eye)"/>'+
'<g data-p="pup"><circle cx="83" cy="84" r="9" fill="#1A1533"/><circle cx="86.5" cy="80" r="3.2" fill="#FFFFFF"/><circle cx="80" cy="88.5" r="1.5" fill="#FFFFFF" opacity=".7"/><circle cx="125" cy="82" r="9.5" fill="#1A1533"/><circle cx="128.5" cy="78" r="3.4" fill="#FFFFFF"/><circle cx="122" cy="86.5" r="1.5" fill="#FFFFFF" opacity=".7"/></g>'+
'<g clip-path="url(#gus-cl)"><rect data-p="lidL" x="60" y="66" width="40" height="11" fill="#E4E8F0"/><rect data-p="lidLb" x="60" y="75" width="40" height="3" fill="#8D96AA"/></g>'+
'<g clip-path="url(#gus-cr)"><rect data-p="lidR" x="100" y="63" width="44" height="12" fill="#E4E8F0"/><rect data-p="lidRb" x="100" y="73" width="44" height="3" fill="#8D96AA"/></g>'+
'<rect data-p="browL" x="65" y="57" width="30" height="8" rx="4" fill="#3A3F52"/><rect data-p="browR" x="107" y="53" width="32" height="8" rx="4" fill="#3A3F52"/>'+
'<g data-p="shades" opacity="0"><rect x="60" y="70" width="42" height="24" rx="11" fill="#1A1533"/><rect x="102" y="67" width="44" height="26" rx="12" fill="#1A1533"/><path d="M68 76 L80 76" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".55"/><path d="M110 73 L124 73" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>'+
'<ellipse data-p="mouth" cx="124" cy="116" rx="24" ry="2" fill="#6B1F2E"/>'+
'<g data-p="lower"><path d="M96 112 C116 116 142 114 160 108 C152 124 120 132 100 124Z" fill="#E8930C"/><circle cx="146" cy="116" r="4.2" fill="#E4472B"/></g>'+
'<path d="M92 106 C100 90 136 90 162 102 C168 105 168 112 162 113 C140 116 114 116 96 114Z" fill="url(#gus-beak)"/><ellipse cx="126" cy="101" rx="3.4" ry="1.8" fill="#B36A00"/><ellipse cx="112" cy="97" rx="11" ry="3" fill="#FFFFFF" opacity=".6"/>'+
'<g data-p="fry"><rect x="158" y="84" width="10" height="40" rx="3" fill="url(#gus-fry)" transform="rotate(38 163 104)"/><rect x="160" y="88" width="3" height="28" rx="1.5" fill="#FFF6C8" opacity=".7" transform="rotate(38 163 104)"/></g>'+
'<g data-p="palm" opacity="0"><path d="M168 100 C170 74 150 58 128 58 L104 60 C98 62 98 68 104 70 L114 70 L100 76 C94 80 98 86 104 84 L116 80 L104 88 C98 92 102 98 108 96 L122 90 C134 104 158 112 168 100Z" fill="url(#gus-wing)"/><path d="M104 60 C98 62 98 68 104 70 L112 69 C108 66 108 62 110 60Z M100 76 C94 80 98 86 104 84 L110 82 C106 80 105 78 106 75Z M104 88 C98 92 102 98 108 96 L113 94 C109 92 108 90 110 87Z" fill="url(#gus-tip)"/></g>'+
'<path data-p="sweat" d="M54 50 C49 59 49 66 54 68 C59 66 59 59 54 50Z" fill="#7CC4FF" opacity="0"/>'+
'</g></g></g>'+SPARKS;
const HAZ='<circle data-p="aura" cx="100" cy="130" r="90" fill="url(#m-aura)" opacity="0"/><ellipse data-p="shadow" cx="100" cy="210" rx="60" ry="11" fill="url(#m-shadow)"/>'+
'<g data-p="root">'+
'<g data-p="tail"><ellipse cx="162" cy="182" rx="38" ry="18" transform="rotate(-24 162 182)" fill="url(#haz-tail)"/><path d="M138 182 L176 166 M144 192 L184 175 M150 172 L168 196 M164 166 L182 190" stroke="#2E1C10" stroke-width="2" opacity=".35" stroke-linecap="round"/><ellipse cx="156" cy="174" rx="16" ry="4" transform="rotate(-24 156 174)" fill="#FFFFFF" opacity=".18"/></g>'+
'<ellipse cx="78" cy="203" rx="19" ry="9" fill="url(#haz-paw)"/><ellipse cx="122" cy="203" rx="19" ry="9" fill="url(#haz-paw)"/>'+
'<path d="M100 98 C150 98 164 148 158 176 C152 202 126 208 100 208 C74 208 48 202 42 176 C36 148 50 98 100 98Z" fill="url(#haz-fur)"/><ellipse cx="100" cy="166" rx="38" ry="35" fill="url(#haz-belly)"/>'+
'<path d="M52 104 C78 120 122 120 148 104 L150 120 C124 136 76 136 50 120Z" fill="url(#haz-scarf)"/><path d="M62 120 L54 156 C60 160 68 160 74 156 L78 124Z" fill="url(#haz-scarf)"/>'+
'<path d="M60 110 L58 124 M74 116 L72 130 M88 119 L87 133 M102 120 L102 134 M116 119 L117 133 M130 116 L132 130 M142 110 L144 124" stroke="#0D6B60" stroke-width="2" opacity=".45" stroke-linecap="round"/><path d="M56 156 L54 164 M62 158 L61 166 M68 158 L68 166" stroke="#1FA595" stroke-width="3" stroke-linecap="round"/>'+
'<g data-p="head">'+
'<circle cx="58" cy="38" r="15" fill="url(#haz-fur)"/><circle cx="58" cy="39" r="7.5" fill="#E8977F"/><circle cx="142" cy="38" r="15" fill="url(#haz-fur)"/><circle cx="142" cy="39" r="7.5" fill="#E8977F"/>'+
'<ellipse cx="100" cy="72" rx="52" ry="47" fill="url(#haz-fur)"/><ellipse cx="80" cy="40" rx="20" ry="9" fill="#FFFFFF" opacity=".3" transform="rotate(-18 80 40)"/>'+
'<ellipse cx="100" cy="96" rx="28" ry="20" fill="url(#haz-belly)"/><ellipse cx="64" cy="92" rx="10" ry="6.5" fill="#F07C6A" opacity=".5"/><ellipse cx="136" cy="92" rx="10" ry="6.5" fill="#F07C6A" opacity=".5"/>'+
'<ellipse data-p="mouth" cx="100" cy="109" rx="9" ry="1" fill="#5A1E2A"/><path data-p="smile" d="M84 101 Q100 115 116 101" stroke="#5A3A2E" stroke-width="3" fill="none" stroke-linecap="round"/>'+
'<g data-p="teeth"><rect x="92" y="101" width="16" height="15" rx="3.5" fill="#FFFFFF"/><path d="M100 101v15" stroke="#D9D0C2" stroke-width="1.6"/></g>'+
'<ellipse cx="100" cy="88" rx="12" ry="8" fill="url(#haz-nose)"/><ellipse cx="96" cy="85" rx="4" ry="2.2" fill="#FFFFFF" opacity=".55"/>'+
'<g data-p="happy" opacity="0"><path d="M70 70 Q80 58 90 70" stroke="#2A1A14" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M110 70 Q120 58 130 70" stroke="#2A1A14" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>'+
'<g data-p="open"><circle cx="80" cy="66" r="11.5" fill="url(#haz-eye)"/><circle cx="120" cy="66" r="11.5" fill="url(#haz-eye)"/>'+
'<g data-p="pup"><circle cx="80" cy="67" r="7.5" fill="#2A1A14"/><circle cx="83" cy="63.5" r="2.8" fill="#FFFFFF"/><circle cx="120" cy="67" r="7.5" fill="#2A1A14"/><circle cx="123" cy="63.5" r="2.8" fill="#FFFFFF"/></g>'+
'<g clip-path="url(#haz-cl)"><rect data-p="lidL" x="66" y="54" width="28" height="0" fill="#B7773F"/><rect data-p="lidLb" x="66" y="53" width="28" height="2.5" fill="#6B4228"/></g>'+
'<g clip-path="url(#haz-cr)"><rect data-p="lidR" x="106" y="54" width="28" height="0" fill="#B7773F"/><rect data-p="lidRb" x="106" y="53" width="28" height="2.5" fill="#6B4228"/></g></g>'+
'<circle cx="80" cy="66" r="18" fill="#FFFFFF" fill-opacity=".12" stroke="#4A2E1E" stroke-width="4"/><circle cx="120" cy="66" r="18" fill="#FFFFFF" fill-opacity=".12" stroke="#4A2E1E" stroke-width="4"/><path d="M98 64 Q100 59 102 64" stroke="#4A2E1E" stroke-width="4" fill="none"/>'+
'<path d="M70 58 Q74 54 79 53" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M110 58 Q114 54 119 53" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>'+
'<rect data-p="browL" x="68" y="38" width="24" height="6.5" rx="3.25" fill="#5A3A26"/><rect data-p="browR" x="108" y="38" width="24" height="6.5" rx="3.25" fill="#5A3A26"/>'+
'</g>'+
'<g data-p="armL"><ellipse cx="50" cy="152" rx="13" ry="25" transform="rotate(16 50 152)" fill="url(#haz-fur)"/><ellipse cx="44" cy="173" rx="10" ry="9" fill="url(#haz-paw)"/></g>'+
'<g data-p="armR"><ellipse cx="150" cy="152" rx="13" ry="25" transform="rotate(-16 150 152)" fill="url(#haz-fur)"/><g data-p="stick"><rect x="160" y="112" width="8" height="80" rx="4" fill="#9A6634" transform="rotate(-10 160 172)"/><ellipse cx="160" cy="116" rx="11" ry="5" fill="#5FB86A" transform="rotate(-40 160 116)"/></g><ellipse cx="156" cy="173" rx="10" ry="9" fill="url(#haz-paw)"/></g>'+
'</g>'+
'<g data-p="heart" opacity="0"><path d="M100 -6 C92 -18 72 -14 74 0 C76 10 100 24 100 24 C100 24 124 10 126 0 C128 -14 108 -18 100 -6Z" fill="#FF5C7A"/><ellipse cx="86" cy="-6" rx="5" ry="3" fill="#FFFFFF" opacity=".5"/></g>'+SPARKS;

const NAMES={gus:'Gus the seagull',hazel:'Hazel the beaver'};
/* App-level pose names map onto each character's own acting. */
const ALIAS={gus:{right:'cheer',wrong:'facepalm',comfort:'notcare'},hazel:{right:'cheer',wrong:'wince',comfort:'comfort'}};
const SNAP={idle:.1,hello:.4,think:1,cheer:.27,facepalm:1.5,wince:.4,hyped:.2,notcare:1.5,comfort:1,dance:.25,hop:.2,sad:1};
const SPRING={rootY:[520,24],squash:[700,13],pupX:[500,30],pupY:[500,30],lid:[700,40],flip:[260,22],palm:[220,17],happy:[900,60],heartY:[120,14]};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function targets(who,pose,t,T,o){
 const s=Math.sin,P=o||{};let c;
 const hop=(per,up,h)=>{const k=t%per;const a=k<up?s(Math.PI*k/up):0;c.rootY=-h*a;c.squash=k<up?-.07*a:(k-up<.12?.16:0);return{a:a,n:Math.floor(t/per),c:k}};
 if(who==='gus'){
  c={rootX:0,rootY:0,rot:0,spin:0,headRot:4*s(T*.7),headY:0,wingL:0,wingR:0,tail:0,pupX:[0,5,0,-5][Math.floor(T/2.2)%4],pupY:0,lid:.35,browL:-14,browR:6,browY:0,mouth:0,palm:0,flip:1,fry:1,shades:0,spark:0,squash:0,sweat:0};
  if(pose==='idle'){if(T%4.3<.25)c.wingR=-18;if(T%3.1<.2)c.tail=14;if(T%5.2<.5)c.mouth=.3*Math.abs(s(T*14))}
  else if(pose==='hello'){c.rootY=-5*Math.abs(s(T*2.2));c.rot=3*s(T*1.1);c.headRot=-7+4*s(T*1.1);c.wingL=70+16*s(T*6);c.lid=.22;c.browL=-10;c.browR=-2;c.tail=10*s(T*4.4);c.mouth=T%4.4<.6?.3*Math.abs(s(T*14)):0}
  else if(pose==='think'){const lx=P.lookX||0,ly=P.lookY||0;c.rot=6*lx;c.headRot=12*lx;c.headY=4;c.pupX=6*lx;c.pupY=3+4*ly;c.lid=.12;c.browL=-16;c.browR=-2;c.browY=-3;c.wingR=-35+5*s(T*3)}
  else if(pose==='cheer'){hop(.9,.55,44);c.wingL=95+25*s(t*24);c.wingR=-150+18*s(t*12);c.lid=0;c.mouth=1;c.browY=-7;c.browL=-6;c.browR=-6;c.spark=.8;c.fry=0;c.headRot=-6;c.tail=18*s(t*20)}
  else if(pose==='facepalm'){const r=Math.min(1,t/1.2);c.palm=1;c.headRot=10;c.headY=6;c.lid=.62;c.pupX=4*Math.cos(t*5)*(1-r);c.pupY=-5;c.browL=-4;c.browR=4;c.browY=2;c.rot=-3;c.sweat=1;c.fry=0;c.squash=.04*s(t*3)}
  else if(pose==='hyped'){const k=clamp(P.combo||3,3,10),per=Math.max(.42,.85-.05*k);const h=hop(per,.4,34+6*k);if(k>=5&&h.n%2===1&&h.c<.4)c.spin=360*(h.c/.4);
   c.wingL=110+35*s(t*30);c.wingR=-110-35*s(t*30);c.lid=0;c.mouth=1;c.browY=-8;c.browL=-8;c.browR=-8;c.spark=Math.min(1.3,.5+k*.1);c.shades=k>=6?1:0;c.fry=0;c.tail=25*s(t*25)}
  else if(pose==='notcare'){c.flip=-1;c.pupX=(T%3.2)<1.1?-6:5;c.lid=.55;c.browL=10;c.browR=-8;c.headRot=-10;c.wingL=-25;c.wingR=25;c.mouth=.35*Math.abs(s(t*9))}
  else if(pose==='sad'){c.lid=.5;c.browL=14;c.browR=-14;c.headY=8;c.headRot=6;c.pupY=4;c.fry=0;c.squash=.05}
  else if(pose==='hop'){hop(.5,.34,26);c.wingL=40+20*s(t*20);c.wingR=-40-20*s(t*20);c.lid=.1;c.mouth=.4}
  else if(pose==='dance'){const per=.5,b=Math.floor(t/per),ph=(t%per)/per,d=b%2?1:-1;c.rootX=12*d;c.rot=10*d;c.rootY=-16*s(Math.PI*ph);c.squash=(ph>.85||ph<.1)?.08:-.04;
   c.wingL=b%2?140:40;c.wingR=b%2?-40:-140;c.shades=1;c.mouth=.6;c.lid=0;c.browY=-5;c.tail=22*s(t*12);c.spark=.5;c.fry=0;c.headRot=-8*d}
 }else{
  c={rootX:0,rootY:0,rot:0,spin:0,headRot:3*s(T*.8),headY:0,armL:0,armR:0,tail:5*s(T*2),pupX:[0,4,0,-4][Math.floor(T/2.6)%4],pupY:0,lid:0,browL:-4,browR:-4,browY:0,mouth:0,smile:1,happy:0,stick:1,spark:0,squash:0,heart:0,heartY:0};
  if(pose==='idle'){if(T%5.5<.3)c.armR=-12}
  else if(pose==='hello'){c.rootY=-5*Math.abs(s(T*2.2+1));c.rot=-3*s(T*1.1);c.headRot=6+4*s(T*1.1);c.armL=105+16*s(T*6);c.mouth=.35;c.browY=-3;c.tail=12*s(T*4.4)}
  else if(pose==='think'){const lx=P.lookX||0,ly=P.lookY||0;c.rot=6*lx;c.headRot=10*lx;c.headY=3;c.pupX=5*lx;c.pupY=2+3*ly;c.browL=-8;c.browR=2;c.browY=-2;c.armR=-55+4*s(T*3)}
  else if(pose==='cheer'){hop(.9,.55,40);c.armL=125+15*s(t*18);c.armR=-125-15*s(t*18);c.happy=1;c.mouth=1;c.browY=-5;c.spark=.8;c.stick=0;c.tail=20*s(t*18)}
  else if(pose==='wince'){if(t<.8){c.squash=.09;c.lid=.75;c.browL=-16;c.browR=-16;c.mouth=.4;c.smile=-1;c.rot=-4;c.armL=30;c.armR=-30;c.pupX=0}
   else{const u=t-.8;c.headY=u<1.4?7*Math.max(0,s(u*9)):0;c.lid=.15;c.smile=1.2;c.mouth=.15;c.browL=-6;c.browR=-6;c.armR=-70;c.pupX=0}}
  else if(pose==='hyped'){const k=clamp(P.combo||3,3,10),per=Math.max(.42,.85-.05*k);const h=hop(per,.4,34+6*k);if(k>=5&&h.n%2===1&&h.c<.4)c.spin=-360*(h.c/.4);
   c.armL=135+30*s(t*26);c.armR=-110-30*s(t*26);c.happy=1;c.mouth=1;c.browY=-6;c.spark=Math.min(1.3,.5+k*.1);c.stick=0;c.tail=25*s(t*22)}
  else if(pose==='comfort'){c.rot=6;c.armL=62+14*s(t*2.4);c.armR=-62-14*s(t*2.4);c.happy=1;c.mouth=.2;c.headRot=10+3*s(t*2.4);c.heart=1;c.heartY=4+6*s(t*2.2);c.stick=0}
  else if(pose==='sad'){c.lid=.4;c.browL=-14;c.browR=-14;c.headY=6;c.smile=-.6;c.pupY=3}
  else if(pose==='hop'){hop(.5,.34,24);c.armL=40;c.armR=-40;c.mouth=.4;c.stick=0}
  else if(pose==='dance'){const per=.5,b=Math.floor(t/per),ph=(t%per)/per,d=b%2?1:-1;c.rootX=12*d;c.rot=10*d;c.rootY=-16*s(Math.PI*ph);c.squash=(ph>.85||ph<.1)?.08:-.04;
   c.armL=b%2?130:40;c.armR=b%2?-40:-130;c.happy=1;c.mouth=.8;c.tail=30*s(t*12);c.spark=.5;c.stick=0;c.headRot=-8*d}
 }
 return c}

const KEEP={};   // spring state by key, so a re-render does not restart a mascot's motion
let LIVE=[],raf=0,last=0,T=0,defsIn=false;

function Inst(el){
 this.el=el;this.who=el.dataset.m==='hazel'?'hazel':'gus';this.key=el.dataset.key||'';
 const size=+el.dataset.size||120;
 el.innerHTML='<svg viewBox="-20 -40 240 270" width="'+size+'" height="'+Math.round(size*270/240)+'" role="img" aria-label="'+NAMES[this.who]+'" style="display:block;overflow:visible">'+(this.who==='gus'?GUS:HAZ)+'</svg>';
 this.p={};el.querySelectorAll('[data-p]').forEach(n=>{this.p[n.dataset.p]=n});
 const k=this.key&&KEEP[this.key];
 this.st=k&&k.who===this.who?k:{who:this.who,ch:null,vel:{},pose:'',t0:T,poke:-9};
 if(this.key)KEEP[this.key]=this.st;
}
Inst.prototype.pose=function(){const raw=this.el.dataset.pose||'idle';return (ALIAS[this.who][raw])||raw};
Inst.prototype.opts=function(){const d=this.el.dataset;return{lookX:+d.lx||0,lookY:+d.ly||0,combo:+d.combo||3}};
Inst.prototype.step=function(dt){
 const s=this.st,pose=this.pose();if(pose!==s.pose){s.pose=pose;s.t0=T}
 const tg=targets(this.who,pose,T-s.t0,T,this.opts());
 const pk=T-s.poke;if(pk>=0&&pk<.75){const a=Math.sin(Math.PI*pk/.75);tg.rootY=-32*a;tg.squash=-.06*a;tg.mouth=.8;tg.lid=0;if(this.who==='gus'){tg.spin=360*(pk/.75);tg.browY=-6}else{tg.happy=1;tg.armL=110*a;tg.armR=-110*a}}
 if(!s.ch)s.ch=Object.assign({},tg);
 /* small fixed sub-steps keep stiff springs stable when the screen runs at 30 frames a second */
 const n=Math.ceil(dt/.006),h=dt/n;
 for(const k in tg){if(k==='spin'){s.ch.spin=tg.spin;continue}const sp=SPRING[k]||[240,15];let x=s.ch[k]==null?tg[k]:s.ch[k],v=s.vel[k]||0;if(!isFinite(x)||!isFinite(v)){x=tg[k];v=0}for(let j=0;j<n;j++){v+=(sp[0]*(tg[k]-x)-sp[1]*v)*h;x+=v*h}s.vel[k]=v;s.ch[k]=x}
 this.draw(s.ch,true)};
Inst.prototype.still=function(){const pose=this.pose();const tg=targets(this.who,pose,SNAP[pose]||.1,SNAP[pose]||.1,this.opts());tg.spin=0;this.draw(tg,false)};
Inst.prototype.draw=function(c,live){
 const p=this.p,A=(n,k,v)=>{const e=p[n];if(e)e.setAttribute(k,v)};
 const gus=this.who==='gus';
 const blink=live&&c.lid<.5&&(T%(gus?3.8:4.2))<.13?1:0;const lid=clamp(Math.max(c.lid,blink),0,1);
 const br=live?1+.019*Math.sin(T*2.3):1;const sx=1+c.squash*.8,sy=(1-c.squash)*br;
 const sp=Math.max(0,c.spark),tw=T*90;
 A('aura','r',90+sp*20);A('aura','opacity',Math.min(.6,sp*.5));
 A('shadow','rx',(gus?58:60)*(1-Math.min(.5,-c.rootY/110)));
 A('root','transform','translate('+c.rootX+' '+c.rootY+') rotate('+(c.rot+(c.spin||0))+' 100 140) translate(100 206) scale('+sx+' '+sy+') translate(-100 -206)');
 A('pup','transform','translate('+c.pupX+' '+c.pupY+')');
 A('s1','transform','translate(8 40) rotate('+tw+') scale('+sp+')');A('s2','transform','translate(192 30) rotate('+(-tw)+') scale('+sp+')');
 A('s3','transform','translate(-4 140) rotate('+(-tw)+') scale('+sp*.8+')');A('s4','transform','translate(204 120) rotate('+tw+') scale('+sp*.8+')');
 if(gus){
  let fl=c.flip;if(Math.abs(fl)<.06)fl=fl<0?-.06:.06;const palm=clamp(c.palm,0,1),m=Math.max(0,c.mouth);
  A('flip','transform','translate(100 0) scale('+fl+' 1) translate(-100 0)');
  A('tail','transform','rotate('+c.tail+' 146 168)');A('wingL','transform','rotate('+c.wingL+' 50 126)');A('wingR','transform','rotate('+c.wingR+' 150 126)');A('wingR','opacity',1-palm);
  A('head','transform','translate(0 '+c.headY+') rotate('+c.headRot+' 100 120)');
  A('lidL','height',32*lid);A('lidLb','y',64.5+32*lid);A('lidR','height',34*lid);A('lidRb','y',61.5+34*lid);
  A('browL','transform','translate(0 '+c.browY+') rotate('+c.browL+' 80 61)');A('browR','transform','translate(0 '+c.browY+') rotate('+(-c.browR)+' 123 57)');
  A('shades','opacity',clamp(c.shades,0,1));A('mouth','ry',2+m*10);A('lower','transform','rotate('+m*18+' 96 112)');
  A('fry','opacity',clamp(c.fry,0,1));A('fry','transform','rotate('+m*18+' 96 112)');
  A('palm','opacity',palm);A('palm','transform','translate('+((1-palm)*40)+' '+((1-palm)*70)+')');A('sweat','opacity',clamp(c.sweat,0,1));
 }else{
  const m=Math.max(0,c.mouth),lh=22*lid,hap=c.happy>.5;
  A('tail','transform','rotate('+c.tail+' 130 186)');A('head','transform','translate(0 '+c.headY+') rotate('+c.headRot+' 100 112)');
  A('armL','transform','rotate('+c.armL+' 58 130)');A('armR','transform','rotate('+c.armR+' 142 130)');
  A('lidL','height',lh);A('lidLb','y',53+lh);A('lidR','height',lh);A('lidRb','y',53+lh);
  A('happy','opacity',hap?1:0);A('open','opacity',hap?0:1);
  A('browL','transform','translate(0 '+c.browY+') rotate('+c.browL+' 80 41)');A('browR','transform','translate(0 '+c.browY+') rotate('+(-c.browR)+' 120 41)');
  A('mouth','cy',109+m*3);A('mouth','rx',9+m*3);A('mouth','ry',1+m*8);A('smile','d','M84 101 Q100 '+(110+c.smile*5)+' 116 101');A('teeth','transform','translate(0 '+(m*3)+')');
  A('stick','opacity',clamp(c.stick,0,1));A('heart','opacity',clamp(c.heart,0,1));A('heart','transform','translate(0 '+(-c.heartY)+')');
 }};

function frame(now){
 raf=0;const dt=Math.min(.033,Math.max(.001,(now-last)/1000));last=now;T+=dt;
 LIVE=LIVE.filter(i=>i.el.isConnected);
 for(const i of LIVE)i.step(dt);
 if(LIVE.length&&!document.hidden)raf=requestAnimationFrame(frame)}
function kick(){if(!raf&&LIVE.length&&!reduce()&&!document.hidden){last=performance.now();raf=requestAnimationFrame(frame)}}
document.addEventListener('visibilitychange',kick);

/* Mount every <span class="mascot" data-m="gus|hazel" data-pose="..." data-size="..." data-key="..."> on the page. */
function sync(root){
 if(!defsIn){defsIn=true;document.body.insertAdjacentHTML('afterbegin',DEFS)}
 (root||document).querySelectorAll('.mascot:not([data-on])').forEach(el=>{el.dataset.on='1';const i=new Inst(el);el._m=i;if(reduce())i.still();else{i.step(.016);LIVE.push(i)}});
 kick()}
function setPose(el,pose,extra){if(!el)return;el.dataset.pose=pose;if(extra)for(const k in extra)el.dataset[k]=extra[k];if(el._m&&reduce())el._m.still()}
function look(x,y){LIVE.forEach(i=>{if((i.el.dataset.pose||'')!=='think')return;const b=i.el.getBoundingClientRect();const dx=x-(b.left+b.width/2),dy=y-(b.top+b.height/2);const d=Math.max(60,Math.hypot(dx,dy));i.el.dataset.lx=clamp(dx/d*1.2,-1,1).toFixed(2);i.el.dataset.ly=clamp(dy/d*1.2,-1,1).toFixed(2)})}
function poke(el){if(el&&el._m){el._m.st.poke=T}}
function html(who,pose,size,key,extra){return '<span class="mascot" data-m="'+who+'" data-pose="'+(pose||'idle')+'" data-size="'+(size||120)+'"'+(key?' data-key="'+key+'"':'')+(extra||'')+'></span>'}
function forget(prefix){Object.keys(KEEP).forEach(k=>{if(k.indexOf(prefix)===0)delete KEEP[k]})}
return {sync,setPose,look,poke,html,forget,NAMES};
})();
