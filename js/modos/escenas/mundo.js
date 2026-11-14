/*
  Elegir mundo y estación, sincronizar con la fecha y pintar el fondo activo (apply).
*/

import { guardar } from "../../core/store.js";
import { xpv } from "./colina-xp.js";
import { nightNow, PT, PXS, seasonKey, worldOf, XPL } from "./estaciones.js";
import { actual, box, KEYS, okKey, persist, root, saveX, X } from "./estado.js";
import { PAISAJES, ESCENAS } from "./paisajes.js";
export let built;

export function setSeason(id) {
  const w = worldOf();
  if (w === "vacas") return false;
  if (w === "xp") {
    if (XPL.indexOf(id) < 0) return false;
    actual.XPS = id;
    guardar("kixki-xps", id);
    actual.lastN = null;
    apply();
    return true;
  }
  const k = id === "clasica" ? "" : id;
  if (PXS.indexOf(k) < 0) return false;
  actual.i = KEYS.indexOf(k);
  actual.lastN = null;
  persist();
  apply();
  return true;
}

export function setWorld(w) {
  const cur = worldOf();
  if (w === cur || cur === "vacas") return false;
  if (w === "xp") {
    if (!X.xp) return false;
    const k = KEYS[actual.i];
    actual.XPS = k === "auto" ? "auto" : k === "" || k === "valle" ? "clasica" : k;
    guardar("kixki-xps", actual.XPS);
    actual.i = KEYS.indexOf("xp");
  } else {
    actual.i = KEYS.indexOf(
      actual.XPS === "auto" ? "auto" : actual.XPS === "clasica" ? "" : actual.XPS
    );
    if (actual.i < 0) actual.i = 0;
  }
  actual.lastN = null;
  persist();
  apply();
  return true;
}

/* En modo Auto el día/noche sigue la hora local; si lo cambias a mano, se respeta hasta el siguiente cambio de hora */
export function autoSync() {
  if (KEYS[actual.i] !== "auto" && !(KEYS[actual.i] === "xp" && actual.XPS === "auto")) return;
  const n = nightNow();
  if (n === actual.lastN) return;
  actual.lastN = n;
  const t = n ? "dark" : "light";
  if (root.getAttribute("data-theme") !== t) {
    root.setAttribute("data-theme", t);
    const m = document.getElementById("tc");
    if (m) m.setAttribute("content", n ? "#150c33" : "#efe6ff");
  }
}

export function apply() {
  let k = KEYS[actual.i];
  if (k === "auto") {
    autoSync();
    k = seasonKey(new Date());
  } else if (k === "xp" && actual.XPS === "auto") autoSync();
  if (!k) {
    root.removeAttribute("data-bg");
    box.innerHTML = "";
    built = "";
    dispatchEvent(new Event("kixki-bg"));
    return;
  }
  root.setAttribute("data-bg", k);
  const n = root.getAttribute("data-theme") === "dark" ? 1 : 0;
  let pk = k,
    xv = "";
  if (k === "xp") {
    xv = xpv();
    root.setAttribute("data-xps", xv);
    if (xv !== "clasica") pk = "xp_" + xv;
  } else root.removeAttribute("data-xps");
  "s1 s2 s3 s4 g1 g2 g3 a t o c p k"
    .split(" ")
    .forEach((v, j) => box.style.setProperty("--" + v, PAISAJES[pk][n][j]));
  box.style.setProperty("--so", n || k === "halloween" || xv === "halloween" ? 1 : 0);
  box.style.setProperty(
    "--co",
    k === "xp"
      ? xv === "halloween"
        ? 0.6
        : n
          ? 0.5
          : 1
      : k === "halloween" || k === "navidad"
        ? 0
        : n
          ? 0.45
          : 1
  );
  box.classList.toggle("kv-pause", !!X.pause);
  if (k === "vacas") {
    if (built !== k) {
      built = k;
      box.innerHTML = '<i class="kv-mos a"></i><i class="kv-mos b"></i>';
    }
    dispatchEvent(new Event("kixki-bg"));
    return;
  }
  const bk = k === "xp" ? "xp:" + xv : k;
  if (built !== bk) {
    built = bk;
    const sr = ESCENAS[k].smooth ? "geometricPrecision" : "crispEdges";
    box.innerHTML =
      `<svg class="top" viewBox="0 0 64 24" shape-rendering="${sr}" aria-hidden="true">${ESCENAS[k].top}</svg><svg class="bot" viewBox="0 0 64 40" shape-rendering="${sr}" aria-hidden="true">${ESCENAS[k].bot}</svg>` +
      (PT[k]
        ? Array.from(
            { length: PT[k][0] },
            (_, j) =>
              `<i class="snow" style="left:${(j * 37 + 9) % 100}%;--d:${9 + ((j * 5) % 8)}s;--dl:-${(j * 3) % 9}s;--z:${(PT[k][2] ? 3 : 2) + (j % 3)}px${PT[k][2] ? ";background:" + PT[k][1] : ""}"></i>`
          ).join("")
        : "");
  }
  dispatchEvent(new Event("kixki-bg"));
}

export function restore() {
  X.cursed = 0;
  const p = KEYS.indexOf(X.prev);
  actual.i = p >= 0 && okKey(X.prev) && X.prev !== "vacas" ? p : 0;
  X.prev = "";
  saveX();
  actual.lastN = null;
  persist();
  apply();
}

export function iniciar() {
  built = "";
  new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
}
