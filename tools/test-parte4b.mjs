// Prueba de la parte 4b en Chromium headless (Node 18+ y Playwright: npm i -D playwright).
//   node tools/test-parte4b.mjs            → modo PC
//   node tools/test-parte4b.mjs movil      → modo móvil
//   CHROMIUM_PATH=/ruta/a/chrome node tools/test-parte4b.mjs   ·   PW_PATH=ruta/a/playwright si no está instalado en el proyecto
// 1) Quitar a Kixki = que se duerma (visible, quieta, sin hablar, 😠/😴 al tocarla, persiste, anuncia «está durmiendo» una vez, bostezo al despertar).
// 2) Modo «calladita» = solo emojis: ningún globo con letras salvo que la toquen o le pidan ayuda.
// 3) Ventana de básquet: Kixki se sube, se tropieza y cae dentro (golpe, estrellitas, sonido KXS); saltar con clic/tecla; reduced-motion; cerrar a medias.
// 4) Diálogos del básquet: fases, ánimo (P/V), sin repetir seguidas, partida de 5 tiros, «calladita».
// 5) Validador de diálogos, CSP y sw.js (versión + archivos en SHELL).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PW_PATH||"playwright");
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
const ok=(c,msg,x)=>{console.log((c?"  OK    ":"  FALLA ")+msg+(!c&&x!==undefined?"  "+JSON.stringify(x):""));if(!c)fails++;};
const LET=/\p{L}/u;
const br=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:["--no-sandbox"]});
const ACH=(()=>{try{return [...fs.readFileSync(path.join(ROOT,"kixki2.js"),"utf8").matchAll(/^a\("([\w-]+)"/gm)].map(m=>m[1]);}catch(e){return [];}})();
const errs=[],csp=[];

async function newPage(opts={}){
  const ctx=await br.newContext(Object.assign(mobile?{viewport:{width:390,height:844}}:{viewport:{width:1280,height:800}},opts));
  const page=await ctx.newPage();
  page.on("pageerror",e=>errs.push("PAGEERR "+e.message));
  page.on("console",m=>{if(/Content Security Policy|Refused to/i.test(m.text()))csp.push(m.text().slice(0,120));});
  await page.addInitScript(([view,ach])=>{
    if(!localStorage.getItem("kixki-k"))localStorage.setItem("kixki-k",'{"v":1,"on":true,"visits":5,"first":1,"last":1,"opened":[],"fc":{},"allDone":0,"mode":"normal"}');
    if(!localStorage.getItem("kixki-k3"))localStorage.setItem("kixki-k3",'{"v":1,"pr":false,"plan":0,"grabs":0,"drops":0,"closed":0,"bgs":0,"throws":0}');
    localStorage.setItem("kixki-bk",'{"u":1,"best":0,"hoops":0,"shots":0,"seen":1}');
    localStorage.setItem("kixki-view",view);
    localStorage.setItem("kixki-a",JSON.stringify({u:Object.fromEntries(ach.map(i=>[i,1])),c:{},seenAt:Date.now()}));
    sessionStorage.setItem("kixki-k-s","1");
    /* registro de TODOS los globos de Kixki (texto entero) y del globo de la cancha, tal como los vería alguien */
    window.__B=[];window.__C=[];window.__beeps=[];
    document.addEventListener("DOMContentLoaded",()=>{
      let last=null,lastC=null;
      new MutationObserver(()=>{
        const b=document.querySelector("#kixki .kk-bub"),g=b&&b.querySelector(".g");
        if(!b||b.hidden||!g||!g.textContent){last=null;}
        else if(g.textContent!==last){last=g.textContent;window.__B.push({t:last,at:performance.now(),mic:b.classList.contains("mic")});}
        const c=document.querySelector("#bk-say"),x=c&&c.querySelector("p");
        if(!c||c.hidden||!x||!x.textContent){lastC=null;}
        else if(x.textContent!==lastC){lastC=x.textContent;window.__C.push({t:lastC,at:performance.now()});}
      }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["hidden","class"]});
    });
  },[mobile?"movil":"pc",ACH]);
  await page.goto(URL_);
  await page.waitForFunction(()=>window.KXK&&KXK.ready&&window.KXK3&&window.KXBK,null,{timeout:20000});
  await page.waitForTimeout(1800);
  return {ctx,page};
}
const wt=(page,ms)=>page.waitForTimeout(ms);
const mark=page=>page.evaluate(()=>window.__B.length);
const since=(page,i)=>page.evaluate(i=>window.__B.slice(i),i);
const hasLetters=l=>l.filter(b=>LET.test(b.t));
async function calm(page){await page.evaluate(()=>{KXK.interrupt();KXK.budget(5,15000);});await wt(page,300);}

