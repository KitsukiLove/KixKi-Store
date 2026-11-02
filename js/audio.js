/* Audio sintetizado con Web Audio (sin archivos): música de "vacío" muy tranquila + sonidos de magia.
   Empieza con el primer toque (los navegadores no dejan sonar antes). Se pausa si la pestaña se oculta. */
(function () {
  'use strict';
  const AC = window.AudioContext || window.webkitAudioContext;
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);          // nota MIDI -> Hz
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* acordes lentos (MIDI): Am9 · Fmaj9 · Cadd9 · Em7 */
  const CHORDS = [[45, 57, 64, 67, 71, 72], [41, 53, 60, 64, 67, 69], [48, 55, 62, 64, 67, 71], [40, 52, 59, 62, 67, 71]];
  const BELLS = [81, 84, 86, 88, 91, 93, 96];                 // A5 C6 D6 E6 G6 A6 C7 (pentatónica menor de La)
  const CHORD_LEN = 15;

  function impulse(c, secs, decay) {
    const n = Math.floor(c.sampleRate * secs), b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch); let lp = 0;
      for (let i = 0; i < n; i++) { const t = i / n; lp += ((Math.random() * 2 - 1) - lp) * (0.55 - 0.4 * t); d[i] = lp * Math.pow(1 - t, decay) * (i < 400 ? i / 400 : 1); }
    }
    return b;
  }
  function pinkNoise(c, secs) {
    const n = Math.floor(c.sampleRate * secs), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
    }
    return b;
  }

  /* ---------- grafo ---------- */
  function createGraph(c) {
    const G = { c };
    G.master = c.createGain(); G.master.gain.value = 0;
    G.comp = c.createDynamicsCompressor();
    G.comp.threshold.value = -20; G.comp.knee.value = 18; G.comp.ratio.value = 3; G.comp.attack.value = 0.02; G.comp.release.value = 0.35;
    G.master.connect(G.comp); G.comp.connect(c.destination);
    G.music = c.createGain(); G.music.gain.value = 1; G.music.connect(G.master);
    G.fx = c.createGain(); G.fx.gain.value = 1; G.fx.connect(G.master);
    // reverb larga compartida
    G.revIn = c.createGain(); G.revIn.gain.value = 1;
    const pre = c.createBiquadFilter(); pre.type = 'lowpass'; pre.frequency.value = 5200;
    G.rev = c.createConvolver(); G.rev.buffer = impulse(c, 4.6, 2.4);
    G.revOut = c.createGain(); G.revOut.gain.value = 0.85;
    G.revIn.connect(pre); pre.connect(G.rev); G.rev.connect(G.revOut); G.revOut.connect(G.master);
    // eco suave para campanitas
    G.echo = c.createDelay(1.2); G.echo.delayTime.value = 0.46;
    const fb = c.createGain(); fb.gain.value = 0.36;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    G.echo.connect(lp); lp.connect(fb); fb.connect(G.echo); lp.connect(G.revIn); lp.connect(G.music);
    // pad: filtro compartido con movimiento lento
    G.padLP = c.createBiquadFilter(); G.padLP.type = 'lowpass'; G.padLP.frequency.value = 900; G.padLP.Q.value = 0.4;
    G.padG = c.createGain(); G.padG.gain.value = 1;
    G.padLP.connect(G.padG); G.padG.connect(G.music); G.padG.connect(G.revIn);
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.06; lg.gain.value = 260; lfo.connect(lg); lg.connect(G.padLP.frequency); lfo.start();
    // zumbido grave
    const sub = c.createOscillator(), sg = c.createGain(); sub.type = 'sine'; sub.frequency.value = hz(33); sg.gain.value = 0.05;
    const trem = c.createOscillator(), tg = c.createGain(); trem.frequency.value = 0.09; tg.gain.value = 0.02; trem.connect(tg); tg.connect(sg.gain);
    sub.connect(sg); sg.connect(G.music); sub.start(); trem.start();
    // viento
    const wn = c.createBufferSource(); wn.buffer = pinkNoise(c, 6); wn.loop = true;
    G.wbp = c.createBiquadFilter(); G.wbp.type = 'bandpass'; G.wbp.frequency.value = 420; G.wbp.Q.value = 0.8;
    G.wg = c.createGain(); G.wg.gain.value = 0.05;
    const wl = c.createOscillator(), wlg = c.createGain(); wl.frequency.value = 0.045; wlg.gain.value = 260; wl.connect(wlg); wlg.connect(G.wbp.frequency);
    const wl2 = c.createOscillator(), wlg2 = c.createGain(); wl2.frequency.value = 0.07; wlg2.gain.value = 0.025; wl2.connect(wlg2); wlg2.connect(G.wg.gain);
    wn.connect(G.wbp); G.wbp.connect(G.wg); G.wg.connect(G.music); G.wg.connect(G.revIn); wn.start(); wl.start(); wl2.start();
    G.noise = pinkNoise(c, 3);
    G.nextChord = 0; G.chordI = 0; G.nextChime = 2; G.chimeRate = 1;
    return G;
  }

  /* ---------- piezas básicas ---------- */
  function osc(G, type, f, t, dur, dest, peak, atk, rel, detune) {
    const c = G.c, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (detune) o.detune.value = detune;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + atk); g.gain.setValueAtTime(peak, t + Math.max(atk, dur - rel)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05); return { o, g };
  }
  function bell(G, midi, t, peak, opts) {
    opts = opts || {};
    const c = G.c, f = hz(midi), dec = opts.dec || 3.4, dest = opts.dest || G.fx, send = opts.send == null ? 0.6 : opts.send;
    const mix = c.createGain(); mix.gain.value = 1; mix.connect(dest);
    const rs = c.createGain(); rs.gain.value = send; mix.connect(rs); rs.connect(G.revIn);
    if (opts.echo) { const es = c.createGain(); es.gain.value = opts.echo; mix.connect(es); es.connect(G.echo); }
    [[1, 1, 1], [2.01, 0.32, 0.55], [3.01, 0.14, 0.38], [4.17, 0.07, 0.25]].forEach(([m, a, d]) => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak * a, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dec * d);
      o.connect(g); g.connect(mix); o.start(t); o.stop(t + dec * d + 0.05);
    });
  }
  function noiseBurst(G, t, dur, f0, f1, peak, q, dest) {
    const c = G.c, s = c.createBufferSource(); s.buffer = G.noise; s.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q || 1.2; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + dur * 0.35); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    s.connect(bp); bp.connect(g); g.connect(dest || G.fx); const r = c.createGain(); r.gain.value = 0.5; g.connect(r); r.connect(G.revIn);
    s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
  }

  /* ---------- música: planificador con adelanto ---------- */
  function pump(G, until) {
    while (G.nextChord < until) {
      const t = Math.max(G.nextChord, G.c.currentTime + 0.05), ch = CHORDS[G.chordI++ % CHORDS.length], dur = CHORD_LEN + 9;
      ch.forEach((n, i) => {
        const peak = (i === 0 ? 0.05 : 0.026) * (n > 64 ? 0.8 : 1), dt = i * 0.35;
        osc(G, 'sine', hz(n), t + dt, dur, G.padLP, peak, 8, 9, rnd(-4, 4));
        osc(G, 'triangle', hz(n) * 1.002, t + dt, dur, G.padLP, peak * 0.4, 9, 9, rnd(-6, 6));
      });
      G.nextChord += CHORD_LEN;
    }
    while (G.nextChime < until) {
      const t = Math.max(G.nextChime, G.c.currentTime + 0.05);
      bell(G, pick(BELLS), t, rnd(0.018, 0.04), { dest: G.music, send: 0.8, echo: 0.5, dec: 4.2 });
      if (Math.random() < 0.28) bell(G, pick(BELLS) - 12, t + rnd(0.5, 1.4), 0.02, { dest: G.music, send: 0.9, echo: 0.4, dec: 5 });
      G.nextChime += rnd(4.5, 11) / G.chimeRate;
    }
  }
  function mood(G, name) {
    const t = G.c.currentTime, set = (p, v, k) => p.setTargetAtTime(v, t, k);
    if (name === 'ritual') { set(G.padLP.frequency, 2600, 1.4); set(G.wg.gain, 0.09, 1.2); G.chimeRate = 3; }
    else if (name === 'result') { set(G.padLP.frequency, 1500, 1.2); set(G.wg.gain, 0.04, 2); G.chimeRate = 1.6; }
    else if (name === 'quiz') { set(G.padLP.frequency, 800, 2); set(G.wg.gain, 0.04, 2); G.chimeRate = 0.8; }
    else { set(G.padLP.frequency, 950, 2); set(G.wg.gain, 0.05, 2); G.chimeRate = 1; }
  }

  /* ---------- efectos ---------- */
  const SFX = {
    open(G, t) {        // el libro despierta y se abre: barrido brillante + campanas ascendentes
      noiseBurst(G, t, 1.6, 300, 4200, 0.07, 0.9);
      [57, 64, 69, 72, 76, 81].forEach((n, i) => bell(G, n, t + 0.25 + i * 0.16, 0.05, { dec: 3.8, send: 0.9, echo: 0.3 }));
      osc(G, 'sine', hz(33), t, 2.6, G.fx, 0.09, 0.4, 1.8);
    },
    pick(G, t, i) {     // respuesta elegida: campanita suave (una nota distinta cada vez) + destello
      const n = [81, 84, 86, 88, 91][(i || 0) % 5];
      bell(G, n, t, 0.07, { dec: 2.2, send: 0.8, echo: 0.25 });
      bell(G, n + 12, t + 0.05, 0.022, { dec: 1.4, send: 0.9 });
    },
    flip(G, t) {        // pasar de página: susurro de papel
      noiseBurst(G, t, 0.42, 1200, 5200, 0.05, 0.7);
      noiseBurst(G, t + 0.12, 0.3, 3000, 900, 0.025, 1.4);
    },
    orb(G, t, v) {      // cada orbe de la escala suena un poco más alto
      bell(G, [72, 76, 79, 83, 86][clampI(v, 0, 4)], t, 0.05, { dec: 1.8, send: 0.7, echo: 0.2 });
    },
    ui(G, t) { bell(G, 91, t, 0.03, { dec: 0.8, send: 0.4 }); },
    back(G, t) { bell(G, 72, t, 0.04, { dec: 1.2, send: 0.5 }); noiseBurst(G, t, 0.3, 3000, 900, 0.025, 1); },
    ritual(G, t) {      // ritual de encantamiento: sube, sube, sube
      const c = G.c, o = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      o.type = 'sawtooth'; o2.type = 'triangle'; o.frequency.setValueAtTime(hz(45), t); o.frequency.exponentialRampToValueAtTime(hz(81), t + 4.4);
      o2.frequency.setValueAtTime(hz(57), t); o2.frequency.exponentialRampToValueAtTime(hz(93), t + 4.4);
      f.type = 'lowpass'; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(5200, t + 4.4); f.Q.value = 2;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 3.6); g.gain.linearRampToValueAtTime(0.0001, t + 4.7);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(G.fx); g.connect(G.revIn); o.start(t); o2.start(t); o.stop(t + 4.8); o2.stop(t + 4.8);
      noiseBurst(G, t, 4.4, 200, 6500, 0.08, 1.1);
      for (let i = 0; i < 14; i++) bell(G, pick(BELLS), t + 0.5 + i * 0.28 + rnd(0, 0.1), 0.012 + i * 0.0035, { dec: 2, send: 0.9, echo: 0.3 });
    },
    reveal(G, t) {      // golpe de luz: acorde de campanas + estela
      [57, 61, 64, 69, 73, 76].forEach((n, i) => bell(G, n, t + i * 0.05, 0.06, { dec: 5.5, send: 1, echo: 0.2 }));
      [88, 93, 97, 100, 105].forEach((n, i) => bell(G, n - 12, t + 0.3 + i * 0.12, 0.03, { dec: 3, send: 1, echo: 0.5 }));
      osc(G, 'sine', hz(33), t, 3.4, G.fx, 0.14, 0.02, 3);
      noiseBurst(G, t, 1.4, 6000, 700, 0.06, 0.8);
    }
  };
  function clampI(v, a, b) { v = Math.round(v); return v < a ? a : v > b ? b : v; }

  /* ---------- API pública ---------- */
  const A = { mode: 'on', vol: 0.7, ready: false, G: null, timer: 0, scene: 'intro' };
  function applyGain() {
    const G = A.G; if (!G) return;
    const t = G.c.currentTime, off = A.mode === 'off';
    G.master.gain.cancelScheduledValues(t); G.master.gain.setTargetAtTime(off ? 0 : Math.pow(A.vol, 2) * 1.1, t, 0.15);
    G.music.gain.cancelScheduledValues(t); G.music.gain.setTargetAtTime(A.mode === 'on' ? 1 : 0, t, 0.5);
  }
  A.supported = !!AC;
  A.unlock = function () {
    if (!AC || A.failed) return false;
    try {
      if (!A.G) {
        const c = new AC({ latencyHint: 'playback' }); A.G = createGraph(c); A.G.nextChord = c.currentTime + 0.1; A.G.nextChime = c.currentTime + 2.5;
        mood(A.G, A.scene);
        A.timer = setInterval(() => { if (A.G && A.G.c.state === 'running') pump(A.G, A.G.c.currentTime + 6); }, 1000);
        document.addEventListener('visibilitychange', () => { if (!A.G) return; if (document.hidden) A.G.c.suspend(); else if (A.mode !== 'off') A.G.c.resume(); });
      }
      if (A.G.c.state !== 'running' && A.mode !== 'off') A.G.c.resume();
      pump(A.G, A.G.c.currentTime + 6); applyGain(); A.ready = true; return true;
    } catch (e) { A.failed = true; return false; }
  };
  A.setMode = function (m) { A.mode = m; applyGain(); if (A.G && m !== 'off' && !document.hidden) A.G.c.resume(); };
  A.setVolume = function (v) { A.vol = Math.max(0, Math.min(1, v)); applyGain(); };
  A.setScene = function (name) { A.scene = name; if (A.G) mood(A.G, name); };
  A.play = function (name, a, b) {
    const G = A.G; if (!G || A.mode === 'off' || G.c.state !== 'running') return;
    try { SFX[name](G, G.c.currentTime + 0.02, a, b); } catch (e) { /* sin sonido */ }
  };
  /* para pruebas fuera de línea (OfflineAudioContext) */
  A._lab = { createGraph, pump, SFX, mood };
  window.MesaAudio = A;
})();
