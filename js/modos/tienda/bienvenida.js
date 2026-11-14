/*
  Ventana de bienvenida con 4 preguntas y su asistente paso a paso.
*/

import { guardar } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { decorate, haveSet } from "./avisos.js";
import { labels, renderParati } from "./barra.js";
import { texto, root, toast } from "./comun.js";
import { INT, PRF, prof } from "./perfil.js";
import { puente } from "./puente.js";
let STEPS, W, wi, talkT;

function sheepPic() {
  /* la carita de Kixki: se copia de la Kixki de verdad (sus dibujos en vivo); si no está, una ovejita de emoji */
  const f = $("#kixki .kk-flip svg.f-idle"),
    t = $("#kixki .kk-flip svg.f-talk");
  const cp = (n, c) => {
    if (!n) return "";
    const k = n.cloneNode(true);
    k.setAttribute("class", "kq-f " + c);
    k.removeAttribute("width");
    k.removeAttribute("height");
    return k.outerHTML;
  };
  return f ? cp(f, "i") + cp(t || f, "t") : '<span class="kq-emo">🐑</span>';
}

export function talk() {
  const pic = $("#kq .kq-pic");
  if (!pic || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  clearInterval(talkT);
  let n = 0;
  pic.classList.add("say");
  talkT = setInterval(() => {
    pic.classList.toggle("say");
    if (++n >= 7) {
      clearInterval(talkT);
      pic.classList.remove("say");
    }
  }, 140);
}

export function ensureWizard() {
  let o = $("#kq");
  if (o) return o;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="kq" class="ovl" hidden><div class="box kq" role="dialog" aria-modal="true" aria-labelledby="kq-t"><div class="kq-pic" aria-hidden="true">${sheepPic()}</div><div class="kq-bub"><span class="kk-nm" id="kq-t"></span><button type="button" class="x" data-x="kq"></button><div id="kq-b" class="kq-b0"></div><svg class="kk-tl kq-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div></div></div>`
  );
  o = $("#kq");
  /* si se cierra sin terminar (✕, Escape o tocar fuera), no se vuelve a preguntar */
  new MutationObserver(() => {
    root.classList.toggle("kq-on", !o.hidden);
    const wasG = !!puente.viva.G;
    if (o.hidden) puente.viva.G = null;
    if (o.hidden && !PRF() && !wasG) guardar("kixki-perfil", { v: 1, skip: 1 });
    if (o.hidden) {
      decorate();
      renderParati();
      labels();
    }
  }).observe(o, { attributes: true, attributeFilter: ["hidden"] });
  return o;
}

export function openWizard() {
  const o = ensureWizard(),
    p = prof() || {};
  puente.viva.G = null;
  W = {
    t: p.t || null,
    p: p.p || null,
    a: p.a == null ? null : p.a,
    i: Array.isArray(p.i) ? p.i.slice() : [],
  };
  wi = 0;
  o.hidden = false;
  stepView();
}

