/*
  Atajos de la parte 3: Kixki (KK), decir/elegir frases con su tono pícaro (mood) y frases de lanzamiento.
*/

import { $, now, rnd } from "../../core/util.js";
import { memoria } from "./memoria.js";
import { TEXTOS } from "./textos.js";
export let viva, KK, K, S, EX, el, body;

export const say = (m, o) => KK.say(m, o);

export const elegir = (list, key) => KK.pick(list, key);

export const formatearPar = (pair, v) => [KK.fmt(pair[0], v), KK.fmt(pair[1], v)];

export const mood = () => {
  const t = (memoria.throws | 0) + (memoria.drops | 0),
    p = memoria.plan | 0;
  return p >= 12 || t >= 25 ? 2 : p >= 4 || t >= 8 ? 1 : 0;
};

export const mpk = (name, key) => {
  const m = mood();
  let list = TEXTOS[name];
  if (m >= 2 && TEXTOS[name + "V"] && Math.random() < 0.55) list = TEXTOS[name + "V"];
  else if (m >= 1 && TEXTOS[name + "P"] && Math.random() < 0.5) list = TEXTOS[name + "P"];
  return elegir(list, key);
};

export const thrownLine = () => {
  const m = mood(),
    g = m >= 1 && Math.random() < 0.3 && KK.D && KK.D.gen ? KK.D.gen("grudge") : null;
  return formatearPar(g || mpk("thrown", "k3th2"), { n: memoria.throws | 0 });
};

export const H = {
  held: false,
  drag: null,
  fall: null,
  tilt: 0,
  samples: [],
  ox: 0,
  oy: 0,
  just: 0,
  madUntil: 0,
  madT: 0,
  holdT: 0,
  holdN: 0,
  holdAt: 0,
  shakeN: 0,
  shakeT: 0,
  lastDx: 0,
  selfClose: false,
  skip: null,
  skipUntil: 0,
  recent: [],
};

/** Prepara los atajos. Devuelve false si Kixki no tiene cuerpo en la página (no hay nada más que hacer). */
export function iniciar() {
  viva = { thrBg: rnd(6, 10) * 60000, thrCl: rnd(5, 9) * 60000, sess: 0, gapUntil: now() + 90000 };
  KK = KXK;
  K = KK.K;
  S = KK.state;
  EX = KK.ex;
  el = KK.el;
  body = $(".kk-body", el);
  if (!body) return false;

  /* (parte 3) ánimo: cuanto más la lanzas y más avanza el Plan, más pícara (1) y más vengativa (2) se pone */

  /* --- Kixki habla más pícara: sus frases se mezclan con las de siempre --- */
  try {
    const T = KK.T;
    if (T) {
      T.facts.push(
        ...[...TEXTOS.gossip, ...TEXTOS.conspi].filter((s) => s.length === 1).map((s) => s[0])
      );
    }
  } catch (e) {
    // La lista de frases extra es opcional: si falta, se usan las de siempre.
  }
  /* =======================================================  FÍSICAS  */
  return true;
}
