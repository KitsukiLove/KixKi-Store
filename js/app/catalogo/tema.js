/*
  Botón de modo claro/oscuro.
*/

import { guardarTexto } from "../../core/store.js";
/* Cambio de tema */
export function iniciar() {
  document.getElementById("tg").addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    const m = document.getElementById("tc");
    if (m) m.setAttribute("content", next === "dark" ? "#150c33" : "#efe6ff");
    guardarTexto("kixki-theme", next);
  });
}
