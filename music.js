/**
 * music.js — Música generativa y sonido de Kixki Store (Web Audio, sin archivos).
 *
 * En vez de un bucle grabado, el motor COMPONE mientras suena:
 *   · armonía: cada ambiente tiene varias progresiones y elige otra al terminar cada vuelta;
 *   · melodía: un motivo de 8 pasos que se repite, se muta o se renueva compás a compás,
 *     escrito en grados relativos al acorde (se adapta a cada armonía);
 *   · timbres: pad suave (osciladores desafinados + filtro), bajo, campanas FM, caja de
 *     música, theremin con vibrato, percusión de ruido y «latido»; reverb por convolución.
 * Así no se repite nunca igual y suena más cuidado que un oscilador suelto.
 *
 * El ambiente sale de  (fondo activo) × (tema Día/Noche):
 *   clásico · valle · halloween · navidad   ×   light · dark.
 * Cambia con un fundido cuando cambia el fondo (evento kx:bg) o el tema.
 *
 * Controles: botón de silencio + barra de volumen (#audio-ctl). El volumen se guarda
 * ("kixki-vol"). Mute = state.audio.music (el mismo interruptor del menú y del botón #tm).
 * Efectos de interfaz (state.audio.sfx): blip(freq, dur), usado también por game.js.
 *
 * Pausa: si la pestaña se oculta, el AudioContext se suspende (y vuelve al regresar).
 * prefers-reduced-motion: tempo y densidad más calmados y nada empieza solo.
 */

import * as state from "./state.js";
import { getBg, reducedMotion } from "./scenes.js";
import { defineSprite, icon, retarget } from "./sprites.js";
import { T } from "./render.js";

/* =====================================================================
   1. Ambientes
   mode = semitonos de la escala; progs = grados raíz de cada acorde (4 compases);
   lead = timbre de la melodía; wet = reverb; wind = viento de fondo.
   ===================================================================== */

const MAJOR = [0, 2, 4, 5, 7, 9, 11], DORIAN = [0, 2, 3, 5, 7, 9, 10], LYDIAN = [0, 2, 4, 6, 7, 9, 11], PHRYG = [0, 1, 3, 5, 7, 8, 10];

const MOODS = {
  light: { root: 60, mode: MAJOR, bpm: 88, progs: [[0, 5, 3, 4], [0, 3, 4, 3], [0, 4, 5, 3], [3, 4, 0, 5]], lead: "tri", pad: .6, padLp: 1400, bass: true, perc: "hat", density: .5, wet: .3 },
  dark: { root: 57, mode: DORIAN, bpm: 62, progs: [[0, 3, 4, 0], [0, 5, 3, 4], [0, 4, 3, 4]], lead: "box", pad: .8, padLp: 900, bass: true, perc: "", density: .32, wet: .5 },
  "valle:light": { root: 65, mode: LYDIAN, bpm: 80, progs: [[0, 1, 4, 1], [0, 4, 5, 3], [0, 3, 1, 4]], lead: "tri", pad: .6, padLp: 1600, bass: true, perc: "hat", density: .5, wet: .35 },
  "valle:dark": { root: 62, mode: DORIAN, bpm: 58, progs: [[0, 3, 0, 4], [0, 4, 3, 0]], lead: "box", pad: .9, padLp: 800, bass: true, perc: "", density: .3, wet: .6 },
  "halloween:light": { root: 57, mode: PHRYG, bpm: 80, progs: [[0, 1, 0, 6], [0, 5, 1, 0], [0, 3, 1, 0]], lead: "theremin", pad: .6, padLp: 1100, bass: true, perc: "heart", density: .35, wet: .45, wind: .3 },
  "halloween:dark": { root: 52, mode: PHRYG, bpm: 56, progs: [[0, 1, 0, 0], [0, 6, 5, 1]], lead: "theremin", pad: .85, padLp: 700, bass: true, perc: "heart", density: .28, wet: .6, wind: .6 },
  "navidad:light": { root: 67, mode: MAJOR, bpm: 100, progs: [[0, 5, 3, 4], [0, 3, 0, 4], [0, 2, 3, 4], [0, 5, 1, 4]], lead: "bell", pad: .4, padLp: 1800, bass: true, perc: "tick", density: .6, wet: .35 },
  "navidad:dark": { root: 62, mode: MAJOR, bpm: 72, progs: [[0, 3, 0, 4], [0, 5, 3, 4]], lead: "box", pad: .55, padLp: 1100, bass: true, perc: "", density: .42, wet: .5 },
};

