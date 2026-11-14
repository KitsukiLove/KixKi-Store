/*
  Ayudas comunes de la tienda: raíz, idioma, escape de texto, lectura de JSON y avisos (toast).
*/

import { $, $$ } from "../../core/util.js";
export let root, getJ;

let temporizadorAviso;

export const texto = (es, en) => (window.KXI && KXI.lang === "en" ? en : es);

export const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]
  );

export const toast = (m) => {
  const t = $("#toast");
  if (!t) return;
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => t.classList.remove("show"), 2400);
};

export const origs = () => $$("#app .cat:not(#favs):not(#news):not(#packs) .app");

export const nm = (a) => {
  const h = a.querySelector("h3");
  return h ? h.textContent.trim() : "";
};

export function iniciar() {
  root = document.documentElement;

  /* LS.g solo devuelve el dato si tiene el mismo tipo que el valor por defecto */
  getJ =
    window.KXJ_get ||
    (async (u) => {
      try {
        const r = await fetch(u);
        return r.ok ? await r.json() : null;
      } catch (e) {
        return null;
      }
    });
}
