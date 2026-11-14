/*
  Datos extra de apps.json (Android mínimo, Shizuku/root/ADB) y estado de carga.
*/

import { getJ } from "./comun.js";

let estadoCarga;

export const EXT = {};

export const stat = (a) => estadoCarga[a.dataset.repo] || null;

export async function loadData() {
  const [d, m] = await Promise.all([getJ("apps.json"), getJ("data/meta.json")]);
  if (d && Array.isArray(d.categories))
    d.categories.forEach((c) =>
      (c.apps || []).forEach((a) => {
        EXT[a.name] = {
          min: +a.min || 0,
          priv: a.priv ? 1 : 0,
          added: a.added || "",
          es: { tag: a.tag || "", desc: a.desc || "", tip: a.tip || "" },
        };
      })
    );
  if (m && m.repos && typeof m.repos === "object") estadoCarga = m.repos;
}

export function iniciar() {
  /* ---------- datos extra de apps.json (min = Android mínimo, priv = necesita Shizuku, root o ADB) y estadísticas ---------- */

  estadoCarga = {};
}
