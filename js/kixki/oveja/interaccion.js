/*
  Interacción directa: visibilidad de la pestaña, micro-reacciones, pasar el ratón, clics sobre Kixki y atajos de teclado.
*/

import { $, $$, now, rnd } from "../../core/util.js";
import { alive, pickTip, praise, searching } from "./cerebro.js";
import { body, bub, vi } from "./elemento.js";
import { frame, K, setMode, V } from "./estado.js";
import { labels } from "./eventos.js";
import { done, finishTyping, pick, say } from "./globo.js";
import { S, save } from "./memoria.js";
import { applyMode, modoActual, MODES } from "./modos.js";
import { candidates, hop, resync } from "./movimiento.js";
import { puente } from "./puente.js";
import { EMO, FAST, MIC, T } from "./textos.js";
import { emit, isPC, KX } from "./utilidades.js";
let manyShown, taps, sm;

const hasWord = (t) => /\p{L}/u.test(t);

const appName = (a) => {
  const h = a && a.querySelector("h3");
  return h ? h.textContent.trim() : "";
};

/* kind → MIC[kind]; en modo «calladita» solo salen las de emoji; devuelve la promesa de say() */
export function micro(kind, o = {}) {
  let pool = (MIC[kind] || []).slice();
  if (!modoActual().words)
    pool = pool
      .concat(EMO[kind] || [])
      .filter((m) => !hasWord(m[0])); /* «calladita»: solo emoji (los de MIC y los de EMO) */
  if (!pool.length) return Promise.resolve(false);
  return say(pick(pool, "mic-" + kind), Object.assign({ p: 1, micro: true, cd: 0 }, o));
}

export function checkWins() {
  if (!isPC() || searching()) {
    manyShown = false;
    return;
  }
  const n = $$("#app .cat:not(.min):not(.max)").filter((x) => !x.hidden).length;
  if (n >= 5 && !manyShown) {
    manyShown = true;
    if (K.ready && S.on && !K.off)
      say(pick(FAST.wins, "fast-wins"), {
        p: 2,
        cat: "ui",
        opt: true,
        key: "manywin",
        cd: 90000,
        ttl: 3000,
        vars: { n },
        emo: "wins",
      });
  } else if (n <= 3) manyShown = false;
}

/* ---------- actividad del visitante (para dormir y despertar) ---------- */
function act() {
  V.lastAct = now();
  if (K.snooze) return; /* (4b) dormida por la opción del menú: solo la despierta tocarla a ella */
  if (K.mode === "sleep") {
    setMode("idle");
    frame("idle");
    say(T.wake, { p: 1, key: "wake", cd: 60000 });
  }
}

/* charlatana → normal → calladita (m = nombre para fijarlo; null = siguiente) */
export function setTalk(m) {
  const order = ["chat", "normal", "quiet"];
  S.mode = m && MODES[m] ? m : order[(order.indexOf(S.mode) + 1) % 3];
  save();
  applyMode();
  labels();
  emit("mode", { mode: S.mode });
  V.nextChat = now() + rnd(8000, 16000) * modoActual().chat;
  if (S.on && K.ready && !K.off) say(FAST.mode[S.mode], { p: 3, key: "modemsg", cd: 0 });
}

puente.micro = micro;

