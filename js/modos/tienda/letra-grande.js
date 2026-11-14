/*
  Letra grande y alto contraste (menú Inicio / Más).
*/

import { guardar, leer } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { texto, root, toast } from "./comun.js";
import { puente } from "./puente.js";

const AXK = "kixki-a11y";

const ax = () => {
  const a = leer(AXK, {});
  return { fs: [0, 1, 2].includes(a.fs) ? a.fs : 0, hc: a.hc === 1 || a.hc === 0 ? a.hc : null };
};

const axHC = (a) =>
  a.hc == null ? window.matchMedia && matchMedia("(prefers-contrast:more)").matches : a.hc === 1;

export function axApply() {
  const a = ax(),
    hc = axHC(a);
  root.classList.toggle("kq-fs1", a.fs === 1);
  root.classList.toggle("kq-fs2", a.fs === 2);
  root.classList.toggle("kq-hc", hc);
  const f = $("#s-fs");
  if (f)
    f.textContent =
      texto("Letra: ", "Text: ") +
      [texto("normal", "normal"), texto("grande", "large"), texto("enorme", "huge")][a.fs];
  const c = $("#s-hc");
  if (c) {
    c.textContent =
      texto("Contraste: ", "Contrast: ") + (hc ? texto("alto", "high") : texto("normal", "normal"));
    c.setAttribute("aria-pressed", String(hc));
  }
}

function axClick(id) {
  const a = ax();
  if (id === "s-fs") {
    a.fs = (a.fs + 1) % 3;
    guardar(AXK, { fs: a.fs, hc: a.hc });
  } else {
    const on = !axHC(a);
    guardar(AXK, { fs: a.fs, hc: on ? 1 : 0 });
  }
  axApply();
  dispatchEvent(new Event("resize")); /* app.js recalcula «Leer más» */
  toast(
    id === "s-fs"
      ? texto("Letra: ", "Text: ") +
          [texto("normal", "normal"), texto("grande", "large"), texto("enorme", "huge")][a.fs]
      : texto("Contraste: ", "Contrast: ") +
          (axHC(ax()) ? texto("alto", "high") : texto("normal", "normal"))
  );
}

puente.axApply = axApply;

puente.axClick = axClick;

export function iniciar() {
  /* ---------- letra grande y alto contraste (menú Inicio / Más) ---------- */

  axApply();
}
