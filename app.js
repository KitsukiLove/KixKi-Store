(async function(){
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const nrm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const getJ=async u=>{try{const r=await fetch(u);return r.ok?await r.json():null;}catch(e){return null;}};
const D=await getJ("apps.json");
if(!D){document.getElementById("app").innerHTML='<p class="empty">No se pudo cargar el catálogo. Revisa tu conexión y recarga.</p>';return;}
const M=Object.assign({logos:{},repos:{}},await getJ("data/meta.json"));
const C=D.categories.map(c=>({id:c.id,e:c.e,t:c.t,s:c.s,a:c.apps.map(a=>[a.name,a.tag,a.desc,a.links,a.tip||"",a.logo||null])}));


/* Nombre corto y color de cada categoría */
const META={
  tiendas:["Tiendas","#8b6cf0"],
  importante:["Importante","#f5a524"],
  utilidad:["Utilidad","#3aa6e8"],
  decoracion:["Decoración","#f06aa8"],
  musica:["Música","#36c08e"],
  teclados:["Teclados","#7c8cf5"]
};

/* ========= LOGOS =========
   Para apps de GitHub se prueba primero el ícono oficial del repositorio (fastlane)
   y después la imagen de perfil del autor. Si nada carga, se muestra la inicial. */
function logos(a){
  if(M.logos[slug(a[0])])return [M.logos[slug(a[0])]];
  if(a[5])return a[5];
  for(const l of a[3]){
    const m=l[1].match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/)||l[1].match(/[?&]repo=([^\/&]+)\/([^&]+)/);
    if(m){
      const o=m[1],r=m[2];
      return [
        `https://raw.githubusercontent.com/${o}/${r}/HEAD/fastlane/metadata/android/en-US/images/icon.png`,
        `https://raw.githubusercontent.com/${o}/${r}/HEAD/metadata/en-US/images/icon.png`,
        `https://github.com/${o}.png?size=160`
      ];
    }
  }
  return [];
}

/* ========= SPRITES PIXEL =========
   Cada dibujo es una cuadrícula de letras: h = color de la categoría, s = sombra, l = luz,
   x = color del texto, y/p/m/w = amarillo/rosa/menta/crema. El punto es vacío. */
function rects(rows,ox=0,oy=0){
  const m={};
  rows.forEach((row,y)=>{let x=0;while(x<row.length){const ch=row[x];if(ch==="."){x++;continue;}let x2=x+1;while(x2<row.length&&row[x2]===ch)x2++;(m[ch]=m[ch]||[]).push(`M${x+ox} ${y+oy}h${x2-x}v1h-${x2-x}z`);x=x2;}});
  return Object.keys(m).map(c=>`<path class="c-${c}" d="${m[c].join("")}"/>`).join("");
}
const spr=(rows,scale,cls="")=>`<svg class="spr ${cls}" viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length*scale}" height="${rows.length*scale}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects(rows)}</svg>`;

const ICO={
  tiendas:[
    "....llll....","...l....l...","...l....l...",".hhhhhhhhhh.",".hllhhhhhhs.",".hllhhhhhhs.",
    ".hhhhhhhhhs.",".hhhhhhhhhs.",".hhhhhhhhhs.",".hhhhhhhhhs.",".ssssssssss.","............"],
  importante:[
    "..hhhh......",".hllhhh.....",".hl..hh.....",".hh..hh.....","..hhhhh.....","....hh......",
    "....hh......","....hhhh....","....hh......","....hhhh....","....ss......","............"],
  utilidad:[
    "............",".hhhhhhhhhh.",".hlhhhhhhhs.",".hlhhhhhwhs.",".hhwhhhwhhs.",".hhhwhwhhhs.",
    ".hhhhwhhhhs.","..hhhhhhhs..","...hhhhhs...","....hhhs....",".....hs.....","............"],
  decoracion:[
    "............","...hhhhhhh..","..hhhhhhhhhh",".hhyyhhhmmhh",".hhyyhhhmmhh",".hhhhhhhhhhh",
    ".hhhhhwwwhh.",".hhhhhwws...","..hhhhhs....","...hhsss....","............","............"],
  musica:[
    "....hhhhhhh.","....hhhhhhh.","....h.....h.","....h.....h.","....h.....h.","....h.....h.",
    "..hhh...hhh.",".lhhhh.lhhhh",".hhhhh.hhhhh","..hhh...hhh.","............","............"],
  teclados:[
    "............","............","hhhhhhhhhhhh","hlhlhlhlhlhh","hhhhhhhhhhhh","hlhlhlhlhlhh",
    "hhhhhhhhhhhh","hhlllllllhhh","ssssssssssss","............","............","............"]
};
const UI={
  ext:["...x...","....x..","xxxxxxx","....x..","...x..."],
  play:["x....","xx...","xxx..","xxxx.","xxx..","xx...","x...."],
  copy:["xxxxxx...","x....x...","x....x...","x..xxxxxx","x..x....x","xxxx....x","...x....x","...x....x","...xxxxxx"],
  search:[".xxxx...","x....x..","x....x..","x....x..",".xxxxx..",".....xx.","......xx",".......x"],
  moon:["..xxx..",".xx....","xx.....","xx.....","xx.....",".xx..xx","..xxxxx"],
  sun:["...x...",".x...x.","..xxx..","x.xxx.x","..xxx..",".x...x.","...x..."],
  min:["........","........","........","........","........","........","xxxxxx..","xxxxxx.."],
  max:["xxxxxxxx","xxxxxxxx","x......x","x......x","x......x","x......x","x......x","xxxxxxxx"],
  restore:["..xxxxxx","..x....x","xxxxxx.x","x....x.x","x....x.x","x....xxx","x....x..","xxxxxx.."],
  bang:[".xx.",".xx.",".xx.",".xx.","....",".xx.",".xx."],
  heart:[".pp.pp.","ppppppp","ppppppp","ppppppp",".ppppp.","..ppp..","...p..."]
};
const SHEEP=[
  "...wwww.www.wwww..",
  "..wwwwwwwwwwwwwwf.",
  ".wwwwwwwwwwwwwfff.",
  "wwwwwwwwwwwwwfeff.",
  "wwwwwwwwwwwwwffff.",
  "wwwwwwwwwwwwwfppf.",
  "gwwwwwwwwwwww.ff..",
  ".gwwwwwwwwwww.....",
  "..gggggggggg......",
  "...f.f....f.f.....",
  "...f.f....f.f....."
];
const CLOUD=[".....cc.....","...cccccc...","..cccccccc..","cccccccccccc"];
const CLOUD2=["..cccc..",".cccccc.","cccccccc"];

/* ========= ESCENA DE LA CABECERA ========= */
(function(){
  const W=64,H=34,el=document.getElementById("scene-art");
  let s="";
  const R=(x,y,w,h,c)=>{s+=`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;};
  // cielo en franjas, como en los juegos de 16 bits
  [0,7,12,16,20,23].forEach((y,i)=>R(0,y,W,H-y,"sk"+(i+1)));
  // estrellas
  s+=`<g class="stars">`;
  [[4,3],[10,9],[18,4,1],[25,8],[31,2],[33,5,1],[42,12],[58,12],[61,4],[14,14],[51,3],[8,17],[34,15],[60,17],[22,13],[2,10],[15,2],[28,13],[55,2,1],[62,9],[20,10],[7,6,1],[47,8],[50,15],[12,12],[57,7],[26,3],[38,13]].forEach(([x,y,big],i)=>{
    const d=-((i*13)%9)/3;
    s+=`<g class="tw" style="animation-delay:${d.toFixed(1)}s"><rect x="${x}" y="${y}" width="1" height="1"/>`;
    if(big)s+=`<rect x="${x-1}" y="${y}" width="3" height="1"/><rect x="${x}" y="${y-1}" width="1" height="3"/>`;
    s+=`</g>`;
  });
  s+=`</g>`;
  // luna (noche) y sol (día)
  s+=`<g class="moon">`;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
    if(dx*dx+dy*dy<=17&&!((dx-2)*(dx-2)+(dy+1)*(dy+1)<=13))s+=`<rect x="${40+dx}" y="${6+dy}" width="1" height="1"/>`;
  }
  s+=`</g><g class="sun">`;
  for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
    if(dx*dx+dy*dy<=10)s+=`<rect x="${40+dx}" y="${6+dy}" width="1" height="1"/>`;
  }
  [[0,-5],[0,5],[-5,0],[5,0],[-4,-4],[4,-4],[-4,4],[4,4]].forEach(([dx,dy])=>{s+=`<rect x="${40+dx}" y="${6+dy}" width="1" height="1"/>`;});
  s+=`</g>`;
  // nubes (día)
  s+=`<g class="clouds">`;
  [[CLOUD,5,100,20,6],[CLOUD,11,150,90,30],[CLOUD2,2,70,45,40]].forEach(([rows,y,dur,delay,x0])=>{
    s+=`<g class="cl" style="--x0:${x0}px;animation-duration:${dur}s;animation-delay:-${delay}s">${rects(rows,0,y)}</g>`;
  });
  s+=`</g>`;
  // colinas
  const run=(fn,cls,full)=>{
    let x=0;
    while(x<W){const y=fn(x);let x2=x+1;while(x2<W&&fn(x2)===y)x2++;R(x,y,x2-x,full?H-y:1,cls);x=x2;}
  };
  const back=x=>Math.round(19+3.5*Math.sin(x/7+.6)+1.4*Math.sin(x/2.6));
  const gy=x=>27-Math.round(Math.max(0,Math.abs(x-46)-9)*.2);
  run(back,"hb",true);
  run(gy,"hf",true);
  run(gy,"gr",false);
  for(let x=1;x<W;x++)if((x*5)%7===0&&(x<36||x>55))R(x,gy(x)-1,1,1,"gr");
  [[8,"fp"],[12,"fy"],[31,"fy"],[34,"fp"],[58,"fp"],[61,"fy"]].forEach(([x,c])=>R(x,gy(x)-1,1,1,c));
  // la oveja
  s+=rects(SHEEP,37,16);
  el.innerHTML=s;
})();

/* ========= RENDER ========= */
const nav=document.getElementById("nav"),app=document.getElementById("app");
const LOGOS=[];
let total=0;

const SPR_MIN=spr(UI.min,2),SPR_MAX=spr(UI.max,2),SPR_RES=spr(UI.restore,2);
const ICON={ext:spr(UI.ext,2),copy:spr(UI.copy,2),play:spr(UI.play,2)};
document.getElementById("searchbox").insertAdjacentHTML("afterbegin",spr(UI.search,2));
document.getElementById("heart").innerHTML=spr(UI.heart,2);
document.getElementById("tg").innerHTML=spr(UI.moon,3,"ic-moon")+spr(UI.sun,3,"ic-sun");

C.forEach(c=>{
  const [short,hue]=META[c.id];
  total+=c.a.length;
  nav.insertAdjacentHTML("beforeend",`<a class="tab" href="#${c.id}" style="--h:${hue}">${spr(ICO[c.id],2)}<span>${short}</span></a>`);
  let h=`<section class="cat" id="${c.id}" style="--h:${hue}"><div class="panel"><div class="tb"><span class="tbi" aria-hidden="true">${spr(ICO[c.id],2)}</span><span class="tbt">${short}.exe</span><span class="tbn">${c.a.length} ${c.a.length===1?"app":"apps"}</span><span class="tbb"><button type="button" class="wb wmin" aria-label="Minimizar ventana">${SPR_MIN}</button><button type="button" class="wb wmax" aria-label="Maximizar ventana">${SPR_MAX}</button></span></div><div class="ph"><span class="ico" aria-hidden="true">${spr(ICO[c.id],3)}</span><div class="tx"><h2>${c.t}</h2><p>${c.s}</p></div><span class="chip">${c.a.length} ${c.a.length===1?"app":"apps"}</span></div>`;
  c.a.forEach(a=>{
    const k=LOGOS.push(logos(a))-1;
    const links=a[3].map((l,j)=>{
      const label=l[0]==="Play"?"Google Play":l[0];
      const cls="btn"+(j===0?" p":"");
      if(/\.json($|\?)/.test(l[1])){
        return `<button type="button" class="${cls}" data-copy="${l[1]}" aria-label="Copiar el enlace de la extensión">${ICON.copy}${label}</button>`;
      }
      const ic=/youtu/.test(l[1])?ICON.play:ICON.ext;
      return `<a class="${cls}" href="${l[1]}" target="_blank" rel="noopener noreferrer">${ic}${label}</a>`;
    }).join("");
    h+=`<article class="app" data-s="${nrm(a[0]+" "+a[1]+" "+a[2]).replace(/"/g,"")}">
      <div class="logo" data-i="${a[0].charAt(0).toUpperCase()}"><img data-k="${k}" alt="" width="56" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
      <div class="info">
        <div class="line"><h3>${a[0]}</h3><span class="tag">${a[1]}</span></div>
        <p class="desc clamp">${a[2]}</p><button type="button" class="more" aria-expanded="false" hidden>Leer más</button>
        ${a[4]?`<div class="tip"><span class="bang">${spr(UI.bang,2)}</span><span>${a[4]}</span></div>`:""}
        <div class="links">${links}</div>
      </div>
    </article>`;
  });
  app.insertAdjacentHTML("beforeend",h+"</div></section>");
});
document.getElementById("count").textContent=`${total} apps en ${C.length} ventanas. Toca una para abrirla.`;

/* Logos: prueba cada enlace en orden; si todos fallan, muestra la inicial */
document.querySelectorAll(".logo img").forEach(img=>{
  const list=LOGOS[+img.dataset.k];
  if(!list.length){img.parentElement.classList.add("fail");return;}
  let i=0;
  img.addEventListener("error",()=>{
    i++;
    if(i<list.length)img.src=list[i];
    else img.parentElement.classList.add("fail");
  });
  img.src=list[0];
});

/* "Leer más" solo aparece si el texto realmente se corta */
let fq=0;
function fit(){if(fq)return;fq=requestAnimationFrame(()=>{fq=0;document.querySelectorAll(".desc.clamp").forEach(d=>{d.nextElementSibling.hidden=!(d.scrollHeight>d.clientHeight+1);});});}
fit();
window.addEventListener("load",fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
let rt;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(fit,150);});

/* Avisos */
const toastEl=document.getElementById("toast");let tt;
function toast(msg){toastEl.textContent=msg;toastEl.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove("show"),2000);}

/* Ventanas: normal, minimizada (solo la barra) o maximizada (pantalla completa) */
const scrim=document.getElementById("scrim");
const SPRE=[],SPOST=[];
function setState(sec,st){
  for(const f of SPRE){const r=f(sec,st);if(r)st=r;}
  const wasMax=sec.classList.contains("max");
  if(st==="max"&&!wasMax)sec.style.minHeight=sec.offsetHeight+"px";
  sec.classList.remove("min","max");
  if(st==="min"||st==="max")sec.classList.add(st);
  if(st!=="max")sec.style.minHeight="";
  const bmin=sec.querySelector(".wmin"),bmax=sec.querySelector(".wmax");
  bmin.setAttribute("aria-label",st==="min"?"Restaurar ventana":"Minimizar ventana");
  bmax.setAttribute("aria-label",st==="max"?"Restaurar tamaño de la ventana":st==="min"?"Restaurar ventana":"Maximizar ventana");
  bmax.innerHTML=st==="max"?SPR_RES:SPR_MAX;
  const anyMax=!!document.querySelector(".cat.max");
  scrim.hidden=!anyMax;
  document.documentElement.classList.toggle("lock",anyMax);
  fit();
  SPOST.forEach(f=>f(sec,st));
}
document.querySelectorAll(".cat").forEach(sec=>setState(sec,"min"));
const closeMax=()=>{const m=document.querySelector(".cat.max");if(m)setState(m,"normal");};
scrim.addEventListener("click",closeMax);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMax();});

/* Cambio de tema */
document.getElementById("tg").addEventListener("click",()=>{
  const root=document.documentElement;
  const next=root.getAttribute("data-theme")==="dark"?"light":"dark";
  root.setAttribute("data-theme",next);
  const m=document.getElementById("tc");if(m)m.setAttribute("content",next==="dark"?"#150c33":"#efe6ff");
  try{localStorage.setItem("kixki-theme",next);}catch(_){}
});

/* Clics: copiar enlace y leer más / menos */
document.addEventListener("click",async e=>{
  const wb=e.target.closest(".wb");
  if(wb){
    const sec=wb.closest(".cat");
    const st=sec.classList.contains("min")?"min":sec.classList.contains("max")?"max":"normal";
    if(wb.classList.contains("wmin"))setState(sec,st==="min"?"normal":"min");
    else setState(sec,st==="normal"?"max":"normal");
    return;
  }
  const tb=e.target.closest(".tb");
  if(tb){const sec=tb.closest(".cat");if(sec.classList.contains("min"))setState(sec,"normal");return;}
  const tab=e.target.closest(".tab");
  if(tab){const sec=document.getElementById(tab.hash.slice(1));if(sec&&sec.classList.contains("min"))setState(sec,"normal");}
  const more=e.target.closest(".more");
  if(more){
    const d=more.previousElementSibling;
    const open=d.classList.toggle("clamp")===false;
    more.textContent=open?"Ver menos":"Leer más";
    more.setAttribute("aria-expanded",open);
    return;
  }
  const b=e.target.closest("[data-copy]");
  if(!b)return;
  const t=b.dataset.copy;
  try{
    await navigator.clipboard.writeText(t);
    toast("Enlace de la extensión copiado ✓");
  }catch(_){
    const x=document.createElement("textarea");
    x.value=t;x.setAttribute("readonly","");x.style.position="fixed";x.style.opacity="0";
    document.body.appendChild(x);x.select();
    let ok=false;try{ok=document.execCommand("copy");}catch(_){}
    x.remove();
    if(ok)toast("Enlace de la extensión copiado ✓");else window.open(t,"_blank","noopener");
  }
});

/* Buscador */
const q=document.getElementById("q"),empty=document.getElementById("empty");
q.addEventListener("input",()=>{
  const v=nrm(q.value.trim());
  let any=false;
  document.querySelectorAll(".cat").forEach(s=>{
    let n=0;
    s.querySelectorAll(".app").forEach(a=>{
      const m=!v||a.dataset.s.includes(v);
      a.hidden=!m;if(m)n++;
    });
    if(v&&n&&s.classList.contains("min"))setState(s,"normal");
    s.hidden=!n;if(n)any=true;
  });
  empty.hidden=any;
  if(!any)empty.textContent=`No encontré apps con «${q.value.trim()}». Prueba con otra palabra.`;
  fit();
});

/* Categoría activa en la barra al hacer scroll */
const pills=[...nav.querySelectorAll("a")];
let curId=null,tick=false;
function spy(){
  tick=false;
  const y=innerHeight*.35;
  let cur=null;
  const secs=[...document.querySelectorAll(".cat")].filter(sec=>!sec.hidden);
  secs.forEach(sec=>{if(sec.getBoundingClientRect().top<=y)cur=sec;});
  if(secs.length&&innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur=secs[secs.length-1];
  const id=cur?cur.id:null;
  if(id===curId)return;
  curId=id;
  pills.forEach(p=>p.classList.toggle("on",p.hash==="#"+id));
  const p=pills.find(p=>p.classList.contains("on"));
  if(p)nav.scrollTo({left:p.offsetLeft-(nav.clientWidth-p.offsetWidth)/2,behavior:"smooth"});
}
addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(spy);}},{passive:true});
addEventListener("resize",spy);
spy();

/* ===== sprites y ventanas especiales (favoritas, novedades, packs) ===== */
const STAR=["......hh....","......hh....",".....hhhh...","hhhhhhhhhhhs",".hhhhhhhhhs.","..hhhhhhhs..","..hhhhhhhs..",".hhhhhhhhhs.",".hhhhs.hhhs.",".hhs....hhs.","............","............"];
const NEWI=["............","......hh....","......hh....",".....hhhh...","..hhhhhhhhhh","..hhhhhhhhhh",".....hhhh...","......hh....","......hh....","............","............","............"];
const BOX=["............","..hhhhhhhh..",".hllllllllhs",".hhhhhhhhhhs",".hhhhllhhhhs",".hhhhllhhhhs",".hhhhllhhhhs",".hhhhllhhhhs",".hhhhllhhhhs",".ssssssssss.","............","............"];
const HOME=["...xx...","..xxxx..",".xxxxxx.","xxxxxxxx",".xx..xx.",".xx..xx.",".xx..xx.",".xxxxxx."],DOTS=["xx.xx.xx","xx.xx.xx"];
const SLEEPR=["...wwww.wwww......","..wwwwwwwwwwww....",".wwwwwwwwwwwwwfff.","wwwwwwwwwwwwwwfkkf","wwwwwwwwwwwwwwffpf","gwwwwwwwwwwwwwfff.",".gwwwwwwwwwwgg....","..ggggggggggg.....","...ff..ff........."];
(function(){
  const tpl=document.querySelector(".cat");
  [["favs","⭐","Mis favoritas","Las apps que marcaste con ☆","Favoritas","#ffc23a",STAR],
   ["news","🆕","Novedades","Apps nuevas desde tu última visita","Novedades","#ff7a59",NEWI],
   ["packs","🎁","Packs","Listas para instalar varias apps de una vez","Packs","#4ccf9b",BOX]].forEach(([id,e,t,s,sh,hue,ic])=>{
    C.push({id,e,t,s,a:[]});META[id]=[sh,hue];ICO[id]=ic;
    const x=tpl.cloneNode(true);x.id=id;x.style.setProperty("--h",hue);x.hidden=false;
    x.querySelectorAll(".app").forEach(n=>n.remove());
    x.querySelector(".tbt").textContent=sh+".exe";x.querySelector(".tbi").innerHTML=spr(ic,2);
    x.querySelector(".ico").innerHTML=spr(ic,3);x.querySelector("h2").textContent=t;x.querySelector(".ph p").textContent=s;
    document.getElementById("app").append(x);
  });
})();

/* ========= KIXKI OS · extras ========= */
(function(){
const root=document.documentElement,DSK=()=>{let v=null;try{v=localStorage.getItem("kixki-view");}catch(e){}return v==="pc"?true:v==="movil"?false:matchMedia("(min-width:1000px)").matches;};
const secs=[...document.querySelectorAll(".cat")];
let Z=10,topS=null,np=0,drag=null;
const SLEEP=["...wwww.wwww......","..wwwwwwwwwwww....",".wwwwwwwwwwwwwfff.","wwwwwwwwwwwwwwfkkf","wwwwwwwwwwwwwwffpf","gwwwwwwwwwwwwwfff.",".gwwwwwwwwwwgg....","..ggggggggggg.....","...ff..ff........."];
const ZZ=["xxxxx","...x.","..x..",".x...","xxxxx"];
secs.forEach(s=>{s.dataset.e=C.find(c=>c.id===s.id).e;});
document.body.insertAdjacentHTML("beforeend",
`<nav id="desk" aria-label="Escritorio">${C.map(c=>`<button type="button" class="di" data-id="${c.id}" data-e="${c.e}" style="--h:${META[c.id][1]}">${spr(ICO[c.id],5)}<span>${META[c.id][0]}</span><em>${c.a.length} ${c.a.length===1?"app":"apps"}</em></button>`).join("")}</nav>
<div id="pet" aria-hidden="true"><div class="pi"><span class="pa">${spr(SHEEP,4)}</span><span class="ps">${spr(SLEEP,4)}</span>${[2,3,4].map((n,i)=>`<i class="zz" style="--zd:-${i*1.2}s">${spr(ZZ,n)}</i>`).join("")}</div></div>
<div id="sm" hidden>${C.map(c=>`<button type="button" class="sm" data-id="${c.id}" style="--h:${META[c.id][1]}">${spr(ICO[c.id],2)}${c.t}</button>`).join("")}<button type="button" class="sm" id="smt">Día / noche</button><button type="button" class="sm" id="sma">Cerrar todas</button></div>
<div id="taskbar"><button type="button" class="start" id="st">${spr(SHEEP,2)}Kixki</button>${C.map(c=>`<button type="button" class="tk" data-id="${c.id}" style="--h:${META[c.id][1]}">${spr(ICO[c.id],2)}<span>${META[c.id][0]}</span></button>`).join("")}<div class="tray"><span>Hecho con ♥ por KitsukiLove</span><b id="clk"></b></div></div>`);
const sm=document.getElementById("sm");
function sync(){secs.forEach(s=>{const on=!s.classList.contains("min");
  document.querySelectorAll(`.tk[data-id="${s.id}"]`).forEach(b=>{b.classList.toggle("on",on);b.classList.toggle("top",on&&s===topS);});});}
SPRE.push((s,t)=>{
  if(!DSK()&&t==="normal"&&!q.value.trim())t="min";
  if(t!=="min"&&!s.dataset.p){s.dataset.p=1;s.style.setProperty("--x",150+(np%6)*40+"px");s.style.setProperty("--y",34+(np%6)*34+"px");np++;}
  return t;});
SPOST.push(()=>sync());
function front(s){s.style.setProperty("--z",++Z);topS=s;sync();}
function openWin(id){const s=document.getElementById(id);if(!s)return;if(s.classList.contains("min"))setState(s,DSK()?"normal":"max");front(s);}
document.addEventListener("click",e=>{
  const d=e.target.closest(".di,.sm[data-id]");
  if(d){openWin(d.dataset.id);sm.hidden=true;return;}
  const k=e.target.closest(".tk");
  if(k){const s=document.getElementById(k.dataset.id);
    if(s.classList.contains("min"))openWin(s.id);else if(s===topS)setState(s,"min");else front(s);return;}
  if(e.target.closest("#st")){sm.hidden=!sm.hidden;return;}
  if(e.target.closest("#smt")){document.getElementById("tg").click();sm.hidden=true;return;}
  if(e.target.closest("#sma")){secs.forEach(s=>setState(s,"min"));topS=null;sm.hidden=true;return;}
  if(e.target.closest("#pet")){toast("¡Beee! 🐑");return;}
  if(!e.target.closest("#sm"))sm.hidden=true;
});
/* Ventanas arrastrables */
document.addEventListener("pointerdown",e=>{
  if(!DSK())return;
  const s=e.target.closest(".cat");if(!s)return;
  front(s);
  if(!e.target.closest(".tb")||e.target.closest(".wb")||s.classList.contains("max"))return;
  const r=s.getBoundingClientRect();drag={s,dx:e.clientX-r.left,dy:e.clientY-r.top};e.preventDefault();
});
addEventListener("pointermove",e=>{if(!drag)return;
  drag.s.style.setProperty("--x",Math.max(0,Math.min(innerWidth-140,e.clientX-drag.dx))+"px");
  drag.s.style.setProperty("--y",Math.max(0,Math.min(innerHeight-110,e.clientY-drag.dy))+"px");});
addEventListener("pointerup",()=>{drag=null;});
/* Reloj */
const clk=document.getElementById("clk"),clock=()=>{clk.textContent=new Date().toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"});};
clock();setInterval(clock,20000);
/* La oveja pasea de día y duerme de noche */
const pet=document.getElementById("pet"),pi=pet.firstElementChild;let px=260,dir=1;
setInterval(()=>{
  if(document.hidden||!DSK()||(window.KXPET&&KXPET.hold))return;/* KXPET.hold: Kixki está charlando con ella (kixki2.js) */
  if(root.getAttribute("data-theme")==="dark"){pi.style.transform="";return;}
  px+=dir*3;const mx=innerWidth-130;
  if(px>mx){px=mx;dir=-1;}if(px<120){px=120;dir=1;}
  pet.style.transform=`translateX(${px}px)`;pi.style.transform=dir<0?"scaleX(-1)":"";
},120);
/* Burbujas */
const RING=[".xxx.","x...x","x...x","x...x",".xxx."];
for(let i=0;i<12;i++)document.body.insertAdjacentHTML("beforeend",`<i class="bub" style="left:${(i*83+11)%97}%;--d:${22+(i*7)%19}s;--dl:-${(i*5)%20}s">${spr(RING,2+(i%3))}</i>`);
/* Etiquetas útiles, detectadas del texto de cada descripción */
document.querySelectorAll(".app").forEach(a=>{
  const t=a.querySelector(".desc").textContent,b=[],m=t.match(/Android (\d+)\+/);
  if(/open source|código abierto/i.test(t))b.push("Open source");
  if(/código cerrado/i.test(t))b.push("Código cerrado");
  if(/sin anuncios/i.test(t))b.push("Sin anuncios");
  if(/de pago/i.test(t))b.push("De pago");
  if(m)b.push("Android "+m[1]+"+");
  if(/Shizuku/.test(t)&&a.querySelector("h3").textContent!=="Shizuku")b.push("Compatible con Shizuku");
  if(b.length)a.querySelector(".line").insertAdjacentHTML("afterend",`<div class="bdg">${b.map(x=>`<span>${x}</span>`).join("")}</div>`);
});
/* App sugerida del día */
const apps=[...document.querySelectorAll(".app")],pk=apps[Math.floor(Date.now()/864e5)%apps.length];
document.getElementById("count").insertAdjacentHTML("afterend",`<button type="button" class="pick" id="pick">🐑 Hoy te sugiero: <b>${pk.querySelector("h3").textContent}</b></button>`);
document.getElementById("pick").onclick=()=>{const s=pk.closest(".cat");if(s.classList.contains("min"))setState(s,DSK()?"normal":"max");front(s);
  pk.scrollIntoView({block:"center",behavior:"smooth"});pk.classList.add("hl");setTimeout(()=>pk.classList.remove("hl"),3500);};
/* Atajo: / para buscar */
addEventListener("keydown",e=>{if(e.key==="/"&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();q.focus();}});
/* Modo PC / móvil */
function mode(){root.classList.toggle("dsk",DSK());const vw=document.getElementById("vw");if(vw)vw.textContent=DSK()?"Modo móvil":"Modo PC";
  dispatchEvent(new Event("kixki-mode"));
  document.getElementById("count").textContent=DSK()?`${total} apps en ${C.filter(c=>c.a.length).length} carpetas. Abre una desde el escritorio.`:`${total} apps en ${C.filter(c=>c.a.length).length} carpetas. Toca una para abrirla.`;}
document.querySelector("header.hero").insertAdjacentElement("afterend",document.getElementById("desk"));
q.addEventListener("input",()=>{const v=q.value.trim();root.classList.toggle("srch",!!v);if(!v&&!DSK())secs.forEach(x=>setState(x,"min"));});
mode();addEventListener("resize",mode);
function setView(v){try{v==="auto"?localStorage.removeItem("kixki-view"):localStorage.setItem("kixki-view",v);}catch(e){}
  document.querySelector("meta[name=viewport]").content=v==="pc"?"width=1100, viewport-fit=cover":"width=device-width, initial-scale=1, viewport-fit=cover";
  mode();secs.forEach(x=>setState(x,"min"));topS=null;sync();if(DSK())openWin(C[0].id);}
document.getElementById("vw").addEventListener("click",()=>setView(DSK()?"movil":"pc"));
window.KX={front,openWin,DSK,root,sm,setView};
if(DSK())openWin(C[0].id);
})();

/* ========= KIXKI OS · parte 2 ========= */
(function(){
const {front,openWin,DSK,root,sm}=KX;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const SP=["favs","news","packs"],secOf=id=>document.getElementById(id);
const origs=()=>$$("#app .cat:not(#favs):not(#news):not(#packs) .app"),nm=a=>a.querySelector("h3").textContent;
const vib=(n=8)=>{try{navigator.vibrate&&navigator.vibrate(n);}catch(e){}};
const ADDED={};D.categories.forEach(c=>c.apps.forEach(a=>{if(a.added)ADDED[a.name]=a.added;}));/* "added":"2026-10-12" en apps.json → muestra «Nueva» 12 días */
let SND=LS.g("kixki-snd",false),PX=LS.g("kixki-px",false),AC;
let lb=0,ln=-1,lbt=0,win=[],bq=[],FXO;
/* Efectos: una sola cadena de audio compartida (volumen, filtro y compresor). Solo se crea tras un gesto del usuario,
   se calla con la pestaña oculta y cambia de escala/timbre según el fondo y la hora (día/noche). */
const FXP={"":{sc:[0,2,4,7,9],w:"sine"},valle:{sc:[0,2,4,7,9],w:"triangle"},primavera:{sc:[0,2,4,7,9],w:"triangle"},verano:{sc:[0,2,4,7,9],w:"triangle"},
 otono:{sc:[0,3,5,7,10],w:"sine"},invierno:{sc:[0,2,4,7,9],w:"sine",bell:1},halloween:{sc:[0,3,5,6,7,10],w:"triangle",lo:1},navidad:{sc:[0,2,4,7,9],w:"sine",bell:1}};
function fxCtx(){if(!SND||document.hidden)return null;
  if(!AC){if(navigator.userActivation&&!navigator.userActivation.hasBeenActive)return null;
    try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){return null;}
    const g=AC.createGain(),l=AC.createBiquadFilter(),c=AC.createDynamicsCompressor();l.type="lowpass";g.connect(l);l.connect(c);c.connect(AC.destination);FXO={g,l};}
  if(AC.state==="suspended")AC.resume();
  const night=root.getAttribute("data-theme")==="dark";
  FXO.g.gain.value=(night?.7:1)*(KXM.on?.55:1);FXO.l.frequency.value=night?1700:2600;return AC;}
function beep(f=660,d=.07){
  const n=performance.now();if(n-lb<90)return;
  win=win.filter(x=>n-x<2500);if(win.length>=6)return;/* nunca más de 6 sonidos cada 2,5 s */
  const a=fxCtx();if(!a)return;lb=n;win.push(n);
  try{const P=FXP[root.getAttribute("data-bg")||""]||FXP[""],SC=P.sc,m=Math.round(69+12*Math.log2(f/440)),r=((m%12)+12)%12,b=m-r;let i=0;
    SC.forEach((p,j)=>{if(Math.abs(p-r)<Math.abs(SC[i]-r))i=j;});
    let mi=b+SC[i];if(mi===ln&&n-lbt<400){i=Math.max(0,Math.min(SC.length-1,i+(i?-1:1)));mi=b+SC[i];}ln=mi;lbt=n;/* no repite la misma nota seguida */
    const fr=440*Math.pow(2,((P.lo?mi-12:mi)-69)/12),t=a.currentTime,len=Math.max(d,.1)+.1,o=a.createOscillator(),h=a.createOscillator(),g=a.createGain(),hg=a.createGain();
    o.type=P.w;h.type=P.bell?"sine":"triangle";o.frequency.setValueAtTime(fr*.985,t);o.frequency.exponentialRampToValueAtTime(fr,t+.025);
    h.frequency.value=fr*(P.bell?2.76:2);hg.gain.value=P.bell?.14:.22;
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.075,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+len);
    o.connect(g);h.connect(hg);hg.connect(g);g.connect(FXO.g);o.start(t);h.start(t);o.stop(t+len+.02);h.stop(t+len+.02);}catch(e){}}
function baa(){
  const n=performance.now();bq=bq.filter(x=>n-x<4000);
  if(bq.length&&n-bq[bq.length-1]<450)return;/* tocar muy rápido no apila balidos */
  if(bq.length>=4&&Math.random()<.6){bq.push(n);return;}
  const a=fxCtx();if(!a)return;bq.push(n);
  try{const night=root.getAttribute("data-theme")==="dark",hw=root.getAttribute("data-bg")==="halloween",t=a.currentTime,
    o=a.createOscillator(),v=a.createOscillator(),vg=a.createGain(),f=a.createBiquadFilter(),f2=a.createBiquadFilter(),g=a.createGain(),
    b=(360+Math.random()*80)*(night?.88:1)*(hw?.82:1);
    o.type="sawtooth";o.frequency.setValueAtTime(b*1.15,t);o.frequency.linearRampToValueAtTime(b*.85,t+.5);v.frequency.value=28;vg.gain.value=22;v.connect(vg);vg.connect(o.frequency);
    f.type="bandpass";f.frequency.value=900;f.Q.value=2.2;f2.type="bandpass";f2.frequency.value=1700;f2.Q.value=3;
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.085,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+.55);
    o.connect(f);o.connect(f2);f.connect(g);f2.connect(g);g.connect(FXO.g);o.start(t);v.start(t);o.stop(t+.6);v.stop(t+.6);}catch(e){}}
SPOST.push((s,t)=>{if(s.dataset.ls===t)return;s.dataset.ls=t;beep(t==="min"?330:660);});/* solo suena si la ventana cambió de estado de verdad */
function copyTxt(t,msg){const bad=()=>toast("No se pudo copiar. Cópialo a mano.");try{navigator.clipboard.writeText(t).then(()=>toast(msg),bad);}catch(e){bad();}}

/* --- mejoras por app --- */
const repoOf=a=>{for(const l of a.querySelectorAll(".links a")){const m=l.href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/)||l.href.match(/[?&]repo=([^\/&]+)\/([^&]+)/);if(m)return m[1]+"/"+m[2];}return"";};
const names=origs().map(nm),prev=LS.g("kixki-seen",null);let nw=null;
try{nw=JSON.parse(sessionStorage.getItem("kixki-news")||"null");}catch(e){}
if(!nw){nw=prev?names.filter(n=>!prev.includes(n)):[];
  Object.entries(ADDED).forEach(([n,d])=>{if(Date.now()-Date.parse(d)<12096e5&&names.includes(n)&&!nw.includes(n))nw.push(n);});
  try{sessionStorage.setItem("kixki-news",JSON.stringify(nw));}catch(e){}LS.s("kixki-seen",names);}
origs().forEach(a=>{
  const n=nm(a),r=repoOf(a);
  if(r){a.dataset.repo=r;
    if(![...a.querySelectorAll(".links a")].some(l=>l.href.startsWith("https://github.com/")))
      a.querySelector(".links").insertAdjacentHTML("beforeend",`<a class="btn" href="https://github.com/${r}" target="_blank" rel="noopener noreferrer">${ICON.ext}Repositorio</a>`);}
  const ln=a.querySelector(".line");
  if(nw.includes(n))ln.insertAdjacentHTML("beforeend",`<span class="new">Nueva</span>`);
  ln.insertAdjacentHTML("beforeend",`<button type="button" class="star" data-n="${n}" aria-label="Guardar en favoritas">☆</button>`);
  const bd=a.querySelector(".bdg");
  if(bd){a.dataset.s+=" "+[...bd.querySelectorAll("span")].map(x=>nrm(x.textContent)).join(" ");
    if(/Shizuku/.test(bd.textContent))bd.insertAdjacentHTML("afterend",`<button type="button" class="needz" data-go="Shizuku">Mejor con Shizuku: instálalo primero →</button>`);}
});

/* --- ventanas especiales --- */
function cnt(id,t){const s=secOf(id);s.querySelector(".chip").textContent=t;s.querySelector(".tbn").textContent=t;const em=$(`.di[data-id="${id}"] em`);if(em)em.textContent=t;}
function pix(){root.classList.toggle("pxl",PX);if(!PX)return;$$(".logo img").forEach(im=>{const go=()=>{if(!im.naturalWidth)return;let c=im.parentElement.querySelector("canvas");if(!c){c=document.createElement("canvas");c.width=c.height=20;im.after(c);}try{c.getContext("2d").drawImage(im,0,0,20,20);}catch(e){}};im.complete?go():im.addEventListener("load",go,{once:true});});}
function fill(id,list,empty,ic){const p=secOf(id).querySelector(".panel");p.querySelectorAll(".app").forEach(x=>x.remove());
  if(!list.length)p.insertAdjacentHTML("beforeend",`<article class="app sel" data-s=""><div class="logo" aria-hidden="true">${ic}</div><div class="info"><p class="desc">${empty}</p></div></article>`);
  list.forEach(a=>{const c=a.cloneNode(true);c.classList.remove("sel","hl");c.hidden=false;p.append(c);});
  cnt(id,`${list.length} ${list.length===1?"app":"apps"}`);pix();fit();}
const favs=()=>LS.g("kixki-fav",[]);
function rf(){const f=favs();fill("favs",origs().filter(a=>f.includes(nm(a))),"Toca ☆ en una app para guardarla aquí.","☆");
  $$(".star").forEach(b=>{const on=f.includes(b.dataset.n);b.textContent=on?"★":"☆";b.setAttribute("aria-pressed",on);b.classList.toggle("on",on);});}
const PACKS=[["🛡️","Privacidad","Menos rastreo y más control sobre lo que sale de tu móvil.",["Aurora Store","F-Droid","FireWall Blocks","PrivacyFlip","No More Background","LeanType"]],
["🎨","Personalizar","Widgets, fondos y teclado para dejar el móvil a tu gusto.",["Widgets Pro","Photo Widget","GIF Live Wallpaper","Essentials","LeanType"]],
["🚀","Para empezar","Lo mínimo para instalar y actualizar apps sin Play Store.",["F-Droid","Aurora Store","Komi Store","Universal Installer","Shizuku"]],
["🎧","Música","Para escuchar y descargar tu música.",["Poweramp","SpotiFLAC"]]];
(function(){const p=secOf("packs").querySelector(".panel"),by={};origs().forEach(a=>by[nm(a)]=a);
  PACKS.forEach(([ic,t,d,l])=>{const ok=l.filter(n=>by[n]);
    const txt=`Pack «${t}» de Kixki Store\n`+ok.map(n=>{const a=by[n].querySelector(".links a");return"• "+n+(a?": "+a.href:"");}).join("\n");
    p.insertAdjacentHTML("beforeend",`<article class="app sel" data-s="${nrm(t+" "+d)}"><div class="logo" aria-hidden="true">${ic}</div><div class="info"><div class="line"><h3>${t}</h3><span class="tag">${ok.length} apps</span></div><p class="desc">${d}</p><div class="links">${ok.map(n=>`<button type="button" class="btn" data-go="${n}">${n}</button>`).join("")}<button type="button" class="btn p" data-cp="${txt.replace(/"/g,"&quot;")}">${ICON.copy}Copiar lista</button></div></div></article>`);});
  cnt("packs",`${PACKS.length} packs`);})();
