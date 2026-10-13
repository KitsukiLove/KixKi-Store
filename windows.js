/**
 * windows.js — Ventanas flotantes, modales y modo Móvil / PC de Kixki Store.
 *
 * Todo se deriva de state.js (state.windows, state.mode, state.ui.menuOpen):
 *   1. Ventanas: aplica state.windows al DOM (clases, posición, z-index, barra de
 *      tareas), arrastre con puntero, doble clic, deslizar para cerrar en móvil.
 *   2. Búsqueda: abre las ventanas con resultados; en móvil las pliega al limpiar.
 *   3. Menú Kixki y barra inferior: ejecutan las acciones (data-act / data-k).
 *   4. Modales: registerModal / openModal / closeModal con foco atrapado, Esc y
 *      bloqueo de scroll. Incluye «Ejecutar» (Ctrl+K). Los extras (juego, QR,
 *      apagado…) se enchufan con registerModal() desde los módulos de la Parte 3.
 *   5. Modo Móvil / PC: selector manual + aviso que recomienda el «modo escritorio».
 *
 * Importa de render.js (nunca al revés): T, esc, toast… y el evento kx:goto.
 */

import * as state from "./state.js";
import * as data from "./data.js";
import { icon, defineSprite } from "./sprites.js";
import { T, esc, emit, toast, vib, scheduleFit, syncMenu, available } from "./render.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const root = document.documentElement;

const SUGGEST_URL = "https://github.com/KitsukiLove/KixKi-Store/issues/new?template=sugerir-app.yml&title=";

/* =====================================================================
   1. Ventanas: state.windows → DOM
   ===================================================================== */

function applyWindow(id, w, top) {
  const el = document.getElementById(id);
  if (!el) return;
  if (w.state === "max" && !el.classList.contains("max")) el.style.minHeight = el.offsetHeight + "px";
  el.classList.toggle("min", w.state === "min");
  el.classList.toggle("max", w.state === "max");
  el.dataset.state = w.state;
  if (w.state !== "max") el.style.minHeight = "";
  if (w.x != null) { el.style.setProperty("--x", w.x + "px"); el.style.setProperty("--y", w.y + "px"); }
  if (w.z) el.style.setProperty("--z", w.z);

  const bmin = $(".wmin", el), bmax = $(".wmax", el);
  bmin?.setAttribute("aria-label", w.state === "min" ? T("win.restore", "Restaurar ventana") : T("win.min", "Minimizar ventana"));
  bmax?.setAttribute("aria-label",
    w.state === "max" ? T("win.unmax", "Restaurar tamaño de la ventana")
      : w.state === "min" ? T("win.restore", "Restaurar ventana") : T("win.max", "Maximizar ventana"));
  $("use", bmax)?.setAttribute("href", w.state === "max" ? "#ui-restore" : "#ui-max");

  const open = w.state !== "min";
  $$(`.tk[data-id="${id}"]`).forEach(b => {
    b.classList.toggle("on", open);
    b.classList.toggle("top", open && id === top);
  });
}

/** Aplica solo lo que cambió (o todo con force=true, p. ej. tras reconstruir el DOM). */
function syncAll(force = false, prev = null) {
  const w = state.getState().windows;
  for (const [id, cur] of Object.entries(w.items)) {
    const before = prev?.items[id];
    const topChanged = prev && prev.top !== w.top && (id === prev.top || id === w.top);
    if (force || !before || before !== cur || topChanged) applyWindow(id, cur, w.top);
  }
  $("#scrim").hidden = !state.hasMaximized();
  syncLock();
  scheduleFit();
}

const openModals = [];   // pila de ids de modales abiertos
const syncLock = () => root.classList.toggle("lock", state.hasMaximized() || openModals.length > 0);

/* =====================================================================
   2. Ir a una app y búsqueda
   ===================================================================== */

