# Kixki Store

**Añadir una app:** abre `apps.json`, copia una entrada de `apps` y cambia `name`, `tag`, `desc` y `links`.
El logo se busca solo desde el repositorio (o pon `"logo": ["https://…"]`). Opcional: `"tip"` para un aviso.
Al subir `apps.json`, la Action «Sincronizar logos y datos» descarga los logos, las estrellas de GitHub,
las fuentes y el QR a la propia web, así los visitantes no contactan con terceros.

Probar en local: `python3 -m http.server` y abrir http://localhost:8000

**Categorías:** cada categoría de `apps.json` (`id`, `e`, `t`, `s`) sale como ventana, carpeta del escritorio y botón de la barra. Para mover una app de carpeta, corta su entrada y pégala en `apps` de otra categoría. Para crear una categoría nueva, además de `apps.json` hay que añadir su `id` en `META` (nombre corto y color) e `ICO` (icono pixel) de `app.js`, y su traducción al inglés en `i18n.js`; opcional: una frase en `FOLD` de `kixki.js`.

**Menús (Kixki en PC · «Más» en móvil):** solo llevan las opciones generales. Las carpetas se abren desde el escritorio y la barra de tareas (PC) o desde las filas de carpetas y la barra de abajo (móvil).
**Packs:** las listas de «instalar varias apps de una vez» están en `PACKS` al final de `app.js` (icono, nombre, descripción y los nombres de las apps tal como están en `apps.json`). Si añades su texto en inglés a `i18n.js`, también se traduce.
**Novedades:** añade `"added":"2026-10-13"` a una app para que salga como «Nueva» 12 días.
**Vista:** la pestaña «Modo PC / Modo móvil» (abajo a la derecha) cambia el diseño; sirve para jugar con la oveja desde el móvil.
**Idioma:** menú Kixki → Idioma (español / English).

## Kixki, la oveja guía

- `kixki.js` + `kixki.css` (parte 1): Kixki pasea por la barra de búsqueda y las carpetas, habla y reacciona.
- `kixki2.js` + `kixki2.css` (parte 2): **logros** (menú Kixki / Más → «Logros»), y en PC Kixki baja a charlar con la ovejita que camina abajo.
- `kixki3.js` + `kixki3.css` (parte 3): **personalidad pícara, travesuras y físicas**.
  - **Se puede agarrar:** arrastra a Kixki con el ratón o el dedo, por toda la página. Al soltarla cae, rebota y aterriza en la barra de búsqueda, en una ventana, en las filas de carpetas (móvil) o en el suelo. Si la lanzas, lo comenta.
  - **Ventanas:** si está encima de una ventana y la mueves, la cierras o la minimizas, se cae y se enfada (💢) unos segundos.
  - **Travesuras al azar** (menú → «Travesuras de Kixki: sí/no»): cambia el fondo si llevas ~6-10 min con el mismo (no lo hace con «Auto») y, en PC, «cierra» una ventana al azar (a veces estando ella encima).
  - **Charla:** chismes, teorías conspirativas de la tienda, comentarios «del código» y el plan secreto «Lana Total» (sube un % cada vez que lo menciona y se guarda entre visitas). Todo está en el objeto `TX` al principio de `kixki3.js`: añade o cambia frases ahí, en `[español, English]`.
  - En la consola: `KXK3.bg()`, `KXK3.close()`, `KXK3.scene("gossip"|"conspi"|"code"|"plan"|"sass")`, `KXK3.plan(50)`, `KXK3.state`.
- `basket.js` + `basket.css` (parte 4): **cancha secreta de básquet**.
  - `kixki3.js` cuenta los lanzamientos de verdad (soltarla con impulso) y avisa con el evento `throw`. A los **10** aparece una pestañita pegada al borde derecho de la pantalla (queda guardada en `kixki-bk`).
  - Al tocarla se abre `basquet.exe`: arrastra a Kixki hacia atrás y suéltala (resortera, con guía de puntos). Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro. Con cada canasta Kixki dice que «¡Kitsuki pagará por esto!». Las frases están en el objeto `TX` al principio de `basket.js`.
  - Logros nuevos: «Oveja voladora», «¡Canasta!» y «Estrella de la NBA (ovina)». En la consola: `KXBK.unlock()`, `KXBK.open()`, `KXBK.state`.
