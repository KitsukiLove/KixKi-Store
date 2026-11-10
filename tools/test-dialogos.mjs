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
import {stubExternal} from "./_harness.mjs";
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
await stubExternal(page);/* sin internet en las pruebas */
const errs=[];
const ACH=(()=>{try{return [...fs.readFileSync(path.join(ROOT,"kixki2.js"),"utf8").matchAll(/^a\("([\w-]+)"/gm)].map(m=>m[1]);}catch(e){return [];}})();
page.on("pageerror",e=>errs.push("PAGEERR "+e.message));
await page.addInitScript(([view,ach])=>{
  /* visitante que ya conoce la tienda (sin tour) */
  localStorage.setItem("kixki-k",'{"v":1,"on":true,"visits":5,"first":1,"last":1,"opened":[],"fc":{},"allDone":0}');
  localStorage.setItem("kixki-k3",'{"v":1,"pr":false,"plan":0,"grabs":0,"drops":0,"closed":0,"bgs":0,"throws":0}');
  localStorage.setItem("kixki-view",view);
  localStorage.setItem("kixki-a",JSON.stringify({u:Object.fromEntries(ach.map(i=>[i,1])),c:{},seenAt:Date.now()}));   /* logros ya conseguidos: sus frases no estorban lo que se mide */
  sessionStorage.setItem("kixki-k-s","1");
  /* contar lecturas de layout sobre el globo (offsetWidth/offsetHeight) */
  window.__rd=0;
  for(const k of ["offsetWidth","offsetHeight"]){
    const d=Object.getOwnPropertyDescriptor(HTMLElement.prototype,k);
    Object.defineProperty(HTMLElement.prototype,k,{get(){if(this.classList&&this.classList.contains("kk-bub"))window.__rd++;return d.get.call(this);}});
  }
  addEventListener("pointerup",()=>{window.__up=performance.now();},true);
},[mobile?"movil":"pc",ACH]);
await page.goto(URL_);
await page.waitForFunction(()=>window.KXK&&KXK.ready&&window.KXK3,null,{timeout:20000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{KXK.K.still=true;});     /* sin paseos ni travesuras espontáneas: las pruebas no dependen del azar */
const reset=async()=>{await page.evaluate(()=>{KXK.interrupt();KXK.clearTimeline();KXK.budget(5,15000);});await waitIdle();await page.waitForTimeout(300);};

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
ok(r.shown==="EVENTO","un evento reemplaza al globo actual y sale entero al instante ("+r.ms+" ms)"+(r.shown==="EVENTO"?"":" "+JSON.stringify(r)));
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

/* ---------- 3) parte 2: microreacciones, modos, «no molestar», reacciones rápidas, memoria ---------- */
console.log("\n3) Parte 2: microreacciones, modos y reacciones al entorno");
await page.evaluate(()=>{KXK.setTalk("normal");});
await reset();
await waitIdle();
r=await page.evaluate(async()=>{
  KXK.budget(5,0);KXK.clearTimeline();
  const p0=performance.now();KXK.micro("grab",{cd:0});
  await new Promise(r=>setTimeout(r,60));
  const b=document.querySelector("#kixki .kk-bub"),txt=b.querySelector(".v").textContent,isMic=b.classList.contains("mic"),vis=!b.hidden;
  await new Promise(r=>setTimeout(r,1700));
  return {txt,isMic,vis,hidden:document.querySelector("#kixki .kk-bub").hidden,words:txt.trim().split(/\s+/).length,ms:Math.round(performance.now()-p0)};
});
ok(r.vis&&r.isMic&&r.words<=3&&r.hidden,"microreacción «"+r.txt+"»: sale al instante, ≤ 3 palabras y se va sola (~1 s)");

await reset();
r=await page.evaluate(async()=>{
  KXK.setTalk("quiet");const b=KXK.budget();
  const seen=[];
  for(let i=0;i<4;i++){KXK.interrupt();await new Promise(r=>setTimeout(r,1500));
    KXK.micro("close",{cd:0});await new Promise(r=>setTimeout(r,60));
    const bb=document.querySelector("#kixki .kk-bub");if(!bb.hidden&&bb.classList.contains("mic"))seen.push(bb.querySelector(".v").textContent);}
  const bt=document.querySelector("#s-kx-mode");
  const spQuiet=await KXK.say(["amb en calladita","x"],{p:1});
  KXK.setTalk("chat");const bc=KXK.budget();
  const lbl=bt?bt.textContent:"";
  KXK.setTalk("normal");
  return {b,bc,seen,lbl,spQuiet,bn:KXK.budget(),mode:KXK.mode};
});
ok(r.b===1&&r.bc===9&&r.bn===5&&r.mode==="normal","modos de charla: calladita=1/min · charlatana=9/min · normal=5/min");
ok(r.seen.length>0&&r.seen.every(t=>!/\p{L}/u.test(t)),"en «calladita» las microreacciones son solo emoji ("+r.seen.join(" ")+")");
ok(r.spQuiet===false,"en «calladita» no salen las reacciones de fondo (p1)");
ok(!!r.lbl,"el menú tiene el botón de modo: «"+r.lbl+"»");

await reset();
if(!mobile){
  r=await page.evaluate(async()=>{
    KXK.budget(5,0);const tb=document.querySelector("#app .cat:not(.min):not(.max) .tb");
    if(!tb)return {skip:true};
    tb.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true,button:0,pointerType:"mouse"}));
    const during=KXK.busy(),said=await KXK.say(["charla mientras arrastro","x"],{p:1,cat:"sp",replace:true});
    const evOk=await KXK.say(["evento sí","x"],{p:3,cat:"ev",key:"drag-ev",cd:0});
    addEventListener("pointerup",()=>{},true);
    document.dispatchEvent(new PointerEvent("pointerup",{bubbles:true}));window.dispatchEvent(new PointerEvent("pointerup"));
    return {during,said,evOk,after:KXK.busy()};
  });
  ok(r.skip||(r.during&&r.said===false&&r.evOk===true&&!r.after),"no habla mientras arrastras una ventana (los eventos físicos sí) "+JSON.stringify(r));
}
await reset();
await page.focus("#q");await waitIdle();await page.waitForTimeout(400);    /* al enfocar la barra, Kixki salta hasta ella */
r=await page.evaluate(async()=>{
  KXK.interrupt();KXK.budget(5,0);KXK.clearTimeline();
  document.querySelector("#q").dispatchEvent(new KeyboardEvent("keydown",{key:"a",bubbles:true}));
  const a=await KXK.say(["charla mientras escribo","x"],{p:1,cat:"sp"});
  KXK.say(["respuesta directa","x"],{p:2,always:true,key:"alw",cd:0});
  await new Promise(r=>setTimeout(r,80));
  const f=KXK.timeline().some(e=>e.ev==="begin"&&e.key==="alw");
  KXK.interrupt();await new Promise(r=>setTimeout(r,1700));
  KXK.say(["ya no escribo","x"],{p:1,cat:"sp",replace:true,key:"after-type",cd:0});
  await new Promise(r=>setTimeout(r,80));
  const c=KXK.timeline().some(e=>e.ev==="begin"&&e.key==="after-type");
  KXK.interrupt();
  return {a,f,c,rj:KXK.timeline().filter(e=>e.ev==="reject").map(e=>e.key+":"+e.x).slice(-4),why:KXK.busyWhy()};
});
ok(r.a===false&&r.f===true&&r.c===true,"no habla mientras escribes y retoma 1,5 s después de la última tecla "+JSON.stringify(r));
await page.evaluate(()=>{document.querySelector("#q").blur();});

