/*
  Memoria de los consejos («kixki-k4») y textos de la interfaz [español, English].
*/

import { guardar, leerObjeto } from "../../core/store.js";
export let memoria;

/* ---------- memoria ---------- */
const LSK = "kixki-k4",
  memoriaInicial = { v: 1, asked: {}, total: 0 };

export const save = () => guardar(LSK, memoria);

/* ---------- textos de la interfaz [español, English] (los consejos viven en dialogs.js → ADV) ---------- */
export const TEXTOS_UI = {
  ask: ["Pedir ayuda a Kixki", "Ask Kixki for help"],
  group: ["Kixki, tu guía", "Kixki, your guide"],
  hint: [
    "Mantén pulsada la carpeta (o pulsa Mayús + F10) para pedirle ayuda a Kixki sobre ella.",
    "Hold the folder down (or press Shift + F10) to ask Kixki for help with it.",
  ],
};

export function iniciar() {
  memoria = leerObjeto(LSK, memoriaInicial);
  if (!memoria.asked || typeof memoria.asked !== "object") memoria.asked = {};
}
