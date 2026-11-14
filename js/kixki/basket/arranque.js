/*
  Arranque del básquet: engancha los eventos de Kixki y publica window.KXBK.
*/

import { beginFlight } from "./arrastre.js";
import { memoria, FLOOR, NEED, RADIO_PELOTA, SHOTS, WIN_PTS } from "./config.js";
import { labels, tabLabel } from "./dibujo.js";
import { game, viva } from "./estado.js";
import { phrase } from "./frases.js";
import { scored } from "./simulacion.js";
import { makeTab, openWin, unlock } from "./ventana.js";
/* ---------- arranque ---------- */
export function boot() {
  if (window.KXBK) return;
  if (memoria.u) makeTab(false);
  addEventListener("kixki-evt", (e) => {
    const d = e.detail || {};
    if (d.t === "throw" && !memoria.u && (d.n | 0) >= NEED) unlock(true);
  });
  if (window.KXI && !KXI._bk) {
    KXI._bk = 1;
    const o = KXI.set;
    KXI.set = function (l) {
      o.call(KXI, l);
      labels();
      tabLabel();
    };
  }
  window.KXBK = {
    state: memoria,
    unlock: () => unlock(true),
    open: openWin,
    need: NEED,
    /* para las pruebas automáticas: estado de la partida y un tiro simulado («score» o «miss») que pasa por el mismo código que uno real */
    match: () => ({
      pts: game.pts,
      shot: game.shot,
      taken: game.taken,
      streak: game.streak,
      state: game.state,
      open: viva.open,
    }),
    sim: (kind) => {
      if (!viva.open || game.state !== "ready") return false;
      beginFlight();
      if (kind === "score")
        setTimeout(() => {
          if (viva.open && game.state === "fly" && !game.scored) scored();
        }, 450);
      game.y = FLOOR - RADIO_PELOTA - 2;
      game.vx = 0;
      game.vy = 0;
      return true;
    },
    shots: SHOTS,
    win: WIN_PTS,
    phrase,
  };
}