fill("news",origs().filter(a=>nw.includes(nm(a))),"Sin novedades por ahora. Cuando añada apps nuevas, aparecerán aquí.","🆕");
rf();
SP.forEach(id=>secOf(id).classList.add("ex"));$$(".cat").forEach(s=>s.classList.add("ex"));

/* --- ir a una app --- */
function goto(n){const a=origs().find(x=>nm(x)===n);if(!a)return;const s=a.closest(".cat");
  if(root.classList.contains("srch")){q.value="";q.dispatchEvent(new Event("input"));}
  if(DSK()){if(s.classList.contains("min"))setState(s,"normal");front(s);}else{closeMax();setState(s,"max");}
  s.querySelectorAll(".app.sel").forEach(x=>x.classList.remove("sel"));a.classList.add("sel");fit();
  setTimeout(()=>{a.scrollIntoView({block:"center",behavior:"smooth"});a.classList.add("hl");setTimeout(()=>a.classList.remove("hl"),3000);},80);}

/* --- clics --- */
document.addEventListener("click",e=>{
  const t=e.target;let b;
  if(b=t.closest(".star")){const f=favs(),n=b.dataset.n,i=f.indexOf(n);i<0?f.push(n):f.splice(i,1);LS.s("kixki-fav",f);rf();beep(i<0?990:440);vib();toast(i<0?"Guardada en favoritas ⭐":"Quitada de favoritas");return;}
  if(b=t.closest("[data-go]")){goto(b.dataset.go);return;}
  if(b=t.closest("[data-cp]")){copyTxt(b.dataset.cp,"Lista copiada ✓");return;}
  if(b=t.closest(".bdg span")){closeMax();q.value=b.textContent;q.dispatchEvent(new Event("input"));return;}
  if(b=t.closest(".x[data-x]")){$("#"+b.dataset.x).hidden=true;return;}
  if(t.classList.contains("ovl")){t.hidden=true;return;}
  const ap=t.closest(".app");
  if(ap&&DSK()&&!t.closest("a,button")&&ap.querySelector("h3")){const s=ap.closest(".cat");
    if(s&&!s.classList.contains("max")&&(!ap.classList.contains("sel")||t.closest(".logo,h3"))){const on=ap.classList.contains("sel");
      s.querySelectorAll(".app.sel").forEach(x=>x.classList.remove("sel"));if(!on)ap.classList.add("sel");fit();}}
});
q.addEventListener("input",()=>{const v=q.value.trim();SP.forEach(id=>secOf(id).hidden=!!v);});

