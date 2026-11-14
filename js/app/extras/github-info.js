/*
  Muestra en cada app con repositorio las estrellas y la fecha de la última actualización (datos de data/meta.json,
  los trae la Action de GitHub) y avisa si lleva más de un año sin cambios o está archivada.
*/

import { borrar } from "../../core/store.js";
import { $$ } from "../../core/util.js";
import { metaApps } from "../catalogo/datos.js";
import { appsOriginales } from "./base.js";

/* --- estado desde GitHub (con caché de 1 día) --- */
const ago = (d) => {
  const n = (Date.now() - Date.parse(d)) / 864e5;
  return n < 1
    ? "hoy"
    : n < 31
      ? `hace ${Math.round(n)} días`
      : n < 365
        ? `hace ${Math.round(n / 30)} meses`
        : `hace ${(n / 365).toFixed(1)} años`;
};

function ghShow(r, d) {
  const old = (Date.now() - Date.parse(d.p)) / 864e5 > 365,
    w = old || d.a;
  const t =
    `★ ${d.s >= 1e3 ? (d.s / 1e3).toFixed(1) + "k" : d.s} · Actualizada ${ago(d.p)}` +
    (d.a ? " · Archivada" : old ? " · sin cambios en más de un año" : "");
  $$(`.app[data-repo="${r}"]`).forEach((a) => {
    const o = a.querySelector(".gh");
    if (o) o.remove();
    a.querySelector(".links").insertAdjacentHTML(
      "beforebegin",
      `<div class="gh${w ? " old" : ""}">${w ? "⚠ " : ""}${t}</div>`
    );
  });
}

export function iniciar() {
  /* Estrellas y fecha de actualización: SOLO de data/meta.json (lo refresca `node tools/sync.mjs`).
   Ya no se consulta api.github.com desde el navegador del visitante. */
  for (const r of new Set(
    appsOriginales()
      .map((a) => a.dataset.repo)
      .filter(Boolean)
  ))
    if (metaApps.repos[r]) ghShow(r, metaApps.repos[r]);
  /* limpia la caché de la versión anterior */
  borrar("kixki-gh");
}