export function goToApp(id) {
  const app = data.getCatalog()?.byId.get(id);
  if (!app) return;
  const ui = state.getState().ui;
  if (ui.query || ui.filters.length) { state.setQuery(""); state.clearFilters(); }

  const win = app.category;
  if (state.isDesktop()) state.openWindow(win);
  else { state.closeMaximized(); state.setWindowState(win, "max"); state.focusWindow(win); }

  const card = $(`#${CSS.escape(win)} .app[data-id="${CSS.escape(id)}"]`);
  if (!card) return;
  $$(".app.sel:not(.pack)", card.closest(".cat")).forEach(x => x.classList.remove("sel"));
  card.classList.add("sel");
  scheduleFit();
  setTimeout(() => {
    card.scrollIntoView({ block: "center", behavior: "smooth" });
    card.classList.add("hl");
    setTimeout(() => card.classList.remove("hl"), 3000);
  }, 80);
}

function onUi(ui, prev) {
  if (ui.menuOpen !== prev.menuOpen) syncMenuState();
  if (ui.query === prev.query) return;
  const { items } = state.getState().windows;
  if (ui.query.trim()) {
    // render.js ya marcó las tarjetas visibles: abre las ventanas con resultados
    for (const [id, w] of Object.entries(items)) {
      if (w.state === "min" && !state.SPECIAL_WINDOWS.includes(id) && $(`#${CSS.escape(id)} .app:not([hidden])`)) {
        state.setWindowState(id, "normal");
      }
    }
  } else if (!state.isDesktop()) {
    // sin búsqueda, en móvil «normal» no existe: state lo convierte en «min»
    for (const [id, w] of Object.entries(items)) if (w.state === "normal") state.setWindowState(id, "normal");
  }
}

function syncMenuState() {
  const open = state.getState().ui.menuOpen;
  const sm = $("#sm");
  if (sm) sm.hidden = !open;
  $("#st")?.setAttribute("aria-expanded", open);
  $('#dock [data-k="menu"]')?.setAttribute("aria-expanded", open);
}

/* =====================================================================
   3. Clics, arrastre, teclado y gestos
   ===================================================================== */

function menuAction(act) {
  switch (act) {                       // estos NO cierran el menú: se pueden encadenar
    case "theme": state.toggleTheme(); return;
    case "accent": state.cycleAccent(); return;
    case "bg": window.KXB?.next?.(); syncMenu(); return;
    case "pixel": state.togglePixelLogos(); return;
    case "lang": state.setLang(state.get("lang") === "es" ? "en" : "es"); return;
    case "sfx": state.toggleSfx(); return;
    case "music": state.toggleMusic(); return;
  }
  state.setMenuOpen(false);
  if (act === "closeall") state.closeAllWindows();
  else if (act === "suggest") window.open(SUGGEST_URL + encodeURIComponent(T("suggest.title", "Sugerencia: ")), "_blank", "noopener");
  else openModal(act);
}

function dockAction(k) {
  vib();
  if (k === "theme") { state.toggleTheme(); return; }
  if (k === "menu") { state.setMenuOpen(!state.getState().ui.menuOpen); return; }
  state.setMenuOpen(false);
  state.closeMaximized();
  if (k === "fav") { state.openWindow("favs"); return; }
  scrollTo({ top: 0, behavior: "smooth" });
  if (k === "srch") setTimeout(() => $("#q")?.focus(), 250);
}