/* --- barra inferior (móvil) --- */
const DK=[["home",HOME,"Inicio"],["srch",UI.search,"Buscar"],["fav",STAR.map(r=>r.replace(/[hls]/g,"x")),"Favoritas"],["theme",UI.moon,"Tema"],["more",DOTS,"Más"]];
document.body.insertAdjacentHTML("beforeend",`<nav id="dock" aria-label="Menú">${DK.map(([k,r,l])=>`<button type="button" data-k="${k}">${spr(r,3)}<span>${l}</span></button>`).join("")}</nav>`);
$("#dock").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.stopPropagation();vib();const k=b.dataset.k;
  if(k==="theme"){$("#tg").click();return;}
  if(k==="more"){sm.hidden=!sm.hidden;return;}
  sm.hidden=true;closeMax();
  if(k==="fav")openWin("favs");else{scrollTo({top:0,behavior:"smooth"});if(k==="srch")setTimeout(()=>q.focus(),250);}});
let ty=null;
document.addEventListener("touchstart",e=>{ty=!DSK()&&e.target.closest(".cat.max .tb")?e.touches[0].clientY:null;},{passive:true});
document.addEventListener("touchend",e=>{if(ty!=null&&e.changedTouches[0].clientY-ty>70){closeMax();vib(6);}ty=null;},{passive:true});
$$(".di").forEach(d=>d.addEventListener("click",()=>vib(6)));

