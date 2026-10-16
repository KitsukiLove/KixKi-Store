// Prueba de los diálogos de Kixki en Chromium headless (Node 18+ y Playwright instalado: npm i -D playwright).
//   node tools/test-dialogos.mjs            → modo PC
//   node tools/test-dialogos.mjs movil      → modo móvil
//   CHROMIUM_PATH=/ruta/a/chrome node tools/test-dialogos.mjs   → usar un Chromium que ya tengas
// 1) Mide los ms entre SOLTAR a Kixki y que el globo muestre una frase nueva (objetivo: < 400 ms).
// 2) Comprueba el gestor: eventos que reemplazan, cola, caducidad, enfriamiento, presupuesto, escritura y debug.
// Sirve el proyecto con un servidor estático propio; sale con código 1 si algo falla.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require("playwright");

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".gif":"image/gif",".svg":"image/svg+xml",".woff2":"font/woff2",".webmanifest":"application/manifest+json"};
const server=http.createServer((rq,rs)=>{
  let f=path.join(ROOT,decodeURIComponent(new URL(rq.url,"http://x").pathname));
  if(!f.startsWith(ROOT)){rs.writeHead(403).end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,"index.html");
  fs.readFile(f,(e,b)=>{if(e){rs.writeHead(404).end();return;}rs.writeHead(200,{"Content-Type":MIME[path.extname(f)]||"application/octet-stream"}).end(b);});
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
const URL_=`http://127.0.0.1:${server.address().port}/index.html`;
const mobile=process.argv[2]==="movil"||process.argv[2]==="mobile";

let fails=0;
const ok=(c,msg)=>{console.log((c?"  OK    ":"  FALLA ")+msg);if(!c)fails++;};
const br=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:["--no-sandbox"]});
const ctx=await br.newContext(mobile?{viewport:{width:390,height:844}}:{viewport:{width:1280,height:800}});
const page=await ctx.newPage();
const errs=[];
page.on("pageerror",e=>errs.push("PAGEERR "+e.message));
await page.addInitScript(view=>{
  /* visitante que ya conoce la tienda (sin tour) */
  localStorage.setItem("kixki-k",'{"v":1,"on":true,"visits":5,"first":1,"last":1,"opened":[],"fc":{},"allDone":0}');
  localStorage.setItem("kixki-k3",'{"v":1,"pr":false,"plan":0,"grabs":0,"drops":0,"closed":0,"bgs":0,"throws":0}');
  localStorage.setItem("kixki-view",view);
  sessionStorage.setItem("kixki-k-s","1");
  /* contar lecturas de layout sobre el globo (offsetWidth/offsetHeight) */
  window.__rd=0;
  for(const k of ["offsetWidth","offsetHeight"]){
    const d=Object.getOwnPropertyDescriptor(HTMLElement.prototype,k);
    Object.defineProperty(HTMLElement.prototype,k,{get(){if(this.classList&&this.classList.contains("kk-bub"))window.__rd++;return d.get.call(this);}});
  }
  addEventListener("pointerup",()=>{window.__up=performance.now();},true);
},mobile?"movil":"pc");
await page.goto(URL_);
await page.waitForFunction(()=>window.KXK&&KXK.ready&&window.KXK3,null,{timeout:20000});
await page.waitForTimeout(2500);
const reset=async()=>{await page.evaluate(()=>{KXK.interrupt();KXK.clearTimeline();KXK.budget(5,15000);});await page.waitForTimeout(300);};

