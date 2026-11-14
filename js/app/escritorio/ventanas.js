/*
  Ventanas del escritorio: orden de apilado (front), apertura (openWin) y barra de tareas (sm).
*/

import { cajaBusqueda } from "../catalogo/buscador.js";
import { categorias, META } from "../catalogo/datos.js";
import { ICF, ICO, SHEEP, spr } from "../arte/sprites.js";
import { setState, SPOST, SPRE } from "../catalogo/ventanas-cat.js";
import { DSK } from "./vista.js";
export let ventanasCategoria, menuAjustes;

let zActual, ventanaArriba, ventanasAbiertas;

const SPRITE_DORMIDA = [
  "...wwww.wwww......",
  "..wwwwwwwwwwww....",
  ".wwwwwwwwwwwwwfff.",
  "wwwwwwwwwwwwwwfkkf",
  "wwwwwwwwwwwwwwffpf",
  "gwwwwwwwwwwwwwfff.",
  ".gwwwwwwwwwwgg....",
  "..ggggggggggg.....",
  "...ff..ff.........",
];

const SPRITE_ZZ = ["xxxxx", "...x.", "..x..", ".x...", "xxxxx"];

export function sync() {
  ventanasCategoria.forEach((s) => {
    const on = !s.classList.contains("min");
    document.querySelectorAll(`.tk[data-id="${s.id}"]`).forEach((b) => {
      b.classList.toggle("on", on);
      b.classList.toggle("top", on && s === ventanaArriba);
    });
  });
}

export function ventanaSuperior() {
  return ventanaArriba;
}

export function olvidarSuperior() {
  ventanaArriba = null;
}

export function front(s) {
  s.style.setProperty("--z", ++zActual);
  ventanaArriba = s;
  sync();
}

export function openWin(id) {
  const s = document.getElementById(id);
  if (!s) return;
  if (s.classList.contains("min")) setState(s, DSK() ? "normal" : "max");
  front(s);
}

export function iniciar() {
  ventanasCategoria = [...document.querySelectorAll(".cat")];
  zActual = 10;
  ventanaArriba = null;
  ventanasAbiertas = 0;
  ventanasCategoria.forEach((s) => {
    s.dataset.e = categorias.find((c) => c.id === s.id).e;
  });
  document.body.insertAdjacentHTML(
    "beforeend",
    `<nav id="desk" aria-label="Escritorio">${categorias.map((c) => `<button type="button" class="di" data-id="${c.id}" data-e="${c.e}" style="--h:${META[c.id][1]}">${spr(ICF[c.id] || ICO[c.id], ICF[c.id] ? 4 : 5)}<span>${META[c.id][0]}</span><em>${c.a.length} ${c.a.length === 1 ? "app" : "apps"}</em></button>`).join("")}</nav>
<div id="pet" aria-hidden="true"><div class="pi"><span class="pa">${spr(SHEEP, 4)}</span><span class="ps">${spr(SPRITE_DORMIDA, 4)}</span>${[2, 3, 4].map((n, i) => `<i class="zz" style="--zd:-${i * 1.2}s">${spr(SPRITE_ZZ, n)}</i>`).join("")}</div></div>
<div id="sm" hidden><button type="button" class="sm" id="smt">Día / noche</button><button type="button" class="sm" id="sma">Cerrar todas</button></div>
<div id="taskbar"><button type="button" class="start" id="st">${spr(SHEEP, 2)}Kixki</button>${categorias.map((c) => `<button type="button" class="tk" data-id="${c.id}" title="${META[c.id][0]}" style="--h:${META[c.id][1]}">${spr(ICO[c.id], 2)}<span>${META[c.id][0]}</span></button>`).join("")}<div class="tray"><span>Hecho con ♥ por KitsukiLove</span><b id="clk"></b></div></div>`
  );
  menuAjustes = document.getElementById("sm");
  SPRE.push((s, t) => {
    if (!DSK() && t === "normal" && !cajaBusqueda.value.trim()) t = "min";
    if (t !== "min" && !s.dataset.p) {
      s.dataset.p = 1;
      s.style.setProperty("--x", 150 + (ventanasAbiertas % 6) * 40 + "px");
      s.style.setProperty("--y", 34 + (ventanasAbiertas % 6) * 34 + "px");
      ventanasAbiertas++;
    }
    return t;
  });
  SPOST.push(() => sync());
}
