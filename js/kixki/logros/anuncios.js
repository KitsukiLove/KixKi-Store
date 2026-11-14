/*
  Anuncia los logros: cola de avisos, frase de Kixki al desbloquear y barrido de logros pendientes.
*/

import { $, idioma as lang, now } from "../../core/util.js";
import { confetti, GEN, panel, queueToast, sparks } from "./avisos.js";
import { fmt, KK, pick, tx } from "./base.js";
import { ctx } from "./contexto.js";
import { count, level, save, ST } from "./estado.js";
import { LOGROS } from "./lista.js";
import { puente } from "./puente.js";
import { NIVELES, TEXTOS_UI } from "./textos.js";

const pendSay = [];

const gameOpen = () => {
  const g = $("#game");
  return !!g && !g.hidden;
};

export const dateOf = (t) => {
  try {
    return new Date(t).toLocaleDateString(lang(), { day: "numeric", month: "short" });
  } catch (e) {
    return "";
  }
};

function speak(msg, vars, o = {}) {
  if (o.game && gameOpen()) {
    pendSay.push([msg, vars]);
    return;
  }
  KK.say(msg, { p: 3, mood: "happy", vars });
}

export function flushSay() {
  if (!pendSay.length || document.hidden || gameOpen()) return;
  const [m, v] = pendSay.pop();
  pendSay.length = 0;
  KK.say(m, { p: 3, mood: "happy", vars: v });
}

export function announce(got, lv0) {
  const loud = got.filter((x) => !x.quiet),
    big = got.some((x) => x.big);
  if (got.length > 3)
    queueToast({
      i: "trophy",
      head: TEXTOS_UI.head,
      n: [fmt(TEXTOS_UI.many[0], { n: got.length }), fmt(TEXTOS_UI.many[1], { n: got.length })],
      d: TEXTOS_UI.manyDesc,
      long: 1,
    });
  else got.forEach((x) => queueToast({ i: x.i, n: x.n, d: x.d, long: x.big }));
  sparks();
  if (big) confetti(got.some((x) => x.id === "pro") ? 60 : 28);
  if (loud.length) {
    let msg, vars;
    if (loud.length > 1) {
      msg = [
        `¡${loud.length} logros de golpe! Eres muy pro, no lo olvides. 🏆`,
        `${loud.length} achievements at once! You're so pro, never forget it. 🏆`,
      ];
    } else {
      const x = loud[0];
      msg = x.k || pick(GEN);
      vars = { n: tx(x.n) };
    }
    speak(msg, vars, { game: loud.every((x) => x.game) });
  }
  const lv1 = level(count());
  if (lv1 > lv0)
    setTimeout(
      () =>
        speak(
          [
            `¡Subiste de nivel! Ahora eres «${NIVELES[lv1][0]}». ⭐`,
            `You leveled up! You're now “${NIVELES[lv1][1]}”. ⭐`,
          ],
          null,
          { game: true }
        ),
      loud.length ? 400 : 0
    );
}

/* mira si hay logros nuevos (silent = ponerse al día sin avisar) */
export function sweep(silent) {
  const c = ctx(),
    got = [],
    lv0 = level(count());
  for (let again = true; again; ) {
    again = false;
    for (const x of LOGROS) {
      if (ST.u[x.id]) continue;
      let ok = false;
      try {
        ok = !!x.f(c);
      } catch (e) {
        // Un logro que falla al evaluarse se considera no cumplido.
      }
      if (ok) {
        ST.u[x.id] = now();
        got.push(x);
        again = true;
      }
    }
  }
  if (got.length) {
    save();
    if (!silent) announce(got, lv0);
    puente.refreshMenu();
    if (!panel.hidden) puente.renderPanel();
  }
  return got;
}

export function iniciar() {
  setInterval(flushSay, 1200);
  /* ---------- ventana «Logros» ---------- */
}
