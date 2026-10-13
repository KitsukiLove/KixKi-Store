/**
 * data.js — Datos de Kixki Store: catálogo, traducciones y filtros.
 *
 * Este módulo es independiente del estado y del DOM: recibe parámetros y
 * devuelve datos. `main.js` es quien lo conecta con `state.js`.
 *
 *   1. Utilidades de texto (slug, normalización)
 *   2. Traducciones (i18n/es.json, i18n/en.json)
 *   3. Carga y normalización de apps.json
 *   4. Etiquetas («Open source», «Sin anuncios»...) y Novedades
 *   5. Búsqueda y filtrado
 */

/* =====================================================================
   1. Utilidades de texto
   ===================================================================== */

/** Minúsculas y sin acentos: «Música» → «musica». Sirve para buscar. */
export const normalize = s =>
  String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/** Identificador estable: «Aurora Store» → «aurora-store». */
export const slug = s => normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** fetch + JSON que nunca lanza: devuelve `null` si algo falla. */
async function getJSON(url) {
  try {
    const r = await fetch(url);
    return r.ok ? await r.json() : null;
  } catch (_) {
    return null;
  }
}

/* =====================================================================
   2. Traducciones
   Archivos: i18n/<lang>.json  con la forma
     { "search": { "placeholder": "..." },
       "categories": { "tiendas": { "t": "...", "s": "..." } },
       "apps": { "aurora-store": { "tag": "...", "desc": "...", "tip": "..." } } }
   El español es el idioma de respaldo: si falta una clave en inglés, se usa la española.
   ===================================================================== */

const FALLBACK_LANG = "es";
const dicts = {};            // lang → diccionario ya cargado
let currentLang = FALLBACK_LANG;

/** Carga (una sola vez) el diccionario de un idioma. */
async function loadDict(lang) {
  if (!dicts[lang]) dicts[lang] = (await getJSON(`i18n/${lang}.json`)) || {};
  return dicts[lang];
}

/**
 * Cambia el idioma activo (y carga también el de respaldo).
 * Vacía la caché de búsqueda, que depende del idioma.
 */
export async function setLanguage(lang) {
  await Promise.all([loadDict(FALLBACK_LANG), loadDict(lang)]);
  currentLang = lang;
  searchCache.clear();
  return currentLang;
}

export const getLanguage = () => currentLang;

/** Busca una clave con puntos («search.placeholder») en un diccionario. */
const dig = (dict, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);

/** Valor crudo (texto u objeto) en el idioma activo, con respaldo en español. */
function lookup(key) {
  return dig(dicts[currentLang], key) ?? dig(dicts[FALLBACK_LANG], key);
}

export const hasKey = key => typeof lookup(key) === "string";

/**
 * Traduce una clave. Variables con llaves: t("count.desktop", { total: 40 }).
 * Si la clave no existe devuelve `fallback` (si se da) o la propia clave.
 */
export function t(key, vars, fallback) {
  const v = lookup(key);
  if (typeof v !== "string") return fallback ?? key;
  return vars ? v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : v;
}

/** Plural: en el JSON, `"unit": { "app": { "one": "app", "other": "apps" } }` → tn("unit.app", 3). */
export function tn(key, n, vars) {
  const node = lookup(key);
  if (node == null || typeof node !== "object") return t(key, { n, ...vars });
  const form = new Intl.PluralRules(currentLang).select(n);
  const text = node[form] ?? node.other ?? "";
  return text.replace(/\{(\w+)\}/g, (m, k) => (k === "n" ? n : vars && k in vars ? vars[k] : m));
}

/** Texto traducido de una app (nombre, etiqueta, descripción, consejo). */
export function localizeApp(app) {
  const tr = lookup(`apps.${app.id}`);
  return {
    name: app.name,
    tag: tr?.tag || app.tag,
    desc: tr?.desc || app.desc,
    tip: tr?.tip || app.tip,
  };
}

/** Título y subtítulo traducidos de una categoría. */
export function localizeCategory(cat) {
  const tr = lookup(`categories.${cat.id}`);
  return { t: tr?.t || cat.t, s: tr?.s || cat.s };
}

/* =====================================================================
   3. Carga y normalización del catálogo
   ===================================================================== */

/** Fecha de las apps que cuentan como «nuevas» (días). */
export const NEW_DAYS = 14;

