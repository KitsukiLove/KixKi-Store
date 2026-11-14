/*
  Agarrar a Kixki con el ratón o el dedo, moverla y soltarla (con inercia).
*/

import { clamp, now, reducirMovimiento as RM, rnd } from "../../core/util.js";
import { body, el, EX, formatearPar, H, K, KK, mpk, elegir, S, say } from "./base.js";
import { memoria, save } from "./memoria.js";
import { floorY, setTilt } from "./plataformas.js";
import { puente } from "./puente.js";
import { TEXTOS } from "./textos.js";

const endPtr = (e) => {
  const d = H.drag;
  if (!d || e.pointerId !== d.id) return;
  H.drag = null;
  if (!d.on) return;
  H.just = now();
  release();
};

function startHold(e) {
  const d = H.drag;
  d.on = true;
  puente.cancelFall();
  EX.stopMove();
  EX.setMode("idle");
  KK.interrupt();
  H.held = true;
  H.px = null;
  K.tour = H;
  K.stage = "air";
  H.samples = [];
  H.holdAt = now();
  H.holdN = 0;
  H.holdT = now() + rnd(2600, 4200);
  H.shakeN = 0;
  el.classList.remove("kk-mad", "kk-sq", "kk-cheer");
  el.classList.add("kk-held", "kk-air");
  H.ox = clamp(K.x - e.clientX, -26, 26);
  H.oy = clamp(K.y - e.clientY, 10, 44);
  if (window.KXS)
    try {
      KXS.baa();
    } catch (_) {
      // El sonido es opcional: si el audio aún no está listo se omite.
    }
  const n = ++memoria.grabs;
  save();
  KK.emit("grab", { n });
  /* (parte 2) agarrarla es frecuente: casi siempre una microreacción (~1 s); frase entera solo la 1.ª vez, cada 4 y de vez en cuando */
  if (n >= 4 && n % 4 === 0)
    say(formatearPar(elegir(TEXTOS.many, "k3many"), { n }), {
      p: 3,
      cat: "ev",
      key: "k3grab",
      cd: 0,
    });
  else if (n === 1 || Math.random() < 0.15)
    say(elegir(TEXTOS.grab, "k3grab"), { p: 3, cat: "ev", key: "k3grab", cd: 2500 });
  else KK.micro("grab", { key: "k3grab", cd: 1200 });
  requestAnimationFrame(heldLoop);
}

function moveHold(e) {
  if (!H.held) return;
  const t = performance.now();
  K.x = clamp(e.clientX + H.ox, 20, innerWidth - 20);
  K.y = clamp(e.clientY + H.oy, 56, Math.max(80, floorY()));
  H.samples.push({ t, x: K.x, y: K.y });
  while (H.samples.length > 7 || t - H.samples[0].t > 150) H.samples.shift();
  EX.place();
  /* zarandearla: cambios rápidos de dirección en horizontal */
  const mx = e.movementX || (H.px == null ? 0 : e.clientX - H.px);
  H.px = e.clientX; /* en táctil movementX viene en 0: se calcula con clientX */
  const dx = Math.sign(mx);
  if (dx && H.lastDx && dx !== H.lastDx && Math.abs(mx) > 3) {
    if (now() - H.shakeT > 1200) H.shakeN = 0;
    H.shakeT = now();
    if (++H.shakeN >= 6) {
      H.shakeN = 0;
      say(elegir(TEXTOS.shake, "k3shake"), { p: 3, cat: "ev", key: "k3shake", cd: 6000 });
    }
  }
  if (dx) H.lastDx = dx;
}

