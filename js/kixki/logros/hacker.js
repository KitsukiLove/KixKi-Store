/*
  Easter egg «Modo Hacker»: al abrir las herramientas del navegador, Kixki se pone lentes y sudadera.
*/

import { $, now } from "../../core/util.js";
import { announce, sweep } from "./anuncios.js";
import { confetti, panel, sparks } from "./avisos.js";
import { K, KK, S } from "./base.js";
import { petChat } from "./charla.js";
import { C, count, level, save, ST } from "./estado.js";
import { petFire } from "./fuego.js";
import { sprite } from "./iconos.js";
import { LOGROS } from "./lista.js";
import { openPanel, refreshMenu, renderPanel } from "./panel.js";
import { UMB, umbHide, wet } from "./paraguas.js";

const HACKER = {
  on: false,
  key: false,
  miss: 0,
  pend: false,
  boot: true,
  talked: false,
  since: 0,
  orig: null,
  hack: null,
};

const HKL = {
  first: [
    [
      "¡Hola, mente curiosa! 🕶️ Veo que abriste la consola. Saludos desde el detrás de escena… pero por favor, no rompas nada del código. 🙏",
      "Hello, curious mind! 🕶️ I see you opened the console. Greetings from behind the scenes… but please, don't break anything in the code. 🙏",
    ],
    [
      "Modo hacker activado. 😎 Qué ojo técnico tienes. Mira todo lo que quieras, pero no toques nada, ¿sí? Está armado con lana y cariño.",
      "Hacker mode on. 😎 What a technical eye you have. Look all you want, but don't touch anything, okay? It's held together with wool and love.",
    ],
    [
      "¡Te pillé inspeccionando! 🔍 Me encanta tu curiosidad técnica. Solo te pido una cosa: no rompas nada del código.",
      "Caught you inspecting! 🔍 I love your technical curiosity. I only ask one thing: don't break anything in the code.",
    ],
  ],
  again: [
    [
      "¡Otra vez por aquí, hacker! 🕶️ Recuerda: mirar sí, romper no.",
      "Back again, hacker! 🕶️ Remember: looking is fine, breaking is not.",
    ],
    [
      "Capucha puesta de nuevo. 😎 Todo en orden en el código… ¡y que siga así!",
      "Hood back on. 😎 Everything's fine in the code… let's keep it that way!",
    ],
    [
      "La consola otra vez… ¡me encanta tu curiosidad! No toques el código, ¿vale? 🙏",
      "The console again… I love your curiosity! Don't touch the code, okay? 🙏",
    ],
  ],
  bye: [
    [
      "Uf, me quito la capucha. 🐑 Gracias por no romper nada.",
      "Phew, hood off. 🐑 Thanks for not breaking anything.",
    ],
    [
      "Consola cerrada. ¡Volvió la lana! Si encontraste un bug… shhh, será nuestro secreto. 🤫",
      "Console closed. The wool is back! If you found a bug… shhh, it'll be our secret. 🤫",
    ],
  ],
};

const hkSeen = () => {
  try {
    return +sessionStorage.getItem("kixki-hk") || 0;
  } catch (e) {
    return 0;
  }
};

const hkMark = () => {
  try {
    sessionStorage.setItem("kixki-hk", String(Date.now()));
  } catch (e) {
    // Almacenamiento bloqueado o lleno (modo privado): se sigue sin guardar.
  }
};

const hkCan = () => S.on && KK.ready && !K.off;

const hkSize = () => false;

/* sprite hacker: se calcula a partir de los fotogramas normales de Kixki (lana → sudadera, lentes con brillo verde) */
function hackify(rows, name) {
  const r = rows.map((s) => s.split(""));
  const put = (y, x, c) => {
    if (r[y] && x >= 0 && x < r[y].length) r[y][x] = c;
  };
  r.forEach((row, y) => {
    if (y > 12) return;
    row.forEach((c, x) => {
      if (c === "w" || c === "a") row[x] = "h";
      else if (c === "s" || c === "b") row[x] = "i";
      else if (c === "y") row[x] = y < 2 ? "." : "h";
    });
  });
  for (let x = 13; x <= 18; x++) put(5, x, "j"); /* borde de la capucha sobre la cara */
  for (let y = 6; y <= 8; y++) put(y, 14, "j"); /* …y a un lado */
  put(9, 14, "j");
  put(10, 14, "j"); /* cordones */
  for (let x = 4; x <= 8; x++) put(10, x, "j"); /* bolsillo canguro */
  put(6, 5, "n");
  put(7, 6, "n");
  put(8, 5, "n");
  put(8, 7, "n");
  put(8, 8, "n"); /* «>_» en la espalda */
  const eyes =
    name === "blink" || name === "sleep"
      ? ["vvvv", "vvvv"]
      : name === "happy"
        ? ["vtnv", "nnnn"]
        : ["vtvv", "vnnv"];
  put(6, 14, "v");
  [...eyes[0]].forEach((c, i) => put(6, 15 + i, c));
  [...eyes[1]].forEach((c, i) => put(7, 15 + i, c));
  return r.map((a) => a.join(""));
}

