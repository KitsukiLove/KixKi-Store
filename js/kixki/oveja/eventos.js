/*
  Reacciones a lo que hace la persona: buscar, favoritas, tema, fondo, música y minijuegos.
*/

import { leer } from "../../core/store.js";
import { $, idioma as lang } from "../../core/util.js";
import { alive, onSearch, q, T_fmt } from "./cerebro.js";
import { body, bx, el } from "./elemento.js";
import { frame, K, setMode, V } from "./estado.js";
import { clearQ, done, interrupt, say } from "./globo.js";
import { S } from "./memoria.js";
import { idle0, MODES } from "./modos.js";
import { hop, resync, usable } from "./movimiento.js";
import { puente } from "./puente.js";
import { T, TEXTOS_UI } from "./textos.js";
import { emit, root } from "./utilidades.js";
let prevFav, prevTheme, prevBg, prevMus, hiddenAt;

const favCount = () => leer("kixki-fav", []).length;

function onGame(d) {
  emit("game", d);
  if (!S.on) return;
  if (d.t === "start" || d.t === "retry") {
    K.game = true;
    el.classList.add("kk-top");
    K.tour = null;
    idle0();
    if (d.t === "start")
      setTimeout(async () => {
        if (!K.game) return;
        await puente.enter("game");
        if (!K.game) return;
        say(d.rec > 0 ? T_fmt(T.gStartRec, { rec: d.rec }) : T.gStart, {
          p: 2,
          key: "gstart",
          cd: 15000,
          always: true,
        });
      }, 350);
  } else if (d.t === "record") say(T.gRecord, { p: 3, mood: "happy", key: "grec", cd: 6000 });
  else if (d.t === "over") {
    const m =
      d.nr && !d.first
        ? T_fmt(T.gOverRec, { sc: d.sc })
        : d.first && d.sc > 0
          ? T_fmt(T.gOverFirst, { sc: d.sc })
          : d.sc === 0
            ? T.gOverZero
            : d.sc >= d.rec * 0.8 && d.rec > 2
              ? T_fmt(T.gOverNear, { sc: d.sc })
              : T_fmt(T.gOver, { sc: d.sc });
    say(m, { p: 3, mood: d.nr && !d.first ? "happy" : undefined, key: "gover", cd: 2500 });
  }
}

/* idioma: avisa y traduce sus textos fijos */
export function labels() {
  const L = lang() === "en" ? 1 : 0;
  body.setAttribute("aria-label", (K.snooze ? TEXTOS_UI.zzAria : TEXTOS_UI.aria)[L]);
  bx.setAttribute("aria-label", TEXTOS_UI.close[L]);
  const t = $("#s-kx-tip"),
    o = $("#s-kx-on"),
    md = $("#s-kx-mode");
  if (t) t.textContent = TEXTOS_UI.tip[L];
  if (o) o.textContent = (S.on ? TEXTOS_UI.onT : TEXTOS_UI.offT)[L];
  if (md) {
    md.textContent = TEXTOS_UI.modeT[S.mode in MODES ? S.mode : "normal"][L];
    md.hidden = !S.on;
  }
}

export function iniciar() {
  q.addEventListener("input", () => {
    clearTimeout(V.sT);
    K.tour = null;
    clearQ("search");
    if (V.cur && V.cur.ctx === "search")
      done(V.cur, "stale"); /* la respuesta a una búsqueda vieja ya no sirve */
    V.sT = setTimeout(onSearch, 420);
  });
  q.addEventListener("focus", async () => {
    if (!S.on || K.off || !K.ready) return;
    if (usable("search") && K.stage !== "search" && alive()) await hop("search");
    say(T.focus, { p: 1, key: "focus", cd: 120000 });
  });

  prevFav = favCount();
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".star")) return;
    setTimeout(() => {
      const n = favCount(),
        added = n > prevFav;
      prevFav = n;
      emit("fav", { n, added });
      say(!added ? T.favDel : n === 1 ? T.fav1 : n % 5 === 0 ? T_fmt(T.fav5, { n }) : T.favAdd, {
        p: 2,
        key: "fav",
        cd: 4000,
        emo: added ? "fav" : "favDel",
        mood: added && (n === 1 || n % 5 === 0) ? "happy" : undefined,
      });
    }, 40);
  });
  prevTheme = root.getAttribute("data-theme");
  new MutationObserver(() => {
    const t = root.getAttribute("data-theme");
    if (t === prevTheme) return;
    prevTheme = t;
    emit("theme", { dark: t === "dark" });
    if (K.mode === "sleep" && !K.snooze) {
      setMode("idle");
      frame("idle");
    }
    if (K.ready)
      say(t === "dark" ? T.night : T.day, {
        p: 2,
        cat: "ui",
        opt: true,
        key: "theme",
        cd: 8000,
        ttl: 2500,
        emo: "theme",
      });
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  prevBg = window.KXB ? KXB.full() : "";
  addEventListener("kixki-bg", () => {
    if (!window.KXB) return;
    const l = KXB.full();
    if (l === prevBg) return;
    prevBg = l;
    const auto = KXB.season() === "auto",
      k = auto
        ? "auto"
        : root.getAttribute("data-bg") === "xp"
          ? KXB.xpv()
          : root.getAttribute("data-bg") || "";
    emit("bg", { k });
    if (K.ready && T.bg[k]) say(T.bg[k], { p: 1, key: "bg", cd: 5000, emo: "bg" });
  });
  prevMus = !!(window.KXM && KXM.on);
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#rd,#s-mus")) return;
    setTimeout(() => {
      const on = !!(window.KXM && KXM.on);
      if (on === prevMus) return;
      prevMus = on;
      emit("music", { on });
      say(on ? T.musOn : T.musOff, { p: 1, key: "mus", cd: 10000, emo: "music" });
    }, 80);
  });
  addEventListener("kixki-game", (e) => onGame(e.detail || {}));
  if (window.KXI && !KXI._kk) {
    KXI._kk = 1;
    const o = KXI.set;
    KXI.set = function (l) {
      o.call(KXI, l);
      labels();
      emit("lang", { lang: l });
      interrupt();
      if (K.ready)
        say(T.lang[l === "en" ? "en" : "es"], { p: 2, key: "lang", cd: 2500, emo: "lang" });
    };
  }
  /* volver a la pestaña */
  hiddenAt = 0;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = Date.now();
      return;
    }
    const away = hiddenAt ? Date.now() - hiddenAt : 0;
    if (K.ready && away >= 25000)
      say(T.back, { p: 2, cat: "ui", opt: true, key: "back", cd: 60000, ttl: 3000, emo: "back" });
    else if (K.ready && away >= 6000) puente.micro("back", { key: "backm", cd: 20000 });
    resync();
  });
}