function onClick(e) {
  const t = e.target;
  let b;

  if ((b = t.closest(".x[data-x]"))) { closeModal(b.dataset.x); return; }
  if ((b = t.closest("[data-view]"))) { chooseView(b.dataset.view); return; }
  if ((b = t.closest("[data-tip]"))) { tipAction(b.dataset.tip); return; }

  if ((b = t.closest(".wb"))) {
    const id = b.closest(".cat").id, cur = state.getWindow(id)?.state;
    if (b.classList.contains("wmin")) state.setWindowState(id, cur === "min" ? "normal" : "min");
    else state.toggleMaximize(id);
    return;
  }
  if ((b = t.closest(".di, #sm .sm[data-id]"))) { state.openWindow(b.dataset.id); state.setMenuOpen(false); vib(6); return; }
  if ((b = t.closest(".tk"))) {
    const id = b.dataset.id, w = state.getWindow(id), top = state.getState().windows.top;
    if (w.state === "min") state.openWindow(id);
    else if (id === top) state.minimizeWindow(id);
    else state.focusWindow(id);
    return;
  }
  if ((b = t.closest(".tab"))) { state.openWindow(b.hash.slice(1)); return; }   // el enlace hace el scroll
  if (t.closest("#st")) { state.setMenuOpen(!state.getState().ui.menuOpen); return; }
  if ((b = t.closest("#sm [data-act]"))) { menuAction(b.dataset.act); return; }
  if ((b = t.closest("#dock button"))) { dockAction(b.dataset.k); return; }
  if (!t.closest("#sm")) state.setMenuOpen(false);
}

let drag = null;

function bindWindowGestures() {
  $("#scrim").addEventListener("click", state.closeMaximized);

  document.addEventListener("pointerdown", e => {
    const el = e.target.closest(".cat");
    if (!el) return;
    if (state.getState().windows.top !== el.id) state.focusWindow(el.id);
    const tb = e.target.closest(".tb");
    if (!state.isDesktop() || e.button > 0 || !tb || e.target.closest(".wb") || el.classList.contains("max")) return;
    const r = el.getBoundingClientRect();
    drag = { el, id: el.id, dx: e.clientX - r.left, dy: e.clientY - r.top, x: r.left, y: r.top };
    tb.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  document.addEventListener("pointermove", e => {
    if (!drag) return;
    drag.x = Math.max(0, Math.min(innerWidth - 140, e.clientX - drag.dx));
    drag.y = Math.max(0, Math.min(innerHeight - 110, e.clientY - drag.dy));
    drag.el.style.setProperty("--x", drag.x + "px");   // durante el arrastre solo CSS; el estado se guarda al soltar
    drag.el.style.setProperty("--y", drag.y + "px");
  });
  const endDrag = () => {
    if (!drag) return;
    const d = drag;
    drag = null;
    state.moveWindow(d.id, d.x, d.y);
  };
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);

  document.addEventListener("dblclick", e => {
    const tb = e.target.closest(".cat .tb");
    if (tb && state.isDesktop() && !e.target.closest(".wb")) state.toggleMaximize(tb.closest(".cat").id);
  });

  // Móvil: deslizar hacia abajo desde la barra de título cierra la hoja
  let y0 = null;
  document.addEventListener("touchstart", e => {
    y0 = !state.isDesktop() && e.target.closest(".cat.max .tb") ? e.touches[0].clientY : null;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    if (y0 != null && e.changedTouches[0].clientY - y0 > 70) { state.closeMaximized(); vib(6); }
    y0 = null;
  }, { passive: true });
}

function trapFocus(e) {
  const box = $(`#${CSS.escape(openModals.at(-1))} .box`);
  const f = $$("button, input, a[href], [tabindex]:not([tabindex='-1'])", box).filter(x => !x.disabled && !x.hidden && x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f.at(-1);
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function bindKeys() {
  // Fase de captura: si hay un modal o el menú abierto, Esc es suyo y no cierra ventanas
  addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openModal("run"); return; }
    if (e.key === "Escape") {
      if (openModals.length) { e.stopPropagation(); closeModal(); return; }
      if (state.getState().ui.menuOpen) { e.stopPropagation(); state.setMenuOpen(false); }
      return;
    }
    if (e.key === "Tab" && openModals.length) trapFocus(e);
  }, true);
}

