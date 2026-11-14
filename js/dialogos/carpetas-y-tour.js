/*
  Frases por carpeta, saludos y los dos recorridos guiados (PC y móvil).
*/

export const FOLD = {
  tiendas: [
    "Tiendas: {n} apps para conseguir más apps. ¡Empieza por {a}!",
    "Stores: {n} apps to get more apps. Start with {a}!",
  ],
  importante: [
    "Importante: lo que hace que otras apps funcionen mejor. Léelo con calma. 👀",
    "Essential: the stuff that makes other apps work better. Read it calmly. 👀",
  ],
  utilidad: [
    "Utilidad: {n} herramientas para automatizar, ajustar y conectar con tu PC. {a} es buena para empezar.",
    "Utilities: {n} tools to automate, tweak and connect with your PC. {a} is a good place to start.",
  ],
  control: [
    "Control de apps: quita, limita y revisa lo que hacen tus apps. Mira ADL antes de quitar nada. 🧩",
    "App control: remove, limit and check what your apps do. Check ADL before removing anything. 🧩",
  ],
  pantalla: [
    "Pantalla y batería: {n} apps para ahorrar batería y controlar tu pantalla. 🔋",
    "Screen & battery: {n} apps to save battery and control your screen. 🔋",
  ],
  fotos: [
    "Fotos y archivos: {n} apps para editar, organizar y guardar. {a} es buena para empezar. 🖼️",
    "Photos & files: {n} apps to edit, organize and store. {a} is a good place to start. 🖼️",
  ],
  internet: [
    "Internet: navegadores, YouTube sin cuenta, podcasts, mapas y compartir por Wi-Fi. 🌐",
    "Internet: browsers, YouTube without an account, podcasts, maps and Wi-Fi sharing. 🌐",
  ],
  dia: [
    "Día a día: notas, tareas, calendario, IA y entrenamientos. 📅",
    "Daily: notes, tasks, calendar, AI and workouts. 📅",
  ],
  privacidad: [
    "Privacidad: {n} apps para cuidar tus datos. {a} es buena para empezar. 🔒",
    "Privacy: {n} apps to look after your data. {a} is a good place to start. 🔒",
  ],
  mensajeria: [
    "Mensajería y correo: {n} apps para chatear y escribir con más privacidad. {a} es buena para empezar. 💬",
    "Messaging & mail: {n} apps to chat and write with more privacy. {a} is a good place to start. 💬",
  ],
  sistemas: [
    "Sistemas: no son apps, son sistemas operativos para tu PC o tu móvil. Haz copia antes de instalar. 💿",
    "Systems: not apps, these are operating systems for your PC or phone. Back up before installing. 💿",
  ],
  emulacion: [
    "Emulación: juega tus clásicos en el móvil. Recuerda usar solo tus propios juegos. 🎮",
    "Emulation: play your classics on your phone. Remember to use only your own games. 🎮",
  ],
  decoracion: [
    "Decoración: fondos y widgets para que tu pantalla luzca linda. 🎨",
    "Decor: wallpapers and widgets to make your screen look cute. 🎨",
  ],
  musica: [
    "Música: para escuchar y descargar tus canciones. 🎵",
    "Music: to play and download your songs. 🎵",
  ],
  teclados: [
    "Teclados: escribe con más estilo y más privacidad. ⌨️",
    "Keyboards: type with more style and more privacy. ⌨️",
  ],
  packs: [
    "Packs: listas para instalar varias apps de una vez. 🎁",
    "Packs: ready-made lists to install several apps at once. 🎁",
  ],
};

export const GREET = {
  night: [
    "¿Todavía despierta? Yo hago guardia contigo. 🌙",
    "Still up? I'll keep watch with you. 🌙",
  ],
  morning: [
    "¡Buenos días! ☀️ ¿Qué buscamos hoy?",
    "Good morning! ☀️ What are we looking for today?",
  ],
  afternoon: [
    "¡Buenas tardes! 🐑 ¿Qué app buscamos?",
    "Good afternoon! 🐑 Which app are we after?",
  ],
  evening: [
    "¡Buenas noches! 🌙 Qué gusto verte por aquí.",
    "Good evening! 🌙 So nice to see you here.",
  ],
  away: [
    "¡Volviste! Hace {d} días que no te veía. 🥹",
    "You're back! I haven't seen you in {d} days. 🥹",
  ],
  news1: ["Hay 1 novedad en «Novedades». 🆕", "There's 1 new app in “New”. 🆕"],
  newsN: ["Hay {n} novedades en «Novedades». 🆕", "There are {n} new apps in “New”. 🆕"],
};

export const TOUR_PC = [
  [
    null,
    [
      "¡Hola! Soy Kixki, la guía de la tienda. 🐑 Te enseño todo en un momentito.",
      "Hi! I'm Kixki, the store's guide. 🐑 Let me show you around in a moment.",
    ],
  ],
  [
    "desk:tiendas",
    [
      "Estas carpetas son tu escritorio: ábrelas con un clic para ver sus apps.",
      "These folders are your desktop: click one to see its apps.",
    ],
  ],
  [
    "search",
    [
      "Aquí buscas cualquier app. Truco: pulsa «/» para escribir al instante.",
      "Search any app here. Tip: press “/” to start typing instantly.",
    ],
  ],
  [
    null,
    [
      "Si quieres un consejo, tócame. ¡Eres muy pro, no lo olvides! ✨",
      "Want a tip? Just tap me. You're very pro, don't forget it! ✨",
    ],
  ],
];

export const TOUR_MOB = [
  [
    null,
    [
      "¡Hola! Soy Kixki, la guía de la tienda. 🐑 Te enseño todo en un momentito.",
      "Hi! I'm Kixki, the store's guide. 🐑 Let me show you around in a moment.",
    ],
  ],
  [
    "tiles0",
    [
      "Cada carpeta agrupa apps por tema. ¡Tócala para abrirla!",
      "Each folder groups apps by theme. Tap one to open it!",
    ],
  ],
  [
    "search",
    [
      "Y aquí buscas cualquier app por su nombre o etiqueta.",
      "And here you can search any app by name or tag.",
    ],
  ],
  [
    "dock",
    [
      "Abajo tienes Inicio, Buscar y Favoritas. ¡Y «Más» tiene sorpresas! 🎁",
      "Down here you have Home, Search and Favorites. And “More” has surprises! 🎁",
    ],
  ],
  [
    null,
    [
      "Tócame cuando quieras un consejo. ¡Eres muy pro, no lo olvides! ✨",
      "Tap me whenever you want a tip. You're very pro, don't forget it! ✨",
    ],
  ],
];
