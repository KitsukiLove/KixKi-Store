/* =========================================================
   Tienda: bienvenida, «Para ti», orden, filtros, «Ya la tengo», enlace directo y accesibilidad (tienda.js)
   node tools/test-tienda.mjs [movil]
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
const mobile=process.argv.slice(2).includes("movil");
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
const PERFIL=(o)=>`localStorage.setItem("kixki-perfil",${JSON.stringify(JSON.stringify({v:1,...o}))});`;
const apps=`[...document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .app")]`;

/* ---- 1 · sin perfil: los navegadores de prueba no ven la bienvenida, con ?bienvenida=1 sí ---- */
console.log("\n1 · Bienvenida");
let t=await open({mobile});let pg=t.pg,ev=(f,a)=>pg.evaluate(f,a);
await sleep(1800);
check(await ev(()=>!document.querySelector("#kq")||document.querySelector("#kq").hidden),"por defecto (navegador de prueba) no sale sola");
check(await ev(()=>!!document.querySelector("#kq-tools")&&!!document.querySelector("#kq-ord")),"la barra de orden y filtros existe");
check(await ev(()=>document.querySelector("#parati").hidden),"sin perfil no hay «Para ti»");
await t.close();

t=await open({mobile,query:"?bienvenida=1"});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
await pg.waitForSelector("#kq:not([hidden])",{timeout:9000}).catch(()=>{});
check(await ev(()=>{const o=document.querySelector("#kq");return !!o&&!o.hidden;}),"con ?bienvenida=1 aparece la ventana");
check(await ev(()=>{const b=document.querySelector("#kq .box");return b.getAttribute("role")==="dialog"&&b.getAttribute("aria-modal")==="true";}),"la ventana es un diálogo accesible");
check(await ev(()=>document.activeElement&&document.activeElement.id==="kq-q"),"el foco va a la pregunta");
const q1=await ev(()=>document.querySelector("#kq-q").textContent);check(/describes/.test(q1),"pregunta 1: tipo de usuaria",q1);
await ev(()=>document.querySelector('#kq .kq-o[data-v="pro"]').click());await sleep(100);
check(await ev(()=>/root, Shizuku/.test(document.querySelector("#kq-q").textContent)),"pregunta 2: root / Shizuku / ADB");
await ev(()=>document.querySelector("#kq .kq-back").click());await sleep(80);
check(await ev(()=>document.querySelector('#kq .kq-o[data-v="pro"]').getAttribute("aria-checked")==="true"),"«Atrás» recuerda lo elegido");
await ev(()=>document.querySelector("#kq .kq-next").click());await sleep(80);
await ev(()=>document.querySelector('#kq .kq-o[data-v="si"]').click());await sleep(100);
check(await ev(()=>/versión de Android/.test(document.querySelector("#kq-q").textContent)),"pregunta 3: versión de Android");
await ev(()=>document.querySelector('#kq .kq-o[data-v="12"]').click());await sleep(100);
check(await ev(()=>/interesa/.test(document.querySelector("#kq-q").textContent)),"pregunta 4: intereses (varias)");
await ev(()=>{document.querySelector('#kq .kq-o[data-v="priv"]').click();document.querySelector('#kq .kq-o[data-v="mus"]').click();});
check(await ev(()=>document.querySelectorAll('#kq .kq-o[aria-pressed="true"]').length===2),"se pueden marcar varias");
await ev(()=>document.querySelector("#kq .kq-done").click());await sleep(300);
const pf=await ev(()=>JSON.parse(localStorage.getItem("kixki-perfil")));
check(pf&&pf.t==="pro"&&pf.p==="si"&&pf.a===12&&pf.i.join()==="priv,mus","el perfil se guarda",JSON.stringify(pf));
check(await ev(()=>document.querySelector("#kq").hidden),"la ventana se cierra al terminar");
const pt=await ev(()=>({vis:!document.querySelector("#parati").hidden,names:[...document.querySelectorAll("#parati .pt-go[data-go]")].map(b=>b.dataset.go),txt:document.querySelector("#parati .pt-s").textContent}));
check(pt.vis&&pt.names.length>=3&&pt.names.length<=6,"aparece «Para ti» con 3–6 sugerencias",pt.names.join(", "));
check(await ev(n=>{const all=[...document.querySelectorAll("#app .cat .app h3")].map(h=>h.textContent);return n.every(x=>all.includes(x));},pt.names),"todas las sugerencias existen en el catálogo");
check(/Android 12/.test(pt.txt)&&/Privacidad/.test(pt.txt),"el resumen dice lo que respondiste",pt.txt);
/* una sugerencia lleva a la app */
await ev(()=>document.querySelector("#parati .pt-go[data-go]").click());await sleep(500);
check(await ev(()=>!!document.querySelector(".app.sel,.app.hl")),"tocar una sugerencia abre y resalta la app");
check(t.errs.filter(e=>!/404/.test(e)).length===0,"sin errores",t.errs.join(" | ").slice(0,200));
await t.close();

