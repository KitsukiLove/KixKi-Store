/*
  Burbujas decorativas del escritorio.
*/

import { spr } from "../arte/sprites.js";

const RING = [".xxx.", "x...x", "x...x", "x...x", ".xxx."];

export function iniciar() {
  for (let i = 0; i < 12; i++)
    document.body.insertAdjacentHTML(
      "beforeend",
      `<i class="bub" style="left:${(i * 83 + 11) % 97}%;--d:${22 + ((i * 7) % 19)}s;--dl:-${(i * 5) % 20}s">${spr(RING, 2 + (i % 3))}</i>`
    );
}
