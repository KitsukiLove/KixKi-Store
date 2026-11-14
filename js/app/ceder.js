/*
  Ceder el hilo entre etapas pesadas del arranque.

  cederHilo() deja que el navegador pinte y atienda toques antes de seguir con la siguiente etapa.
  Solo se usa en español: en inglés, i18n.js traduce todo el documento cuando el hilo queda libre y varias etapas
  de app.js leen el texto en español de lo recién dibujado (ver docs/ARQUITECTURA.md).
*/

/* Y(): cede el hilo al navegador (pintar, atender toques) entre etapas pesadas; antes todo corría en una sola tarea larga.
   Solo se usa en español: varias etapas leen el texto en español de la página recién dibujada, y en inglés el traductor (i18n.js)
   la traduciría entre etapas y esas lecturas fallarían. En inglés todo sigue en una sola tarea, como antes. */
export const cederHilo = () =>
  "scheduler" in window && scheduler.yield ? scheduler.yield() : new Promise((r) => setTimeout(r));