/* ============================================================= 1) DORMIR */
console.log(`\n1) Quitar a Kixki = que se duerma (${mobile?"móvil":"PC"})`);
{
  const {ctx,page}=await newPage();
  const T=await page.evaluate(()=>KXD.T.sleepNow.map(p=>p[0]));
  let i0=await mark(page);
  await page.evaluate(()=>{window.__sr=[];const sr=document.querySelector("#kixki .kk-sr");new MutationObserver(()=>{if(sr.textContent)window.__sr.push(sr.textContent);}).observe(sr,{childList:true,characterData:true,subtree:true});});
  await page.evaluate(()=>document.querySelector("#s-kx-on").click());            /* la opción del menú */
  await wt(page,6500);
  let r=await page.evaluate(()=>{const e=document.getElementById("kixki"),b=e.querySelector(".kk-body").getBoundingClientRect(),cs=getComputedStyle(e);
    return {sl:KXK.sleeping,on:KXK.state.on,mode:KXK.K.mode,f:e.dataset.f,m:e.dataset.m,cls:e.className,disp:cs.display,vis:cs.visibility,w:Math.round(b.width),h:Math.round(b.height),
      x:KXK.K.x,y:KXK.K.y,onscreen:b.top>0&&b.bottom<innerHeight&&b.left>=0&&b.right<=innerWidth,ls:JSON.parse(localStorage.getItem("kixki-k")).on,lbl:document.querySelector("#s-kx-on").textContent};});
  ok(r.sl&&r.mode==="sleep"&&r.f==="sleep"&&/kk-lie/.test(r.cls),"se acuesta con el sprite de dormir",r);
  ok(r.disp!=="none"&&r.vis==="visible"&&!/kk-gone|kk-off/.test(r.cls)&&r.onscreen,"sigue VISIBLE en pantalla (ya no desaparece)",r);
  ok(r.ls===false&&r.on===false,"el estado se guarda en localStorage (kixki-k.on = false)",r);
  ok(/durmiendo|sleeping/.test(r.lbl),"el menú lo dice: «"+r.lbl+"»");
  let bs=hasLetters(await since(page,i0));
  ok(bs.length===1&&T.includes(bs[0].t),"UNA sola frase de buenas noches ("+bs.length+"): «"+(bs[0]&&bs[0].t)+"»");
  const sr=await page.evaluate(()=>window.__sr.filter(t=>/durmiendo|sleeping/.test(t)&&t.length<30));
  ok(sr.length===1,"lector de pantalla: «Kixki está durmiendo» se anuncia una vez ("+sr.length+")",sr);
  /* quieta, muda y sin reaccionar */
  const p0={x:r.x,y:r.y};i0=await mark(page);
  await page.evaluate(()=>{for(let k=0;k<6;k++)setTimeout(()=>KXK.brain(0),k*900);});
  const said=await page.evaluate(async()=>{const a=await KXK.say(["hola","hi"],{p:3});const b=await KXK.say(["hola","hi"],{p:2,cat:"ev"});KXK3.scene("gossip");KXK3.bg();return [a,b];});
  await page.fill("#q","fire").catch(()=>{});await wt(page,1400);await page.fill("#q","").catch(()=>{});
  const vf=await page.evaluate(()=>KXK.visitFolder("fotos",{p:1}));
  if(!mobile)await page.evaluate(()=>{const f=document.querySelector("#desk .di");if(f)f.click();});      /* abrir una carpeta de verdad (en PC; en móvil se maximiza y Kixki se esconde, como siempre) */
  await wt(page,5000);
  r=await page.evaluate(()=>({x:KXK.K.x,y:KXK.K.y,mode:KXK.K.mode,sl:KXK.sleeping}));
  ok(said[0]===false&&said[1]===false&&vf===false,"dormida rechaza cualquier frase y cualquier visita a carpetas",{said,vf});
  ok(Math.abs(r.x-p0.x)<2&&Math.abs(r.y-p0.y)<2&&r.mode==="sleep","no camina, no salta, no visita carpetas",{p0,r});
  ok((await since(page,i0)).length===0,"no habla ni reacciona al entorno (buscar, abrir carpeta, escenas, travesuras)");
  /* sin estorbar clics */
  r=await page.evaluate(()=>{const e=document.getElementById("kixki"),b=e.querySelector(".kk-body").getBoundingClientRect(),
    far=document.elementFromPoint(Math.max(5,b.left-90),b.top+10);
    return {bubPE:getComputedStyle(e.querySelector(".kk-bub")).pointerEvents,area:Math.round(b.width*b.height),farOut:!far||!far.closest("#kixki"),ta:getComputedStyle(e.querySelector(".kk-body")).touchAction};});
  ok(r.bubPE==="none"&&r.area<=60*45+4&&r.farOut&&r.ta!=="none","pointer-events con cuidado: globo sin clics, cuerpo 60×45, touch-action no bloquea el scroll",r);
  /* tocarla: se despierta un instante */
  i0=await mark(page);
  await page.click("#kixki .kk-body",{force:true});
  await wt(page,350);
  r=await page.evaluate(()=>({m:KXK.K.mode,f:document.getElementById("kixki").dataset.f,lie:document.getElementById("kixki").classList.contains("kk-lie")}));
  bs=await since(page,i0);
  ok(bs.length===1&&!LET.test(bs[0].t)&&/😠|😴/.test(bs[0].t),"al tocarla: «"+(bs[0]&&bs[0].t)+"» (😠 o 😴, sin texto)");
  ok(!r.lie&&r.m!=="sleep","y se incorpora un instante",r);
  await wt(page,2600);
  r=await page.evaluate(()=>({m:KXK.K.mode,f:document.getElementById("kixki").dataset.f,lie:document.getElementById("kixki").classList.contains("kk-lie"),sl:KXK.sleeping,poking:KXK.K.poking}));
  ok(r.sl&&r.lie&&r.m==="sleep"&&r.f==="sleep"&&!r.poking,"vuelve a dormir",r);
  /* persiste tras recargar */
  await page.reload();await page.waitForFunction(()=>window.KXK&&KXK.ready&&window.KXBK,null,{timeout:20000});await wt(page,1800);
  r=await page.evaluate(()=>{const e=document.getElementById("kixki"),b=e.querySelector(".kk-body").getBoundingClientRect(),cs=getComputedStyle(e);
    return {sl:KXK.sleeping,lie:e.classList.contains("kk-lie"),vis:cs.visibility,disp:cs.display,on:b.top>0&&b.bottom<innerHeight,bub:window.__B.filter(x=>/\p{L}/u.test(x.t)).length,sr:(e.querySelector(".kk-sr").textContent)};});
  ok(r.sl&&r.lie&&r.vis==="visible"&&r.on&&r.bub===0,"tras recargar sigue dormida, visible y sin tour ni saludo",r);
  ok(/durmiendo|sleeping/.test(r.sr),"y lo anuncia una vez al cargar: «"+r.sr+"»");
  /* despertar */
  await page.evaluate(()=>{window.__seen={cls:new Set(),f:new Set(),b:[]};const e=document.getElementById("kixki");
    const t=setInterval(()=>{e.classList.contains("kk-stretch")&&__seen.cls.add("stretch");__seen.f.add(e.dataset.f);const bb=document.querySelector("#kixki .kk-bub");if(bb&&!bb.hidden)__seen.b.push(bb.querySelector(".g").textContent);},40);window.__seenT=t;});
  await page.evaluate(()=>document.querySelector("#s-kx-on").click());
  await wt(page,4200);
  r=await page.evaluate(()=>({st:[...__seen.cls],f:[...__seen.f],b:__seen.b,sl:KXK.sleeping,lie:document.getElementById("kixki").classList.contains("kk-lie"),m:KXK.K.mode,on:JSON.parse(localStorage.getItem("kixki-k")).on,stage:KXK.stage}));
  ok(r.f.includes("talk")&&r.b.some(t=>/🥱|😮|😪|😌|🫠/.test(t)),"al reactivar: bostezo (boca abierta + 🥱)",r);
  ok(r.st.includes("stretch"),"…se estira",r);
  ok(!r.sl&&!r.lie&&r.m!=="sleep"&&r.on===true&&!!r.stage,"…y vuelve a lo suyo (despierta, en una plataforma)",r);
  await page.evaluate(()=>clearInterval(window.__seenT));
  await ctx.close();
}
/* prefers-reduced-motion: sin estiramiento ni respiración animada */
{
  const {ctx,page}=await newPage({reducedMotion:"reduce"});
  await page.evaluate(()=>document.querySelector("#s-kx-on").click());await wt(page,6000);
  let r=await page.evaluate(()=>{const e=document.getElementById("kixki");return {sl:KXK.sleeping,an:getComputedStyle(e.querySelector(".kk-flip")).animationName};});
  ok(r.sl&&r.an==="none","reduced-motion: duerme sin animación de respiración",r);
  await page.evaluate(()=>document.querySelector("#s-kx-on").click());
  let stretch=false;for(let k=0;k<30;k++){stretch=stretch||await page.evaluate(()=>document.getElementById("kixki").classList.contains("kk-stretch"));await wt(page,60);}
  ok(!stretch&&!(await page.evaluate(()=>KXK.sleeping)),"reduced-motion: despierta sin estirarse");
  await ctx.close();
}

