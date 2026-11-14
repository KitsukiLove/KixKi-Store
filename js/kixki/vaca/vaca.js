/*
  Dibujo y efectos de vaca.exe: sprite, globos, golpes, estrellitas, humo y deshacerse en píxeles.
*/

import { $, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { segunIdioma } from "./config.js";
import { viva } from "./estado.js";
let sayT;

const SPR = 124;

/* tamaño del dibujo en pantalla */
export function buildCow(x, y) {
  viva.cowEl = document.createElement("div");
  viva.cowEl.id = "kv-cow";
  viva.cowEl.className = "kv-cow emerge";
  viva.cowEl.setAttribute("aria-hidden", "true");
  viva.cowEl.innerHTML = `<div class="kv-say" hidden></div><div class="kv-mini"></div><div class="kv-sp"><img class="kv-img" src="img/vaca/vaca-jefa.gif" width="${SPR}" height="${SPR}" alt=""><i class="kv-weak"></i></div><i class="kv-rg">💢</i>`;
  if (RM()) $(".kv-img", viva.cowEl).src = "img/vaca/vaca-jefa.png";
  document.body.append(viva.cowEl);
  place(x, y, 1, 0);
}

export function place(x, y, dir, bob) {
  viva.cowEl.style.transform = `translate3d(${Math.round(x - SPR / 2)}px,${Math.round(y - SPR - (bob || 0))}px,0)`;
  if (viva.cowEl._d !== dir) {
    viva.cowEl._d = dir;
    viva.cowEl.style.setProperty("--d", dir);
  }
}

export function cowSay(pair) {
  if (!viva.cowEl) return;
  const b = $(".kv-say", viva.cowEl);
  if (!b) return;
  b.textContent = segunIdioma(pair);
  b.hidden = false;
  clearTimeout(sayT);
  sayT = setTimeout(
    () => {
      b.hidden = true;
    },
    RM() ? 1800 : 2300
  );
}

export function fx(kind, x, y, text) {
  const e = document.createElement("i");
  e.className = "kv-fx " + kind;
  e.style.left = Math.round(x) + "px";
  e.style.top = Math.round(y) + "px";
  if (text) e.textContent = text;
  document.body.append(e);
  setTimeout(() => e.remove(), RM() ? 700 : 1000);
}

export function stars(x, y, n) {
  if (RM()) {
    fx("st", x, y, "✦");
    return;
  }
  for (let i = 0; i < n; i++) {
    const e = document.createElement("i");
    e.className = "kv-star";
    e.textContent = ["✦", "★", "✧"][i % 3];
    e.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;--dx:${Math.round(rnd(-46, 46))}px;--dy:${Math.round(rnd(-58, -14))}px`;
    document.body.append(e);
    setTimeout(() => e.remove(), 800);
  }
}

export function poof(x, y) {
  if (RM()) return;
  fx("poof", x, y);
}

export function shatter(r) {
  const cols = 4,
    rows = 4,
    w = r.width / cols,
    h = r.height / rows;
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const e = document.createElement("i");
      e.className = "kv-shard" + (j === 0 ? " bar" : "");
      e.style.cssText = `left:${Math.round(r.left + i * w)}px;top:${Math.round(r.top + j * h)}px;width:${Math.ceil(w)}px;height:${Math.ceil(h)}px;--dx:${Math.round((i - 1.5) * rnd(40, 80))}px;--dy:${Math.round(rnd(60, 240))}px;--r:${Math.round(rnd(-160, 160))}deg`;
      document.body.append(e);
      setTimeout(() => e.remove(), 1200);
    }
}

export function pixelBurst(x, y) {
  const cols = ["#14101f", "#ffffff", "#ff9fd0", "#ffd23a", "#9be37a", "#14101f"];
  const n = RM() ? 10 : 34;
  for (let i = 0; i < n; i++) {
    const e = document.createElement("i");
    e.className = "kv-px";
    const a = rnd(0, 6.283),
      d = rnd(40, 150);
    e.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;background:${cols[i % cols.length]};--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d - 40)}px`;
    document.body.append(e);
    setTimeout(() => e.remove(), 1300);
  }
}

export function iniciar() {
  /* ---------- la vaca ---------- */

  sayT = 0;
}
