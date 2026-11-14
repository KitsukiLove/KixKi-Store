/*
  Logos de las apps. Orden (pensado para añadir apps sin buscar logos):
   1) logo local de data/meta.json (lo baja `node tools/sync.mjs`)
   2) logo explícito de apps.json (campo "logo")
   3) logo de letras: logos/<app>.svg (lo crea sync.mjs) y, si aún no existe, uno que se dibuja aquí mismo.
  LOGO_REMOTO=true añade UNA sola petición al avatar de GitHub del autor antes de las letras (pone a un tercero a
  ver la visita). Por defecto está apagado: así la página no le pide nada a GitHub/Google por su cuenta.
*/

import { metaApps } from "./datos.js";
const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const LOGO_REMOTO = false;

const PXF = {
  A: "010101111101101",
  B: "110101110101110",
  C: "011100100100011",
  D: "110101101101110",
  E: "111100110100111",
  F: "111100110100100",
  G: "011100101101011",
  H: "101101111101101",
  I: "111010010010111",
  J: "001001001101010",
  K: "101101110101101",
  L: "100100100100111",
  M: "101111111101101",
  N: "110101101101101",
  O: "010101101101010",
  P: "110101110100100",
  Q: "010101101110011",
  R: "110101110101101",
  S: "011100010001110",
  T: "111010010010010",
  U: "101101101101111",
  V: "101101101101010",
  W: "101101111111101",
  X: "101101010101101",
  Y: "101101010010010",
  Z: "111001010100111",
};

function letterLogo(name) {
  /* mismo dibujo que tools/logos-letras.py (13x13, dos letras sobre un color); el tono usa otro hash, solo es el de emergencia */
  const words = (name.match(/[A-Za-z0-9]+/g) || []).flatMap((w) =>
    w.replace(/([a-z0-9])(?=[A-Z])/g, "$1 ").split(" ")
  );
  const L = words.map((w) => (w.replace(/[^A-Za-z]/g, "")[0] || "").toUpperCase()).filter(Boolean);
  const t =
    L.length >= 2 ? L[0] + L[1] : (name.replace(/[^A-Za-z]/g, "").toUpperCase() + "X").slice(0, 2);
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const bg = `hsl(${h} 55% 62%)`,
    dk = `hsl(${h} 50% 36%)`;
  const tile = "M1 0h11v1h-11zM1 12h11v1h-11zM0 1h13v11h-13z";
  let tx = "",
    sh = "";
  const on = new Set();
  [...t].forEach((ch, i) => {
    const r = PXF[ch] || PXF.X;
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 3; x++) if (r[y * 3 + x] === "1") on.add(3 + i * 4 + x + "," + (4 + y));
  });
  on.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    tx += `M${x} ${y}h1v1h-1z`;
    if (!on.has(x + "," + (y + 1))) sh += `M${x} ${y + 1}h1v1h-1z`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 13 13" shape-rendering="crispEdges"><path fill="${bg}" d="${tile}"/><path fill="#fff" fill-opacity=".22" d="M1 0h11v1h-11zM0 1h1v1h-1z"/><path fill="${dk}" d="${sh}"/><path fill="#fff" d="${tx}"/></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export function logos(a) {
  const s = slug(a[0]);
  if (metaApps.logos[s]) return [metaApps.logos[s]];
  const loc = "logos/" + s + ".svg",
    L = letterLogo(a[0]);
  if (a[5]) return [...a[5], loc, L];
  if (LOGO_REMOTO)
    for (const l of a[3]) {
      const m =
        l[1].match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/) ||
        l[1].match(/[?&]repo=([^\/&]+)\/([^&]+)/);
      if (m) return [`https://github.com/${m[1]}.png?size=160`, loc, L];
    }
  return [loc, L];
}