/** Puente con music.js / scenes.js (globales KXM / KXB) hasta que la Parte 3 los modularice. */
function bindLegacyToggles() {
  const tm = $("#tm"), tb = $("#tb");
  tm?.addEventListener("click", state.toggleMusic);
  tb?.addEventListener("click", () => {
    window.KXB?.next?.();
    syncMenu();
    toast(`${T("menu.bg", "Fondo")}: ${window.KXB?.label?.() ?? T("bg.classic", "Clásico")}`);
  });
  state.subscribe("audio", (a, prev) => {
    tm?.classList.toggle("on", a.music);
    tm?.setAttribute("aria-pressed", a.music);
    if (a.music === prev.music) return;
    const M = window.KXM;
    if (M && !!M.on !== a.music) M.toggle();
    toast(a.music
      ? (root.dataset.theme === "dark" ? T("toast.musicNight", "♪ Música de noche") : T("toast.musicDay", "♪ Música de día"))
      : T("toast.musicOff", "Música apagada"));
  }, { immediate: true });
}

/* =====================================================================
   4. Modales
   def = { title: string | () => string,
           build(body, {close, el})  // una sola vez, al crearse
           open(body, params)        // cada vez que se abre
           close(body)               // al cerrarse
           focus(body) → elemento    // a quién darle el foco (por defecto, la caja) }
   ===================================================================== */

const registry = new Map();
const restoreFocus = new Map();

export function registerModal(id, def) {
  registry.set(id, def);
  available.add(id);
  $$(`#sm [data-act="${id}"]`).forEach(b => { b.hidden = false; });
}

export function openModal(id, params) {
  const def = registry.get(id);
  if (!def || openModals.includes(id)) return;

  let el = document.getElementById(id);
  const fresh = !el;
  if (fresh) {
    el = document.createElement("div");
    el.id = id;
    el.className = "ovl";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", `${id}-t`);
    el.innerHTML = `<div class="box" tabindex="-1"><div class="bt"><span id="${id}-t"></span><button type="button" class="x" data-x="${id}" aria-label="${esc(T("modal.close", "Cerrar"))}">✕</button></div><div class="mbody"></div></div>`;
    el.addEventListener("click", ev => { if (ev.target === el) closeModal(id); });
    document.body.append(el);
  }
  const body = $(".mbody", el);
  if (fresh) def.build?.(body, { close: () => closeModal(id), el });

  $(`#${id}-t`).textContent = typeof def.title === "function" ? def.title() : (def.title ?? id);
  restoreFocus.set(id, document.activeElement);
  state.setMenuOpen(false);
  el.hidden = false;
  openModals.push(id);
  syncLock();
  def.open?.(body, params);
  (def.focus?.(body) || $(".box", el)).focus?.();
  emit("kx:modal", { id, open: true });
}

export function closeModal(id = openModals.at(-1)) {
  const i = openModals.indexOf(id);
  if (i < 0) return;
  openModals.splice(i, 1);
  const el = document.getElementById(id);
  el.hidden = true;
  registry.get(id)?.close?.($(".mbody", el));
  syncLock();
  restoreFocus.get(id)?.focus?.();
  emit("kx:modal", { id, open: false });
}

