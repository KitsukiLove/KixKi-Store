/*
  Constantes del combate (CFG: vidas, tiempos, velocidades) y memoria en localStorage («kixki-vb»).
*/

import { guardar, leerObjeto } from "../../core/store.js";
export let memoria;

export const sgn = (v) => (v < 0 ? -1 : 1);

export const lang = () => (window.KXI && KXI.lang === "en" ? 1 : 0);

export const segunIdioma = (p) => p[lang()];

export const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (a, k) => (v && v[k] != null ? v[k] : a));

/* ---------- ajustes del combate (se pueden tocar desde la consola: KXV.cfg) ---------- */
export const CFG = {
  dwellMin: 75e3,
  dwellMax: 110e3 /* ventana de vaca.exe abierta antes del aviso */,
  warn: 3800 /* ms entre el aviso y la traición */,
  cooldown: 8 * 60e3 /* espera entre intentos */,
  hp: 5 /* vida de la vaca */,
  perIcon: 6 /* % de infección por carpeta manchada */,
  creep: 0.35 /* % por segundo que sube sola (hasta creepMax) */,
  creepMax: 30,
  speed: 120,
  speedRage: 178 /* px/s */,
  munch: 0.95 /* s comiendo una carpeta */,
  stun: 1.7,
  invul: 0.75 /* s aturdida tras un golpe / s sin poder recibir otro */,
  minSpeed: 300 /* velocidad mínima de Kixki para hacer daño (px/s) */,
  tele: [6.5, 9.5],
  teleRage: [4.2, 6.2],
  hint: 6 /* s sin lanzar nada y sale la pista */,
};

/* ---------- memoria ---------- */
export const LSK = "kixki-vb",
  memoriaInicial = { won: 0, lost: 0, tries: 0, next: 0, hits: 0, backs: 0 };

export const save = () => guardar(LSK, memoria);

export function iniciar() {
  memoria = leerObjeto(LSK, memoriaInicial);
}
