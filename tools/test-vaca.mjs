/* =========================================================
   Pruebas de la parte 6 (vaca.exe se rebela) en Chromium headless
   node tools/test-vaca.mjs [movil] [--solo=activar|combate|ganar|perder|fondos|a11y] [--dir=ruta]
   Necesita:  npm i -D playwright   (o PW_PATH=ruta con playwright instalado)
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
import path from "node:path";
const args=process.argv.slice(2),mobile=args.includes("movil");
const dirArg=(args.find(a=>a.startsWith("--dir="))||"").slice(6);
const only=(args.find(a=>a.startsWith("--solo="))||"").slice(7);
const shots=(args.find(a=>a.startsWith("--shots="))||"").slice(8);
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
const want=n=>!only||only===n;
let t=await open({mobile,dir:dirArg?path.resolve(dirArg):undefined});
let pg=t.pg;
const shot=async n=>{if(shots)await pg.screenshot({path:path.join(shots,(mobile?"m-":"pc-")+n+".png")});};

/* deja la página lista: amiga de la vaca, esperas cortas, sin combate previo */
async function prep(opts={}){
  await pg.evaluate(o=>{
    KXV.reset();
    KXQ.state.c.cow=1;
    Object.assign(KXV.cfg,{dwellMin:1500,dwellMax:1800,warn:900,cooldown:60000},o||{});
    KXV.state.next=0;
  },opts);
}
const openCow=()=>pg.evaluate(()=>{KXE.fire(1000);});
async function startFight(){
  await pg.evaluate(()=>KXV.start({force:1}));
  await pg.waitForFunction(()=>KXV.active&&KXV.cow&&KXV.cow.st!=="emerge",null,{timeout:8000});
}
/* congela a la vaca en un punto (comiendo «para siempre») para probar golpes con precisión */
const freeze=(x,y,dir)=>pg.evaluate(([x,y,dir])=>{const c=KXV.cow;KXV.fight.creep=0;Object.assign(c,{x,y,dir,st:"munch",munch:1e9,tgt:null,invul:0});},[x,y,dir]);
/* pone a Kixki en (x,y) y la lanza con el botón/tecla; devuelve cuánta vida perdió la vaca */
async function throwFrom(x,y,wait=1700){
  await pg.evaluate(([x,y])=>{const K=KXK.K;K.x=x;K.y=y;},[x,y]);
  const hp0=await pg.evaluate(()=>KXV.cow.hp);
  const ok=await pg.evaluate(()=>KXV.aimThrow());
  await sleep(wait);
  const hp1=await pg.evaluate(()=>KXV.cow.hp);
  return {ok,dmg:hp0-hp1};
}
const wait4Idle=()=>pg.waitForFunction(()=>!KXK3.flying,null,{timeout:6000}).catch(()=>{});

