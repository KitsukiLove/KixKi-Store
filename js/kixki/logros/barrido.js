/*
  Primer barrido al cargar: concede logros que ya se habían cumplido antes de existir.
*/

import { queueToast } from "./avisos.js";
import { fmt, KK } from "./base.js";
import { refreshMenu } from "./panel.js";
import { TEXTOS_UI } from "./textos.js";
import { caught, first } from "./vaca-amiga.js";
export function iniciar() {
  if (first && caught.length) {
    setTimeout(() => {
      queueToast({
        i: "trophy",
        head: TEXTOS_UI.sumHead,
        n: [
          fmt(TEXTOS_UI.sumName[0], { n: caught.length }),
          fmt(TEXTOS_UI.sumName[1], { n: caught.length }),
        ],
        d: TEXTOS_UI.sumDesc,
        long: 1,
      });
      KK.say(
        [
          `¡Oye! Revisé tu historial y ya tenías ${caught.length} logros. ¡Eres muy pro, no lo olvides! 🏆`,
          `Hey! I checked your history and you already had ${caught.length} achievements. You're so pro, never forget it! 🏆`,
        ],
        { p: 2 }
      );
    }, 9000);
  }
  refreshMenu();
}
