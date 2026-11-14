/*
  Lista de logros (A) y la función a() para añadir cada uno.
*/

/* ---------- lista de logros ----------
   a(id, icono, categoría, [nombre es/en], [descripción es/en], condición(ctx), opciones)
   opciones: hid (oculto del todo hasta desbloquearlo) · secret + h (pista) · pc (solo PC) · big (confeti grande) · quiet (la parte 1 ya habla de eso) · game · k (frase de Kixki) */
export const LOGROS = [];

export const definir = (id, i, c, n, d, f, o) =>
  LOGROS.push(Object.assign({ id, i, c, n, d, f }, o || {}));
