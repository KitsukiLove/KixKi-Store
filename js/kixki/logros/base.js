/*
  Atajos y utilidades de la parte 2: referencia a Kixki (KK), idioma, ¿PC?, ¿llueve? y elegir al azar.
*/

import { idioma as lang, now, rnd } from "../../core/util.js";
export let viva, KK, K, S, root, KX;

const L = () => (lang() === "en" ? 1 : 0);

export const tx = (m) => (Array.isArray(m) ? m[L()] : m);

export const fmt = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (x, k) => (v[k] != null ? v[k] : x)) : s);

export const isPC = () => KK.isPC();

export const rainOn = () => !!(window.KXRAIN && KXRAIN.on());

export const pick = (l) => l[Math.floor(Math.random() * l.length)];

export function iniciar() {
  viva = {
    lastFocus: null,
    nextFire: now() + rnd(60000, 130000),
    chatting: false,
    nextVisit: now() + rnd(45000, 80000),
    petFacing: 1,
    fireOn: false,
  };
  KK = KXK;
  K = KK.K;
  S = KK.state;
  root = document.documentElement;
  KX = window.KX || {};
}
