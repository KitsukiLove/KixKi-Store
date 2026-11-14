/* Kixki Store · tienda.js
   Mejoras de tienda y accesibilidad, en un archivo aparte para no tocar la lógica de app.js:
   1) Preguntas de bienvenida (tipo de usuaria, root/Shizuku/ADB, versión de Android, intereses) → «Para ti» y avisos en cada app.
   2) Orden (A–Z, más estrellas, más actualizadas) y filtros («Solo las que puedo usar», «Me faltan»).
   3) «Ya la tengo» en cada app y «Copiar enlace» (abre la app con #app=Nombre).
   4) Accesibilidad: nombres únicos en las ☆, ventanas con rol de diálogo, foco que no se escapa, aviso de resultados.
   Estado en localStorage: kixki-perfil, kixki-have, kixki-ord. Textos [español, English] (se actualizan con el evento kixki-lang).
   Prueba: tools/test-tienda.mjs (los navegadores automáticos no ven la bienvenida salvo con ?bienvenida=1). */
import { iniciar as iniciar_accesibilidad } from "./tienda/accesibilidad.js";
import { iniciar as iniciar_arranque } from "./tienda/arranque.js";
import { iniciar as iniciar_avisos } from "./tienda/avisos.js";
import { iniciar as iniciar_bienvenida } from "./tienda/bienvenida.js";
import { iniciar as iniciar_comun } from "./tienda/comun.js";
import { iniciar as iniciar_datos } from "./tienda/datos.js";
import { iniciar as iniciar_ingles } from "./tienda/ingles.js";
import { iniciar as iniciar_letra_grande } from "./tienda/letra-grande.js";
import { iniciar as iniciar_orden } from "./tienda/orden.js";
import { iniciar as iniciar_packs } from "./tienda/packs.js";
import { iniciar as iniciar_perfil } from "./tienda/perfil.js";
(function () {
  "use strict";
  iniciar_comun();
  iniciar_datos();
  iniciar_perfil();
  iniciar_avisos();
  iniciar_orden();
  iniciar_bienvenida();
  iniciar_letra_grande();
  iniciar_ingles();
  iniciar_packs();
  iniciar_accesibilidad();
  iniciar_arranque();
})();
