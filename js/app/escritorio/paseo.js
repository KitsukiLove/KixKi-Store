/*
  La oveja de la barra pasea de día y duerme de noche. Publica window.KXPET (x, dirección, hold) para Kixki.
*/

import { DSK, root } from "./vista.js";
let pet, imagenOveja, posicionX, direccion;

export function iniciar() {
  pet = document.getElementById("pet");
  imagenOveja = pet.firstElementChild;
  posicionX = 260;
  direccion = 1;
  setInterval(() => {
    if (document.hidden || !DSK() || (window.KXPET && KXPET.hold))
      return; /* KXPET.hold: Kixki está charlando con ella (kixki2.js) */
    if (root.getAttribute("data-theme") === "dark") {
      imagenOveja.style.transform = "";
      return;
    }
    posicionX += direccion * 3;
    const mx = innerWidth - 130;
    if (posicionX > mx) {
      posicionX = mx;
      direccion = -1;
    }
    if (posicionX < 120) {
      posicionX = 120;
      direccion = 1;
    }
    pet.style.transform = `translateX(${posicionX}px)`;
    imagenOveja.style.transform = direccion < 0 ? "scaleX(-1)" : "";
  }, 120);
  /* (kixki2.js) x y dirección de la ovejita, para que pueda correr cuando se incendia */
  Object.defineProperties((window.KXPET = window.KXPET || { hold: false }), {
    x: {
      get: () => posicionX,
      set: (v) => {
        posicionX = v;
      },
      configurable: true,
    },
    dir: {
      get: () => direccion,
      set: (v) => {
        direccion = v;
      },
      configurable: true,
    },
  });
}
