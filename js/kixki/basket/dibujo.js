/*
  Construye y pinta la cancha: elementos, etiquetas, marcador y puntos guía del tiro.
*/

import { $, rnd } from "../../core/util.js";
import {
  memoria,
  FLOOR,
  ALTO,
  segunIdioma,
  RADIO_PELOTA,
  SHOTS,
  SPAWN_MAX,
  SPAWN_MIN,
  TEXTOS,
  ANCHO,
} from "./config.js";
import { dots, game, viva } from "./estado.js";
import { puente } from "./puente.js";
export function build() {
  if (viva.box) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="bask" class="ovl" hidden><div class="box" role="dialog" aria-modal="true" aria-labelledby="bk-t">
     <div class="bt"><span id="bk-t"></span><button type="button" class="x" data-x="bask" id="bk-x">✕</button></div>
     <div class="bk-hud"><span><small data-k="pts"></small><b id="bk-p">0</b></span><span><small data-k="best"></small><b id="bk-b">0</b></span><span><small data-k="hoops"></small><b id="bk-h">0</b></span><span><small data-k="shots"></small><b id="bk-s">1/5</b></span></div>
     <div class="bk-wrap" id="bk-wrap"><div class="bk-court" id="bk-court">
        <i class="bk-wall"></i><i class="bk-floor"></i>
        <i class="bk-zone z3"><span data-k="zone3"></span></i><i class="bk-zone z2"><span data-k="zone2"></span></i>
        <i class="bk-pole"></i><i class="bk-board"></i><i class="bk-sq"></i><i class="bk-rim"></i>
        <div class="bk-k" id="bk-k"></div>
        <svg class="bk-net" id="bk-net" viewBox="0 0 54 34" width="54" height="34" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 0L9 33M10 0L16 33M19 0L22 33M27 0V33M35 0L32 33M44 0L38 33M53 0L45 33M3 11H51M6 22H48M9 33H45" fill="none"/></svg>
        <span class="bk-pop" id="bk-pop" aria-hidden="true"></span>
        <div class="bk-say" id="bk-say" hidden><b>Kixki</b><p id="bk-sx"></p></div>
     </div></div>
     <p class="hint" id="bk-hint"></p>
   </div></div>`
  );
  viva.box = $("#bask");
  viva.court = $("#bk-court");
  viva.wrap = $("#bk-wrap");
  viva.spr = $("#bk-k");
  viva.say = $("#bk-say");
  viva.sayTx = $("#bk-sx");
  viva.stats = { p: $("#bk-p"), b: $("#bk-b"), h: $("#bk-h"), s: $("#bk-s") };
  /* puntos de la trayectoria */
  for (let i = 0; i < 14; i++) {
    const d = document.createElement("i");
    d.className = "bk-dot";
    d.hidden = true;
    viva.court.append(d);
    dots.push(d);
  }
  /* los dibujos de Kixki salen de la propia Kixki, así siempre son iguales (bufanda de tu color incluida) */
  const grab = (n) => {
    const s = document.querySelector("#kixki .f-" + n);
    if (!s) return null;
    const c = s.cloneNode(true);
    c.setAttribute("class", "bk-spr");
    c.removeAttribute("style");
    c.setAttribute("width", "40");
    c.setAttribute("height", "30");
    return c;
  };
  viva.sprJ = grab("jump");
  viva.sprH = grab("happy");
  if (viva.sprJ) viva.spr.append(viva.sprJ);
  if (viva.sprH) viva.spr.append(viva.sprH);
  viva.court.addEventListener("pointerdown", puente.down);
  viva.court.addEventListener("pointermove", puente.move);
  viva.court.addEventListener("pointerup", puente.up);
  viva.court.addEventListener("pointercancel", puente.up);
  addEventListener("resize", fit);
  new MutationObserver(() => {
    if (viva.box.hidden && viva.open) puente.closed();
  }).observe(viva.box, { attributes: true, attributeFilter: ["hidden"] });
  labels();
}

export function labels() {
  if (!viva.box) return;
  $("#bk-t").textContent = segunIdioma(TEXTOS.title);
  $("#bk-x").setAttribute("aria-label", segunIdioma(TEXTOS.close));
  viva.box.querySelectorAll("[data-k]").forEach((e) => {
    e.textContent = segunIdioma(TEXTOS[e.dataset.k]);
  });
  $("#bk-hint").textContent = segunIdioma(TEXTOS.hint) + segunIdioma(TEXTOS.hintMatch);
}

export function tabLabel() {
  if (viva.tabEl) {
    viva.tabEl.setAttribute("aria-label", segunIdioma(TEXTOS.tab));
    viva.tabEl.title = segunIdioma(TEXTOS.tab);
  }
}

export function fit() {
  if (!viva.wrap || viva.box.hidden) return;
  /* cabe en el ancho de la ventana y, si el móvil está en horizontal, también en el alto */
  const aw = viva.wrap.parentElement.clientWidth - 20 - 8,
    ah = Math.max(140, innerHeight - (innerHeight < 480 ? 140 : 230));
  viva.scale = Math.min(aw / ANCHO, ah / ALTO, 1.2);
  viva.wrap.style.width = Math.round(ANCHO * viva.scale) + 8 + "px";
  viva.wrap.style.margin = "0 auto";
  viva.court.style.transform = `scale(${viva.scale})`;
  viva.wrap.style.height = Math.round(ALTO * viva.scale) + "px";
}

export function stat() {
  viva.stats.p.textContent = game.pts;
  viva.stats.b.textContent = memoria.best;
  viva.stats.h.textContent = memoria.hoops;
  viva.stats.s.textContent = Math.min(game.shot, SHOTS) + "/" + SHOTS;
}

/* ---------- dibujar ---------- */
export function show() {
  viva.spr.style.transform = `translate(${game.x - 20}px,${game.y - 15}px) rotate(${game.ang}rad)`;
  const air = game.state === "fly",
    hid = game.state === "enter"; /* mientras cae la Kixki de verdad, la de la cancha espera */
  if (viva.sprJ) viva.sprJ.style.display = !hid && air ? "block" : "none";
  if (viva.sprH) viva.sprH.style.display = !hid && !air ? "block" : "none";
}

export function newShot(keepX) {
  if (!keepX) game.x0 = Math.round(rnd(SPAWN_MIN, SPAWN_MAX));
  game.shot = Math.min(game.taken + 1, SHOTS);
  Object.assign(game, {
    state: "ready",
    x: game.x0,
    y: FLOOR - RADIO_PELOTA - 2,
    vx: 0,
    vy: 0,
    ang: 0,
    spin: 0,
    scored: false,
    touched: false,
    restT: 0,
    fly: 0,
    pull: null,
  });
  hideDots();
  show();
}

export function hideDots() {
  dots.forEach((d) => {
    d.hidden = true;
  });
}
