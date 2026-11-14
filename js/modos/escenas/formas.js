/*
  Piezas para dibujar los fondos en pixel art (rectángulos, colinas, discos) y sus paletas.
*/

export let ST, XST, XPDEFS2;

export const rect = (x, y, w, h, c) =>
  `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;

export const hill = (y, a, p, ph, c) => {
  let s = "";
  for (let x = 0; x < 64; x++) s += rect(x, Math.round(y + a * Math.sin(x / p + ph)), 1, 40, c);
  return s;
};

export const disc = (cx, cy, r, c) => {
  let s = "";
  for (let y = -r; y <= r; y++) {
    const w = Math.floor(Math.sqrt(r * r - y * y));
    s += rect(cx - w, cy + y, 2 * w + 1, 1, c);
  }
  return s;
};

const rectSinClase = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;

export const cloud = (x, y) =>
  `<g class="c pcl" style="--cd:${200 + ((x * 7 + y * 13) % 140)}s;--cl:-${(x * 29 + y * 17) % 200}s">` +
  rectSinClase(x, y + 1, 7, 2) +
  rectSinClase(x + 1, y, 4, 1) +
  rectSinClase(x + 3, y - 1, 2, 1) +
  "</g>";

export const pine = (x, y, h) => {
  let s = rect(x, y + h, 1, 2, "t");
  for (let j = 0; j < h; j++) {
    const k = (j / 2) | 0;
    s += rect(x - k, y + j, 1 + 2 * k, 1, "p");
  }
  return (
    s + rect(x, y + 3, 1, 1, "o") + rect(x - 1, y + 7, 1, 1, "o") + rect(x + 1, y + 6, 1, 1, "o")
  );
};

export const pump = (x, y) =>
  rect(x, y + 1, 5, 3, "o") +
  rect(x + 1, y, 3, 1, "o") +
  rect(x + 2, y - 1, 1, 1, "t") +
  rect(x + 1, y + 2, 1, 1, "k") +
  rect(x + 3, y + 2, 1, 1, "k");

export const bat = (x, y) =>
  rect(x, y, 1, 1, "k") +
  rect(x + 4, y, 1, 1, "k") +
  rect(x + 2, y, 1, 1, "k") +
  rect(x + 1, y + 1, 3, 1, "k");

export const dead = (x, y) =>
  rect(x, y, 2, 14, "k") +
  rect(x - 4, y + 3, 4, 1, "k") +
  rect(x - 4, y + 1, 1, 3, "k") +
  rect(x + 2, y + 5, 5, 1, "k") +
  rect(x + 6, y + 2, 1, 4, "k");

export const tree = (x, y, r, c) => rect(x, y + r, 1, 6, "t") + disc(x, y, r, c);

export const flower = (x, y, c) => rect(x, y, 1, 1, c) + rect(x, y + 1, 1, 1, "p");

export const sunf = (x, y) =>
  rect(x - 1, y, 3, 3, "o") + rect(x, y + 1, 1, 1, "t") + rect(x, y + 3, 1, 4, "p");

export const COLINA = [
  [0, 24.5, [9, 21.5, 20, 20.4, 32, 21.6], [44, 22.8, 54, 23.4, 64, 21.4]],
  [0, 27, [10, 23, 22, 21.2, 36, 22.4], [50, 23.6, 56, 25.6, 64, 23.6]],
  [0, 29, [7, 20.5, 18, 14.8, 30, 15], [42, 15.2, 53, 20.6, 64, 25.4]],
  [0, 35, [12, 30.5, 30, 29.6, 46, 31.4], [54, 32.3, 60, 34, 64, 33.2]],
];

export const hd = (L) =>
  `M${L[0]} ${L[1]}` +
  L.slice(2)
    .map((c) => "C" + c.join(" "))
    .join("") +
  "V40H0Z";

export const hpath = (L, c) => `<path class="${c}" d="${hd(L)}"/>`;

export const XPDEFS = `<defs><radialGradient id="xpcl"><stop offset="0" class="xcs"/><stop offset=".55" class="xcs" stop-opacity=".9"/><stop offset="1" class="xcs" stop-opacity="0"/></radialGradient></defs>`;

export const XPDEFS_X = `<defs><radialGradient id="xpcs"><stop offset="0" stop-color="#4a5468"/><stop offset=".6" stop-color="#586277" stop-opacity=".85"/><stop offset="1" stop-color="#586277" stop-opacity="0"/></radialGradient><radialGradient id="xpsun"><stop offset="0" class="xsa" stop-opacity=".95"/><stop offset=".3" class="xsa" stop-opacity=".5"/><stop offset="1" class="xsa" stop-opacity="0"/></radialGradient><radialGradient id="xpgl"><stop offset="0" stop-color="#ffb44a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a1e" stop-opacity="0"/></radialGradient></defs>`;

export function iniciar() {
  /* cada nube es un grupo: pxbg.css la hace cruzar el cielo a su ritmo (cd = duración, cl = punto de partida) */

  ST = [
    [4, 3],
    [12, 8],
    [20, 2],
    [27, 10],
    [35, 4],
    [44, 9],
    [52, 3],
    [58, 11],
    [8, 14],
    [40, 15],
    [61, 6],
    [31, 16],
  ]
    .map(([x, y], j) => rect(x, y, 1, 1, "st tw" + (j % 3)))
    .join("");
  /* geometría de la Colina XP: cada capa = [x0,y0, curva, curva…] con curvas cúbicas [c1x,c1y,c2x,c2y,x,y]; viewBox 64x40 */

  XST = (() => {
    let o = "",
      a = 7;
    const r = () => (a = (a * 16807) % 2147483647) / 2147483647;
    for (let j = 0; j < 52; j++)
      o += `<circle class="st" cx="${(r() * 64).toFixed(1)}" cy="${(r() * 17).toFixed(1)}" r="${(0.06 + r() * 0.12).toFixed(2)}"/>`;
    return o;
  })();

  XPDEFS2 =
    `<defs><linearGradient id="xph" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" class="xa"/><stop offset=".5" class="xb"/><stop offset="1" class="xc"/></linearGradient>` +
    `<linearGradient id="xpf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="xb"/><stop offset="1" class="xc"/></linearGradient>` +
    `<linearGradient id="xpsh" x1="0" y1="0" x2=".55" y2=".85"><stop offset="0" class="xp" stop-opacity=".7"/><stop offset=".55" class="xp" stop-opacity=".12"/><stop offset="1" class="xp" stop-opacity="0"/></linearGradient></defs>`;
}
