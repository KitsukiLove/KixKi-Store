/* =========================================================
   CLIMA DE LLUVIA
   - Lluvia pixelada sobre cualquier fondo (capa de atrás con gotas lejanas + capa de delante con gotas cercanas).
   - Si no tocas nada durante un rato, las gotas "chocan" con la pantalla, se quedan pegadas y algunas resbalan.
     Pasa el dedo / el ratón por encima para limpiarlas (o espera a que se sequen).
   - Sonido de lluvia sintetizado (WebAudio, sin archivos): impactos de gota, viento, charcos, eco y truenos; se activa con el altavoz de la página; menú «Sonido de lluvia: sí / no».
   - Con el estilo o el fondo XP: lluvia en tres profundidades que se inclina con las ráfagas (igual que el pasto), bruma sobre la colina y relámpagos con trueno que llega con retraso.
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
/* modo XP: lluvia suave (lienzos a resolución real, mismas coordenadas lógicas) con estilo o fondo XP */
const isXP=()=>root.getAttribute("data-style")==="xp"||root.getAttribute("data-bg")==="xp";
let xpOn=isXP();
function fit(){
  W=Math.ceil(innerWidth/S);H=Math.ceil(innerHeight/S);
  const sc=xpOn?S*Math.min(2,devicePixelRatio||1):1;
  [cb,cf].forEach(c=>{c.width=Math.round(W*sc);c.height=Math.round(H*sc);});
  [xb,xf].forEach(x=>{x.setTransform(sc,0,0,sc,0,0);x.imageSmoothingEnabled=xpOn;});
}
new MutationObserver(()=>{const v=isXP();if(v===xpOn)return;xpOn=v;if(cb.isConnected)fit();}).observe(root,{attributes:true,attributeFilter:["data-style","data-bg"]});
function mount(){
  if(cb.isConnected)return;
  const bgx=document.getElementById("bgx");
  document.body.append(cb,cf);
  if(bgx)bgx.after(cb);
  fit();
}

/* ---- gotas que caen ---- */
const far=[],near=[];
const MAXFAR=380,MAXNEAR=56,PXFAR=230,PXNEAR=46;/* los máximos de abajo valen para el estilo pixel; el XP usa más gotas */
function mkFar(){const d={};resetFar(d,true);return d;}
/* dónde aterriza una gota lejana: con la Colina XP, sobre la colina (KXPAS.hillY da el borde de la colina en píxeles); si no, en la mitad de abajo */
const onHill=()=>xpOn&&root.getAttribute("data-bg")==="xp"&&window.KXPAS&&KXPAS.hillY;
function landY(x){
  if(onHill()){const top=KXPAS.hillY(x*S)/S;return rnd(Math.min(H-4,top+3),H-2);}
  return xpOn?rnd(Math.max(H*.4,(innerHeight-Math.max(innerWidth,640)*.4375)/S),H-2):rnd(H*.5,H-2);
}
function resetFar(d,any){d.z=Math.random();d.x=rnd(-10,W+10);d.y=any?rnd(-10,H):rnd(-24,-2);d.vy=rnd(3.2,5.4);d.vx=-d.vy*.16;d.l=Math.round(rnd(3,6));d.ly=landY(d.x);d.a=rnd(.35,.7);d.s=0;}
function mkNear(){const d={};resetNear(d,true);return d;}
function resetNear(d,any){d.z=Math.random();d.x=rnd(-10,W+10);d.y=any?rnd(-20,H):rnd(-40,-4);d.vy=rnd(7,10.5);d.vx=-d.vy*.16;d.l=Math.round(rnd(6,10));d.a=rnd(.45,.8);}
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