export function stepView() {
  const s = STEPS[wi],
    b = $("#kq-b"),
    x = $("#kq .x");
  $("#kq-t").textContent = texto("Kixki te pregunta", "Kixki asks you");
  x.setAttribute("aria-label", texto("Cerrar", "Close"));
  x.textContent = "✕";
  const cur = W[s.k],
    sel = (v) => (s.multi ? W.i.includes(v) : cur != null && String(cur) === String(v));
  b.innerHTML = `<p class="kq-n">${texto("Pregunta", "Question")} ${wi + 1} / ${STEPS.length}</p>
    <h2 class="kq-q" id="kq-q" tabindex="-1">${s.q[texto(0, 1)]}</h2><p class="kq-note">${s.note[texto(0, 1)]}</p>
    <div class="kq-opts${s.grid ? " g" : ""}${s.multi ? " m" : ""}" role="${s.multi ? "group" : "radiogroup"}" aria-labelledby="kq-q">${s.opts.map(([v, e, lab, sub]) => `<button type="button" class="btn kq-o${sel(v) ? " p" : ""}" data-v="${v}" ${s.multi ? "aria-pressed" : "aria-checked"}="${sel(v)}" role="${s.multi ? "button" : "radio"}">${e ? `<span class="kq-e" aria-hidden="true">${e}</span>` : ""}<span class="kq-tx">${lab[texto(0, 1)]}${sub ? `<small>${sub[texto(0, 1)]}</small>` : ""}</span></button>`).join("")}</div>
    <div class="kq-nav">${wi ? `<button type="button" class="btn kq-back">← ${texto("Atrás", "Back")}</button>` : `<button type="button" class="btn kq-skip">${texto("Saltar", "Skip")}</button>`}${s.multi ? `<button type="button" class="btn p kq-done">${texto("Listo", "Done")} ✓</button>` : cur != null ? `<button type="button" class="btn p kq-next">${texto("Siguiente", "Next")} →</button>` : ""}</div>`;
  const q = $("#kq-q");
  if (q) q.focus({ preventScroll: true });
  talk();
}

function finish() {
  guardar("kixki-perfil", {
    v: 1,
    t: W.t || "dia",
    p: W.p || "?",
    a: W.a || 0,
    i: W.i,
    ts: Date.now(),
  });
  $("#kq").hidden = true;
  toast(texto("¡Listo! Preparé «Para ti» 🐑", "Done! I prepared «For you» 🐑"));
}

puente.openWizard = openWizard;

