/*
  Enlace directo #app=Nombre.
*/

import { normalizar as nrm } from "../../core/util.js";
import { nm, origs } from "./comun.js";
/* ---------- enlace directo #app=Nombre ---------- */
export function deepLink() {
  const m = location.hash.match(/^#app=(.+)$/);
  if (!m) return;
  let n;
  try {
    n = decodeURIComponent(m[1]);
  } catch (e) {
    return;
  }
  const a = origs().find((x) => nrm(nm(x)) === nrm(n));
  if (!a) return;
  const b = document.createElement("button");
  b.dataset.go = nm(a);
  b.hidden = true;
  document.body.append(b);
  b.click();
  b.remove(); /* app.js ya sabe «ir a una app» */
}
