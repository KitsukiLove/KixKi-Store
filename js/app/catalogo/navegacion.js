/*
  Barra de pestañas: resalta la categoría visible (spy) al hacer scroll.
*/

import { nav } from "./catalogo.js";
let pills, curId, tick;

function spy() {
  tick = false;
  const y = innerHeight * 0.35;
  let cur = null;
  const secs = [...document.querySelectorAll(".cat")].filter((sec) => !sec.hidden);
  secs.forEach((sec) => {
    if (sec.getBoundingClientRect().top <= y) cur = sec;
  });
  if (secs.length && innerHeight + scrollY >= document.documentElement.scrollHeight - 4)
    cur = secs[secs.length - 1];
  const id = cur ? cur.id : null;
  if (id === curId) return;
  curId = id;
  pills.forEach((p) => p.classList.toggle("on", p.hash === "#" + id));
  const p = pills.find((p) => p.classList.contains("on"));
  if (p)
    nav.scrollTo({
      left: p.offsetLeft - (nav.clientWidth - p.offsetWidth) / 2,
      behavior: "smooth",
    });
}

export function iniciar() {
  /* Categoría activa en la barra al hacer scroll */
  pills = [...nav.querySelectorAll("a")];
  curId = null;
  tick = false;
  addEventListener(
    "scroll",
    () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(spy);
      }
    },
    { passive: true }
  );
  addEventListener("resize", spy);
  spy();
}
