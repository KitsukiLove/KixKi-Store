try{if(localStorage.getItem("kixki-view")==="pc")document.querySelector("meta[name=viewport]").content="width=1100, viewport-fit=cover";}catch(e){}
/* Fondos intercambiables en pixel art: Clásico, Valle, Halloween y Navidad.
   Cada uno cambia de colores solo según el tema día/noche. */
(function(){
const root=document.documentElement,box=document.getElementById("bgx"),KEYS=["","valle","primavera","verano","otono","invierno","halloween","navidad","xp","auto","vacas"],NAMES=["Clásico","Valle","Primavera","Verano","Otoño","Invierno","Halloween","Navidad","Colina XP","Auto (temporada)","¡Vacas!"];
/* (parte 6) dos fondos especiales que no salen en el ciclo hasta ganarlos: «xp» (premio por vencer a vaca.exe) y «vacas» (castigo si pierdes).
   Memoria propia «kixki-bgx»: xp = premio ganado · cursed = el castigo está puesto · prev = el fondo que tenías antes del castigo */
let X={xp:0,cursed:0,prev:"",pause:0};try{X=Object.assign(X,JSON.parse(localStorage.getItem("kixki-bgx")||"{}")||{});}catch(e){}
const saveX=()=>{try{localStorage.setItem("kixki-bgx",JSON.stringify(X));}catch(e){}};
const okKey=k=>k==="vacas"?!!X.cursed:k==="xp"?!!X.xp:true;
const persist=()=>{try{localStorage.setItem("kixki-bg",JSON.stringify(KEYS[i]));}catch(e){}};
let i=0;try{i=Math.max(0,KEYS.indexOf(JSON.parse(localStorage.getItem("kixki-bg"))||""));}catch(e){}
if(!okKey(KEYS[i]))i=0;
const R=(x,y,w,h,c)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const hill=(y,a,p,ph,c)=>{let s="";for(let x=0;x<64;x++)s+=R(x,Math.round(y+a*Math.sin(x/p+ph)),1,40,c);return s;};
const disc=(cx,cy,r,c)=>{let s="";for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));s+=R(cx-w,cy+y,2*w+1,1,c);}return s;};
const cloud=(x,y)=>R(x,y+1,7,2,"c")+R(x+1,y,4,1,"c")+R(x+3,y-1,2,1,"c");
const pine=(x,y,h)=>{let s=R(x,y+h,1,2,"t");for(let j=0;j<h;j++){const k=(j/2)|0;s+=R(x-k,y+j,1+2*k,1,"p");}return s+R(x,y+3,1,1,"o")+R(x-1,y+7,1,1,"o")+R(x+1,y+6,1,1,"o");};
const pump=(x,y)=>R(x,y+1,5,3,"o")+R(x+1,y,3,1,"o")+R(x+2,y-1,1,1,"t")+R(x+1,y+2,1,1,"k")+R(x+3,y+2,1,1,"k");
const bat=(x,y)=>R(x,y,1,1,"k")+R(x+4,y,1,1,"k")+R(x+2,y,1,1,"k")+R(x+1,y+1,3,1,"k");
const dead=(x,y)=>R(x,y,2,14,"k")+R(x-4,y+3,4,1,"k")+R(x-4,y+1,1,3,"k")+R(x+2,y+5,5,1,"k")+R(x+6,y+2,1,4,"k");
const tree=(x,y,r,c)=>R(x,y+r,1,6,"t")+disc(x,y,r,c);
const flower=(x,y,c)=>R(x,y,1,1,c)+R(x,y+1,1,1,"p");
const sunf=(x,y)=>R(x-1,y,3,3,"o")+R(x,y+1,1,1,"t")+R(x,y+3,1,4,"p");
const ST=[[4,3],[12,8],[20,2],[27,10],[35,4],[44,9],[52,3],[58,11],[8,14],[40,15],[61,6],[31,16]].map(([x,y])=>R(x,y,1,1,"st")).join("");
const SC={
 valle:{top:ST+disc(33,7,4,"a")+cloud(6,5)+cloud(20,12)+cloud(44,3),bot:hill(20,2.5,7,0,"g1")+hill(26,2,5,2,"g2")+hill(32,1.5,9,4,"g3")+[[6,34],[13,36],[22,35],[30,37],[41,34],[50,36],[58,35]].map(([x,y])=>R(x,y,1,1,"o")).join("")},
 halloween:{top:ST+disc(18,9,6,"a")+bat(26,5)+bat(33,12)+bat(40,6),bot:hill(24,2,8,1,"g1")+hill(29,1.5,6,3,"g2")+hill(34,1,10,0,"g3")+dead(32,12)+pump(8,31)+pump(15,33)+pump(24,34)+pump(38,32)},
 navidad:{top:ST+disc(18,7,3,"a"),bot:hill(26,2,9,0,"g1")+pine(8,18,9)+pine(17,20,8)+pine(29,15,12)+pine(39,21,7)+hill(31,1.5,6,2,"g2")+hill(35,1,8,4,"g3")},
 primavera:{top:ST+disc(50,7,4,"a")+cloud(8,6)+cloud(26,12)+cloud(36,3),bot:hill(22,2,7,1,"g1")+tree(14,14,4,"o")+tree(47,16,3,"o")+hill(28,1.5,5,0,"g2")+hill(33,1.5,9,3,"g3")+[[6,34,"o"],[12,31,"a"],[20,35,"o"],[27,33,"a"],[36,32,"o"],[44,34,"a"],[52,31,"o"],[58,35,"a"]].map(([x,y,c])=>flower(x,y,c)).join("")},
 verano:{top:ST+disc(14,8,6,"a")+cloud(38,5)+cloud(50,13),bot:hill(21,2,8,2,"g1")+hill(27,2,6,0,"g2")+hill(33,1.5,10,3,"g3")+[[7,29],[19,31],[33,28],[47,30],[58,32]].map(([x,y])=>sunf(x,y)).join("")},
 otono:{top:ST+disc(48,8,4,"a")+cloud(8,6)+cloud(26,12),bot:hill(24,2,8,1,"g1")+tree(12,15,5,"p")+tree(30,18,4,"o")+tree(52,14,5,"p")+hill(30,1.5,6,3,"g2")+hill(35,1,8,0,"g3")+[[6,36],[20,34],[40,36],[58,34]].map(([x,y])=>R(x,y,2,1,"o")).join("")},
 invierno:{top:ST+disc(48,7,3,"a")+cloud(10,6)+cloud(30,12),bot:hill(24,2,8,1,"g1")+dead(10,16)+dead(46,18)+pine(28,19,7)+hill(30,1.5,6,2,"g2")+hill(35,1,8,4,"g3")},
 /* «Colina XP»: cielo azul, nubes blandas y una colina verde grande. Dibujo propio en vectores (no es la imagen de Microsoft). */
 xp:{smooth:1,
  top:ST+`<g class="c"><circle cx="12" cy="15" r="3.6"/><circle cx="17" cy="13" r="4.6"/><circle cx="23" cy="15" r="3.8"/><rect x="9" y="15" width="17" height="3.6" rx="1.8"/></g>`
      +`<g class="c"><circle cx="40" cy="8" r="2.6"/><circle cx="44" cy="6.6" r="3.4"/><circle cx="49" cy="8.2" r="2.8"/><rect x="37.6" y="8.2" width="14" height="2.6" rx="1.3"/></g>`
      +`<g class="c"><circle cx="54" cy="18" r="2.4"/><circle cx="58" cy="16.6" r="3.2"/><circle cx="62" cy="18.2" r="2.6"/><rect x="51.6" y="18.2" width="13" height="2.4" rx="1.2"/></g>`,
  bot:`<path class="g2" d="M0 17C14 7 40 6 64 13V40H0Z"/><path class="g1" d="M0 17C14 7 40 6 64 13L64 17C40 10.5 15 11 0 21Z"/><path class="g3" d="M0 31C20 24.5 44 26.5 64 33V40H0Z"/>`}
};
/* Colores: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
const P={
 valle:[["#5db7f5","#7ccaf9","#a3dcfb","#cdeefe","#8bdc72","#5cc25f","#3ea24d","#ffe27a","#7a4a2a","#ff9fd0","#ffffff","#2f8f5b","#2a1650"],["#070d2e","#0e1a4d","#1a2d6d","#2b4690","#245a4a","#1b4a3b","#133a2e","#fff3c4","#3b2a22","#ffd36e","#6f86c8","#1f6b45","#070d2e"]],
 halloween:[["#6b2d8f","#a8408f","#ee7a4a","#ffb35c","#4a2466","#35194d","#231235","#ffd36e","#1b0f2e","#ff8a1e","#e9a6c8","#1b0f2e","#1b0f2e"],["#0c0620","#190b3d","#2b1259","#46207a","#2a1648","#1c0f33","#120a24","#ffb347","#07030f","#ff8a1e","#5a3a8a","#07030f","#07030f"]],
 navidad:[["#8cc6f0","#acd8f6","#cbe7fa","#e8f5ff","#ffffff","#e9f2ff","#d3e4fa","#fff3b0","#6b4226","#e8394d","#ffffff","#2f8f5b","#2a1650"],["#070b2a","#0f1b4a","#1b2f6b","#2d4a8f","#cfe0ff","#a9c2ee","#8aa6d8","#fff7d0","#4a2d1a","#ffd36e","#8aa6d8","#1f6b45","#070b2a"]],
 primavera:[["#8fd3f7","#b2e3fa","#d6f1fd","#f1fbff","#a5e682","#7fd16a","#5bb857","#fff09a","#7a4a2a","#ff8fc7","#ffffff","#3fa05a","#2f6f46"],["#0b1238","#142257","#233a7a","#36508f","#2f6a55","#245a47","#1a4a3a","#f4f1d0","#3b2a22","#ff9fd0","#6f86c8","#26734b","#0b1238"]],
 verano:[["#3fa8f0","#69bff6","#98d5fb","#c9ebfd","#b8e05a","#8fcf4a","#6db83d","#ffd23a","#7a4a2a","#ffc21a","#ffffff","#3d9b3d","#2a6a2a"],["#060a26","#0d1744","#1a2d6d","#2e4c94","#3d6a3a","#2f5a2f","#234a26","#fff3c4","#3b2a22","#ffe27a","#5a74b8","#2b6b30","#060a26"]],
 otono:[["#e9a35c","#f2bf7c","#f8d9a3","#fdeccb","#d29a3c","#b9772c","#9a5a24","#ffe08a","#5a3a22","#e8742c","#fff1d6","#d9601f","#4a2a15"],["#1a0f2e","#2b1a3f","#45274a","#63364f","#4a3220","#3a2819","#2a1c12","#ffd9a0","#2e1d12","#e8742c","#7a5a8a","#a8461a","#10081a"]],
 xp:[["#2b6ad6","#4b8fe6","#7db5f0","#c5e3f7","#8be04a","#4cab25","#2f8a1a","#ffffff","#7a4a2a","#ffffff","#ffffff","#2f8f5b","#2a1650"],["#060d2e","#0e1d52","#1a3a82","#2c5aa8","#2d6a2f","#1f4f26","#153b1d","#fff3c4","#3b2a22","#fff3c4","#8aa2d8","#1f6b45","#070d2e"]],
 vacas:[["#ffd9ee","#ffcbe6","#ffbde0","#ffb0da","#ffffff","#ffffff","#ffffff","#ffffff","#2a1650","#2a1650","#ffffff","#2a1650","#2a1650"],["#e7a3d6","#e39ad2","#de90cd","#d986c8","#ffffff","#ffffff","#ffffff","#ffffff","#2a1650","#2a1650","#ffffff","#2a1650","#2a1650"]],
 invierno:[["#a9c8e8","#c3daf0","#dcebf8","#f1f7fd","#ffffff","#eaf2fc","#d6e5f6","#fff8d0","#5a4636","#a9c2ee","#c9d9ee","#2f7f5b","#4a3a30"],["#060a22","#0e1a46","#1c3068","#2f4c8e","#cfe0ff","#aac2ee","#88a4d8","#f4f6ff","#2e2a2a","#8aa6d8","#8aa6d8","#1f5f45","#1a1622"]]
};
/* Temporada según la fecha (hemisferio norte) y horas de luz aproximadas de cada una */
const seasonKey=d=>{const m=d.getMonth()+1,y=d.getDate(),v=m*100+y;
  if((m===10&&y>=10)||(m===11&&y<=2))return"halloween";
  if(m===12||(m===1&&y<=6))return"navidad";
  return v<320?"invierno":v<621?"primavera":v<922?"verano":"otono";};