await reset();
r=await page.evaluate(async()=>{
  localStorage.removeItem("kixki-k-rec");
  for(let i=0;i<40;i++)KXK.pick([["rec-"+i,"x"]],"tst");
  await new Promise(r=>setTimeout(r,700));
  const st=JSON.parse(localStorage.getItem("kixki-k-rec")||"[]");
  return {mem:KXK.recentList().length,st:st.length};
});
ok(r.mem===30&&r.st===30,"memoria de no repetir: últimas 30 frases, guardadas en localStorage ("+r.mem+"/"+r.st+")");

/* búsqueda: ya no espera 850 ms */
await reset();await waitIdle();
await page.evaluate(()=>{KXK.budget(5,0);window.__ti=0;document.querySelector("#q").addEventListener("input",()=>{window.__ti=performance.now();},{once:false});});
await page.focus("#q");await page.keyboard.type("ab");await page.waitForTimeout(6500);   /* calentamiento: los logros de la primera búsqueda también hablan */
await page.evaluate(()=>{KXK.interrupt();KXK.budget(5,0);});await page.fill("#q","");await page.waitForTimeout(800);
await page.evaluate(()=>{KXK.interrupt();KXK.clearTimeline();});
await page.keyboard.type("zq");
await page.waitForTimeout(2200);
r=await page.evaluate(()=>{const b=KXK.timeline().find(e=>e.ev==="begin"&&e.key==="search");return b?{ms:Math.round(b.t-window.__ti)}:{tl:KXK.timeline().slice(-8).map(e=>e.ev+":"+(e.key||"")+":"+(e.x??""))};});
ok(r&&r.ms<1500,"búsqueda: la frase sale "+(r&&r.ms!=null?r.ms:"nunca "+JSON.stringify(r))+" ms después de la última tecla (antes ≥ 850 + salto)");
await page.fill("#q","");await page.evaluate(()=>{document.querySelector("#q").blur();KXK.interrupt();});

