/*
  Cuándo empieza el combate (condiciones, aviso previo) y arranque de la partida.
*/

import { $, clamp, now, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { memoria, CFG, segunIdioma, save } from "./config.js";
import { cowFriend, cowWin, kx, pickPair, viva } from "./estado.js";
import { buildHud, hpView, infView, sr } from "./hud.js";
import { puente } from "./puente.js";
import { moo } from "./sonido.js";
import { TEXTOS } from "./textos.js";
import { buildCow, cowSay, shatter } from "./vaca.js";
/* ---------- empezar ---------- */
function eligible() {
  return (
    cowFriend() &&
    !memoria.won &&
    now() >= memoria.next &&
    viva.KK.ready &&
    viva.S.on &&
    !viva.K.off &&
    !document.hidden &&
    !viva.F &&
    !viva.pend &&
    !$("#game:not([hidden])") &&
    !$("#bask:not([hidden])") &&
    !(window.KXK3 && KXK3.held)
  );
}

export function tick() {
  if (viva.F || viva.pend || document.hidden) return;
  const v = cowWin();
  if (!v) {
    viva.dw = 0;
    viva.seen = false;
    return;
  }
  if (!viva.seen) {
    viva.seen = true;
    viva.dw = 0;
    viva.goal = rnd(CFG.dwellMin, CFG.dwellMax);
  }
  if (!eligible()) return;
  viva.dw += 1000;
  if (viva.dw >= viva.goal) warn(v);
}

function warn(v) {
  viva.pend = true;
  v.classList.add("kv-sus");
  kx(TEXTOS.warn, { key: "warn", cd: 0 });
  moo();
  setTimeout(
    () => {
      viva.pend = false;
      if (!cowWin() || !eligible()) {
        const w = cowWin();
        if (w) w.classList.remove("kv-sus");
        viva.dw = 0;
        viva.seen = false;
        return;
      }
      start({ v: cowWin() });
    },
    RM() ? 2500 : CFG.warn
  );
}

export function start(o) {
  o = o || {};
  if (viva.F) return false;
  if (!viva.KK || !viva.KK.ready || !viva.S.on) return false;
  if (!o.force && !eligible() && !viva.pend && !o.v) return false;
  buildHud();
  const v = o.v || cowWin();
  const r = v
    ? v.getBoundingClientRect()
    : {
        left: innerWidth / 2 - 140,
        top: Math.max(80, innerHeight / 3 - 60),
        width: 280,
        height: 330,
      };
  memoria.tries++;
  memoria.next = now() + CFG.cooldown;
  save();
  viva.F = {
    t0: now(),
    last: performance.now(),
    raf: 0,
    over: false,
    cow: null,
    inf: new Set(),
    creep: 0,
    time: 0,
    hits: 0,
    backs: 0,
    throws: 0,
    cures: 0,
    mile: {},
    wasFly: false,
    flyThrown: false,
    hitThis: false,
    remoteT: 0,
    offT: 0,
    stillWas: viva.K.still,
    hintDone: false,
    hintT: 0,
    pLast: 0,
  };
  const c = (viva.F.cow = {
    x: clamp(r.left + r.width / 2, 60, innerWidth - 60),
    y: clamp(r.top + r.height * 0.78, 170, innerHeight - 8),
    vx: 0,
    mvx: 0,
    dir: 1,
    hp: CFG.hp,
    st: "emerge",
    timer: RM() ? 0.4 : 1.1,
    tgt: null,
    teleT: rnd(CFG.tele[0], CFG.tele[1]),
    invul: 0,
    rage: false,
    hop: 0,
    munch: 0,
    bob: 0,
  });
  viva.K.still = true;
  if (viva.KK.el) viva.KK.el.classList.add("kv-top");
  /* la ventana se rompe en pedazos (sin despedida: kixki2.js mira KXV.busy()) */
  if (!RM()) shatter(r);
  if (v) {
    v.remove();
  }
  document.querySelectorAll(".vp.cow").forEach((x) => x.remove());
  buildCow(c.x, c.y);
  viva.hud.hidden = false;
  hpView();
  infView();
  moo();
  cowSay(pickPair(TEXTOS.cowBetray, "betray"));
  try {
    viva.KK.interrupt();
  } catch (e) {
    // Adorno opcional: su fallo no debe romper lo demás.
  }
  setTimeout(() => {
    if (viva.F) viva.KK.relocate && viva.KK.relocate();
  }, 120);
  setTimeout(() => {
    if (viva.F && !viva.F.over) kx(TEXTOS.start, { key: "start", cd: 0 });
  }, 650);
  sr(segunIdioma(TEXTOS.srStart));
  viva.F.raf = requestAnimationFrame(puente.frame);
  return true;
}
