/* =========================================================
   UTILIDADES COMUNES · core/util.js
   Qué hace:  reúne los ayudantes pequeños que antes estaban copiados al principio de cada archivo
              ($ y $$, clamp, rnd, now, wait, «movimiento reducido», idioma…).
   Qué necesita: nada (el idioma lo lee de window.KXI, que publica core/i18n.js).
   Qué publica:  $, $$, clamp, rnd, now, wait, reducirMovimiento, idioma, enIngles, normalizar.
   Nombres cortos a propósito en $, $$, clamp, rnd, now, wait: son los que ya usa todo el código.
   ========================================================= */

/** Primer elemento que cumple el selector (dentro de `raiz`, por defecto todo el documento). */
export const $ = (selector, raiz = document) => raiz.querySelector(selector);

/** Todos los elementos que cumplen el selector, como lista normal (no NodeList). */
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

/** Limita `valor` al rango [minimo, maximo]. */
export const clamp = (valor, minimo, maximo) => Math.max(minimo, Math.min(maximo, valor));

/** Número al azar entre `a` (incluido) y `b` (excluido). */
export const rnd = (a, b) => a + Math.random() * (b - a);

/** Hora actual en milisegundos. */
export const now = () => Date.now();

/** Pausa asíncrona: `await wait(500)`. */
export const wait = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/** ¿La persona pidió menos animaciones en su sistema? */
export const reducirMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Idioma activo de la página: "en" o "es" (si i18n.js aún no cargó, "es"). */
export const idioma = () => (window.KXI && window.KXI.lang === "en" ? "en" : "es");

/** ¿La página está en inglés? */
export const enIngles = () => idioma() === "en";

/** Minúsculas y sin acentos, para comparar textos al buscar. */
export const normalizar = (texto) =>
  String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
