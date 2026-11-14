/* =========================================================
   ALMACÉN · core/store.js
   Qué hace:  es el ÚNICO lugar del código que toca localStorage. Antes cada archivo repetía su try/catch
              (más de 50 sitios y 4 copias de un ayudante «LS»). Si el navegador bloquea el almacenamiento
              (modo privado, datos desactivados), nada falla: se usan los valores por defecto.
   Qué necesita: nada.
   Qué publica:  leer, guardar, borrar, leerObjeto, leerTexto, guardarTexto.

   Dos formas de guardar (se respeta lo que ya había guardado la gente, no se cambia ninguna clave):
     · JSON  → leer / guardar / leerObjeto   (números, listas, objetos, textos entre comillas)
     · texto → leerTexto / guardarTexto      (valores sueltos como "dark" o "1")
   Excepciones: js/xp/xpmode.js y js/xp/xp-games.js son scripts clásicos (no pueden importar) y llevan su propia copia mínima.
   ========================================================= */

/** Acceso protegido: devuelve `porDefecto` si localStorage no está disponible o lanza. */
function conAlmacen(accion, porDefecto) {
  try {
    return accion(localStorage);
  } catch {
    /* almacenamiento bloqueado o lleno: la página sigue funcionando sin recordar */
    return porDefecto;
  }
}

/** ¿El valor leído tiene el mismo tipo que el valor por defecto? (un dato dañado o de otro tipo se descarta) */
function mismoTipo(leido, porDefecto) {
  if (porDefecto == null) return true;
  return (
    leido != null &&
    typeof leido === typeof porDefecto &&
    Array.isArray(leido) === Array.isArray(porDefecto)
  );
}

/** Lee un valor JSON. Si no existe, está dañado o es de otro tipo que `porDefecto`, devuelve `porDefecto`. */
export function leer(clave, porDefecto = null) {
  return conAlmacen((ls) => {
    const crudo = ls.getItem(clave);
    if (crudo == null) return porDefecto;
    const valor = JSON.parse(crudo);
    return mismoTipo(valor, porDefecto) ? valor : porDefecto;
  }, porDefecto);
}

/** Guarda un valor como JSON. Devuelve false si no se pudo guardar. */
export function guardar(clave, valor) {
  return conAlmacen((ls) => (ls.setItem(clave, JSON.stringify(valor)), true), false);
}

/** Lee un objeto y le pone por debajo los valores por defecto: { ...porDefecto, ...guardado }. Siempre devuelve una copia nueva. */
export function leerObjeto(clave, porDefecto) {
  const guardado = leer(clave, null);
  const esObjeto = guardado && typeof guardado === "object" && !Array.isArray(guardado);
  return { ...porDefecto, ...(esObjeto ? guardado : {}) };
}

/** Lee un texto tal cual (sin JSON). Devuelve `porDefecto` si no existe o no hay almacenamiento. */
export function leerTexto(clave, porDefecto = null) {
  return conAlmacen((ls) => {
    const t = ls.getItem(clave);
    return t == null ? porDefecto : t;
  }, porDefecto);
}

/** Guarda un texto tal cual. Devuelve false si no se pudo. */
export function guardarTexto(clave, texto) {
  return conAlmacen((ls) => (ls.setItem(clave, String(texto)), true), false);
}

/** Borra una clave. */
export function borrar(clave) {
  return conAlmacen((ls) => (ls.removeItem(clave), true), false);
}
