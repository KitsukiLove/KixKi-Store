/*
  Arma el consejo de una carpeta (frases a mano o con sus apps reales) y lo cuenta para los logros.
*/

import { $, $$, now } from "../../core/util.js";
import { askBtn, closePop, abierto } from "./boton.js";
import { memoria, save } from "./config.js";
import { ADV, foldIds, K, KK, ready } from "./estado.js";
let tok;

const text = (e) => (e ? e.textContent.replace(/\s+/g, " ").trim() : "");

const shuffle = (l) => {
  const a = l.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const vars = (raw) => [...String(raw).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);

const fits = (pair, v) => vars(pair[0]).every((k) => v[k] != null && v[k] !== "");

const fill = (pair, v) => [KK.fmt(pair[0], v), KK.fmt(pair[1], v)];

const pickFit = (list, key, v) => {
  const ok = (list || []).filter((p) => fits(p, v));
  return ok.length ? KK.pick(ok, key) : null;
};

function folderApps(id) {
  const out = [];
  $$(`#${CSS.escape(id)} .app`).forEach((a) => {
    if (a.hidden) return;
    const h = $("h3", a);
    if (!h) return;
    const tp = $(".tip span:last-child", a);
    out.push({ a: text(h), t: text($(".tag", a)), tip: tp ? text(tp) : "" });
  });
  return out;
}

export function advice(id) {
  const apps = folderApps(id),
    sh = shuffle(apps),
    t = $(`#${CSS.escape(id)} .tbt`);
  const v = {
    carpeta: text(t).replace(/\.exe$/i, ""),
    n: apps.length,
    a1: sh[0] && sh[0].a,
    t1: sh[0] && sh[0].t,
    a2: sh[1] && sh[1].a,
    t2: sh[1] && sh[1].t,
  };
  let pair = null,
    vv = v;
  if (id === "favs")
    pair = apps.length ? pickFit(ADV.favsN, "adv:favsN", v) : KK.pick(ADV.favs0, "adv:favs0");
  else if (id === "news")
    pair = apps.length ? pickFit(ADV.newsN, "adv:newsN", v) : KK.pick(ADV.news0, "adv:news0");
  else if (id === "packs") pair = pickFit(ADV.packs, "adv:packs", v);
  else {
    const withTip = apps.filter((x) => x.tip),
      r = Math.random(),
      hand = ADV[id];
    if (withTip.length && r < 0.2) {
      const w = withTip[Math.floor(Math.random() * withTip.length)];
      vv = Object.assign({}, v, { a1: w.a, tip: w.tip });
      pair = pickFit(ADV.tipw, "adv:tipw", vv);
      if (!pair) vv = v;
    }
    if (!pair && hand && hand.length && r < 0.7) pair = KK.pick(hand, "adv:" + id);
    if (!pair && apps.length) pair = pickFit(ADV.gen, "adv:gen", v);
    if (!pair && hand && hand.length) pair = KK.pick(hand, "adv:" + id);
  }
  if (!pair) return null;
  return fill(pair, vv);
}

export async function ask(id) {
  closePop(true);
  if (!ready() || !foldIds().includes(id)) return false;
  const line = advice(id);
  if (!line) return false;
  const my = ++tok;
  KK.interrupt();
  K.tour = null;
  return KK.visitFolder(id, {
    line,
    p: 3,
    cat: "ui",
    always: true,
    replace: true,
    ttl: 15000,
    ctx: "advice",
    words: true /* pedir ayuda = permiso para hablar con texto, incluso en «calladita» */,

    onStart: () => {
      if (my === tok) record(id);
    },
  });
}

function record(id) {
  memoria.asked[id] = (memoria.asked[id] | 0) + 1;
  memoria.total = (memoria.total | 0) + 1;
  save();
  const ids = foldIds();
  KK.emit("advice", {
    id,
    n: memoria.asked[id],
    count: ids.filter((x) => memoria.asked[x]).length,
    total: ids.length,
  });
}

export function iniciar() {
  /* ---------- armar el consejo ---------- */

  /* una plantilla vale solo si todas sus variables tienen valor */

  /* ---------- pedir ayuda ---------- */
  tok = 0;
  askBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.detail > 0 && now() - abierto.at < 350) {
      e.preventDefault();
      return;
    } /* el dedo aún estaba levantándose: no cuenta */
    const id = abierto.id;
    if (id) ask(id);
  });
}
