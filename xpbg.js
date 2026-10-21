/* =====================================================================
   COLINA XP VIVA (partes 7b y 7c) — pasto con viento, nubes, pájaros, estaciones y lluvia que moja la colina
   ---------------------------------------------------------------------
   · La colina («Bliss» dibujada a mano, sin imágenes) y el paisaje de cada estación los pinta scenes.js (entrada «xp»).
     Aquí se le añaden ~1000 briznas generadas con una semilla fija (siempre igual), agrupadas en pocas <g> por franja
     de profundidad y trozo de pantalla: más pequeñas al fondo, más grandes delante. Se animan SOLO con transform en CSS.
   · Viento: balanceo suave por franja + una ráfaga que cruza la colina de izquierda a derecha cada pocos segundos
     (el retraso depende de la posición) y un destello de luz que viaja con ella.
   · Cielo: nubes a la deriva en capas (las de lejos más pequeñas y lentas), hebras de viento, y de vez en cuando
     una bandada de pájaros (gansos en otoño, murciélagos en Halloween, estrella fugaz de noche).
   · Estaciones: flores en la hierba (primavera/verano), pétalos, hojas, nieve, luciérnagas, niebla de Halloween.
   · Lluvia («kixki-rain» start/stop, sin polling): más viento, cielo y nubes grises, verdes más oscuros, charcos con ondas.
   · Respeta: prefers-reduced-motion (imagen fija), #bgx.kv-pause (KXB.pause), pestaña oculta.
   · API: window.KXPAS { wet(v), rebuild(), hillY(xPx), puddles(), variant(), bird(tipo), star(), fx() }
   ===================================================================== */