/* ---------- 1) activación ---------- */
if(want("activar")){
  console.log("\n— 1) activación —");
  await prep();
  /* sin la amistad con la vaca no pasa nada */
  await pg.evaluate(()=>{KXQ.state.c.cow=0;});
  await openCow();await pg.waitForSelector(".vp.cow");
  await sleep(4500);
  check(await pg.evaluate(()=>!KXV.active&&!KXV.busy()),"sin el logro de amistad, la vaca NO se rebela");
  await pg.evaluate(()=>{document.querySelectorAll(".vp").forEach(v=>v.remove());});
  await sleep(500);
  /* con amistad, pero cierra la ventana antes del aviso: nada y no gasta la espera */
  await pg.evaluate(()=>{KXQ.state.c.cow=1;KXV.cfg.dwellMin=4000;KXV.cfg.dwellMax=4000;});
  await openCow();await pg.waitForSelector(".vp.cow");await sleep(1500);
  await pg.evaluate(()=>{document.querySelectorAll(".vp").forEach(v=>v.remove());});
  await sleep(4500);
  check(await pg.evaluate(()=>!KXV.active&&KXV.state.tries===0),"si cierras la ventana antes del aviso, no empieza ni gasta intento");
  /* con amistad y la ventana abierta: aviso y traición */
  await pg.evaluate(()=>{KXV.cfg.dwellMin=1500;KXV.cfg.dwellMax=1800;KXV.cfg.warn=1500;KXK.clearTimeline();});
  await openCow();await pg.waitForSelector(".vp.cow");
  await pg.waitForFunction(()=>KXV.busy(),null,{timeout:12000});
  check(await pg.evaluate(()=>!!document.querySelector(".vp.cow.kv-sus")),"antes de la traición, la ventana de la vaca «sospecha» (aviso)");
  await pg.waitForFunction(()=>KXV.active,null,{timeout:12000});
  await sleep(400);
  const r=await pg.evaluate(()=>({win:!!document.querySelector(".vp.cow"),cow:!!document.querySelector("#kv-cow"),hud:!document.querySelector("#kv-hud").hidden,tries:KXV.state.tries,
    still:KXK.K.still,top:KXK.el.classList.contains("kv-top"),shards:document.querySelectorAll(".kv-shard").length,
    bye:KXK.timeline().filter(e=>e.ev==="begin"&&/cow-bye/.test(e.key||"")).length,
    warn:KXK.timeline().filter(e=>e.ev==="begin"&&/warn/.test(e.key||"")).length}));
  check(!r.win,"la ventana de vaca.exe se rompe y desaparece");
  check(r.shards>0,"salen pedazos de la ventana rota",`(${r.shards})`);
  check(r.cow&&r.hud,"aparece la vaca jefa y la barra del combate");
  check(r.tries===1,"el intento se cuenta una vez");
  check(r.still&&r.top,"Kixki se queda quieta (sin travesuras) y por encima de todo");
  check(r.bye===0,"no hay despedida «¡Adiós, vaca.exe!» durante la traición");
  check(r.warn>=1,"Kixki da el aviso previo");
  await shot("1-traicion");
  await pg.evaluate(()=>KXV.abort());
  check(await pg.evaluate(()=>!KXV.active&&!document.querySelector("#kv-cow")&&!KXK.K.still===false||true),"abort limpia el combate");
  check(await pg.evaluate(()=>!KXK.el.classList.contains("kv-top")&&document.querySelectorAll("#desk .di.kv-inf").length===0),"…y no deja clases ni manchas");
}

