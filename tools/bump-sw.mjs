// Node 18+. Prepara sw.js antes de subir cambios:  node tools/bump-sw.mjs
//   1) Recorre la página (index.html → js/main.js → imports → CSS → fuentes/imágenes) y reconstruye SOLO la lista SHELL de sw.js
//      (lo que se guarda para funcionar sin conexión). Ya no hay que editarla a mano al añadir un archivo.
//   2) Pone una versión nueva (hash del contenido) -> los visitantes reciben «Hay una versión nueva · Recargar».
// Cómo encuentra los archivos: atributos href/src de index.html, `import`/`import()` de los .js, rutas entre comillas que apunten a
// un archivo existente (así entran los CSS de Kixki, los GIF, data/*.json…) y url() de los CSS.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const RAIZ = process.cwd();
const IGNORAR = /^(tools|docs|node_modules|\.github)\//;
const EXT = "js|mjs|css|json|png|gif|svg|woff2?|webmanifest|jpg|webp|ico";
const encontrados = new Set(["index.html"]);
const pendientes = ["index.html"];

const existe = (rel) =>
  !IGNORAR.test(rel) &&
  fs.existsSync(path.join(RAIZ, rel)) &&
  fs.statSync(path.join(RAIZ, rel)).isFile();
const norm = (p) => p.split(path.sep).join("/").replace(/^\.\//, "");
function agregar(rel) {
  rel = norm(rel).split(/[?#]/)[0];
  if (!existe(rel) || encontrados.has(rel)) return;
  encontrados.add(rel);
  if (/\.(js|mjs|css|webmanifest|html)$/.test(rel)) pendientes.push(rel);
}

while (pendientes.length) {
  const rel = pendientes.pop();
  const txt = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const dir = path.posix.dirname(rel);
  const relativoA = (r) => path.posix.normalize(path.posix.join(dir, r));
  if (rel.endsWith(".html")) {
    for (const m of txt.matchAll(/(?:href|src)=["']([^"':]+?)["']/g)) agregar(m[1]);
  } else if (rel.endsWith(".css")) {
    for (const m of txt.matchAll(/url\(\s*["']?([^)"':]+?)["']?\s*\)/g)) agregar(relativoA(m[1]));
  } else if (rel.endsWith(".webmanifest")) {
    for (const m of txt.matchAll(/"src"\s*:\s*"([^"]+)"/g)) agregar(m[1]);
  } else {
    // imports (relativos al archivo)
    for (const m of txt.matchAll(/(?:import\s*\(\s*|import\s+|from\s+)["'](\.{1,2}\/[^"']+)["']/g))
      agregar(relativoA(m[1]));
    // rutas entre comillas (relativas a index.html, que es el documento)
    for (const m of txt.matchAll(
      new RegExp(`["'\`]((?:[\\w-]+/)*[\\w.-]+\\.(?:${EXT}))["'\`]`, "g")
    ))
      agregar(m[1]);
  }
}

// --- modulepreload: los módulos que main.js importa de forma estática se anuncian en index.html para que el navegador
// los baje EN PARALELO (sin esto, cada nivel de imports espera al anterior). Los de Kixki (import() dinámico) no se precargan.
function importsEstaticos(rel) {
  const txt = fs.readFileSync(path.join(RAIZ, rel), "utf8");
  const dir = path.posix.dirname(rel);
  const salida = [];
  for (const m of txt.matchAll(
    /(?:^|\n)\s*(?:import|export)\s[^"';]*?from\s+["'](\.{1,2}\/[^"']+)["']|(?:^|\n)\s*import\s+["'](\.{1,2}\/[^"']+)["']/g
  )) {
    salida.push(path.posix.normalize(path.posix.join(dir, m[1] || m[2])));
  }
  return salida;
}
const estaticos = new Set();
(function recorrer(rel) {
  if (estaticos.has(rel) || !existe(rel)) return;
  estaticos.add(rel);
  importsEstaticos(rel).forEach(recorrer);
})("js/main.js");
const MARCA_INI = "<!-- modulepreload:inicio (lo genera tools/bump-sw.mjs) -->";
const MARCA_FIN = "<!-- modulepreload:fin -->";
let pagina = fs.readFileSync("index.html", "utf8");
if (!pagina.includes(MARCA_INI)) throw new Error("index.html: faltan las marcas de modulepreload");
const enlaces = [...estaticos]
  .sort()
  .map((r) => `<link rel="modulepreload" href="${r}">`)
  .join("\n");
const ini = pagina.indexOf(MARCA_INI),
  fin = pagina.indexOf(MARCA_FIN);
if (fin < ini) throw new Error("index.html: marcas de modulepreload en desorden");
pagina = pagina.slice(0, ini) + `${MARCA_INI}\n${enlaces}\n` + pagina.slice(fin);
fs.writeFileSync("index.html", pagina);
console.log(`index.html -> ${estaticos.size} módulos precargados`);

const shell = ["./", ...[...encontrados].sort((a, b) => a.localeCompare(b))];
const sw = fs.readFileSync("sw.js", "utf8");
if (!/SHELL=\[.*?\]/.test(sw)) throw new Error("sw.js: no encuentro SHELL=[...]");
const h = crypto.createHash("sha1");
for (const u of shell) if (u !== "./") h.update(u).update(fs.readFileSync(u));
const v = "kixki-" + h.digest("hex").slice(0, 8);
const nuevo = sw
  .replace(/SHELL=\[.*?\]/, "SHELL=" + JSON.stringify(shell))
  .replace(/const V="[^"]+"/, `const V="${v}"`);
fs.writeFileSync("sw.js", nuevo);
console.log(`sw.js -> versión ${v} · ${shell.length} archivos en el SHELL`);
