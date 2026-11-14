/*
  Cerebro: elige qué decir (consejos, carpetas, saludo, tour) y cuándo (charla espontánea, pensar).
*/

import { $, $$, now, rnd, wait } from "../../core/util.js";
import { frame, K, setMode, V } from "./estado.js";
import { pick, say } from "./globo.js";
import { S, save } from "./memoria.js";
import { modoActual, typing } from "./modos.js";
import { candidates, free, geo, hop, relocate, usable, walk } from "./movimiento.js";
import { puente } from "./puente.js";
import { FOLD, GREET, KXD, T, TOUR_MOB, TOUR_PC } from "./textos.js";
import { emit, fmt, isPC, randApp, root } from "./utilidades.js";
export let q;

export const praise = () =>
  Math.random() < 0.4 && KXD.gen ? KXD.gen("praise") : pick(T.praise, "praise");

export const pickTip = () =>
  pick(
    T.tips.filter((t) => (!t.pc || isPC()) && (!t.mob || !isPC())),
    "tip"
  ).t;

const allIds = () => $$("#app .cat").map((e) => e.id);

const cnt = (id) => {
  const c = $(`#${id} .chip`);
  return c ? parseInt(c.textContent) || 0 : 0;
};

const firstApp = (id) => {
  const h = $(`#${id} .app h3`);
  return h ? h.textContent.trim() : "";
};

export const searching = () => {
  const x = $("#q");
  return !!x && (x.value.trim().length >= 2 || typing());
};

export const alive = () =>
  S.on && !K.off && K.ready && !document.hidden && !K.talking && !K.tour && K.mode !== "hop";

export const dark = () => root.getAttribute("data-theme") === "dark";

export const T_fmt = (pair, v) => {
  if (Array.isArray(pair[0])) pair = pick(pair, "tf");
  return [fmt(pair[0], v), fmt(pair[1], v)];
};

function pickMisc() {
  const h = new Date().getHours(),
    list = [...T.facts],
    bg = root.getAttribute("data-bg");
  if (h >= 23 || h < 5) list.push(...T.late);
  /* (parte 3) frases según la franja horaria y con una app/carpeta reales */
  const slot = h < 5 || h >= 22 ? "night" : h < 12 ? "morning" : h < 19 ? "afternoon" : "evening";
  list.push(...((T.tod && T.tod[slot]) || []));
  if (randApp()) list.push(...(T.appTips || []));
  if (bg === "halloween" || bg === "navidad") list.push(...[].concat(T.bg[bg]));
  const pk = $("#pick b");
  if (pk)
    list.push([
      "Hoy te sugiero «" + pk.textContent + "». ¿Le echas un vistazo?",
      "Today I suggest “" + pk.textContent + "”. Want to take a look?",
    ]);
  return pick(list, "misc");
}

function folderLine(id) {
  const n = cnt(id),
    a = firstApp(id);
  if (id === "favs")
    return n
      ? [`Tus favoritas: ${n}. ¡Buen gusto! ⭐`, `Your favorites: ${n}. Great taste! ⭐`]
      : [
          "Aún no tienes favoritas. Toca la ☆ de una app y aparecerá aquí.",
          "No favorites yet. Tap the ☆ on an app and it'll show up here.",
        ];
  if (id === "news")
    return n
      ? [
          `¡Novedades! Hay ${n} app${n === 1 ? "" : "s"} nueva${n === 1 ? "" : "s"} desde tu última visita. 🆕`,
          `News! There ${n === 1 ? "is" : "are"} ${n} new app${n === 1 ? "" : "s"} since your last visit. 🆕`,
        ]
      : [
          "Sin novedades por ahora. Cuando haya apps nuevas, las verás aquí.",
          "Nothing new for now. When new apps arrive, you'll see them here.",
        ];
  const f = FOLD[id];
  return f ? [fmt(f[0], { n, a }), fmt(f[1], { n, a })] : null;
}

