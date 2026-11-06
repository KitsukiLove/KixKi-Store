/* Pruebas: inglés en las apps, letra grande/contraste, packs guiados y «Optimización».  node tools/test-extras.mjs [movil] */
import {open,sleep} from "./_harness.mjs";
const mobile=process.argv.slice(2).includes("movil");
let ok=0,bad=0;const check=(c,m,x="")=>{c?ok++:bad++;console.log((c?"  ✓ ":"  ✗ ")+m+(x?"  "+x:""));};
const P=(o)=>`localStorage.setItem("kixki-perfil",${JSON.stringify(JSON.stringify(o))});`;

console.log("\n1 · Inglés");
let t=await open({mobile,init:`localStorage.setItem("kixki-lang",'"en"');`});let ev=(f,a)=>t.pg.evaluate(f,a);await sleep(2500);
const en=await ev(()=>{const a=[...document.querySelectorAll("#app .cat:not(#packs):not(#favs):not(#news) .app")];
  const bad=a.filter(x=>/[áéíóú¿¡]| el | con | para /.test(x.querySelector(".desc").textContent));return {n:a.length,bad:bad.map(x=>x.querySelector("h3").textContent)};});
check(en.n>=123&&en.bad.length===0,"las descripciones salen en inglés",JSON.stringify(en.bad.slice(0,5)));
await ev(()=>KXI.set("es"));await sleep(800);
check(await ev(()=>/Quita o desactiva/.test([...document.querySelectorAll("h3")].find(h=>h.textContent==="Canta").closest(".app").querySelector(".desc").textContent)),"al volver a español se restauran");
await t.close();

console.log("\n2 · Letra y contraste");
t=await open({mobile});ev=(f,a)=>t.pg.evaluate(f,a);await sleep(1500);
const f0=await ev(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
await ev(()=>document.querySelector("#s-fs").click());await ev(()=>document.querySelector("#s-fs").click());
const f2=await ev(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
check(f2>f0,"la letra enorme es más grande",f0+" → "+f2);
await ev(()=>document.querySelector("#s-hc").click());
check(await ev(()=>document.documentElement.classList.contains("kq-hc")&&JSON.parse(localStorage.getItem("kixki-a11y")).hc===1),"alto contraste activo y guardado");
await t.pg.reload();await sleep(2000);
check(await ev(()=>document.documentElement.classList.contains("kq-hc")&&document.documentElement.classList.contains("kq-fs2")),"se recuerdan al recargar (a11y)");
await t.close();
t=await open({mobile,init:`localStorage.setItem("kixki-a11y","[1,2]");`});ev=(f,a)=>t.pg.evaluate(f,a);await sleep(1200);
check(await ev(()=>!!document.querySelector("#app .app")),"un dato guardado dañado no rompe nada");
await t.close();

console.log("\n3 · Optimización y packs guiados");
t=await open({mobile,query:"?bienvenida=1"});ev=(f,a)=>t.pg.evaluate(f,a);
await t.pg.waitForSelector("#kq:not([hidden])",{timeout:9000}).catch(()=>{});
await ev(()=>document.querySelector('#kq .kq-o[data-v="dia"]').click());await sleep(150);
await ev(()=>document.querySelector('#kq .kq-o[data-v="si"]').click());await sleep(150);
await ev(()=>document.querySelector('#kq .kq-o[data-v="14"]').click());await sleep(150);
check(await ev(()=>!!document.querySelector('#kq .kq-o[data-v="opt"]')),"«Optimización» aparece en ¿Qué te interesa?");
await ev(()=>document.querySelector('#kq .kq-o[data-v="opt"]').click());await sleep(100);
await ev(()=>[...document.querySelectorAll("#kq .btn.p")].pop().click());await sleep(600);
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-perfil")).i.includes("opt")),"queda guardado en el perfil");
check(await ev(()=>/Optimizaci/.test(document.querySelector("#parati").textContent)&&!!document.querySelector('#parati [data-guide="Optimización"]')),"«Para ti» ofrece guiarte por el pack Optimización");
check(await ev(()=>{const a=[...document.querySelectorAll("#parati .pt-go[data-go]")].map(b=>b.dataset.go);return a.some(n=>["SD Maid SE","EnforceDoze","Essentials","ADL","Canta"].includes(n));}),"y recomienda apps de optimización");
const pk=await ev(()=>{const a=document.querySelector('#packs .app[data-pk="Optimización"]');return a?[...a.querySelectorAll("button[data-go]")].map(b=>b.dataset.go):null;});
check(pk&&pk.length===8,"el pack Optimización existe con 8 apps",JSON.stringify(pk));
await ev(()=>document.querySelector('#parati [data-guide="Optimización"]').click());await sleep(500);
check(await ev(()=>!!document.querySelector("#kq .kg-have")&&/paso 1/.test(document.querySelector("#kq .kq-n").textContent)),"la guía empieza en el paso 1");
const first=await ev(()=>document.querySelector("#kq-q").textContent);
await ev(()=>document.querySelector("#kq .kg-have").click());await sleep(300);
check(await ev(()=>JSON.parse(localStorage.getItem("kixki-have")).length===1&&/paso 2/.test(document.querySelector("#kq .kq-n").textContent)),"«Ya la instalé» la marca y pasa al paso 2",first);
await ev(()=>document.querySelector("#kq .kg-back").click());await sleep(200);
check(await ev(()=>document.querySelector("#kq-q").textContent)!==undefined&&await ev(()=>/paso 1/.test(document.querySelector("#kq .kq-n").textContent)),"«Atrás» vuelve");
for(let i=0;i<12;i++){const done=await ev(()=>!!document.querySelector("#kq .kg-end")&&/Listo|nada nuevo/.test(document.querySelector("#kq-q").textContent));if(done)break;await ev(()=>{const n=document.querySelector("#kq .kg-next");n&&n.click();});await sleep(120);}
check(await ev(()=>/Listo|nada nuevo/.test(document.querySelector("#kq-q").textContent)),"al final sale el resumen");
await ev(()=>document.querySelector("#kq .kg-end").click());await sleep(300);
check(await ev(()=>document.querySelector("#kq").hidden&&JSON.parse(localStorage.getItem("kixki-perfil")).t==="dia"),"cerrar la guía no borra tu perfil");
const geo=await ev(()=>{document.querySelector("#kq .kq-bub");return 1;});
await t.close();

console.log("\n4 · Guía respeta tu celular");
t=await open({mobile,init:P({v:1,t:"dia",p:"no",a:8,i:["opt"]})});ev=(f,a)=>t.pg.evaluate(f,a);await sleep(1800);
await ev(()=>document.querySelector('#parati [data-guide="Optimización"]').click());await sleep(400);
const seen=[];for(let i=0;i<10;i++){const s=await ev(()=>{const q=document.querySelector("#kq-q"),n=document.querySelector("#kq .kg-next");return n?q.textContent:null;});if(!s)break;seen.push(s);await ev(()=>document.querySelector("#kq .kg-next").click());await sleep(120);}
check(!seen.some(n=>["Canta","BatStats","No More Background"].includes(n)),"sin Shizuku no te manda a apps que lo necesitan",seen.join(", "));
await t.close();

console.log("\n"+ok+" bien · "+bad+" mal");process.exit(bad?1:0);
