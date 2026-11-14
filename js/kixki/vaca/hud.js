/*
  Barra de vida de la vaca y de infección del escritorio (HUD) y sus textos.
*/

import { $ } from "../../core/util.js";
import { CFG, segunIdioma } from "./config.js";
import { icons, viva } from "./estado.js";
import { puente } from "./puente.js";
import { TEXTOS } from "./textos.js";
/* ---------- interfaz: barra del combate ---------- */
export function buildHud() {
  if (viva.hud) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="kv-hud" class="kv-hud" role="group" hidden>
      <div class="kv-row"><b class="kv-nm"></b><span class="kv-hp" id="kv-hp" role="img"></span></div>
      <div class="kv-row"><span class="kv-l" id="kv-il"></span><div class="kv-bar" id="kv-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><span class="kv-pc" id="kv-pc" aria-hidden="true">0%</span></div>
      <div class="kv-row"><span class="kv-fc" id="kv-fc"></span><button type="button" class="kv-th" id="kv-th" aria-keyshortcuts="L"></button></div>
    </div>
    <div id="kv-live" class="kk-sr" role="status" aria-live="polite"></div>`
  );
  viva.hud = $("#kv-hud");
  viva.live = $("#kv-live");
  $("#kv-th").addEventListener("click", () => {
    if (!puente.aimThrow()) sr(segunIdioma(TEXTOS.srNoThrow));
  });
  labels();
}

export function sr(t) {
  if (!viva.live) return;
  viva.live.textContent = "";
  setTimeout(() => {
    if (viva.live) viva.live.textContent = t;
  }, 40);
}

export function labels() {
  if (viva.hud) {
    viva.hud.setAttribute("aria-label", segunIdioma(TEXTOS.group));
    $(".kv-nm", viva.hud).textContent = "🐄 " + segunIdioma(TEXTOS.name);
    $("#kv-il").textContent = segunIdioma(TEXTOS.infL);
    $("#kv-bar").setAttribute("aria-label", segunIdioma(TEXTOS.infL));
    const b = $("#kv-th");
    b.textContent = segunIdioma(TEXTOS.throwB);
    b.title = segunIdioma(TEXTOS.throwT);
    if (viva.F) {
      hpView();
      infView();
    }
  }
  if (viva.menuBtn) {
    viva.menuBtn.textContent = segunIdioma(TEXTOS.restore);
    viva.menuBtn.title = segunIdioma(TEXTOS.restoreT);
  }
  if (viva.callBtn) {
    viva.callBtn.textContent = "🐄 " + segunIdioma(TEXTOS.summonLabel);
    viva.callBtn.title = segunIdioma(TEXTOS.summonT);
  }
  if (viva.barRestore) {
    viva.barRestore.textContent = "↩ " + segunIdioma(TEXTOS.restore);
    viva.barRestore.title = segunIdioma(TEXTOS.restoreT);
  }
  if (viva.barPause) puente.barPauseLabel();
}

export function hpView() {
  if (!viva.F) return;
  const hp = viva.F.cow.hp,
    max = CFG.hp;
  $("#kv-hp").innerHTML = Array.from(
    { length: max },
    (_, i) => `<i class="${i < hp ? "on" : ""}"></i>`
  ).join("");
  $("#kv-hp").setAttribute("aria-label", segunIdioma(TEXTOS.hpL) + ": " + hp + "/" + max);
  const m = $(".kv-mini", viva.cowEl);
  if (m)
    m.innerHTML = Array.from(
      { length: max },
      (_, i) => `<i class="${i < hp ? "on" : ""}"></i>`
    ).join("");
}

export function infPct() {
  return viva.F ? Math.min(100, Math.round(viva.F.inf.size * CFG.perIcon + viva.F.creep)) : 0;
}

export function infView() {
  if (!viva.F) return;
  const p = infPct(),
    n = icons().length;
  const bb = $("#kv-bar");
  bb.setAttribute("aria-valuenow", p);
  bb.setAttribute("aria-valuetext", p + "%");
  $("i", bb).style.width = p + "%";
  $("#kv-pc").textContent = p + "%";
  viva.hud.classList.toggle("hot", p >= 70);
  $("#kv-fc").textContent = segunIdioma(TEXTOS.fold) + " " + viva.F.inf.size + "/" + n;
}
