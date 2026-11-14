/*
  Publica window.KXB y mantiene el fondo al día (cada minuto, y al volver a la pestaña).
*/

import { guardar } from "../../core/store.js";
import { crest, XPN, XPV, xpv } from "./colina-xp.js";
import {
  idioma,
  PXS,
  seaEff,
  seaName,
  seasonKey,
  seasonOf,
  wName,
  worldOf,
  XPL,
} from "./estaciones.js";
import { actual, box, KEYS, okKey, persist, saveX, X } from "./estado.js";
import { COLINA } from "./formas.js";
import { apply, autoSync, built, restore, setSeason, setWorld } from "./mundo.js";

const auto = () => {
  if (KEYS[actual.i] === "auto" && !document.hidden) {
    autoSync();
    if (seasonKey(new Date()) !== built) apply();
  } else if (
    KEYS[actual.i] === "xp" &&
    actual.XPS === "auto" &&
    !document.hidden &&
    "xp:" + xpv() !== built
  )
    apply();
};

export function iniciar() {
  window.KXB = {
    /* label() = el MUNDO («Pixel», «Colina XP», «¡Vacas!») · full() = mundo + estación · season() = id de la estación del mundo activo */
    label: () => wName(worldOf()),
    full: () =>
      wName(worldOf()) +
      (worldOf() === "vacas"
        ? ""
        : " · " +
          (seasonOf() === "auto" ? "Auto (" + seaName(seaEff()) + ")" : seaName(seasonOf()))),
    hill: COLINA,
    world: worldOf,
    setWorld,
    season: (id) => (id === undefined ? seasonOf() : setSeason(id)),
    seasons: () =>
      (worldOf() === "xp" ? XPL : PXS).map((id) => ({
        id: id === "" ? "clasica" : id,
        name: seaName(worldOf() === "xp" ? id : id),
      })),
    seasonLabel: () =>
      worldOf() === "vacas"
        ? ""
        : seasonOf() === "auto"
          ? "Auto · " + seaName(seaEff())
          : seaName(seasonOf()),
    nextSeason() {
      const w = worldOf();
      if (w === "vacas") {
        restore();
        return;
      }
      const L = (w === "xp" ? XPL : PXS).map((x) => (x === "" ? "clasica" : x)),
        c = L.indexOf(seasonOf());
      setSeason(L[(c + 1) % L.length]);
    },
    /* estaciones de la Colina XP (compatibilidad): xps() = lo elegido, xpv() = la que se ve ahora, xps(v) la cambia */
    XPV,
    xpv,
    xpn: (v) => XPN[idioma()][XPV.indexOf(v)] || v,
    xps(v) {
      if (v === undefined) return actual.XPS;
      if (v !== "auto" && XPV.indexOf(v) < 0) return actual.XPS;
      actual.XPS = v;
      guardar("kixki-xps", v);
      if (KEYS[actual.i] === "xp") apply();
      else dispatchEvent(new Event("kixki-bg"));
      return actual.XPS;
    },
    crest,
    /* desde «¡Vacas!» el botón de fondos te devuelve el que tenías; si no, pasa al siguiente que tengas disponible (los candados se saltan) */
    /* botón «Fondo»: con la Colina XP ganada alterna Pixel ↔ XP; si no, recorre las estaciones pixel */
    next() {
      if (KEYS[actual.i] === "vacas") {
        restore();
        return;
      }
      if (X.xp) {
        setWorld(worldOf() === "xp" ? "pixel" : "xp");
        return;
      }
      KXB.nextSeason();
    },
    /* (parte 6) usados por vacaboss.js */
    has: (k) => okKey(k),
    cursed: () => !!X.cursed && KEYS[actual.i] === "vacas",
    paused: () => !!X.pause,
    unlockXP() {
      X.xp = 1;
      saveX();
    },
    use(k) {
      const j = KEYS.indexOf(k);
      if (j < 0 || !okKey(k) || k === "vacas") return false;
      if (KEYS[actual.i] === "vacas") {
        X.cursed = 0;
        X.prev = "";
        saveX();
      }
      actual.i = j;
      actual.lastN = null;
      persist();
      apply();
      return true;
    },
    curse() {
      if (KEYS[actual.i] !== "vacas") X.prev = KEYS[actual.i];
      X.cursed = 1;
      saveX();
      actual.i = KEYS.indexOf("vacas");
      actual.lastN = null;
      persist();
      apply();
    },
    restore,
    pause(v) {
      X.pause = v == null ? (X.pause ? 0 : 1) : v ? 1 : 0;
      saveX();
      box.classList.toggle("kv-pause", !!X.pause);
      return !!X.pause;
    },
  };
  apply();
  /* Cada minuto: cambio día/noche y de temporada en modo Auto, sin tocar nada más */

  setInterval(auto, 60000);
  document.addEventListener("visibilitychange", auto);
}
