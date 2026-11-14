/*
  Definición de cada fondo (SC) y de cada paisaje pixel (P).
*/

import { xpScene, xpv } from "./colina-xp.js";
import {
  bat,
  cloud,
  dead,
  disc,
  flower,
  hill,
  pine,
  pump,
  rect,
  ST,
  sunf,
  tree,
} from "./formas.js";
export let ESCENAS;

export const PAISAJES = {
  valle: [
    [
      "#5db7f5",
      "#7ccaf9",
      "#a3dcfb",
      "#cdeefe",
      "#8bdc72",
      "#5cc25f",
      "#3ea24d",
      "#ffe27a",
      "#7a4a2a",
      "#ff9fd0",
      "#ffffff",
      "#2f8f5b",
      "#2a1650",
    ],
    [
      "#070d2e",
      "#0e1a4d",
      "#1a2d6d",
      "#2b4690",
      "#245a4a",
      "#1b4a3b",
      "#133a2e",
      "#fff3c4",
      "#3b2a22",
      "#ffd36e",
      "#6f86c8",
      "#1f6b45",
      "#070d2e",
    ],
  ],
  halloween: [
    [
      "#6b2d8f",
      "#a8408f",
      "#ee7a4a",
      "#ffb35c",
      "#4a2466",
      "#35194d",
      "#231235",
      "#ffd36e",
      "#1b0f2e",
      "#ff8a1e",
      "#e9a6c8",
      "#1b0f2e",
      "#1b0f2e",
    ],
    [
      "#0c0620",
      "#190b3d",
      "#2b1259",
      "#46207a",
      "#2a1648",
      "#1c0f33",
      "#120a24",
      "#ffb347",
      "#07030f",
      "#ff8a1e",
      "#5a3a8a",
      "#07030f",
      "#07030f",
    ],
  ],
  navidad: [
    [
      "#8cc6f0",
      "#acd8f6",
      "#cbe7fa",
      "#e8f5ff",
      "#ffffff",
      "#e9f2ff",
      "#d3e4fa",
      "#fff3b0",
      "#6b4226",
      "#e8394d",
      "#ffffff",
      "#2f8f5b",
      "#2a1650",
    ],
    [
      "#070b2a",
      "#0f1b4a",
      "#1b2f6b",
      "#2d4a8f",
      "#cfe0ff",
      "#a9c2ee",
      "#8aa6d8",
      "#fff7d0",
      "#4a2d1a",
      "#ffd36e",
      "#8aa6d8",
      "#1f6b45",
      "#070b2a",
    ],
  ],
  primavera: [
    [
      "#8fd3f7",
      "#b2e3fa",
      "#d6f1fd",
      "#f1fbff",
      "#a5e682",
      "#7fd16a",
      "#5bb857",
      "#fff09a",
      "#7a4a2a",
      "#ff8fc7",
      "#ffffff",
      "#3fa05a",
      "#2f6f46",
    ],
    [
      "#0b1238",
      "#142257",
      "#233a7a",
      "#36508f",
      "#2f6a55",
      "#245a47",
      "#1a4a3a",
      "#f4f1d0",
      "#3b2a22",
      "#ff9fd0",
      "#6f86c8",
      "#26734b",
      "#0b1238",
    ],
  ],
  verano: [
    [
      "#3fa8f0",
      "#69bff6",
      "#98d5fb",
      "#c9ebfd",
      "#b8e05a",
      "#8fcf4a",
      "#6db83d",
      "#ffd23a",
      "#7a4a2a",
      "#ffc21a",
      "#ffffff",
      "#3d9b3d",
      "#2a6a2a",
    ],
    [
      "#060a26",
      "#0d1744",
      "#1a2d6d",
      "#2e4c94",
      "#3d6a3a",
      "#2f5a2f",
      "#234a26",
      "#fff3c4",
      "#3b2a22",
      "#ffe27a",
      "#5a74b8",
      "#2b6b30",
      "#060a26",
    ],
  ],
  otono: [
    [
      "#e9a35c",
      "#f2bf7c",
      "#f8d9a3",
      "#fdeccb",
      "#d29a3c",
      "#b9772c",
      "#9a5a24",
      "#ffe08a",
      "#5a3a22",
      "#e8742c",
      "#fff1d6",
      "#d9601f",
      "#4a2a15",
    ],
    [
      "#1a0f2e",
      "#2b1a3f",
      "#45274a",
      "#63364f",
      "#4a3220",
      "#3a2819",
      "#2a1c12",
      "#ffd9a0",
      "#2e1d12",
      "#e8742c",
      "#7a5a8a",
      "#a8461a",
      "#10081a",
    ],
  ],
  xp: [
    [
      "#2b6ad6",
      "#4b8fe6",
      "#7db5f0",
      "#c5e3f7",
      "#9fe04e",
      "#58b52b",
      "#2c8a1c",
      "#fff3c4",
      "#79b36f",
      "#4fa535",
      "#ffffff",
      "#c9f27e",
      "#1e6a16",
    ],
    [
      "#060d2e",
      "#0e1d52",
      "#1a3a82",
      "#2c5aa8",
      "#2f7a35",
      "#22592a",
      "#163f1f",
      "#fff3c4",
      "#2a5a55",
      "#1d4a28",
      "#7d93cc",
      "#3e8e48",
      "#0c2a12",
    ],
  ],
  xp_primavera: [
    [
      "#5aa9ee",
      "#86c5f6",
      "#b6e0fb",
      "#e4f5ff",
      "#b4f070",
      "#6ccf3c",
      "#2e9a30",
      "#fff6c9",
      "#8cc79a",
      "#62b84a",
      "#ffffff",
      "#d6f78e",
      "#1e6a16",
    ],
    [
      "#0a1038",
      "#132460",
      "#24408a",
      "#3a5ea6",
      "#3e8a4a",
      "#2a6a3a",
      "#1b4a2a",
      "#f4f1d0",
      "#2f6a5a",
      "#25623a",
      "#8aa0d8",
      "#58a860",
      "#0c2a12",
    ],
  ],
  xp_verano: [
    [
      "#1f7fe0",
      "#3f9cf0",
      "#79bff8",
      "#bfe3fb",
      "#c5e84a",
      "#8cc53a",
      "#4f8f22",
      "#ffe27a",
      "#9cc56e",
      "#7fb03a",
      "#ffffff",
      "#e6f56a",
      "#2f6a1a",
    ],
    [
      "#050a2a",
      "#0b1850",
      "#183a82",
      "#2a5aa8",
      "#47803a",
      "#356a2c",
      "#244f1f",
      "#fff3c4",
      "#35633f",
      "#2e5a2e",
      "#7d93cc",
      "#6aa84a",
      "#0c2a12",
    ],
  ],
  xp_otono: [
    [
      "#e7a05a",
      "#f2bf85",
      "#f9dcb0",
      "#fdeed2",
      "#e8c04a",
      "#c98a2a",
      "#8f5420",
      "#fff0c0",
      "#b8905a",
      "#b5702a",
      "#fff3e0",
      "#f3d070",
      "#5a2d12",
    ],
    [
      "#1a0f33",
      "#2e1a4a",
      "#51305a",
      "#7a4a5e",
      "#7a5a2a",
      "#5e4020",
      "#3f2a14",
      "#ffd9a0",
      "#4a3828",
      "#4a3220",
      "#9a7aa8",
      "#a8803a",
      "#1a0c06",
    ],
  ],
  xp_invierno: [
    [
      "#8fb0d6",
      "#b4cbe6",
      "#d6e4f2",
      "#eef4fa",
      "#ffffff",
      "#dce9f8",
      "#b2c8e6",
      "#fff8dc",
      "#c6d6ec",
      "#e6eefa",
      "#ffffff",
      "#f4f9ff",
      "#47617f",
    ],
    [
      "#070b26",
      "#101c4e",
      "#1e3578",
      "#34509c",
      "#a8c0e8",
      "#8aa6d8",
      "#6a86bb",
      "#f4f6ff",
      "#5a72a6",
      "#7a94c8",
      "#9fb2e0",
      "#cfe0ff",
      "#1a2646",
    ],
  ],
  xp_halloween: [
    [
      "#2a1450",
      "#6b2d8f",
      "#d2584a",
      "#ffa24a",
      "#6a4a8a",
      "#3f2a5e",
      "#241438",
      "#ffb04a",
      "#3a2358",
      "#2e1b48",
      "#c98ab8",
      "#b283e8",
      "#0e0618",
    ],
    [
      "#07031a",
      "#12082e",
      "#241049",
      "#3a1a62",
      "#40305f",
      "#2c2046",
      "#1a1230",
      "#ff9a2e",
      "#2a1b44",
      "#1f1436",
      "#6a4a8a",
      "#8a5fc8",
      "#05020c",
    ],
  ],
  xp_navidad: [
    [
      "#7fa6d8",
      "#a9c6e8",
      "#cfe0f4",
      "#eef5fc",
      "#ffffff",
      "#e4eefb",
      "#bcd0ee",
      "#fff6cf",
      "#c9d9ee",
      "#eaf1fb",
      "#ffffff",
      "#f2f7ff",
      "#2f6a4a",
    ],
    [
      "#060a28",
      "#0c1a50",
      "#1a3278",
      "#2a4c9a",
      "#b4c9ec",
      "#93aedb",
      "#6f8cc0",
      "#fff7d0",
      "#566fa6",
      "#7a94c8",
      "#9fb2e0",
      "#d6e4ff",
      "#142040",
    ],
  ],
  vacas: [
    [
      "#ffd9ee",
      "#ffcbe6",
      "#ffbde0",
      "#ffb0da",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#2a1650",
      "#2a1650",
      "#ffffff",
      "#2a1650",
      "#2a1650",
    ],
    [
      "#e7a3d6",
      "#e39ad2",
      "#de90cd",
      "#d986c8",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#2a1650",
      "#2a1650",
      "#ffffff",
      "#2a1650",
      "#2a1650",
    ],
  ],
  invierno: [
    [
      "#a9c8e8",
      "#c3daf0",
      "#dcebf8",
      "#f1f7fd",
      "#ffffff",
      "#eaf2fc",
      "#d6e5f6",
      "#fff8d0",
      "#5a4636",
      "#a9c2ee",
      "#c9d9ee",
      "#2f7f5b",
      "#4a3a30",
    ],
    [
      "#060a22",
      "#0e1a46",
      "#1c3068",
      "#2f4c8e",
      "#cfe0ff",
      "#aac2ee",
      "#88a4d8",
      "#f4f6ff",
      "#2e2a2a",
      "#8aa6d8",
      "#8aa6d8",
      "#1f5f45",
      "#1a1622",
    ],
  ],
};