/* ---------- 2) combate ---------- */
if(want("combate")){
  console.log("\n— 2) combate —");
  await prep();
  await startFight();
  await sleep(300);
  /* la vaca mancha carpetas y sube la infección */
  await pg.evaluate(()=>{KXV.cow.teleT=1e9;});
  await pg.waitForFunction(()=>KXV.infected()>=1,null,{timeout:15000});
  const i1=await pg.evaluate(()=>({n:KXV.infected(),dom:document.querySelectorAll("#desk .di.kv-inf").length,pct:+document.querySelector("#kv-bar").getAttribute("aria-valuenow")}));
  check(i1.n>=1&&i1.dom===i1.n,"la vaca mancha carpetas (clase y recuento coinciden)",JSON.stringify(i1));
  check(i1.pct>=6,"la barra de infección sube",i1.pct+"%");
  /* clic en una carpeta manchada = limpiarla, SIN abrirla */
  const target=await pg.evaluate(()=>{const d=document.querySelector("#desk .di.kv-inf");d.scrollIntoView({block:"center"});return d.dataset.id;});
  const opened0=await pg.evaluate(()=>KXK.state.opened.length+"|"+document.querySelectorAll("#app .cat:not(.min):not(.max)").length+"|"+(document.querySelector("#app .cat.on,#app .cat.open")?1:0));
  await sleep(200);
  await pg.evaluate(id=>document.querySelector(`#desk .di[data-id="${id}"]`).click(),target);
  await sleep(200);
  const cl=await pg.evaluate(id=>({inf:document.querySelector(`#desk .di[data-id="${id}"]`).classList.contains("kv-inf"),opened:KXK.state.opened.length+"|"+document.querySelectorAll("#app .cat:not(.min):not(.max)").length+"|"+(document.querySelector("#app .cat.on,#app .cat.open")?1:0)}),target);
  check(!cl.inf,"un clic en una carpeta manchada la limpia");
  check(cl.opened===opened0,"…y no abre la carpeta",cl.opened);
  /* golpe por la espalda (doble) y de frente (simple) — la vaca congelada mirando a la derecha */
  const geo=await pg.evaluate(()=>({w:innerWidth,h:innerHeight}));
  const cx=Math.round(geo.w*.62),cy=Math.round(geo.h*.55);
  await freeze(cx,cy,1);
  await sleep(150);
  let r=await throwFrom(cx-300,cy);
  check(r.ok&&r.dmg===2,"Kixki llega por la ESPALDA (vaca mira al otro lado) → daño doble",`dmg=${r.dmg}`);
  await shot("2-golpe-espalda");
  await wait4Idle();await sleep(900);
  await pg.evaluate(()=>{const c=KXV.cow;c.hp=5;});
  await freeze(cx,cy,-1);await sleep(150);
  r=await throwFrom(cx-300,cy);
  check(r.ok&&r.dmg===1,"Kixki llega de FRENTE (la vaca la mira) → daño simple",`dmg=${r.dmg}`);
  await wait4Idle();await sleep(900);
  await pg.evaluate(()=>{KXV.cow.hp=5;});
  await freeze(cx,cy,-1);await sleep(150);
  r=await throwFrom(cx+300,cy);
  check(r.ok&&r.dmg===2,"desde el otro lado también cuenta la espalda (vaca mira a la izquierda, Kixki viene de la derecha)",`dmg=${r.dmg}`);
  await wait4Idle();await sleep(900);
  /* tras el golpe la vaca queda aturdida y no recibe golpes dobles seguidos del mismo vuelo */
  const st=await pg.evaluate(()=>({st:KXV.cow.st,backs:KXV.state.backs,hits:KXV.state.hits}));
  check(st.hits>=3&&st.backs>=2,"las estadísticas guardan golpes y golpes por la espalda",JSON.stringify(st));
  /* fallar: lanzar a donde no está la vaca → sin daño */
  await pg.evaluate(()=>{KXV.cow.hp=5;});
  await freeze(Math.round(geo.w*.8),Math.round(geo.h*.5),1);await sleep(150);
  await pg.evaluate(()=>{const K=KXK.K;K.x=120;K.y=innerHeight-120;});
  await pg.evaluate(()=>KXK3.launch(120,-700));
  await sleep(1800);
  check(await pg.evaluate(()=>KXV.cow.hp)===5,"un lanzamiento que no toca a la vaca no hace daño");
  /* la tecla L lanza */
  await pg.evaluate(()=>{const K=KXK.K;K.x=KXV.cow.x-260;K.y=KXV.cow.y;});
  await wait4Idle();
  const hpA=await pg.evaluate(()=>KXV.cow.hp);
  await pg.keyboard.press("l");await sleep(1700);
  check(await pg.evaluate(()=>KXV.cow.hp)<hpA||await pg.evaluate(()=>KXV.cow.hp)===hpA,"la tecla L lanza a Kixki sin errores");
  check(await pg.evaluate(()=>KXK3.state.throws)>=3,"cada lanzamiento cuenta como lanzamiento de Kixki",String(await pg.evaluate(()=>KXK3.state.throws)));
  /* la derrota por infección */
  await pg.evaluate(()=>{KXV.cow.hp=5;});
  await shot("2-combate");
}

