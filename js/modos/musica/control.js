/*
  Control: empezar, parar, cambiar de tema y fundidos.
*/

import { root, viva } from "./estado.js";
import { engine } from "./motor.js";
import { pick } from "./piezas-xp.js";
/* ───────────── reproducción ───────────── */
function tick() {
  const P = viva.cur;
  if (!P || !viva.E) return;
  while (viva.next < viva.ac.currentTime + 0.9) {
    viva.E.bar(P, viva.bar++, viva.next);
    viva.next += 240 / P.bpm;
  }
}

function fade(v, s) {
  if (!viva.ac || !viva.fg) return;
  const t = viva.ac.currentTime;
  viva.fg.gain.cancelScheduledValues(t);
  viva.fg.gain.setValueAtTime(viva.fg.gain.value, t);
  viva.fg.gain.linearRampToValueAtTime(v, t + s);
}

function begin(n) {
  viva.cur = n;
  viva.bar = 0;
  if (viva.E) viva.E.set(n);
  if (viva.ac) viva.next = viva.ac.currentTime + 0.08;
}

/* Cambio de fondo/estación/tema: baja el volumen, cambia de pieza y vuelve a subirlo (sin cortes si no cambió nada) */
function theme() {
  const n = pick();
  if (n === viva.cur) return;
  if (!viva.cur || !viva.on) {
    viva.cur = n;
    return;
  }
  clearTimeout(viva.sw);
  fade(0, 0.8);
  viva.sw = setTimeout(() => {
    if (!viva.on) return;
    const q = pick();
    if (q !== viva.cur) begin(q);
    fade(1, 1.6);
  }, 860);
}

export function start() {
  if (viva.on && viva.timer) return;
  try {
    viva.ac = viva.ac || new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    return;
  }
  if (!viva.fg) {
    viva.fg = viva.ac.createGain();
    viva.fg.gain.value = 0;
    const m = viva.ac.createGain();
    m.gain.value = 0.42;
    viva.fg.connect(m);
    m.connect(viva.ac.destination);
    viva.E = engine(viva.ac, viva.fg);
  }
  clearTimeout(viva.stT);
  clearTimeout(viva.sw);
  viva.cur = null;
  viva.on = false;
  theme();
  viva.ac.resume();
  viva.on = true;
  begin(viva.cur || pick());
  clearInterval(viva.timer);
  viva.timer = setInterval(tick, 150);
  fade(1, 1.2);
}

export function stop() {
  viva.on = false;
  clearInterval(viva.timer);
  viva.timer = 0;
  clearTimeout(viva.sw);
  fade(0, 0.5);
  clearTimeout(viva.stT);
  viva.stT = setTimeout(() => {
    if (!viva.on && viva.ac) viva.ac.suspend();
  }, 650);
}

export function iniciar() {
  new MutationObserver(theme).observe(root, {
    attributes: true,
    attributeFilter: ["data-theme", "data-bg", "data-xps"],
  });
  document.addEventListener("visibilitychange", () => {
    if (!viva.ac || !viva.on) return;
    document.hidden ? viva.ac.suspend() : viva.ac.resume();
  });
}
