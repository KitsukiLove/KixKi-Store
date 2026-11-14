/* =========================================================
   KIXKI · la oveja guía  (parte 3: pícara, traviesa y con físicas)
   - Personalidad: chismes, teorías conspirativas, confesiones del código y el «plan de toma de control».
   - Travesuras al azar (se apagan en el menú): cambia el fondo si llevas mucho rato con el mismo,
     y «cierra» una ventana al azar (a veces estando ella encima…).
   - Físicas: puedes agarrar a Kixki y moverla por toda la página; al soltarla cae y rebota.
     Si está sobre una ventana y la mueves o la cierras, se cae y se enfada.
   - Cuenta los lanzamientos con impulso (evento «throw»): a los 10 aparece la cancha secreta de básquet (basket.js).
   - Se apoya en kixki.js (KXK) y kixki2.js. Memoria propia en localStorage («kixki-k3»).
   - En la consola: KXK3.bg() · KXK3.close() · KXK3.scene("gossip"|"conspi"|"code"|"plan"|"sass") · KXK3.state
   ========================================================= */
import { iniciar as iniciar_memoria } from "./pica/memoria.js";
import { boot } from "./pica/pica.js";
(function () {
  "use strict";
  iniciar_memoria();
  const run = () => {
    try {
      boot();
    } catch (e) {
      try {
        console.warn("Kixki 3:", e);
      } catch (_) {
        // Sin consola disponible no hay nada más que hacer.
      }
    }
  };
  window.KXK ? run() : addEventListener("kixki-ready", run, { once: true });
})();
