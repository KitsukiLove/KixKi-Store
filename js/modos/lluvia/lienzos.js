/*
  Lienzos de la lluvia (capa de atrás y de delante, y los del modo XP): tamaño y montaje.
*/

import { root, TAM_PIXEL } from "./estado.js";
export let lienzoAtras, lienzoXpAtras, lienzoXpFrente, ancho, alto, xpOn;

let lienzoFrente;

const mkc = (id) => {
  const c = document.createElement("canvas");
  c.id = id;
  c.setAttribute("aria-hidden", "true");
  return c;
};

const isXP = () =>
  root.getAttribute("data-style") === "xp" || root.getAttribute("data-bg") === "xp";

export function fit() {
  ancho = Math.ceil(innerWidth / TAM_PIXEL);
  alto = Math.ceil(innerHeight / TAM_PIXEL);
  const sc = xpOn ? TAM_PIXEL * Math.min(2, devicePixelRatio || 1) : 1;
  [lienzoAtras, lienzoFrente].forEach((c) => {
    c.width = Math.round(ancho * sc);
    c.height = Math.round(alto * sc);
  });
  [lienzoXpAtras, lienzoXpFrente].forEach((x) => {
    x.setTransform(sc, 0, 0, sc, 0, 0);
    x.imageSmoothingEnabled = xpOn;
  });
}

export function mount() {
  if (lienzoAtras.isConnected) return;
  const bgx = document.getElementById("bgx");
  document.body.append(lienzoAtras, lienzoFrente);
  if (bgx) bgx.after(lienzoAtras);
  fit();
}

export function iniciar() {
  /* ---- lienzos ---- */

  lienzoAtras = mkc("kr-bg");
  lienzoFrente = mkc("kr-fg");
  lienzoXpAtras = lienzoAtras.getContext("2d");
  lienzoXpFrente = lienzoFrente.getContext("2d");
  ancho = 0;
  alto = 0;
  /* modo XP: lluvia suave (lienzos a resolución real, mismas coordenadas lógicas) con estilo o fondo XP */

  xpOn = isXP();
  new MutationObserver(() => {
    const v = isXP();
    if (v === xpOn) return;
    xpOn = v;
    if (lienzoAtras.isConnected) fit();
  }).observe(root, { attributes: true, attributeFilter: ["data-style", "data-bg"] });
}