/* o.line = frase propia (p. ej. un consejo de la parte 4); si no, la frase de siempre de esa carpeta */
export async function visitFolder(id, o = {}) {
  if (!S.on || K.snooze) return false; /* (4b) dormida: no visita carpetas */
  const line = o.line || folderLine(id);
  if (!line) return false;
  if (o.line) {
    o = Object.assign({}, o);
    delete o.line;
  }
  if (isPC()) {
    const di = $(`#desk .di[data-id="${id}"]`);
    if (!usable("desk:" + id)) return say(line, o);
    await hop("desk:" + id);
    return say(line, Object.assign({ hl: di }, o));
  }
  const i = $$("#desk .di").findIndex((e) => e.dataset.id === id),
    row = Math.floor(i / 3),
    sid = "tiles" + row;
  if (i >= 0 && usable(sid)) {
    const g = geo(sid),
      r = g.tiles[i % 3];
    await hop(sid, r ? r.left + r.width / 2 : undefined);
  }
  return say(line, o);
}

export function onFolder(id, st) {
  S.fc[id] = (S.fc[id] || 0) + 1;
  const first = !S.opened.includes(id);
  if (first) S.opened.push(id);
  save();
  const total = allIds().length;
  emit("folder", { id, first, state: st, count: S.opened.length, total });
  K.tour = null;
  if (!S.on) return; /* (4b) dormida: no visita carpetas */
  if (S.opened.length >= total && !S.allDone) {
    S.allDone = 1;
    save();
    emit("allfolders", { total });
    say(T.allDone, { p: 3, mood: "happy" });
    return;
  }
  if (!isPC() && st === "max") {
    K.pend = id;
    return;
  }
  if (searching())
    return; /* (parte 2) buscar abre todas las ventanas: no saltar de carpeta en carpeta */
  if (S.fc[id] <= 2 || Math.random() < 0.18)
    visitFolder(id, { p: first ? 2 : 1, key: "fold:" + id, cd: 30000, emo: "folder" });
}

export function brain(ms) {
  clearTimeout(V.brainT);
  V.brainT = setTimeout(think, ms == null ? rnd(2600, 6200) : ms);
}

function chatter() {
  const w = Math.random();
  V.nextChat = now() + rnd(26000, 50000) * modoActual().chat;
  if (w < 0.2 && (isPC() || !K.game) && Math.random() < 0.9) {
    const ids = [
      "tiendas",
      "importante",
      "control",
      "utilidad",
      "pantalla",
      "privacidad",
      "fotos",
      "internet",
      "dia",
      "emulacion",
      "decoracion",
      "musica",
      "teclados",
      "packs",
    ].filter((i) => $(`#desk .di[data-id="${i}"]`));
    visitFolder(ids[Math.floor(Math.random() * ids.length)], { p: 1, key: "chat", cat: "sp" });
    return;
  }
  const m = w < 0.55 ? pickTip() : w < 0.85 ? praise() : pickMisc();
  say(m, { p: 1, key: "chat", cat: "sp" });
}

async function think() {
  if (!alive() || K.still) {
    brain(2500);
    return;
  } /* K.still = true: quieta del todo (para pruebas automáticas) */
  const idle = now() - V.lastAct;
  if (K.mode === "sleep") {
    brain(6000);
    return;
  }
  if (dark() && idle > 150000 && K.mode === "idle") {
    setMode("sleep");
    frame("sleep");
    brain(6000);
    return;
  }
  const g = geo(K.stage);
  if (!g || (!usable(K.stage) && !free(K.stage))) {
    await relocate();
    brain();
    return;
  }
  if (K.game) {
    brain(4000);
    return;
  }
  if (now() >= V.nextChat && idle < 240000 && S.mode !== "quiet") {
    chatter();
    brain(5000);
    return;
  } /* (4b) «calladita»: ninguna visita ni frase espontánea */
  const r = Math.random();
  if (g.b - g.a > 40 && r < 0.62) await walk(rnd(g.a, g.b));
  else if (r < 0.92) {
    const c = candidates().filter((i) => i !== K.stage);
    if (c.length) await hop(c[Math.floor(Math.random() * c.length)]);
  }
  brain();
}

