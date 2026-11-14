/*
  Sonido de lluvia (WebAudio, sin archivos): ruido, impulsos y banco de gotas.
*/

import { rnd, viva } from "./estado.js";
import { puente } from "./puente.js";

export const pageSound = () => {
  const b = document.getElementById("rd");
  return !!b && b.getAttribute("aria-pressed") === "true";
};

export const wantSound = () => viva.rsOn && pageSound() && !document.hidden && viva.inten > 0.02;

export function noiseBuf(ctx, kind) {
  const len = Math.floor(ctx.sampleRate * 6),
    buf = ctx.createBuffer(1, len, ctx.sampleRate),
    d = buf.getChannelData(0);
  let l = 0,
    b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "brown") {
      l = (l + 0.02 * w) / 1.02;
      d[i] = l * 3.5;
    } else {
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
    }
  }
  /* las puntas se funden para que el bucle no «clic» */
  const f = Math.floor(ctx.sampleRate * 0.05);
  for (let i = 0; i < f; i++) {
    const k = i / f;
    d[i] *= k;
    d[len - 1 - i] *= k;
  }
  return buf;
}

/* eco de espacio abierto: ruido que se apaga en ~1.8 s, distinto en cada oído */
export function impulse(ctx, sec, pow) {
  const n = Math.floor(ctx.sampleRate * sec),
    b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, pow);
  }
  return b;
}

/* banco de impactos: ráfagas de ruido de 12 a 45 ms con filtro paso bajo distinto (superficie dura, hojas, hierba) + plops de agua */
export function dropBank(ctx) {
  const sr = ctx.sampleRate,
    hits = [],
    plops = [];
  for (let k = 0; k < 14; k++) {
    const len = Math.floor(sr * rnd(0.012, 0.045)),
      b = ctx.createBuffer(1, len, sr),
      d = b.getChannelData(0),
      cut = rnd(0.1, 0.6),
      tau = len * rnd(0.14, 0.3);
    let y = 0,
      y2 = 0,
      pk = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      y += (w - y) * cut;
      y2 += (y - y2) * Math.min(1, cut * 1.6);
      const att = Math.min(1, i / (sr * 0.0006)),
        v = (y - y2 * 0.55) * Math.exp(-i / tau) * att;
      d[i] = v;
      pk = Math.max(pk, Math.abs(v));
    }
    for (let i = 0; i < len; i++) d[i] /= pk || 1;
    hits.push(b);
  }
  for (let k = 0; k < 5; k++) {
    const len = Math.floor(sr * 0.11),
      b = ctx.createBuffer(1, len, sr),
      d = b.getChannelData(0),
      f0 = rnd(520, 980);
    let ph = 0,
      pk = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sr,
        f = f0 * (1 + 0.9 * (1 - Math.exp(-t / 0.018)));
      ph += (6.2832 * f) / sr;
      const v =
        Math.sin(ph) * Math.exp(-t / 0.028) * Math.min(1, t / 0.002) +
        (Math.random() * 2 - 1) * 0.12 * Math.exp(-t / 0.004);
      d[i] = v;
      pk = Math.max(pk, Math.abs(v));
    }
    for (let i = 0; i < len; i++) d[i] /= pk || 1;
    plops.push(b);
  }
  return { hits, plops };
}

export function iniciar() {
  /* ---- sonido de lluvia (sintetizado, sin archivos) · versión 2 ----
   Capas: lavado de ruido rosa en estéreo (siseo + cuerpo) · murmullo grave de tejado · viento que sube y baja ·
   cientos de impactos de gota por segundo (ráfagas de ruido muy cortas, de distinto tamaño y posición en el estéreo) ·
   «plops» de gotas en los charcos · eco suave de espacio abierto · truenos lejanos que llegan con retraso tras cada relámpago.
   Suena solo si el sonido de la página está activo (botón del altavoz / menú Efectos o Música) y «Sonido de lluvia» está en sí.
   Sube y baja con suavidad según la intensidad de la lluvia. */

  puente.pageSound = pageSound;
}
