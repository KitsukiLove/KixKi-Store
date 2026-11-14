/*
  Arranque de Kixki (start) y publicación de la API window.KXK.
*/

import { guardarTexto } from "../../core/store.js";
import { now, wait } from "../../core/util.js";
import { alive, brain, dark, visitFolder } from "./cerebro.js";
import { el } from "./elemento.js";
import { cancelEnter, enter, skipEnter } from "./entrada-juego.js";
import { start } from "./escaneo.js";
import { face, frame, K, place, R, recent, setMode, V } from "./estado.js";
import { labels } from "./eventos.js";
import { clearQ, emo, interrupt, layoutBubble, pick, say } from "./globo.js";
import { micro, setTalk } from "./interaccion.js";
import { S, save } from "./memoria.js";
import { busy, DBG, LOG, typing, usuario } from "./modos.js";
import {
  DLG,
  geo,
  hop,
  land,
  PLAT,
  relocate,
  stopMove,
  topWin,
  usable,
  walk,
} from "./movimiento.js";
import { FOTOGRAMAS } from "./sprites.js";
import { applyOn, poke } from "./sueno.js";
import { EMO, KXD, T } from "./textos.js";
import { ctxVars, emit, fmt, isPC, randApp, texto } from "./utilidades.js";
export function iniciar() {
  start();
  /* ---------- lo que Kixki ofrece a la parte 2 ---------- */
  window.KXK = {
    say,
    hop,
    walk,
    geo,
    emit,
    pick,
    state: S,
    save,
    get stage() {
      return K.stage;
    },
    get ready() {
      return K.ready;
    },
    isPC,
    tx: texto,
    fmt,
    T,
    wait,
    visitFolder,
    usable,
    relocate,
    /* (parte 2) */
    K,
    alive,
    interrupt,
    brain,
    dark,
    rows: FOTOGRAMAS,
    el,
    /* (etapa 4) vaciar la cola de un contexto sin cortar el globo; ms desde que se cerró el último globo (0 si habla); el globo actual */
    clearQ,
    quietFor: () => (K.talking ? 0 : now() - (K.endAt || 0)),
    get cur() {
      return V.cur;
    },
    /* (parte 4: gestor de diálogos) */
    get debug() {
      return DBG.on;
    },
    set debug(v) {
      DBG.on = !!v;
      guardarTexto("kixki-dbg", v ? "1" : "0");
    },
    timeline: () => LOG.slice(),
    clearTimeline: () => {
      LOG.length = 0;
    },
    /* presupuesto de frases espontáneas por minuto (y pausa mínima entre ellas, en ms); al cambiarlo se vacía el recuento */
    budget: (n, gap) => {
      if (n != null) {
        DLG.budget = Math.max(0, n | 0);
        DLG.sp = [];
      }
      if (gap != null) DLG.gap.sp = Math.max(0, gap | 0);
      return DLG.budget;
    },
    plat: (id, fn) => {
      PLAT[id] = fn;
    },
    /* (parte 3) textos, variables y generador por piezas */
    D: KXD,
    ctxVars,
    randApp,
    /* (parte 2) modo de charla y microreacciones */
    get mode() {
      return S.mode;
    },
    setTalk,
    micro,
    busy,
    busyWhy: () => ({ typing: typing(), win: usuario.win, game: !!K.game }),
    recentList: () => recent.slice(),
    /* (parte 3: travesuras y físicas, kixki3.js) */
    ex: { place, land, setMode, frame, face, stopMove, R, topWin, say, layoutBubble },
    /* (parte 4b) dormir, solo emojis y entrada a ventanas */
    enter,
    skipEnter,
    cancelEnter,
    get entering() {
      return !!K.enter;
    },
    emo,
    emoji: (kind) => pick(EMO[kind] || EMO.ui, "emo-" + kind),
    get quiet() {
      return S.mode === "quiet";
    },
    get sleeping() {
      return K.snooze;
    },
    setOn: (v) => {
      S.on = !!v;
      save();
      const r = applyOn();
      labels();
      return r;
    },
    poke,
  };
}
