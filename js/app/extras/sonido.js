/*
  Sonido sintetizado con Web Audio (sin archivos de audio): beep() para clics y baa() para la oveja.
  Respeta el interruptor de sonido, limita cuántos sonidos suenan a la vez y cambia de escala según la estación.
  (window.KXS = { beep, baa } lo publica contador-ovejas.js).
*/

import { leer } from "../../core/store.js";
import { root } from "../escritorio/vista.js";
import { SPOST } from "../catalogo/ventanas-cat.js";
export let sonidoActivo;

let contextoAudio,
  horaUltimoSonido,
  ultimaNota,
  horaUltimaNota,
  horasSonidos,
  horasBalidos,
  cadenaAudio;

export const fijarSonido = (v) => {
  sonidoActivo = v;
};

/* Efectos: una sola cadena de audio compartida (volumen, filtro y compresor). Solo se crea tras un gesto del usuario,
   se calla con la pestaña oculta y cambia de escala/timbre según el fondo y la hora (día/noche). */
const PERFILES_SONIDO = {
  "": { sc: [0, 2, 4, 7, 9], w: "sine" },
  valle: { sc: [0, 2, 4, 7, 9], w: "triangle" },
  primavera: { sc: [0, 2, 4, 7, 9], w: "triangle" },
  verano: { sc: [0, 2, 4, 7, 9], w: "triangle" },
  otono: { sc: [0, 3, 5, 7, 10], w: "sine" },
  invierno: { sc: [0, 2, 4, 7, 9], w: "sine", bell: 1 },
  halloween: { sc: [0, 3, 5, 6, 7, 10], w: "triangle", lo: 1 },
  navidad: { sc: [0, 2, 4, 7, 9], w: "sine", bell: 1 },
};

function fxCtx() {
  if (!sonidoActivo || document.hidden) return null;
  if (!contextoAudio) {
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return null;
    try {
      contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
    const g = contextoAudio.createGain(),
      l = contextoAudio.createBiquadFilter(),
      c = contextoAudio.createDynamicsCompressor();
    l.type = "lowpass";
    g.connect(l);
    l.connect(c);
    c.connect(contextoAudio.destination);
    cadenaAudio = { g, l };
  }
  if (contextoAudio.state === "suspended") contextoAudio.resume();
  const night = root.getAttribute("data-theme") === "dark";
  cadenaAudio.g.gain.value = (night ? 0.7 : 1) * (KXM.on ? 0.55 : 1);
  cadenaAudio.l.frequency.value = night ? 1700 : 2600;
  return contextoAudio;
}

export function beep(f = 660, d = 0.07) {
  const n = performance.now();
  if (n - horaUltimoSonido < 90) return;
  horasSonidos = horasSonidos.filter((x) => n - x < 2500);
  if (horasSonidos.length >= 6) return; /* nunca más de 6 sonidos cada 2,5 s */
  const a = fxCtx();
  if (!a) return;
  horaUltimoSonido = n;
  horasSonidos.push(n);
  try {
    const P = PERFILES_SONIDO[root.getAttribute("data-bg") || ""] || PERFILES_SONIDO[""],
      SC = P.sc,
      m = Math.round(69 + 12 * Math.log2(f / 440)),
      r = ((m % 12) + 12) % 12,
      b = m - r;
    let i = 0;
    SC.forEach((p, j) => {
      if (Math.abs(p - r) < Math.abs(SC[i] - r)) i = j;
    });
    let mi = b + SC[i];
    if (mi === ultimaNota && n - horaUltimaNota < 400) {
      i = Math.max(0, Math.min(SC.length - 1, i + (i ? -1 : 1)));
      mi = b + SC[i];
    }
    ultimaNota = mi;
    horaUltimaNota = n; /* no repite la misma nota seguida */
    const fr = 440 * Math.pow(2, ((P.lo ? mi - 12 : mi) - 69) / 12),
      t = a.currentTime,
      len = Math.max(d, 0.1) + 0.1,
      o = a.createOscillator(),
      h = a.createOscillator(),
      g = a.createGain(),
      hg = a.createGain();
    o.type = P.w;
    h.type = P.bell ? "sine" : "triangle";
    o.frequency.setValueAtTime(fr * 0.985, t);
    o.frequency.exponentialRampToValueAtTime(fr, t + 0.025);
    h.frequency.value = fr * (P.bell ? 2.76 : 2);
    hg.gain.value = P.bell ? 0.14 : 0.22;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.075, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g);
    h.connect(hg);
    hg.connect(g);
    g.connect(cadenaAudio.g);
    o.start(t);
    h.start(t);
    o.stop(t + len + 0.02);
    h.stop(t + len + 0.02);
  } catch (e) {
    // El sonido es opcional: si el audio no está listo se omite.
  }
}

export function baa() {
  const n = performance.now();
  horasBalidos = horasBalidos.filter((x) => n - x < 4000);
  if (horasBalidos.length && n - horasBalidos[horasBalidos.length - 1] < 450)
    return; /* tocar muy rápido no apila balidos */
  if (horasBalidos.length >= 4 && Math.random() < 0.6) {
    horasBalidos.push(n);
    return;
  }
  const a = fxCtx();
  if (!a) return;
  horasBalidos.push(n);
  try {
    const night = root.getAttribute("data-theme") === "dark",
      hw = root.getAttribute("data-bg") === "halloween",
      t = a.currentTime,
      o = a.createOscillator(),
      v = a.createOscillator(),
      vg = a.createGain(),
      f = a.createBiquadFilter(),
      f2 = a.createBiquadFilter(),
      g = a.createGain(),
      b = (360 + Math.random() * 80) * (night ? 0.88 : 1) * (hw ? 0.82 : 1);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(b * 1.15, t);
    o.frequency.linearRampToValueAtTime(b * 0.85, t + 0.5);
    v.frequency.value = 28;
    vg.gain.value = 22;
    v.connect(vg);
    vg.connect(o.frequency);
    f.type = "bandpass";
    f.frequency.value = 900;
    f.Q.value = 2.2;
    f2.type = "bandpass";
    f2.frequency.value = 1700;
    f2.Q.value = 3;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.085, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(f);
    o.connect(f2);
    f.connect(g);
    f2.connect(g);
    g.connect(cadenaAudio.g);
    o.start(t);
    v.start(t);
    o.stop(t + 0.6);
    v.stop(t + 0.6);
  } catch (e) {
    // El sonido es opcional: si el audio no está listo se omite.
  }
}

export function iniciar() {
  sonidoActivo = leer("kixki-snd", true);

  horaUltimoSonido = 0;
  ultimaNota = -1;
  horaUltimaNota = 0;
  horasSonidos = [];
  horasBalidos = [];
  SPOST.push((s, t) => {
    if (s.dataset.ls === t) return;
    s.dataset.ls = t;
    beep(t === "min" ? 330 : 660);
  });
}
