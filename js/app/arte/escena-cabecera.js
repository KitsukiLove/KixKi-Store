/*
  Escena pixel de la cabecera: cielo, estrellas, luna/sol, nubes, colinas y la oveja.
*/

import { CLOUD, CLOUD2, rects, SHEEP } from "./sprites.js";
/* ========= ESCENA DE LA CABECERA ========= */
export function iniciar() {
  const W = 64,
    H = 34,
    el = document.getElementById("scene-art");
  let s = "";
  const R = (x, y, w, h, c) => {
    s += `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  };
  // cielo en franjas, como en los juegos de 16 bits
  [0, 7, 12, 16, 20, 23].forEach((y, i) => R(0, y, W, H - y, "sk" + (i + 1)));
  // estrellas (en 6 grupos que titilan a destiempo: 6 animaciones en vez de 28, mucho más ligero para el celular)
  s += `<g class="stars">`;
  const stG = [[], [], [], [], [], []];
  [
    [4, 3],
    [10, 9],
    [18, 4, 1],
    [25, 8],
    [31, 2],
    [33, 5, 1],
    [42, 12],
    [58, 12],
    [61, 4],
    [14, 14],
    [51, 3],
    [8, 17],
    [34, 15],
    [60, 17],
    [22, 13],
    [2, 10],
    [15, 2],
    [28, 13],
    [55, 2, 1],
    [62, 9],
    [20, 10],
    [7, 6, 1],
    [47, 8],
    [50, 15],
    [12, 12],
    [57, 7],
    [26, 3],
    [38, 13],
  ].forEach(([x, y, big], i) => {
    let t = `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    if (big)
      t += `<rect x="${x - 1}" y="${y}" width="3" height="1"/><rect x="${x}" y="${y - 1}" width="1" height="3"/>`;
    stG[(i * 13) % 6].push(t);
  });
  stG.forEach((g, j) => {
    s += `<g class="tw" style="animation-delay:-${(j * 0.53).toFixed(2)}s">${g.join("")}</g>`;
  });
  s += `</g>`;
  // luna (noche) y sol (día)
  s += `<g class="moon">`;
  for (let dy = -4; dy <= 4; dy++)
    for (let dx = -4; dx <= 4; dx++) {
      if (dx * dx + dy * dy <= 17 && !((dx - 2) * (dx - 2) + (dy + 1) * (dy + 1) <= 13))
        s += `<rect x="${40 + dx}" y="${6 + dy}" width="1" height="1"/>`;
    }
  s += `</g><g class="sun">`;
  for (let dy = -3; dy <= 3; dy++)
    for (let dx = -3; dx <= 3; dx++) {
      if (dx * dx + dy * dy <= 10) s += `<rect x="${40 + dx}" y="${6 + dy}" width="1" height="1"/>`;
    }
  [
    [0, -5],
    [0, 5],
    [-5, 0],
    [5, 0],
    [-4, -4],
    [4, -4],
    [-4, 4],
    [4, 4],
  ].forEach(([dx, dy]) => {
    s += `<rect x="${40 + dx}" y="${6 + dy}" width="1" height="1"/>`;
  });
  s += `</g>`;
  // nubes (día)
  s += `<g class="clouds">`;
  [
    [CLOUD, 5, 100, 20, 6],
    [CLOUD, 11, 150, 90, 30],
    [CLOUD2, 2, 70, 45, 40],
  ].forEach(([rows, y, dur, delay, x0]) => {
    s += `<g class="cl" style="--x0:${x0}px;animation-duration:${dur}s;animation-delay:-${delay}s">${rects(rows, 0, y)}</g>`;
  });
  s += `</g>`;
  // colinas
  const run = (fn, cls, full) => {
    let x = 0;
    while (x < W) {
      const y = fn(x);
      let x2 = x + 1;
      while (x2 < W && fn(x2) === y) x2++;
      R(x, y, x2 - x, full ? H - y : 1, cls);
      x = x2;
    }
  };
  const back = (x) => Math.round(19 + 3.5 * Math.sin(x / 7 + 0.6) + 1.4 * Math.sin(x / 2.6));
  const gy = (x) => 27 - Math.round(Math.max(0, Math.abs(x - 46) - 9) * 0.2);
  run(back, "hb", true);
  run(gy, "hf", true);
  run(gy, "gr", false);
  for (let x = 1; x < W; x++)
    if ((x * 5) % 7 === 0 && (x < 36 || x > 55)) R(x, gy(x) - 1, 1, 1, "gr");
  [
    [8, "fp"],
    [12, "fy"],
    [31, "fy"],
    [34, "fp"],
    [58, "fp"],
    [61, "fy"],
  ].forEach(([x, c]) => R(x, gy(x) - 1, 1, 1, c));
  // la oveja
  s += rects(SHEEP, 37, 16);
  el.innerHTML = s;
  const sc = el.closest(".scene");
  if (sc && "IntersectionObserver" in window)
    new IntersectionObserver((es) =>
      es.forEach((x) => sc.classList.toggle("off", !x.isIntersecting))
    ).observe(sc);
}
