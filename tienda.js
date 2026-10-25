/* Kixki Store · tienda.js
   Mejoras de tienda y accesibilidad, en un archivo aparte para no tocar la lógica de app.js:
   1) Preguntas de bienvenida (tipo de usuaria, root/Shizuku/ADB, versión de Android, intereses) → «Para ti» y avisos en cada app.
   2) Orden (A–Z, más estrellas, más actualizadas) y filtros («Solo las que puedo usar», «Me faltan»).
   3) «Ya la tengo» en cada app y «Copiar enlace» (abre la app con #app=Nombre).
   4) Accesibilidad: nombres únicos en las ☆, ventanas con rol de diálogo, foco que no se escapa, aviso de resultados.
   Estado en localStorage: kixki-perfil, kixki-have, kixki-ord. Textos [español, English] (se actualizan con el evento kixki-lang).
   Prueba: tools/test-tienda.mjs (los navegadores automáticos no ven la bienvenida salvo con ?bienvenida=1). */
(function(){
"use strict";
const root=document.documentElement;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const L=(es,en)=>window.KXI&&KXI.lang==="en"?en:es;
const nrm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* LS.g solo devuelve el dato si tiene el mismo tipo que el valor por defecto */
const LS={g(k,d){try{const v=localStorage.getItem(k);if(v==null)return d;const p=JSON.parse(v);return d!=null&&(p==null||typeof p!==typeof d||Array.isArray(p)!==Array.isArray(d))?d:p;}catch(e){return d;}},
  s(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const getJ=async u=>{try{const r=await fetch(u);return r.ok?await r.json():null;}catch(e){return null;}};
let tt;const toast=m=>{const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400);};
const origs=()=>$$("#app .cat:not(#favs):not(#news):not(#packs) .app");
const nm=a=>{const h=a.querySelector("h3");return h?h.textContent.trim():"";};

/* ---------- datos extra de apps.json (min = Android mínimo, priv = necesita Shizuku, root o ADB) y estadísticas ---------- */
let EXT={},ST={};
async function loadData(){
  const [d,m]=await Promise.all([getJ("apps.json"),getJ("data/meta.json")]);
  if(d&&Array.isArray(d.categories))d.categories.forEach(c=>(c.apps||[]).forEach(a=>{EXT[a.name]={min:+a.min||0,priv:a.priv?1:0,added:a.added||""};}));
  if(m&&m.repos&&typeof m.repos==="object")ST=m.repos;
}
const stat=a=>ST[a.dataset.repo]||null;

/* ---------- perfil ---------- */
/* el perfil se limpia siempre: si algo viene dañado o de otra versión, se usa un valor seguro */
const PRF=()=>{const p=LS.g("kixki-perfil",null);if(!p||typeof p!=="object"||Array.isArray(p)||p.v!==1)return null;
  if(p.skip)return {v:1,skip:1};
  const ok=["priv","look","mus","game","ctl","day"];
  return {v:1,t:["ini","dia","pro"].includes(p.t)?p.t:"dia",p:["si","no","?"].includes(p.p)?p.p:"?",
    a:Number.isFinite(+p.a)&&+p.a>=0&&+p.a<=40?Math.round(+p.a):0,i:Array.isArray(p.i)?p.i.filter(x=>ok.includes(x)):[]};};
const prof=()=>{const p=PRF();return p&&!p.skip?p:null;};
const INT=[
  ["priv","🛡️",["Privacidad","Privacy"],["privacidad","mensajeria"]],
  ["look","🎨",["Personalizar","Customize"],["decoracion","teclados","pantalla"]],
  ["mus","🎧",["Música","Music"],["musica"]],
  ["game","🎮",["Juegos","Games"],["emulacion"]],
  ["ctl","🧰",["Control y trucos","Control & tricks"],["control","utilidad","importante","sistemas"]],
  ["day","📸",["Fotos y día a día","Photos & daily life"],["fotos","internet","dia"]]];
const TIPO={ini:["empezando","just starting"],dia:["uso diario","everyday user"],pro:["avanzada/o","advanced"]};

/* ---------- avisos en cada app + botones «Ya la tengo» y «Copiar enlace» ---------- */
const haveSet=()=>new Set(LS.g("kixki-have",[]));
function decorate(){
  const p=prof(),have=haveSet();
  $$("#app .cat .app").forEach(a=>{
    const n=nm(a);if(!n||!a.querySelector(".star"))return;
    const x=EXT[n];
    a.classList.toggle("have",have.has(n));a.classList.remove("nope");
    const old=a.querySelector(".kq-bd");if(old)old.remove();
    const bd=[];
    if(p&&x){
      if(x.min&&p.a&&x.min>p.a){bd.push(["warn",L("Pide Android "+x.min+"+","Needs Android "+x.min+"+")]);a.classList.add("nope");}
      if(x.priv&&p.p!=="si")bd.push(["info",L("Necesita Shizuku, root o ADB","Needs Shizuku, root or ADB")]);
    }
    if(bd.length){const el=document.createElement("div");el.className="kq-bd";el.innerHTML=bd.map(([c,t])=>`<span class="kq-b ${c}">${t}</span>`).join("");
      (a.querySelector(".bdg")||a.querySelector(".line")).after(el);}
    let row=a.querySelector(".kq-row");
    if(!row){row=document.createElement("div");row.className="kq-row";
      row.innerHTML=`<button type="button" class="kq-have" data-n="${esc(n)}" aria-pressed="false"></button><button type="button" class="kq-link" data-n="${esc(n)}"></button>`;
      const lk=a.querySelector(".links");if(lk)lk.before(row);else a.querySelector(".info").append(row);}
    const hb=row.querySelector(".kq-have"),on=have.has(n);
    hb.setAttribute("aria-pressed",on);hb.textContent=on?L("✓ Ya la tengo","✓ Got it"):L("＋ Ya la tengo","＋ I have it");
    hb.setAttribute("aria-label",L("Ya la tengo: ","I have it: ")+n);
    const lb=row.querySelector(".kq-link");lb.textContent=L("🔗 Enlace","🔗 Link");lb.setAttribute("aria-label",L("Copiar enlace a ","Copy link to ")+n);
    const sb=a.querySelector(".star");if(sb)sb.setAttribute("aria-label",L("Favorita: ","Favorite: ")+n);
  });
  counters();emptyMsgs();
}
function counters(){
  const td=$("#kq-todo");if(!td)return;
  const all=origs().length,have=haveSet(),mine=origs().filter(a=>have.has(nm(a))).length;
  td.textContent=L(`Me faltan (${all-mine})`,`Missing (${all-mine})`);
}
function emptyMsgs(){
  const us=root.classList.contains("kq-us"),td=root.classList.contains("kq-td");
  $$("#app .cat:not(#favs):not(#news):not(#packs)").forEach(s=>{
    const vis=[...s.querySelectorAll(".app")].filter(a=>!(us&&a.classList.contains("nope"))&&!(td&&a.classList.contains("have"))).length;
    let m=s.querySelector(".kq-none");
    if(!vis&&(us||td)){if(!m){m=document.createElement("p");m.className="kq-none";s.querySelector(".panel").append(m);}m.textContent=L("Ninguna app con este filtro 🐑","No apps match this filter 🐑");}
    else if(m)m.remove();
  });
  dispatchEvent(new Event("resize"));/* app.js recalcula «Leer más» al volver a ver tarjetas */
}

/* ---------- orden ---------- */
const ORD=["orig","az","stars","fresh"];
function sortApps(mode){
  if(!ORD.includes(mode))mode="orig";
  $$("#app .cat:not(#favs):not(#news):not(#packs)").forEach(s=>{
    const panel=s.querySelector(".panel"),list=[...panel.querySelectorAll(":scope > .app")];
    list.forEach((a,i)=>{if(a.dataset.o==null)a.dataset.o=i;});
    const key={orig:a=>+a.dataset.o,az:a=>nrm(nm(a)),
      stars:a=>-(stat(a)?stat(a).s:-1),fresh:a=>{const t=stat(a);return -(t?Date.parse(t.p)||0:0);}}[mode];
    list.sort((a,b)=>{const x=key(a),y=key(b);return x<y?-1:x>y?1:+a.dataset.o-+b.dataset.o;});
    const tail=panel.querySelector(".kq-none");list.forEach(a=>tail?panel.insertBefore(a,tail):panel.append(a));
  });
}

/* ---------- barra de herramientas + «Para ti» ---------- */
function buildTools(){
  if($("#kq-tools"))return;
  const anchor=$(".chips")||$("#searchbox");if(!anchor)return;
  const el=document.createElement("div");el.id="kq-tools";el.className="kq-tools";el.setAttribute("role","group");
  el.innerHTML=`<label class="kq-lbl"><span id="kq-ol"></span><select id="kq-ord" class="kq-sel"></select></label>
    <button type="button" class="chip kq-t" id="kq-usable" aria-pressed="false" hidden></button>
    <button type="button" class="chip kq-t" id="kq-todo" aria-pressed="false"></button>
    <button type="button" class="chip kq-t" id="kq-prf"></button>`;
  anchor.insertAdjacentElement("afterend",el);
  const pt=document.createElement("section");pt.id="parati";pt.className="parati";pt.hidden=true;pt.setAttribute("aria-labelledby","pt-h");
  el.insertAdjacentElement("afterend",pt);
  const ord=LS.g("kixki-ord","orig");$("#kq-ord").value=ORD.includes(ord)?ord:"orig";
  $("#kq-ord").addEventListener("change",e=>{LS.s("kixki-ord",e.target.value);sortApps(e.target.value);});
  $("#kq-usable").addEventListener("click",e=>{const on=root.classList.toggle("kq-us");e.currentTarget.setAttribute("aria-pressed",on);emptyMsgs();});
  $("#kq-todo").addEventListener("click",e=>{const on=root.classList.toggle("kq-td");e.currentTarget.setAttribute("aria-pressed",on);emptyMsgs();});
  $("#kq-prf").addEventListener("click",()=>openWizard());
  $("#parati").addEventListener("click",e=>{
    if(e.target.closest("#pt-ed"))openWizard();
    const o=e.target.closest("[data-open]");if(o&&window.KX)KX.openWin(o.dataset.open);
  });
}
function labels(){
  const ol=$("#kq-ol");if(ol)ol.textContent=L("Orden","Sort");
  const sel=$("#kq-ord");if(sel){const sv=LS.g("kixki-ord","orig"),v=sel.value||(ORD.includes(sv)?sv:"orig");sel.innerHTML=[["orig",L("Original","Original")],["az","A–Z"],["stars",L("Más estrellas ★","Most stars ★")],["fresh",L("Más actualizadas","Recently updated")]].map(([k,t])=>`<option value="${k}">${t}</option>`).join("");sel.value=v||"orig";}
  const t=$("#kq-tools");if(t)t.setAttribute("aria-label",L("Orden y filtros","Sort and filters"));
  const u=$("#kq-usable");if(u){u.textContent=L("Solo las que puedo usar","Only ones I can use");const p=prof();u.hidden=!(p&&(p.a||p.p!=="si"));if(u.hidden&&root.classList.contains("kq-us")){root.classList.remove("kq-us");u.setAttribute("aria-pressed","false");}}
  const pr=$("#kq-prf");if(pr)pr.textContent=prof()?L("Mis respuestas","My answers"):L("Conócenos 🐑","Get to know me 🐑");
  const mi=$("#s-prf");if(mi)mi.textContent=L("Mi perfil…","My profile…");
  counters();
}
function recs(p){
  const have=haveSet(),cats=new Set();
  (p.i||[]).forEach(k=>{const it=INT.find(x=>x[0]===k);if(it)it[3].forEach(c=>cats.add(c));});
  const okApp=a=>{const n=nm(a),x=EXT[n]||{};
    if(have.has(n))return false;if(p.a&&x.min&&x.min>p.a)return false;if(x.priv&&p.p!=="si")return false;return true;};
  const score=a=>{const s=stat(a);return s?s.s:0;};
  const pool=origs().filter(okApp);
  const byCat=c=>pool.filter(a=>a.closest(".cat").id===c).sort((a,b)=>score(b)-score(a));
  const out=[],per={};
  const take=a=>{const c=a.closest(".cat").id;if(out.includes(a)||(per[c]||0)>=2||out.length>=6)return;per[c]=(per[c]||0)+1;out.push(a);};
  if(p.t==="ini")byCat("tiendas").slice(0,2).forEach(take);
  /* reparte por turnos entre las categorías elegidas */
  const lists=[...cats].map(byCat);
  for(let r=0;r<2;r++)lists.forEach(l=>{if(l[r])take(l[r]);});
  if(out.length<3)byCat("tiendas").concat(byCat("importante")).forEach(take);
  return out;
}
function renderParati(){
  const pt=$("#parati");if(!pt)return;const p=prof();
  if(!p){pt.hidden=true;pt.innerHTML="";return;}
  const list=recs(p);
  const ints=(p.i||[]).map(k=>{const it=INT.find(x=>x[0]===k);return it?it[2][L(0,1)]:"";}).filter(Boolean);
  const sum=[L("Soy ","I'm ")+(TIPO[p.t]?TIPO[p.t][L(0,1)]:"—"),
    p.a?"Android "+p.a+(p.a>=14?"+":""):L("Android: no sé","Android: not sure"),
    p.p==="si"?L("con root/Shizuku/ADB","with root/Shizuku/ADB"):L("sin root/Shizuku/ADB","no root/Shizuku/ADB")].join(" · ")+(ints.length?" · "+ints.join(", "):"");
  pt.innerHTML=`<div class="pt-top"><b id="pt-h">🐑 ${L("Para ti","For you")}</b><span class="pt-s">${esc(sum)}</span></div>
    <div class="pt-l">${list.map(a=>`<button type="button" class="pt-go" data-go="${esc(nm(a))}">${esc(nm(a))}</button>`).join("")}${p.t==="ini"?`<button type="button" class="pt-go pk" data-open="packs">🎁 ${L("Pack «Para empezar»","«Getting started» pack")}</button>`:""}${list.length?"":`<span class="pt-n">${L("Con tus respuestas no encontré nada nuevo que sugerir.","Nothing new to suggest with your answers.")}</span>`}</div>
    <button type="button" class="pt-ed" id="pt-ed">${L("Cambiar mis respuestas","Change my answers")}</button>`;
  pt.hidden=false;
}

/* ---------- ventana de bienvenida (4 preguntas) ---------- */
const STEPS=[
 {k:"t",q:["¿Cómo te describes?","How would you describe yourself?"],note:["Así sé cuánto explicarte.","So I know how much to explain."],opts:[
   ["ini","🌱",["Estoy empezando","I'm just starting"],["Quiero lo básico, fácil de usar","I want the basics, easy to use"]],
   ["dia","📱",["Uso mi celular a diario","I use my phone every day"],["Sé instalar apps y cambiar ajustes","I can install apps and change settings"]],
   ["pro","🛠️",["Me gusta trastear","I like to tinker"],["No me asustan los permisos ni los comandos","Permissions and commands don't scare me"]]]},
 {k:"p",q:["¿Tienes root, Shizuku o usas ADB?","Do you have root, Shizuku, or use ADB?"],note:["Son herramientas que dan permisos extra a algunas apps. Si no sabes qué son, responde «No sé»: no pasa nada.","Tools that give some apps extra permissions. If you don't know what they are, answer «Not sure»: that's fine."],opts:[
   ["si","✅",["Sí, algo de eso","Yes, some of that"]],["no","❌",["No, nada de eso","No, none of that"]],["?","🤷",["No sé qué es","Not sure"]]]},
 {k:"a",q:["¿Qué versión de Android tiene tu celular?","Which Android version is your phone on?"],note:["La ves en Ajustes → Acerca del teléfono.","See it in Settings → About phone."],grid:1,opts:[
   [7,"",["Android 7 o menos","Android 7 or lower"]],[8,"",["Android 8","Android 8"]],[9,"",["Android 9","Android 9"]],[10,"",["Android 10","Android 10"]],
   [11,"",["Android 11","Android 11"]],[12,"",["Android 12","Android 12"]],[13,"",["Android 13","Android 13"]],[14,"",["Android 14 o más","Android 14 or higher"]],[0,"🤷",["No sé","Not sure"]]]},
 {k:"i",multi:1,q:["¿Qué te interesa?","What are you into?"],note:["Elige las que quieras, o ninguna.","Pick any, or none."],opts:INT.map(x=>[x[0],x[1],x[2]])}];
let W=null,wi=0,lastOut=null;
function ensureWizard(){
  let o=$("#kq");if(o)return o;
  document.body.insertAdjacentHTML("beforeend",`<div id="kq" class="ovl" hidden><div class="box kq" role="dialog" aria-modal="true" aria-labelledby="kq-t"><div class="bt"><span id="kq-t"></span><button type="button" class="x" data-x="kq"></button></div><div id="kq-b" class="kq-b0"></div></div></div>`);
  o=$("#kq");
  /* si se cierra sin terminar (✕, Escape o tocar fuera), no se vuelve a preguntar */
  new MutationObserver(()=>{if(o.hidden&&!PRF())LS.s("kixki-perfil",{v:1,skip:1});if(o.hidden){decorate();renderParati();labels();}}).observe(o,{attributes:true,attributeFilter:["hidden"]});
  return o;
}
function openWizard(){
  const o=ensureWizard(),p=prof()||{};
  W={t:p.t||null,p:p.p||null,a:p.a==null?null:p.a,i:Array.isArray(p.i)?p.i.slice():[]};wi=0;
  o.hidden=false;stepView();
}
function stepView(){
  const s=STEPS[wi],b=$("#kq-b"),x=$("#kq .x");
  $("#kq-t").textContent=L("Conozcámonos 🐑","Let's get to know each other 🐑");
  x.setAttribute("aria-label",L("Cerrar","Close"));x.textContent="✕";
  const cur=W[s.k],sel=v=>s.multi?W.i.includes(v):(cur!=null&&String(cur)===String(v));
  b.innerHTML=`<p class="kq-n">${L("Pregunta","Question")} ${wi+1} / ${STEPS.length}</p>
    <h2 class="kq-q" id="kq-q" tabindex="-1">${s.q[L(0,1)]}</h2><p class="kq-note">${s.note[L(0,1)]}</p>
    <div class="kq-opts${s.grid?" g":""}" role="${s.multi?"group":"radiogroup"}" aria-labelledby="kq-q">${s.opts.map(([v,e,lab,sub])=>`<button type="button" class="btn kq-o${sel(v)?" p":""}" data-v="${v}" ${s.multi?"aria-pressed":"aria-checked"}="${sel(v)}" role="${s.multi?"button":"radio"}">${e?`<span class="kq-e" aria-hidden="true">${e}</span>`:""}<span class="kq-tx">${lab[L(0,1)]}${sub?`<small>${sub[L(0,1)]}</small>`:""}</span></button>`).join("")}</div>
    <div class="kq-nav">${wi?`<button type="button" class="btn kq-back">← ${L("Atrás","Back")}</button>`:`<button type="button" class="btn kq-skip">${L("Saltar","Skip")}</button>`}${s.multi?`<button type="button" class="btn p kq-done">${L("Listo","Done")} ✓</button>`:(cur!=null?`<button type="button" class="btn p kq-next">${L("Siguiente","Next")} →</button>`:"")}</div>`;
  const q=$("#kq-q");if(q)q.focus({preventScroll:true});
}
function finish(){
  LS.s("kixki-perfil",{v:1,t:W.t||"dia",p:W.p||"?",a:W.a||0,i:W.i,ts:Date.now()});
  $("#kq").hidden=true;
  toast(L("¡Listo! Preparé «Para ti» 🐑","Done! I prepared «For you» 🐑"));
}
document.addEventListener("click",e=>{
  const o=e.target.closest("#kq .kq-o");
  if(o){const s=STEPS[wi],v=o.dataset.v;
    if(s.multi){const i=W.i.indexOf(v);i<0?W.i.push(v):W.i.splice(i,1);o.classList.toggle("p");o.setAttribute("aria-pressed",W.i.includes(v));}
    else{W[s.k]=s.k==="a"?+v:v;if(wi<STEPS.length-1){wi++;stepView();}}
    return;}
  if(e.target.closest("#kq .kq-next")){wi=Math.min(wi+1,STEPS.length-1);stepView();return;}
  if(e.target.closest("#kq .kq-back")){wi=Math.max(0,wi-1);stepView();return;}
  if(e.target.closest("#kq .kq-skip")){LS.s("kixki-perfil",{v:1,skip:1});$("#kq").hidden=true;return;}
  if(e.target.closest("#kq .kq-done")){finish();return;}
  if(e.target.closest("#s-prf")){const sm=$("#sm");if(sm)sm.hidden=true;openWizard();return;}
  /* ya la tengo */
  const h=e.target.closest(".kq-have");
  if(h){const n=h.dataset.n,set=haveSet();set.has(n)?set.delete(n):set.add(n);LS.s("kixki-have",[...set]);decorate();renderParati();
    toast(set.has(n)?L("Marcada: ya la tienes ✓","Marked: you have it ✓"):L("Desmarcada","Unmarked"));return;}
  /* copiar enlace */
  const l=e.target.closest(".kq-link");
  if(l){const u=location.origin+location.pathname+"#app="+encodeURIComponent(l.dataset.n);
    const ok=()=>toast(L("Enlace copiado ✓","Link copied ✓")),bad=()=>toast(L("No se pudo copiar. Cópialo a mano:","Couldn't copy. Copy it by hand: ")+u);
    try{navigator.clipboard.writeText(u).then(ok,bad);}catch(x){bad();}return;}
});

/* ---------- enlace directo #app=Nombre ---------- */
function deepLink(){
  const m=location.hash.match(/^#app=(.+)$/);if(!m)return;
  let n;try{n=decodeURIComponent(m[1]);}catch(e){return;}
  const a=origs().find(x=>nrm(nm(x))===nrm(n));if(!a)return;
  const b=document.createElement("button");b.dataset.go=nm(a);b.hidden=true;document.body.append(b);b.click();b.remove();/* app.js ya sabe «ir a una app» */
}

/* ---------- accesibilidad ---------- */
function a11y(){
  [["run","Ejecutar","Run"],["game","Salta Vallas","Jump the fences"],["qr","Ábrelo en tu móvil","Open on your phone"]].forEach(([id,es,en])=>{
    const box=$("#"+id+" .box");if(box){box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-label",L(es,en));}});
  const empty=$("#empty");if(empty&&!empty.getAttribute("role"))empty.setAttribute("role","status");
  if(!$("#kq-live")){const lv=document.createElement("p");lv.id="kq-live";lv.className="sr";lv.setAttribute("role","status");lv.setAttribute("aria-live","polite");document.body.append(lv);}
}
let lt;
function announce(){
  clearTimeout(lt);lt=setTimeout(()=>{
    const q=$("#q"),lv=$("#kq-live");if(!q||!lv)return;
    if(!q.value.trim()){lv.textContent="";return;}
    const n=origs().filter(a=>!a.hidden).length;
    lv.textContent=n?L(`${n} ${n===1?"app encontrada":"apps encontradas"}`,`${n} ${n===1?"app found":"apps found"}`):L("Sin resultados","No results");
  },500);
}
/* el foco no se escapa de una ventana abierta y vuelve a donde estaba al cerrarla */
let outside=null;const opener=new WeakMap();
document.addEventListener("focusin",e=>{if(!e.target.closest(".ovl"))outside=e.target;});
new MutationObserver(ms=>ms.forEach(m=>{const o=m.target;if(!o.classList||!o.classList.contains("ovl"))return;
  if(!o.hidden)opener.set(o,outside);
  else{const el=opener.get(o);opener.delete(o);if(el&&el.isConnected&&el.offsetParent!==null&&!el.closest(".ovl"))try{el.focus({preventScroll:true});}catch(x){}}
})).observe(document.body,{subtree:true,attributes:true,attributeFilter:["hidden"]});
document.addEventListener("keydown",e=>{
  if(e.key!=="Tab")return;const o=$$(".ovl:not([hidden])").pop();if(!o)return;
  const f=[...o.querySelectorAll("button,[href],input,select,textarea,[tabindex]")].filter(x=>!x.disabled&&x.tabIndex>=0&&x.offsetParent!==null);if(!f.length)return;
  const first=f[0],last=f[f.length-1],ac=document.activeElement,inside=o.contains(ac);
  if(e.shiftKey&&(!inside||ac===first)){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&(!inside||ac===last)){e.preventDefault();first.focus();}
});

/* ---------- arranque ---------- */
function menuItem(){
  const sm=$("#sm");if(!sm||$("#s-prf"))return;
  sm.insertAdjacentHTML("beforeend",`<button type="button" class="sm" id="s-prf"></button>`);
}
function maybeWelcome(){
  if(PRF())return;
  if(navigator.webdriver&&!/[?&]bienvenida=1/.test(location.search))return;/* los navegadores de prueba no la ven, salvo con ?bienvenida=1 */
  let tries=0;
  const go=()=>{const b=$("#boot");if(b&&!b.hidden&&tries++<20){setTimeout(go,400);return;}
    if(PRF()||$$(".ovl:not([hidden])").length){return;}openWizard();};
  setTimeout(go,1200);
}
async function start(){
  await loadData();
  menuItem();a11y();buildTools();labels();
  const ord=LS.g("kixki-ord","orig");if(ORD.includes(ord)&&ord!=="orig")sortApps(ord);
  decorate();renderParati();
  $("#q").addEventListener("input",announce);
  addEventListener("kixki-lang",()=>{labels();decorate();renderParati();a11y();if($("#kq")&&!$("#kq").hidden)stepView();});
  addEventListener("hashchange",deepLink);
  setTimeout(deepLink,500);
  maybeWelcome();
  window.KXT={open:openWizard,profile:prof,reset(){try{localStorage.removeItem("kixki-perfil");}catch(e){}decorate();renderParati();labels();},sort:sortApps,recs:()=>{const p=prof();return p?recs(p).map(nm):[];}};
}
if(window.KXR)start();else addEventListener("kixki-ready",start,{once:true});
})();
