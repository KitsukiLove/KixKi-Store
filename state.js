/**
 * state.js — Estado global unificado de Kixki Store.
 *
 * Reemplaza los `setState = (s,t) => { _s(s,t); ... }` encadenados del app.js
 * original por UNA sola fuente de verdad:
 *
 *   - Estado inmutable (cada cambio crea un objeto nuevo).
 *   - `subscribe(clave, fn)` para reaccionar a los cambios (DOM, sonido, etc.).
 *   - Acciones con nombre (`openWindow`, `toggleTheme`, ...) que contienen las
 *     reglas de negocio que antes estaban repartidas por el código.
 *   - Persistencia en localStorage con las MISMAS claves que la versión anterior
 *     ("kixki-theme", "kixki-fav", ...), así nadie pierde sus favoritas ni su tema.
 *
 * Este módulo NO toca el DOM. Solo lee `matchMedia`/`localStorage` (con try/catch).
 */

/* =====================================================================
   1. Constantes
   ===================================================================== */

export const SUPPORTED_LANGS = ["es", "en"];
export const DEFAULT_LANG = "es";

/** Ancho a partir del cual la interfaz funciona como «escritorio» con ventanas. */
export const DESKTOP_QUERY = "(min-width:1000px)";

/** Ventanas especiales (no son categorías del catálogo). */
export const SPECIAL_WINDOWS = ["favs", "news", "packs"];

const LS_PREFIX = "kixki-";

/* =====================================================================
   2. Almacenamiento seguro (localStorage puede lanzar o estar vacío)
   ===================================================================== */

const storage = {
  get(key) {
    try { return localStorage.getItem(LS_PREFIX + key); } catch (_) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(LS_PREFIX + key, value); } catch (_) { /* modo privado, cuota... */ }
  },
};

/* =====================================================================
   3. Valores iniciales
   ===================================================================== */

const detectMode = () =>
  typeof matchMedia === "function" && matchMedia(DESKTOP_QUERY).matches ? "desktop" : "mobile";

const detectTheme = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const detectLang = () => {
  const nav = (typeof navigator !== "undefined" && navigator.language) || DEFAULT_LANG;
  const short = nav.slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(short) ? short : DEFAULT_LANG;
};

/**
 * Forma completa del estado. Documentada aquí para que el resto de módulos
 * sepan qué pueden leer.
 */
const defaults = () => ({
  /** Se pone en true cuando el catálogo ya está cargado y la UI puede pintarse. */
  ready: false,

  /** "light" | "dark" */
  theme: detectTheme(),
  /** "es" | "en" */
  lang: detectLang(),
  /** "desktop" | "mobile" (según DESKTOP_QUERY) */
  mode: detectMode(),

  /** Audio: efectos de sonido y música de fondo. */
  audio: { sfx: false, music: false },

  /** Preferencias y estado de la interfaz. */
  ui: {
    accent: "",          // "" (lila) | "mint" | "rose" | "dusk"
    pixelLogos: false,   // logos en baja resolución
    query: "",           // texto del buscador
    filters: [],         // ids de etiqueta activos: "new", "open-source", "no-ads"...
    menuOpen: false,     // menú «Kixki» (inicio)
  },

  /**
   * Ventanas del escritorio.
   *   items[id] = { state: "min" | "normal" | "max", x, y, z }
   *   top       = id de la ventana al frente
   */
  windows: { items: {}, top: null, zCounter: 10, cascade: 0 },

  /** Contadores de juego / mascota. */
  game: {
    petTaps: 0,       // toques totales a la oveja (persistente)
    highScore: 0,     // récord de Saltaovejas (persistente)
    sessionTaps: 0,   // toques desde la última «lluvia de ovejas» (no persistente)
  },

  /** Nombres de las apps favoritas. */
  favs: [],
  /** Nombres de las apps vistas en la última visita (para detectar «Novedades»). null = primera visita. */
  seen: null,
});

/* =====================================================================
   4. Persistencia declarativa
   Cada entrada: clave de localStorage, cómo leer/escribir en el estado y
   si se guarda como texto plano (`raw`) o como JSON.
   Las claves y formatos coinciden con el app.js anterior.
   ===================================================================== */

