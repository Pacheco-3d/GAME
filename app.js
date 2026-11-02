
(()=>{'use strict';
const $=id=>document.getElementById(id),canvas=$('view'),ctx=canvas.getContext('2d'),W=1024,H=765;
const images={day:new Image(),night:new Image()};
const sprites={barrel:new Image(),crate:new Image()};
sprites.barrel.src='assets/barril.png';sprites.crate.src='assets/caixote.png';
images.day.src='scenarios/dia.jpg';
images.night.src='scenarios/noite.jpg';
// Waypoints follow ground, stone stairs and high platforms in the TWO source illustrations.
// z is an artist-calibrated elevation, not a flat-screen scale trick.
const RAW={
 day:{start:'f0',n:{
 f0:[608,538,0],f1:[661,530,0],f2:[712,510,0],f3:[725,491,0],f4:[536,522,0],f5:[469,503,0],f6:[413,480,0],f7:[353,451,0],f8:[305,425,0],f9:[254,396,0],f10:[208,376,0],f11:[168,350,0],f12:[141,332,0],
 b0:[322,483,0],b1:[315,405,0],b2:[364,383,0],b3:[426,405,0],b4:[518,456,0],b5:[600,473,0],b6:[653,495,0],b7:[375,339,0],b8:[457,325,0],b9:[565,329,0],b10:[655,362,0],
 l0:[177,310,0],l1:[196,284,.15],l2:[222,251,.4],l3:[250,216,.74],l4:[271,188,1],lm0:[314,204,1],lm1:[363,210,1],lm2:[412,206,1],lm3:[465,206,1],lm4:[502,213,1],
 u0:[437,193,1.04],u1:[409,171,1.36],u2:[377,141,1.7],u3:[343,108,2],ut0:[371,86,2],ut1:[431,91,2],ut2:[498,99,2],
 a0:[540,216,1],a1:[573,218,1],a2:[611,232,1],a3:[650,263,1],a4:[686,295,1],a5:[722,310,1],rm0:[767,310,1],rm1:[814,302,1],
 r0:[759,454,.29],r1:[794,408,.62],r2:[819,366,.98],r3:[846,331,1.24],r4:[867,297,1.55],r5:[868,275,1.78],r6:[874,237,2],rt0:[913,221,2],rt1:[955,224,2]
 },e:`f0-f1 f1-f2 f2-f3 f0-f4 f4-f5 f5-f6 f6-f7 f7-f8 f8-f9 f9-f10 f10-f11 f11-f12 f12-l0 l0-l1 l1-l2 l2-l3 l3-l4 l4-lm0 lm0-lm1 lm1-lm2 lm2-lm3 lm3-lm4 lm4-a0 lm2-u0 u0-u1 u1-u2 u2-u3 u3-ut0 ut0-ut1 ut1-ut2 a0-a1 a1-a2 a2-a3 a3-a4 a4-a5 a5-rm0 rm0-rm1 f3-r0 r0-r1 r1-r2 r2-r3 r3-r4 r4-r5 r5-r6 r6-rt0 rt0-rt1 rm1-r3 f6-b0 b0-b1 b1-b2 b2-b3 b3-b4 b4-b5 b5-b6 b6-f2 b2-b7 b7-b8 b8-b9 b9-b10 b10-a4 b1-f8 b6-f1`,
 enemies:[{path:['f6','f5','f4','f0'],at:'f5'},{path:['lm1','lm2','lm3'],at:'lm1'},{path:['r6','rt0','rt1'],at:'rt0'}],tour:['r6','rt1','f3','l4','ut1','l0','f0']},
 night:{start:'f0',n:{
 f0:[642,529,0],f1:[687,507,0],f2:[721,474,0],f3:[581,500,0],f4:[532,486,0],f5:[476,475,0],f6:[415,469,0],f7:[362,457,0],f8:[308,442,0],f9:[259,421,0],f10:[209,409,0],f11:[165,388,0],f12:[127,372,0],
 b0:[345,405,0],b1:[389,394,0],b2:[451,417,0],b3:[523,450,0],b4:[595,472,0],b5:[286,352,0],b6:[364,359,0],b7:[455,352,0],b8:[539,371,0],
 l0:[196,303,0],l1:[213,284,.15],l2:[238,256,.4],l3:[265,222,.71],l4:[297,190,.94],lm0:[320,171,1],lm1:[363,173,1],lm2:[406,182,1],lm3:[458,201,1],
 u0:[398,171,1],u1:[374,147,1.32],u2:[352,126,1.63],u3:[323,103,2],ut0:[369,81,2],ut1:[423,86,2],ut2:[485,92,2],
 r0:[749,443,.26],r1:[774,400,.62],r2:[811,354,1],r3:[842,319,1.35],r4:[871,284,1.7],r5:[899,250,2],rt0:[941,232,2],rt1:[965,217,2],
 rm0:[764,276,2],rm1:[801,244,2],rm2:[854,229,2]
 },e:`f0-f1 f1-f2 f0-f3 f3-f4 f4-f5 f5-f6 f6-f7 f7-f8 f8-f9 f9-f10 f10-f11 f11-f12 f12-l0 l0-l1 l1-l2 l2-l3 l3-l4 l4-lm0 lm0-lm1 lm1-lm2 lm2-lm3 lm1-u0 u0-u1 u1-u2 u2-u3 u3-ut0 ut0-ut1 ut1-ut2 f2-r0 r0-r1 r1-r2 r2-r3 r3-r4 r4-r5 r5-rt0 rt0-rt1 r5-rm2 rm2-rm1 rm1-rm0 f7-b0 b0-b1 b1-b2 b2-b3 b3-b4 b4-f3 f9-b5 b5-b6 b6-b7 b7-b8 b8-b3 b2-f6`,
 enemies:[{path:['f6','f5','f4','f3'],at:'f5'},{path:['lm0','lm1','lm2'],at:'lm2'},{path:['r5','rt0','rt1'],at:'rt0'}],tour:['r5','rt1','f2','l4','ut1','l0','f0']}
};
const MAPS={};
for(const [theme,raw] of Object.entries(RAW)){
 const n={};for(const [id,p] of Object.entries(raw.n))n[id]={x:theme==='day'?1024-p[0]:p[0],y:p[1],z:p[2],id};
 const edges=raw.e.split(' ').map(pair=>{const [a,b]=pair.split('-');if(!n[a]||!n[b])throw Error('broken edge '+pair);return{a,b};});
 MAPS[theme]={...raw,n,edges};
}
const PICKUP_SPAWNS={
 day:[['barrel','f2'],['crate','f8'],['dynamite','b6'],['barrel','lm2'],['crate','rm0'],['dynamite','ut0']],
 night:[['barrel','f9'],['crate','f12'],['dynamite','b6'],['crate','lm2'],['barrel','rt0'],['dynamite','ut1']]
};
let theme='day',m=MAPS[theme],phase='play',score=0,lives=3,explosions=0,player,foes=[],bombs=[],fire=[],effects=[],tour=[],showPaths=false,t=0,lastTime=0,invuln=0,pendingTap=null,pointer=null,lastToast=0,pickups=[],thrownCrates=[],tracks=[];
let marker=null;
const hyp=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),mix=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
function terrainAt(x,y){
 if(theme==='day')x=1024-x;
 if(theme==='night'){
   const ice=((x>300&&x<740&&y>255&&y<565) && (((x-522)**2)/(235**2)+((y-414)**2)/(133**2)<1.0));
   return ice?'ice':'snow';
 }
 const sand=(y>480)||(x<250&&y>280&&y<560)||(x>720&&y>210&&y<560)||(x>230&&x<900&&y>110&&y<315)||(x>210&&x<810&&y>300&&y<590&&!(x>320&&x<720&&y>285&&y<520));
 const stone=(x>300&&x<720&&y>270&&y<560);
 return sand?'sand':(stone?'stone':'grass');
}
function leaveTrack(surface){
 if(!(surface==='snow'||surface==='sand'))return;
 const px=player.x,py=player.y; const spacing=surface==='snow'?14:17;
 if(player.lastTrackX!=null&&Math.hypot(px-player.lastTrackX,py-player.lastTrackY)<spacing)return;
 const dirLen=Math.hypot(player.moveDX||1,player.moveDY||0)||1,dx=(player.moveDX||1)/dirLen,dy=(player.moveDY||0)/dirLen;
 const off=(surface==='snow'?5:4)*player.trackSide,perpX=-dy,perpY=dx;
 tracks.push({x:px+perpX*off,y:py+perpY*off,age:0,type:surface,rot:Math.atan2(dy,dx),size:surface==='snow'?1:0.95});
 if(tracks.length>240)tracks.shift(); player.trackSide*=-1; player.lastTrackX=px; player.lastTrackY=py;
}
function graphPoint(x,y){let best=null;for(const [i,e] of m.edges.entries()){
 let a=m.n[e.a],b=m.n[e.b],vx=b.x-a.x,vy=b.y-a.y,len=vx*vx+vy*vy;
 let u=Math.min(1,Math.max(0,((x-a.x)*vx+(y-a.y)*vy)/len));let p=mix(a,b,u),d=Math.hypot(x-p.x,y-p.y);
 if(!best||d<best.d)best={i,e,u,p,d};}return best;}
function navigation(from,target){
 const s=graphPoint(from.x,from.y),d=graphPoint(target.x,target.y),names=[...Object.keys(m.n),'START','END'],connections=Object.fromEntries(names.map(v=>[v,[]]));
 const add=(a,b,w)=>{connections[a].push([b,w]);connections[b].push([a,w]);};
 for(const edge of m.edges){const a=m.n[edge.a],b=m.n[edge.b];add(edge.a,edge.b,hyp(a,b));}
 const sLength=hyp(m.n[s.e.a],m.n[s.e.b]),dLength=hyp(m.n[d.e.a],m.n[d.e.b]);
 add('START',s.e.a,s.u*sLength);add('START',s.e.b,(1-s.u)*sLength);
 add('END',d.e.a,d.u*dLength);add('END',d.e.b,(1-d.u)*dLength);
 if(s.i===d.i)add('START','END',Math.abs(s.u-d.u)*sLength);
 const dist=Object.fromEntries(names.map(k=>[k,Infinity])),prev={};dist.START=0;let pool=new Set(names);
 while(pool.size){let id=null,best=Infinity;for(let k of pool)if(dist[k]<best){best=dist[k];id=k;}if(id===null)break;pool.delete(id);if(id==='END')break;for(const [next,w] of connections[id])if(dist[id]+w<dist[next]){dist[next]=dist[id]+w;prev[next]=id;}}
 let seq=['END'],id='END';for(let i=0;i<names.length+2&&id!=='START';i++){id=prev[id];if(!id)break;seq.push(id);}if(seq.at(-1)!=='START')return null;
 seq.reverse();let path=seq.slice(1).map(k=>k==='END'?d.p:m.n[k]);if(hyp(from,s.p)>5)path.unshift(s.p);return {path: path.map(p=>({...p})),dest:d.p,distance:d.d};
}
function atNode(id){return {...m.n[id]};}
function init(resetPoints=true){m=MAPS[theme];player={...atNode(m.start),facing:1,stride:0,path:[],velocity:0,carrying:null,surface:'stone',slideVX:0,slideVY:0,trackSide:1,lastTrackX:null,lastTrackY:null,moveDX:1,moveDY:0};bombs=[];fire=[];effects=[];tour=[];thrownCrates=[];tracks=[];invuln=1.6;if(pendingTap?.timer)clearTimeout(pendingTap.timer);pendingTap=null;marker=null;phase='play';
 pickups=(PICKUP_SPAWNS[theme]||[]).map(([kind,id],i)=>({...m.n[id],kind,id:'pickup'+i,node:id,active:true}));
 foes=m.enemies.map((data,i)=>({x:m.n[data.at].x,y:m.n[data.at].y,z:m.n[data.at].z,path:data.path,step:0,dir:1,alive:true,hue:i*90+295,phase:i*2}));
 if(resetPoints){score=0;lives=3;explosions=0;}updateHUD();setToast('Passe por cima da caixa de dinamite para pegar',3400);
}
function updateHUD(){$('score').textContent=score;$('lives').textContent=Array.from({length:Math.max(0,lives)},()=> '♥').join(' ');$('enemies').textContent=foes.filter(e=>e.alive).length;$('bombs').textContent=explosions;const level=$('levelTag');if(level)level.textContent=player&&player.carrying?'OBJETO NA CABEÇA • TOQUE 2x NO CHÃO':'CAMINHE • SUBA • DESÇA';}
function setToast(str,ms=2200){const e=$('toast');e.textContent=str;e.classList.remove('off');lastToast=performance.now()+ms;}
function setTheme(next){if(theme===next)return;theme=next;document.querySelectorAll('#day,#night').forEach(b=>{const on=b.id===next;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});$('worldLabel').textContent=next==='day'?'☀️ ILHA DO DIA':'🌙 ILHA DA NEVE';init(false);}
function goTo(x,y,manual=true){if(phase!=='play')return;const nav=navigation(player,{x,y});if(!nav||nav.distance>100){if(manual)setToast('Escolha uma plataforma ou escada',1600);return false;}
 player.path=nav.path;player.slideVX=0;player.slideVY=0;marker={...nav.dest,until:t+1.3};if(manual){tour=[];setToast(nav.dest.z>player.z+.32?'Subindo para uma plataforma…':nav.dest.z<player.z-.32?'Descendo as escadas…':'Indo para o ponto escolhido…',1200);}return true;}
function tryBomb(){if(phase!=='play')return;if(player.carrying){setToast('Carregando objeto! Toque 2x no chão para arremessar!',1500);return;}const pos={x:player.x,y:player.y,z:player.z};if(bombs.some(b=>Math.hypot(b.x-pos.x,b.y-pos.y)<17&&Math.abs(b.z-pos.z)<.25)){setToast('Já existe uma bomba aqui!',1300);return;}
 bombs.push({...pos,fuse:2.5,max:2.5});explosions++;updateHUD();setToast('💣 Bomba colocada! Toque no chão e fuja!',1700);}
function throwCarriedCrate(x,y){
 if(phase!=='play'||!player.carrying)return false;
 const kind=player.carrying,dx=x-player.x,dy=y-player.y,dist=Math.hypot(dx,dy)||1,ux=dx/dist,uy=dy/dist;
 const reach=Math.min(kind==='barrel'?260:230,Math.max(100,dist));
 thrownCrates.push({kind,x:player.x,y:player.y,z:player.z,fromX:player.x,fromY:player.y,
 toX:player.x+ux*reach,toY:player.y+uy*reach,progress:0,
 duration:kind==='barrel'?.55:.38,height:kind==='barrel'?15:80,dirX:ux,dirY:uy,bounces:0,maxBounces:kind==='crate'?2:kind==='dynamite'?2:0,angle:0,phase:'flight'});
 player.carrying=null;updateHUD();setToast(kind==='barrel'?'🛢️ Barril arremessado! Vai rolar e explodir!':kind==='crate'?'📦 Caixote arremessado!':'🧨 Dinamite arremessada!',1500);
 return true;
}
function pickupObject(obj){if(!obj?.active||player.carrying)return false;
 obj.active=false;player.carrying=obj.kind;player.path=[];score+=25;
 effects.push({x:obj.x,y:obj.y,z:obj.z,age:0,type:'spark'});updateHUD();setToast('Pegou '+(obj.kind==='barrel'?'o barril!':obj.kind==='crate'?'o caixote!':'a dinamite!')+' Toque 2x na direção para lançar.',2400);return true;
}
function hitPickup(x,y){if(player.carrying)return null;let chosen=null,best=Infinity;
 for(const p of pickups){if(!p.active)continue;const sc=characterScale(p),dx=x-p.x,dy=y-(p.y-19*sc),d=Math.hypot(dx,dy);if(d<Math.max(29,31*sc)&&d<best){best=d;chosen=p;}}
 return chosen;
}
function hitAvatar(x,y){const sc=characterScale(player),dx=x-player.x,dy=y-(player.y-27*sc);return (dx*dx)/Math.pow(24*sc+9,2)+(dy*dy)/Math.pow(32*sc+10,2) <=1;}
function pixelLocation(ev){const rect=canvas.getBoundingClientRect();return{x:(ev.clientX-rect.left)*W/rect.width,y:(ev.clientY-rect.top)*H/rect.height};}
function clearPending(){if(pendingTap?.timer)clearTimeout(pendingTap.timer);pendingTap=null;}
canvas.addEventListener('pointerdown',e=>{
 if(phase!=='play')return;e.preventDefault();const p=pixelLocation(e);
 pointer={id:e.pointerId,x:p.x,y:p.y,time:performance.now(),avatar:hitAvatar(p.x,p.y),moved:false};
 try{canvas.setPointerCapture(e.pointerId);}catch{}
});
canvas.addEventListener('pointermove',e=>{if(!pointer||e.pointerId!==pointer.id)return;
 const p=pixelLocation(e);if(Math.hypot(p.x-pointer.x,p.y-pointer.y)>22)pointer.moved=true;
});
canvas.addEventListener('pointerup',e=>{if(!pointer||e.pointerId!==pointer.id)return;
 const p=pixelLocation(e),a=pointer;pointer=null;const now=performance.now();
 if(a.moved){clearPending();if(!a.avatar)goTo(p.x,p.y);return;}
 if(a.avatar&&hitAvatar(p.x,p.y)){
   if(pendingTap?.type==='avatar'&&now-pendingTap.time<430){clearPending();tryBomb();}
   else{clearPending();pendingTap={type:'avatar',time:now};setToast(player.carrying?'Você está carregando um objeto — lance tocando 2x no chão':'Toque novamente NO PERSONAGEM para soltar bomba',1100);}
   return;
 }
 const pickup=hitPickup(p.x,p.y);
 if(pickup){clearPending();if(goTo(pickup.x,pickup.y)){setToast('Indo buscar '+(pickup.kind==='barrel'?'o barril…':pickup.kind==='crate'?'o caixote…':'a dinamite…'),1300);}return;}
 if(player.carrying){
   if(pendingTap?.type==='ground'&&now-pendingTap.time<450&&Math.hypot(p.x-pendingTap.x,p.y-pendingTap.y)<90){clearPending();throwCarriedCrate(p.x,p.y);}
   else{clearPending();const at={x:p.x,y:p.y};pendingTap={type:'ground',time:now,x:p.x,y:p.y,timer:setTimeout(()=>{if(pendingTap?.type==='ground'&&pendingTap.time===now){pendingTap=null;goTo(at.x,at.y);}},460)};setToast('Toque outra vez nessa direção para arremessar',880);}
 }else{clearPending();goTo(p.x,p.y);}
});
canvas.addEventListener('pointercancel',()=>{pointer=null;clearPending();});canvas.addEventListener('contextmenu',e=>e.preventDefault());
$('day').addEventListener('click',()=>setTheme('day'));$('night').addEventListener('click',()=>setTheme('night'));$('restart').addEventListener('click',()=>init());
$('paths').addEventListener('click',()=>{showPaths=!showPaths;$('paths').classList.toggle('selected',showPaths);$('paths').setAttribute('aria-pressed',String(showPaths));setToast(showPaths?'Linhas mostram os trajetos acessíveis':'Caminhos ocultos',1500);});
$('tour').addEventListener('click',()=>{init(false);tour=[...m.tour];setToast('Demonstração: subindo e descendo escadas',2400);moveTour();});
function moveTour(){if(phase==='play'&&!player.path.length&&tour.length){let id=tour.shift();goTo(m.n[id].x,m.n[id].y,false);}}
function damage(){if(invuln>0)return;lives--;invuln=2.3;effects.push({x:player.x,y:player.y,z:player.z,r:0,age:0,type:'hurt'});setToast(lives?'Cuidado! Você perdeu uma vida.':'Fim de jogo! Toque em Reiniciar.',2400);if(!lives){phase='over';player.path=[];tour=[];}updateHUD();}
function explode(b){fire.push({...b,age:0,duration:.55});effects.push({x:b.x,y:b.y,z:b.z,age:0,type:'blast'});
 if(Math.hypot(player.x-b.x,player.y-b.y)<91&&Math.abs(player.z-b.z)<.38)damage();
 for(const enemy of foes)if(enemy.alive&&Math.hypot(enemy.x-b.x,enemy.y-b.y)<112&&Math.abs(enemy.z-b.z)<.45){enemy.alive=false;score+=150;effects.push({x:enemy.x,y:enemy.y,z:enemy.z,age:0,type:'star'});}
 updateHUD();if(!foes.some(e=>e.alive)){setToast('🏆 Todos os inimigos derrotados! Você venceu!',3500);score+=500;phase='won';updateHUD();}}
function tick(dt){t+=dt;if(invuln>0)invuln-=dt;if(phase==='play'){
 let remain=dt;while(remain>0&&player.path.length){let next=player.path[0];const length=hyp(player,next);if(length<1.3){player.x=next.x;player.y=next.y;player.z=next.z;player.path.shift();continue;}
 let here=terrainAt(player.x,player.y);player.surface=here;let speed=(130-15*player.z)*(Math.abs(next.z-player.z)>.03?.76:1);if(here==='snow'||here==='sand')speed*=0.72;if(here==='ice')speed*=1.18;
 let d=Math.min(length,speed*remain),u=d/length,oldX=player.x,oldY=player.y;
 player.facing=Math.sign(next.x-player.x)||player.facing;Object.assign(player,mix(player,next,u));
 const mdx=player.x-oldX,mdy=player.y-oldY,ml=Math.hypot(mdx,mdy)||1;player.moveDX=mdx/ml;player.moveDY=mdy/ml;player.surface=terrainAt(player.x,player.y);
 if(player.surface==='ice'){player.slideVX=player.moveDX*80;player.slideVY=player.moveDY*80;} else if(player.surface!=='snow'&&player.surface!=='sand'){player.slideVX*=0.6;player.slideVY*=0.6;}
 if(player.surface==='snow'||player.surface==='sand')leaveTrack(player.surface);
 player.stride+=d*(player.surface==='snow'||player.surface==='sand'?0.135:0.11);remain-=d/speed;if(d+1e-4>=length)player.path.shift();}
 if(!player.path.length){player.surface=terrainAt(player.x,player.y);if(player.surface==='ice'&&Math.hypot(player.slideVX,player.slideVY)>8){player.x+=player.slideVX*dt;player.y+=player.slideVY*dt;player.slideVX*=Math.pow(0.35,dt);player.slideVY*=Math.pow(0.35,dt);}else{player.slideVX=0;player.slideVY=0;moveTour();}}
 for(const obj of pickups){if(obj.active&&!player.carrying&&Math.hypot(player.x-obj.x,player.y-obj.y)<26&&Math.abs(player.z-obj.z)<.45)pickupObject(obj);}
 for(const enemy of foes){if(!enemy.alive)continue;const way=enemy.path,point=m.n[way[enemy.step]];if(hyp(enemy,point)<3){enemy.step+=enemy.dir;if(enemy.step>=way.length){enemy.step=way.length-2;enemy.dir=-1;}if(enemy.step<0){enemy.step=1;enemy.dir=1;}}
 let goal=m.n[way[enemy.step]],len=hyp(enemy,goal);if(len>0){let u=Math.min(1,dt*(36+enemy.hue%8)/len);Object.assign(enemy,mix(enemy,goal,u));}}
 for(const b of [...bombs]){b.fuse-=dt;if(b.fuse<=0){bombs.splice(bombs.indexOf(b),1);explode(b);}}
 for(const tc of [...thrownCrates]){
  const p=Math.min(1,tc.progress+=dt/tc.duration);tc.x=tc.fromX+(tc.toX-tc.fromX)*p;tc.y=tc.fromY+(tc.toY-tc.fromY)*p;
  tc.air=tc.phase==='rolling'?1.5:Math.sin(Math.PI*p)*tc.height;
  tc.angle+=(tc.kind==='barrel'?.17:.10)*dt*60;
  if(p>=1){
   if(tc.kind==='barrel'&&tc.phase==='flight'){
     tc.phase='rolling';tc.progress=0;tc.duration=.70;tc.height=0;tc.fromX=tc.x;tc.fromY=tc.y;tc.toX=tc.x+tc.dirX*140;tc.toY=tc.y+tc.dirY*140;
     effects.push({x:tc.x,y:tc.y,z:tc.z,age:0,type:'dust'});
   }else if(tc.bounces<tc.maxBounces){
     tc.bounces++;effects.push({x:tc.x,y:tc.y,z:tc.z,age:0,type:'dust'});
     tc.fromX=tc.x;tc.fromY=tc.y;tc.toX=tc.x+tc.dirX*(58/(tc.bounces+.2));tc.toY=tc.y+tc.dirY*(58/(tc.bounces+.2));tc.progress=0;tc.duration*=.77;tc.height*=.53;
   }else{
     thrownCrates.splice(thrownCrates.indexOf(tc),1);
     if(tc.kind==='crate'){effects.push({x:tc.x,y:tc.y,z:tc.z,age:0,type:'splinters',pieces:Array.from({length:16},(_,i)=>({vx:(Math.random()-.5)*180,vy:(Math.random()-.75)*155,rot:Math.random()*6,vr:(Math.random()-.5)*14}))});score+=40;updateHUD();setToast('🪵 Caixote se despedaçou!',1400);}
     else{effects.push({x:tc.x,y:tc.y,z:tc.z,age:0,type:'cratebreak'});explosions++;explode(tc);}
   }
  }
 }

 }
 for(const tr of tracks)tr.age+=dt;tracks=tracks.filter(tr=>tr.age<(tr.type==='snow'?8.5:6.5));
 for(const f of fire)f.age+=dt;fire=fire.filter(f=>f.age<f.duration);
 for(const fx of effects)fx.age+=dt;effects=effects.filter(f=>f.age<1.15);
 if(lastToast&&performance.now()>lastToast){$('toast').classList.add('off');lastToast=0;}
}
function characterScale(c){const mobile=window.innerWidth&&window.innerWidth<640?1.36:1;return mobile*(0.91-0.135*c.z)*(0.86+0.14*(c.y/550));}
function roundRect(x,y,w,h,r,fill,stroke,width=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function drawTracks(){for(const tr of tracks){const life=1-tr.age/(tr.type==='snow'?8.5:6.5);ctx.save();ctx.globalAlpha=Math.max(0,life*(tr.type==='snow'?0.45:0.28));ctx.translate(tr.x,tr.y);ctx.rotate(tr.rot);if(tr.type==='snow'){ellipse(-3,0,6*tr.size,3.2*tr.size,'#48688f');ellipse(3,0,6*tr.size,3.2*tr.size,'#48688f');ctx.globalAlpha*=0.35;ellipse(-3,-0.5,4*tr.size,1.7*tr.size,'#dff2ff');ellipse(3,-0.5,4*tr.size,1.7*tr.size,'#dff2ff');}
 else{ellipse(0,0,7*tr.size,3*tr.size,'#9d7a47');ctx.globalAlpha*=0.45;ellipse(0,-.8,4.5*tr.size,1.5*tr.size,'#d8bc8b');}
 ctx.restore();}}
function drawDynamiteBox(x,y,sc){ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);ellipse(0,2,20,7,'#0d183080');roundRect(-18,-29,36,27,4,'#ba793b','#6b431f',3);ctx.strokeStyle='#efbe70';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-12,-25);ctx.lineTo(12,-7);ctx.moveTo(12,-25);ctx.lineTo(-12,-7);ctx.stroke();roundRect(-11,-40,22,10,2,'#d54339','#772520',2);ctx.restore();}
function drawObject(obj){const sc=characterScale(obj)*.85;const sprite=sprites[obj.kind];if(obj.kind==='dynamite')return drawDynamiteBox(obj.x,obj.y,sc);
 ctx.save();ctx.translate(obj.x,obj.y);ctx.scale(sc,sc);ellipse(0,2,23,7,'#0d183078');if(sprite?.complete&&sprite.naturalWidth){ctx.drawImage(sprite,-31,-53,62,63);}ctx.restore();}
