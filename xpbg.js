/* Colina XP (parte 7): pasto con viento, nubes a la deriva y lluvia que interactúa con el fondo.
   Vectores propios, sin recursos externos. API: window.KXG { wet(v), rebuild() } */
(function(){
"use strict";
const root=document.documentElement,box=document.getElementById("bgx");
if(!box)return;
const rnd=(a,b)=>a+Math.random()*(b-a),NS="http://www.w3.org/2000/svg";
const RM=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
/* crestas de las dos colinas (mismo viewBox 64x40 que .bot de scenes.js) */
const CR=[[0,17,14,7,40,6,64,13],[0,31,20,24.5,44,26.5,64,33]];
const bez=(c,t)=>{const u=1-t;return[u*u*u*c[0]+3*u*u*t*c[2]+3*u*t*t*c[4]+t*t*t*c[6],u*u*u*c[1]+3*u*u*t*c[3]+3*u*t*t*c[5]+t*t*t*c[7]];};
const blade=(x,y,h,l,w)=>`M${x-w} ${y}Q${x-w*.2} ${y-h*.55} ${x+l} ${y-h}Q${x+w*.6} ${y-h*.5} ${x+w} ${y}Z`;
function tuft(x,y,sz,cl){
  let d="";for(let i=0;i<3;i++)d+=blade(+(x+(i-1)*.22).toFixed(2),+y.toFixed(2),+(sz*rnd(.7,1.15)).toFixed(2),+rnd(-.35,.35).toFixed(2),.13);
  return `<g class="gt" style="--x:${x.toFixed(1)}"><path class="gb ${cl}" style="--r:${Math.random().toFixed(2)}" d="${d}"/></g>`;
}
function grass(){
  let s='<g class="xp-pd"><ellipse cx="14" cy="35" rx="4" ry=".7"/><ellipse cx="40" cy="36.6" rx="5" ry=".8"/><ellipse cx="55" cy="34" rx="3" ry=".6"/></g>';
  for(let i=0;i<46;i++){const p=bez(CR[0],(i+Math.random())/46);s+=tuft(p[0],p[1]+.25,rnd(1,1.9),i%3?"l1":"l2");}
  for(let i=0;i<64;i++){const p=bez(CR[1],(i+Math.random())/64);s+=tuft(p[0],p[1]+.3,rnd(1.3,2.5),i%3?"l2":"l1");}
  for(let i=0;i<40;i++){const p=bez(CR[1],Math.random());s+=tuft(p[0],p[1]+rnd(1.5,6.5),rnd(1.5,2.8),Math.random()<.5?"l2":"l1");}
  return s+'<g class="xp-rg"></g>';
}
let wet=false;
function wetSet(v){wet=!!v;box.classList.toggle("xp-wet",wet);}
function build(){
  if(root.getAttribute("data-bg")!=="xp"||box.querySelector(".xp-grass"))return;
  box.insertAdjacentHTML("beforeend",`<svg class="xp-grass bot" viewBox="0 0 64 40" shape-rendering="geometricPrecision" aria-hidden="true">${grass()}</svg>`);
  wetSet(!!(window.KXRAIN&&KXRAIN.raining));
}
addEventListener("kixki-bg",build);
addEventListener("kixki-rain",e=>{const t=e.detail&&e.detail.t;if(t==="start")wetSet(1);else if(t==="stop")wetSet(0);});
/* ondas de lluvia sobre la colina (solo mientras llueve) */
setInterval(()=>{
  if(!wet||document.hidden||RM()||box.classList.contains("kv-pause"))return;
  const g=box.querySelector(".xp-rg");if(!g||g.childNodes.length>16)return;
  const k=window.KXRAIN?Math.max(.3,KXRAIN.intensity):1,n=Math.random()<k?(k>.7&&Math.random()<.5?2:1):0;
  for(let i=0;i<n;i++){const e=document.createElementNS(NS,"ellipse");
    e.setAttribute("class","xp-r");e.setAttribute("cx",rnd(1,63).toFixed(1));e.setAttribute("cy",rnd(27.5,38.5).toFixed(1));
    e.setAttribute("rx",".9");e.setAttribute("ry",".3");e.addEventListener("animationend",()=>e.remove());g.append(e);}
},240);
window.KXG={wet:wetSet,rebuild(){const o=box.querySelector(".xp-grass");if(o)o.remove();build();}};
build();
})();
