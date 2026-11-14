/*
  Búsqueda difusa (tolera errores de tipeo) para el buscador de apps.
  Necesita: nada. Publica: fzPick, fzSuggest.
  Primero busca lo exacto; solo si no hay nada exacto prueba con tolerancia (así «fdroid» no trae media tienda).
*/

import { normalizar as nrm } from "../../core/util.js";
/* Búsqueda tolerante: ignora acentos, guiones y espacios («fdroid» = «F-Droid»), perdona 1-2 letras mal puestas, cambiadas o de menos
   («aurra stroe» → Aurora Store) y todas las palabras escritas deben aparecer. Si no hay resultados sugiere el nombre más parecido. */
const osa = (a, b, m) => {
  const n = a.length,
    k = b.length;
  if (Math.abs(n - k) > m) return m + 1;
  let p2 = null,
    p1 = Array.from({ length: k + 1 }, (_, j) => j);
  for (let i = 1; i <= n; i++) {
    const c = [i];
    let lo = i;
    for (let j = 1; j <= k; j++) {
      let v = Math.min(p1[j] + 1, c[j - 1] + 1, p1[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        v = Math.min(v, p2[j - 2] + 1);
      c[j] = v;
      if (v < lo) lo = v;
    }
    if (lo > m) return m + 1;
    p2 = p1;
    p1 = c;
  }
  return p1[k];
};

const wcache = new WeakMap(),
  wordsOf = (a) => {
    const s = a.dataset.s,
      c = wcache.get(a);
    if (c && c.s === s) return c;
    const w = [...new Set(s.split(/[^a-z0-9]+/).filter(Boolean))],
      r = { s, w, j: s.replace(/[^a-z0-9]+/g, "") };
    wcache.set(a, r);
    return r;
  };

const tolOf = (t) => (t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0);

function tokOk(t, hay, W) {
  if (hay.s.includes(t)) return true;
  const tc = t.replace(/[^a-z0-9]+/g, "");
  if (!tc) return true;
  if (hay.j.includes(tc)) return true;
  const m = tolOf(tc);
  if (!m) return false;
  for (const w of W) {
    if (osa(tc, w, m) <= m) return true;
    if (w.length > tc.length) {
      for (let L = tc.length - 1; L <= tc.length + 1; L++)
        if (L >= 3 && L < w.length && osa(tc, w.slice(0, L), m) <= m) return true;
    }
  }
  return false;
}

function fzStrict(a, v) {
  const h = wordsOf(a);
  return h.s.includes(v) || h.j.includes(v.replace(/[^a-z0-9]+/g, ""));
}

function fzm(a, v) {
  if (!v) return true;
  const hay = wordsOf(a);
  if (fzStrict(a, v)) return true;
  return v.split(/\s+/).every((t) => tokOk(t, hay, hay.w));
}

export const fzPick = (list, v) => (v ? (list.some((a) => fzStrict(a, v)) ? fzStrict : fzm) : null);

export function fzSuggest(v) {
  let best = null,
    bd = 99;
  const tc = v.replace(/[^a-z0-9]+/g, "");
  if (tc.length < 3) return null;
  document.querySelectorAll("#app .cat:not(#favs):not(#news):not(#packs) .app").forEach((a) => {
    const n = nrm(a.querySelector("h3").textContent),
      nj = n.replace(/[^a-z0-9]+/g, "");
    let d = osa(tc, nj, 6);
    for (const w of n.split(/[^a-z0-9]+/).filter((x) => x.length >= 3))
      d = Math.min(d, osa(tc, w, 6) + 1);
    const m = Math.max(2, Math.round(tc.length * 0.4));
    if (d <= m && d < bd) {
      bd = d;
      best = a.querySelector("h3").textContent;
    }
  });
  return best;
}
