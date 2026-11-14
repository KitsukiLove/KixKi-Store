/*
  Render a WAV, botón del menú y arranque guardado.
*/

import { guardarTexto, leerTexto } from "../../core/store.js";
import { start, stop } from "./control.js";
import { LSK, viva } from "./estado.js";
import { engine } from "./motor.js";
import { PIEZAS_PIXEL, PIEZAS_XP } from "./piezas-xp.js";
let guardado;

/* _render: para probar sin altavoces (devuelve un WAV 16 bits en base64) */
async function render(bg, xps, night, secs, sr) {
  const P = (
    bg === "xp" ? PIEZAS_XP[xps] || PIEZAS_XP.clasica : PIEZAS_PIXEL[bg] || PIEZAS_PIXEL.classic
  )[night ? "night" : "day"];
  const oc = new OfflineAudioContext(2, sr * secs, sr),
    g = oc.createGain();
  g.gain.value = 0.42;
  g.connect(oc.destination);
  const en = engine(oc, g);
  en.set(P);
  const bl = 240 / P.bpm;
  for (let b = 0, t = 0.05; t < secs; b++, t += bl) en.bar(P, b, t);
  const buf = await oc.startRendering(),
    L = buf.getChannelData(0),
    R = buf.getChannelData(1),
    n = L.length,
    u = new DataView(new ArrayBuffer(44 + n * 4));
  const w = (o, s) => [...s].forEach((c, i) => u.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  u.setUint32(4, 36 + n * 4, true);
  w(8, "WAVEfmt ");
  u.setUint32(16, 16, true);
  u.setUint16(20, 1, true);
  u.setUint16(22, 2, true);
  u.setUint32(24, sr, true);
  u.setUint32(28, sr * 4, true);
  u.setUint16(32, 4, true);
  u.setUint16(34, 16, true);
  w(36, "data");
  u.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) {
    u.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
    u.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
  }
  let s = "";
  const by = new Uint8Array(u.buffer);
  for (let i = 0; i < by.length; i += 8192)
    s += String.fromCharCode.apply(null, by.subarray(i, i + 8192));
  return btoa(s);
}

export function iniciar() {
  window.KXM = {
    get on() {
      return viva.on;
    },
    toggle() {
      viva.on ? stop() : start();
      guardarTexto(LSK, viva.on ? "1" : "0");
      return viva.on;
    },
    _render: render,
    _pieces: () => ({ px: Object.keys(PIEZAS_PIXEL), xp: Object.keys(PIEZAS_XP) }),
  };
  guardado = leerTexto(LSK);
  if (guardado === "1" || guardado === null) {
    viva.on = true;
    let g = 0;
    const go = () => {
      if (g || !viva.on) return;
      g = 1;
      start();
    };
    /* sin guardado = música activada; el navegador exige un toque o tecla para dejarla sonar */ addEventListener(
      "pointerdown",
      go,
      { once: true }
    );
    addEventListener("keydown", go, { once: true });
  }
}
