/* =========================================================
   Pruebas del menú pixel organizado, los fondos pixel con vida y la música nueva (parte 8)
   node tools/test-pixel-musica.mjs [movil]
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
const mobile=process.argv.slice(2).includes("movil");
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
const t=await open({mobile,init:undefined});const pg=t.pg,ev=(f,a)=>pg.evaluate(f,a);
await ev(()=>{localStorage.setItem("kixki-bg",JSON.stringify("valle"));});await pg.reload();await pg.waitForFunction(()=>window.KXB&&window.KXM,null,{timeout:20000});await sleep(800);
console.log("\n1 · Menú Inicio pixel");
await ev(()=>{document.getElementById("sm").hidden=false;});await sleep(300);
const m=await ev(()=>{const sm=document.getElementById("sm"),r=sm.getBoundingClientRect(),cs=getComputedStyle(sm),b=document.getElementById("s-sea").getBoundingClientRect();
  return{top:r.top,bot:r.bottom,w:r.width,h:innerHeight,cols:cs.gridTemplateColumns.split(" ").length,hdr:getComputedStyle(sm,"::before").content,ico:getComputedStyle(document.getElementById("s-bg"),"::before").backgroundImage.slice(0,8),sx:b.left>=r.left&&b.right<=r.right+1,sc:sm.scrollWidth<=sm.clientWidth+1};});
check(m.cols===2,"dos columnas",String(m.cols));
check(/Kixki/.test(m.hdr),"cabecera «Kixki Store»");
check(m.top>=0&&m.bot<=m.h,"el menú cabe en la pantalla",`${Math.round(m.top)}–${Math.round(m.bot)} de ${m.h}`);
check(m.ico==="url(\"da"||m.ico.startsWith("url("),"las filas tienen icono pixel");
check(m.sx&&m.sc,"sin desbordes horizontales");
await ev(()=>{document.getElementById("sm").hidden=true;});
console.log("\n2 · Fondos pixel con vida");
check(await ev(()=>!!document.getElementById("pxfx")),"existe la capa de bichitos");
check(await ev(()=>!!document.querySelector("#bgx .pcl")&&getComputedStyle(document.querySelector("#bgx .pcl")).animationName==="pxdrift"),"las nubes avanzan");
await ev(()=>{const f=document.getElementById("pxfx"),e=document.createElement("i");e.className="pb";f.appendChild(e);});
check(await ev(()=>getComputedStyle(document.getElementById("pxfx")).display==="block"),"la capa se ve con un fondo pixel");
await ev(()=>KXB.setWorld&&KXB.has("xp")?0:0);
await ev(()=>{KXB.unlockXP();KXB.setWorld("xp");});await sleep(300);
check(await ev(()=>getComputedStyle(document.getElementById("pxfx")).display==="none"),"la capa se oculta en la Colina XP");
console.log("\n3 · Música");
const ps=await ev(()=>KXM._pieces());
check(ps.px.length>=8&&ps.xp.length===7,"piezas: pixel "+ps.px.length+" · XP "+ps.xp.length);
let bad=[];
for(const [bg,xps] of [["classic",""],["halloween",""],["navidad",""],["xp","clasica"],["xp","verano"],["xp","invierno"],["xp","halloween"]])for(const nt of [false,true]){
  const w=await ev(([bg,xps,nt])=>KXM._render(bg,xps,nt,10,16000),[bg,xps,nt]);const b=Buffer.from(w,"base64"),n=(b.length-44)/2;let pk=0,s=0;
  for(let i=0;i<n;i+=2){const v=Math.abs(b.readInt16LE(44+i*2))/32768;if(v>pk)pk=v;s+=v*v;}
  const rms=Math.sqrt(s/(n/2));if(!(pk>.05&&pk<.95&&rms>.01))bad.push(bg+xps+(nt?"-n":"-d")+" pk"+pk.toFixed(2)+" rms"+rms.toFixed(3));}
check(!bad.length,"las piezas suenan (ni mudas ni saturadas)",bad.join(", "));
const on=await ev(()=>KXM.toggle());check(on===true,"se enciende");await sleep(1200);check(await ev(()=>KXM.on)===true,"sigue sonando");
await ev(()=>{KXB.xps("navidad");});await sleep(1500);check(await ev(()=>KXM.on)===true,"cambia de pieza al cambiar de estación sin cortarse");
check((await ev(()=>KXM.toggle()))===false,"se apaga");
check(t.errs.length===0,"sin errores en consola",t.errs.slice(0,2).join(" | "));
console.log(`\n${out.ok} bien · ${out.bad} mal`);await t.close();process.exit(out.bad?1:0);
