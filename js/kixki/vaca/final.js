/*
  Golpes recibidos, limpieza, abandono y los dos finales (ganar o perder).
*/

import { $$, now, reducirMovimiento as RM, rnd, wait } from "../../core/util.js";
import { memoria, CFG, fmt, segunIdioma, lang, save, sgn } from "./config.js";
import { icons, kx, pickPair, viva } from "./estado.js";
import { hpView, sr } from "./hud.js";
import { cureAll, infect } from "./infeccion.js";
import { puente } from "./puente.js";
import { bonk, moo } from "./sonido.js";
import { TEXTOS } from "./textos.js";
import { cowSay, fx, pixelBurst, stars } from "./vaca.js";
/* ---------- golpe ---------- */
function onHit(c) {
  const from = sgn(viva.K.x - c.x) || -1 /* de qué lado viene Kixki (−1 = izquierda) */,
    near = Math.abs(viva.K.x - c.x) < 12,
    back =
      !near &&
      from === -c.dir; /* la vaca mira al lado contrario de donde viene Kixki = por la espalda */
  const dmg = back ? 2 : 1;
  c.hp = Math.max(0, c.hp - dmg);
  viva.F.hits++;
  if (back) viva.F.backs++;
  memoria.hits++;
  if (back) memoria.backs++;
  save();
  c.invul = CFG.invul;
  c.st = "stun";
  c.timer = back ? CFG.stun * 1.2 : CFG.stun;
  c.kvx = -from * (back ? 280 : 200);
  c.tgt = null;
  viva.cowEl.classList.remove("munch", "tp-out", "tp-in");
  viva.cowEl.classList.add("stun");
  viva.cowEl.classList.remove("hit");
  void viva.cowEl.offsetWidth;
  viva.cowEl.classList.add("hit");
  setTimeout(() => viva.cowEl && viva.cowEl.classList.remove("hit"), 420);
  if (KXK3.bump) KXK3.bump(from * 330, -430);
  bonk();
  stars(c.x, c.y - 60, back ? 9 : 5);
  fx(
    "pop" + (back ? " back" : ""),
    c.x,
    c.y - 118,
    back ? (lang() ? "DOUBLE!" : "¡DOBLE!") : "BONK!"
  );
  hpView();
  sr(fmt(segunIdioma(back ? TEXTOS.srBack : TEXTOS.srHit), { hp: c.hp, max: CFG.hp }));
  if (c.hp <= 0) {
    endWin();
    return;
  }
  cowSay(pickPair(TEXTOS.cowHit, "cowhit"));
  kx(back ? TEXTOS.back : TEXTOS.hit, { key: back ? "back" : "hit", cd: 0 });
  if (!c.rage && c.hp <= 2) {
    c.rage = true;
    viva.cowEl.classList.add("rage");
    moo();
    setTimeout(() => {
      if (viva.F && !viva.F.over) {
        cowSay(pickPair(TEXTOS.cowRage, "rage"));
        kx(TEXTOS.rageK, { key: "rage", cd: 0, replace: false });
      }
    }, 900);
  }
}

/* ---------- final ---------- */
function stopLoop() {
  if (viva.F) cancelAnimationFrame(viva.F.raf);
}

function cleanup() {
  if (!viva.F) return;
  stopLoop();
  const f = viva.F;
  viva.K.still = f.stillWas;
  if (viva.KK.el) viva.KK.el.classList.remove("kv-top");
  if (viva.cowEl) {
    viva.cowEl.remove();
    viva.cowEl = null;
  }
  $$(".kv-clone").forEach((e) => e.remove());
  $$("#desk .di.kv-inf").forEach((d) => d.classList.remove("kv-inf"));
  if (viva.hud) viva.hud.hidden = true;
  viva.F = null;
  viva.pend = false;
  viva.dw = 0;
  viva.seen = false;
}

export function abort(why) {
  if (!viva.F) return;
  memoria.next = now() + 30e3;
  memoria.tries = Math.max(0, memoria.tries - 1);
  save();
  cleanup();
}

export async function endWin() {
  if (!viva.F || viva.F.over) return;
  const f = viva.F;
  f.over = true;
  const c = f.cow;
  c.st = "dying";
  viva.cowEl.classList.add("dying");
  cowSay(pickPair(TEXTOS.cowDie, "die"));
  sr(segunIdioma(TEXTOS.srWin));
  await wait(RM() ? 500 : 1000);
  if (viva.F !== f) return;
  pixelBurst(c.x, c.y - 50);
  moo();
  if (window.KXQ && KXQ.confetti)
    try {
      KXQ.confetti(60);
    } catch (e) {
      // Adorno opcional: su fallo no debe romper lo demás.
    }
  if (viva.cowEl) viva.cowEl.style.visibility = "hidden";
  cureAll(true);
  memoria.won = 1;
  save();
  /* premio: fondo «Colina XP» (si tenías puesto el castigo, se quita primero) */
  if (window.KXB) {
    KXB.unlockXP();
    if (KXB.cursed()) KXB.restore();
    KXB.use("xp");
    puente.syncBgLabel();
  }
  viva.KK.emit("cowboss", { r: "win", hits: f.hits, backs: f.backs });
  const k = viva.K.el || viva.KK.el;
  if (k && !RM()) {
    k.classList.add("kk-cheer");
    setTimeout(() => k.classList.remove("kk-cheer"), 2600);
  }
  kx(TEXTOS.win, { key: "win", cd: 0, ttl: 5200 });
  setTimeout(() => {
    if (viva.F === f) kx(TEXTOS.prize, { key: "prize", cd: 0, replace: false, ttl: 6000 });
  }, 4600);
  setTimeout(() => {
    if (viva.F === f) cleanup();
  }, 9000);
}

export async function endLose() {
  if (!viva.F || viva.F.over) return;
  const f = viva.F;
  f.over = true;
  const c = f.cow;
  c.st = "win";
  viva.cowEl.classList.remove("stun", "munch");
  cowSay(pickPair(TEXTOS.cowWin, "cowwin"));
  moo();
  sr(segunIdioma(TEXTOS.srLose));
  icons().forEach((d) => infect(d, true));
  /* la manada se multiplica un momento */
  if (!RM())
    for (let i = 0; i < 6; i++) {
      const e = document.createElement("img");
      e.className = "kv-clone";
      e.src = "img/vaca/vaca-jefa.gif";
      e.alt = "";
      e.width = 96;
      e.height = 96;
      e.setAttribute("aria-hidden", "true");
      e.style.cssText = `left:${Math.round(rnd(20, innerWidth - 110))}px;top:${Math.round(rnd(120, innerHeight - 130))}px;animation-delay:${Math.round(i * 90)}ms`;
      document.body.append(e);
    }
  await wait(RM() ? 700 : 2600);
  if (viva.F !== f) return;
  if (window.KXB) KXB.curse();
  memoria.lost++;
  save();
  puente.syncBgLabel();
  puente.syncBar();
  viva.KK.emit("cowboss", { r: "lose", tries: memoria.tries });
  $$(".kv-clone").forEach((e) => e.remove());
  cureAll(false);
  if (viva.cowEl) viva.cowEl.style.visibility = "hidden";
  kx(TEXTOS.lose, { key: "lose", cd: 0, ttl: 6500 });
  setTimeout(() => {
    if (viva.F === f) cleanup();
  }, 3500);
}

puente.endLose = endLose;

puente.abort = abort;

puente.onHit = onHit;
