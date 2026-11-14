/*
  Charla de Kixki con la ovejita: reproduce un guion, muestra su globo y reacciona a toques.
*/

import {
  $,
  clamp,
  idioma as lang,
  now,
  reducirMovimiento as RM,
  rnd,
  wait,
} from "../../core/util.js";
import { sweep } from "./anuncios.js";
import { pb, pbG, pbNm, pbV, petWrap, say } from "./avisos.js";
import { fmt, isPC, K, KK, rainOn, S, tx, viva } from "./base.js";
import { petEl, petPi, PETS } from "./consejos.js";
import { ctx } from "./contexto.js";
import { count, inc, NV, save } from "./estado.js";
import { pickScript } from "./guiones.js";
import { PET_NAME } from "./iconos.js";
import { petBox, petSide } from "./ovejita.js";
import { puente } from "./puente.js";
export let pcur;

let tapTimes, lastTickle;

export function playout() {
  if (pb.hidden) return;
  const r = petBox();
  if (!r) return;
  const head = r.left + r.width * (viva.petFacing > 0 ? 0.74 : 0.26);
  petWrap.style.transform = `translate3d(${Math.round(head)}px,${Math.round(r.bottom)}px,0)`;
  const bw = pb.offsetWidth,
    bh = pb.offsetHeight,
    left = clamp(head - bw / 2, 8, Math.max(8, innerWidth - 8 - bw));
  pb.style.left = left - head + "px";
  pb.style.setProperty("--tx", clamp(head - left, 16, bw - 16) + "px");
  pb.classList.toggle("below", r.bottom - 45 - 14 - bh < 6);
}

function pdone(m, how) {
  if (!m || pcur !== m) return;
  clearTimeout(m.t);
  pcur = null;
  pb.hidden = true;
  const p = petEl();
  if (p) p.classList.remove("kq-talk");
  m.res(true);
}

export function pint() {
  if (!pcur) return;
  const m = pcur;
  clearTimeout(m.t);
  pcur = null;
  pb.hidden = true;
  const p = petEl();
  if (p) p.classList.remove("kq-talk");
  m.res(false);
}

export function petSay(msg, vars, o) {
  return new Promise((res) => {
    pint();
    const text = fmt(tx(msg), vars),
      m = { text, res, t: 0 };
    pcur = m;
    pbNm.textContent = tx(PET_NAME);
    pbG.textContent = text;
    pbV.textContent = "";
    pb.hidden = false;
    playout();
    say(tx(PET_NAME) + ": " + text);
    const p = petEl(),
      night = KK.dark();
    if (p && !night && !RM()) p.classList.add("kq-talk");
    if (window.KXS && !night)
      try {
        KXS.baa();
      } catch (e) {
        // El sonido es opcional: si el audio aún no está listo se omite.
      }
    let i = 0;
    const n = text.length,
      spd = RM() ? 0 : 26;
    const step = () => {
      if (pcur !== m) return;
      if (!spd || i >= n) {
        pbV.textContent = text;
        m.t = setTimeout(
          () => pdone(m, "auto"),
          (o && o.ms) || clamp(2300 + text.length * 52, 3300, 9500)
        );
        if (p) p.classList.remove("kq-talk");
        return;
      }
      const ch = text[i];
      i++;
      pbV.textContent = text.slice(0, i);
      if (ch !== " " && i % 3 === 0 && window.KXS)
        try {
          KXS.beep(620 + ((i * 41) % 260), 0.03);
        } catch (e) {
          // El sonido es opcional: si el audio aún no está listo se omite.
        }
      m.t = setTimeout(step, /[.,!?…]/.test(ch) ? 170 : spd);
    };
    step();
  });
}