let catalog = null;

/** Convierte [etiqueta, url] u {label, url} en {label, url}. */
const normLink = l => (Array.isArray(l) ? { label: l[0], url: l[1] } : { label: l.label, url: l.url });

/** Repositorio «dueño/nombre» si la app enlaza a GitHub (directo o vía Obtainium). */
function repoOf(links) {
  for (const l of links) {
    const m =
      l.url.match(/^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/) ||
      l.url.match(/[?&]repo=([^/&]+)\/([^&]+)/);
    if (m) return `${m[1]}/${m[2]}`;
  }
  return "";
}

/**
 * Posibles imágenes del logo, en orden de preferencia:
 * logo guardado en la web → logo indicado → ícono del repo → foto del autor.
 */
function logoCandidates(raw, links, meta) {
  const own = meta.logos[slug(raw.name)];
  const list = [];
  if (raw.logo) list.push(...[].concat(raw.logo));
  else {
    const repo = repoOf(links);
    if (repo) {
      const [o, r] = repo.split("/");
      list.push(
        `https://raw.githubusercontent.com/${o}/${r}/HEAD/fastlane/metadata/android/en-US/images/icon.png`,
        `https://raw.githubusercontent.com/${o}/${r}/HEAD/metadata/en-US/images/icon.png`,
        `https://github.com/${o}.png?size=160`
      );
    }
  }
  return own ? [own, ...list.filter(x => x !== own)] : list;
}

/** Fecha `added` → milisegundos, o NaN si falta o es inválida. */
const addedTime = app => Date.parse(app.added);

function normalizeApp(raw, category, meta) {
  const links = (raw.links || []).map(normLink);
  const app = {
    id: slug(raw.name),
    name: raw.name,
    tag: raw.tag || "",
    desc: raw.desc || "",
    tip: raw.tip || "",
    links,
    repo: repoOf(links),
    logos: logoCandidates(raw, links, meta),
    added: raw.added || meta.added?.[slug(raw.name)] || "",   // "AAAA-MM-DD"
    category: category.id,
    isNew: false,                                                // lo calcula resolveNews()
    badges: [],
  };
  app.badges = raw.badges ? [...raw.badges] : detectBadges(app);
  return app;
}

/**
 * Carga apps.json (+ data/meta.json opcional) y devuelve el catálogo:
 *   { categories: [{id, e, t, s, apps}], apps: [...], byId: Map, meta }
 * Devuelve `null` si apps.json no se pudo cargar.
 */
export async function loadCatalog({ url = "apps.json", metaUrl = "data/meta.json" } = {}) {
  const [data, metaRaw] = await Promise.all([getJSON(url), getJSON(metaUrl)]);
  if (!data) return null;

  const meta = { logos: {}, repos: {}, added: {}, ...(metaRaw || {}) };
  const categories = data.categories.map(c => {
    const cat = { id: c.id, e: c.e, t: c.t, s: c.s, apps: [] };
    cat.apps = c.apps.map(a => normalizeApp(a, cat, meta));
    return cat;
  });
  const apps = categories.flatMap(c => c.apps);
  catalog = { categories, apps, byId: new Map(apps.map(a => [a.id, a])), meta };
  return catalog;
}

export const getCatalog = () => catalog;

/* =====================================================================
   4. Etiquetas y Novedades
   ===================================================================== */

/**
 * Etiquetas detectadas en el texto de la descripción (igual que antes), pero
 * guardadas como ids independientes del idioma. Su texto visible sale de
 * i18n: «badge.open-source», «badge.no-ads»...
 */
const BADGE_RULES = [
  ["open-source", /open source|código abierto/i],
  ["closed-source", /código cerrado|closed source/i],
  ["no-ads", /sin anuncios|ad-?free|no ads/i],
  ["paid", /de pago|\bpaid\b/i],
];

function detectBadges(app) {
  const out = BADGE_RULES.filter(([, re]) => re.test(app.desc)).map(([id]) => id);
  const android = app.desc.match(/Android (\d+)\+/);
  if (android) out.push(`android-${android[1]}`);
  if (/Shizuku/.test(app.desc) && app.name !== "Shizuku") out.push("shizuku");
  return out;
}

