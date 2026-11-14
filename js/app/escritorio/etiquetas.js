/*
  Etiquetas útiles de cada app, detectadas del texto de su descripción.
*/

/* Etiquetas útiles, detectadas del texto de cada descripción */
export function iniciar() {
  document.querySelectorAll(".app").forEach((a) => {
    const t = a.querySelector(".desc").textContent,
      b = [],
      m = t.match(/Android (\d+)\+/);
    if (/open source|código abierto/i.test(t)) b.push("Open source");
    if (/código cerrado/i.test(t)) b.push("Código cerrado");
    if (/sin anuncios/i.test(t)) b.push("Sin anuncios");
    if (/de pago/i.test(t)) b.push("De pago");
    if (m) b.push("Android " + m[1] + "+");
    if (/Shizuku/.test(t) && !/^Shizuku/.test(a.querySelector("h3").textContent))
      b.push("Compatible con Shizuku");
    if (b.length)
      a.querySelector(".line").insertAdjacentHTML(
        "afterend",
        `<div class="bdg">${b.map((x) => `<span>${x}</span>`).join("")}</div>`
      );
  });
}
