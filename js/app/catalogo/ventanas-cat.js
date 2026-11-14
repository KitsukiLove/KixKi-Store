/*
  Estados de cada ventana de categoría: minimizada, normal y maximizada.
*/

import { fit } from "./ajuste-texto.js";
import { SPR_MAX, SPR_RES } from "./catalogo.js";

let scrim;

export const SPRE = [];

export const SPOST = [];

export const closeMax = () => {
  const m = document.querySelector(".cat.max");
  if (m) setState(m, "normal");
};

export function setState(sec, st) {
  for (const f of SPRE) {
    const r = f(sec, st);
    if (r) st = r;
  }
  const wasMax = sec.classList.contains("max");
  if (st === "max" && !wasMax) sec.style.minHeight = sec.offsetHeight + "px";
  sec.classList.remove("min", "max");
  if (st === "min" || st === "max") sec.classList.add(st);
  if (st !== "max") sec.style.minHeight = "";
  const bmin = sec.querySelector(".wmin"),
    bmax = sec.querySelector(".wmax");
  bmin.setAttribute("aria-label", st === "min" ? "Restaurar ventana" : "Minimizar ventana");
  bmax.setAttribute(
    "aria-label",
    st === "max"
      ? "Restaurar tamaño de la ventana"
      : st === "min"
        ? "Restaurar ventana"
        : "Maximizar ventana"
  );
  bmax.innerHTML = st === "max" ? SPR_RES : SPR_MAX;
  const anyMax = !!document.querySelector(".cat.max");
  scrim.hidden = !anyMax;
  document.documentElement.classList.toggle("lock", anyMax);
  fit();
  SPOST.forEach((f) => f(sec, st));
}

export function iniciar() {
  /* Ventanas: normal, minimizada (solo la barra) o maximizada (pantalla completa) */
  scrim = document.getElementById("scrim");

  document.querySelectorAll(".cat").forEach((sec) => setState(sec, "min"));

  scrim.addEventListener("click", closeMax);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMax();
  });
}
