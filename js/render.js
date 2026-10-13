/**
 * render.js — Catálogo, ventanas, tarjetas y botones principales de Kixki Store.
 *
 * Pinta (todo desde data.js y state.js, nada se queda en variables sueltas):
 *   1. Ventanas: una por categoría + las especiales (favs, news, packs).
 *   2. Tarjetas de app (logo con respaldo, etiquetas, «Leer más», enlaces).
 *   3. «Botones principales», reorganizados en 4 piezas con una sola misión cada una:
 *        #desk     → iconos-carpeta (escritorio en PC, cuadrícula 3×3 en móvil)
 *        #taskbar  → Kixki + SOLO las ventanas abiertas + reloj (PC)
 *        #dock     → barra inferior móvil con la oveja «Kixki» elevada en el centro
 *        #sm       → menú Kixki en grupos (Abrir · Apariencia · Sonido · Extras · Sistema)
 *      más #quick (sugerencia del día + selector Móvil/PC, que monta windows.js).
 *
 * Este módulo NO mueve ventanas: eso es windows.js, que reacciona a state.windows.
 * Se comunican con eventos del documento:
 *   kx:goto {id}  → «ve a esta app»           (render → windows)
 *   kx:rendered   → «reconstruí el DOM»        (render → windows)
 *
 * Orden de arranque: sprites → render → windows (lo hace main.js).
 */

import * as state from "./state.js";
import * as data from "./data.js";
import { icon } from "./sprites.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* =====================================================================
   1. Utilidades compartidas (windows.js las importa de aquí)
   ===================================================================== */

/** Escapa texto para usarlo dentro de HTML/atributos. */
export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fill = (s, vars) => (vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s);

/** Traduce con texto de respaldo en español: T("menu.run", "Ejecutar…", {n: 3}). */
export const T = (key, fb = key, vars) => fill(data.hasKey(key) ? data.t(key) : fb, vars);

/** Plural con respaldo si la clave no existe en el JSON. */
const plural = (key, n, one, other) => {
  const out = data.tn(key, n);
  return out === key ? (n === 1 ? one : other) : out;
};

export const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
export const vib = (ms = 8) => { try { navigator.vibrate?.(ms); } catch (_) { /* sin vibración */ } };

let toastTimer;
export function toast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
}

async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); return; } catch (_) { /* plan B */ }
  const x = document.createElement("textarea");
  x.value = text;
  x.setAttribute("readonly", "");
  x.style.cssText = "position:fixed;opacity:0";
  document.body.append(x);
  x.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (_) { /* ignorar */ }
  x.remove();
  toast(ok ? okMsg : T("toast.copyFail", "No se pudo copiar. Cópialo a mano."));
}

