/*
  Frases y burbujas de Kixki durante el partido.
*/

import { $ } from "../../core/util.js";
import { fmt, segunIdioma, pick } from "./config.js";
import { viva } from "./estado.js";

const cap = (w) => w[0].toUpperCase() + w.slice(1);

const lastTxt = {};

const quiet = () => !!(window.KXK && KXK.quiet);

export function phrase(phase, vars) {
  if (quiet() && KXK.emoji) return KXK.emoji("bk" + cap(phase));
  const T = (window.KXD && KXD.TX) || {},
    k = "bk" + cap(phase),
    md = window.KXK3 && KXK3.mood ? KXK3.mood() : 0;
  let list = T[k] || [];
  if (md >= 2 && T[k + "V"] && Math.random() < 0.55) list = T[k + "V"];
  else if (md >= 1 && T[k + "P"] && Math.random() < 0.5) list = T[k + "P"];
  if (!list.length) return null;
  /* nunca la misma frase dos veces seguidas en una fase (la memoria de KXK.pick es de 30 y las listas son cortas) */
  const free = list.filter((x) => x[0] !== lastTxt[phase]),
    pool = free.length ? free : list;
  const m = window.KXK && KXK.pick ? KXK.pick(pool, "bk-" + phase) : pick(pool, "bk-" + phase),
    v = vars || {};
  lastTxt[phase] = m[0];
  return [fmt(m[0], v), fmt(m[1], v)];
}

export function bkSay(phase, vars, ms) {
  const p = phrase(phase, vars);
  if (p) talk(p, ms);
}

function talk(pair, ms) {
  viva.sayTx.textContent = segunIdioma(pair);
  viva.say.hidden = false;
  clearTimeout(viva.sayT);
  viva.sayT = setTimeout(() => {
    viva.say.hidden = true;
  }, ms || 4300);
}

export function pop(txt) {
  const p = $("#bk-pop");
  p.textContent = txt;
  p.classList.remove("on");
  void p.offsetWidth;
  p.classList.add("on");
}

export function iniciar() {
  /* ---- lo que dice Kixki (enfadada): fase → frase de dialogs.js, con ánimo (P pícara / V vengativa) y sin repetir; en «calladita», solo emoji ---- */
}
