/*
  Frases de ayuda de Kixki y publicación de window.KXK4.
*/

import { $ } from "../../core/util.js";
import { closePop, openPop } from "./boton.js";
import { memoria, save } from "./config.js";
import { advice, ask } from "./consejo.js";
import { ADV, KK } from "./estado.js";
export function iniciar() {
  /* ---------- Kixki enseña la función en sus consejos de siempre ---------- */
  try {
    const tips = KK.T && KK.T.tips;
    if (tips && ADV.hintPC)
      tips.push(
        ...ADV.hintPC.map((t) => ({ pc: 1, t })),
        ...(ADV.hintMob || []).map((t) => ({ mob: 1, t }))
      );
  } catch (e) {
    // La lista de frases extra es opcional: si falta, se usan las de siempre.
  }
  window.KXK4 = {
    state: memoria,
    open: (id) => openPop($(`#desk .di[data-id="${id}"]`), true),
    close: () => closePop(),
    ask,
    advice,
    reset: () => {
      memoria.asked = {};
      memoria.total = 0;
      save();
    },
  };
}
