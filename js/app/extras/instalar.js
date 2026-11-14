/*
  Guarda el evento «beforeinstallprompt» del navegador para ofrecer «Instalar» en el menú de ajustes (PWA).
*/

import { $ } from "../../core/util.js";
export let eventoInstalar;

export const olvidarEventoInstalar = () => {
  eventoInstalar = null;
};

export function iniciar() {
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    eventoInstalar = e;
    $("#s-inst").hidden = false;
  });
}