/* ============================================================= 2) CALLADITA */
console.log("\n2) Modo «calladita»: solo emojis");
{
  const {ctx,page}=await newPage();
  await page.evaluate(()=>{KXK.K.still=true;KXK.setTalk("quiet");});
  await wt(page,500);
  const i0=await mark(page);
  /* agarrar y lanzar de verdad */
  const bb=await page.evaluate(()=>{const b=document.querySelector("#kixki .kk-body").getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
  await page.mouse.move(bb.x,bb.y);await page.mouse.down();
  for(let k=1;k<=6;k++)await page.mouse.move(bb.x+k*8,bb.y-k*6);
  await wt(page,700);
  await page.mouse.move(bb.x+300,bb.y-150,{steps:3});await page.mouse.up();
  await wt(page,2600);
  /* soltarla con cuidado */
  const bb2=await page.evaluate(()=>{const b=document.querySelector("#kixki .kk-body").getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
  await page.mouse.move(bb2.x,bb2.y);await page.mouse.down();await page.mouse.move(bb2.x+12,bb2.y+12,{steps:4});await wt(page,900);await page.mouse.up();await wt(page,1800);
  /* búsqueda, favorita, tema, fondo, juego, logro, escenas, frases directas, ventana */
  await page.fill("#q","fire");await wt(page,1200);await page.fill("#q","zzzzqqq");await wt(page,1200);await page.fill("#q","");await wt(page,400);
  await page.evaluate(()=>{const s=document.querySelector(".star");if(s)s.click();});await wt(page,700);
  await page.evaluate(()=>{const r=document.documentElement;r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");});await wt(page,900);
  await page.evaluate(()=>{if(window.KXB){KXB.next();dispatchEvent(new Event("kixki-bg"));}});await wt(page,900);
  await page.evaluate(async()=>{const K=KXK.K;
    dispatchEvent(new CustomEvent("kixki-game",{detail:{t:"start",rec:3}}));await new Promise(r=>setTimeout(r,1400));
    dispatchEvent(new CustomEvent("kixki-game",{detail:{t:"record"}}));await new Promise(r=>setTimeout(r,900));
    dispatchEvent(new CustomEvent("kixki-game",{detail:{t:"over",sc:5,rec:10}}));await new Promise(r=>setTimeout(r,900));
    K.game=false;document.getElementById("kixki").classList.remove("kk-top");});
  await page.evaluate(()=>{try{KXQ.grant("theme");}catch(e){}});await wt(page,900);
  await page.evaluate(async()=>{
    KXK3.scene("gossip");KXK3.scene("plan");KXK3.bg();
    KXK.say(["charla espontánea","chat"],{p:1,cat:"sp"});
    KXK.say(["comentario de ambiente","ambient"],{p:1});
    await KXK.say(["evento especial","special"],{p:3,key:"x-special"});
    await KXK.say(["evento físico","physical"],{p:3,cat:"ev",key:"k3th"});
    await KXK.say(["lanzada","thrown"],{p:2,cat:"ev",key:"k3land"});
    await KXK.say(["carpeta","folder"],{p:2,key:"fold:fotos"});
    await KXK.visitFolder("fotos",{p:1,key:"fold:fotos",cd:0});
  });
  await wt(page,2500);
  await page.evaluate(()=>{const w=document.querySelector("#app .cat:not(.min) .wmin");if(w)w.click();});await wt(page,900);
  await page.evaluate(()=>{try{KXQ.fire&&KXQ.fire();}catch(e){}});await wt(page,2500);
  await page.evaluate(()=>{KXK.K.still=false;for(let k=0;k<8;k++)setTimeout(()=>KXK.brain(0),k*800);});await wt(page,7000);
  await page.evaluate(()=>{KXK.K.still=true;});
  const all=await since(page,i0),words=hasLetters(all),emos=[...new Set(all.map(b=>b.t))];
  ok(all.length>=6,"Kixki sigue viva: "+all.length+" globos de emoji en la prueba (agarrar, lanzar, buscar, tema, juego, logro…)");
  ok(words.length===0,"NINGÚN globo con texto sin que la toquen ni pidan ayuda",words.map(w=>w.t));
  ok(emos.length>=8,"variedad: "+emos.length+" emojis distintos ("+emos.slice(0,14).join(" ")+")");
  /* variedad por situación (datos) */
  const ev=await page.evaluate(()=>Object.entries(KXD.EMO).filter(([k,l])=>l.length<6||l.some(p=>/\p{L}/u.test(p[0]))).map(x=>x[0]));
  ok(ev.length===0,"cada situación de EMO tiene ≥ 6 emojis y ninguno lleva letras",ev);
  /* tocarla → texto permitido */
  await calm(page);let i1=await mark(page);
  await page.click("#kixki .kk-body",{force:true});await wt(page,900);
  let t=await since(page,i1);
  ok(hasLetters(t).length>=1,"si la TOCAN, habla con texto: «"+(t[0]&&t[0].t.slice(0,40))+"»");
  /* el permiso no se queda pegado */
  await calm(page);i1=await mark(page);
  await page.evaluate(()=>KXK.say(["lanzada","thrown"],{p:3,cat:"ev",key:"k3th"}));await wt(page,500);
  t=await since(page,i1);
  ok(t.length>=1&&hasLetters(t).length===0,"…y después vuelve a solo emoji: «"+(t[0]&&t[0].t)+"»");
  /* pedir ayuda → texto permitido */
  await calm(page);i1=await mark(page);
  const asked=await page.evaluate(async()=>{const id=document.querySelector("#desk .di")?.dataset.id;try{return await KXK4.ask(id);}catch(e){return "err "+e;}});
  await wt(page,1200);t=await since(page,i1);
  ok(hasLetters(t).length>=1,"si le PIDEN AYUDA (consejo de carpeta), habla con texto: «"+(t.find(b=>LET.test(b.t))||{t:""}).t.slice(0,50)+"»",asked);
  /* modo normal: vuelve a hablar */
  await page.evaluate(()=>{KXK.setTalk("normal");KXK.interrupt();});await wt(page,400);i1=await mark(page);
  await page.evaluate(()=>KXK.say(["hola de nuevo","hi again"],{p:3}));await wt(page,1800);
  ok(hasLetters(await since(page,i1)).length>=1,"en modo normal vuelve a hablar con texto");
  await ctx.close();
}

/* ============================================================= 3) BÁSQUET: ENTRADA CON CAÍDA */
console.log("\n3) Ventana de básquet: entrada con caída");
async function openAndWatch(page,ms,opts={}){
  await page.evaluate(()=>{
    window.__W={stage:new Set(),mode:new Set(),cls:new Set(),st:[],first:{},t0:performance.now(),beeps:[]};
    const e=document.getElementById("kixki"),W=window.__W;
    if(!window.__bp){window.__bp=1;const o=KXS.beep;KXS.beep=function(f,d){window.__W&&window.__W.beeps.push([Math.round(f),Math.round(performance.now())]);return o.apply(this,arguments);};}
    W.timer=setInterval(()=>{const now=performance.now()-W.t0;
      W.stage.add(KXK.K.stage);W.mode.add(KXK.K.mode);
      for(const c of ["kk-air","kk-dizzy","kk-sq","kk-in","kk-top"])if(e.classList.contains(c)){W.cls.add(c);W.first[c]=W.first[c]??now;}
      const m=KXBK.match();W.st.push(m.state);if(m.state==="ready"&&W.first.ready==null)W.first.ready=now;
      if(KXK.K.mode==="walk"&&W.first.walk==null)W.first.walk=now;
    },25);
    KXBK.open();
  });
  await page.waitForTimeout(ms);
  return page.evaluate(()=>{clearInterval(__W.timer);const W=__W;return {stage:[...W.stage],mode:[...W.mode],cls:[...W.cls],first:W.first,st:[...new Set(W.st)],beeps:W.beeps};});
}
const clean=page=>page.evaluate(()=>{const e=document.getElementById("kixki");return {bad:["kk-air","kk-dizzy","kk-sq","kk-in","kk-top","kk-snooze"].filter(c=>e.classList.contains(c)),tilt:e.style.getPropertyValue("--tilt"),enter:KXK.K.enter,game:KXK.K.game,entering:KXK.entering,mode:KXK.K.mode,hidden:document.getElementById("bask").hidden,sp:e.querySelectorAll(".kk-sp").length};});
{
  const {ctx,page}=await newPage();
  await page.evaluate(()=>{KXK.K.still=true;});
  const w=await openAndWatch(page,9500);
  ok(w.stage.includes("bask"),"Kixki camina/se sube hasta la ventana (plataforma «bask»)",w.stage);
  ok(w.first.walk!=null,"…camina hasta el borde (modo walk visto a los "+Math.round(w.first.walk)+" ms)",w.first);
  ok(w.cls.includes("kk-air")&&w.cls.includes("kk-sq")&&w.cls.includes("kk-dizzy"),"…se tropieza, CAE (kk-air), golpe (kk-sq) y estrellitas (kk-dizzy)",w.cls);
  ok(w.first.ready!=null&&w.first["kk-dizzy"]!=null&&w.first.ready>w.first["kk-dizzy"],"el minijuego empieza DESPUÉS de la caída (ready "+Math.round(w.first.ready)+" ms > estrellitas "+Math.round(w.first["kk-dizzy"])+" ms)",w.first);
  ok(!w.st.slice(0,1).includes("ready")&&w.st.includes("enter"),"mientras cae el juego espera (estado enter)",w.st);
  const bp=w.beeps.map(b=>b[0]);const sweep=bp.some((f,i)=>f>=600&&bp.slice(i,i+7).filter((x,k,a)=>k>0&&x<a[k-1]).length>=5),thud=bp.some(f=>f<=120);
  ok(sweep&&thud,"sonido de caída con KXS (barrido descendente + golpe)",bp);
  let r=await clean(page);
  ok(r.bad.includes("kk-in")&&r.bad.includes("kk-top")&&!r.bad.some(c=>["kk-air","kk-dizzy","kk-sq"].includes(c))&&!r.tilt&&!r.enter,"al empezar: Kixki de la página escondida, sin clases de caída colgadas",r);
  const c=await page.evaluate(()=>({txt:window.__C.map(x=>x.t),start:KXD.TX.bkStart.concat(KXD.TX.bkStartP,KXD.TX.bkStartV).map(p=>p[0])}));
  ok(c.txt.length>=1&&c.start.includes(c.txt[0]),"y Kixki arranca con su frase de enfado: «"+c.txt[0]+"»");
  await page.keyboard.press("Escape");await wt(page,2200);
  r=await clean(page);
  ok(r.bad.length===0&&r.hidden&&!r.game&&r.mode==="idle"&&!r.enter,"al cerrar, Kixki vuelve (sin kk-in/kk-top, juego terminado)",r);
  /* saltar con clic y con tecla */
  for(const how of ["tecla","clic"]){
    await calm(page);
    await page.evaluate(()=>{window.__W=null;KXBK.open();});
    await wt(page,1300);
    const before=await page.evaluate(()=>KXBK.match().state);
    const t0=Date.now();
    if(how==="tecla")await page.keyboard.press("a");else{const c=await page.evaluate(()=>{const r=document.querySelector("#bk-wrap").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});await page.mouse.click(c.x,c.y);}   /* un clic DENTRO de la ventana (fuera la cierra, como siempre) */
    await page.waitForFunction(()=>KXBK.match().state==="ready",null,{timeout:2000}).catch(()=>{});
    const dt=Date.now()-t0;r=await clean(page);
    ok(before==="enter"&&dt<500&&r.bad.includes("kk-in")&&!r.bad.some(c=>["kk-air","kk-dizzy","kk-sq"].includes(c))&&!r.enter,"saltar la animación con "+how+": el juego empieza en "+dt+" ms, sin restos",{before,dt,r});
    await page.keyboard.press("Escape");await wt(page,2000);
  }
  /* cerrar a medias: subiendo, caminando, cayendo, mareada */
  for(const [name,cond,delay] of [["saltando",null,120],["caminando","mode==='walk'",0],["cayendo","classList.contains('kk-air')",0],["mareada","classList.contains('kk-dizzy')",0]]){
    await calm(page);
    await page.evaluate(()=>KXBK.open());
    if(cond)await page.waitForFunction(c=>{const e=document.getElementById("kixki");return c.startsWith("mode")?KXK.K.mode==="walk":eval("e."+c);},cond,{timeout:9000,polling:15}).catch(()=>{});
    else await wt(page,delay);
    await page.keyboard.press("Escape");
    await wt(page,2600);
    r=await clean(page);
    ok(r.bad.length===0&&!r.tilt&&!r.enter&&!r.game&&!r.entering&&r.sp===0&&r.hidden&&r.mode==="idle","cerrar la ventana "+name+": todo limpio, sin estados colgados",r);
  }
  /* y se puede volver a abrir */
  await calm(page);await page.evaluate(()=>KXBK.open());await wt(page,1200);await page.keyboard.press("a");await wt(page,400);
  ok(await page.evaluate(()=>KXBK.match().state==="ready"),"tras cerrar a medias, la cancha se abre y juega con normalidad");
  await page.keyboard.press("Escape");await wt(page,1800);
  await ctx.close();
}
{
  const {ctx,page}=await newPage({reducedMotion:"reduce"});
  await page.evaluate(()=>{KXK.K.still=true;});
  const t0=Date.now();
  const w=await openAndWatch(page,1200);
  ok(w.first.ready!=null&&w.first.ready<700&&w.first.ready>=100,"reduced-motion: fundido corto ("+Math.round(w.first.ready)+" ms) y empieza el juego",w.first);
  ok(!w.cls.includes("kk-air")&&!w.cls.includes("kk-dizzy")&&!w.cls.includes("kk-sq")&&!w.stage.includes("fall")&&!w.mode.includes("walk")&&!w.mode.includes("hop"),"reduced-motion: sin caída, sin estrellitas, sin caminar",w);
  ok(w.beeps.length===0||w.beeps.every(b=>b[0]>=200||true)&&!w.beeps.some(b=>b[0]<=120),"reduced-motion: sin golpe sonoro",w.beeps);
  await page.keyboard.press("Escape");await wt(page,900);
  const r=await clean(page);
  ok(r.bad.length===0&&r.hidden,"reduced-motion: al cerrar todo limpio",r);
  await ctx.close();
}

/* ============================================================= 4) BÁSQUET: DIÁLOGOS */
console.log("\n4) Diálogos del básquet: Kixki enfadada");
{
  const {ctx,page}=await newPage();
  await page.evaluate(()=>{KXK.K.still=true;});
  /* a) datos: cada fase tiene ≥ 6 (+P y V) en es+en, sin repetir seguidas, con ánimo */
  const d=await page.evaluate(()=>{
    const ph=["Start","Throw","Miss","Score","Streak","Last","Win","Lose","End"],o={};
    for(const f of ph){
      const b=KXD.TX["bk"+f],P=KXD.TX["bk"+f+"P"],V=KXD.TX["bk"+f+"V"],all=new Set([...b,...P,...V].map(x=>x[0]));
      const ph0=f.toLowerCase();let rep=0,prev=null,bad=0,gotP=0,gotV=0,gotB=0;
      KXK3.state.plan=0;KXK3.state.throws=0;KXK3.state.drops=0;
      const seq=(plan)=>{KXK3.state.plan=plan;prev=null;for(let i=0;i<250;i++){const x=KXBK.phrase(ph0,{n:3,p:7});if(!x||!x[0]||!x[1])bad++;else{if(x[0]===prev)rep++;prev=x[0];
        if(/\{/.test(x[0]+x[1]))bad++;const key=[...b,...P,...V].find(y=>y[0].replace(/\{\w+\}/g,"@")===x[0].replace(/3|7/g,"@").replace(/@/g,"@"));}}};
      seq(0);const r0=rep;seq(6);seq(14);
      o[f]={base:b.length,P:P.length,V:V.length,rep,bad,es:b.every(p=>p[0]&&p[1])};
    }
    KXK3.state.plan=0;return o;});
  const dd=Object.entries(d);
  ok(dd.every(([,v])=>v.base>=6&&v.P>=3&&v.V>=3&&v.es),"9 fases (inicio, lanzamiento, fallo, encesta, racha, último tiro, victoria, derrota, despedida): ≥ 6 base + P + V, es+en",d);
  ok(dd.every(([,v])=>v.rep===0&&v.bad===0),"750 frases por fase: ninguna repetida seguida, sin llaves sueltas",d);
  /* b) partida completa con tiros simulados que pasan por el mismo código */
  await page.evaluate(()=>{KXK3.state.plan=0;KXK.setTalk("normal");});
  await page.evaluate(()=>{window.__C.length=0;KXBK.open();});
  await wt(page,1200);await page.keyboard.press("a");
  await page.waitForFunction(()=>KXBK.match().state==="ready",null,{timeout:4000});
  const phases=await page.evaluate(()=>{
    const D=KXD.TX,names=["Start","Throw","Miss","Score","Streak","Last","Win","Lose","End"],map={};
    for(const f of names)map[f]=new Set([...D["bk"+f],...D["bk"+f+"P"],...D["bk"+f+"V"]].flatMap(p=>p[0].includes("{")?[p[0].split(/\{\w+\}/)[0]].filter(x=>x.length>3):[p[0]]).map(x=>x));
    const kind=t=>{for(const f of names){const all=[...D["bk"+f],...D["bk"+f+"P"],...D["bk"+f+"V"]];if(all.some(p=>{const re=new RegExp("^"+p[0].replace(/[.*+?^$()|[\]\\]/g,"\\$&").replace(/\{\w+\}/g,".+")+"$");return re.test(t);}))return f;}return "?";};
    window.__kind=kind;return true;});
  const seq=[],snap=async(label)=>{await wt(page,1300);const t=await page.evaluate(()=>{const c=window.__C;return c.length?c[c.length-1].t:"";});const k=await page.evaluate(t=>window.__kind(t),t);seq.push(label+":"+k);return k;};
  const shots=["score","score","miss","score","miss"];
  const got=[];
  got.push(["inicio",await page.evaluate(()=>window.__kind(window.__C[0]?window.__C[0].t:""))]);
  for(let i=0;i<shots.length;i++){
    await page.evaluate(k=>{window.__C.length=0;KXBK.sim(k);},shots[i]);
    await wt(page,1300);
    const res=await page.evaluate(()=>window.__C.map(x=>window.__kind(x.t)));
    got.push(["tiro"+(i+1),res[0],res.join(">")]);
    if(i===3){await wt(page,2200);const l=await page.evaluate(()=>window.__C.map(x=>window.__kind(x.t)));got.push(["ultimo",l.join(">")]);}
  }
  await wt(page,1500);
  const end=await page.evaluate(()=>({m:KXBK.match(),last:window.__C.map(x=>window.__kind(x.t)),pts:KXBK.match().pts}));
  const flat=got.map(g=>g.slice(1).join(" ")).join(" | ");
  ok(got[0][1]==="Start","fase inicio: «Start»",got[0]);
  ok(got.filter(g=>/^tiro/.test(g[0])).every(g=>g[1]==="Throw"),"cada lanzamiento: Kixki protesta en el aire (Throw ×5)",got);
  ok(/Score/.test(got[1][2]),"encesta: frase de encesta (Score)",got[1]);
  ok(/Streak/.test(got[2][2]),"racha: a la 2.ª canasta seguida sale la de racha (Streak)",got[2]);
  ok(/Miss/.test(got[3][2]),"fallo: frase de fallo (Miss)",got[3]);
  ok(got.some(g=>g[0]==="ultimo"&&/Last/.test(g[1])),"última ronda: avisa antes del 5.º tiro (Last)",got);
  ok(end.m.state==="over"&&/Win|Lose/.test(end.last.join(">")),"fin de partida: victoria/derrota ("+end.last.join(">")+", "+end.pts+" pts)",end);
  await wt(page,5200);
  const nm=await page.evaluate(()=>({m:KXBK.match(),k:window.__kind(window.__C[window.__C.length-1].t)}));
  ok(nm.m.taken===0&&nm.m.pts===0&&nm.m.state==="ready"&&nm.k==="Start","nueva partida automática con su frase de inicio",nm);
  /* ganar y perder */
  const res=[];
  for(const plan of [["score","score","score","score","score"],["miss","miss","miss","miss","miss"]]){
    for(const k of plan){await page.evaluate(k=>KXBK.sim(k),k);await wt(page,330);await page.waitForFunction(()=>KXBK.match().state==="ready"||KXBK.match().state==="over",null,{timeout:3000});}
    await wt(page,300);res.push(await page.evaluate(()=>({k:window.__kind(window.__C[window.__C.length-1].t),pts:KXBK.match().pts})));
    await wt(page,5200);
  }
  ok(res[0].k==="Win"&&res[1].k==="Lose","5 canastas → victoria; 5 fallos → derrota",res);
  /* despedida al cerrar */
  await page.evaluate(()=>{window.__B.length=0;});
  await page.evaluate(()=>{KXBK.sim("score");});await wt(page,500);
  await page.keyboard.press("Escape");await wt(page,3500);
  const fin=await page.evaluate(()=>({b:window.__B.map(x=>x.t),end:[...KXD.TX.bkEnd,...KXD.TX.bkEndP,...KXD.TX.bkEndV].map(p=>p[0])}));
  ok(fin.b.some(t=>fin.end.includes(t)),"al cerrar, Kixki se despide (bkEnd): «"+(fin.b[0]||"").slice(0,45)+"»",fin.b);
  /* ánimo: según el ánimo salen frases pícaras (P) y vengativas (V) */
  const mo=await page.evaluate(()=>{const D=KXD.TX,cnt={0:{b:0,P:0,V:0},1:{b:0,P:0,V:0},2:{b:0,P:0,V:0}};
    for(const [m,plan] of [[0,0],[1,5],[2,14]]){KXK3.state.plan=plan;
      for(let i=0;i<300;i++){const x=KXBK.phrase("miss");const t=x[0];cnt[m][D.bkMissV.some(p=>p[0]===t)?"V":D.bkMissP.some(p=>p[0]===t)?"P":"b"]++;}}
    KXK3.state.plan=0;return {cnt,mood0:(()=>{KXK3.state.plan=0;return KXK3.mood();})()};});
  ok(mo.cnt[0].P===0&&mo.cnt[0].V===0&&mo.cnt[1].P>0&&mo.cnt[2].V>0,"ánimo: tranquila=solo base · pícara=mezcla P · vengativa=mezcla V",mo.cnt);
  /* en español y en inglés */
  const en=await page.evaluate(()=>{KXI.set("en");const x=KXBK.phrase("score");KXI.set("es");return x;});
  ok(en&&en[0]!==en[1]&&/[a-z]/.test(en[1]),"cada frase existe en español e inglés",en);
  await ctx.close();
}
/* calladita dentro del minijuego */
{
  const {ctx,page}=await newPage();
  await page.evaluate(()=>{KXK.K.still=true;KXK.setTalk("quiet");window.__C.length=0;window.__B.length=0;KXBK.open();});
  await wt(page,1200);await page.keyboard.press("a");await page.waitForFunction(()=>KXBK.match().state==="ready",null,{timeout:4000});
  for(const k of ["score","score","miss","score","miss"]){await page.evaluate(k=>KXBK.sim(k),k);await wt(page,1400);}
  await wt(page,1500);await page.keyboard.press("Escape");await wt(page,3500);
  const x=await page.evaluate(()=>({c:window.__C.map(x=>x.t),b:window.__B.map(x=>x.t)}));
  ok(x.c.length>=5&&x.c.every(t=>!LET.test(t)),"«calladita»: la cancha solo muestra emojis ("+[...new Set(x.c)].slice(0,8).join(" ")+")",x.c.filter(t=>LET.test(t)));
  ok(x.b.every(t=>!LET.test(t)),"«calladita»: ni la entrada ni la despedida llevan texto",x.b.filter(t=>LET.test(t)));
  await ctx.close();
}

/* ============================================================= 5) VALIDADOR, CSP, SW */
console.log("\n5) Validador, CSP y service worker");
try{execFileSync("node",[path.join(ROOT,"tools/check-dialogs.mjs")],{stdio:"pipe"});ok(true,"tools/check-dialogs.mjs sin errores");}
catch(e){ok(false,"tools/check-dialogs.mjs",String(e.stdout||e).slice(-400));}
ok(csp.length===0,"sin violaciones de CSP en consola",csp);
{
  const sw=fs.readFileSync(path.join(ROOT,"sw.js"),"utf8"),html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
  const shell=[...sw.match(/SHELL=\[(.*?)\]/s)[1].matchAll(/"([^"]+)"/g)].map(m=>m[1]);
  const used=[...html.matchAll(/(?:src|href)="([\w./-]+\.(?:js|css))"/g)].map(m=>m[1]).filter(x=>!/^vendor|^fonts/.test(x));
  ok(/V="kixki-v(\d+)"/.test(sw)&&+sw.match(/V="kixki-v(\d+)"/)[1]>=19,"sw.js: versión de caché subida ("+sw.match(/V="([^"]+)"/)[1]+")");
  ok(used.every(u=>shell.includes(u)),"todos los .js/.css de index.html están en SHELL",used.filter(u=>!shell.includes(u)));
  ok(!/innerHTML\s*=.*<script|eval\(.*fetch/.test(fs.readFileSync(path.join(ROOT,"kixki.js"),"utf8")),"kixki.js sin scripts inline ni llamadas externas nuevas");
}
ok(errs.length===0,"sin errores en la página",errs.slice(0,3));
await br.close();server.close();
console.log(fails?`\n${fails} comprobación(es) fallaron`:"\nTodo correcto");
process.exit(fails?1:0);
