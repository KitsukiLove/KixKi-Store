/*
  Clics generales del catálogo: botones de ventana (minimizar y maximizar), barra de título, pestañas, «Leer más» y
  botones de copiar.
*/

import { toast } from "./aviso.js";
import { setState } from "./ventanas-cat.js";
/* Clics: copiar enlace y leer más / menos */
export function iniciar() {
  document.addEventListener("click", async (e) => {
    const wb = e.target.closest(".wb");
    if (wb) {
      const sec = wb.closest(".cat");
      const st = sec.classList.contains("min")
        ? "min"
        : sec.classList.contains("max")
          ? "max"
          : "normal";
      if (wb.classList.contains("wmin")) setState(sec, st === "min" ? "normal" : "min");
      else setState(sec, st === "normal" ? "max" : "normal");
      return;
    }
    const tb = e.target.closest(".tb");
    if (tb) {
      const sec = tb.closest(".cat");
      if (sec.classList.contains("min")) setState(sec, "normal");
      return;
    }
    const tab = e.target.closest(".tab");
    if (tab) {
      const sec = document.getElementById(tab.hash.slice(1));
      if (sec && sec.classList.contains("min")) setState(sec, "normal");
    }
    const more = e.target.closest(".more");
    if (more) {
      const d = more.previousElementSibling;
      const open = d.classList.toggle("clamp") === false;
      more.textContent = open ? "Ver menos" : "Leer más";
      more.setAttribute("aria-expanded", open);
      return;
    }
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const t = b.dataset.copy;
    try {
      await navigator.clipboard.writeText(t);
      toast("Enlace de la extensión copiado ✓");
    } catch (_) {
      const x = document.createElement("textarea");
      x.value = t;
      x.setAttribute("readonly", "");
      x.style.position = "fixed";
      x.style.opacity = "0";
      document.body.appendChild(x);
      x.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (_) {
        // Copiar puede estar bloqueado: ok sigue en false y se avisa más abajo.
      }
      x.remove();
      if (ok) toast("Enlace de la extensión copiado ✓");
      else window.open(t, "_blank", "noopener");
    }
  });
}
