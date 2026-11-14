/*
  Apuntar y lanzar a Kixki contra la vaca (botón o tecla L).
*/

import { clamp } from "../../core/util.js";
import { segunIdioma } from "./config.js";
import { viva } from "./estado.js";
import { sr } from "./hud.js";
import { puente } from "./puente.js";
import { TEXTOS } from "./textos.js";
/* ---------- puntería: lanzar a Kixki con un botón o la tecla L (el combate se puede jugar sin arrastrar) ---------- */
export function aimThrow() {
  if (!viva.F || viva.F.over || !window.KXK3 || !KXK3.launch) return false;
  const c = viva.F.cow;
  if (c.st === "emerge" || c.st === "dying") return false;
  const G = 1900,
    kx0 = viva.K.x,
    ky0 = viva.K.y - 20;
  const T = clamp(Math.abs(c.x - kx0) / 1250, 0.5, 0.9);
  const tx = c.x + (c.mvx || 0) * T * 0.8,
    ty = c.y - 48;
  const v0x =
    ((tx - kx0) * 0.6) /
    (1 - Math.exp(-0.6 * T)); /* la velocidad horizontal se frena un poco por el roce */
  const v0y = (ty - ky0 - 0.5 * G * T * T) / T;
  return KXK3.launch(v0x, v0y);
}

puente.aimThrow = aimThrow;

export function iniciar() {
  addEventListener("keydown", (e) => {
    if (!viva.F || viva.F.over || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key !== "l" && e.key !== "L") return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    e.preventDefault();
    if (!aimThrow()) sr(segunIdioma(TEXTOS.srNoThrow));
  });
}
