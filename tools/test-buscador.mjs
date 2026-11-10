/* =========================================================
   Buscador tolerante + botón de fondo = estación (parte 8b)
   node tools/test-buscador.mjs [movil]
   ========================================================= */
import {open,sleep} from "./_harness.mjs";
const mobile=process.argv.slice(2).includes("movil");
const out={ok:0,bad:0};
const check=(c,msg,extra="")=>{if(c){out.ok++;console.log("  ✓ "+msg+(extra?"  "+extra:""));}else{out.bad++;console.log("  ✗ "+msg+(extra?"  "+extra:""));}};
const t=await open({mobile,init:undefined});const pg=t.pg,ev=(f,a)=>pg.evaluate(f,a);
const buscar=async txt=>{await ev(txt=>{const q=document.getElementById("q");q.value=txt;q.dispatchEvent(new Event("input",{bubbles:true}));},txt);await sleep(60);
  return ev(()=>({vis:[...document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .app")].filter(a=>!a.hidden&&!a.closest(".cat").hidden).map(a=>a.querySelector("h3").textContent),empty:document.getElementById("empty").hidden?"":document.getElementById("empty").textContent}));};
console.log("\n1 · Buscador tolerante");
const total=(await buscar("")).vis.length;
check(total>=60,"sin texto salen todas",String(total));
const casos=[["aurora store","Aurora Store"],["aurra stroe","Aurora Store"],["AURORA","Aurora Store"],["fdroid","F-Droid"],["f droid","F-Droid"],["shizuko","Shizuku"],["githb","GitHub"],["bitwarden","Bitwarden"],["bitwardn","Bitwarden"],["bitwarde n","Bitwarden"]];
for(const [q,esp] of casos){const r=await buscar(q);check(r.vis.includes(esp),`«${q}» encuentra ${esp}`,r.vis.length+" resultados");}
const ex=await buscar("app");const ex2=await buscar("open source");
check(ex.vis.length>0&&ex.vis.length<total,"palabras cortas siguen siendo exactas",String(ex.vis.length));
check(ex2.vis.length>0,"varias palabras funcionan",String(ex2.vis.length));
const nada=await buscar("zzxqwv");check(nada.vis.length===0&&/No encontr/.test(nada.empty),"si no hay nada lo dice");
const sug=await buscar("aurorra stor");check(sug.vis.length>0,"«aurorra stor» ya encuentra algo directo");
const sug2=await buscar("bitwrdenx");const hay=await ev(()=>{const b=document.querySelector("#empty .dym");return b?b.textContent:"";});
check(sug2.vis.length>0||/Bitwarden/.test(hay),"letras de más: encuentra o sugiere Bitwarden",hay||sug2.vis.join(","));
const sg=await buscar("bitwrdenxx");check(sg.vis.length===0&&/Quisiste decir «Bitwarden»/.test(sg.empty),"sin resultados: sugiere «¿Quisiste decir Bitwarden?»");
await ev(()=>document.querySelector("#empty .dym").click());await sleep(150);
check((await ev(()=>document.getElementById("q").value))==="Bitwarden","tocar la sugerencia rellena el buscador");
await buscar("");
console.log("\n2 · Ejecutar… (Ctrl+K) también perdona");
await ev(()=>{document.dispatchEvent(new KeyboardEvent("keydown",{key:"k",ctrlKey:true,bubbles:true}));});await sleep(200);
await ev(()=>{const i=document.getElementById("rq");i.value="shizuko";i.dispatchEvent(new Event("input",{bubbles:true}));});await sleep(100);
check(await ev(()=>/Shizuku/.test(document.getElementById("rl").textContent)),"«shizuko» sale en la lista de Ejecutar");
await ev(()=>{document.getElementById("run").hidden=true;});
console.log("\n3 · Botón de fondo = estación");
await ev(()=>{KXB.unlockXP();KXB.use("");KXB.season("valle");});await sleep(200);
const a1=await ev(()=>({w:KXB.world(),s:KXB.season()}));
await ev(()=>document.getElementById("bgb").click());await sleep(250);
const a2=await ev(()=>({w:KXB.world(),s:KXB.season()}));
check(a1.w==="pixel"&&a2.w==="pixel"&&a1.s!==a2.s,"en Pixel cambia de estación y se queda en Pixel",`${a1.s} → ${a2.s}`);
const vistas=new Set([a2.s]);for(let i=0;i<9;i++){await ev(()=>document.getElementById("bgb").click());await sleep(120);vistas.add(await ev(()=>KXB.season()));}
check(vistas.size>=8,"recorre las estaciones",[...vistas].join(","));
check(await ev(()=>KXB.world())==="pixel","tras muchos toques sigue en Pixel");
await ev(()=>{KXB.setWorld("xp");});await sleep(300);
const b1=await ev(()=>KXB.season());await ev(()=>document.getElementById("bgb").click());await sleep(250);
check(await ev(()=>KXB.world())==="xp"&&(await ev(()=>KXB.season()))!==b1,"en la Colina XP cambia su estación y se queda en XP",`${b1} → ${await ev(()=>KXB.season())}`);
check(/Cambiar estación/.test(await ev(()=>document.getElementById("bgb").title)),"el botón dice «Cambiar estación»");
check(t.errs.length===0,"sin errores en consola",t.errs.slice(0,2).join(" | "));
console.log(`\n${out.ok} bien · ${out.bad} mal`);await t.close();process.exit(out.bad?1:0);