/* clic en Descarga / fuente */
await reset();
r=await page.evaluate(async()=>{
  KXK.budget(5,0);
  const stop=e=>e.preventDefault();document.addEventListener("click",stop);
  const find=re=>[...document.querySelectorAll(".app .links a.btn,.app .links button.btn")].find(b=>re.test(b.textContent.trim()));
  const dl=find(/^(descarga|apk)/i),sr=find(/github|repositorio/i);
  const out={dl:!!dl,src:!!sr};
  if(dl){KXK.clearTimeline();dl.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));dl.click();await new Promise(r=>setTimeout(r,200));out.dlSaid=KXK.timeline().some(e=>e.ev==="begin"&&e.key==="fast-dl");if(!out.dlSaid)out.tl=KXK.timeline().slice(-5).map(e=>e.ev+":"+(e.key||"")+":"+(e.x??""));out.why=KXK.busyWhy();KXK.interrupt();}
  await new Promise(r=>setTimeout(r,300));
  if(sr){KXK.clearTimeline();sr.dispatchEvent(new PointerEvent("pointerdown",{bubbles:true}));sr.click();await new Promise(r=>setTimeout(r,200));out.srcSaid=KXK.timeline().some(e=>e.ev==="begin"&&e.key==="fast-src");KXK.interrupt();}
  document.removeEventListener("click",stop);return out;
});
ok((!r.dl||r.dlSaid)&&(!r.src||r.srcSaid),"reacciona al clic en «Descarga» y en la fuente "+JSON.stringify(r));

/* ratón 3 s sobre una app */
await reset();
const card=await page.evaluate(()=>{
  const c=[...document.querySelectorAll("#app .app")].find(a=>{const r=a.getBoundingClientRect();return r.width>40&&r.height>20&&r.top>60&&r.bottom<innerHeight-60&&getComputedStyle(a).visibility!=="hidden";});
  if(!c)return null;const r=c.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};
});
if(card){
  await page.evaluate(()=>{KXK.budget(5,0);KXK.clearTimeline();});
  await page.mouse.move(card.x,card.y);await page.mouse.move(card.x+3,card.y+2);
  await page.waitForTimeout(3600);
  r=await page.evaluate(()=>KXK.timeline().some(e=>(e.ev==="begin"||e.ev==="req")&&e.key==="hover"));
  ok(r,"pasar el cursor 3 s sobre una app → Kixki comenta");
  await page.mouse.move(2,2);await page.evaluate(()=>KXK.interrupt());
}else console.log("  (sin tarjetas visibles: se omite la prueba del cursor)");

/* cerrar una ventana y muchas ventanas (solo PC) */
if(!mobile){
  await reset();await waitIdle();
  r=await page.evaluate(async()=>{
    KXK.budget(5,0);KXK.K.noMic=0;
    const w=[...document.querySelectorAll("#app .cat:not(.min):not(.max)")].find(s=>s.querySelector(".wmin"));
    if(!w)return {skip:true};
    KXK.clearTimeline();w.querySelector(".wmin").click();await new Promise(r=>setTimeout(r,300));
    return {micro:KXK.timeline().some(e=>e.key==="micro-close"&&(e.ev==="begin"||e.ev==="req"))};
  });
  ok(r.skip||r.micro,"al cerrar una ventana, Kixki hace una microreacción "+JSON.stringify(r));
  await reset();
  r=await page.evaluate(async()=>{
    KXK.budget(5,0);const all=[...document.querySelectorAll("#app .cat")];if(all.length<6)return {skip:true};
    const was=all.map(s=>s.className);
    all.forEach(s=>{s.classList.remove("max");s.classList.add("min");});await new Promise(r=>setTimeout(r,400));KXK.clearTimeline();
    all.slice(0,6).forEach(s=>{s.classList.remove("min","max");s.hidden=false;});
    await new Promise(r=>setTimeout(r,400));
    const said=KXK.timeline().some(e=>e.key==="manywin"&&(e.ev==="begin"||e.ev==="req"||e.ev==="queue"));
    all.forEach((s,i)=>{s.className=was[i];});return {said,info:said?0:{off:KXK.K.off,q:document.querySelector("#q").value,n:[...document.querySelectorAll("#app .cat:not(.min):not(.max)")].filter(x=>!x.hidden).length,why:KXK.busyWhy(),keys:[...new Set(KXK.timeline().map(e=>e.key||e.ev))].slice(0,8)}};
  });
  ok(r.skip||r.said,"con muchas ventanas abiertas, Kixki lo comenta "+JSON.stringify(r));
}

