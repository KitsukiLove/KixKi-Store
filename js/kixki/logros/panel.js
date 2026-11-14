/*
  Panel «Logros» y su entrada en el menú Kixki / Más.
*/

import { $, now } from "../../core/util.js";
import { dateOf, sweep } from "./anuncios.js";
import { panel, pAv, pList, pLv, pSay, pTitle, pX, queueToast } from "./avisos.js";
import { isPC, KK, KX, S, tx, viva } from "./base.js";
import { C, count, inc, level, mx, NV, save, ST } from "./estado.js";
import { icono, sprite } from "./iconos.js";
import { LOGROS } from "./lista.js";
import { puente } from "./puente.js";
import { CAT, NIVELES, TEXTOS_UI } from "./textos.js";
let sm, btnA, btnP;

export function nextHint() {
  return LOGROS.find(
    (x) => !ST.u[x.id] && !x.secret && !x.hid && x.id !== "pro" && x.id !== "half"
  );
}

function kixkiLine(u) {
  const N = NV();
  if (u >= N)
    return [
      "¡TODOS! Eres muy pro, no lo olvides jamás. 👑",
      "ALL of them! You're so pro, never forget it. 👑",
    ];
  if (u === 0)
    return [
      "Aún no tienes logros. ¡Abre una carpeta y empezamos! 🐑",
      "No achievements yet. Open a folder and let's get started! 🐑",
    ];
  const n = nextHint();
  if (!n)
    return [
      `Llevas ${u} de ${N}. ¡Solo quedan los secretos! 🤫`,
      `You have ${u} of ${N}. Only the secret ones are left! 🤫`,
    ];
  return [
    `Llevas ${u} de ${N}. Siguiente reto: «${n.n[0]}»: ${n.d[0]}`,
    `You have ${u} of ${N}. Next challenge: “${n.n[1]}”: ${n.d[1]}`,
  ];
}

export function renderPanel() {
  const u = count(),
    N = NV(),
    lv = level(u),
    prev = +ST._prevSeen || 0;
  pTitle.textContent = tx(TEXTOS_UI.title);
  pX.setAttribute("aria-label", tx(TEXTOS_UI.close));
  pX.textContent = "✕";
  pAv.innerHTML = sprite(KK.rows.happy, 3);
  const cells = 20,
    on = Math.round((u / N) * cells);
  pLv.innerHTML = `<span class="kq-lt">${tx(TEXTOS_UI.lvl)}</span> <b>${tx(NIVELES[lv])}</b><span class="kq-num">${u} / ${N} · ${Math.round((u / N) * 100)}%</span><span class="kq-bar" role="img" aria-label="${u}/${N}">${Array.from({ length: cells }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("")}</span>`;
  pSay.textContent = tx(kixkiLine(u));
  pList.innerHTML = Object.keys(CAT)
    .map((k) => {
      const list = LOGROS.filter((x) => x.c === k && (!x.hid || ST.u[x.id])),
        got = list.filter((x) => ST.u[x.id]).length;
      if (!list.length) return "";
      return `<section class="kq-g"><h3>${tx(CAT[k])}<small>${got}/${list.length}</small></h3><ul>${list
        .map((x) => {
          const un = !!ST.u[x.id],
            hide = x.secret && !un,
            fresh = un && ST.u[x.id] > prev;
          return `<li class="kq-it ${un ? "on" : "off"}${fresh ? " nw" : ""}"><span class="kq-ic">${icono(hide ? "q" : x.i, 4)}</span><span class="kq-in"><b>${hide ? "???" : tx(x.n)}</b><small>${hide ? tx(x.h || TEXTOS_UI.secret) : tx(x.d)}</small></span><span class="kq-st">${un ? (fresh ? `<em class="kq-new">${tx(TEXTOS_UI.nw)}</em>` : "") + "✓ " + dateOf(ST.u[x.id]) : ""}${!un && x.pc ? `<em class="kq-pc">${tx(TEXTOS_UI.pc)}</em>` : ""}${hide && !x.pc ? `<em class="kq-sc">${tx(TEXTOS_UI.secret)}</em>` : ""}${un && x.hid ? `<em class="kq-sc">${tx(TEXTOS_UI.hid)}</em>` : ""}</span></li>`;
        })
        .join("")}</ul></section>`;
    })
    .join("");
}