/* ---------- 1) latencia soltar → frase ---------- */
console.log(`\n1) Latencia al soltar a Kixki (${mobile?"móvil":"PC"})`);
async function waitIdle(){
  for(let i=0;i<40;i++){
    if(await page.evaluate(()=>!KXK.K.talking&&KXK.K.mode!=="hop"&&KXK.K.stage!==null&&KXK.K.stage!=="air"))break;
    await page.waitForTimeout(250);
  }
}
/* eventos de puntero con el reloj de la propia página: velocidad fiable (v en px/s del último tramo) */
async function drag(dx,dy,v){
  await page.evaluate(async([dx,dy,v])=>{
    const body=document.querySelector("#kixki .kk-body"),r=body.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2,n=Math.hypot(dx,dy),ux=dx/n,uy=dy/n,step=v*0.016;
    const fire=(t,x,y)=>body.dispatchEvent(new PointerEvent(t,{pointerId:7,pointerType:"mouse",clientX:x,clientY:y,bubbles:true,cancelable:true,button:0,buttons:t==="pointerup"?0:1}));
    const sl=ms=>new Promise(r=>setTimeout(r,ms));
    fire("pointerdown",cx,cy);fire("pointermove",cx+ux*10,cy+uy*10);await sl(16);
    let x=cx+ux*10,y=cy+uy*10;
    for(let i=0;i<6;i++){x+=ux*step;y+=uy*step;fire("pointermove",x,y);await sl(16);}
    window.__up=0;window.__rd=0;
    fire("pointerup",x,y);
  },[dx,dy,v]);
}
const cases=[["lateral derecha",1,0,1500],["lateral izquierda",-1,0,1500],["hacia arriba",0,-1,1400],["diagonal arriba-derecha",1,-1,1300],
  ["hacia abajo-izquierda",-1,1,1300],["justo sobre el umbral",1,-.2,1000],["muy rápido",1,0,2500],["suave (no es lanzamiento)",1,0,300]];
const lat=[];
for(const [name,dx,dy,v] of cases){
  await waitIdle();await page.waitForTimeout(2200);
  await reset();
  const t0=await page.evaluate(()=>KXK3.state.throws|0);
  await drag(dx,dy,v);
  await page.waitForTimeout(450);
  const r=await page.evaluate(()=>{
    const up=window.__up||0,b=KXK.timeline().find(e=>e.ev==="begin"&&e.t>=up-5);
    return {thr:KXK3.state.throws|0,b:b?{key:b.key,lat:Math.round(b.t-up)}:null,reads:window.__rd};
  });
  const thrown=r.thr>t0;
  console.log("    "+(name+" @"+v+(thrown?" [lanzamiento]":"")).padEnd(48)+(r.b?String(r.b.lat).padStart(4)+" ms ["+r.b.key+"]":"  (la frase de agarrar sigue en el globo)")+"  · lecturas de layout del globo: "+r.reads);
  if(thrown){lat.push(r.b?r.b.lat:Infinity);ok(r.b&&r.b.key==="k3th"&&r.b.lat<400,"«"+name+"»: lanzamiento comentado en "+(r.b?r.b.lat:"nunca")+" ms");}
  ok(r.reads<=2,"«"+name+"»: ≤ 2 lecturas de layout del globo en total (se mide una vez, no por fotograma): "+r.reads);
}
ok(lat.length>=4,"se probaron al menos 4 lanzamientos reales ("+lat.length+")");

/* ---------- 2) gestor ---------- */
console.log("\n2) Gestor de diálogos");
await reset();
let r=await page.evaluate(async()=>{
  KXK.say(["Una frase p3 larguísima de otra categoría que ocupa el globo bastante tiempo.","x"],{p:3});
  await new Promise(r=>setTimeout(r,100));
  KXK.say(["en cola p2","x"],{p:2});
  const t0=performance.now();
  KXK.say(["EVENTO","x"],{p:3,cat:"ev",key:"ev1",cd:0});
  const shown=document.querySelector("#kixki .kk-bub .v").textContent;
  KXK.interrupt();
  return {shown,ms:Math.round(performance.now()-t0),log:KXK.timeline().map(e=>e.ev+":"+(e.x??""))};
});
ok(r.shown==="EVENTO","un evento reemplaza al globo actual y sale entero al instante ("+r.ms+" ms)");
ok(r.log.includes("stop:replaced"),"el globo anterior queda marcado como reemplazado");
ok(r.log.includes("drop:clear"),"interrupt() limpia la cola");