const safeUrl = u => (/^https?:\/\//i.test(u) ? u : "#");

/* =====================================================================
   2. Aspecto de cada ventana (color, icono, nombre corto)
   Si añades una categoría nueva en apps.json que no está aquí, se le asigna
   un color según su id y el icono genérico «caja».
   ===================================================================== */

const CAT_META = {
  tiendas:    { short: "Tiendas",    hue: "#8b6cf0", ico: "ico-tiendas" },
  importante: { short: "Importante", hue: "#f5a524", ico: "ico-importante" },
  utilidad:   { short: "Utilidad",   hue: "#3aa6e8", ico: "ico-utilidad" },
  decoracion: { short: "Decoración", hue: "#f06aa8", ico: "ico-decoracion" },
  musica:     { short: "Música",     hue: "#36c08e", ico: "ico-musica" },
  teclados:   { short: "Teclados",   hue: "#7c8cf5", ico: "ico-teclados" },
};

const SPECIAL = {
  favs:  { e: "⭐", hue: "#ffc23a", ico: "ico-star", short: "Favoritas", t: "Mis favoritas", s: "Las apps que marcaste con ☆" },
  news:  { e: "🆕", hue: "#ff7a59", ico: "ico-new",  short: "Novedades", t: "Novedades", s: "Apps nuevas desde tu última visita" },
  packs: { e: "🎁", hue: "#4ccf9b", ico: "ico-box",  short: "Packs",     t: "Packs", s: "Listas para instalar varias apps de una vez" },
};

const PACKS = [
  { id: "privacy", e: "🛡️", t: "Privacidad", d: "Menos rastreo y más control sobre lo que sale de tu móvil.",
    apps: ["Aurora Store", "F-Droid", "FireWall Blocks", "PrivacyFlip", "No More Background", "LeanType"] },
  { id: "customize", e: "🎨", t: "Personalizar", d: "Widgets, fondos y teclado para dejar el móvil a tu gusto.",
    apps: ["Widgets Pro", "Photo Widget", "GIF Live Wallpaper", "Essentials", "LeanType"] },
  { id: "start", e: "🚀", t: "Para empezar", d: "Lo mínimo para instalar y actualizar apps sin Play Store.",
    apps: ["F-Droid", "Aurora Store", "Komi Store", "Universal Installer", "Shizuku"] },
  { id: "music", e: "🎧", t: "Música", d: "Para escuchar y descargar tu música.",
    apps: ["Poweramp", "SpotiFLAC"] },
];

const hueOf = id => `hsl(${[...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)} 70% 62%)`;

let catalog = null;
let byName = new Map();

/** Descriptores de todas las ventanas, ya traducidos. */
function windowDefs() {
  const cats = catalog.categories.map(c => {
    const m = CAT_META[c.id] || {};
    const l = data.localizeCategory(c);
    return {
      id: c.id, kind: "cat", e: c.e || "📦", hue: m.hue || hueOf(c.id), ico: m.ico || "ico-box",
      short: T(`categories.${c.id}.short`, m.short || l.t), t: l.t, s: l.s,
    };
  });
  const specials = state.SPECIAL_WINDOWS.map(id => {
    const m = SPECIAL[id] || { e: "📦", hue: hueOf(id), ico: "ico-box", short: id, t: id, s: "" };
    return {
      id, kind: "special", e: m.e, hue: m.hue, ico: m.ico,
      short: T(`win.${id}.short`, m.short), t: T(`win.${id}.t`, m.t), s: T(`win.${id}.s`, m.s),
    };
  });
  return [...cats, ...specials];
}

const newsList = () => data.sortByAdded(catalog.apps.filter(a => a.isNew));
const favApps = () => state.get("favs").map(n => byName.get(n)).filter(Boolean);
const packApps = p => p.apps.map(n => catalog.byId.get(data.slug(n))).filter(Boolean);
const packTitle = p => T(`pack.${p.id}.t`, p.t);

function countOf(d) {
  if (d.id === "favs") return favApps().length;
  if (d.id === "news") return newsList().length;
  if (d.id === "packs") return PACKS.length;
  return catalog.categories.find(c => c.id === d.id)?.apps.length ?? 0;
}

function countText(d) {
  const n = countOf(d);
  return d.id === "packs"
    ? `${n} ${plural("unit.pack", n, "pack", "packs")}`
    : `${n} ${plural("unit.app", n, "app", "apps")}`;
}

/* =====================================================================
   3. Tarjetas
   ===================================================================== */

function linkBtn(l, i) {
  const label = esc(l.label === "Play" ? "Google Play" : l.label);
  const cls = "btn" + (i === 0 ? " p" : "");
  if (/\.json($|\?)/.test(l.url)) {
    return `<button type="button" class="${cls}" data-copy="${esc(l.url)}" aria-label="${esc(T("app.copyExt", "Copiar el enlace de la extensión"))}">${icon("ui-copy", 2)}${label}</button>`;
  }
  const ic = /youtu/.test(l.url) ? "ui-play" : "ui-ext";
  return `<a class="${cls}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer">${icon(ic, 2)}${label}</a>`;
}

function appCard(app) {
  const l = data.localizeApp(app);
  const hasGh = app.links.some(k => k.url.startsWith("https://github.com/"));
  const links = app.links.map(linkBtn).join("") +
    (app.repo && !hasGh
      ? `<a class="btn" href="https://github.com/${esc(app.repo)}" target="_blank" rel="noopener noreferrer">${icon("ui-ext", 2)}${esc(T("app.repo", "Repositorio"))}</a>`
      : "");
  const badges = app.badges.length
    ? `<div class="bdg">${app.badges.map(b => `<span data-badge="${esc(b)}">${esc(data.badgeLabel(b))}</span>`).join("")}</div>`
    : "";
  const needZ = app.badges.includes("shizuku") && catalog.byId.has("shizuku")
    ? `<button type="button" class="needz" data-go="shizuku">${esc(T("app.needShizuku", "Mejor con Shizuku: instálalo primero →"))}</button>`
    : "";
  const tip = l.tip
    ? `<div class="tip"><span class="bang">${icon("ui-bang", 2)}</span><span>${esc(l.tip)}</span></div>`
    : "";
  return `<article class="app" data-id="${esc(app.id)}">
  <div class="logo" data-i="${esc(l.name.charAt(0).toUpperCase())}"><img data-id="${esc(app.id)}" alt="" width="56" height="56" loading="lazy" decoding="async" referrerpolicy="no-referrer"></div>
  <div class="info">
    <div class="line"><h3>${esc(l.name)}</h3>${l.tag ? `<span class="tag">${esc(l.tag)}</span>` : ""}${app.isNew ? `<span class="new">${esc(T("app.new", "Nueva"))}</span>` : ""}<button type="button" class="star" data-fav="${esc(app.name)}" aria-pressed="false">☆</button></div>
    ${badges}${needZ}
    <p class="desc clamp">${esc(l.desc)}</p><button type="button" class="more" aria-expanded="false" hidden>${esc(T("app.readMore", "Leer más"))}</button>
    ${tip}
    <div class="links">${links}</div>
  </div>
</article>`;
}

function packCard(p) {
  const apps = packApps(p);
  return `<article class="app sel pack" data-pack="${p.id}">
  <div class="logo" aria-hidden="true">${p.e}</div>
  <div class="info">
    <div class="line"><h3>${esc(packTitle(p))}</h3><span class="tag">${apps.length} ${plural("unit.app", apps.length, "app", "apps")}</span></div>
    <p class="desc">${esc(T(`pack.${p.id}.d`, p.d))}</p>
    <div class="links">${apps.map(a => `<button type="button" class="btn" data-go="${esc(a.id)}">${esc(a.name)}</button>`).join("")}<button type="button" class="btn p" data-cp="${p.id}">${icon("ui-copy", 2)}${esc(T("pack.copy", "Copiar lista"))}</button></div>
  </div>
</article>`;
}

const emptyCard = (symbol, msg) =>
  `<article class="app sel" data-empty><div class="logo" aria-hidden="true">${symbol}</div><div class="info"><p class="desc">${esc(msg)}</p></div></article>`;

function packText(p) {
  const head = T("pack.title", "Pack «{t}» de Kixki Store", { t: packTitle(p) });
  return head + "\n" + packApps(p).map(a => `• ${a.name}${a.links[0] ? ": " + a.links[0].url : ""}`).join("\n");
}

/** Contenido de cada ventana (las tarjetas). */
function bodyOf(d) {
  if (d.id === "favs") {
    const a = favApps();
    return a.length ? a.map(appCard).join("") : emptyCard("☆", T("win.favs.empty", "Toca ☆ en una app para guardarla aquí."));
  }
  if (d.id === "news") {
    const a = newsList();
    return a.length ? a.map(appCard).join("")
      : emptyCard("🆕", T("win.news.empty", "Sin novedades por ahora. Cuando añada apps nuevas, aparecerán aquí."));
  }
  if (d.id === "packs") return PACKS.map(packCard).join("");
  return (catalog.categories.find(c => c.id === d.id)?.apps ?? []).map(appCard).join("");
}

function windowHTML(d) {
  const label = k => esc(T(`win.${k}`, { min: "Minimizar ventana", max: "Maximizar ventana" }[k]));
  return `<section class="cat ex" id="${esc(d.id)}" data-kind="${d.kind}" data-e="${esc(d.e)}" style="--h:${d.hue}">
<div class="panel">
  <div class="tb"><span class="tbi" aria-hidden="true">${icon(d.ico, 2)}</span><span class="tbt">${esc(d.short)}.exe</span><span class="tbn">${countText(d)}</span><span class="tbb"><button type="button" class="wb wmin" aria-label="${label("min")}">${icon("ui-min", 2)}</button><button type="button" class="wb wmax" aria-label="${label("max")}">${icon("ui-max", 2)}</button></span></div>
  <div class="ph"><span class="ico" aria-hidden="true">${icon(d.ico, 3)}</span><div class="tx"><h2>${esc(d.t)}</h2><p>${esc(d.s)}</p></div><span class="chip">${countText(d)}</span></div>
  ${bodyOf(d)}
</div></section>`;
}

/* =====================================================================
   4. Logos, píxel-logos y «Leer más»
   ===================================================================== */

/** Prueba cada candidato en orden; si todos fallan, la CSS muestra la inicial (.fail). */
function loadLogos(root) {
  $$(".logo img[data-id]", root).forEach(img => {
    const list = catalog.byId.get(img.dataset.id)?.logos ?? [];
    const box = img.parentElement;
    if (!list.length) { box.classList.add("fail"); return; }
    let i = 0;
    img.addEventListener("error", () => {
      if (++i < list.length) img.src = list[i];
      else box.classList.add("fail");
    });
    img.addEventListener("load", () => state.get("ui").pixelLogos && drawPixel(img));
    img.src = list[0];
  });
}

function drawPixel(img) {
  let c = img.parentElement.querySelector("canvas");
  if (!c) {
    c = document.createElement("canvas");
    c.width = c.height = 20;
    img.after(c);
  }
  try { c.getContext("2d").drawImage(img, 0, 0, 20, 20); } catch (_) { /* imagen no dibujable */ }
}

function applyPixelLogos() {
  if (!state.get("ui").pixelLogos) return;
  $$(".logo img").forEach(img => {
    if (img.complete && img.naturalWidth) drawPixel(img);
    else img.addEventListener("load", () => drawPixel(img), { once: true });
  });
}

/** «Leer más» solo aparece si el texto realmente se corta. */
export function fitClamps() {
  $$(".desc.clamp").forEach(d => {
    const more = d.nextElementSibling;
    if (more?.classList.contains("more")) more.hidden = !(d.scrollHeight > d.clientHeight + 1);
  });
}
let fitRaf = 0;
export const scheduleFit = () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitClamps); };

