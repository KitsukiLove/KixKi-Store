/* =====================================================================
   COLINA XP VIVA (parte 7b) — pasto con viento, ráfagas, nubes, lluvia que moja la colina
   ---------------------------------------------------------------------
   · La colina («Bliss» dibujada a mano, sin imágenes) la pinta scenes.js (entrada «xp»).
     Aquí se le añaden ~1000 briznas generadas con una semilla fija (siempre igual), agrupadas
     en pocas <g> por franja de profundidad y trozo de pantalla: más pequeñas al fondo,
     más grandes delante. Se animan SOLO con transform en CSS (sin tocar el layout).
   · Viento: balanceo suave por franja + una ráfaga que cruza la colina de izquierda a
     derecha cada pocos segundos (el retraso depende de la posición).
   · Lluvia («kixki-rain» start/stop, sin polling): más viento, cielo y nubes grises, verdes
     más oscuros y saturados, charcos con ondas que se forman y se secan poco a poco.
   · Respeta: prefers-reduced-motion (imagen fija), #bgx.kv-pause (KXB.pause), pestaña oculta.
   · API: window.KXPAS { wet(v), rebuild(), hillY(xPx), puddles() }
   ===================================================================== */
(function(){
"use strict";
const root=document.documentElement,box=document.getElementById("bgx");
if(!box)return;
const NS="http://www.w3.org/2000/svg";
const RM=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const paused=()=>box.classList.contains("kv-pause")||!!(window.KXB&&KXB.paused&&KXB.paused());
const isXP=()=>root.getAttribute("data-bg")==="xp";
function prng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

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
/* tablas (x de 0 a 64 en pasos de .5): cima de la colina principal y cima visible (la más alta de todas las capas) */
const MAIN=[],TOP=[];
for(let i=0;i<=128;i++){const x=i/2;MAIN.push(crest(HL[2],x));TOP.push(Math.min.apply(null,HL.map(L=>crest(L,x))));}
const at=(T,x)=>{const f=Math.max(0,Math.min(64,x))*2,i=Math.floor(f),j=Math.min(128,i+1);return T[i]+(T[j]-T[i])*(f-i);};
/* dónde cae la colina en pantalla: el SVG .bot mide max(100%,640px) de ancho, va centrado y pegado abajo (viewBox 64x40) */
function geom(){const w=Math.max(innerWidth,640);return{u:w/64,left:(innerWidth-w)/2,vh:innerHeight};}
function hillY(xPx){const g=geom();return g.vh-(40-at(TOP,(xPx-g.left)/g.u))*g.u;}

/* ---- pasto ---- */
const f2=n=>+n.toFixed(2);
const blade=(x,y,h,l,w)=>`M${f2(x-w)} ${f2(y)}Q${f2(x-w*.15)} ${f2(y-h*.55)} ${f2(x+l)} ${f2(y-h)}Q${f2(x+w*.55)} ${f2(y-h*.45)} ${f2(x+w)} ${f2(y)}Z`;
const BANDS=14,CH=6,TONES=["b3","b2","b1","bp"];
function grassMarkup(){
  const small=innerWidth<720||(matchMedia("(pointer:coarse)").matches&&innerWidth<1000);
  const N=small?520:1000,r=prng(20260);
  const G=Array.from({length:BANDS},()=>Array.from({length:CH},()=>["","","",""]));
  for(let n=0;n<N;n++){
    const x=r()*64,d=Math.pow(r(),1.5),yt=at(MAIN,x),y=yt+d*(40-yt)+.05;
    const h=(.16+1.75*Math.pow(d,1.25))*(.72+.55*r()),w=(.045+.1*d)*(.8+.45*r()),l=(r()-.42)*h*.5;
    /* las de delante son más claras; las del fondo, más oscuras y apagadas */
    const q=r(),k=d>.6?(q<.12?0:q<.38?1:q<.8?2:3):(q<.3?0:q<.68?1:q<.93?2:3);
    G[Math.min(BANDS-1,Math.floor(d*BANDS))][Math.min(CH-1,Math.floor(x/64*CH))][k]+=blade(x,y,h,l,w);
  }
  let s=`<defs><linearGradient id="xppd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef7ff" stop-opacity=".9"/><stop offset="1" stop-color="#7db5f0" stop-opacity=".7"/></linearGradient></defs><g class="xp-pd"></g>`;
  for(let b=0;b<BANDS;b++){
    const rr=prng(900+b),d=(b+.5)/BANDS;
    s+=`<g class="gw" style="--sa:${f2(.9+1.3*d)}deg;--sd:${f2(2.6+rr()*1.8)}s;--sl:${f2(-rr()*4)}s">`;
    for(let c=0;c<CH;c++){
      const cx=(c+.5)*64/CH;
      s+=`<g class="gt" style="--dl:${f2(cx*.075-9+(b%3)*.12)}s">`+TONES.map((t,k)=>G[b][c][k]?`<path class="${t}" d="${G[b][c][k]}"/>`:"").join("")+`</g>`;
    }
    s+=`</g>`;
  }
  return s+`<g class="xp-rg"></g>`;
}

/* ---- clima ---- */
let wet=false,pudT=0,ringT=0,dryT=0,pudN=0;
const maxPud=()=>innerWidth<720?4:7;
const pd=()=>box.querySelector(".xp-pd"),rg=()=>box.querySelector(".xp-rg");
function el(tag,cls,at){const e=document.createElementNS(NS,tag);if(cls)e.setAttribute("class",cls);for(const k in at)e.setAttribute(k,at[k]);return e;}
function addPuddle(){
  const g=pd();if(!g||g.childNodes.length>=maxPud()||RM())return;
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
function build(){
  if(!isXP()||box.querySelector(".xp-grass"))return;
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("class","xp-grass bot");s.setAttribute("viewBox","0 0 64 40");s.setAttribute("shape-rendering","geometricPrecision");s.setAttribute("aria-hidden","true");
  s.innerHTML=grassMarkup();box.appendChild(s);
  box.classList.toggle("xp-wet",wet);
  if(wet){puddleLoop();ringLoop();}
}
addEventListener("kixki-bg",()=>{if(!isXP()){clearTimeout(pudT);clearTimeout(ringT);}else{build();if(wet){puddleLoop();ringLoop();}}});
addEventListener("kixki-rain",e=>{const t=e.detail&&e.detail.t;if(t==="start")wetSet(1);else if(t==="stop")wetSet(0);});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&wet){puddleLoop();ringLoop();}});
window.KXPAS={wet:wetSet,hillY,puddles:()=>pd()?pd().childNodes.length:0,
  rebuild(){const o=box.querySelector(".xp-grass");if(o)o.remove();build();}};
/* si ya estaba lloviendo cuando carga la página */
if(window.KXRAIN&&KXRAIN.raining)wet=false,wetSet(1);
build();
})();
