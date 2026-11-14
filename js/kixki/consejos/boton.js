/*
  Botón flotante «Pedir ayuda a Kixki»: se coloca junto a la carpeta, se abre y se cierra.
*/

import { $, $$, now } from "../../core/util.js";
import { TEXTOS_UI } from "./config.js";
import { desk, indiceIdioma, ready } from "./estado.js";
export let pop, askBtn;

let askTx, hint;

function labels() {
  const l = indiceIdioma();
  askTx.textContent = TEXTOS_UI.ask[l];
  pop.setAttribute("aria-label", TEXTOS_UI.group[l]);
  hint.textContent = TEXTOS_UI.hint[l];
  $$(".di", desk).forEach((d) => d.setAttribute("aria-describedby", "kc-hint"));
}

/* ---------- abrir / cerrar ---------- */
export const abierto = { id: null, el: null, at: 0, viaKey: false, autoT: 0 };

function place(di) {
  const r = di.getBoundingClientRect(),
    w = pop.offsetWidth,
    h = pop.offsetHeight,
    vw = innerWidth,
    vh = innerHeight,
    gap = 8;
  let x, y;
  if (r.right + gap + w <= vw - 8) {
    x = r.right + gap;
    y = r.top + (r.height - h) / 2;
  } /* a la derecha del icono (PC) */ else {
    x = r.left + (r.width - w) / 2;
    y =
      r.top - h - gap >= 8
        ? r.top - h - gap
        : r.bottom + gap; /* encima (o debajo si no cabe) en las fichas del móvil */
  }
  x = Math.max(8, Math.min(vw - 8 - w, x));
  y = Math.max(8, Math.min(vh - 8 - h, y));
  pop.style.left = Math.round(x) + "px";
  pop.style.top = Math.round(y) + "px";
}

export function openPop(di, viaKey) {
  if (!di || !ready()) return false;
  const id = di.dataset.id;
  if (abierto.id === id && !pop.hidden) {
    if (viaKey) askBtn.focus({ preventScroll: true });
    return true;
  }
  closePop(true);
  abierto.id = id;
  abierto.el = di;
  abierto.at = now();
  abierto.viaKey = !!viaKey;
  di.classList.add("kc-on");
  pop.hidden = false;
  place(di);
  try {
    askBtn.focus({ preventScroll: true });
  } catch (e) {
    // focus() falla si el elemento ya no está en el documento; no pasa nada.
  } /* el lector de pantalla lo anuncia al recibir el foco */
  try {
    if (navigator.vibrate) navigator.vibrate(12);
  } catch (e) {
    // No todos los dispositivos vibran; es un extra.
  }
  clearTimeout(abierto.autoT);
  abierto.autoT = setTimeout(function tick() {
    if (pop.hidden) return;
    if (!ready()) {
      closePop();
      return;
    }
    if (pop.contains(document.activeElement)) {
      abierto.autoT = setTimeout(tick, 3000);
      return;
    } /* con el foco dentro no se esconde sola */
    closePop();
  }, 9000);
  return true;
}

export function closePop(silent) {
  clearTimeout(abierto.autoT);
  const hadFocus = pop.contains(document.activeElement),
    el = abierto.el;
  if (el) el.classList.remove("kc-on");
  pop.hidden = true;
  abierto.id = null;
  abierto.el = null;
  if (hadFocus && el && el.isConnected && !silent) {
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      // focus() falla si el elemento ya no está en el documento; no pasa nada.
    }
  }
}

export function iniciar() {
  /* ---------- botón flotante ---------- */
  pop = document.createElement("div");
  pop.id = "kc-pop";
  pop.className = "kc-pop";
  pop.setAttribute("role", "group");
  pop.hidden = true;
  pop.innerHTML = `<button type="button" class="kc-ask"><span class="kc-em" aria-hidden="true">🐑</span> <span class="kc-t"></span></button>`;
  askBtn = $(".kc-ask", pop);
  askTx = $(".kc-t", pop);
  hint = document.createElement("span");
  hint.id = "kc-hint";
  hint.className = "kk-sr";
  document.body.append(pop, hint);
  labels();
  if (window.KXI && !KXI._k4) {
    KXI._k4 = 1;
    const o = KXI.set;
    KXI.set = function (l) {
      o.call(KXI, l);
      labels();
      closePop();
    };
  }
}
