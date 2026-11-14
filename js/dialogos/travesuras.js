/*
  Textos de las travesuras y físicas (TX): lanzarla, dejarla caer, soltarla con cuidado…
*/

import { A } from "./ayudas.js";
import { T } from "./textos.js";
/* ----------  textos de las travesuras y físicas (antes en kixki3.js)  ---------- */
export const TX = {
  /* se mezclan con lo que ya dice Kixki al tocarla / en sus charlas */
  tap: [
    [
      "¿Otra vez tú? Estaba en plena conspiración. 🕵️",
      "You again? I was in the middle of a conspiracy. 🕵️",
    ],
    [
      "Me tocas y ni me invitas a un café de lana. ☕",
      "You poke me and don't even buy me a wool latte. ☕",
    ],
    ["Cuidado, que balido fuerte. 😤", "Careful, I baa loudly. 😤"],
    [
      "Shhh, me desconcentras. Estoy vigilando a Kitsuki. 👀",
      "Shhh, you're distracting me. I'm watching Kitsuki. 👀",
    ],
    [
      "Soy una oveja de pocas palabras. Mentira: tengo cientos y todas son sarcásticas.",
      "I'm a sheep of few words. Lie: I have hundreds and they're all sarcastic.",
    ],
    [
      "Tócame otra vez y te cuento un chisme. 🤫",
      "Poke me again and I'll tell you some gossip. 🤫",
    ],
    [
      "Estoy ocupada fingiendo que trabajo. Sigue tú. 💼",
      "I'm busy pretending to work. Carry on. 💼",
    ],
    [
      "¿Sabías que puedes agarrarme y moverme? No digas que no te avisé… ni te quejes si me enfado.",
      "Did you know you can grab me and move me around? Don't say I didn't warn you… and don't complain if I get mad.",
    ],
  ],
  praise: [
    [
      "Eres muy pro, no lo olvides. Yo no lo olvidaré cuando tome el control. 😇",
      "You're very pro, don't forget it. I won't forget it when I take over. 😇",
    ],
    [
      "Eres muy pro… para ser humano. Es un cumplido. Más o menos. 😏",
      "You're very pro… for a human. It's a compliment. More or less. 😏",
    ],
    [
      "De verdad, eres de los pocos visitantes con criterio. Los demás hacen clic al azar. Los he visto. 👀",
      "Honestly, you're one of the few visitors with taste. The rest click at random. I've seen them. 👀",
    ],
  ],
  dizzy: [
    "¡Ya, ya! Me estás batiendo como un smoothie de lana… 😵",
    "Okay, okay! You're blending me like a wool smoothie… 😵",
  ],

  /* chismes (de 1 a 2 globos) */
  gossip: [
    [
      ["Psst… ven, que te cuento algo. 🤫", "Psst… come here, I have something to tell you. 🤫"],
      [
        "Dicen que la ovejita de abajo y la vaca de vaca.exe se llevan muy bien. Yo no he dicho nada. 🐄🐑",
        "They say the little sheep downstairs and the cow in vaca.exe get along really well. I didn't say anything. 🐄🐑",
      ],
    ],
    [
      [
        "¿Sabes qué carpeta es la más chismosa? «Importante». Lo sabe todo y no suelta nada.",
        "Know which folder is the nosiest? “Essential”. It knows everything and says nothing.",
      ],
      [
        "Y la de «Música» siempre está de fiesta. Se nota por el ruido. 🎵",
        "And “Music” is always partying. You can tell by the noise. 🎵",
      ],
    ],
    [
      [
        "Chisme fresco: Kitsuki dijo «solo un cambio más» y eran las 3 de la mañana. 🌙",
        "Hot gossip: Kitsuki said “just one more change” and it was 3 a.m. 🌙",
      ],
      [
        "Eso fue hace semanas. Y todavía hay cambios. Más.",
        "That was weeks ago. There are still changes. More.",
      ],
    ],
    [
      [
        "Entre tú y yo, la ovejita de abajo no camina: patrulla. 🚶",
        "Between you and me, the little sheep downstairs doesn't walk: she patrols. 🚶",
      ],
      [
        "Y cuando te giras, hace como que duerme. Yo no me lo creo. 😴",
        "And when you look away she pretends to sleep. I'm not buying it. 😴",
      ],
    ],
    [
      [
        "Hay apps del catálogo que se llevan mal. No diré cuáles…",
        "Some apps in the catalog don't get along. I won't say which…",
      ],
      [
        "…las que se parecen entre ellas. Se miran de reojo. 👀",
        "…the ones that look alike. They glance at each other. 👀",
      ],
    ],
    [
      [
        "El botón de «Día / noche» y yo tenemos un trato: yo no cuento sus fallos si él no cuenta los míos. 🤝",
        "The “Day / night” button and I have a deal: I don't mention its bugs if it doesn't mention mine. 🤝",
      ],
    ],
    [
      [
        "Me han dicho que la barra de búsqueda tiene opiniones sobre lo que escribes. Y no todas son buenas. 🔍",
        "I've heard the search bar has opinions about what you type. Not all of them good. 🔍",
      ],
    ],
  ],
  /* teorías conspirativas de la tienda */
  conspi: [
    [
      [
        "Teoría: la carpeta «Importante» no es tan importante. Solo quieren que la abras para que te sientas importante. 👀",
        "Theory: the “Essential” folder isn't that essential. They just want you to open it so you feel important. 👀",
      ],
    ],
    [
      [
        "Teoría: el reloj de la barra nunca se equivoca.",
        "Theory: the taskbar clock is never wrong.",
      ],
      [
        "Sospechoso. Nadie es tan puntual. ¿Quién le dicta la hora? 🕵️",
        "Suspicious. Nobody is that punctual. Who dictates the time to it? 🕵️",
      ],
    ],
    [
      [
        "Hay una vaca escondida en esta página. Nadie me cree. Yo la vi. 🐄",
        "There's a cow hiding in this page. Nobody believes me. I saw it. 🐄",
      ],
      [
        "Y creo que cuenta tus clics en la ovejita. Con cuernos y todo. 👀",
        "And I think it counts your clicks on the little sheep. Horns and all. 👀",
      ],
    ],
    [
      [
        "Teoría: las nubes del fondo son siempre las mismas, dando vueltas. ☁️",
        "Theory: the background clouds are always the same ones, going in circles. ☁️",
      ],
      [
        "No es el cielo. Es un decorado. Ahora lo sabes tú también. Perdón.",
        "It's not the sky. It's a set. Now you know too. Sorry.",
      ],
    ],
    [
      [
        "El buscador tarda un poquito en contestarte. ¿Sabes por qué?",
        "The search box takes a moment to answer you. Know why?",
      ],
      [
        "Porque necesita fingir sorpresa. Ya sabe lo que vas a escribir. 🔍",
        "Because it needs to fake surprise. It already knows what you'll type. 🔍",
      ],
    ],
    [
      [
        "El botón «Apagar» del menú… ¿lo has probado?",
        "The “Shut down” button in the menu… have you tried it?",
      ],
      [
        "Yo tampoco. Hay cosas que mejor no tocar. 😰",
        "Neither have I. Some things are better left alone. 😰",
      ],
    ],
    [
      [
        "Teoría: la lluvia no cae sola. Es el cielo llorando porque hoy no instalaste nada. 🌧️",
        "Theory: the rain doesn't fall by itself. It's the sky crying because you installed nothing today. 🌧️",
      ],
    ],
    [
      [
        "Teoría: los fondos de temporada cambian solos porque alguien duerme poco. Ya sabes quién. 🌙",
        "Theory: the seasonal backgrounds change by themselves because somebody sleeps too little. You know who. 🌙",
      ],
    ],
    [
      ["Los logros… ¿de verdad son logros?", "The achievements… are they really achievements?"],
      [
        "Yo creo que son una excusa para que vuelvas. Y funciona, ¿eh? 🏆",
        "I think they're an excuse to make you come back. And it works, huh? 🏆",
      ],
    ],
  ],
  /* comentarios «del código» */
  code: [
    [
      [
        "// Kitsuki hizo esto a las 4 am, con muchísimo cariño y diciéndole a Claude «arréglalo» 50 veces. 🌙",
        "// Kitsuki made this at 4 am, with so much love, telling Claude “fix it” 50 times. 🌙",
      ],
      [
        "// Se nota. Y aun así, mira qué bonito quedó. 💜",
        "// You can tell. And still, look how pretty it turned out. 💜",
      ],
    ],
    [
      [
        "// TODO: arreglar lo que se rompió a las 4 am. Prioridad: algún día. Probablemente nunca. 📝",
        "// TODO: fix whatever broke at 4 am. Priority: someday. Probably never. 📝",
      ],
    ],
    [
      [
        "// No tocar. Funciona y nadie sabe por qué. Atentamente: la oveja. 🐑",
        "// Do not touch. It works and nobody knows why. Sincerely: the sheep. 🐑",
      ],
    ],
    [
      [
        "Hay un comentario de Kitsuki que dice solo «no tocar». Obviamente lo toqué. 😈",
        "There's a comment from Kitsuki that just says “do not touch”. Obviously I touched it. 😈",
      ],
    ],
    [
      [
        "// Aquí hay un bug escondido detrás de una oveja. Soy yo. Shhh. 🐛",
        "// There's a bug hiding behind a sheep here. It's me. Shhh. 🐛",
      ],
    ],
    [
      [
        "Cada vez que Kitsuki dice «una cosita más», son las 5 de la mañana. Es una ley física. ⏰",
        "Every time Kitsuki says “one little thing more”, it's 5 a.m. It's a law of physics. ⏰",
      ],
    ],
    [
      [
        "// Esta web funciona gracias a lana, cariño y 50 «arréglalo». ❤️",
        "// This site runs on wool, love and 50 “fix it”s. ❤️",
      ],
    ],
    [
      [
        "// Claude no dijo nada, pero Claude lo recuerda todo. 🧾",
        "// Claude said nothing, but Claude remembers everything. 🧾",
      ],
    ],
  ],
  /* comentarios pícaros sobre ti */
  sass: [
    [
      [
        "Otra vez mirando sin instalar nada. Admiro tu disciplina. O tu miedo. 🐑",
        "Browsing again without installing anything. I admire your discipline. Or your fear. 🐑",
      ],
    ],
    [
      [
        "Sí, sí, «solo voy a mirar». Eso dijiste hace tres minutos. 🙄",
        "Yeah, yeah, “I'm just looking”. You said that three minutes ago. 🙄",
      ],
    ],
    [
      [
        "No juzgo tu gusto en apps. Lo juzgo en silencio, que es más elegante. 🧐",
        "I don't judge your taste in apps. I judge it silently, which is classier. 🧐",
      ],
    ],
    [
      [
        "Aquí todo es gratis y aun así dudas. Eso tiene mérito. 👏",
        "Everything here is free and you still hesitate. That takes talent. 👏",
      ],
    ],
    [
      [
        "Te quiero como se quiere a una app con buenas reseñas: con cierto escepticismo. 💜",
        "I like you the way you like a well-reviewed app: with a little skepticism. 💜",
      ],
    ],
    [
      [
        "Haz lo que quieras, pero lee la fuente antes de instalar. Y si no la lees, finge que sí; me ofende que me ignoren. 😤",
        "Do what you like, but read the source before installing. And if you won't, pretend you did; being ignored offends me. 😤",
      ],
    ],
    [
      [
        "¿Sabías que llevas un buen rato aquí? No me quejo. Me encanta tener público. 🎭",
        "Did you know you've been here a while? Not complaining. I love having an audience. 🎭",
      ],
    ],
  ],
  /* si te quedas quieta/o un buen rato */
  idle: [
    [
      "¿Sigues ahí? Pregunto porque iba a hacer algo que no debería. 😈",
      "Still there? Asking because I was about to do something I shouldn't. 😈",
    ],
    ["Silencio… sospechoso. Me gusta. 🤨", "Silence… suspicious. I like it. 🤨"],
    [
      "Si no haces nada en diez segundos, tomo el control de la página. Era broma. Casi. 🐑",
      "If you do nothing in ten seconds, I take over the page. Kidding. Almost. 🐑",
    ],
  ],

  /* agarrarla */
  grab: [
    ["¡Eh! ¡Las patitas, que son de lana! 🐑", "Hey! Paws off, they're wool! 🐑"],
    ["¡Bájame! ¡Soy una oveja digna!", "Put me down! I'm a dignified sheep!"],
    [
      "¡Aaaah! ¿Adónde me llevas? ¿A conocer a tu madre?",
      "Aaaah! Where are you taking me? To meet your mother?",
    ],
    [
      "¡Cuidado con la bufanda, que es de edición limitada! 🧣",
      "Careful with the scarf, it's limited edition! 🧣",
    ],
    ["¡Socorro! ¡Me secuestran con un ratón! 🆘", "Help! I'm being kidnapped by a mouse! 🆘"],
  ],
  holding: [
    [
      "Esto es mucho más cómodo de lo que parece… mentira, no lo es.",
      "This is far comfier than it looks… lie, it isn't.",
    ],
    ["Qué vistas tan bonitas. Ahora bájame.", "Nice view. Now put me down."],
    ["Estoy colgando de la lana. De la LANA.", "I'm hanging by the wool. The WOOL."],
    [
      "Apunto tu nombre en mi lista. Tengo una lista. 📝",
      "I'm writing your name on my list. I have a list. 📝",
    ],
    [
      "¿Y si me sueltas con cuidadito? Solo propongo. 🙏",
      "How about you let go gently? Just suggesting. 🙏",
    ],
  ],
  longHold: [
    [
      "Llevo diez segundos colgada. Mi abogado te llamará. ⚖️",
      "I've been hanging for ten seconds. My lawyer will call you. ⚖️",
    ],
  ],
  shake: [
    ["¡Para, para! ¡Que me desordenas la lana! 😵", "Stop, stop! You're messing up my wool! 😵"],
  ],
  /* caídas */
  soft: [
    [
      "Aterrizaje de diez. Ni se despeinó la lana. 🐑",
      "Perfect landing. Not a hair out of place. 🐑",
    ],
    [
      "Gracias por el viaje. Cinco estrellas. Cuatro, por lo del susto.",
      "Thanks for the ride. Five stars. Four, because of the scare.",
    ],
    ["Y yo que pensaba que hoy no volaba…", "And here I thought I wasn't flying today…"],
  ],
  hard: [
    [
      "¡PLOF! Eso dolió… un poco. Estoy bien. Estoy bien. 😵",
      "THUD! That hurt… a little. I'm fine. I'm fine. 😵",
    ],
    [
      "Nota mental: las ovejas no vuelan. Nota mental 2: vengarme. 📝",
      "Note to self: sheep don't fly. Note to self 2: revenge. 📝",
    ],
    ["Auch. Lo he sentido hasta en los rizos. 🌀", "Ouch. I felt that in my curls. 🌀"],
  ],
  /* al aterrizar tras un lanzamiento (el 1.º y el 3.º son de siempre) */
  thrown: [
    ["Ni Superman aterriza así de mal. 🦸", "Not even Superman lands this badly. 🦸"],
    [
      "Aterrizaje… por llamarlo de alguna manera. Lo anoto. 📝",
      "Landing… if we can call it that. Noted. 📝",
    ],
    [
      "Cinco segundos de silencio por mi dignidad. 🕯️",
      "Five seconds of silence for my dignity. 🕯️",
    ],
    ["Estoy bien. Que nadie me mire los rizos. 🌀", "I'm fine. Nobody look at my curls. 🌀"],
    ["Vuelo cancelado. Reclamación en curso. 📨", "Flight cancelled. Complaint filed. 📨"],
    [
      "Ni una disculpa. Ni un «¿estás bien?». Anotado. 📝",
      "Not an apology. Not even an “are you okay?”. Noted. 📝",
    ],
    ["Ese trayecto no incluía seguro de lana. ⚖️", "That trip didn't include wool insurance. ⚖️"],
    [
      "Punto para ti. Solo uno. Mi lista tiene muchas filas. 😌",
      "One point for you. Just one. My list has many rows. 😌",
    ],
  ],
  /* en el aire, al soltarla con fuerza (salen en < 400 ms; las dos primeras son las de siempre) */
  flying: [
    [
      "¿Me has lanzado? ¡ME HAS LANZADO! Esto es denunciable. 😤",
      "Did you throw me? YOU THREW ME! This is reportable. 😤",
    ],
    ["¡¡WIIIIII!! 🚀 …otra vez, otra vez. Mentira. No.", "WHEEEE!! 🚀 …again, again. Lie. No."],
    ["¡Las ovejas dignas no vuelan! ¡Me niego! 🙅‍♀️", "Dignified sheep don't fly! I refuse! 🙅‍♀️"],
    [
      "Vuelo sin billete, sin maleta y sin consentimiento. 🧳",
      "Flight with no ticket, no luggage and no consent. 🧳",
    ],
    ["¡Testigos! ¡Que alguien tome nota de esto! 📝", "Witnesses! Somebody take notes on this! 📝"],
    [
      "Esto va directo a mi lista de venganzas. ⏱️📝",
      "This goes straight on my revenge list. ⏱️📝",
    ],
    [
      "¡Mi lana! ¡Se me va a despeinar toda la lana! 💨",
      "My wool! My whole fleece is going to get messy! 💨",
    ],
    ["Primera clase sería de agradecer… ¡¡AAAH!! ✈️", "First class would've been nice… AAAH!! ✈️"],
  ],
  onSearch: [
    [
      "Aterrizaje en la barra de búsqueda. Si buscas «ayuda», ya la encontré. 🔍",
      "Landed on the search bar. If you're searching for “help”, I found it. 🔍",
    ],
  ],
  onWin: [
    [
      "Qué cómoda esta ventana. Gracias por el transporte. 💺",
      "This window is comfy. Thanks for the lift. 💺",
    ],
  ],
  onFloor: [["Al suelo, como las ovejas decentes. 🌱", "On the ground, like decent sheep. 🌱"]],
  many: [
    [
      "Ya van {n} veces. ¿Te caigo bien o es que te aburres? 🙄",
      "That's {n} times now. Do you like me or are you just bored? 🙄",
    ],
    [
      "{n} secuestros. Mi lista de venganzas crece. 📝",
      "{n} kidnappings. My revenge list is growing. 📝",
    ],
  ],
  /* ventana movida o cerrada con ella encima */
  dragged: [
    ["¡¡OYE!! ¡Estaba sentada ahí! 💢", "HEY!! I was sitting there! 💢"],
    [
      "¿Pero quién mueve una ventana con alguien encima? 😤",
      "Who moves a window with someone on it? 😤",
    ],
    [
      "¡Eso es desalojo ilegal! Yo tenía contrato de alquiler. 📜",
      "That's illegal eviction! I had a lease. 📜",
    ],
    ["¡Mi lana! ¡Mi dignidad! ¡Mi ventana! 😡", "My wool! My dignity! My window! 😡"],
  ],
  closedOn: [
    [
      "¡¡Eh!! ¿Quién cierra una ventana con alguien encima? 💢",
      "HEY!! Who closes a window with someone on it? 💢",
    ],
    [
      "Gracias por avisar. Ah, no: no avisaste. 😤",
      "Thanks for the warning. Oh wait, there was none. 😤",
    ],
  ],
  closedSelf: [
    [
      "Ups… lo del cierre sorpresa también cuenta para mí. 🙃",
      "Oops… the surprise closing applies to me too. 🙃",
    ],
    [
      "Plan perfecto. Fallo en un detalle: yo estaba encima. 🐑",
      "Perfect plan. One flaw: I was standing on it. 🐑",
    ],
  ],
  dropMany: [
    [
      "Ya van {n} ventanas movidas bajo mis patas. Esto es una guerra. ⚔️",
      "That's {n} windows moved from under my hooves. This is war. ⚔️",
    ],
    [
      "Plan «Lana Total»: +5% por tu culpa. Gracias por la motivación. 😈",
      "Plan “Total Wool”: +5% because of you. Thanks for the motivation. 😈",
    ],
  ],
  madTap: [
    ["Hmph. 💢", "Hmph. 💢"],
    ["No te hablo.", "I'm not talking to you."],
    ["(me hago la ofendida)", "(pretending to be offended)"],
    [
      "Pídeme perdón con una app nueva en favoritas. ⭐",
      "Apologize with a new app in your favorites. ⭐",
    ],
  ],
  calm: [
    [
      "…Bueno, ya se me pasó. Pero no se me olvida. 📝",
      "…Fine, I'm over it. But I won't forget. 📝",
    ],
  ],

  /* travesuras */
  bgPre: [
    [
      "Llevas un rato con el mismo fondo… voy a redecorar. 🎨 No mires.",
      "You've had the same background for a while… I'm redecorating. 🎨 Don't look.",
    ],
    [
      "Esto está muy aburrido. Un momento, que muevo unos muebles. 🛋️",
      "This is so boring. One moment, I'm moving some furniture. 🛋️",
    ],
    ["Shhh. Voy a hacer algo. No es nada. 😇", "Shhh. I'm about to do something. It's nothing. 😇"],
  ],
  bgPost: [
    [
      "¡Tachán! Mucho mejor. Si no te gusta, queja con Kitsuki. 😇",
      "Ta-da! Much better. If you don't like it, complain to Kitsuki. 😇",
    ],
    [
      "Sorpresa. El fondo es mío ahora. Poco a poco, la página entera. 😈",
      "Surprise. The background is mine now. Bit by bit, the whole page. 😈",
    ],
    [
      "¿A que ahora se ve más bonito? No me contestes. 🌄",
      "Doesn't it look prettier now? Don't answer. 🌄",
    ],
  ],
  closePreOwn: [
    [
      "Esta ventana está muy desordenada. Un momento, la cierro… 🧹",
      "This window is a mess. One moment, I'm closing it… 🧹",
    ],
    [
      "¿Y si cierro esta ventana? Seguro que no pasa nada. Seguro. 🙈",
      "What if I close this window? Surely nothing happens. Surely. 🙈",
    ],
  ],
  closePre: [
    ["Mmm… esa ventana lleva demasiado abierta. 👀", "Mmm… that window has been open too long. 👀"],
    [
      "No mires la pantalla. Y menos esa ventana. 🤫",
      "Don't look at the screen. Especially not that window. 🤫",
    ],
  ],
  closePost: [
    [
      "¿Esa ventana? Nunca existió. Eso dicen los de arriba. 🕵️",
      "That window? It never existed. That's what the higher-ups say. 🕵️",
    ],
    [
      "Cierre sorpresa: gratis, sin garantía y sin remordimientos. 🐑",
      "Surprise closing: free, no warranty and no remorse. 🐑",
    ],
    ["Yo no fui. Ni siquiera estaba aquí. 🙃", "Wasn't me. I wasn't even here. 🙃"],
  ],
  prOn: [
    [
      "¡Travesuras activadas! Cuidado con tus ventanas… y con tus fondos. 😈",
      "Mischief on! Watch your windows… and your backgrounds. 😈",
    ],
  ],
  prOff: [["Vale, me portaré bien. Por ahora. 😇", "Okay, I'll behave. For now. 😇"]],
};

export function iniciar() {
  /* lo que kixki3.js mezclaba en tiempo de ejecución, ahora ya mezclado */
  A(T, "tap", TX.tap);
  A(T, "praise", TX.praise);
  A(T, "dizzy", TX.dizzy);
  delete TX.tap;
  delete TX.praise;
  delete TX.dizzy;
}
