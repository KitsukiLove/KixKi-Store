/*
  Medidas del juego de las vallas, textos, cuerpo y patas de Kixki y paletas de día y de noche.
*/

let root;

export const ANCHO = 480;

export const ALTO = 160;

export const SUELO_Y = 132;

export const X_KIXKI = 56;

const esIngles = () => window.KXI && KXI.lang === "en";

const TEXTOS = {
  ready: ["Toca, espacio o ↑ para empezar", "Tap, space or ↑ to start"],
  dead: ["¡Auch! Toca para reintentar", "Ouch! Tap to retry"],
  best: ["récord", "best"],
  nr: ["¡NUEVO RÉCORD!", "NEW RECORD!"],
};

export const texto = (k) => TEXTOS[k][esIngles() ? 1 : 0];

export const hs = (n) => {
  n = Math.imul((n | 0) ^ 61, 0x27d4eb2d) ^ (n >>> 15);
  n = Math.imul(n ^ (n >>> 13), 0x85ebca6b);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
};

export const BODY = [
  "...wwww.www.wwww..",
  "..wwwwwwwwwwwwwwf.",
  ".wwwwwwwwwwwwwfff.",
  "wwwwwwwwwwwwwfeff.",
  "wwwwwwwwwwwwwffff.",
  "wwwwwwwwwwwwwfppf.",
  "gwwwwwwwwwwww.ff..",
  ".gwwwwwwwwwww.....",
  "..gggggggggg......",
];

export const LEGS = {
  a: ["...f.f....f.f.....", "...f.f....f.f....."],
  b: ["....f.f....f.f....", "....f.f....f.f...."],
  j: ["....ff....ff......", "................."],
};

export const COLORES_KIXKI = {
  w: "#fff7e6",
  f: "#f2a574",
  e: "#2b1a5e",
  p: "#ff8fc7",
  g: "#cdbdf2",
};

const DAY = {
  sky: ["#a9c8ff", "#c3d8ff", "#dbe6ff", "#f0eaff"],
  sun: "#ffd66b",
  sun2: "#fff0b3",
  far: "#b9a6f0",
  mid: "#8fdcae",
  near: "#6ccf92",
  tree: "#3f9d6b",
  trunk: "#7a4f2a",
  grass: "#52c27c",
  grass2: "#3fa86a",
  soil: "#8a6a4a",
  soil2: "#6f5238",
  cloud: "#ffffff",
  fl: ["#ff8fc7", "#ffd23a", "#ffffff", "#b79bff"],
  stone: "#a79c8c",
  farfence: "#7fb89a",
};

const NIGHT = {
  sky: ["#150c33", "#1f1450", "#2e1d73", "#3d2a8f"],
  sun: "#f4f0ff",
  sun2: "#cfc6f5",
  far: "#2a1a66",
  mid: "#1e5a58",
  near: "#1a7a5a",
  tree: "#124a42",
  trunk: "#3a2614",
  grass: "#1c7a56",
  grass2: "#16604a",
  soil: "#4a3a34",
  soil2: "#392c28",
  cloud: "#4a3f8f",
  fl: ["#ff8fc7", "#ffd23a", "#d9d3ff", "#9a7bff"],
  stone: "#6b6275",
  farfence: "#2f7a63",
  star: "#fff7c8",
};

export function pal() {
  const dark = root.getAttribute("data-theme") === "dark",
    bg = root.getAttribute("data-bg") || "";
  let p = dark || bg === "halloween" ? NIGHT : DAY;
  if (bg === "halloween")
    p = Object.assign({}, p, {
      sun: "#ff9a2e",
      sun2: "#ffc46b",
      tree: "#0f3a35",
      grass: "#2d6a3a",
      grass2: "#235530",
      fl: ["#ff8a1e", "#ffd23a", "#ff8a1e", "#b79bff"],
    });
  else if (bg === "invierno")
    p = Object.assign(
      {},
      p,
      dark
        ? {
            mid: "#41558a",
            near: "#5a70a8",
            grass: "#9db4e0",
            grass2: "#7f97c9",
            soil: "#6c7aa0",
            soil2: "#56638a",
            tree: "#2c4a7a",
          }
        : {
            mid: "#dfe8ff",
            near: "#eef3ff",
            grass: "#ffffff",
            grass2: "#dfe8ff",
            soil: "#9fb0d8",
            soil2: "#8798c4",
            tree: "#6f9cc8",
            fl: ["#9fd3ff", "#ffffff", "#bcd2ff", "#ffffff"],
          }
    );
  else if (bg === "otono")
    p = Object.assign({}, p, {
      tree: dark ? "#a8541a" : "#e2802a",
      mid: dark ? "#3a4a2c" : "#cfd88a",
      near: dark ? "#44532c" : "#b3c46a",
      grass: dark ? "#4a6a2c" : "#9ab34e",
      grass2: dark ? "#3a5424" : "#7f9a3c",
      fl: ["#e8742c", "#ffd23a", "#c4560f", "#ffb067"],
    });
  return p;
}

export function iniciar() {
  /* tamaño lógico, suelo y posición de la oveja */
  root = document.documentElement;

  /* oveja (igual que la del resto de la página) */

  /* paletas */
}
