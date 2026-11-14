/*
  Caída con gravedad: rebotes, aplastamiento, aterrizaje y enfado cuando algo sale mal.
*/

import { clamp, now, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { el, EX, formatearPar, H, K, KK, mpk, elegir, S, say, thrownLine } from "./base.js";
import { memoria, save } from "./memoria.js";
import { dustAt, fallback, landing, setTilt, sfx } from "./plataformas.js";
import { puente } from "./puente.js";
import { TEXTOS } from "./textos.js";

const GRAVEDAD = 1900;

export const THROW_V = 850;

const PLACED_H = 140;

const quietMode = () => KK.mode === "quiet";

const fullGap = () => now() - (H.lastFull || 0) > 4500;

/* px/s: a partir de aquí soltarla es «lanzarla» */
export function startFall(o) {
  cancelFall();
  H.held = false;
  K.tour = H;
  K.stage = "air";
  el.classList.add("kk-air");
  el.classList.remove("kk-held");
  EX.setMode("idle");
  const F = (H.fall = {
    vx: o.vx || 0,
    vy: o.vy || 0,
    y0: K.y,
    thrown: !!o.thrown,
    fly: o.fly || null,
    reason: o.reason || "release",
    bounced: false,
    raf: 0,
    imp: 0,
  });
  if (RM()) {
    const b = fallback();
    if (b) settle(b, F);
    else abortAll();
    return;
  }
  let last = performance.now();
  const tick = (t) => {
    if (H.fall !== F) return;
    if (K.off || !S.on) {
      abortAll();
      return;
    }
    if (K.tour !== H) K.tour = H;
    if (K.mode === "hop" || K.mode === "walk") {
      EX.stopMove();
      EX.setMode("idle");
    }
    if (document.hidden) {
      last = t;
      F.raf = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min(0.034, (t - last) / 1000);
    last = t;
    const py = K.y;
    F.vy = Math.min(F.vy + GRAVEDAD * dt, 1900);
    F.vx *= 1 - 0.6 * dt;
    K.x += F.vx * dt;
    K.y += F.vy * dt;
    if (K.x < 24) {
      K.x = 24;
      F.vx = Math.abs(F.vx) * 0.5;
    } else if (K.x > innerWidth - 24) {
      K.x = innerWidth - 24;
      F.vx = -Math.abs(F.vx) * 0.5;
    }
    setTilt(F.vx * 0.02);
    if (F.vy > 0) {
      const hit = landing(K.x, py, K.y);
      if (hit) {
        F.imp = Math.max(F.imp, F.vy);
        K.y = hit.yy;
        if (F.vy > 760 && !F.bounced) {
          F.bounced = true;
          F.vy = -F.vy * 0.26;
          F.vx *= 0.5;
          squash(true);
          EX.place();
          F.raf = requestAnimationFrame(tick);
          return;
        }
        EX.place();
        settle(hit, F);
        return;
      }
    }
    if (K.y > innerHeight + 90) {
      const b = fallback();
      if (b) {
        K.y = b.yy;
        settle(b, F);
        return;
      }
      abortAll();
      return;
    }
    EX.place();
    F.raf = requestAnimationFrame(tick);
  };
  F.raf = requestAnimationFrame(tick);
}

function cancelFall() {
  if (H.fall) {
    cancelAnimationFrame(H.fall.raf);
    H.fall = null;
  }
}

function abortAll() {
  cancelFall();
  H.held = false;
  H.drag = null;
  el.classList.remove("kk-air", "kk-held", "kk-sq");
  setTilt(0);
  if (K.tour === H) K.tour = null;
  if (K.stage === "air") K.stage = null;
}

function squash(soft) {
  if (RM()) return;
  el.classList.remove("kk-sq");
  void el.offsetWidth;
  el.classList.add("kk-sq");
  setTimeout(() => el.classList.remove("kk-sq"), 340);
  dustAt();
  sfx(soft ? 150 : 120, soft ? 0.06 : 0.09);
}

function settle(hit, F) {
  const x = clamp(K.x, hit.g.a, hit.g.b);
  cancelFall();
  EX.land(hit.id, x, hit.g);
  el.classList.remove("kk-air", "kk-held");
  setTilt(0);
  if (K.tour === H) K.tour = null;
  squash(F.imp < 700);
  const h = K.y - F.y0,
    imp = Math.max(F.imp, F.vy);
  if (F.reason === "release") landLines(hit.id, h, imp, F);
  KK.emit("land", { id: hit.id, h: Math.round(h) });
  KK.brain(rnd(2200, 4200));
}

/* nunca dos frases largas seguidas: entre medias, una micro */
function landLines(id, h, imp, F) {
  if (now() < H.madUntil) return;
  const o = { p: 2, cat: "ev", key: "k3land", cd: 3500, ctx: "land" };
  if (F.thrown) {
    /* si ya gritó en el aire, al aterrizar solo a veces remata (y sin pisar el grito); si no pudo, se queja ahora */
    if (F.fly && F.fly.said) {
      if (Math.random() < 0.75)
        say(
          imp > 1000 || h > 320 ? elegir(TEXTOS.hard, "k3th2") : thrownLine(),
          Object.assign(o, { replace: false })
        );
    } else say(thrownLine(), o);
  } else if (imp > 1000 || h > 320) {
    /* caída desde muy alto, sin lanzarla */
    if (!quietMode() && fullGap() && Math.random() < 0.5) {
      H.lastFull = now();
      say(elegir(TEXTOS.hard, "k3hd"), Object.assign(o, { cd: 0 }));
    } else KK.micro("hard", { key: "k3land", cd: 0, replace: true, nogap: true });
  } else gentleLines(id, h);
}

function gentleLines(id, h) {
  const placed = h <= PLACED_H,
    md = KK.mode;
  const spot =
    id === "search"
      ? TEXTOS.onSearch
      : id.startsWith("w:")
        ? TEXTOS.onWin
        : id === "floor"
          ? TEXTOS.onFloor
          : id.startsWith("tiles")
            ? TEXTOS.onTiles
            : id === "dock"
              ? TEXTOS.onDock
              : null;
  H.softN = (H.softN | 0) + 1;
  /* probabilidad de frase entera: «calladita» nunca (solo emojis), «charlatana» casi siempre, normal: 80 % si la dejas con cuidado, 60 % si cayó un poco */
  const chance = md === "quiet" ? 0 : md === "chat" ? 0.92 : placed ? 0.8 : 0.6;
  if (fullGap() && Math.random() < chance) {
    H.lastFull = now();
    const m =
      spot && Math.random() < 0.35
        ? elegir(spot, "k3sp")
        : placed
          ? mpk("placed", "k3pl")
          : mpk("soft", "k3sf");
    say(m, { p: 2, cat: "ev", key: "k3land", cd: 0, ctx: "land" });
  } else KK.micro(placed ? "placed" : "soft", { key: "k3land", cd: 0, replace: true, nogap: true });
}

/* ---- enfadarse ---- */
function mad(ms) {
  H.madUntil = now() + ms;
  el.classList.add("kk-mad");
  clearTimeout(H.madT);
  H.madT = setTimeout(() => {
    el.classList.remove("kk-mad");
    if (K.ready && !K.off && S.on && Math.random() < 0.5)
      say(elegir(TEXTOS.calm, "k3calm"), { p: 1, key: "k3calm", cd: 30000 });
  }, ms);
}

export function fallOff(why) {
  if (H.held || H.fall || K.off || !S.on) return;
  EX.stopMove();
  EX.setMode("idle");
  KK.interrupt();
  memoria.drops++;
  save();
  KK.emit("drop", { why, n: memoria.drops });
  const self = H.selfClose;
  H.selfClose = false;
  mad(7000 + rnd(0, 2500));
  const n = memoria.drops;
  let m;
  if (why === "close" && self) m = elegir(TEXTOS.closedSelf, "k3cs");
  else if (why === "close") m = mpk("closedOn", "k3co");
  else if (n >= 3 && n % 3 === 0) m = formatearPar(elegir(TEXTOS.dropMany, "k3dm"), { n });
  else m = mpk("dragged", "k3dr");
  if (why !== "close" || !self) bumpPlan(1);
  say(m, { p: 3, cat: "ev", key: "k3drop", cd: 0, mood: undefined });
  startFall({ vx: rnd(-90, 90), vy: -120, thrown: false, reason: why });
}

export function bumpPlan(n) {
  memoria.plan = Math.min(99, (memoria.plan | 0) + n);
  save();
}

puente.cancelFall = cancelFall;

puente.abortAll = abortAll;

puente.startFall = startFall;

export function iniciar() {
  /* ---- caer ---- */

  /* (etapa 4) soltarla SIN lanzarla ahora siempre reacciona (antes: una frase entera de cada 6, y la microreacción
     se descartaba si el globo de «agarrar» seguía en pantalla o no habían pasado 1,4 s desde la anterior).
     Reglas: es un evento físico (reemplaza el globo, sin esperar), sin pausa entre micros y con su propia lista de frases. */

  /* caída de hasta 140 px = «dejada con cuidado» (sin rebote) */

  puente.THROW_V = THROW_V;
}