/* ---- 2 · saltar y cerrar no vuelven a preguntar ---- */
console.log("\n2 · Saltar");
t=await open({mobile,query:"?bienvenida=1"});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
await pg.waitForSelector("#kq:not([hidden])",{timeout:9000}).catch(()=>{});
await ev(()=>document.querySelector("#kq .kq-skip").click());await sleep(200);
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-perfil")).skip===1),"«Saltar» se recuerda");
check(await ev(()=>document.querySelector("#parati").hidden),"saltando no hay «Para ti»");
await ev(()=>document.querySelector("#kq-prf").click());await sleep(150);
check(await ev(()=>!document.querySelector("#kq").hidden),"«Conócenos» lo vuelve a abrir");
await pg.keyboard.press("Escape");await sleep(150);
check(await ev(()=>document.querySelector("#kq").hidden),"Escape lo cierra");
await t.close();

/* ---- 3 · avisos según el perfil ---- */
console.log("\n3 · Avisos y filtros según el perfil");
t=await open({mobile,init:PERFIL({t:"ini",p:"no",a:8,i:["priv"]})});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
const fl=await ev(()=>{const A=[...document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .app")];const g=n=>A.find(a=>a.querySelector("h3").textContent===n);
  const tx=a=>a?[...a.querySelectorAll(".kq-b")].map(x=>x.textContent):null;
  return {widgets:tx(g("Widgets Pro")),widgetsNope:g("Widgets Pro").classList.contains("nope"),canta:tx(g("Canta")),cantaNope:g("Canta").classList.contains("nope"),aurora:tx(g("Aurora Store")),ba:tx(g("Bitwarden")),nope:A.filter(a=>a.classList.contains("nope")).length};});
check(fl.widgets&&fl.widgets.some(x=>/Android 12/.test(x))&&fl.widgetsNope,"con Android 8, Widgets Pro avisa «Pide Android 12+»",fl.widgets+"");
check(fl.canta&&fl.canta.some(x=>/Shizuku/.test(x))&&!fl.cantaNope,"sin Shizuku/root, Canta avisa que lo necesita (sin atenuar)",fl.canta+"");
check(fl.aurora&&fl.aurora.length===0,"una app normal no lleva avisos");
check(fl.nope>=3,"varias apps quedan atenuadas por la versión",String(fl.nope));
const rec=await ev(()=>KXT.recs());
check(!rec.includes("Canta")&&!rec.includes("Widgets Pro")&&!rec.includes("PrivacyFlip"),"«Para ti» no sugiere apps que no puede usar",rec.join(", "));
/* en modo PC las ventanas cerradas ya ocultan sus apps: por eso se compara antes y después */
await ev(()=>document.querySelectorAll(".cat.min").forEach(c=>c.classList.remove("min")));/* abre todas las ventanas para poder medir */
const shown=()=>ev(a=>eval(a).filter(x=>getComputedStyle(x).display!=="none").length,apps);
const vis0=await shown();
await ev(()=>document.querySelector("#kq-usable").click());await sleep(250);
const vis1=await shown();
check(!(await ev(()=>document.querySelector("#kq-usable").hidden))&&vis1<vis0,"«Solo las que puedo usar» oculta las atenuadas",vis0+" → "+vis1);
await ev(()=>document.querySelector("#kq-usable").click());await sleep(150);
check((await shown())===vis0,"al apagarlo vuelven todas las que se veían",vis0+" → "+(await shown()));
check(t.errs.filter(e=>!/404/.test(e)).length===0,"sin errores",t.errs.join(" | ").slice(0,200));
await t.close();

/* ---- 4 · orden ---- */
console.log("\n4 · Orden");
t=await open({mobile});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
const firstNames=()=>ev(()=>{const s=document.querySelector("#privacidad");return [...s.querySelectorAll(".panel > .app h3")].map(h=>h.textContent);});
const orig=await firstNames();
await ev(()=>{const s=document.querySelector("#kq-ord");s.value="az";s.dispatchEvent(new Event("change",{bubbles:true}));});await sleep(150);
const az=await firstNames();
check(az.join()===[...az].sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase(),"es")).join()&&az.join()!==orig.join(),"A–Z ordena",az.slice(0,4).join(", "));
await ev(()=>{const s=document.querySelector("#kq-ord");s.value="stars";s.dispatchEvent(new Event("change",{bubbles:true}));});await sleep(150);
const st=await ev(()=>{const s=document.querySelector("#privacidad");return [...s.querySelectorAll(".panel > .app")].map(a=>({n:a.querySelector("h3").textContent,r:a.dataset.repo||""}));});
const meta=await ev(()=>fetch("data/meta.json").then(r=>r.json()));
const stars=st.map(x=>x.r&&meta.repos[x.r]?meta.repos[x.r].s:-1);
check(stars.every((v,i)=>i===0||stars[i-1]>=v),"«Más estrellas» va de mayor a menor",stars.join(","));
await ev(()=>{const s=document.querySelector("#kq-ord");s.value="fresh";s.dispatchEvent(new Event("change",{bubbles:true}));});await sleep(150);
const fr=await ev(()=>{const s=document.querySelector("#privacidad");return [...s.querySelectorAll(".panel > .app")].map(a=>a.dataset.repo||"");});
const ps=fr.map(r=>r&&meta.repos[r]?Date.parse(meta.repos[r].p):0);
check(ps.every((v,i)=>i===0||ps[i-1]>=v),"«Más actualizadas» va de la más nueva a la más vieja");
await ev(()=>{const s=document.querySelector("#kq-ord");s.value="orig";s.dispatchEvent(new Event("change",{bubbles:true}));});await sleep(150);
check((await firstNames()).join()===orig.join(),"«Original» deja todo como estaba");
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-ord"))==="orig"),"se recuerda el orden elegido");
await t.close();
t=await open({mobile,init:`localStorage.setItem("kixki-ord",'"az"');`});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
check(await ev(()=>document.querySelector("#kq-ord").value==="az"),"al recargar mantiene A–Z");
await t.close();

