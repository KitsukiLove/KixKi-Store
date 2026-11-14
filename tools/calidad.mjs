/* Mide la calidad interna del código (las metas están en docs/ARQUITECTURA.md y PLAN-ESTRUCTURA.md).
   Uso:  node tools/calidad.mjs        → tabla por archivo + totales
   Los archivos de datos/textos (dialogos/) se cuentan aparte: sus líneas largas son frases, no lógica. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IGNORAR = new Set([
  "node_modules",
  "vendor",
  "logos",
  "fonts",
  "data",
  "docs",
  "tools",
  ".git",
]);
const DATOS = /(^|\/)(dialogos\/|core\/idioma\/diccionario)/;

function listar(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listar(p, out);
    else if (/\.js$/.test(e.name) && e.name !== "sw.js") out.push(p);
  }
  return out;
}
/* longitud de la función más larga (por llaves) — aproximación suficiente para detectar gigantes */
function funcionesLargas(s, limite = 60) {
  let n = 0;
  for (const m of s.matchAll(/function\s*[\w$]*\s*\([^)]*\)\s*\{/g)) {
    let i = m.index + m[0].length,
      d = 1;
    while (d && i < s.length) {
      const c = s[i++];
      d += (c === "{") - (c === "}");
    }
    if (s.slice(m.index, i).split("\n").length > limite) n++;
  }
  return n;
}
const filas = [];
for (const f of listar(root)) {
  const s = fs.readFileSync(f, "utf8"),
    L = s.split("\n"),
    rel = path.relative(root, f);
  filas.push({
    rel,
    datos: DATOS.test(rel),
    lineas: L.length,
    l120: L.filter((x) => x.length > 120).length,
    l200: L.filter((x) => x.length > 200).length,
    maxLinea: Math.max(...L.map((x) => x.length)),
    coment: Math.round((100 * L.filter((x) => /^\s*(\/\*|\*|\/\/)/.test(x)).length) / L.length),
    var12: (s.match(/\b(?:let|const|var)\s+[A-Za-z_$]{1,2}\b/g) || []).length,
    catchVacio: (s.match(/catch\s*(?:\(\w*\))?\s*\{\s*\}/g) || []).length,
    ls: (s.match(/localStorage\./g) || []).length,
    fnLargas: funcionesLargas(s),
    cabecera: /^\s*\/\*[\s\S]{20,}?\*\//.test(s.slice(0, 6000)),
  });
}
const pad = (x, n) => String(x).padStart(n);
console.log(
  "archivo".padEnd(34),
  "líneas  >120  >200  máx  %com  var1-2  catch{}  localSt  fn>60  cabecera"
);
for (const r of filas.sort((a, b) => a.rel.localeCompare(b.rel)))
  console.log(
    r.rel.padEnd(34),
    pad(r.lineas, 6),
    pad(r.l120, 5),
    pad(r.l200, 5),
    pad(r.maxLinea, 5),
    pad(r.coment + "%", 5),
    pad(r.var12, 7),
    pad(r.catchVacio, 8),
    pad(r.ls, 8),
    pad(r.fnLargas, 6),
    "   " + (r.cabecera ? "sí" : "no")
  );
const L = filas.filter((r) => !r.datos),
  S = (k) => L.reduce((a, r) => a + r[k], 0);
console.log(
  "\nTOTAL (sin dialogos/):",
  S("lineas"),
  "líneas |",
  S("l120"),
  "largas>120 (",
  ((100 * S("l120")) / S("lineas")).toFixed(1) + "% ) |",
  S("l200"),
  "largas>200 |",
  S("var12"),
  "vars 1-2 letras |",
  S("catchVacio"),
  "catch vacíos |",
  S("ls"),
  "localStorage |",
  S("fnLargas"),
  "fn>60 líneas |",
  L.filter((r) => r.cabecera).length + "/" + L.length,
  "con cabecera"
);