- **Gestor de diálogos** (en `kixki.js`, sección «gestor de diálogos»): todas las frases pasan por `KXK.say(mensaje, opciones)`.
  - Opciones: `p` (prioridad 1-3), `cat`, `key` + `cd` (enfriamiento), `ttl`, `replace`, `instant`, `ctx`, `mood`, `hl`, `vars`, `onStart`. Devuelve una promesa: `true` si se dijo entera, `false` si se descartó o la cortaron.
  - Categorías: **`ev`** eventos físicos (agarrar, lanzar, caer, ventana): reemplazan al globo actual en vez de esperar, salen de golpe y caducan a los 600 ms si no pueden salir · **`sp`** charla espontánea: tiene presupuesto por minuto (`KXK.budget(n, pausaMs)`, por defecto 5 y 15 s) · `amb` (p1) y `ui` (p2-p3): reacciones normales, con cola de 4 y caducidad de 12 s.
  - El **enfriamiento solo se gasta si la frase se dice de verdad**. `KXK.interrupt()` corta el globo y vacía la cola (`interrupt("ev")` solo la de ese contexto).
  - **Lanzar** usa la misma condición que el contador de la cancha (`THROW_V`, 850 px/s, en `kixki3.js`): la frase sale al soltarla, vaya donde vaya, y al aterrizar solo a veces remata.
  - Escritura: 14 ms por letra, pausa corta solo al final de una oración o cláusula (nunca por cada signo repetido); un clic en el globo muestra la frase entera y otro la cierra. El tamaño del globo se mide una vez por frase, no en cada fotograma.
  - Depurar: `KXK.debug = true` (o `?kxdebug` en la URL) escribe en la consola la línea de tiempo de cada frase (`req → begin → typed → done`, con los ms desde que se pidió); `KXK.timeline()` la devuelve.
  - **Prueba automática** (Chromium headless): `npm i -D playwright` y `node tools/test-dialogos.mjs` (o `... movil`). Suelta a Kixki con varias velocidades y direcciones y comprueba que la frase sale en menos de 400 ms (en las pruebas, 1-8 ms; antes 5-6 s o ninguna), más las pruebas del gestor.
- `app.js` avisa a Kixki con los eventos `kixki-ready` y `kixki-game` (start · retry · score · record · over).
- Los logros se guardan en `localStorage` (`kixki-a`). En la consola: `KXQ.list()`, `KXQ.grant("id")`, `KXQ.reset()`.
- Verano: con el fondo de verano y de día, la ovejita de abajo a veces se incendia (PC). Tócala 3 veces para apagarla; si tardas ~14 s, Kixki baja a hacerlo. En la consola: `KXQ.fire()`.

## Novedades (Salta Vallas, lluvia y vaca)

- **Salta Vallas** (`vallas.js`, antes «Saltaovejas»): la oveja corre por un valle (cielo, sol/luna, nubes, montañas, árboles, vallas lejanas, flores) y salta vallas de 1 a 3 tramos, bajas/altas. La velocidad sube poco a poco, ↓ baja rápido, si pulsas un pelín antes de aterrizar el salto queda en cola. Sigue avisando a Kixki con `kixki-game` y usa `kixki-rec` / `kixki-gp`.
- **Clima de lluvia** (`lluvia.js` + `lluvia.css`): lluvia pixelada sobre cualquier fondo. Menú → «Lluvia: auto / sí / no» (en auto llueve de vez en cuando, nunca con el fondo de nieve). Si dejas la página quieta, las gotas chocan con la pantalla y se quedan pegadas; pasa el dedo o el ratón para limpiarlas. En la consola: `KXRAIN.start()`, `KXRAIN.stop()`, `KXRAIN.on()`.
- **Lluvia + fuego de verano:** con lluvia no se incendia la ovejita, y si ya estaba ardiendo la lluvia la apaga sola.
- **vaca.exe:** al llegar a los 1000 toques, Kixki sube a la ventana de la vaca y charlan. Acariciar la vaca (clic/toque en la imagen) 3 veces, o dejar que acabe la charla, desbloquea un **logro oculto** que no sale en la lista (ni cuenta en el total) hasta que lo consigues. En la consola: `KXQ.cow()`.
- Logros nuevos de la categoría «Clima»: Día de lluvia, Gotas en la pantalla, Limpiaparabrisas y Bendita lluvia.
- **Sonido de lluvia** (dentro de `lluvia.js`, sin archivos de audio): sonido relajante sintetizado (lluvia suave, murmullo de tejado y gotitas). Suena cuando llueve y el sonido de la página está activo (botón del altavoz); se apaga con «Sonido de lluvia: no» en el menú.
