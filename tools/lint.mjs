/* Corre ESLint con la configuración del proyecto (eslint.config.mjs).
   Uso:  node tools/lint.mjs   ·   necesita ESLint instalado una vez:  npm i -D eslint
   Sale con código 1 si hay ERRORES (los avisos no frenan). */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const req = createRequire(path.join(root, "package.json"));
let ESLint;
try {
  ({ ESLint } = req("eslint"));
} catch {
  console.error("Falta ESLint. Instálalo una vez con:  npm i -D eslint");
  process.exit(2);
}
const eslint = new ESLint({ cwd: root });
const res = await eslint.lintFiles(["js", "tools"]);
const fmt = await eslint.loadFormatter("stylish");
const txt = await fmt.format(res);
if (txt.trim()) console.log(txt);
const e = res.reduce((a, r) => a + r.errorCount, 0),
  w = res.reduce((a, r) => a + r.warningCount, 0);
console.log(`ESLint: ${e} errores · ${w} avisos en ${res.length} archivos`);
process.exit(e ? 1 : 0);
