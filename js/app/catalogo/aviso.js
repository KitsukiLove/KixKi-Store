/*
  Aviso temporal (toast) en pantalla.
*/

let toastEl, temporizadorAviso;

export function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

/* Avisos */
export function iniciar() {
  toastEl = document.getElementById("toast");
}
