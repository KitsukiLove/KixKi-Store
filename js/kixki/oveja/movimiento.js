/*
  Plataformas por las que anda Kixki (barra de búsqueda, carpetas, ventanas, dock…) y su movimiento: caminar, saltar, aterrizar y recolocarse.
*/

import { $, $$, clamp, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { el } from "./elemento.js";
import { face, frame, K, place, R, setMode, V } from "./estado.js";
import { puente } from "./puente.js";
import { isPC } from "./utilidades.js";

let lostT, rq;

const okY = (y) => y >= 54 && y <= innerHeight - 8;

const yAt = (sg, x) => {
  if (x <= sg[0].a) return sg[0].y;
  for (let i = 0; i < sg.length; i++) {
    if (x <= sg[i].b) return sg[i].y;
    if (sg[i + 1] && x < sg[i + 1].a) {
      const u = (x - sg[i].b) / (sg[i + 1].a - sg[i].b);
      return sg[i].y + (sg[i + 1].y - sg[i].y) * u;
    }
  }
  return sg[sg.length - 1].y;
};

export const topWin = () => {
  let best = null,
    bz = -1;
  $$("#app .cat:not(.min):not(.max)").forEach((e) => {
    if (e.hidden) return;
    const z = +getComputedStyle(e).zIndex || 0;
    if (z >= bz) {
      bz = z;
      best = e;
    }
  });
  return best;
};

export const PLAT = {};

export const free = (id) => id === "dock" || id === "game" || id === "bask" || !!PLAT[id];

export const usable = (id) => {
  const g = geo(id);
  if (!g) return false;
  const y = g.y(g.a);
  if (free(id)) return y >= 54 && y <= innerHeight + 4;
  return okY(y) && y <= innerHeight - (isPC() ? 56 : 96);
};

export const home = () => (isPC() ? "search" : "dock");

export const candidates = () =>
  (isPC() ? ["search", "win"] : ["search", "tiles0", "tiles1", "tiles2", "dock"]).filter(usable);

const pickX = (g) => (g.b > g.a ? rnd(g.a, g.b) : g.a);

export const DLG = { budget: 5, win: 60000, sp: [], gap: { sp: 15000, mic: 1400 }, last: {} };

export function geo(id) {
  if (!id) return null;
  if (PLAT[id]) {
    try {
      return PLAT[id]() || null;
    } catch (e) {
      return null;
    }
  }
  if (id === "search") {
    const r = R(".search");
    if (!r) return null;
    const a = r.left + 32;
    return { a, b: Math.max(a, r.right - 32), y: () => r.top - 1 };
  }
  if (id === "dock") {
    const r = R("#dock");
    if (!r) return null;
    const a = r.left + 40;
    return { a, b: Math.max(a, r.right - 40), y: () => r.top + 1 };
  }
  if (id.startsWith("tiles")) {
    const row = +id.slice(5),
      T = $$("#desk .di")
        .slice(row * 3, row * 3 + 3)
        .map((e) => R(e))
        .filter(Boolean);
    if (!T.length || isPC()) return null;
    const sg = T.map((r) => ({
      a: r.left + 28,
      b: Math.max(r.left + 28, r.right - 28),
      y: r.top - 4,
    }));
    return { a: sg[0].a, b: sg[sg.length - 1].b, y: (x) => yAt(sg, x), tiles: T };
  }
  if (id === "win") {
    if (!isPC()) return null;
    const w = topWin();
    if (!w) return null;
    const p = w.querySelector(".panel"),
      r = R(p);
    if (!r) return null;
    const a = r.left + 34;
    return {
      a,
      b: Math.max(a, r.right - 34),
      y: () => {
        const q = R(p);
        return (q || r).top - 3;
      },
    };
  }
  if (id.startsWith("desk:")) {
    if (!isPC()) return null;
    const di = $(`#desk .di[data-id="${id.slice(5)}"]`),
      r = R(di);
    if (!r) return null;
    const mid = (r.top + r.bottom) / 2,
      row = $$("#desk .di")
        .map((e) => R(e))
        .filter((q) => q && Math.abs((q.top + q.bottom) / 2 - mid) < 24);
    const rx = Math.max(...row.map((q) => q.right)) + 34;
    return { a: rx, b: rx, y: () => r.top + 86, face: -1, hl: di };
  }
  /* ventanas de minijuego: borde superior de la caja (Salta Vallas «game» y cancha de básquet «bask») */
  if (id === "game" || id === "bask") {
    const sel = id === "game" ? "#game" : "#bask",
      g = $(sel);
    if (!g || g.hidden) return null;
    const bx = sel + " .box",
      r = R(bx);
    if (!r) return null;
    const a = r.left + 34;
    return { a, b: Math.max(a, r.right - 34), y: () => (R(bx) || r).top - 3 };
  }
  return null;
}

/* ---------- movimiento: caminar por la plataforma o saltar a otra ---------- */
export function stopMove() {
  cancelAnimationFrame(V.raf);
  V.raf = 0;
  if (V.mv) {
    const r = V.mv.res;
    V.mv = null;
    r && r();
  }
}

export function walk(tx, sp) {
  return new Promise((res) => {
    let g = geo(K.stage);
    if (!g || RM()) {
      res();
      return;
    }
    tx = clamp(tx, g.a, g.b);
    if (Math.abs(tx - K.x) < 4) {
      res();
      return;
    }
    stopMove();
    setMode("walk");
    face(tx > K.x ? 1 : -1);
    let last = performance.now(),
      acc = 0,
      st = 0;
    const SP = sp || 36;
    V.mv = { res };
    const end = () => {
      V.raf = 0;
      V.mv = null;
      if (K.mode === "walk") {
        setMode("idle");
        frame("idle");
      }
      res();
    };
    const tick = (t) => {
      if (document.hidden) {
        last = t;
        V.raf = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      g = geo(K.stage);
      if (!g) {
        end();
        return;
      }
      K.x += K.dir * SP * dt;
      if ((K.dir > 0 && K.x >= tx) || (K.dir < 0 && K.x <= tx)) K.x = tx;
      K.y = g.y(K.x);
      acc += dt;
      if (acc > 0.17) {
        acc = 0;
        st = (st + 1) % 4;
        frame(["walkB", "idle", "walkC", "idle"][st]);
      }
      place();
      if (K.x === tx) end();
      else V.raf = requestAnimationFrame(tick);
    };
    V.raf = requestAnimationFrame(tick);
  });
}

export function dust() {
  if (RM()) return;
  [
    [-10, -8],
    [0, 0],
    [10, 8],
  ].forEach(([dx, mx]) => {
    const d = document.createElement("i");
    d.className = "kk-d";
    d.style.setProperty("--dx", dx + "px");
    d.style.setProperty("--mx", mx + "px");
    el.append(d);
    setTimeout(() => d.remove(), 560);
  });
}

export function land(id, x, g) {
  K.stage = id;
  K.x = x;
  K.y = g.y(x);
  if (K.snooze) {
    setMode("sleep");
    frame("sleep");
  } else {
    setMode("idle");
    frame("idle");
  }
  place();
}

export function hop(id, tx) {
  return new Promise((res) => {
    const g = geo(id);
    if (!g) {
      res(false);
      return;
    }
    const x1 = tx == null ? pickX(g) : clamp(tx, g.a, g.b);
    if (RM()) {
      stopMove();
      land(id, x1, g);
      if (g.face) face(g.face);
      res(true);
      puente.flushQ();
      return;
    }
    stopMove();
    setMode("hop");
    frame("jump");
    const x0 = K.x,
      y0 = K.y,
      dist = Math.hypot(x1 - x0, g.y(x1) - y0),
      T = clamp(380 + dist * 0.85, 450, 1250),
      H = clamp(46 + dist * 0.13, 46, 160),
      t0 = performance.now();
    face(x1 >= x0 ? 1 : -1);
    V.mv = { res: () => res(false) };
    const tick = (t) => {
      const u = Math.min(1, (t - t0) / T),
        gg = geo(id);
      if (!gg) {
        V.raf = 0;
        V.mv = null;
        setMode("idle");
        frame("idle");
        res(false);
        return;
      }
      const yy = gg.y(x1);
      K.x = x0 + (x1 - x0) * u;
      K.y = y0 + (yy - y0) * u - 4 * H * u * (1 - u);
      place();
      if (u < 1) {
        V.raf = requestAnimationFrame(tick);
        return;
      }
      V.raf = 0;
      V.mv = null;
      land(id, x1, gg);
      if (gg.face) face(gg.face);
      dust();
      res(true);
      puente.flushQ();
    };
    V.raf = requestAnimationFrame(tick);
  });
}

/* si su plataforma desaparece (te desplazaste, cambiaste de modo…), busca otra */
export async function relocate(tele) {
  if (K.off) return;
  puente.interrupt();
  let id = candidates()[0] || home();
  if (K.game && usable("game")) id = "game";
  const g = geo(id);
  if (!g) return;
  if (tele || RM()) {
    stopMove();
    land(id, (g.a + g.b) / 2, g);
    return;
  }
  await hop(id, (g.a + g.b) / 2);
}

export function resync() {
  if (rq) return;
  rq = requestAnimationFrame(() => {
    rq = 0;
    if (K.off || !K.ready || K.mode === "hop" || K.mode === "walk") return;
    const g = geo(K.stage);
    if (!g || !(free(K.stage) ? true : usable(K.stage))) {
      clearTimeout(lostT);
      lostT = setTimeout(() => {
        const g2 = geo(K.stage);
        if (!g2 || !usable(K.stage)) relocate();
      }, 520);
      return;
    }
    clearTimeout(lostT);
    K.x = clamp(K.x, g.a, g.b);
    K.y = g.y(K.x);
    place();
  });
}

export function iniciar() {
  /* (parte 2) plataformas extra que registran otros módulos, p. ej. «pet» = la ovejita de abajo */

  lostT = 0;
  rq = 0;
  /* ---------- gestor de diálogos ----------
     say(mensaje,{p,key,cd,mood,hl,vars, cat,ctx,ttl,replace,instant,force}) → promesa: true si se dijo entera, false si no.
     - cat: «ev» eventos físicos (agarrar, lanzar, caer, ventana) · «sp» charla espontánea (con presupuesto por minuto)
            · «amb» reacciones de fondo (p1) · «ui» respuestas a lo que haces (p2-p3).
     - Un «ev» REEMPLAZA el globo actual en vez de esperar su turno, se escribe de golpe y, si no puede salir en
       600 ms (ttl), se descarta: una frase vieja es peor que ninguna.
     - Las demás con p ≥ 2 hacen cola (máx. 4) y también caducan (12 s). Sale primero la de más prioridad.
     - El enfriamiento (key + cd) solo se gasta cuando la frase se dice de verdad.
     - interrupt(ctx) corta el globo y limpia la cola de ese contexto (sin ctx: toda la cola).
     - KXK.debug = true → línea de tiempo de cada frase en la consola; KXK.timeline() la devuelve. */
}
