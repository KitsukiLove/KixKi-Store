/* Fondos intercambiables en pixel art: Clásico, Valle, Halloween y Navidad.
   Cada uno cambia de colores solo según el tema día/noche. */
(function(){
const root=document.documentElement,box=document.getElementById("bgx"),KEYS=["","valle","halloween","navidad"],NAMES=["Clásico","Valle","Halloween","Navidad"];
let i=0;try{i=Math.max(0,KEYS.indexOf(JSON.parse(localStorage.getItem("kixki-bg"))||""));}catch(e){}
const R=(x,y,w,h,c)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const hill=(y,a,p,ph,c)=>{let s="";for(let x=0;x<64;x++)s+=R(x,Math.round(y+a*Math.sin(x/p+ph)),1,40,c);return s;};
const disc=(cx,cy,r,c)=>{let s="";for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));s+=R(cx-w,cy+y,2*w+1,1,c);}return s;};
const cloud=(x,y)=>R(x,y+1,7,2,"c")+R(x+1,y,4,1,"c")+R(x+3,y-1,2,1,"c");
const pine=(x,y,h)=>{let s=R(x,y+h,1,2,"t");for(let j=0;j<h;j++){const k=(j/2)|0;s+=R(x-k,y+j,1+2*k,1,"p");}return s+R(x,y+3,1,1,"o")+R(x-1,y+7,1,1,"o")+R(x+1,y+6,1,1,"o");};
const pump=(x,y)=>R(x,y+1,5,3,"o")+R(x+1,y,3,1,"o")+R(x+2,y-1,1,1,"t")+R(x+1,y+2,1,1,"k")+R(x+3,y+2,1,1,"k");
const bat=(x,y)=>R(x,y,1,1,"k")+R(x+4,y,1,1,"k")+R(x+2,y,1,1,"k")+R(x+1,y+1,3,1,"k");
const dead=(x,y)=>R(x,y,2,14,"k")+R(x-4,y+3,4,1,"k")+R(x-4,y+1,1,3,"k")+R(x+2,y+5,5,1,"k")+R(x+6,y+2,1,4,"k");
const ST=[[4,3],[12,8],[20,2],[27,10],[35,4],[44,9],[52,3],[58,11],[8,14],[40,15],[61,6],[31,16]].map(([x,y])=>R(x,y,1,1,"st")).join("");
const SC={
 valle:{top:ST+disc(33,7,4,"a")+cloud(6,5)+cloud(20,12)+cloud(44,3),bot:hill(20,2.5,7,0,"g1")+hill(26,2,5,2,"g2")+hill(32,1.5,9,4,"g3")+[[6,34],[13,36],[22,35],[30,37],[41,34],[50,36],[58,35]].map(([x,y])=>R(x,y,1,1,"o")).join("")},
 halloween:{top:ST+disc(18,9,6,"a")+bat(26,5)+bat(33,12)+bat(40,6),bot:hill(24,2,8,1,"g1")+hill(29,1.5,6,3,"g2")+hill(34,1,10,0,"g3")+dead(32,12)+pump(8,31)+pump(15,33)+pump(24,34)+pump(38,32)},
 navidad:{top:ST+disc(18,7,3,"a"),bot:hill(26,2,9,0,"g1")+pine(8,18,9)+pine(17,20,8)+pine(29,15,12)+pine(39,21,7)+hill(31,1.5,6,2,"g2")+hill(35,1,8,4,"g3")}
};
/* Colores: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
const P={
 valle:[["#5db7f5","#7ccaf9","#a3dcfb","#cdeefe","#8bdc72","#5cc25f","#3ea24d","#ffe27a","#7a4a2a","#ff9fd0","#ffffff","#2f8f5b","#2a1650"],["#070d2e","#0e1a4d","#1a2d6d","#2b4690","#245a4a","#1b4a3b","#133a2e","#fff3c4","#3b2a22","#ffd36e","#6f86c8","#1f6b45","#070d2e"]],
 halloween:[["#6b2d8f","#a8408f","#ee7a4a","#ffb35c","#4a2466","#35194d","#231235","#ffd36e","#1b0f2e","#ff8a1e","#e9a6c8","#1b0f2e","#1b0f2e"],["#0c0620","#190b3d","#2b1259","#46207a","#2a1648","#1c0f33","#120a24","#ffb347","#07030f","#ff8a1e","#5a3a8a","#07030f","#07030f"]],
 navidad:[["#8cc6f0","#acd8f6","#cbe7fa","#e8f5ff","#ffffff","#e9f2ff","#d3e4fa","#fff3b0","#6b4226","#e8394d","#ffffff","#2f8f5b","#2a1650"],["#070b2a","#0f1b4a","#1b2f6b","#2d4a8f","#cfe0ff","#a9c2ee","#8aa6d8","#fff7d0","#4a2d1a","#ffd36e","#8aa6d8","#1f6b45","#070b2a"]]
};
let built="";
function apply(){
  const k=KEYS[i];
  if(!k){root.removeAttribute("data-bg");box.innerHTML="";built="";return;}
  root.setAttribute("data-bg",k);
  const n=root.getAttribute("data-theme")==="dark"?1:0;
  "s1 s2 s3 s4 g1 g2 g3 a t o c p k".split(" ").forEach((v,j)=>box.style.setProperty("--"+v,P[k][n][j]));
  box.style.setProperty("--so",n||k==="halloween"?1:0);box.style.setProperty("--co",k==="valle"?(n?.45:1):0);
  if(built!==k){built=k;
    box.innerHTML=`<svg class="top" viewBox="0 0 64 24" shape-rendering="crispEdges" aria-hidden="true">${SC[k].top}</svg><svg class="bot" viewBox="0 0 64 40" shape-rendering="crispEdges" aria-hidden="true">${SC[k].bot}</svg>`+(k==="navidad"?Array.from({length:26},(_,j)=>`<i class="snow" style="left:${(j*37+9)%100}%;--d:${9+(j*5)%8}s;--dl:-${(j*3)%9}s;--z:${2+(j%3)}px"></i>`).join(""):"");}
}
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:["data-theme"]});
window.KXB={label:()=>NAMES[i],next(){i=(i+1)%KEYS.length;try{localStorage.setItem("kixki-bg",JSON.stringify(KEYS[i]));}catch(e){}apply();}};
apply();
})();
