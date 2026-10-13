/* Fondos intercambiables en pixel art: Clásico, Valle, Halloween y Navidad.
   El dibujo se calcula según el tamaño de la pantalla: en móvil los pixeles son pequeños y en un monitor
   grande hay más colinas, nubes y árboles (en vez de ampliar el mismo dibujo). Cada fondo cambia de colores
   solo según el tema día/noche. */
(function(){
const root=document.documentElement,box=document.getElementById("bgx"),KEYS=["","valle","halloween","navidad"],NAMES=["Clásico","Valle","Halloween","Navidad"];
let i=0;try{i=Math.max(0,KEYS.indexOf(JSON.parse(localStorage.getItem("kixki-bg"))||""));}catch(e){}
const R=(x,y,w,h,c)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const rng=s=>()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);
const disc=(cx,cy,r,c)=>{let s="";for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));s+=R(cx-w,cy+y,2*w+1,1,c);}return s;};
const cloud=(x,y)=>R(x,y+1,7,2,"c")+R(x+1,y,4,1,"c")+R(x+3,y-1,2,1,"c");
const pine=(x,y,h)=>{let s=R(x,y+h,1,2,"t");for(let j=0;j<h;j++){const k=(j/2)|0;s+=R(x-k,y+j,1+2*k,1,"p");}return s+R(x,y+3,1,1,"o")+R(x-1,y+7,1,1,"o")+R(x+1,y+6,1,1,"o");};
const pump=(x,y)=>R(x,y+1,5,3,"o")+R(x+1,y,3,1,"o")+R(x+2,y-1,1,1,"t")+R(x+1,y+2,1,1,"k")+R(x+3,y+2,1,1,"k");
const bat=(x,y)=>R(x,y,1,1,"k")+R(x+4,y,1,1,"k")+R(x+2,y,1,1,"k")+R(x+1,y+1,3,1,"k");
const dead=(x,y)=>R(x,y,2,14,"k")+R(x-4,y+3,4,1,"k")+R(x-4,y+1,1,3,"k")+R(x+2,y+5,5,1,"k")+R(x+6,y+2,1,4,"k");
/* colinas: devuelven la altura de cada columna, así se pueden poner objetos encima */
const hillF=(Hb,f,a,p,ph)=>x=>Math.round(Hb*f+a*Math.sin(x/p+ph));
const hill=(W,Hb,fn,c)=>{let s="";for(let x=0;x<W;x++){const y=fn(x);s+=R(x,y,1,Hb-y+1,c);}return s;};
const stars=(W,Ht)=>{const r=rng(7),n=Math.round(W*Ht/60);let s="";for(let j=0;j<n;j++)s+=R(Math.floor(r()*W),Math.floor(r()*Ht*.85),1,1,"st");return s;};
const clouds=(W,Ht)=>{const r=rng(11),n=Math.max(3,Math.round(W/18));let s="";for(let j=0;j<n;j++)s+=cloud(Math.round((j+.2+r()*.6)*W/n),Math.round(3+r()*Ht*.5));return s;};
const bats=(W,Ht)=>{const r=rng(5),n=Math.max(3,Math.round(W/16));let s="";for(let j=0;j<n;j++)s+=bat(Math.round((j+.3+r()*.4)*W/n),Math.round(3+r()*Ht*.45));return s;};
const SC={
 valle(W,Ht,Hb){const r=rng(3),f1=hillF(Hb,.5,Hb*.06,7,0),f2=hillF(Hb,.66,Hb*.05,5,2),f3=hillF(Hb,.8,Hb*.04,9,4);
  let fl="";for(let j=0,n=Math.round(W*Hb/140);j<n;j++){const x=Math.floor(r()*W),y0=f3(x)+1;fl+=R(x,Math.min(Hb-1,y0+Math.floor(r()*(Hb-y0))),1,1,"o");}
  return{top:stars(W,Ht)+disc(Math.round(W*.5),Math.round(Ht*.3),4,"a")+clouds(W,Ht),bot:hill(W,Hb,f1,"g1")+hill(W,Hb,f2,"g2")+hill(W,Hb,f3,"g3")+fl};},
 halloween(W,Ht,Hb){const r=rng(9),f1=hillF(Hb,.55,Hb*.05,8,1),f2=hillF(Hb,.68,Hb*.04,6,3),f3=hillF(Hb,.8,Hb*.03,10,0);
  let pk="";for(let j=0,n=Math.max(4,Math.round(W/13));j<n;j++){const x=Math.floor((j+.2+r()*.6)*W/n);pk+=pump(x,f3(x)-2);}
  const dx=Math.round(W*.5);
  return{top:stars(W,Ht)+disc(Math.round(W*.26),Math.round(Ht*.42),6,"a")+bats(W,Ht),bot:hill(W,Hb,f1,"g1")+hill(W,Hb,f2,"g2")+hill(W,Hb,f3,"g3")+dead(dx,f1(dx)-13)+pk};},
 navidad(W,Ht,Hb){const r=rng(13),f1=hillF(Hb,.45,Hb*.05,9,0),f2=hillF(Hb,.62,Hb*.04,6,2),f3=hillF(Hb,.78,Hb*.03,8,4);
  let pn="";for(let x=5;x<W;x+=9+Math.floor(r()*6)){const h=7+Math.floor(r()*6);pn+=pine(x,f1(x)+1-h,h);}
  return{top:stars(W,Ht)+disc(Math.round(W*.26),Math.round(Ht*.3),3,"a"),bot:hill(W,Hb,f1,"g1")+pn+hill(W,Hb,f2,"g2")+hill(W,Hb,f3,"g3")};}
};
/* Colores: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
const P={
 valle:[["#5db7f5","#7ccaf9","#a3dcfb","#cdeefe","#8bdc72","#5cc25f","#3ea24d","#ffe27a","#7a4a2a","#ff9fd0","#ffffff","#2f8f5b","#2a1650"],["#070d2e","#0e1a4d","#1a2d6d","#2b4690","#245a4a","#1b4a3b","#133a2e","#fff3c4","#3b2a22","#ffd36e","#6f86c8","#1f6b45","#070d2e"]],
 halloween:[["#6b2d8f","#a8408f","#ee7a4a","#ffb35c","#4a2466","#35194d","#231235","#ffd36e","#1b0f2e","#ff8a1e","#e9a6c8","#1b0f2e","#1b0f2e"],["#0c0620","#190b3d","#2b1259","#46207a","#2a1648","#1c0f33","#120a24","#ffb347","#07030f","#ff8a1e","#5a3a8a","#07030f","#07030f"]],
 navidad:[["#8cc6f0","#acd8f6","#cbe7fa","#e8f5ff","#ffffff","#e9f2ff","#d3e4fa","#fff3b0","#6b4226","#e8394d","#ffffff","#2f8f5b","#2a1650"],["#070b2a","#0f1b4a","#1b2f6b","#2d4a8f","#cfe0ff","#a9c2ee","#8aa6d8","#fff7d0","#4a2d1a","#ffd36e","#8aa6d8","#1f6b45","#070b2a"]]
};
/* tamaño del pixel según la pantalla: ~8px en móvil, hasta 18px en monitores grandes */
function grid(){const w=innerWidth,h=innerHeight,u=Math.max(7,Math.min(18,Math.round(w/(w<700?48:110))));
  return{u,W:Math.ceil(w/u)+1,Ht:Math.ceil(h/u*.55),Hb:Math.min(60,Math.ceil(h/u*.5)),h};}