/* ---- modo XP: trazos y gotas suaves con brillo azul Luna ---- */
function xStreaks(ctx,arr,n,al,L,wm){
  ctx.lineCap="round";
  for(let b=0;b<3;b++){
    const lo=b/3,hi=(b+1)/3+(b===2?1:0),wd=[.5,.75,1][b]*wm,aa=[.5,.78,1][b];
    [["rgba(43,106,214,.5)",1],["rgba(222,240,255,.95)",.5]].forEach(([c,wf])=>{
      ctx.globalAlpha=al*.8*aa;ctx.strokeStyle=c;ctx.lineWidth=wd*wf;ctx.beginPath();
      for(let i=0;i<n;i++){const d=arr[i],z=d.z;if(z<lo||z>=hi)continue;const ln=d.l*(.7+.6*z);ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-L*ln,d.y-ln);}
      ctx.stroke();});
  }
  ctx.globalAlpha=1;
}
/* relámpago: un rayo que baja zigzagueando hasta la colina, con ramas y parpadeo; después llega el trueno */
let bolt=null;
const hillTop=x=>{const k=window.KXPAS&&KXPAS.hillY;return k?Math.max(H*.3,Math.min(H-8,KXPAS.hillY(x*S)/S)):H*.62;};
function strike(power){
  if(!raining&&inten<.3)return;
  const delay=rnd(.45,3.3),pw=Math.max(.25,power!=null?power:1-delay*.18);
  if(xpOn&&cb.isConnected){
    const hx=rnd(.12,.88)*W,end=hillTop(hx)+rnd(-1,3),pts=[];let x=hx,y=0;
    while(y<end){pts.push([x,y]);y+=rnd(2.5,6);x+=rnd(-4.2,4.2);}
    pts.push([x,Math.min(end,y)]);
    const br=[];for(let i=0;i<2;i++){const q=pts[Math.floor(rnd(2,Math.max(3,pts.length-3)))];if(!q)continue;let bx=q[0],by=q[1];const side=Math.random()<.5?-1:1,seg=[[bx,by]];for(let k=0;k<4;k++){bx+=side*rnd(2,6);by+=rnd(2,6);seg.push([bx,by]);}br.push(seg);}
    bolt={p:pts,br,t:0};
  }else frame.fl=5;
  emit2("kixki-thunder",{delay,power:pw});
}
const emit2=(n,d)=>dispatchEvent(new CustomEvent(n,{detail:d}));
function drawBolt(ctx,k){
  if(!bolt)return;
  bolt.t+=k;const t=bolt.t;if(t>14){bolt=null;return;}
  const a=t<2?1:t<4?.3:t<6.5?.95:Math.max(0,.7*(1-(t-6.5)/7.5));
  const line=(pts,w,al,col)=>{ctx.globalAlpha=Math.min(1,al);ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();};
  line(bolt.p,3.4,a*.22,"#9db8ff");line(bolt.p,1.5,a*.6,"#dbe6ff");line(bolt.p,.7,a,"#ffffff");
  bolt.br.forEach(b=>{line(b,1.1,a*.35,"#cfdcff");line(b,.45,a*.8,"#ffffff");});
  ctx.globalAlpha=a*(dark()?.22:.16);ctx.fillStyle="#eaf0ff";ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
}
function xpGlass(ctx,d){
  const a=d.tr;
  if(a.length){ctx.globalAlpha=Math.max(0,a[a.length-1].a)*.8;ctx.strokeStyle="rgba(125,181,240,.7)";ctx.lineWidth=.45;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(a[0].x,a[0].y);for(let i=1;i<a.length;i++)ctx.lineTo(a[i].x,a[i].y);ctx.stroke();}
  if(d.imp){const t=d.t,rr=d.r+t*.55;ctx.globalAlpha=Math.max(0,1-t/9)*.8;ctx.strokeStyle="#fff";ctx.lineWidth=.3;
    ctx.beginPath();ctx.ellipse(d.x,d.y,rr,rr*.8,0,0,6.283);ctx.stroke();}
  if(!d.imp||d.t>3){
    const sc=d.imp?Math.min(1,d.t/6):1,rx=(d.r*.75+.2)*sc,ry=rx*1.25,x=d.x,y=Math.round(d.y);
    const g=ctx.createRadialGradient(x-rx*.35,y-ry*.4,rx*.1,x,y,ry*1.1);
    g.addColorStop(0,"rgba(255,255,255,.95)");g.addColorStop(.35,"rgba(190,224,250,.6)");g.addColorStop(1,"rgba(43,106,214,.5)");
    ctx.globalAlpha=d.a;ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.55)";ctx.lineWidth=.25;ctx.stroke();}
  ctx.globalAlpha=1;
}
/* bruma de lluvia pegada a la colina */
function haze(ctx){
  const hy=hillTop(W/2),y0=Math.max(0,hy-18),g=ctx.createLinearGradient(0,y0,0,H);
  g.addColorStop(0,"rgba(215,230,250,0)");g.addColorStop(.3,dark()?"rgba(110,130,200,.15)":"rgba(228,240,255,.24)");g.addColorStop(1,"rgba(215,230,250,.05)");
  ctx.globalAlpha=Math.min(1,inten);ctx.fillStyle=g;ctx.fillRect(0,y0,W,H-y0);ctx.globalAlpha=1;
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
  /* viento: inclinación de la lluvia (a la derecha, como el pasto) con una ráfaga cada 9 s */
  const ct=(document.timeline&&document.timeline.currentTime)||performance.now(),ph=(ct/9000)%1,gu=ph>.05&&ph<.62?Math.sin((ph-.05)/.57*Math.PI):0;
  const L=.1+.04*Math.sin(ct/2900)+.19*gu*(.6+.4*Math.min(1,inten));

  if(inten>.01){
    /* tinte gris-azulado */
    xb.globalAlpha=Math.min(1,inten);xb.fillStyle=dark()?"rgba(6,6,36,.24)":"rgba(40,55,110,.16)";xb.fillRect(0,0,W,H);xb.globalAlpha=1;
    if(motion){
      const nf=Math.round((xpOn?Math.min(MAXFAR,W*H/430):Math.min(PXFAR,W*H/700))*inten),nn=Math.round((xpOn?Math.min(MAXNEAR,W*H/2600):Math.min(PXNEAR,W*H/3200))*inten);
      while(far.length<MAXFAR)far.push(mkFar());while(near.length<MAXNEAR)near.push(mkNear());
      for(let i=0;i<nf;i++){const d=far[i];d.y+=d.vy*k;d.x+=(xpOn?L*d.vy:d.vx)*k;
        if(d.y>=d.ly){if(splashes.length<120)splashes.push({x:Math.round(d.x),y:Math.round(d.ly),t:0});resetFar(d,false);}}
      for(let i=0;i<nn;i++){const d=near[i];d.y+=d.vy*k;d.x+=(xpOn?L*d.vy:d.vx)*k;if(d.y>H+10)resetNear(d,false);}
      if(xpOn){haze(xb);xStreaks(xb,far,nf,.8,L,1);xStreaks(xf,near,nn,.9,L,1.7);}
      else{streaks(xb,far,nf,rc,1,sh);streaks(xf,near,nn,rc,.8,sh);}
      /* salpicaduras al caer */
      xb.fillStyle=rc;
      for(let i=splashes.length-1;i>=0;i--){const s=splashes[i];s.t+=k;if(s.t>7){splashes.splice(i,1);continue;}
        xb.globalAlpha=Math.max(0,.8-s.t/9);
        if(xpOn){/* anillo suave + anillo interior + dos gotitas que saltan */
          const rr=s.t*.4+.4;xb.strokeStyle="#eaf6ff";xb.lineWidth=.34;xb.beginPath();xb.ellipse(s.x,s.y,rr,rr*.36,0,0,6.283);xb.stroke();
          if(s.t>1.4){xb.beginPath();xb.ellipse(s.x,s.y,rr*.55,rr*.2,0,0,6.283);xb.stroke();}
          if(s.t<4.5){const j=Math.sin(s.t*.7)*2.2;xb.fillStyle="#ffffff";xb.fillRect(s.x-rr*.8,s.y-j,.55,.55);xb.fillRect(s.x+rr*.8,s.y-j*.8,.55,.55);}
          continue;}
        const u=Math.floor(s.t/2)+1;
        xb.fillRect(s.x-u,s.y,1,1);xb.fillRect(s.x+u,s.y,1,1);xb.fillRect(s.x-u+1,s.y-1,1,1);xb.fillRect(s.x+u-1,s.y-1,1,1);}
      xb.globalAlpha=1;
    }
    /* destello lejano muy de vez en cuando (solo con tormenta fuerte) */
    if(motion&&inten>.9&&strength>=.85&&Math.random()<.0005)strike();
    if(bolt)drawBolt(xb,k);
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
    if(xpOn){xpGlass(xf,d);return;}
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
const snowBg=()=>{const b=root.getAttribute("data-bg");return b==="invierno"||b==="navidad"||(b==="xp"&&/^(invierno|navidad)$/.test(root.getAttribute("data-xps")||""));};
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
  if(w==="start"&&rsOn&&!pageSound()&&!sndHinted){sndHinted=true;setTimeout(()=>{try{K.say(["Si activas el sonido (el altavoz), también puedes oír la lluvia. 🎧","If you turn the sound on (the speaker), you can hear the rain too. 🎧"],{p:1,key:"rain-snd",cd:600000});}catch(e){}},7000);}
}
addEventListener("kixki-rain",e=>{
  const d=e.detail||{};const K=window.KXK;if(!K||!K.ready||!K.alive||!K.alive())return;
  if(d.t==="glass")try{K.say(["¡Las gotas chocan con la pantalla! 💧 Pasa el dedo o el ratón para limpiarlas.","Drops are hitting the screen! 💧 Swipe your finger or mouse to wipe them."],{p:2,key:"rain-glass",cd:180000});}catch(x){}
  if(d.t==="wipe"&&d.n>=8&&!wipe.said){wipe.said=1;try{K.say(["¡Cristal limpio y brillante! ✨","Squeaky clean glass! ✨"],{p:1,key:"rain-wipe",cd:180000});}catch(x){}}
});

/* ---- sonido de lluvia (sintetizado, sin archivos) · versión 2 ----
   Capas: lavado de ruido rosa en estéreo (siseo + cuerpo) · murmullo grave de tejado · viento que sube y baja ·
   cientos de impactos de gota por segundo (ráfagas de ruido muy cortas, de distinto tamaño y posición en el estéreo) ·
   «plops» de gotas en los charcos · eco suave de espacio abierto · truenos lejanos que llegan con retraso tras cada relámpago.
   Suena solo si el sonido de la página está activo (botón del altavoz / menú Efectos o Música) y «Sonido de lluvia» está en sí.
   Sube y baja con suavidad según la intensidad de la lluvia. */
let rsOn=LS.g("kixki-rainsnd",true),au=null,auClose=0,sndHinted=false;
const pageSound=()=>{const b=document.getElementById("rd");return !!b&&b.getAttribute("aria-pressed")==="true";};
const wantSound=()=>rsOn&&pageSound()&&!document.hidden&&inten>.02;
function noiseBuf(ctx,kind){
  const len=Math.floor(ctx.sampleRate*6),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
  let l=0,b0=0,b1=0,b2=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;
    if(kind==="brown"){l=(l+.02*w)/1.02;d[i]=l*3.5;}
    else{b0=.99765*b0+w*.099046;b1=.963*b1+w*.2965164;b2=.57*b2+w*1.0526913;d[i]=(b0+b1+b2+w*.1848)*.11;}}
  /* las puntas se funden para que el bucle no «clic» */
  const f=Math.floor(ctx.sampleRate*.05);for(let i=0;i<f;i++){const k=i/f;d[i]*=k;d[len-1-i]*=k;}
  return buf;
}
/* eco de espacio abierto: ruido que se apaga en ~1.8 s, distinto en cada oído */
function impulse(ctx,sec,pow){
  const n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(2,n,ctx.sampleRate);
  for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,pow);}
  return b;
}
/* banco de impactos: ráfagas de ruido de 12 a 45 ms con filtro paso bajo distinto (superficie dura, hojas, hierba) + plops de agua */
function dropBank(ctx){
  const sr=ctx.sampleRate,hits=[],plops=[];
  for(let k=0;k<14;k++){
    const len=Math.floor(sr*rnd(.012,.045)),b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0),cut=rnd(.1,.6),tau=len*rnd(.14,.3);
    let y=0,y2=0,pk=0;
    for(let i=0;i<len;i++){const w=Math.random()*2-1;y+=(w-y)*cut;y2+=(y-y2)*Math.min(1,cut*1.6);
      const att=Math.min(1,i/(sr*.0006)),v=(y-y2*.55)*Math.exp(-i/tau)*att;d[i]=v;pk=Math.max(pk,Math.abs(v));}
    for(let i=0;i<len;i++)d[i]/=pk||1;
    hits.push(b);
  }
  for(let k=0;k<5;k++){
    const len=Math.floor(sr*.11),b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0),f0=rnd(520,980);let ph=0,pk=0;
    for(let i=0;i<len;i++){const t=i/sr,f=f0*(1+.9*(1-Math.exp(-t/.018)));ph+=6.2832*f/sr;
      const v=Math.sin(ph)*Math.exp(-t/.028)*Math.min(1,t/.002)+(Math.random()*2-1)*.12*Math.exp(-t/.004);d[i]=v;pk=Math.max(pk,Math.abs(v));}
    for(let i=0;i<len;i++)d[i]/=pk||1;
    plops.push(b);
  }
  return {hits,plops};
}
function buildAudio(ctxArg){
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC&&!ctxArg)throw 0;
  const ctx=ctxArg||new AC(),master=ctx.createGain(),comp=ctx.createDynamicsCompressor(),an=ctx.createAnalyser(),bus=ctx.createGain(),bed=ctx.createGain(),verb=ctx.createConvolver(),vg=ctx.createGain();
  master.gain.value=0;an.fftSize=1024;comp.threshold.value=-20;comp.ratio.value=3.5;comp.attack.value=.01;comp.release.value=.3;
  bed.gain.value=.3;bed.connect(bus);bus.connect(master);verb.buffer=impulse(ctx,1.8,2.6);vg.gain.value=.2;bus.connect(vg);vg.connect(verb);verb.connect(master);
  master.connect(comp);comp.connect(ctx.destination);master.connect(an);
  const pink=noiseBuf(ctx,"pink"),brown=noiseBuf(ctx,"brown"),lows=[],mk=ctx.createStereoPanner?()=>ctx.createStereoPanner():null;
  const src=(buf,pan,off)=>{const n=ctx.createBufferSource();n.buffer=buf;n.loop=true;const p=mk?mk():null;if(p)p.pan.value=pan;n.start(0,off);return {n,p};};
  const out=(node,p)=>{if(p){node.connect(p);p.connect(bed);}else node.connect(bed);};
  /* lavado estéreo: siseo agudo + cuerpo medio */
  [[-.6,0],[.6,2.7]].forEach(([pan,off])=>{
    const a=src(pink,pan,off),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),g=ctx.createGain();
    hp.type="highpass";hp.frequency.value=1800;lp.type="lowpass";lp.frequency.value=9500;lp.Q.value=.5;g.gain.value=.34;lows.push(lp);
    a.n.connect(hp);hp.connect(lp);lp.connect(g);out(g,a.p);
    const b=src(pink,pan*.7,off+1.9),bp=ctx.createBiquadFilter(),bg=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();
    bp.type="bandpass";bp.frequency.value=1150;bp.Q.value=.55;bg.gain.value=.3;lfo.frequency.value=.09+pan*.02;lg.gain.value=.07;
    lfo.connect(lg);lg.connect(bg.gain);lfo.start();b.n.connect(bp);bp.connect(bg);out(bg,b.p);
  });
  /* murmullo grave del suelo y las hojas */
  {const a=src(brown,0,.7),lp=ctx.createBiquadFilter(),g=ctx.createGain();
    lp.type="lowpass";lp.frequency.value=300;g.gain.value=.2;a.n.connect(lp);lp.connect(g);out(g,null);}
  /* viento: ruido en banda media cuya fuerza y tono suben y bajan lento, como las ráfagas del pasto */
  {const a=src(pink,0,3.1),bp=ctx.createBiquadFilter(),g=ctx.createGain(),l1=ctx.createOscillator(),l2=ctx.createOscillator(),lg1=ctx.createGain(),lg2=ctx.createGain(),lf=ctx.createGain();
    bp.type="bandpass";bp.frequency.value=480;bp.Q.value=1.1;g.gain.value=.06;
    l1.frequency.value=.075;lg1.gain.value=.07;l2.frequency.value=.19;lg2.gain.value=.04;
    l1.connect(lg1);lg1.connect(g.gain);l2.connect(lg2);lg2.connect(g.gain);l1.start();l2.start();
    const l3=ctx.createOscillator();l3.frequency.value=.11;lf.gain.value=170;l3.connect(lf);lf.connect(bp.frequency);l3.start();
    a.n.connect(bp);bp.connect(g);out(g,null);}
  /* posiciones fijas en el estéreo para los impactos (así no se crea un panner por gota) */
  const lanes=[-.9,-.5,-.15,.15,.5,.9].map(v=>{if(!mk){return bus;}const p=mk();p.pan.value=v;p.connect(bus);return p;});
  const bank=dropBank(ctx),o={ctx,master,an,lows,bus,verb,vg,on:false,tm:0,brown,pink,
    /* cuánto suenan las capas de fondo (0 = llovizna, 1 = chaparrón) */
    level(lv,t){const v=.18+.82*lv;if(t)bed.gain.setTargetAtTime(v,ctx.currentTime,t);else bed.gain.value=v;}};
  /* programa los impactos de una ventana de tiempo: muchos y flojitos, pocos fuertes */
  o.sched=(t0,dur,lv)=>{
    const rate=(20+190*lv)*dur,n=Math.floor(rate)+(Math.random()<rate%1?1:0);
    for(let i=0;i<n;i++){
      const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=bank.hits[Math.floor(Math.random()*bank.hits.length)];
      s.playbackRate.value=rnd(.65,1.6);g.gain.value=Math.pow(Math.random(),2.4)*.19+.01;
      s.connect(g);g.connect(lanes[Math.floor(Math.random()*lanes.length)]);s.start(t0+Math.random()*dur);
    }
    const pr=(.55+1.6*lv)*dur,pn=Math.floor(pr)+(Math.random()<pr%1?1:0);
    for(let i=0;i<pn;i++){
      const s=ctx.createBufferSource(),g=ctx.createGain();s.buffer=bank.plops[Math.floor(Math.random()*bank.plops.length)];
      s.playbackRate.value=rnd(.7,1.35);g.gain.value=rnd(.03,.085);
      s.connect(g);g.connect(lanes[Math.floor(Math.random()*lanes.length)]);s.start(t0+Math.random()*dur);
    }
  };
  /* trueno: un chasquido seco (solo si cae cerca) y un rumor grave que rueda varios segundos */
  o.thunder=(delay,pw)=>{
    const t=ctx.currentTime+Math.max(.05,delay),p=Math.max(.15,Math.min(1,pw==null?1:pw));
    if(delay<1.4){const c=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),g=ctx.createGain();
      c.buffer=pink;hp.type="highpass";hp.frequency.value=900;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.5*p,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+.28);
      c.connect(hp);hp.connect(g);g.connect(bus);c.start(t,rnd(0,2),.3);}
    const r=ctx.createBufferSource(),lp=ctx.createBiquadFilter(),g=ctx.createGain(),p2=mk?mk():null;
    r.buffer=brown;lp.type="lowpass";lp.Q.value=.7;lp.frequency.setValueAtTime(520,t);lp.frequency.exponentialRampToValueAtTime(70,t+4.8);
    const A=2.4*p;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(A,t+.18);g.gain.linearRampToValueAtTime(A*.45,t+.8);g.gain.linearRampToValueAtTime(A*.9,t+1.25);
    g.gain.linearRampToValueAtTime(A*.35,t+2.3);g.gain.linearRampToValueAtTime(A*.55,t+3.2);g.gain.exponentialRampToValueAtTime(.0001,t+6);
    if(p2)p2.pan.value=rnd(-.5,.5);
    r.connect(lp);lp.connect(g);if(p2){g.connect(p2);p2.connect(bus);}else g.connect(bus);r.start(t,rnd(0,.3),5.8);
  };
  return o;
}
function syncSound(){
  const want=wantSound();
  if(want){
    if(!au){if(navigator.userActivation&&!navigator.userActivation.hasBeenActive)return;
      try{au=buildAudio();}catch(e){au=null;return;}}
    clearTimeout(auClose);auClose=0;
    const c=au.ctx;if(c.state==="suspended")try{c.resume();}catch(e){}
    const night=dark(),v=Math.min(1,inten)*(.34+.12*strength)*(night?.8:1)*(window.KXM&&KXM.on?.7:1);
    au.master.gain.setTargetAtTime(v,c.currentTime,.9);au.level(Math.min(1,inten)*(.45+.55*strength),1.2);
    au.lows.forEach(l=>l.frequency.setTargetAtTime(night?6500:9500,c.currentTime,1));
    if(!au.on){au.on=true;
      const o=au;o.tm=setInterval(()=>{if(au!==o||!o.on)return;o.sched(o.ctx.currentTime+.04,.1,Math.min(1,inten)*(.45+.55*strength));},100);}
  }else if(au){
    au.on=false;clearInterval(au.tm);
    au.master.gain.setTargetAtTime(0,au.ctx.currentTime,.5);
    if(!auClose)auClose=setTimeout(()=>{auClose=0;if(!wantSound()&&au){try{au.ctx.close();}catch(e){}au=null;}},3500);
  }
}
setInterval(syncSound,300);
addEventListener("kixki-thunder",e=>{const d=e.detail||{};if(au&&au.on)try{au.thunder(d.delay||1,d.power);}catch(x){}});
const rdBtn=()=>document.getElementById("rd");
addEventListener("click",()=>setTimeout(syncSound,50),true);
function levelNow(){if(!au)return 0;const a=new Uint8Array(au.an.fftSize);au.an.getByteTimeDomainData(a);let s=0;for(let i=0;i<a.length;i++){const x=(a[i]-128)/128;s+=x*x;}return Math.sqrt(s/a.length);}
/* para pruebas: renderiza unos segundos de lluvia (y un trueno) a un WAV en base64, sin altavoz */
async function renderWav(sec,lv,thunderAt){
  sec=sec||8;lv=lv==null?1:lv;const sr=44100,oc=new OfflineAudioContext(2,sr*sec,sr),o=buildAudio(oc);
  o.master.gain.value=.5;o.level(lv);for(let t=0;t<sec;t+=.1)o.sched(t,.1,lv);
  if(thunderAt!=null)o.thunder(thunderAt,1);
  const b=await oc.startRendering(),L=b.getChannelData(0),R=b.getChannelData(1),n=L.length,buf=new ArrayBuffer(44+n*4),v=new DataView(buf);
  const ws=(p,s)=>{for(let i=0;i<s.length;i++)v.setUint8(p+i,s.charCodeAt(i));};
  ws(0,"RIFF");v.setUint32(4,36+n*4,true);ws(8,"WAVEfmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sr,true);v.setUint32(28,sr*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);ws(36,"data");v.setUint32(40,n*4,true);
  for(let i=0;i<n;i++){v.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]))*32767,true);v.setInt16(46+i*4,Math.max(-1,Math.min(1,R[i]))*32767,true);}
  let s="";const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s);
}

