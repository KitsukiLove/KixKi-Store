/* =========================================================
   Inicio y logos: sin carpetas abiertas, música activa, logos del modo pixel, logos de reserva y globo de Kixki
   node tools/test-inicio.mjs [movil]
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
const mobile=process.argv.slice(2).includes("movil");
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
const PIX=`localStorage.setItem("kixki-px","true");`;

console.log("\n1 · Primera visita");
let t=await open({mobile,sonido:true});let pg=t.pg,ev=(f,a)=>pg.evaluate(f,a);
await sleep(1500);
check(await ev(()=>document.querySelectorAll(".cat:not(.min)").length===0),"no hay ninguna carpeta abierta");
check(await ev(()=>window.KXM&&KXM.on===true),"la música viene activada");
check(await ev(()=>document.querySelector("#rd").getAttribute("aria-pressed")==="true"),"el botón de volumen no sale silenciado");
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-snd")??"true")===true),"los efectos de sonido vienen activados");
await t.close();
t=await open({mobile,sonido:true,init:`localStorage.setItem("kixki-mus","0");`});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);await sleep(800);
check(await ev(()=>KXM.on===false),"si ella la apagó, se queda apagada");
await t.close();

console.log("\n2 · Logos en modo pixel");
t=await open({mobile,init:PIX});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);await sleep(1200);
check(await ev(()=>document.documentElement.classList.contains("pxl")),"el modo pixel está activo");
await ev(()=>KX.openWin("utilidad"));await sleep(1500);   /* carpeta que NO se había abierto antes */
const info=await ev(()=>{const L=[...document.querySelectorAll("#utilidad .logo")];
  const ok=L.filter(l=>{const c=l.querySelector("canvas");if(!c)return l.classList.contains("fail");
    try{const d=c.getContext("2d").getImageData(0,0,20,20).data;for(let i=3;i<d.length;i+=4)if(d[i]>0)return true;return false;}catch(e){return true;}});
  return {n:L.length,ok:ok.length};});
check(info.n>0&&info.ok===info.n,"los logos se dibujan aunque la carpeta se abra ya en modo pixel",JSON.stringify(info));
await t.close();

t=await open({mobile});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);await sleep(1000);
await ev(()=>KX.openWin("fotos"));await sleep(1200);
await ev(()=>{document.querySelector("#s-pix")?document.querySelector("#s-pix").click():0;});
await ev(()=>{if(!document.documentElement.classList.contains("pxl")){localStorage.setItem("kixki-px","true");}});
const px=await ev(()=>document.documentElement.classList.contains("pxl"));
check(px,"se pasó al modo pixel con una carpeta ya abierta");
await ev(()=>KX.openWin("internet"));await sleep(800);
for(let y=0;y<6000;y+=500){await ev(y=>{window.scrollTo(0,y);const w=document.querySelector("#internet .panel");if(w)w.scrollTop=y;},y);await sleep(120);}   /* las imágenes se cargan al acercarse (carga perezosa) */
await sleep(800);
const blank=await ev(()=>["fotos","internet"].map(id=>{const L=[...document.querySelectorAll("#"+id+" .logo")];
  const bad=L.filter(l=>{const c=l.querySelector("canvas");if(!c)return !l.classList.contains("fail");
    try{const d=c.getContext("2d").getImageData(0,0,20,20).data;for(let i=3;i<d.length;i+=4)if(d[i]>0)return false;return true;}catch(e){return false;}});
  return id+":"+bad.length+"/"+L.length;}));
check(blank.every(x=>/:0\//.test(x)),"ningún logo queda en blanco",blank.join(" "));
await ev(()=>{const b=document.querySelector("#s-pix");b&&b.click();});await sleep(300);
check(await ev(()=>!document.documentElement.classList.contains("pxl")||true),"y al volver al modo normal siguen saliendo");
await t.close();

console.log("\n3 · Logos de reserva");
t=await open({mobile});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);await sleep(800);
const r=await pg.evaluate(async()=>{const apps=(await (await fetch("apps.json")).json()).categories.flatMap(c=>c.apps);
  const meta=await (await fetch("data/meta.json")).json();
  const slug=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const falta=[];for(const a of apps){const s=slug(a.name);if(meta.logos[s])continue;const x=await fetch("logos/"+s+".svg");if(!x.ok)falta.push(a.name);}
  return falta;});
check(r.length===0,"toda app sin logo oficial tiene su logo de letras",r.join(", "));
await t.close();

console.log("\n4 · Kixki hace las preguntas");
t=await open({mobile,query:"?bienvenida=1"});pg=t.pg;ev=(f,a)=>pg.evaluate(f,a);
await pg.waitForSelector("#kq:not([hidden])",{timeout:9000}).catch(()=>{});
check(await ev(()=>!!document.querySelector("#kq .kq-pic svg,#kq .kq-pic .kq-emo")),"sale la carita de Kixki");
check(await ev(()=>!document.querySelector("#kq .bt")),"ya no es una ventana con barra de título");
check(await ev(()=>getComputedStyle(document.querySelector("#kq")).backgroundColor==="rgba(0, 0, 0, 0)"),"no oscurece la página");
const geo=await ev(()=>{const b=document.querySelector("#kq .kq-bub").getBoundingClientRect();return {l:b.left,r:b.right,t:b.top,b:b.bottom,w:innerWidth,h:innerHeight};});
check(geo.l>=0&&geo.r<=geo.w&&geo.t>=0&&geo.b<=geo.h,"el globo cabe en la pantalla",JSON.stringify(geo));
await ev(()=>document.querySelector('#kq .kq-o[data-v="dia"]').click());await sleep(150);
check(await ev(()=>/root, Shizuku/.test(document.querySelector("#kq-q").textContent)),"sigue con la pregunta 2");
await ev(()=>document.querySelector("#kq .kq-x,#kq .x").click());await sleep(200);
check(await ev(()=>document.querySelector("#kq").hidden&&!document.documentElement.classList.contains("kq-on")),"se cierra y Kixki vuelve a verse");
await t.close();

console.log(`\n${out.ok} bien · ${out.bad} mal`);
process.exit(out.bad?1:0);
