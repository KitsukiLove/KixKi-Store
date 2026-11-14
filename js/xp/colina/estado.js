/*
  Estado de la colina XP viva: raíz, pausa, estilo (día/noche, estación) y generador de números con semilla fija.
*/

export let box;

let root;

export const SVG_NS = "http://www.w3.org/2000/svg";

export const paused = () =>
  box.classList.contains("kv-pause") || !!(window.KXB && KXB.paused && KXB.paused());

export const isXP = () => root.getAttribute("data-bg") === "xp";

export const dark = () => root.getAttribute("data-theme") === "dark";

export const variant = () => root.getAttribute("data-xps") || "clasica";

export const esIngles = () => window.KXI && KXI.lang === "en";

export const aleatorioEntre = (r, a, b) => a + r() * (b - a);

export function prng(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function iniciar() {
  root = document.documentElement;
  box = document.getElementById("bgx");
  if (!box) return;
}
