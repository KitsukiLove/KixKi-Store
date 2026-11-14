/*
  Ventana de la cancha: abrir, cerrar, pestaña y desbloqueo del básquet secreto.
*/

import { $ } from "../../core/util.js";
import { memoria, save, TEXTOS } from "./config.js";
import { build, fit, hideDots, labels, newShot, show, stat, tabLabel } from "./dibujo.js";
import { game, viva } from "./estado.js";
import { phrase } from "./frases.js";
import { feet, hookSkip, reveal } from "./partida.js";
import { puente } from "./puente.js";
import { loop } from "./simulacion.js";
/* ---------- abrir y cerrar ---------- */
export function openWin() {
  build();
  labels();
  viva.box.hidden = false;
  viva.open = true;
  fit();
  requestAnimationFrame(fit);
  clearTimeout(viva.matchT);
  clearTimeout(viva.lastT);
  Object.assign(game, { pts: 0, taken: 0, streak: 0, shot: 1 });
  newShot();
  stat();
  viva.st = null;
  cancelAnimationFrame(viva.raf);
  viva.raf = requestAnimationFrame(loop);
  try {
    $("#bk-x").focus({ preventScroll: true });
  } catch (e) {
    // focus() falla si el elemento ya no está en el documento; no pasa nada.
  }
  /* la Kixki de la página se sube a la ventana, se tropieza y cae dentro; solo entonces empieza el juego */
  game.state = "enter";
  show();
  if (window.KXK && KXK.enter) {
    hookSkip(true);
    KXK.enter("bask", { fall: true, hide: true, target: feet })
      .then(() => {
        if (viva.open && game.state === "enter") reveal();
      })
      .catch(() => {
        if (viva.open && game.state === "enter") reveal();
      });
  } else reveal();
}

function closed() {
  viva.open = false;
  cancelAnimationFrame(viva.raf);
  clearTimeout(viva.sayT);
  clearTimeout(viva.matchT);
  clearTimeout(viva.lastT);
  viva.say.hidden = true;
  hookSkip(false);
  const played = game.taken > 0 || game.pts > 0,
    pts = game.pts;
  if (window.KXK && KXK.cancelEnter)
    KXK.cancelEnter(); /* cerraron a medias: sin estados colgados */
  game.state = "idle";
  hideDots();
  if (played && window.KXK && KXK.ready) {
    const m = phrase("end", { p: pts });
    /* un momento después: al cerrar, Kixki vuelve a su sitio (relocate) y eso corta cualquier globo; así la despedida sale al llegar */
    if (m)
      setTimeout(() => {
        try {
          KXK.say(m, { p: 2, key: "bkclose", cd: 0, emo: "bkEnd" });
        } catch (e) {
          // La frase de Kixki es opcional: si no está lista, no se dice.
        }
      }, 160);
  }
}

/* Esc y tocar fuera de la ventana la cierran: ya lo hace app.js con la clase «ovl» */

/* ---------- la pestañita del borde ---------- */
export function makeTab(anim) {
  if (viva.tabEl) return;
  viva.tabEl = document.createElement("button");
  viva.tabEl.type = "button";
  viva.tabEl.id = "bk-tab";
  viva.tabEl.innerHTML = `<svg viewBox="0 0 10 10" width="20" height="20" shape-rendering="crispEdges" aria-hidden="true"><path fill="#c94a12" d="M3 0h4v1h2v1h1v6H9v1H7v1H3V9H1V8H0V2h1V1h2z"/><path fill="#ff8a2e" d="M3 1h4v1h1v1H7v1h2v2H7v1h1v1H7v1H3V8H2V7h1V6H1V4h2V3H2V2h1z"/><path fill="#7a2b00" d="M4 1h1v8H4zM0 4h10v1H0z" opacity=".55"/></svg>`;
  viva.tabEl.addEventListener("click", () => {
    openWin();
  });
  document.body.append(viva.tabEl);
  tabLabel();
  if (anim) viva.tabEl.classList.add("new");
  setTimeout(() => viva.tabEl && viva.tabEl.classList.remove("new"), 3600);
}

export function unlock(first) {
  if (!memoria.u) {
    memoria.u = 1;
    save();
  }
  makeTab(!!first);
  if (first && window.KXK) {
    setTimeout(() => {
      try {
        KXK.say(TEXTOS.unlock[0], { p: 3, key: "bkunlock", cd: 0 });
      } catch (e) {
        // La frase de Kixki es opcional: si no está lista, no se dice.
      }
    }, 2200);
  }
}

puente.closed = closed;