/* ---- 5 · ya la tengo, enlace ---- */
console.log("\n5 · «Ya la tengo» y enlace directo");
t=await open({mobile});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
const tot=await ev(()=>document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .app").length);
const lab0=await ev(()=>document.querySelector("#kq-todo").textContent);
check(new RegExp("\\("+tot+"\\)").test(lab0),"«Me faltan» cuenta todas al empezar",lab0);
await ev(()=>document.querySelector('#app .kq-have[data-n="Aurora Store"]').click());await sleep(200);
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-have")).includes("Aurora Store")),"se guarda «Ya la tengo»");
check(new RegExp("\\("+(tot-1)+"\\)").test(await ev(()=>document.querySelector("#kq-todo").textContent)),"«Me faltan» baja en uno");
check(await ev(()=>document.querySelector('#app .kq-have[data-n="Aurora Store"]').getAttribute("aria-pressed")==="true"),"el botón queda marcado");
await ev(()=>document.querySelector("#kq-todo").click());await sleep(250);
check(await ev(()=>{const a=[...document.querySelectorAll("#app .cat .app")].find(x=>x.querySelector("h3").textContent==="Aurora Store"&&!x.closest("#favs,#news"));return getComputedStyle(a).display==="none";}),"«Me faltan» oculta las que ya tengo");
await ev(()=>document.querySelector("#kq-todo").click());await sleep(150);
await t.close();
t=await open({mobile,init:`localStorage.setItem("kixki-have",'["Aurora Store"]');`});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
check(await ev(()=>document.querySelector('#app .kq-have[data-n="Aurora Store"]').getAttribute("aria-pressed")==="true"),"al recargar sigue marcada");
await t.close();
t=await open({mobile,query:"#app=Bitwarden"});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);await sleep(1500);
check(await ev(()=>{const a=document.querySelector("#privacidad .app.sel,#privacidad .app.hl");return !!a&&a.querySelector("h3").textContent==="Bitwarden";}),"#app=Bitwarden abre y resalta Bitwarden");
const ln=await ev(()=>{let got="";navigator.clipboard.writeText=async s=>{got=s;};document.querySelector('#app .kq-link[data-n="Signal"]').click();return new Promise(r=>setTimeout(()=>r(got),200));});
check(/#app=Signal$/.test(ln),"«🔗 Enlace» copia un enlace con #app=",ln);
await t.close();

/* ---- 6 · accesibilidad ---- */
console.log("\n6 · Accesibilidad");
t=await open({mobile});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
const lab=await ev(()=>{const L=[...document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .star")].map(b=>b.getAttribute("aria-label"));return {n:L.length,u:new Set(L).size};});
check(lab.n>=60&&lab.u===lab.n,"cada ☆ tiene un nombre distinto",lab.u+"/"+lab.n);
check(await ev(()=>["run","game","qr"].every(i=>{const b=document.querySelector("#"+i+" .box");return b.getAttribute("role")==="dialog"&&b.getAttribute("aria-modal")==="true"&&b.getAttribute("aria-label");})),"«Ejecutar», juego y QR son diálogos con nombre");
await ev(()=>{window.__op=document.querySelector("#q");document.querySelector("#q").focus();});
await pg.keyboard.press("Control+k");await sleep(200);
let fo=[];for(let i=0;i<12;i++){await pg.keyboard.press("Tab");fo.push(await ev(()=>!!document.activeElement.closest("#run")));}
check(fo.every(Boolean),"con Tab el foco no se sale de «Ejecutar»");
await pg.keyboard.press("Shift+Tab");check(await ev(()=>!!document.activeElement.closest("#run")),"ni con Mayús+Tab");
await pg.keyboard.press("Escape");await sleep(200);
check(await ev(()=>document.activeElement&&document.activeElement.id==="q"),"al cerrar con Escape el foco vuelve a donde estaba");
await ev(()=>{const q=document.querySelector("#q");q.value="bitwarden";q.dispatchEvent(new Event("input",{bubbles:true}));});await sleep(900);
check(/1 app encontrada/.test(await ev(()=>document.querySelector("#kq-live").textContent)),"un lector de pantalla oye «1 app encontrada»");
await ev(()=>{const q=document.querySelector("#q");q.value="zzxqwv";q.dispatchEvent(new Event("input",{bubbles:true}));});await sleep(900);
check(/Sin resultados/.test(await ev(()=>document.querySelector("#kq-live").textContent))&&await ev(()=>document.querySelector("#empty").getAttribute("role")==="status"),"y «Sin resultados» cuando no hay");
await t.close();

/* ---- 7 · inglés y datos dañados ---- */
console.log("\n7 · Inglés y datos dañados");
t=await open({mobile,init:PERFIL({t:"dia",p:"?",a:0,i:["look"]})});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
await ev(()=>KXI.set("en"));await sleep(300);
const en=await ev(()=>({ol:document.querySelector("#kq-ol").textContent,pt:document.querySelector("#pt-h").textContent,todo:document.querySelector("#kq-todo").textContent,have:document.querySelector(".kq-have").textContent,star:document.querySelector("#app .star").getAttribute("aria-label")}));
check(en.ol==="Sort"&&/For you/.test(en.pt)&&/Missing/.test(en.todo)&&/have it|Got it/.test(en.have)&&/^Favorite:/.test(en.star),"todo cambia a inglés",JSON.stringify(en));
await ev(()=>KXI.set("es"));await sleep(300);
check(await ev(()=>document.querySelector("#kq-ol").textContent==="Orden"),"y vuelve al español");
await t.close();
for(const bad of ['"x"','42','null','[1,2]','{"v":1,"t":5,"a":"x","i":"no"}','{"v":2}']){
  t=await open({mobile,init:`localStorage.setItem("kixki-perfil",${JSON.stringify(bad)});localStorage.setItem("kixki-have",${JSON.stringify(bad)});localStorage.setItem("kixki-ord",${JSON.stringify(bad)});`});
  const ok=await t.pg.evaluate(()=>!!document.querySelector("#kq-tools"));
  check(ok&&t.errs.filter(e=>!/404/.test(e)).length===0,"perfil dañado "+bad+" no rompe la página",t.errs.join("|").slice(0,160));
  await t.close();
}

console.log(`\n${out.ok} bien · ${out.bad} mal`);
process.exit(out.bad?1:0);
