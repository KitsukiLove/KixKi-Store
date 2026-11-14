/*
  Consejos y elogios extra que Kixki añade a su repertorio y pistas del logro más cercano.
*/

import { $, now, rnd } from "../../core/util.js";
import { K, KK, viva } from "./base.js";
import { T } from "./eventos.js";
import { nextHint } from "./panel.js";
export let PETS;

let hintAt;

export const petEl = () => $("#pet");

export const petPi = () => $("#pet .pi");

export function iniciar() {
  T.praise.push(
    [
      "Cada logro cuenta. ¡Y tú vas sumando! No lo olvides: eres muy pro. 🏆",
      "Every achievement counts. And you keep adding them! Don't forget: you're so pro. 🏆",
    ],
    [
      "Hasta los logros secretos te tienen miedo. 🤫",
      "Even the secret achievements are scared of you. 🤫",
    ]
  );
  /* ---------- pistas ocasionales ---------- */
  hintAt = now() + rnd(100000, 160000);
  setInterval(() => {
    if (now() < hintAt || !KK.alive() || K.game || viva.chatting || viva.fireOn) return;
    const n = nextHint();
    hintAt = now() + rnd(150000, 260000);
    if (!n) return;
    KK.say(
      [`Psst… te falta «${n.n[0]}»: ${n.d[0]}`, `Psst… you're missing “${n.n[1]}”: ${n.d[1]}`],
      { p: 1, key: "hint", cd: 90000 }
    );
  }, 6000);
  /* =========================================================
     CHARLA CON LA OVEJITA DE ABAJO (solo PC)
     ========================================================= */
  PETS = window.KXPET = window.KXPET || { hold: false };
}
