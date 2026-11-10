/* Valida los textos de vaca.exe (vacaboss.js): cada frase en español E inglés, mismas {variables} en las dos,
   sin duplicados, longitudes razonables y un mínimo de variantes en los grupos que se repiten mucho.
   node tools/check-vaca.mjs      (necesita playwright, igual que las demás pruebas) */
import {open} from "./_harness.mjs";
const t=await open({});
const TX=await t.pg.evaluate(()=>JSON.parse(JSON.stringify(KXV.TX)));
await t.close();
const MIN={warn:3,start:3,hint:2,hit:4,back:4,miss:3,cure:3,inf40:2,inf70:2,inf90:1,rageK:2,win:2,lose:2,restoreK:2,cowBetray:3,cowHit:3,cowMunch:3,cowTele:2,summonK:2,summonWait:2};
let bad=0,n=0;const err=m=>{bad++;console.log("  ✗ "+m);};
const vars=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort().join(",");
const isPair=p=>Array.isArray(p)&&p.length===2&&typeof p[0]==="string"&&typeof p[1]==="string";
for(const [k,v] of Object.entries(TX)){
  const list=isPair(v)?[v]:v;
  if(!Array.isArray(list)||!list.every(isPair)){err(`${k}: no es un par [es,en] ni una lista de pares`);continue;}
  if(MIN[k]&&list.length<MIN[k])err(`${k}: ${list.length} variantes (mínimo ${MIN[k]})`);
  const seen=new Set();
  for(const [es,en] of list){
    n++;
    if(!es.trim()||!en.trim())err(`${k}: texto vacío`);
    if(es===en&&es.replace(/[^a-záéíóúñ]/gi,"").length>6&&!/^(vaca|cow)/i.test(es))err(`${k}: es y en son idénticos → «${es.slice(0,40)}»`);
    if(vars(es)!==vars(en))err(`${k}: variables distintas → «${es.slice(0,40)}»`);
    if(seen.has(es))err(`${k}: duplicada → «${es.slice(0,40)}»`);seen.add(es);
    if(!/^srStart|^sr/.test(k)&&(es.length>175||en.length>175))err(`${k}: demasiado larga para un globo (${Math.max(es.length,en.length)}) → «${es.slice(0,40)}»`);
    if(/[<>]/.test(es+en))err(`${k}: lleva < o > → «${es.slice(0,40)}»`);
  }
}
console.log(bad?`\n✗ ${bad} problema(s) en ${n} frases`:`\nTodo en orden ✓ (${n} frases, es+en)`);
process.exit(bad?1:0);