/* ---------- 4) parte 3: textos en dialogs.js, listas, variables, generador y ánimo ---------- */
console.log("\n4) Parte 3: dialogs.js, variables, generador y ánimo");
await reset();
r=await page.evaluate(async()=>{
  const out={};
  out.loaded=!!(window.KXD&&KXD.T&&KXD.TX&&KXK.D===KXD);
  KXK.budget(5,0);KXK.clearTimeline();
  /* una clave con varias frases (lista) se resuelve sola */
  KXK.say(KXK.T.dizzy,{p:3,key:"t-list",instant:true});await new Promise(r=>setTimeout(r,80));
  out.list=document.querySelector("#kixki .kk-bub .v").textContent;
  KXK.interrupt();
  /* variables de contexto */
  /* hasta 4 intentos: si justo entra otra frase (un consejo de carpeta, por ejemplo), no es un fallo de las variables */
  for(let i=0;i<4;i++){
    KXK.say(["Son las {hora}: «{app}» en «{carpeta}»","It's {hora}: “{app}” in “{carpeta}”"],{p:3,key:"t-vars",instant:true});await new Promise(r=>setTimeout(r,80));
    out.vars=document.querySelector("#kixki .kk-bub .v").textContent;
    KXK.interrupt();if(/\d\d:\d\d/.test(out.vars))break;await new Promise(r=>setTimeout(r,150));
  }
  /* generador por piezas: tres frases, distintas entre sí */
  const g=[...Array(6)].map(()=>KXD.gen("praise")),gd=[...Array(6)].map(()=>KXD.gen("grudge"));
  out.gen=new Set(g.map(x=>x[0])).size;out.genPair=g.every(x=>x.length===2&&x[0]&&x[1]);out.grudge=new Set(gd.map(x=>x[0])).size;
  /* ánimo según cuánto la lanzas */
  const k3=window.KXK3,p0=k3.plan();k3.plan(0);const m0=k3.mood();k3.plan(5);const m1=k3.mood();k3.plan(14);const m2=k3.mood();k3.plan(p0);
  out.mood=[m0,m1,m2];
  /* ninguna llave suelta tras probar una tanda de frases de todo tipo */
  const bad=[];
  for(const k of ["tap","praise","dizzy","late","wake","back","focus","favAdd","favDel","fav1","night","day","musOn","musOff"]){
    KXK.interrupt();await new Promise(r=>setTimeout(r,20));
    KXK.say(KXK.T[k],{p:3,key:"t-"+k});await new Promise(r=>setTimeout(r,60));
    const tx=document.querySelector("#kixki .kk-bub .v").textContent;if(/[{}]/.test(tx))bad.push(k+":"+tx);
  }
  out.bad=bad;KXK.interrupt();
  return out;
});
ok(r.loaded,"dialogs.js carga antes que Kixki y expone KXD");
ok(r.list&&!/\[object/.test(r.list)&&r.list.length>5,"una clave con varias frases (lista) se resuelve sola: «"+(r.list||"").slice(0,40)+"»");
ok(/\d\d:\d\d/.test(r.vars)&&!/[{}]/.test(r.vars),"variables {hora} {app} {carpeta} resueltas: «"+(r.vars||"").slice(0,60)+"»");
ok(r.gen>=4&&r.genPair&&r.grudge>=4,"generador por piezas: "+r.gen+"/6 elogios y "+r.grudge+"/6 quejas distintos");
ok(r.mood[0]===0&&r.mood[1]===1&&r.mood[2]===2,"ánimo: plan 0 → tranquila, 5 → pícara, 14 → vengativa ("+r.mood.join(",")+")");
ok(r.bad.length===0,"ninguna frase deja llaves sueltas"+(r.bad.length?": "+r.bad.join(" | "):""));

ok(errs.length===0,"sin errores en la página"+(errs.length?": "+errs.join(" | "):""));
await br.close();server.close();
console.log(fails?`\n${fails} comprobación(es) fallaron`:"\nTodo OK");
process.exit(fails?1:0);
