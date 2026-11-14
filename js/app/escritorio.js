/*
  Escritorio «Kixki OS»: ventanas que se traen al frente, vista PC/móvil, menú inferior.
*/

import { iniciar as iniciar_sugerida } from "./escritorio/app-del-dia.js";
import { iniciar as iniciar_arrastre } from "./escritorio/arrastre.js";
import { iniciar as iniciar_atajo } from "./escritorio/atajo-buscar.js";
import { iniciar as iniciar_burbujas } from "./escritorio/burbujas.js";
import { iniciar as iniciar_etiquetas } from "./escritorio/etiquetas.js";
import { iniciar as iniciar_modo, setView } from "./escritorio/modo.js";
import { iniciar as iniciar_paseo } from "./escritorio/paseo.js";
import { iniciar as iniciar_reloj } from "./escritorio/reloj.js";
import { front, iniciar as iniciar_ventanas, openWin, menuAjustes } from "./escritorio/ventanas.js";
import { DSK, root } from "./escritorio/vista.js";
export function iniciar() {
  iniciar_ventanas();
  iniciar_arrastre();
  iniciar_reloj();
  iniciar_paseo();
  iniciar_burbujas();
  iniciar_etiquetas();
  iniciar_sugerida();
  iniciar_atajo();
  iniciar_modo();
  document.getElementById("vw").addEventListener("click", () => setView(DSK() ? "movil" : "pc"));
  window.KX = { front, openWin, DSK, root, sm: menuAjustes, setView };
}