(function(){
"use strict";
const root=document.documentElement,box=document.getElementById("bgx");
if(!box)return;
const NS="http://www.w3.org/2000/svg";
const RM=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const paused=()=>box.classList.contains("kv-pause")||!!(window.KXB&&KXB.paused&&KXB.paused());
const isXP=()=>root.getAttribute("data-bg")==="xp";
const dark=()=>root.getAttribute("data-theme")==="dark";
const variant=()=>root.getAttribute("data-xps")||"clasica";
const en=()=>window.KXI&&KXI.lang==="en";
function prng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rr=(r,a,b)=>a+r()*(b-a);

/* ---- geometría de la colina (la misma que dibuja scenes.js) ---- */
const FALLBACK=[[0,24.5,[9,21.5,20,20.4,32,21.6],[44,22.8,54,23.4,64,21.4]],[0,27,[10,23,22,21.2,36,22.4],[50,23.6,56,25.6,64,23.6]],
 [0,29,[7,20.5,18,14.8,30,15],[42,15.2,53,20.6,64,25.4]],[0,35,[12,30.5,30,29.6,46,31.4],[54,32.3,60,34,64,33.2]]];
const HL=(window.KXB&&KXB.hill)||FALLBACK;
function crest(L,x){
  let x0=L[0],y0=L[1];
  for(let i=2;i<L.length;i++){const c=L[i];
    if(x<=c[4]||i===L.length-1){
      let lo=0,hi=1;
      for(let k=0;k<16;k++){const t=(lo+hi)/2,u=1-t,bx=u*u*u*x0+3*u*u*t*c[0]+3*u*t*t*c[2]+t*t*t*c[4];if(bx<x)lo=t;else hi=t;}
      const t=(lo+hi)/2,u=1-t;return u*u*u*y0+3*u*u*t*c[1]+3*u*t*t*c[3]+t*t*t*c[5];}
    x0=c[4];y0=c[5];}
  return L[1];
}
const hdp=L=>`M${L[0]} ${L[1]}`+L.slice(2).map(c=>"C"+c.join(" ")).join("")+"V40H0Z";
/* tablas (x de 0 a 64 en pasos de .5): cima de la colina principal y cima visible (la más alta de todas las capas) */
const MAIN=[],TOP=[];
for(let i=0;i<=128;i++){const x=i/2;MAIN.push(crest(HL[2],x));TOP.push(Math.min.apply(null,HL.map(L=>crest(L,x))));}
const at=(T,x)=>{const f=Math.max(0,Math.min(64,x))*2,i=Math.floor(f),j=Math.min(128,i+1);return T[i]+(T[j]-T[i])*(f-i);};
/* dónde cae la colina en pantalla: el SVG .bot mide max(100%,640px) de ancho, va centrado y pegado abajo (viewBox 64x40) */
function geom(){const w=Math.max(innerWidth,640);return{u:w/64,left:(innerWidth-w)/2,vh:innerHeight};}
function hillY(xPx){const g=geom();return g.vh-(40-at(TOP,(xPx-g.left)/g.u))*g.u;}

/* ---- qué lleva cada estación ----
   n = cantidad de briznas (1 = todas) · hm = altura del pasto · fl = flores · fc = colores de flores
   fx = partículas · sky = nubes (cantidad, tamaño) · bird = qué cruza el cielo */
const V={
  clasica:{n:1,hm:1,fl:0,tone:[.3,.38,.25,.07],cl:[8,1],bird:"b"},
  primavera:{n:1,hm:1,fl:170,fc:["#ff8fc7","#ffffff","#ffe27a","#c7a6ff"],tone:[.26,.38,.28,.08],fx:{k:"petal",n:20,c:["#ffb7d5","#ffd3e5","#fff0f6","#ff9fc7"],z:[7,11]},cl:[8,1],bird:"b"},
  verano:{n:1,hm:1.05,fl:80,fc:["#ffd23a","#ffffff","#ff9a3a","#ffe27a"],tone:[.28,.36,.28,.08],fx:{k:"fly",n:16},cl:[6,.9],bird:"b"},
  otono:{n:.92,hm:.95,fl:0,tone:[.3,.38,.25,.07],fx:{k:"leaf",n:18,c:["#e2802a","#c9461a","#f2b13a","#a8541a","#d9531e"],z:[9,14]},cl:[7,1],bird:"g"},
  invierno:{n:.6,hm:.7,fl:0,tone:[.32,.36,.24,.08],fx:{k:"snow",n:70,c:["#fff"],z:[3,7]},cl:[9,1.15],bird:"c"},
  halloween:{n:.9,hm:.95,fl:0,tone:[.34,.38,.2,.08],mist:1,cl:[5,1],bird:"bat",fx:{k:"fly",n:10,orange:1}},
  navidad:{n:.6,hm:.7,fl:0,tone:[.3,.36,.24,.1],fx:{k:"snow",n:60,c:["#fff"],z:[3,7]},cl:[6,1],bird:null}
};
const cfg=()=>V[variant()]||V.clasica;

/* ---- pasto ---- */
const f2=n=>+n.toFixed(2);
const blade=(x,y,h,l,w)=>`M${f2(x-w)} ${f2(y)}Q${f2(x-w*.15)} ${f2(y-h*.55)} ${f2(x+l)} ${f2(y-h)}Q${f2(x+w*.55)} ${f2(y-h*.45)} ${f2(x+w)} ${f2(y)}Z`;
const dot=(x,y,r)=>`M${f2(x-r)} ${f2(y)}a${f2(r)} ${f2(r)} 0 1 0 ${f2(r*2)} 0a${f2(r)} ${f2(r)} 0 1 0 ${f2(-r*2)} 0Z`;
const BANDS=14,TONES=["b3","b2","b1","bp","f1","f2","f3","f4"];
function grassMarkup(){
  const c=cfg(),small=innerWidth<720||(matchMedia("(pointer:coarse)").matches&&innerWidth<1000),CH=small?6:10;
  const N=Math.round((small?520:1000)*c.n),r=prng(20260);
  const G=Array.from({length:BANDS},()=>Array.from({length:CH},()=>TONES.map(()=>"")));
  const add=(x,d,k,path)=>{G[Math.min(BANDS-1,Math.floor(d*BANDS))][Math.min(CH-1,Math.floor(x/64*CH))][k]+=path;};
  const tw=c.tone,cum=[tw[0],tw[0]+tw[1],tw[0]+tw[1]+tw[2]];
  for(let n=0;n<N;n++){
    const x=r()*64,tuft=r()<.07,d=tuft?.93+r()*.07:Math.pow(r(),1.5),yt=at(MAIN,x),y=yt+d*(40-yt)+.05;
    const h=(.16+1.75*Math.pow(d,1.25))*(.72+.55*r())*(tuft?1.55:1)*c.hm,w=(.045+.1*d)*(.8+.45*r())*(tuft?1.25:1),l=(r()-.42)*h*.5;
    /* las de delante son más claras; las del fondo, más oscuras y apagadas */
    const q=r(),k=d>.6?(q<.12?0:q<.38?1:q<.8?2:3):(q<cum[0]?0:q<cum[1]?1:q<cum[2]?2:3);
    add(x,d,k,blade(x,y,h,l,w));
  }
  /* flores: un tallo fino con una cabeza redonda en la punta, repartidas por la colina (más hacia delante) */
  if(c.fl){const rf=prng(777),NF=Math.round(c.fl*(small?.55:1));
    for(let n=0;n<NF;n++){const x=rf()*64,d=.32+Math.pow(rf(),.8)*.66,yt=at(MAIN,x),y=yt+d*(40-yt)+.05,h=(.3+.85*d)*(.8+.4*rf()),rd=.07+.07*d*(.7+.5*rf()),k=4+Math.floor(rf()*4);
      add(x,d,0,blade(x,y,h,(rf()-.5)*.1,.025+.015*d));add(x,d,k,dot(x,y-h,rd));}}
  /* destello de luz: una franja suave que recorre la colina junto con la ráfaga */
  const clip=[0,1,2].map(i=>`<path d="${hdp(HL[i])}"/>`).join("");
  let s=`<defs><linearGradient id="xppd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef7ff" stop-opacity=".9"/><stop offset="1" stop-color="#7db5f0" stop-opacity=".7"/></linearGradient>`
    +`<linearGradient id="xpshn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
    +`<clipPath id="xpcp">${clip}</clipPath></defs>`
    +`<g clip-path="url(#xpcp)"><g class="xp-sheen"><rect x="-2" y="8" width="22" height="34" fill="url(#xpshn)" transform="skewX(-18)"/></g></g><g class="xp-pd"></g>`;
  for(let b=0;b<BANDS;b++){
    const rb=prng(900+b),d=(b+.5)/BANDS;
    s+=`<g class="gw" style="--sa:${f2(.9+1.3*d)}deg;--sd:${f2(2.6+rb()*1.8)}s;--sl:${f2(-rb()*4)}s">`;
    for(let ch=0;ch<CH;ch++){
      const cx=(ch+.5)*64/CH;
      s+=`<g class="gt" style="--dl:${f2(cx*.075-9+(b%3)*.12)}s;--gs:${f2(.78+rb()*.5)}">`+TONES.map((t,k)=>G[b][ch][k]?`<path class="${t}" d="${G[b][ch][k]}"/>`:"").join("")+`</g>`;
    }
    s+=`</g>`;
  }
  return s+`<g class="xp-rg"></g>`;
}
function grassStyle(){const c=cfg().fc;return c?`--f1:${c[0]};--f2:${c[1]};--f3:${c[2]};--f4:${c[3]}`:"";}

/* ---- cielo: nubes a la deriva, hebras de viento ---- */
const cloudG=(x,y,k,gid,cls,st)=>{const P=[[-5,1.2,3],[-2,-.6,4.2],[2.4,.1,3.6],[5.8,1.4,2.8],[-3,1.9,3],[1.2,2,3.2]];
  return `<g class="c ${cls}" style="${st}"><g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})">`+P.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="url(#${gid})"/>`).join("")+`<ellipse cx="0" cy="2.4" rx="8" ry="1.6" fill="url(#${gid})"/></g></g>`;};
function skyMarkup(){
  const c=cfg(),r=prng(31337+variant().length*17),[cn,ck]=c.cl;let s="";
  /* nubes: de arriba (lejos, pequeñas, lentas) a abajo (cerca, grandes, más rápidas) */
  for(let i=0;i<cn;i++){
    const f=(i+.5)/cn,y=2+f*9.5+rr(r,-.8,.8),k=(.4+.55*f)*ck*rr(r,.85,1.15),dur=Math.round(rr(r,300,420)-f*150);
    s+=cloudG(rr(r,10,54),y,k,"xpcl","",`--cd:${dur}s;--cl:-${f2(rr(r,0,dur))}s`);
  }
  /* nubes de tormenta: solo se ven con lluvia (opacidad con --wg), pasan más rápido */
  for(let i=0;i<5;i++)s+=cloudG(rr(r,8,56),1.8+i*2.1+rr(r,-.4,.4),rr(r,.95,1.35),"xpcs","cs",`--cd:${Math.round(rr(r,95,150))}s;--cl:-${f2(rr(r,0,90))}s`);
  /* hebras de viento */
  for(let i=0;i<7;i++){const y=1.5+r()*10;
    s+=`<path class="xw1" d="M0 0C2 -.8 4 .8 6.4 0S10.6 -.7 12.4 .1" style="--wy:${f2(y)}px;--wd:${f2(rr(r,8,15))}s;--wl:-${f2(rr(r,0,14))}s"/>`;}
  return `<g class="xp-sky">${s}</g>`;
}

/* ---- pájaros (y gansos, murciélagos, estrella fugaz) ---- */
const sky=()=>box.querySelector(".xp-sky");
function wing(side,sx,sy,sc,kind,fd,fs){
  /* alas con la base en (0,0) del pájaro; se mueven con CSS */
  const d=kind==="bat"?(side<0?"M0 0L-.45 -.4L-.85 -.08L-.6 .05L-.35 .18L0 .1Z":"M0 0L.45 -.4L.85 -.08L.6 .05L.35 .18L0 .1Z")
    :(side<0?"M0 0Q-.5 -.52 -1.05 -.1":"M0 0Q.5 -.52 1.05 -.1");
  return `<g transform="translate(${f2(sx)} ${f2(sy)}) scale(${f2(sc)})"><path class="bw ${side<0?"wl":"wr"}" d="${d}" style="--f:${fs}s;--fd:-${fd}s"/></g>`;
}
function flock(kind){
  const r=Math.random,right=r()<.5,y0=2.2+r()*8.5,dy=(r()-.5)*4,t=kind==="g"?24+r()*10:kind==="bat"?15+r()*6:14+r()*8;
  const x0=right?-6:70,x1=right?70:-6;let n,body="",fs=kind==="g"?.9:kind==="bat"?.22:.42;
  const sc=kind==="g"?1.05:kind==="bat"?.9:.8+r()*.4;
  if(kind==="g"){n=5+Math.floor(r()*3);for(let i=0;i<n;i++){const k=Math.ceil(i/2),sd=i%2?1:-1,px=(right?-1:1)*k*-1.15*sc*1.4,py=sd*k*.62;body+=wing(-1,px,py,sc,"b",r()*.9,fs)+wing(1,px,py,sc,"b",r()*.9,fs);}}
  else{n=kind==="bat"?3+Math.floor(r()*4):1+Math.floor(r()*4);for(let i=0;i<n;i++){const px=(r()-.5)*4.2,py=(r()-.5)*2.6,s2=sc*(.75+r()*.5),fd=r()*.5,f=fs*(.85+r()*.4);body+=wing(-1,px,py,s2,kind,fd,f)+wing(1,px,py,s2,kind,fd,f);}}
  const g=document.createElementNS(NS,"g");
  g.setAttribute("class","xp-bd"+(kind==="bat"?" bat":""));
  g.setAttribute("style",`--x0:${x0}px;--y0:${f2(y0)}px;--x1:${x1}px;--y1:${f2(y0+dy)}px;--y2:${f2(y0+(r()-.5)*5)}px;--y3:${f2(y0+(r()-.5)*5)}px;--t:${f2(t)}s`);
  /* los pájaros que vuelan hacia la izquierda se voltean (el grupo interior lleva el espejo) */
  g.innerHTML=`<g${right?"":' transform="scale(-1 1)"'}>${body}</g>`;
  g.addEventListener("animationend",()=>g.remove());
  return g;
}
function bird(kind){
  const sk=sky();if(!sk||RM())return null;
  kind=kind||cfg().bird;if(!kind)return null;
  if(kind==="c")kind="b";
  const g=flock(kind);sk.appendChild(g);return g;
}
function star(){
  const sk=sky();if(!sk||RM())return null;
  const x=14+Math.random()*34,y=1+Math.random()*5,e=document.createElementNS(NS,"path");
  e.setAttribute("class","xp-ss");e.setAttribute("d",`M${f2(x)} ${f2(y)}l2.4 -.9`);e.setAttribute("style","--sx:-13px;--sy:6px");
  e.addEventListener("animationend",()=>e.remove());sk.appendChild(e);return e;
}
let birdT=0,starT=0;
function birdLoop(first){
  clearTimeout(birdT);
  birdT=setTimeout(()=>{
    if(isXP()&&!document.hidden&&!paused()&&!wet){
      const c=cfg(),n=dark();
      const sk=sky();
      if(sk&&c.bird==="bat"){if(!sk.querySelector(".xp-bd"))bird("bat");}
      else if(sk&&c.bird&&!n&&!sk.querySelector(".xp-bd"))bird(c.bird);
    }
    birdLoop();
  },first?7000+Math.random()*6000:24000+Math.random()*34000);
}
function starLoop(){
  clearTimeout(starT);
  starT=setTimeout(()=>{if(isXP()&&dark()&&!document.hidden&&!paused()&&!wet)star();starLoop();},18000+Math.random()*40000);
}

/* ---- partículas de la estación ---- */
function fxMarkup(){
  const f=cfg().fx;if(!f||RM())return "";
  const small=innerWidth<720,N=Math.round(f.n*(small?.6:1)),r=prng(4242+N);let s="";
  for(let i=0;i<N;i++){
    if(f.k==="fly"){
      /* luciérnagas: solo de noche (el CSS las oculta de día); vagan por la hierba y parpadean */
      const col=f.orange?"background:#ffc46b;box-shadow:0 0 8px 3px rgba(255,150,40,.75);":"";
      s+=`<i class="px fly" style="--x:${f2(r()*100)}%;--y:${f2(58+r()*34)}%;--d:${f2(rr(r,7,13))}s;--dl:-${f2(r()*10)}s;--bk:${f2(rr(r,1.6,3.6))}s;--fx:${f2(rr(r,-70,70))}px;--fy:${f2(rr(r,-40,20))}px;${col}"></i>`;
      continue;}
    const z=rr(r,f.z[0],f.z[1]),col=f.c[Math.floor(r()*f.c.length)],d=f.k==="snow"?rr(r,9,17)*(1+(7-z)*.03):rr(r,12,22);
    s+=`<i class="px ${f.k}" style="--x:${f2(r()*110-5)}%;--z:${f2(z)}px;--d:${f2(d)}s;--dl:-${f2(r()*d)}s;--dx:${f2(f.k==="snow"?rr(r,4,16):rr(r,16,40))}vw;--rt:${Math.round(rr(r,200,720))}deg;--sw:${f2(rr(r,8,26))}px;--sd:${f2(rr(r,2,4.5))}s;--sl:-${f2(r()*3)}s;--c:${col}"><b></b></i>`;
  }
  return s;
}

/* ---- clima ---- */
let wet=false,pudT=0,ringT=0,dryT=0;
const maxPud=()=>innerWidth<720?4:7;
const noPud=()=>/^(invierno|navidad)$/.test(variant());
const pd=()=>box.querySelector(".xp-pd"),rg=()=>box.querySelector(".xp-rg");
function el(tag,cls,at){const e=document.createElementNS(NS,tag);if(cls)e.setAttribute("class",cls);for(const k in at)e.setAttribute(k,at[k]);return e;}
function addPuddle(){
  const g=pd();if(!g||g.childNodes.length>=maxPud()||RM()||noPud())return;
  const x=5+Math.random()*54,yt=at(MAIN,x),dd=.52+Math.random()*.4,y=yt+(40-yt)*dd,rx=.5+2.8*dd*(.7+Math.random()*.6);
  const e=el("ellipse","xp-pud",{cx:f2(x),cy:f2(y),rx:f2(rx),ry:f2(rx*.18)});e.style.setProperty("--ps","0");
  g.appendChild(e);requestAnimationFrame(()=>requestAnimationFrame(()=>e.style.setProperty("--ps","1")));
}
function puddleLoop(){
  clearTimeout(pudT);if(!wet)return;
  if(!document.hidden&&!paused())addPuddle();
  pudT=setTimeout(puddleLoop,4500+Math.random()*5500);
}
/* ondas dentro de los charcos */
function ringLoop(){
  clearTimeout(ringT);if(!wet)return;
  const g=rg(),p=pd();
  if(g&&p&&!document.hidden&&!paused()&&!RM()&&g.childNodes.length<16&&p.childNodes.length){
    const ps=p.childNodes,q=ps[Math.floor(Math.random()*ps.length)];
    if(+q.style.getPropertyValue("--ps")>.35){
      const rx=+q.getAttribute("rx"),x=+q.getAttribute("cx")+(Math.random()-.5)*rx*1.3,y=+q.getAttribute("cy")+(Math.random()-.5)*rx*.18;
      const e=el("ellipse","xp-ring",{cx:f2(x),cy:f2(y),rx:f2(Math.max(.25,rx*.35)),ry:f2(Math.max(.25,rx*.35)*.2)});
      e.addEventListener("animationend",()=>e.remove());g.appendChild(e);}
  }
  const k=window.KXRAIN&&KXRAIN.intensity!=null?Math.max(.3,KXRAIN.intensity):1;
  ringT=setTimeout(ringLoop,(260+Math.random()*420)/k);
}
function wetSet(v){
  v=!!v;if(v===wet)return;wet=v;
  box.classList.toggle("xp-wet",wet);
  clearTimeout(dryT);
  if(wet){puddleLoop();ringLoop();}
  else{
    clearTimeout(pudT);clearTimeout(ringT);
    const p=pd();if(p){[].forEach.call(p.childNodes,e=>{e.style.setProperty("--ps","0");});
      dryT=setTimeout(()=>{if(!wet){const q=pd();if(q)q.textContent="";const r=rg();if(r)r.textContent="";}},36000);}
  }
}

/* ---- construir ---- */
function build(){
  if(!isXP()||box.querySelector(".xp-grass"))return;
  const top=box.querySelector(".top");
  if(top)top.insertAdjacentHTML("beforeend",skyMarkup());
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("class","xp-grass bot");s.setAttribute("viewBox","0 0 64 40");s.setAttribute("shape-rendering","geometricPrecision");s.setAttribute("aria-hidden","true");
  const gs=grassStyle();if(gs)s.setAttribute("style",gs);
  s.innerHTML=grassMarkup();box.appendChild(s);
  const fx=fxMarkup();if(fx)box.insertAdjacentHTML("beforeend",`<div class="xp-fx" aria-hidden="true">${fx}</div>`);
  if(cfg().mist)box.insertAdjacentHTML("beforeend",`<div class="xp-mist" aria-hidden="true"><i></i><i></i></div>`);
  box.classList.toggle("xp-wet",wet);
  if(wet){puddleLoop();ringLoop();}
  birdLoop(true);starLoop();
}
function menu(){
  const ref=document.getElementById("s-bg");if(!ref||document.getElementById("s-xps")||!window.KXB||!KXB.xps)return;
  ref.insertAdjacentHTML("afterend",'<button type="button" class="sm" id="s-xps" hidden></button>');
  const b=document.getElementById("s-xps");
  b.addEventListener("click",e=>{e.stopPropagation();
    const L=["auto"].concat(KXB.XPV),cur=L.indexOf(KXB.xps());KXB.xps(L[(cur+1)%L.length]);label();});
  label();
}
function label(){
  const b=document.getElementById("s-xps");if(!b)return;
  const cur=KXB.xps(),nm=cur==="auto"?(en()?"Auto":"Auto")+" · "+KXB.xpn(KXB.xpv()):KXB.xpn(cur);
  b.textContent=(en()?"Season: ":"Estación: ")+nm;b.hidden=!isXP();
}
addEventListener("kixki-bg",()=>{
  label();
  if(!isXP()){clearTimeout(pudT);clearTimeout(ringT);clearTimeout(birdT);clearTimeout(starT);}
  else{build();if(wet){puddleLoop();ringLoop();}}
});
addEventListener("kixki-rain",e=>{const t=e.detail&&e.detail.t;if(t==="start")wetSet(1);else if(t==="stop")wetSet(0);});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&wet){puddleLoop();ringLoop();}});
window.KXPAS={wet:wetSet,hillY,puddles:()=>pd()?pd().childNodes.length:0,variant,bird,star,
  fx:()=>box.querySelectorAll(".xp-fx .px").length,
  rebuild(){const o=box.querySelector(".xp-grass");if(o)o.remove();[".xp-fx",".xp-mist",".xp-sky"].forEach(q=>{const e=box.querySelector(q);if(e)e.remove();});build();}};
/* si ya estaba lloviendo cuando carga la página */
if(window.KXRAIN&&KXRAIN.raining)wet=false,wetSet(1);
build();
window.KXR?menu():addEventListener("kixki-ready",menu,{once:true});
})();
