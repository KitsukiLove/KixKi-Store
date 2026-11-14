/*
  Travesuras al azar: cambiar el fondo o «cerrar» una ventana.
*/

import { $, $$, now, rnd, wait } from "../../core/util.js";
import { H, K, KK, elegir, S, say } from "./base.js";
import { bumpPlan } from "./caida.js";
import { memoria, save } from "./memoria.js";
import { R } from "./plataformas.js";
import { TEXTOS } from "./textos.js";
import { lastTouch, wd } from "./ventanas.js";

export const P = { busy: false };

export const canAct = () =>
  S.on &&
  K.ready &&
  !K.off &&
  !K.still &&
  !K.game &&
  !K.talking &&
  !K.tour &&
  K.mode !== "hop" &&
  K.mode !== "sleep" &&
  !H.held &&
  !H.fall &&
  !P.busy &&
  !document.hidden &&
  !wd;

export const bgLabel = () => (window.KXB ? KXB.label() : "");

const updBgBtn = () => {
  const b = $("#s-bg");
  if (b && window.KXB) b.textContent = "Fondo: " + KXB.label();
};

const openWins = () =>
  KK.isPC()
    ? $$("#app .cat:not(.min):not(.max)").filter(
        (s) => R(".panel", s) && now() - (lastTouch[s.id] || 0) > 15000
      )
    : [];

const closeWin = (s) => {
  const b = $(".wmin", s);
  if (b) b.click();
};

export async function bgPrank() {
  if (
    !window.KXB ||
    KXB.season() === "auto" ||
    (KXB.cursed && KXB.cursed()) ||
    (window.KXV && KXV.busy && KXV.busy())
  )
    return false;
  P.busy = true;
  try {
    let early = null;
    const sp = say(elegir(TEXTOS.bgPre, "k3bgp"), { p: 2 });
    sp.then((v) => {
      early = v;
    });
    await wait(1700);
    if (early === false) {
      return false;
    }
    const n = 1 + Math.floor(rnd(0, 3));
    for (let i = 0; i < n; i++) KXB.nextSeason();
    updBgBtn();
    memoria.bgs++;
    bumpPlan(2);
    save();
    KK.emit("prank", { k: "bg", n: memoria.bgs });
    await sp;
    await wait(250);
    await say(elegir(TEXTOS.bgPost, "k3bgq"), { p: 2, mood: "happy" });
    return true;
  } finally {
    P.busy = false;
  }
}

export async function closePrank() {
  const wins = openWins();
  if (!wins.length) return false;
  P.busy = true;
  try {
    const s = wins[Math.floor(Math.random() * wins.length)],
      id = "w:" + s.id;
    const hopOn = K.stage !== id && Math.random() < 0.5 && KK.usable(id);
    if (hopOn) {
      await KK.hop(id);
      if (K.stage !== id) return false;
    }
    const on = K.stage === id;
    if (on) {
      say(elegir(TEXTOS.closePreOwn, "k3cpo"), { p: 2 });
      await wait(2600);
    } else if (Math.random() < 0.5) {
      say(elegir(TEXTOS.closePre, "k3cp"), { p: 2 });
      await wait(1500);
    }
    if (K.off || H.held || H.fall || s.classList.contains("min")) return false;
    H.selfClose = on;
    K.noMic = now() + 2500;
    closeWin(s);
    memoria.closed++;
    bumpPlan(2);
    save();
    KK.emit("prank", { k: "close", n: memoria.closed });
    if (!on) {
      await wait(700);
      await say(elegir(TEXTOS.closePost, "k3cpq"), { p: 2 });
    } else await wait(1500);
    return true;
  } finally {
    H.selfClose = false;
    P.busy = false;
  }
}

export function iniciar() {
  /* =======================================================  TRAVESURAS  */
}
