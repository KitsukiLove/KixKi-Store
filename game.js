/**
 * game.js — La oveja, sus clics y las bromas de Kixki Store.
 *
 *   1. Oveja caminante (#pet): pasea de día (se detiene a pastar de vez en cuando),
 *      duerme de noche con Zs, y lleva el disfraz de la temporada
 *      (calabaza, gorro de Navidad, corazones). Solo existe en modo PC.
 *   2. Clics en la oveja: contador persistente (state.game.petTaps → "kixki-pet").
 *        10 seguidos  → lluvia de ovejas
 *        100 clics    → ventana «virus» con barra de análisis
 *        500 clics    → segunda alerta (el virus muta)
 *        1000 clics   → evento especial: ventanas en cascada + GIF final de una vaca
 *      Cada hito se muestra UNA vez ("kixki-game-seen"). Cambia los números en MILESTONES.
 *      Todo es una broma inofensiva: cada ventana se cierra con ✕, con sus botones o con Esc.
 *   3. Saltaovejas: minijuego (menú Kixki → Saltaovejas) con récord en state.game.highScore.
 *
 * Probarlo sin hacer 1000 clics, desde la consola:
 *   KX.game.trigger("virus") · KX.game.trigger("alert") · KX.game.trigger("cascade")
 *   KX.game.reset()  → vuelve a permitir los hitos
 *
 * prefers-reduced-motion: la oveja no pasea, no hay lluvia ni temblores y la cascada va más lenta.
 */

import * as state from "./state.js";
import { getSeason, hatFor, reducedMotion } from "./scenes.js";
import { blip } from "./music.js";
import { registerModal } from "./windows.js";
import { icon } from "./sprites.js";
import { T, esc, toast } from "./render.js";

const $ = (sel, r = document) => r.querySelector(sel);
const root = document.documentElement;

/** GIF de la vaca (cópialo a esta ruta; añade también la ruta a la caché de sw.js si precacheas). */
const COW_GIF = "assets/vaca.gif";

/** Clics acumulados que disparan cada hito. */
const MILESTONES = [
  { at: 100, kind: "virus" },
  { at: 500, kind: "alert" },
  { at: 1000, kind: "cascade" },
];
const SEEN_KEY = "kixki-game-seen";

const loadSeen = () => { try { const v = JSON.parse(localStorage.getItem(SEEN_KEY)); return Array.isArray(v) ? v : []; } catch (_) { return []; } };
const saveSeen = v => { try { localStorage.setItem(SEEN_KEY, JSON.stringify(v)); } catch (_) { /* sin almacenamiento */ } };

/* =====================================================================
   1. Oveja caminante
   ===================================================================== */

function buildPet() {
  if ($("#pet")) return;
  document.body.insertAdjacentHTML("beforeend",
    `<div id="pet" aria-hidden="true"><div class="pi"><span class="pa">${icon("spr-sheep", 4)}</span><span class="ps">${icon("spr-sheep-sleep", 4)}</span>${[2, 3, 4].map((n, i) => `<i class="zz" style="--zd:-${i * 1.2}s">${icon("spr-zz", n)}</i>`).join("")}</div><span class="cnt" id="pc" hidden></span></div>`);
}

/** Disfraz según la temporada (en modo noche la CSS lo oculta junto a la oveja despierta). */
function applyHat() {
  $("#pet .hat")?.remove();
  const h = hatFor(getSeason());
  if (!h) return;
  $("#pet .pa").insertAdjacentHTML("beforeend",
    `<span class="hat" style="--h:${h.hue};left:${h.pet[0]}px;top:${h.pet[1]}px">${icon(h.id, 3)}</span>`);
}

let px = 260, dir = 1, grazing = 0, walkTimer = 0;

