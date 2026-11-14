/*
  Respuestas de solo emoji (EMO) para el modo «calladita» y el sueño.
*/

import { A, L } from "./ayudas.js";
import { MIC } from "./micro-rapidas.js";
import { T } from "./textos.js";
/* =========================================================
   (parte 4b) emojis por situación · buenas noches · básquet con Kixki enfadada
   ========================================================= */
/* E("😳 🫣 😱") → [["😳","😳"],["🫣","🫣"],…]: solo emoji (sin letras). Los usa el modo «calladita» y el sueño. */
export const E = (s) =>
  s
    .trim()
    .split(/\s+/)
    .map((e) => [e, e]);

/* EMO.<situación>: respuestas de SOLO EMOJI. En modo «calladita» sustituyen a cualquier frase que no sea
   «me tocaron» o «me pidieron ayuda» (ver wordsGate() en kixki.js). Mínimo 6 por situación (lo comprueba check-dialogs). */
export const EMO = {
  grab: E("😳 🫣 😱 😤 🙀 🐑❓ 😵‍💫 🥴"),
  held: E("🥴 😖 🙄 😑 😒 🫠 🧘"),
  shake: E("🤢 😵 🌀 😫 🥴 🫨"),
  long: E("😮‍💨 🥱 😩 🙄 😑 ⏳ 😵‍💫"),
  fly: E("😱 🚀 🪂 😵‍💫 🙀 💨 🫨 😤"),
  placed: E("😌 ✨ 🙂 👌 🐑 😮‍💨 🫶 😊"),
  soft: E("😅 🙃 😬 🐑 🪂 😏 🤨"),
  hard: E("😵 💥 🤕 🌀 😖 🥴 😣"),
  mad: E("😠 💢 😤 😡 🔥 😾 👿"),
  close: E("🚪 👋 🐑👋 🫡 😏 🙈 ✋"),
  back: E("👋 🐑 😊 👀 🫶 😄 ✨"),
  search: E("🔍 👀 🧐 🔎 🤓 🐑🔎 ✨"),
  noRes: E("🤷 😕 🫥 🕳️ 😶 🔍❌ 🙈"),
  fav: E("⭐ 💛 🌟 ✨ 😍 💫 🥰"),
  favDel: E("💔 😢 🥲 😶 🫤 🌑 😿"),
  theme: E("🌗 ✨ 😎 🕶️ 🌈 🔆 🌙"),
  bg: E("🖼️ 🌄 🎨 🌈 🌸 🍂 ❄️ 🎃"),
  music: E("🎵 🎶 🎧 🎼 🕺 🐑🎶 🔇"),
  lang: E("🌐 🗣️ 💬 🔤 🈂️ 🐑💬"),
  gstart: E("🏃 🐑💨 🏁 💪 🔥 🚀 🎮"),
  grec: E("🏆 🎉 🥇 👑 🌟 🥳 🎊"),
  gover: E("💥 😵 😅 🙈 🤕 😬 🫠"),
  folder: E("📂 📁 👀 🐑 🧐 📌 ✨"),
  dl: E("📥 ⬇️ 👍 🛡️ 🐑👍 📦 ✅"),
  src: E("🔍 ⭐ 💛 🧑‍💻 📜 👀 🧐"),
  wins: E("🪟 😵‍💫 🧹 🤯 🥴 🐑🪟"),
  big: E("🎉 🏆 🌟 🥳 ✨ 👏 🎊 🐑✨"),
  ui: E("🐑 ✨ 👀 💬 🙂 👍 🌸 😊"),
  greet: E("👋 🐑 😊 ☀️ 🌙 ✨ 🫶"),
  mode: E("🤐 🤫 🔇 😶 🙊 🐑🤫"),
  sleep: E("😴 🌙 💤 🛌 😪 🐑💤 🕯️"),
  yawn: E("🥱 😮 😪 😌 🫠 🥱✨"),
  poke: E("😠 😴 😠💢 😴💤 😠💤 😠😴"),
  wake: E("🌞 😊 🐑 ✨ 🥱 👋"),
  stumble: E("😲 🙀 😬 😯 🫨 😳"),
  fall: E("💥 😵 🌟 😵‍💫 🤕 💫"),
  pr: E("😈 😇 🤭 😏 🙈 🫢"),
  hk: E("🤓 🕶️ 🧑‍💻 🔍 👓 🛠️"),
  fire: E("🔥 🚒 💦 😱 🧯 🙀"),
  /* la cancha de básquet (una lista por fase) */
  bkStart: E("😠 😤 📝 🏀 😒 👀 🔥"),
  bkThrow: E("😱 🚀 🌀 😵‍💫 💢 🪂 🙀"),
  bkMiss: E("😒 🙄 🤕 💢 📖 😤 🫠"),
  bkScore: E("🏀 😤 💅 🔥 🎯 😠🏀 ✨"),
  bkStreak: E("🔥 🔥🔥 ⚠️ 😈 👑 🚀 💪"),
  bkLast: E("⏳ 😤 😈 🧘 🌾 ⏰"),
  bkWin: E("🏆 🥇 👑 😤🏆 🥳 🎉"),
  bkLose: E("😒 🙄 🖊️ 📚 💇 😤"),
  bkEnd: E("😈 📜 🌾 👋 😤 🕊️ 💸"),
};

export function iniciar() {
  /* a los emoji de las microreacciones de siempre se les suman más (para que en «calladita» haya variedad) */
  A(MIC, "grab", E("🫣 🙀 🥴"));
  A(MIC, "soft", E("😅 🙃"));
  A(MIC, "hard", E("💥 🤕"));
  A(MIC, "close", E("🫡 🙈"));
  A(MIC, "back", E("😊 ✨"));
  /* buenas noches: UNA sola frase al irse a dormir (cuando quitas a Kixki) */
  A(
    T,
    "sleepNow",
    L(`
Buenas noches… me echo una siesta. Zzz. 🌙 || Good night… I'm taking a nap. Zzz. 🌙
Me voy a dormir. Que nadie toque a la oveja. 😴 || I'm off to sleep. Nobody touch the sheep. 😴
Zzz… voy a contar ovejas. Todas soy yo. 🐑💤 || Zzz… I'll count sheep. They're all me. 🐑💤
Hasta mañana. Sueña con apps bonitas. 🌙 || See you tomorrow. Dream of pretty apps. 🌙
Me acuesto un ratito. Despiértame si hay heno. 🌾💤 || I'm lying down for a bit. Wake me if there's hay. 🌾💤
Buenas noches, tienda. Apaga la luz al salir. 🕯️ || Good night, store. Turn off the light on your way out. 🕯️
`)
  );
}
