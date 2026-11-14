# PROGRESO · KixKi-Store-Correcciones  (si dicen «continuar»: lee esto, sigue en la primera tarea sin [x])
Carpeta de trabajo (la página completa): /home/claude/KixKi-Store-Correcciones
Copia original sin tocar (para comparar): /home/claude/ORIGINAL-KixKi-Store
Entrega final: zip /home/claude/KixKi-Store-Correcciones.zip (carpeta KixKi-Store-Correcciones/ dentro) + lista BORRAR-DEL-REPO.txt, enviado con SendUserFile.
Servidor de pruebas: python3 -I -m http.server 8810 -d /home/claude/KixKi-Store-Correcciones  (scripts de prueba en scratchpad/me/*.js: smoke.js, perf2.js, inter.js, load.js)

DECISIONES DEL USUARIO
- Logos: equilibrio. Orden: meta.json local -> logo explícito en apps.json -> UNA sola petición al avatar de GitHub del autor (flag LOGO_REMOTO en app.js) -> letra pixel. Sin Google favicon automático ni raw.githubusercontent. Añadir apps = bloque en apps.json + node tools/sync.mjs.
- Estrellas GitHub: solo desde data/meta.json (quitar fetch en vivo a api.github.com y del CSP).
- Modo Hacker: solo atajo (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C); sin detector por tamaño.
- JS legible (NO minificar) + carga diferida de módulos pesados; comprimir logo.png y fuentes. Sube desde PC.
- Borrar lo del test de encantamientos (subido por accidente). Mantener vendor/qrcode.min.js (lo usa app.js:716).
- Idioma: español, directo, código completo/ archivos a reemplazar.

TAREAS  ([x] hecha)
[x] T1  Borrar restos del test (js/, css/, data/preguntas50.json, data/resultados.json, data/_v1/) + revisar tools/docs que los citen
[x] T2  CSS: espacio sobre la barra de búsqueda para que Kixki no tape #pick (móvil)
[x] T3  Carga: apps.json 1 sola descarga; carga diferida (loader) de dialogs/kixki/kixki2/kixki3/basket/consejos/vacaboss + sus CSS; logo.png comprimido; fuentes a .woff reales
[x] T4  Logos: nueva función logos() + flag; quitar Google/raw del camino automático; README honesto
[x] T5  Estrellas solo meta.json; CSP (quitar api.github.com y cdnjs); og:image/canonical
[x] T6  Kixki: observer acotado (kixki.js), i18n ignora #kixki, hacker solo atajo, multitoque, shake táctil, start sin plataforma, código muerto, timers con hidden
[x] T7  SW: SHELL actualizado, aviso «versión nueva», tools/bump-sw.mjs (versión automática)
[x] T8  Favoritas: migración por nombre antiguo (campo "old" en apps.json)
[x] T9  Docs: LEEME-PRIMERO.txt, README (privacidad), BORRAR-DEL-REPO.txt
[x] T10 Verificar: node --check, smoke (0 errores) móvil+PC, capturas, comparar medidas con el original, archivos del SW existen
[x] T11 Zip y entrega
NOTAS / HALLAZGOS DURANTE EL TRABAJO
- T1 hecha: borrados js/, css/, data/_v1, preguntas50, resultados, tools/build_icons.py y build_data.py. Creado /home/claude/BORRAR-DEL-REPO.txt (copiar al zip en T9).
- T2 hecha: styles.css .search margin 52px (móvil y .dsk).
- T3 EN CURSO: hecho carga.js (loader) + index.html (quitados 6 CSS y 7 JS diferidos, CSP sin cdnjs/api.github.com, og/canonical). FALTA: apps.json 1 descarga (app.js:25 getJ / tienda.js:19 getJ -> compartir window.KXJ), logo.png, fuentes .woff, añadir carga.js a sw.js SHELL (T7).
- T3 hecha: apps.json 1 descarga (window.KXJ_get), fuentes -> f0..f4.woff (-165KB) + fonts.css, logo.png 103KB->22KB, sync.mjs incremental (--logos/--fuentes). SW SHELL aún por actualizar en T7 (carga.js, .woff). fonts/ tiene 3 .ttf de origen sin uso en la página (decidir en T9).
- T4 hecha: app.js logos() nuevo (LOGO_REMOTO=false por defecto: meta local -> a[5] explícito -> logos/<slug>.svg -> letterLogo() dibujado en JS); sync.mjs genera SVG de letras idénticos a los de Python (verificado). T5 pendiente: quitar fetch en vivo ghShow (app.js ~l.781-787) [CSP e og ya hechos en index.html].
- T5 hecha: ghShow solo M.repos, fetch api.github quitado; CSP/og ya en index.html. SIGUE T6 (Kixki).
- T6 hecha: kixki.js (observer filtrado, dead code, start sin plataforma), i18n.js (ignora #kixki), kixki2.js (hacker solo atajo, flushSay hidden), kixki3.js (multitoque, shake táctil, pin hidden). Pet de app.js se deja a pasos (es estética pixel). SIGUE T7: sw.js.
- T7 hecha: sw.js SHELL (carga.js, .woff), aviso 'Hay una versión nueva' (app.js + #upd en styles.css), tools/bump-sw.mjs. ¡RECORDAR: correr `node tools/bump-sw.mjs` al FINAL, tras todos los cambios (T10)! SIGUE T8 favoritas.
- T8 hecha (campo old en apps.json migra kixki-fav/have/seen). T9 hecha: LEEME-PRIMERO, README es/en l.205, docs/DESARROLLO.md (sección Correcciones + nota carga diferida). Falta copiar /home/claude/BORRAR-DEL-REPO.txt dentro del proyecto. SIGUE T10 verificar.
- RONDA 2 hecha: carpetas min, fit, Y() solo ES, i18n observer solo EN, harness KXK3. Entregado v2.

## RONDA 3 · reestructura (aprobada). Trabajo en /home/claude/KixKi-Store-v3 (v2 entregada = KixKi-Store-Correcciones). Plan: PLAN-ESTRUCTURA.md. Base: BASELINE.txt
- [x] Fase 0 línea base + tools/calidad.mjs
- [x] Fase 1 carpetas (checkpoints/fase1-carpetas.zip; tests verdes salvo flakys)  - [x] Fase 2 formato+lint (checkpoints/fase2-formato.zip, entregado KixKi-Store-fases1-2.zip; test-dialogos corregido: calentamiento con búsqueda sin resultados)  - [ ] Fase 3 núcleo  - [ ] Fases 4-7 módulos  - [ ] Fase 8 cierre

## Ronda 3 · Fase 3 (núcleo) — HECHA (2026-11-12)
- store.js + util.js en uso; 75 catch vacíos → 0 (comentario con motivo, AST idéntico); ESLint 0 errores / 11 avisos.
- tools/serve.mjs, docs/ARQUITECTURA.md, LEEME actualizado; sw kixki-a164ef58 (63 archivos). Zip: KixKi-Store-fase3.zip.
- Pruebas: todas = base; test-dialogos flaky (falló 1 vez, pasó al repetir); test-inicio 1 mal (logo GifWidgets, hasta sync.mjs).
- CORRECCIÓN: el BORRAR-DEL-REPO.txt de fases1-2 decía borrar js/ y css/ (¡ahora son la página!). Reemplazado en el zip de fase 3.
- NO hecho aún de la fase 3 original: registry/bus/compat.js (se hará junto con partir Kixki, fases 4-6, donde se necesitan).
- Pendiente: fases 4-8 (cabeceras+nombres B2-B8, partir app.js, partir Kixki, dialogs por temas, docs finales). Siguiente: "continuar".

## Ronda 3 · Fases 4–8 — HECHAS (2026-11-14) — entrega ÚNICA y completa
- app.js, kixki.js, kixki2.js, kixki3.js, vacaboss.js, basket.js, consejos.js, dialogs.js, scenes.js, tienda.js, lluvia.js, music.js, vallas.js, xpbg.js e i18n.js partidos en módulos por tema (231 módulos JS, 0 imports circulares; patrón iniciar() + puente.js + objeto compartido, ver docs/ARQUITECTURA.md).
- Los archivos viejos quedan como «portales» (importan su carpeta y arrancan en orden). xp-games.js y xpmode.js siguen siendo scripts clásicos a propósito.
- 105 nombres de módulo de 1–2 letras renombrados (185 → 80; los que quedan son convenciones del cerebro de Kixki: K, S, KK, V…).
- Cabeceras 217/217. ESLint 0 errores / 0 avisos. Prettier al día. localStorage solo en core/store.js (+ los 2 scripts clásicos).
- Verificación: smoke 0 errores (PC+móvil, 132 apps, 0 404); test-buscador 25/0, extras 17/0, fondos 20/0, pixel-musica 16/0, tienda 60/0, vaca 68/0, xpbg 72/0, inicio 16/1 (logo GifWidgets hasta sync.mjs), check-dialogs OK, check-vaca OK; KXD (textos) idéntico al original; básquet, vallas, lluvia y consejos comparados con la versión previa.
- test-dialogos: sigue siendo sensible al tiempo (falla 0-1 comprobación distinta en ~1 de cada 3 corridas; también pasa limpio). La copia previa a la división pasó 2/2.
- Arranque medido en local: v2 ≈ 3,8–4,25 s, nueva ≈ 4,0–4,1 s (equivalente; producción por medir).
- NO cumplido del plan: líneas >200 fuera de datos 56 (plantillas HTML/SVG), funciones >60 líneas 45 (la base eran 29, medida distinta al partir las clausuras), nombres de 1–2 letras a nivel de módulo 80 (no 0), window.KX* sigue (sin registry/compat.js).
- Pendiente del usuario: revisar la carpeta .github (Action «Sincronizar logos y datos») y correr `node tools/sync.mjs`.
