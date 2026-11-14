/* =========================================================
   KIXKI · parte 6 · vaca.exe se rebela  (logro «Apuñalar por la espalda»)
   - Condición: ya tienes el logro oculto de la amistad con vaca.exe y dejas su ventana abierta un rato (75–110 s).
     Primero hay un aviso («vaca.exe está muy callada…»); si sigues con la ventana abierta, la vaca la rompe y sale al escritorio.
   - Combate: la vaca recorre el escritorio y mancha carpetas. Sube la barra de INFECCIÓN (cada carpeta manchada + el paso del tiempo).
     Agarra a Kixki y lánzala contra la vaca (o usa el botón «Lanzar a Kixki» / la tecla L). 5 de vida: golpe normal = 1, por la espalda = 2.
     Un clic en una carpeta manchada la limpia. Violencia de dibujos animados: «bonk», estrellitas, nada gráfico.
   - Gana: la vaca se deshace en píxeles y confeti, logro «Apuñalar por la espalda» y fondo «Colina XP» (scenes.js).
   - Pierde (infección al 100 %): el fondo pasa a «¡Vacas!» (mosaico de vacas bailando). Se quita desde Ajustes («Restaurar fondo»),
     con el botón de la barra o cambiando de fondo; revancha tras un tiempo de espera.
   - Memoria en localStorage «kixki-vb» (intentos, ganado/perdido, espera). El fondo especial vive en «kixki-bgx» (scenes.js).
   - Se apoya en kixki.js (KXK), kixki2.js (logros, KXQ), kixki3.js (física de lanzar, KXK3) y scenes.js (KXB).
   - Consola: KXV.start({force:1}) · KXV.win() · KXV.lose() · KXV.state · KXV.reset()
   ========================================================= */
import { boot } from "./vaca/arranque.js";
import { iniciar as iniciar_combate } from "./vaca/combate.js";
import { iniciar as iniciar_config } from "./vaca/config.js";
import { iniciar as iniciar_estado } from "./vaca/estado.js";
import { iniciar as iniciar_infeccion } from "./vaca/infeccion.js";
import { iniciar as iniciar_lanzar } from "./vaca/lanzar.js";
import { iniciar as iniciar_sonido } from "./vaca/sonido.js";
import { iniciar as iniciar_vaca } from "./vaca/vaca.js";
(function () {
  "use strict";
  iniciar_config();
  iniciar_sonido();
  iniciar_estado();
  iniciar_vaca();
  iniciar_infeccion();
  iniciar_lanzar();
  iniciar_combate();
  let tries = 0;
  const run = () => {
    try {
      if (!boot() && ++tries < 60 && !window.KXV) setTimeout(run, 250);
    } catch (e) {
      try {
        console.warn("Kixki 6:", e);
      } catch (_) {
        // Sin consola disponible no hay nada más que hacer.
      }
    }
  };
  window.KXK ? run() : addEventListener("kixki-ready", run, { once: true });
})();