/** Texto visible de una etiqueta («android-12» → «Android 12+»). */
export function badgeLabel(id) {
  const m = id.match(/^android-(\d+)$/);
  return m ? `Android ${m[1]}+` : t(`badge.${id}`, null, id);
}

/** Ids de filtro disponibles para el menú de etiquetas («Novedades» incluida). */
export function availableFilters(apps = catalog?.apps || []) {
  const ids = new Set(["new"]);
  apps.forEach(a => a.badges.forEach(b => ids.add(b)));
  return [...ids];
}

/** Texto visible de cualquier filtro, incluido «new» → «Novedades». */
export const filterLabel = id => (id === "new" ? t("filter.new") : badgeLabel(id));

/** Ordena por fecha `added` (más reciente primero); sin fecha, al final y por nombre. */
export function sortByAdded(apps, dir = "desc") {
  const sign = dir === "asc" ? 1 : -1;
  return [...apps].sort((a, b) => {
    const ta = addedTime(a), tb = addedTime(b);
    const na = Number.isNaN(ta), nb = Number.isNaN(tb);
    if (na && nb) return a.name.localeCompare(b.name);
    if (na) return 1;
    if (nb) return -1;
    return (ta - tb) * sign || a.name.localeCompare(b.name);
  });
}

const NEWS_CACHE_KEY = "kixki-news";

/**
 * Marca `app.isNew` y devuelve las apps nuevas, ordenadas por `added`.
 * Una app es nueva si:
 *   - su fecha `added` está dentro de los últimos NEW_DAYS días, o
 *   - no estaba en la lista `seen` de la última visita (si `seen` no es null).
 * El resultado se recuerda durante la sesión (sessionStorage), para que
 * «Novedades» no desaparezca al recargar tras guardar la lista de vistas.
 *
 * @param {object[]} apps
 * @param {{seen?: string[]|null, days?: number, now?: number}} opts
 */
export function resolveNews(apps, { seen = null, days = NEW_DAYS, now = Date.now() } = {}) {
  let ids = null;
  try { ids = JSON.parse(sessionStorage.getItem(NEWS_CACHE_KEY) || "null"); } catch (_) { /* sin sesión */ }

  if (!Array.isArray(ids)) {
    const limit = days * 864e5;
    ids = apps
      .filter(a => {
        const age = now - addedTime(a);
        return (age >= 0 && age < limit) || (seen && !seen.includes(a.name));
      })
      .map(a => a.id);
    try { sessionStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(ids)); } catch (_) { /* ignorar */ }
  }
  const set = new Set(ids);
  apps.forEach(a => { a.isNew = set.has(a.id); });
  return sortByAdded(apps.filter(a => a.isNew));
}

/* =====================================================================
   5. Búsqueda y filtrado
   ===================================================================== */

const searchCache = new Map(); // `${lang}:${id}` → texto normalizado

/** Texto buscable de una app: nombre, etiqueta, descripción y etiquetas, en el idioma activo. */
function searchText(app) {
  const key = `${currentLang}:${app.id}`;
  let s = searchCache.get(key);
  if (s == null) {
    const l = localizeApp(app);
    s = normalize([l.name, l.tag, l.desc, ...app.badges.map(badgeLabel)].join(" "));
    searchCache.set(key, s);
  }
  return s;
}

/**
 * Filtra apps. Todos los criterios son opcionales y se combinan con «Y».
 *
 * @param {object[]} apps
 * @param {object}   opts
 * @param {string}   [opts.query]     Texto libre (sin acentos ni mayúsculas).
 * @param {string[]} [opts.filters]   Ids de etiqueta: "new", "open-source", "no-ads"...
 * @param {string}   [opts.category]  Id de categoría.
 * @param {"added"|"name"|null} [opts.sort]  Orden. Con el filtro "new" activo se ordena por `added`.
 */
export function filterApps(apps, { query = "", filters = [], category = "", sort = null } = {}) {
  const q = normalize(query.trim());
  let out = apps.filter(a => {
    if (category && a.category !== category) return false;
    if (!filters.every(f => (f === "new" ? a.isNew : a.badges.includes(f)))) return false;
    return !q || searchText(a).includes(q);
  });
  if (sort === "added" || (!sort && filters.includes("new"))) out = sortByAdded(out);
  else if (sort === "name") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
  return out;
}
