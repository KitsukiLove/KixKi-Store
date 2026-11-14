/*
  Iconos pixel de los logros y de la interfaz de Kixki (ICON, ic, sprite).
*/

/* Nombre de la ovejita de abajo (cámbialo aquí si quieres darle otro) */
export const PET_NAME = ["Ovejita", "Little sheep"];

/* ---------- iconos de pixel art para los logros ---------- */
const ICON = {
  star: [
    "....g....",
    "....g....",
    "...ggg...",
    "ggggggggg",
    ".ggggggg.",
    "..ggggg..",
    "..gg.gg..",
    ".gg...gg.",
    ".g.....g.",
  ],
  folder: [
    ".hhhh....",
    "hhhhhhhhh",
    "hgggggggh",
    "hgggggggh",
    "hgggggggh",
    "hgggggggh",
    "hgggggggh",
    "hhhhhhhhh",
  ],
  search: [
    ".cccc....",
    "c....c...",
    "c....c...",
    "c....c...",
    ".cccc....",
    ".....hh..",
    "......hh.",
    ".......hh",
  ],
  heart: [
    ".pp...pp.",
    "pppp.pppp",
    "ppppppppp",
    "ppppppppp",
    ".ppppppp.",
    "..ppppp..",
    "...ppp...",
    "....p....",
  ],
  trophy: [
    "ggggggggg",
    "g.ggggg.g",
    "g.ggggg.g",
    ".ggggggg.",
    "..ggggg..",
    "...ggg...",
    "....g....",
    "...hhh...",
    "..hhhhh..",
  ],
  moon: [
    "..vvvv...",
    ".vvv.....",
    "vvv......",
    "vvv......",
    "vvv......",
    "vvv......",
    ".vvv.....",
    "..vvvvvv.",
    "...vvvv..",
  ],
  note: [
    "...nnnnn.",
    "...n...n.",
    "...n...n.",
    "...n...n.",
    "...n...n.",
    ".nnn.nnn.",
    "nnnn.nnnn",
    "nnnn.nnnn",
  ],
  crown: ["g...g...g", "gg.ggg.gg", "ggggggggg", "ggggggggg", "ghghghghg", "hhhhhhhhh"],
  bolt: [
    "....ggg..",
    "...ggg...",
    "..ggg....",
    ".ggggggg.",
    "....ggg..",
    "...ggg...",
    "..gg.....",
    ".g.......",
  ],
  key: [
    ".gggg....",
    "g....g...",
    "g....g...",
    ".gggg....",
    "..g......",
    "..gg.....",
    "..g......",
    "..gg.....",
  ],
  gift: [
    "..pp.pp..",
    ".p..p..p.",
    "....p....",
    "rrrrprrrr",
    "rwwwpwwwr",
    "rwwwpwwwr",
    "rrrrprrrr",
    "rwwwpwwwr",
    "rrrrrrrrr",
  ],
  drop: [
    "....c....",
    "...ccc...",
    "...ccc...",
    "..ccccc..",
    ".ccccccc.",
    ".ccwcccc.",
    ".ccccccc.",
    "..ccccc..",
  ],
  globe: [
    "..nnnnn..",
    ".nnwwnnn.",
    "nnwnnnnnn",
    "nnnnwwnnn",
    "nnnnnwnnn",
    "nnnnnnnnn",
    ".nnnnnnn.",
    "..nnnnn..",
  ],
  sheep: [
    "..wwwww..",
    ".wwwwwww.",
    "dwwwwwwwd",
    "dfffffffd",
    ".fefffef.",
    ".fffpfff.",
    "..fffff..",
    "...f.f...",
  ],
  ghost: [
    "..wwwww..",
    ".wwwwwww.",
    ".wewwwew.",
    ".wwwwwww.",
    ".wwwmwww.",
    ".wwwwwww.",
    ".ww.w.ww.",
  ],
  jump: [
    "....a....",
    "...aaa...",
    "..aaaaa..",
    ".aaaaaaa.",
    "...aaa...",
    "...aaa...",
    "...aaa...",
    "ooooooooo",
  ],
  tag: ["aaaaaa...", "aaaaaaa..", "aaa.aaaa.", "aaaaaaaaa", "aaaaaaaa.", "aaaaaaa..", "aaaaaa..."],
  bucket: [
    ".kkkkkkk.",
    "kcwcccwck",
    "klllllllk",
    ".klllllk.",
    ".klllllk.",
    "..klllk..",
    "..kkkkk..",
  ],
  flameA: [
    "....x....",
    "...xx..x.",
    "..xxx.xx.",
    ".xxyxxxx.",
    ".xxyyxxx.",
    "xxyyyyxxx",
    "xxyyyyyxx",
    ".xxyyyxx.",
    "..xxxxx..",
  ],
  flameB: [
    ".....x...",
    ".x...xx..",
    ".xx.xxx..",
    ".xxxxyxx.",
    ".xxxyyxx.",
    "xxxyyyyxx",
    "xxyyyyyxx",
    ".xxyyyxx.",
    "..xxxxx..",
  ],
  q: ["..aaaaa..", ".aa...aa.", "......aa.", ".....aa..", "....aa...", ".........", "....aa..."],
};

export function icono(name, px, cls) {
  const rows = ICON[name] || ICON.star,
    m = {};
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let x2 = x + 1;
      while (x2 < row.length && row[x2] === c) x2++;
      (m[c] = m[c] || []).push(`M${x} ${y}h${x2 - x}v1h-${x2 - x}z`);
      x = x2;
    }
  });
  const w = Math.max(...rows.map((r) => r.length));
  return `<svg class="kq-i ${cls || ""}" viewBox="0 0 ${w} ${rows.length}" width="${w * px}" height="${rows.length * px}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(
    m
  )
    .map((c) => `<path class="q-${c}" d="${m[c].join("")}"/>`)
    .join("")}</svg>`;
}

export function sprite(rows, px, cls) {
  /* la misma paleta que Kixki (clases k-*) */
  const m = {};
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let x2 = x + 1;
      while (x2 < row.length && row[x2] === c) x2++;
      (m[c] = m[c] || []).push(`M${x} ${y}h${x2 - x}v1h-${x2 - x}z`);
      x = x2;
    }
  });
  return `<svg class="${cls || ""}" viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length * px}" height="${rows.length * px}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(
    m
  )
    .map((c) => `<path class="k-${c}" d="${m[c].join("")}"/>`)
    .join("")}</svg>`;
}
