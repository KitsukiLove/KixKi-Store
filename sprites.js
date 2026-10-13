/**
 * sprites.js — Hoja de sprites SVG de Kixki Store.
 *
 * Los dibujos pixel-art viven UNA sola vez en index.html, dentro de
 *   <svg id="sprites"><defs><symbol id="ico-tiendas">…</symbol> …</defs></svg>
 * y cada uso en la página es solo:
 *   <svg class="spr" width="24" height="24"><use href="#ico-tiendas"/></svg>
 * → 2 nodos en el DOM en lugar de una decena de <rect> por icono.
 *
 * Colores: las clases .c-h, .c-s, .c-l, .c-x… (styles.css) se aplican DENTRO del
 * <symbol>; el color de cada instancia llega por herencia (--h del contenedor y
 * `color` para .c-x). Por eso las reglas deben ser `.c-h{…}` y NO `.spr .c-h{…}`:
 * el <symbol> no está dentro de .spr. (Tu styles.css ya las tiene así.)
 *
 * API
 *   icon(id, scale, cls)   → string HTML, para plantillas
 *   iconEl(id, scale, cls) → SVGElement, para construir DOM a mano
 *   retarget(svg, id)      → cambia el dibujo de un icono ya pintado (p. ej. máx ↔ restaurar)
 *   defineSprite(id, rows) → registra un sprite nuevo desde una cuadrícula de letras
 *   hydrate(root)          → pinta los iconos de los elementos estáticos de index.html
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/** Tamaño (ancho × alto en píxeles de cuadrícula) de cada <symbol> de index.html. */
const SIZES = new Map(Object.entries({
  "ico-tiendas": [12, 12], "ico-importante": [12, 12], "ico-utilidad": [12, 12],
  "ico-decoracion": [12, 12], "ico-musica": [12, 12], "ico-teclados": [12, 12],
  "ico-star": [12, 12], "ico-new": [12, 12], "ico-box": [12, 12], "ico-star-mono": [12, 12],
  "ico-home": [8, 8], "ico-dots": [8, 2],
  "ui-ext": [7, 5], "ui-play": [5, 7], "ui-copy": [9, 9], "ui-search": [8, 8],
  "ui-moon": [7, 7], "ui-sun": [7, 7], "ui-min": [8, 8], "ui-max": [8, 8],
  "ui-restore": [8, 8], "ui-bang": [4, 7], "ui-heart": [7, 7], "ui-note": [7, 7], "ui-land": [8, 7],
  "spr-sheep": [18, 11], "spr-sheep-sleep": [18, 9], "spr-zz": [5, 5], "spr-ring": [5, 5],
}));

/** Tamaño de un sprite: tabla conocida o, si es nuevo, su viewBox leído del DOM. */
export function sizeOf(id) {
  const known = SIZES.get(id);
  if (known) return known;
  const vb = document.getElementById(id)?.viewBox?.baseVal;
  if (vb && vb.width) { SIZES.set(id, [vb.width, vb.height]); return SIZES.get(id); }
  return [12, 12];
}

/** <svg class="spr"><use href="#id"/></svg> como texto. `scale` = píxeles de pantalla por píxel de dibujo. */
export function icon(id, scale = 2, cls = "") {
  const [w, h] = sizeOf(id);
  return `<svg class="spr${cls ? " " + cls : ""}" width="${w * scale}" height="${h * scale}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
}

/** Igual que icon(), pero devuelve el elemento. */
export function iconEl(id, scale = 2, cls = "") {
  const [w, h] = sizeOf(id);
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", cls ? `spr ${cls}` : "spr");
  svg.setAttribute("width", w * scale);
  svg.setAttribute("height", h * scale);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const use = document.createElementNS(SVG_NS, "use");
  use.setAttribute("href", `#${id}`);
  svg.append(use);
  return svg;
}

/** Cambia el dibujo de un icono ya pintado (los dos símbolos deben tener la misma cuadrícula). */
export function retarget(svg, id) {
  svg?.querySelector("use")?.setAttribute("href", `#${id}`);
}

/**
 * Registra un sprite nuevo en la hoja a partir de filas de letras
 * (h, s, l, x, y, p, m, w… = clases .c-*; el punto es vacío).
 * Une píxeles contiguos del mismo color en un solo <rect>.
 */
export function defineSprite(id, rows) {
  if (document.getElementById(id)) return id;
  const w = Math.max(...rows.map(r => r.length));
  let rects = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === ".") { x++; continue; }
      let x2 = x + 1;
      while (x2 < row.length && row[x2] === ch) x2++;
      rects += `<rect class="c-${ch}" x="${x}" y="${y}" width="${x2 - x}" height="1"/>`;
      x = x2;
    }
  });
  const sym = document.createElementNS(SVG_NS, "symbol");
  sym.id = id;
  sym.setAttribute("viewBox", `0 0 ${w} ${rows.length}`);
  sym.setAttribute("shape-rendering", "crispEdges");
  sym.innerHTML = rects;
  document.querySelector("#sprites defs")?.append(sym);
  SIZES.set(id, [w, rows.length]);
  return id;
}

/**
 * Elementos estáticos de index.html que reciben iconos al arrancar.
 * [selector, [[sprite, escala, clase]…], dónde insertar]
 */
const STATIC = [
  ["#searchbox", [["ui-search", 2]]],
  ["#heart", [["ui-heart", 2]]],
  ["#tg", [["ui-moon", 3, "ic-moon"], ["ui-sun", 3, "ic-sun"]]],
  ["#tm", [["ui-note", 3]]],
  ["#tb", [["ui-land", 3]]],
];

/** Pinta los iconos estáticos (idempotente) y los marcados con data-spr="ui-heart:2". */
export function hydrate(root = document) {
  for (const [sel, list] of STATIC) {
    const el = root.querySelector(sel);
    if (el && !el.querySelector(":scope > .spr")) {
      el.insertAdjacentHTML("afterbegin", list.map(([id, s, c]) => icon(id, s, c)).join(""));
    }
  }
  root.querySelectorAll("[data-spr]").forEach(el => {
    if (el.querySelector(":scope > .spr")) return;
    const [id, s] = el.dataset.spr.split(":");
    el.insertAdjacentHTML("afterbegin", icon(id, +s || 2));
  });
}

export const api = { icon, iconEl, retarget, defineSprite, hydrate, sizeOf };

/** main.js llama a init(ctx) en orden: sprites → render → windows. */
export function init() {
  hydrate();
  window.KX = Object.assign(window.KX || {}, { sprites: api });
}
