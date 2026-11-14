/* =========================================================
   SALTA VALLAS  (antes «Saltaovejas»)
   Juego tipo Dino de Chrome: la oveja corre por un valle y salta vallas.
   - Velocidad que sube poco a poco, huecos aleatorios entre vallas, espera antes de reintentar,
     salto "en cola" (si pulsas un pelín antes de aterrizar, salta al tocar el suelo) y bajada rápida con ↓.
   - Valle con capas (cielo, sol/luna, nubes, montañas, colinas con árboles, vallas lejanas, flores).
     Cambia solo con el tema día/noche y un poco con el fondo (invierno, Halloween).
   - Mismo contrato con Kixki de antes: evento "kixki-game" → start · retry · score · record · over
     y las claves de localStorage "kixki-rec" (récord) y "kixki-gp" (partidas).
   Lo abre app.js con KXG.open(#game).
   ========================================================= */
import { iniciar as iniciar_enganche } from "./vallas/enganche.js";
import { iniciar as iniciar_paleta } from "./vallas/paleta.js";
(function () {
  "use strict";
  iniciar_paleta();
  iniciar_enganche();
})();
