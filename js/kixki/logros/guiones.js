/*
  Guiones de las charlas entre Kixki y la ovejita (de día, de noche y cosquillas).
*/

import { KK, pick } from "./base.js";
import { ctx } from "./contexto.js";
import { DAY } from "./ovejita.js";

const lastScripts = [];

const NIGHT = [
  {
    id: "n1",
    l: [
      [
        "k",
        "Shhh… ¿estás dormida? Solo vine a decirte buenas noches. 🌙",
        "Shhh… are you asleep? I just came to say good night. 🌙",
      ],
      ["p", "Zzz… ¿Kixki…? Beee… zzz…", "Zzz… Kixki…? Baaa… zzz…"],
      ["k", "Duerme, amiga. Yo hago guardia.", "Sleep, friend. I'll keep watch."],
    ],
  },
  {
    id: "n2",
    l: [
      [
        "k",
        "Está dormida… mejor no la despierto. Dulces sueños. 💤",
        "She's asleep… better not wake her. Sweet dreams. 💤",
      ],
      [
        "p",
        "Zzz… cuatro mil… beee… cuatro mil uno…",
        "Zzz… four thousand… baaa… four thousand and one…",
      ],
      [
        "k",
        "Contando ovejas incluso dormida. ¡Qué profesional! 🐑",
        "Counting sheep even in her sleep. So professional! 🐑",
      ],
    ],
  },
  {
    id: "n3",
    l: [
      [
        "k",
        "Buenas noches, ovejita. Mañana te cuento qué buscó la gente. 🌙",
        "Good night, little sheep. Tomorrow I'll tell you what people searched for. 🌙",
      ],
      ["p", "Mmm… no te olvides de mí… zzz…", "Mmm… don't forget about me… zzz…"],
      ["k", "Jamás. Eres de las buenas. 💜", "Never. You're one of the good ones. 💜"],
    ],
  },
];

const TICKLE = {
  id: "tickle",
  l: [
    ["p", "¡Jajaja! ¡Beee! ¡Cosquillas, cosquillas!", "Hahaha! Baaa! Tickles, tickles!"],
    ["k", "¡Ya, ya, que me la vas a marear! 😆", "Okay, okay, you'll make her dizzy! 😆"],
    ["p", "Beee… ¡no pares! Es broma, sí pares.", "Baaa… don't stop! Just kidding, do stop."],
    [
      "k",
      "Mejor la dejamos pasear. ¡Gracias por los cariños!",
      "Let's let her stroll. Thanks for the cuddles!",
    ],
  ],
};

export function pickScript(kind) {
  if (kind === "tickle" && !KK.dark()) return TICKLE;
  const c = ctx(),
    pool = (KK.dark() ? NIGHT : DAY).filter((s) => !s.when || s.when(c)),
    ok = pool.filter((s) => !lastScripts.includes(s.id)),
    s = pick(ok.length ? ok : pool);
  lastScripts.push(s.id);
  if (lastScripts.length > 3) lastScripts.shift();
  return s;
}
