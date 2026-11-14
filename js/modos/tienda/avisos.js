/*
  Avisos en cada app, botones «Ya la tengo» y «Copiar enlace», contadores y mensajes de lista vacía.
*/

import { leer } from "../../core/store.js";
import { $, $$ } from "../../core/util.js";
import { esc, texto, nm, origs, root } from "./comun.js";
import { EXT } from "./datos.js";
import { prof } from "./perfil.js";

export const haveSet = () => new Set(leer("kixki-have", []));

export function decorate() {
  const p = prof(),
    have = haveSet();
  $$("#app .cat .app").forEach((a) => {
    const n = nm(a);
    if (!n || !a.querySelector(".star")) return;
    const x = EXT[n];
    a.classList.toggle("have", have.has(n));
    a.classList.remove("nope");
    const old = a.querySelector(".kq-bd");
    if (old) old.remove();
    const bd = [];
    if (p && x) {
      if (x.min && p.a && x.min > p.a) {
        bd.push(["warn", texto("Pide Android " + x.min + "+", "Needs Android " + x.min + "+")]);
        a.classList.add("nope");
      }
      if (x.priv && p.p !== "si")
        bd.push(["info", texto("Necesita Shizuku, root o ADB", "Needs Shizuku, root or ADB")]);
    }
    if (bd.length) {
      const el = document.createElement("div");
      el.className = "kq-bd";
      el.innerHTML = bd.map(([c, t]) => `<span class="kq-b ${c}">${t}</span>`).join("");
      (a.querySelector(".bdg") || a.querySelector(".line")).after(el);
    }
    let row = a.querySelector(".kq-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "kq-row";
      row.innerHTML = `<button type="button" class="kq-have" data-n="${esc(n)}" aria-pressed="false"></button><button type="button" class="kq-link" data-n="${esc(n)}"></button>`;
      const lk = a.querySelector(".links");
      if (lk) lk.before(row);
      else a.querySelector(".info").append(row);
    }
    const hb = row.querySelector(".kq-have"),
      on = have.has(n);
    hb.setAttribute("aria-pressed", on);
    hb.textContent = on
      ? texto("✓ Ya la tengo", "✓ Got it")
      : texto("＋ Ya la tengo", "＋ I have it");
    hb.setAttribute("aria-label", texto("Ya la tengo: ", "I have it: ") + n);
    const lb = row.querySelector(".kq-link");
    lb.textContent = texto("🔗 Enlace", "🔗 Link");
    lb.setAttribute("aria-label", texto("Copiar enlace a ", "Copy link to ") + n);
    const sb = a.querySelector(".star");
    if (sb) sb.setAttribute("aria-label", texto("Favorita: ", "Favorite: ") + n);
  });
  counters();
  emptyMsgs();
}

export function counters() {
  const td = $("#kq-todo");
  if (!td) return;
  const all = origs().length,
    have = haveSet(),
    mine = origs().filter((a) => have.has(nm(a))).length;
  td.textContent = texto(`Me faltan (${all - mine})`, `Missing (${all - mine})`);
}

export function emptyMsgs() {
  const us = root.classList.contains("kq-us"),
    td = root.classList.contains("kq-td");
  $$("#app .cat:not(#favs):not(#news):not(#packs)").forEach((s) => {
    const vis = [...s.querySelectorAll(".app")].filter(
      (a) => !(us && a.classList.contains("nope")) && !(td && a.classList.contains("have"))
    ).length;
    let m = s.querySelector(".kq-none");
    if (!vis && (us || td)) {
      if (!m) {
        m = document.createElement("p");
        m.className = "kq-none";
        s.querySelector(".panel").append(m);
      }
      m.textContent = texto("Ninguna app con este filtro 🐑", "No apps match this filter 🐑");
    } else if (m) m.remove();
  });
  dispatchEvent(new Event("resize")); /* app.js recalcula «Leer más» al volver a ver tarjetas */
}

export function iniciar() {
  /* ---------- avisos en cada app + botones «Ya la tengo» y «Copiar enlace» ---------- */
}
