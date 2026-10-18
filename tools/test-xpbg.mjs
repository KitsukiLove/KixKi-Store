/* =========================================================
   Pruebas de la Colina XP viva (parte 7b) en Chromium headless
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
check(blades<400,"agrupadas en pocos <path> (no una por brizna)",String(blades));
check((await cs("#bgx .xp-grass .gt","animation-name"))==="xpg","los grupos tienen la animación de ráfaga");
check((await cs("#bgx .xp-grass .gw","animation-name"))==="xpsw","las franjas tienen el balanceo");
/* se mueve de verdad: la transformación computada cambia con el tiempo */
const m1=await cs("#bgx .xp-grass .gt","transform");await sleep(1200);const m2=await cs("#bgx .xp-grass .gt","transform");
const m3=await cs("#bgx .xp-grass .gw","transform");await sleep(900);const m4=await cs("#bgx .xp-grass .gw","transform");
check(m1!==m2||m3!==m4,"el pasto cambia de forma con el tiempo");
check((await pg.evaluate(()=>KXG.hillY(innerWidth/2)))>0&&(await pg.evaluate(()=>KXG.hillY(innerWidth/2)))<await pg.evaluate(()=>innerHeight),"KXG.hillY cae dentro de la pantalla");
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
check(await pg.evaluate(()=>KXG.puddles())>=1,"se forman charcos");
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
check(t.errs.length===0,"sin errores en consola",t.errs.slice(0,2).join(" | "));
console.log(`\n${out.ok} bien · ${out.bad} mal`);
await t.close();
process.exit(out.bad?1:0);