function hkSwap(on) {
  const el = KK.el;
  if (!HACKER.orig) {
    HACKER.orig = {};
    HACKER.hack = {};
    Object.keys(KK.rows).forEach((k) => {
      const sv = $(".f-" + k, el);
      if (!sv) return;
      HACKER.orig[k] = sv.innerHTML;
      const t = document.createElement("template");
      t.innerHTML = sprite(hackify(KK.rows[k], k), 3);
      HACKER.hack[k] = t.content.firstElementChild.innerHTML;
    });
  }
  Object.keys(HACKER.orig).forEach((k) => {
    const sv = $(".f-" + k, el);
    if (sv) sv.innerHTML = on ? HACKER.hack[k] : HACKER.orig[k];
  });
  el.classList.toggle("kk-hk", on);
}

function hkSay(kind) {
  if (kind === "off") {
    HACKER.pend = false;
    if (HACKER.talked && Date.now() - HACKER.since > 4000 && hkCan())
      KK.say(KK.pick(HKL.bye, "hk"), { p: 1, key: "hk-bye", cd: 6000 });
    return;
  }
  const first = !hkSeen();
  if (HACKER.boot && !first)
    return; /* recarga con el inspector abierto: se pone los lentes sin repetir el saludo */
  if (!hkCan()) {
    HACKER.pend = true;
    return;
  } /* Kixki aún no sale (pantalla de arranque, ventana maximizada…): saluda cuando pueda */
  HACKER.pend = false;
  HACKER.talked = true;
  hkMark();
  KK.say(KK.pick(first ? HKL.first : HKL.again, "hk"), { p: 3, key: "hk", cd: 4000 });
}

function hkSet(on) {
  HACKER.on = on;
  HACKER.miss = 0;
  hkSwap(on);
  if (on) HACKER.since = Date.now();
  hkSay(on ? "on" : "off");
}

function hkEval() {
  const s = hkSize();
  if (s) HACKER.key = false; /* el tamaño ya lo confirma: desde ahora manda el detector */
  if (HACKER.key || s) {
    HACKER.miss = 0;
    if (!HACKER.on) hkSet(true);
  } else if (HACKER.on && ++HACKER.miss >= 2)
    hkSet(false); /* dos lecturas seguidas «cerrado» para evitar parpadeos */
}

export function iniciar() {
  /* ---------- EASTER EGG · Modo Hacker (F12 / inspector) ----------
     Detecta que abres las herramientas de desarrollador por dos vías: los atajos de teclado (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C)
     y el tamaño de la ventana (inspector acoplado a un lado o abajo; en móvil/táctil no se mide). Kixki cambia su sprite por uno
     con lentes y sudadera (se redibuja cada fotograma, así camina, salta y habla igual) y suelta un saludo en su globo. */

  /* Modo Hacker SOLO con atajo (F12, Ctrl+Shift+I/J/C/K, Cmd+Opt+I/J/C/K) o con KXQ.hacker().
     Antes también se activaba por el tamaño de la ventana (outerWidth-innerWidth > 170) y los paneles laterales del
     navegador (Edge/Chrome/Firefox, pestañas verticales) la dejaban con lentes sin tener el inspector abierto. */

  addEventListener(
    "keydown",
    (e) => {
      if (e.repeat) return;
      const isF12 = e.key === "F12";
      const combo =
        ((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)) && /^Key[IJCK]$/.test(e.code || "");
      if (!isF12 && !combo) return;
      if (!HACKER.on)
        HACKER.key = true; /* abrir: se activa ya, sin esperar a que cambie el tamaño */
      else if (isF12 || e.code === "KeyI")
        HACKER.key = false; /* F12 y Ctrl+Shift+I también cierran */
      hkEval();
      setTimeout(hkEval, 350);
      setTimeout(hkEval, 1200);
    },
    true
  );
  setInterval(() => {
    if (document.hidden) return;
    if (HACKER.pend && HACKER.on && hkCan()) hkSay("on");
  }, 1200);
  hkEval();
  HACKER.boot = false;
  window.KXQ = {
    open: openPanel,
    list: () =>
      LOGROS.filter((x) => !x.hid || ST.u[x.id]).map((x) => ({
        id: x.id,
        name: x.n[0],
        done: !!ST.u[x.id],
      })),
    state: ST,
    grant(id) {
      const x = LOGROS.find((y) => y.id === id);
      if (!x || ST.u[id]) return false;
      const lv0 = level(count());
      ST.u[id] = now();
      save();
      announce([x], lv0);
      refreshMenu();
      sweep();
      return true;
    },
    reset() {
      ST.u = {};
      ST.c = {};
      ST.seenAt = 0;
      ST.init = 1;
      Object.keys(C).forEach((k) => delete C[k]);
      save();
      refreshMenu();
      if (!panel.hidden) renderPanel();
    },
    chat: petChat,
    fire: () => petFire(true),
    cow: () => window.KXE && KXE.fire(1000),
    confetti,
    sparks,
    umbrella(v) {
      if (v === false) {
        UMB.next = now() + 3e4;
        umbHide(true);
        return false;
      }
      UMB.next = 0;
      if (!wet() && window.KXRAIN) KXRAIN.start(90000);
      return true;
    },
    hacker(v) {
      HACKER.key = v == null ? !HACKER.on : !!v;
      hkEval();
      setTimeout(hkEval, 350);
      setTimeout(hkEval, 1200);
      return HACKER.on;
    },
  };
}
