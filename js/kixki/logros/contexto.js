/*
  Variables de contexto para completar las frases de Kixki (nombre, hora, progreso…).
*/

import { $$ } from "../../core/util.js";
import { S } from "./base.js";
import { C, lsNum } from "./estado.js";

export const ctx = () => ({
  folders: S.opened.length,
  total: $$("#app .cat").length,
  allDone: !!S.allDone,
  searches: C.searches | 0,
  nores: C.nores | 0,
  tags: C.tags | 0,
  run: C.run | 0,
  favMax: C.favMax | 0,
  plays: Math.max(C.plays | 0, lsNum("kixki-gp"), lsNum("kixki-rec") > 0 ? 1 : 0),
  runMax: Math.max(C.runMax | 0, lsNum("kixki-rec")),
  recBroken: !!C.recBroken,
  theme: C.theme | 0,
  night: !!C.night,
  bgs: (C.bgs || []).length,
  acc: C.acc | 0,
  music: !!C.music,
  lang: !!C.lang,
  view: !!C.view,
  qr: !!C.qr,
  tapFast: !!C.tapFast,
  tapsK: C.tapsK | 0,
  petChats: C.petChats | 0,
  pet: lsNum("kixki-ov"),
  fireUser: C.fireUser | 0,
  fireFast: C.fireFast | 0,
  fireKixki: C.fireKixki | 0,
  visits: S.visits | 0,
  konami: !!C.konami,
  rain: C.rainSeen | 0,
  glass: !!C.glass,
  wiped: C.wiped | 0,
  fireRain: C.fireRain | 0,
  cow: !!C.cow,
  cowWin: !!C.cowWin,
  cowLose: !!C.cowLose,
  throws: C.throws | 0,
  hoops: C.hoops | 0,
  adv: (C.adv || []).length,
  advAll: $$("#app .cat").length > 0 && $$("#app .cat").every((s) => (C.adv || []).includes(s.id)),
});

export function iniciar() {
  /* ---------- contexto: todo lo que miden las condiciones ---------- */
}
