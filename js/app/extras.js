/*
  Extras del escritorio: sonido, novedades, dock, menú de ajustes, ejecutar, mascota, filtros, instalación y avisos.
*/

import { iniciar as iniciar_avisomovil } from "./extras/aviso-movil.js";
import { iniciar as iniciar_base } from "./extras/base.js";
import { iniciar as iniciar_radio } from "./extras/boton-sonido.js";
import { iniciar as iniciar_dock } from "./extras/dock.js";
import { iniciar as iniciar_ejecutar } from "./extras/ejecutar.js";
import { iniciar as iniciar_filtros } from "./extras/filtros.js";
import { iniciar as iniciar_fondos } from "./extras/fondos.js";
import { iniciar as iniciar_github } from "./extras/github-info.js";
import { iniciar as iniciar_instalar } from "./extras/instalar.js";
import { iniciar as iniciar_listas } from "./extras/listas.js";
import { iniciar as iniciar_mascota } from "./extras/contador-ovejas.js";
import { iniciar as iniciar_menu } from "./extras/menu-ajustes.js";
import { iniciar as iniciar_espnav } from "./extras/acciones-apps.js";
import { iniciar as iniciar_packs } from "./extras/packs.js";
import { iniciar as iniciar_sonido } from "./extras/sonido.js";
import { iniciar as iniciar_swreg } from "./extras/sw-registro.js";
import { iniciar as iniciar_sombreros } from "./extras/temporada.js";
export function iniciar() {
  iniciar_base();
  iniciar_sonido();
  iniciar_listas();
  iniciar_packs();
  iniciar_espnav();
  iniciar_dock();
  iniciar_menu();
  iniciar_ejecutar();
  iniciar_sombreros();
  iniciar_mascota();
  iniciar_radio();
  iniciar_fondos();
  iniciar_filtros();
  iniciar_avisomovil();
  iniciar_instalar();
  iniciar_github();
  iniciar_swreg();
}