export function iniciar() {
  /* ---------- ventana de bienvenida (4 preguntas) ---------- */
  STEPS = [
    {
      k: "t",
      q: ["¿Cómo te describes?", "How would you describe yourself?"],
      note: ["Así sé cuánto explicarte.", "So I know how much to explain."],
      opts: [
        [
          "ini",
          "🌱",
          ["Estoy empezando", "I'm just starting"],
          ["Quiero lo básico, fácil de usar", "I want the basics, easy to use"],
        ],
        [
          "dia",
          "📱",
          ["Uso mi celular a diario", "I use my phone every day"],
          ["Sé instalar apps y cambiar ajustes", "I can install apps and change settings"],
        ],
        [
          "pro",
          "🛠️",
          ["Me gusta trastear", "I like to tinker"],
          ["No me asustan los permisos ni los comandos", "Permissions and commands don't scare me"],
        ],
      ],
    },
    {
      k: "p",
      q: ["¿Tienes root, Shizuku o usas ADB?", "Do you have root, Shizuku, or use ADB?"],
      note: [
        "Son herramientas que dan permisos extra a algunas apps. Si no sabes qué son, responde «No sé»: no pasa nada.",
        "Tools that give some apps extra permissions. If you don't know what they are, answer «Not sure»: that's fine.",
      ],
      opts: [
        ["si", "✅", ["Sí, algo de eso", "Yes, some of that"]],
        ["no", "❌", ["No, nada de eso", "No, none of that"]],
        ["?", "🤷", ["No sé qué es", "Not sure"]],
      ],
    },
    {
      k: "a",
      q: ["¿Qué versión de Android tiene tu celular?", "Which Android version is your phone on?"],
      note: ["La ves en Ajustes → Acerca del teléfono.", "See it in Settings → About phone."],
      grid: 1,
      opts: [
        [7, "", ["Android 7 o menos", "Android 7 or lower"]],
        [8, "", ["Android 8", "Android 8"]],
        [9, "", ["Android 9", "Android 9"]],
        [10, "", ["Android 10", "Android 10"]],
        [11, "", ["Android 11", "Android 11"]],
        [12, "", ["Android 12", "Android 12"]],
        [13, "", ["Android 13", "Android 13"]],
        [14, "", ["Android 14 o más", "Android 14 or higher"]],
        [0, "🤷", ["No sé", "Not sure"]],
      ],
    },
    {
      k: "i",
      multi: 1,
      q: ["¿Qué te interesa?", "What are you into?"],
      note: ["Elige las que quieras, o ninguna.", "Pick any, or none."],
      opts: INT.map((x) => [x[0], x[1], x[2]]),
    },
  ];
  W = null;
  wi = 0;
  talkT = 0;
  document.addEventListener("click", (e) => {
    const gd = e.target.closest("[data-guide]");
    if (gd) {
      const sm = $("#sm");
      if (sm) sm.hidden = true;
      puente.openGuide(gd.dataset.guide);
      return;
    }
    if (e.target.closest("#kq .kg-next")) {
      puente.viva.G.i++;
      puente.guideView();
      return;
    }
    if (e.target.closest("#kq .kg-back")) {
      puente.viva.G.i = Math.max(0, Math.min(puente.viva.G.i, puente.viva.G.items.length) - 1);
      puente.guideView();
      return;
    }
    if (e.target.closest("#kq .kg-end")) {
      $("#kq").hidden = true;
      return;
    }
    const gh = e.target.closest("#kq .kg-have");
    if (gh && puente.viva.G) {
      const n = gh.dataset.n,
        set = haveSet();
      if (!set.has(n)) {
        set.add(n);
        puente.viva.G.got++;
      }
      guardar("kixki-have", [...set]);
      decorate();
      puente.viva.G.i++;
      puente.guideView();
      return;
    }
    const ac = e.target.closest("#s-fs,#s-hc");
    if (ac) {
      puente.axClick(ac.id);
      return;
    }
    const o = e.target.closest("#kq .kq-o");
    if (o) {
      const s = STEPS[wi],
        v = o.dataset.v;
      if (s.multi) {
        const i = W.i.indexOf(v);
        i < 0 ? W.i.push(v) : W.i.splice(i, 1);
        o.classList.toggle("p");
        o.setAttribute("aria-pressed", W.i.includes(v));
      } else {
        W[s.k] = s.k === "a" ? +v : v;
        if (wi < STEPS.length - 1) {
          wi++;
          stepView();
        }
      }
      return;
    }
    if (e.target.closest("#kq .kq-next")) {
      wi = Math.min(wi + 1, STEPS.length - 1);
      stepView();
      return;
    }
    if (e.target.closest("#kq .kq-back")) {
      wi = Math.max(0, wi - 1);
      stepView();
      return;
    }
    if (e.target.closest("#kq .kq-skip")) {
      guardar("kixki-perfil", { v: 1, skip: 1 });
      $("#kq").hidden = true;
      return;
    }
    if (e.target.closest("#kq .kq-done")) {
      finish();
      return;
    }
    if (e.target.closest("#s-prf")) {
      const sm = $("#sm");
      if (sm) sm.hidden = true;
      openWizard();
      return;
    }
    /* ya la tengo */
    const h = e.target.closest(".kq-have");
    if (h) {
      const n = h.dataset.n,
        set = haveSet();
      set.has(n) ? set.delete(n) : set.add(n);
      guardar("kixki-have", [...set]);
      decorate();
      renderParati();
      toast(
        set.has(n)
          ? texto("Marcada: ya la tienes ✓", "Marked: you have it ✓")
          : texto("Desmarcada", "Unmarked")
      );
      return;
    }
    /* copiar enlace */
    const l = e.target.closest(".kq-link");
    if (l) {
      const u = location.origin + location.pathname + "#app=" + encodeURIComponent(l.dataset.n);
      const ok = () => toast(texto("Enlace copiado ✓", "Link copied ✓")),
        bad = () =>
          toast(
            texto("No se pudo copiar. Cópialo a mano:", "Couldn't copy. Copy it by hand: ") + u
          );
      try {
        navigator.clipboard.writeText(u).then(ok, bad);
      } catch (x) {
        bad();
      }
      return;
    }
  });
}
