# Kixki Store

**Añadir una app:** abre `apps.json`, copia una entrada de `apps` y cambia `name`, `tag`, `desc` y `links`.
El logo se busca solo desde el repositorio (o pon `"logo": ["https://…"]`). Opcional: `"tip"` para un aviso.
Al subir `apps.json`, la Action «Sincronizar logos y datos» descarga los logos, las estrellas de GitHub,
las fuentes y el QR a la propia web, así los visitantes no contactan con terceros.

Probar en local: `python3 -m http.server` y abrir http://localhost:8000

**Novedades:** añade `"added":"2026-10-13"` a una app para que salga como «Nueva» 12 días.
**Vista:** la pestaña «Modo PC / Modo móvil» (abajo a la derecha) cambia el diseño; sirve para jugar con la oveja desde el móvil.
**Idioma:** menú Kixki → Idioma (español / English).

## Kixki, la oveja guía

- `kixki.js` + `kixki.css` (parte 1): Kixki pasea por la barra de búsqueda y las carpetas, habla y reacciona.
- `kixki2.js` + `kixki2.css` (parte 2): **logros** (menú Kixki / Más → «Logros»), y en PC Kixki baja a charlar con la ovejita que camina abajo.
- `app.js` avisa a Kixki con los eventos `kixki-ready` y `kixki-game` (start · retry · score · record · over).
- Los logros se guardan en `localStorage` (`kixki-a`). En la consola: `KXQ.list()`, `KXQ.grant("id")`, `KXQ.reset()`.
- Verano: con el fondo de verano y de día, la ovejita de abajo a veces se incendia (PC). Tócala 3 veces para apagarla; si tardas ~14 s, Kixki baja a hacerlo. En la consola: `KXQ.fire()`.

## Novedades (Salta Vallas, lluvia y vaca)

- **Salta Vallas** (`vallas.js`, antes «Saltaovejas»): la oveja corre por un valle (cielo, sol/luna, nubes, montañas, árboles, vallas lejanas, flores) y salta vallas de 1 a 3 tramos, bajas/altas. La velocidad sube poco a poco, ↓ baja rápido, si pulsas un pelín antes de aterrizar el salto queda en cola. Sigue avisando a Kixki con `kixki-game` y usa `kixki-rec` / `kixki-gp`.
- **Clima de lluvia** (`lluvia.js` + `lluvia.css`): lluvia pixelada sobre cualquier fondo. Menú → «Lluvia: auto / sí / no» (en auto llueve de vez en cuando, nunca con el fondo de nieve). Si dejas la página quieta, las gotas chocan con la pantalla y se quedan pegadas; pasa el dedo o el ratón para limpiarlas. En la consola: `KXRAIN.start()`, `KXRAIN.stop()`, `KXRAIN.on()`.
- **Lluvia + fuego de verano:** con lluvia no se incendia la ovejita, y si ya estaba ardiendo la lluvia la apaga sola.
- **vaca.exe:** al llegar a los 1000 toques, Kixki sube a la ventana de la vaca y charlan. Acariciar la vaca (clic/toque en la imagen) 3 veces, o dejar que acabe la charla, desbloquea un **logro oculto** que no sale en la lista (ni cuenta en el total) hasta que lo consigues. En la consola: `KXQ.cow()`.
- Logros nuevos de la categoría «Clima»: Día de lluvia, Gotas en la pantalla, Limpiaparabrisas y Bendita lluvia.
