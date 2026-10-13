/**
 * scenes.js — Fondos, escena de la cabecera y temporadas de Kixki Store.
 *
 *   1. Temporada (getSeason): Halloween (1 oct – 2 nov), Navidad (1 dic – 6 ene),
 *      San Valentín (7–14 feb). Se puede forzar con ?temp=halloween|navidad|amor.
 *   2. Fondo (#bgx): «Automático» (sigue la temporada) o uno fijo: Clásico, Valle,
 *      Halloween, Navidad. Cada fondo cambia de paleta con el tema Día / Noche
 *      (state.theme). Se guarda en localStorage con la misma clave de siempre
 *      ("kixki-bg"). Cuando cambia, avisa con el evento  kx:bg {key}.
 *   3. Escena de la cabecera (#scene-art): cielo en franjas, estrellas, sol/luna,
 *      nubes, colinas y la oveja (con gorro de temporada).
 *   4. Burbujas decorativas.
 *   5. Pestaña oculta → html.tab-hidden (la CSS pausa todas las animaciones).
 *      prefers-reduced-motion → sin nieve ni burbujas.
 *
 * Otros módulos importan de aquí: getSeason, HATS, hatFor, getBg, reducedMotion.
 * Mantiene el global window.KXB = {label, next} que usan el menú y el botón #tb.
 */

import * as state from "./state.js";
import { defineSprite, icon } from "./sprites.js";
import { T } from "./render.js";

const root = document.documentElement;
const $ = (sel, r = document) => r.querySelector(sel);
const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================================
   1. Temporadas y disfraces
   ===================================================================== */

const SEASONS = ["halloween", "navidad", "amor"];

/** "halloween" | "navidad" | "amor" | "" */
export function getSeason(date = new Date()) {
  const forced = new URLSearchParams(location.search).get("temp");
  if (SEASONS.includes(forced)) return forced;
  const m = date.getMonth() + 1, d = date.getDate();
  if (m === 10 || (m === 11 && d <= 2)) return "halloween";
  if (m === 12 || (m === 1 && d <= 6)) return "navidad";
  if (m === 2 && d >= 7 && d <= 14) return "amor";
  return "";
}

/**
 * Disfraz de cada temporada: rows = sprite (h = color de `hue`), pet = [left, top] en px
 * sobre la oveja caminante (escala 3), scene = [x, y] en la cuadrícula de la cabecera.
 */
export const HATS = {
  halloween: { rows: ["...m...", ".hhhhh.", "hhhhhhh", "hkhhhkh", ".hhhhh."], hue: "#ff8a1e", pet: [44, -13], scene: [48, 12] },
  navidad:   { rows: ["...ww", "..hhw", ".hhhh", "hhhhh", "wwwww"], hue: "#e8394d", pet: [46, -13], scene: [49, 12] },
  amor:      { rows: ["p.p.p", ".ppp.", "..p.."], hue: "#ff8fc7", pet: [46, -13], scene: [49, 12] },
};

/** Disfraz de una temporada con su sprite ya registrado en la hoja (o null). */
export function hatFor(season) {
  const h = HATS[season];
  if (!h) return null;
  const id = `hat-${season}`;
  defineSprite(id, h.rows);
  return { ...h, id };
}

/* =====================================================================
   2. Fondos intercambiables (#bgx)
   Pixel-art calculado según el tamaño de pantalla: en móvil los píxeles son
   pequeños y en un monitor grande hay más colinas, nubes y árboles.
   ===================================================================== */

const KEYS = ["auto", "", "valle", "halloween", "navidad"];
const NAME_FB = { auto: "Auto", "": "Clásico", valle: "Valle", halloween: "Halloween", navidad: "Navidad" };

