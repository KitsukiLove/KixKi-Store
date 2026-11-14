/* =========================================================
   FONDOS · escenas.  Fondos intercambiables en pixel art (Clásico, Valle, Halloween, Navidad…) y la Colina XP
   con sus estaciones. Cada uno cambia de colores solo según el tema día/noche. Publica window.KXB.
   Este archivo solo fija el viewport guardado y arranca, en orden, los módulos de js/modos/escenas/:
   estado → formas → colina-xp → paisajes → estaciones → mundo → arranque.
   ========================================================= */
import { leerTexto } from "../core/store.js";
import { iniciar as iniciar_arranque } from "./escenas/arranque.js";
import { iniciar as iniciar_colina_xp } from "./escenas/colina-xp.js";
import { iniciar as iniciar_estaciones } from "./escenas/estaciones.js";
import { iniciar as iniciar_estado } from "./escenas/estado.js";
import { iniciar as iniciar_formas } from "./escenas/formas.js";
import { iniciar as iniciar_mundo } from "./escenas/mundo.js";
import { iniciar as iniciar_paisajes } from "./escenas/paisajes.js";
const metaViewport = document.querySelector("meta[name=viewport]");
if (metaViewport && leerTexto("kixki-view") === "pc")
  metaViewport.content = "width=1100, viewport-fit=cover";
(function () {
  iniciar_estado();
  iniciar_formas();
  iniciar_colina_xp();
  iniciar_paisajes();
  iniciar_estaciones();
  iniciar_mundo();
  iniciar_arranque();
})();
