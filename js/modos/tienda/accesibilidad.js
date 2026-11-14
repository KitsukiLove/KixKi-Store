/*
  Accesibilidad: nombres únicos en las ☆, ventanas con rol de diálogo, foco y avisos.
*/

import { $, $$ } from "../../core/util.js";
import { texto, origs } from "./comun.js";
let lt, outside, opener;

/* ---------- accesibilidad ---------- */
export function a11y() {
  [
    ["run", "Ejecutar", "Run"],
    ["game", "Salta Vallas", "Jump the fences"],
    ["qr", "Ábrelo en tu móvil", "Open on your phone"],
  ].forEach(([id, es, en]) => {
    const box = $("#" + id + " .box");
    if (box) {
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", texto(es, en));
    }
  });
  const empty = $("#empty");
  if (empty && !empty.getAttribute("role")) empty.setAttribute("role", "status");
  if (!$("#kq-live")) {
    const lv = document.createElement("p");
    lv.id = "kq-live";
    lv.className = "sr";
    lv.setAttribute("role", "status");
    lv.setAttribute("aria-live", "polite");
    document.body.append(lv);
  }
}

export function announce() {
  clearTimeout(lt);
  lt = setTimeout(() => {
    const q = $("#q"),
      lv = $("#kq-live");
    if (!q || !lv) return;
    if (!q.value.trim()) {
      lv.textContent = "";
      return;
    }
    const n = origs().filter((a) => !a.hidden).length;
    lv.textContent = n
      ? texto(
          `${n} ${n === 1 ? "app encontrada" : "apps encontradas"}`,
          `${n} ${n === 1 ? "app found" : "apps found"}`
        )
      : texto("Sin resultados", "No results");
  }, 500);
}

export function iniciar() {
  /* el foco no se escapa de una ventana abierta y vuelve a donde estaba al cerrarla */
  outside = null;
  opener = new WeakMap();
  document.addEventListener("focusin", (e) => {
    if (!e.target.closest(".ovl")) outside = e.target;
  });
  new MutationObserver((ms) =>
    ms.forEach((m) => {
      const o = m.target;
      if (!o.classList || !o.classList.contains("ovl")) return;
      if (!o.hidden) opener.set(o, outside);
      else {
        const el = opener.get(o);
        opener.delete(o);
        if (el && el.isConnected && el.offsetParent !== null && !el.closest(".ovl"))
          try {
            el.focus({ preventScroll: true });
          } catch (x) {
            // focus() falla si el elemento ya no está en el documento; no pasa nada.
          }
      }
    })
  ).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const o = $$(".ovl:not([hidden])").pop();
    if (!o) return;
    const f = [...o.querySelectorAll("button,[href],input,select,textarea,[tabindex]")].filter(
      (x) => !x.disabled && x.tabIndex >= 0 && x.offsetParent !== null
    );
    if (!f.length) return;
    const first = f[0],
      last = f[f.length - 1],
      ac = document.activeElement,
      inside = o.contains(ac);
    if (e.shiftKey && (!inside || ac === first)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (!inside || ac === last)) {
      e.preventDefault();
      first.focus();
    }
  });
}