await reset();
r=await page.evaluate(async()=>{
  KXK.say(["bloquea el globo con prioridad alta y mucho texto para que dure un rato largo.","x"],{p:3});
  await new Promise(r=>setTimeout(r,60));
  const a=await KXK.say(["no cabe","x"],{p:1,key:"cdtest",cd:60000});
  KXK.interrupt();await new Promise(r=>setTimeout(r,60));
  KXK.say(["ahora sí","x"],{p:1,key:"cdtest",cd:60000});
  await new Promise(r=>setTimeout(r,60));
  const shown=document.querySelector("#kixki .kk-bub .v").textContent;
  const c=await KXK.say(["otra vez","x"],{p:1,key:"cdtest",cd:60000});
  return {a,shown,c};
});
ok(r.a===false&&r.shown.length>0&&r.c===false,"el enfriamiento solo se gasta si la frase se dice (descartada → no gasta; dicha → sí)");

await reset();
r=await page.evaluate(async()=>{
  KXK.say(["globo ocupado con prioridad máxima y bastante texto para tardar en irse del todo.","x"],{p:3});
  await new Promise(r=>setTimeout(r,60));
  const t0=performance.now(),res=await KXK.say(["caduca","x"],{p:2,ttl:300});
  return {res,ms:Math.round(performance.now()-t0)};
});
ok(r.res===false&&r.ms>=250&&r.ms<700,"una frase que no puede salir caduca (ttl 300 ms → descartada a los "+r.ms+" ms)");

await reset();await waitIdle();
r=await page.evaluate(async()=>{
  KXK.budget(2,0);
  for(let i=0;i<3;i++){
    KXK.say(["espontánea "+i,"x"],{p:1,cat:"sp",replace:true,key:"sp-t"+i,cd:0});
    await new Promise(r=>setTimeout(r,80));
  }
  const tl=KXK.timeline();
  return {began:tl.filter(e=>e.ev==="begin"&&(e.key||"").startsWith("sp-t")).length,budget:tl.filter(e=>e.ev==="reject"&&e.x==="budget").length};
});
ok(r.began===2&&r.budget===1,"presupuesto de espontáneas: con 2 por minuto salen 2 y la tercera se rechaza ("+JSON.stringify(r)+")");

await reset();
const timeFor=text=>page.evaluate(async t=>{
  KXK.clearTimeline();KXK.interrupt();KXK.say([t,t],{p:2});
  await new Promise(r=>setTimeout(r,2400));
  const tl=KXK.timeline(),b=tl.find(e=>e.ev==="begin"),ty=tl.find(e=>e.ev==="typed");
  return ty&&b?Math.round(ty.t-b.t):-1;
},text);
const t1=await timeFor("Mmm... ¿en serio?! ¡Qué locura...! Vale, vale, vale, vale, vale.");
ok(t1>0&&t1<1800,"escritura rápida: 58 caracteres con signos repetidos en "+t1+" ms");
await reset();
r=await page.evaluate(async()=>{
  KXK.say(["Esta es una frase bastante larga que se está escribiendo poco a poco para probar el clic.","x"],{p:2});
  await new Promise(r=>setTimeout(r,120));
  const b=document.querySelector("#kixki .kk-bub"),v=b.querySelector(".v"),mid=v.textContent.length;
  b.click();const after=v.textContent.length,h1=b.hidden;b.click();
  return {mid,after,h1,h2:b.hidden};
});
ok(r.mid<r.after&&!r.h1&&r.h2,"clic en el globo: 1.º muestra la frase entera, 2.º la cierra");

await page.emulateMedia({reducedMotion:"reduce"});await reset();
r=await page.evaluate(async()=>{KXK.say(["rm ok","x"],{p:2});await new Promise(r=>setTimeout(r,80));return document.querySelector("#kixki .kk-bub .v").textContent;});
ok(r==="rm ok","con prefers-reduced-motion la frase sale entera");
await page.emulateMedia({reducedMotion:"no-preference"});

await reset();
r=await page.evaluate(async()=>{KXK.debug=true;KXK.say(["debug","x"],{p:2,key:"dbg"});await new Promise(r=>setTimeout(r,500));KXK.debug=false;return KXK.timeline().map(e=>e.ev);});
ok(["req","begin","typed"].every(x=>r.includes(x)),"KXK.debug / KXK.timeline(): "+r.join(" → "));

ok(errs.length===0,"sin errores en la página"+(errs.length?": "+errs.join(" | "):""));
await br.close();server.close();
console.log(fails?`\n${fails} comprobación(es) fallaron`:"\nTodo OK");
process.exit(fails?1:0);
