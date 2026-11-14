/*
  Charla pícara: chismes, teorías, confesiones y el plan de toma de control.
*/

import { wait } from "../../core/util.js";
import { H, K, elegir, say } from "./base.js";
import { planParts, TEXTOS } from "./textos.js";
export let SC;

export const pickType = () => {
  const r = Math.random();
  return r < 0.26 ? "conspi" : r < 0.5 ? "code" : r < 0.72 ? "gossip" : r < 0.88 ? "plan" : "sass";
};

/* =======================================================  CHARLA PÍCARA  */
export async function scene(parts) {
  for (let i = 0; i < parts.length; i++) {
    if (K.off || H.held || H.fall) return false;
    const ok = await say(parts[i], { p: 1 });
    if (!ok) return false;
    if (i < parts.length - 1) await wait(380);
  }
  return true;
}

export function iniciar() {
  SC = {
    gossip: () =>
      elegir(
        TEXTOS.gossip.map((s) => ({ t: s[0], parts: s })),
        "k3gs"
      ).parts,
    conspi: () =>
      elegir(
        TEXTOS.conspi.map((s) => ({ t: s[0], parts: s })),
        "k3cs2"
      ).parts,
    code: () =>
      elegir(
        TEXTOS.code.map((s) => ({ t: s[0], parts: s })),
        "k3cd"
      ).parts,
    sass: () =>
      elegir(
        TEXTOS.sass.map((s) => ({ t: s[0], parts: s })),
        "k3ss"
      ).parts,
    plan: planParts,
  };
}
