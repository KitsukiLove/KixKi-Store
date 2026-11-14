/*
  Piezas del mundo XP (chillout de los 2000) y elección de la pieza según fondo, estación y día/noche.
*/

import { BASE, BATERIA } from "./bateria.js";
import { root } from "./estado.js";
import { PXD, PXN } from "./piezas-pixel.js";

let BASE_XP, XPD;

const mk = (b, o) => Object.assign({}, BASE, b || {}, o);

export const PIEZAS_PIXEL = {};

export const PIEZAS_XP = {};

export const pick = () => {
  const bg = root.getAttribute("data-bg"),
    nt = root.getAttribute("data-theme") === "dark" ? "night" : "day";
  if (bg === "xp") {
    const s = root.getAttribute("data-xps");
    return PIEZAS_XP[PIEZAS_XP[s] ? s : "clasica"][nt];
  }
  return (PIEZAS_PIXEL[bg] || PIEZAS_PIXEL.classic)[nt];
};

export function iniciar() {
  /* ───────────── XP (chillout de los 2000) ───────────── */
  BASE_XP = {
    lead: "ep",
    lv: 0.3,
    pad: 0.07,
    bass: "sub",
    bv: 0.22,
    arp: 0,
    sc: "maj",
    dr: BATERIA.chill,
    sw: 0.35,
    dl: 0.28,
    rv: 0.4,
    sp: 0.45,
    sus: 1.5,
    lp: 4600,
    lo: 62,
    hi: 86,
  };
  XPD = {
    clasica: {
      bpm: 84,
      key: 60,
      prog: [
        [0, "M9"],
        [9, "m9"],
        [5, "M9"],
        [7, "d"],
      ],
      prog2: [
        [2, "m9"],
        [7, "d"],
        [4, "m"],
        [9, "m9"],
      ],
      seed: 31,
      den: 1,
    },
    primavera: {
      bpm: 92,
      key: 62,
      sc: "lyd",
      prog: [
        [0, "M9"],
        [4, "m"],
        [5, "M9"],
        [7, "M6"],
      ],
      prog2: [
        [9, "m"],
        [5, "M9"],
        [0, "M9"],
        [7, "M6"],
      ],
      seed: 32,
      den: 1,
      sp: 0.6,
    },
    verano: {
      bpm: 100,
      key: 65,
      dr: BATERIA.bossa,
      prog: [
        [0, "M9"],
        [5, "M9"],
        [2, "m9"],
        [7, "d"],
      ],
      prog2: [
        [9, "m9"],
        [2, "m9"],
        [7, "d"],
        [0, "M9"],
      ],
      seed: 33,
      den: 1,
      sw: 0.2,
    },
    otono: {
      bpm: 76,
      key: 57,
      sc: "dor",
      prog: [
        [0, "m9"],
        [5, "M9"],
        [3, "M9"],
        [7, "d"],
      ],
      prog2: [
        [0, "m9"],
        [10, "M9"],
        [5, "M9"],
        [7, "d"],
      ],
      seed: 34,
      den: 1,
      dr: BATERIA.chills,
    },
    invierno: {
      bpm: 66,
      key: 60,
      prog: [
        [0, "M9"],
        [4, "m"],
        [5, "M9"],
        [9, "m9"],
      ],
      prog2: [
        [5, "M9"],
        [7, "d"],
        [9, "m9"],
        [0, "M9"],
      ],
      seed: 35,
      den: 0,
      dr: null,
      pad: 0.1,
      sus: 2.4,
      sp: 0.6,
      lead: "bell",
    },
    halloween: {
      bpm: 74,
      key: 57,
      sc: "har",
      prog: [
        [0, "m"],
        [8, "M"],
        [7, "d"],
        [0, "m"],
      ],
      prog2: [
        [5, "m"],
        [3, "M"],
        [7, "d"],
        [0, "m"],
      ],
      seed: 36,
      den: 0,
      dr: BATERIA.heart,
      lead: "vib",
      lv: 0.24,
      pad: 0.09,
      sus: 2.4,
      sp: 0.5,
    },
    navidad: {
      bpm: 88,
      key: 60,
      prog: [
        [0, "M"],
        [9, "m"],
        [2, "m"],
        [7, "d"],
      ],
      prog2: [
        [5, "M"],
        [7, "d"],
        [4, "m"],
        [0, "M"],
      ],
      seed: 37,
      den: 1,
      dr: BATERIA.bell,
      lead: "bell",
      lv: 0.32,
      sp: 0.5,
    },
  };

  for (const k in PXD)
    PIEZAS_PIXEL[k] = { day: mk(0, PXD[k]), night: mk(0, Object.assign({}, PXD[k], PXN[k])) };
  for (const k in XPD) PIEZAS_XP[k] = { day: mk(BASE_XP, XPD[k]), night: null };
  for (const k in PIEZAS_XP) {
    const d = PIEZAS_XP[k].day;
    PIEZAS_XP[k].night = mk(
      BASE_XP,
      Object.assign({}, XPD[k], {
        bpm: Math.round(d.bpm * 0.82),
        dr:
          d.dr && (d.dr === BATERIA.chill || d.dr === BATERIA.bossa)
            ? BATERIA.chills
            : d.dr === BATERIA.bell
              ? BATERIA.bells
              : d.dr,
        lv: d.lv * 0.9,
        pad: d.pad * 1.25,
        lp: 3800,
        den: Math.max(0, d.den - 1),
        seed: d.seed + 50,
        key: d.key - (d.key > 62 ? 5 : 0),
      })
    );
  }
  PIEZAS_PIXEL.vacas = PIEZAS_PIXEL.classic;
}
