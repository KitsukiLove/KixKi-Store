/*
  Dibuja el catálogo: pestañas, ventanas por categoría, tarjetas de apps y logos.
*/

import { normalizar as nrm } from "../../core/util.js";
import { categorias, META } from "./datos.js";
import { logos } from "./logos.js";
import { ICO, spr, iconosUI } from "../arte/sprites.js";
export let nav, total;

let app;

const LOGOS = [];

export const SPR_MIN = spr(iconosUI.min, 2),
  SPR_MAX = spr(iconosUI.max, 2),
  SPR_RES = spr(iconosUI.restore, 2);

export const ICON = {
  ext: spr(iconosUI.ext, 2),
  copy: spr(iconosUI.copy, 2),
  play: spr(iconosUI.play, 2),
};

export function iniciar() {
  nav = document.getElementById("nav");
  app = document.getElementById("app");
  total = 0;
  document.getElementById("searchbox").insertAdjacentHTML("afterbegin", spr(iconosUI.search, 2));
  document.getElementById("heart").innerHTML = spr(iconosUI.heart, 2);
  document.getElementById("tg").innerHTML =
    spr(iconosUI.moon, 3, "ic-moon") + spr(iconosUI.sun, 3, "ic-sun");
  categorias.forEach((c) => {
    const [short, hue] = META[c.id];
    total += c.a.length;
    nav.insertAdjacentHTML(
      "beforeend",
      `<a class="tab" href="#${c.id}" style="--h:${hue}">${spr(ICO[c.id], 2)}<span>${short}</span></a>`
    );
    let h = `<section class="cat min" id="${c.id}" style="--h:${hue}"><div class="panel"><div class="tb"><span class="tbi" aria-hidden="true">${spr(ICO[c.id], 2)}</span><span class="tbt">${short}.exe</span><span class="tbn">${c.a.length} ${c.a.length === 1 ? "app" : "apps"}</span><span class="tbb"><button type="button" class="wb wmin" aria-label="Minimizar ventana">${SPR_MIN}</button><button type="button" class="wb wmax" aria-label="Maximizar ventana">${SPR_MAX}</button></span></div><div class="ph"><span class="ico" aria-hidden="true">${spr(ICO[c.id], 3)}</span><div class="tx"><h2>${c.t}</h2><p>${c.s}</p></div><span class="chip">${c.a.length} ${c.a.length === 1 ? "app" : "apps"}</span></div>`;
    c.a.forEach((a) => {
      const k = LOGOS.push(logos(a)) - 1;
      const links = a[3]
        .map((l, j) => {
          const label = l[0] === "Play" ? "Google Play" : l[0];
          const cls = "btn" + (j === 0 ? " p" : "");
          if (/\.json($|\?)/.test(l[1])) {
            return `<button type="button" class="${cls}" data-copy="${l[1]}" aria-label="Copiar el enlace de la extensión">${ICON.copy}${label}</button>`;
          }
          const ic = /youtu/.test(l[1]) ? ICON.play : ICON.ext;
          return `<a class="${cls}" href="${l[1]}" target="_blank" rel="noopener noreferrer">${ic}${label}</a>`;
        })
        .join("");
      h += `<article class="app" data-s="${nrm(a[0] + " " + a[1] + " " + a[2]).replace(/"/g, "")}">
      <div class="logo" data-i="${a[0].charAt(0).toUpperCase()}"><img data-k="${k}" alt="" width="56" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
      <div class="info">
        <div class="line"><h3>${a[0]}</h3><span class="tag">${a[1]}</span></div>
        <p class="desc clamp">${a[2]}</p><button type="button" class="more" aria-expanded="false" hidden>Leer más</button>
        ${a[4] ? `<div class="tip"><span class="bang">${spr(iconosUI.bang, 2)}</span><span>${a[4]}</span></div>` : ""}
        <div class="links">${links}</div>
      </div>
    </article>`;
    });
    app.insertAdjacentHTML("beforeend", h + "</div></section>");
  });
  document.getElementById("count").textContent =
    `${total} apps en ${categorias.length} ventanas. Toca una para abrirla.`;
  /* Logos: prueba cada enlace en orden; si todos fallan, muestra la inicial */
  document.querySelectorAll(".logo img").forEach((img) => {
    const list = LOGOS[+img.dataset.k];
    if (!list.length) {
      img.parentElement.classList.add("fail");
      return;
    }
    let i = 0;
    img.addEventListener("error", () => {
      i++;
      if (i < list.length) img.src = list[i];
      else img.parentElement.classList.add("fail");
    });
    img.src = list[0];
  });
}
