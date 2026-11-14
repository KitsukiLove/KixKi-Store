/*
  Arranque de la página: catálogo + escritorio. Es el ORQUESTADOR: aquí se ve, en orden, qué se prepara y cuándo.

  Cada paso es un módulo con su propio iniciar(). El orden importa: varias etapas leen el texto en español de lo recién
  dibujado, y cederHilo() (solo en español) deja pintar entre etapas pesadas para que la página no se congele.
  Al terminar avisa con window.KXR = 1 y el evento «kixki-ready»: Kixki espera esa señal para arrancar.

  Necesita: todo js/app/*.   Publica: iniciarApp().
*/

import { enIngles } from "../core/util.js";
import { iniciar as iniciar_ajuste } from "./catalogo/ajuste-texto.js";
import { iniciar as iniciar_aviso } from "./catalogo/aviso.js";
import { iniciar as iniciar_buscador } from "./catalogo/buscador.js";
import { iniciar as iniciar_catalogo } from "./catalogo/catalogo.js";
import { cederHilo } from "./ceder.js";
import { iniciar as iniciar_clics } from "./catalogo/clics.js";
import { iniciar as iniciar_datos } from "./catalogo/datos.js";
import { iniciar as iniciar_escena } from "./arte/escena-cabecera.js";
import { iniciar as iniciar_escritorio } from "./escritorio.js";
import { iniciar as iniciar_extras } from "./extras.js";
import { iniciar as iniciar_navegacion } from "./catalogo/navegacion.js";
import { iniciar as iniciar_parpadeo } from "./arte/parpadeo.js";
import { iniciar as iniciar_tema } from "./catalogo/tema.js";
import { iniciar as iniciar_ventanas } from "./catalogo/ventanas-cat.js";
import { iniciar as iniciar_especiales } from "./catalogo/ventanas-especiales.js";
export async function iniciarApp() {
  if (!(await iniciar_datos())) return;
  iniciar_escena();
  iniciar_parpadeo();
  if (!enIngles()) await cederHilo();
  iniciar_catalogo();
  iniciar_ajuste();
  iniciar_aviso();
  iniciar_ventanas();
  iniciar_tema();
  iniciar_clics();
  iniciar_buscador();
  iniciar_navegacion();
  if (!enIngles()) await cederHilo();
  iniciar_especiales();
  if (!enIngles()) await cederHilo();
  iniciar_escritorio();
  if (!enIngles()) await cederHilo();
  iniciar_extras();
  /* Todo listo: Kixki (kixki.js) y sus logros (kixki2.js) arrancan con este aviso */
  window.KXR = 1;
  dispatchEvent(new Event("kixki-ready"));
}