const SUN={invierno:[8,18],navidad:[8,18],otono:[7,19],halloween:[7,18],primavera:[7,20],verano:[6,21]};
const nightNow=()=>{const d=new Date(),h=d.getHours(),r=SUN[seasonKey(d)];return h<r[0]||h>=r[1];};
const PT={navidad:[26,"",0],invierno:[40,"",0],otono:[16,"var(--o)",1],primavera:[12,"var(--o)",1]};
let lastN=null;
/* En modo Auto el día/noche sigue la hora local; si lo cambias a mano, se respeta hasta el siguiente cambio de hora */
function autoSync(){if(KEYS[i]!=="auto")return;const n=nightNow();if(n===lastN)return;lastN=n;
  const t=n?"dark":"light";if(root.getAttribute("data-theme")!==t){root.setAttribute("data-theme",t);const m=document.getElementById("tc");if(m)m.setAttribute("content",n?"#150c33":"#efe6ff");}}
let built="";
function apply(){
  let k=KEYS[i];
  if(k==="auto"){autoSync();k=seasonKey(new Date());}
  if(!k){root.removeAttribute("data-bg");box.innerHTML="";built="";dispatchEvent(new Event("kixki-bg"));return;}
  root.setAttribute("data-bg",k);
  const n=root.getAttribute("data-theme")==="dark"?1:0;
  "s1 s2 s3 s4 g1 g2 g3 a t o c p k".split(" ").forEach((v,j)=>box.style.setProperty("--"+v,P[k][n][j]));
  box.style.setProperty("--so",n||k==="halloween"?1:0);box.style.setProperty("--co",k==="halloween"||k==="navidad"?0:(n?.45:1));
  box.classList.toggle("kv-pause",!!X.pause);
  if(k==="vacas"){if(built!==k){built=k;box.innerHTML='<i class="kv-mos a"></i><i class="kv-mos b"></i>';}dispatchEvent(new Event("kixki-bg"));return;}
  if(built!==k){built=k;const sr=SC[k].smooth?"geometricPrecision":"crispEdges";
    box.innerHTML=`<svg class="top" viewBox="0 0 64 24" shape-rendering="${sr}" aria-hidden="true">${SC[k].top}</svg><svg class="bot" viewBox="0 0 64 40" shape-rendering="${sr}" aria-hidden="true">${SC[k].bot}</svg>`+(PT[k]?Array.from({length:PT[k][0]},(_,j)=>`<i class="snow" style="left:${(j*37+9)%100}%;--d:${9+(j*5)%8}s;--dl:-${(j*3)%9}s;--z:${(PT[k][2]?3:2)+(j%3)}px${PT[k][2]?";background:"+PT[k][1]:""}"></i>`).join(""):"");}
  dispatchEvent(new Event("kixki-bg"));
}
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:["data-theme"]});
function restore(){X.cursed=0;const p=KEYS.indexOf(X.prev);i=p>=0&&okKey(X.prev)&&X.prev!=="vacas"?p:0;X.prev="";saveX();lastN=null;persist();apply();}
window.KXB={label:()=>NAMES[i],
  /* desde «¡Vacas!» el botón de fondos te devuelve el que tenías; si no, pasa al siguiente que tengas disponible (los candados se saltan) */
  next(){if(KEYS[i]==="vacas"){restore();return;}
    do{i=(i+1)%KEYS.length;}while(KEYS[i]==="vacas"||!okKey(KEYS[i]));
    lastN=null;persist();apply();},
  /* (parte 6) usados por vacaboss.js */
  has:k=>okKey(k),cursed:()=>!!X.cursed&&KEYS[i]==="vacas",paused:()=>!!X.pause,
  unlockXP(){X.xp=1;saveX();},
  use(k){const j=KEYS.indexOf(k);if(j<0||!okKey(k)||k==="vacas")return false;if(KEYS[i]==="vacas"){X.cursed=0;X.prev="";saveX();}i=j;lastN=null;persist();apply();return true;},
  curse(){if(KEYS[i]!=="vacas")X.prev=KEYS[i];X.cursed=1;saveX();i=KEYS.indexOf("vacas");lastN=null;persist();apply();},
  restore,
  pause(v){X.pause=v==null?(X.pause?0:1):(v?1:0);saveX();box.classList.toggle("kv-pause",!!X.pause);return !!X.pause;}};
apply();
/* Cada minuto: cambio día/noche y de temporada en modo Auto, sin tocar nada más */
const auto=()=>{if(KEYS[i]==="auto"&&!document.hidden){autoSync();if(seasonKey(new Date())!==built)apply();}};
setInterval(auto,60000);document.addEventListener("visibilitychange",auto);
})();