/** «Ejecutar» (Ctrl+K): escribe y salta a una app. */
function registerRun() {
  let input, list, rows = [], idx = 0;

  const draw = () => {
    rows = data.filterApps(data.getCatalog().apps, { query: input.value }).slice(0, 6);
    idx = Math.max(0, Math.min(idx, rows.length - 1));
    list.innerHTML = rows.length
      ? rows.map((a, i) => {
        const l = data.localizeApp(a);
        return `<li role="option" data-i="${i}" aria-selected="${i === idx}" class="${i === idx ? "on" : ""}">${esc(l.name)}<small>${esc(l.tag)}</small></li>`;
      }).join("")
      : `<li>${esc(T("run.empty", "Sin resultados"))}</li>`;
  };
  const exec = i => { const a = rows[i]; if (a) { closeModal("run"); goToApp(a.id); } };

  registerModal("run", {
    title: () => T("run.title", "Ejecutar"),
    build(body) {
      body.innerHTML = `<input id="rq" type="text" autocomplete="off" aria-label="${esc(T("run.title", "Ejecutar"))}" placeholder="${esc(T("run.placeholder", "Escribe el nombre de una app…"))}"><ul id="rl" role="listbox"></ul>`;
      input = $("#rq", body);
      list = $("#rl", body);
      input.addEventListener("input", () => { idx = 0; draw(); });
      input.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") { idx = Math.min(rows.length - 1, idx + 1); draw(); e.preventDefault(); }
        else if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); draw(); e.preventDefault(); }
        else if (e.key === "Enter") exec(idx);
      });
      list.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) exec(+li.dataset.i); });
    },
    open() { input.value = ""; input.placeholder = T("run.placeholder", "Escribe el nombre de una app…"); idx = 0; draw(); },
    focus: () => input,
  });
}

/* =====================================================================
   5. Modo Móvil / PC y aviso de «modo escritorio»
   La interfaz de escritorio necesita ≥1000 px de ancho (state.DESKTOP_QUERY).
   En un móvil, «PC» cambia el <meta viewport> a 1280 px: el navegador reorganiza la
   página a ese ancho, la media query se cumple y state.watchMode() pasa solo a
   «desktop». Si el navegador ignora el cambio, se avisa y se vuelve a automático.
   «Móvil» en una pantalla grande se fuerza con state.setMode("mobile").
   La preferencia se guarda en localStorage ("kixki-view").
   ===================================================================== */

const PHONE = [".xxxx.", "x....x", "x....x", "x....x", "x....x", "x....x", "x....x", "x.xx.x", ".xxxx."];
const MONITOR = ["xxxxxxxxx", "x.......x", "x.......x", "x.......x", "x.......x", "xxxxxxxxx", "...xxx...", "..xxxxx.."];

const VIEW_KEY = "kixki-view";
const mq = matchMedia(state.DESKTOP_QUERY);
const vpMeta = $('meta[name="viewport"]');
const VP_DEFAULT = vpMeta?.getAttribute("content") || "width=device-width, initial-scale=1";
const VP_PC = "width=1280, viewport-fit=cover";
const isSmallScreen = () => Math.min(screen.width, screen.height) < 700;

const readPref = () => { try { const v = localStorage.getItem(VIEW_KEY); return v === "pc" || v === "mobile" ? v : null; } catch (_) { return null; } };
const savePref = v => { try { v ? localStorage.setItem(VIEW_KEY, v) : localStorage.removeItem(VIEW_KEY); } catch (_) { /* sin almacenamiento */ } };
let pref = readPref();   // "pc" | "mobile" | null (automático)

function applyView(next) {
  pref = next;
  savePref(next);
  const small = isSmallScreen();
  if (vpMeta && small) vpMeta.setAttribute("content", next === "pc" ? VP_PC : VP_DEFAULT);
  if (next === "mobile") state.setMode("mobile");
  else if (!(next === "pc" && small)) state.setMode(mq.matches ? "desktop" : "mobile");   // en móvil lo decide la media query
  mountSwitch();
  if (next === "pc" && small) setTimeout(verifyPc, 700);
}

function verifyPc() {
  if (pref !== "pc" || mq.matches) return;
  applyView(null);
  toast(T("view.fail", "Tu navegador no permite este modo. Activa «Sitio de escritorio» en su menú."));
  updateTip(true);
}

/** Tocar el modo que ya es el natural del dispositivo = volver a automático. */
function chooseView(v) {
  const natural = isSmallScreen() ? "mobile" : "pc";
  applyView(v === natural ? null : v);
}

