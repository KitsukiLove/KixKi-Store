/*
  Bucle del combate: movimiento de la vaca, elección de objetivo, teletransporte e infección.
*/

import { clamp, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { CFG, fmt, segunIdioma, sgn } from "./config.js";
import { icons, kx, pickPair, viva } from "./estado.js";
import { infPct, infView, sr } from "./hud.js";
import { infect } from "./infeccion.js";
import { puente } from "./puente.js";
import { pip } from "./sonido.js";
import { TEXTOS } from "./textos.js";
import { cowSay, place, poof } from "./vaca.js";

const visible = (r) =>
  r.width > 0 &&
  r.height > 0 &&
  r.bottom > 70 &&
  r.top < innerHeight - 30 &&
  r.right > 0 &&
  r.left < innerWidth;

function pickTarget() {
  const c = viva.F.cow,
    free = icons().filter((d) => !viva.F.inf.has(d));
  if (!free.length) return null;
  let best = null,
    bd = 1e9;
  for (const d of free) {
    const r = d.getBoundingClientRect();
    if (!visible(r)) continue;
    const x = r.left + r.width / 2,
      y = clamp(r.bottom + 4, 170, innerHeight - 8),
      dd = Math.hypot(x - c.x, y - c.y) + rnd(0, 70);
    if (dd < bd) {
      bd = dd;
      best = d;
    }
  }
  return best;
}

function aim(c, tx, ty, dt, sp) {
  const dx = tx - c.x,
    dy = ty - c.y,
    d = Math.hypot(dx, dy);
  if (d < 7) return true;
  const s = Math.min(d, sp * dt);
  c.x += (dx / d) * s;
  c.y += (dy / d) * s;
  if (Math.abs(dx) > 5) c.dir = sgn(dx);
  return false;
}

function frame(t) {
  if (!viva.F) return;
  viva.F.raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (t - viva.F.last) / 1000);
  viva.F.last = t;
  if (document.hidden) return;
  if (!viva.KK.ready || !viva.S.on) {
    if (!viva.F.offT) viva.F.offT = t;
    if (t - viva.F.offT > 2500) puente.abort("off");
    return;
  }
  viva.F.offT = 0;
  if (viva.K.off) return; /* ventana grande u otra pantalla encima: el combate espera */
  if (viva.F.over) {
    return;
  }
  viva.F.time += dt;
  const c = viva.F.cow,
    px = c.x;
  c.invul = Math.max(0, c.invul - dt);
  viva.F.creep = Math.min(CFG.creepMax, viva.F.creep + CFG.creep * dt);
  /* carpetas que ya no existen (se volvió a dibujar el escritorio) */
  for (const d of [...viva.F.inf]) if (!d.isConnected) viva.F.inf.delete(d);
  const speed = c.rage ? CFG.speedRage : CFG.speed;
  switch (c.st) {
    case "emerge":
      c.timer -= dt;
      if (c.timer <= 0) {
        c.st = "pick";
        viva.cowEl.classList.remove("emerge");
      }
      break;
    case "pick": {
      const d = pickTarget();
      if (d) {
        c.tgt = d;
        c.st = "move";
        break;
      }
      if (!icons().some((x) => !viva.F.inf.has(x))) {
        puente.endLose();
        return;
      }
      /* hay carpetas libres pero fuera de la pantalla: pasea y el contagio avanza solo */
      c.st = "wander";
      c.wx = rnd(80, innerWidth - 80);
      c.wy = rnd(200, innerHeight - 30);
      viva.F.remoteT = 0;
      break;
    }
    case "wander": {
      aim(c, c.wx, c.wy, dt, speed * 0.8);
      viva.F.remoteT += dt;
      if (viva.F.remoteT > 2.6) {
        const free = icons().filter((d) => !viva.F.inf.has(d));
        if (free.length) {
          infect(free[0], false);
        }
        viva.F.remoteT = 0;
      }
      if (Math.hypot(c.wx - c.x, c.wy - c.y) < 8) {
        c.wx = rnd(80, innerWidth - 80);
        c.wy = rnd(200, innerHeight - 30);
      }
      if (pickTarget()) c.st = "pick";
      break;
    }
    case "move": {
      const d = c.tgt;
      if (!d || !d.isConnected || viva.F.inf.has(d)) {
        c.st = "pick";
        break;
      }
      const r = d.getBoundingClientRect();
      if (!visible(r)) {
        c.st = "pick";
        break;
      }
      const tx = r.left + r.width / 2,
        ty = clamp(r.bottom + 4, 170, innerHeight - 8);
      c.hop += dt * (c.rage ? 12 : 9);
      if (aim(c, tx, ty, dt, speed)) {
        c.st = "munch";
        c.munch = CFG.munch;
        viva.cowEl.classList.add("munch");
        if (Math.random() < 0.5) cowSay(pickPair(TEXTOS.cowMunch, "munch"));
      }
      c.teleT -= dt;
      if (c.teleT <= 0) teleport(c);
      break;
    }
    case "munch": {
      c.munch -= dt;
      if (c.munch <= 0) {
        viva.cowEl.classList.remove("munch");
        const d = c.tgt;
        if (d && d.isConnected) infect(d);
        c.tgt = null;
        c.st = "pause";
        c.timer = c.rage ? 0.15 : 0.35;
      }
      break;
    }
    case "pause":
      c.timer -= dt;
      if (c.timer <= 0) c.st = "pick";
      break;
    case "stun":
      c.timer -= dt;
      c.x += c.kvx * dt;
      c.kvx *= 1 - 4 * dt;
      if (c.timer <= 0) {
        viva.cowEl.classList.remove("stun");
        c.st = "pick";
      }
      break;
    case "tele":
      c.timer -= dt;
      if (c.timer <= 0) {
        if (c.tphase === 1) {
          c.x = c.nx;
          c.y = c.ny;
          c.tphase = 2;
          c.timer = RM() ? 0.05 : 0.22;
          viva.cowEl.classList.remove("tp-out");
          viva.cowEl.classList.add("tp-in");
          poof(c.x, c.y - 30);
        } else {
          viva.cowEl.classList.remove("tp-in");
          c.st = "pick";
        }
      }
      break;
  }
  c.x = clamp(c.x, 50, innerWidth - 50);
  c.y = clamp(c.y, 160, innerHeight - 6);
  c.mvx = dt > 0 ? ((c.x - px) / dt) * 0.5 + c.mvx * 0.5 : 0;
  c.bob = RM() || (c.st !== "move" && c.st !== "wander") ? 0 : Math.abs(Math.sin(c.hop)) * 14;
  place(c.x, c.y, c.dir, c.bob);

  /* --- Kixki volando: ¿le da a la vaca? --- */
  const fly = window.KXK3 && KXK3.flight ? KXK3.flight() : null;
  const flying = !!(window.KXK3 && KXK3.flying);
  if (flying && !viva.F.wasFly) {
    viva.F.wasFly = true;
    viva.F.flyThrown = false;
    viva.F.hitThis = false;
  }
  if (fly) viva.F.flyThrown = true;
  if (!flying && viva.F.wasFly) {
    viva.F.wasFly = false;
    if (viva.F.flyThrown && !viva.F.hitThis) {
      sr(segunIdioma(TEXTOS.srMiss));
      if (Math.random() < 0.7)
        kx(TEXTOS.miss, { key: "miss", cd: 4000, replace: false, ttl: 2600 });
    }
  }
  if (
    fly &&
    c.invul <= 0 &&
    c.st !== "emerge" &&
    c.st !== "dying" &&
    Math.hypot(fly.vx, fly.vy) >= CFG.minSpeed
  ) {
    const kxp = viva.K.x,
      kyp = viva.K.y - 20,
      bx0 = c.x - 44,
      bx1 = c.x + 44,
      by0 = c.y - 98,
      by1 = c.y;
    const nx = clamp(kxp, bx0, bx1),
      ny = clamp(kyp, by0, by1);
    if (Math.hypot(kxp - nx, kyp - ny) < 22) {
      viva.F.hitThis = true;
      puente.onHit(c);
    }
  }
  /* --- pista si todavía no ha lanzado a Kixki --- */
  if (
    !viva.F.hintDone &&
    viva.F.time > CFG.hint &&
    viva.F.throws === 0 &&
    !viva.F.wasFly &&
    !(window.KXK3 && KXK3.held)
  ) {
    viva.F.hintDone = true;
    kx(TEXTOS.hint, { key: "hint", cd: 0, replace: false });
  }
  if (!viva.F.hintDone && window.KXK3 && (KXK3.held || viva.F.wasFly)) viva.F.hintDone = true;
  if (flying && viva.F.wasFly && !viva.F.counted) {
    viva.F.counted = true;
    viva.F.throws++;
  }
  if (!flying) viva.F.counted = false;
  /* --- infección: avisos y derrota --- */
  const p = infPct();
  if (p !== viva.F.pLast) {
    viva.F.pLast = p;
    infView();
  }
  for (const [m, key, list] of [
    [40, "i40", TEXTOS.inf40],
    [70, "i70", TEXTOS.inf70],
    [90, "i90", TEXTOS.inf90],
  ]) {
    if (p >= m && !viva.F.mile[key]) {
      viva.F.mile[key] = 1;
      kx(list, { key, cd: 0, replace: false, ttl: 2800 });
      sr(fmt(segunIdioma(TEXTOS.srInf), { p, n: viva.F.inf.size, t: icons().length }));
    }
  }
  if (p >= 100) puente.endLose();
}

function teleport(c) {
  c.teleT = c.rage ? rnd(CFG.teleRage[0], CFG.teleRage[1]) : rnd(CFG.tele[0], CFG.tele[1]);
  const a = rnd(0, 6.283),
    d = rnd(110, 240);
  c.nx = clamp(c.x + Math.cos(a) * d, 60, innerWidth - 60);
  c.ny = clamp(c.y + Math.sin(a) * d * 0.6, 180, innerHeight - 8);
  poof(c.x, c.y - 30);
  pip(300);
  if (RM()) {
    c.x = c.nx;
    c.y = c.ny;
    return;
  }
  c.st = "tele";
  c.tphase = 1;
  c.timer = 0.25;
  viva.cowEl.classList.add("tp-out");
  if (Math.random() < 0.5) cowSay(pickPair(TEXTOS.cowTele, "tele"));
}

puente.frame = frame;

export function iniciar() {
  /* ---------- bucle del combate ---------- */
}
