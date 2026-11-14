/*
  Descripciones de las apps en inglés (data/en.json).
*/

import { $$, normalizar as nrm } from "../../core/util.js";
import { getJ, texto, nm } from "./comun.js";
import { EXT } from "./datos.js";
let descripcionesEN, enP;

const loadEN = () =>
  enP ||
  (enP = getJ("data/en.json").then((j) => {
    descripcionesEN = j && typeof j === "object" && !Array.isArray(j) ? j : {};
    return descripcionesEN;
  }));

export async function langApps() {
  const en = texto(0, 1) === 1;
  if (en) await loadEN();
  if (en !== (texto(0, 1) === 1)) return; /* cambió de idioma mientras cargaba */
  $$("#app .cat .app").forEach((a) => {
    const n = nm(a),
      x = EXT[n];
    if (!n || !x) return;
    const t = en && descripcionesEN && descripcionesEN[n] ? descripcionesEN[n] : null;
    [
      [a.querySelector(".tag"), "tag"],
      [a.querySelector(".desc"), "desc"],
      [a.querySelector(".tip > span:last-child"), "tip"],
    ].forEach(([el, k]) => {
      if (!el) return;
      const v = t && t[k] ? t[k] : x.es[k];
      if (v && el.textContent !== v) el.textContent = v;
    });
    /* la búsqueda también entiende las palabras en inglés */
    if (t && !a.dataset.en) {
      a.dataset.en = 1;
      a.dataset.s = (a.dataset.s || "") + " " + nrm((t.tag || "") + " " + (t.desc || ""));
    }
  });
  dispatchEvent(new Event("resize"));
}

export function iniciar() {
  /* se aplica en cuanto carga, sin esperar al resto */

  /* ---------- descripciones en inglés (data/en.json) ---------- */
  descripcionesEN = null;
  enP = null;
}
