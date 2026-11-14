/*
  Botón del menú «Lluvia: auto / sí / no» y publicación de window.KXRAIN.
*/

import { guardar } from "../../core/store.js";
import { setMode, startRain, stopRain } from "./control.js";
import { rnd, TAM_PIXEL, viva } from "./estado.js";
import { wake } from "./fotograma.js";
import { addDrop, gotas } from "./gotas.js";
import { strike } from "./modo-xp.js";
import { puente } from "./puente.js";
import { levelNow, renderWav, syncSound } from "./sonido-ajuste.js";
import { pageSound, wantSound } from "./sonido-base.js";
let btn, btnS;

const LAB = { auto: "Lluvia: auto", on: "Lluvia: sí", off: "Lluvia: no" };

function label() {
  if (btn) btn.textContent = LAB[viva.mode];
  if (btnS) btnS.textContent = "Sonido de lluvia: " + (viva.rsOn ? "sí" : "no");
}

function menu() {
  const ref = document.getElementById("s-bg");
  if (!ref || document.getElementById("s-rain")) return;
  ref.insertAdjacentHTML("afterend", '<button type="button" class="sm" id="s-rain"></button>');
  btn = document.getElementById("s-rain");
  btn.insertAdjacentHTML("afterend", '<button type="button" class="sm" id="s-rainsnd"></button>');
  btnS = document.getElementById("s-rainsnd");
  label();
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMode(viva.mode === "auto" ? "on" : viva.mode === "on" ? "off" : "auto");
  });
  btnS.addEventListener("click", (e) => {
    e.stopPropagation();
    viva.rsOn = !viva.rsOn;
    guardar("kixki-rainsnd", viva.rsOn);
    label();
    if (viva.rsOn && !pageSound()) {
      const K = window.KXK;
      if (K && K.ready && K.alive && K.alive())
        try {
          K.say(
            [
              "Para oír la lluvia activa el sonido: el botón del altavoz. 🔊",
              "To hear the rain, turn the sound on: the speaker button. 🔊",
            ],
            { p: 2, key: "rain-snd", cd: 60000 }
          );
        } catch (x) {
          // La frase de Kixki es opcional: si no está lista, no se dice.
        }
    }
    syncSound();
  });
}

puente.label = label;

export function iniciar() {
  /* ---- menú ---- */
  btn = null;

  btnS = null;
  window.KXR ? menu() : addEventListener("kixki-ready", menu, { once: true });
  window.KXRAIN = {
    on: () => viva.raining && viva.inten > 0.3,
    get raining() {
      return viva.raining;
    },
    get mode() {
      return viva.mode;
    },
    get intensity() {
      return viva.inten;
    },
    set: setMode,
    start: (ms, str) => startRain(ms || 0, str),
    stop: stopRain,
    sound: () => ({
      want: wantSound(),
      on: !!viva.au,
      state: viva.au && viva.au.ctx.state,
      level: levelNow(),
    }),
    glass: gotas,
    idle(ms) {
      if (ms >= 0) viva.idleMs = ms;
      return viva.idleMs;
    },
    drop: (x, y, r) => {
      wake();
      return addDrop(x / TAM_PIXEL, y / TAM_PIXEL, r);
    },
    lightning: (p) => {
      wake();
      strike(p);
    },
    thunder: (d, p) => {
      if (viva.au) viva.au.thunder(d || 0.5, p);
    },
    _render: renderWav,
  };
  if (viva.mode === "on") startRain(0, rnd(0.8, 1));
}