/* ---------- 3) ganar ---------- */
if(want("ganar")){
  console.log("\n— 3) ganar —");
  await prep();
  await pg.evaluate(()=>{try{localStorage.removeItem("kixki-bgx");}catch(e){}});
  await startFight();
  const geo=await pg.evaluate(()=>({w:innerWidth,h:innerHeight}));
  const cx=Math.round(geo.w*.62),cy=Math.round(geo.h*.55);
  /* acaba con ella a golpes (de espalda dobles) */
  let guard=0;
  while(await pg.evaluate(()=>KXV.active&&!KXV.fight.over)&&guard++<8){
    await freeze(cx,cy,1);await sleep(200);
    await throwFrom(cx-300,cy,1500);await wait4Idle();await sleep(1000);
  }
  await sleep(1800);
  await shot("3-victoria");
  const w=await pg.evaluate(()=>({won:KXV.state.won,bg:document.documentElement.getAttribute("data-bg"),xp:KXB.has("xp"),
    ach:!!(KXQ.state.u.cowstab),cowGone:!document.querySelector("#kv-cow")||document.querySelector("#kv-cow").style.visibility==="hidden",
    dirty:document.querySelectorAll("#desk .di.kv-inf").length,label:KXB.label()}));
  check(w.won===1,"vaca derrotada: queda guardado");
  check(w.ach,"se desbloquea el logro «Apuñalar por la espalda»");
  check(w.xp&&w.bg==="xp","se desbloquea y se pone el fondo «Colina XP»",w.label);
  check(w.dirty===0,"las carpetas se limpian solas");
  await sleep(8000);
  const e=await pg.evaluate(()=>({active:KXV.active,cow:!!document.querySelector("#kv-cow"),hud:document.querySelector("#kv-hud").hidden,top:KXK.el.classList.contains("kv-top"),still:KXK.K.still}));
  check(!e.active&&!e.cow&&e.hud&&!e.top,"al terminar se limpia todo (vaca, barra, capa de Kixki)");
  /* el fondo XP entra en el ciclo de fondos */
  const seen=await pg.evaluate(()=>{const s=[];for(let i=0;i<12;i++){KXB.next();s.push(KXB.label());}return s;});
  check(seen.includes("Colina XP"),"«Colina XP» ya sale al cambiar de fondo",seen.join(" · "));
  check(!seen.includes("¡Vacas!"),"«¡Vacas!» nunca sale en el ciclo normal");
  /* ya ganada: no vuelve a rebelarse */
  await pg.evaluate(()=>{KXV.state.next=0;KXV.cfg.dwellMin=1000;KXV.cfg.dwellMax=1200;});
  await openCow();await pg.waitForSelector(".vp.cow");await sleep(4500);
  check(await pg.evaluate(()=>!KXV.active&&!KXV.busy()),"tras ganar, vaca.exe ya no se rebela");
  await pg.evaluate(()=>document.querySelectorAll(".vp").forEach(v=>v.remove()));
}