function paintStar(b) {
  const on = state.isFav(b.dataset.fav);
  b.textContent = on ? "★" : "☆";
  b.classList.toggle("on", on);
  b.setAttribute("aria-pressed", on);
  b.setAttribute("aria-label", on ? T("app.unfav", "Quitar de favoritas") : T("app.fav", "Guardar en favoritas"));
}

/* =====================================================================
   5. Botones principales
   ===================================================================== */

/** Crea (una vez) o reutiliza un contenedor con id y le pone el HTML. */
function put(id, tag, html, mount, attrs = {}) {
  let el = document.getElementById(id);
  if (!el) { el = document.createElement(tag); el.id = id; mount(el); }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = html;
  return el;
}

/**
 * Menú Kixki. Cada entrada: [acción, sprite, esToggle, soloPC].
 * Las acciones las ejecuta windows.js (data-act). «game», «qr» y «sleep» aparecen
 * cuando algún módulo registra ese modal (ver `available`).
 */
const MENU = [
  ["look", [["theme", "ui-moon", 1], ["accent", "ico-decoracion"], ["bg", "ui-land"], ["pixel", "ico-star-mono", 1], ["lang", "ui-ext"]]],
  ["sound", [["sfx", "ui-bang", 1], ["music", "ui-note", 1]]],
  ["extras", [["run", "ui-search"], ["game", "ui-play"], ["suggest", "ui-heart"], ["qr", "ui-ext", 0, 1]]],
  ["system", [["closeall", "ui-min", 0, 1], ["sleep", "ui-moon", 0, 1]]],
];
const MENU_TEXT = {
  theme: "Tema", accent: "Color", bg: "Fondo", pixel: "Logos pixel", lang: "Idioma", sfx: "Efectos", music: "Música",
  run: "Ejecutar… (Ctrl+K)", game: "Saltaovejas", suggest: "Sugerir una app", qr: "Ábrelo en tu móvil",
  closeall: "Cerrar ventanas", sleep: "Apagar",
};
const GROUP_TEXT = { open: "Abrir", look: "Apariencia", sound: "Sonido", extras: "Extras", system: "Sistema" };
const SOFT = ["game", "qr", "sleep"];
const ACCENT_NAMES = { "": ["lilac", "Lila"], mint: ["mint", "Menta"], rose: ["rose", "Rosa"], dusk: ["dusk", "Atardecer"] };

