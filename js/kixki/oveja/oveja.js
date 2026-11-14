/*
  Kixki (parte 1): la oveja guía.
*/

import { iniciar as iniciar_arranque } from "./arranque.js";
import { iniciar as iniciar_cerebro } from "./cerebro.js";
import { iniciar as iniciar_elemento } from "./elemento.js";
import { iniciar as iniciar_entrada } from "./entrada-juego.js";
import { iniciar as iniciar_escaneo } from "./escaneo.js";
import { iniciar as iniciar_estado } from "./estado.js";
import { iniciar as iniciar_eventos } from "./eventos.js";
import { iniciar as iniciar_globo } from "./globo.js";
import { iniciar as iniciar_interaccion } from "./interaccion.js";
import { iniciar as iniciar_modos } from "./modos.js";
import { iniciar as iniciar_movimiento } from "./movimiento.js";
import { iniciar as iniciar_sueno } from "./sueno.js";
import { iniciar as iniciar_utilidades } from "./utilidades.js";
/* =========================================================  ARRANQUE  */
export function boot() {
  if (window.KXK) return;
  iniciar_utilidades();
  iniciar_elemento();
  iniciar_estado();
  iniciar_movimiento();
  iniciar_modos();
  iniciar_globo();
  iniciar_cerebro();
  iniciar_eventos();
  iniciar_interaccion();
  iniciar_sueno();
  iniciar_entrada();
  iniciar_escaneo();
  iniciar_arranque();
}
