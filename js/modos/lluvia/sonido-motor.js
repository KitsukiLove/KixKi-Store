/*
  Construye el audio de la lluvia: viento, charcos, eco y truenos.
*/

import { rnd } from "./estado.js";
import { dropBank, impulse, noiseBuf } from "./sonido-base.js";
export function buildAudio(ctxArg) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC && !ctxArg) throw 0;
  const ctx = ctxArg || new AC(),
    master = ctx.createGain(),
    comp = ctx.createDynamicsCompressor(),
    an = ctx.createAnalyser(),
    bus = ctx.createGain(),
    bed = ctx.createGain(),
    verb = ctx.createConvolver(),
    vg = ctx.createGain();
  master.gain.value = 0;
  an.fftSize = 1024;
  comp.threshold.value = -20;
  comp.ratio.value = 3.5;
  comp.attack.value = 0.01;
  comp.release.value = 0.3;
  bed.gain.value = 0.3;
  bed.connect(bus);
  bus.connect(master);
  verb.buffer = impulse(ctx, 1.8, 2.6);
  vg.gain.value = 0.2;
  bus.connect(vg);
  vg.connect(verb);
  verb.connect(master);
  master.connect(comp);
  comp.connect(ctx.destination);
  master.connect(an);
  const pink = noiseBuf(ctx, "pink"),
    brown = noiseBuf(ctx, "brown"),
    lows = [],
    mk = ctx.createStereoPanner ? () => ctx.createStereoPanner() : null;
  const src = (buf, pan, off) => {
    const n = ctx.createBufferSource();
    n.buffer = buf;
    n.loop = true;
    const p = mk ? mk() : null;
    if (p) p.pan.value = pan;
    n.start(0, off);
    return { n, p };
  };
  const out = (node, p) => {
    if (p) {
      node.connect(p);
      p.connect(bed);
    } else node.connect(bed);
  };
  /* lavado estéreo: siseo agudo + cuerpo medio */
  [
    [-0.6, 0],
    [0.6, 2.7],
  ].forEach(([pan, off]) => {
    const a = src(pink, pan, off),
      hp = ctx.createBiquadFilter(),
      lp = ctx.createBiquadFilter(),
      g = ctx.createGain();
    hp.type = "highpass";
    hp.frequency.value = 1800;
    lp.type = "lowpass";
    lp.frequency.value = 9500;
    lp.Q.value = 0.5;
    g.gain.value = 0.34;
    lows.push(lp);
    a.n.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    out(g, a.p);
    const b = src(pink, pan * 0.7, off + 1.9),
      bp = ctx.createBiquadFilter(),
      bg = ctx.createGain(),
      lfo = ctx.createOscillator(),
      lg = ctx.createGain();
    bp.type = "bandpass";
    bp.frequency.value = 1150;
    bp.Q.value = 0.55;
    bg.gain.value = 0.3;
    lfo.frequency.value = 0.09 + pan * 0.02;
    lg.gain.value = 0.07;
    lfo.connect(lg);
    lg.connect(bg.gain);
    lfo.start();
    b.n.connect(bp);
    bp.connect(bg);
    out(bg, b.p);
  });
  /* murmullo grave del suelo y las hojas */
  {
    const a = src(brown, 0, 0.7),
      lp = ctx.createBiquadFilter(),
      g = ctx.createGain();
    lp.type = "lowpass";
    lp.frequency.value = 300;
    g.gain.value = 0.2;
    a.n.connect(lp);
    lp.connect(g);
    out(g, null);
  }
  /* viento: ruido en banda media cuya fuerza y tono suben y bajan lento, como las ráfagas del pasto */
  {
    const a = src(pink, 0, 3.1),
      bp = ctx.createBiquadFilter(),
      g = ctx.createGain(),
      l1 = ctx.createOscillator(),
      l2 = ctx.createOscillator(),
      lg1 = ctx.createGain(),
      lg2 = ctx.createGain(),
      lf = ctx.createGain();
    bp.type = "bandpass";
    bp.frequency.value = 480;
    bp.Q.value = 1.1;
    g.gain.value = 0.06;
    l1.frequency.value = 0.075;
    lg1.gain.value = 0.07;
    l2.frequency.value = 0.19;
    lg2.gain.value = 0.04;
    l1.connect(lg1);
    lg1.connect(g.gain);
    l2.connect(lg2);
    lg2.connect(g.gain);
    l1.start();
    l2.start();
    const l3 = ctx.createOscillator();
    l3.frequency.value = 0.11;
    lf.gain.value = 170;
    l3.connect(lf);
    lf.connect(bp.frequency);
    l3.start();
    a.n.connect(bp);
    bp.connect(g);
    out(g, null);
  }
  /* posiciones fijas en el estéreo para los impactos (así no se crea un panner por gota) */
  const lanes = [-0.9, -0.5, -0.15, 0.15, 0.5, 0.9].map((v) => {
    if (!mk) {
      return bus;
    }
    const p = mk();
    p.pan.value = v;
    p.connect(bus);
    return p;
  });
  const bank = dropBank(ctx),
    o = {
      ctx,
      master,
      an,
      lows,
      bus,
      verb,
      vg,
      on: false,
      tm: 0,
      brown,
      pink,
      /* cuánto suenan las capas de fondo (0 = llovizna, 1 = chaparrón) */
      level(lv, t) {
        const v = 0.18 + 0.82 * lv;
        if (t) bed.gain.setTargetAtTime(v, ctx.currentTime, t);
        else bed.gain.value = v;
      },
    };
  /* programa los impactos de una ventana de tiempo: muchos y flojitos, pocos fuertes */
  o.sched = (t0, dur, lv) => {
    const rate = (20 + 190 * lv) * dur,
      n = Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const s = ctx.createBufferSource(),
        g = ctx.createGain();
      s.buffer = bank.hits[Math.floor(Math.random() * bank.hits.length)];
      s.playbackRate.value = rnd(0.65, 1.6);
      g.gain.value = Math.pow(Math.random(), 2.4) * 0.19 + 0.01;
      s.connect(g);
      g.connect(lanes[Math.floor(Math.random() * lanes.length)]);
      s.start(t0 + Math.random() * dur);
    }
    const pr = (0.55 + 1.6 * lv) * dur,
      pn = Math.floor(pr) + (Math.random() < pr % 1 ? 1 : 0);
    for (let i = 0; i < pn; i++) {
      const s = ctx.createBufferSource(),
        g = ctx.createGain();
      s.buffer = bank.plops[Math.floor(Math.random() * bank.plops.length)];
      s.playbackRate.value = rnd(0.7, 1.35);
      g.gain.value = rnd(0.03, 0.085);
      s.connect(g);
      g.connect(lanes[Math.floor(Math.random() * lanes.length)]);
      s.start(t0 + Math.random() * dur);
    }
  };
  /* trueno: un chasquido seco (solo si cae cerca) y un rumor grave que rueda varios segundos */
  o.thunder = (delay, pw) => {
    const t = ctx.currentTime + Math.max(0.05, delay),
      p = Math.max(0.15, Math.min(1, pw == null ? 1 : pw));
    if (delay < 1.4) {
      const c = ctx.createBufferSource(),
        hp = ctx.createBiquadFilter(),
        g = ctx.createGain();
      c.buffer = pink;
      hp.type = "highpass";
      hp.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.5 * p, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      c.connect(hp);
      hp.connect(g);
      g.connect(bus);
      c.start(t, rnd(0, 2), 0.3);
    }
    const r = ctx.createBufferSource(),
      lp = ctx.createBiquadFilter(),
      g = ctx.createGain(),
      p2 = mk ? mk() : null;
    r.buffer = brown;
    lp.type = "lowpass";
    lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(520, t);
    lp.frequency.exponentialRampToValueAtTime(70, t + 4.8);
    const A = 2.4 * p;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(A, t + 0.18);
    g.gain.linearRampToValueAtTime(A * 0.45, t + 0.8);
    g.gain.linearRampToValueAtTime(A * 0.9, t + 1.25);
    g.gain.linearRampToValueAtTime(A * 0.35, t + 2.3);
    g.gain.linearRampToValueAtTime(A * 0.55, t + 3.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 6);
    if (p2) p2.pan.value = rnd(-0.5, 0.5);
    r.connect(lp);
    lp.connect(g);
    if (p2) {
      g.connect(p2);
      p2.connect(bus);
    } else g.connect(bus);
    r.start(t, rnd(0, 0.3), 5.8);
  };
  return o;
}