export function openPanel() {
  viva.lastFocus = document.activeElement;
  ST._prevSeen = ST.seenAt;
  ST.seenAt = now();
  save();
  refreshMenu();
  renderPanel();
  panel.hidden = false;
  pList.scrollTop = 0;
  try {
    pX.focus({ preventScroll: true });
  } catch (e) {
    // focus() falla si el elemento ya no está en el documento; no pasa nada.
  }
}

export function refreshMenu() {
  if (!btnA) return;
  const fresh = LOGROS.some((x) => ST.u[x.id] > ST.seenAt);
  btnA.innerHTML = `${icono("trophy", 2)}<span>${tx(TEXTOS_UI.menu)} ${count()}/${NV()}</span>${fresh ? '<i class="kq-dot" aria-hidden="true"></i>' : ""}`;
  btnP.textContent = tx(TEXTOS_UI.petMenu);
}

puente.openPanel = openPanel;

puente.refreshMenu = refreshMenu;

puente.renderPanel = renderPanel;

export function iniciar() {
  new MutationObserver(() => {
    if (panel.hidden && viva.lastFocus) {
      try {
        viva.lastFocus.focus({ preventScroll: true });
      } catch (e) {
        // focus() falla si el elemento ya no está en el documento; no pasa nada.
      }
      viva.lastFocus = null;
    }
  }).observe(panel, { attributes: true, attributeFilter: ["hidden"] });
  /* Tab se queda dentro de la ventana */
  panel.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = [pX, pList];
    const i = f.indexOf(document.activeElement);
    e.preventDefault();
    f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  });
  /* ---------- menú Kixki / Más ---------- */
  sm = KX.sm || $("#sm");
  btnA = null;
  btnP = null;
  if (sm) {
    const html = `<button type="button" class="sm" id="s-kx-ach"></button><button type="button" class="sm" id="s-kx-pet"></button>`;
    const ref = $("#s-kx-on", sm) || $("#s-sug", sm);
    ref ? ref.insertAdjacentHTML("beforebegin", html) : sm.insertAdjacentHTML("beforeend", html);
    btnA = $("#s-kx-ach", sm);
    btnP = $("#s-kx-pet", sm);
    sm.addEventListener("click", (e) => {
      const b = e.target.closest("#s-kx-ach,#s-kx-pet");
      if (!b) return;
      if (b.id === "s-kx-ach") {
        openPanel();
        return;
      }
      if (!isPC()) {
        queueToast({ i: "sheep", head: ["Kixki", "Kixki"], n: TEXTOS_UI.pcOnly });
        return;
      }
      if (!S.on) {
        queueToast({ i: "sheep", head: ["Kixki", "Kixki"], n: TEXTOS_UI.offNote });
        return;
      }
      puente.petChat("user");
    });
  }
  refreshMenu();
  /* ---------- lo que hace el visitante → contadores ---------- */
  addEventListener("kixki-evt", (e) => {
    const d = e.detail || {};
    switch (d.t) {
      case "search":
        inc("searches");
        if (d.n === 0) C.nores = 1;
        break;
      case "fav":
        mx("favMax", d.n | 0);
        break;
      case "theme":
        inc("theme");
        break;
      case "cowboss": {
        if (d.r === "win") C.cowWin = 1;
        else if (d.r === "lose") C.cowLose = 1;
        break;
      }
      case "bg": {
        const k = d.k || "clasico";
        if (k === "vacas") break;
        C.bgs = C.bgs || [];
        if (!C.bgs.includes(k)) C.bgs.push(k);
        break;
      }
      case "music":
        if (d.on) C.music = 1;
        break;
      case "lang":
        C.lang = 1;
        refreshMenu();
        if (!panel.hidden) renderPanel();
        break;
      case "tap":
        inc("tapsK");
        if ((d.n | 0) >= 7) C.tapFast = 1;
        break;
      case "throw":
        mx("throws", d.n | 0);
        break;
      case "hoop":
        inc("hoops");
        break;
      case "advice": {
        C.adv = C.adv || [];
        if (d.id && !C.adv.includes(d.id)) C.adv.push(d.id);
        break;
      }
      case "visit": {
        const h = new Date().getHours();
        if (!d.again && (h >= 23 || h < 5)) C.night = 1;
        break;
      }
      default:
        break;
    }
    save();
    sweep();
  });
}
