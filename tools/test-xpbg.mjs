/* =========================================================
   Pruebas de la Colina XP viva (partes 7b y 7c: estaciones, pájaros, lluvia y sonido) en Chromium headless
   node tools/test-xpbg.mjs [movil] [--dir=ruta] [--shots=carpeta]
   Comprueba: pasto animado con data-bg="xp" · el clima cambia las variables del cielo y del pasto ·
   KXB.pause congela todo · prefers-reduced-motion = sin animación · la lluvia XP no es pixelada ·
   el menú Inicio XP tiene sus dos columnas.
   Necesita:  npm i -D playwright   (o PW_PATH=ruta con playwright instalado)
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
import path from "node:path";
const args=process.argv.slice(2),mobile=args.includes("movil");
const dirArg=(args.find(a=>a.startsWith("--dir="))||"").slice(6);
const shots=(args.find(a=>a.startsWith("--shots="))||"").slice(8);
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
/* el fondo XP es un premio: se deja ganado y el estilo XP puesto antes de cargar */
const init=()=>{try{localStorage.setItem("kixki-bgx",JSON.stringify({xp:1}));localStorage.setItem("kixki-xp","1");localStorage.setItem("kixki-bg",JSON.stringify("xp"));localStorage.setItem("kixki-view",innerWidth<700?"mob":"pc");}catch(e){}};
const t=await open({mobile,init,dir:dirArg?path.resolve(dirArg):undefined});
const pg=t.pg;
const shot=async n=>{if(shots)await pg.screenshot({path:path.join(shots,(mobile?"m-":"pc-")+n+".png")});};
const cs=(sel,prop,pseudo)=>pg.evaluate(([s,p,ps])=>getComputedStyle(document.querySelector(s),ps||null).getPropertyValue(p),[sel,prop,pseudo]);

console.log("\n1 · Colina y pasto");
await pg.evaluate(()=>KXB.use("xp"));await sleep(900);
check(await pg.evaluate(()=>document.documentElement.getAttribute("data-bg"))==="xp","el fondo es «xp»");
const blades=await pg.evaluate(()=>document.querySelectorAll("#bgx .xp-grass path").length);
const groups=await pg.evaluate(()=>document.querySelectorAll("#bgx .xp-grass .gt").length);
const dlen=await pg.evaluate(()=>[...document.querySelectorAll("#bgx .xp-grass path")].reduce((a,p)=>a+(p.getAttribute("d").match(/Z/g)||[]).length,0));
check(dlen>=400,"hay cientos de briznas ("+dlen+")",`en ${blades} <path> y ${groups} grupos`);
check(blades<dlen*.75,"agrupadas en pocos <path> (no una por brizna)",blades+" de "+dlen);
check((await cs("#bgx .xp-grass .gt","animation-name"))==="xpg","los grupos tienen la animación de ráfaga");
check((await cs("#bgx .xp-grass .gw","animation-name"))==="xpsw","las franjas tienen el balanceo");
/* se mueve de verdad: la transformación computada cambia con el tiempo */
const m1=await cs("#bgx .xp-grass .gt","transform");await sleep(1200);const m2=await cs("#bgx .xp-grass .gt","transform");
const m3=await cs("#bgx .xp-grass .gw","transform");await sleep(900);const m4=await cs("#bgx .xp-grass .gw","transform");
check(m1!==m2||m3!==m4,"el pasto cambia de forma con el tiempo");
check((await pg.evaluate(()=>KXPAS.hillY(innerWidth/2)))>0&&(await pg.evaluate(()=>KXPAS.hillY(innerWidth/2)))<await pg.evaluate(()=>innerHeight),"KXPAS.hillY cae dentro de la pantalla");
await shot("xp-dia");

console.log("\n2 · Lluvia: el clima cambia");
check((await cs("#bgx","--wg")).trim()==="0","seco: --wg = 0");
const g0=await cs("#bgx .xp-grass .b2","fill"),sky0=await cs("#bgx","--xg");
await pg.evaluate(()=>KXRAIN.start(60000));await sleep(6500);
check(await pg.evaluate(()=>KXRAIN.raining),"está lloviendo");
check(await pg.evaluate(()=>document.getElementById("bgx").classList.contains("xp-wet")),"el fondo recibe .xp-wet");
const wg=parseFloat(await cs("#bgx","--wg")),xg=parseFloat(await cs("#bgx","--xg")),op=parseFloat(await cs("#bgx","opacity","::after"));
check(wg>.9,"--wg sube a 1 (suave)",wg.toFixed(2));
check(xg>2,"las ráfagas son más fuertes (--xg)",xg.toFixed(2)+" vs "+sky0.trim());
check(op>.9,"el velo gris del cielo aparece",op.toFixed(2));
const g1=await cs("#bgx .xp-grass .b2","fill");
check(g0!==g1,"el verde cambia (mojado)",g0+" → "+g1);
await sleep(3500);
check(await pg.evaluate(()=>KXPAS.puddles())>=1,"se forman charcos");
await shot("xp-lluvia");
await pg.evaluate(()=>KXRAIN.stop());await sleep(6500);
check(!(await pg.evaluate(()=>document.getElementById("bgx").classList.contains("xp-wet"))),"al parar, se quita .xp-wet");
check(parseFloat(await cs("#bgx","--wg"))<.1,"todo vuelve poco a poco (--wg → 0)");

