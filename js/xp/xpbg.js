/* =====================================================================
   COLINA XP VIVA (partes 7b y 7c) — pasto con viento, nubes, pájaros, estaciones y lluvia que moja la colina
   ---------------------------------------------------------------------
   · La colina («Bliss» dibujada a mano, sin imágenes) y el paisaje de cada estación los pinta scenes.js (entrada «xp»).
     Aquí se le añaden ~1000 briznas generadas con una semilla fija (siempre igual), agrupadas en pocas <g> por franja
     de profundidad y trozo de pantalla: más pequeñas al fondo, más grandes delante. Se animan SOLO con transform en CSS.
   · Viento: balanceo suave por franja + una ráfaga que cruza la colina de izquierda a derecha cada pocos segundos
     (el retraso depende de la posición) y un destello de luz que viaja con ella.
   · Cielo: nubes a la deriva en capas (las de lejos más pequeñas y lentas), hebras de viento, y de vez en cuando
     una bandada de pájaros (gansos en otoño, murciélagos en Halloween, estrella fugaz de noche).
   · Estaciones: flores en la hierba (primavera/verano), pétalos, hojas, nieve, luciérnagas, niebla de Halloween.
   · Lluvia («kixki-rain» start/stop, sin polling): más viento, cielo y nubes grises, verdes más oscuros, charcos con ondas.
   · Respeta: prefers-reduced-motion (imagen fija), #bgx.kv-pause (KXB.pause), pestaña oculta.
   · API: window.KXPAS { wet(v), rebuild(), hillY(xPx), puddles(), variant(), bird(tipo), star(), fx() }
   ===================================================================== */
import { iniciar as iniciar_cielo } from "./colina/cielo.js";
import { iniciar as iniciar_clima } from "./colina/clima.js";
import { iniciar as iniciar_colina } from "./colina/colina.js";
import { iniciar as iniciar_construir } from "./colina/construir.js";
import { iniciar as iniciar_estaciones } from "./colina/estaciones.js";
import { iniciar as iniciar_estado } from "./colina/estado.js";
import { iniciar as iniciar_pajaros } from "./colina/pajaros.js";
import { iniciar as iniciar_pasto } from "./colina/pasto.js";
(function () {
  "use strict";
  iniciar_estado();
  iniciar_colina();
  iniciar_estaciones();
  iniciar_pasto();
  iniciar_cielo();
  iniciar_pajaros();
  iniciar_clima();
  iniciar_construir();
})();