/** Acciones de menú disponibles ahora mismo (windows.registerModal añade las suyas). */
export const available = new Set(["run", "suggest"]);

function menuHTML(defs) {
  const tiles = defs.map(d =>
    `<button type="button" class="sm tile" data-id="${esc(d.id)}" style="--h:${d.hue}">${icon(d.ico, 2)}<span>${esc(d.short)}</span></button>`).join("");
  const groups = MENU.map(([g, items]) => {
    const allPc = items.every(i => i[3]);
    const btns = items.map(([act, sprite, toggle, pc]) =>
      `<button type="button" class="sm${pc ? " pc" : ""}" data-act="${act}"${toggle ? ' aria-pressed="false"' : ""}${SOFT.includes(act) && !available.has(act) ? " hidden" : ""}><span class="si">${icon(sprite, 2)}</span><span class="sl">${esc(T(`menu.${act}`, MENU_TEXT[act]))}</span>${toggle ? '<i class="led" aria-hidden="true"></i>' : ""}</button>`).join("");
    return `<div class="mg${allPc ? " pc" : ""}"><h4>${esc(T(`menu.g.${g}`, GROUP_TEXT[g]))}</h4><div class="mrow">${btns}</div></div>`;
  }).join("");
  return `<div class="mg mg-open"><h4>${esc(T("menu.g.open", GROUP_TEXT.open))}</h4><div class="tiles">${tiles}</div></div>${groups}`;
}

