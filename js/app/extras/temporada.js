/*
  Sombrero de temporada para la oveja (Halloween, Navidad, San Valentín) según la fecha o ?temp=… en la URL, y la
  lluvia de ovejas.
*/

import { $ } from "../../core/util.js";
import { toast } from "../catalogo/aviso.js";
import { rects, spr } from "../arte/sprites.js";
let fecha, mes, dia, temporada;

/* --- temporadas --- */
const SOMBREROS = {
  halloween: [["...m..", "..mm..", ".hhhhh", "hhhhhh", ".hhhhs"], "#ff8a1e"],
  navidad: [["...ww", "..hhw", ".hhhh", "hhhhh", "wwwww"], "#e8394d"],
  amor: [["p.p.p", ".ppp.", "..p.."], "#ff8fc7"],
  valle: [["p.w.p.", "mmmmmm"], "#8bdc72"],
  primavera: [["p.y.p.", "mmmmmm"], "#ff8fc7"],
  verano: [["..hh..", ".hhhh.", "yyyyyy"], "#e8b84a"],
  otono: [["...m..", ".hhhh.", "hhhhhh"], "#c4560f"],
  invierno: [["..ww..", ".hhhh.", "hhhhhh", "wwwwww"], "#4a7fd8"],
};

function vestirOveja() {
  document.querySelectorAll("#pet .hat,#scene-art .hatg").forEach((e) => e.remove());
  const k = document.documentElement.getAttribute("data-bg") || temporada,
    T = Object.prototype.hasOwnProperty.call(SOMBREROS, k) ? SOMBREROS[k] : null;
  if (T) {
    const dh = 5 - T[0].length;
    $("#pet .pa").insertAdjacentHTML(
      "beforeend",
      `<span class="hat" style="--h:${T[1]};top:${-13 + dh * 3}px">${spr(T[0], 3)}</span>`
    );
    $("#scene-art").insertAdjacentHTML(
      "beforeend",
      `<g class="hatg" style="--h:${T[1]}">${rects(T[0], 49, 12 + dh)}</g>`
    );
  }
}

export function rain() {
  toast("¡Lluvia de ovejas! 🐑");
  for (let i = 0; i < 28; i++) {
    const e = document.createElement("i");
    e.className = "rain";
    e.textContent = "🐑";
    e.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 1.5}s;font-size:${18 + Math.random() * 22}px`;
    document.body.append(e);
    setTimeout(() => e.remove(), 4200);
  }
}

export function iniciar() {
  fecha = new Date();
  mes = fecha.getMonth() + 1;
  dia = fecha.getDate();
  temporada =
    new URLSearchParams(location.search).get("temp") ||
    ((mes === 10 && dia >= 10) || (mes === 11 && dia <= 2)
      ? "halloween"
      : mes === 12 || (mes === 1 && dia <= 6)
        ? "navidad"
        : mes === 2 && dia >= 7 && dia <= 14
          ? "amor"
          : "");
  vestirOveja();
  addEventListener("kixki-bg", vestirOveja);
}
