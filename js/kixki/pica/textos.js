/*
  Textos de la parte 3 (chismes, teorías, confesiones y plan de toma de control) y partes del plan.
*/

import { rnd } from "../../core/util.js";
import { memoria, save } from "./memoria.js";
/* =========================================================  TEXTOS  [español, English]  */
export const TEXTOS = (window.KXD || {}).TX;

/* los textos viven en dialogs.js */
export const planParts = () => {
  const p0 = memoria.plan | 0,
    F2 = (pair, v) => [KXK.fmt(pair[0], v), KXK.fmt(pair[1], v)];
  if (p0 >= 100) {
    memoria.plan = 0;
    save();
    return [
      [
        "¡¡CONTROL TOTAL!! 🐑👑 Ya soy la dueña de esta página.",
        "TOTAL CONTROL!! 🐑👑 I own this page now.",
      ],
      [
        "…Ah. KitsukiLove acaba de recargar la página. Reiniciando plan: 0%. 😤",
        "…Oh. KitsukiLove just reloaded the page. Restarting plan: 0%. 😤",
      ],
    ];
  }
  const p = Math.min(100, p0 + Math.round(rnd(2, 7)));
  memoria.plan = p;
  save();
  if (p0 === 0)
    return [
      [
        "KitsukiLove no sabe que pronto tomaré el control de la página… ¿Qué? No dije nada. 😇",
        "KitsukiLove doesn't know I'll soon take over the page… What? I didn't say anything. 😇",
      ],
    ];
  if (p >= 100)
    return [
      [
        "Plan «Lana Total»: 100%. Un momento… voy a ensayar mi discurso. 🎤",
        "Plan “Total Wool”: 100%. One moment… I'm rehearsing my speech. 🎤",
      ],
    ];
  if (p >= 90)
    return [
      F2(
        [
          "{p}%. KitsukiLove, si estás leyendo esto… es una broma. Una broma muy sincera. 😇",
          "{p}%. KitsukiLove, if you're reading this… it's a joke. A very sincere joke. 😇",
        ],
        { p }
      ),
    ];
  if (p >= 60)
    return [
      F2(
        [
          "Plan «Lana Total»: {p}%. Solo falta convencer a la ovejita de abajo. Y a la vaca. 🐄",
          "Plan “Total Wool”: {p}%. I just need to convince the little sheep downstairs. And the cow. 🐄",
        ],
        { p }
      ),
    ];
  return [
    F2(
      [
        "Plan «Lana Total»: {p}% completado. Shhh. No lo leas en voz alta. 🐑",
        "Plan “Total Wool”: {p}% complete. Shhh. Don't read it out loud. 🐑",
      ],
      { p }
    ),
  ];
};