/* ---- menú ---- */
let btn=null;
const LAB={auto:"Lluvia: auto",on:"Lluvia: sí",off:"Lluvia: no"};
let btnS=null;
function label(){if(btn)btn.textContent=LAB[mode];if(btnS)btnS.textContent="Sonido de lluvia: "+(rsOn?"sí":"no");}
function menu(){
  const ref=document.getElementById("s-bg");if(!ref||document.getElementById("s-rain"))return;
  ref.insertAdjacentHTML("afterend",'<button type="button" class="sm" id="s-rain"></button>');
  btn=document.getElementById("s-rain");
  btn.insertAdjacentHTML("afterend",'<button type="button" class="sm" id="s-rainsnd"></button>');
  btnS=document.getElementById("s-rainsnd");label();
  btn.addEventListener("click",e=>{e.stopPropagation();setMode(mode==="auto"?"on":mode==="on"?"off":"auto");});
  btnS.addEventListener("click",e=>{e.stopPropagation();rsOn=!rsOn;LS.s("kixki-rainsnd",rsOn);label();
    if(rsOn&&!pageSound()){const K=window.KXK;if(K&&K.ready&&K.alive&&K.alive())try{K.say(["Para oír la lluvia activa el sonido: el botón del altavoz. 🔊","To hear the rain, turn the sound on: the speaker button. 🔊"],{p:2,key:"rain-snd",cd:60000});}catch(x){}}
    syncSound();});
}
window.KXR?menu():addEventListener("kixki-ready",menu,{once:true});

window.KXRAIN={
  on:()=>raining&&inten>.3,
  get raining(){return raining;},get mode(){return mode;},get intensity(){return inten;},
  set:setMode,start:(ms,str)=>startRain(ms||0,str),stop:stopRain,
  sound:()=>({want:wantSound(),on:!!au,state:au&&au.ctx.state,level:levelNow()}),glass:gotas,idle(ms){if(ms>=0)idleMs=ms;return idleMs;},
  drop:(x,y,r)=>{wake();return addDrop(x/S,y/S,r);},
  lightning:p=>{wake();strike(p);},thunder:(d,p)=>{if(au)au.thunder(d||.5,p);},_render:renderWav
};
if(mode==="on")startRain(0,rnd(.8,1));
})();
