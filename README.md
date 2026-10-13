# Kixki Store

**Añadir una app:** abre `apps.json`, copia una entrada de `apps` y cambia `name`, `tag`, `desc` y `links`.
El logo se busca solo desde el repositorio (o pon `"logo": ["https://…"]`). Opcional: `"tip"` para un aviso.
Al subir `apps.json`, la Action «Sincronizar logos y datos» descarga los logos, las estrellas de GitHub,
las fuentes y el QR a la propia web, así los visitantes no contactan con terceros.

Probar en local: `python3 -m http.server` y abrir http://localhost:8000

**Novedades:** añade `"added":"2026-10-13"` a una app para que salga como «Nueva» 12 días.
**Vista:** la pestaña «Modo PC / Modo móvil» (abajo a la derecha) cambia el diseño; sirve para jugar con la oveja desde el móvil.
**Idioma:** menú Kixki → Idioma (español / English).