const R = (x, y, w, h, c) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const rng = s => () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
const disc = (cx, cy, r, c) => { let s = ""; for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); s += R(cx - w, cy + y, 2 * w + 1, 1, c); } return s; };
const cloud = (x, y) => R(x, y + 1, 7, 2, "c") + R(x + 1, y, 4, 1, "c") + R(x + 3, y - 1, 2, 1, "c");
const pine = (x, y, h) => { let s = R(x, y + h, 1, 2, "t"); for (let j = 0; j < h; j++) { const k = (j / 2) | 0; s += R(x - k, y + j, 1 + 2 * k, 1, "p"); } return s + R(x, y + 3, 1, 1, "o") + R(x - 1, y + 7, 1, 1, "o") + R(x + 1, y + 6, 1, 1, "o"); };
const pump = (x, y) => R(x, y + 1, 5, 3, "o") + R(x + 1, y, 3, 1, "o") + R(x + 2, y - 1, 1, 1, "t") + R(x + 1, y + 2, 1, 1, "k") + R(x + 3, y + 2, 1, 1, "k");
const bat = (x, y) => R(x, y, 1, 1, "k") + R(x + 4, y, 1, 1, "k") + R(x + 2, y, 1, 1, "k") + R(x + 1, y + 1, 3, 1, "k");
const dead = (x, y) => R(x, y, 2, 14, "k") + R(x - 4, y + 3, 4, 1, "k") + R(x - 4, y + 1, 1, 3, "k") + R(x + 2, y + 5, 5, 1, "k") + R(x + 6, y + 2, 1, 4, "k");
/* colinas: devuelven la altura de cada columna, así se pueden poner objetos encima */
const hillF = (Hb, f, a, p, ph) => x => Math.round(Hb * f + a * Math.sin(x / p + ph));
const hill = (W, Hb, fn, c) => { let s = ""; for (let x = 0; x < W; x++) { const y = fn(x); s += R(x, y, 1, Hb - y + 1, c); } return s; };
const stars = (W, Ht) => { const r = rng(7), n = Math.round(W * Ht / 60); let s = ""; for (let j = 0; j < n; j++) s += R(Math.floor(r() * W), Math.floor(r() * Ht * .85), 1, 1, "st"); return s; };
const clouds = (W, Ht) => { const r = rng(11), n = Math.max(3, Math.round(W / 18)); let s = ""; for (let j = 0; j < n; j++) s += cloud(Math.round((j + .2 + r() * .6) * W / n), Math.round(3 + r() * Ht * .5)); return s; };
const bats = (W, Ht) => { const r = rng(5), n = Math.max(3, Math.round(W / 16)); let s = ""; for (let j = 0; j < n; j++) s += bat(Math.round((j + .3 + r() * .4) * W / n), Math.round(3 + r() * Ht * .45)); return s; };

const SC = {
  valle(W, Ht, Hb) {
    const r = rng(3), f1 = hillF(Hb, .5, Hb * .06, 7, 0), f2 = hillF(Hb, .66, Hb * .05, 5, 2), f3 = hillF(Hb, .8, Hb * .04, 9, 4);
    let fl = "";
    for (let j = 0, n = Math.round(W * Hb / 140); j < n; j++) { const x = Math.floor(r() * W), y0 = f3(x) + 1; fl += R(x, Math.min(Hb - 1, y0 + Math.floor(r() * (Hb - y0))), 1, 1, "o"); }
    return { top: stars(W, Ht) + disc(Math.round(W * .5), Math.round(Ht * .3), 4, "a") + clouds(W, Ht), bot: hill(W, Hb, f1, "g1") + hill(W, Hb, f2, "g2") + hill(W, Hb, f3, "g3") + fl };
  },
  halloween(W, Ht, Hb) {
    const r = rng(9), f1 = hillF(Hb, .55, Hb * .05, 8, 1), f2 = hillF(Hb, .68, Hb * .04, 6, 3), f3 = hillF(Hb, .8, Hb * .03, 10, 0);
    let pk = "";
    for (let j = 0, n = Math.max(4, Math.round(W / 13)); j < n; j++) { const x = Math.floor((j + .2 + r() * .6) * W / n); pk += pump(x, f3(x) - 2); }
    const dx = Math.round(W * .5);
    return { top: stars(W, Ht) + disc(Math.round(W * .26), Math.round(Ht * .42), 6, "a") + bats(W, Ht), bot: hill(W, Hb, f1, "g1") + hill(W, Hb, f2, "g2") + hill(W, Hb, f3, "g3") + dead(dx, f1(dx) - 13) + pk };
  },
  navidad(W, Ht, Hb) {
    const r = rng(13), f1 = hillF(Hb, .45, Hb * .05, 9, 0), f2 = hillF(Hb, .62, Hb * .04, 6, 2), f3 = hillF(Hb, .78, Hb * .03, 8, 4);
    let pn = "";
    for (let x = 5; x < W; x += 9 + Math.floor(r() * 6)) { const h = 7 + Math.floor(r() * 6); pn += pine(x, f1(x) + 1 - h, h); }
    return { top: stars(W, Ht) + disc(Math.round(W * .26), Math.round(Ht * .3), 3, "a"), bot: hill(W, Hb, f1, "g1") + pn + hill(W, Hb, f2, "g2") + hill(W, Hb, f3, "g3") };
  },
};

