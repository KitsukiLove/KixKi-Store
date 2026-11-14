/*
  Kixki comenta la lluvia (y el incendio de verano avisa por evento).
*/

import { viva } from "./estado.js";
import { puente } from "./puente.js";
import { wipe } from "./visitante.js";
/* ---- Kixki comenta ---- */
function react(w) {
  const K = window.KXK;
  if (!K || !K.ready || !K.alive || !K.alive()) return;
  const M = {
    start: [
      "¡Está lloviendo! 🌧️ Menos mal que mi lana es impermeable… más o menos.",
      "It's raining! 🌧️ Good thing my wool is waterproof… sort of.",
    ],
    stop: [
      "¡Ya paró la lluvia! 🌈 Huele a hierba mojada.",
      "The rain stopped! 🌈 Smells like wet grass.",
    ],
  }[w];
  if (M)
    try {
      K.say(M, { p: 1, key: "rain-" + w, cd: 120000 });
    } catch (e) {
      // La frase de Kixki es opcional: si no está lista, no se dice.
    }
  if (w === "start" && viva.rsOn && !puente.pageSound() && !viva.sndHinted) {
    viva.sndHinted = true;
    setTimeout(() => {
      try {
        K.say(
          [
            "Si activas el sonido (el altavoz), también puedes oír la lluvia. 🎧",
            "If you turn the sound on (the speaker), you can hear the rain too. 🎧",
          ],
          { p: 1, key: "rain-snd", cd: 600000 }
        );
      } catch (e) {
        // La frase de Kixki es opcional: si no está lista, no se dice.
      }
    }, 7000);
  }
}

puente.react = react;

export function iniciar() {
  addEventListener("kixki-rain", (e) => {
    const d = e.detail || {};
    const K = window.KXK;
    if (!K || !K.ready || !K.alive || !K.alive()) return;
    if (d.t === "glass")
      try {
        K.say(
          [
            "¡Las gotas chocan con la pantalla! 💧 Pasa el dedo o el ratón para limpiarlas.",
            "Drops are hitting the screen! 💧 Swipe your finger or mouse to wipe them.",
          ],
          { p: 2, key: "rain-glass", cd: 180000 }
        );
      } catch (x) {
        // La frase de Kixki es opcional: si no está lista, no se dice.
      }
    if (d.t === "wipe" && d.n >= 8 && !wipe.said) {
      wipe.said = 1;
      try {
        K.say(["¡Cristal limpio y brillante! ✨", "Squeaky clean glass! ✨"], {
          p: 1,
          key: "rain-wipe",
          cd: 180000,
        });
      } catch (x) {
        // La frase de Kixki es opcional: si no está lista, no se dice.
      }
    }
  });
}
