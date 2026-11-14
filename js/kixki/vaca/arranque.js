/*
  Arranque del combate: engancha eventos y publica window.KXV.
*/

import { borrar } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { buildMenu, restoreBg, summon, syncBar } from "./barra-menu.js";
import { memoria, CFG, memoriaInicial, save } from "./config.js";
import { busy, viva } from "./estado.js";
import { abort, endLose, endWin } from "./final.js";
import { labels } from "./hud.js";
import { start, tick } from "./inicio.js";
import { aimThrow } from "./lanzar.js";
import { TEXTOS } from "./textos.js";
/* ---------- arranque ---------- */
export function boot() {
  if (window.KXV || !window.KXK || !window.KXK3 || !window.KXQ || !window.KXB || !$("#desk"))
    return false;
  viva.KK = KXK;
  viva.K = viva.KK.K;
  viva.S = viva.KK.state;
  buildMenu();
  addEventListener("kixki-bg", () => {
    syncBar();
  });
  syncBar();
  if (window.KXI && !KXI._kv) {
    KXI._kv = 1;
    const o = KXI.set;
    KXI.set = function (l) {
      const r = o.call(KXI, l);
      labels();
      return r;
    };
  }
  setInterval(tick, 1000);
  addEventListener("pagehide", () => {
    if (viva.F) abort("hide");
  });
  window.KXV = {
    state: memoria,
    cfg: CFG,
    TX: TEXTOS,
    busy,
    get active() {
      return !!viva.F;
    },
    get cow() {
      return viva.F ? viva.F.cow : null;
    },
    get fight() {
      return viva.F;
    },
    start,
    aimThrow,
    summon,
    win: () => {
      if (viva.F) endWin();
    },
    lose: () => {
      if (viva.F) endLose();
    },
    abort,
    restore: restoreBg,
    infected: () => (viva.F ? viva.F.inf.size : 0),
    reset() {
      Object.assign(memoria, memoriaInicial);
      save();
      borrar("kixki-bgx");
      if (viva.F) abort("reset");
      if (window.KXB && KXB.cursed()) KXB.restore();
      syncBar();
    },
  };
  return true;
}