export function iniciar() {
  ESCENAS = {
    valle: {
      top: ST + disc(33, 7, 4, "a") + cloud(6, 5) + cloud(20, 12) + cloud(44, 3),
      bot:
        hill(20, 2.5, 7, 0, "g1") +
        hill(26, 2, 5, 2, "g2") +
        hill(32, 1.5, 9, 4, "g3") +
        [
          [6, 34],
          [13, 36],
          [22, 35],
          [30, 37],
          [41, 34],
          [50, 36],
          [58, 35],
        ]
          .map(([x, y]) => rect(x, y, 1, 1, "o"))
          .join(""),
    },
    halloween: {
      top: ST + disc(18, 9, 6, "a") + bat(26, 5) + bat(33, 12) + bat(40, 6),
      bot:
        hill(24, 2, 8, 1, "g1") +
        hill(29, 1.5, 6, 3, "g2") +
        hill(34, 1, 10, 0, "g3") +
        dead(32, 12) +
        pump(8, 31) +
        pump(15, 33) +
        pump(24, 34) +
        pump(38, 32),
    },
    navidad: {
      top: ST + disc(18, 7, 3, "a"),
      bot:
        hill(26, 2, 9, 0, "g1") +
        pine(8, 18, 9) +
        pine(17, 20, 8) +
        pine(29, 15, 12) +
        pine(39, 21, 7) +
        hill(31, 1.5, 6, 2, "g2") +
        hill(35, 1, 8, 4, "g3"),
    },
    primavera: {
      top: ST + disc(50, 7, 4, "a") + cloud(8, 6) + cloud(26, 12) + cloud(36, 3),
      bot:
        hill(22, 2, 7, 1, "g1") +
        tree(14, 14, 4, "o") +
        tree(47, 16, 3, "o") +
        hill(28, 1.5, 5, 0, "g2") +
        hill(33, 1.5, 9, 3, "g3") +
        [
          [6, 34, "o"],
          [12, 31, "a"],
          [20, 35, "o"],
          [27, 33, "a"],
          [36, 32, "o"],
          [44, 34, "a"],
          [52, 31, "o"],
          [58, 35, "a"],
        ]
          .map(([x, y, c]) => flower(x, y, c))
          .join(""),
    },
    verano: {
      top: ST + disc(14, 8, 6, "a") + cloud(38, 5) + cloud(50, 13),
      bot:
        hill(21, 2, 8, 2, "g1") +
        hill(27, 2, 6, 0, "g2") +
        hill(33, 1.5, 10, 3, "g3") +
        [
          [7, 29],
          [19, 31],
          [33, 28],
          [47, 30],
          [58, 32],
        ]
          .map(([x, y]) => sunf(x, y))
          .join(""),
    },
    otono: {
      top: ST + disc(48, 8, 4, "a") + cloud(8, 6) + cloud(26, 12),
      bot:
        hill(24, 2, 8, 1, "g1") +
        tree(12, 15, 5, "p") +
        tree(30, 18, 4, "o") +
        tree(52, 14, 5, "p") +
        hill(30, 1.5, 6, 3, "g2") +
        hill(35, 1, 8, 0, "g3") +
        [
          [6, 36],
          [20, 34],
          [40, 36],
          [58, 34],
        ]
          .map(([x, y]) => rect(x, y, 2, 1, "o"))
          .join(""),
    },
    invierno: {
      top: ST + disc(48, 7, 3, "a") + cloud(10, 6) + cloud(30, 12),
      bot:
        hill(24, 2, 8, 1, "g1") +
        dead(10, 16) +
        dead(46, 18) +
        pine(28, 19, 7) +
        hill(30, 1.5, 6, 2, "g2") +
        hill(35, 1, 8, 4, "g3"),
    },
    /* «Colina XP» (partes 7b y 7c): colina verde estilo «Bliss» dibujada a mano en vectores (no es la imagen de Microsoft). La geometría está en HL
    (la usan el dibujo, el pasto de xpbg.js y la lluvia de lluvia.js). Siete estaciones: ver xpScene(). */
    get xp() {
      return xpScene(xpv());
    },
  };
  /* Colores: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
}
