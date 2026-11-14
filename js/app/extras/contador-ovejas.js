/*
  Contador de ovejas 🐑 sobre la oveja de la barra: cada clic suma uno y suena un «baa». Cada 10 clics hay lluvia de
  ovejas y en 100, 500 y 1000 un hito. Publica window.KXS = { beep, baa }.
*/

import { guardar, leer } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { baa, beep } from "./sonido.js";
import { rain } from "./temporada.js";
let clicsHastaLluvia, ovejasContadas, hitosAlcanzados, contadorEl;

const pintarContador = () => {
  contadorEl.textContent = "🐑 " + ovejasContadas;
  contadorEl.classList.remove("pop");
  void contadorEl.offsetWidth;
  contadorEl.classList.add("pop");
};

export function iniciar() {
  clicsHastaLluvia = 0;
  ovejasContadas = leer("kixki-ov", 0);
  hitosAlcanzados = leer("kixki-ovs", []);
  window.KXS = { beep, baa };
  $("#pet").insertAdjacentHTML("beforeend", `<b class="oc" aria-hidden="true"></b>`);
  contadorEl = $("#pet .oc");

  pintarContador();
  $("#pet").addEventListener("click", () => {
    baa();
    ovejasContadas++;
    guardar("kixki-ov", ovejasContadas);
    pintarContador();
    if (++clicsHastaLluvia >= 10) {
      clicsHastaLluvia = 0;
      if (!document.querySelector(".rain")) rain();
    }
    [100, 500, 1000].forEach((m) => {
      if (ovejasContadas >= m && !hitosAlcanzados.includes(m)) {
        hitosAlcanzados.push(m);
        guardar("kixki-ovs", hitosAlcanzados);
        KXE.fire(m);
      }
    });
  });
}
