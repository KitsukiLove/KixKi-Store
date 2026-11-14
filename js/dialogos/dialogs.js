/* =========================================================
   KIXKI · textos y diálogos  (parte 3)
   Aquí viven TODAS las frases de Kixki; kixki.js y kixki3.js solo tienen la lógica.
   - Cada frase es [español, English]. Una clave con varias frases es una lista de pares.
   - Variables: {hora} {app} {carpeta} valen en cualquier frase; {n} {q} {a} {rec} {sc} {d} solo donde el código las pasa (tabla VARS).
   - Para añadir variantes: A(objeto,"clave",L(`español || English`)) en el módulo del tema que toque (carpeta js/dialogos/, una frase por línea).
   - Validar:  node tools/check-dialogs.mjs   (comprueba es + en, variables, duplicados y mínimo de variantes por evento).
   - Ánimo: TX.<clave>P (más pícara) y TX.<clave>V (vengativa) se mezclan según cuánto la lanzas (ver kixki3.js, mood()).
   (parte 4b) EMO = respuestas de solo emoji por situación (modo «calladita» y sueño) · T.sleepNow · TX.bk* = básquet con Kixki enfadada.
   Este archivo solo junta los módulos por tema de esta carpeta y publica window.KXD:
   textos (T) · carpetas-y-tour · micro-rapidas · travesuras (TX) · variantes-* · generador · consejos-carpeta (ADV) · emojis (EMO) · basquet.
   Se carga ANTES que kixki.js (index.html) y se guarda en la caché del service worker (sw.js).
   ========================================================= */
import { A, L } from "./ayudas.js";
import { iniciar as iniciar_basquet } from "./basquet.js";
import { FOLD, GREET, TOUR_MOB, TOUR_PC } from "./carpetas-y-tour.js";
import { ADV, iniciar as iniciar_consejos_carpeta } from "./consejos-carpeta.js";
import { E, EMO, iniciar as iniciar_emojis } from "./emojis.js";
import { GEN, MINV, VARS, gen, iniciar as iniciar_generador } from "./generador.js";
import { FAST, MIC } from "./micro-rapidas.js";
import { T } from "./textos.js";
import { TX, iniciar as iniciar_travesuras } from "./travesuras.js";
import { iniciar as iniciar_variantes_kixki } from "./variantes-kixki.js";
import { iniciar as iniciar_variantes_travesuras } from "./variantes-travesuras.js";

/* El orden importa: cada paso añade variantes a lo que dejó el anterior (A() no repite frases). */
iniciar_travesuras();
iniciar_variantes_kixki();
iniciar_variantes_travesuras();
iniciar_generador();
iniciar_consejos_carpeta();
iniciar_emojis();
iniciar_basquet();

window.KXD = {
  T,
  FOLD,
  GREET,
  TOUR_PC,
  TOUR_MOB,
  MIC,
  FAST,
  TX,
  GEN,
  gen,
  VARS,
  MINV,
  L,
  A,
  ADV,
  EMO,
  E,
};