/* --- menú Kixki: extras --- */
const ACC=["","mint","rose","dusk"],ACN=["Lila","Menta","Rosa","Atardecer"];let ai=Math.max(0,ACC.indexOf(LS.g("kixki-acc","")));
const setAcc=()=>{ACC[ai]?root.dataset.acc=ACC[ai]:root.removeAttribute("data-acc");LS.s("kixki-acc",ACC[ai]);};
const lab=()=>{$("#s-lang").textContent="Idioma: "+(KXI.lang==="en"?"English":"Español");$("#s-view").textContent=DSK()?"Modo móvil":"Modo PC";$("#s-mus").textContent="Música: "+(KXM.on?"sí":"no");$("#s-bg").textContent="Fondo: "+KXB.label();$("#s-acc").textContent="Color: "+ACN[ai];$("#s-pix").textContent="Logos pixel: "+(PX?"sí":"no");$("#s-snd").textContent="Efectos: "+(SND?"sí":"no");};
sm.insertAdjacentHTML("beforeend",`<button type="button" class="sm" id="s-run">Ejecutar… (Ctrl+K)</button><button type="button" class="sm" id="s-acc"></button><button type="button" class="sm" id="s-pix"></button><button type="button" class="sm" id="s-snd"></button><button type="button" class="sm" id="s-inst" hidden>Instalar app</button><button type="button" class="sm" id="s-mus"></button><button type="button" class="sm" id="s-bg"></button><button type="button" class="sm" id="s-view"></button><button type="button" class="sm" id="s-lang"></button><button type="button" class="sm" id="s-game">Saltaovejas</button><button type="button" class="sm" id="s-sug">Sugerir una app</button><button type="button" class="sm d" id="s-qr">Ábrelo en tu móvil</button><button type="button" class="sm d" id="s-off">Apagar</button>`);
setAcc();lab();pix();addEventListener("kixki-mode",lab);
sm.addEventListener("click",e=>{const b=e.target.closest("button[id^=s-]");if(!b)return;const k=b.id;
  if(k==="s-acc"){ai=(ai+1)%ACC.length;setAcc();lab();return;}
  if(k==="s-pix"){PX=!PX;LS.s("kixki-px",PX);pix();lab();return;}
  if(k==="s-view"){sm.hidden=true;KX.setView(DSK()?"movil":"pc");return;}if(k==="s-lang"){KXI.set(KXI.lang==="en"?"es":"en");lab();return;}if(k==="s-inst"){if(DP){DP.prompt();DP=null;$("#s-inst").hidden=true;}return;}if(k==="s-mus"){KXM.toggle();rdIc();lab();return;}if(k==="s-bg"){KXB.next();lab();return;}
  if(k==="s-snd"){SND=!SND;LS.s("kixki-snd",SND);rdIc();lab();beep(880,.1);return;}
  sm.hidden=true;
  if(k==="s-run")runOpen();else if(k==="s-game")game();else if(k==="s-qr")qr();else if(k==="s-off")ov("off");
  else if(k==="s-sug")window.open("https://github.com/KitsukiLove/KixKi-Store/issues/new?template=sugerir-app.yml&title="+encodeURIComponent("Sugerencia: "),"_blank","noopener");});

