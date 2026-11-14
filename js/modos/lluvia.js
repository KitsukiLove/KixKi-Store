/* =========================================================
   CLIMA DE LLUVIA
   - Lluvia pixelada sobre cualquier fondo (capa de atrás con gotas lejanas + capa de delante con gotas cercanas).
   - Si no tocas nada durante un rato, las gotas "chocan" con la pantalla, se quedan pegadas y algunas resbalan.
     Pasa el dedo / el ratón por encima para limpiarlas (o espera a que se sequen).
   - Sonido de lluvia sintetizado (WebAudio, sin archivos): impactos de gota, viento, charcos, eco y truenos; se activa con el altavoz de la página; menú «Sonido de lluvia: sí / no».
   - Con el estilo o el fondo XP: lluvia en tres profundidades que se inclina con las ráfagas (igual que el pasto), bruma sobre la colina y relámpagos con trueno que llega con retraso.
   - Menú: «Lluvia: auto / sí / no». En auto llueve de vez en cuando (no con nieve).
   - API: window.KXRAIN  { on(), raining, mode, set(m), start(ms), stop(), glass(), idle(ms) }
   - Avisa con el evento "kixki-rain" → e.detail = {t:"start"|"stop"|"glass"|"wipe", n}
     (kixki2.js lo usa para el incendio de verano y los logros)
   ========================================================= */
import { iniciar as iniciar_control } from "./lluvia/control.js";
import { iniciar as iniciar_estado } from "./lluvia/estado.js";
import { iniciar as iniciar_gotas } from "./lluvia/gotas.js";
import { iniciar as iniciar_kixki } from "./lluvia/kixki.js";
import { iniciar as iniciar_lienzos } from "./lluvia/lienzos.js";
import { iniciar as iniciar_menu } from "./lluvia/menu.js";
import { iniciar as iniciar_modo_xp } from "./lluvia/modo-xp.js";
import { iniciar as iniciar_sonido_ajuste } from "./lluvia/sonido-ajuste.js";
import { iniciar as iniciar_sonido_base } from "./lluvia/sonido-base.js";
import { iniciar as iniciar_visitante } from "./lluvia/visitante.js";
(function () {
  "use strict";
  iniciar_estado();
  iniciar_lienzos();
  iniciar_gotas();
  iniciar_modo_xp();
  iniciar_control();
  iniciar_visitante();
  iniciar_kixki();
  iniciar_sonido_base();
  iniciar_sonido_ajuste();
  iniciar_menu();
})();
