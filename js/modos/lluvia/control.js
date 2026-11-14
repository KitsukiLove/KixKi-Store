/*
  Empezar, parar y cambiar de modo (auto / sí / no).
*/

import { guardar } from "../../core/store.js";
import { reducirMovimiento as RM } from "../../core/util.js";
import { emit, now, rnd, root, viva } from "./estado.js";
import { wake } from "./fotograma.js";
import { puente } from "./puente.js";

const snowBg = () => {
  const b = root.getAttribute("data-bg");
  return (
    b === "invierno" ||
    b === "navidad" ||
    (b === "xp" && /^(invierno|navidad)$/.test(root.getAttribute("data-xps") || ""))
  );
};

/* ---- control ---- */
export function startRain(ms, str) {
  if (viva.raining && !ms) return;
  const was = viva.raining;
  viva.raining = true;
  viva.strength = str || rnd(0.7, 1);
  viva.rainEnd = ms ? now() + ms : viva.mode === "on" ? Infinity : now() + rnd(70000, 150000);
  if (was) return;
  viva.glassFired = false;
  viva.lastAct = now();
  wake();
  emit("start", {});
  puente.react("start");
}

export function stopRain() {
  if (!viva.raining) return;
  viva.raining = false;
  viva.rainEnd = 0;
  viva.nextRain = now() + rnd(150000, 420000);
  emit("stop", {});
  puente.react("stop");
  wake();
}

export function setMode(m) {
  viva.mode = m;
  guardar("kixki-rain", m);
  if (m === "on") startRain(0, rnd(0.8, 1));
  else if (m === "off") stopRain();
  else {
    if (viva.raining && !isFinite(viva.rainEnd)) viva.rainEnd = now() + rnd(20000, 50000);
    viva.nextRain = now() + rnd(40000, 120000);
  }
  puente.label();
}

export function iniciar() {
  setInterval(() => {
    if (document.hidden) return;
    if (viva.mode === "auto") {
      if (viva.raining) {
        if (now() >= viva.rainEnd) stopRain();
      } else if (now() >= viva.nextRain) {
        viva.nextRain = now() + rnd(120000, 300000);
        if (!snowBg() && !RM()) startRain(rnd(70000, 150000));
      }
    }
  }, 4000);
}