/* Colores [día, noche]: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
const P = {
  valle: [["#5db7f5", "#7ccaf9", "#a3dcfb", "#cdeefe", "#8bdc72", "#5cc25f", "#3ea24d", "#ffe27a", "#7a4a2a", "#ff9fd0", "#ffffff", "#2f8f5b", "#2a1650"], ["#070d2e", "#0e1a4d", "#1a2d6d", "#2b4690", "#245a4a", "#1b4a3b", "#133a2e", "#fff3c4", "#3b2a22", "#ffd36e", "#6f86c8", "#1f6b45", "#070d2e"]],
  halloween: [["#6b2d8f", "#a8408f", "#ee7a4a", "#ffb35c", "#4a2466", "#35194d", "#231235", "#ffd36e", "#1b0f2e", "#ff8a1e", "#e9a6c8", "#1b0f2e", "#1b0f2e"], ["#0c0620", "#190b3d", "#2b1259", "#46207a", "#2a1648", "#1c0f33", "#120a24", "#ffb347", "#07030f", "#ff8a1e", "#5a3a8a", "#07030f", "#07030f"]],
  navidad: [["#8cc6f0", "#acd8f6", "#cbe7fa", "#e8f5ff", "#ffffff", "#e9f2ff", "#d3e4fa", "#fff3b0", "#6b4226", "#e8394d", "#ffffff", "#2f8f5b", "#2a1650"], ["#070b2a", "#0f1b4a", "#1b2f6b", "#2d4a8f", "#cfe0ff", "#a9c2ee", "#8aa6d8", "#fff7d0", "#4a2d1a", "#ffd36e", "#8aa6d8", "#1f6b45", "#070b2a"]],
};
const VARS = "s1 s2 s3 s4 g1 g2 g3 a t o c p k".split(" ");

/** Tamaño del píxel según la pantalla: ~8px en móvil, hasta 18px en monitores grandes. */
function grid() {
  const w = innerWidth, h = innerHeight, u = Math.max(7, Math.min(18, Math.round(w / (w < 700 ? 48 : 110))));
  return { u, W: Math.ceil(w / u) + 1, Ht: Math.ceil(h / u * .55), Hb: Math.min(60, Math.ceil(h / u * .5)), h };
}

const readPref = () => {
  try { const v = JSON.parse(localStorage.getItem("kixki-bg")); return KEYS.includes(v) ? v : "auto"; } catch (_) { return "auto"; }
};
let pref = readPref();

/** Fondo que se está usando de verdad: "" | "valle" | "halloween" | "navidad". */
export function getBg() {
  if (pref !== "auto") return pref;
  const s = getSeason();
  return s === "halloween" || s === "navidad" ? s : "";
}

const nameOf = k => T(`bg.${k || "classic"}`, NAME_FB[k]);
export const bgLabel = () => (pref === "auto" ? `${T("bg.auto", NAME_FB.auto)} · ${nameOf(getBg())}` : nameOf(pref));

let built = "", G = null, announced;

