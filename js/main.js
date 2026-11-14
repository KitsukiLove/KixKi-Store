/* =========================================================
   KIXKI STORE · punto de entrada único (js/main.js)
   Qué hace:  es el ÚNICO <script type="module"> de index.html. Aquí se ve, en orden, qué arranca la página.
   Orden de arranque (equivale al de los <script defer> de antes; no lo cambies sin probar):
     1 idioma → 2 escenas → 3 música → 4 huevos de pascua → 5 catálogo y escritorio (app) → 6 tienda → 7 vallas
     → 8 lluvia → 9 fondo XP → 10 fondo pixel → (cuando la página está inactiva) Kixki.
   Excepciones (scripts clásicos, NO módulos):
     · js/xp/xpmode.js  va en <head> y sin defer: aplica el estilo antes de pintar (si no, parpadea).
     · js/xp/xp-games.js lo carga xpmode.js solo cuando se abre un minijuego XP.
   ========================================================= */
import "./core/i18n.js";
import "./modos/scenes.js";
import "./modos/music.js";
import "./modos/eggs.js";
import { iniciarApp } from "./app/app.js";
import "./modos/tienda.js";
import "./modos/vallas.js";
import "./modos/lluvia.js";
import "./xp/xpbg.js";
import "./modos/pxbg.js";
import { cargaDiferida } from "./core/carga.js";

/* Catálogo y escritorio: se arranca aquí, ya con todos los módulos de arriba cargados. */
iniciarApp();

/* Estilos de Kixki: se cargan ANTES que su código (ver core/carga.js). */
const ESTILOS_KIXKI = [
  "css/kixki/kixki.css",
  "css/kixki/kixki2.css",
  "css/kixki/kixki3.css",
  "css/kixki/basket.css",
  "css/kixki/consejos.css",
  "css/kixki/vacaboss.css",
];

cargaDiferida({ css: ESTILOS_KIXKI, cargarModulo: () => import("./kixki/index.js") });
