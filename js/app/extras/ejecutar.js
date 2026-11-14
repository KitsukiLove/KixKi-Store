/*
  Diálogo «Ejecutar» (Ctrl/⌘+K): buscador rápido de apps con teclado, el minijuego saltavallas, el código QR
  para abrir la página en el móvil y las pantallas completas de arranque / reposo (Kixki OS).
*/

import { $, $$, normalizar as nrm } from "../../core/util.js";
import { fzPick } from "../catalogo/busqueda-difusa.js";
import { SLEEPR } from "../arte/sprites-extra.js";
import { spr } from "../arte/sprites.js";
import { nombreDeApp, appsOriginales } from "./base.js";
import { goto } from "./acciones-apps.js";
let indiceSeleccion, resultados;

const abrirResultado = (i) => {
  if (!resultados[i]) return;
  $("#run").hidden = true;
  goto(nombreDeApp(resultados[i]));
};

function dibujarResultados() {
  const v = nrm($("#rq").value.trim());
  {
    const L = appsOriginales(),
      F = fzPick(L, v);
    resultados = L.filter((a) => !v || F(a, v)).slice(0, 6);
  }
  indiceSeleccion = Math.min(indiceSeleccion, resultados.length - 1);
  $("#rl").innerHTML =
    resultados
      .map(
        (a, i) =>
          `<li data-i="${i}" class="${i === indiceSeleccion ? "on" : ""}">${nombreDeApp(a)}<small>${a.querySelector(".tag").textContent}</small></li>`
      )
      .join("") || "<li>Sin resultados</li>";
}

export function abrirEjecutar() {
  $("#run").hidden = false;
  $("#rq").value = "";
  indiceSeleccion = 0;
  dibujarResultados();
  $("#rq").focus();
}

export function abrirJuego() {
  const g = $("#game");
  g.hidden = false;
  if (window.KXG) KXG.open(g);
}

export function abrirQR() {
  $("#qr").hidden = false;
  const u = location.href.split("#")[0];
  $("#qrt").textContent = u;
  const draw = () => {
    try {
      const z = qrcode(0, "M");
      z.addData(u);
      z.make();
      const n = z.getModuleCount();
      let r = "";
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          if (z.isDark(i, j)) r += `<rect x="${j + 2}" y="${i + 2}" width="1" height="1"/>`;
      $("#qrb").innerHTML =
        `<svg viewBox="0 0 ${n + 4} ${n + 4}" shape-rendering="crispEdges" width="240" height="240"><rect width="100%" height="100%" fill="#fff"/><g fill="#2a1650">${r}</g></svg>`;
    } catch (e) {
      $("#qrb").textContent = "No se pudo generar el QR.";
    }
  };
  if (window.qrcode) return draw();
  const s = document.createElement("script");
  s.src = "vendor/qrcode.min.js";
  s.onload = draw;
  s.onerror = () => {
    const t = document.createElement("script");
    t.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    t.onload = draw;
    t.onerror = () => {
      $("#qrb").textContent = "No se pudo cargar el generador de QR. Copia el enlace de abajo.";
    };
    document.head.append(t);
  };
  document.head.append(s);
}

export function mostrarPantallaCompleta(kind) {
  const b = $("#boot");
  b.hidden = false;
  b.className = kind;
  b.innerHTML =
    kind === "boot"
      ? `<div class="bc"><img class="lg" src="img/logo.png" width="112" height="112" alt=""><h2>Kixki OS</h2><div class="bar8">${Array.from({ length: 12 }, (_, i) => `<i style="animation-delay:${i * 0.2}s"></i>`).join("")}</div><p>Contando ovejas…</p></div>`
      : `<div class="bc">${spr(SLEEPR, 6)}<p>Kixki OS está durmiendo.<br>Toca para despertar.</p></div>`;
  b.onclick = () => {
    b.hidden = true;
  };
  if (kind === "boot")
    setTimeout(() => {
      b.classList.add("out");
      setTimeout(() => {
        b.hidden = true;
      }, 500);
    }, 2700);
}

export function iniciar() {
  /* --- ventanas emergentes --- */
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="run" class="ovl" hidden><div class="box"><div class="bt">Ejecutar<button type="button" class="x" data-x="run" aria-label="Cerrar">✕</button></div><input id="rq" type="text" placeholder="Escribe el nombre de una app…" autocomplete="off" aria-label="Ejecutar"><ul id="rl"></ul></div></div>
<div id="game" class="ovl" hidden><div class="box"><div class="bt">saltavallas.exe<button type="button" class="x" data-x="game" aria-label="Cerrar">✕</button></div><canvas width="480" height="160" aria-label="Salta Vallas"></canvas><p class="hint">Toca, espacio o ↑ para saltar · ↓ para bajar</p></div></div>
<div id="qr" class="ovl" hidden><div class="box"><div class="bt">Ábrelo en tu móvil<button type="button" class="x" data-x="qr" aria-label="Cerrar">✕</button></div><div id="qrb"></div><p class="hint" id="qrt"></p></div></div><div id="boot" hidden></div>`
  );
  indiceSeleccion = 0;
  resultados = [];

  $("#rq").addEventListener("input", () => {
    indiceSeleccion = 0;
    dibujarResultados();
  });
  $("#rq").addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      indiceSeleccion = Math.min(resultados.length - 1, indiceSeleccion + 1);
      dibujarResultados();
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      indiceSeleccion = Math.max(0, indiceSeleccion - 1);
      dibujarResultados();
      e.preventDefault();
    } else if (e.key === "Enter") abrirResultado(indiceSeleccion);
  });
  $("#rl").addEventListener("click", (e) => {
    const li = e.target.closest("li[data-i]");
    if (li) abrirResultado(+li.dataset.i);
  });
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      abrirEjecutar();
      return;
    }
    if (e.key === "Escape") $$(".ovl,#boot").forEach((x) => (x.hidden = true));
    const g = $("#game");
    if (!g.hidden && (e.key === " " || e.key === "ArrowUp")) {
      e.preventDefault();
      g._j && g._j();
    }
  });
}
