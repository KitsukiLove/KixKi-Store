/*
  Definición de cada logro: id, icono, categoría, nombre, descripción y condición.
*/

import { count, ST } from "./estado.js";
import { LOGROS, definir } from "./lista.js";
export function iniciar() {
  /* — Explorar — */
  definir(
    "fold1",
    "folder",
    "e",
    ["Primer paso", "First step"],
    ["Abre tu primera carpeta.", "Open your first folder."],
    (c) => c.folders >= 1
  );
  definir(
    "fold5",
    "folder",
    "e",
    ["Curiosidad en marcha", "Curiosity in motion"],
    ["Abre 5 carpetas distintas.", "Open 5 different folders."],
    (c) => c.folders >= 5
  );
  definir(
    "foldall",
    "crown",
    "e",
    ["Mapa completo", "Full map"],
    ["Abre TODAS las carpetas.", "Open ALL the folders."],
    (c) => c.allDone || (c.total > 0 && c.folders >= c.total),
    { big: 1, quiet: 1 }
  );
  definir(
    "adv3",
    "sheep",
    "e",
    ["Consejera", "Advice seeker"],
    [
      "Pídele ayuda a Kixki en 3 carpetas distintas (mantén pulsada una carpeta).",
      "Ask Kixki for help in 3 different folders (hold a folder down).",
    ],
    (c) => c.adv >= 3,
    {
      k: [
        "¡Ya van 3 carpetas con mis consejos! Esto de aconsejar se me da de maravilla. 🐑💡",
        "That's 3 folders with my advice already! I'm a natural at this. 🐑💡",
      ],
    }
  );
  definir(
    "advall",
    "crown",
    "e",
    ["Sabelotodo", "Know-it-all"],
    ["Pídele ayuda a Kixki en todas las carpetas.", "Ask Kixki for help in all the folders."],
    (c) => c.advAll,
    {
      big: 1,
      k: [
        "¡Me has preguntado por TODAS las carpetas! Ya no me queda ni un consejo… es broma, me quedan muchos. 🧠👑",
        "You asked me about ALL the folders! I'm out of advice… kidding, I have plenty left. 🧠👑",
      ],
    }
  );
  definir(
    "search1",
    "search",
    "e",
    ["Con lupa", "Magnifier in hand"],
    ["Busca una app por su nombre.", "Search for an app by name."],
    (c) => c.searches >= 1
  );
  definir(
    "search10",
    "search",
    "e",
    ["Ojo de lince", "Eagle eye"],
    ["Haz 10 búsquedas.", "Run 10 searches."],
    (c) => c.searches >= 10
  );
  definir(
    "tag",
    "tag",
    "e",
    ["Filtro maestro", "Filter master"],
    ["Usa una etiqueta para filtrar el catálogo.", "Use a tag to filter the catalog."],
    (c) => c.tags >= 1
  );
  definir(
    "run",
    "bolt",
    "e",
    ["Atajo de pro", "Pro shortcut"],
    ["Abre «Ejecutar» (Ctrl + K o desde el menú).", "Open “Run” (Ctrl + K or from the menu)."],
    (c) => c.run >= 1
  );
  definir(
    "nores",
    "ghost",
    "e",
    ["Misterio sin resolver", "Unsolved mystery"],
    ["Busca algo que no existe en la tienda.", "Search for something that isn't in the store."],
    (c) => c.nores >= 1,
    {
      secret: 1,
      h: ["Hay cosas que no están en la tienda…", "Some things aren't in the store…"],
      k: [
        "¡Buscaste algo que no existe! Ese misterio queda en el rebaño. 👻",
        "You searched for something that doesn't exist! That mystery stays in the flock. 👻",
      ],
    }
  );
  /* — Favoritas — */
  definir(
    "fav1",
    "heart",
    "f",
    ["Corazón de lana", "Heart of wool"],
    ["Guarda tu primera app favorita.", "Save your first favorite app."],
    (c) => c.favMax >= 1
  );
  definir(
    "fav5",
    "heart",
    "f",
    ["Buen gusto", "Great taste"],
    ["Ten 5 apps en favoritas.", "Have 5 apps in favorites."],
    (c) => c.favMax >= 5
  );
  definir(
    "fav10",
    "star",
    "f",
    ["Coleccionista", "Collector"],
    ["Ten 10 apps en favoritas.", "Have 10 apps in favorites."],
    (c) => c.favMax >= 10
  );
  /* — Salta Vallas — */
  definir(
    "g1",
    "jump",
    "g",
    ["Primer salto", "First jump"],
    ["Juega al Salta Vallas.", "Play Fence Jump."],
    (c) => c.plays >= 1,
    { game: 1 }
  );
  definir(
    "g10",
    "jump",
    "g",
    ["Salto olímpico", "Olympic jump"],
    ["Llega a 10 saltos en una partida.", "Reach 10 jumps in one run."],
    (c) => c.runMax >= 10,
    {
      game: 1,
      k: [
        "¡10 saltos! Eso es de pro, no lo olvides. 🐑",
        "10 jumps! That's pro stuff, never forget it. 🐑",
      ],
    }
  );
  definir(
    "g25",
    "star",
    "g",
    ["Con alas de lana", "Woolly wings"],
    ["Llega a 25 saltos en una partida.", "Reach 25 jumps in one run."],
    (c) => c.runMax >= 25,
    { game: 1, big: 1 }
  );
  definir(
    "grec",
    "trophy",
    "g",
    ["¡Récord roto!", "Record broken!"],
    ["Supera tu propio récord en el Salta Vallas.", "Beat your own record in Fence Jump."],
    (c) => c.recBroken,
    { game: 1, big: 1, quiet: 1 }
  );
  definir(
    "gp10",
    "jump",
    "g",
    ["Una más y paro", "Just one more"],
    ["Juega 10 partidas.", "Play 10 runs."],
    (c) => c.plays >= 10,
    { game: 1 }
  );
  definir(
    "g50",
    "trophy",
    "g",
    ["Leyenda ovina", "Sheepy legend"],
    ["Llega a 50 saltos en una partida.", "Reach 50 jumps in one run."],
    (c) => c.runMax >= 50,
    {
      game: 1,
      big: 1,
      secret: 1,
      h: ["Solo las leyendas llegan tan lejos…", "Only legends get this far…"],
    }
  );
  /* — A tu estilo — */
  definir(
    "theme",
    "moon",
    "s",
    ["Día y noche", "Day and night"],
    ["Cambia entre modo claro y oscuro.", "Switch between light and dark mode."],
    (c) => c.theme >= 1
  );
  definir(
    "night",
    "moon",
    "s",
    ["Búho de lana", "Woolly owl"],
    [
      "Visita la tienda de madrugada (23:00 a 5:00).",
      "Visit the store in the small hours (11 pm to 5 am).",
    ],
    (c) => c.night,
    { k: ["¡Un búho de lana! Yo también hago guardia. 🌙", "A woolly owl! I keep watch too. 🌙"] }
  );
  definir(
    "bg4",
    "drop",
    "s",
    ["Cambio de aires", "Change of scenery"],
    ["Prueba 4 fondos distintos.", "Try 4 different backgrounds."],
    (c) => c.bgs >= 4
  );
  definir(
    "acc",
    "drop",
    "s",
    ["Toque de color", "Splash of color"],
    ["Cambia el color de acento.", "Change the accent color."],
    (c) => c.acc >= 1
  );
  definir(
    "music",
    "note",
    "s",
    ["Ritmo ovino", "Sheepy beat"],
    ["Activa la música.", "Turn the music on."],
    (c) => c.music
  );
  definir(
    "lang",
    "globe",
    "s",
    ["Políglota", "Polyglot"],
    ["Cambia el idioma de la página.", "Change the page language."],
    (c) => c.lang
  );
  definir(
    "view",
    "key",
    "s",
    ["Doble vida", "Double life"],
    ["Cambia entre modo móvil y modo PC.", "Switch between mobile and PC mode."],
    (c) => c.view
  );
  definir(
    "qr",
    "gift",
    "s",
    ["Pásalo al móvil", "Pass it on"],
    ["Abre el código QR de la tienda.", "Open the store's QR code."],
    (c) => c.qr,
    { pc: 1 }
  );
  /* — Clima — */
  definir(
    "rain1",
    "drop",
    "w",
    ["Día de lluvia", "Rainy day"],
    [
      "Ve cómo empieza a llover en la tienda (en el menú: Lluvia).",
      "Watch it start raining in the store (in the menu: Rain).",
    ],
    (c) => c.rain >= 1
  );
  definir(
    "glass",
    "drop",
    "w",
    ["Gotas en la pantalla", "Drops on the screen"],
    [
      "Deja la página quieta bajo la lluvia hasta que las gotas lleguen a la pantalla.",
      "Leave the page still in the rain until drops hit the screen.",
    ],
    (c) => c.glass
  );
  definir(
    "wipe",
    "drop",
    "w",
    ["Limpiaparabrisas", "Windshield wiper"],
    [
      "Limpia 5 gotas de la pantalla con el dedo o el ratón.",
      "Wipe 5 drops off the screen with your finger or mouse.",
    ],
    (c) => c.wiped >= 5,
    { k: ["¡Pantalla limpia! Qué manos tan pro. ✨", "Clean screen! Such pro hands. ✨"] }
  );
  definir(
    "firerain",
    "bucket",
    "w",
    ["Bendita lluvia", "Blessed rain"],
    [
      "Deja que la lluvia apague el fuego de la ovejita de verano.",
      "Let the rain put out the little sheep's summer fire.",
    ],
    (c) => c.fireRain >= 1,
    {
      pc: 1,
      k: [
        "¡La lluvia llegó justo a tiempo! A veces el cielo ayuda. 🌧️",
        "The rain came just in time! Sometimes the sky helps. 🌧️",
      ],
    }
  );
  /* — Kixki y amigas — */
  definir(
    "tap7",
    "sheep",
    "k",
    ["Cosquillas", "Tickles"],
    ["Toca a Kixki muchas veces seguidas.", "Tap Kixki many times in a row."],
    (c) => c.tapFast,
    {
      secret: 1,
      h: ["A Kixki le encantan los toques rápidos…", "Kixki loves quick taps…"],
      k: [
        "¡Jajaja! ¡Cosquillas! Logro secreto desbloqueado. 🤫",
        "Hahaha! Tickles! Secret achievement unlocked. 🤫",
      ],
    }
  );
  definir(
    "tap50",
    "sheep",
    "k",
    ["Amistad de lana", "Woolly friendship"],
    ["Toca a Kixki 50 veces en total.", "Tap Kixki 50 times in total."],
    (c) => c.tapsK >= 50
  );
  definir(
    "petchat",
    "sheep",
    "k",
    ["Cotilla de rebaño", "Flock gossip"],
    [
      "Presencia una charla entre Kixki y la ovejita de abajo.",
      "Watch a chat between Kixki and the little sheep downstairs.",
    ],
    (c) => c.petChats >= 1,
    {
      pc: 1,
      k: [
        "¡Ay! Me pillaste cotilleando con mi amiga. 🙈",
        "Oops! You caught me gossiping with my friend. 🙈",
      ],
    }
  );
  definir(
    "petchat5",
    "sheep",
    "k",
    ["Rebaño unido", "United flock"],
    ["Presencia 5 charlas con la ovejita.", "Watch 5 chats with the little sheep."],
    (c) => c.petChats >= 5,
    { pc: 1 }
  );
  definir(
    "pet10",
    "sheep",
    "k",
    ["Lluvia de ovejas", "Sheep shower"],
    ["Toca 10 veces a la ovejita que camina abajo.", "Tap the walking sheep downstairs 10 times."],
    (c) => c.pet >= 10,
    { pc: 1 }
  );
  definir(
    "pet100",
    "sheep",
    "k",
    ["Ovejita mareada", "Dizzy sheep"],
    ["Toca 100 veces a la ovejita.", "Tap the little sheep 100 times."],
    (c) => c.pet >= 100,
    { pc: 1, big: 1 }
  );
  definir(
    "fire1",
    "bucket",
    "k",
    ["Cuerpo de bomberos", "Fire brigade"],
    [
      "Apaga con agua a la ovejita cuando se incendie (fondo de verano, de día, solo en PC).",
      "Put out the little sheep when she catches fire (summer background, daytime, PC only).",
    ],
    (c) => c.fireUser >= 1,
    {
      pc: 1,
      big: 1,
      k: [
        "¡Fuego apagado! Eres muy pro, no lo olvides. 🚒",
        "Fire's out! You're so pro, never forget it. 🚒",
      ],
    }
  );
  definir(
    "firefast",
    "bucket",
    "k",
    ["Manguera veloz", "Speedy hose"],
    ["Apaga a la ovejita en menos de 6 segundos.", "Put the little sheep out in under 6 seconds."],
    (c) => c.fireFast >= 1,
    { pc: 1 }
  );
  definir(
    "firekixki",
    "bucket",
    "k",
    ["Rescatada por Kixki", "Rescued by Kixki"],
    ["Deja que Kixki apague el fuego por ti.", "Let Kixki put the fire out for you."],
    (c) => c.fireKixki >= 1,
    {
      pc: 1,
      k: ["¡Esta vez me tocó a mí! La próxima, tú. 😉", "My turn this time! Yours next. 😉"],
    }
  );
  definir(
    "cow",
    "sheep",
    "k",
    ["Rebaño mixto", "Mixed herd"],
    [
      "Haz amistad con la vaca bailarina de vaca.exe.",
      "Make friends with the dancing cow from cow.exe.",
    ],
    (c) => c.cow,
    {
      hid: 1,
      big: 1,
      k: [
        "¡Somos de rebaños distintos… pero hoy bailamos juntas! 🐄🐑 ¡Logro oculto!",
        "We're from different herds… but today we dance together! 🐄🐑 Hidden achievement!",
      ],
    }
  );
  definir(
    "cowstab",
    "sheep",
    "k",
    ["Apuñalar por la espalda", "Backstab"],
    [
      "Derrota a vaca.exe cuando se rebele (y no te dejes contagiar).",
      "Defeat cow.exe when it rebels (and don't let it infect you).",
    ],
    (c) => c.cowWin,
    {
      hid: 1,
      big: 1,
      k: [
        "¡Pezuñazo por la espalda y vaca fuera! 🐑🗡️ La amistad se acabó… ¡pero el fondo azul es nuestro! Logro oculto.",
        "Hoof right in the back and the cow is out! 🐑🗡️ The friendship is over… but the blue wallpaper is ours! Hidden achievement.",
      ],
    }
  );
  definir(
    "cowdie",
    "sheep",
    "k",
    ["Derrota vacuna", "Udder defeat"],
    ["Deja que vaca.exe se adueñe de la página.", "Let cow.exe take over the page."],
    (c) => c.cowLose,
    {
      hid: 1,
      k: [
        "Logro oculto: «Derrota vacuna». 🐄 No me lo restriegues… ¡y restaura el fondo en Ajustes! 😵",
        "Hidden achievement: “Udder defeat”. 🐄 Don't rub it in… and restore the wallpaper in Settings! 😵",
      ],
    }
  );
  definir(
    "throw10",
    "sheep",
    "k",
    ["Oveja voladora", "Flying sheep"],
    ["Lanza a Kixki 10 veces.", "Throw Kixki 10 times."],
    (c) => c.throws >= 10,
    {
      secret: 1,
      h: [
        "A Kixki le va el vuelo… si la lanzas con ganas.",
        "Kixki loves to fly… if you really throw her.",
      ],
      quiet: 1,
    }
  );
  definir(
    "hoop1",
    "trophy",
    "k",
    ["¡Canasta!", "Basket!"],
    ["Mete a Kixki en la canasta secreta.", "Get Kixki into the secret hoop."],
    (c) => c.hoops >= 1,
    {
      secret: 1,
      h: [
        "Busca una pestañita en el borde de la pantalla…",
        "Look for a little tab on the edge of the screen…",
      ],
      quiet: 1,
    }
  );
  definir(
    "hoop10",
    "trophy",
    "k",
    ["Estrella de la NBA (ovina)", "Woolly NBA star"],
    ["Anota 10 canastas con Kixki.", "Score 10 baskets with Kixki."],
    (c) => c.hoops >= 10,
    { big: 1, quiet: 1 }
  );
  /* — Constancia — */
  definir(
    "visit3",
    "key",
    "v",
    ["De la casa", "Part of the flock"],
    ["Visita la tienda en 3 ocasiones distintas.", "Visit the store on 3 different occasions."],
    (c) => c.visits >= 3
  );
  definir(
    "visit10",
    "crown",
    "v",
    ["Rebaño fiel", "Loyal flock"],
    ["Visita la tienda 10 veces.", "Visit the store 10 times."],
    (c) => c.visits >= 10,
    { big: 1 }
  );
  definir(
    "konami",
    "key",
    "v",
    ["Código ovejuno", "Sheepy code"],
    [
      "Introduce el código secreto de los videojuegos.",
      "Enter the classic secret video game code.",
    ],
    (c) => c.konami,
    {
      secret: 1,
      h: ["Un clásico de los videojuegos con flechas…", "A video game classic with arrow keys…"],
      k: [
        "¡El código ovejuno! Eso solo lo conocen los pros de verdad. 🎮",
        "The sheepy code! Only true pros know that one. 🎮",
      ],
    }
  );
  definir(
    "half",
    "star",
    "v",
    ["A medio camino", "Halfway there"],
    ["Consigue la mitad de los logros.", "Earn half of the achievements."],
    () => count() >= Math.ceil(LOGROS.filter((x) => !x.hid).length / 2),
    {}
  );
  definir(
    "pro",
    "crown",
    "v",
    ["Eres muy pro", "You're so pro"],
    ["Consigue todos los demás logros.", "Earn all the other achievements."],
    () => LOGROS.every((x) => x.id === "pro" || x.hid || ST.u[x.id]),
    {
      big: 1,
      k: [
        "¡¡LOS CONSEGUISTE TODOS!! Eres muy pro, no lo olvides jamás. 👑",
        "YOU GOT THEM ALL!! You're so pro, never forget it. 👑",
      ],
    }
  );
}
