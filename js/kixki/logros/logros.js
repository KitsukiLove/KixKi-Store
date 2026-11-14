/*
  Kixki (parte 2): logros, charla con la ovejita, paraguas, fuego, vaca y modo hacker.
*/

import { iniciar as iniciar_anuncios } from "./anuncios.js";
import { iniciar as iniciar_avisos } from "./avisos.js";
import { iniciar as iniciar_barrido } from "./barrido.js";
import { iniciar as iniciar_base } from "./base.js";
import { iniciar as iniciar_charla } from "./charla.js";
import { iniciar as iniciar_consejos } from "./consejos.js";
import { iniciar as iniciar_contexto } from "./contexto.js";
import { iniciar as iniciar_eventos } from "./eventos.js";
import { iniciar as iniciar_fuego } from "./fuego.js";
import { iniciar as iniciar_hacker } from "./hacker.js";
import { iniciar as iniciar_ovejita } from "./ovejita.js";
import { iniciar as iniciar_panel } from "./panel.js";
import { iniciar as iniciar_paraguas } from "./paraguas.js";
import { iniciar as iniciar_vaca } from "./vaca-amiga.js";
/* =========================================================  ARRANQUE  */
export function boot() {
  if (window.KXQ || !window.KXK) return;
  iniciar_base();
  iniciar_contexto();
  iniciar_avisos();
  iniciar_anuncios();
  iniciar_panel();
  iniciar_eventos();
  iniciar_consejos();
  iniciar_ovejita();
  iniciar_charla();
  iniciar_paraguas();
  iniciar_fuego();
  iniciar_vaca();
  iniciar_barrido();
  iniciar_hacker();
}
