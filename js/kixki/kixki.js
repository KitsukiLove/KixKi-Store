/* =========================================================
   KIXKI · la oveja guía  (parte 1)
   - Vive en la página y se pasea por: la barra de búsqueda, las carpetas del escritorio (PC),
     la fila de carpetas y la barra inferior (móvil), las ventanas abiertas (PC) y el Salta Vallas.
   - Habla (español / English) con globos retro: consejos, ánimos y reacciones a lo que haces.
   - Guarda su memoria en localStorage ("kixki-k"). Se apaga desde el menú Kixki / Más.
   - Todas sus frases pasan por un gestor único (prioridad, categorías, caducidad, enfriamiento, presupuesto):
     ver la sección «gestor de diálogos» más abajo. Depurar: KXK.debug = true · KXK.timeline().
   - (parte 4b) «Kixki: no» = se DUERME (se acuesta donde no estorba, sin hablar ni pasear; si la tocan se despierta un instante con 😠/😴).
     Modo «calladita» = SOLO EMOJIS: ningún globo lleva texto salvo que la toquen o le pidan ayuda (opción words:true de say()).
     enter(id,{fall}) = la coreografía de entrar en la ventana de un minijuego (subir al borde, o caerse dentro en el básquet).
   - Para la parte 2 (logros): avisa de todo con el evento  "kixki-evt"  → e.detail = {t:"folder"|"search"|…}
   Depende de: app.js (avisa con "kixki-ready" y "kixki-game"), i18n.js y music.js.
   ========================================================= */
import { iniciar as iniciar_memoria } from "./oveja/memoria.js";
import { boot } from "./oveja/oveja.js";
(function () {
  "use strict";
  iniciar_memoria();
  const run = () => {
    try {
      boot();
    } catch (e) {
      try {
        console.warn("Kixki:", e);
        const x = document.getElementById("kixki");
        if (x) x.remove();
      } catch (_) {
        // Sin consola disponible no hay nada más que hacer.
      }
    }
  };
  window.KXR ? run() : addEventListener("kixki-ready", run, { once: true });
})();
