/*
  Colina XP: estaciones, paletas y objetos del paisaje (árboles, calabazas, cabaña, valla…).
*/

import { actual } from "./estado.js";
import { hd, COLINA, hpath, XPDEFS, XPDEFS_X, XPDEFS2, XST } from "./formas.js";
import { puente } from "./puente.js";

let GL;

export const XPV = ["clasica", "primavera", "verano", "otono", "invierno", "halloween", "navidad"];

export const XPN = {
  es: ["Clásica", "Primavera", "Verano", "Otoño", "Invierno", "Halloween", "Navidad"],
  en: ["Classic", "Spring", "Summer", "Autumn", "Winter", "Halloween", "Christmas"],
};

export const xpv = () => (actual.XPS === "auto" ? puente.seasonKey(new Date()) : actual.XPS);

const cimaEn = (x) => crest(COLINA[2], x);

const redondear = (n) => +n.toFixed(2);

const circulo = (x, y, r, c, o) =>
  `<circle cx="${redondear(x)}" cy="${redondear(y)}" r="${redondear(r)}" fill="${c}"${o ? ` opacity="${o}"` : ""}/>`;

const rectRedondeado = (x, y, w, h, c, rx) =>
  `<rect x="${redondear(x)}" y="${redondear(y)}" width="${redondear(w)}" height="${redondear(h)}" fill="${c}"${rx ? ` rx="${redondear(rx)}"` : ""}/>`;

const elipse = (x, y, rx, ry_, c, o) =>
  `<ellipse cx="${redondear(x)}" cy="${redondear(y)}" rx="${redondear(rx)}" ry="${redondear(ry_)}" fill="${c}"${o ? ` opacity="${o}"` : ""}/>`;

const poligono = (pts, c, o) =>
  `<polygon points="${pts.map((p) => redondear(p[0]) + "," + redondear(p[1])).join(" ")}" fill="${c}"${o ? ` opacity="${o}"` : ""}/>`;

