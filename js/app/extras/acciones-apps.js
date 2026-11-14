/*
  Acciones sobre las tarjetas de apps: ir a una app (goto, la usa también «Ejecutar»), marcar favoritas (★),
  copiar y los botones con data-go.
*/

import { guardar } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { fit } from "../catalogo/ajuste-texto.js";
import { toast } from "../catalogo/aviso.js";
import { cajaBusqueda } from "../catalogo/buscador.js";
import { front } from "../escritorio/ventanas.js";
import { DSK, root } from "../escritorio/vista.js";
import { closeMax, setState } from "../catalogo/ventanas-cat.js";
import { nombreDeApp, appsOriginales, ventanaPorId, VENTANAS_ESPECIALES, vibrar } from "./base.js";
import { copyTxt } from "./enlaces.js";
import { leerFavoritas, refrescarFavoritas } from "./listas.js";
import { beep } from "./sonido.js";
/* --- ir a una app --- */
export function goto(n) {
  const a = appsOriginales().find((x) => nombreDeApp(x) === n);
  if (!a) return;
  const s = a.closest(".cat");
  if (root.classList.contains("srch")) {
    cajaBusqueda.value = "";
    cajaBusqueda.dispatchEvent(new Event("input"));
  }
  if (DSK()) {
    if (s.classList.contains("min")) setState(s, "normal");
    front(s);
  } else {
    closeMax();
    setState(s, "max");
  }
  s.querySelectorAll(".app.sel").forEach((x) => x.classList.remove("sel"));
  a.classList.add("sel");
  fit();
  setTimeout(() => {
    a.scrollIntoView({ block: "center", behavior: "smooth" });
    a.classList.add("hl");
    setTimeout(() => a.classList.remove("hl"), 3000);
  }, 80);
}

/* --- clics --- */
export function iniciar() {
  document.addEventListener("click", (e) => {
    const t = e.target;
    let b;
    if ((b = t.closest(".star"))) {
      const f = leerFavoritas(),
        n = b.dataset.n,
        i = f.indexOf(n);
      i < 0 ? f.push(n) : f.splice(i, 1);
      guardar("kixki-fav", f);
      refrescarFavoritas();
      beep(i < 0 ? 990 : 440);
      vibrar();
      toast(i < 0 ? "Guardada en favoritas ⭐" : "Quitada de favoritas");
      return;
    }
    if ((b = t.closest("[data-go]"))) {
      goto(b.dataset.go);
      return;
    }
    if ((b = t.closest("[data-cp]"))) {
      copyTxt(b.dataset.cp, "Lista copiada ✓");
      return;
    }
    if ((b = t.closest(".bdg span"))) {
      closeMax();
      cajaBusqueda.value = b.textContent;
      cajaBusqueda.dispatchEvent(new Event("input"));
      return;
    }
    if ((b = t.closest(".x[data-x]"))) {
      $("#" + b.dataset.x).hidden = true;
      return;
    }
    if (t.classList.contains("ovl")) {
      t.hidden = true;
      return;
    }
    const ap = t.closest(".app");
    if (ap && DSK() && !t.closest("a,button") && ap.querySelector("h3")) {
      const s = ap.closest(".cat");
      if (
        s &&
        !s.classList.contains("max") &&
        (!ap.classList.contains("sel") || t.closest(".logo,h3"))
      ) {
        const on = ap.classList.contains("sel");
        s.querySelectorAll(".app.sel").forEach((x) => x.classList.remove("sel"));
        if (!on) ap.classList.add("sel");
        fit();
      }
    }
  });
  cajaBusqueda.addEventListener("input", () => {
    const v = cajaBusqueda.value.trim();
    VENTANAS_ESPECIALES.forEach((id) => (ventanaPorId(id).hidden = !!v));
  });
}
