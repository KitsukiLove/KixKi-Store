/*
  Entrada «Pícara» en el menú Kixki / Más para activar o apagar las travesuras.
*/

import { $, idioma as lang } from "../../core/util.js";
import { elegir, say } from "./base.js";
import { memoria, save } from "./memoria.js";
import { TEXTOS } from "./textos.js";
let sm;

const indiceIdioma = () => (lang() === "en" ? 1 : 0);

const prLabel = () => {
  const b = $("#s-kx-pr");
  if (b)
    b.textContent = (
      memoria.pr
        ? ["Travesuras de Kixki: sí", "Kixki's pranks: on"]
        : ["Travesuras de Kixki: no", "Kixki's pranks: off"]
    )[indiceIdioma()];
};

export function iniciar() {
  /* =======================================================  MENÚ  */
  sm = (window.KX && KX.sm) || $("#sm");

  if (sm) {
    const ref = $("#s-sug", sm),
      html = `<button type="button" class="sm" id="s-kx-pr"></button>`;
    ref ? ref.insertAdjacentHTML("beforebegin", html) : sm.insertAdjacentHTML("beforeend", html);
    sm.addEventListener("click", (e) => {
      if (!e.target.closest("#s-kx-pr")) return;
      memoria.pr = !memoria.pr;
      save();
      prLabel();
      setTimeout(() => say(elegir(memoria.pr ? TEXTOS.prOn : TEXTOS.prOff, "k3pr"), { p: 3 }), 300);
    });
  }
  prLabel();
  if (window.KXI && !KXI._k3) {
    KXI._k3 = 1;
    const o = KXI.set;
    KXI.set = function (l) {
      o.call(KXI, l);
      prLabel();
    };
  }
}
