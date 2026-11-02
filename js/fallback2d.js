/* Respaldo 2D para dispositivos sin WebGL: escena pixel simple (mesa, libro, columnas, Kixki) con animación por pasos.
   Implementa la misma interfaz que MesaScene (páginas, clic al libro, columnas) para que app.js no note la diferencia. */
(function () {
  'use strict';
  const SHEEP = ['....hhhh....', '...hhhhhh...', '..wwhhhhww..', '.wwwffffwww.', '.wwfefeefwww', '.wwffffffww.', '.wwwwmmwwww.', '..wwwwwwww..', '..wwwwwwww..', '...l....l...'];
  const PAL = { h: '#3b2480', w: '#fffaf0', f: '#f7b58a', e: '#2b1a5e', m: '#ff9fb8', l: '#e39a6e' };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function create(canvas, opts) {
    const W = 192, H = 108, ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H; ctx.imageSmoothingEnabled = false;
    const api = {
      canvas, reduce: !!(opts && opts.reduce), running: false, t: 0, onFrame: null, state: 'intro', accent: '#b36bff', light: 1, mood: 0, sparks: [],
      cw: 1, ch: 1, open: 0, flip: 0, hover: 0, emblem: null, cols: [], colT: 0, pg: null, hs: 0, vs: 0,
      defaultEmblem() { return null; },
      setState(s, instant) { this.state = s; this.stateT = 0; if (instant || this.reduce) this.open = s === 'read' ? 1 : 0; if (s === 'result') this.colT = 0; },
      setAccent(h) { this.accent = h; }, setShift(v, h) { this.vs = v || 0; this.hs = h || 0; }, setLight(v) { this.light = v; }, setPointer() { },
      setHover(on) { this.hover = on ? 1 : 0; }, turn() { this.flip = 4; }, reveal() { this.burst(40); }, setEmblem(c) { this.emblem = c; },
      setColumns(list) { this.cols = list.map((c, i) => ({ id: c.id, pct: c.pct, color: c.color, rank: i })); this.colT = 0; },
      burst(n) { for (let i = 0; i < (n || 12); i++) this.sparks.push({ x: 96 + (Math.random() - .5) * 20, y: 50, vx: (Math.random() - .5) * 3, vy: -Math.random() * 2.5 - .5, l: 14 }); },
      happy() { this.mood = 12; },
      resize(w, h) { this.cw = w; this.ch = h; },
      /* geometría en px de pantalla */
      bookRect() {
        const w = this.cw, h = this.ch;
        if (w / h < 0.85) { const bw = Math.min(w * 0.9, h * 0.5), bh = bw * 1.75; return { x: (w - bw) / 2, y: (h - bh) / 2 + 10, w: bw, h: bh, port: true }; }
        const bw = Math.min(w * 0.9, h * 0.8 * 1.75), bh = bw / 1.75; return { x: (w - bw) / 2, y: (h - bh) / 2, w: bw, h: bh, port: false };
      },
      closedRect() { const w = this.cw, h = this.ch, s = Math.min(w, h) * 0.2; return { x: w / 2 - s * 0.7, y: h * 0.4 - s, w: s * 1.4, h: s * 1.8 }; },
      hitBook(x, y) { const r = this.closedRect(); return x > r.x - 20 && x < r.x + r.w + 20 && y > r.y - 20 && y < r.y + r.h + 20; },
      colPos(i) { const x = this.cw * (0.5 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.062) * (i ? 1 : 1) + (i === 0 ? 0 : 0); return x; },
      colH(pct) { return (0.1 + 0.4 * pct) * this.ch; },
      colScreen(i) { const c = this.cols[i]; if (!c) return null; const x = this.colPos(c.rank) - this.hs * this.cw / 2, y = this.ch * 0.62 - this.colH(c.pct) - this.vs * this.ch / 2 * 1; return [x, y - 6, 1]; },
      colGrown(i) { return clamp(this.colT / 8 - i * 0.05, 0, 1); },
      kixkiScreen() { const r = canvas.getBoundingClientRect(); return { x: r.left + r.width * (68 - this.hs * W / 2) / W, y: r.top + r.height * (62 - this.vs * H / 2) / H }; },
      start() { if (this.running) return; this.running = true; const step = () => { if (!this.running) return; this.draw(); if (this.onFrame) this.onFrame(); this.timer = setTimeout(step, this.reduce ? 400 : 120); }; step(); },
      stop() { this.running = false; clearTimeout(this.timer); },
      draw() {
        this.t++; const t = this.t, day = this.light > 1.5, c = ctx, sx = W / this.cw, sy = H / this.ch;
        const rect = (px, py, pw, ph, col) => { c.fillStyle = col; c.fillRect(Math.round(px * sx), Math.round(py * sy), Math.max(1, Math.round(pw * sx)), Math.max(1, Math.round(ph * sy))); };
        const reading = this.state === 'read';
        this.open = reading ? Math.min(1, this.open + 0.34) : Math.max(0, this.open - 0.5);
        if (this.state === 'result') this.colT++;
        if (this.flip > 0) this.flip--;
        const sky = day ? ['#bba6f0', '#a58de8', '#8f78de', '#7a62d0', '#6b52c4'] : ['#0c0620', '#150c33', '#1d1245', '#241552', '#2e1d73'];
        sky.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * 22, W, 22); });
        c.fillStyle = '#2a1a5e'; c.fillRect(0, 76, W, 32);
        c.save(); c.translate(Math.round(-this.hs * W / 2), Math.round(-this.vs * H / 2));
        c.fillStyle = day ? '#fff' : '#c9b8ff'; for (let i = 0; i < 22; i++) { const x = (i * 53) % W, y = (i * 29) % 60; if ((t + i) % 5) c.fillRect(x, y, 1, 1); }
        c.fillStyle = '#3a2a9a'; c.fillRect(80, 8, 32, 44); c.fillStyle = '#8a4ad8'; c.fillRect(82, 10, 14, 20); c.fillStyle = '#d86aa8'; c.fillRect(98, 10, 12, 20); c.fillStyle = '#4a3ac8'; c.fillRect(82, 32, 28, 18);
        c.fillStyle = '#5a3a22'; c.fillRect(20, 24, 44, 52); c.fillRect(128, 24, 44, 52);
        ['#6b3fe0', '#d84a8a', '#2aa88a', '#d89a30'].forEach((col, i) => { c.fillStyle = col; for (let r = 0; r < 4; r++) c.fillRect(23 + i * 10, 27 + r * 12, 6, 9); for (let r = 0; r < 4; r++) c.fillRect(131 + i * 10, 27 + r * 12, 6, 9); });
        c.fillStyle = '#2a1a5e'; c.fillRect(0, 76, W, 32); c.fillStyle = '#33207a'; c.fillRect(40, 84, 112, 20);
        // columnas de resultado
        if (this.state === 'result') this.cols.forEach(cl => {
          const g = this.colGrown(cl.rank), x = this.colPos(cl.rank), hh = this.colH(cl.pct) * g;
          rect(x - this.cw * 0.016, this.ch * 0.62 - hh, this.cw * 0.032, hh, cl.color); rect(x - this.cw * 0.006, this.ch * 0.62 - hh, this.cw * 0.012, hh, '#ffffff');
        });
        c.fillStyle = '#150c33'; c.fillRect(76, 60, 40, 28); c.fillStyle = '#2a1a5e'; c.fillRect(72, 86, 48, 6);
        c.fillStyle = '#2e1d73'; c.fillRect(70, 54, 52, 8); c.fillStyle = '#6b3fe0'; c.fillRect(72, 52, 48, 4); c.fillStyle = '#ffd36e'; c.fillRect(70, 52, 4, 4); c.fillRect(118, 52, 4, 4);
        const bob = Math.round(Math.sin(t / 3) * 2), cols = ['#8fe8ff', this.accent, '#ffd36e', '#ff8fc7'];
        if (this.open < 0.5 && this.state !== 'read') {
          // libro cerrado sobre la mesa (con brillo si el puntero está encima)
          const r = this.closedRect(); rect(r.x, r.y + bob * 2, r.w, r.h, this.hover ? '#6b3fe0' : '#4a2ca0'); rect(r.x + r.w * 0.82, r.y + bob * 2, r.w * 0.18, r.h, '#ffd36e');
          const e = this.emblem; const cs = Math.max(2, r.w / 20);
          if (e) e.forEach(cl => rect(r.x + r.w * 0.1 + cl.x * cs, r.y + r.h * 0.2 + cl.y * cs + bob * 2, cs, cs, `rgb(${cl.c.map(v => Math.round(v * 255)).join(',')})`));
          else { rect(r.x + r.w * 0.38, r.y + r.h * 0.38 + bob * 2, r.w * 0.2, r.h * 0.2, '#ffd36e'); }
        }
        for (let i = 0; i < 4; i++) { const a = t / 6 + i * 1.57; c.fillStyle = cols[i]; c.fillRect(Math.round(96 + Math.cos(a) * 30), Math.round(44 + Math.sin(a) * 6 + bob), 3, 3); }
        const jump = this.mood > 0 ? -Math.abs(Math.round(Math.sin(t) * 5)) : 0; if (this.mood > 0) this.mood--;
        SHEEP.forEach((row, y) => [...row].forEach((ch, x) => { if (PAL[ch]) { c.fillStyle = PAL[ch]; c.fillRect(56 + x * 2, 66 + y * 2 + jump, 2, 2); } }));
        this.sparks = this.sparks.filter(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.l--; c.fillStyle = this.accent; c.fillRect(Math.round(s.x), Math.round(s.y), 2, 2); return s.l > 0; });
        if (!this.reduce && t % 3 === 0) this.sparks.push({ x: 96 + (Math.random() - .5) * 50, y: 56, vx: 0, vy: -0.8, l: 10 });
        c.restore();
        // libro abierto a pantalla casi completa (las preguntas se escriben encima)
        if (this.open > 0.3) {
          const b = this.bookRect(), o = this.open;
          rect(b.x - 8, b.y - 8, b.w + 16, b.h + 16, '#2e1a78'); rect(b.x - 4, b.y - 4, b.w + 8, b.h + 8, '#ffd36e');
          rect(b.x, b.y, b.w, b.h, '#cdb57a');
          if (b.port) { rect(b.x, b.y + b.h / 2 - 3, b.w, 6, '#4a2ca0'); } else { rect(b.x + b.w / 2 - 4, b.y, 8, b.h, '#4a2ca0'); }
          if (this.flip > 0) rect(b.x + (b.port ? 0 : b.w / 2), b.y, b.port ? b.w : b.w / 2 * (this.flip / 4), b.port ? b.h / 2 * (this.flip / 4) : b.h, '#e8d9a8');
          this.pg = this.pageQuads(b, o);
        } else this.pg = { L: [[0, 0], [1, 0], [1, 1], [0, 1]], R: [[0, 0], [1, 0], [1, 1], [0, 1]], open: this.open };
      },
      pageQuads(b, o) {
        const q = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], m = 0.07;
        if (b.port) { const ph = b.h / 2; return { L: q(b.x + b.w * m, b.y + ph * m * 1.4, b.w * (1 - 2 * m), ph * (1 - 2.4 * m)), R: q(b.x + b.w * m, b.y + ph + ph * m * 1.4 + 3, b.w * (1 - 2 * m), ph * (1 - 2.4 * m)), open: o }; }
        const pw = b.w / 2 - 4; return { L: q(b.x + b.w * 0.05, b.y + b.h * m, pw - b.w * 0.07, b.h * (1 - 2 * m)), R: q(b.x + b.w / 2 + b.w * 0.02 + 4, b.y + b.h * m, pw - b.w * 0.07, b.h * (1 - 2 * m)), open: o };
      },
      get bookScr() { const r = this.closedRect(); return { x: r.x + r.w / 2, y: r.y + r.h / 2, r: r.h / 2 }; }
    };
    return api;
  }
  window.MesaFallback = { create };
})();
