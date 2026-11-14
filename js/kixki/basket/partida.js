/*
  Inicio del partido, saltar la animación y aparición de Kixki en la cancha.
*/

import { FLOOR } from "./config.js";
import { newShot, show, stat } from "./dibujo.js";
import { game, viva } from "./estado.js";
import { bkSay } from "./frases.js";
import { puente } from "./puente.js";
function startMatch(talkIt) {
  Object.assign(game, { pts: 0, taken: 0, streak: 0, shot: 1 });
  newShot();
  stat();
  if (talkIt) bkSay("start", null, 4200);
}

/* ---------- entrada: Kixki se cae dentro de la ventana (kixki.js → KXK.enter) ---------- */
/* dónde caen sus pies, en pantalla: el suelo de la cancha bajo el punto de salida del tiro (se calcula en vivo) */
export function feet() {
  if (!viva.court || viva.box.hidden) return null;
  const r = viva.court.getBoundingClientRect();
  return { x: r.left + game.x0 * viva.scale, y: r.top + (game.y + 15) * viva.scale };
}

/* un clic o una tecla saltan la animación (Esc cierra la ventana, Tab y los modificadores no cuentan; la ✕ tampoco) */
function skipEv(e) {
  if (game.state !== "enter" || !window.KXK) return;
  if (e.type === "keydown" && /^(Escape|Tab|Shift|Control|Alt|Meta|CapsLock)$/.test(e.key)) return;
  if (e.type === "pointerdown" && e.target && e.target.closest && e.target.closest("#bk-x")) return;
  if (e.type === "pointerdown") {
    e.stopPropagation();
    e.preventDefault();
  } /* el clic que salta la animación no debe agarrar a Kixki ni lanzar un tiro */
  KXK.skipEnter();
}

export function hookSkip(on) {
  if (on === viva.skipOn) return;
  viva.skipOn = on;
  const f = on ? addEventListener : removeEventListener;
  f.call(window, "pointerdown", skipEv, true);
  f.call(window, "keydown", skipEv, true);
}

function poof() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  for (let k = 0; k < 5; k++) {
    const d = document.createElement("i");
    d.className = "bk-poof";
    d.style.cssText = `left:${Math.round(game.x0 + (k - 2) * 7)}px;top:${FLOOR - 18}px;--px:${(k - 2) * 9}px`;
    viva.court.append(d);
    setTimeout(() => d.remove(), 560);
  }
}

export function reveal() {
  hookSkip(false);
  if (!viva.open || game.state !== "enter") return;
  game.state = "ready";
  show();
  viva.spr.classList.remove("in");
  void viva.spr.offsetWidth;
  viva.spr.classList.add("in");
  poof();
  bkSay("start", null, 4400);
}

puente.startMatch = startMatch;
