/* Mesa de Encantos — flujo del test (libro flotante), puntuación y resultado. */
(function () {
  'use strict';
  const D = window.MESA, ICONS = window.MESA_ICONS, E = D.order, Q = D.q, N = Q.length, TR = 'COEAFKR';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const root = document.documentElement;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ROMAN = ['I', 'II', 'III', 'IV', 'V'];
  const A = window.MesaAudio;

  /* ---------- almacenamiento (puede fallar: privado, bloqueado, etc.) ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('mesa2.' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('mesa2.' + k, JSON.stringify(v)); } catch (e) { /* sin guardado */ } },
    del(k) { try { localStorage.removeItem('mesa2.' + k); } catch (e) { /* nada */ } }
  };

  /* ---------- ajustes ---------- */
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = Object.assign({ theme: 'dark', style: 'pixel', motion: 'auto', sound: 'on', vol: 70 }, store.get('settings') || {});
  const isReduced = () => S.motion === 'reduce' || (S.motion === 'auto' && prefersReduce);
  let scene = null, lastSound = S.sound === 'off' ? 'on' : S.sound;
  function applySettings() {
    root.dataset.theme = S.theme; root.dataset.style = S.style; root.dataset.motion = S.motion;
    const m = $('meta[name="theme-color"]'); if (m) m.content = S.theme === 'light' ? '#efe6ff' : '#150c33';
    if (scene) { scene.setLight(S.theme === 'light' ? 2.2 : 1); scene.reduce = isReduced(); }
    if (A) { A.setMode(S.sound); A.setVolume(S.vol / 100); }
    const mb = $('#btnMute'), off = S.sound === 'off';
    mb.setAttribute('aria-pressed', off ? 'true' : 'false'); mb.setAttribute('aria-label', off ? 'Activar sonido' : 'Silenciar sonido');
    $('.on', mb).hidden = off; $('.off', mb).hidden = !off;
    if (!A || !A.supported) mb.hidden = true;
  }
  const save = () => store.set('settings', S);

  /* ---------- íconos pixel ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const pal = id => { const c = rgb(D.enchants[id].color); return { k: [26, 15, 58], a: c, b: c.map(v => v * 0.6), c: c.map(v => Math.min(255, v * 1.3 + 40)), w: [255, 255, 255], y: [255, 211, 110] }; };
  function iconCanvas(id) {
    const cv = document.createElement('canvas'); cv.width = 12; cv.height = 12; cv.setAttribute('aria-hidden', 'true');
    const x = cv.getContext('2d'), P = pal(id);
    ICONS[id].forEach((row, y) => [...row].forEach((ch, xx) => { const p = P[ch]; if (p) { x.fillStyle = `rgb(${p.map(Math.round).join(',')})`; x.fillRect(xx, y, 1, 1); } }));
    return cv;
  }
  function iconCells(id) {   // cajas de color para la portada 3D
    const P = pal(id), cells = [];
    ICONS[id].forEach((row, y) => [...row].forEach((ch, x) => { const p = P[ch]; if (p) cells.push({ x, y, c: p.map(v => v / 255) }); }));
    return cells;
  }
  window.MesaIcon = iconCanvas;

  /* ---------- partida ---------- */
  let run = null, lock = false, cur = 'intro', bubbleTimer = 0, result = null;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function newRun() {
    const a = shuffle(Q.map((_, i) => i));
    for (let i = 2; i < N; i++) {      // que no salgan tres del mismo formato seguidos
      if (Q[a[i]].f === Q[a[i - 1]].f && Q[a[i]].f === Q[a[i - 2]].f) { const j = a.findIndex((x, k) => k > i && Q[x].f !== Q[a[i]].f); if (j > 0) { const t = a[i]; a[i] = a[j]; a[j] = t; } }
    }
    const perm = {}; Q.forEach((q, i) => { if (q.o) perm[i] = shuffle(q.o.map((_, k) => k)); });
    run = { order: a, perm, answers: {}, idx: 0 };
    store.set('run', run);
  }
  const answered = () => Object.keys(run.answers).length;
  function loadRun() {
    const r = store.get('run');
    if (r && Array.isArray(r.order) && r.order.length === N && r.perm && r.answers) { run = r; return true; }
    return false;
  }

  /* ---------- puntuación ---------- */
  function compute() {
    const raw = new Array(7).fill(0);
    Q.forEach((q, i) => {
      const a = run.answers[i]; if (a == null) return;
      if (q.f === 'orb') raw[TR.indexOf(q.r)] += (q.v < 0 ? 5 - a : a - 1) / 2;
      else { const o = q.o[a]; raw[TR.indexOf(o[1])] += 2; raw[TR.indexOf(o[2])] += 1; }
    });
    const z = raw.map((v, i) => (v - D.mu[i]) / D.sd[i]);
    const aff = {}, pct = {};
    E.forEach((e, k) => {
      const [a, b] = D.prof[e]; aff[e] = (z[TR.indexOf(a)] + z[TR.indexOf(b)]) / Math.SQRT2 + D.off[k];
      pct[e] = 0.08 + 0.92 * clamp((aff[e] - D.lo) / (D.hi - D.lo), 0, 1);
    });
    const rank = E.slice().sort((a, b) => aff[b] - aff[a] || E.indexOf(a) - E.indexOf(b));
    return { pct, aff, rank, raw, z };
  }
  const levelOf = a => 1 + D.lv.filter(v => a >= v).length;
  window.MesaScore = { compute, levelOf };

  /* ---------- pantallas ---------- */
  const SCENE_OF = { intro: 'intro', quiz: 'read', ritual: 'ritual', result: 'result' };
  function show(name) {
    cur = name; document.body.dataset.screen = name;
    $$('[data-screen]').forEach(s => { if (s !== document.body) s.hidden = s.id !== 'screen-' + name; });
    $('#btnHome').hidden = name !== 'quiz';
    scene && scene.setState(SCENE_OF[name]);
    A && A.setScene(name);
    $('#pages').classList.toggle('off', name !== 'quiz');
    if (name !== 'intro') { bubble.hidden = true; document.body.classList.remove('hover-book'); scene && scene.setHover(false); }
    updateShift();
  }
  function updateShift() {
    if (!scene) return;
    const W = innerWidth, H = innerHeight, side = matchMedia('(min-width: 980px) and (min-aspect-ratio: 1/1)').matches;
    if (cur !== 'result') return scene.setShift(0, 0);
    if (side) scene.setShift(0, clamp(Math.min(460, W * 0.38) / W, 0, 0.5) * 0.98 + 0.02);
    else {
      const hb = $('.r-head').getBoundingClientRect().bottom, dt = $('#dock').getBoundingClientRect().top;
      scene.setShift(clamp((H / 2 - (hb + dt) / 2) / (H / 2), -0.15, 0.7), 0);
    }
  }

  /* ---------- Kixki habla (solo fuera de las preguntas) ---------- */
  const bubble = $('#bubble'), bubbleText = $('#bubbleText');
  function say(text, ms) {
    if (cur === 'quiz') return;
    bubbleText.textContent = text; bubble.hidden = false; clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, ms || 4200); placeBubble();
  }
  function placeBubble() {
    if (bubble.hidden || !scene) return;
    const p = scene.kixkiScreen(), w = bubble.offsetWidth || 200;
    bubble.style.left = clamp(innerWidth < 640 && cur === 'intro' ? innerWidth / 2 : p.x, w / 2 + 12, innerWidth - w / 2 - 12) + 'px';
    bubble.style.top = (innerWidth < 640 && cur === 'intro' ? innerHeight - 130 : clamp(p.y - 8, bubble.offsetHeight + 70, innerHeight - 10)) + 'px';
  }

  /* ---------- páginas: el DOM se pega a las páginas 3D con una homografía ---------- */
  const pgEl = { L: $('#pgL'), R: $('#pgR') }, sz = { L: [0, 0], R: [0, 0] };
  function layoutPages() {
    if (cur !== 'quiz' || !scene.pg || !window.MesaScene) return;
    const pg = scene.pg, ready = pg.open > 0.96;
    $('#pages').classList.toggle('off', !ready);
    if (!ready) return;
    ['L', 'R'].forEach(k => {
      const q = pg[k], el = pgEl[k], d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const w = Math.round((d(q[0], q[1]) + d(q[3], q[2])) / 2), h = Math.round((d(q[0], q[3]) + d(q[1], q[2])) / 2);
      if (w < 40 || h < 40) return;
      if (Math.abs(sz[k][0] - w) > 1 || Math.abs(sz[k][1] - h) > 1) {
        sz[k] = [w, h]; el.style.width = w + 'px'; el.style.height = h + 'px';
        el.style.setProperty('--fs', clamp(Math.min(w / 20, h / 18), 12.5, 25).toFixed(1) + 'px');
      }
      el.style.transform = window.MesaScene.quadMatrix(q, sz[k][0] || w, sz[k][1] || h);
    });
  }

  /* ---------- preguntas ---------- */
  const KIND = { esc: 'Escenario', ab: 'A o B', obj: 'Elige un objeto', orb: 'Qué tanto te describe' };
  function showQuestion() {
    lock = false;
    const qid = run.order[run.idx], q = Q[qid], opts = $('#opts');
    $('#qKind').textContent = KIND[q.f]; $('#qText').textContent = q.t;
    opts.className = 'opts f-' + q.f; opts.textContent = '';
    const cur0 = run.answers[qid];
    if (q.f === 'orb') {
      const row = document.createElement('div'); row.className = 'orbs'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'De 1, nada, a 5, totalmente');
      for (let v = 0; v < 5; v++) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'orb'; b.style.setProperty('--n', v);
        b.setAttribute('aria-label', `${v + 1} de 5`); b.setAttribute('aria-pressed', cur0 === v + 1 ? 'true' : 'false'); b.append(document.createElement('i'));
        b.addEventListener('click', () => choose(v)); row.append(b);
      }
      const ends = document.createElement('div'); ends.className = 'orb-ends'; ends.setAttribute('aria-hidden', 'true');
      const l = document.createElement('span'); l.textContent = 'Nada'; const r = document.createElement('span'); r.textContent = 'Totalmente'; ends.append(l, r);
      opts.append(row, ends);
    } else {
      run.perm[qid].forEach((orig, d) => {
        const o = q.o[orig], b = document.createElement('button');
        b.type = 'button'; b.className = 'opt'; b.setAttribute('aria-pressed', cur0 === orig ? 'true' : 'false');
        const k = document.createElement('span'); k.className = 'k'; k.textContent = q.f === 'ab' ? 'AB'[d] : String(d + 1); k.setAttribute('aria-hidden', 'true');
        const t = document.createElement('span'); t.textContent = o[0];
        b.append(k, t); b.addEventListener('click', () => choose(d)); opts.append(b);
      });
    }
    setProg(run.idx);
    $('#btnBack').textContent = run.idx === 0 ? '« Cerrar libro' : '« Volver';
    try { $('#qText').focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
  }
  function setProg(n) {
    $('#progFill').style.width = (n / N * 100) + '%'; $('#progN').textContent = `${Math.min(n + 1, N)} / ${N}`;
    const bar = $('#prog'); bar.setAttribute('aria-valuenow', n); bar.setAttribute('aria-valuetext', `Pregunta ${Math.min(n + 1, N)} de ${N}`);
  }
  function choose(d) {
    if (lock || cur !== 'quiz') return; lock = true;
    const qid = run.order[run.idx], q = Q[qid];
    run.answers[qid] = q.f === 'orb' ? d + 1 : run.perm[qid][d]; store.set('run', run);
    $$('#opts .opt, #opts .orb').forEach((b, i) => b.setAttribute('aria-pressed', i === d ? 'true' : 'false'));
    $('#opts').classList.add('lock');
    setProg(run.idx + 1);
    if (A) { q.f === 'orb' ? A.play('orb', d) : A.play('pick', run.idx); }
    scene && scene.burst(isReduced() ? 4 : 12);
    setTimeout(() => advance(1), isReduced() ? 100 : 380);
  }
  function turnPage(swap) {
    if (isReduced()) { swap(); return; }
    const pages = $('#pages'); pages.classList.add('turning'); scene.turn(); A && A.play('flip');
    setTimeout(swap, 330); setTimeout(() => pages.classList.remove('turning'), 420);
  }
  function advance(dir) {
    run.idx += dir; store.set('run', run);
    if (run.idx >= N) return finish();
    turnPage(() => {
      showQuestion();
      if (run.idx === 25) say('¡La mitad! El libro brilla.');
    });
  }
  function back() {
    if (lock) return;
    if (run.idx === 0) return goIntro();
    A && A.play('back'); advance(-1);
  }

  /* ---------- ritual y resultado ---------- */
  const RITUAL = ['Encantando…', 'Leyendo tus respuestas…', 'Fundiendo las runas…', '¡Casi listo!'];
  let ritualT = 0, ritualI = 0, revealT = 0;
  function finish() {
    show('ritual'); A && A.play('ritual');
    ritualI = 0; $('#ritualTxt').textContent = RITUAL[0];
    clearInterval(ritualT); ritualT = setInterval(() => { ritualI = Math.min(ritualI + 1, RITUAL.length - 1); $('#ritualTxt').textContent = RITUAL[ritualI]; scene && scene.burst(8); }, 1150);
    clearTimeout(revealT); revealT = setTimeout(reveal, isReduced() ? 1200 : 4700);
  }
  function fitName() {
    const el = $('#rName'), avail = $('.r-head').clientWidth - parseFloat(getComputedStyle($('.r-head')).paddingLeft) * 2;
    el.style.fontSize = ''; let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > avail && fs > 24) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  addEventListener('resize', () => { if (cur === 'result') fitName(); });
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  function reveal() {
    clearInterval(ritualT); clearTimeout(revealT);
    const r = compute(), win = r.rank[0], sec = r.rank[1], info = D.enchants[win], lvl = levelOf(r.aff[win]);
    result = { r, win, sec, lvl };
    store.set('done', { win, lvl, at: Date.now() });
    const sr = $('#screen-result'); sr.style.setProperty('--c', info.color);
    if (scene) {
      scene.setAccent(info.color); scene.setEmblem(iconCells(win), isReduced());
      scene.setColumns(r.rank.map(id => ({ id, pct: r.pct[id], color: D.enchants[id].color })));
      scene.reveal(); scene.happy();
    }
    A && A.play('reveal');
    $('#rNameTxt').textContent = info.nombre; $('#rLevel').textContent = ROMAN[lvl - 1];
    $('#rSub').textContent = info.subtitulo; $('#rQuote').textContent = '“' + info.frase + '”'; $('#rDesc').textContent = info.descripcion;
    const fill = (id, arr) => { const ul = $(id); ul.textContent = ''; arr.forEach(t => ul.append(h('li', '', t))); };
    fill('#rStr', info.fortalezas); fill('#rWeak', info.debilidades);
    $('#rSee').textContent = info.como_te_ven; $('#rTool').textContent = info.herramienta_ideal;
    const sinfo = D.enchants[sec], combo = $('#rCombo'); combo.textContent = ''; combo.style.setProperty('--c', sinfo.color);
    const ct = h('div'); ct.append(h('b', '', `${info.nombre} ${ROMAN[lvl - 1]} + ${sinfo.nombre} ${ROMAN[levelOf(r.aff[sec]) - 1]}`), h('p', '', `Tu lado secundario es ${sinfo.nombre}: “${sinfo.frase}”`));
    combo.append(iconCanvas(sec), ct);
    const match = $('#rMatch'); match.textContent = '';
    info.combina_con.forEach(m => { const mi = D.enchants[m.id]; const box = h('div', 'r-box px'); box.style.setProperty('--c', mi.color); const t = h('div'); t.append(h('b', '', mi.nombre), h('p', '', m.razon)); box.append(iconCanvas(m.id), t); match.append(box); });
    const bars = $('#rBars'); bars.textContent = '';
    r.rank.forEach((id, i) => {
      const bi = D.enchants[id], li = h('li'); li.style.setProperty('--c', bi.color); li.style.setProperty('--w', Math.round(r.pct[id] * 100) + '%');
      const tr = h('div', 'tr'), fl = h('div', 'fl'); fl.style.animationDelay = (i * 0.05) + 's'; tr.append(fl);
      li.append(iconCanvas(id), h('span', 'nm', bi.nombre), tr, h('span', 'pc', Math.round(r.pct[id] * 100) + '%')); bars.append(li);
    });
    // etiquetas sobre las columnas 3D
    const cols = $('#cols'); cols.textContent = '';
    r.rank.forEach((id, i) => {
      const bi = D.enchants[id], l = h('div', 'col-lab' + (i === 0 ? ' win' : '')); l.style.setProperty('--c', bi.color);
      l.append(iconCanvas(id), h('span', 'n', bi.nombre), h('span', 'p', Math.round(r.pct[id] * 100) + '%')); l.style.visibility = 'hidden'; cols.append(l);
    });
    show('result'); setTab('you'); $('#dock').classList.remove('open'); $('#dockBody').scrollTop = 0; $('#shareMsg').textContent = '';
    fitName(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => cur === 'result' && fitName());
    setTimeout(() => say(`¡Mira! Eres ${info.nombre}.`, 5200), 900);
    try { $('#rName').focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
  }
  function placeLabels() {
    if (cur !== 'result' || !scene.colScreen) return;
    $$('#cols .col-lab').forEach((l, i) => {
      const p = scene.colScreen(i); if (!p || p[2] <= 0) { l.style.visibility = 'hidden'; return; }
      const g = scene.colGrown ? scene.colGrown(i) : 1;
      l.style.visibility = g > 0.35 ? 'visible' : 'hidden';
      l.style.transform = `translate(${Math.round(p[0])}px, ${Math.round(p[1])}px) translate(-50%, -100%)`;
    });
  }

  /* ---------- pestañas del panel ---------- */
  const TABS = ['you', 'str', 'mix', 'all'];
  function setTab(id, focus) {
    TABS.forEach(t => { const b = $('#tab-' + t), on = t === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('#pane-' + t).hidden = !on; if (on && focus) b.focus(); });
    $('#dockBody').scrollTop = 0; A && A.play('ui');
  }
  $$('.tabs button').forEach(b => {
    b.addEventListener('click', () => setTab(b.id.slice(4)));
    b.addEventListener('keydown', e => {
      const i = TABS.indexOf(b.id.slice(4)), k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (k) { e.preventDefault(); setTab(TABS[(i + k + 4) % 4], true); }
    });
  });
  $('#dockGrip').addEventListener('click', () => { const d = $('#dock'), o = d.classList.toggle('open'); $('#dockGrip').setAttribute('aria-expanded', o); $('#dockGrip').setAttribute('aria-label', o ? 'Reducir el panel' : 'Ampliar el panel'); requestAnimationFrame(updateShift); });

  /* ---------- compartir y tarjeta ---------- */
  function shareText() {
    const info = D.enchants[result.win];
    return `Soy ${info.nombre} ${ROMAN[result.lvl - 1]} en la Mesa de Encantos. ¿Qué encantamiento eres tú?`;
  }
  async function downloadCard() {
    if (!result || !window.MesaCard) return;
    const msg = $('#shareMsg'); msg.textContent = 'Preparando tarjeta…';
    try {
      const cv = await window.MesaCard.make(result, D, iconCanvas);
      const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mesa-de-encantos-${result.win}.png`;
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      msg.textContent = 'Tarjeta descargada.';
    } catch (e) { msg.textContent = 'No pude crear la tarjeta en este navegador.'; }
  }
  async function share() {
    const msg = $('#shareMsg'), url = location.href.split('#')[0].split('?')[0], text = shareText();
    if (navigator.share) { try { await navigator.share({ title: 'Mesa de Encantos', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(`${text} ${url}`); msg.textContent = 'Copiado al portapapeles.'; }
    catch (e) { msg.textContent = 'No pude copiar. Selecciona y copia el enlace de la barra del navegador.'; }
  }

  /* ---------- intro: tocar el libro ---------- */
  function goIntro() {
    show('intro'); refreshResume(); try { $('#btnStart').focus({ preventScroll: true }); } catch (e) { /* sin foco */ }
  }
  function refreshResume() {
    const has = loadRun() && answered() > 0 && answered() <= N, done = has && answered() >= N;
    $('#btnResume').hidden = !has; $('#btnResume').textContent = 'Empezar de nuevo';
    $('#btnStart').lastElementChild.textContent = done ? 'Toca el libro · ver mi resultado' : has ? `Toca el libro · continuar (${answered()}/${N})` : 'Toca el libro';
  }
  function unlockAudio() { if (A && S.sound !== 'off') A.unlock(); }
  function openBook() {
    if (cur !== 'intro') return;
    unlockAudio(); A && A.play('open');
    if (loadRun() && answered() > 0) {
      if (answered() >= N) { show('ritual'); return reveal(); }
      run.idx = clamp(run.idx, 0, N - 1);
    } else newRun();
    show('quiz'); showQuestion();
  }
  function startFresh() { unlockAudio(); newRun(); A && A.play('open'); show('quiz'); showQuestion(); }

  /* ---------- ajustes ---------- */
  const modal = $('#settings'); let lastFocus = null;
  function openSettings() {
    lastFocus = document.activeElement; modal.hidden = false;
    $$('input[type=radio]', modal).forEach(i => { i.checked = S[i.name] === i.value; });
    $('#vol').value = S.vol; $('#btnCloseSet').focus();
  }
  function closeSettings() { modal.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  modal.addEventListener('change', e => {
    const i = e.target;
    if (i.id === 'vol') { S.vol = +i.value; save(); applySettings(); unlockAudio(); A && A.play('ui'); return; }
    if (i.name in S) { S[i.name] = i.value; if (i.name === 'sound' && i.value !== 'off') lastSound = i.value; save(); applySettings(); if (i.name === 'sound') { unlockAudio(); A && A.play('ui'); } }
  });
  modal.addEventListener('click', e => { if (e.target === modal) closeSettings(); });
  $('#btnMute').addEventListener('click', () => {
    S.sound = S.sound === 'off' ? lastSound : 'off'; if (S.sound !== 'off') lastSound = S.sound; save(); applySettings(); unlockAudio(); A && A.play('ui');
  });
  document.addEventListener('keydown', e => {
    if (!modal.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeSettings(); }
      else if (e.key === 'Tab') {
        const f = $$('button, input', modal).filter(x => x.offsetParent !== null || x.type === 'radio'); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (cur !== 'quiz' || e.ctrlKey || e.metaKey || e.altKey) return;
    const q = Q[run.order[run.idx]], cnt = q.f === 'orb' ? 5 : q.o.length, n = '12345'.indexOf(e.key);
    if (e.key.length === 1 && n >= 0 && n < cnt) { e.preventDefault(); choose(n); }
    else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); back(); }
  });

  /* ---------- arranque ---------- */
  $('#btnStart').addEventListener('click', openBook);
  $('#btnResume').addEventListener('click', startFresh);
  $('#btnBack').addEventListener('click', back);
  $('#btnHome').addEventListener('click', goIntro);
  $('#btnAgain').addEventListener('click', () => { store.del('run'); store.del('done'); result = null; scene && (scene.setAccent('#b36bff'), scene.setEmblem(scene.defaultEmblem(), false)); goIntro(); });
  $('#btnCard').addEventListener('click', downloadCard);
  $('#btnShare').addEventListener('click', share);
  $('#btnSettings').addEventListener('click', openSettings);
  $('#btnCloseSet').addEventListener('click', closeSettings);
  addEventListener('pointerdown', unlockAudio, { once: true, passive: true });

  try {
    scene = new window.MesaScene($('#scene'), { reduce: isReduced(), fps30: matchMedia('(pointer: coarse)').matches });
  } catch (err) {
    console.warn('WebGL no disponible, uso el respaldo 2D:', err && err.message);
    $('#scene').hidden = true; $('#scene2d').hidden = false; scene = window.MesaFallback.create($('#scene2d'), { reduce: isReduced() });
  }
  const canvas = scene.canvas || $('#scene2d');
  scene.onFrame = () => { placeBubble(); layoutPages(); placeLabels(); };
  applySettings();
  const fit = () => { scene.resize(innerWidth, innerHeight); updateShift(); placeBubble(); sz.L = [0, 0]; sz.R = [0, 0]; };
  let rz = 0; addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(fit); });
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'touch') scene.setPointer((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2);
    if (cur === 'intro' && e.pointerType !== 'touch' && e.target === canvas) { const on = scene.hitBook(e.clientX, e.clientY); scene.setHover(on); document.body.classList.toggle('hover-book', on); }
  }, { passive: true });
  canvas.addEventListener('click', e => { if (cur === 'intro' && scene.hitBook(e.clientX, e.clientY)) openBook(); });
  addEventListener('deviceorientation', e => { if (e.gamma != null && e.beta != null) scene.setPointer(e.gamma / 28, (e.beta - 50) / 28); }, { passive: true });
  fit(); scene.setState('intro', true); scene.start();
  refreshResume(); show('intro');
  setTimeout(() => say('¡Hola! Soy Kixki. Toca el libro para empezar.', 5200), 900);
  window.MesaApp = { scene, get run() { return run; }, choose, show, reveal, compute, openBook };
})();