function drawThrownCrate(c){const sc=characterScale(c)*.85;ctx.save();ctx.translate(c.x,c.y);ctx.scale(sc,sc);ellipse(0,1,20,6,'#0d183080');ctx.translate(0,-(c.air||0));ctx.rotate(c.angle*(c.kind==='barrel'?1:.55));const sprite=sprites[c.kind];
 if(c.kind==='dynamite')drawDynamiteBox(0,0,1);
 else if(sprite?.complete&&sprite.naturalWidth)ctx.drawImage(sprite,-29,-52,58,60);ctx.restore();}
function drawHeldCrate(){if(!player.carrying)return;const sc=characterScale(player);ctx.save();ctx.translate(player.x,player.y);ctx.scale(sc,sc);
 const bob=(player.path.length?Math.sin(player.stride)*2.4:Math.sin(t*2.5)*.8);ctx.translate(0,bob);ctx.save();if(player.facing<0)ctx.scale(-1,1);
 ctx.strokeStyle='#ffd47b';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-18,-45);ctx.lineTo(-21,-73);ctx.lineTo(-11,-85);ctx.moveTo(18,-45);ctx.lineTo(21,-73);ctx.lineTo(11,-85);ctx.stroke();
 const sprite=sprites[player.carrying];if(player.carrying==='dynamite')drawDynamiteBox(0,-75,.91);
 else if(sprite?.complete&&sprite.naturalWidth)ctx.drawImage(sprite,-30,-127,60,61);
 ctx.restore();ctx.restore();}