const linea = (d, c, w) =>
  `<path d="${d}" fill="none" stroke="${c}" stroke-width="${redondear(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;

const tRound = (x, s, a, b, sp, y = cimaEn(x) + 0.25) => {
  s *= 1.45;
  let o =
    rectRedondeado(x - 0.06 * s, y - 1 * s, 0.12 * s, 1.05 * s, "#5b3d22") +
    circulo(x - 0.5 * s, y - 1.25 * s, 0.62 * s, b) +
    circulo(x + 0.5 * s, y - 1.3 * s, 0.6 * s, b) +
    circulo(x, y - 1.75 * s, 0.8 * s, b) +
    circulo(x - 0.18 * s, y - 1.95 * s, 0.5 * s, a) +
    circulo(x + 0.32 * s, y - 1.62 * s, 0.4 * s, a, 0.9);
  if (sp)
    [
      [-0.5, -1.3],
      [0.1, -2],
      [0.55, -1.45],
      [-0.2, -1.55],
      [0.3, -1.8],
      [-0.6, -1.1],
    ].forEach((q) => {
      o += circulo(x + q[0] * s, y + q[1] * s, 0.1 * s, sp);
    });
  return `<g>${o}</g>`;
};

const tPine = (x, s, snow, lights, y = cimaEn(x) + 0.25) => {
  s *= 1.4;
  let o = rectRedondeado(x - 0.07 * s, y - 0.25 * s, 0.14 * s, 0.35 * s, "#4a3220");
  const W = [0.92, 0.74, 0.54],
    C = ["#1d6538", "#287a45", "#349150"],
    lc = ["#ff4d4d", "#ffd23a", "#4dd0ff", "#ff8fd0"];
  for (let j = 0; j < 3; j++) {
    const yb = y - 0.2 * s - j * 0.58 * s,
      w = W[j] * s,
      ya = yb - 1 * s;
    o += poligono(
      [
        [x - w, yb],
        [x, ya],
        [x + w, yb],
      ],
      C[j]
    );
    if (snow)
      o += poligono(
        [
          [x, ya],
          [x - w * 0.52, ya + 0.52 * s],
          [x - w * 0.2, ya + 0.4 * s],
          [x, ya + 0.55 * s],
          [x + w * 0.24, ya + 0.4 * s],
          [x + w * 0.52, ya + 0.52 * s],
        ],
        "#fff",
        0.95
      );
    if (lights)
      for (let q = 0; q < 3; q++) {
        const f = (q + 0.6) / 3.2,
          lx = x + (q % 2 ? 1 : -1) * w * (0.2 + f * 0.55) * (q === 1 ? 0.6 : 1),
          ly = ya + (yb - ya) * (0.35 + f * 0.5);
        GL.push(
          `<circle class="xl" cx="${redondear(lx)}" cy="${redondear(ly)}" r="${redondear(0.075 * s)}" fill="${lc[(j + q) % 4]}" style="--ld:${redondear((j * 3 + q) * 0.37)}s"/>`
        );
      }
  }
  if (lights)
    GL.push(
      `<circle class="xl" cx="${redondear(x)}" cy="${redondear(y - 0.2 * s - 2 * 0.58 * s - 1 * s)}" r="${redondear(0.13 * s)}" fill="#ffe27a" style="--ld:0s"/>`
    );
  return `<g>${o}</g>`;
};

const tBare = (x, s, col, snow, y = cimaEn(x) + 0.25) => {
  s *= 1.35;
  const B = [
    "M0 -1.1Q-.5 -1.3 -.95 -1.95",
    "M-.02 -1.6Q.35 -1.8 .75 -2.4",
    "M.02 -.95Q.5 -1.05 .9 -1.55",
    "M-.04 -.8Q-.4 -.85 -.8 -1.15",
    "M-.2 -1.8Q-.25 -2.1 -.2 -2.4",
  ];
  let o =
    `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})">` +
    linea("M0 0C0 -.8 -.04 -1.3 -.08 -2.1", col, 0.17) +
    B.map((d) => linea(d, col, 0.075)).join("");
  if (snow)
    o +=
      linea("M-.01 -1.2Q-.4 -1.38 -.82 -1.88", "#fff", 0.04) +
      linea("M-.01 -1.7Q.3 -1.85 .65 -2.28", "#fff", 0.04) +
      linea("M.03 -1.0Q.45 -1.1 .8 -1.5", "#fff", 0.04);
  return o + "</g>";
};

const tPump = (x, y, s) => {
  GL.push(
    `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})"><circle r="1.5" cy="-.45" fill="url(#xpgl)" opacity=".55"/>` +
      `<polygon class="xg" points="-.5,-.62 -.2,-.62 -.35,-.9" fill="#ffe066"/><polygon class="xg" points=".2,-.62 .5,-.62 .35,-.9" fill="#ffe066"/>` +
      `<path class="xg" d="M-.5 -.28Q0 .02 .5 -.28L.3 -.1L.15 -.28L0 -.08L-.15 -.28L-.3 -.1Z" fill="#ffe066"/></g>`
  );
  return (
    `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})">` +
    elipse(0, -0.45, 0.9, 0.68, "#d9631a") +
    elipse(-0.42, -0.45, 0.5, 0.66, "#ee8226") +
    elipse(0.42, -0.45, 0.5, 0.66, "#ee8226") +
    elipse(0, -0.45, 0.32, 0.68, "#f59a3a") +
    rectRedondeado(-0.07, -1.28, 0.14, 0.3, "#4b6a2a", 0.04) +
    "</g>"
  );
};