let built="",G=null;
function apply(){
  const k=KEYS[i];
  if(!k){root.removeAttribute("data-bg");box.innerHTML="";built="";return;}
  root.setAttribute("data-bg",k);
  const n=root.getAttribute("data-theme")==="dark"?1:0;
  "s1 s2 s3 s4 g1 g2 g3 a t o c p k".split(" ").forEach((v,j)=>box.style.setProperty("--"+v,P[k][n][j]));
  box.style.setProperty("--so",n||k==="halloween"?1:0);box.style.setProperty("--co",k==="valle"?(n?.45:1):0);
  const g=grid();
  /* en el móvil la barra del navegador cambia la altura sin parar: solo se redibuja si cambia de verdad */
  if(built===k&&G&&G.u===g.u&&G.W===g.W&&Math.abs(G.h-g.h)/G.h<.15)return;
  built=k;G=g;const{u,W,Ht,Hb}=g,s=SC[k](W,Ht,Hb);
  box.innerHTML=`<svg class="top" width="${W*u}" height="${Ht*u}" viewBox="0 0 ${W} ${Ht}" shape-rendering="crispEdges" aria-hidden="true">${s.top}</svg><svg class="bot" width="${W*u}" height="${Hb*u}" viewBox="0 0 ${W} ${Hb}" shape-rendering="crispEdges" aria-hidden="true">${s.bot}</svg>`+
   (k==="navidad"?Array.from({length:Math.max(18,Math.round(W/3))},(_,j)=>`<i class="snow" style="left:${(j*37+9)%100}%;--d:${9+(j*5)%8}s;--dl:-${(j*3)%9}s;--z:${Math.max(2,Math.round(u*(.22+.1*(j%3))))}px"></i>`).join(""):"");
}
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:["data-theme"]});
let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(apply,200);});
window.KXB={label:()=>NAMES[i],next(){i=(i+1)%KEYS.length;try{localStorage.setItem("kixki-bg",JSON.stringify(KEYS[i]));}catch(e){}apply();}};
apply();
})();