console.log("\n3 · Pausa y movimiento reducido");
await pg.evaluate(()=>KXB.pause(true));await sleep(200);
check((await cs("#bgx .xp-grass .gt","animation-play-state"))==="paused","KXB.pause congela el pasto");
check((await cs("#bgx .top .c","animation-play-state"))==="paused","…y las nubes");
await pg.evaluate(()=>KXB.pause(false));await sleep(200);
check((await cs("#bgx .xp-grass .gt","animation-play-state"))==="running","al reanudar vuelve a moverse");
await pg.emulateMedia({reducedMotion:"reduce"});await sleep(300);
check((await cs("#bgx .xp-grass .gt","animation-name"))==="none","prefers-reduced-motion: el pasto no se anima");
check((await cs("#bgx .xp-grass .gw","animation-name"))==="none","…ni el balanceo");
check((await cs("#bgx .top .c","animation-name"))==="none","…ni las nubes");
await pg.emulateMedia({reducedMotion:"no-preference"});

console.log("\n4 · Lluvia estilo XP y pixel");
check(await pg.evaluate(()=>document.documentElement.getAttribute("data-style"))==="xp","el estilo XP está activo");
await pg.evaluate(()=>KXRAIN.start(30000));await sleep(1500);
check((await cs("#kr-fg","image-rendering"))==="auto","XP: la lluvia no es pixelada");
await pg.evaluate(()=>{KXXP.set(false);KXB.use("");});await sleep(600);
check(await pg.evaluate(()=>!document.documentElement.getAttribute("data-style")),"el estilo vuelve a pixel sin recargar");
check((await cs("#kr-fg","image-rendering"))==="pixelated","pixel: la lluvia vuelve a ser pixelada");
await pg.evaluate(()=>KXRAIN.stop());await sleep(300);

if(!mobile){
  console.log("\n5 · Menú Inicio XP");
  await pg.evaluate(()=>{KXXP.set(true);});await sleep(900);
  await pg.evaluate(()=>document.getElementById("st").click());await sleep(300);
  const g=await cs("#sm","grid-template-columns");
  check(g.split(" ").length===2,"dos columnas",g);
  const pos=await pg.evaluate(()=>{const r=id=>document.getElementById(id).getBoundingClientRect();return{run:r("s-run"),acc:r("s-acc"),off:r("s-off"),sma:r("sma"),sm:r("sm")};});
  check(pos.run.x<pos.acc.x,"«Ejecutar» a la izquierda y los ajustes a la derecha");
  check(pos.off.y>pos.run.y+200&&pos.off.right<=pos.sm.right,"«Apagar» está en el pie del menú",Math.round(pos.off.y)+"px");
  check(pos.sma.right<=pos.off.x+1,"«Cerrar todas» no se pisa con «Apagar»");
  await shot("inicio");
}

console.log("\n6 · Salta Vallas sigue funcionando con el estilo XP y la Colina");
/* choque de nombres (pasó una vez): KXG es del juego, el pasto usa KXPAS */
check(await pg.evaluate(()=>typeof KXG==="object"&&typeof KXG.open==="function"),"KXG.open (el juego) existe",await pg.evaluate(()=>Object.keys(window.KXG||{}).join(",")));
check(await pg.evaluate(()=>typeof KXPAS==="object"&&typeof KXPAS.hillY==="function"),"KXPAS.hillY (el pasto) existe");
await pg.evaluate(()=>{KXXP.set(true);KXB.use("xp");});await sleep(600);
await pg.evaluate(()=>{const g=document.getElementById("game");g.hidden=false;KXG.open(g);});await sleep(700);
const dib=async()=>pg.evaluate(()=>{const c=document.querySelector("#game canvas"),d=c.getContext("2d").getImageData(0,0,c.width,c.height).data,seen=new Set();for(let i=0;i<d.length;i+=64)seen.add(d[i]+","+d[i+1]+","+d[i+2]);return seen.size;});
check((await dib())>12,"el lienzo del juego está dibujado (no en blanco)",String(await dib())+" colores");
const rc=await pg.evaluate(()=>{const r=document.querySelector("#game canvas").getBoundingClientRect();return{w:r.width,h:r.height};});
check(rc.w>150&&rc.h>50,"el lienzo se ve con tamaño",Math.round(rc.w)+"x"+Math.round(rc.h));
await pg.evaluate(()=>document.getElementById("game")._j());await sleep(900);
check(await pg.evaluate(()=>document.getElementById("game")._dbg().st)==="run","al tocar, la oveja corre (estado «run»)");
await shot("saltavallas");
await pg.evaluate(()=>{document.getElementById("game").hidden=true;});