/** Etiquetas y estado de los botones del menú (se llama al cambiar tema, audio, ui…). */
export function syncMenu() {
  const sm = $("#sm");
  if (!sm) return;
  const s = state.getState();
  const set = (act, label, on) => {
    const b = $(`[data-act="${act}"]`, sm);
    if (!b) return;
    $(".sl", b).textContent = label;
    if (on !== undefined) b.setAttribute("aria-pressed", on);
  };
  const [accKey, accFb] = ACCENT_NAMES[s.ui.accent] || ACCENT_NAMES[""];
  set("theme", s.theme === "dark" ? T("menu.themeDark", "Modo noche") : T("menu.themeLight", "Modo día"), s.theme === "dark");
  set("accent", `${T("menu.accent", MENU_TEXT.accent)}: ${T(`accent.${accKey}`, accFb)}`);
  set("bg", `${T("menu.bg", MENU_TEXT.bg)}: ${window.KXB?.label?.() ?? T("bg.classic", "Clásico")}`);
  set("pixel", T("menu.pixel", MENU_TEXT.pixel), s.ui.pixelLogos);
  set("lang", `${T("menu.lang", MENU_TEXT.lang)}: ${s.lang.toUpperCase()}`);
  set("sfx", T("menu.sfx", MENU_TEXT.sfx), s.audio.sfx);
  set("music", T("menu.music", MENU_TEXT.music), s.audio.music);
}

