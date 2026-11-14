/* Música original generada en el navegador (Web Audio): sin archivos ni derechos de autor.  (parte 8: motor nuevo)
   · Mundo PIXEL → chiptune suave: melodía de pulso redondeado, arpegio de pluma, bajo triangular y percusión muy ligera.
   · Mundo XP    → chillout de principios de los 2000: piano eléctrico, campanitas de cristal, colchón de sintetizador, bajo cálido y ritmo relajado.
   Cada fondo/estación y cada día/noche tiene su pieza (30 en total). Las melodías se componen solas con una semilla fija:
   siempre suenan igual, pero van cambiando por secciones (16 compases) y no se repiten pesadamente.
   Mejoras frente a la versión anterior: reverb, eco suave, filtro cálido, compresor, ritmo "humano" y notas con ataque/caída naturales. */
import { iniciar as iniciar_bateria } from "./musica/bateria.js";
import { iniciar as iniciar_control } from "./musica/control.js";
import { iniciar as iniciar_estado } from "./musica/estado.js";
import { iniciar as iniciar_piezas_pixel } from "./musica/piezas-pixel.js";
import { iniciar as iniciar_piezas_xp } from "./musica/piezas-xp.js";
import { iniciar as iniciar_render } from "./musica/render.js";
import { iniciar as iniciar_teoria } from "./musica/teoria.js";
(function () {
  "use strict";
  iniciar_estado();
  iniciar_teoria();
  iniciar_bateria();
  iniciar_piezas_pixel();
  iniciar_piezas_xp();
  iniciar_control();
  iniciar_render();
})();
