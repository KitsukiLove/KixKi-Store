/* =========================================================
   CARGA DIFERIDA · core/carga.js
   Qué hace:  carga los estilos y el código de Kixki cuando la página ya se ve y el navegador está inactivo
              (dialogs.js pesa ~150 KB: antes bloqueaba el arranque en el celular).
   Qué necesita: que main.js le pase `cargarModulo`, una función que haga el import() del grupo de Kixki.
   Qué publica:  cargaDiferida(opciones).

   Orden (importante): primero los CSS, luego el código. Kixki no debe aparecer sin sus estilos.
   Los CSS se insertan antes de los del modo XP (link[data-xp]) para que XP siga ganando la cascada.
   El orden de ejecución del código lo fija js/kixki/index.js (imports en fila), no este archivo.
   ========================================================= */

const ESPERA_MAX_CSS_MS = 3000; /* si algún CSS no responde, se sigue igual: sin estilos Kixki se vería feo, sin Kixki no hay nada */
const ESPERA_MAX_IDLE_MS = 1500; /* tiempo máximo que se espera a que el navegador esté inactivo */
const RESPALDO_SIN_IDLE_MS = 150; /* navegadores sin requestIdleCallback */

/** Inserta un <link rel=stylesheet> antes de los CSS del modo XP; devuelve una promesa que se cumple al cargar (o fallar). */
function cargarCss(href) {
  return new Promise((listo) => {
    const enlace = document.createElement("link");
    enlace.rel = "stylesheet";
    enlace.href = href;
    enlace.onload = enlace.onerror = () => listo();
    const primerXP =
      document.head.querySelector(
        "link[data-xp]"
      ); /* si XP ya puso sus CSS, los nuestros van antes */
    document.head.insertBefore(enlace, primerXP || null);
  });
}

/**
 * @param {{css: string[], cargarModulo: () => Promise<unknown>}} opciones
 *   css: rutas (relativas a index.html) de los estilos de Kixki.
 *   cargarModulo: () => import("./kixki/index.js") — va en main.js porque el import() se resuelve respecto al archivo que lo escribe.
 */
export function cargaDiferida({ css, cargarModulo }) {
  let iniciado = false;
  const ir = async () => {
    if (iniciado) return;
    iniciado = true;
    await Promise.race([
      Promise.all(css.map(cargarCss)),
      new Promise((r) => setTimeout(r, ESPERA_MAX_CSS_MS)),
    ]);
    await cargarModulo();
  };
  const esperarInactividad = () => {
    if ("requestIdleCallback" in window) requestIdleCallback(ir, { timeout: ESPERA_MAX_IDLE_MS });
    else setTimeout(ir, RESPALDO_SIN_IDLE_MS);
  };
  if (document.readyState === "complete") esperarInactividad();
  else addEventListener("load", esperarInactividad, { once: true });
}