function heldLoop() {
  if (!H.held) return;
  if (K.off || !S.on) {
    puente.abortAll();
    return;
  }
  const v =
    H.samples.length > 1
      ? (H.samples[H.samples.length - 1].x - H.samples[0].x) /
        Math.max(0.016, (H.samples[H.samples.length - 1].t - H.samples[0].t) / 1000)
      : 0;
  if (!RM()) setTilt(v * 0.014);
  const t = now();
  /* (etapa 4) respiro entre líneas: no empieza otra mientras no pasen ~1,6 s desde que se cerró el globo anterior
       (antes salían una tras otra sin pausa y la de soltarla se encontraba el globo ocupado) */
  if (t > H.holdT && !K.talking && KK.quietFor() > 1600 && H.holdN < 4) {
    H.holdN++;
    H.holdT = t + rnd(3600, 5600);
    say(elegir(TEXTOS.holding, "k3hold"), {
      p: 2,
      cat: "ev",
      ctx: "hold",
      replace: false,
      instant: false,
      ttl: 900,
      key: "k3hold",
      cd: 2500,
    });
  }
  if (t - H.holdAt > 10000 && !H.longSaid) {
    H.longSaid = true;
    say(elegir(TEXTOS.longHold, "k3long"), { p: 3, cat: "ev", key: "k3long", cd: 0 });
  }
  requestAnimationFrame(heldLoop);
}

function release() {
  H.held = false;
  H.longSaid = false;
  /* (etapa 4) al soltarla, lo que dijo mientras la llevabas ya no vale: se cierra ese globo y se descartan sus frases en cola.
       Así hay un respiro limpio y la frase de soltarla/aterrizar nunca se encuentra el globo ocupado. */
  KK.interrupt("hold");
  const s = H.samples,
    L = s[s.length - 1];
  let vx = 0,
    vy = 0;
  if (s.length >= 2 && performance.now() - L.t < 90) {
    const a = s[0],
      dt = (L.t - a.t) / 1000;
    if (dt > 0.01) {
      vx = (L.x - a.x) / dt;
      vy = (L.y - a.y) / dt;
    }
  }
  vx = clamp(vx, -1500, 1500);
  vy = clamp(vy, -1200, 900);
  const thrown = Math.hypot(vx, vy) > puente.THROW_V,
    fly = { said: false };
  /* cada lanzamiento de verdad se cuenta (a los 10 aparece la cancha de básquet, basket.js) y TAMBIÉN se comenta:
       misma condición, sin importar la altura ni la dirección, y la frase sale al soltarla, no al aterrizar */
  if (thrown) {
    const n = (memoria.throws = (memoria.throws | 0) + 1);
    save();
    KK.emit("throw", { n });
    if (now() >= H.madUntil)
      say(mpk("flying", "k3fly"), {
        p: 3,
        cat: "ev",
        key: "k3th",
        cd: 1500,
        onStart: () => {
          fly.said = true;
        },
      });
  }
  puente.startFall({ vx, vy, thrown, fly, reason: "release" });
}

export function iniciar() {
  /* ---- agarrar ---- */
  body.addEventListener("pointerdown", (e) => {
    if (e.button || K.game || K.off || !S.on || !K.ready) return;
    if (H.drag && H.drag.on)
      return; /* ya la sostienen: un 2.º dedo no abre otro bucle de arrastre */
    H.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, on: false };
    try {
      body.setPointerCapture(e.pointerId);
    } catch (_) {
      // El puntero ya se soltó: sin captura el gesto simplemente termina.
    }
  });
  body.addEventListener("pointermove", (e) => {
    const d = H.drag;
    if (!d || e.pointerId !== d.id) return;
    if (!d.on) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < (e.pointerType === "touch" ? 10 : 6))
        return;
      startHold(e);
    }
    moveHold(e);
  });

  body.addEventListener("pointerup", endPtr);
  body.addEventListener("pointercancel", endPtr);
  /* tras arrastrar, el «click» final no cuenta como toque; enfadada, solo refunfuña */
  addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t || !t.closest || !t.closest(".kk-body")) return;
      if (now() - H.just < 160) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (now() < H.madUntil) {
        e.stopPropagation();
        e.preventDefault();
        say(elegir(TEXTOS.madTap, "k3mt"), {
          p: 3,
          cat: "ev",
          key: "k3madtap",
          cd: 1200,
          words: true,
        }); /* tocarla = permiso para hablar (4b) */
      }
    },
    true
  );
}
