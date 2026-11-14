/*
  Textos de Kixki. Las frases viven en dialogos/dialogs.js (window.KXD); aquí están además los textos de interfaz [español, English].
*/

/* ---------- lo que dice Kixki: [español, English] ---------- */
export const KXD = window.KXD || {};

export const { T, FOLD, GREET, TOUR_PC, TOUR_MOB, MIC, FAST } = KXD;

/* los textos viven en dialogs.js */
export const EMO = KXD.EMO || {
  ui: [["🐑", "🐑"]],
};

/* (parte 4b) respuestas de solo emoji por situación */
export const TEXTOS_UI = {
  aria: [
    "Kixki, tu guía. Tócala para que te hable.",
    "Kixki, your guide. Tap her and she'll talk to you.",
  ],
  close: ["Cerrar", "Close"],
  tip: ["Pedirle un consejo a Kixki", "Ask Kixki for a tip"],
  onT: ["Kixki: sí", "Kixki: on"],
  offT: ["Kixki: durmiendo 💤", "Kixki: sleeping 💤"],
  zzAria: [
    "Kixki está durmiendo. Tócala y se despierta un momento.",
    "Kixki is sleeping. Tap her and she wakes up for a moment.",
  ],
  zzSr: ["Kixki está durmiendo", "Kixki is sleeping"],
  modeT: {
    chat: ["Kixki: charlatana 🗣️", "Kixki: chatty 🗣️"],
    normal: ["Kixki: normal 🐑", "Kixki: normal 🐑"],
    quiet: ["Kixki: calladita 🤐", "Kixki: quiet 🤐"],
  },
};
