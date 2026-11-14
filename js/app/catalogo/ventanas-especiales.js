/*
  Crea las ventanas especiales vacías (Mis favoritas, Novedades y Packs) clonando una categoría. Otros módulos
  (extras/listas.js y extras/packs.js) las rellenan.
*/

import { categorias, META } from "./datos.js";
import { BOX, NEWI, STAR } from "../arte/sprites-extra.js";
import { ICO, spr } from "../arte/sprites.js";
export function iniciar() {
  const tpl = document.querySelector(".cat");
  [
    ["favs", "⭐", "Mis favoritas", "Las apps que marcaste con ☆", "Favoritas", "#ffc23a", STAR],
    ["news", "🆕", "Novedades", "Apps nuevas desde tu última visita", "Novedades", "#ff7a59", NEWI],
    [
      "packs",
      "🎁",
      "Packs",
      "Listas para instalar varias apps de una vez",
      "Packs",
      "#4ccf9b",
      BOX,
    ],
  ].forEach(([id, e, t, s, sh, hue, ic]) => {
    categorias.push({ id, e, t, s, a: [] });
    META[id] = [sh, hue];
    ICO[id] = ic;
    const x = tpl.cloneNode(true);
    x.id = id;
    x.style.setProperty("--h", hue);
    x.hidden = false;
    x.querySelectorAll(".app").forEach((n) => n.remove());
    x.querySelector(".tbt").textContent = sh + ".exe";
    x.querySelector(".tbi").innerHTML = spr(ic, 2);
    x.querySelector(".ico").innerHTML = spr(ic, 3);
    x.querySelector("h2").textContent = t;
    x.querySelector(".ph p").textContent = s;
    document.getElementById("app").append(x);
  });
}
