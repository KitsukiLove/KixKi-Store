/*
  Microreacciones y reacciones rápidas de Kixki.
*/

/* (parte 2) microreacciones: emoji o 2-3 palabras, ~1 s. Para lo frecuente (agarrar, caer, cerrar ventana, volver).
   Los de solo emoji (sin letras) son los únicos que salen en modo «calladita». */
export const MIC = {
  grab: [
    ["¡Eh!", "Hey!"],
    ["¡Uy!", "Whoa!"],
    ["😳", "😳"],
    ["¡Beee!", "Baaa!"],
    ["¡Mi lana!", "My wool!"],
    ["¡Cuidado!", "Careful!"],
    ["🐑❓", "🐑❓"],
    ["Mmm…", "Hmm…"],
    ["😤", "😤"],
    ["¡Ojo!", "Watch it!"],
  ],
  soft: [
    ["¡Plof!", "Plop!"],
    ["🐑", "🐑"],
    ["Aterricé.", "Landed."],
    ["Diez puntos.", "Ten points."],
    ["😌", "😌"],
    ["¡Ta-chán!", "Ta-da!"],
    ["Ni un rizo.", "Not a curl."],
    ["✨", "✨"],
  ],
  hard: [
    ["¡Auch!", "Ouch!"],
    ["😵", "😵"],
    ["Mi lana…", "My wool…"],
    ["¡Plaf!", "Splat!"],
    ["Ay.", "Ow."],
    ["Anotado. 📝", "Noted. 📝"],
    ["🌀", "🌀"],
  ],
  close: [
    ["¡Chao!", "Bye!"],
    ["🚪", "🚪"],
    ["👋", "👋"],
    ["Adiós.", "Bye."],
    ["Cerrada.", "Closed."],
    ["¡Clic!", "Click!"],
    ["🐑👋", "🐑👋"],
  ],
  back: [
    ["¡Hola otra vez!", "Hi again!"],
    ["👋", "👋"],
    ["¿Ya volviste?", "Back already?"],
    ["¡Ahí estás!", "There you are!"],
    ["🐑", "🐑"],
  ],
};

/* (parte 2) reacciones rápidas a lo que haces */
export const FAST = {
  dl: [
    [
      "¿{a}? Buena elección. Luego me cuentas qué tal. 🐑",
      "{a}? Good pick. Tell me how it goes later. 🐑",
    ],
    [
      "Descargando {a}… yo vigilo que no traiga lobos. 🐺",
      "Downloading {a}… I'll watch for wolves. 🐺",
    ],
    [
      "Otra app para la colección. Mi lista de aprobadas crece. 📝",
      "Another app for the collection. My approved list grows. 📝",
    ],
    [
      "Recuerda: de la fuente oficial, siempre. Soy una oveja precavida. 🛡️",
      "Remember: from the official source, always. I'm a cautious sheep. 🛡️",
    ],
    [
      "¡A descargar se ha dicho! Revisa los permisos, que yo no los leo. 📥",
      "Download time! Check the permissions, I don't read them. 📥",
    ],
  ],
  src: [
    [
      "¿Mirando el código fuente? Una oveja desconfiada, me gusta. 🔍",
      "Checking the source code? A distrustful soul, I like it. 🔍",
    ],
    [
      "Visita a {a} en su casa original. Si te gusta, dale una estrella. ⭐",
      "Visiting {a} at its original home. If you like it, leave a star. ⭐",
    ],
    [
      "El código abierto es lo mejor desde la lana. 💛",
      "Open source is the best thing since wool. 💛",
    ],
    [
      "Los desarrolladores también merecen cariño. Y estrellitas. ⭐",
      "Developers deserve love too. And stars. ⭐",
    ],
  ],
  hov: [
    [
      "{a} te está mirando… o tú a {a}. Tres segundos es mucho. 👀",
      "{a} is staring at you… or you at {a}. Three seconds is a lot. 👀",
    ],
    [
      "¿Dudando con {a}? Léelo bien: la letra pequeña también cuenta. 🔎",
      "Wavering over {a}? Read it carefully: the small print counts too. 🔎",
    ],
    [
      "Esa cara de «¿lo instalo?»… yo en tu lugar, sí. 🐑",
      "That “should I install it?” face… in your place, I would. 🐑",
    ],
    [
      "Pasar el ratón no instala nada, ¿eh? Hay que hacer clic. 😏",
      "Hovering doesn't install anything, you know. You have to click. 😏",
    ],
  ],
  wins: [
    [
      "¡{n} ventanas abiertas! Esto parece mi lista de venganzas: nadie la ordena. 🪟",
      "{n} windows open! This looks like my revenge list: nobody tidies it. 🪟",
    ],
    [
      "{n} ventanas… ¿quieres que cierre alguna? Es una pregunta retórica. 🧹",
      "{n} windows… want me to close some? That's a rhetorical question. 🧹",
    ],
    [
      "Tu escritorio parece un rebaño: ¡{n} ventanas! Hay que ordenar. 🐑",
      "Your desktop looks like a flock: {n} windows! Time to tidy up. 🐑",
    ],
  ],
  mode: {
    chat: [
      "¡Hoy hablo por los codos! 🗣️ Avisada estás.",
      "I'll talk your ear off today! 🗣️ You've been warned.",
    ],
    normal: ["Modo normal: hablo lo justo. 🐑", "Normal mode: I talk just enough. 🐑"],
    quiet: [
      "Vale… me callo. 🤐 Solo emojis, y si me tocas.",
      "Fine… I'll be quiet. 🤐 Just emojis, and only if you tap me.",
    ],
  },
};