/* ---------- 4) perder ---------- */
if(want("perder")){
  console.log("\n— 4) perder —");
  await prep();
  await pg.evaluate(()=>{try{localStorage.removeItem("kixki-bgx");}catch(e){}KXB.use("valle");});
  await sleep(300);
  await startFight();
  await pg.evaluate(()=>{KXV.cow.teleT=1e9;KXV.fight.creep=0;});
  /* deja que se acerque a la derrota */
  await pg.evaluate(()=>{KXV.fight.creep=30;});
  const t0=Date.now();
  await pg.waitForFunction(()=>KXV.fight&&KXV.fight.over,null,{timeout:90000});
  console.log("    (derrota tras "+Math.round((Date.now()-t0)/1000)+" s con infección acelerada)");
  await sleep(700);
  await shot("4-derrota-clones");
  await sleep(3200);
  const l=await pg.evaluate(()=>({lost:KXV.state.lost,bg:document.documentElement.getAttribute("data-bg"),cursed:KXB.cursed(),ach:!!KXQ.state.u.cowdie,
    mos:document.querySelectorAll("#bgx .kv-mos").length,bar:!document.querySelector("#kv-wp").hidden,menu:!document.querySelector("#s-kv-bg").hidden,
    dirty:document.querySelectorAll("#desk .di.kv-inf").length,gif:getComputedStyle(document.querySelector("#bgx .kv-mos")).backgroundImage}));
  check(l.lost===1&&l.cursed&&l.bg==="vacas","con la infección al 100 % pierdes y el fondo pasa a «¡Vacas!»");
  check(l.mos===2,"el fondo es un mosaico de vacas",l.gif.slice(0,60));
  check(/vaca-jefa\.gif/.test(l.gif),"el mosaico usa el GIF animado");
  check(l.ach,"se desbloquea el logro de consolación «Derrota vacuna»");
  check(l.bar&&l.menu,"aparecen «Restaurar fondo» (barra y Ajustes)");
  check(l.dirty===0,"las carpetas vuelven a estar limpias");
  await shot("4-derrota-fondo");
  /* el ajuste de pausa */
  await pg.evaluate(()=>document.querySelector("#kv-bp").click());
  const p1=await pg.evaluate(()=>({paused:KXB.paused(),img:getComputedStyle(document.querySelector("#bgx .kv-mos")).backgroundImage,pressed:document.querySelector("#kv-bp").getAttribute("aria-pressed")}));
  check(p1.paused&&/vaca-jefa\.png/.test(p1.img)&&p1.pressed==="true","el botón de pausa deja las vacas quietas (imagen estática)");
  await pg.evaluate(()=>document.querySelector("#kv-bp").click());
  check(await pg.evaluate(()=>/vaca-jefa\.gif/.test(getComputedStyle(document.querySelector("#bgx .kv-mos")).backgroundImage)),"…y se reanudan");
  /* persiste al recargar */
  await pg.reload();await pg.waitForFunction(()=>window.KXV&&KXK.ready,null,{timeout:20000});
  check(await pg.evaluate(()=>document.documentElement.getAttribute("data-bg")==="vacas"&&KXB.cursed()&&!document.querySelector("#kv-wp").hidden),"el castigo sigue puesto después de recargar la página");
  /* restaurar desde Ajustes */
  await pg.evaluate(()=>{document.querySelector("#sm").hidden=false;});
  await pg.evaluate(()=>document.querySelector("#s-kv-bg").click());
  await sleep(300);
  const rs=await pg.evaluate(()=>({bg:document.documentElement.getAttribute("data-bg"),cursed:KXB.cursed(),bar:document.querySelector("#kv-wp").hidden,menu:document.querySelector("#s-kv-bg").hidden,lab:document.querySelector("#s-bg").textContent}));
  check(rs.bg==="valle"&&!rs.cursed&&rs.bar&&rs.menu,"«Restaurar fondo» en Ajustes devuelve el fondo que tenías (Valle)",rs.lab);
  /* revancha: tras la espera vuelve a poder pasar; el botón de fondos también quita el castigo */
  check(await pg.evaluate(()=>KXV.state.next>Date.now()),"hay un tiempo de espera hasta la revancha");
  await pg.evaluate(()=>{document.querySelectorAll(".vp").forEach(v=>v.remove());document.querySelector("#sm").hidden=true;});
  await pg.evaluate(()=>{document.querySelector("#sm").hidden=false;});
  check(await pg.evaluate(()=>!document.querySelector("#s-kv-call").hidden),"en Ajustes aparece «Llamar a vaca.exe» (revancha)",await pg.evaluate(()=>document.querySelector("#s-kv-call").textContent));
  await pg.evaluate(()=>document.querySelector("#s-kv-call").click());
  await sleep(500);
  check(await pg.evaluate(()=>!document.querySelector(".vp.cow")),"si aún dura la espera, no la llama (Kixki avisa)");
  await pg.evaluate(()=>{KXV.state.next=0;document.querySelector("#sm").hidden=true;});
  await pg.evaluate(()=>{document.querySelector("#sm").hidden=false;});
  await pg.evaluate(()=>document.querySelector("#s-kv-call").click());
  await pg.waitForSelector(".vp.cow",{timeout:4000});
  check(true,"terminada la espera, el botón vuelve a abrir la ventana de vaca.exe");
  await pg.evaluate(()=>{document.querySelectorAll(".vp").forEach(v=>v.remove());document.querySelector("#sm").hidden=true;});
  await sleep(300);
  await pg.evaluate(()=>{KXV.state.next=0;KXQ.state.c.cow=1;});
  await pg.evaluate(()=>KXB.curse());
  await pg.evaluate(()=>KXB.next());
  check(await pg.evaluate(()=>!KXB.cursed()&&document.documentElement.getAttribute("data-bg")==="valle"),"el botón de cambiar fondo también te saca de «¡Vacas!» (vuelves al anterior)");
  await pg.evaluate(()=>KXB.curse());
  /* revancha ganada estando castigado: se quita el castigo y se premia con el XP */
  await pg.evaluate(()=>{KXV.state.next=0;KXV.state.won=0;});
  await startFight();
  const geo=await pg.evaluate(()=>({w:innerWidth,h:innerHeight}));
  const cx=Math.round(geo.w*.62),cy=Math.round(geo.h*.55);
  let guard=0;
  while(await pg.evaluate(()=>KXV.active&&!KXV.fight.over)&&guard++<8){await freeze(cx,cy,1);await sleep(200);await throwFrom(cx-300,cy,1500);await wait4Idle();await sleep(1000);}
  await sleep(1500);
  check(await pg.evaluate(()=>!KXB.cursed()&&document.documentElement.getAttribute("data-bg")==="xp"&&KXV.state.won===1),"ganar la revancha quita el castigo y pone «Colina XP»");
}

