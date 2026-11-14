/*
  Generador de frases por piezas (apertura + cuerpo + remate), variables permitidas y mínimo de variantes por evento.
*/

import { A, L } from "./ayudas.js";
import { FAST } from "./micro-rapidas.js";
/* --- generador por piezas: apertura + cuerpo + remate (cada pieza es [español, English]) --- */
export const GEN = {
  praise: {
    open: L(`
¡Atención! || Attention!
Registro oficial: || Official record:
Con todo respeto: || With all due respect:
Para que conste: || For the record:
Nota de la oveja: || Note from the sheep:
Oído en la tienda: || Overheard in the store:
`),
    body: L(`
Tienes un gusto exquisito para las apps. || You have exquisite taste in apps.
Instalas con una elegancia que ya quisieran muchos rebaños. || You install with an elegance many flocks would envy.
Lees la letra pequeña. Eso es de valientes. || You read the small print. That takes courage.
Tu criterio merece lana de primera calidad. || Your judgment deserves first-class wool.
Eres de los pocos que miran la fuente antes de descargar. || You're one of the few who check the source before downloading.
Aquí se nota que sabes lo que haces. || It shows you know what you're doing.
`),
    close: L(`
Va a mi lista buena. 📝 || Going on my good list. 📝
Sigue así. 🐑 || Keep it up. 🐑
Tomo nota con orgullo. 🥹 || Noting it with pride. 🥹
Y yo, encantada. ✨ || And I'm delighted. ✨
Cuenta con mi aplauso. 👏 || You have my applause. 👏
`),
  },
  grudge: {
    open: L(`
Para el acta: || For the record:
Atención, testigos: || Attention, witnesses:
Informe de daños: || Damage report:
Comunicado oficial: || Official statement:
Dato curioso: || Fun fact:
`),
    body: L(`
Me lanzaste y yo lo recuerdo todo. || You threw me and I remember everything.
Mi abogado ya tiene el expediente abierto. || My lawyer already has the file open.
Mi lista de venganzas gana una fila. || My revenge list gains a row.
Mi lana ha tenido días mejores. || My wool has seen better days.
Aterricé con dignidad, que es lo único que no me quitarás. || I landed with dignity, the one thing you can't take from me.
Vuelo no solicitado, aterrizaje no consentido. || Unrequested flight, unconsented landing.
`),
    close: L(`
Que no se diga que no avisé. ⚖️ || Let it not be said I didn't warn you. ⚖️
El Plan avanza. 📝 || The Plan advances. 📝
Sin rencor. Con muchísimo registro. 🐑 || No grudge. Plenty of paperwork. 🐑
Seguimos. 😌 || We carry on. 😌
Tomen nota. 🧾 || Take note. 🧾
`),
  },
};

const genMem = {};

export function gen(kind) {
  const g = GEN[kind];
  if (!g) return null;
  const pickPiece = (arr, k) => {
    let i,
      t = 0;
    do {
      i = Math.floor(Math.random() * arr.length);
    } while (arr.length > 1 && i === genMem[kind + k] && ++t < 8);
    genMem[kind + k] = i;
    return arr[i];
  };
  const o = pickPiece(g.open, "o"),
    b = pickPiece(g.body, "b"),
    c = pickPiece(g.close, "c");
  return [[o[0], b[0], c[0]].join(" "), [o[1], b[1], c[1]].join(" ")];
}

/* variables que entiende cada clave (además de {hora} {app} {carpeta}, válidas en cualquier frase); lo usa tools/check-dialogs.mjs */
export const VARS = {
  "T.noRes": ["q"],
  "T.oneRes": ["a"],
  "T.manyRes": ["n", "q"],
  "T.fav5": ["n"],
  "T.gStartRec": ["rec"],
  "T.gOverRec": ["sc"],
  "T.gOverFirst": ["sc"],
  "T.gOverNear": ["sc"],
  "T.gOver": ["sc"],
  "GREET.away": ["d"],
  "GREET.newsN": ["n"],
  "TX.many": ["n"],
  "TX.dropMany": ["n"],
  "TX.thrownV": ["n"],
  "FAST.dl": ["a"],
  "FAST.src": ["a"],
  "FAST.hov": ["a"],
  "T.prog": ["k", "n"],
  "FAST.wins": ["n"],
  "FOLD": ["n", "a"],
  "ADV.favsN": ["n", "a1", "a2"],
  "ADV.newsN": ["n", "a1"],
  "ADV.packs": ["n", "a1", "a2"],
  "ADV.gen": ["n", "a1", "t1", "a2", "t2"],
  "ADV.tipw": ["a1", "tip"],
};

/* mínimo de variantes por clave: 5 por defecto; 15 en lo más frecuente */
export const MINV = {
  default: 5,
  "T.tap": 15,
  "T.praise": 15,
  "TX.grab": 15,
  "TX.soft": 15,
  "TX.hard": 15,
  "TX.dragged": 15,
  "TX.thrown": 15,
  "TX.flying": 15,
  "T.manyRes": 15,
  "T.favAdd": 15,
  "MIC.grab": 15,
  "MIC.soft": 15,
  "MIC.hard": 15,
  "MIC.close": 15,
  "MIC.placed": 15,
  "TX.placed": 15,
  "ADV.favs0": 5,
  "ADV.favsN": 5,
  "ADV.news0": 5,
  "ADV.newsN": 5,
  "ADV.packs": 5,
  "ADV.gen": 8,
  "ADV.tipw": 4,
  "ADV.hintPC": 3,
  "ADV.hintMob": 2,
  "T.bg": 3,
  "TX.holding": 5,
  "TX.draggedP": 3,
  "TX.draggedV": 3,
  "TX.closedOnP": 3,
  "TX.closedOnV": 3,
  "TX.closedOn": 5,
  "TX.gossip": 5,
  "TX.conspi": 5,
  "TX.code": 5,
  "TX.sass": 5,
  "T.lang": 0,
  "FAST.mode": 1,
  "TOUR_PC": 0,
  "TOUR_MOB": 0,
  "T.tips": 15,
  "T.facts": 5,
  "FOLD": 0,
  "T.appTips": 5,
  "T.tod": 5,
};

export function iniciar() {
  /* --- reacciones rápidas: completar a 5 --- */
  A(
    FAST,
    "hov",
    L(`
Si dudas con {a}, mira la etiqueta: suele decirlo todo. 🏷️ || If in doubt about {a}, check the tag: it usually says it all. 🏷️
`)
  );
  A(
    FAST,
    "src",
    L(`
El enlace de la fuente es mi sitio favorito de internet. Después de mi libreta. 📒 || The source link is my favorite place online. After my notebook. 📒
`)
  );
  A(
    FAST,
    "wins",
    L(`
{n} ventanas… la lana del escritorio se enreda. 🧶 || {n} windows… the desktop wool is getting tangled. 🧶
¿{n} abiertas? Yo cerraría alguna. Con cariño, o no. 😈 || {n} open? I'd close a few. Lovingly, or not. 😈
`)
  );
}