export function iniciar() {
  /* ---------- (parte 2) microreacciones y reacciones rápidas ---------- */

  /* clic en «Descarga»/«APK» o en la fuente (GitHub, Repositorio…) */
  document.addEventListener(
    "click",
    (e) => {
      const b = e.target.closest && e.target.closest(".app .links a.btn,.app .links button.btn");
      if (!b || !S.on || !K.ready) return;
      const t = b.textContent.trim(),
        a = appName(b.closest(".app"));
      const kind = /^(descarga|apk|play|google play)/i.test(t)
        ? "dl"
        : /github|gitlab|repositorio|fuente|source|cr[eé]ditos/i.test(t)
          ? "src"
          : "";
      if (!kind) return;
      emit("click-" + kind, { a });
      say(pick(FAST[kind], "fast-" + kind), {
        p: 2,
        cat: "ui",
        opt: true,
        key: "fast-" + kind,
        cd: 6000,
        ttl: 2500,
        vars: { a },
        emo: kind,
      });
    },
    true
  );
  /* ratón 3 s sobre la misma app (solo con ratón) */
  if (matchMedia("(hover:hover)").matches) {
    let hv = null;
    const clearHv = () => {
      if (hv) {
        clearTimeout(hv.t);
        hv = null;
      }
    };
    document.addEventListener(
      "pointerover",
      (e) => {
        if (e.pointerType === "touch") return;
        const c = e.target.closest && e.target.closest("#app .app");
        if (!c) {
          clearHv();
          return;
        }
        if (hv && hv.c === c) return;
        clearHv();
        hv = {
          c,
          t: setTimeout(() => {
            const c0 = hv && hv.c;
            hv = null;
            if (!c0 || !S.on || K.off || !K.ready || !c0.isConnected || c0.hidden) return;
            say(pick(FAST.hov, "fast-hov"), {
              p: 1,
              cat: "sp",
              key: "hover",
              cd: 25000,
              ttl: 1500,
              vars: { a: appName(c0) || "esta app" },
            });
          }, 3000),
        };
      },
      true
    );
    document.addEventListener("pointerdown", clearHv, true);
    addEventListener("blur", clearHv);
  }
  /* muchas ventanas abiertas a la vez (solo PC) */
  manyShown = false;
  /* ---------- tocar a Kixki ---------- */
  taps = [];
  body.addEventListener("click", () => {
    if (K.enter) return; /* (4b) entrando en una ventana: no se le habla */
    act();
    if (K.snooze) {
      puente.poke();
      return;
    } /* (4b) dormida: se despierta un instante (😠/😴) y vuelve a dormir */
    const t = now();
    taps = taps.filter((x) => t - x < 4000);
    taps.push(t);
    emit("tap", { n: taps.length });
    if (window.KXS)
      try {
        KXS.baa();
      } catch (e) {
        // El sonido es opcional: si el audio aún no está listo se omite.
      }
    if (taps.length >= 7) {
      taps = [];
      say(T.dizzy, { p: 3, key: "dizzy", cd: 9000, words: true });
      setTimeout(() => {
        if (alive()) {
          const c = candidates().filter((i) => i !== K.stage);
          if (c.length) hop(c[0]);
        }
      }, 2600);
      return;
    }
    if (V.cur) done(V.cur, "user");
    const r = Math.random();
    say(r < 0.5 ? pickTip() : r < 0.78 ? pick(T.tap, "tap") : praise(), {
      p: 2,
      words: true,
    }); /* (4b) tocarla = permiso para hablar con texto, incluso en «calladita» */
  });
  bub.addEventListener("click", () => {
    if (V.cur && !finishTyping(V.cur)) done(V.cur, "user");
  });
  if (matchMedia("(hover:hover)").matches) {
    bub.addEventListener("mouseenter", () => {
      if (V.cur && V.cur.t && K.talking && bub.hidden === false && vi.textContent === V.cur.text)
        clearTimeout(V.cur.t);
    });
    bub.addEventListener("mouseleave", () => {
      if (V.cur && vi.textContent === V.cur.text) {
        const c = V.cur;
        clearTimeout(c.t);
        c.t = setTimeout(() => done(c, "auto"), 1800);
      }
    });
  }
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && V.cur) done(V.cur, "user");
  });
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    addEventListener(ev, act, { passive: true, capture: true })
  );
  addEventListener(
    "scroll",
    () => {
      V.lastAct = now();
      resync();
    },
    { passive: true }
  );
  addEventListener("resize", resync);
  /* ---------- menú: apagar a Kixki y pedirle un consejo ---------- */
  sm = KX.sm || $("#sm");
  if (sm) {
    const ref = $("#s-sug", sm);
    const html = `<button type="button" class="sm" id="s-kx-tip"></button><button type="button" class="sm" id="s-kx-mode"></button><button type="button" class="sm" id="s-kx-on"></button>`;
    ref ? ref.insertAdjacentHTML("beforebegin", html) : sm.insertAdjacentHTML("beforeend", html);
    sm.addEventListener("click", (e) => {
      const b = e.target.closest("#s-kx-tip,#s-kx-on,#s-kx-mode");
      if (!b) return;
      if (b.id === "s-kx-mode") {
        setTalk(null);
        return;
      }
      if (b.id === "s-kx-on") {
        S.on = !S.on;
        save();
        const r = puente.applyOn();
        labels();
        if (S.on) r.then(() => setTimeout(() => say(praise(), { p: 2 }), 500));
      } else if (S.on) {
        setTimeout(() => say(pickTip(), { p: 3, words: true }), 250);
      } /* pedir un consejo = petición directa: puede hablar con texto */ else {
        S.on = true;
        save();
        const r = puente.applyOn();
        labels();
        r.then(() => setTimeout(() => say(pickTip(), { p: 3, words: true }), 300));
      }
    });
  }
}
