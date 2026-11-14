# Arquitectura de KixKi Store

Página estática (GitHub Pages), sin build ni dependencias en producción. Este documento describe cómo está
organizado el código **hoy**; el plan y el diario de la reestructura están en `PLAN-ESTRUCTURA.md` y
`PROGRESO-KixKi.md`.

## Carpetas

```
index.html · sw.js · manifest.webmanifest · apps.json      raíz: lo que GitHub Pages y tú editan
css/   base/ · kixki/ · xp/ · modos/                         estilos por tema
js/
  main.js              ÚNICO punto de entrada (<script type="module">): fija el orden de arranque
  core/                lo que usa todo: store (localStorage), util, carga (diferida), i18n + idioma/
  app/                 catálogo, buscador, escritorio y ventanas (app.js orquesta; subcarpetas por tema)
    catalogo/ arte/ escritorio/ extras/
  kixki/               la oveja: index.js (orden de arranque) + 7 grupos
    oveja/ logros/ pica/ vaca/ basket/ consejos/           (kixki.js, kixki2.js, kixki3.js, vacaboss.js,
                                                            basket.js y consejos.js son los «portales» de cada grupo)
  dialogos/            los textos de Kixki por tema; dialogs.js los junta y publica window.KXD
  modos/               escenas/ (fondos), musica/, lluvia/, vallas/, tienda/, eggs.js, pxbg.js
  xp/                  modo «Colina XP»: colina/ (fondo vivo), xpmode.js y xp-games.js (scripts clásicos)
img/ · logos/ · data/ · fonts/ · vendor/                     recursos
tools/                                                       pruebas, sincronización y utilidades de desarrollo
```

Regla de lectura: **un archivo suelto en `js/` o en `js/modos/` (`scenes.js`, `music.js`, `tienda.js`, `lluvia.js`,
`vallas.js`, `app.js`, `kixki.js`…) es un «portal»**: solo importa los módulos de su carpeta hermana y los arranca
en orden. La lógica vive dentro de la carpeta con su mismo tema.

## Cómo arranca la página

1. `index.html` carga los CSS base y un script **clásico** `js/xp/xpmode.js` (sin `defer`): aplica el estilo
   guardado antes de pintar, para que no parpadee. También lleva `modulepreload` de los módulos del arranque
   (los genera `tools/bump-sw.mjs`).
2. `js/main.js` (módulo, se ejecuta cuando el documento está listo) importa en este orden: idioma → escenas →
   música → huevos → **app** (catálogo y escritorio) → tienda → vallas → lluvia → fondo XP → fondo pixel.
3. Cuando la página está inactiva (`core/carga.js`), carga los CSS de Kixki y después `js/kixki/index.js`, que
   importa en fila: textos (`dialogos/dialogs.js`) → cerebro (`kixki.js`) → logros (`kixki2.js`) → física
   (`kixki3.js`) → básquet → consejos → vaca jefa.
4. `app.js` avisa con el evento `kixki-ready` cuando el catálogo está listo; los módulos de Kixki que llegan más
   tarde ya lo encuentran puesto (`window.KXR`).

## El patrón de cada módulo dividido

Los archivos grandes eran una función que se ejecutaba sola (`(function(){ … })()`) con todo dentro. Se partieron
por temas conservando **exactamente el mismo orden de ejecución**:

- Cada módulo exporta lo que otros necesitan (`export const`, funciones) y una función `iniciar()` con las
  sentencias que se ejecutan al arrancar (leer el DOM, registrar eventos…).
- El portal llama a los `iniciar_*()` en el orden original. **Cambiar ese orden rompe cosas**: varias partes leen el
  texto en español de lo recién dibujado, y `i18n` lo traduce cuando la página cede el hilo (ver `Y()` en `app.js`).
- Variables que cambian de valor y las usan varios módulos viven en un objeto compartido (`viva`, `actual`),
  porque un `import` no se puede reasignar desde fuera.
- Si un módulo necesita algo de otro que se carga **después**, lo pide por `puente.js` (un registro
  `puente.nombre`, relleno al arrancar). Es la forma de evitar imports circulares (hoy: 0 ciclos).

## Qué hay en cada capa

