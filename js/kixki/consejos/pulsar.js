/*
  Detecta «mantener pulsado» (o clic derecho / Mayús + F10) sobre una carpeta.
*/

import { now } from "../../core/util.js";
import { closePop, abierto, openPop, pop } from "./boton.js";
import { desk, HOLD, MOVE_MOUSE, MOVE_TOUCH, ready } from "./estado.js";
let swallow;

const alSoltar = (e) => {
  if (!pulsacion.di || e.pointerId !== pulsacion.pid) return;
  const fired = pulsacion.fired;
  cancelPress();
  if (fired)
    setTimeout(() => {
      swallow = 0;
    }, 700);
  /* el clic que sigue ya no abrirá la carpeta */ else swallow = 0;
};

/* ---------- mantener pulsado ---------- */
const pulsacion = { t: 0, v: 0, di: null, x: 0, y: 0, touch: false, fired: false, pid: null };

function cancelPress() {
  clearTimeout(pulsacion.t);
  clearTimeout(pulsacion.v);
  if (pulsacion.di) pulsacion.di.classList.remove("kc-press");
  pulsacion.di = null;
  pulsacion.pid = null;
}

export function iniciar() {
  swallow = 0;
  desk.addEventListener("pointerdown", (e) => {
    if (e.button || !e.isPrimary) return; /* solo el botón principal / un dedo */
    const di = e.target.closest && e.target.closest(".di");
    if (!di || !ready()) {
      cancelPress();
      return;
    }
    cancelPress();
    pulsacion.di = di;
    pulsacion.x = e.clientX;
    pulsacion.y = e.clientY;
    pulsacion.touch = e.pointerType !== "mouse";
    pulsacion.fired = false;
    pulsacion.pid = e.pointerId;
    pulsacion.v = setTimeout(() => {
      if (pulsacion.di === di) di.classList.add("kc-press");
    }, 170); /* el aro de «mantén» solo se ve si sigues pulsando */
    pulsacion.t = setTimeout(() => {
      if (pulsacion.di !== di) return;
      pulsacion.fired = true;
      swallow = now() + 1500;
      di.classList.remove("kc-press");
      openPop(di, false);
    }, HOLD);
  });
  addEventListener(
    "pointermove",
    (e) => {
      if (!pulsacion.di || e.pointerId !== pulsacion.pid || pulsacion.fired) return;
      if (
        Math.hypot(e.clientX - pulsacion.x, e.clientY - pulsacion.y) >
        (pulsacion.touch ? MOVE_TOUCH : MOVE_MOUSE)
      )
        cancelPress(); /* el dedo se movió (scroll): cancelar */
    },
    true
  );

  addEventListener("pointerup", alSoltar, true);
  addEventListener(
    "pointercancel",
    (e) => {
      if (pulsacion.di && e.pointerId === pulsacion.pid && !pulsacion.fired) cancelPress();
      else alSoltar(e);
    },
    true
  );
  /* el «click» posterior a mantener pulsado no abre la carpeta (captura en window: va antes que app.js) */
  addEventListener(
    "click",
    (e) => {
      const di = e.target && e.target.closest && e.target.closest("#desk .di");
      if (di && now() < swallow) {
        swallow = 0;
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );
  /* clic derecho / menú contextual del móvil / tecla de menú: en vez del menú del navegador, la ayuda de Kixki */
  desk.addEventListener("contextmenu", (e) => {
    const di = e.target.closest && e.target.closest(".di");
    if (!di) return;
    e.preventDefault();
    if (!ready()) return;
    if (e.pointerType === "touch" || pulsacion.fired || pulsacion.di === di)
      swallow = Math.max(swallow, now() + 1500);
    openPop(di, e.pointerType === ""); /* pointerType "" = lo abrió el teclado */
  });
  /* teclado: tecla de menú o Mayús + F10 con una carpeta enfocada */
  desk.addEventListener("keydown", (e) => {
    const di = e.target.closest && e.target.closest(".di");
    if (!di) return;
    if (e.key === "ContextMenu" || (e.key === "F10" && e.shiftKey)) {
      e.preventDefault();
      openPop(di, true);
    }
  });
  /* dentro del botón */
  pop.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closePop();
    } else if (e.key === "Tab") {
      closePop(true);
    }
  });
  pop.addEventListener("focusout", (e) => {
    const to = e.relatedTarget;
    if (!to || (!pop.contains(to) && !(abierto.el && abierto.el.contains(to))))
      setTimeout(() => {
        if (
          !pop.contains(document.activeElement) &&
          !pop.hidden &&
          now() - abierto.at > 400 &&
          !abierto.viaKey
        )
          closePop(true);
      }, 0);
  });
  /* tocar fuera, desplazarse, redimensionar, cambiar de pestaña… */
  addEventListener(
    "pointerdown",
    (e) => {
      if (!pop.hidden && !pop.contains(e.target)) closePop(true);
    },
    true
  );
  addEventListener(
    "scroll",
    () => {
      if (!pop.hidden && now() - abierto.at > 450) closePop(true);
    },
    { passive: true, capture: true }
  );
  addEventListener("resize", () => {
    if (!pop.hidden) closePop(true);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) closePop(true);
  });
  addEventListener("blur", () => closePop(true));
}
