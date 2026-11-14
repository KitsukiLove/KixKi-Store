# Plan de estructura · KixKi Store (módulos ES)

Estado: PROPUESTO v2 (ahora incluye estructura DEL CÓDIGO, no solo carpetas), esperando aprobación de Kitsuki. Base: KixKi-Store-Correcciones v2 (sw kixki-7c77fa8b).
Reanudar: leer este archivo y PROGRESO-KixKi.md; cada fase termina con tests verdes y zip propio.

## Hallazgos del análisis
- ~20 globales `window.*` (KX, KXS, KXI, KXK, KXK3, KXQ, KXV, KXD, KXB, KXM, KXE, KXG, KXT, KXXP, KXRAIN, KXPAS, KXBK, KXK4, XPGames, KXJ_get, KXR, KXPET).
- `KXPET` se define dos veces (app.js y kixki2.js).
- Ciclos reales: kixki ↔ kixki3 ↔ vacaboss ↔ basket (se llaman entre sí). Con import estático darían error; se rompen con un registro (`core/registry.js`).
- Más usados: KXS×~34, KXI×~57, KXK×~60, KXB×~60.
- Archivos grandes: dialogs.js 149 KB (1600 líneas), kixki2.js 74 KB, app.js 68 KB, kixki.js 60 KB, i18n.js 56 KB, vacaboss.js 37 KB.
- Los tests y la consola usan `window.KXK`, `KXQ.hacker()`, etc.: se conserva una fachada `window.KX*` en un solo archivo (`js/compat.js`).

## Árbol objetivo
```
index.html  sw.js  manifest.webmanifest  (raíz: GitHub Pages las necesita)
css/  base/ (styles, pixel-ui, fonts)  xp/ (xp, xp-icons, xpbg, pxbg)  kixki/ (kixki, kixki2, kixki3, basket, consejos, vacaboss)  tienda/ lluvia/ xp-games/
js/
  main.js                 punto de entrada (único <script type=module>)
  compat.js               fachada window.KX* para tests/consola
  core/  registry.js bus.js store.js(KXS) dom.js i18n/ (i18n.js + es-en)
  app/   catalogo.js buscador.js ventanas.js escritorio.js mascota-ui.js sw-registro.js extras.js
  kixki/ cerebro.js plataformas.js habla.js fisica.js logros.js chat.js clima.js hacker.js basket.js consejos.js vacaboss.js
  modos/ xpmode.js xpbg.js pxbg.js lluvia.js scenes.js music.js xp-games.js vallas.js eggs.js tienda.js
  dialogos/ index.js + temas (por tema, carga bajo demanda)
img/ iconos/ gifs/ logo.png      logos/   data/   fonts/   vendor/   tools/   docs/
```