function buildChrome(defs) {
  const dailyApp = catalog.apps.length ? catalog.apps[Math.floor(Date.now() / 864e5) % catalog.apps.length] : null;

  // Escritorio / cuadrícula de carpetas
  put("desk", "nav",
    defs.map(d => `<button type="button" class="di" data-id="${esc(d.id)}" data-e="${esc(d.e)}" style="--h:${d.hue}">${icon(d.ico, 5)}<span>${esc(d.short)}</span><em>${countText(d)}</em></button>`).join(""),
    el => $("header.hero")?.insertAdjacentElement("afterend", el),
    { "aria-label": T("desk.label", "Escritorio") });

  // Fila rápida del encabezado: sugerencia del día (+ selector Móvil/PC, lo monta windows.js)
  put("quick", "div",
    dailyApp ? `<button type="button" class="pick" data-go="${esc(dailyApp.id)}">🐑 ${esc(T("quick.pick", "Hoy te sugiero:"))} <b>${esc(dailyApp.name)}</b></button>` : "",
    el => $("#count")?.after(el));

  // Barra de tareas (PC): Kixki + solo las ventanas abiertas + reloj
  put("taskbar", "div",
    `<button type="button" class="start" id="st" aria-expanded="false" aria-controls="sm">${icon("spr-sheep", 2)}Kixki</button>
<div class="tks">${defs.map(d => `<button type="button" class="tk" data-id="${esc(d.id)}" style="--h:${d.hue}">${icon(d.ico, 2)}<span>${esc(d.short)}</span></button>`).join("")}</div>
<div class="tray"><span>${esc(T("tray.by", "Hecho con ♥ por KitsukiLove"))}</span><b id="clk"></b></div>`,
    el => document.body.append(el),
    { role: "toolbar", "aria-label": T("tray.label", "Barra de tareas") });

  // Menú Kixki
  put("sm", "div", menuHTML(defs), el => { el.hidden = true; document.body.append(el); },
    { "aria-label": T("menu.label", "Menú Kixki") });

  // Barra inferior (móvil): la oveja «Kixki» va elevada en el centro
  const dock = [
    ["home", "ico-home", 3, "dock.home", "Inicio"],
    ["srch", "ui-search", 3, "dock.search", "Buscar"],
    ["menu", "spr-sheep", 2, "dock.menu", "Kixki"],
    ["fav", "ico-star-mono", 3, "dock.favs", "Favoritas"],
    ["theme", "ui-moon", 3, "dock.theme", "Tema"],
  ];
  put("dock", "nav",
    dock.map(([k, ic, sc, key, fb]) =>
      `<button type="button" data-k="${k}"${k === "menu" ? ' class="dk-c" aria-expanded="false" aria-controls="sm"' : ""}>${icon(ic, sc)}<span>${esc(T(key, fb))}</span></button>`).join(""),
    el => document.body.append(el),
    { "aria-label": T("dock.label", "Menú") });
}

/* =====================================================================
   6. Construcción completa y reacciones al estado
   ===================================================================== */

function buildAll() {
  const defs = windowDefs();
  const nav = $("#nav");
  if (nav) {
    nav.innerHTML = defs.filter(d => d.kind === "cat")
      .map(d => `<a class="tab" href="#${esc(d.id)}" style="--h:${d.hue}">${icon(d.ico, 2)}<span>${esc(d.short)}</span></a>`).join("");
  }
  $("#app").innerHTML = defs.map(windowHTML).join("");
  buildChrome(defs);
  loadLogos($("#app"));
  $$(".star").forEach(paintStar);
  applyPixelLogos();
  syncInput();
  applyFilter();
  syncMenu();
  tickClock();
  scheduleFit();
  emit("kx:rendered");
}

/** Reconstruye solo el contenido de una ventana especial (favoritas, novedades). */
function fillSpecial(id) {
  const panel = $(`#${id} .panel`);
  if (!panel) return;
  $$(":scope > .app", panel).forEach(n => n.remove());
  panel.insertAdjacentHTML("beforeend", bodyOf({ id }));
  loadLogos(panel);
  $$(".star", panel).forEach(paintStar);
  applyPixelLogos();
  updateCounts();
  scheduleFit();
}

function updateCounts() {
  for (const id of state.SPECIAL_WINDOWS) {
    const text = countText({ id });
    $$(`#${id} .chip, #${id} .tbn`).forEach(n => { n.textContent = text; });
    const em = $(`.di[data-id="${id}"] em`);
    if (em) em.textContent = text;
  }
}

