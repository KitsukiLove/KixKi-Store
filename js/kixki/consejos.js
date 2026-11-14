/* =========================================================
   KIXKI · etapa 4 · pedirle consejo sobre una carpeta
   - Mantén pulsada una carpeta (~500 ms; en PC también clic derecho, en móvil la ficha de la carpeta) y aparece
     el botón flotante «🐑 Pedir ayuda a Kixki» junto al icono.
   - Al pulsarlo, Kixki salta a esa carpeta (visitFolder) y da UN consejo propio de ella, distinto cada vez:
     escrito a mano (ADV.<carpeta> en dialogs.js) o armado con apps reales de esa carpeta (nombre, etiqueta, aviso).
   - Detalles: el clic que sigue a mantener pulsado NO abre la carpeta · si el dedo se mueve (scroll) se cancela ·
     el menú contextual del móvil queda desactivado en las carpetas · teclado: tecla de menú o Mayús + F10 sobre una
     carpeta enfocada · lectores de pantalla: el botón recibe el foco, Esc lo cierra y devuelve el foco.
   - Sin llamadas externas (la CSP no las permite). Memoria propia en localStorage («kixki-k4»).
   - Avisa con el evento «advice» (e.detail = {id, n, count, total}); kixki2.js lo cuenta para los logros
     «Consejera» (3 carpetas) y «Sabelotodo» (todas).
   - En la consola: KXK4.open("privacidad") · KXK4.ask("privacidad") · KXK4.advice("fotos") · KXK4.state
   Se apoya en kixki.js (KXK) y dialogs.js (KXD.ADV).
   ========================================================= */
import { iniciar as iniciar_arranque } from "./consejos/arranque.js";
import { iniciar as iniciar_boton } from "./consejos/boton.js";
import { iniciar as iniciar_config } from "./consejos/config.js";
import { iniciar as iniciar_consejo } from "./consejos/consejo.js";
import { preparar } from "./consejos/estado.js";
import { iniciar as iniciar_pulsar } from "./consejos/pulsar.js";
(function () {
  "use strict";
  iniciar_config();
  const run = () => {
    try {
      if (!preparar()) return;
      iniciar_boton();
      iniciar_pulsar();
      iniciar_consejo();
      iniciar_arranque();
    } catch (e) {
      try {
        console.warn("Kixki 4:", e);
      } catch (_) {
        // Sin consola disponible no hay nada más que hacer.
      }
    }
  };
  window.KXK ? run() : addEventListener("kixki-ready", run, { once: true });
})();