/* --- ventanas emergentes --- */
document.body.insertAdjacentHTML("beforeend",`<div id="run" class="ovl" hidden><div class="box"><div class="bt">Ejecutar<button type="button" class="x" data-x="run" aria-label="Cerrar">✕</button></div><input id="rq" type="text" placeholder="Escribe el nombre de una app…" autocomplete="off" aria-label="Ejecutar"><ul id="rl"></ul></div></div>
<div id="game" class="ovl" hidden><div class="box"><div class="bt">saltaovejas.exe<button type="button" class="x" data-x="game" aria-label="Cerrar">✕</button></div><canvas width="320" height="120"></canvas><p class="hint">Toca, espacio o ↑ para saltar</p></div></div>
<div id="qr" class="ovl" hidden><div class="box"><div class="bt">Ábrelo en tu móvil<button type="button" class="x" data-x="qr" aria-label="Cerrar">✕</button></div><div id="qrb"></div><p class="hint" id="qrt"></p></div></div><div id="boot" hidden></div>`);
let ri=0,rr=[];
function rl(){const v=nrm($("#rq").value.trim());rr=origs().filter(a=>!v||a.dataset.s.includes(v)).slice(0,6);ri=Math.min(ri,rr.length-1);
  $("#rl").innerHTML=rr.map((a,i)=>`<li data-i="${i}" class="${i===ri?"on":""}">${nm(a)}<small>${a.querySelector(".tag").textContent}</small></li>`).join("")||"<li>Sin resultados</li>";}
