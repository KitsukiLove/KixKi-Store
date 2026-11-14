/* =========================================================
   KIXKI · la oveja guía  (parte 2)
   - LOGROS: Kixki te felicita («¡Eres muy pro, no lo olvides!») cuando haces cosas como romper tu récord en el
     Salta Vallas, abrir todas las carpetas, buscar, guardar favoritas, cambiar de fondo… En PC y en móvil.
     Aviso con tarjeta arriba + confeti + Kixki celebrando. Se ven en el menú Kixki / Más → «Logros».
   - CHARLA: en PC, Kixki baja a hablar con la ovejita que camina sola abajo (cada rato, o desde el menú,
     o cuando le haces muchas cosquillas a la ovejita). De noche la encuentra dormida.
   - PISTAS: de vez en cuando Kixki te susurra qué logro te queda más cerca.
   - PARAGUAS: cuando empieza a llover, Kixki baja a ver a la ovejita de abajo (solo PC) y le baja un paraguas para que no se moje.
     Se queda sobre ella mientras llueva y se recoge solo al parar. Probar: KXQ.umbrella(true) (hace llover) / KXQ.umbrella(false)
   - EASTER EGG «Modo Hacker»: si abres la consola (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C) o el inspector, Kixki se pone lentes y
     sudadera con capucha y te saluda en su globo. Al cerrar el inspector, vuelve a ser la de siempre. Probar: KXQ.hacker(true/false)
   - Todo se guarda en localStorage ("kixki-a"). API para pruebas en la consola: KXQ.list(), KXQ.grant("id"), KXQ.reset()
   Depende de: kixki.js (parte 1: evento "kixki-evt", window.KXK) y app.js (evento "kixki-game").
   ========================================================= */
import { iniciar as iniciar_definiciones } from "./logros/definiciones.js";
import { iniciar as iniciar_estado } from "./logros/estado.js";
import { boot } from "./logros/logros.js";
(function () {
  "use strict";
  iniciar_definiciones();
  iniciar_estado();
  const run = () => {
    try {
      boot();
    } catch (e) {
      try {
        console.warn("Kixki 2:", e);
      } catch (_) {
        // Sin consola disponible no hay nada más que hacer.
      }
    }
  };
  window.KXK ? run() : addEventListener("kixki-ready", run, { once: true });
})();
