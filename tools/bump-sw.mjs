// Node 18+. Pone en sw.js una versión nueva (calculada con el contenido de los archivos) y revisa que el SHELL esté completo.
// Uso (desde la carpeta principal, ANTES de subir cambios):  node tools/bump-sw.mjs
// Si cambia cualquier archivo, cambia la versión -> los visitantes reciben el aviso «Hay una versión nueva · Recargar».
import fs from "node:fs";import crypto from "node:crypto";
const sw=fs.readFileSync("sw.js","utf8");
const shell=JSON.parse(sw.match(/SHELL=(\[.*?\])/)[1]);
const h=crypto.createHash("sha1");let miss=[];
for(const u of shell){if(u==="./")continue;if(!fs.existsSync(u)){miss.push(u);continue;}h.update(u).update(fs.readFileSync(u));}
if(miss.length){console.error("FALTAN archivos del SHELL (quítalos de sw.js o créalos):",miss.join(", "));process.exit(1);}
// avisa de CSS/JS que la página usa pero el SHELL no guarda (no es grave: se guardan al usarse, pero no funcionarían sin conexión la 1.ª vez)
const used=new Set();
for(const f of ["index.html","carga.js"]){const t=fs.readFileSync(f,"utf8");for(const m of t.matchAll(/["'(]([\w\-\/]+\.(?:js|css|json|png|gif|webmanifest|woff2?))["')]/g))used.add(m[1]);}
const falta=[...used].filter(u=>!shell.includes(u)&&fs.existsSync(u)&&!/^(tools|docs|vendor)\//.test(u));
if(falta.length)console.warn("Aviso: la página usa estos archivos y no están en el SHELL de sw.js:",falta.join(", "));
const v="kixki-"+h.digest("hex").slice(0,8);
fs.writeFileSync("sw.js",sw.replace(/const V="[^"]+"/,`const V="${v}"`));
console.log("sw.js -> versión",v);