function applyBg() {
  const box = $("#bgx");
  if (!box) return;
  const k = getBg();
  if (k !== announced) { announced = k; emit("kx:bg", { key: k }); }
  if (!k) { root.removeAttribute("data-bg"); box.innerHTML = ""; built = ""; return; }
  root.setAttribute("data-bg", k);
  const n = state.get("theme") === "dark" ? 1 : 0;
  VARS.forEach((v, j) => box.style.setProperty("--" + v, P[k][n][j]));
  box.style.setProperty("--so", n || k === "halloween" ? 1 : 0);
  box.style.setProperty("--co", k === "valle" ? (n ? .45 : 1) : 0);

  const g = grid();
  // en el móvil la barra del navegador cambia la altura sin parar: solo se redibuja si cambia de verdad
  if (built === k && G && G.u === g.u && G.W === g.W && Math.abs(G.h - g.h) / G.h < .15) return;
  built = k; G = g;
  const { u, W, Ht, Hb } = g, s = SC[k](W, Ht, Hb);
  const snow = k === "navidad" && !reducedMotion()
    ? Array.from({ length: Math.max(18, Math.round(W / 3)) }, (_, j) =>
      `<i class="snow" style="left:${(j * 37 + 9) % 100}%;--d:${9 + (j * 5) % 8}s;--dl:-${(j * 3) % 9}s;--z:${Math.max(2, Math.round(u * (.22 + .1 * (j % 3))))}px"></i>`).join("")
    : "";
  box.innerHTML =
    `<svg class="top" width="${W * u}" height="${Ht * u}" viewBox="0 0 ${W} ${Ht}" shape-rendering="crispEdges" aria-hidden="true">${s.top}</svg>` +
    `<svg class="bot" width="${W * u}" height="${Hb * u}" viewBox="0 0 ${W} ${Hb}" shape-rendering="crispEdges" aria-hidden="true">${s.bot}</svg>` + snow;
}

function nextBg() {
  pref = KEYS[(KEYS.indexOf(pref) + 1) % KEYS.length];
  try { localStorage.setItem("kixki-bg", JSON.stringify(pref)); } catch (_) { /* sin almacenamiento */ }
  applyBg();
}

/* =====================================================================
   3. Escena de la cabecera (viewBox 64×34)
   ===================================================================== */

const STARS = [[4, 3], [10, 9], [18, 4, 1], [25, 8], [31, 2], [33, 5, 1], [42, 12], [58, 12], [61, 4], [14, 14], [51, 3], [8, 17], [34, 15], [60, 17], [22, 13], [2, 10], [15, 2], [28, 13], [55, 2, 1], [62, 9], [20, 10], [7, 6, 1], [47, 8], [50, 15], [12, 12], [57, 7], [26, 3], [38, 13]];

/** Pinta los píxeles de un disco: une las columnas contiguas de cada fila en un solo <rect>. */
function discRuns(cx, cy, r, inside) {
  let s = "";
  for (let dy = -r; dy <= r; dy++) {
    let x0 = null;
    for (let dx = -r; dx <= r + 1; dx++) {
      const on = dx <= r && inside(dx, dy);
      if (on && x0 === null) x0 = dx;
      if (!on && x0 !== null) { s += `<rect x="${cx + x0}" y="${cy + dy}" width="${dx - x0}" height="1"/>`; x0 = null; }
    }
  }
  return s;
}