## Fases (cada una: tests + zip + marca en PROGRESO)
0. Línea base: correr los 9 tests, guardar resultados y capturas (móvil+PC, ES+EN).
1. Carpetas sin tocar código: mover css/img, actualizar rutas (index, sw SHELL, manifest, CSS url(), bump-sw). Punto seguro.
2. Núcleo: registry, bus, store(KXS), dom, i18n como módulo. Fachada compat.
3. Módulos hoja a ESM: scenes, music, eggs, lluvia, vallas, xpbg, pxbg, xpmode, xp-games, tienda.
4. Partir app.js en js/app/*. Se respeta la regla: lo que lee texto en español de lo recién dibujado va en la misma etapa.
5. Kixki a ESM: partir kixki/kixki2/kixki3 por tema; ciclos vía registry; `import()` dinámico reemplaza carga.js (mismo orden y mismo "kixki-ready").
6. dialogs.js dividido por tema y cargado bajo demanda (objetivo: bajar sus 149 KB del arranque).
7. Tests actualizados (rutas), bump-sw que recorre el grafo de módulos, docs/ARQUITECTURA.md, README, zip final.

## Riesgos
- Abrir index.html con doble clic (file://) deja de funcionar con módulos. Se añade `node tools/serve.mjs` para probar en local; en GitHub Pages sin cambios.
- Fase 5 es la más delicada (ciclos + tiempos de Kixki).
- Mismo comportamiento: se compara con las capturas/tests de la fase 0 en cada fase.


---
# AÑADIDO v2 · Calidad interna del código (pedido de Kitsuki: no solo carpetas)

## Medición de hoy (8 655 líneas en 19 archivos)
- 19 % de las líneas pasan de 120 caracteres; 428 pasan de 200; la más larga mide 1083 (i18n.js) y 821 (app.js).
- 1 341 variables de 1–2 letras; 107 `catch{}` vacíos; 52 accesos directos a localStorage repartidos en todos los archivos.
- Comentarios 1–10 % por archivo; IIFEs gigantes en app.js («extras», «parte 2») con dependencias ocultas por orden de ejecución (la causa del problema de la ronda 2 con el inglés).
- Herramientas disponibles aquí sin internet: Prettier 3.8, ESLint, acorn. Prettier probado en copia: 8 718 → 23 526 líneas legibles; 17 de 19 archivos con AST idéntico (dialogs.js e i18n.js se revisan aparte).

## Reglas de calidad (por módulo, al convertirlo)
B1 Formato automático (Prettier) + ESLint (no-undef, no-unused-vars, no-empty, prefer-const, eqeqeq). Formato verificado por comparación de AST.
B2 Nombres claros en lo público y lo central (K→estado, S→ajustes…); `i`, `e`, `el` se quedan. Renombrado con análisis de alcance, nunca buscar-y-reemplazar global.
B3 `core/store.js`: único lugar que toca localStorage (prefijo kixki-, try/catch, JSON, valores por defecto documentados). Los 107 catch vacíos pasan a helper o a comentario que explique por qué se ignora.
B4 Duplicados fuera: utilidades repetidas ($, $$, nrm, clamp, rand, esc…) a `core/dom.js` y `core/util.js`; KXPET definido una sola vez.
B5 Una responsabilidad por función (meta: ninguna >60 líneas) y por módulo. Cada módulo exporta `init()` con orden de arranque declarado en `main.js` (se acaba la dependencia oculta por tiempos).
B6 Constantes con nombre y comentario (tiempos, cooldowns, tamaños) en la cabecera de cada módulo.
B7 Cabecera de módulo (qué hace, qué necesita, qué publica) + JSDoc corto en la API pública + `docs/ARQUITECTURA.md` con diagrama de dependencias.
B8 Lecturas cruzadas `window.KXK&&KXK.x` → registro/bus con contrato; fachada `window.KX*` solo en compat.js.
B9 `node tools/calidad.mjs` repite estas métricas y `node tools/lint.mjs` corre ESLint; la meta es medible.

## Metas medibles (fuera de datos/textos)
líneas >120: 19 % → <3 % · líneas >200: 0 · catch vacíos sin justificar: 0 · localStorage fuera de store.js: 0 · variables 1–2 letras a nivel de módulo: 0 · funciones >60 líneas: 0 · ciclos de import: 0 · módulos con cabecera: 100 %.

## Orden de fases ACTUALIZADO
0 Línea base (tests + capturas + `tools/calidad.mjs`) · 1 Carpetas · 2 Formato + ESLint (AST verificado) · 3 Núcleo (store, dom, util, registry, bus, config) · 4 Módulos hoja a ESM con B2–B7 · 5 Partir app.js · 6 Kixki a ESM (ciclos vía registry, import() dinámico) · 7 dialogs.js por temas · 8 Tests, bump-sw por grafo, ARQUITECTURA.md, zip final.
Honestidad: formato y lint son verificables; la refactorización (B2–B8) solo se verifica con los tests (hoy ~280 comprobaciones) y capturas, así que se hace por módulo y con zip por fase.
