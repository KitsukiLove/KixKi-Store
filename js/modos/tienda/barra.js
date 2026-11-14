/*
  Barra de herramientas, filtros y la sección «Para ti».
*/

import { guardar, leer } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { counters, emptyMsgs, haveSet } from "./avisos.js";
import { esc, texto, nm, origs, root } from "./comun.js";
import { EXT, stat } from "./datos.js";
import { ORD, sortApps } from "./orden.js";
import { INT, prof, TIPO } from "./perfil.js";
import { puente } from "./puente.js";
/* ---------- barra de herramientas + «Para ti» ---------- */
export function buildTools() {
  if ($("#kq-tools")) return;
  const anchor = $(".chips") || $("#searchbox");
  if (!anchor) return;
  const el = document.createElement("div");
  el.id = "kq-tools";
  el.className = "kq-tools";
  el.setAttribute("role", "group");
  el.innerHTML = `<label class="kq-lbl"><span id="kq-ol"></span><select id="kq-ord" class="kq-sel"></select></label>
    <button type="button" class="chip kq-t" id="kq-usable" aria-pressed="false" hidden></button>
    <button type="button" class="chip kq-t" id="kq-todo" aria-pressed="false"></button>
    <button type="button" class="chip kq-t" id="kq-prf"></button>`;
  anchor.insertAdjacentElement("afterend", el);
  const pt = document.createElement("section");
  pt.id = "parati";
  pt.className = "parati";
  pt.hidden = true;
  pt.setAttribute("aria-labelledby", "pt-h");
  el.insertAdjacentElement("afterend", pt);
  const ord = leer("kixki-ord", "orig");
  $("#kq-ord").value = ORD.includes(ord) ? ord : "orig";
  $("#kq-ord").addEventListener("change", (e) => {
    guardar("kixki-ord", e.target.value);
    sortApps(e.target.value);
  });
  $("#kq-usable").addEventListener("click", (e) => {
    const on = root.classList.toggle("kq-us");
    e.currentTarget.setAttribute("aria-pressed", on);
    emptyMsgs();
  });
  $("#kq-todo").addEventListener("click", (e) => {
    const on = root.classList.toggle("kq-td");
    e.currentTarget.setAttribute("aria-pressed", on);
    emptyMsgs();
  });
  $("#kq-prf").addEventListener("click", () => puente.openWizard());
  $("#parati").addEventListener("click", (e) => {
    if (e.target.closest("#pt-ed")) puente.openWizard();
    const o = e.target.closest("[data-open]");
    if (o && window.KX) KX.openWin(o.dataset.open);
  });
}

export function labels() {
  const ol = $("#kq-ol");
  if (ol) ol.textContent = texto("Orden", "Sort");
  const sel = $("#kq-ord");
  if (sel) {
    const sv = leer("kixki-ord", "orig"),
      v = sel.value || (ORD.includes(sv) ? sv : "orig");
    sel.innerHTML = [
      ["orig", texto("Original", "Original")],
      ["az", "A–Z"],
      ["stars", texto("Más estrellas ★", "Most stars ★")],
      ["fresh", texto("Más actualizadas", "Recently updated")],
    ]
      .map(([k, t]) => `<option value="${k}">${t}</option>`)
      .join("");
    sel.value = v || "orig";
  }
  const t = $("#kq-tools");
  if (t) t.setAttribute("aria-label", texto("Orden y filtros", "Sort and filters"));
  const u = $("#kq-usable");
  if (u) {
    u.textContent = texto("Solo las que puedo usar", "Only ones I can use");
    const p = prof();
    u.hidden = !(p && (p.a || p.p !== "si"));
    if (u.hidden && root.classList.contains("kq-us")) {
      root.classList.remove("kq-us");
      u.setAttribute("aria-pressed", "false");
    }
  }
  const pr = $("#kq-prf");
  if (pr)
    pr.textContent = prof()
      ? texto("Mis respuestas", "My answers")
      : texto("Conócenos 🐑", "Get to know me 🐑");
  const mi = $("#s-prf");
  if (mi) mi.textContent = texto("Mi perfil…", "My profile…");
  puente.axApply();
  puente.decoratePacks();
  counters();
}