| Capa | Dónde | Regla |
|---|---|---|
| `core/` | `store.js`, `util.js`, `i18n.js` + `idioma/`, `carga.js` | no dependen de nada fuera de `core/` |
| `app/` | `app.js` + `catalogo/ arte/ escritorio/ extras/` | usa `core/`; publica `window.KX` y `window.KXS` |
| `kixki/` | 7 grupos + `index.js` | usan `core/`; se hablan por `window.KXK`, `KXK3`… (ver deuda) |
| `modos/`, `xp/` | escenas, música, lluvia, tienda… | usan `core/`; cada uno publica su `window.KX*` |
| `dialogos/` | `dialogs.js` + 11 módulos de datos | solo datos y ayudantes `A()`/`L()`; no usan nada del resto |

## Cosas que NO debes hacer

- **No abras `index.html` con doble clic**: el navegador bloquea los módulos ES en `file://`. Usa
  `node tools/serve.mjs` (http://localhost:8080) o sube el sitio a GitHub Pages.
- **No toques `localStorage` directamente**: usa `core/store.js` (`leer`, `guardar`, `leerTexto`…). Excepción: los dos
  scripts clásicos (`xpmode.js`, `xp-games.js`) llevan su propia copia mínima porque no pueden importar.
- **No copies ayudantes** (`$`, `clamp`, `wait`…): impórtalos de `core/util.js`.
- **No cambies el orden de los `iniciar_*()`** de un portal ni de los imports de `main.js` / `kixki/index.js` sin probar.
- **Un archivo nuevo debe importarse** desde su portal; si no, no se carga. Tras añadirlo corre
  `node tools/bump-sw.mjs` (recorre el grafo de imports y actualiza `sw.js` y los `modulepreload`).

## Herramientas (`tools/`)

| Comando | Qué hace |
|---|---|
| `node tools/serve.mjs [puerto]` | servidor local mínimo para probar la página |
| `node tools/bump-sw.mjs` | recorre la página, reconstruye la lista de archivos de `sw.js`, los `modulepreload` y sube la versión (hazlo antes de subir) |
| `node tools/calidad.mjs` | mide la calidad del código (líneas largas, catch vacíos, nombres cortos, cabeceras…) |
| `node tools/lint.mjs` | ESLint (necesita `npm i -D eslint` una vez) |
| `npm run formato` | Prettier sobre `js/` y `tools/` |
| `node tools/test-*.mjs` | pruebas en Chromium headless (necesitan Playwright) |
| `node tools/check-dialogs.mjs` · `check-vaca.mjs` | revisan los textos de Kixki y de la vaca jefa |

Notas sobre las pruebas:

- `test-dialogos.mjs` mide tiempos de la oveja (frases que salen en milisegundos) y a veces falla una comprobación
  distinta cada vez sin que haya error real; si falla, repítelo antes de buscar un bug.
- `test-inicio.mjs` da 1 «mal» (el logo de GifWidgets) hasta que corras `node tools/sync.mjs`.

## Variables globales que quedan (deuda de la estructura vieja)

`window.KX`, `KXS`, `KXI`, `KXK`, `KXK3`, `KXK4`, `KXQ`, `KXV`, `KXD`, `KXB`, `KXBK`, `KXM`, `KXE`, `KXG`, `KXT`,
`KXXP`, `KXRAIN`, `KXPAS`, `KXPET`, `XPGames`, `KXJ_get`, `KXR`. Están listadas en `eslint.config.mjs`
(`entreArchivos`): al convertir un módulo a imports se quita de esa lista, y ESLint avisa si alguien vuelve a depender de una.

## Otras deudas conocidas

- Nombres de una o dos letras que son convención del cerebro de Kixki (`K` estado, `S` memoria, `KK` el objeto
  público, `V` el estado vivo…) siguen a nivel de módulo en `kixki/`; renombrarlos toca miles de usos.
- Funciones de más de 60 líneas: quedan en el bucle de animación de la lluvia, el motor de audio, la pelea de la
  vaca jefa y el fuego de Kixki (son bucles/motores difíciles de partir sin cambiar su comportamiento).
- `xp/xp-games.js` y `xp/xpmode.js` son scripts clásicos (no módulos) a propósito: `xpmode.js` debe ejecutarse antes
  de pintar. Por eso llevan su propia copia de `localStorage`.
- Líneas de más de 200 caracteres fuera de los datos: son plantillas HTML y trazados SVG en una sola línea.