function moodKey() {
  const th = state.get("theme"), bg = getBg();
  return bg && MOODS[`${bg}:${th}`] ? `${bg}:${th}` : th;
}

/* =====================================================================
   2. Grafo de audio (se crea con el primer gesto del usuario)
   ===================================================================== */

const VOL_KEY = "kixki-vol";
const VOL_SCALE = .8;
const readVol = () => { try { const v = parseFloat(localStorage.getItem(VOL_KEY)); return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : .5; } catch (_) { return .5; } };

let ctx = null, master = null, reverb = null, noiseBuf = null;
let volume = readVol();
let gesture = false;                       // los navegadores solo dejan sonar tras un gesto

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC({ latencyHint: "playback" }); } catch (_) { ctx = new AC(); }
  master = ctx.createGain();
  master.gain.value = volume * VOL_SCALE;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -20; comp.knee.value = 24; comp.ratio.value = 3; comp.attack.value = .01; comp.release.value = .25;
  master.connect(comp);
  comp.connect(ctx.destination);
  reverb = ctx.createConvolver();
  reverb.buffer = impulse(2.4, 2.6);
  reverb.connect(master);
  return ctx;
}

/** Respuesta al impulso sintética: ruido que se apaga exponencialmente (sala suave). */
function impulse(sec, decay) {
  const n = Math.floor(ctx.sampleRate * sec), buf = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
  }
  return buf;
}

function noise() {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

/** Cada ambiente suena por su propio bus: así se puede fundir hacia dentro/fuera. */
function makeBus(cfg) {
  const input = ctx.createGain(), out = ctx.createGain(), send = ctx.createGain();
  out.gain.value = 0;
  send.gain.value = cfg.wet;
  input.connect(out);
  out.connect(master);
  out.connect(send);
  send.connect(reverb);
  let wind = null;
  if (cfg.wind) wind = makeWind(cfg.wind, input);
  return {
    input, out,
    dispose() { wind?.stop(); try { input.disconnect(); out.disconnect(); send.disconnect(); } catch (_) { /* ya desconectado */ } },
  };
}

function makeWind(level, dest) {
  const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain();
  src.buffer = noise(); src.loop = true;
  bp.type = "bandpass"; bp.frequency.value = 500; bp.Q.value = .7;
  lfo.frequency.value = .08; lg.gain.value = 260;
  lfo.connect(lg); lg.connect(bp.frequency);
  g.gain.value = level * .09;
  src.connect(bp); bp.connect(g); g.connect(dest);
  src.start(); lfo.start();
  return { stop() { try { src.stop(); lfo.stop(); } catch (_) { /* ya parado */ } } };
}

/* =====================================================================
   3. Voces
   ===================================================================== */

const rnd = Math.random;
const pick = a => a[(rnd() * a.length) | 0];
const BAR = 8;                                                     // pasos (corcheas) por compás

const semis = (S, deg) => S.cfg.mode[((deg % 7) + 7) % 7] + 12 * Math.floor(deg / 7);
const freq = (S, deg) => 440 * 2 ** ((S.cfg.root + semis(S, deg) - 69) / 12);

/** Oscilador con envolvente de ataque lineal y caída exponencial. */
function tone(S, f, t, dur, o) {
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = o.type;
  osc.frequency.value = f;
  if (o.detune) osc.detune.value = o.detune;
  g.gain.setValueAtTime(.0001, t);
  g.gain.linearRampToValueAtTime(o.vol, t + o.a);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(g);
  if (o.lp) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = o.lp;
    g.connect(lp); lp.connect(S.bus.input);
  } else g.connect(S.bus.input);
  osc.start(t);
  osc.stop(t + dur + .05);
}

