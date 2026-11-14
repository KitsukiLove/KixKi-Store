/*
  Estaciones del año, día/noche y nombres de mundos y temporadas.
*/

import { XPV, xpv } from "./colina-xp.js";
import { actual, KEYS } from "./estado.js";
import { puente } from "./puente.js";
export let XPL;

export const seasonKey = (d) => {
  const m = d.getMonth() + 1,
    y = d.getDate(),
    v = m * 100 + y;
  if ((m === 10 && y >= 10) || (m === 11 && y <= 2)) return "halloween";
  if (m === 12 || (m === 1 && y <= 6)) return "navidad";
  return v < 320 ? "invierno" : v < 621 ? "primavera" : v < 922 ? "verano" : "otono";
};

const SUN = {
  invierno: [8, 18],
  navidad: [8, 18],
  otono: [7, 19],
  halloween: [7, 18],
  primavera: [7, 20],
  verano: [6, 21],
};

export const nightNow = () => {
  const d = new Date(),
    h = d.getHours(),
    r = SUN[seasonKey(d)];
  return h < r[0] || h >= r[1];
};

export const PT = {
  navidad: [26, "", 0],
  invierno: [40, "", 0],
  otono: [16, "var(--o)", 1],
  primavera: [12, "var(--o)", 1],
};

const SEA = {
  es: {
    auto: "Auto",
    "": "Clásico",
    clasica: "Clásica",
    valle: "Valle",
    primavera: "Primavera",
    verano: "Verano",
    otono: "Otoño",
    invierno: "Invierno",
    halloween: "Halloween",
    navidad: "Navidad",
  },
  en: {
    auto: "Auto",
    "": "Classic",
    clasica: "Classic",
    valle: "Meadow",
    primavera: "Spring",
    verano: "Summer",
    otono: "Autumn",
    invierno: "Winter",
    halloween: "Halloween",
    navidad: "Christmas",
  },
};

export const PXS = [
  "auto",
  "",
  "valle",
  "primavera",
  "verano",
  "otono",
  "invierno",
  "halloween",
  "navidad",
];

export const idioma = () => (window.KXI && KXI.lang === "en" ? "en" : "es");

export const worldOf = () =>
  KEYS[actual.i] === "xp" ? "xp" : KEYS[actual.i] === "vacas" ? "vacas" : "pixel";

export const seasonOf = () =>
  worldOf() === "xp" ? actual.XPS : KEYS[actual.i] === "" ? "clasica" : KEYS[actual.i];

export const seaName = (id) => {
  if (id === "clasica" && worldOf() === "pixel") id = "";
  return SEA[idioma()][id] || id;
};

export const seaEff = () => {
  const w = worldOf();
  if (w === "xp") return xpv();
  const k = KEYS[actual.i];
  return k === "auto" ? seasonKey(new Date()) : k;
};

export const wName = (w) =>
  w === "xp" ? "Colina XP" : w === "vacas" ? (idioma() === "en" ? "Cows!" : "¡Vacas!") : "Pixel";

export function iniciar() {
  /* Temporada según la fecha (hemisferio norte) y horas de luz aproximadas de cada una */

  /* ===== Mundo (Pixel / Colina XP) y Estación (parte 8) =====
   Dos ajustes que se entienden solos: «Fondo» elige el mundo (Pixel o Colina XP, si ya la ganaste) y «Estación» elige
   la temporada DEL mundo activo. Al cambiar de mundo se conserva la estación (Otoño pixel ↔ Otoño XP).
   Memoria: kixki-bg (clave del fondo pixel, o «xp») y kixki-xps (estación de la Colina XP). */

  XPL = ["auto"].concat(XPV);

  puente.seasonKey = seasonKey;
}