function drawAvatar(p,ghost=false){const sc=characterScale(p);ctx.save();ctx.translate(p.x,p.y);ctx.scale(sc,sc);const moving=player.path.length>0&&!ghost;const heavy=(player.surface==='snow'||player.surface==='sand');const icy=(player.surface==='ice');const bob=moving?Math.sin(player.stride)*(heavy?3.4:(icy?1.5:2.4)):Math.sin(t*2.5)*(heavy?1.1:.8);
 ellipse(0,0,25,9,'#08172b70');ctx.translate(icy?Math.sin(t*6)*1.2:0,bob);if(ghost)ctx.globalAlpha=.45;
 // feet animate while moving, including climbing
 roundRect(-17,-11+(moving?Math.sin(player.stride)*4:0),13,13,5,'#6c3d2d','#19263a',2);
 roundRect(5,-11-(moving?Math.sin(player.stride)*4:0),13,13,5,'#6c3d2d','#19263a',2);
 ctx.save();if(p.facing<0)ctx.scale(-1,1);
 roundRect(-22,-46,44,34,15,'#3e81c5','#173253',3);
 roundRect(-15,-37,30,24,10,'#df9b4e');
 if(!player.carrying){
  roundRect(-25,-40,13,25,6,'#ffcf6c','#173253',2);
  roundRect(14,-42,12,23,6,'#ffcf6c','#173253',2);
 }
 // red trailing scarf
 ctx.fillStyle='#ed5d4b';ctx.beginPath();ctx.moveTo(-11,-49);ctx.lineTo(-32,-47);ctx.lineTo(-26,-42+Math.sin(t*5)*2);ctx.lineTo(-7,-41);ctx.fill();
 // rounded head, yellow hood, dark visor; readable sprite while far away
 ellipse(0,-61,25,27,'#163451');ellipse(0,-63,23,24,'#ffcc67');ellipse(1,-59,19,16,'#203b5f');ellipse(-5,-64,8,5,'#90ccfc');ellipse(-7,-58,2.6,3.6,'#fff');ellipse(7,-58,2.6,3.6,'#fff');ellipse(1,-52,3,2,'#ff9e7a');
 // helmet highlight
 ctx.strokeStyle='#fff5bc';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-63,20,Math.PI*1.21,Math.PI*1.7);ctx.stroke();
 ctx.restore();ctx.restore();}
