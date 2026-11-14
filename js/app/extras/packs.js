/*
  Packs: colecciones de apps por tema (Privacidad, etc.) que se muestran como ventana especial, con botón para copiar
  la lista de enlaces. Al final termina de llenar Novedades y Favoritas.
*/

import { $$, normalizar as nrm } from "../../core/util.js";
import { ICON } from "../catalogo/catalogo.js";
import { nombreDeApp, appsOriginales, ventanaPorId, VENTANAS_ESPECIALES } from "./base.js";
import { ponerContador, llenarVentana, novedades, refrescarFavoritas } from "./listas.js";

const PACKS = [
  [
    "🛡️",
    "Privacidad",
    "Menos rastreo y más control sobre lo que sale de tu móvil.",
    [
      "Aurora Store",
      "F-Droid",
      "FireWall Blocks",
      "PrivacyFlip",
      "No More Background",
      "LeanType",
      "Exodus",
      "Bitwarden",
      "Aegis Authenticator",
    ],
  ],
  [
    "💬",
    "Mensajes privados",
    "Chatea con cifrado de extremo a extremo, con o sin número de teléfono.",
    ["Signal", "Session"],
  ],
  [
    "🎨",
    "Personalizar",
    "Widgets, fondos y teclado para dejar el móvil a tu gusto.",
    ["Widgets Pro", "Photo Widget", "GIF Live Wallpaper", "Essentials", "LeanType"],
  ],
  [
    "🚀",
    "Para empezar",
    "Lo mínimo para instalar y actualizar apps sin Play Store.",
    [
      "F-Droid",
      "Droid-ify",
      "Aurora Store",
      "Komi Store",
      "Obtainium",
      "Universal Installer",
      "Shizuku",
    ],
  ],
  ["🎧", "Música", "Para escuchar y descargar tu música.", ["Poweramp", "SpotiFLAC", "ClassiPod"]],
  [
    "⚡",
    "Optimización",
    "Libera espacio, quita apps que sobran y ahorra batería.",
    [
      "SD Maid SE",
      "EnforceDoze",
      "Essentials",
      "ADL",
      "Shizuku",
      "Canta",
      "No More Background",
      "BatStats",
    ],
  ],
];

export function iniciar() {
  (function () {
    const p = ventanaPorId("packs").querySelector(".panel"),
      by = {};
    appsOriginales().forEach((a) => (by[nombreDeApp(a)] = a));
    PACKS.forEach(([ic, t, d, l]) => {
      const ok = l.filter((n) => by[n]);
      const txt =
        `Pack «${t}» de Kixki Store\n` +
        ok
          .map((n) => {
            const a = by[n].querySelector(".links a");
            return "• " + n + (a ? ": " + a.href : "");
          })
          .join("\n");
      p.insertAdjacentHTML(
        "beforeend",
        `<article class="app sel" data-pk="${t}" data-s="${nrm(t + " " + d)}"><div class="logo" aria-hidden="true">${ic}</div><div class="info"><div class="line"><h3>${t}</h3><span class="tag">${ok.length} apps</span></div><p class="desc">${d}</p><div class="links">${ok.map((n) => `<button type="button" class="btn" data-go="${n}">${n}</button>`).join("")}<button type="button" class="btn p" data-cp="${txt.replace(/"/g, "&quot;")}">${ICON.copy}Copiar lista</button></div></div></article>`
      );
    });
    ponerContador("packs", `${PACKS.length} packs`);
  })();
  llenarVentana(
    "news",
    appsOriginales().filter((a) => novedades.includes(nombreDeApp(a))),
    "Sin novedades por ahora. Cuando añada apps nuevas, aparecerán aquí.",
    "🆕"
  );
  refrescarFavoritas();
  VENTANAS_ESPECIALES.forEach((id) => ventanaPorId(id).classList.add("ex"));
  $$(".cat").forEach((s) => s.classList.add("ex"));
}
