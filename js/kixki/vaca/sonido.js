/*
  Sonidos del combate: pitidos, mugido y «bonk».
*/

const beep = (f, d) => {
  try {
    if (window.KXS) KXS.beep(f, d);
  } catch (e) {
    // El sonido es opcional: si el audio aún no está listo se omite.
  }
};

export const moo = () => {
  beep(150, 0.16);
  setTimeout(() => beep(120, 0.2), 150);
  setTimeout(() => beep(94, 0.3), 340);
};

export const bonk = () => {
  beep(240, 0.05);
  setTimeout(() => beep(150, 0.09), 55);
};

export const pip = (f) => beep(f || 520, 0.04);

export function iniciar() {
  /* ---------- sonido (usa el de la tienda; respeta el interruptor de «Efectos») ---------- */
}
