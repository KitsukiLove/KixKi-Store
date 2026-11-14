/*
  Kixki (parte 3): pícara, traviesa y con físicas.
*/

import { iniciar as iniciar_agarrar } from "./agarrar.js";
import { iniciar as iniciar_base } from "./base.js";
import { iniciar as iniciar_caida } from "./caida.js";
import { iniciar as iniciar_charla } from "./charla.js";
import { iniciar as iniciar_ganchos } from "./ganchos.js";
import { iniciar as iniciar_menu } from "./menu.js";
import { iniciar as iniciar_plataformas } from "./plataformas.js";
import { iniciar as iniciar_reloj } from "./reloj.js";
import { iniciar as iniciar_travesuras } from "./travesuras.js";
import { iniciar as iniciar_ventanas } from "./ventanas.js";
/* =========================================================  ARRANQUE  */
export function boot() {
  if (window.KXK3 || !window.KXK || !KXK.ex) return;
  if (iniciar_base() === false) return;
  iniciar_plataformas();
  iniciar_agarrar();
  iniciar_caida();
  iniciar_ventanas();
  iniciar_travesuras();
  iniciar_charla();
  iniciar_reloj();
  iniciar_menu();
  iniciar_ganchos();
}
