/* Escena 3D: mesa de encantamientos, libro flotante (cerrado/abierto), ritual y resultado en columnas de luz. */
(function () {
  'use strict';
  const { Engine, mat } = window.MesaEngine;
  const PI = Math.PI;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mixv = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const xf = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* Homografía: cuadrado unidad -> cuadrilátero de pantalla; devuelve matrix3d para un elemento de w x h px. */
  function quadMatrix(q, w, h) {
    const [x0, y0] = q[0], [x1, y1] = q[1], [x2, y2] = q[2], [x3, y3] = q[3];
    const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    const den = dx1 * dy2 - dx2 * dy1; if (Math.abs(den) < 1e-9) return 'none';
    const g = (dx3 * dy2 - dx2 * dy3) / den, k = (dx1 * dy3 - dx3 * dy1) / den;
    const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
    const f = v => +v.toFixed(5);
    return `matrix3d(${f(a / w)},${f(d / w)},0,${f(g / w)},${f(b / h)},${f(e / h)},0,${f(k / h)},0,0,1,0,${f(x0)},${f(y0)},0,1)`;
  }

  /* Emblema genérico de la portada (estrella dorada con un ojo). 12x12 */
  function defaultEmblem() {
    const cells = [], gold = [1, 0.83, 0.43], pur = [0.7, 0.45, 1], wht = [1, 0.97, 0.85];
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) {
      const dx = i - 5.5, dy = j - 5.5, r = Math.hypot(dx, dy), a = Math.abs(dx), b = Math.abs(dy);
      let c = null;
      if (r < 1.3) c = wht;
      else if (Math.sqrt(a) + Math.sqrt(b) < 2.55 && r < 6.2) c = gold;
      else if (r > 4.9 && r < 5.9) c = pur;
      if (c) cells.push({ x: i, y: j, c });
    }
    return cells;
  }

  class MesaScene {
    constructor(canvas, opts) {
      opts = opts || {};
      this.eng = new Engine(canvas);
      this.canvas = canvas;
      this.reduce = !!opts.reduce;
      this.t = 0; this.stateName = 'intro'; this.stateT = 0;
      this.cam = { eye: [0, 6.2, 10.4], ctr: [0, 2.4, 0], fov: 46 };
      this.bk = { P: [0, 2.7, 0], tilt: 0.95, roll: 0, open: 0, scl: 1, energy: 0.2 };
      this.spin = { ang: 0, v: 0 };
      this.accent = hex('#b36bff'); this.accentT = this.accent.slice();
      this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      this.shift = 0; this.shiftT = 0; this.hshift = 0; this.hshiftT = 0;
      this.hover = 0; this.hoverT = 0; this.flash = 0; this.flipT = -1;
      this.happyT = 0; this.blinkT = 2; this.blinking = 0;
      this.parts = []; this.rand = rng(7);
      this.px = 4; this.slowFrames = 0; this.last = 0; this.running = false;
      this.minDt = opts.fps30 ? 1 / 30 : 1 / 58;
      this.light = 1;
      this.emblem = defaultEmblem(); this.emblemNext = null; this.emblemT = 1;
      this.cols = []; this.colGrow = 0;
      this.pg = null; this.bookScr = { x: 0, y: 0, r: 0 };
      this.buildStatic();
      for (let i = 0; i < 26; i++) this.spawnMote(true);
      this.setState('intro', true);
    }

    /* ---------- lote estático ---------- */
    buildStatic() {
      const B = [], R = rng(11);
      const sb = (cx, cy, cz, sx, sy, sz, col, o) => { o = o || {}; B.push({ c: [cx, cy, cz], s: [sx, sy, sz], col: hex(col), emi: o.emi, noise: o.noise, grid: o.grid }); };
      sb(0, -0.25, 0, 60, 0.5, 60, '#2a1a5e', { grid: 1, noise: 0.5 });
      sb(0, 0.02, 0, 6.8, 0.04, 6.8, '#b88a2a', { noise: 0.4 });
      sb(0, 0.05, 0, 6.3, 0.04, 6.3, '#33207a', { noise: 0.7 });
      sb(0, 0.08, 0, 4.9, 0.03, 4.9, '#43299a', { noise: 0.7 });
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2, x = Math.cos(a) * 2.6, z = Math.sin(a) * 2.6;
        sb(x, 0.12, z, i % 2 ? 0.22 : 0.34, 0.03, i % 2 ? 0.22 : 0.34, i % 2 ? '#ffd36e' : '#7ef0c4', { emi: i % 2 ? [0.5, 0.4, 0.1] : [0.15, 0.4, 0.3], noise: 0 });
      }
      sb(0, 5.5, -8, 44, 14, 1, '#1d1245', { noise: 0.8 });
      sb(0, 1.2, -7.45, 44, 2.4, 0.1, '#150c33');
      sb(0, 5.4, -7.35, 4.6, 6.8, 0.2, '#0c0620');
      sb(0, 5.4, -7.2, 4.0, 6.2, 0.1, '#241a70', { emi: [0.12, 0.1, 0.32], noise: 0 });
      const pane = ['#4a3ac8', '#8a4ad8', '#3a7ad0', '#d86aa8', '#e8b050', '#5ad0c0'];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
        const col = pane[Math.floor(R() * pane.length)], e = hex(col).map(v => v * 0.34);
        sb((c - 1) * 1.28, 3.2 + r * 1.18, -7.12, 1.08, 1.0, 0.06, col, { emi: e, noise: 0 });
      }
      sb(0, 5.4, -7.05, 0.14, 6.2, 0.08, '#0c0620'); sb(-0.64, 5.4, -7.05, 0.1, 6.2, 0.08, '#0c0620'); sb(0.64, 5.4, -7.05, 0.1, 6.2, 0.08, '#0c0620');
      sb(0, 8.55, -7.2, 4.0, 0.5, 0.2, '#0c0620');
      [-9.5, -6.8, 6.8, 9.5].forEach(x => {
        sb(x, 4, -6.6, 1.1, 8, 1.1, '#241552', { noise: 1 });
        sb(x, 0.25, -6.6, 1.5, 0.5, 1.5, '#33207a'); sb(x, 7.9, -6.6, 1.5, 0.4, 1.5, '#33207a');
        sb(x, 0.55, -6.6, 1.2, 0.1, 1.2, '#ffd36e', { emi: [0.2, 0.15, 0.03] });
      });
      const bookCols = ['#6b3fe0', '#d84a8a', '#2aa88a', '#d89a30', '#3a6ad0', '#f1e6c8', '#9a4ad8', '#c04a4a'];
      [-4.2, 4.2].forEach(sx => {
        sb(sx, 2.2, -7.1, 3.6, 4.5, 0.1, '#150c33');
        sb(sx - 1.8, 2.2, -6.75, 0.16, 4.5, 0.8, '#5a3a22', { noise: 1.3 }); sb(sx + 1.8, 2.2, -6.75, 0.16, 4.5, 0.8, '#5a3a22', { noise: 1.3 });
        [0.08, 1.2, 2.32, 3.44, 4.5].forEach((y, k) => {
          sb(sx, y, -6.75, 3.76, 0.14, 0.8, '#5a3a22', { noise: 1.3 });
          if (k === 4) return;
          let x = sx - 1.65;
          while (x < sx + 1.6) {
            const w = 0.13 + R() * 0.14, h = 0.65 + R() * 0.3;
            if (R() < 0.1) { x += w; continue; }
            sb(x + w / 2, y + 0.07 + h / 2, -6.7, w * 0.92, h, 0.55, bookCols[Math.floor(R() * bookCols.length)], { noise: 0.8 });
            x += w;
          }
        });
      });
      [-4.2, 4.2].forEach(x => {
        sb(x, 0.95, -2.6, 0.26, 1.9, 0.26, '#3b2a1a', { noise: 1 });
        sb(x, 2.0, -2.6, 0.7, 0.22, 0.7, '#2a2a3a'); sb(x, 2.16, -2.6, 0.54, 0.12, 0.54, '#1a1a26');
        sb(x, 0.1, -2.6, 0.6, 0.2, 0.6, '#2a2a3a');
      });
      sb(0, 0.15, 0, 3.1, 0.3, 3.1, '#2a1a5e', { noise: 1 });
      sb(0, 0.95, 0, 2.3, 1.3, 2.3, '#150c33', { noise: 1.3 });
      sb(0, 0.55, 1.16, 1.5, 0.12, 0.04, '#ffd36e', { emi: [0.35, 0.28, 0.05], noise: 0 });
      sb(0, 1.25, 1.16, 1.5, 0.12, 0.04, '#ffd36e', { emi: [0.35, 0.28, 0.05], noise: 0 });
      for (let i = -2; i <= 2; i++) sb(i * 0.3, 0.9, 1.16, 0.12, 0.2, 0.04, '#b36bff', { emi: [0.35, 0.18, 0.55], noise: 0 });
      sb(0, 1.68, 0, 2.8, 0.3, 2.8, '#2e1d73', { noise: 1 });
      sb(0, 1.84, 0, 2.4, 0.06, 2.4, '#6b3fe0', { emi: [0.1, 0.05, 0.25], noise: 0.6 });
      [[0, 1.25], [0, -1.25], [1.25, 0], [-1.25, 0]].forEach(([x, z]) => sb(x, 1.9, z, x ? 0.1 : 2.5, 0.06, z ? 0.1 : 2.5, '#ffd36e', { emi: [0.3, 0.24, 0.04], noise: 0 }));
      [[1.3, 1.3], [-1.3, 1.3], [1.3, -1.3], [-1.3, -1.3]].forEach(([x, z]) => sb(x, 1.95, z, 0.24, 0.2, 0.24, '#ffd36e', { emi: [0.45, 0.35, 0.05], noise: 0.3 }));
      sb(0, 1.9, 0, 1.0, 0.04, 1.0, '#8a5af0', { emi: [0.2, 0.1, 0.4], noise: 0 });
      this.eng.setStatic(B);
    }

    /* ---------- partículas ---------- */
    spawnMote(init) {
      const r = this.rand;
      this.parts.push({ type: 'mote', x: (r() - 0.5) * 12, y: 0.5 + r() * 5, z: (r() - 0.5) * 8 - 1, vx: (r() - 0.5) * 0.12, vy: 0.04 + r() * 0.08, vz: (r() - 0.5) * 0.1, glyph: 7, size: 1.8, seed: r(), life: init ? r() * 10 : 0, max: 8 + r() * 6 });
    }
    spawnRune() {
      const r = this.rand;
      this.parts.push({ type: 'orbit', t: 0, ang: r() * 6.283, r0: 1.7 + r() * 0.6, y0: 1.95 + r() * 0.2, sp: 0.35 + r() * 0.35, glyph: Math.floor(r() * 7), size: 2.8 + r() * 1.8, seed: r(), dir: r() < 0.5 ? 1 : -1 });
    }
    burst(n, big) {
      const r = this.rand, y = this.bk.P[1] + 0.2;
      for (let i = 0; i < (n || 26); i++) {
        const a = r() * 6.283, e = (r() - 0.2) * 1.6, s = (big ? 2 : 1.2) + r() * (big ? 4 : 2.4);
        this.parts.push({ type: 'burst', x: Math.cos(a) * 0.3, y, z: Math.sin(a) * 0.3, vx: Math.cos(a) * s * 0.7, vy: 1 + e * 1.4, vz: Math.sin(a) * s * 0.7, life: 0, max: 0.8 + r() * (big ? 1.4 : 0.7), glyph: Math.floor(r() * 8), size: 3 + r() * 3, seed: r() });
      }
    }
    stepParts(dt) {
      const e = this.bk.energy, out = [], by = this.bk.P[1];
      if (!this.reduce || e > 0.5) {
        this.runeAcc = (this.runeAcc || 0) + dt * (3 + e * 10) * (this.reduce ? 0.3 : 1);
        while (this.runeAcc > 1) { this.runeAcc -= 1; if (this.parts.length < 330) this.spawnRune(); }
      }
      this.parts = this.parts.filter(p => {
        const o = { x: 0, y: 0, z: 0, size: p.size, glyph: p.glyph, alpha: 1, seed: p.seed };
        if (p.type === 'orbit') {
          p.t += dt * p.sp * (0.8 + e * 1.6); p.ang += dt * p.dir * (1.0 + e * 2.2);
          if (p.t >= 1) return false;
          const k = Math.pow(p.t, 0.85), r = lerp(p.r0, 0.5, k);
          o.x = Math.cos(p.ang) * r; o.z = Math.sin(p.ang) * r;
          o.y = lerp(p.y0, by + 0.25, k) + Math.sin(p.ang * 2) * 0.06;
          o.alpha = Math.sin(PI * p.t) * (0.4 + e * 0.2);
        } else if (p.type === 'burst') {
          p.life += dt; if (p.life > p.max) return false;
          p.vy -= dt * 2.2; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          o.x = p.x; o.y = p.y; o.z = p.z; o.alpha = 1 - p.life / p.max;
        } else {
          p.life += dt; if (p.life > p.max) { p.x = (this.rand() - 0.5) * 12; p.y = 0.4; p.z = (this.rand() - 0.5) * 8 - 1; p.life = 0; }
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          o.x = p.x; o.y = p.y; o.z = p.z; o.alpha = Math.sin(PI * p.life / p.max) * 0.35;
        }
        out.push(o); return true;
      });
      return out;
    }

    /* ---------- control ---------- */
    setState(name, instant) {
      this.stateName = name; this.stateT = 0;
      if (name === 'result') this.colGrowStart = this.t;
      if (instant || this.reduce) { this.snap = true; this.stateT = 99; }
    }
    setAccent(h) { this.accentT = hex(h); }
    setShift(v, h) { this.shiftT = v; this.hshiftT = h || 0; }
    setPointer(x, y) { this.pointer.x = clamp(x, -1, 1); this.pointer.y = clamp(y, -1, 1); }
    setHover(on) { this.hoverT = on ? 1 : 0; }
    happy() { this.happyT = 1.3; }
    setLight(v) { this.light = v; }
    turn() { this.flipT = this.reduce ? -1 : 0; }
    reveal() { this.flash = 1; this.burst(90, true); }
    setEmblem(cells, now) { if (now || this.reduce) { this.emblem = cells; this.emblemNext = null; } else { this.emblemNext = cells; this.emblemT = 0; } }
    setColumns(list) { this.cols = list.map((c, i) => ({ id: c.id, pct: c.pct, color: hex(c.color), rank: i })); this.colGrowStart = this.t; }
    resize(w, h) {
      this.cw = w; this.ch = h;
      this.px = Math.max(2, Math.ceil(w / (w < 700 ? 300 : 520)));
      this.eng.resize(w, h, this.px);
    }
    get portrait() { return this.cw / this.ch < 0.85; }
    ringR() { return this.portrait ? 2.5 : 4.4; }
    colPos(i) {
      /* centro = rango 0; luego derecha, izquierda, derecha... sobre un arco detrás de la mesa */
      const n = 14, side = i % 2 ? 1 : -1, step = Math.ceil(i / 2), maxStep = 7;
      const span = 1.3;     // radianes de media-apertura
      const a = i === 0 ? 0 : side * (step / maxStep) * span, R = this.ringR();
      return [Math.sin(a) * R, -0.5 - Math.cos(a) * R * 0.8];
    }
    colGrown(i) { const c = this.cols[i]; return c ? smooth((this.t - this.colGrowStart - c.rank * 0.09) / 1.1) : 0; }
    defaultEmblem() { return defaultEmblem(); }
    colHeight(pct) { return 0.5 + 3.0 * clamp((pct - 0.08) / 0.92, 0, 1); }
    project(p) {
      const v = this.eng.vp, x = v[0] * p[0] + v[4] * p[1] + v[8] * p[2] + v[12], y = v[1] * p[0] + v[5] * p[1] + v[9] * p[2] + v[13], w = v[3] * p[0] + v[7] * p[1] + v[11] * p[2] + v[15];
      return [(x / w * 0.5 + 0.5) * this.cw, (1 - (y / w * 0.5 + 0.5)) * this.ch, w];
    }
    colScreen(i) {
      const c = this.cols[i]; if (!c) return null;
      const [x, z] = this.colPos(c.rank), g = smooth((this.t - this.colGrowStart - c.rank * 0.09) / 1.1);
      return this.project([x, 0.2 + this.colHeight(c.pct) * g + 0.75, z]);
    }
    kixkiPos() { return this.portrait ? [-1.9, 0, 2.6] : [-3.3, 0, 2.2]; }
    kixkiScreen() { const q = this.kixkiPos(); const s = this.project([q[0], 2.5, q[2]]); return { x: s[0], y: s[1] }; }
    hitBook(x, y) { const b = this.bookScr; return Math.hypot(x - b.x, y - b.y) < b.r * 1.15; }
    start() { if (this.running) return; this.running = true; this.last = performance.now(); this._raf = requestAnimationFrame(t => this.loop(t)); }
    stop() { this.running = false; cancelAnimationFrame(this._raf); }
    loop(now) {
      if (!this.running) return;
      this._raf = requestAnimationFrame(t => this.loop(t));
      if (document.hidden) { this.last = now; return; }
      let dt = (now - this.last) / 1000;
      if (dt < this.minDt * 0.9) return;
      this.last = now; dt = Math.min(dt, 0.08);
      this.slowFrames = dt > 0.045 ? this.slowFrames + 1 : Math.max(0, this.slowFrames - 1);
      if (this.slowFrames > 50 && this.px < 8) { this.px++; this.slowFrames = 0; this.eng.resize(this.cw, this.ch, this.px); }
      this.update(dt); this.render(); if (this.onFrame) this.onFrame();
    }

    /* ---------- objetivos por estado ---------- */
    targets() {
      const A = this.cw / this.ch, port = A < 0.85, st = this.stateName;
      const eff = (this.cw * (1 - this.hshiftT)) / this.ch;
      const norm = v => { const l = Math.hypot(v[0], v[1], v[2]); return v.map(x => x / l); };
      const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
      if (st === 'read') {
        const tilt = 1.12, fov = 40, t = Math.tan(fov * PI / 360), P = [0, 3.15, 0];
        const W = port ? 1.5 : 2.5, H = port ? 2.5 : 1.45;
        const d = Math.max((H / 2) / t, (W / 2) / (t * A)) * (port ? 1.1 : 1.5);
        const n = [0, Math.cos(tilt), Math.sin(tilt)];
        return { P, tilt, roll: port ? -PI / 2 : 0, open: 1, scl: 1, eye: add(P, n, d), ctr: P, fov, energy: 0.3, spin: 0 };
      }
      if (st === 'ritual') return { P: [0, 3.5, 0], tilt: PI / 2, roll: 0, open: 0, scl: 1.15, eye: [0, 5, port ? 14 : 9.2], ctr: [0, 3.0, 0], fov: 46, energy: 1, spin: 5.5 };
      if (st === 'result') {
        const fov = 44, t = Math.tan(fov * PI / 360), Rw = this.ringR() + 0.9;
        const d = clamp(Math.max(Rw / (t * eff), 12), 12, 28), dir = norm([0, 0.42, 1]), ctr = [0, 2.9, -0.6];
        return { P: [0, 4.9, -0.4], tilt: PI / 2, roll: 0, open: 0, scl: 1.9, eye: add(ctr, dir, d), ctr, fov, energy: 0.7, spin: 0.75 };
      }
      return { P: [0, 2.85, 0], tilt: 0.95, roll: 0, open: 0, scl: 1.3, eye: [0, 5.6, port ? 11.5 : 8.8], ctr: [0, 2.5, 0], fov: 46, energy: 0.2, spin: 0 };
    }

    /* ---------- actualización ---------- */
    update(dt) {
      this.t += dt; this.stateT += dt;
      const T = this.targets(), st = this.stateName, snap = this.snap || this.reduce; this.snap = false;
      const k = snap ? 1 : 1 - Math.exp(-dt * (st === 'read' ? 2.1 : 2.4)), c = this.cam, b = this.bk;
      for (let i = 0; i < 3; i++) { c.ctr[i] = lerp(c.ctr[i], T.ctr[i], k); c.eye[i] = lerp(c.eye[i], T.eye[i], k); b.P[i] = lerp(b.P[i], T.P[i], snap ? 1 : 1 - Math.exp(-dt * 2.6)); }
      c.fov = lerp(c.fov, T.fov, k);
      const kb = snap ? 1 : 1 - Math.exp(-dt * 2.8);
      b.tilt = lerp(b.tilt, T.tilt, kb); b.roll = lerp(b.roll, T.roll, kb); b.scl = lerp(b.scl, T.scl, kb);
      const openDelay = st === 'read' ? 0.7 : 0, oTarget = this.stateT > openDelay ? T.open : (st === 'read' ? 0 : T.open);
      b.open = lerp(b.open, oTarget, snap ? 1 : 1 - Math.exp(-dt * (st === 'read' ? 2.2 : 3.2)));
      b.energy = lerp(b.energy, T.energy, kb);
      this.shift = lerp(this.shift, this.shiftT, snap ? 1 : 1 - Math.exp(-dt * 3)); this.hshift = lerp(this.hshift, this.hshiftT, snap ? 1 : 1 - Math.exp(-dt * 3));
      const p = this.pointer, kp = 1 - Math.exp(-dt * 3); p.sx = lerp(p.sx, p.x, kp); p.sy = lerp(p.sy, p.y, kp);
      const sp = this.spin; sp.v = lerp(sp.v, T.spin, 1 - Math.exp(-dt * (st === 'ritual' ? 1.1 : 1.6)));
      sp.ang += sp.v * dt;
      if (!T.spin) { const tg = Math.round(sp.ang / (PI * 2)) * PI * 2; sp.ang = lerp(sp.ang, tg, 1 - Math.exp(-dt * 2.2)); }
      this.accent = mixv(this.accent, this.accentT, 1 - Math.exp(-dt * 3));
      this.hover = lerp(this.hover, this.hoverT, 1 - Math.exp(-dt * 8));
      this.flash = Math.max(0, this.flash - dt * 0.9);
      if (this.flipT >= 0) { this.flipT += dt / 0.55; if (this.flipT >= 1) this.flipT = -1; }
      if (this.emblemNext) { this.emblemT += dt / 0.7; if (this.emblemT >= 1) { this.emblem = this.emblemNext; this.emblemNext = null; } }
      this.blinkT -= dt; if (this.blinkT < 0) { this.blinking = 0.14; this.blinkT = 2.4 + this.rand() * 2.6; }
      if (this.blinking > 0) this.blinking -= dt;
      if (this.happyT > 0) this.happyT -= dt;
      if (st === 'ritual' && !this.ritualBurst && this.stateT > 0.5) { this.ritualBurst = true; this.burst(40); }
      if (st !== 'ritual') this.ritualBurst = false;
      this.partDraw = this.stepParts(dt);
    }

    /* ---------- dibujo ---------- */
    render() {
      const e = this.eng, c = this.cam, t = this.t, P = this.pointer, rd = this.reduce ? 0 : 1, M = mat, I = M.id();
      const b = this.bk, acc = this.accent, L = this.light, st = this.stateName, reading = st === 'read';
      const fl = this.flash, hv = this.hover;
      const eye = [c.eye[0] + P.sx * 0.5 * rd, c.eye[1] - P.sy * 0.2 * rd, c.eye[2]];
      const ctr = [c.ctr[0], c.ctr[1], c.ctr[2]];
      const bobA = reading ? 0.035 : 0.08, by = b.P[1] + Math.sin(t * 1.6) * bobA * rd;
      const flick = k => 0.85 + Math.sin(t * 9 + k) * 0.08 + Math.sin(t * 23 + k * 3) * 0.05;
      e.amb = [0.22 * L + 0.05 + fl * 0.3, 0.18 * L + 0.05 + fl * 0.25, 0.42 * L + 0.08 + fl * 0.3];
      e.fog = L > 1.5 ? [0.6, 0.52, 0.86] : [0.08, 0.05, 0.2];
      e.fogd = 0.018; e.moonC = [0.1 * L, 0.1 * L, 0.24 * L];
      const pulse = st === 'ritual' ? 0.7 + Math.sin(t * 9) * 0.3 : 1;
      e.setLight(0, [0, by + 0.9, 0.6], mixv([1.3, 1.1, 0.7], acc.map(v => v * 1.5 + 0.3), reading ? 0.12 : 0.55).map(v => v * (0.5 + b.energy * 0.9 + hv * 0.5 + fl * 1.5) * pulse));
      e.setLight(1, [-3.4, 3.4, 2.4], [1.5 * flick(0), 0.95 * flick(0), 0.45]);
      e.setLight(2, [4.2, 2.8, -2.2], [1.2 * flick(2), 0.7 * flick(2), 0.28]);
      e.setLight(3, [0, 6, -5.5], [0.5, 0.4, 1.0]);
      e.tint = mixv([1, 0.82, 0.4], acc.map(v => clamp(v * 1.2 + 0.15, 0, 1)), 0.6);
      e.begin(eye, ctr, c.fov, this.shift, this.hshift);
      e.drawStatic();

      const dyn = (parent, p, size, col, emi, rot, noise) => {
        let m = M.mul(parent, M.T(p[0], p[1], p[2])); if (rot) m = M.mul(m, rot);
        e.box(m, size, col, emi, noise);
      };

      // llamas
      [[-4.2, 0], [4.2, 2]].forEach(([x, k]) => {
        const f = flick(k), p = M.T(x, 2.3, -2.6);
        dyn(p, [0, 0.12 * f, 0], [0.36, 0.34 * f, 0.36], [1, 0.45, 0.08], [0.9, 0.35, 0.05], null, 0);
        dyn(p, [0, 0.36 * f, 0], [0.22, 0.3 * f, 0.22], [1, 0.8, 0.2], [1, 0.7, 0.15], null, 0);
        dyn(p, [0, 0.58 * f, 0], [0.1, 0.18, 0.1], [1, 1, 0.7], [1, 0.95, 0.6], null, 0);
      });

      // cristales orbitando la mesa
      const crystalCols = [[0.45, 0.85, 1], acc, [1, 0.8, 0.35], [1, 0.55, 0.8]];
      for (let i = 0; i < 4; i++) {
        const a = t * 0.55 * (0.6 + b.energy) + i * PI / 2, r = 1.55 + b.energy * 0.25;
        const cy = 2.3 + Math.sin(t * 1.4 + i * 1.7) * 0.12 * rd;
        const rot = M.mul(M.RY(t * 1.1 + i), M.mul(M.RX(0.785), M.RZ(0.785)));
        const col = crystalCols[i];
        dyn(I, [Math.cos(a) * r, cy, Math.sin(a) * r], [0.3, 0.3, 0.3], col, col.map(v => v * 0.55), rot, 0);
        dyn(I, [Math.cos(a) * r, cy, Math.sin(a) * r], [0.14, 0.14, 0.14], [1, 1, 1], [0.6, 0.6, 0.6], M.mul(rot, M.RY(0.7)), 0);
      }

      this.drawColumns(dyn);
      this.drawBook(dyn, by, reading, rd);
      this.drawKixki();
      e.particles(reading ? this.partDraw.filter(p => Math.hypot(p.x - eye[0], p.y - eye[1], p.z - eye[2]) > 4.2) : this.partDraw);
    }

    drawColumns(dyn) {
      if (!this.cols.length || (this.stateName !== 'result')) return;
      const M = mat, I = M.id(), t = this.t, narrow = this.portrait ? 0.6 : 0.95;
      this.cols.forEach(cl => {
        const g = smooth((t - this.colGrowStart - cl.rank * 0.09) / 1.1); if (g <= 0.001) return;
        const [x, z] = this.colPos(cl.rank), h = this.colHeight(cl.pct) * g, col = cl.color, w = 0.46 * narrow;
        const win = cl.rank === 0, tw = 0.88 + Math.sin(t * 3 + cl.rank) * 0.1;
        dyn(I, [x, 0.17, z], [w * 1.8, 0.12, w * 1.8], [0.45, 0.33, 0.12], win ? [0.3, 0.22, 0.04] : [0.08, 0.06, 0.02], null, 0.5);
        dyn(I, [x, 0.2 + h / 2, z], [w, h, w], col.map(v => v * 0.55), col.map(v => v * 0.38 * tw), null, 0.25);
        dyn(I, [x, 0.2 + h / 2, z], [w * 0.36, h + 0.1, w * 0.36], col.map(v => v * 0.5 + 0.5), col.map(v => v * 0.35 + 0.45), null, 0);
        dyn(I, [x, 0.2 + h + 0.06, z], [w * 1.3, 0.12, w * 1.3], col, col.map(v => v * 0.8 * tw), null, 0);
        if (win) dyn(I, [x, 0.2 + h + 0.24 + Math.sin(t * 2.4) * 0.05, z], [w * 0.5, w * 0.5, w * 0.5], [1, 1, 1], [0.9, 0.9, 0.8], M.mul(M.RY(t * 1.4), M.mul(M.RX(0.785), M.RZ(0.785))), 0);
      });
    }

    drawBook(dyn, by, reading, rd) {
      const e = this.eng, M = mat, b = this.bk, t = this.t, o = clamp(b.open, 0, 1), sc = b.scl;
      const sway = (reading ? 0.02 : 0.08) * Math.sin(t * 0.5) * rd, hv = this.hover;
      const lift = hv * 0.12;
      const root0 = M.mul(M.T(b.P[0], by + lift, b.P[2]), M.mul(M.RY(this.spin.ang + sway), M.mul(M.RX(b.tilt - (reading ? 0 : Math.sin(t * 0.8) * 0.03 * rd)), M.RY(b.roll))));
      const root = M.mul(root0, M.mul(M.RX(0), M.T(-0.6 * (1 - o) * sc, 0, 0)));
      this.baseM = root;
      // escala: se aplica a todos los desplazamientos con una matriz de escala uniforme simulada
      const S = sc, phiL = lerp(PI, 0.1, smooth(o)), phiR = lerp(0, 0.1, smooth(o));
      const cover = [0.29, 0.17, 0.63], gold = [1, 0.83, 0.43], page = [0.76, 0.66, 0.42];
      const glow = 0.5 * hv + this.flash * 0.6 + (this.stateName === 'ritual' ? 0.25 : 0);
      const drawS = (parent, p, size, col, emi, rot, noise) => dyn(parent, [p[0] * S, p[1] * S, p[2] * S], [size[0] * S, size[1] * S, size[2] * S], col, emi, rot, noise);
      drawS(root, [0, 0, 0], [0.16, 0.24 + 0.1 * (1 - o), 1.3], [0.18, 0.11, 0.45], [0.02, 0.01, 0.05 + glow * 0.2], null, 0.6);
      const showLines = !(this.stateName === 'read' && o > 0.9);
      const emb = this.emblem, embN = this.emblemNext, ek = this.emblemT;
      const halves = {};
      [-1, 1].forEach(s => {
        const phi = s < 0 ? phiL : phiR;
        const half = M.mul(root, M.RZ(s * phi));
        // el hinge (origen) se mueve con la escala: los desplazamientos de la media portada se escalan
        const hp = M.mul(half, M.T(s * 0.62 * S, 0, 0));
        halves[s] = hp;
        drawS(hp, [0, -0.07, 0], [1.2, 0.08, 1.4], cover.map(v => v + glow * 0.15), [0.03 + glow * 0.1, 0.01 + glow * 0.05, 0.1 + glow * 0.25], null, 0.8);
        drawS(hp, [s * 0.52, -0.07, 0], [0.16, 0.1, 1.46], gold, [0.25 + glow * 0.3, 0.2 + glow * 0.25, 0.03], null, 0.3);
        drawS(hp, [-s * 0.02 + (s < 0 ? 0.01 : 0), 0.0, 0], [s < 0 ? 1.03 : 1.05, 0.1, 1.26], page, [0.05, 0.04, 0.02], null, 0.25);
        if (showLines) for (let l = 0; l < 6; l++) drawS(hp, [-s * 0.02, 0.058, -0.5 + l * 0.2], [0.7 - (l % 3) * 0.1, 0.012, 0.045], [0.5, 0.4, 0.65], [0.1, 0.08, 0.2], null, 0);
        // emblema en la cara exterior de la portada (visible cuando el libro está cerrado)
        if (o < 0.55) {
          const cs = 0.068 * S, fade = 1 - smooth(o / 0.55);
          const drawEmb = (cells, k) => cells.forEach(cl => {
            const sx = (cl.x - 5.5) * cs, sy = (cl.y - 5.5) * cs;
            const col = cl.c, em = col.map(v => v * (0.3 + glow * 0.4) * k);
            dyn(hp, [-sx, -0.125 * S, sy], [cs * 0.98, 0.03 * S, cs * 0.98], col.map(v => v * (0.6 + 0.4 * k)), em, null, 0);
          });
          if (embN) { if (ek < 0.5) drawEmb(emb, 1 - ek * 2); else drawEmb(embN, (ek - 0.5) * 2); } else drawEmb(emb, 1);
        }
      });
      // hoja que pasa (al contestar)
      if (this.flipT >= 0 && o > 0.8) {
        const q = smooth(this.flipT), ang = lerp(phiR, PI - 0.1, q);
        const pg = M.mul(root, M.mul(M.RZ(ang), M.T(0.55 * S, (0.08 + Math.sin(q * PI) * 0.25) * S, 0)));
        dyn(pg, [0, 0, 0], [1.02 * S, 0.02 * S, 1.24 * S], page, [0.2, 0.18, 0.12], null, 0);
      }
      // proyección de páginas y zona de clic
      const prj = this.project.bind(this), pts = (hp, s) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => {
        const p = xf(hp, [(-s * 0.02 + u * 0.43) * S, 0.07 * S, v * 0.54 * S]); return prj(p);
      });
      const order = q => { const a = q.slice().sort((m, n) => m[1] - n[1]), tp = a.slice(0, 2).sort((m, n) => m[0] - n[0]), bt = a.slice(2).sort((m, n) => m[0] - n[0]); return [tp[0], tp[1], bt[1], bt[0]]; };
      this.pg = { L: order(pts(halves[-1], -1)), R: order(pts(halves[1], 1)), open: o };
      const cen = xf(root, [0.62 * (1 - o) * S + (1 - 1) * 0, 0, 0]), sp0 = prj(cen), ce = this.cam.eye;
      const dist = Math.hypot(ce[0] - cen[0], ce[1] - cen[1], ce[2] - cen[2]);
      this.bookScr = { x: sp0[0], y: sp0[1], r: (1.0 * S / dist) * (this.ch / 2) / Math.tan(this.cam.fov * PI / 360), tilt: b.tilt };
    }

    drawKixki() {
      const e = this.eng, M = mat, t = this.t, K = this.portrait ? 1.0 : 1.3, kp = this.kixkiPos();
      const happy = this.happyT > 0 ? Math.abs(Math.sin(t * 10)) * 0.5 * Math.min(1, this.happyT) : 0;
      const bob = Math.sin(t * 2.2) * 0.025;
      const yaw = 0.62 + Math.sin(t * 0.7) * 0.05 + (this.stateName === 'ritual' ? 0.15 : 0);
      const root = M.mul(M.T(kp[0], happy * K, kp[2]), M.RY(yaw));
      const wool = hex('#fffaf0'), woolS = hex('#d9c9f5'), skin = hex('#f7b58a'), skinD = hex('#e39a6e'), eye = hex('#2b1a5e'), cheek = hex('#ff9fb8'), scarf = hex('#6b3fe0'), hat = hex('#3b2480'), gold = hex('#ffd36e');
      const kb = (parent, p, s, col, emi, rot) => { if (!emi) emi = col === wool || col === woolS ? [0.16, 0.15, 0.2] : (col === skin || col === skinD ? [0.12, 0.07, 0.05] : null); let m = M.mul(parent, M.T(p[0] * K, p[1] * K, p[2] * K)); if (rot) m = M.mul(m, rot); e.box(m, [s[0] * K, s[1] * K, s[2] * K], col, emi, 0.55); };
      const body = M.mul(root, M.T(0, bob * K, 0));
      kb(body, [0, 0.95, 0], [1.0, 0.8, 1.15], wool);
      kb(body, [0, 0.66, 0], [0.9, 0.3, 1.2], woolS);
      kb(body, [0, 1.3, -0.05], [1.1, 0.34, 0.95], wool);
      kb(body, [0, 1.5, -0.25], [0.75, 0.24, 0.6], wool);
      [[-0.3, 0.4], [0.3, 0.4], [-0.3, -0.4], [0.3, -0.4]].forEach(([x, z]) => kb(body, [x, 0.27, z], [0.22, 0.54, 0.22], skinD));
      kb(body, [0, 1.0, 0.55], [0.74, 0.18, 0.5], scarf);
      kb(body, [0.3, 0.8, 0.72], [0.16, 0.4, 0.1], scarf);
      const nod = Math.sin(t * 2.2 + 1) * 0.03 + (this.happyT > 0 ? Math.sin(t * 10) * 0.08 : 0);
      const head = M.mul(body, M.mul(M.T(0, 1.28 * K, 0.78 * K), M.RX(nod)));
      kb(head, [0, 0, 0], [0.64, 0.58, 0.56], skin);
      kb(head, [0, 0.33, -0.03], [0.74, 0.22, 0.64], wool);
      const sway = Math.sin(t * 3) * 0.15;
      kb(head, [-0.42, 0.04, -0.02], [0.2, 0.14, 0.28], skin, null, M.RZ(0.35 + sway));
      kb(head, [0.42, 0.04, -0.02], [0.2, 0.14, 0.28], skin, null, M.RZ(-0.35 - sway));
      const closed = this.blinking > 0, hp = this.happyT > 0;
      [-0.17, 0.17].forEach(x => kb(head, [x, hp ? 0.08 : 0.04, 0.29], [0.1, hp ? 0.05 : (closed ? 0.025 : 0.16), 0.04], eye));
      [-0.27, 0.27].forEach(x => kb(head, [x, -0.1, 0.29], [0.13, 0.08, 0.03], cheek, [0.12, 0.04, 0.06]));
      kb(head, [0, -0.15, 0.29], [hp ? 0.18 : 0.1, hp ? 0.07 : 0.03, 0.03], eye);
      const hg = M.mul(head, M.mul(M.T(0, 0.02 * K, -0.1 * K), M.RX(-0.22)));
      kb(hg, [0, 0.5, 0], [0.86, 0.06, 0.78], hat);
      kb(hg, [0, 0.54, 0], [0.62, 0.07, 0.56], gold, [0.3, 0.24, 0.04]);
      kb(hg, [0, 0.66, 0], [0.54, 0.18, 0.5], hat);
      kb(hg, [0.01, 0.83, 0], [0.4, 0.18, 0.38], hat);
      kb(hg, [0.03, 0.99, 0], [0.28, 0.18, 0.26], hat, null, M.RZ(-0.1));
      kb(hg, [0.1, 1.13, 0], [0.17, 0.18, 0.17], hat, null, M.RZ(-0.3 + Math.sin(t * 2.5) * 0.05));
      kb(hg, [0.0, 0.76, 0.22], [0.09, 0.09, 0.04], gold, [0.5, 0.4, 0.06]);
    }
  }

  MesaScene.quadMatrix = quadMatrix;
  window.MesaScene = MesaScene;
})();
