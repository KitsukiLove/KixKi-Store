/**
 * main.js — Punto de entrada de Kixki Store (módulo ES nativo, sin build).
 *
 * Responsabilidades:
 *   1. Conectar el estado (state.js) con el DOM: tema, idioma, modo, búsqueda.
 *   2. Cargar traducciones y catálogo (data.js).
 *   3. Registrar los eventos globales (tema, buscador, teclado).
 *   4. Arrancar los módulos de las siguientes partes (con `ctx`).
 *   5. Registrar el service worker.
 *
 * Los módulos nuevos NO importan main.js (evita ciclos): exportan
 * `init(ctx)` y main.js los llama al final de `boot()`.
 */

import * as state from "./state.js";
import * as data from "./data.js";

/* ---------------------------------------------------------------------
   Los módulos de las siguientes partes se importarán aquí:
     import * as sprites from "./sprites.js";   // PARTE 2: helper de <use>
     import * as render  from "./render.js";    // PARTE 2: catálogo y tarjetas
     import * as windows from "./windows.js";   // PARTE 2: ventanas y barra
   --------------------------------------------------------------------- */
const MODULES = [
  // sprites, render, windows, ...
];

/* =====================================================================
   Utilidades DOM
   ===================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Contexto que reciben los módulos: todo lo necesario, sin globales. */
const ctx = Object.freeze({ state, data, $, $$ });

const root = document.documentElement;

/* =====================================================================
   1. Estado → DOM
   Un único lugar que refleja el estado en la página.
   ===================================================================== */

function bindStateToDom() {
  // Tema: atributo + color de la barra del navegador
  state.subscribe("theme", theme => {
    root.setAttribute("data-theme", theme);
    $("#tc")?.setAttribute("content", theme === "dark" ? "#150c33" : "#efe6ff");
  }, { immediate: true });

  // Idioma: atributo lang inmediato; los textos se recargan en `onLangChange`
  state.subscribe("lang", lang => { root.lang = lang; }, { immediate: true });
  state.subscribe("lang", onLangChange);

  // Modo móvil / PC: clase "dsk" (la usa styles.css) y texto del contador
  state.subscribe("mode", mode => {
    root.classList.toggle("dsk", mode === "desktop");
    updateCount();
  }, { immediate: true });

  // Preferencias visuales y búsqueda
  state.subscribe("ui", ui => {
    root.classList.toggle("srch", !!ui.query.trim());
    root.classList.toggle("pxl", ui.pixelLogos);
    ui.accent ? (root.dataset.acc = ui.accent) : root.removeAttribute("data-acc");
  }, { immediate: true });
}

async function onLangChange(lang) {
  await data.setLanguage(lang);
  applyTranslations();
  updateCount();
}

/* =====================================================================
   2. Traducciones del HTML estático
   Uso en index.html:
     <p data-i18n="hero.sub">Texto en español (respaldo sin JS)</p>
     <input data-i18n-attr="placeholder:search.placeholder; aria-label:search.label">
   Si la clave no existe, se deja el texto original.
   ===================================================================== */

function applyTranslations() {
  $$("[data-i18n]").forEach(el => {
    if (data.hasKey(el.dataset.i18n)) el.textContent = data.t(el.dataset.i18n);
  });
  $$("[data-i18n-attr]").forEach(el => {
    el.dataset.i18nAttr.split(";").forEach(pair => {
      const [attr, key] = pair.split(":").map(s => s.trim());
      if (attr && key && data.hasKey(key)) el.setAttribute(attr, data.t(key));
    });
  });
}

/** «40 apps en 6 carpetas. Abre una desde el escritorio.» */
function updateCount() {
  const cat = data.getCatalog();
  const el = $("#count");
  if (!cat || !el) return;
  const key = state.isDesktop() ? "count.desktop" : "count.mobile";
  el.textContent = data.t(key, {
    total: cat.apps.length,
    folders: cat.categories.filter(c => c.apps.length).length,
  });
}

/* =====================================================================
   3. Eventos globales
   Aquí solo van los que no pertenecen a un módulo concreto.
   (Los atajos Ctrl+K, el juego, etc. llegarán con sus módulos.)
   ===================================================================== */

function bindGlobalEvents() {
  // Botón de tema
  $("#tg")?.addEventListener("click", state.toggleTheme);

  // Buscador → estado
  $("#q")?.addEventListener("input", e => state.setQuery(e.target.value));

  // Teclado: «/» enfoca el buscador, Esc cierra la ventana maximizada
  addEventListener("keydown", e => {
    if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      $("#q")?.focus();
    } else if (e.key === "Escape") {
      state.closeMaximized();
    }
  });
}

/* =====================================================================
   4. Arranque
   ===================================================================== */

function showCatalogError() {
  const msg = data.t("error.catalog", null,
    "No se pudo cargar el catálogo. Revisa tu conexión y recarga.");
  $("#app").innerHTML = `<p class="empty">${msg}</p>`;
}

async function boot() {
  bindStateToDom();
  state.watchMode();

  // Traducciones y catálogo se piden en paralelo
  const [, catalog] = await Promise.all([
    data.setLanguage(state.get("lang")),
    data.loadCatalog(),
  ]);

  applyTranslations();

  if (!catalog) {
    showCatalogError();
    return;
  }

  // Ventanas: una por categoría + las especiales (favoritas, novedades, packs)
  state.registerWindows([...catalog.categories.map(c => c.id), ...state.SPECIAL_WINDOWS]);

  // Novedades: calcula `isNew` y recuerda las apps vistas para la próxima visita
  data.resolveNews(catalog.apps, { seen: state.get("seen") });
  state.setSeen(catalog.apps.map(a => a.name));

  updateCount();
  bindGlobalEvents();

  // Módulos de las siguientes partes
  MODULES.forEach(m => m.init?.(ctx));

  state.setReady(true);
  registerServiceWorker();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

boot();

/* =====================================================================
   Exportado para el siguiente paso y para depurar en la consola:
   KX.state.getState(), KX.data.getCatalog(), KX.data.filterApps(...)
   ===================================================================== */

export { ctx, boot };
window.KX = Object.assign(window.KX || {}, ctx);