function drawEnemy(e){const sc=characterScale(e)*.75;ctx.save();ctx.translate(e.x,e.y);ctx.scale(sc,sc);ellipse(0,0,20,6,'#04122762');ctx.translate(0,-19+Math.sin(t*3+e.phase)*4);ctx.fillStyle=e.hue>360?'#ffb47a':e.hue>320?'#b895ff':'#ff92c8';ctx.strokeStyle='#522f6b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-22,-5);ctx.lineTo(-19,-30);ctx.lineTo(-7,-24);ctx.quadraticCurveTo(0,-30,7,-24);ctx.lineTo(21,-30);ctx.lineTo(23,-4);ctx.arc(0,-5,22,0,Math.PI,false);ctx.closePath();ctx.fill();ctx.stroke();ellipse(-8,-9,3.3,5,'#25344c');ellipse(8,-9,3.3,5,'#25344c');ctx.strokeStyle='#25344c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,5,0,Math.PI);ctx.stroke();ctx.restore();}
function drawBomb(b){const sc=characterScale(b);ctx.save();ctx.translate(b.x,b.y);ctx.scale(sc,sc);ellipse(0,1,18,6,'#101c358a');const flash=b.fuse<.75&&Math.sin(t*20)>0;ellipse(0,-15,17,17,flash?'#ec8666':'#273044');ellipse(-6,-22,5,4,'#aabac8');roundRect(-5,-37,10,10,2,'#6d8194','#162238',2);ctx.strokeStyle='#e8c77b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-32);ctx.quadraticCurveTo(8,-47,16,-43);ctx.stroke();ellipse(16,-43,flash?8:5,flash?8:5,flash?'#fff7be':'#ffb13f');ctx.restore();}
function drawExplosion(b){const age=b.age/b.duration,sc=0.92-0.14*b.z;ctx.save();ctx.translate(b.x,b.y);ctx.scale(sc,sc);const radius=age<.35?age/.35*110:110+(age-.35)*25;
 const grad=ctx.createRadialGradient(0,-4,0,0,-4,radius);grad.addColorStop(0,'#fffde5');grad.addColorStop(.18,'#ffe77b');grad.addColorStop(.4,'#ffac38a6');grad.addColorStop(1,'#ff562200');ctx.globalAlpha=Math.max(0,1-age);ellipse(0,-8,radius,radius*.70,grad);
 ctx.strokeStyle='#fff5b8';ctx.lineWidth=6;ctx.globalAlpha=(1-age)*.9;ctx.beginPath();ctx.arc(0,-9,radius*.8,0,Math.PI*2);ctx.stroke();ctx.restore();}
function showNetwork(){ctx.save();ctx.lineWidth=3;ctx.setLineDash([7,10]);ctx.strokeStyle=theme==='day'?'#00b4e0c2':'#ffe18ccf';for(const e of m.edges){let a=m.n[e.a],b=m.n[e.b];ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}ctx.setLineDash([]);
 for(const node of Object.values(m.n)){ellipse(node.x,node.y,4,node.z>1.3?'#ffe26e':'#89eaff');}ctx.restore();}
function drawMarker(){if(!marker||marker.until<t)return;const r=13+6*Math.sin(t*6),a=Math.min(1,(marker.until-t)*1.4);ctx.save();ctx.strokeStyle=theme==='day'?`rgba(18,210,242,${a})`:`rgba(255,222,122,${a})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(marker.x,marker.y,22+r/4,9+r/5,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
function draw(){ctx.clearRect(0,0,W,H);const img=images[theme];if(img.complete&&img.naturalWidth)ctx.drawImage(img,0,0,W,H);else{ctx.fillStyle='#223954';ctx.fillRect(0,0,W,H);}
 drawTracks();
 if(showPaths)showNetwork();
 for(const fx of effects){
   if(fx.type==='star'){ctx.font=`${Math.max(18,28-fx.age*12)}px system-ui`;ctx.fillText('⭐',fx.x,fx.y-30-fx.age*60);}
   if(fx.type==='spark'){ctx.globalAlpha=Math.max(0,1-fx.age/.6);ctx.font=`${Math.max(18,26-fx.age*14)}px system-ui`;ctx.fillText('✨',fx.x-8,fx.y-34-fx.age*34);ctx.globalAlpha=1;}
   if(fx.type==='dust'){ctx.globalAlpha=Math.max(0,1-fx.age/.5);ellipse(fx.x,fx.y+2,18+fx.age*22,7+fx.age*9,'#d9ebff88');ctx.globalAlpha=1;}
   if(fx.type==='splinters'){
     ctx.save();ctx.globalAlpha=Math.max(0,1-fx.age/.95);for(const piece of fx.pieces){
       const x=fx.x+piece.vx*fx.age,y=fx.y+piece.vy*fx.age+185*fx.age*fx.age;
       ctx.save();ctx.translate(x,y);ctx.rotate(piece.rot+piece.vr*fx.age);ctx.fillStyle='#ba7a36';ctx.strokeStyle='#6a3b19';ctx.lineWidth=1.5;ctx.fillRect(-5,-2,10,4);ctx.strokeRect(-5,-2,10,4);ctx.restore();}ctx.restore();}
   if(fx.type==='cratebreak'){ctx.globalAlpha=Math.max(0,1-fx.age/.65);ctx.font=`${Math.max(18,30-fx.age*15)}px system-ui`;ctx.fillText('💥',fx.x-11,fx.y-24-fx.age*20);ctx.globalAlpha=1;}
 }
 drawMarker();
 let drawable=[...pickups.filter(c=>c.active).map(c=>({y:c.y,type:'pickup',o:c})),...foes.filter(e=>e.alive).map(e=>({y:e.y,type:'enemy',o:e})),...bombs.map(b=>({y:b.y,type:'bomb',o:b})),...thrownCrates.map(c=>({y:c.y-(c.air||0),type:'thrown',o:c})),{y:player.y,type:'player',o:player}].sort((a,b)=>a.y-b.y);
 for(const d of drawable){if(d.type==='pickup')drawObject(d.o);if(d.type==='enemy')drawEnemy(d.o);if(d.type==='bomb')drawBomb(d.o);if(d.type==='thrown')drawThrownCrate(d.o);if(d.type==='player'&&!(invuln>0&&Math.sin(t*17)>0.8)){drawAvatar(d.o);drawHeldCrate();}}
 for(const f of fire)drawExplosion(f);
 if(phase==='over'||phase==='won'){
 ctx.fillStyle='#08152cca';roundRect(320,240,384,165,24,'#0e1d3bde','#d8efff',2);
 ctx.textAlign='center';ctx.fillStyle='#fff6bd';ctx.font='900 29px system-ui';ctx.fillText(phase==='won'?'VITÓRIA!':'FIM DE JOGO',512,307);ctx.fillStyle='#eef6ff';ctx.font='700 17px system-ui';ctx.fillText('Toque em Reiniciar para jogar novamente',512,349);ctx.textAlign='start';}
}
function frame(now){if(!lastTime)lastTime=now;const dt=Math.min(.045,(now-lastTime)/1000);lastTime=now;tick(dt);draw();requestAnimationFrame(frame);}
// Introspection for basic automated gameplay regression tests; never used to decide gestures.
window.__gameDebug={get state(){return {theme,player:{x:player.x,y:player.y,z:player.z,steps:player.path.length,carrying:player.carrying,surface:player.surface},bombs:bombs.length,pickups:pickups.filter(c=>c.active).length,thrown:thrownCrates.length,tracks:tracks.length,explosions,score,lives,foes:foes.filter(e=>e.alive).length,tour:tour.length};},navigate:goTo,placeBomb:tryBomb,throwAt:throwCarriedCrate};
images.day.onload=()=>{};images.night.onload=()=>{};init();requestAnimationFrame(frame);
})();