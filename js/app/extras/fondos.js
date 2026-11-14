/*
  Botón de fondo (#bgb): cambia la estación del fondo (o el fondo, en el mundo de las vacas) usando KXB.
*/

import { $ } from "../../core/util.js";
import { toast } from "../catalogo/aviso.js";
import { rotularMenu } from "./menu-ajustes.js";

/* Botón discreto para cambiar de fondo */
const BGI = [
  "hhhhhhhhhh",
  "h.....hh.h",
  "h........h",
  "h...h....h",
  "h..hhh.h.h",
  "h.hhhhhhhh",
  "hhhhhhhhhh",
];

const bgt = () => {
  $("#bgb").title = "Cambiar estación · " + KXB.full();
};

export function iniciar() {
  $("#bgb").innerHTML =
    `<svg viewBox="0 0 10 7" width="20" height="14" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${BGI.map((l, y) => [...l].map((c, x) => (c === "h" ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "")).join("")).join("")}</svg>`;

  bgt();
  $("#bgb").addEventListener("click", () => {
    if (KXB.world() === "vacas") KXB.next();
    else KXB.nextSeason();
    rotularMenu();
    bgt();
    toast((KXB.world() === "vacas" ? "Fondo: " : "Estación: ") + KXB.full());
  });
}