const tSnowman = (x, y, s) => (
  (s *= 1.3),
  `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})">` +
    elipse(0, 0.02, 0.8, 0.12, "#9fb4d6", 0.35) +
    circulo(0, -0.55, 0.55, "#fff") +
    circulo(0, -1.28, 0.4, "#fff") +
    circulo(0, -1.82, 0.3, "#fff") +
    rectRedondeado(-0.2, -2.3, 0.4, 0.34, "#222a44") +
    rectRedondeado(-0.34, -2.0, 0.68, 0.06, "#222a44") +
    circulo(-0.1, -1.86, 0.04, "#222a44") +
    circulo(0.1, -1.86, 0.04, "#222a44") +
    poligono(
      [
        [0, -1.78],
        [0.3, -1.74],
        [0, -1.7],
      ],
      "#ff8a1e"
    ) +
    rectRedondeado(-0.32, -1.58, 0.64, 0.12, "#6b3fe0", 0.05) +
    rectRedondeado(0.12, -1.52, 0.1, 0.34, "#6b3fe0", 0.04) +
    circulo(0, -1.2, 0.04, "#222a44") +
    circulo(0, -0.95, 0.04, "#222a44") +
    circulo(0, -0.7, 0.04, "#222a44") +
    linea("M-.38 -1.2L-.85 -1.55", "#5b3d22", 0.05) +
    linea("M.38 -1.2L.85 -1.5", "#5b3d22", 0.05) +
    "</g>"
);

const tCabin = (x, s, y = cimaEn(x) + 0.3) => {
  s *= 1.3;
  GL.push(
    `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})"><circle cx="-.5" cy="-.6" r=".7" fill="url(#xpgl)" opacity=".55"/><rect class="xw" x="-.72" y="-.78" width=".42" height=".4" fill="#ffd36e"/><rect class="xw" x=".28" y="-.78" width=".42" height=".4" fill="#ffd36e"/></g>` +
      `<g transform="translate(${redondear(x + 0.62 * s)} ${redondear(y - 1.9 * s)}) scale(${s})"><circle class="xsm" r=".16" fill="#fff" opacity="0" style="--ld:0s"/><circle class="xsm" r=".2" fill="#fff" opacity="0" style="--ld:1.6s"/><circle class="xsm" r=".14" fill="#fff" opacity="0" style="--ld:3.2s"/></g>`
  );
  return (
    `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})">` +
    rectRedondeado(0.42, -1.95, 0.26, 0.6, "#7a5a4a") +
    rectRedondeado(-1.1, -1.1, 2.2, 1.15, "#8a5a32") +
    rectRedondeado(-1.1, -0.75, 2.2, 0.05, "#6b4425") +
    rectRedondeado(-1.1, -0.45, 2.2, 0.05, "#6b4425") +
    poligono(
      [
        [-1.3, -1.08],
        [0, -2.0],
        [1.3, -1.08],
      ],
      "#7a2a2a"
    ) +
    poligono(
      [
        [-1.3, -1.08],
        [0, -2.0],
        [1.3, -1.08],
        [1.18, -1.08],
        [0, -1.84],
        [-1.18, -1.08],
      ],
      "#fff",
      0.95
    ) +
    rectRedondeado(-0.14, -0.68, 0.3, 0.7, "#4a2f18") +
    "</g>"
  );
};

const tStone = (x, s, y = cimaEn(x) + 0.35) => (
  (s *= 1.25),
  `<g transform="translate(${redondear(x)} ${redondear(y)}) scale(${s})"><path d="M-.34 0V-.7Q-.34 -1.05 0 -1.05Q.34 -1.05 .34 -.7V0Z" fill="#3b3350"/><path d="M-.34 0V-.7Q-.34 -1.05 0 -1.05Q.34 -1.05 .34 -.7" fill="none" stroke="#6a5f86" stroke-width=".05"/>${linea("M0 -.85V-.5M-.14 -.7H.14", "#6a5f86", 0.05)}</g>`
);

const tFence = (x0, n, y0, col) => {
  let o = "";
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 0.9,
      y = y0 + i * 0.0;
    o +=
      rectRedondeado(x, y - 0.9, 0.12, 0.9, col, 0.03) +
      poligono(
        [
          [x, y - 0.9],
          [x + 0.06, y - 1.03],
          [x + 0.12, y - 0.9],
        ],
        col
      );
  }
  return (
    o +
    rectRedondeado(x0 - 0.05, y0 - 0.65, n * 0.9, 0.08, col) +
    rectRedondeado(x0 - 0.05, y0 - 0.3, n * 0.9, 0.08, col)
  );
};

