/*
  Utilidades de Kixki: raíz del documento, ¿PC o móvil?, elección de texto por idioma, formato de frases, app al azar y aviso de eventos.
*/

import { $$, idioma as lang } from "../../core/util.js";
export let root, KX;

export const isPC = () => !!KX.DSK();

export const texto = (m) => (Array.isArray(m) ? m[lang() === "en" ? 1 : 0] : m);

export const fmt = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (a, k) => (v[k] != null ? v[k] : a)) : s);

const pad2 = (n) => String(n).padStart(2, "0");

export const emit = (t, d) =>
  dispatchEvent(new CustomEvent("kixki-evt", { detail: Object.assign({ t }, d) }));

export function randApp() {
  const hs = $$("#app .cat:not(#favs):not(#news):not(#packs) .app h3");
  if (!hs.length) return null;
  const h = hs[Math.floor(Math.random() * hs.length)],
    c = h.closest(".cat"),
    t = c && c.querySelector(".tbt");
  return {
    app: h.textContent.trim(),
    carpeta: t ? t.textContent.replace(/\.exe$/i, "").trim() : "",
  };
}

export function ctxVars(raw, v) {
  const o = Object.assign({}, v);
  if (o.a != null && o.app == null) o.app = o.a;
  if (/\{hora\}/.test(raw) && o.hora == null) {
    const d = new Date();
    o.hora = pad2(d.getHours()) + ":" + pad2(d.getMinutes());
  }
  if (/\{(app|carpeta)\}/.test(raw) && (o.app == null || o.carpeta == null)) {
    const r = randApp(),
      en = lang() === "en";
    if (o.app == null) o.app = r ? r.app : en ? "an app" : "una app";
    if (o.carpeta == null)
      o.carpeta = r && r.carpeta ? r.carpeta : en ? "some folder" : "alguna carpeta";
  }
  return o;
}

export function iniciar() {
  root = document.documentElement;
  KX = window.KX || { DSK: () => false };

  /* variables de contexto: {hora} {app} {carpeta} valen en cualquier frase (se calculan solo si la frase las usa) */
}
