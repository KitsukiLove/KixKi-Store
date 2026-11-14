/*
  Simulación física del balón, anotación, rebotes y fin del tiro y de la partida.
*/

import { $ } from "../../core/util.js";
import {
  memoria,
  beep,
  BOARD,
  FAR_X,
  FLOOR,
  GRAVEDAD,
  segunIdioma,
  RADIO_PELOTA,
  RIM,
  RADIO_ARO,
  save,
  SHOTS,
  TEXTOS,
  ANCHO,
  WIN_PTS,
} from "./config.js";
import { hideDots, newShot, show, stat } from "./dibujo.js";
import { game, viva } from "./estado.js";
import { bkSay, pop } from "./frases.js";
import { puente } from "./puente.js";
/* ---------- física ---------- */
function stepPhys(h) {
  const prevY = game.y;
  game.vy += GRAVEDAD * h;
  game.x += game.vx * h;
  game.y += game.vy * h;
  game.ang += game.spin * h;
  /* paredes y techo */
  if (game.x < RADIO_PELOTA) {
    game.x = RADIO_PELOTA;
    game.vx = Math.abs(game.vx) * 0.6;
  }
  if (game.x > ANCHO - RADIO_PELOTA) {
    game.x = ANCHO - RADIO_PELOTA;
    game.vx = -Math.abs(game.vx) * 0.6;
  }
  if (game.y < RADIO_PELOTA) {
    game.y = RADIO_PELOTA;
    game.vy = Math.abs(game.vy) * 0.5;
  }
  /* tablero */
  if (
    game.x + RADIO_PELOTA > BOARD.x &&
    game.y > BOARD.y1 - RADIO_PELOTA * 0.4 &&
    game.y < BOARD.y2
  ) {
    game.x = BOARD.x - RADIO_PELOTA;
    game.vx = -Math.abs(game.vx) * 0.55;
    game.touched = true;
    beep(220, 0.05);
  }
  /* borde delantero del aro (un punto pequeño) */
  const dx = game.x - RIM.x1,
    dy = game.y - RIM.y,
    d = Math.hypot(dx, dy),
    mn = RADIO_PELOTA + RADIO_ARO;
  if (d < mn && d > 0.001) {
    const nx = dx / d,
      ny = dy / d,
      vn = game.vx * nx + game.vy * ny;
    game.x = RIM.x1 + nx * mn;
    game.y = RIM.y + ny * mn;
    if (vn < 0) {
      game.vx -= 1.55 * vn * nx;
      game.vy -= 1.55 * vn * ny;
      game.spin *= 0.7;
    }
    if (!game.touched || vn < -80) beep(260, 0.05);
    game.touched = true;
  }
  /* ¡canasta! baja cruzando el aro por dentro */
  if (
    !game.scored &&
    game.vy > 0 &&
    prevY < RIM.y &&
    game.y >= RIM.y &&
    game.x > RIM.x1 + 3 &&
    game.x < RIM.x2
  ) {
    scored();
  }
  /* la red frena un poco */
  if (game.scored && game.y > RIM.y && game.y < RIM.y + 34 && game.x > RIM.x1 && game.x < RIM.x2) {
    game.vx *= 1 - 4 * h;
    game.vy *= 1 - 2.2 * h;
  }
  /* suelo */
  const fy = FLOOR - RADIO_PELOTA - 2;
  if (game.y > fy) {
    game.y = fy;
    if (game.vy > 140) {
      game.vy = -game.vy * 0.48;
      game.vx *= 0.82;
      game.spin *= 0.6;
      beep(150, 0.05);
    } else {
      game.vy = 0;
      game.vx *= Math.max(0, 1 - 5 * h);
      game.spin *= Math.max(0, 1 - 6 * h);
    }
  }
}

export function scored() {
  game.scored = true;
  const far = game.x0 < FAR_X,
    clean = !game.touched,
    pts = (far ? 3 : 2) + (clean ? 1 : 0);
  game.pts += pts;
  memoria.hoops++;
  if (game.pts > memoria.best) memoria.best = game.pts;
  save();
  stat();
  pop("+" + pts + (clean ? " " + segunIdioma(TEXTOS.clean) : ""));
  $("#bk-net").classList.remove("sw");
  void $("#bk-net").offsetWidth;
  $("#bk-net").classList.add("sw");
  beep(660, 0.09);
  setTimeout(() => beep(880, 0.12), 110);
  /* Kixki responde: siempre que Kitsuki pagará */
  game.streak++;
  if (game.streak >= 2) bkSay("streak", { n: game.streak }, 4600);
  else bkSay("score", null, 4600);
  try {
    if (window.KXK) KXK.emit("hoop", { pts, n: memoria.hoops, clean, streak: game.streak });
  } catch (e) {
    // El logro es opcional: si Kixki no está lista, no se cuenta.
  }
}

export function loop(t) {
  if (!viva.open) return;
  viva.raf = requestAnimationFrame(loop);
  if (document.hidden) {
    viva.st = t;
    return;
  }
  const dt = Math.min(0.034, (t - (viva.st || t)) / 1000 || 0);
  viva.st = t;
  if (game.state === "fly") {
    const n = 3,
      h = dt / n;
    for (let i = 0; i < n; i++) stepPhys(h);
    game.fly += dt;
    const resting =
      game.y >= FLOOR - RADIO_PELOTA - 2 - 0.5 && Math.abs(game.vx) < 12 && Math.abs(game.vy) < 20;
    game.restT = resting ? game.restT + dt : 0;
    if (game.restT > 0.7 || game.fly > 8) endShot();
    show();
  }
}

/* ---------- partida: 5 tiros ---------- */
function endShot() {
  if (!game.scored) {
    game.streak = 0;
    bkSay("miss", null, 3600);
  }
  if (game.taken >= SHOTS) {
    endMatch();
    return;
  }
  newShot();
  /* el último tiro: avisa un momento después, para no pisar la frase del fallo o la canasta */
  if (game.taken === SHOTS - 1) {
    clearTimeout(viva.lastT);
    viva.lastT = setTimeout(() => {
      if (viva.open && game.state === "ready") bkSay("last", null, 3600);
    }, 1700);
  }
}

function endMatch() {
  game.state = "over";
  hideDots();
  show();
  const win = game.pts >= WIN_PTS;
  memoria.matches = (memoria.matches | 0) + 1;
  if (win) memoria.wins = (memoria.wins | 0) + 1;
  save();
  bkSay(win ? "win" : "lose", { p: game.pts }, 4600);
  try {
    if (window.KXK) KXK.emit("match", { pts: game.pts, win });
  } catch (e) {
    // El logro es opcional: si Kixki no está lista, no se cuenta.
  }
  clearTimeout(viva.matchT);
  viva.matchT = setTimeout(() => {
    if (viva.open) puente.startMatch(true);
  }, 5000);
}
