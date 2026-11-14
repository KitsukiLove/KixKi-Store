/*
  Atajo de teclado «/» para enfocar el buscador.
*/

import { cajaBusqueda } from "../catalogo/buscador.js";
/* Atajo: / para buscar */
export function iniciar() {
  addEventListener("keydown", (e) => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      cajaBusqueda.focus();
    }
  });
}