const PERSISTED = [
  { key: "theme", raw: true, valid: v => v === "light" || v === "dark",
    read: s => s.theme, write: v => ({ theme: v }) },
  { key: "lang", raw: true, valid: v => SUPPORTED_LANGS.includes(v),
    read: s => s.lang, write: v => ({ lang: v }) },
  { key: "snd", valid: v => typeof v === "boolean",
    read: s => s.audio.sfx, write: (v, s) => ({ audio: { ...s.audio, sfx: v } }) },
  { key: "px", valid: v => typeof v === "boolean",
    read: s => s.ui.pixelLogos, write: (v, s) => ({ ui: { ...s.ui, pixelLogos: v } }) },
  { key: "acc", valid: v => typeof v === "string",
    read: s => s.ui.accent, write: (v, s) => ({ ui: { ...s.ui, accent: v } }) },
  { key: "fav", valid: Array.isArray,
    read: s => s.favs, write: v => ({ favs: v }) },
  { key: "seen", valid: Array.isArray,
    read: s => s.seen, write: v => ({ seen: v }) },
  { key: "pet", valid: v => Number.isFinite(v),
    read: s => s.game.petTaps, write: (v, s) => ({ game: { ...s.game, petTaps: v } }) },
  { key: "hi", valid: v => Number.isFinite(v),
    read: s => s.game.highScore, write: (v, s) => ({ game: { ...s.game, highScore: v } }) },
];

/** Lee lo guardado y lo mezcla sobre los valores por defecto. */
function loadPersisted(base) {
  let next = base;
  for (const p of PERSISTED) {
    const raw = storage.get(p.key);
    if (raw == null) continue;
    let value = raw;
    if (!p.raw) { try { value = JSON.parse(raw); } catch (_) { continue; } }
    if (p.valid(value)) next = { ...next, ...p.write(value, next) };
  }
  return next;
}

/** Guarda en localStorage solo lo que cambió entre `prev` y `next`. */
function savePersisted(prev, next) {
  for (const p of PERSISTED) {
    const a = p.read(prev), b = p.read(next);
    if (Object.is(a, b)) continue;
    if (b == null) continue; // `seen` null = «sin datos», no se escribe
    storage.set(p.key, p.raw ? String(b) : JSON.stringify(b));
  }
}

/* =====================================================================
   5. Núcleo del store
   ===================================================================== */

let state = loadPersisted(defaults());
const listeners = new Map(); // clave | "*" → Set<fn>

/** Devuelve el estado actual (objeto inmutable: no lo modifiques). */
export const getState = () => state;

/** Atajo: `get("theme")`. */
export const get = key => state[key];

/**
 * Aplica un cambio parcial de primer nivel y avisa a los suscriptores.
 * @param {object|function} patch  Objeto `{clave: valor}` o `prev => objeto`.
 */
export function setState(patch) {
  const prev = state;
  const part = typeof patch === "function" ? patch(prev) : patch;
  const changed = Object.keys(part).filter(k => !Object.is(prev[k], part[k]));
  if (!changed.length) return;

  state = { ...prev, ...part };
  savePersisted(prev, state);

  for (const k of changed) listeners.get(k)?.forEach(fn => fn(state[k], prev[k], state));
  listeners.get("*")?.forEach(fn => fn(state, prev, changed));
}

/**
 * Se suscribe a una clave del estado (o a "*" para cualquier cambio).
 * @returns {function} función para cancelar la suscripción.
 */
export function subscribe(key, fn, { immediate = false } = {}) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key).add(fn);
  if (immediate) key === "*" ? fn(state, state, []) : fn(state[key], state[key], state);
  return () => listeners.get(key)?.delete(fn);
}

/* =====================================================================
   6. Acciones: tema, idioma, modo
   ===================================================================== */

export const setTheme = theme => { if (theme === "light" || theme === "dark") setState({ theme }); };
export const toggleTheme = () => setTheme(state.theme === "dark" ? "light" : "dark");

export const setLang = lang => { if (SUPPORTED_LANGS.includes(lang)) setState({ lang }); };

export const setMode = mode => setState({ mode });
export const isDesktop = () => state.mode === "desktop";

/**
 * Mantiene `state.mode` sincronizado con el tamaño de pantalla.
 * @returns {function} para dejar de escuchar.
 */
export function watchMode() {
  const mq = matchMedia(DESKTOP_QUERY);
  const apply = () => setMode(mq.matches ? "desktop" : "mobile");
  apply();
  mq.addEventListener("change", apply);
  return () => mq.removeEventListener("change", apply);
}

export const setReady = ready => setState({ ready });

/* =====================================================================
   7. Acciones: interfaz (audio, apariencia, búsqueda, filtros)
   ===================================================================== */

const patchSlice = (slice, part) => setState({ [slice]: { ...state[slice], ...part } });

export const setSfx = on => patchSlice("audio", { sfx: !!on });
export const toggleSfx = () => setSfx(!state.audio.sfx);
export const setMusic = on => patchSlice("audio", { music: !!on });
export const toggleMusic = () => setMusic(!state.audio.music);

const ACCENTS = ["", "mint", "rose", "dusk"];
export const cycleAccent = () =>
  patchSlice("ui", { accent: ACCENTS[(ACCENTS.indexOf(state.ui.accent) + 1) % ACCENTS.length] });
