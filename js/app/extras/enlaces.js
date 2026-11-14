/*
  Copiar texto al portapapeles (con aviso) y sacar el repositorio de GitHub de una app a partir de sus enlaces.
*/

import { toast } from "../catalogo/aviso.js";

/* --- mejoras por app --- */
export const repoOf = (a) => {
  for (const l of a.querySelectorAll(".links a")) {
    const m =
      l.href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/) ||
      l.href.match(/[?&]repo=([^\/&]+)\/([^&]+)/);
    if (m) return m[1] + "/" + m[2];
  }
  return "";
};

/* solo suena si la ventana cambió de estado de verdad */
export function copyTxt(t, msg) {
  const bad = () => toast("No se pudo copiar. Cópialo a mano.");
  try {
    navigator.clipboard.writeText(t).then(() => toast(msg), bad);
  } catch (e) {
    bad();
  }
}
