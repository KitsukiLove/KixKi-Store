/*
  Botón de la barra y entrada del menú Kixki / Más para invocar o pausar a vaca.exe y gestionar el fondo.
*/

import { $, now, reducirMovimiento as RM } from "../../core/util.js";
import { memoria, segunIdioma } from "./config.js";
import { cowFriend, cowWin, kx, viva } from "./estado.js";
import { labels, sr } from "./hud.js";
import { puente } from "./puente.js";
import { TEXTOS } from "./textos.js";
/* ---------- fondo «¡Vacas!»: restaurar y pausar ---------- */
function syncBgLabel() {
  const b = $("#s-bg");
  if (b && window.KXB) b.textContent = "Fondo: " + KXB.label();
  const g = $("#bgb");
  if (g && window.KXB) g.title = "Fondo: " + KXB.label();
}

function barPauseLabel() {
  const p = KXB.paused() || RM();
  viva.barPause.textContent = p
    ? "▶ " + segunIdioma(TEXTOS.play)
    : "⏸ " + segunIdioma(TEXTOS.pause);
  viva.barPause.setAttribute("aria-pressed", String(!!KXB.paused()));
}

function buildBar() {
  if (viva.bar) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="kv-wp" class="kv-wp" role="group" hidden><button type="button" class="kv-b" id="kv-bp"></button><button type="button" class="kv-b" id="kv-br"></button></div>`
  );
  viva.bar = $("#kv-wp");
  viva.barPause = $("#kv-bp");
  viva.barRestore = $("#kv-br");
  viva.barPause.addEventListener("click", () => {
    KXB.pause();
    barPauseLabel();
  });
  viva.barRestore.addEventListener("click", () => restoreBg());
  labels();
}

function syncMenu() {
  if (!viva.callBtn) return;
  viva.callBtn.hidden = !(cowFriend() && !memoria.won && !viva.F && !viva.pend && !cowWin());
}

export function summon() {
  if (viva.F || viva.pend || cowWin() || memoria.won || !cowFriend()) return false;
  const left = memoria.next - now();
  if (left > 0) {
    if (viva.KK.ready && viva.S.on)
      kx(TEXTOS.summonWait, {
        key: "summonw",
        cd: 0,
        always: false,
        p: 2,
        vars: { m: Math.max(1, Math.ceil(left / 60e3)) },
      });
    return false;
  }
  if (!window.KXE || !KXE.cow) return false;
  KXE.cow();
  if (viva.KK.ready && viva.S.on && !viva.K.off)
    setTimeout(() => kx(TEXTOS.summonK, { key: "summon", cd: 0, always: false, p: 2 }), 400);
  return true;
}

export function syncBar() {
  const on = !!(window.KXB && KXB.cursed());
  if (on) buildBar();
  if (viva.bar) viva.bar.hidden = !on;
  if (viva.menuBtn) viva.menuBtn.hidden = !on;
  if (on && viva.barPause) barPauseLabel();
  syncMenu();
}

export function restoreBg() {
  if (!window.KXB || !KXB.cursed()) return;
  KXB.restore();
  syncBgLabel();
  syncBar();
  sr(segunIdioma(TEXTOS.srRestored));
  if (viva.KK.ready && viva.S.on && !viva.K.off)
    kx(TEXTOS.restoreK, { key: "restore", cd: 0, always: false, p: 2, ttl: 4500 });
}

export function buildMenu() {
  const sm = $("#sm");
  if (!sm || viva.menuBtn) return;
  const ref = $("#s-bg", sm);
  const html = '<button type="button" class="sm" id="s-kv-bg" hidden></button>';
  ref ? ref.insertAdjacentHTML("afterend", html) : sm.insertAdjacentHTML("beforeend", html);
  viva.menuBtn = $("#s-kv-bg");
  viva.menuBtn.addEventListener("click", () => {
    restoreBg();
    sm.hidden = true;
  });
  /* revancha: volver a llamar a vaca.exe (los 1000 toques solo la abren una vez en la vida) */
  viva.menuBtn.insertAdjacentHTML(
    "afterend",
    '<button type="button" class="sm" id="s-kv-call" hidden></button>'
  );
  viva.callBtn = $("#s-kv-call");
  viva.callBtn.addEventListener("click", () => {
    sm.hidden = true;
    summon();
  });
  new MutationObserver(syncMenu).observe(sm, { attributes: true, attributeFilter: ["hidden"] });
  labels();
}

puente.barPauseLabel = barPauseLabel;

puente.syncBgLabel = syncBgLabel;

puente.syncBar = syncBar;