export const togglePixelLogos = () => patchSlice("ui", { pixelLogos: !state.ui.pixelLogos });
export const setMenuOpen = open => patchSlice("ui", { menuOpen: !!open });

export const setQuery = query => patchSlice("ui", { query: String(query) });

export function toggleFilter(id) {
  const f = state.ui.filters;
  patchSlice("ui", { filters: f.includes(id) ? f.filter(x => x !== id) : [...f, id] });
}
export const setFilters = filters => patchSlice("ui", { filters: [...filters] });
export const clearFilters = () => patchSlice("ui", { filters: [] });

/* =====================================================================
   8. Acciones: favoritas y «vistas»
   ===================================================================== */

/** @returns {boolean} true si quedó marcada como favorita. */
export function toggleFav(name) {
  const on = !state.favs.includes(name);
  setState({ favs: on ? [...state.favs, name] : state.favs.filter(n => n !== name) });
  return on;
}
export const isFav = name => state.favs.includes(name);
export const setSeen = names => setState({ seen: [...names] });

/* =====================================================================
   9. Acciones: ventanas
   Reglas heredadas del app.js original:
     - Todas empiezan minimizadas.
     - En móvil, «normal» no existe: se convierte en «min»
       (salvo que haya una búsqueda activa, que muestra resultados).
     - La primera vez que una ventana se muestra recibe una posición en cascada.
     - Abrir: en escritorio → normal, en móvil → max (pantalla completa).
   ===================================================================== */

/** Registra las ventanas disponibles (todas minimizadas). Llamar tras cargar el catálogo. */
export function registerWindows(ids) {
  const items = {};
  for (const id of ids) items[id] = { state: "min", x: null, y: null, z: 0 };
  setState({ windows: { items, top: null, zCounter: 10, cascade: 0 } });
}

/** Cambia el estado de una ventana aplicando las reglas anteriores. */
export function setWindowState(id, next) {
  const w = state.windows, cur = w.items[id];
  if (!cur) return;

  if (next === "normal" && state.mode === "mobile" && !state.ui.query.trim()) next = "min";

  let { x, y } = cur, cascade = w.cascade;
  if (next !== "min" && x == null) {            // primera aparición: cascada de 6 posiciones
    x = 150 + (cascade % 6) * 40;
    y = 34 + (cascade % 6) * 34;
    cascade++;
  }
  setState({
    windows: {
      ...w,
      cascade,
      top: next === "min" && w.top === id ? null : w.top,
      items: { ...w.items, [id]: { ...cur, state: next, x, y } },
    },
  });
}

/** Sube una ventana al frente. */
export function focusWindow(id) {
  const w = state.windows, cur = w.items[id];
  if (!cur) return;
  const z = w.zCounter + 1;
  setState({ windows: { ...w, top: id, zCounter: z, items: { ...w.items, [id]: { ...cur, z } } } });
}

/** Abre una ventana (normal en escritorio, pantalla completa en móvil) y la trae al frente. */
export function openWindow(id) {
  const cur = state.windows.items[id];
  if (!cur) return;
  if (cur.state === "min") setWindowState(id, isDesktop() ? "normal" : "max");
  focusWindow(id);
}

export const minimizeWindow = id => setWindowState(id, "min");
export const restoreWindow = id => setWindowState(id, "normal");

/** Alterna entre normal y maximizada. */
export function toggleMaximize(id) {
  const cur = state.windows.items[id];
  if (cur) setWindowState(id, cur.state === "normal" ? "max" : "normal");
}

/** Si hay una ventana maximizada, la devuelve a tamaño normal (Esc, clic fuera, deslizar). */
export function closeMaximized() {
  const id = Object.keys(state.windows.items).find(k => state.windows.items[k].state === "max");
  if (id) setWindowState(id, "normal");
}

export function closeAllWindows() {
  for (const id of Object.keys(state.windows.items)) setWindowState(id, "min");
  setState({ windows: { ...state.windows, top: null } });
}

export const getWindow = id => state.windows.items[id];
export const hasMaximized = () => Object.values(state.windows.items).some(w => w.state === "max");

/** Mueve una ventana (arrastre). */
export function moveWindow(id, x, y) {
  const w = state.windows, cur = w.items[id];
  if (cur) setState({ windows: { ...w, items: { ...w.items, [id]: { ...cur, x, y } } } });
}

/* =====================================================================
   10. Acciones: contadores de juego
   ===================================================================== */

export const incPetTaps = () =>
  patchSlice("game", { petTaps: state.game.petTaps + 1, sessionTaps: state.game.sessionTaps + 1 });
export const resetSessionTaps = () => patchSlice("game", { sessionTaps: 0 });
export const submitScore = score => {
  if (score > state.game.highScore) patchSlice("game", { highScore: score });
};