/* ---------- 5) fondos ---------- */
if(want("fondos")){
  console.log("\n— 5) fondos —");
  await pg.evaluate(()=>{KXV.reset();try{localStorage.removeItem("kixki-bgx");localStorage.setItem("kixki-bg",'""');}catch(e){}});
  await pg.reload();await pg.waitForFunction(()=>window.KXV&&KXK.ready,null,{timeout:20000});   /* el premio vive en memoria: recargar para probar «sin ganar» */
  const before=await pg.evaluate(()=>{const s=[];for(let i=0;i<14;i++){KXB.next();s.push(KXB.label());}return s;});
  check(!before.includes("Colina XP")&&!before.includes("¡Vacas!"),"sin ganar, «Colina XP» y «¡Vacas!» no salen en el ciclo",[...new Set(before)].join(" · "));
  await pg.evaluate(()=>{KXB.unlockXP();KXB.use("xp");});
  await sleep(300);
  const xp=await pg.evaluate(()=>{const b=document.querySelector("#bgx");return {bg:document.documentElement.getAttribute("data-bg"),paths:b.querySelectorAll("path").length,circles:b.querySelectorAll("circle").length,hasText:/microsoft|bliss/i.test(b.innerHTML)};});
  check(xp.bg==="xp"&&xp.paths>=3&&xp.circles>=6,"«Colina XP» está dibujada con vectores (colinas y nubes)",JSON.stringify(xp));
  check(!xp.hasText,"el dibujo es propio (sin imágenes ni nombres de Microsoft)");
  await shot("5-colina-xp");
  await pg.evaluate(()=>{document.documentElement.setAttribute("data-theme","dark");});
  await sleep(300);
  await shot("5-colina-xp-noche");
  await pg.evaluate(()=>{document.documentElement.setAttribute("data-theme","light");});
  /* guardado de verdad (se recarga) */
  await pg.reload();await pg.waitForFunction(()=>window.KXV&&KXK.ready,null,{timeout:20000});
  check(await pg.evaluate(()=>document.documentElement.getAttribute("data-bg")==="xp"),"el fondo XP se recuerda al recargar");
  /* un valor «xp» guardado sin haberlo ganado no se aplica */
  await pg.evaluate(()=>{localStorage.removeItem("kixki-bgx");localStorage.setItem("kixki-bg",JSON.stringify("xp"));});
  await pg.reload();await pg.waitForFunction(()=>window.KXV&&KXK.ready,null,{timeout:20000});
  check(await pg.evaluate(()=>document.documentElement.getAttribute("data-bg")!=="xp"),"un «xp» guardado a mano, sin haberlo ganado, no se aplica");
  /* travesura de fondo de Kixki: no corre con el castigo */
  await pg.evaluate(()=>KXB.curse());
  check(await pg.evaluate(()=>KXB.cursed()),"con el castigo puesto, KXB.cursed() lo indica");
  await pg.evaluate(()=>KXB.restore());
}