/** Acorde sostenido: 8 osciladores desafinados que comparten un filtro paso-bajo. */
function pad(S, t) {
  const o = S.cfg, dur = S.stepDur * BAR, c = S.chord, peak = o.pad * .035;
  const g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = "lowpass"; f.frequency.value = o.padLp; f.Q.value = .5;
  g.gain.setValueAtTime(.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + dur * .4);
  g.gain.setValueAtTime(peak, t + dur * .6);
  g.gain.linearRampToValueAtTime(.0001, t + dur + .5);
  f.connect(g);
  g.connect(S.bus.input);
  [c, c + 2, c + 4, c + 7].forEach((d, i) => [-6, 6].forEach(det => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 ? "triangle" : "sawtooth";
    osc.frequency.value = freq(S, d);
    osc.detune.value = det;
    osc.connect(f);
    osc.start(t);
    osc.stop(t + dur + .6);
  }));
}

function bass(S, t, light) {
  if (!S.cfg.bass) return;
  tone(S, freq(S, S.chord - 7), t, S.stepDur * (light ? 2 : 4), { type: "sine", vol: light ? .09 : .14, a: .03, lp: 400 });
}

/** Campana FM (navidad). */
function bell(S, f, t, dur, v) {
  const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
  car.frequency.value = f;
  mod.frequency.value = f * 3.5;
  mg.gain.setValueAtTime(f * 1.4, t);
  mg.gain.exponentialRampToValueAtTime(f * .02, t + dur * .7);
  mod.connect(mg); mg.connect(car.frequency);
  g.gain.setValueAtTime(.0001, t);
  g.gain.linearRampToValueAtTime(v, t + .004);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  car.connect(g); g.connect(S.bus.input);
  car.start(t); mod.start(t);
  car.stop(t + dur + .05); mod.stop(t + dur + .05);
}

/** Caja de música: fundamental + armónicos que se apagan rápido. */
function box(S, f, t, v) {
  tone(S, f, t, 1.6, { type: "sine", vol: v, a: .004 });
  tone(S, f * 2, t, .8, { type: "sine", vol: v * .35, a: .004 });
  tone(S, f * 4.01, t, .25, { type: "sine", vol: v * .12, a: .002 });
}

/** Theremin (halloween): seno con vibrato y un pequeño deslizamiento de entrada. */
function theremin(S, f, t, dur, v) {
  const osc = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(f * .985, t);
  osc.frequency.linearRampToValueAtTime(f, t + .12);
  lfo.frequency.value = 5 + rnd();
  lg.gain.value = f * .012;
  lfo.connect(lg); lg.connect(osc.frequency);
  g.gain.setValueAtTime(.0001, t);
  g.gain.linearRampToValueAtTime(v, t + .18);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(g); g.connect(S.bus.input);
  osc.start(t); lfo.start(t);
  osc.stop(t + dur + .05); lfo.stop(t + dur + .05);
}

function lead(S, t, rel) {
  const f = freq(S, S.chord + 7 + rel), v = .15 * (.8 + rnd() * .4);
  switch (S.cfg.lead) {
    case "bell": bell(S, f, t, 2.2, v); break;
    case "box": box(S, f, t, v); break;
    case "theremin": theremin(S, f, t, S.stepDur * (rnd() < .4 ? 3 : 1.7), v * .9); break;
    default: tone(S, f, t, S.stepDur * 2.2, { type: "triangle", vol: v, a: .015, lp: 2600 });
  }
}

function noiseHit(S, t, dur, hp, vol) {
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noise();
  f.type = "highpass"; f.frequency.value = hp;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(S.bus.input);
  src.start(t, rnd() * 1.5, dur + .02);
}

function thump(S, t, vol) {
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.frequency.setValueAtTime(80, t);
  osc.frequency.exponentialRampToValueAtTime(38, t + .15);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(.0001, t + .28);
  osc.connect(g); g.connect(S.bus.input);
  osc.start(t); osc.stop(t + .3);
}

