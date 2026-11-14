/*
  Motor de síntesis (Web Audio): voces, reverb, eco, filtro, compresor y ritmo «humano».
*/

import { frecuencia, rng } from "./estado.js";
import { Q, RITMOS, ESCALAS } from "./teoria.js";
/* ───────────── motor ───────────── */
export function engine(c, dest) {
  const mix = c.createGain(),
    comp = c.createDynamicsCompressor(),
    lp = c.createBiquadFilter(),
    rv = c.createConvolver(),
    rg = c.createGain(),
    dl = c.createDelay(1.5),
    ds = c.createGain(),
    df = c.createGain(),
    dlp = c.createBiquadFilter(),
    nb = c.createBuffer(1, c.sampleRate, c.sampleRate),
    pw = {};
  comp.threshold.value = -20;
  comp.ratio.value = 3;
  comp.attack.value = 0.02;
  comp.release.value = 0.35;
  lp.type = "lowpass";
  lp.frequency.value = 6000;
  lp.Q.value = 0.25;
  mix.connect(comp);
  comp.connect(lp);
  lp.connect(dest);
  const len = (c.sampleRate * 2.8) | 0,
    ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    let v = 0;
    for (let i = 0; i < len; i++) {
      v += (Math.random() * 2 - 1 - v) * 0.3;
      d[i] = v * Math.pow(1 - i / len, 3.4) * 1.6;
    }
  }
  rv.buffer = ir;
  rg.gain.value = 0.25;
  mix.connect(rv);
  rv.connect(rg);
  rg.connect(lp);
  dlp.type = "lowpass";
  dlp.frequency.value = 2400;
  df.gain.value = 0.38;
  ds.gain.value = 0.2;
  mix.connect(ds);
  ds.connect(dl);
  dl.connect(dlp);
  dlp.connect(df);
  df.connect(dl);
  dlp.connect(lp);
  {
    const d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const G = (v, d) => {
    const g = c.createGain();
    g.gain.value = v;
    g.connect(d || mix);
    return g;
  };
  const env = (g, t, a, d, v) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  };
  const osc = (type, f, t, d, dst) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f;
    o.connect(dst);
    o.start(t);
    o.stop(t + d + 0.06);
    return o;
  };
  const F = (type, f, q, dst) => {
    const b = c.createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    b.Q.value = q;
    b.connect(dst);
    return b;
  };
  const wave = (w) =>
    pw[w] ||
    (() => {
      const n = 24,
        re = new Float32Array(n),
        im = new Float32Array(n);
      for (let k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * w);
      return (pw[w] = c.createPeriodicWave(re, im));
    })();
  const vib = (o, t, d, cents, hz) => {
    const l = c.createOscillator(),
      g = c.createGain();
    l.frequency.value = hz;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(cents, t + Math.min(d * 0.7, 0.5));
    l.connect(g);
    g.connect(o.detune);
    l.start(t);
    l.stop(t + d + 0.06);
  };
  const noise = (t, d, v, type, f, q, a) => {
    const s = c.createBufferSource(),
      g = G(0);
    s.buffer = nb;
    s.connect(F(type, f, q, g));
    env(g, t, a || 0.002, d, v);
    s.start(t, Math.random() * 0.5, d + 0.05);
  };
  const V = {
    ep(f, t, d, v) {
      [
        [1, 1, d],
        [2, 0.26, d * 0.5],
        [4, 0.06, d * 0.22],
        [7, 0.03, 0.1],
      ].forEach(([m, a, dd]) => {
        const g = G(0);
        env(g, t, 0.006, dd, v * a);
        osc("sine", f * m, t, dd + 0.02, g);
      });
    },
    bell(f, t, d, v) {
      [
        [1, 1, 1],
        [2.76, 0.38, 0.55],
        [5.4, 0.16, 0.3],
        [8.9, 0.06, 0.16],
      ].forEach(([m, a, k]) => {
        const g = G(0);
        env(g, t, 0.004, d * k, v * a);
        osc("sine", f * m, t, d * k + 0.02, g);
      });
    },
    pluck(f, t, d, v) {
      const g = G(0),
        fl = F("lowpass", 3200, 0.7, g);
      fl.frequency.setValueAtTime(3200, t);
      fl.frequency.exponentialRampToValueAtTime(500, t + d * 0.6);
      env(g, t, 0.004, d, v);
      osc("triangle", f, t, d, fl);
    },
    pulse(f, t, d, v) {
      const g = G(0),
        fl = F("lowpass", 2400, 0.5, g),
        o = c.createOscillator();
      o.setPeriodicWave(wave(0.25));
      o.frequency.value = f;
      o.connect(fl);
      o.start(t);
      o.stop(t + d + 0.06);
      env(g, t, 0.012, d, v);
      vib(o, t, d, 8, 5.3);
    },
    vib(f, t, d, v) {
      const g = G(0),
        o = osc("sine", f, t, d + 0.2, g);
      env(g, t, 0.18, d, v * 1.1);
      vib(o, t, d + 0.2, 24, 5.6);
      const g2 = G(0);
      env(g2, t, 0.2, d, v * 0.18);
      osc("sine", f * 2, t, d, g2);
    },
    pad(fs, t, d, v) {
      fs.forEach((f) => {
        [-6, 6].forEach((dt) => {
          const g = G(0),
            fl = F("lowpass", 1000, 0.3, g),
            o = osc("sawtooth", f, t, d + 1, fl);
          o.detune.value = dt;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(v / fs.length, t + 0.7);
          g.gain.setValueAtTime(v / fs.length, t + d);
          g.gain.linearRampToValueAtTime(0.0001, t + d + 0.9);
        });
      });
    },
    sub(f, t, d, v) {
      const g = G(0);
      env(g, t, 0.015, d, v);
      osc("sine", f, t, d, g);
      const g2 = G(0);
      env(g2, t, 0.01, d * 0.5, v * 0.5);
      osc("triangle", f * 2, t, d, g2);
    },
    tri(f, t, d, v) {
      const g = G(0);
      env(g, t, 0.008, d, v);
      osc("triangle", f, t, d, g);
    },
    kick(t, v) {
      const g = G(0),
        o = osc("sine", 130, t, 0.3, g);
      o.frequency.exponentialRampToValueAtTime(46, t + 0.12);
      env(g, t, 0.002, 0.24, v);
    },
    hat(t, v) {
      noise(t, 0.045, v * 0.18, "highpass", 7500, 0.5);
    },
    sh(t, v) {
      noise(t, 0.08, v * 0.2, "bandpass", 5200, 1.2, 0.012);
    },
    rim(t, v) {
      noise(t, 0.06, v * 0.2, "bandpass", 1900, 2.2);
      const g = G(0);
      env(g, t, 0.002, 0.06, v * 0.1);
      osc("sine", 330, t, 0.06, g);
    },
    sl(t, v) {
      [3300, 4100, 5200, 6100].forEach((f) => {
        const g = G(0);
        env(g, t, 0.003, 0.28, v * 0.05);
        osc("sine", f * (1 + Math.random() * 0.01), t, 0.3, g);
      });
      noise(t, 0.1, v * 0.08, "highpass", 6000, 0.6, 0.004);
    },
  };
  const DRV = { k: "kick", r: "rim", h: "hat", sh: "sh", sl: "sl" };
  let ph = null;
  function phrase(P, s, pr) {
    const sec = s >> 2,
      pair = (s >> 1) & 1,
      r = rng(P.seed * 977 + pair + [0, pair ? 30 : 0, 10, pair ? 40 : 0][sec]),
      sc = ESCALAS[P.sc],
      pool = [];
    for (let n = P.lo; n <= P.hi; n++)
      if (sc.includes((((n - P.key) % 12) + 12) % 12)) pool.push(n);
    const tp = RITMOS[Math.min(2, P.den)],
      pat = tp[(r() * tp.length) | 0],
      out = [],
      ca = pr[s & 3],
      cb = pr[(s + 1) & 3];
    let idx = (pool.length * 0.45) | 0,
      last = -1;
    for (let k = 0; k < 16; k++) {
      if (!pat[k]) continue;
      const ch = k < 8 ? ca : cb,
        pcs = Q[ch[1]].map((i) => (P.key + ch[0] + i) % 12);
      if (k % 4 === 0) {
        let best = idx,
          bd = 99;
        for (let j = 0; j < pool.length; j++) {
          const d = Math.abs(j - idx) + (pcs.includes(pool[j] % 12) ? 0 : 5) + (j === last ? 2 : 0);
          if (d < bd) {
            bd = d;
            best = j;
          }
        }
        idx = best;
      } else {
        idx += [-2, -1, -1, 1, 1, 2][(r() * 6) | 0];
        if (idx > pool.length * 0.8) idx -= 2;
        if (idx < pool.length * 0.1) idx += 2;
        idx = Math.max(0, Math.min(pool.length - 1, idx));
      }
      last = idx;
      out.push([k, pool[idx], idx]);
    }
    if (pair === 1 && out.length) {
      let b = out[out.length - 1][2],
        bd = 99;
      pool.forEach((n, j) => {
        const d = Math.abs(j - out[out.length - 1][2]) + ((n - P.key) % 12 === 0 ? 0 : 3);
        if (d < bd) {
          bd = d;
          b = j;
        }
      });
      out[out.length - 1][1] = pool[b];
    }
    return out;
  }
  return {
    set(P) {
      dl.delayTime.value = (60 / P.bpm) * 0.75;
      ds.gain.value = P.dl;
      rg.gain.value = P.rv;
      lp.frequency.value = P.lp;
      ph = null;
    },
    bar(P, b, t) {
      const sp = 60 / P.bpm,
        e = sp / 2,
        s = b % 16,
        sec = s >> 2,
        pr = (sec === 2 && P.prog2) || P.prog,
        ch = pr[s & 3],
        rt = P.key + ch[0],
        iv = Q[ch[1]],
        intro = b < 4;
      const at = (st) =>
          t + st * e + (st & 1 ? e * P.sw * 0.33 : 0) + (Math.random() - 0.5) * 0.012,
        vr = () => 0.86 + Math.random() * 0.28;
      if (P.pad) {
        const vo = iv.map((i) => {
          let n = rt + i;
          while (n < 54) n += 12;
          while (n >= 72) n -= 12;
          return frecuencia(n);
        });
        V.pad(vo, t, sp * 4, P.pad * 1.5);
      }
      if (P.bass) {
        let r = rt;
        while (r >= 53) r -= 12;
        while (r < 41) r += 12;
        (
          P.bp || [
            [0, 0, 3],
            [3, 0, 2],
            [6, 7, 2],
          ]
        ).forEach(([st, i, l]) => V[P.bass](frecuencia(r + i), at(st), l * e * 1.1, P.bv * vr()));
      }
      if (P.arp && !intro) {
        const tn = iv.slice(0, 4).map((i) => {
          let n = rt + i + P.ao;
          while (n < 57) n += 12;
          while (n >= 79) n -= 12;
          return n;
        });
        P.ap.forEach((a, st) => {
          if (a >= 0)
            V[P.arp](
              frecuencia(tn[a % tn.length]),
              at(st),
              e * (P.arp === "bell" ? 5 : 1.6),
              P.av * vr()
            );
        });
      }
      if (P.dr)
        for (const k in P.dr)
          P.dr[k].forEach((x) => {
            const st = typeof x === "number" ? x : x[0],
              v = typeof x === "number" ? 1 : x[1];
            V[DRV[k]](at(st), v * vr());
          });
      if (!intro) {
        if ((s & 1) === 0) ph = phrase(P, s, pr);
        if (ph)
          ph.forEach(([k, n], i) => {
            if (k >> 3 !== (s & 1)) return;
            const nx = ph[i + 1],
              l = Math.min(nx ? nx[0] - k : 6, 5);
            V[P.lead](frecuencia(n), at(k & 7), Math.max(0.25, l * e * P.sus), P.lv * 1.45 * vr());
          });
        if (P.sp && Math.random() < P.sp) {
          const tn = iv[(Math.random() * iv.length) | 0];
          let n = rt + tn + 24;
          while (n > 96) n -= 12;
          V.bell(frecuencia(n), at([2, 4, 6][(Math.random() * 3) | 0]), sp * 3, P.lv * 0.7);
        }
      }
    },
  };
}