export function crest(L, x) {
  let x0 = L[0],
    y0 = L[1];
  for (let n = 2; n < L.length; n++) {
    const c = L[n];
    if (x <= c[4] || n === L.length - 1) {
      let lo = 0,
        hi = 1;
      for (let k = 0; k < 18; k++) {
        const t = (lo + hi) / 2,
          u = 1 - t,
          bx = u * u * u * x0 + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4];
        if (bx < x) lo = t;
        else hi = t;
      }
      const t = (lo + hi) / 2,
        u = 1 - t;
      return u * u * u * y0 + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5];
    }
    x0 = c[4];
    y0 = c[5];
  }
  return L[1];
}

export function xpScene(v) {
  GL = [];
  const sk = XPDEFS + XPDEFS_X;
  let sun = "",
    body = "",
    back = "";
  const sunAt = (x, y, r) =>
    `<circle class="xglow" cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#xpsun)"/><circle class="xs0" cx="${x}" cy="${y}" r="${r}"/><circle class="st" cx="${x}" cy="${y}" r="${r * 0.8}"/>`;
  if (v === "clasica") {
    sun = `<circle class="st" cx="44" cy="4.6" r="1.9"/>`;
  } else if (v === "primavera") {
    sun = sunAt(48, 5.4, 1.6, 1);
    body =
      tRound(9, 0.95, "#ffc9de", "#f59ac0", "#fff3f8") +
      tRound(14.5, 0.7, "#ffdcea", "#f7a8c8", "#fff") +
      tRound(47, 1.05, "#ffc9de", "#f59ac0", "#fff3f8") +
      tRound(53, 0.75, "#ffdcea", "#f7a8c8", "#fff") +
      tRound(41, 0.6, "#c9f09a", "#8fd56a");
    back =
      tRound(2.5, 0.7, "#ffc9de", "#f59ac0", "#fff3f8", crest(COLINA[0], 2.5) + 0.2) +
      tRound(60.5, 0.8, "#ffc9de", "#f59ac0", "#fff3f8", crest(COLINA[0], 60.5) + 0.2);
  } else if (v === "verano") {
    sun = sunAt(50, 6, 2.3, 1);
    body =
      tRound(10, 1, "#6cc04a", "#3c9a34") +
      tRound(15, 0.7, "#7ccf55", "#46a63a") +
      tRound(44, 1.15, "#6cc04a", "#3c9a34") +
      tRound(52, 0.8, "#7ccf55", "#46a63a") +
      tRound(57, 0.6, "#6cc04a", "#3c9a34");
    back =
      tRound(3, 0.7, "#5fb842", "#3a9232", crest(COLINA[0], 3) + 0.2) +
      tRound(61, 0.8, "#5fb842", "#3a9232", crest(COLINA[0], 61) + 0.2);
  } else if (v === "otono") {
    sun = sunAt(10, 9, 2.6, 1);
    body =
      tRound(10.5, 1.05, "#f2a23a", "#d9531e") +
      tRound(16, 0.75, "#f6c04a", "#e2802a") +
      tRound(43, 1.1, "#f4a83a", "#c9461a") +
      tRound(50, 0.8, "#f6c04a", "#e2802a") +
      tRound(55, 0.65, "#f2a23a", "#d9531e") +
      tBare(34, 0.8, "#4a3022");
    back =
      tRound(2.5, 0.7, "#f2a23a", "#d9531e", "", crest(COLINA[0], 2.5) + 0.2) +
      tRound(61, 0.8, "#f6c04a", "#e2802a", "", crest(COLINA[0], 61) + 0.2);
  } else if (v === "invierno") {
    sun = sunAt(14, 6.6, 1.5, 1);
    body =
      tPine(10, 1.15, 1, 0) +
      tPine(14.5, 0.8, 1, 0) +
      tPine(46, 1.15, 1, 0) +
      tPine(52, 0.85, 1, 0) +
      tBare(38, 0.85, "#4a3a34", 1) +
      tSnowman(50, cimaEn(50) + (31 - cimaEn(50)) * 0.34, 1.1);
    back =
      tPine(2.5, 0.7, 1, 0, crest(COLINA[0], 2.5) + 0.2) +
      tPine(61, 0.75, 1, 0, crest(COLINA[0], 61) + 0.2);
  } else if (v === "halloween") {
    sun = `<circle class="xglow" cx="46" cy="7.2" r="8.5" fill="url(#xpsun)"/><circle class="st" cx="46" cy="7.2" r="3.4"/><circle cx="44.7" cy="6.2" r=".7" fill="#e08a2a" opacity=".35"/><circle cx="47.4" cy="8.2" r="1" fill="#e08a2a" opacity=".3"/><circle cx="46.6" cy="5.4" r=".45" fill="#e08a2a" opacity=".3"/>`;
    body =
      tBare(12, 1.7, "#120a1e") +
      tStone(39.5, 0.8) +
      tStone(43, 0.95) +
      tStone(47, 0.75) +
      tFence(52, 5, cimaEn(54) + 0.5, "#1a1026") +
      tPump(20, cimaEn(20) + (30 - cimaEn(20)) * 0.34, 0.95) +
      tPump(28.5, cimaEn(28) + (30 - cimaEn(28)) * 0.42, 0.8) +
      tPump(36, cimaEn(36) + (30 - cimaEn(36)) * 0.5, 1.4) +
      tPump(51, cimaEn(51) + (31 - cimaEn(51)) * 0.5, 1.25) +
      tPump(59, cimaEn(59) + (31 - cimaEn(59)) * 0.5, 1.0);
    back = tBare(3, 0.9, "#120a1e", 0, crest(COLINA[0], 3) + 0.2);
  } else if (v === "navidad") {
    sun = `<circle class="xglow" cx="46" cy="6" r="6" fill="url(#xpsun)"/><circle class="st" cx="46" cy="6" r="1.9"/>`;
    body =
      tPine(10, 1.25, 1, 1) +
      tPine(15.5, 0.9, 1, 1) +
      tPine(43.5, 1.25, 1, 1) +
      tPine(50, 1.0, 1, 1) +
      tPine(56, 0.7, 1, 1) +
      tCabin(29.5, 0.8) +
      tSnowman(23.5, cimaEn(23) + (31 - cimaEn(23)) * 0.4, 0.9);
    back =
      tPine(2.5, 0.7, 1, 1, crest(COLINA[0], 2.5) + 0.2) +
      tPine(61, 0.75, 1, 1, crest(COLINA[0], 61) + 0.2);
  }
  return {
    smooth: 1,
    top: XST + sk + sun,
    bot:
      XPDEFS2 +
      hpath(COLINA[0], "t") +
      `<g class="xs">${back}</g>` +
      hpath(COLINA[1], "o") +
      hpath(COLINA[2], "xm") +
      `<path fill="url(#xpsh)" d="${hd(COLINA[2])}"/><g class="xs">${body}</g><g class="xgl">${GL.join("")}</g>` +
      hpath(COLINA[3], "xf"),
  };
}

export function iniciar() {
  /* ===== Colina XP · estaciones (parte 7c) =====
   Misma colina «Bliss» en las siete versiones (Clásica, Primavera, Verano, Otoño, Invierno, Halloween, Navidad).
   Cada una cambia paleta (día y noche), sol/luna y los objetos del paisaje. Las nubes, el viento, los pájaros y las
   partículas (pétalos, hojas, nieve, luciérnagas) los añade xpbg.js. Elegir: menú Inicio → «Estación» (o Auto = según la fecha). */

  if (actual.XPS !== "auto" && XPV.indexOf(actual.XPS) < 0) actual.XPS = "auto";

  GL = [];
  /* lo que brilla de noche (ventanas, caras, luces) va aparte para que no se oscurezca con el resto */
}