function runOpen(){$("#run").hidden=false;$("#rq").value="";ri=0;rl();$("#rq").focus();}
const exec=i=>{if(!rr[i])return;$("#run").hidden=true;goto(nm(rr[i]));};
$("#rq").addEventListener("input",()=>{ri=0;rl();});
$("#rq").addEventListener("keydown",e=>{if(e.key==="ArrowDown"){ri=Math.min(rr.length-1,ri+1);rl();e.preventDefault();}else if(e.key==="ArrowUp"){ri=Math.max(0,ri-1);rl();e.preventDefault();}else if(e.key==="Enter")exec(ri);});
$("#rl").addEventListener("click",e=>{const li=e.target.closest("li[data-i]");if(li)exec(+li.dataset.i);});
let gAF=0;
function game(){const g=$("#game");g.hidden=false;const c=g.querySelector("canvas"),x=c.getContext("2d"),cs=getComputedStyle(root);
  const col={w:"#fff7e6",f:"#f2a574",e:"#2b1a5e",p:"#ff8fc7",g:"#cdbdf2"};
  let rec=LS.g("kixki-rec",0),y=0,v=0,o=[{x:340,w:10,h:16}],sc=0,sp=3,dead=false;
  /* Avisos para Kixki (kixki.js / kixki2.js): start · retry · score · record · over */
  const ev=(t,d)=>dispatchEvent(new CustomEvent("kixki-game",{detail:Object.assign({t},d)}));
  let gp=LS.g("kixki-gp",0),first=gp===0,best0=rec,hit=false;
  const newRun=()=>{gp++;LS.s("kixki-gp",gp);first=gp===1;best0=rec;hit=false;};
  newRun();ev("start",{rec});
  g._j=()=>{if(dead){y=0;v=0;o=[{x:340,w:10,h:16}];sc=0;sp=3;dead=false;newRun();ev("retry",{rec});}else if(y===0)v=9;};
  cancelAnimationFrame(gAF);
  let lt=0;(function L(t){if(g.hidden)return;const dt=Math.min(2,lt&&t?(t-lt)/16.67:1);lt=t||0;
    x.fillStyle=cs.getPropertyValue("--surface2");x.fillRect(0,0,320,120);x.fillStyle=cs.getPropertyValue("--line");x.fillRect(0,100,320,20);
    if(!dead){v-=.6*dt;y=Math.max(0,y+v*dt);if(y===0&&v<0)v=0;o.forEach(k=>k.x-=sp*dt);
      if(o[0]&&o[0].x<-20){o.shift();sc++;sp=Math.min(7,3+sc/6);ev("score",{sc,rec});
        if(!hit&&best0>0&&sc>best0){hit=true;LS.s("kixki-rec",sc);ev("record",{sc});}}
      const l=o[o.length-1];if(!l||(l.x<220&&Math.random()<.025*dt))o.push({x:330,w:8+Math.random()*8|0,h:12+Math.random()*10|0});
      if(o.some(k=>k.x<66&&k.x+k.w>34&&y<k.h-2)){dead=true;rec=Math.max(rec,sc);LS.s("kixki-rec",rec);
        ev("over",{sc,rec,nr:sc>best0&&sc>0,first});}}
    x.fillStyle=cs.getPropertyValue("--ink");o.forEach(k=>x.fillRect(k.x,100-k.h,k.w,k.h));
    SHEEP.forEach((r,j)=>[...r].forEach((ch,i)=>{if(col[ch]){x.fillStyle=col[ch];x.fillRect(30+i*2,100-22-y+j*2,2,2);}}));
    x.fillStyle=cs.getPropertyValue("--ink");x.font="16px monospace";if(sc>rec)rec=sc;x.fillText("🐑 "+sc+" · récord "+rec,150,20);
    if(dead)x.fillText("Toca para reintentar",90,60);
    gAF=requestAnimationFrame(L);})();}