/* =====================================================================
   4. Composición: motivos y compases
   ===================================================================== */

/** Motivo de 8 pasos: grados relativos a la raíz del acorde (null = silencio). */
function newMotif(density) {
  const m = [];
  let prev = pick([0, 2, 4]);
  for (let k = 0; k < BAR; k++) {
    if (k % 4 === 0) { prev = pick([0, 2, 4, 7]); m.push(prev); }
    else if (rnd() < density) { prev = Math.max(-2, Math.min(8, prev + pick([-2, -1, 1, 2]))); m.push(prev); }
    else m.push(null);
  }
  return m;
}

function mutate(motif, density) {
  const m = [...motif];
  for (let n = 1 + (rnd() < .5); n > 0; n--) {
    const k = (rnd() * BAR) | 0;
    m[k] = k % 4 === 0 ? pick([0, 2, 4, 7]) : rnd() < density ? pick([-1, 1, 2, 3, 5]) : null;
  }
  return m;
}

function playStep(S, t) {
  const bs = S.step % BAR;
  if (bs === 0) {
    const bar = S.step / BAR;
    if (bar && bar % S.prog.length === 0) S.prog = pick(S.cfg.progs);          // nueva armonía cada vuelta
    S.chord = S.prog[bar % S.prog.length];
    const r = rnd();
    S.motif = r < .5 ? S.motif : r < .85 ? mutate(S.motif, S.density) : newMotif(S.density);
    pad(S, t);
    bass(S, t, false);
  }
  if (bs === 4) bass(S, t, true);
  const rel = S.motif[bs];
  if (rel != null) lead(S, t + (rnd() - .5) * .016, rel);                       // micro-desfase «humano»
  switch (S.cfg.perc) {
    case "hat": if (bs % 2) noiseHit(S, t, .04, 7000, .035 * (.7 + rnd() * .6)); break;
    case "tick": if (bs % 2) noiseHit(S, t, .09, 4500, .04); break;
    case "heart": if (bs === 0) thump(S, t, .2); else if (bs === 2) thump(S, t, .12); break;
  }
}

/* =====================================================================
   5. Sesión y planificador
   ===================================================================== */

let sess = null, timer = 0;

function startSession() {
  const key = moodKey(), cfg = MOODS[key], calm = reducedMotion();
  const density = cfg.density * (calm ? .7 : 1);
  sess = {
    key, cfg, density, bus: makeBus(cfg),
    stepDur: 60 / (cfg.bpm * (calm ? .85 : 1)) / 2,
    next: ctx.currentTime + .12, step: 0,
    prog: pick(cfg.progs), chord: 0, motif: newMotif(density),
  };
  sess.bus.out.gain.setTargetAtTime(1, ctx.currentTime, .6);
  if (!timer) timer = setInterval(tick, 40);
}

function endSession(s, fade) {
  s.bus.out.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
  setTimeout(() => s.bus.dispose(), fade * 1000 + 800);
}

function tick() {
  if (!sess || ctx.state !== "running") return;          // contexto suspendido (pestaña oculta): no se programa nada
  while (sess.next < ctx.currentTime + .3) {
    playStep(sess, sess.next);
    sess.next += sess.stepDur;
    sess.step++;
  }
}

function switchMood() {
  if (!sess || sess.key === moodKey()) return;
  endSession(sess, 1.6);
  startSession();
}

function start() {
  if (!ensureCtx()) { state.setMusic(false); return; }
  ctx.resume?.();
  if (sess) endSession(sess, .3);
  startSession();
}

function stop() {
  if (sess) { endSession(sess, 1); sess = null; }
  clearInterval(timer);
  timer = 0;
  setTimeout(() => { if (ctx && !state.get("audio").music) ctx.suspend?.(); }, 2200);
}

/* =====================================================================
   6. Efectos de interfaz (state.audio.sfx)
   ===================================================================== */

