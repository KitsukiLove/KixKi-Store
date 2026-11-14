/*
  Filtros por etiqueta (chips bajo el buscador) y arrastre horizontal con ratón en la barra de pestañas y los chips.
*/

import { $, $$, normalizar as nrm } from "../../core/util.js";
import { cajaBusqueda } from "../catalogo/buscador.js";
let chips, barraPestanas;

const cuentaPorEtiqueta = {};

/* Con ratón: rueda y arrastre desplazan las etiquetas (en táctil ya se desliza con el dedo) */
function hscroll(el) {
  let d = null,
    mv = 0;
  el.addEventListener(
    "wheel",
    (e) => {
      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    },
    { passive: false }
  );
  el.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button) return;
    d = { x: e.clientX, l: el.scrollLeft };
    mv = 0;
  });
  addEventListener("pointermove", (e) => {
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      mv = 1;
      el.classList.add("drag");
    }
    if (mv) el.scrollLeft = d.l - dx;
  });
  addEventListener("pointerup", () => {
    d = null;
    el.classList.remove("drag");
  });
  el.addEventListener(
    "click",
    (e) => {
      if (mv) {
        e.stopPropagation();
        e.preventDefault();
        mv = 0;
      }
    },
    true
  );
}

export function iniciar() {
  $$(".bdg span").forEach((x) => {
    const t = x.textContent;
    cuentaPorEtiqueta[t] = (cuentaPorEtiqueta[t] || 0) + 1;
  });
  chips = document.createElement("div");
  chips.className = "chips";
  chips.setAttribute("role", "group");
  chips.setAttribute("aria-label", "Filtros");
  chips.innerHTML = Object.keys(cuentaPorEtiqueta)
    .sort((x, y) => cuentaPorEtiqueta[y] - cuentaPorEtiqueta[x])
    .map(
      (t) =>
        `<button type="button" class="chip fl" data-f="${t}" aria-pressed="false"><span>${t}</span><b>${cuentaPorEtiqueta[t]}</b></button>`
    )
    .join("");
  $("#searchbox").insertAdjacentElement("afterend", chips);
  hscroll(chips);
  barraPestanas = document.getElementById("nav");
  if (barraPestanas) hscroll(barraPestanas);
  document.addEventListener(
    "click",
    (e) => {
      const x = e.target.closest(".bdg span,.chips .fl");
      if (!x) return;
      e.stopImmediatePropagation();
      const f = x.dataset.f || KXI.orig(x);
      cajaBusqueda.value = nrm(cajaBusqueda.value.trim()) === nrm(f) ? "" : f;
      cajaBusqueda.dispatchEvent(new Event("input", { bubbles: true }));
    },
    true
  );
  cajaBusqueda.addEventListener("input", () =>
    $$(".chip.fl").forEach((c) =>
      c.setAttribute("aria-pressed", nrm(cajaBusqueda.value.trim()) === nrm(c.dataset.f))
    )
  );
  document.addEventListener("visibilitychange", () =>
    document.documentElement.classList.toggle("pz", document.hidden)
  );
}