$("#game canvas").addEventListener("pointerdown",()=>$("#game")._j&&$("#game")._j());
function qr(){$("#qr").hidden=false;const u=location.href.split("#")[0];$("#qrt").textContent=u;
  const draw=()=>{try{const z=qrcode(0,"M");z.addData(u);z.make();const n=z.getModuleCount();let r="";
    for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(z.isDark(i,j))r+=`<rect x="${j+2}" y="${i+2}" width="1" height="1"/>`;
    $("#qrb").innerHTML=`<svg viewBox="0 0 ${n+4} ${n+4}" shape-rendering="crispEdges" width="240" height="240"><rect width="100%" height="100%" fill="#fff"/><g fill="#2a1650">${r}</g></svg>`;}catch(e){$("#qrb").textContent="No se pudo generar el QR.";}};
  if(window.qrcode)return draw();
  const s=document.createElement("script");s.src="vendor/qrcode.min.js";s.onload=draw;
  s.onerror=()=>{const t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";t.onload=draw;t.onerror=()=>{$("#qrb").textContent="No se pudo cargar el generador de QR. Copia el enlace de abajo.";};document.head.append(t);};document.head.append(s);}
function ov(kind){const b=$("#boot");b.hidden=false;b.className=kind;
  b.innerHTML=kind==="boot"?`<div class="bc"><img class="lg" src="logo.png" width="112" height="112" alt=""><h2>Kixki OS</h2><div class="bar8">${Array.from({length:12},(_,i)=>`<i style="animation-delay:${i*.2}s"></i>`).join("")}</div><p>Contando ovejas…</p></div>`
    :`<div class="bc">${spr(SLEEPR,6)}<p>Kixki OS está durmiendo.<br>Toca para despertar.</p></div>`;
  b.onclick=()=>{b.hidden=true;};
  if(kind==="boot")setTimeout(()=>{b.classList.add("out");setTimeout(()=>{b.hidden=true;},500);},2700);}
addEventListener("keydown",e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();runOpen();return;}
  if(e.key==="Escape")$$(".ovl,#boot").forEach(x=>x.hidden=true);
  const g=$("#game");if(!g.hidden&&(e.key===" "||e.key==="ArrowUp")){e.preventDefault();g._j&&g._j();}});

/* --- temporadas --- */
const HATS={halloween:[["...m..","..mm..",".hhhhh","hhhhhh",".hhhhs"],"#ff8a1e"],navidad:[["...ww","..hhw",".hhhh","hhhhh","wwwww"],"#e8394d"],amor:[["p.p.p",".ppp.","..p.."],"#ff8fc7"],valle:[["p.w.p.","mmmmmm"],"#8bdc72"],primavera:[["p.y.p.","mmmmmm"],"#ff8fc7"],verano:[["..hh..",".hhhh.","yyyyyy"],"#e8b84a"],otono:[["...m..",".hhhh.","hhhhhh"],"#c4560f"],invierno:[["..ww..",".hhhh.","hhhhhh","wwwwww"],"#4a7fd8"]};
const dt=new Date(),mo=dt.getMonth()+1,dy=dt.getDate();
const se=new URLSearchParams(location.search).get("temp")||((mo===10&&dy>=10)||(mo===11&&dy<=2)?"halloween":mo===12||(mo===1&&dy<=6)?"navidad":mo===2&&dy>=7&&dy<=14?"amor":"");
function dress(){document.querySelectorAll("#pet .hat,#scene-art .hatg").forEach(e=>e.remove());
  const k=document.documentElement.getAttribute("data-bg")||se,T=Object.prototype.hasOwnProperty.call(HATS,k)?HATS[k]:null;
  if(T){const dh=5-T[0].length;$("#pet .pa").insertAdjacentHTML("beforeend",`<span class="hat" style="--h:${T[1]};top:${-13+dh*3}px">${spr(T[0],3)}</span>`);
    $("#scene-art").insertAdjacentHTML("beforeend",`<g class="hatg" style="--h:${T[1]}">${rects(T[0],49,12+dh)}</g>`);}}
