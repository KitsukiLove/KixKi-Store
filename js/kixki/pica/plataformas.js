/*
  Plataformas extra para las físicas (aire, suelo y cada ventana), aterrizaje, suelo, sonidos y polvo.
*/

import { $, $$, clamp, now, reducirMovimiento as RM } from "../../core/util.js";
import { el, EX, H, K, KK } from "./base.js";
export let R;

const winGeo = (s) => {
  if (!KK.isPC() || s.classList.contains("min") || s.classList.contains("max")) return null;
  const p = $(".panel", s),
    r = R(p);
  if (!r) return null;
  const a = r.left + 34;
  return { a, b: Math.max(a, r.right - 34), y: () => (R(p) || r).top - 3 };
};

const pin = () => {
  if (document.hidden) return;
  if (K.stage === "win") {
    const w = EX.topWin();
    if (w) K.stage = "w:" + w.id;
  }
};

const platIds = () => {
  if (KK.isPC())
    return ["search", ...$$("#app .cat:not(.min):not(.max)").map((s) => "w:" + s.id), "floor"];
  return ["search", "tiles0", "tiles1", "tiles2", "dock"];
};

const covered = (id, x, y) => {
  if (!id.startsWith("w:")) return false;
  for (const e of document.elementsFromPoint(x, y + 6)) {
    const s = e.closest && e.closest(".cat");
    if (s) return s.id !== id.slice(2);
  }
  return false;
};

const homeId = () => (KK.isPC() ? "floor" : "dock");

export const floorY = () => {
  const g = KK.geo(homeId());
  return g ? g.y(g.a) : innerHeight - 8;
};

export const sfx = (f, d) => {
  if (window.KXS)
    try {
      KXS.beep(f, d);
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
};

export const dustAt = () => {
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
};

export const setTilt = (v) => {
  v = Math.round(clamp(v, -16, 16) / 2) * 2;
  if (v !== H.tilt) {
    H.tilt = v;
    el.style.setProperty("--tilt", v + "deg");
  }
};

/* la plataforma más alta que cruza entre prevY y newY (cayendo) */
export function landing(x, prevY, newY) {
  let best = null;
  for (const id of platIds()) {
    if (H.skip === id && now() < H.skipUntil) continue;
    const g = KK.geo(id);
    if (!g) continue;
    if (x < g.a - 14 || x > g.b + 14) continue;
    const xx = clamp(x, g.a, g.b),
      yy = g.y(xx);
    if (yy < 46 || yy > innerHeight + 6) continue;
    if (prevY > yy + 1 || newY < yy) continue;
    if (covered(id, xx, yy)) continue;
    if (!best || yy < best.yy) best = { id, g, yy };
  }
  return best;
}

/* aterrizaje sin animación (si el sistema pide menos movimiento, o como último recurso) */
export function fallback() {
  let best = null;
  for (const i of platIds()) {
    const g = KK.geo(i);
    if (!g) continue;
    const xx = clamp(K.x, g.a, g.b),
      yy = g.y(xx);
    if (yy < 46 || yy > innerHeight + 4 || yy < K.y - 2 || covered(i, xx, yy)) continue;
    if (!best || yy < best.yy) best = { id: i, g, yy };
  }
  if (!best) {
    const id = KK.geo(homeId()) ? homeId() : "search",
      g = KK.geo(id);
    if (!g) return null;
    best = { id, g, yy: g.y(clamp(K.x, g.a, g.b)) };
  }
  return best;
}

export function iniciar() {
  R = EX.R;
  /* plataformas extra: «air» (donde esté), el suelo (barra de tareas en PC) y cada ventana por separado */
  KK.plat("air", () => ({ a: -1e5, b: 1e5, y: () => K.y }));
  KK.plat("floor", () => {
    if (!KK.isPC()) return null;
    const r = R("#taskbar");
    if (!r) return null;
    return { a: 24, b: Math.max(24, innerWidth - 24), y: () => (R("#taskbar") || r).top + 1 };
  });

  $$("#app .cat").forEach((s) => KK.plat("w:" + s.id, () => winGeo(s)));
  /* «win» (la ventana de arriba) pasa a ser «w:<id>»: así sabe EN CUÁL está aunque cambie el orden de las ventanas */

  setInterval(pin, 250);
  addEventListener("pointerdown", pin, true);
  addEventListener("click", pin, true);

  /* ¿hay otra ventana tapando este punto de la ventana id? */

  /* suelo de Kixki: la barra de tareas (PC) o la barra de abajo (móvil) */
}
