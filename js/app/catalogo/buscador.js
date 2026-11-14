/*
  Buscador de apps: filtra mientras escribes y sugiere correcciones.
*/

import { normalizar as nrm } from "../../core/util.js";
import { fit } from "./ajuste-texto.js";
import { fzPick, fzSuggest } from "./busqueda-difusa.js";
import { setState } from "./ventanas-cat.js";
export let cajaBusqueda;

let empty;

export function iniciar() {
  cajaBusqueda = document.getElementById("q");
  empty = document.getElementById("empty");
  cajaBusqueda.addEventListener("input", () => {
    const v = nrm(cajaBusqueda.value.trim());
    const F = fzPick([...document.querySelectorAll(".cat .app")], v);
    let any = false;
    document.querySelectorAll(".cat").forEach((s) => {
      let n = 0;
      s.querySelectorAll(".app").forEach((a) => {
        const m = !v || F(a, v);
        a.hidden = !m;
        if (m) n++;
      });
      if (v && n && s.classList.contains("min")) setState(s, "normal");
      s.hidden = !n;
      if (n) any = true;
    });
    empty.hidden = any;
    if (!any) {
      const t = cajaBusqueda.value.trim(),
        sg = fzSuggest(v),
        en = window.KXI && KXI.lang === "en",
        esc = (x) =>
          x.replace(
            /[&<>"]/g,
            (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]
          );
      empty.innerHTML =
        (en
          ? `No apps found for «${esc(t)}». Try another word.`
          : `No encontré apps con «${esc(t)}». Prueba con otra palabra.`) +
        (sg
          ? ` <button type="button" class="dym" data-q="${esc(sg)}">${en ? "Did you mean" : "¿Quisiste decir"} «${esc(sg)}»?</button>`
          : "");
    }
    fit();
  });
  empty.addEventListener("click", (e) => {
    const b = e.target.closest(".dym");
    if (!b) return;
    cajaBusqueda.value = b.dataset.q;
    cajaBusqueda.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
