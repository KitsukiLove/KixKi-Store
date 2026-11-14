/* =========================================================
   KIXKI · parte 4 · cancha secreta de básquet
   - Al lanzar a Kixki 10 veces (arrastrarla y soltarla con impulso), aparece una pestañita
     pegada al borde derecho de la pantalla. Al tocarla se abre «basquet.exe».
   - En la cancha: arrastra a Kixki hacia atrás y suéltala (como una resortera) para lanzarla
     a la canasta. Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro.
   - (parte 4b) Al abrir la ventana Kixki SE CAE dentro (kixki.js → KXK.enter, con tropiezo, golpe y estrellitas; un clic o tecla salta la
     animación; con prefers-reduced-motion solo un fundido corto) y entonces empieza la partida: 5 tiros, con 6 puntos ganas.
   - Kixki está MUY enfadada con quien la lanza: sus frases (inicio, cada lanzamiento, fallo, encesta, racha, último tiro, victoria,
     derrota y despedida) viven en dialogs.js (KXD.TX.bk*, con variantes pícaras «P» y vengativas «V» según el ánimo). En «calladita» solo emojis.
   - Se apoya en kixki.js (KXK) y en kixki3.js, que avisa de cada lanzamiento con el evento «throw».
   - Memoria propia en localStorage («kixki-bk»). En la consola: KXBK.unlock() · KXBK.open() · KXBK.state
   ========================================================= */
import { boot } from "./basket/arranque.js";
import { iniciar as iniciar_arrastre } from "./basket/arrastre.js";
import { iniciar as iniciar_config } from "./basket/config.js";
import { iniciar as iniciar_estado } from "./basket/estado.js";
import { iniciar as iniciar_frases } from "./basket/frases.js";
(function () {
  "use strict";
  iniciar_config();
  iniciar_estado();
  iniciar_frases();
  iniciar_arrastre();
  const run = () => {
    try {
      boot();
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
