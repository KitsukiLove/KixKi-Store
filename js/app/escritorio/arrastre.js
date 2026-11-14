/*
  Clics en la barra de título y arrastre de ventanas con ratón o dedo.
*/

import { toast } from "../catalogo/aviso.js";
import { setState } from "../catalogo/ventanas-cat.js";
import {
  front,
  olvidarSuperior,
  openWin,
  ventanasCategoria,
  menuAjustes,
  ventanaSuperior,
} from "./ventanas.js";
import { DSK } from "./vista.js";
let drag;

export function iniciar() {
  drag = null;
  document.addEventListener("click", (e) => {
    const d = e.target.closest(".di,.sm[data-id]");
    if (d) {
      openWin(d.dataset.id);
      menuAjustes.hidden = true;
      return;
    }
    const k = e.target.closest(".tk");
    if (k) {
      const s = document.getElementById(k.dataset.id);
      if (s.classList.contains("min")) openWin(s.id);
      else if (s === ventanaSuperior()) setState(s, "min");
      else front(s);
      return;
    }
    if (e.target.closest("#st")) {
      menuAjustes.hidden = !menuAjustes.hidden;
      return;
    }
    if (e.target.closest("#smt")) {
      document.getElementById("tg").click();
      menuAjustes.hidden = true;
      return;
    }
    if (e.target.closest("#sma")) {
      ventanasCategoria.forEach((s) => setState(s, "min"));
      olvidarSuperior();
      menuAjustes.hidden = true;
      return;
    }
    if (e.target.closest("#pet")) {
      toast("¡Beee! 🐑");
      return;
    }
    if (!e.target.closest("#sm")) menuAjustes.hidden = true;
  });
  /* Ventanas arrastrables */
  document.addEventListener("pointerdown", (e) => {
    if (!DSK()) return;
    const s = e.target.closest(".cat");
    if (!s) return;
    front(s);
    if (!e.target.closest(".tb") || e.target.closest(".wb") || s.classList.contains("max")) return;
    const r = s.getBoundingClientRect();
    drag = { s, dx: e.clientX - r.left, dy: e.clientY - r.top };
    e.preventDefault();
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    drag.s.style.setProperty(
      "--x",
      Math.max(0, Math.min(innerWidth - 140, e.clientX - drag.dx)) + "px"
    );
    drag.s.style.setProperty(
      "--y",
      Math.max(0, Math.min(innerHeight - 110, e.clientY - drag.dy)) + "px"
    );
  });
  addEventListener("pointerup", () => {
    drag = null;
  });
}
