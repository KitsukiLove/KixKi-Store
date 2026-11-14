/*
  Incendio de verano: la ovejita se prende fuego y Kixki acude a apagarlo.
*/

import { $, now, reducirMovimiento as RM, rnd, wait } from "../../core/util.js";
import { sweep } from "./anuncios.js";
import { crear, say } from "./avisos.js";
import { isPC, K, KK, rainOn, root, S, tx, viva } from "./base.js";
import { pcur, petSay, pint, playout } from "./charla.js";
import { petEl, petPi, PETS } from "./consejos.js";
import { inc, save } from "./estado.js";
import { icono } from "./iconos.js";
import { petBox } from "./ovejita.js";
import { puente } from "./puente.js";

let fx;

const summerDay = () =>
  root.getAttribute("data-bg") === "verano" && root.getAttribute("data-theme") !== "dark" && isPC();

const FIRE_LIMIT = 14;

const SHOUT = [
  ["¡Beee! ¡Me quemo!", "Baaa! I'm burning!"],
  ["¡Aguaaa! ¡Beee!", "Waaater! Baaa!"],
  ["¡Que alguien me eche agua!", "Somebody throw water on me!"],
  ["¡Tócame para apagarme!", "Tap me to put me out!"],
  ["¡Está muy calientee!", "It's so hoooot!"],
];

const fxAt = (x, y, cls, css, ms) => {
  const e = document.createElement("i");
  e.className = cls;
  e.style.cssText = `left:${Math.round(x)}px;top:${Math.round(y)}px;${css || ""}`;
  fx.append(e);
  setTimeout(() => e.remove(), ms || 900);
  return e;
};

export const cowEl = () => document.querySelector(".vp.cow");

function setFlames(p, n) {
  let box = $(".kq-fire", p);
  if (n <= 0) {
    if (box) box.remove();
    return;
  }
  if (!box) {
    box = document.createElement("div");
    box.className = "kq-fire";
    p.append(box);
  }
  const sc = { 3: [4, 5, 4], 2: [3, 4, 3], 1: [2, 3, 2] }[n];
  box.innerHTML = sc
    .map(
      (k, i) =>
        `<span class="kq-fl" style="--d:-${(i * 0.09).toFixed(2)}s">${icono("flameA", k, "fa")}${icono("flameB", k, "fb")}</span>`
    )
    .join("");
}