function step() {
  const pet = $("#pet"), pi = $("#pet .pi");
  if (!pet) return;
  if (state.get("theme") === "dark") { pi.style.transform = ""; return; }      // de noche duerme
  if (grazing > 0) { grazing--; return; }
  if (Math.random() < .015) { grazing = 8 + ((Math.random() * 16) | 0); return; } // se para a pastar 1-3 s
  px += dir * 3;
  const max = innerWidth - 130;
  if (px > max) { px = max; dir = -1; }
  if (px < 120) { px = 120; dir = 1; }
  pet.style.transform = `translateX(${px}px)`;
  pi.style.transform = dir < 0 ? "scaleX(-1)" : "";
}

/** Solo camina si la pestaña se ve, estamos en PC y no se pidió reducir el movimiento. */
function syncWalk() {
  const go = !document.hidden && state.isDesktop() && !reducedMotion();
  if (go && !walkTimer) walkTimer = setInterval(step, 120);
  else if (!go && walkTimer) { clearInterval(walkTimer); walkTimer = 0; }
}

function showCount() {
  const el = $("#pc"), n = state.getState().game.petTaps;
  if (!el) return;
  el.textContent = "🐑 ×" + n.toLocaleString(state.get("lang"));
  el.hidden = !n;
}

function rain() {
  toast(T("game.rain", "¡Lluvia de ovejas! 🐑"));
  if (reducedMotion()) return;
  for (let i = 0; i < 28; i++) {
    const e = document.createElement("i");
    e.className = "rain";
    e.textContent = "🐑";
    e.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 1.5}s;font-size:${18 + Math.random() * 22}px`;
    document.body.append(e);
    setTimeout(() => e.remove(), 4200);
  }
}

function petHit() {
  state.incPetTaps();
  blip(880, .1);
  const pc = $("#pc"), g = state.getState().game, n = g.petTaps;
  pc.classList.remove("pop");
  void pc.offsetWidth;                     // reinicia la animación
  pc.classList.add("pop");
  toast(n === 1 ? T("game.first", "¡Beee! 🐑 Primer toque")
    : n % 25 === 0 ? T("game.every", "¡Beee! {n} toques 💜", { n })
      : T("game.bee", "¡Beee! 🐑"));
  if (g.sessionTaps >= 10) { state.resetSessionTaps(); rain(); }
  checkMilestones();
}

/* =====================================================================
   2. Hitos: ventanas emergentes estilo «virus»
   ===================================================================== */

let uid = 0, zTop = 0;
const live = new Set();          // ventanas abiertas
let timers = [];                 // temporizadores pendientes (escaneo, cascada)

const wrap = () => $("#vwrap") || (document.body.insertAdjacentHTML("beforeend", `<div id="vwrap"></div>`), $("#vwrap"));
const busy = () => live.size > 0 || timers.length > 0;
const later = (fn, ms) => { const t = setTimeout(() => { timers = timers.filter(x => x !== t); fn(); }, ms); timers.push(t); return t; };

function closeWin(el) { live.delete(el); el.remove(); }

export function closeAll() {
  timers.forEach(clearTimeout);
  timers = [];
  [...live].forEach(closeWin);
}

function dragify(el) {
  const bar = $(".vt", el);
  bar.addEventListener("pointerdown", e => {
    if (e.target.closest(".vx")) return;
    const r = el.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    bar.setPointerCapture?.(e.pointerId);
    const move = ev => {
      el.style.left = Math.max(0, Math.min(innerWidth - 80, ev.clientX - dx)) + "px";
      el.style.top = Math.max(0, Math.min(innerHeight - 60, ev.clientY - dy)) + "px";
    };
    const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });
}

/**
 * Ventana emergente. buttons: [{label, on(el), keep}] — el primero es el principal;
 * cada botón cierra la ventana salvo que lleve keep:true.
 */
function popup({ cls = "vw-virus", title, glyph = "⚠️", head = "", text = "", bar = false, img = "", buttons = [], x = 80, y = 80 }) {
  const id = "vw" + ++uid;
  const el = document.createElement("div");
  el.className = `vw ${cls}`;
  el.setAttribute("role", "alertdialog");
  el.setAttribute("aria-labelledby", id + "-t");
  el.setAttribute("aria-describedby", id + "-d");
  el.style.left = Math.max(8, x) + "px";
  el.style.top = Math.max(8, y) + "px";
  el.style.zIndex = ++zTop;
  el.innerHTML =
    `<div class="vt"><span id="${id}-t">${esc(title)}</span><button type="button" class="vx" aria-label="${esc(T("modal.close", "Cerrar"))}">✕</button></div>` +
    `<div class="vbd">${img ? `<img class="vimg" src="${esc(img)}" alt="${esc(T("game.cow.alt", "Una vaca bailando"))}" decoding="async">` : `<span class="vi" aria-hidden="true">${glyph}</span>`}` +
    `<div class="vm" id="${id}-d">${head ? `<b>${esc(head)}</b>` : ""}<p>${esc(text)}</p>${bar ? `<div class="vbar"><i></i></div>` : ""}</div></div>` +
    `<div class="vft">${buttons.map((b, i) => `<button type="button" class="btn${i === 0 ? " p" : ""}" data-i="${i}">${esc(b.label)}</button>`).join("")}</div>`;
  wrap().append(el);
  live.add(el);
  $(".vx", el).addEventListener("click", () => closeWin(el));
  el.querySelectorAll(".vft .btn").forEach(btn => btn.addEventListener("click", () => {
    const b = buttons[+btn.dataset.i];
    b.on?.(el);
    if (!b.keep) closeWin(el);
  }));
  el.addEventListener("pointerdown", () => { el.style.zIndex = ++zTop; });
  dragify(el);
  return el;
}

const center = (w, h) => ({ x: (innerWidth - w) / 2, y: Math.max(10, (innerHeight - h) / 2 - 40) });

/** Barra de «análisis» falsa; al llegar a 100 % cambia el texto. */
function fakeScan(el, doneText) {
  const bar = $(".vbar i", el), p = $(".vm p", el);
  let pct = 0;
  const tick = () => {
    if (!live.has(el)) return;
    pct = Math.min(100, pct + 8 + ((Math.random() * 12) | 0));
    bar.style.width = pct + "%";
    p.textContent = pct < 100 ? T("game.v100.scan", "Analizando ovejas… {p} %", { p: pct }) : doneText;
    if (pct < 100) later(tick, 180);
  };
  tick();
}

function glitch() {
  if (reducedMotion()) return;
  root.classList.add("glitch");
  setTimeout(() => root.classList.remove("glitch"), 700);
}

const EVENTS = {
  /* 100 clics */
  virus() {
    const { x, y } = center(340, 260);
    blip(220, .15);
    const done = T("game.v100.done", "Análisis completo: 0 amenazas reales y 100 % de ternura. Puedes seguir tocando la oveja.");
    const el = popup({
      cls: "vw-virus", title: T("game.v100.title", "¡ALERTA DE VIRUS!"), glyph: "🦠",
      head: T("game.v100.head", "Tu dispositivo podría estar infectado"),
      text: T("game.v100.text", "Se han detectado 100 toques a la oveja. Es un virus muy contagioso de ternura. 🐑"),
      bar: true, x, y,
      buttons: [
        { label: T("game.v100.remove", "Eliminar virus"), on: () => toast(T("game.v100.removed", "Virus eliminado… o eso creemos 🐑")) },
        { label: T("game.v100.ignore", "Ignorar") },
      ],
    });
    later(() => fakeScan(el, done), 700);
  },

  /* 500 clics */
  alert() {
    const { x, y } = center(340, 240);
    glitch();
    blip(110, .3);
    popup({
      cls: "vw-alert", title: T("game.a500.title", "Kixki Antivirus Pro™ · Alerta crítica"), glyph: "☢️",
      head: T("game.a500.head", "¡El virus ha mutado!"),
      text: T("game.a500.text", "500 toques. La oveja ya no se detiene y el antivirus ha pedido vacaciones. Esto no estaba en el plan."),
      x, y,
      buttons: [
        { label: T("game.a500.yes", "Seguir tocando") },
        { label: T("game.a500.no", "Rendirse"), on: () => toast(T("game.a500.toast", "Demasiado tarde: la oveja ya es de todos 💜")) },
      ],
    });
  },

  /* 1000 clics: ventanas en cascada y vaca final */
  cascade() {
    const msgs = [
      ["💥", T("game.c.m1", "Error 🐑: demasiadas ovejas en memoria.")],
      ["⚠️", T("game.c.m2", "beee.exe ha dejado de funcionar.")],
      ["🐑", T("game.c.m3", "Se han clonado 12 ovejas sin tu permiso.")],
      ["🧶", T("game.c.m4", "Memoria llena de lana. Vaciando…")],
      ["📥", T("game.c.m5", "Descargando más ovejas… 99 %")],
      ["😴", T("game.c.m6", "El antivirus se ha quedado dormido.")],
      ["🔢", T("game.c.m7", "Contador de ovejas desbordado.")],
      ["🐄", T("game.c.m8", "Alerta: se ha detectado una vaca en el sistema.")],
    ];
    const gap = reducedMotion() ? 900 : 380;
    const room = Math.max(60, innerWidth - 380);
    glitch();
    new Image().src = COW_GIF;               // precarga: la vaca aparece al final ya cargada
    msgs.forEach(([glyph, text], i) => later(() => {
      popup({
        cls: i % 2 ? "vw-alert" : "vw-virus", title: T("game.c.title", "Kixki.exe · Error"), glyph, text,
        x: 30 + (i * 34) % room, y: 50 + (i * 30) % Math.max(60, innerHeight - 280),
        buttons: [{ label: T("game.ok", "Aceptar") }],
      });
      blip(200 + i * 45, .08);
    }, i * gap));
    later(EVENTS.cow, msgs.length * gap + 400);
  },

  cow() {
    const { x, y } = center(360, 470);
    blip(130, .35);
    popup({
      cls: "vw-cow", title: "vaca.gif", glyph: "🐄", img: COW_GIF,
      head: T("game.cow.head", "¡MUUU!"),
      text: T("game.cow.text", "Has desbloqueado la vaca. Gracias por tocar la oveja tantas veces 💜"),
      x, y,
      buttons: [{ label: T("game.closeAll", "Cerrar todo"), on: closeAll, keep: true }],
    });
  },
};

export function trigger(kind) {
  if (EVENTS[kind]) EVENTS[kind]();
}

function checkMilestones() {
  if (busy()) return;                      // no apilar bromas
  const taps = state.getState().game.petTaps, seen = loadSeen();
  const m = MILESTONES.find(x => taps >= x.at && !seen.includes(x.at));
  if (!m) return;
  saveSeen([...seen, m.at]);
  trigger(m.kind);
}

/* =====================================================================
   3. Saltaovejas
   ===================================================================== */

const SHEEP = [
  "...wwww.www.wwww..", "..wwwwwwwwwwwwwwf.", ".wwwwwwwwwwwwwfff.", "wwwwwwwwwwwwwfeff.",
  "wwwwwwwwwwwwwffff.", "wwwwwwwwwwwwwfppf.", "gwwwwwwwwwwww.ff..", ".gwwwwwwwwwww.....",
  "..gggggggggg......", "...f.f....f.f.....", "...f.f....f.f.....",
];
const COL = { w: "#fff7e6", f: "#f2a574", e: "#2b1a5e", p: "#ff8fc7", g: "#cdbdf2" };

function registerRunner() {
  let canvas, cx, raf = 0, running = false, last = 0;
  let y, v, obs, score, speed, dead, scored;

  const reset = () => { y = 0; v = 0; obs = [{ x: 340, w: 10, h: 16 }]; score = 0; speed = 3; dead = false; scored = false; };
  const jump = () => { if (dead) reset(); else if (y === 0) v = 9; };
  const key = e => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); } };

  const loop = t => {
    if (!running) return;
    const cs = getComputedStyle(root), ink = cs.getPropertyValue("--ink");
    const dt = Math.min(2, last && t ? (t - last) / 16.67 : 1);
    last = t || 0;
    cx.fillStyle = cs.getPropertyValue("--surface2"); cx.fillRect(0, 0, 320, 120);
    cx.fillStyle = cs.getPropertyValue("--line"); cx.fillRect(0, 100, 320, 20);
    if (!dead) {
      v -= .6 * dt;
      y = Math.max(0, y + v * dt);
      if (y === 0 && v < 0) v = 0;
      obs.forEach(o => { o.x -= speed * dt; });
      if (obs[0] && obs[0].x < -20) { obs.shift(); score++; speed = Math.min(7, 3 + score / 6); }
      const l = obs[obs.length - 1];
      if (!l || (l.x < 220 && Math.random() < .025 * dt)) obs.push({ x: 330, w: 8 + ((Math.random() * 8) | 0), h: 12 + ((Math.random() * 10) | 0) });
      if (obs.some(o => o.x < 66 && o.x + o.w > 34 && y < o.h - 2)) dead = true;
    } else if (!scored) {
      scored = true;
      state.submitScore(score);
    }
    cx.fillStyle = ink;
    obs.forEach(o => cx.fillRect(o.x, 100 - o.h, o.w, o.h));
    SHEEP.forEach((row, j) => [...row].forEach((ch, i) => {
      if (COL[ch]) { cx.fillStyle = COL[ch]; cx.fillRect(30 + i * 2, 100 - 22 - y + j * 2, 2, 2); }
    }));
    cx.fillStyle = ink;
    cx.font = "16px monospace";
    cx.fillText("🐑 " + score, 240, 20);
    cx.fillText("🏆 " + state.getState().game.highScore, 240, 40);
    if (dead) cx.fillText(T("game.run.retry", "Toca para reintentar"), 90, 60);
    raf = requestAnimationFrame(loop);
  };

  registerModal("game", {
    title: () => "saltaovejas.exe",
    build(body) {
      body.innerHTML = `<canvas width="320" height="120" tabindex="0" aria-label="Saltaovejas"></canvas><p class="hint"></p>`;
      canvas = $("canvas", body);
      cx = canvas.getContext("2d");
      canvas.addEventListener("pointerdown", jump);
    },
    open(body) {
      reset();
      running = true;
      last = 0;
      $(".hint", body).textContent = T("game.run.hint", "Toca, espacio o ↑ para saltar");
      addEventListener("keydown", key);
      raf = requestAnimationFrame(loop);
    },
    close() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener("keydown", key);
    },
    focus: () => canvas,
  });
}

/* =====================================================================
   4. Arranque
   ===================================================================== */

export function init() {
  buildPet();
  applyHat();
  showCount();
  syncWalk();
  registerRunner();

  $("#pet").addEventListener("click", petHit);
  state.subscribe("game", showCount);
  state.subscribe("lang", showCount);
  state.subscribe("mode", syncWalk);
  state.subscribe("theme", () => { syncWalk(); if (state.get("theme") === "dark") $("#pet .pi").style.transform = ""; });
  document.addEventListener("visibilitychange", syncWalk);
  document.addEventListener("kx:season", applyHat);

  // Esc cierra todas las bromas (y no cierra además las ventanas del escritorio)
  addEventListener("keydown", e => {
    if (e.key === "Escape" && busy()) { e.stopPropagation(); closeAll(); }
  }, true);

  window.KX = Object.assign(window.KX || {}, {
    game: { trigger, closeAll, reset: () => saveSeen([]) },
  });
}
