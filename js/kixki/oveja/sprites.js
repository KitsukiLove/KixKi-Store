/*
  Sprites de Kixki (20×15 px, mira a la derecha) y svg() que los convierte en dibujo vectorial.
*/

const R11 = ".swwwwwwwwwwwwbb....";

const R12 = "..ssssssssssss......";

/* ---------- sprites (20×15, miran a la derecha) ----------
   w lana · s sombra de lana · f cara · d oreja · e ojo · g brillo · p nariz · c mejilla · m boca
   a bufanda · b sombra de bufanda · y estrella · l pezuña */
const TOP = [
  "................y...",
  "...............yyy..",
  "....www.....wwwywww..".slice(0, 20),
  "..wwwwwww.wwwwwwwww.",
  ".wwwwwwwwwwwwwwwwww.",
  ".wwwwwwwwwwwwwwwwww.",
];

/* (parte 2) cara más pequeña: 4×4 px en vez de 6×7, y más lana alrededor */
const R6 = {
  open: "wwwwwwwwwwwwwwdfgef.",
  blink: "wwwwwwwwwwwwwwdffff.",
  happy: "wwwwwwwwwwwwwwdffef.",
};

const R7 = {
  open: "wwwwwwwwwwwwwwdfeef.",
  blink: "wwwwwwwwwwwwwwdfeef.",
  happy: "wwwwwwwwwwwwwwdfefe.",
};

const R8 = "wwwwwwwwwwwwwwwcfpf.";

const R9 = { idle: "wwwwwwwwwwwaaaaafff.", open: "wwwwwwwwwwwaaaaafmf." };

const R10 = { idle: "swwwwwwwwwwwabbbb...", open: "swwwwwwwwwwwabbbb..." };

const LEG = {
  a: ["...ll..ll...........", "...ll..ll..........."],
  b: ["..ll....ll..........", "..ll....ll.........."],
  c: ["....ll..ll..........", "....ll..ll.........."],
  j: ["....l....l..........", "...................."],
};

const armar = (eye, mouth, leg) => [
  ...TOP,
  R6[eye],
  R7[eye],
  R8,
  R9[mouth],
  R10[mouth],
  R11,
  R12,
  ...LEG[leg],
];

export const FOTOGRAMAS = {
  idle: armar("open", "idle", "a"),
  blink: armar("blink", "idle", "a"),
  talk: armar("open", "open", "a"),
  walkB: armar("open", "idle", "b"),
  walkC: armar("open", "idle", "c"),
  jump: armar("open", "open", "j"),
  happy: armar("happy", "open", "a"),
  sleep: armar("blink", "idle", "a"),
};

const PIXEL = 3;

export function svg(rows, name) {
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
  return `<svg class="kk-f f-${name}" viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length * PIXEL}" height="${rows.length * PIXEL}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(
    m
  )
    .map((c) => `<path class="k-${c}" d="${m[c].join("")}"/>`)
    .join("")}</svg>`;
}
