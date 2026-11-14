/*
  Registro del service worker (sw.js) con aviso «Hay una versión nueva» y, en PC, la pantalla de arranque
  de Kixki OS (una vez por sesión).
*/

import { DSK } from "../escritorio/vista.js";
import { mostrarPantallaCompleta } from "./ejecutar.js";
/* --- PWA y arranque --- */
export function iniciar() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    const had =
      !!navigator.serviceWorker
        .controller; /* ya había una versión instalada: si cambia, avisamos (antes había que recargar 2 veces sin saberlo) */
    navigator.serviceWorker.register("sw.js").catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!had || document.getElementById("upd")) return;
      const en = window.KXI && KXI.lang === "en",
        b = document.createElement("div");
      b.id = "upd";
      b.className = "toast show";
      b.setAttribute("role", "status");
      b.innerHTML = `<span>${en ? "A new version is available." : "Hay una versión nueva."}</span><button type="button">${en ? "Reload" : "Recargar"}</button>`;
      b.querySelector("button").onclick = () => location.reload();
      document.body.append(b);
    });
  }
  try {
    if (
      DSK() &&
      !matchMedia("(prefers-reduced-motion:reduce)").matches &&
      !sessionStorage.getItem("kixki-boot")
    ) {
      sessionStorage.setItem("kixki-boot", "1");
      mostrarPantallaCompleta("boot");
    }
  } catch (e) {
    // Almacenamiento bloqueado o lleno (modo privado): se sigue sin guardar.
  }
}