export function recs(p) {
  const have = haveSet(),
    cats = new Set();
  const names = [];
  (p.i || []).forEach((k) => {
    const it = INT.find((x) => x[0] === k);
    if (it) {
      it[3].forEach((c) => cats.add(c));
      (it[4] || []).forEach((n) => names.push(n));
    }
  });
  const okApp = (a) => {
    const n = nm(a),
      x = EXT[n] || {};
    if (have.has(n)) return false;
    if (p.a && x.min && x.min > p.a) return false;
    if (x.priv && p.p !== "si") return false;
    return true;
  };
  const score = (a) => {
    const s = stat(a);
    return s ? s.s : 0;
  };
  const pool = origs().filter(okApp);
  const byCat = (c) =>
    pool.filter((a) => a.closest(".cat").id === c).sort((a, b) => score(b) - score(a));
  const out = [],
    per = {};
  const take = (a) => {
    const c = a.closest(".cat").id;
    if (out.includes(a) || (per[c] || 0) >= 2 || out.length >= 6) return;
    per[c] = (per[c] || 0) + 1;
    out.push(a);
  };
  if (p.t === "ini") byCat("tiendas").slice(0, 2).forEach(take);
  /* reparte por turnos entre las categorías elegidas */
  const lists = [...cats].map(byCat);
  if (names.length) lists.unshift(names.map((n) => pool.find((a) => nm(a) === n)).filter(Boolean));
  for (let r = 0; r < 2; r++)
    lists.forEach((l) => {
      if (l[r]) take(l[r]);
    });
  if (out.length < 3) byCat("tiendas").concat(byCat("importante")).forEach(take);
  return out;
}

export function renderParati() {
  const pt = $("#parati");
  if (!pt) return;
  const p = prof();
  if (!p) {
    pt.hidden = true;
    pt.innerHTML = "";
    return;
  }
  const list = recs(p);
  const ints = (p.i || [])
    .map((k) => {
      const it = INT.find((x) => x[0] === k);
      return it ? it[2][texto(0, 1)] : "";
    })
    .filter(Boolean);
  const sum =
    [
      texto("Soy ", "I'm ") + (TIPO[p.t] ? TIPO[p.t][texto(0, 1)] : "—"),
      p.a
        ? "Android " + p.a + (p.a >= 14 ? "+" : "")
        : texto("Android: no sé", "Android: not sure"),
      p.p === "si"
        ? texto("con root/Shizuku/ADB", "with root/Shizuku/ADB")
        : texto("sin root/Shizuku/ADB", "no root/Shizuku/ADB"),
    ].join(" · ") + (ints.length ? " · " + ints.join(", ") : "");
  pt.innerHTML = `<div class="pt-bar"><b id="pt-h">🐑 ${texto("Para ti", "For you")}</b></div><div class="pt-in"><p class="pt-s">${esc(sum)}</p>
    <div class="pt-l">${list.map((a) => `<button type="button" class="pt-go" data-go="${esc(nm(a))}">${esc(nm(a))}</button>`).join("")}${p.t === "ini" ? `<button type="button" class="pt-go pk" data-open="packs">🎁 ${texto("Pack «Para empezar»", "«Getting started» pack")}</button>` : ""}${puente
      .packsFor(p)
      .map(
        (k) =>
          `<button type="button" class="pt-go pk" data-guide="${esc(k)}">🧭 ${texto("Guíame: ", "Guide me: ")}${esc((puente.packEl(k).querySelector("h3") || {}).textContent || k)}</button>`
      )
      .join(
        ""
      )}${list.length ? "" : `<span class="pt-n">${texto("Con tus respuestas no encontré nada nuevo que sugerir.", "Nothing new to suggest with your answers.")}</span>`}</div>
    <button type="button" class="pt-ed" id="pt-ed">${texto("Cambiar mis respuestas", "Change my answers")}</button></div>`;
  pt.hidden = false;
}