/** Buscador + filtros → muestra/oculta tarjetas y ventanas (sin reconstruir nada). */
function applyFilter() {
  const { query, filters } = state.get("ui");
  const active = !!query.trim() || filters.length > 0;
  const ok = new Set(data.filterApps(catalog.apps, { query, filters }).map(a => a.id));
  let any = false;
  for (const c of catalog.categories) {
    const sec = document.getElementById(c.id);
    if (!sec) continue;
    let n = 0;
    $$(".app[data-id]", sec).forEach(el => {
      const hit = ok.has(el.dataset.id);
      el.hidden = !hit;
      if (hit) n++;
    });
    sec.hidden = n === 0;
    if (n) any = true;
  }
  state.SPECIAL_WINDOWS.forEach(id => { const s = document.getElementById(id); if (s) s.hidden = active; });
  const empty = $("#empty");
  if (empty) {
    empty.hidden = any;
    if (!any) empty.textContent = T("search.empty", "No encontré apps con «{q}». Prueba con otra palabra.", { q: query.trim() });
  }
  scheduleFit();
}

/** El estado manda: si la búsqueda cambia desde otro sitio, el <input> la refleja. */
function syncInput() {
  const q = $("#q"), v = state.get("ui").query;
  if (q && q.value !== v) q.value = v;
}

function tickClock() {
  const c = $("#clk");
  if (c) c.textContent = new Date().toLocaleTimeString(state.get("lang"), { hour: "2-digit", minute: "2-digit" });
}

function bindState() {
  state.subscribe("favs", () => { fillSpecial("favs"); $$(".star").forEach(paintStar); });
  state.subscribe("ui", (ui, prev) => {
    if (ui.query !== prev.query || ui.filters !== prev.filters) { syncInput(); applyFilter(); }
    if (ui.pixelLogos !== prev.pixelLogos) applyPixelLogos();
    syncMenu();
  });
  state.subscribe("theme", syncMenu);
  state.subscribe("audio", syncMenu);
  state.subscribe("lang", async lang => {
    await data.setLanguage(lang);   // main.js también lo pide; es idempotente
    buildAll();
  });
}

/* =====================================================================
   7. Clics propios de las tarjetas (las ventanas y el menú, en windows.js)
   ===================================================================== */

function onClick(e) {
  const t = e.target;
  let b;

  if ((b = t.closest(".more"))) {
    const d = b.previousElementSibling;
    const open = d.classList.toggle("clamp") === false;
    b.textContent = open ? T("app.readLess", "Ver menos") : T("app.readMore", "Leer más");
    b.setAttribute("aria-expanded", open);
    return;
  }
  if ((b = t.closest("[data-copy]"))) {
    copyText(b.dataset.copy, T("toast.extCopied", "Enlace de la extensión copiado ✓"));
    return;
  }
  if ((b = t.closest("[data-cp]"))) {
    const p = PACKS.find(x => x.id === b.dataset.cp);
    if (p) copyText(packText(p), T("toast.listCopied", "Lista copiada ✓"));
    return;
  }
  if ((b = t.closest(".star"))) {
    const on = state.toggleFav(b.dataset.fav);
    toast(on ? T("toast.favOn", "Guardada en favoritas ⭐") : T("toast.favOff", "Quitada de favoritas"));
    vib();
    return;
  }
  if ((b = t.closest("[data-go]"))) { emit("kx:goto", { id: b.dataset.go }); return; }
  if ((b = t.closest(".bdg span"))) {            // tocar una etiqueta = buscarla
    state.setQuery(b.textContent);
    state.closeMaximized();
    return;
  }

  // PC: tocar una tarjeta compacta la despliega (y de nuevo el logo/título la pliega)
  const ap = t.closest(".app");
  if (ap && state.isDesktop() && !ap.matches(".pack,[data-empty]") && !t.closest("a,button") && ap.querySelector("h3")) {
    const sec = ap.closest(".cat");
    if (sec && !sec.classList.contains("max") && (!ap.classList.contains("sel") || t.closest(".logo,h3"))) {
      const was = ap.classList.contains("sel");
      $$(".app.sel:not(.pack)", sec).forEach(x => x.classList.remove("sel"));
      if (!was) ap.classList.add("sel");
      scheduleFit();
    }
  }
}

/* =====================================================================
   8. Arranque
   ===================================================================== */

let resizeTimer;

export function init() {
  catalog = data.getCatalog();
  byName = new Map(catalog.apps.map(a => [a.name, a]));
  buildAll();
  document.addEventListener("click", onClick);
  bindState();
  setInterval(tickClock, 20000);
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(scheduleFit, 150); });
  document.fonts?.ready.then(scheduleFit);
}