/** Pitido corto de interfaz. Solo suena con «Efectos» activado y tras un gesto del usuario. */
export function blip(f = 660, dur = .07) {
  if (!gesture || !state.get("audio").sfx || !ensureCtx()) return;
  if (ctx.state === "suspended") ctx.resume?.();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "square";
  o.frequency.value = f;
  g.gain.setValueAtTime(.05, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + dur);
  o.connect(g); g.connect(master);
  o.start();
  o.stop(ctx.currentTime + dur + .02);
}

/* =====================================================================
   7. Controles: botón de silencio + volumen
   ===================================================================== */

const SPK_ON = [
  "...x...x.", "..xx.x..x", "xxxx..x.x", "xxxx..x.x", "xxxx..x.x", "..xx.x..x", "...x...x.",
];
const SPK_OFF = [
  "...x.....", "..xx.....", "xxxx.x.x.", "xxxx..x..", "xxxx.x.x.", "..xx.....", "...x.....",
];

let ui = null;

function buildUi() {
  defineSprite("ui-speaker", SPK_ON);
  defineSprite("ui-speaker-off", SPK_OFF);
  document.body.insertAdjacentHTML("beforeend",
    `<div id="audio-ctl" role="group"><button type="button" class="ac-btn" aria-pressed="false">${icon("ui-speaker-off", 3)}</button><input type="range" min="0" max="100" step="1" value="${Math.round(volume * 100)}"></div>`);
  const el = document.getElementById("audio-ctl");
  ui = { el, btn: el.querySelector(".ac-btn"), range: el.querySelector("input") };
  ui.btn.addEventListener("click", state.toggleMusic);
  ui.range.addEventListener("input", () => setVolume(ui.range.value / 100));
}

function setVolume(v) {
  volume = Math.min(1, Math.max(0, v));
  try { localStorage.setItem(VOL_KEY, String(volume)); } catch (_) { /* sin almacenamiento */ }
  if (master) master.gain.setTargetAtTime(volume * VOL_SCALE, ctx.currentTime, .05);
  syncUi();
}

function syncUi() {
  if (!ui) return;
  const on = state.get("audio").music, audible = on && volume > 0;
  retarget(ui.btn.querySelector("svg"), audible ? "ui-speaker" : "ui-speaker-off");
  ui.btn.setAttribute("aria-pressed", on);
  ui.btn.setAttribute("aria-label", on ? T("audio.mute", "Silenciar música") : T("audio.unmute", "Activar música"));
  ui.el.setAttribute("aria-label", T("audio.label", "Sonido"));
  ui.range.setAttribute("aria-label", T("audio.volume", "Volumen"));
  ui.range.value = Math.round(volume * 100);
  ui.range.style.setProperty("--v", ui.range.value + "%");
}

/* =====================================================================
   8. Arranque
   ===================================================================== */

export function init() {
  addEventListener("pointerdown", () => { gesture = true; }, { once: true, capture: true });
  addEventListener("keydown", () => { gesture = true; }, { once: true, capture: true });

  buildUi();

  state.subscribe("audio", (a, prev) => {
    if (a.music !== prev.music) a.music ? start() : stop();
    if (a.sfx && !prev.sfx) blip(880, .1);
    syncUi();
  }, { immediate: true });
  state.subscribe("lang", syncUi);
  state.subscribe("theme", switchMood);
  document.addEventListener("kx:bg", switchMood);

  // pitidos de las ventanas y de favoritas
  state.subscribe("windows", (w, prev) => {
    for (const id in w.items) {
      const cur = w.items[id], old = prev.items[id];
      if (old && cur.state !== old.state) { blip(cur.state === "min" ? 330 : 660); break; }
    }
  });
  state.subscribe("favs", (f, prev) => blip(f.length > prev.length ? 990 : 440));

  // pestaña oculta → suspender el audio; al volver, reanudar solo si la música está activa
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend?.();
    else if (state.get("audio").music) ctx.resume?.();
  });

  // compatibilidad con el global de music.js anterior (windows.js lo consulta)
  window.KXM = { get on() { return state.get("audio").music; }, toggle: state.toggleMusic, setVolume };
}
