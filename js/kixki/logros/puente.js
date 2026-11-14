/*
  Puente: tabla donde cada módulo anota las funciones que otros módulos anteriores necesitan llamar.
  Sirve para que los módulos no se importen en círculo: un módulo solo importa de los que se cargan ANTES
  y usa puente.nombre() para llamar a los que se cargan DESPUÉS (ya registrados cuando se ejecuta cualquier acción).
*/

export const puente = {};
