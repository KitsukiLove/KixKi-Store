/* =========================================================
   CLIMA DE LLUVIA
   - Lluvia pixelada sobre cualquier fondo (capa de atrás con gotas lejanas + capa de delante con gotas cercanas).
   - Si no tocas nada durante un rato, las gotas "chocan" con la pantalla, se quedan pegadas y algunas resbalan.
     Pasa el dedo / el ratón por encima para limpiarlas (o espera a que se sequen).
   - Menú: «Lluvia: auto / sí / no». En auto llueve de vez en cuando (no con nieve).
   - API: window.KXRAIN  { on(), raining, mode, set(m), start(ms), stop(), glass(), idle(ms) }
   - Avisa con el evento "kixki-rain" → e.detail = {t:"start"|"stop"|"glass"|"wipe", n}
     (kixki2.js lo usa para el incendio de verano y los logros)
   ========================================================= */
(function(){
"use strict";
const S=3;/* tamaño del "pixel" de la lluvia, en píxeles reales */
const root=document.documentElement;
const rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now();
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const RM=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const emit=(t,d)=>dispatchEvent(new CustomEvent("kixki-rain",{detail:Object.assign({t},d)}));

let mode=LS.g("kixki-rain","auto");if(!["auto","on","off"].includes(mode))mode="auto";
let raining=false,inten=0,strength=1,rainEnd=0,nextRain=now()+rnd(30000,110000);
let idleMs=12000,lastAct=now(),wipedTotal=0,glassFired=false,loop=0;

/* ---- lienzos ---- */
const mkc=id=>{const c=document.createElement("canvas");c.id=id;c.setAttribute("aria-hidden","true");return c;};
const cb=mkc("kr-bg"),cf=mkc("kr-fg");
const xb=cb.getContext("2d"),xf=cf.getContext("2d");
let W=0,H=0;
function fit(){
  W=Math.ceil(innerWidth/S);H=Math.ceil(innerHeight/S);
  [cb,cf].forEach(c=>{c.width=W;c.height=H;});
  xb.imageSmoothingEnabled=false;xf.imageSmoothingEnabled=false;
}
function mount(){
  if(cb.isConnected)return;
  const bgx=document.getElementById("bgx");
  document.body.append(cb,cf);
  if(bgx)bgx.after(cb);
  fit();
}

/* ---- gotas que caen ---- */
const far=[],near=[];
const MAXFAR=230,MAXNEAR=46;
function mkFar(){const d={};resetFar(d,true);return d;}
function resetFar(d,any){d.x=rnd(-10,W+10);d.y=any?rnd(-10,H):rnd(-24,-2);d.vy=rnd(3.2,5.4);d.vx=-d.vy*.16;d.l=Math.round(rnd(3,6));d.ly=rnd(H*.5,H-2);d.a=rnd(.35,.7);d.s=0;}
function mkNear(){const d={};resetNear(d,true);return d;}
function resetNear(d,any){d.x=rnd(-10,W+10);d.y=any?rnd(-20,H):rnd(-40,-4);d.vy=rnd(7,10.5);d.vx=-d.vy*.16;d.l=Math.round(rnd(6,10));d.a=rnd(.45,.8);}
const splashes=[];

/* ---- gotas pegadas en el cristal ---- */
const gl=[];const MAXG=70;let spawnT=0;
const gotas=()=>gl.length;
function addDrop(x,y,r){
  const d={x:Math.round(x),y:Math.round(y),r:r||(Math.random()<.5?1:Math.random()<.65?2:Math.random()<.8?3:4),t:0,vy:0,sl:false,tr:[],a:1,w:rnd(.6,1.2)};
  gl.push(d);if(gl.length>MAXG)gl.shift();return d;
}

function dark(){return root.getAttribute("data-theme")==="dark";}

/* ---- dibujo ---- */
function streaks(ctx,arr,n,col,alpha,sh){
  for(let i=0;i<n;i++){
    const d=arr[i];
    for(let k=0;k<d.l;k++){const px=Math.round(d.x-d.vx*k*.5),py=Math.round(d.y-k);
      ctx.globalAlpha=d.a*alpha*.55;ctx.fillStyle=sh;ctx.fillRect(px+1,py,1,1);
      ctx.globalAlpha=Math.min(1,d.a*alpha*(1.25-k/d.l*.5));ctx.fillStyle=col;ctx.fillRect(px,py,1,1);}
  }
  ctx.globalAlpha=1;
}
function dropShape(ctx,d,P,sc){
  const r=d.r,hr=r+(r>1?1:0),a=d.a;
  ctx.globalAlpha=a;
  for(let dy=-hr;dy<=hr;dy++){
    const u=dy/(hr+.5),w=Math.max(r>1?1:0,Math.floor(Math.sqrt(Math.max(0,1-u*u))*r*sc+.01));
    ctx.fillStyle=P.fill;ctx.fillRect(d.x-w,d.y+dy,w*2+1,1);
    if(dy>=hr-1&&r>1){ctx.fillStyle=P.edge;ctx.fillRect(d.x-w+1,d.y+dy,Math.max(1,w*2-1),1);}
  }
  ctx.fillStyle=P.edge;ctx.fillRect(d.x+(r>1?r-1:1),d.y+(r>1?1:0),1,Math.max(1,r-1));
  ctx.fillStyle=P.hi;ctx.fillRect(d.x-Math.max(1,r-1),d.y-Math.max(0,hr-1),1,1);
  if(r>2)ctx.fillRect(d.x-Math.max(1,r-1)+1,d.y-hr+1,1,1);
  ctx.globalAlpha=1;
}
function impact(ctx,d,P){
  const t=d.t;/* 0..9 */
  const rr=d.r+t*.55,al=Math.max(0,1-t/9);
  ctx.globalAlpha=al*.85;ctx.fillStyle=P.hi;
  for(let k=0;k<8;k++){const an=k*Math.PI/4+.2;ctx.fillRect(Math.round(d.x+Math.cos(an)*rr),Math.round(d.y+Math.sin(an)*rr*.8),1,1);}
  ctx.globalAlpha=1;
}

function frame(ts){
  loop=0;
  if(document.hidden){loop=requestAnimationFrame(frame);return;}
  const dt=Math.min(.05,((ts||performance.now())-(frame.l||ts||0))/1000||.016);frame.l=ts||performance.now();
  const k=dt*60,t=now();
  /* intensidad hacia su objetivo */
  const tg=raining?strength:0;
  inten+=Math.sign(tg-inten)*Math.min(Math.abs(tg-inten),dt*.35);
  const P={fill:dark()?"rgba(200,212,255,.26)":"rgba(235,244,255,.46)",edge:dark()?"rgba(130,150,240,.75)":"rgba(40,62,150,.7)",hi:"#ffffff"};
  const rc=dark()?"#c4cfff":"#eaf2ff",sh=dark()?"#3d4aa8":"#2f4fae";
  xb.clearRect(0,0,W,H);xf.clearRect(0,0,W,H);
  const motion=!RM();

  if(inten>.01){
    /* tinte gris-azulado */
    xb.globalAlpha=Math.min(1,inten);xb.fillStyle=dark()?"rgba(6,6,36,.24)":"rgba(40,55,110,.16)";xb.fillRect(0,0,W,H);xb.globalAlpha=1;
    if(motion){
      const nf=Math.round(Math.min(MAXFAR,W*H/700)*inten),nn=Math.round(Math.min(MAXNEAR,W*H/3200)*inten);
      while(far.length<MAXFAR)far.push(mkFar());while(near.length<MAXNEAR)near.push(mkNear());
      for(let i=0;i<nf;i++){const d=far[i];d.y+=d.vy*k;d.x+=d.vx*k;
        if(d.y>=d.ly){if(splashes.length<120)splashes.push({x:Math.round(d.x),y:Math.round(d.ly),t:0});resetFar(d,false);}}
      for(let i=0;i<nn;i++){const d=near[i];d.y+=d.vy*k;d.x+=d.vx*k;if(d.y>H+10)resetNear(d,false);}
      streaks(xb,far,nf,rc,1,sh);
      streaks(xf,near,nn,rc,.8,sh);
      /* salpicaduras al caer */
      xb.fillStyle=rc;
      for(let i=splashes.length-1;i>=0;i--){const s=splashes[i];s.t+=k;if(s.t>7){splashes.splice(i,1);continue;}
        xb.globalAlpha=Math.max(0,.8-s.t/9);const u=Math.floor(s.t/2)+1;
        xb.fillRect(s.x-u,s.y,1,1);xb.fillRect(s.x+u,s.y,1,1);xb.fillRect(s.x-u+1,s.y-1,1,1);xb.fillRect(s.x+u-1,s.y-1,1,1);}
      xb.globalAlpha=1;
    }
    /* destello lejano muy de vez en cuando (solo con tormenta fuerte) */
    if(motion&&inten>.9&&strength>=1&&Math.random()<.0007){frame.fl=5;}
    if(frame.fl>0){frame.fl-=k;xb.globalAlpha=.16;xb.fillStyle="#fff";xb.fillRect(0,0,W,H);xb.globalAlpha=1;}
  }

  /* ---- gotas en el cristal ---- */
  const idle=t-lastAct,dry=idle<2500;
  if(raining&&inten>.5&&idle>idleMs&&motion){
    spawnT-=dt*1000;
    if(spawnT<=0){
      const over=Math.min(1,(idle-idleMs)/22000);
      spawnT=Math.max(110,520-over*400)*rnd(.7,1.3);
      const d=addDrop(rnd(4,W-4),rnd(4,H-6));d.t=0;d.imp=1;
      if(!glassFired&&gl.length>=5){glassFired=true;emit("glass",{n:gl.length});}
    }
  }
  const evap=!raining&&gl.length>0;
  for(let i=gl.length-1;i>=0;i--){
    const d=gl[i];
    if(d.imp){d.t+=k*.9;if(d.t>=9){d.imp=0;d.t=0;}}
    else{
      if(dry||evap)d.a-=dt*(evap?.14:.09);
      if(!d.sl&&d.r>=3&&Math.random()<.0016*k*(d.r-2))d.sl=true;
      if(d.sl){d.vy=Math.min(1.05,d.vy+.025*k);const ny=d.y+d.vy*k;
        if(Math.round(ny)!==d.y){d.tr.push({x:d.x,y:d.y,a:.5});if(d.tr.length>46)d.tr.shift();}d.y=ny;
        d.r=Math.max(2,d.r-(Math.random()<.002*k?1:0));
        if(d.vy>.7&&Math.random()<.01*k){d.sl=false;d.vy=0;}
        if(d.y>H+6)d.a=0;}
      d.y=d.sl?d.y:Math.round(d.y);
    }
    d.tr.forEach(q=>q.a-=dt*.16);
    while(d.tr.length&&d.tr[0].a<=0)d.tr.shift();
    if(d.a<=0&&!d.tr.length){gl.splice(i,1);}
  }
  gl.forEach(d=>{
    if(d.tr.length){xf.fillStyle=P.fill;d.tr.forEach(q=>{xf.globalAlpha=Math.max(0,q.a)*.8;xf.fillRect(Math.round(q.x),Math.round(q.y),1,1);});xf.globalAlpha=1;}
    if(d.imp)impact(xf,d,P);
    if(!d.imp||d.t>3)dropShape(xf,{x:d.x,y:Math.round(d.y),r:d.r,a:d.a},P,d.imp?Math.min(1,d.t/6):1);
  });

  const alive=raining||inten>.01||gl.length>0;
  document.documentElement.classList.toggle("kr-on",alive);
  if(alive)loop=requestAnimationFrame(frame);
  else{xb.clearRect(0,0,W,H);xf.clearRect(0,0,W,H);}
}
function wake(){mount();if(!loop){frame.l=0;loop=requestAnimationFrame(frame);}}

/* ---- control ---- */
function startRain(ms,str){
  if(raining&&!ms)return;
  const was=raining;raining=true;strength=str||rnd(.7,1);
  rainEnd=ms?now()+ms:(mode==="on"?Infinity:now()+rnd(70000,150000));
  if(was)return;
  glassFired=false;lastAct=now();
  wake();emit("start",{});react("start");
}
function stopRain(){
  if(!raining)return;
  raining=false;rainEnd=0;nextRain=now()+rnd(150000,420000);emit("stop",{});react("stop");wake();
}
const snowBg=()=>{const b=root.getAttribute("data-bg");return b==="invierno"||b==="navidad";};
setInterval(()=>{
  if(document.hidden)return;
  if(mode==="auto"){
    if(raining){if(now()>=rainEnd)stopRain();}
    else if(now()>=nextRain){nextRain=now()+rnd(120000,300000);if(!snowBg()&&!RM())startRain(rnd(70000,150000));}
  }
},4000);

function setMode(m){
  mode=m;LS.s("kixki-rain",m);
  if(m==="on")startRain(0,rnd(.8,1));
  else if(m==="off")stopRain();
  else{if(raining&&!isFinite(rainEnd))rainEnd=now()+rnd(20000,50000);nextRain=now()+rnd(40000,120000);}
  label();
}

/* ---- el visitante ---- */
function wipe(x,y,r){
  const cx=x/S,cy=y/S,rr=r/S;let n=0;
  for(let i=gl.length-1;i>=0;i--){const d=gl[i];
    const dx=d.x-cx,dy=d.y-cy;
    if(dx*dx+dy*dy<=(rr+d.r)*(rr+d.r)){gl.splice(i,1);n++;}
    else if(d.tr.length&&d.tr.some(q=>(q.x-cx)*(q.x-cx)+(q.y-cy)*(q.y-cy)<=rr*rr))d.tr.length=0;}
  if(n){wipedTotal+=n;emit("wipe",{n:wipedTotal,k:n});}
}
const act=()=>{lastAct=now();};
addEventListener("pointermove",e=>{act();if(gl.length)wipe(e.clientX,e.clientY,30);},{passive:true});
addEventListener("pointerdown",e=>{act();if(gl.length)wipe(e.clientX,e.clientY,48);},{passive:true,capture:true});
["keydown","wheel","scroll","touchstart"].forEach(ev=>addEventListener(ev,act,{passive:true,capture:true}));
addEventListener("resize",()=>{if(cb.isConnected)fit();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden){lastAct=now();if(raining||gl.length)wake();}});

/* ---- Kixki comenta ---- */
function react(w){
  const K=window.KXK;if(!K||!K.ready||!K.alive||!K.alive())return;
  const M={
    start:["¡Está lloviendo! 🌧️ Menos mal que mi lana es impermeable… más o menos.","It's raining! 🌧️ Good thing my wool is waterproof… sort of."],
    stop:["¡Ya paró la lluvia! 🌈 Huele a hierba mojada.","The rain stopped! 🌈 Smells like wet grass."]
  }[w];
  if(M)try{K.say(M,{p:1,key:"rain-"+w,cd:120000});}catch(e){}
}
addEventListener("kixki-rain",e=>{
  const d=e.detail||{};const K=window.KXK;if(!K||!K.ready||!K.alive||!K.alive())return;
  if(d.t==="glass")try{K.say(["¡Las gotas chocan con la pantalla! 💧 Pasa el dedo o el ratón para limpiarlas.","Drops are hitting the screen! 💧 Swipe your finger or mouse to wipe them."],{p:2,key:"rain-glass",cd:180000});}catch(x){}
  if(d.t==="wipe"&&d.n>=8&&!wipe.said){wipe.said=1;try{K.say(["¡Cristal limpio y brillante! ✨","Squeaky clean glass! ✨"],{p:1,key:"rain-wipe",cd:180000});}catch(x){}}
});

/* ---- menú ---- */
let btn=null;
const LAB={auto:"Lluvia: auto",on:"Lluvia: sí",off:"Lluvia: no"};
function label(){if(btn)btn.textContent=LAB[mode];}
function menu(){
  const ref=document.getElementById("s-bg");if(!ref||document.getElementById("s-rain"))return;
  ref.insertAdjacentHTML("afterend",'<button type="button" class="sm" id="s-rain"></button>');
  btn=document.getElementById("s-rain");label();
  btn.addEventListener("click",e=>{e.stopPropagation();setMode(mode==="auto"?"on":mode==="on"?"off":"auto");});
}
window.KXR?menu():addEventListener("kixki-ready",menu,{once:true});

window.KXRAIN={
  on:()=>raining&&inten>.3,
  get raining(){return raining;},get mode(){return mode;},get intensity(){return inten;},
  set:setMode,start:(ms,str)=>startRain(ms||0,str),stop:stopRain,
  glass:gotas,idle(ms){if(ms>=0)idleMs=ms;return idleMs;},
  drop:(x,y,r)=>{wake();return addDrop(x/S,y/S,r);}
};
if(mode==="on")startRain(0,rnd(.8,1));
})();