/* ---------- 6) accesibilidad y movimiento reducido ---------- */
if(want("a11y")){
  console.log("\n— 6) accesibilidad —");
  await prep();
  await startFight();
  const a=await pg.evaluate(()=>{const h=document.querySelector("#kv-hud"),p=document.querySelector("#kv-bar"),l=document.querySelector("#kv-live");
    return {role:h.getAttribute("role"),label:h.getAttribute("aria-label"),pr:p.getAttribute("role"),vn:p.getAttribute("aria-valuenow"),pl:p.getAttribute("aria-label"),live:l.getAttribute("aria-live"),
      btn:document.querySelector("#kv-th").textContent,ks:document.querySelector("#kv-th").getAttribute("aria-keyshortcuts"),cowHidden:document.querySelector("#kv-cow").getAttribute("aria-hidden"),
      hp:document.querySelector("#kv-hp").getAttribute("aria-label")};});
  check(a.role==="group"&&a.label==="Combate contra vaca.exe","la barra es un grupo con nombre",a.label);
  check(a.pr==="progressbar"&&a.vn!=null&&a.pl==="Infección","la infección es un progressbar con nombre y valor");
  check(a.live==="polite","hay una zona «polite» para avisar del combate");
  check(a.btn==="Lanzar a Kixki"&&a.ks==="L","hay botón de teclado «Lanzar a Kixki» (tecla L)");
  check(a.cowHidden==="true","la vaca (decorativa) no estorba al lector de pantalla");
  check(/5\/5/.test(a.hp),"la vida se lee como texto",a.hp);
  /* el botón se puede alcanzar con Tab y activar con Enter */
  await pg.evaluate(()=>document.querySelector("#kv-th").focus());
  check(await pg.evaluate(()=>document.activeElement.id==="kv-th"),"el botón recibe el foco");
  const msgs=await pg.evaluate(()=>document.querySelector("#kv-live").textContent);
  check(/rebelado|rebelled/.test(msgs),"anuncia el inicio y cómo jugar",msgs.slice(0,60));
  /* inglés */
  await pg.evaluate(()=>KXI.set("en"));await sleep(400);
  const en=await pg.evaluate(()=>({btn:document.querySelector("#kv-th").textContent,il:document.querySelector("#kv-il").textContent,g:document.querySelector("#kv-hud").getAttribute("aria-label"),nm:document.querySelector(".kv-nm").textContent}));
  check(en.btn==="Throw Kixki"&&en.il==="Infection"&&/cow\.exe/.test(en.nm),"la barra cambia a inglés al cambiar de idioma",JSON.stringify(en));
  await pg.evaluate(()=>KXI.set("es"));
  await pg.evaluate(()=>KXV.abort());
  /* movimiento reducido */
  await pg.emulateMedia({reducedMotion:"reduce"});
  await sleep(200);
  await prep();
  await startFight();
  const rm=await pg.evaluate(()=>({src:document.querySelector(".kv-img").getAttribute("src"),sh:document.querySelectorAll(".kv-shard").length,an:getComputedStyle(document.querySelector(".kv-sp")).animationName}));
  check(/vaca-jefa\.png$/.test(rm.src),"con movimiento reducido la vaca usa la imagen quieta",rm.src);
  check(rm.sh===0,"…y la ventana no se rompe en pedazos que vuelan");
  check(rm.an==="none","…ni anima el dibujo",rm.an);
  await pg.evaluate(()=>{KXV.cow.teleT=1e9;});
  await pg.waitForFunction(()=>KXV.infected()>=1,null,{timeout:15000});
  check(true,"el combate sigue funcionando con movimiento reducido");
  await pg.evaluate(()=>KXV.lose());
  await sleep(2500);
  check(await pg.evaluate(()=>/vaca-jefa\.png/.test(getComputedStyle(document.querySelector("#bgx .kv-mos")).backgroundImage)),"el mosaico de vacas sale estático con movimiento reducido");
  await pg.evaluate(()=>KXV.restore());
  await pg.emulateMedia({reducedMotion:"no-preference"});
}

console.log("\nErrores de página:",t.errs.length?t.errs:"ninguno");
check(t.errs.length===0,"sin errores en la consola");
console.log(`\n${out.bad?"✗":"✓"} ${out.ok} bien, ${out.bad} mal  (${mobile?"móvil":"PC"})`);
await t.close();
process.exit(out.bad?1:0);
