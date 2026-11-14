/*
  ¿El escritorio se muestra como PC o como móvil? (guardado en «kixki-view», o automático por ancho de pantalla).
*/

import { leerTexto } from "../../core/store.js";
export const root = document.documentElement,
  DSK = () => {
    const v = leerTexto("kixki-view");
    return v === "pc" ? true : v === "movil" ? false : matchMedia("(min-width:1000px)").matches;
  };