function mountSwitch() {
  $("#viewsw")?.remove();
  const desktop = state.getState().mode === "desktop";
  const btn = (v, sprite, key, fb) =>
    `<button type="button" data-view="${v}" aria-pressed="${desktop === (v === "pc")}">${icon(sprite, 2)}<span>${esc(T(key, fb))}</span></button>`;
  const host = desktop ? $("#taskbar .tray") : $("#quick");
  host?.insertAdjacentHTML("afterbegin",
    `<div id="viewsw" role="group" aria-label="${esc(T("view.label", "Modo de visualización"))}">${btn("mobile", "ui-phone", "view.mobile", "Móvil")}${btn("pc", "ui-monitor", "view.pc", "PC")}</div>`);
}

const TIP_KEY = "kixki-dsk-tip";
const tipDismissed = () => { try { return !!(localStorage.getItem(TIP_KEY) || sessionStorage.getItem(TIP_KEY)); } catch (_) { return false; } };
function dismissTip(forever) {
  try { (forever ? localStorage : sessionStorage).setItem(TIP_KEY, "1"); } catch (_) { /* ignorar */ }
  $("#dsk-tip")?.remove();
}
function tipAction(a) {
  if (a === "try") { dismissTip(false); applyView("pc"); }
  else dismissTip(a === "never");
}

/** Aviso (no bloqueante) en móviles táctiles que aún están en modo móvil. */
function updateTip(force = false) {
  const el = $("#dsk-tip");
  const show = state.getState().mode === "mobile" && isSmallScreen() && matchMedia("(pointer:coarse)").matches && (force || !tipDismissed());
  if (!show) { el?.remove(); return; }
  if (el) return;
  document.body.insertAdjacentHTML("beforeend", `<div id="dsk-tip" role="status">
  <b>${esc(T("tip.title", "Kixki OS se ve mejor en modo escritorio"))}</b>
  <p>${esc(T("tip.body", "Activa «Sitio de escritorio» (o «Versión para ordenador») en el menú de tu navegador para ver las ventanas, la oveja y los secretos. O pruébalo aquí mismo."))}</p>
  <div class="tip-btns"><button type="button" class="btn p" data-tip="try">${esc(T("tip.try", "Probar modo PC"))}</button><button type="button" class="btn" data-tip="later">${esc(T("tip.later", "Ahora no"))}</button><button type="button" class="never" data-tip="never">${esc(T("tip.never", "No volver a mostrar"))}</button></div>
</div>`);
}

function onMode(mode) {
  if (pref === "mobile" && mode === "desktop") { state.setMode("mobile"); return; }
  const { items } = state.getState().windows;
  if (mode === "desktop") {
    // al llegar a PC siempre hay una ventana abierta (como al arrancar el escritorio)
    if (!Object.values(items).some(w => w.state !== "min")) {
      const first = data.getCatalog().categories.find(c => c.apps.length);
      if (first) state.openWindow(first.id);
    }
  } else {
    for (const [id, w] of Object.entries(items)) if (w.state === "normal") state.setWindowState(id, "normal");   // → «min»
  }
  mountSwitch();
  updateTip();
}

/* =====================================================================
   6. Arranque
   ===================================================================== */

export function init() {
  defineSprite("ui-phone", PHONE);
  defineSprite("ui-monitor", MONITOR);
  registerRun();

  state.subscribe("windows", (w, prev) => syncAll(false, prev));
  state.subscribe("ui", onUi);
  state.subscribe("mode", onMode, { immediate: true });

  document.addEventListener("click", onClick);
  document.addEventListener("kx:goto", e => goToApp(e.detail.id));
  document.addEventListener("kx:rendered", () => { syncAll(true); syncMenuState(); mountSwitch(); });
  bindWindowGestures();
  bindKeys();
  bindLegacyToggles();

  syncAll(true);
  syncMenuState();
  mountSwitch();
  if (pref) applyView(pref);
  setTimeout(() => updateTip(), 1500);

  window.KX = Object.assign(window.KX || {}, { windows: { openModal, closeModal, registerModal, goToApp, applyView } });
}
