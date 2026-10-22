// Validador de dialogs.js  ·  node tools/check-dialogs.mjs
// Comprueba que cada frase sea [español, English] (ambos con texto), que las variables {x} coincidan en los dos idiomas y
// estén permitidas para esa clave, que no haya frases repetidas en una misma clave ni demasiado largas, y que cada evento
// tenga al menos las variantes que pide KXD.MINV (5 por defecto; 15 en lo más frecuente). Sale con código 1 si algo falla.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const win={};vm.runInNewContext(fs.readFileSync(path.join(ROOT,"dialogs.js"),"utf8"),{window:win,console});
const D=win.KXD;if(!D){console.error("dialogs.js no define window.KXD");process.exit(1);}
const {VARS,MINV}=D,GLOBAL=["hora","app","carpeta"];
const isPair=x=>Array.isArray(x)&&x.length===2&&typeof x[0]==="string"&&typeof x[1]==="string";
let errs=0,warns=0,total=0;
const err=m=>{errs++;console.log("  ERROR  "+m);},warn=m=>{warns++;console.log("  aviso  "+m);};
const vars=s=>[...new Set([...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]))].sort();
const lookup=(tbl,p,def)=>{for(let q=p;q;q=q.includes(".")?q.slice(0,q.lastIndexOf(".")):""){if(q in tbl)return tbl[q];}return def;};
let cur="";
function phrases(x,out=[]){
  if(isPair(x))out.push(x);
  else if(Array.isArray(x)&&x.length===2&&(typeof x[0]==="string"||x[0]===null)&&isPair(x[1]))phrases(x[1],out);   // paso del tour: [sitio, [es, en]]
  else if(Array.isArray(x)){
    if(x.some(y=>typeof y==="string"))err(`${cur}: lista con texto suelto (¿falta [español, English]?) → «${String(x.find(y=>typeof y==="string")).slice(0,40)}»`);
    x.forEach(y=>phrases(y,out));
  }
  else if(x&&typeof x==="object")Object.values(x).forEach(y=>phrases(y,out));
  return out;
}
function check(p,x){
  cur=p;const list=phrases(x);total+=list.length;
  const seen=new Set();
  for(const [es,en] of list){
    if(!es.trim()||!en.trim()){err(`${p}: frase vacía en un idioma → «${es}» / «${en}»`);continue;}
    const ve=vars(es),vn=vars(en);
    if(ve.join()!==vn.join())err(`${p}: variables distintas es{${ve}} en{${vn}} → «${es.slice(0,40)}»`);
    const ok=[...GLOBAL,...(lookup(VARS,p,[]))];
    for(const v of ve)if(!ok.includes(v))err(`${p}: variable {${v}} no permitida aquí (permitidas: ${ok.join(", ")}) → «${es.slice(0,40)}»`);
    if(/[{}]/.test(es.replace(/\{\w+\}/g,""))||/[{}]/.test(en.replace(/\{\w+\}/g,"")))err(`${p}: llave suelta → «${es.slice(0,40)}»`);
    if(es.length>200||en.length>200)err(`${p}: frase demasiado larga (>200) → «${es.slice(0,40)}»`);
    else if(es.length>140||en.length>140)warn(`${p}: frase larga (>140) → «${es.slice(0,40)}»`);
    if(es===en&&/\p{L}{4,}/u.test(es))warn(`${p}: español e inglés idénticos → «${es.slice(0,40)}»`);
    if(seen.has(es))err(`${p}: frase repetida → «${es.slice(0,40)}»`);seen.add(es);
  }
  const min=lookup(MINV,p,MINV.default);
  if(seen.size<min)err(`${p}: ${seen.size} variantes, se piden ≥ ${min}`);
  return seen.size;
}
const counts={};
function walk(p,x){
  const leaf=isPair(x)||Array.isArray(x)||(x&&typeof x==="object"&&("t" in x));
  if(leaf){counts[p]=check(p,x);return;}
  if(x&&typeof x==="object")for(const [k,v] of Object.entries(x)){
    if(p==="T"&&k==="lang"){continue;}   // textos fijos del cambio de idioma (es/en)
    walk(p+"."+k,v);
  }
}
for(const g of ["T","FOLD","GREET","TOUR_PC","TOUR_MOB","MIC","FAST","TX","GEN"])walk(g,D[g]);
console.log(`\n${total} frases revisadas en ${Object.keys(counts).length} claves · ${errs} errores · ${warns} avisos`);
const low=Object.entries(counts).filter(([,n])=>n<15&&!/^(FOLD|TOUR|GEN|FAST\.mode)/.test(""+0)).length;
if(process.argv.includes("--tabla")){for(const [k,n] of Object.entries(counts).sort((a,b)=>a[1]-b[1]))console.log(String(n).padStart(4)+"  "+k);}
process.exit(errs?1:0);
