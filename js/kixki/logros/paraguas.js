/*
  Paraguas: cuando llueve, Kixki baja y le presta un paraguas a la ovejita (solo PC).
*/

import { now, reducirMovimiento as RM, rnd, wait } from "../../core/util.js";
import { isPC, K, KK, S, viva } from "./base.js";
import { petSay, pint } from "./charla.js";
import { petEl, petPi, PETS } from "./consejos.js";
import { sprite } from "./iconos.js";
import { petBox, petSide } from "./ovejita.js";
import { puente } from "./puente.js";

export const UMB = { on: false, busy: false, el: null, next: 0 };

export const wet = () => !!(window.KXRAIN && KXRAIN.raining);

const UMBR = [
  ".......bbbbbbb.......",
  "....bawwwaaawwwab....",
  "..baaawwwaaawwwaaab..",
  ".baaaawwwaaawwwaaaab.",
  "bwaaaawwwaaawwwaaaawb",
  "bwaaaawwwaaawwwaaaawb",
  "bwaaaawwwaaawwwaaaawb",
  "bwaaaawwwaaawwwaaaawb",
  "b....b....b....b....b",
  "..........l..........",
  "..........l..........",
  "..........l..........",
  "..........l..........",
  "..........l..........",
  "..........l..........",
];

const UMBL = {
  day: [
    [
      "¡Ovejita, está lloviendo! Espera, te bajo un paraguas. ☂️",
      "Little sheep, it's raining! Hold on, I'm lowering an umbrella for you. ☂️",
    ],
    [
      "¡Beee! ¡Gracias, Kixki! Ahora mi lana sigue esponjosa. ☂️",
      "Baaa! Thanks, Kixki! Now my wool stays fluffy. ☂️",
    ],
    [
      "Para eso estamos las amigas. ¡Y ojo con los charcos! 💦",
      "That's what friends are for. And watch out for puddles! 💦",
    ],
  ],
  night: [
    [
      "Shhh… llueve y tú dormida sin paraguas. Te bajo uno. ☂️",
      "Shhh… it's raining and you're asleep without an umbrella. Lowering one for you. ☂️",
    ],
    ["Zzz… qué calentita… gracias, Kixki… zzz…", "Zzz… so cozy… thanks, Kixki… zzz…"],
    ["Dulces sueños bajo la lluvia. 🌧️💤", "Sweet dreams in the rain. 🌧️💤"],
  ],
};

function umbShow() {
  const p = petEl();
  if (!p || UMB.el) return;
  const e = document.createElement("div");
  e.className = "kq-umb";
  e.innerHTML = sprite(UMBR, 3);
  p.append(e);
  p.classList.add("kq-rainy");
  UMB.el = e;
  UMB.on = true;
}

export function umbHide(quick) {
  const e = UMB.el,
    p = petEl();
  UMB.on = false;
  UMB.el = null;
  if (p) p.classList.remove("kq-rainy");
  if (!e) return;
  if (quick || RM()) {
    e.remove();
    return;
  }
  e.classList.add("out");
  setTimeout(() => e.remove(), 600);
}

async function umbLend() {
  if (
    UMB.busy ||
    UMB.on ||
    viva.chatting ||
    viva.fireOn ||
    !isPC() ||
    !wet() ||
    !KK.ready ||
    !KK.alive() ||
    K.game ||
    !petBox()
  )
    return null; /* null = aún no es buen momento: reintenta pronto */
  UMB.busy = true;
  viva.chatting = true;
  viva.nextVisit = now() + rnd(100000, 190000);
  const tok = {};
  K.tour =
    tok; /* igual que en la charla: mientras ocurre, el cerebro de Kixki no la manda a otro sitio */
  const dog = setInterval(() => {
    if (K.tour !== tok || K.off || !S.on) pint();
  }, 250);
  const p = petEl(),
    pi = petPi(),
    night = KK.dark(),
    L = night ? UMBL.night : UMBL.day;
  try {
    PETS.hold = true;
    KK.interrupt();
    if (p) p.classList.add("kq-chat");
    const ok = await KK.hop("pet");
    if (!ok || K.tour !== tok) return false;
    viva.petFacing = night ? 1 : -petSide;
    if (pi && !night) pi.style.transform = viva.petFacing < 0 ? "scaleX(-1)" : "";
    await wait(RM() ? 0 : 300);
    if (!(await KK.say(L[0], { p: 2 })) || K.tour !== tok) return false;
    if (!wet()) return false; /* escampó mientras hablaba: no hace falta */
    umbShow(); /* el paraguas baja hasta la ovejita */
    await wait(RM() ? 0 : 800);
    if (K.tour !== tok || K.off || !S.on) return false;
    if (!(await petSay(L[1])) || K.tour !== tok) return false;
    await wait(RM() ? 0 : 240);
    await KK.say(L[2], { p: 2 });
    return true;
  } finally {
    clearInterval(dog);
    pint();
    PETS.hold = false;
    if (p) p.classList.remove("kq-chat", "kq-talk");
    if (pi) pi.style.transform = "";
    viva.chatting = false;
    UMB.busy = false;
    if (K.tour === tok) K.tour = null;
    if (KK.stage === "pet" && !K.off && S.on)
      setTimeout(() => {
        if (!viva.chatting && KK.stage === "pet") KK.relocate();
      }, 400);
  }
}

export function iniciar() {
  /* =========================================================
     PARAGUAS DE KIXKI: en cuanto llueve (y si estamos en modo PC), Kixki baja a ver a la ovejita de abajo y le baja un paraguas.
     El paraguas es hijo de #pet: la acompaña al pasear, y se recoge solo cuando la lluvia para.
     ========================================================= */

  setInterval(() => {
    if (document.hidden || UMB.busy) return;
    if (UMB.on && !wet()) {
      umbHide();
      return;
    } /* dejó de llover: recoge el paraguas */
    if (!UMB.on && wet() && isPC() && now() >= UMB.next)
      umbLend().then((ok) => {
        if (ok === false) UMB.next = now() + 25000;
      }); /* false = se interrumpió: espera un poco antes de insistir */
  }, 1500);
  puente.UMB = UMB;
}
