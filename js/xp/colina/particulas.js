/*
  Partículas de la estación: pétalos, hojas, nieve y luciérnagas.
*/

import { reducirMovimiento as RM } from "../../core/util.js";
import { cfg } from "./estaciones.js";
import { prng, aleatorioEntre } from "./estado.js";
import { redondear2 } from "./pasto.js";
/* ---- partículas de la estación ---- */
export function fxMarkup() {
  const f = cfg().fx;
  if (!f || RM()) return "";
  const small = innerWidth < 720,
    N = Math.round(f.n * (small ? 0.6 : 1)),
    r = prng(4242 + N);
  let s = "";
  for (let i = 0; i < N; i++) {
    if (f.k === "fly") {
      /* luciérnagas: solo de noche (el CSS las oculta de día); vagan por la hierba y parpadean */
      const col = f.orange ? "background:#ffc46b;box-shadow:0 0 8px 3px rgba(255,150,40,.75);" : "";
      s += `<i class="px fly" style="--x:${redondear2(r() * 100)}%;--y:${redondear2(58 + r() * 34)}%;--d:${redondear2(aleatorioEntre(r, 7, 13))}s;--dl:-${redondear2(r() * 10)}s;--bk:${redondear2(aleatorioEntre(r, 1.6, 3.6))}s;--fx:${redondear2(aleatorioEntre(r, -70, 70))}px;--fy:${redondear2(aleatorioEntre(r, -40, 20))}px;${col}"></i>`;
      continue;
    }
    const z = aleatorioEntre(r, f.z[0], f.z[1]),
      col = f.c[Math.floor(r() * f.c.length)],
      d =
        f.k === "snow"
          ? aleatorioEntre(r, 9, 17) * (1 + (7 - z) * 0.03)
          : aleatorioEntre(r, 12, 22);
    s += `<i class="px ${f.k}" style="--x:${redondear2(r() * 110 - 5)}%;--z:${redondear2(z)}px;--d:${redondear2(d)}s;--dl:-${redondear2(r() * d)}s;--dx:${redondear2(f.k === "snow" ? aleatorioEntre(r, 4, 16) : aleatorioEntre(r, 16, 40))}vw;--rt:${Math.round(aleatorioEntre(r, 200, 720))}deg;--sw:${redondear2(aleatorioEntre(r, 8, 26))}px;--sd:${redondear2(aleatorioEntre(r, 2, 4.5))}s;--sl:-${redondear2(r() * 3)}s;--c:${col}"><b></b></i>`;
  }
  return s;
}
