/*
  La partida de vallas: ventana, física del salto, vallas, valle con capas y marcador.
*/

import { guardar, leer } from "../../core/store.js";
import {
  BODY,
  SUELO_Y,
  ALTO,
  hs,
  LEGS,
  pal,
  COLORES_KIXKI,
  X_KIXKI,
  texto,
  ANCHO,
} from "./paleta.js";
export function open(g) {
  const c = g.querySelector("canvas"),
    x = c.getContext("2d");
  x.imageSmoothingEnabled = false;
  if (g._raf) cancelAnimationFrame(g._raf);
  const ev = (t, d) =>
    dispatchEvent(new CustomEvent("kixki-game", { detail: Object.assign({ t }, d) }));
  const beep = (f, d) => {
    if (window.KXS)
      try {
        KXS.beep(f, d);
      } catch (e) {
        // El sonido es opcional: si el audio aún no está listo se omite.
      }
  };
  const R = (a, b, w, h, col) => {
    x.fillStyle = col;
    x.fillRect(Math.round(a), Math.round(b), w, h);
  };
  let st = "ready",
    rec = leer("kixki-rec", 0),
    gp = leer("kixki-gp", 0),
    first = false,
    best0 = rec,
    hit = false;
  const run = {
    sc: 0,
    speed: 4.2,
    y: 0,
    vy: 0,
    obs: [],
    dust: [],
    off: 0,
    t: 0,
    leg: 0,
    deadAt: 0,
    buf: 0,
    fast: false,
    air: false,
    flash: 0,
    recT: 0,
    pop: [],
  };
  const clouds = [
    { x: 40, y: 18, s: 1 },
    { x: 190, y: 34, s: 0.8 },
    { x: 330, y: 14, s: 1.1 },
    { x: 450, y: 40, s: 0.7 },
  ];
  const stars = Array.from({ length: 22 }, (_, i) => ({
    x: Math.round(hs(i * 7 + 1) * ANCHO),
    y: Math.round(hs(i * 7 + 2) * 58),
    b: i % 3,
  }));
  const newRun = () => {
    gp++;
    guardar("kixki-gp", gp);
    first = gp === 1;
    best0 = rec;
    hit = false;
    Object.assign(run, {
      sc: 0,
      speed: 4.2,
      y: 0,
      vy: 0,
      obs: [],
      dust: [],
      buf: 0,
      fast: false,
      air: false,
      flash: 0,
      recT: 0,
      pop: [],
      t: 0,
    });
    spawn(ANCHO + 70);
  };

  /* ---- vallas ---- */
  function spawn(px) {
    const s = run.sc,
      r = Math.random();
    let n = 1,
      h = 18;
    if (s < 4) n = r < 0.7 ? 1 : 2;
    else if (s < 10) {
      n = r < 0.45 ? 1 : r < 0.8 ? 2 : 3;
    } else if (s < 20) {
      n = r < 0.3 ? 1 : r < 0.6 ? 2 : 3;
      if (Math.random() < 0.3) h = 28;
    } else {
      n = r < 0.25 ? 1 : r < 0.55 ? 2 : 3;
      if (Math.random() < 0.45) h = 28;
    }
    if (h === 28 && n === 3) n = 2;
    const w = n * 16 + 4,
      last = run.obs[run.obs.length - 1];
    let xx = px;
    if (xx == null) {
      const air = run.speed * 33,
        gap = air * (0.85 + Math.random() * 0.65) + w * 0.5 + 26;
      xx = (last ? last.x + last.w : ANCHO) + gap;
    }
    run.obs.push({ x: xx, w, h, n, p: 0 });
  }
  function fence(o, P) {
    const top = SUELO_Y - o.h,
      wd = "#8b5a2b",
      wl = "#b27a42",
      wk = "#5a3a1c",
      rail = "#a56c34",
      rl = "#c99560";
    const rails = o.h > 18 ? [top + 5, top + 12, top + 19] : [top + 5, top + 12];
    rails.forEach((ry) => {
      R(o.x, ry, o.w, 3, rail);
      R(o.x, ry, o.w, 1, rl);
      R(o.x, ry + 3, o.w, 1, wk);
    });
    for (let i = 0; i <= o.n; i++) {
      const px = o.x + i * 16;
      R(px, top + 2, 4, o.h - 2, wd);
      R(px + 1, top, 2, 2, wd);
      R(px, top + 2, 1, o.h - 2, wl);
      R(px + 3, top + 2, 1, o.h - 2, wk);
    }
  }

  /* ---- fondo en capas ---- */
  const hillY = (wx, base, amp, per, ph) =>
    base +
    Math.round(
      (Math.sin(wx / per + ph) * amp + Math.sin(wx / (per * 0.43) + ph * 2) * amp * 0.35) / 2
    ) *
      2;
  function layer(off, base, amp, per, ph, col) {
    x.fillStyle = col;
    for (let px = 0; px < ANCHO; px += 4) {
      const y = hillY(px + off, base, amp, per, ph);
      x.fillRect(px, y, 4, SUELO_Y + 10 - y);
    }
  }
  function trees(off, P) {
    const sp = 70,
      i0 = Math.floor(off / sp) - 1;
    for (let i = i0; i < i0 + ANCHO / sp + 3; i++) {
      if (hs(i * 3 + 9) < 0.35) continue;
      const wx = i * sp + Math.round(hs(i * 5 + 4) * 30),
        px = Math.round(wx - off),
        y = hillY(wx, 100, 9, 64, 1.3),
        big = hs(i * 11 + 2) > 0.5 ? 1 : 0,
        r = big ? 9 : 6;
      R(px - 1, (y - r - 2 + r * 1.4) | 0, 3, r, P.trunk);
      for (let j = -r; j <= r; j += 2) {
        const w = Math.floor(Math.sqrt(r * r - j * j));
        R(px - w, y - r - 2 + j + r, w * 2 + 1, 2, P.tree);
      }
    }
  }
  function farFence(off, P) {
    const sp = 14,
      i0 = Math.floor(off / sp) - 1,
      y = SUELO_Y - 14;
    for (let i = i0; i < i0 + ANCHO / sp + 3; i++) {
      const px = Math.round(i * sp - off);
      if (((i % 9) + 9) % 9 === 8) continue;
      R(px, y, 2, 10, P.farfence);
      R(px, y + 2, sp + 2, 2, P.farfence);
      R(px, y + 6, sp + 2, 2, P.farfence);
    }
  }
  function ground(off, P) {
    R(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, P.soil);
    R(0, SUELO_Y, ANCHO, 6, P.grass);
    R(0, SUELO_Y + 6, ANCHO, 2, P.grass2);
    R(0, SUELO_Y + 14, ANCHO, 2, P.soil2);
    const sp = 26,
      i0 = Math.floor(off / sp) - 1;
    for (let i = i0; i < i0 + ANCHO / sp + 3; i++) {
      const px = Math.round(i * sp + hs(i * 7) * 18 - off),
        k = hs(i * 13 + 3);
      if (k < 0.3) {
        R(px, SUELO_Y - 4, 2, 5, P.grass2);
        R(px + 3, SUELO_Y - 6, 2, 7, P.grass);
        R(px + 6, SUELO_Y - 3, 2, 4, P.grass2);
      } else if (k < 0.62) {
        const fc = P.fl[Math.floor(hs(i * 17) * P.fl.length)];
        R(px + 1, SUELO_Y - 3, 2, 5, P.grass2);
        R(px - 1, SUELO_Y - 6, 6, 2, fc);
        R(px + 1, SUELO_Y - 8, 2, 6, fc);
        R(px + 1, SUELO_Y - 5, 2, 2, "#ffe27a");
      } else if (k < 0.78) R(px, SUELO_Y + 10, 4, 3, P.stone);
    }
  }
  function sky(P, dt) {
    const bands = P.sky,
      bh = Math.ceil(100 / bands.length);
    bands.forEach((c, i) => R(0, i * bh, ANCHO, bh + 1, c));
    R(0, 100, ANCHO, SUELO_Y - 100, P.sky[bands.length - 1]);
    if (P.star)
      stars.forEach((s) => {
        if ((((run.t / 18) | 0) + s.b) % 3) R(s.x, s.y, 2, 2, P.star);
      });
    const sx = (392 - ((run.off * 0.01) % 40)) | 0;
    R(sx - 14, 26 - 8, 28, 2, P.sun2);
    R(sx - 14, 26 + 22, 28, 2, P.sun2);
    for (let j = -12; j <= 12; j += 2) {
      const w = Math.floor(Math.sqrt(144 - j * j));
      R(sx - w, 26 + j, w * 2, 2, P.sun);
    }
    if (P.star)
      for (let j = -8; j <= 8; j += 2) {
        const w = Math.floor(Math.sqrt(64 - j * j));
        R(sx - w + 5, 26 + j - 3, w * 2, 2, P.sky[1]);
      } /* mordisco: luna creciente */
    clouds.forEach((cl) => {
      if (!P.star || true) {
        const cx = Math.round(cl.x),
          cy = cl.y,
          s = cl.s;
        R(cx, cy + 4, Math.round(40 * s), 8, P.cloud);
        R(cx + Math.round(6 * s), cy, Math.round(22 * s), 6, P.cloud);
        R(cx + Math.round(20 * s), cy - 2, Math.round(12 * s), 4, P.cloud);
      }
    });
  }

  /* ---- oveja ---- */
  function sheep(P) {
    const px = X_KIXKI,
      py = SUELO_Y - 22 - Math.round(run.y);
    const legs = run.y > 0 ? LEGS.j : Math.floor(run.leg) % 2 ? LEGS.b : LEGS.a;
    [...BODY, ...legs].forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        if (COLORES_KIXKI[ch]) R(px + i * 2, py + j * 2, 2, 2, COLORES_KIXKI[ch]);
      }
    });
    R(px + 22, py + 12, 6, 2, "#6b3fe0");
    R(px + 22, py + 14, 4, 2, "#6b3fe0"); /* bufanda */
    if (st === "dead") {
      R(px + 30, py - 6, 2, 2, "#ffd23a");
      R(px + 36, py - 8, 2, 2, "#ffd23a");
      R(px + 26, py - 8, 2, 2, "#ffd23a");
    }
  }
  function hud(P) {
    const f = '700 16px "Pixelify Sans",ui-monospace,monospace',
      ink = P.star ? "#fff7e6" : "#2b1a5e";
    x.font = f;
    x.textBaseline = "top";
    x.fillStyle = P.star ? "#0c0620" : "#ffffff";
    x.fillText(String(run.sc), 13, 11);
    x.fillStyle = ink;
    x.fillText(String(run.sc), 12, 10);
    x.font = '600 12px "Pixelify Sans",ui-monospace,monospace';
    const t = texto("best") + " " + Math.max(rec, run.sc);
    x.fillStyle = P.star ? "#0c0620" : "#ffffff";
    x.fillText(t, 13, 31);
    x.fillStyle = ink;
    x.fillText(t, 12, 30);
    if (run.recT > 0) {
      x.font = '700 14px "Pixelify Sans",ui-monospace,monospace';
      x.textAlign = "center";
      x.fillStyle = "#ffd23a";
      x.fillText(texto("nr"), ANCHO / 2, 40 + (run.recT % 12 < 6 ? 0 : 2));
      x.textAlign = "left";
    }
    if (st === "ready" || st === "dead") {
      const m = texto(st === "ready" ? "ready" : "dead");
      x.font = '700 15px "Pixelify Sans",ui-monospace,monospace';
      const w = x.measureText(m).width + 28;
      R(ANCHO / 2 - w / 2 - 2, 58, w + 4, 34, P.star ? "#fff7e6" : "#2b1a5e");
      R(ANCHO / 2 - w / 2, 60, w, 30, P.star ? "#21145a" : "#fffaf0");
      x.textAlign = "center";
      x.fillStyle = P.star ? "#fff7e6" : "#2b1a5e";
      x.fillText(m, ANCHO / 2, 67);
      x.textAlign = "left";
    }
    run.pop.forEach((p) => {
      x.font = '700 14px "Pixelify Sans",ui-monospace,monospace';
      x.fillStyle = "#ffd23a";
      x.fillText("+10", p.x, p.y);
    });
  }

  /* ---- reglas ---- */
  function jump() {
    if (st === "ready") {
      newRun();
      st = "run";
    } else if (st === "dead") {
      if (run.t - run.deadAt < 24) return;
      newRun();
      st = "run";
      ev("retry", { rec });
    }
    if (run.y <= 1.5 && run.vy <= 0.01) {
      run.vy = 10.2;
      run.y = Math.max(run.y, 0.01);
      run.air = true;
      run.fast = false;
      beep(660, 0.06);
    } else run.buf = 9;
  }
  g._j = jump;
  g._fastOn = (on) => {
    if (st === "run" && run.y > 0) run.fast = !!on;
  };
  g._dbg = () => ({
    st,
    sc: run.sc,
    y: run.y,
    speed: run.speed,
    obs: run.obs.map((o) => ({ x: o.x, w: o.w, h: o.h })),
  });
  function step(dt) {
    run.t += dt;
    clouds.forEach((cl) => {
      cl.x -= (0.12 + run.speed * 0.04) * dt;
      if (cl.x < -60) cl.x = ANCHO + 20 + Math.random() * 60;
    });
    if (run.recT > 0) run.recT -= dt;
    run.pop = run.pop.filter((p) => ((p.y -= 0.5 * dt), (p.t -= dt)) > 0);
    run.dust = run.dust.filter((d) => ((d.x += d.vx * dt), (d.y += d.vy * dt), (d.t -= dt)) > 0);
    if (st !== "run") {
      if (st === "ready") run.off += 0.8 * dt;
      return;
    }
    run.speed = Math.min(9.4, run.speed + 0.0011 * dt);
    run.off += run.speed * dt;
    run.leg += run.speed * dt * 0.07;
    run.vy -= (run.fast && run.y > 0 ? 1.9 : 0.62) * dt;
    const wasAir = run.y > 0;
    run.y = Math.max(0, run.y + run.vy * dt);
    if (run.y === 0 && run.vy < 0) {
      run.vy = 0;
      run.fast = false;
      if (wasAir) {
        for (let i = 0; i < 4; i++)
          run.dust.push({
            x: X_KIXKI + 10 + i * 7,
            y: SUELO_Y - 2,
            vx: (i - 1.5) * 0.5,
            vy: -0.35,
            t: 14,
          });
        if (run.buf > 0) {
          run.buf = 0;
          run.vy = 10.2;
          run.y = 0.01;
          beep(660, 0.06);
        }
      }
    }
    if (run.buf > 0) run.buf -= dt;
    run.obs.forEach((o) => {
      o.x -= run.speed * dt;
      if (!o.p && o.x + o.w < X_KIXKI + 4) {
        o.p = 1;
        run.sc++;
        ev("score", { sc: run.sc, rec });
        if (!hit && best0 > 0 && run.sc > best0) {
          hit = true;
          rec = run.sc;
          guardar("kixki-rec", rec);
          run.recT = 90;
          ev("record", { sc: run.sc });
          beep(988, 0.12);
        }
        if (run.sc % 10 === 0) {
          run.flash = 10;
          run.pop.push({ x: X_KIXKI + 8, y: SUELO_Y - 70, t: 50 });
          beep(880, 0.1);
        }
      }
    });
    run.obs = run.obs.filter((o) => o.x + o.w > -12);
    const last = run.obs[run.obs.length - 1];
    if (!last || last.x + last.w < ANCHO - Math.max(60, run.speed * 33 * 0.85)) spawn();
    const bt = SUELO_Y - run.y,
      bl = X_KIXKI + 7,
      br = X_KIXKI + 31;
    if (run.obs.some((o) => br > o.x + 2 && bl < o.x + o.w - 2 && bt > SUELO_Y - o.h + 2)) {
      st = "dead";
      run.deadAt = run.t;
      rec = Math.max(rec, run.sc);
      guardar("kixki-rec", rec);
      beep(196, 0.25);
      ev("over", { sc: run.sc, rec, nr: run.sc > best0 && run.sc > 0, first });
    }
  }
  /* ---- bucle ---- */
  let lt = 0;
  (function L(t) {
    if (g.hidden) {
      g._raf = 0;
      return;
    }
    const dt = Math.min(2.5, lt && t ? (t - lt) / 16.667 : 1);
    lt = t || 0;
    if (!document.hidden) step(dt);
    const P = pal(),
      off = run.off;
    sky(P, dt);
    layer(off * 0.12, 84, 14, 46, 0.4, P.far);
    layer(off * 0.35, 100, 9, 64, 1.3, P.mid);
    trees(off * 0.35, P);
    layer(off * 0.6, 118, 5, 30, 2.1, P.near);
    farFence(off * 0.6, P);
    ground(off, P);
    run.obs.forEach((o) => fence(o, P));
    run.dust.forEach((d) => R(d.x, d.y, 3, 3, "#fff7e6"));
    sheep(P);
    if (run.flash > 0) {
      run.flash -= dt;
      x.globalAlpha = 0.18;
      R(0, 0, ANCHO, ALTO, "#ffffff");
      x.globalAlpha = 1;
    }
    hud(P);
    g._raf = requestAnimationFrame(L);
  })();
  ev("start", { rec });
}
