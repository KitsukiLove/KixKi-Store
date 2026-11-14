/*
  Botón «Leer más»: solo aparece si la descripción realmente se corta (fit).
*/

let cuadroPendiente, temporizadorResize;

/* Solo mide las apps de ventanas abiertas (las minimizadas están display:none y miden 0) y lo hace en dos pasadas:
   primero leer todo y luego escribir, para no forzar un recálculo de layout por cada app (eran ~124 por carga). */
export function fit() {
  if (cuadroPendiente) return;
  cuadroPendiente = requestAnimationFrame(() => {
    cuadroPendiente = 0;
    const ds = [...document.querySelectorAll(".cat:not(.min) .desc.clamp")],
      r = ds.map((d) => d.scrollHeight > d.clientHeight + 1);
    ds.forEach((d, i) => {
      d.nextElementSibling.hidden = !r[i];
    });
  });
}

export function iniciar() {
  cuadroPendiente = 0;
  fit();
  window.addEventListener("load", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener("resize", () => {
    clearTimeout(temporizadorResize);
    temporizadorResize = setTimeout(fit, 150);
  });
}
