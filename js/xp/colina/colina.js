/*
  Geometría de la colina (la misma que dibuja scenes.js): cresta, alturas y trozos de pantalla.
*/

export let COLINA;

const FALLBACK = [
  [0, 24.5, [9, 21.5, 20, 20.4, 32, 21.6], [44, 22.8, 54, 23.4, 64, 21.4]],
  [0, 27, [10, 23, 22, 21.2, 36, 22.4], [50, 23.6, 56, 25.6, 64, 23.6]],
  [0, 29, [7, 20.5, 18, 14.8, 30, 15], [42, 15.2, 53, 20.6, 64, 25.4]],
  [0, 35, [12, 30.5, 30, 29.6, 46, 31.4], [54, 32.3, 60, 34, 64, 33.2]],
];

export const hdp = (L) =>
  `M${L[0]} ${L[1]}` +
  L.slice(2)
    .map((c) => "C" + c.join(" "))
    .join("") +
  "V40H0Z";

export const MAIN = [];

const TOP = [];

export const at = (T, x) => {
  const f = Math.max(0, Math.min(64, x)) * 2,
    i = Math.floor(f),
    j = Math.min(128, i + 1);
  return T[i] + (T[j] - T[i]) * (f - i);
};

function crest(L, x) {
  let x0 = L[0],
    y0 = L[1];
  for (let i = 2; i < L.length; i++) {
    const c = L[i];
    if (x <= c[4] || i === L.length - 1) {
      let lo = 0,
        hi = 1;
      for (let k = 0; k < 16; k++) {
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

/* dónde cae la colina en pantalla: el SVG .bot mide max(100%,640px) de ancho, va centrado y pegado abajo (viewBox 64x40) */
function geom() {
  const w = Math.max(innerWidth, 640);
  return { u: w / 64, left: (innerWidth - w) / 2, vh: innerHeight };
}

export function hillY(xPx) {
  const g = geom();
  return g.vh - (40 - at(TOP, (xPx - g.left) / g.u)) * g.u;
}

export function iniciar() {
  /* ---- geometría de la colina (la misma que dibuja scenes.js) ---- */

  COLINA = (window.KXB && KXB.hill) || FALLBACK;

  /* tablas (x de 0 a 64 en pasos de .5): cima de la colina principal y cima visible (la más alta de todas las capas) */

  for (let i = 0; i <= 128; i++) {
    const x = i / 2;
    MAIN.push(crest(COLINA[2], x));
    TOP.push(
      Math.min.apply(
        null,
        COLINA.map((L) => crest(L, x))
      )
    );
  }
}
