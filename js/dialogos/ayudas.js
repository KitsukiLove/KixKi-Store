/*
  Ayudas para escribir frases: L() convierte «español || English» en pares y A() añade variantes sin repetir.
*/

const isPair = (x) =>
  Array.isArray(x) && x.length === 2 && typeof x[0] === "string" && typeof x[1] === "string";

export const L = (s) =>
  s
    .trim()
    .split("\n")
    .map((l) => l.split(" || ").map((x) => x.trim()))
    .filter((p) => p.length === 2 && p[0]);

export function A(o, k, pairs) {
  if (isPair(pairs)) pairs = [pairs];
  let cur = o[k];
  if (cur == null) cur = [];
  else if (isPair(cur)) cur = [cur];
  for (const p of pairs) if (!cur.some((q) => q[0] === p[0])) cur.push(p);
  o[k] = cur;
}
