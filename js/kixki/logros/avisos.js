/*
  Elementos de pantalla de los logros: tarjeta de aviso (toast), panel, confeti y destellos.
*/

import { $, reducirMovimiento as RM, rnd, wait } from "../../core/util.js";
import { KK, tx } from "./base.js";
import { icono } from "./iconos.js";
import { puente } from "./puente.js";
import { TEXTOS_UI } from "./textos.js";
export let panel, petWrap, pTitle, pX, pAv, pLv, pSay, pList, pb, pbNm, pbG, pbV;

let toastEl, srEl, tb, tIc, tH, tN, tD, tBusy;

export const crear = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

export const say = (s) => {
  srEl.textContent = "";
  setTimeout(() => {
    srEl.textContent = s;
  }, 30);
};

const colaAvisos = [];

export const GEN = [
  [
    "¡Logro desbloqueado: «{n}»! Eres muy pro, no lo olvides. 🏆",
    "Achievement unlocked: “{n}”! You're so pro, never forget it. 🏆",
  ],
  [
    "«{n}» conseguido. Eso no lo logra cualquiera. ✨",
    "“{n}” earned. Not just anyone gets that. ✨",
  ],
  ["¡Beee! ¡Otro logro! «{n}» ya es tuyo. 🐑", "Baaa! Another one! “{n}” is yours now. 🐑"],
  ["¡Mira eso! «{n}». ¡Qué nivel! 💪", "Look at that! “{n}”. What a level! 💪"],
  [
    "«{n}»… ¡y sin despeinarte la lana! Eres muy pro. 😎",
    "“{n}”… and without ruffling your wool! You're so pro. 😎",
  ],
];

export function queueToast(o) {
  colaAvisos.push(o);
  if (!tBusy) runToasts();
}

async function runToasts() {
  tBusy = true;
  while (colaAvisos.length) {
    const o = colaAvisos.shift();
    tIc.innerHTML = icono(o.i || "trophy", 4);
    tH.textContent = tx(o.head || TEXTOS_UI.head);
    tN.textContent = tx(o.n);
    tD.textContent = o.d ? tx(o.d) : "";
    toastEl.hidden = false;
    void toastEl.offsetWidth;
    toastEl.classList.add("in");
    say(tx(o.head || TEXTOS_UI.head) + " " + tx(o.n) + (o.d ? ". " + tx(o.d) : ""));
    [660, 880, 1320].forEach((f, i) =>
      setTimeout(() => {
        if (window.KXS)
          try {
            KXS.beep(f, 0.09);
          } catch (e) {
            // El sonido es opcional: si el audio aún no está listo se omite.
          }
      }, i * 120)
    );
    await wait(o.long ? 5200 : 4400);
    toastEl.classList.remove("in");
    await wait(RM() ? 60 : 300);
    toastEl.hidden = true;
  }
  tBusy = false;
}

export function confetti(n = 26) {
  if (RM()) return;
  const cols = ["#ffc23a", "#ff8fc7", "#7ef0c4", "#8b6cf0", "#fffaf0", "#4aa3e8"];
  for (let i = 0; i < n; i++) {
    const e = document.createElement("i");
    e.className = "kq-cf";
    e.style.cssText = `left:${rnd(2, 98)}%;--dx:${rnd(-70, 70)}px;--t:${rnd(1.8, 3)}s;animation-delay:${rnd(0, 0.5)}s;background:${cols[i % cols.length]}`;
    document.body.append(e);
    setTimeout(() => e.remove(), 3800);
  }
}

export function sparks() {
  if (RM() || !KK.el || KK.el.classList.contains("kk-off") || KK.el.classList.contains("kk-gone"))
    return;
  const cols = ["#ffc23a", "#ff8fc7", "#fffaf0", "#7ef0c4"];
  for (let i = 0; i < 10; i++) {
    const e = document.createElement("i");
    e.className = "kq-sp";
    e.style.cssText = `--sx:${Math.round(rnd(-46, 46))}px;--sy:${-Math.round(rnd(20, 78))}px;--c:${cols[i % 4]};left:${Math.round(rnd(-10, 10))}px`;
    KK.el.append(e);
    setTimeout(() => e.remove(), 760);
  }
}

export function iniciar() {
  /* ---------- DOM: tarjeta de aviso, confeti, ventana de logros, charla ---------- */

  toastEl = crear(
    `<div class="kq-toast" id="kq-toast" hidden><button type="button" class="kq-tb"><span class="kq-ti"></span><span class="kq-tt"><b class="kq-th"></b><span class="kq-tn"></span><small class="kq-td"></small></span></button></div>`
  );
  srEl = crear(`<div class="kk-sr" id="kq-sr" role="status" aria-live="polite"></div>`);
  panel = crear(
    `<div id="logros" class="ovl" hidden role="dialog" aria-modal="true" aria-labelledby="kq-h"><div class="box kq-box"><div class="bt"><span id="kq-h"></span><button type="button" class="x" data-x="logros"></button></div><div class="kq-top"><span class="kq-av"></span><div class="kq-lv"></div></div><p class="kq-say"></p><div class="kq-list" tabindex="0"></div></div></div>`
  );
  petWrap = crear(
    `<div id="kq-pet" aria-hidden="true"><div class="kk-bub kq-pb" hidden><span class="kk-nm"></span><button type="button" class="kk-x" tabindex="-1">✕</button><p class="kk-tx"><span class="g"></span><span class="v"></span></p><svg class="kk-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div></div>`
  );
  document.body.append(toastEl, srEl, panel, petWrap);
  tb = $(".kq-tb", toastEl);
  tIc = $(".kq-ti", toastEl);
  tH = $(".kq-th", toastEl);
  tN = $(".kq-tn", toastEl);
  tD = $(".kq-td", toastEl);
  pTitle = $("#kq-h", panel);
  pX = $(".x", panel);
  pAv = $(".kq-av", panel);
  pLv = $(".kq-lv", panel);
  pSay = $(".kq-say", panel);
  pList = $(".kq-list", panel);
  pb = $(".kq-pb", petWrap);
  pbNm = $(".kk-nm", pb);
  pbG = $(".g", pb);
  pbV = $(".v", pb);

  /* ---------- aviso de logro: tarjeta arriba, sonido, confeti ---------- */

  tBusy = false;
  tb.addEventListener("click", () => {
    toastEl.classList.remove("in");
    toastEl.hidden = true;
    puente.openPanel();
  });
  /* ---------- Kixki celebra ---------- */
}