dress();addEventListener("kixki-bg",dress);
let pc=0;
function rain(){toast("¡Lluvia de ovejas! 🐑");for(let i=0;i<28;i++){const e=document.createElement("i");e.className="rain";e.textContent="🐑";e.style.cssText=`left:${Math.random()*100}%;animation-delay:${Math.random()*1.5}s;font-size:${18+Math.random()*22}px`;document.body.append(e);setTimeout(()=>e.remove(),4200);}}
let OV=LS.g("kixki-ov",0),OVS=LS.g("kixki-ovs",[]);
window.KXS={beep,baa};
$("#pet").insertAdjacentHTML("beforeend",`<b class="oc" aria-hidden="true"></b>`);
const oc=$("#pet .oc"),ocs=()=>{oc.textContent="🐑 "+OV;oc.classList.remove("pop");void oc.offsetWidth;oc.classList.add("pop");};ocs();
$("#pet").addEventListener("click",()=>{baa();OV++;LS.s("kixki-ov",OV);ocs();
  if(++pc>=10){pc=0;if(!document.querySelector(".rain"))rain();}
  [100,500,1000].forEach(m=>{if(OV>=m&&!OVS.includes(m)){OVS.push(m);LS.s("kixki-ovs",OVS);KXE.fire(m);}});});
/* Botón de sonido de la escena: activa o desactiva música y efectos a la vez */
const ICN=[["...h......","..hh..h...","hhhh...h..","hhhh.h.h..","hhhh.h.h..","hhhh...h..","..hh..h...","...h......"],["...h......","..hh......","hhhh.h..h.","hhhh..hh..","hhhh..hh..","hhhh.h..h.","..hh......","...h......"]].map(r=>`<svg viewBox="0 0 10 8" width="24" height="19" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${r.map((l,y)=>[...l].map((c,x)=>c==="h"?`<rect x="${x}" y="${y}" width="1" height="1"/>`:"").join("")).join("")}</svg>`);
function rdIc(){const on=SND||KXM.on,b=$("#rd");b.innerHTML=ICN[on?0:1];b.setAttribute("aria-pressed",on);}
$("#rd").addEventListener("click",()=>{const v=!(SND||KXM.on);SND=v;LS.s("kixki-snd",v);if(KXM.on!==v)KXM.toggle();rdIc();lab();if(v)beep(660,.1);});
rdIc();
/* Botón discreto para cambiar de fondo */
const BGI=["hhhhhhhhhh","h.....hh.h","h........h","h...h....h","h..hhh.h.h","h.hhhhhhhh","hhhhhhhhhh"];
$("#bgb").innerHTML=`<svg viewBox="0 0 10 7" width="20" height="14" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${BGI.map((l,y)=>[...l].map((c,x)=>c==="h"?`<rect x="${x}" y="${y}" width="1" height="1"/>`:"").join("")).join("")}</svg>`;
const bgt=()=>{$("#bgb").title="Fondo: "+KXB.label();};bgt();
$("#bgb").addEventListener("click",()=>{KXB.next();lab();bgt();toast("Fondo: "+KXB.label());});
/* Filtros por etiqueta (salen de las etiquetas de cada app) */
const bc={};$$(".bdg span").forEach(x=>{const t=x.textContent;bc[t]=(bc[t]||0)+1;});
const chips=document.createElement("div");chips.className="chips";chips.setAttribute("role","group");chips.setAttribute("aria-label","Filtros");
chips.innerHTML=Object.keys(bc).sort((x,y)=>bc[y]-bc[x]).map(t=>`<button type="button" class="chip fl" data-f="${t}" aria-pressed="false"><span>${t}</span><b>${bc[t]}</b></button>`).join("");
$("#searchbox").insertAdjacentElement("afterend",chips);
/* Con ratón: rueda y arrastre desplazan las etiquetas (en táctil ya se desliza con el dedo) */
function hscroll(el){let d=null,mv=0;
  el.addEventListener("wheel",e=>{if(el.scrollWidth<=el.clientWidth||Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;el.scrollLeft+=e.deltaY;e.preventDefault();},{passive:false});
  el.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.button)return;d={x:e.clientX,l:el.scrollLeft};mv=0;});
  addEventListener("pointermove",e=>{if(!d)return;const dx=e.clientX-d.x;if(Math.abs(dx)>5){mv=1;el.classList.add("drag");}if(mv)el.scrollLeft=d.l-dx;});
  addEventListener("pointerup",()=>{d=null;el.classList.remove("drag");});
  el.addEventListener("click",e=>{if(mv){e.stopPropagation();e.preventDefault();mv=0;}},true);}
hscroll(chips);const pl=document.getElementById("nav");if(pl)hscroll(pl);
document.addEventListener("click",e=>{const x=e.target.closest(".bdg span,.chips .fl");if(!x)return;e.stopImmediatePropagation();
  const f=x.dataset.f||KXI.orig(x);q.value=nrm(q.value.trim())===nrm(f)?"":f;q.dispatchEvent(new Event("input",{bubbles:true}));},true);
q.addEventListener("input",()=>$$(".chip.fl").forEach(c=>c.setAttribute("aria-pressed",nrm(q.value.trim())===nrm(c.dataset.f))));
document.addEventListener("visibilitychange",()=>document.documentElement.classList.toggle("pz",document.hidden));
/* Aviso para móvil e instalación */
const mn=$("#mnote");if(matchMedia("(pointer:coarse)").matches&&!DSK()&&!LS.g("kixki-mn",false))mn.hidden=false;
$("#mnx").addEventListener("click",()=>{mn.hidden=true;LS.s("kixki-mn",true);});
let DP;addEventListener("beforeinstallprompt",e=>{e.preventDefault();DP=e;$("#s-inst").hidden=false;});

/* --- estado desde GitHub (con caché de 1 día) --- */
const ago=d=>{const n=(Date.now()-Date.parse(d))/864e5;return n<1?"hoy":n<31?`hace ${Math.round(n)} días`:n<365?`hace ${Math.round(n/30)} meses`:`hace ${(n/365).toFixed(1)} años`;};
function ghShow(r,d){const old=(Date.now()-Date.parse(d.p))/864e5>365,w=old||d.a;
  const t=`★ ${d.s>=1e3?(d.s/1e3).toFixed(1)+"k":d.s} · Actualizada ${ago(d.p)}`+(d.a?" · Archivada":old?" · sin cambios en más de un año":"");
  $$(`.app[data-repo="${r}"]`).forEach(a=>{const o=a.querySelector(".gh");if(o)o.remove();a.querySelector(".links").insertAdjacentHTML("beforebegin",`<div class="gh${w?" old":""}">${w?"⚠ ":""}${t}</div>`);});}
(async()=>{const cache=LS.g("kixki-gh",{});
  for(const r of new Set(origs().map(a=>a.dataset.repo).filter(Boolean))){if(M.repos[r]){ghShow(r,M.repos[r]);continue;}let d=cache[r];if(d)ghShow(r,d);if(d&&Date.now()-d.t<864e5)continue;
    try{const j=await(await fetch("https://api.github.com/repos/"+r)).json();if(j.stargazers_count==null)break;
      d={t:Date.now(),s:j.stargazers_count,p:j.pushed_at,a:j.archived};cache[r]=d;LS.s("kixki-gh",cache);ghShow(r,d);}catch(e){break;}}})();

/* --- PWA y arranque --- */
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
try{if(DSK()&&!matchMedia("(prefers-reduced-motion:reduce)").matches&&!sessionStorage.getItem("kixki-boot")){sessionStorage.setItem("kixki-boot","1");ov("boot");}}catch(e){}
})();
/* Todo listo: Kixki (kixki.js) y sus logros (kixki2.js) arrancan con este aviso */
window.KXR=1;dispatchEvent(new Event("kixki-ready"));
})();
