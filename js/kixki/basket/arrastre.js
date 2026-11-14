/*
  Apuntar con el dedo o el ratón (arrastrar hacia atrás) y soltar el tiro.
*/

import { clamp } from "../../core/util.js";
import { memoria, beep, FLOOR, GRAVEDAD, RADIO_PELOTA, save, ANCHO } from "./config.js";
import { hideDots, show, stat } from "./dibujo.js";
import { dots, game, viva } from "./estado.js";
import { bkSay } from "./frases.js";
import { puente } from "./puente.js";

const MAXPULL = 125;

const POWER = 5.6;

function puntoDelEvento(e) {
  const r = viva.court.getBoundingClientRect();
  return { x: (e.clientX - r.left) / viva.scale, y: (e.clientY - r.top) / viva.scale };
}

function velOf(p) {
  let dx = game.x0 - p.x,
    dy = FLOOR - RADIO_PELOTA - 2 - p.y;
  const m = Math.hypot(dx, dy);
  if (m > MAXPULL) {
    dx *= MAXPULL / m;
    dy *= MAXPULL / m;
  }
  return { vx: dx * POWER, vy: dy * POWER, m: Math.min(m, MAXPULL) };
}

function down(e) {
  if (game.state !== "ready" || e.button) return;
  try {
    viva.court.setPointerCapture(e.pointerId);
  } catch (_) {
    // El puntero ya se soltó: sin captura el gesto simplemente termina.
  }
  game.pull = { id: e.pointerId };
  move(e);
  e.preventDefault();
}

function move(e) {
  if (!game.pull || e.pointerId !== game.pull.id) return;
  const v = velOf(puntoDelEvento(e));
  game.pull.v = v;
  game.ang = clamp(-v.vy / 900, -0.5, 0.5); /* se inclina un poco al estirarse */
  /* trayectoria: los primeros ~1 s de vuelo */
  dots.forEach((d, i) => {
    const t = (i + 1) * 0.075,
      x = game.x0 + v.vx * t,
      y = FLOOR - RADIO_PELOTA - 2 + v.vy * t + 0.5 * GRAVEDAD * t * t;
    if (v.m < 12 || y > FLOOR || x > ANCHO) {
      d.hidden = true;
      return;
    }
    d.hidden = false;
    d.style.transform = `translate(${Math.round(x - 2)}px,${Math.round(y - 2)}px)`;
  });
  show();
}

function soltar(e) {
  const p = game.pull;
  if (!p || e.pointerId !== p.id) return;
  game.pull = null;
  hideDots();
  const v = p.v;
  if (!v || v.m < 14) {
    game.ang = 0;
    show();
    return;
  } /* un tironcito pequeño no lanza */
  game.vx = v.vx;
  game.vy = v.vy;
  game.spin = v.vx > 0 ? 5 : -5;
  beginFlight();
  beep(300, 0.08);
}

/* un tiro sale (de verdad o simulado): cuenta, y Kixki protesta en el aire */
export function beginFlight() {
  game.state = "fly";
  game.fly = 0;
  game.restT = 0;
  game.scored = false;
  game.taken++;
  memoria.shots++;
  save();
  stat();
  clearTimeout(viva.lastT);
  bkSay("throw", null, 2800);
}

puente.down = down;

puente.move = move;

puente.up = soltar;

export function iniciar() {
  /* ---------- entrada: resortera ---------- */
}
