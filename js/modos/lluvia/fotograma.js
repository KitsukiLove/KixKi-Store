/*
  Bucle de animación: actualiza y pinta cada fotograma de la lluvia.
*/

import { reducirMovimiento as RM } from "../../core/util.js";
import { dropShape, impact, streaks } from "./dibujo.js";
import { emit, now, rnd, viva } from "./estado.js";
import {
  addDrop,
  dark,
  far,
  gotasCristal,
  MAXFAR,
  MAXNEAR,
  mkFar,
  mkNear,
  near,
  PXFAR,
  PXNEAR,
  resetFar,
  resetNear,
  splashes,
} from "./gotas.js";
import { alto, mount, ancho, lienzoXpAtras, lienzoXpFrente, xpOn } from "./lienzos.js";
import { bolt, drawBolt, haze, strike, xpGlass, xStreaks } from "./modo-xp.js";
import { puente } from "./puente.js";
function frame(ts) {
  viva.loop = 0;
  if (document.hidden) {
    viva.loop = requestAnimationFrame(frame);
    return;
  }
  const dt = Math.min(0.05, ((ts || performance.now()) - (frame.l || ts || 0)) / 1000 || 0.016);
  frame.l = ts || performance.now();
  const k = dt * 60,
    t = now();
  /* intensidad hacia su objetivo */
  const tg = viva.raining ? viva.strength : 0;
  viva.inten += Math.sign(tg - viva.inten) * Math.min(Math.abs(tg - viva.inten), dt * 0.35);
  const P = {
    fill: dark() ? "rgba(200,212,255,.26)" : "rgba(235,244,255,.46)",
    edge: dark() ? "rgba(130,150,240,.75)" : "rgba(40,62,150,.7)",
    hi: "#ffffff",
  };
  const rc = dark() ? "#c4cfff" : "#eaf2ff",
    sh = dark() ? "#3d4aa8" : "#2f4fae";
  lienzoXpAtras.clearRect(0, 0, ancho, alto);
  lienzoXpFrente.clearRect(0, 0, ancho, alto);
  const motion = !RM();
  /* viento: inclinación de la lluvia (a la derecha, como el pasto) con una ráfaga cada 9 s */
  const ct = (document.timeline && document.timeline.currentTime) || performance.now(),
    ph = (ct / 9000) % 1,
    gu = ph > 0.05 && ph < 0.62 ? Math.sin(((ph - 0.05) / 0.57) * Math.PI) : 0;
  const L = 0.1 + 0.04 * Math.sin(ct / 2900) + 0.19 * gu * (0.6 + 0.4 * Math.min(1, viva.inten));

  if (viva.inten > 0.01) {
    /* tinte gris-azulado */
    lienzoXpAtras.globalAlpha = Math.min(1, viva.inten);
    lienzoXpAtras.fillStyle = dark() ? "rgba(6,6,36,.24)" : "rgba(40,55,110,.16)";
    lienzoXpAtras.fillRect(0, 0, ancho, alto);
    lienzoXpAtras.globalAlpha = 1;
    if (motion) {
      const nf = Math.round(
          (xpOn ? Math.min(MAXFAR, (ancho * alto) / 430) : Math.min(PXFAR, (ancho * alto) / 700)) *
            viva.inten
        ),
        nn = Math.round(
          (xpOn
            ? Math.min(MAXNEAR, (ancho * alto) / 2600)
            : Math.min(PXNEAR, (ancho * alto) / 3200)) * viva.inten
        );
      while (far.length < MAXFAR) far.push(mkFar());
      while (near.length < MAXNEAR) near.push(mkNear());
      for (let i = 0; i < nf; i++) {
        const d = far[i];
        d.y += d.vy * k;
        d.x += (xpOn ? L * d.vy : d.vx) * k;
        if (d.y >= d.ly) {
          if (splashes.length < 120)
            splashes.push({ x: Math.round(d.x), y: Math.round(d.ly), t: 0 });
          resetFar(d, false);
        }
      }
      for (let i = 0; i < nn; i++) {
        const d = near[i];
        d.y += d.vy * k;
        d.x += (xpOn ? L * d.vy : d.vx) * k;
        if (d.y > alto + 10) resetNear(d, false);
      }
      if (xpOn) {
        haze(lienzoXpAtras);
        xStreaks(lienzoXpAtras, far, nf, 0.8, L, 1);
        xStreaks(lienzoXpFrente, near, nn, 0.9, L, 1.7);
      } else {
        streaks(lienzoXpAtras, far, nf, rc, 1, sh);
        streaks(lienzoXpFrente, near, nn, rc, 0.8, sh);
      }
      /* salpicaduras al caer */
      lienzoXpAtras.fillStyle = rc;
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.t += k;
        if (s.t > 7) {
          splashes.splice(i, 1);
          continue;
        }
        lienzoXpAtras.globalAlpha = Math.max(0, 0.8 - s.t / 9);
        if (xpOn) {
          /* anillo suave + anillo interior + dos gotitas que saltan */
          const rr = s.t * 0.4 + 0.4;
          lienzoXpAtras.strokeStyle = "#eaf6ff";
          lienzoXpAtras.lineWidth = 0.34;
          lienzoXpAtras.beginPath();
          lienzoXpAtras.ellipse(s.x, s.y, rr, rr * 0.36, 0, 0, 6.283);
          lienzoXpAtras.stroke();
          if (s.t > 1.4) {
            lienzoXpAtras.beginPath();
            lienzoXpAtras.ellipse(s.x, s.y, rr * 0.55, rr * 0.2, 0, 0, 6.283);
            lienzoXpAtras.stroke();
          }
          if (s.t < 4.5) {
            const j = Math.sin(s.t * 0.7) * 2.2;
            lienzoXpAtras.fillStyle = "#ffffff";
            lienzoXpAtras.fillRect(s.x - rr * 0.8, s.y - j, 0.55, 0.55);
            lienzoXpAtras.fillRect(s.x + rr * 0.8, s.y - j * 0.8, 0.55, 0.55);
          }
          continue;
        }
        const u = Math.floor(s.t / 2) + 1;
        lienzoXpAtras.fillRect(s.x - u, s.y, 1, 1);
        lienzoXpAtras.fillRect(s.x + u, s.y, 1, 1);
        lienzoXpAtras.fillRect(s.x - u + 1, s.y - 1, 1, 1);
        lienzoXpAtras.fillRect(s.x + u - 1, s.y - 1, 1, 1);
      }
      lienzoXpAtras.globalAlpha = 1;
    }
    /* destello lejano muy de vez en cuando (solo con tormenta fuerte) */
    if (motion && viva.inten > 0.9 && viva.strength >= 0.85 && Math.random() < 0.0005) strike();
    if (bolt) drawBolt(lienzoXpAtras, k);
    if (frame.fl > 0) {
      frame.fl -= k;
      lienzoXpAtras.globalAlpha = 0.16;
      lienzoXpAtras.fillStyle = "#fff";
      lienzoXpAtras.fillRect(0, 0, ancho, alto);
      lienzoXpAtras.globalAlpha = 1;
    }
  }

  /* ---- gotas en el cristal ---- */
  const idle = t - viva.lastAct,
    dry = idle < 2500;
  if (viva.raining && viva.inten > 0.5 && idle > viva.idleMs && motion) {
    viva.spawnT -= dt * 1000;
    if (viva.spawnT <= 0) {
      const over = Math.min(1, (idle - viva.idleMs) / 22000);
      viva.spawnT = Math.max(110, 520 - over * 400) * rnd(0.7, 1.3);
      const d = addDrop(rnd(4, ancho - 4), rnd(4, alto - 6));
      d.t = 0;
      d.imp = 1;
      if (!viva.glassFired && gotasCristal.length >= 5) {
        viva.glassFired = true;
        emit("glass", { n: gotasCristal.length });
      }
    }
  }
  const evap = !viva.raining && gotasCristal.length > 0;
  for (let i = gotasCristal.length - 1; i >= 0; i--) {
    const d = gotasCristal[i];
    if (d.imp) {
      d.t += k * 0.9;
      if (d.t >= 9) {
        d.imp = 0;
        d.t = 0;
      }
    } else {
      if (dry || evap) d.a -= dt * (evap ? 0.14 : 0.09);
      if (!d.sl && d.r >= 3 && Math.random() < 0.0016 * k * (d.r - 2)) d.sl = true;
      if (d.sl) {
        d.vy = Math.min(1.05, d.vy + 0.025 * k);
        const ny = d.y + d.vy * k;
        if (Math.round(ny) !== d.y) {
          d.tr.push({ x: d.x, y: d.y, a: 0.5 });
          if (d.tr.length > 46) d.tr.shift();
        }
        d.y = ny;
        d.r = Math.max(2, d.r - (Math.random() < 0.002 * k ? 1 : 0));
        if (d.vy > 0.7 && Math.random() < 0.01 * k) {
          d.sl = false;
          d.vy = 0;
        }
        if (d.y > alto + 6) d.a = 0;
      }
      d.y = d.sl ? d.y : Math.round(d.y);
    }
    d.tr.forEach((q) => (q.a -= dt * 0.16));
    while (d.tr.length && d.tr[0].a <= 0) d.tr.shift();
    if (d.a <= 0 && !d.tr.length) {
      gotasCristal.splice(i, 1);
    }
  }
  gotasCristal.forEach((d) => {
    if (xpOn) {
      xpGlass(lienzoXpFrente, d);
      return;
    }
    if (d.tr.length) {
      lienzoXpFrente.fillStyle = P.fill;
      d.tr.forEach((q) => {
        lienzoXpFrente.globalAlpha = Math.max(0, q.a) * 0.8;
        lienzoXpFrente.fillRect(Math.round(q.x), Math.round(q.y), 1, 1);
      });
      lienzoXpFrente.globalAlpha = 1;
    }
    if (d.imp) impact(lienzoXpFrente, d, P);
    if (!d.imp || d.t > 3)
      dropShape(
        lienzoXpFrente,
        { x: d.x, y: Math.round(d.y), r: d.r, a: d.a },
        P,
        d.imp ? Math.min(1, d.t / 6) : 1
      );
  });

  const alive = viva.raining || viva.inten > 0.01 || gotasCristal.length > 0;
  document.documentElement.classList.toggle("kr-on", alive);
  if (alive) viva.loop = requestAnimationFrame(frame);
  else {
    lienzoXpAtras.clearRect(0, 0, ancho, alto);
    lienzoXpFrente.clearRect(0, 0, ancho, alto);
  }
}

export function wake() {
  mount();
  if (!viva.loop) {
    frame.l = 0;
    viva.loop = requestAnimationFrame(frame);
  }
}

puente.frame = frame;