export async function petFire(force) {
  if (viva.fireOn || viva.chatting || !isPC() || !petEl() || !petBox()) return false;
  if (
    !force &&
    (!summerDay() || rainOn() || !KK.ready || !S.on || K.off || K.game || K.tour || document.hidden)
  )
    return false;
  viva.fireOn = true;
  viva.nextFire = now() + rnd(200000, 420000);
  const p = petEl(),
    pi = petPi();
  let stage = 3,
    t = 0,
    x = typeof PETS.x === "number" ? PETS.x : petBox().left,
    dirp = PETS.dir >= 0 ? 1 : -1,
    turn = rnd(0.7, 1.4),
    shoutT = 0.3,
    shoutI = 0,
    emb = 0,
    rescuing = false,
    stopping = false,
    mult = 1,
    finished = false,
    by = "",
    rainT = 0;
  const tok = {};
  PETS.hold = true;
  p.classList.add("kq-burn");
  setFlames(p, 3);
  pint();
  say(
    tx([
      "¡La ovejita se está quemando! Tócala para echarle agua.",
      "The little sheep is on fire! Tap her to splash water on her.",
    ])
  );
  KK.say(
    [
      "¡¡La ovejita se está quemando!! ¡Tócala para echarle agua! 💦",
      "The little sheep is on fire!! Tap her to splash water on her! 💦",
    ],
    { p: 3 }
  );
  if (window.KXS)
    try {
      KXS.baa();
    } catch (e) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
  const SPD = { 3: 250, 2: 200, 1: 140 };
  function bucket() {
    const r = petBox();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const b = fxAt(cx - 18, r.top - 58, "kq-bk", "");
    b.innerHTML = icono("bucket", 4);
    for (let i = 0; i < 9; i++)
      setTimeout(
        () => {
          const q = petBox();
          if (q)
            fxAt(
              q.left + q.width / 2 + rnd(-22, 22),
              q.top - 18,
              "kq-wd",
              `--dy:${Math.round(rnd(34, 60))}px;animation-delay:0s`,
              650
            );
        },
        200 + i * 45
      );
    if (window.KXS)
      try {
        KXS.beep(520, 0.1);
        setTimeout(() => KXS.beep(390, 0.1), 90);
      } catch (e) {
        // El sonido es opcional: si el audio aún no está listo se omite.
      }
  }
  function splash(who) {
    if (stage <= 0 || finished) return;
    stage--;
    bucket();
    setFlames(p, stage);
    if (stage === 2) petSay(["¡Más agua!", "More water!"], null, { ms: 1800 });
    else if (stage === 1) petSay(["¡Casi, casi!", "Almost there!"], null, { ms: 1800 });
    else out(who);
  }
  async function out(who) {
    finished = true;
    stopping = true;
    by = who;
    const r = petBox();
    if (r)
      for (let i = 0; i < 10; i++)
        fxAt(
          r.left + rnd(8, r.width - 8),
          r.top + rnd(-6, 10),
          "kq-em",
          `--c:#e6edf7;--ex:${Math.round(rnd(-12, 12))}px`,
          1000
        );
    p.classList.remove("kq-burn");
    viva.petFacing = dirp > 0 ? 1 : -1;
    petSay(
      who === "rain"
        ? ["¡Llueve! ¡Ufff, qué alivio! 🌧️", "It's raining! Phew, what a relief! 🌧️"]
        : who === "kixki"
          ? [
              "Gracias, Kixki… huelo a lana chamuscada. 😅",
              "Thanks, Kixki… I smell like toasted wool. 😅",
            ]
          : ["¡Ufff! ¡Gracias! Qué alivio. 💦", "Phew! Thank you! What a relief. 💦"],
      null,
      { ms: 3200 }
    );
    if (who === "rain")
      KK.say(
        [
          "¡La lluvia apagó el fuego solita! 🌧️ Qué suerte tiene esta ovejita.",
          "The rain put the fire out all by itself! 🌧️ Lucky little sheep.",
        ],
        { p: 3, mood: "happy" }
      );
    else if (who !== "kixki")
      KK.say(
        [
          "¡Fuego apagado! Eres muy pro, no lo olvides. 🚒",
          "Fire's out! You're so pro, never forget it. 🚒",
        ],
        { p: 3, mood: "happy" }
      );
    if (who === "user") {
      inc("fireUser");
      if (t < 6) inc("fireFast");
    } else if (who === "kixki") inc("fireKixki");
    else if (who === "rain") inc("fireRain");
    save();
    sweep();
    await wait(1900);
    end();
  }
  function end() {
    viva.fireOn = false;
    finished = true;
    PETS.hold = false;
    p.classList.remove("kq-burn");
    setFlames(p, 0);
    pint();
    if (pi) pi.style.transform = PETS.dir < 0 ? "scaleX(-1)" : "";
    removeEventListener("pointerdown", down, true);
  }
  function down(e) {
    if (!viva.fireOn || rescuing || finished) return;
    const r = petBox();
    if (!r) return;
    const pad = 26;
    if (
      e.clientX >= r.left - pad &&
      e.clientX <= r.right + pad &&
      e.clientY >= r.top - pad - 34 &&
      e.clientY <= r.bottom + pad
    )
      splash("user");
  }
  addEventListener("pointerdown", down, true);
  async function rescue() {
    rescuing = true;
    if (!(KK.ready && S.on && !K.off)) {
      /* sin Kixki: lluvia fresca */
      for (let i = 0; i < 3 && !finished; i++) {
        bucket();
        stage--;
        setFlames(p, stage);
        await wait(420);
      }
      if (!finished) out("auto");
      return;
    }
    K.tour = tok;
    KK.say(["¡Aguanta, ovejita! ¡Voy yo! 🚒", "Hold on, little sheep! I'm coming! 🚒"], {
      p: 3,
    });
    stopping = true;
    await wait(RM() ? 0 : 650);
    let ok = false;
    try {
      ok = await KK.hop("pet");
    } catch (e) {
      // Si el salto falla, ok sigue en false y se actúa en consecuencia.
    }
    if (K.tour !== tok && !ok) {
      if (!finished) {
        stage = 0;
        setFlames(p, 0);
        out("auto");
      }
      return;
    }
    for (let i = 0; i < 3 && !finished; i++) {
      bucket();
      stage--;
      setFlames(p, stage);
      await wait(520);
    }
    if (!finished) await out("kixki");
    if (by === "kixki")
      KK.say(["¡Listo! Esta vez me tocó a mí. 🚒", "Done! My turn this time. 🚒"], {
        p: 3,
        mood: "happy",
      });
    if (K.tour === tok) K.tour = null;
    setTimeout(() => {
      if (!viva.chatting && KK.stage === "pet") KK.relocate();
    }, 900);
  }
  let last = performance.now();
  (function frame(ts) {
    if (!viva.fireOn) return;
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    if (!isPC() || !petEl()) {
      end();
      return;
    }
    if (!document.hidden) t += dt;
    if (stopping) mult = Math.max(0, mult - dt * 2.8);
    if (!RM() && mult > 0) {
      x += dirp * SPD[Math.max(1, stage)] * mult * dt;
      const mx = innerWidth - 130;
      if (x > mx) {
        x = mx;
        dirp = -1;
        turn = rnd(0.7, 1.5);
      }
      if (x < 120) {
        x = 120;
        dirp = 1;
        turn = rnd(0.7, 1.5);
      }
      turn -= dt;
      if (turn <= 0) {
        dirp = -dirp;
        turn = rnd(0.6, 1.6);
      }
    }
    PETS.x = x;
    PETS.dir = dirp;
    p.style.transform = `translateX(${x}px)`;
    if (pi) pi.style.transform = dirp < 0 ? "scaleX(-1)" : "";
    viva.petFacing = dirp > 0 ? 1 : -1;
    if (pcur) playout();
    emb -= dt;
    if (emb <= 0 && stage > 0) {
      emb = 0.11;
      const r = petBox();
      if (r)
        fxAt(
          r.left + rnd(6, r.width - 10),
          r.top + rnd(-6, 8),
          "kq-em",
          `--c:${["#ff7a1a", "#ffd23a", "#ff5a1f", "#7a6a8a"][Math.floor(rnd(0, 4))]};--ex:${Math.round(rnd(-10, 10))}px`,
          900
        );
    }
    shoutT -= dt;
    if (shoutT <= 0 && !finished && !rescuing) {
      shoutT = 2.8;
      petSay(SHOUT[shoutI++ % SHOUT.length], null, { ms: 2400 });
    }
    if (rainOn() && !finished) {
      rainT += dt;
      if (rainT > 1.4) {
        stage = 0;
        setFlames(p, 0);
        out("rain");
      }
    } else rainT = 0;
    if (t >= FIRE_LIMIT && !rescuing && !finished) rescue();
    requestAnimationFrame(frame);
  })(performance.now());
  return true;
}

puente.petFire = petFire;

export function iniciar() {
  /* =========================================================
     INCENDIO DE VERANO: de día y con el fondo de verano, la ovejita de abajo
     a veces se prende fuego y corre de un lado a otro. Tócala (3 veces) para echarle agua;
     si tardas, Kixki baja a apagarla.
     ========================================================= */
  fx = crear('<div id="kq-fx" aria-hidden="true"></div>');
  document.body.append(fx);

  /* segundos antes de que baje Kixki */

  /* =========================================================
     VACA.EXE (easter egg de los 1000 toques): Kixki sube a la ventana de la vaca y charlan.
     Si la acaricias 3 veces, o dejas que acabe la charla, se desbloquea un logro OCULTO
     (no aparece en la lista hasta que lo consigues).
     ========================================================= */

  KK.plat("cow", () => {
    const v = cowEl();
    if (!v) return null;
    const r = v.getBoundingClientRect();
    if (r.width < 60) return null;
    const a = r.left + 34;
    return {
      a,
      b: Math.max(a, r.right - 34),
      y: () => {
        const q = v.getBoundingClientRect();
        return q.top - 2;
      },
    };
  });
  puente.summerDay = summerDay;
}
