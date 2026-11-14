/*
  Ajusta el sonido según la lluvia, el nivel actual y el render a WAV.
*/

import { viva } from "./estado.js";
import { dark } from "./gotas.js";
import { wantSound } from "./sonido-base.js";
import { buildAudio } from "./sonido-motor.js";
export function syncSound() {
  const want = wantSound();
  if (want) {
    if (!viva.au) {
      if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
      try {
        viva.au = buildAudio();
      } catch (e) {
        viva.au = null;
        return;
      }
    }
    clearTimeout(viva.auClose);
    viva.auClose = 0;
    const c = viva.au.ctx;
    if (c.state === "suspended")
      try {
        c.resume();
      } catch (e) {
        // El contexto de audio puede estar cerrado: no hay nada que reanudar.
      }
    const night = dark(),
      v =
        Math.min(1, viva.inten) *
        (0.34 + 0.12 * viva.strength) *
        (night ? 0.8 : 1) *
        (window.KXM && KXM.on ? 0.7 : 1);
    viva.au.master.gain.setTargetAtTime(v, c.currentTime, 0.9);
    viva.au.level(Math.min(1, viva.inten) * (0.45 + 0.55 * viva.strength), 1.2);
    viva.au.lows.forEach((l) => l.frequency.setTargetAtTime(night ? 6500 : 9500, c.currentTime, 1));
    if (!viva.au.on) {
      viva.au.on = true;
      const o = viva.au;
      o.tm = setInterval(() => {
        if (viva.au !== o || !o.on) return;
        o.sched(
          o.ctx.currentTime + 0.04,
          0.1,
          Math.min(1, viva.inten) * (0.45 + 0.55 * viva.strength)
        );
      }, 100);
    }
  } else if (viva.au) {
    viva.au.on = false;
    clearInterval(viva.au.tm);
    viva.au.master.gain.setTargetAtTime(0, viva.au.ctx.currentTime, 0.5);
    if (!viva.auClose)
      viva.auClose = setTimeout(() => {
        viva.auClose = 0;
        if (!wantSound() && viva.au) {
          try {
            viva.au.ctx.close();
          } catch (e) {
            // El contexto de audio ya estaba cerrado.
          }
          viva.au = null;
        }
      }, 3500);
  }
}

export function levelNow() {
  if (!viva.au) return 0;
  const a = new Uint8Array(viva.au.an.fftSize);
  viva.au.an.getByteTimeDomainData(a);
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const x = (a[i] - 128) / 128;
    s += x * x;
  }
  return Math.sqrt(s / a.length);
}

/* para pruebas: renderiza unos segundos de lluvia (y un trueno) a un WAV en base64, sin altavoz */
export async function renderWav(sec, lv, thunderAt) {
  sec = sec || 8;
  lv = lv == null ? 1 : lv;
  const sr = 44100,
    oc = new OfflineAudioContext(2, sr * sec, sr),
    o = buildAudio(oc);
  o.master.gain.value = 0.5;
  o.level(lv);
  for (let t = 0; t < sec; t += 0.1) o.sched(t, 0.1, lv);
  if (thunderAt != null) o.thunder(thunderAt, 1);
  const b = await oc.startRendering(),
    L = b.getChannelData(0),
    R = b.getChannelData(1),
    n = L.length,
    buf = new ArrayBuffer(44 + n * 4),
    v = new DataView(buf);
  const ws = (p, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(p + i, s.charCodeAt(i));
  };
  ws(0, "RIFF");
  v.setUint32(4, 36 + n * 4, true);
  ws(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 2, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * 4, true);
  v.setUint16(32, 4, true);
  v.setUint16(34, 16, true);
  ws(36, "data");
  v.setUint32(40, n * 4, true);
  for (let i = 0; i < n; i++) {
    v.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true);
    v.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true);
  }
  let s = "";
  const u = new Uint8Array(buf);
  for (let i = 0; i < u.length; i += 8192)
    s += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
  return btoa(s);
}

export function iniciar() {
  setInterval(syncSound, 300);
  addEventListener("kixki-thunder", (e) => {
    const d = e.detail || {};
    if (viva.au && viva.au.on)
      try {
        viva.au.thunder(d.delay || 1, d.power);
      } catch (x) {
        // El trueno es sonido opcional: si falla se omite.
      }
  });
  addEventListener("click", () => setTimeout(syncSound, 50), true);
}
