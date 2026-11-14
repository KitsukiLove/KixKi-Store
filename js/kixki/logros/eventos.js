/*
  Escucha los eventos de Kixki y de la página (kixki-evt, juego, lluvia, teclado) para desbloquear logros.
*/

import { $ } from "../../core/util.js";
import { flushSay, sweep } from "./anuncios.js";
import { K, KK, root, viva } from "./base.js";
import { C, inc, mx, save } from "./estado.js";
import { puente } from "./puente.js";
export let T;

let ki;

const watch = (sel, key) => {
  const el = $(sel);
  if (!el) return;
  let was = el.hidden;
  new MutationObserver(() => {
    if (was && !el.hidden) {
      C[key] = 1;
      save();
      sweep();
    }
    was = el.hidden;
  }).observe(el, { attributes: true, attributeFilter: ["hidden"] });
};

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function iniciar() {
  addEventListener("kixki-game", (e) => {
    const d = e.detail || {};
    if (d.t === "start" || d.t === "retry") inc("plays");
    else if (d.t === "score") mx("runMax", d.sc | 0);
    else if (d.t === "record") C.recBroken = 1;
    else if (d.t === "over") {
      mx("runMax", d.sc | 0);
      if (d.nr && !d.first && d.sc > 0) C.recBroken = 1;
      setTimeout(flushSay, 1700);
    }
    save();
    sweep();
  });
  addEventListener("kixki-rain", (e) => {
    const d = e.detail || {};
    if (d.t === "start") inc("rainSeen");
    else if (d.t === "glass") C.glass = 1;
    else if (d.t === "wipe") mx("wiped", d.n | 0);
    save();
    sweep();
  });
  /* clics que la parte 1 no avisa (en captura para ir antes que app.js) */
  addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest(".chips .fl,.bdg span")) inc("tags");
      if (t.closest("#vw,#s-view")) C.view = 1;
      if (t.closest("#pet"))
        setTimeout(() => {
          sweep();
          puente.petTap();
        }, 60);
      save();
      sweep();
    },
    true
  );

  watch("#run", "run");
  watch("#qr", "qr");
  new MutationObserver(() => {
    inc("acc");
    save();
    sweep();
  }).observe(root, { attributes: true, attributeFilter: ["data-acc"] });

  ki = 0;
  addEventListener("keydown", (e) => {
    const k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === KONAMI[ki]) {
      ki++;
      if (ki === KONAMI.length) {
        ki = 0;
        C.konami = 1;
        save();
        sweep();
      }
    } else ki = k === KONAMI[0] ? 1 : 0;
    if (e.key === "Escape" && viva.chatting) K.tour = null; /* Esc corta la charla */
  });
  /* ---------- consejos y piropos nuevos para la parte 1 ---------- */
  T = KK.T;
  T.tips.push(
    {
      t: [
        "Mira tus logros en el menú Kixki → «Logros». ¡A ver cuántos llevas! 🏆",
        "Check your achievements in the Kixki menu → “Achievements”. Let's see how many you have! 🏆",
      ],
    },
    {
      t: [
        "Hay logros secretos escondidos. ¡Prueba cosas raras! 🤫",
        "There are secret achievements hidden around. Try weird things! 🤫",
      ],
    },
    {
      pc: 1,
      t: [
        "A veces bajo a charlar con la ovejita de abajo. ¡Se pone muy graciosa! 🐑",
        "Sometimes I go down to chat with the little sheep downstairs. She gets really funny! 🐑",
      ],
    },
    {
      pc: 1,
      t: [
        "Si le haces cosquillas muy rápido a la ovejita de abajo, ¡me asomo a ver qué pasa!",
        "If you tickle the little sheep downstairs really fast, I'll pop down to see what's going on!",
      ],
    },
    {
      pc: 1,
      t: [
        "En el menú Kixki puedes pedirme que baje a hablar con la ovejita.",
        "In the Kixki menu you can ask me to go chat with the little sheep.",
      ],
    },
    {
      t: [
        "Si llueve en la tienda, ¡deja la página quieta y verás cómo chocan las gotas con la pantalla! 💧",
        "If it rains in the store, leave the page still and watch the drops hit the screen! 💧",
      ],
    },
    {
      pc: 1,
      t: [
        "Si la ovejita se incendia y empieza a llover, ¡la lluvia la apaga solita! 🌧️",
        "If the little sheep catches fire and it starts to rain, the rain puts her out by itself! 🌧️",
      ],
    },
    {
      pc: 1,
      t: [
        "En verano, con el sol fuerte, la ovejita de abajo a veces se calienta demasiado… ¡ten el agua lista! 💦",
        "In summer, with the sun blazing, the little sheep downstairs sometimes overheats… keep the water ready! 💦",
      ],
    },
    {
      mob: 1,
      t: [
        "En «Más» está «Logros»: ¡mira cuáles llevas y cuáles te faltan! 🏆",
        "“More” has “Achievements”: see which ones you have and which are missing! 🏆",
      ],
    }
  );
}
