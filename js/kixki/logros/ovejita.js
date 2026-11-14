/*
  La ovejita que camina sola por la barra: posición y plataforma para que Kixki baje a hablar con ella.
*/

import { $ } from "../../core/util.js";
import { isPC, KK, rainOn } from "./base.js";
import { petPi } from "./consejos.js";
import { count } from "./estado.js";
import { puente } from "./puente.js";
export let petSide;

export const petBox = () => {
  if (!isPC()) return null;
  const p = petPi();
  if (!p) return null;
  const r = p.getBoundingClientRect();
  return r.width > 8 && r.height > 8 ? r : null;
};

export const DAY = [
  {
    id: "hola",
    l: [
      [
        "k",
        "¡Hola, amiga! Bajé a verte un ratito. 🐑",
        "Hi, friend! I came down to see you for a bit. 🐑",
      ],
      [
        "p",
        "¡Beee! ¡Qué sorpresa! ¿Cómo va el piso de arriba?",
        "Baaa! What a surprise! How's it going upstairs?",
      ],
      [
        "k",
        "Lleno de apps y de gente curiosa. ¡Me encanta!",
        "Full of apps and curious people. I love it!",
      ],
      [
        "p",
        "Yo aquí abajo solo paseo de lado a lado. Es mi trabajo.",
        "Down here I just stroll back and forth. That's my job.",
      ],
      [
        "k",
        "¡Y lo haces genial! Eres muy pro, no lo olvides.",
        "And you do it great! You're so pro, never forget it.",
      ],
      ["p", "Beee… se me ponen rojas las orejas. 😊", "Baaa… my ears are turning red. 😊"],
    ],
  },
  {
    id: "visita",
    l: [
      [
        "p",
        "Oye, hoy hay alguien mirando la tienda con mucha atención…",
        "Hey, someone's been looking at the store really carefully today…",
      ],
      ["k", "Ya lo vi. Tiene ojo de pro. 👀", "I saw. Pro-level eyes. 👀"],
      ["p", "¿Crees que se llevará alguna app?", "Think they'll pick up an app?"],
      [
        "k",
        "Seguro. Y si no sabe cuál, para eso estoy yo.",
        "Sure. And if they can't decide, that's what I'm here for.",
      ],
      [
        "p",
        "Y yo para pasear de fondo y dar ambiente.",
        "And I'm here to stroll in the background and set the mood.",
      ],
      ["k", "¡Ambiente de primera! 🎶", "First-class mood! 🎶"],
    ],
  },
  {
    id: "paraguas",
    when: () => rainOn() && puente.UMB.on,
    l: [
      [
        "p",
        "¡Con el paraguas de Kixki ni una gotita! Beee.",
        "Not a single drop with Kixki's umbrella! Baaa.",
      ],
      ["k", "Cuidar de mi rebaño es lo mío. ☂️", "Looking after my flock is what I do. ☂️"],
      ["p", "Pues tu rebaño te lo agradece. Beee. 💜", "Well, your flock thanks you. Baaa. 💜"],
    ],
  },
  {
    id: "lluvia",
    when: () => rainOn() && !puente.UMB.on,
    l: [
      [
        "p",
        "¡Llueve! Mi lana huele a oveja mojada… beee.",
        "It's raining! My wool smells like wet sheep… baaa.",
      ],
      [
        "k",
        "A mí me encanta el sonido de la lluvia. ¡Es como música! 🌧️",
        "I love the sound of rain. It's like music! 🌧️",
      ],
      ["p", "Pues a mí me encoge la lana.", "Well, it shrinks my wool."],
      [
        "k",
        "Jajaja. Luego te secamos al solecito. ☀️",
        "Hahaha. We'll dry you in the sun later. ☀️",
      ],
    ],
  },
  {
    id: "toques",
    when: (c) => c.pet >= 5,
    l: [
      [
        "p",
        "Me han tocado {n} veces. ¡Alguien me quiere mucho!",
        "I've been tapped {n} times. Someone really likes me!",
      ],
      [
        "k",
        "Es que eres adorable. Yo también me sé el truco de las cosquillas.",
        "That's because you're adorable. I know the tickle trick too.",
      ],
      ["p", "¡Ni se te ocurra! Beee.", "Don't you dare! Baaa."],
      ["k", "Jajaja. Prometo portarme bien. 🐑", "Hahaha. I promise to behave. 🐑"],
    ],
  },
  {
    id: "carpetas",
    when: (c) => c.folders >= 1,
    l: [
      [
        "k",
        "Por cierto: nuestra visita ya abrió {f} de {t} carpetas.",
        "By the way: our visitor has opened {f} of {t} folders.",
      ],
      ["p", "¿Y las demás a qué esperan?", "And what are the rest waiting for?"],
      [
        "k",
        "Tiempo al tiempo. Cada quien explora a su ritmo.",
        "All in good time. Everyone explores at their own pace.",
      ],
      [
        "p",
        "Pues que se apure, que quiero conocer la de Música. 🎵",
        "Well, tell them to hurry up, I want to see the Music one. 🎵",
      ],
    ],
  },
  {
    id: "juego",
    l: [
      [
        "k",
        "¿Has probado el Salta Vallas? Es nuestro juego.",
        "Have you tried Fence Jump? It's our game.",
      ],
      ["p", "¡Yo salto mejor que tú!", "I jump better than you!"],
      ["k", "Eso habrá que verlo. 😏", "We'll have to see about that. 😏"],
      ["p", "Pero primero mi siesta.", "But first, my nap."],
      ["k", "Siempre hay una siesta primero. 💤", "There's always a nap first. 💤"],
    ],
  },
  {
    id: "contar",
    l: [
      [
        "k",
        "¿Sabías que contar ovejas ayuda a dormir?",
        "Did you know counting sheep helps you sleep?",
      ],
      [
        "p",
        "¡Y yo soy de las que se cuentan! Uno… beee… dos…",
        "And I'm one of the ones that get counted! One… baaa… two…",
      ],
      [
        "k",
        "¡No te duermas ahora, que apenas son las {h}!",
        "Don't fall asleep now, it's only {h}!",
      ],
      ["p", "Tres… ¡es que me sale solo!", "Three… it just comes out on its own!"],
    ],
  },
  {
    id: "ejercicio",
    l: [
      [
        "p",
        "Oye, ¿no te cansas de saltar de la barra a las carpetas?",
        "Hey, don't you get tired of hopping from the bar to the folders?",
      ],
      ["k", "¡Para nada! Es mi ejercicio diario. 💪", "Not at all! It's my daily workout. 💪"],
      ["p", "Entonces mis pasitos también cuentan.", "Then my little steps count too."],
      [
        "k",
        "Cuentan doble. Eres una atleta de la lana.",
        "They count double. You're a wool athlete.",
      ],
    ],
  },
  {
    id: "gorro",
    when: () => !!$("#pet .hat"),
    l: [
      ["k", "¡Qué gorro tan bonito llevas hoy!", "What a lovely hat you're wearing today!"],
      [
        "p",
        "¿Verdad? Es de la temporada. Me siento elegantísima.",
        "Right? It's seasonal. I feel so elegant.",
      ],
      [
        "k",
        "Elegantísima. Mejor que yo con mi bufanda.",
        "So elegant. Better than me with my scarf.",
      ],
      [
        "p",
        "Tu bufanda es lo mejor de ti, Kixki.",
        "Your scarf is the best thing about you, Kixki.",
      ],
      ["k", "¡Beee! ¡Gracias! 🧣", "Baaa! Thank you! 🧣"],
    ],
  },
  {
    id: "logros",
    when: (c) => count() >= 3,
    l: [
      [
        "k",
        "Nuestra visita ya lleva {a} de {N} logros.",
        "Our visitor already has {a} of {N} achievements.",
      ],
      ["p", "¿Y a mí cuándo me dan uno?", "And when do I get one?"],
      [
        "k",
        "Tú tienes el de «Ovejita más paseadora» desde siempre.",
        "You've had “Most walked little sheep” forever.",
      ],
      ["p", "¡Beee! Ese es mi favorito.", "Baaa! That's my favorite."],
    ],
  },
];

export function iniciar() {
  petSide = 1;
  /* 1 = Kixki a la izquierda de la ovejita · -1 = a la derecha */
  KK.plat("pet", () => {
    const r = petBox();
    if (!r) return null;
    petSide = r.left >= 110 || r.right + 110 > innerWidth ? 1 : -1;
    const x = petSide > 0 ? r.left - 26 : r.right + 26;
    return {
      a: x,
      b: x,
      y: () => {
        const q = petBox();
        return q ? q.bottom : r.bottom;
      },
      face: petSide,
    };
  });
  /* guion: [quién, es, en]  ·  k = Kixki, p = ovejita  ·  {n} toques · {f}/{t} carpetas · {a}/{N} logros */
}
