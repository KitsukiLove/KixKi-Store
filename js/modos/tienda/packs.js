/*
  Packs guiados: Kixki te lleva app por app.
*/

import { $, $$ } from "../../core/util.js";
import { haveSet } from "./avisos.js";
import { ensureWizard, talk } from "./bienvenida.js";
import { esc, texto, nm, origs } from "./comun.js";
import { EXT } from "./datos.js";
import { prof } from "./perfil.js";
import { puente } from "./puente.js";

export const viva = { G: null };

const PACKFOR = {
  ini: "Para empezar",
  priv: "Privacidad",
  look: "Personalizar",
  mus: "Música",
  opt: "Optimización",
};

const packEl = (pk) => $$("#packs .app[data-pk]").find((x) => x.dataset.pk === pk) || null;

const firstSentences = (t, n) => {
  t = String(t || "");
  if (t.length <= n) return t;
  const c = t.slice(0, n),
    i = Math.max(c.lastIndexOf(". "), c.lastIndexOf("; "));
  return i > 60 ? c.slice(0, i + 1) : c.replace(/\s+\S*$/, "") + "…";
};

function packsFor(p) {
  const out = [];
  if (p.t === "ini") out.push(PACKFOR.ini);
  (p.i || []).forEach((k) => {
    if (PACKFOR[k] && !out.includes(PACKFOR[k])) out.push(PACKFOR[k]);
  });
  return out.filter(packEl).slice(0, 2);
}

export function decoratePacks() {
  $$("#packs .app[data-pk]").forEach((a) => {
    let b = a.querySelector(".kg-open");
    if (!b) {
      b = document.createElement("button");
      b.type = "button";
      b.className = "btn kg-open";
      b.dataset.guide = a.dataset.pk;
      const cp = a.querySelector("[data-cp]");
      cp ? cp.before(b) : a.querySelector(".links").append(b);
    }
    b.textContent = "🧭 " + texto("Guíame", "Guide me");
    b.setAttribute(
      "aria-label",
      texto("Guíame paso a paso: pack ", "Guide me step by step: pack ") +
        a.querySelector("h3").textContent
    );
  });
}

function openGuide(pk) {
  const art = packEl(pk);
  if (!art) return;
  const p = prof(),
    have = haveSet(),
    apps = origs(),
    items = [],
    skipped = [];
  [...art.querySelectorAll("button[data-go]")].forEach((b) => {
    const n = b.dataset.go,
      a = apps.find((x) => nm(x) === n);
    if (!a) return;
    const x = EXT[n] || {};
    let why = null;
    if (have.has(n)) why = "have";
    else if (p && p.a && x.min && x.min > p.a) why = "min";
    else if (p && x.priv && p.p !== "si") why = "priv";
    why ? skipped.push([n, why]) : items.push(n);
  });
  viva.G = { pk, title: art.querySelector("h3").textContent, items, skipped, i: 0, got: 0 };
  const o = ensureWizard();
  o.hidden = false;
  guideView();
}

export function guideView() {
  const b = $("#kq-b"),
    x = $("#kq .x");
  if (!viva.G || !b) return;
  x.setAttribute("aria-label", texto("Cerrar", "Close"));
  x.textContent = "✕";
  $("#kq-t").textContent = texto("Kixki te guía", "Kixki guides you");
  const n = viva.G.items.length;
  if (!n || viva.G.i >= n) {
    const why = {
      have: texto("ya la tienes", "you already have it"),
      min: texto("pide un Android más nuevo", "needs a newer Android"),
      priv: texto("necesita Shizuku, root o ADB", "needs Shizuku, root or ADB"),
    };
    const sk = viva.G.skipped.length
      ? `<p class="kq-note">${texto("No te mostré estas porque no son para tu celular o ya las tienes:", "I skipped these because they aren't for your phone or you already have them:")}<br>${viva.G.skipped.map(([a, w]) => esc(a) + " (" + why[w] + ")").join(" · ")}</p>`
      : "";
    b.innerHTML = `<p class="kq-n">${esc(viva.G.title)}</p><h2 class="kq-q" id="kq-q" tabindex="-1">${n ? texto("¡Listo! 🎉", "All done! 🎉") : texto("No hay nada nuevo que instalar", "Nothing new to install")}</h2>
      <p class="kq-note">${n ? texto(`Marcaste ${viva.G.got} de ${n} apps como instaladas.`, `You marked ${viva.G.got} of ${n} apps as installed.`) : texto("Ya tienes todo lo de este pack, o no es para tu celular.", "You already have everything in this pack, or it isn't for your phone.")}</p>${sk}
      <div class="kq-nav">${n ? `<button type="button" class="btn kg-back">← ${texto("Atrás", "Back")}</button>` : "<span></span>"}<button type="button" class="btn p kg-end">${texto("Cerrar", "Close")} ✓</button></div>`;
    const q = $("#kq-q");
    if (q) q.focus({ preventScroll: true });
    talk();
    return;
  }
  const name = viva.G.items[viva.G.i],
    a = origs().find((z) => nm(z) === name);
  const tag = a ? (a.querySelector(".tag") || {}).textContent || "" : "",
    desc = a ? (a.querySelector(".desc") || {}).textContent || "" : "",
    tip = a ? (a.querySelector(".tip > span:last-child") || {}).textContent || "" : "";
  const lk = a ? a.querySelector(".links a") : null;
  b.innerHTML = `<p class="kq-n">${esc(viva.G.title)} · ${texto("paso", "step")} ${viva.G.i + 1} / ${n}</p>
    <h2 class="kq-q" id="kq-q" tabindex="-1">${esc(name)}</h2>
    <p class="kq-note"><b>${esc(tag)}</b> — ${esc(firstSentences(desc, 170))}</p>
    ${tip ? `<p class="kq-note kg-tip">💡 ${esc(firstSentences(tip, 150))}</p>` : ""}
    <div class="kq-opts">${lk ? `<a class="btn p kg-o" href="${esc(lk.href)}" target="_blank" rel="noopener noreferrer"><span class="kq-e" aria-hidden="true">↗</span><span class="kq-tx">${texto("Abrir descarga", "Open download")}<small>${esc(lk.textContent.trim())}</small></span></a>` : ""}
      <button type="button" class="btn kg-o kg-have" data-n="${esc(name)}"><span class="kq-e" aria-hidden="true">✓</span><span class="kq-tx">${texto("Ya la instalé", "I installed it")}<small>${texto("La marco y paso a la siguiente", "I'll mark it and go to the next")}</small></span></button></div>
    <div class="kq-nav">${viva.G.i ? `<button type="button" class="btn kg-back">← ${texto("Atrás", "Back")}</button>` : `<button type="button" class="btn kg-end">${texto("Cerrar", "Close")}</button>`}<button type="button" class="btn kg-next">${texto("Saltar", "Skip")} →</button></div>`;
  const q = $("#kq-q");
  if (q) q.focus({ preventScroll: true });
  talk();
}

puente.decoratePacks = decoratePacks;

puente.packsFor = packsFor;

puente.openGuide = openGuide;

puente.guideView = guideView;

export function iniciar() {
  /* ---------- packs guiados: Kixki te lleva app por app ---------- */

  puente.packEl = packEl;
  puente.viva = viva;
}
