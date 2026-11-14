/*
  Modo XP: trazos suaves con brillo azul, relámpagos, gotas del cristal y neblina.
*/

import { rnd, TAM_PIXEL, viva } from "./estado.js";
import { dark } from "./gotas.js";
import { lienzoAtras, alto, ancho, xpOn } from "./lienzos.js";
import { puente } from "./puente.js";
export let bolt;

const hillTop = (x) => {
  const k = window.KXPAS && KXPAS.hillY;
  return k
    ? Math.max(alto * 0.3, Math.min(alto - 8, KXPAS.hillY(x * TAM_PIXEL) / TAM_PIXEL))
    : alto * 0.62;
};

const emit2 = (n, d) => dispatchEvent(new CustomEvent(n, { detail: d }));

/* ---- modo XP: trazos y gotas suaves con brillo azul Luna ---- */
export function xStreaks(ctx, arr, n, al, L, wm) {
  ctx.lineCap = "round";
  for (let b = 0; b < 3; b++) {
    const lo = b / 3,
      hi = (b + 1) / 3 + (b === 2 ? 1 : 0),
      wd = [0.5, 0.75, 1][b] * wm,
      aa = [0.5, 0.78, 1][b];
    [
      ["rgba(43,106,214,.5)", 1],
      ["rgba(222,240,255,.95)", 0.5],
    ].forEach(([c, wf]) => {
      ctx.globalAlpha = al * 0.8 * aa;
      ctx.strokeStyle = c;
      ctx.lineWidth = wd * wf;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const d = arr[i],
          z = d.z;
        if (z < lo || z >= hi) continue;
        const ln = d.l * (0.7 + 0.6 * z);
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - L * ln, d.y - ln);
      }
      ctx.stroke();
    });
  }
  ctx.globalAlpha = 1;
}

export function strike(power) {
  if (!viva.raining && viva.inten < 0.3) return;
  const delay = rnd(0.45, 3.3),
    pw = Math.max(0.25, power != null ? power : 1 - delay * 0.18);
  if (xpOn && lienzoAtras.isConnected) {
    const hx = rnd(0.12, 0.88) * ancho,
      end = hillTop(hx) + rnd(-1, 3),
      pts = [];
    let x = hx,
      y = 0;
    while (y < end) {
      pts.push([x, y]);
      y += rnd(2.5, 6);
      x += rnd(-4.2, 4.2);
    }
    pts.push([x, Math.min(end, y)]);
    const br = [];
    for (let i = 0; i < 2; i++) {
      const q = pts[Math.floor(rnd(2, Math.max(3, pts.length - 3)))];
      if (!q) continue;
      let bx = q[0],
        by = q[1];
      const side = Math.random() < 0.5 ? -1 : 1,
        seg = [[bx, by]];
      for (let k = 0; k < 4; k++) {
        bx += side * rnd(2, 6);
        by += rnd(2, 6);
        seg.push([bx, by]);
      }
      br.push(seg);
    }
    bolt = { p: pts, br, t: 0 };
  } else puente.frame.fl = 5;
  emit2("kixki-thunder", { delay, power: pw });
}

export function drawBolt(ctx, k) {
  if (!bolt) return;
  bolt.t += k;
  const t = bolt.t;
  if (t > 14) {
    bolt = null;
    return;
  }
  const a = t < 2 ? 1 : t < 4 ? 0.3 : t < 6.5 ? 0.95 : Math.max(0, 0.7 * (1 - (t - 6.5) / 7.5));
  const line = (pts, w, al, col) => {
    ctx.globalAlpha = Math.min(1, al);
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.stroke();
  };
  line(bolt.p, 3.4, a * 0.22, "#9db8ff");
  line(bolt.p, 1.5, a * 0.6, "#dbe6ff");
  line(bolt.p, 0.7, a, "#ffffff");
  bolt.br.forEach((b) => {
    line(b, 1.1, a * 0.35, "#cfdcff");
    line(b, 0.45, a * 0.8, "#ffffff");
  });
  ctx.globalAlpha = a * (dark() ? 0.22 : 0.16);
  ctx.fillStyle = "#eaf0ff";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.globalAlpha = 1;
}

export function xpGlass(ctx, d) {
  const a = d.tr;
  if (a.length) {
    ctx.globalAlpha = Math.max(0, a[a.length - 1].a) * 0.8;
    ctx.strokeStyle = "rgba(125,181,240,.7)";
    ctx.lineWidth = 0.45;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(a[0].x, a[0].y);
    for (let i = 1; i < a.length; i++) ctx.lineTo(a[i].x, a[i].y);
    ctx.stroke();
  }
  if (d.imp) {
    const t = d.t,
      rr = d.r + t * 0.55;
    ctx.globalAlpha = Math.max(0, 1 - t / 9) * 0.8;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.ellipse(d.x, d.y, rr, rr * 0.8, 0, 0, 6.283);
    ctx.stroke();
  }
  if (!d.imp || d.t > 3) {
    const sc = d.imp ? Math.min(1, d.t / 6) : 1,
      rx = (d.r * 0.75 + 0.2) * sc,
      ry = rx * 1.25,
      x = d.x,
      y = Math.round(d.y);
    const g = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.4, rx * 0.1, x, y, ry * 1.1);
    g.addColorStop(0, "rgba(255,255,255,.95)");
    g.addColorStop(0.35, "rgba(190,224,250,.6)");
    g.addColorStop(1, "rgba(43,106,214,.5)");
    ctx.globalAlpha = d.a;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, 6.283);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.55)";
    ctx.lineWidth = 0.25;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/* bruma de lluvia pegada a la colina */
export function haze(ctx) {
  const hy = hillTop(ancho / 2),
    y0 = Math.max(0, hy - 18),
    g = ctx.createLinearGradient(0, y0, 0, alto);
  g.addColorStop(0, "rgba(215,230,250,0)");
  g.addColorStop(0.3, dark() ? "rgba(110,130,200,.15)" : "rgba(228,240,255,.24)");
  g.addColorStop(1, "rgba(215,230,250,.05)");
  ctx.globalAlpha = Math.min(1, viva.inten);
  ctx.fillStyle = g;
  ctx.fillRect(0, y0, ancho, alto - y0);
  ctx.globalAlpha = 1;
}

export function iniciar() {
  /* relámpago: un rayo que baja zigzagueando hasta la colina, con ramas y parpadeo; después llega el trueno */
  bolt = null;
}