function drawHero() {
  const el = $("#scene-art");
  if (!el) return;
  const W = 64, H = 34;
  defineSprite("scn-cloud", [".....cc.....", "...cccccc...", "..cccccccc..", "cccccccccccc"]);
  defineSprite("scn-cloud2", ["..cccc..", ".cccccc.", "cccccccc"]);
  let s = "";
  const rect = (x, y, w, h, c) => { s += `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`; };

  [0, 7, 12, 16, 20, 23].forEach((y, i) => rect(0, y, W, H - y, "sk" + (i + 1)));      // cielo en franjas, como en los juegos de 16 bits

  s += `<g class="stars">`;
  STARS.forEach(([x, y, big], i) => {
    s += `<g class="tw" style="animation-delay:${(-((i * 13) % 9) / 3).toFixed(1)}s"><rect x="${x}" y="${y}" width="1" height="1"/>`;
    if (big) s += `<rect x="${x - 1}" y="${y}" width="3" height="1"/><rect x="${x}" y="${y - 1}" width="1" height="3"/>`;
    s += `</g>`;
  });
  s += `</g>`;

  s += `<g class="moon">${discRuns(40, 6, 4, (dx, dy) => dx * dx + dy * dy <= 17 && !((dx - 2) ** 2 + (dy + 1) ** 2 <= 13))}</g>`;
  const rays = [[0, -5], [0, 5], [-5, 0], [5, 0], [-4, -4], [4, -4], [-4, 4], [4, 4]].map(([dx, dy]) => `<rect x="${40 + dx}" y="${6 + dy}" width="1" height="1"/>`).join("");
  s += `<g class="sun">${discRuns(40, 6, 3, (dx, dy) => dx * dx + dy * dy <= 10)}${rays}</g>`;

  s += `<g class="clouds">`;
  [["scn-cloud", 12, 4, 5, 100, 20, 6], ["scn-cloud", 12, 4, 11, 150, 90, 30], ["scn-cloud2", 8, 3, 2, 70, 45, 40]].forEach(([id, w, h, y, dur, delay, x0]) => {
    s += `<g class="cl" style="--x0:${x0}px;animation-duration:${dur}s;animation-delay:-${delay}s"><use href="#${id}" y="${y}" width="${w}" height="${h}"/></g>`;
  });
  s += `</g>`;

  const run = (fn, cls, full) => {
    let x = 0;
    while (x < W) { const y = fn(x); let x2 = x + 1; while (x2 < W && fn(x2) === y) x2++; rect(x, y, x2 - x, full ? H - y : 1, cls); x = x2; }
  };
  const back = x => Math.round(19 + 3.5 * Math.sin(x / 7 + .6) + 1.4 * Math.sin(x / 2.6));
  const gy = x => 27 - Math.round(Math.max(0, Math.abs(x - 46) - 9) * .2);
  run(back, "hb", true);
  run(gy, "hf", true);
  run(gy, "gr", false);
  for (let x = 1; x < W; x++) if ((x * 5) % 7 === 0 && (x < 36 || x > 55)) rect(x, gy(x) - 1, 1, 1, "gr");
  [[8, "fp"], [12, "fy"], [31, "fy"], [34, "fp"], [58, "fp"], [61, "fy"]].forEach(([x, c]) => rect(x, gy(x) - 1, 1, 1, c));

  s += `<use href="#spr-sheep" x="37" y="16" width="18" height="11"/><g id="scene-hat"></g>`;
  el.innerHTML = s;
  drawHeroHat();
}

function drawHeroHat() {
  const g = $("#scene-hat");
  if (!g) return;
  const h = hatFor(getSeason());
  g.innerHTML = h ? `<use href="#${h.id}" x="${h.scene[0]}" y="${h.scene[1]}" width="${h.rows[0].length}" height="${h.rows.length}" style="--h:${h.hue}"/>` : "";
}

/* =====================================================================
   4. Burbujas, pestaña oculta y arranque
   ===================================================================== */

function buildBubbles() {
  if (reducedMotion() || $(".bub")) return;
  document.body.insertAdjacentHTML("beforeend", Array.from({ length: 12 }, (_, i) =>
    `<i class="bub" style="left:${(i * 83 + 11) % 97}%;--d:${22 + (i * 7) % 19}s;--dl:-${(i * 5) % 20}s">${icon("spr-ring", 2 + (i % 3))}</i>`).join(""));
}

let season = getSeason();

/** Al volver a la pestaña (o pasar la medianoche) se recalcula la temporada. */
function refreshSeason() {
  const now = getSeason();
  if (now === season) return;
  season = now;
  drawHeroHat();
  applyBg();
  emit("kx:season", { season });
}

export function init() {
  drawHero();
  buildBubbles();
  applyBg();

  state.subscribe("theme", applyBg);
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(applyBg, 200); });

  root.classList.toggle("tab-hidden", document.hidden);
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("tab-hidden", document.hidden);
    if (!document.hidden) refreshSeason();
  });

  window.KXB = { label: bgLabel, next: nextBg };
}
