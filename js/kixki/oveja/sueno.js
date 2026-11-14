/*
  Dormir y despertar (modo «Kixki: no»), poses y regreso al descanso.
*/

import { clamp, idioma as lang, reducirMovimiento as RM, wait } from "../../core/util.js";
import { brain } from "./cerebro.js";
import { el, sr } from "./elemento.js";
import { frame, K, setMode } from "./estado.js";
import { labels } from "./eventos.js";
import { beep, emo, interrupt, say } from "./globo.js";
import { S } from "./memoria.js";
import {
  candidates,
  free,
  geo,
  home,
  hop,
  relocate,
  resync,
  stopMove,
  usable,
} from "./movimiento.js";
import { puente } from "./puente.js";
import { T, TEXTOS_UI } from "./textos.js";
import { emit, isPC } from "./utilidades.js";

let zzTok, pokeT;

const REST_RE = /^(search|dock|floor|tiles\d)$/;

export const restId = () => (isPC() ? (usable("floor") ? "floor" : "search") : "dock");

export const restX = (id, g) =>
  id === "floor"
    ? clamp(innerWidth * 0.84, g.a, g.b)
    : id === "dock"
      ? Math.max(g.a, g.b - 12)
      : (g.a + g.b) / 2;

export const announce = (t) => {
  sr.textContent = "";
  setTimeout(() => {
    sr.textContent = t;
  }, 60);
};

export const kxs = (f, d) => {
  if (window.KXS)
    try {
      KXS.beep(f, d);
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
};

export function pose(on) {
  K.snooze = on;
  el.classList.toggle("kk-snooze", on);
  el.classList.toggle("kk-lie", on);
  if (on) {
    setMode("sleep");
    frame("sleep");
  } else {
    if (K.mode === "sleep") setMode("idle");
    frame("idle");
  }
  labels();
}

async function goSleep(silent) {
  const tok = ++zzTok,
    wasHop = K.mode === "hop";
  clearTimeout(pokeT);
  K.poking = false;
  el.classList.remove("kk-stretch");
  puente.cancelEnter();
  K.tour = null;
  interrupt();
  stopMove();
  if (K.mode === "hop" || K.mode === "walk") {
    setMode("idle");
    frame("idle");
  }
  /* una sola frase de buenas noches (en «calladita», un emoji) */
  if (!silent && K.ready && !K.off && !document.hidden) {
    await say(T.sleepNow, {
      p: 3,
      cat: "ui",
      zz: true,
      always: true,
      replace: true,
      key: "zz-bye",
      ttl: 3000,
    });
    if (tok !== zzTok) return;
  }
  /* si no está en un sitio que no estorba (barra, filas, barra de tareas), se va a uno; si lo está, se queda donde está */
  const keep = !wasHop && REST_RE.test(K.stage || "") && usable(K.stage);
  if (!keep && K.ready && !K.off) {
    const rid = restId();
    if (usable(rid)) {
      const g = geo(rid);
      await hop(rid, restX(rid, g));
      if (tok !== zzTok) return;
    }
  }
  pose(true);
  announce(TEXTOS_UI.zzSr[lang() === "en" ? 1 : 0]);
  emit("sleep", { on: true });
}

async function wakeUp() {
  const tok = ++zzTok,
    was = K.snooze;
  clearTimeout(pokeT);
  K.poking = false;
  if (!was || K.off || !K.ready) {
    pose(false);
    if (K.ready && !K.off) {
      const g = geo(K.stage);
      if (!g || (!usable(K.stage) && !free(K.stage))) relocate(true);
      else resync();
      brain(2500);
    }
    return;
  }
  emit("sleep", { on: false });
  interrupt();
  el.classList.remove("kk-snooze", "kk-lie");
  K.snooze = false;
  setMode("idle");
  frame("talk");
  labels(); /* bostezo: boca abierta */
  emo("yawn", { p: 2 });
  setTimeout(() => {
    if ((tok === zzTok && !K.snooze && K.mode === "talk") || (K.mode === "idle" && tok === zzTok))
      frame("talk");
  }, 260);
  await wait(RM() ? 250 : 900);
  if (tok !== zzTok) return;
  if (!RM()) {
    el.classList.add("kk-stretch");
    beep(300);
    setTimeout(() => beep(380), 200);
    await wait(750);
    if (tok !== zzTok) return;
    el.classList.remove("kk-stretch");
  } /* se estira */
  frame("idle");
  const id = candidates()[0] || home(); /* y vuelve a lo suyo */
  if (id !== K.stage && usable(id) && !K.game) await hop(id);
  else resync();
  if (tok === zzTok) brain(2500);
}

/* la tocan mientras duerme: se levanta un instante enfadada o somnolienta y vuelve a dormir */
export function poke() {
  if (!K.snooze || K.poking) return;
  K.poking = true;
  clearTimeout(pokeT);
  emit("poke", {});
  el.classList.remove("kk-lie");
  setMode("idle");
  frame("idle");
  if (window.KXS)
    try {
      KXS.baa();
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
  emo("poke", { p: 3, zz: true, ttl: 700 });
  pokeT = setTimeout(() => {
    K.poking = false;
    if (!K.snooze) return;
    interrupt();
    el.classList.add("kk-lie");
    setMode("sleep");
    frame("sleep");
  }, 1500);
}

export function applyOn() {
  return S.on ? wakeUp() : goSleep();
}

puente.poke = poke;

puente.applyOn = applyOn;

export function iniciar() {
  /* ---------- (parte 4b) quitar a Kixki = que se duerma ----------
     Ya no desaparece: se acuesta (sprite de dormir + «zZ») donde no estorba y se queda así, visible. Dormida no camina, no habla,
     no reacciona al entorno ni visita carpetas (todo eso ya comprueba S.on). Una sola frase de buenas noches al irse a dormir
     (T.sleepNow). Si la tocan se despierta un instante con 😠/😴 y vuelve a dormir. Al reactivar la opción: bostezo, se estira y vuelve.
     Estado: S.on (localStorage «kixki-k») · pose: K.snooze + clases kk-snooze/kk-lie. Lector de pantalla: «Kixki está durmiendo», una vez. */

  zzTok = 0;
  pokeT = 0;
  /* ---------- (parte 4b) entrar en la ventana de un minijuego ----------
     enter(id,{fall,hide,target,onImpact}) → promesa: true = lista para jugar (o no hacía falta animar), false = cancelada.
     · Salta Vallas («game»): salta y se sube al borde de la ventana (lo de siempre).
     · Básquet («bask», fall:true): sube, camina hasta el borde, se tropieza y CAE dentro de la ventana (golpe + estrellitas);
       target() = dónde caen sus pies (la cancha lo calcula en vivo); hide:true la esconde al llegar (la cancha dibuja su propia Kixki).
     · prefers-reduced-motion: sin saltos ni caída, solo un fundido corto.
     · skipEnter() la salta (clic o tecla); cancelEnter() limpia TODO si cierran la ventana a medias (clases, temporizadores, estado). */
}
