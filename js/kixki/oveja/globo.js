/*
  Globo de diálogo: registro de depuración (KXK.timeline), maquetación del globo, efecto de escritura, cola de frases y say().
*/

import { clamp, now, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { bub, el, gh, sr, vi } from "./elemento.js";
import { cd, face, frame, K, Q, recent, RECN, saveRec, setMode, V } from "./estado.js";
import { S } from "./memoria.js";
import { blocked, busy, registrar } from "./modos.js";
import { DLG, geo, stopMove } from "./movimiento.js";
import { puente } from "./puente.js";
import { EMO } from "./textos.js";
import { ctxVars, fmt, texto } from "./utilidades.js";

let bw, bh, flushT;

const lb = { l: null, t: null, b: null };

const PUN = /[.,!?…:;]/;

export const beep = (f) => {
  if (window.KXS)
    try {
      KXS.beep(f, 0.03);
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
};

const spent = () => {
  const t = now();
  DLG.sp = DLG.sp.filter((x) => t - x < DLG.win);
  return DLG.sp.length >= DLG.budget;
};

const EKEY = [
  [/^k3(grab|many|long)/, "grab"],
  [/^k3hold/, "held"],
  [/^k3shake/, "shake"],
  [/^k3th/, "fly"],
  [/^k3land/, "placed"],
  [/^k3(drop|madtap)/, "mad"],
  [/^k3pr/, "pr"],
  [/^(search|focus)/, "search"],
  [/^fav/, "fav"],
  [/^theme/, "theme"],
  [/^bg/, "bg"],
  [/^mus/, "music"],
  [/^gstart/, "gstart"],
  [/^grec/, "grec"],
  [/^gover/, "gover"],
  [/^fold:/, "folder"],
  [/^fast-dl/, "dl"],
  [/^fast-src/, "src"],
  [/^manywin/, "wins"],
  [/^back/, "back"],
  [/^lang/, "lang"],
  [/^modemsg/, "mode"],
  [/^hk/, "hk"],
  [/^zz-/, "sleep"],
  [/^bkclose/, "bkEnd"],
  [/^bkunlock/, "big"],
];

const kindOf = (o) => {
  const k = o.key || "";
  for (const [re, v] of EKEY) if (re.test(k)) return v;
  return (o.p || 1) >= 3 ? "big" : "ui";
};

const LETTERS = /\p{L}/u;

export const emo = (kind, o) =>
  say(
    pick(EMO[kind] || EMO.ui, "emo-" + kind),
    Object.assign({ p: 1, micro: true, always: true, nogap: true, cd: 0, replace: true }, o)
  );

const idOf = (m) => (Array.isArray(m) ? m[0] : m.t[0]);

function measure() {
  bw = bub.offsetWidth;
  bh = bub.offsetHeight;
  lb.l = lb.t = lb.b = null;
}

export function layoutBubble() {
  if (bub.hidden) return;
  if (!bw) measure();
  const hx = K.x + K.dir * 16,
    left = clamp(hx - bw / 2, 8, Math.max(8, innerWidth - 8 - bw));
  const l = Math.round(left - K.x),
    t = Math.round(clamp(hx - left, 16, bw - 16)),
    b = K.y - 45 - 14 - bh < 6;
  if (l !== lb.l) {
    lb.l = l;
    bub.style.left = l + "px";
  }
  if (t !== lb.t) {
    lb.t = t;
    bub.style.setProperty("--tx", t + "px");
  }
  if (b !== lb.b) {
    lb.b = b;
    bub.classList.toggle("below", b);
  }
}

function begin(m) {
  V.cur = m;
  K.talking = true;
  stopMove();
  clearTimeout(m.tq);
  if (m.key) cd[m.key] = now() + m.cdMs; /* el enfriamiento se gasta aquí, no antes */
  if (m.cat === "sp") DLG.sp.push(now());
  DLG.last[m.cat] = now();
  if (K.mode === "sleep") frame("idle");
  setMode("talk");
  const g = geo(K.stage);
  if (g && g.face) face(g.face);
  if (m.hl) {
    K.hl = m.hl;
    m.hl.classList.add("kk-pt");
  }
  bub.classList.toggle("mic", !!m.micro);
  gh.textContent = m.text;
  vi.textContent = "";
  bub.hidden = false;
  if (m.sr) sr.textContent = m.text;
  measure();
  layoutBubble();
  registrar("begin", m, Math.round(performance.now() - m.t0));
  if (m.onStart)
    try {
      m.onStart();
    } catch (e) {
      // Adorno opcional: su fallo no debe romper lo demás.
    }
  const cs = Array.from(m.text),
    n = cs.length,
    hurry = m.instant || Q.length > 0;
  m.cs = cs;
  m.i = 0;
  if (RM() || !n) {
    m.i = n;
    vi.textContent = m.text;
    typed(m);
    return;
  }
  if (m.instant) {
    /* con prisa: la frase entera de golpe, con un parpadeo de boca */
    m.i = n;
    vi.textContent = m.text;
    frame(m.mood === "happy" ? "happy" : "talk");
    beep(620);
    m.t = setTimeout(() => typed(m), 180);
    return;
  }
  const spd = hurry ? 8 : 14;
  const step = () => {
    if (V.cur !== m) return;
    if (m.i >= n) {
      vi.textContent = m.text;
      typed(m);
      return;
    }
    const ch = cs[m.i++];
    vi.textContent = cs.slice(0, m.i).join("");
    if (ch !== " ") {
      frame(m.i % 6 < 3 ? "talk" : m.mood === "happy" ? "happy" : "idle");
      if (m.i % 3 === 0) beep(500 + ((m.i * 37) % 240));
    }
    /* pausa corta solo al final de una oración o cláusula: nunca por cada signo repetido («…», «?!») */
    let w = spd;
    if (PUN.test(ch) && cs[m.i] === " ")
      w = /[.!?…]/.test(ch) ? (hurry ? 40 : 90) : hurry ? 20 : 50;
    m.t = setTimeout(step, w);
  };
  step();
}

/* mostrar la frase entera ya (clic en el globo mientras escribe) */
export function finishTyping(m) {
  if (V.cur !== m || !m.cs || m.i >= m.cs.length) return false;
  clearTimeout(m.t);
  m.i = m.cs.length;
  vi.textContent = m.text;
  typed(m);
  return true;
}

function typed(m) {
  if (V.cur !== m) return;
  registrar("typed", m, Math.round(performance.now() - m.t0));
  frame(m.mood === "happy" ? "happy" : "idle");
  if (m.mood === "happy" && !RM()) el.classList.add("kk-cheer");
  m.t = setTimeout(
    () => done(m, "auto"),
    m.micro
      ? clamp(700 + m.text.length * 60, 900, 1400)
      : m.cat === "ev"
        ? clamp(1800 + m.text.length * 40, 2600, 6000)
        : clamp(2200 + m.text.length * 50, 3200, 9500)
  );
}

function teardown(c) {
  clearTimeout(c.t);
  V.cur = null;
  K.talking = false;
  bub.hidden = true;
  K.endAt = now();
  if (K.hl) {
    K.hl.classList.remove("kk-pt");
    K.hl = null;
  }
  if (K.mode === "talk") setMode("idle");
  frame("idle");
  el.classList.remove("kk-cheer");
}

export function done(m, how) {
  if (V.cur !== m) return;
  teardown(m);
  registrar("done", m, how);
  if (how === "user") {
    if (++K.dis >= 3) {
      K.dis = 0;
      V.nextChat = now() + 120000;
    }
  } else K.dis = 0;
  m.res(true);
  /* un respiro entre un globo y el siguiente: si cierras el globo tú, enseguida; si se cierra solo, una pausa visible */
  setTimeout(flushQ, how === "user" ? 140 : 420);
  puente.brain(rnd(1800, 3800));
}

export function clearQ(ctx) {
  for (let i = Q.length - 1; i >= 0; i--) {
    const q = Q[i];
    if (ctx && q.ctx !== ctx) continue;
    Q.splice(i, 1);
    clearTimeout(q.tq);
    registrar("drop", q, "clear");
    q.res(false);
  }
}

export function interrupt(ctx) {
  const c = V.cur;
  if (c) {
    teardown(c);
    registrar("stop", c, "interrupt");
    c.res(false);
  }
  clearQ(ctx);
}

function enq(m) {
  Q.push(m);
  registrar("queue", m, Q.length);
  m.tq = setTimeout(() => {
    const i = Q.indexOf(m);
    if (i < 0) return;
    Q.splice(i, 1);
    registrar("drop", m, "ttl");
    m.res(false);
  }, m.ttl);
}

function flushQ() {
  if (K.talking || K.off || K.mode === "hop") return;
  while (Q.length) {
    let bi = -1;
    for (let i = 0; i < Q.length; i++)
      if (!blocked(Q[i]) && (bi < 0 || Q[i].p > Q[bi].p))
        bi = i; /* la de más prioridad; a igualdad, la más antigua */
    if (bi < 0) {
      clearTimeout(flushT);
      flushT = setTimeout(flushQ, 600);
      return;
    } /* todas esperan a que dejes de escribir/arrastrar */
    const m = Q.splice(bi, 1)[0];
    clearTimeout(m.tq);
    if (m.key && (cd[m.key] || 0) > now()) {
      registrar("drop", m, "cd");
      m.res(false);
      continue;
    }
    begin(m);
    return;
  }
}

function wordsGate(msg, o) {
  if (S.mode !== "quiet" || o.words || o.micro) return [msg, o];
  let kind = typeof o.emo === "string" ? o.emo : "";
  if (!kind) {
    if (o.cat === "sp" || o.cat === "amb" || o.opt || (!o.cat && (o.p || 1) < 2))
      return null; /* espontánea o de ambiente: en silencio */
    kind = kindOf(o);
  }
  return [
    pick(EMO[kind] || EMO.ui, "emo-" + kind),
    Object.assign({}, o, { emoji: true, opt: false }),
  ];
}

export function say(msg, o = {}) {
  return new Promise((res) => {
    const gt = wordsGate(msg, o);
    if (!gt) {
      registrar("reject", { id: ++V.mid, cat: o.cat, p: o.p, key: o.key, text: "" }, "quiet");
      res(false);
      return;
    }
    msg = gt[0];
    o = gt[1];
    /* una clave con varias frases (lista de pares): elige una sin repetir las recientes */
    if (Array.isArray(msg) && Array.isArray(msg[0])) msg = pick(msg, "l-" + (o.key || "x"));
    const mic = !!o.micro,
      p = o.p || 1,
      cat = o.cat || (mic ? "mic" : p === 1 ? "amb" : "ui"),
      ev = cat === "ev",
      em = !!o.emoji;
    const m = {
      id: ++V.mid,
      text: (() => {
        const raw = texto(msg);
        return fmt(raw, ctxVars(raw, o.vars));
      })(),
      p,
      cat,
      ctx: o.ctx || cat,
      key: o.key,
      cdMs: o.cd || 0,
      mood: o.mood,
      hl: o.hl,
      sr: p > 1 && !mic && !em,
      res,
      micro: mic || em,
      opt: !!o.opt,
      always: !!o.always,
      words: !!o.words,
      ttl: o.ttl != null ? o.ttl : mic ? 300 : em ? (ev ? 600 : 2500) : ev ? 600 : 12000,
      instant: o.instant != null ? !!o.instant : ev || mic || em,
      replace: o.replace != null ? !!o.replace : ev,
      t0: performance.now(),
      onStart: o.onStart,
    };
    const no = (why) => {
      registrar("reject", m, why);
      res(false);
    };
    if ((!S.on && !o.zz) || K.off || (!K.ready && !o.force)) return no("off");
    /* red de seguridad: en «calladita» no sale ningún texto con letras si no la tocaron ni le pidieron ayuda */
    if (S.mode === "quiet" && !m.words && LETTERS.test(m.text)) return no("quiet-words");
    if (m.key && (cd[m.key] || 0) > now()) return no("cd");
    if (blocked(m)) return no(busy() ? "busy-user" : "quiet");
    if (mic && K.mode === "hop") return no("hop");
    const gp = DLG.gap[cat];
    if (gp && !o.nogap && now() - (DLG.last[cat] || 0) < gp)
      return no(
        "cat-cd"
      ); /* nogap: un evento físico (soltarla) no espera a la pausa entre micros */
    if (cat === "sp" && spent()) return no("budget");
    registrar("req", m);
    if (K.talking) {
      if (m.replace || p > V.cur.p) {
        const c = V.cur;
        teardown(c);
        registrar("stop", c, "replaced");
        c.res(false);
        begin(m);
      } else if (p >= 2 && Q.length < 4 && !(m.key && Q.some((q) => q.key === m.key))) enq(m);
      else no("busy");
      return;
    }
    if (K.mode === "hop") {
      if (Q.length < 4) enq(m);
      else no("full");
      return;
    }
    begin(m);
  });
}

export function pick(list, key) {
  const ok = list.filter((m) => !recent.includes(key + ":" + idOf(m))),
    pool = ok.length ? ok : list,
    m = pool[Math.floor(Math.random() * pool.length)];
  recent.push(key + ":" + idOf(m));
  if (recent.length > RECN) recent.shift();
  saveRec();
  return m;
}

puente.layoutBubble = layoutBubble;

puente.flushQ = flushQ;

puente.interrupt = interrupt;

puente.done = done;

export function iniciar() {
  /* tamaño del globo: se mide UNA vez por frase (no en cada fotograma); el texto fantasma reserva el sitio entero */
  bw = 0;
  bh = 0;

  addEventListener("resize", () => {
    bw = 0;
  });

  flushT = 0;

  /* ---------- (parte 4b) modo «calladita»: SOLO EMOJIS ----------
     En «calladita» ningún globo lleva texto salvo que (a) la toquen o (b) le pidan ayuda (words:true en say()).
     Lo demás: las frases espontáneas y de ambiente se descartan; las respuestas a lo que haces (agarrar, lanzar, buscar,
     juegos, logros, eventos especiales…) se cambian por un emoji de la situación (EMO.<situación>, en dialogs.js).
     Con emo:"kind" el sitio que llama dice qué emoji quiere; si no, se deduce de la clave (EKEY). */
}
