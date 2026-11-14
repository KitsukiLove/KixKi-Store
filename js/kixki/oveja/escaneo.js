/*
  Escaneo del escritorio: detecta ventanas, carpetas y cambios de la página para actualizar las plataformas.
*/

import { $, $$, idioma as lang, wait } from "../../core/util.js";
import { brain, greet } from "./cerebro.js";
import { el } from "./elemento.js";
import { scan } from "./entrada-juego.js";
import { K, place, V } from "./estado.js";
import { S, save } from "./memoria.js";
import { candidates, geo, home, hop, usable } from "./movimiento.js";
import { announce, pose, restId, restX } from "./sueno.js";
import { TEXTOS_UI } from "./textos.js";

const relScan = (t) => {
  if (t.nodeType !== 1 || t.closest("#kixki")) return false;
  return (
    t.id === "app" ||
    t.classList.contains("cat") ||
    t.classList.contains("ovl") ||
    t.id === "bask" ||
    t.parentNode === document.body
  );
};

/* ---------- aparece ---------- */
export async function start() {
  for (let i = 0; i < 24 && $("#boot:not([hidden])"); i++) await wait(300);
  scan();
  /* (parte 2) la carpeta que la página abre sola en PC cuenta como abierta; si no, «abrir todas» sería imposible */
  $$("#app .cat:not(.min)").forEach((x) => {
    if (!S.opened.includes(x.id)) S.opened.push(x.id);
  });
  save();
  const id = home(),
    g = geo(id) || geo(candidates()[0]);
  K.ready = true;
  if (!g) {
    brain(5000);
    return;
  } /* sin plataforma al arrancar: antes se quedaba sin cerebro; ahora lo reintenta (think→relocate) */
  if (!S.on) {
    /* (4b) la dejaron dormida: aparece ya acostada, sin tour ni saludo */
    await wait(40); /* deja que kixki3 registre «floor» */
    const rid = restId(),
      sid = usable(rid) ? rid : id,
      g2 = geo(sid) || g;
    K.stage = sid;
    K.x = restX(sid, g2);
    K.y = g2.y(K.x);
    place();
    if (!K.off) el.classList.remove("kk-off");
    pose(true);
    announce(TEXTOS_UI.zzSr[lang() === "en" ? 1 : 0]);
    return;
  }
  K.x = (g.a + g.b) / 2;
  K.y = -70;
  place();
  if (S.on && !K.off) el.classList.remove("kk-off");
  await wait(350);
  await hop(id, (g.a + g.b) / 2);
  brain(7000);
  greet();
}

export function iniciar() {
  /* solo despierta a scan() si cambia algo que le importa (ventanas .cat, #app, capas .ovl/#bask, hijos directos del body);
     antes cualquier clase de toda la página (fondos animados, la propia Kixki…) la ejecutaba con ~10 consultas al DOM cada vez */

  new MutationObserver((recs) => {
    if (V.scanQ) return;
    for (let i = 0; i < recs.length; i++)
      if (relScan(recs[i].target)) {
        V.scanQ = requestAnimationFrame(scan);
        return;
      }
  }).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "hidden"],
  });
  scan();
}