console.log("\n7 · Estaciones de la Colina XP");
await pg.evaluate(()=>{KXXP.set(true);KXB.use("xp");});await sleep(400);
const EST={clasica:[0,0],primavera:[1,1],verano:[1,1],otono:[1,1],invierno:[1,1],halloween:[1,1],navidad:[1,1]};
for(const v of Object.keys(EST)){
  await pg.evaluate(v=>KXB.xps(v),v);await sleep(450);
  const r=await pg.evaluate(()=>({xps:document.documentElement.getAttribute("data-xps"),blades:document.querySelectorAll("#bgx .xp-grass path").length,fx:KXPAS.fx(),clouds:document.querySelectorAll("#bgx .xp-sky .c:not(.cs)").length,storm:document.querySelectorAll("#bgx .xp-sky .c.cs").length,scen:document.querySelectorAll("#bgx .bot .xs > *").length,mist:!!document.querySelector("#bgx .xp-mist"),wind:document.querySelectorAll("#bgx .xp-sky .xw1").length}));
  check(r.xps===v&&r.blades>30&&r.clouds>=5&&r.storm>=3&&r.wind>=5,"«"+v+"»: pasto, nubes, tormenta y viento",`${r.blades} paths · ${r.clouds} nubes`);
  check(EST[v][0]?r.fx>0:r.fx===0,"«"+v+"»: partículas "+(EST[v][0]?"sí":"no"),String(r.fx));
  check(EST[v][1]?r.scen>0:r.scen===0,"«"+v+"»: paisaje "+(EST[v][1]?"sí":"no"),String(r.scen));
  if(v==="halloween")check(r.mist,"Halloween: hay niebla");
}
await pg.evaluate(()=>KXB.xps("primavera"));await sleep(400);
const b1=await pg.evaluate(()=>{const g=KXPAS.bird("b");return g?{cls:g.getAttribute("class"),n:g.querySelectorAll(".bw").length}:null;});
check(b1&&b1.n>=2,"sale una bandada de pájaros",JSON.stringify(b1));
await sleep(150);
check((await cs("#bgx .xp-bd","animation-name"))==="xpfly","los pájaros vuelan (animación xpfly)");
check((await cs("#bgx .xp-bd .wl","animation-name"))==="xpflapL","y baten las alas");
check(!!(await pg.evaluate(()=>KXPAS.bird("g"))),"gansos en V");
await pg.evaluate(()=>{KXB.xps("halloween");});await sleep(400);
check((await pg.evaluate(()=>{const g=KXPAS.bird();return g&&g.getAttribute("class").includes("bat");})),"Halloween: murciélagos");
check(!!(await pg.evaluate(()=>KXPAS.star())),"estrella fugaz");
await pg.evaluate(()=>{document.getElementById("sm").hidden=false;});await sleep(200);
const lb=await pg.evaluate(()=>{const b=document.getElementById("s-xps");return b?{t:b.textContent,h:b.hidden}:null;});
check(lb&&!lb.h&&/Estaci/.test(lb.t),"el menú tiene «Estación: …»",lb&&lb.t);
const before=await pg.evaluate(()=>KXB.xps());await pg.evaluate(()=>document.getElementById("s-xps").click());
check((await pg.evaluate(()=>KXB.xps()))!==before,"el botón cambia de estación");
await pg.evaluate(()=>{KXB.xps("auto");document.getElementById("sm").hidden=true;});await sleep(300);
check(await pg.evaluate(()=>KXB.XPV.includes(document.documentElement.getAttribute("data-xps"))),"Auto sigue la fecha",await pg.evaluate(()=>document.documentElement.getAttribute("data-xps")));
await pg.evaluate(()=>KXB.xps("clasica"));await sleep(300);
await shot("estacion");

console.log("\n8 · Lluvia XP, relámpagos y sonido");
await pg.evaluate(()=>KXRAIN.start(80000,1));await sleep(5500);
await pg.evaluate(()=>KXRAIN.lightning(1));await sleep(90);
const bright=await pg.evaluate(()=>{const c=document.getElementById("kr-bg"),d=c.getContext("2d").getImageData(0,0,c.width,c.height/2|0).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>235&&d[i+1]>235&&d[i+2]>235&&d[i+3]>200)n++;return n;});
check(bright>20,"el relámpago se dibuja en el cielo",bright+" píxeles claros");
await shot("relampago");
await pg.click("#rd").catch(()=>{});await sleep(1800);
const snd=await pg.evaluate(()=>KXRAIN.sound());
check(snd.want&&snd.on,"el sonido de lluvia se enciende con el altavoz",JSON.stringify(snd));
check(await pg.evaluate(()=>{try{KXRAIN.thunder(.3,1);return true;}catch(e){return false;}}),"el trueno suena sin errores");
const wav=await pg.evaluate(()=>KXRAIN._render(3,1,1).then(b=>b.length));
check(wav>400000,"render fuera de línea del sonido (WAV 3 s)",Math.round(wav/1000)+" KB base64");
await pg.evaluate(()=>KXRAIN.stop());await sleep(300);
check(t.errs.length===0,"sin errores en consola",t.errs.slice(0,2).join(" | "));
console.log(`\n${out.ok} bien · ${out.bad} mal`);
await t.close();
process.exit(out.bad?1:0);