export async function petChat(kind) {
  if (viva.chatting || viva.fireOn || !isPC() || !KK.ready || !S.on || K.off) return false;
  if (kind === "auto" && (K.tour || K.talking || K.mode !== "idle" || KK.mode === "quiet"))
    return false; /* (4b) «calladita»: sin visitas espontáneas */
  if (!petBox()) return false;
  viva.chatting = true;
  viva.nextVisit = now() + rnd(100000, 190000);
  const tok = {};
  K.tour =
    tok; /* mientras charla, el cerebro de Kixki no la manda a otro sitio; si el visitante hace algo, la parte 1 lo pone a null */
  const dog = setInterval(() => {
    if (K.tour !== tok || K.off || !S.on) pint();
  }, 250);
  let done = false;
  const p = petEl(),
    pi = petPi();
  try {
    PETS.hold = true;
    KK.interrupt();
    if (p) p.classList.add("kq-chat");
    const ok = await KK.hop("pet");
    if (!ok || K.tour !== tok) return false;
    /* la ovejita se gira hacia Kixki */
    viva.petFacing = KK.dark() ? 1 : -petSide;
    if (pi && !KK.dark()) pi.style.transform = viva.petFacing < 0 ? "scaleX(-1)" : "";
    await wait(RM() ? 0 : 380);
    const sc = pickScript(kind),
      c = ctx(),
      vars = {
        n: c.pet,
        f: c.folders,
        t: c.total,
        a: count(),
        N: NV(),
        h: new Date().toLocaleTimeString(lang(), { hour: "2-digit", minute: "2-digit" }),
      };
    for (const [who, es, en] of sc.l) {
      if (K.tour !== tok || K.off || !S.on) return false;
      const ok2 =
        who === "k" ? await KK.say([es, en], { p: 2, vars }) : await petSay([es, en], vars);
      if (!ok2 || K.tour !== tok) return false;
      await wait(RM() ? 0 : 240);
    }
    done = true;
    return true;
  } finally {
    clearInterval(dog);
    pint();
    PETS.hold = false;
    if (p) p.classList.remove("kq-chat", "kq-talk");
    if (pi) pi.style.transform = "";
    viva.chatting = false;
    if (K.tour === tok) K.tour = null;
    if (done) {
      inc("petChats");
      save();
      sweep();
    }
    if (KK.stage === "pet" && !K.off && S.on)
      setTimeout(() => {
        if (!viva.chatting && KK.stage === "pet") KK.relocate();
      }, 400);
  }
}

/* cosquillas: muchos toques rápidos a la ovejita y Kixki se asoma */
function petTap() {
  if (!isPC() || viva.chatting) return;
  const t = now();
  tapTimes = tapTimes.filter((x) => t - x < 3500);
  tapTimes.push(t);
  if (tapTimes.length >= 5 && t - lastTickle > 90000 && KK.alive()) {
    lastTickle = t;
    tapTimes = [];
    petChat("tickle");
  }
}

puente.petChat = petChat;

puente.petTap = petTap;

export function iniciar() {
  /* globo de la ovejita (mismo estilo que el de Kixki) */
  pcur = null;
  addEventListener("resize", playout);
  pb.addEventListener("click", () => pdone(pcur, "user"));
  /* la charla en sí */
  tapTimes = [];
  lastTickle = 0;
  /* visitas solas de vez en cuando */
  setInterval(() => {
    if (!isPC() || !KK.ready || viva.chatting || viva.fireOn) return;
    if (KK.stage === "pet" && KK.alive()) {
      KK.relocate();
      return;
    } /* por si se quedó abajo */
    if (now() >= viva.nextFire) {
      if (puente.summerDay() && !rainOn()) puente.petFire();
      else viva.nextFire = now() + 30000;
      return;
    }
    if (
      now() < viva.nextVisit ||
      !KK.alive() ||
      K.game ||
      K.mode !== "idle" ||
      document.activeElement === $("#q")
    )
      return;
    petChat("auto");
  }, 4000);
  addEventListener("kixki-mode", () => {
    if (!isPC()) {
      PETS.hold = false;
    }
  });
}