/* ---------- presentación y tour de la primera visita ---------- */
async function tour() {
  const tok = (K.tour = {}),
    steps = isPC() ? TOUR_PC : TOUR_MOB;
  for (const [st, m] of steps) {
    if (K.tour !== tok || K.off) break;
    if (st && st !== K.stage && usable(st)) {
      await hop(st);
      if (K.tour !== tok) break;
    }
    const ok = await say(m, { p: 2 });
    if (!ok && K.tour !== tok) break;
    await wait(450);
  }
  if (K.tour === tok) K.tour = null;
}

export async function greet() {
  const first = !S.first,
    prev = S.last;
  let again = false;
  try {
    again = !!sessionStorage.getItem("kixki-k-s");
    sessionStorage.setItem("kixki-k-s", "1");
  } catch (e) {
    // Almacenamiento bloqueado o lleno (modo privado): se sigue sin guardar.
  }
  if (!again) S.visits++;
  if (!S.first) S.first = now();
  S.last = now();
  save();
  emit("visit", { n: S.visits, first, prev, again });
  if (again) return;
  if (S.mode === "quiet") {
    say(GREET.morning, { p: 2, emo: "greet", key: "greet" });
    return;
  } /* (4b) «calladita»: ni tour ni saludo con texto, solo un emoji */
  if (first) {
    await tour();
    return;
  }
  const h = new Date().getHours(),
    days = Math.floor((now() - prev) / 864e5);
  const m =
    days >= 3
      ? T_fmt(GREET.away, { d: days })
      : h < 5 || h >= 23
        ? GREET.night
        : h < 12
          ? GREET.morning
          : h < 19
            ? GREET.afternoon
            : GREET.evening;
  await say(m, { p: 2 });
  const nn = cnt("news");
  if (nn > 0) {
    await wait(350);
    say(nn === 1 ? GREET.news1 : T_fmt(GREET.newsN, { n: nn }), { p: 2 });
  }
}

export async function onSearch() {
  const v = q.value.trim();
  if (v.length < 2) return;
  const apps = $$("#app .cat:not(#favs):not(#news):not(#packs) .app:not([hidden])"),
    n = apps.length,
    a = n ? apps[0].querySelector("h3").textContent.trim() : "";
  emit("search", { q: v, n });
  if (!S.on || K.off) return;
  /* (parte 2) ya no espera a llegar a la barra: salta sin esperar y la frase sale al aterrizar (o ya, si está cerca) */
  if (usable("search") && K.stage !== "search" && alive()) hop("search");
  say(
    n === 0
      ? T_fmt(T.noRes, { q: v })
      : n === 1
        ? T_fmt(T.oneRes, { a })
        : T_fmt(T.manyRes, { n, q: v }),
    {
      p: 2,
      key: "search",
      cd: 2500,
      ctx: "search",
      ttl: 2500,
      always: true,
      emo: n === 0 ? "noRes" : "search",
    }
  );
}

puente.brain = brain;

export function iniciar() {
  /* ---------- carpetas ---------- */

  /* ---------- cerebro: qué hace cuando nadie le dice nada ---------- */

  /* parpadeo */
  (function blink() {
    setTimeout(
      () => {
        if (K.mode === "idle" && K.frame === "idle" && !K.off && !document.hidden) {
          frame("blink");
          setTimeout(() => {
            if (K.frame === "blink") frame("idle");
          }, 130);
        }
        blink();
      },
      rnd(2600, 6000)
    );
  })();

  /* ---------- reacciones a lo que haces ---------- */
  q = $("#q");
}
