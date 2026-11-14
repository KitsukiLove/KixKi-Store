/*
  La vaca del mundo de vacas: Kixki la conoce, charla y se hacen amigas.
*/

import { $, clamp, reducirMovimiento as RM, rnd, wait } from "../../core/util.js";
import { sweep } from "./anuncios.js";
import { say } from "./avisos.js";
import { K, KK, S, tx, viva } from "./base.js";
import { C, save, ST } from "./estado.js";
import { cowEl } from "./fuego.js";
import { icono } from "./iconos.js";
export let first, caught;

let cowBusy, pats;

const COW = [
  [
    "k",
    "¿¿Una VACA?? ¡Eh! Aquí las estrellas de la pantalla somos las ovejas. 🐑",
    "A COW?? Hey! Around here the screen stars are the sheep. 🐑",
  ],
  ["c", "¡Muuu! 🐄", "Moooo! 🐄"],
  [
    "k",
    "Vaya… ¿tú eres la famosa vaca.exe? Nadie me avisó de que venías.",
    "Wow… are you the famous cow.exe? Nobody told me you were coming.",
  ],
  [
    "c",
    "Muuu. (Llevo horas bailando y nadie me aplaude.)",
    "Moo. (I've been dancing for hours and nobody applauds.)",
  ],
  [
    "k",
    "¡Pues yo sí! ¡Bravo! 👏 Acaríciala y verás cómo se alegra.",
    "Well I do! Bravo! 👏 Pet her and watch her cheer up.",
  ],
  ["c", "¡Mu-mu-música! 🎶", "Mu-mu-music! 🎶"],
];

const PATS = [
  ["¡Muuu! 💕", "Moooo! 💕"],
  ["¡Muu-muuu! 🎶", "Moo-mooo! 🎶"],
  ["¡MUUUUU! ✨", "MOOOOO! ✨"],
];

const cowBeep = () => {
  if (window.KXS)
    try {
      KXS.beep(130, 0.22);
      setTimeout(() => KXS.beep(104, 0.28), 170);
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
};

function cowHeart(v) {
  if (RM()) return;
  const r = v.getBoundingClientRect(),
    i = document.createElement("i");
  i.className = "kq-ht";
  i.style.cssText = `left:${Math.round(r.width / 2 + rnd(-60, 60))}px;top:${Math.round(r.height * 0.5)}px`;
  i.innerHTML = icono("heart", 3);
  v.append(i);
  setTimeout(() => i.remove(), 1300);
}

function cowSay(v, msg) {
  return new Promise((res) => {
    const b = $(".kq-cb", v);
    if (!b) {
      res(false);
      return;
    }
    const text = tx(msg);
    b.textContent = text;
    b.classList.add("in");
    say("🐄: " + text);
    cowBeep();
    const ms = RM() ? 900 : clamp(1900 + text.length * 45, 2300, 5200);
    const iv = setInterval(() => {
      if (!v.isConnected) {
        clearTimeout(t);
        clearInterval(iv);
        res(false);
      }
    }, 200);
    const t = setTimeout(() => {
      clearInterval(iv);
      b.classList.remove("in");
      res(true);
    }, ms);
  });
}

function befriend() {
  if (C.cow) return;
  C.cow = 1;
  save();
  sweep();
}

async function cowChat(v) {
  if (cowBusy) return;
  cowBusy = true;
  const tok = {};
  let i = 0,
    fails = 0;
  try {
    while ((viva.chatting || viva.fireOn) && v.isConnected) await wait(600);
    await wait(RM() ? 0 : 700);
    while (i < COW.length && v.isConnected && fails < 4) {
      if (!(KK.ready && S.on && !K.off)) return;
      /* (re)sube a la ventana de la vaca; si algo la interrumpe, espera un poco y sigue donde iba */
      if (K.tour !== tok || KK.stage !== "cow") {
        K.tour = tok;
        KK.interrupt();
        const ok = await KK.hop("cow");
        if (!ok || K.tour !== tok) {
          fails++;
          await wait(1800);
          continue;
        }
        await wait(RM() ? 0 : 300);
      }
      if (KK.el) KK.el.classList.add("kq-cowtop"); /* por encima de las ventanas de broma */
      const [who, es, en] = COW[i];
      const r = who === "k" ? await KK.say([es, en], { p: 2 }) : await cowSay(v, [es, en]);
      if (!r || K.tour !== tok) {
        if (!v.isConnected) return;
        fails++;
        await wait(1800);
        continue;
      }
      i++;
      await wait(RM() ? 0 : 240);
    }
    if (i >= COW.length && v.isConnected) befriend();
  } finally {
    cowBusy = false;
    if (K.tour === tok) K.tour = null;
    setTimeout(() => {
      if (!cowBusy && KK.el) KK.el.classList.remove("kq-cowtop");
    }, 2500);
  }
}

function cowGone() {
  if (window.KXV && KXV.busy && KXV.busy())
    return; /* (parte 6) si la vaca se rebela, la ventana se rompe: no hay despedida */
  const was = C.cow;
  pats = 0;
  if (!(KK.ready && S.on && !K.off)) return;
  setTimeout(() => {
    if (KK.stage === "cow" && !cowEl()) KK.relocate();
  }, 350);
  setTimeout(() => {
    try {
      KK.say(
        was
          ? [
              "¡Adiós, vaca.exe! Fue un placer bailar contigo. 👋",
              "Bye, cow.exe! It was a pleasure dancing with you. 👋",
            ]
          : ["¡Ey, se fue la vaca! Bueno… ¡adiós! 👋", "Hey, the cow left! Oh well… bye! 👋"],
        { p: 2, key: "cow-bye", cd: 20000 }
      );
    } catch (e) {
      // La frase de Kixki es opcional: si no está lista, no se dice.
    }
  }, 700);
}

export function iniciar() {
  cowBusy = false;
  pats = 0;

  new MutationObserver((ms) => {
    for (const m of ms) {
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1 || !n.matches || !n.matches(".vp.cow") || n.querySelector(".kq-cb"))
          return;
        const img = n.querySelector("img");
        if (img) img.insertAdjacentHTML("afterend", '<div class="kq-cb" aria-live="off"></div>');
        pats = 0;
        cowChat(n);
      });
      m.removedNodes.forEach((n) => {
        if (n.nodeType === 1 && n.matches && n.matches(".vp.cow")) cowGone();
      });
    }
  }).observe(document.body, { childList: true });
  document.addEventListener("click", (e) => {
    const im = e.target && e.target.closest && e.target.closest(".vp.cow img");
    if (!im) return;
    const v = im.closest(".vp.cow");
    cowHeart(v);
    cowBeep();
    const b = $(".kq-cb", v);
    if (b && !b.classList.contains("in")) {
      b.textContent = tx(PATS[Math.min(pats, PATS.length - 1)]);
      b.classList.add("in");
      clearTimeout(b._t);
      b._t = setTimeout(() => b.classList.remove("in"), 1700);
    }
    pats++;
    if (pats >= 3) befriend();
  });
  window.addEventListener("pointerup", () => {
    if (cowEl()) dispatchEvent(new Event("resize"));
  });
  /* Kixki sigue a la ventana si la arrastras */

  /* ---------- listo: ponerse al día sin avisar y enseñar qué había ---------- */
  first = !ST.init;
  ST.init = 1;
  caught = sweep(true);
  save();
}
