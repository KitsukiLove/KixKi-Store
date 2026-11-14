/*
  Perfil de la persona: tipo de usuaria, acceso, Android e intereses (guardado en kixki-perfil).
*/

import { leer } from "../../core/store.js";

export const PRF = () => {
  const p = leer("kixki-perfil", null);
  if (!p || typeof p !== "object" || Array.isArray(p) || p.v !== 1) return null;
  if (p.skip) return { v: 1, skip: 1 };
  const ok = ["priv", "look", "mus", "game", "ctl", "day", "opt"];
  return {
    v: 1,
    t: ["ini", "dia", "pro"].includes(p.t) ? p.t : "dia",
    p: ["si", "no", "?"].includes(p.p) ? p.p : "?",
    a: Number.isFinite(+p.a) && +p.a >= 0 && +p.a <= 40 ? Math.round(+p.a) : 0,
    i: Array.isArray(p.i) ? p.i.filter((x) => ok.includes(x)) : [],
  };
};

export const prof = () => {
  const p = PRF();
  return p && !p.skip ? p : null;
};

export const INT = [
  ["priv", "🛡️", ["Privacidad", "Privacy"], ["privacidad", "mensajeria"]],
  ["look", "🎨", ["Personalizar", "Customize"], ["decoracion", "teclados", "pantalla"]],
  ["mus", "🎧", ["Música", "Music"], ["musica"]],
  ["game", "🎮", ["Juegos", "Games"], ["emulacion"]],
  [
    "ctl",
    "🧰",
    ["Control y trucos", "Control & tricks"],
    ["control", "utilidad", "importante", "sistemas"],
  ],
  ["day", "📸", ["Fotos y día a día", "Photos & daily life"], ["fotos", "internet", "dia"]],
  /* Optimización: no es una carpeta, es una lista de apps (la misma del pack «Optimización») */
  [
    "opt",
    "⚡",
    ["Optimización", "Optimization"],
    [],
    ["SD Maid SE", "EnforceDoze", "Essentials", "ADL", "Canta", "No More Background", "BatStats"],
  ],
];

export const TIPO = {
  ini: ["empezando", "just starting"],
  dia: ["uso diario", "everyday user"],
  pro: ["avanzada/o", "advanced"],
};

export function iniciar() {
  /* ---------- perfil ---------- */
  /* el perfil se limpia siempre: si algo viene dañado o de otra versión, se usa un valor seguro */
}
