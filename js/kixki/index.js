/* =========================================================
   KIXKI · grupo de módulos (js/kixki/index.js)
   Qué hace:  fija el ORDEN en que arrancan los módulos de Kixki. Los import estáticos se ejecutan en fila,
              así que este archivo es la lista de arranque (antes estaba repartida entre carga.js y sw.js).
   Orden (no lo cambies sin probar): textos → cerebro → logros/mascota → física → cancha → consejos → vaca jefa.
   Se carga con import() desde js/main.js cuando la página está inactiva.
   ========================================================= */
import "../dialogos/dialogs.js"; /* textos y diálogos: expone KXD */
import "./kixki.js"; /* cerebro: expone KXK */
import "./kixki2.js"; /* logros, chat con la mascota, paraguas/fuego, Modo Hacker: expone KXQ */
import "./kixki3.js"; /* física (agarrar, lanzar, caer), ánimo y travesuras: expone KXK3 */
import "./basket.js"; /* cancha secreta de básquet: expone KXBK */
import "./consejos.js"; /* pedir consejo sobre una carpeta: expone KXK4 */
import "./vacaboss.js"; /* vaca.exe se rebela: expone KXV */
