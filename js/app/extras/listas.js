/*
  Prepara cada app (repositorio, botón ★ de favoritas, etiqueta «Nueva», texto de búsqueda) y llena las ventanas
  especiales «Mis favoritas» y «Novedades». También aplica el modo de logos pixel.
*/

import { guardar, leer } from "../../core/store.js";
import { $, $$, normalizar as nrm } from "../../core/util.js";
import { fit } from "../catalogo/ajuste-texto.js";
import { ICON } from "../catalogo/catalogo.js";
import { root } from "../escritorio/vista.js";
import { FECHA_ALTA, nombreDeApp, appsOriginales, ventanaPorId } from "./base.js";
import { repoOf } from "./enlaces.js";
export let logosPixel, novedades;

let nombresApps, nombresVistos;

export const fijarLogosPixel = (v) => {
  logosPixel = v;
};

export const leerFavoritas = () => leer("kixki-fav", []);

/* --- ventanas especiales --- */
export function ponerContador(id, t) {
  const s = ventanaPorId(id);
  s.querySelector(".chip").textContent = t;
  s.querySelector(".tbn").textContent = t;
  const em = $(`.di[data-id="${id}"] em`);
  if (em) em.textContent = t;
}

export function aplicarLogosPixel() {
  root.classList.toggle("pxl", logosPixel);
  if (!logosPixel) return;
  $$(".logo img").forEach((im) => {
    const go = () => {
      if (!im.naturalWidth) return;
      let c = im.parentElement.querySelector("canvas");
      if (!c) {
        c = document.createElement("canvas");
        c.width = c.height = 20;
        im.after(c);
      }
      try {
        c.getContext("2d").drawImage(im, 0, 0, 20, 20);
      } catch (e) {
        // Imagen ilegible (rota o de otro origen): se deja el cuadro sin pintar.
      }
    };
    im.complete ? go() : im.addEventListener("load", go, { once: true });
  });
}

export function llenarVentana(id, list, empty, ic) {
  const p = ventanaPorId(id).querySelector(".panel");
  p.querySelectorAll(".app").forEach((x) => x.remove());
  if (!list.length)
    p.insertAdjacentHTML(
      "beforeend",
      `<article class="app sel" data-s=""><div class="logo" aria-hidden="true">${ic}</div><div class="info"><p class="desc">${empty}</p></div></article>`
    );
  list.forEach((a) => {
    const c = a.cloneNode(true);
    c.classList.remove("sel", "hl");
    c.hidden = false;
    p.append(c);
  });
  ponerContador(id, `${list.length} ${list.length === 1 ? "app" : "apps"}`);
  aplicarLogosPixel();
  fit();
}

export function refrescarFavoritas() {
  const f = leerFavoritas();
  llenarVentana(
    "favs",
    appsOriginales().filter((a) => f.includes(nombreDeApp(a))),
    "Toca ☆ en una app para guardarla aquí.",
    "☆"
  );
  $$(".star").forEach((b) => {
    const on = f.includes(b.dataset.n);
    b.textContent = on ? "★" : "☆";
    b.setAttribute("aria-pressed", on);
    b.classList.toggle("on", on);
  });
}

export function iniciar() {
  nombresApps = appsOriginales().map(nombreDeApp);
  logosPixel = leer("kixki-px", false);

  nombresVistos = leer("kixki-seen", null);
  novedades = null;
  if (!Array.isArray(nombresVistos)) nombresVistos = null;
  try {
    novedades = JSON.parse(sessionStorage.getItem("kixki-news") || "null");
  } catch (e) {
    // Almacenamiento bloqueado o lleno (modo privado): se sigue sin guardar.
  }
  if (!novedades) {
    novedades = nombresVistos ? nombresApps.filter((n) => !nombresVistos.includes(n)) : [];
    Object.entries(FECHA_ALTA).forEach(([n, d]) => {
      if (Date.now() - Date.parse(d) < 12096e5 && nombresApps.includes(n) && !novedades.includes(n))
        novedades.push(n);
    });
    try {
      sessionStorage.setItem("kixki-news", JSON.stringify(novedades));
    } catch (e) {
      // Almacenamiento bloqueado o lleno (modo privado): se sigue sin guardar.
    }
    guardar("kixki-seen", nombresApps);
  }
  appsOriginales().forEach((a) => {
    const n = nombreDeApp(a),
      r = repoOf(a);
    if (r) {
      a.dataset.repo = r;
      if (
        ![...a.querySelectorAll(".links a")].some((l) => l.href.startsWith("https://github.com/"))
      )
        a.querySelector(".links").insertAdjacentHTML(
          "beforeend",
          `<a class="btn" href="https://github.com/${r}" target="_blank" rel="noopener noreferrer">${ICON.ext}Repositorio</a>`
        );
    }
    const ln = a.querySelector(".line");
    if (novedades.includes(n)) ln.insertAdjacentHTML("beforeend", `<span class="new">Nueva</span>`);
    ln.insertAdjacentHTML(
      "beforeend",
      `<button type="button" class="star" data-n="${n}" aria-label="Guardar en favoritas">☆</button>`
    );
    const bd = a.querySelector(".bdg");
    if (bd) {
      a.dataset.s +=
        " " + [...bd.querySelectorAll("span")].map((x) => nrm(x.textContent)).join(" ");
      if (/Shizuku/.test(bd.textContent))
        bd.insertAdjacentHTML(
          "afterend",
          `<button type="button" class="needz" data-go="Shizuku">Mejor con Shizuku: instálalo primero →</button>`
        );
    }
  });
}
