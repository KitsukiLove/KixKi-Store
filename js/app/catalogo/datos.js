/*
  Carga del catálogo (apps.json) y metadatos (data/meta.json).
  Publica: D (catálogo crudo), C (categorías con apps en forma de lista), M (logos y repos), META (nombre corto y color).
*/

import { guardar, leer } from "../../core/store.js";
export let catalogoJson, metaApps, categorias;

/* getJ comparte la descarga: tienda.js pide los mismos JSON y antes se bajaban dos veces (window.KXJ guarda las promesas) */
const getJ = (window.KXJ_get = (u) =>
  (window.KXJ = window.KXJ || {})[u] ||
  (window.KXJ[u] = (async () => {
    try {
      const r = await fetch(u);
      return r.ok ? await r.json() : null;
    } catch (e) {
      return null;
    }
  })()));

/* Nombre corto y color de cada categoría */
export const META = {
  tiendas: ["Tiendas", "#8b6cf0"],
  importante: ["Importante", "#f5a524"],
  utilidad: ["Utilidad", "#3aa6e8"],
  privacidad: ["Privacidad", "#2fb8c4"],
  emulacion: ["Emulación", "#e5584f"],
  decoracion: ["Decoración", "#f06aa8"],
  musica: ["Música", "#36c08e"],
  teclados: ["Teclados", "#7c8cf5"],
  control: ["Control", "#9bc53d"],
  pantalla: ["Pantalla", "#e8883b"],
  fotos: ["Fotos", "#b57cf0"],
  internet: ["Internet", "#4f7df0"],
  dia: ["Día a día", "#d6a84a"],
  mensajeria: ["Mensajería", "#d86ae0"],
  sistemas: ["Sistemas", "#8e9aaf"],
};

/** Carga los datos. Devuelve false si no se pudo cargar el catálogo (la página queda con un aviso). */
export async function iniciar() {
  catalogoJson = await getJ("apps.json");
  if (!catalogoJson) {
    document.getElementById("app").innerHTML =
      '<p class="empty">No se pudo cargar el catálogo. Revisa tu conexión y recarga.</p>';
    return false;
  }
  /* Renombrar una app sin perder las favoritas de nadie: pon el nombre viejo en su bloque de apps.json ("old":["Nombre viejo"]). */
  try {
    const ren = {};
    catalogoJson.categories.forEach((c) =>
      c.apps.forEach((a) =>
        (a.old || []).forEach((o) => {
          ren[o] = a.name;
        })
      )
    );
    if (Object.keys(ren).length)
      ["kixki-fav", "kixki-have", "kixki-seen"].forEach((k) => {
        const v = leer(k);
        if (Array.isArray(v) && v.some((n) => ren[n])) {
          const out = [];
          v.forEach((n) => {
            n = ren[n] || n;
            if (!out.includes(n)) out.push(n);
          });
          guardar(k, out);
        }
      });
  } catch (e) {
    // Migración de favoritos antigua: si los datos están dañados se descartan.
  }
  metaApps = Object.assign({ logos: {}, repos: {} }, await getJ("data/meta.json"));
  categorias = catalogoJson.categories.map((c) => ({
    id: c.id,
    e: c.e,
    t: c.t,
    s: c.s,
    a: c.apps.map((a) => [a.name, a.tag, a.desc, a.links, a.tip || "", a.logo || null]),
  }));
  return true;
}
