/*
  Arranque de la tienda: menú, bienvenida y enganche de todo lo anterior.
*/

import { borrar, leer } from "../../core/store.js";
import { $, $$ } from "../../core/util.js";
import { a11y, announce } from "./accesibilidad.js";
import { decorate } from "./avisos.js";
import { buildTools, labels, recs, renderParati } from "./barra.js";
import { openWizard, stepView } from "./bienvenida.js";
import { nm } from "./comun.js";
import { loadData } from "./datos.js";
import { deepLink } from "./enlace.js";
import { langApps } from "./ingles.js";
import { axApply } from "./letra-grande.js";
import { ORD, sortApps } from "./orden.js";
import { decoratePacks, guideView, viva } from "./packs.js";
import { PRF, prof } from "./perfil.js";
/* ---------- arranque ---------- */
function menuItem() {
  const sm = $("#sm");
  if (!sm || $("#s-prf")) return;
  sm.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="sm" id="s-prf"></button><button type="button" class="sm" id="s-fs"></button><button type="button" class="sm" id="s-hc" aria-pressed="false"></button>`
  );
  axApply();
}

function maybeWelcome() {
  if (PRF()) return;
  if (navigator.webdriver && !/[?&]bienvenida=1/.test(location.search))
    return; /* los navegadores de prueba no la ven, salvo con ?bienvenida=1 */
  let tries = 0;
  const go = () => {
    const b = $("#boot");
    if (b && !b.hidden && tries++ < 20) {
      setTimeout(go, 400);
      return;
    }
    if (PRF() || $$(".ovl:not([hidden])").length) {
      return;
    }
    openWizard();
  };
  setTimeout(go, 1200);
}

async function start() {
  await loadData();
  menuItem();
  a11y();
  buildTools();
  labels();
  const ord = leer("kixki-ord", "orig");
  if (ORD.includes(ord) && ord !== "orig") sortApps(ord);
  decorate();
  renderParati();
  decoratePacks();
  langApps();
  $("#q").addEventListener("input", announce);
  addEventListener("kixki-lang", () => {
    labels();
    decorate();
    renderParati();
    a11y();
    langApps();
    if ($("#kq") && !$("#kq").hidden) viva.G ? guideView() : stepView();
  });
  addEventListener("hashchange", deepLink);
  setTimeout(deepLink, 500);
  maybeWelcome();
  window.KXT = {
    open: openWizard,
    profile: prof,
    reset() {
      borrar("kixki-perfil");
      decorate();
      renderParati();
      labels();
    },
    sort: sortApps,
    recs: () => {
      const p = prof();
      return p ? recs(p).map(nm) : [];
    },
  };
}

export function iniciar() {
  if (window.KXR) start();
  else addEventListener("kixki-ready", start, { once: true });
}
