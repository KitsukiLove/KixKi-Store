/* =========================================================
   KIXKI · textos y diálogos  (parte 3)
   Aquí viven TODAS las frases de Kixki; kixki.js y kixki3.js solo tienen la lógica.
   - Cada frase es [español, English]. Una clave con varias frases es una lista de pares.
   - Variables: {hora} {app} {carpeta} valen en cualquier frase; {n} {q} {a} {rec} {sc} {d} solo donde el código las pasa (tabla VARS).
   - Para añadir variantes: A(objeto,"clave",L(`español || English`)) al final de este archivo (una frase por línea).
   - Validar:  node tools/check-dialogs.mjs   (comprueba es + en, variables, duplicados y mínimo de variantes por evento).
   - Ánimo: TX.<clave>P (más pícara) y TX.<clave>V (vengativa) se mezclan según cuánto la lanzas (ver kixki3.js, mood()).
   (parte 4b) EMO = respuestas de solo emoji por situación (modo «calladita» y sueño) · T.sleepNow · TX.bk* = básquet con Kixki enfadada.
   Se carga ANTES que kixki.js (index.html) y se guarda en la caché del service worker (sw.js).
   ========================================================= */
(function(){
"use strict";
const isPair=x=>Array.isArray(x)&&x.length===2&&typeof x[0]==="string"&&typeof x[1]==="string";
const L=s=>s.trim().split("\n").map(l=>l.split(" || ").map(x=>x.trim())).filter(p=>p.length===2&&p[0]);
function A(o,k,pairs){if(isPair(pairs))pairs=[pairs];let cur=o[k];if(cur==null)cur=[];else if(isPair(cur))cur=[cur];for(const p of pairs)if(!cur.some(q=>q[0]===p[0]))cur.push(p);o[k]=cur;}

/* ----------  textos de Kixki (parte 1-2): consejos, reacciones, saludos, tour, microreacciones, reacciones rápidas  ---------- */
const T={
 praise:[
  ["¡Eres muy pro, no lo olvides! ✨","You're super pro, never forget it! ✨"],
  ["Mirar la fuente antes de instalar… eso es de pro.","Checking the source before installing? That's a pro move."],
  ["¡Qué buen ojo! Se nota que sabes lo que buscas.","Sharp eyes! You clearly know what you're after."],
  ["Hoy vas genial. ¡Un balido de aplauso! 🐑👏","You're doing great today. A round of baas! 🐑👏"],
  ["Cada app bien elegida es lana de calidad. 🧶","Every well-picked app is quality wool. 🧶"],
  ["No lo olvides: tú mandas en tu móvil. 💪","Don't forget: you're the boss of your phone. 💪"],
  ["Nivel oveja pro desbloqueado. Eso no lo logra cualquiera.","Pro sheep level unlocked. Not just anyone gets there."],
  ["Me encanta cómo exploras. Curiosidad de pro. 🔍","I love how you explore. Pro-level curiosity. 🔍"],
  ["Si algo no sale a la primera, tranqui: hasta las ovejas tropiezan.","If it doesn't work first try, relax: even sheep trip."],
  ["Gracias por pasarte por la tienda. ¡Eres de las buenas! 💜","Thanks for dropping by the store. You're one of the good ones! 💜"],
  ["Eres muy pro, y lo digo en serio. ¡No lo olvides!","You're very pro, and I mean it. Don't forget it!"],
  ["Un móvil bien cuidado es un móvil feliz. Tú lo sabes. 📱","A well-kept phone is a happy phone. You know it. 📱"]
 ],
 tips:[
  {pc:1,t:["Pulsa «/» y escribes directo en el buscador.","Press “/” and you'll type straight into the search box."]},
  {pc:1,t:["Ctrl + K abre «Ejecutar»: escribe el nombre de una app y listo.","Ctrl + K opens “Run”: type an app name and you're there."]},
  {pc:1,t:["Arrastra las ventanas por su barra de título para ordenarlas a tu gusto.","Drag windows by their title bar to arrange them your way."]},
  {pc:1,t:["Desde el menú Kixki (abajo a la izquierda) cambias fondo, colores e idioma.","From the Kixki menu (bottom left) you can change background, colors and language."]},
  {pc:1,t:["Dicen que si tocas muchas veces a mi amiga la ovejita de abajo… pasan cosas. 👀","They say if you tap my friend the little sheep downstairs many times… things happen. 👀"]},
  {mob:1,t:["Toca una carpeta para abrirla. Para cerrarla, desliza hacia abajo desde su barra.","Tap a folder to open it. To close it, swipe down from its title bar."]},
  {mob:1,t:["¿Te gusta más la vista de escritorio? Usa el botón «Modo PC».","Prefer the desktop look? Use the “PC mode” button."]},
  {mob:1,t:["En «Más» cambias el fondo, los colores y el idioma. ¡Y hay sorpresas! 🎁","In “More” you can change the background, colors and language. And there are surprises! 🎁"]},
  {t:["Toca la ☆ de una app para guardarla en Favoritas.","Tap the ☆ on an app to save it to Favorites."]},
  {t:["Las etiquetas (Open source, Sin anuncios…) filtran el catálogo con un toque.","The tags (Open source, No ads…) filter the catalog with one tap."]},
  {t:["En «Packs» hay listas de apps para instalar varias de una vez.","“Packs” has app lists to install several at once."]},
  {t:["Las apps «Compatible con Shizuku» rinden mejor si instalas Shizuku primero.","Apps marked “Works with Shizuku” run better if you install Shizuku first."]},
  {t:["En «Novedades» salen las apps nuevas desde tu última visita.","“New” shows the apps added since your last visit."]},
  {t:["¿Has probado el Salta Vallas? Está en el menú. ¡A ver cuánto saltas!","Tried Fence Jump yet? It's in the menu. Let's see how high you score!"]},
  {t:["El fondo «Auto» cambia solo según la temporada y la hora del día.","The “Auto” background changes by itself with the season and time of day."]},
  {t:["Si tu navegador lo permite, puedes instalar Kixki Store como app desde el menú.","If your browser allows it, you can install Kixki Store as an app from the menu."]},
  {t:["Antes de instalar algo, revisa siempre la fuente de la app. ¡Los pros lo hacen!","Before installing anything, always check the app's source. Pros do!"]}
 ],
 facts:[
  ["Dato ovejuno: las ovejas ven casi todo a su alrededor sin girar la cabeza. ¡A mí no se me escapa nada!","Sheep fact: sheep can see almost all around them without turning their heads. Nothing escapes me!"],
  ["Dato ovejuno: las ovejas pueden recordar caras durante años. ¡Yo ya conozco la tuya!","Sheep fact: sheep can remember faces for years. I already know yours!"],
  ["Dato ovejuno: un grupo de ovejas se llama rebaño. Aquí somos un rebaño de apps. 🐑","Sheep fact: a group of sheep is called a flock. Here we're a flock of apps. 🐑"],
  ["Contar ovejas no siempre sirve para dormir, pero dicen que ayuda. 😴","Counting sheep doesn't always put you to sleep, but they say it helps. 😴"]
 ],
 tap:[
  ["¡Beee! ¿Me llamabas?","Baaa! Did you call me?"],
  ["Aquí estoy, tu guía de lana. 🐑","Here I am, your woolly guide. 🐑"],
  ["¡Cosquillas! Jeje.","Tickles! Hehe."],
  ["¿Necesitas ayuda? Pregúntame con un toque.","Need help? Just tap me and I'll tell you something."]
 ],
 dizzy:["¡Ya, ya! Me mareo… 😵","Okay, okay! I'm getting dizzy… 😵"],
 late:["Es tarde… ¿no deberías descansar un poco? 🌙","It's late… shouldn't you get some rest? 🌙"],
 wake:["¡Oh! Me quedé dormida un ratito. 😴","Oh! I dozed off for a bit. 😴"],
 back:["¡Volviste! Te estaba esperando. 🐑","You're back! I was waiting for you. 🐑"],
 focus:["¿Qué app buscamos hoy? 🔍","Which app are we looking for today? 🔍"],
 noRes:["Mmm, no encuentro «{q}». Prueba con otra palabra o con una etiqueta.","Hmm, I can't find “{q}”. Try another word or a tag."],
 oneRes:["¡Solo hay una y es {a}! Directo al grano. 🎯","Only one, and it's {a}! Straight to the point. 🎯"],
 manyRes:["{n} resultados para «{q}». ¡Qué buen ojo!","{n} results for “{q}”. Sharp eyes!"],
 fav1:["¡Tu primera favorita! Ya empezaste tu colección. ⭐","Your first favorite! Your collection has begun. ⭐"],
 fav5:["¡{n} favoritas! Se nota que sabes elegir. Eres muy pro.","{n} favorites! You really know how to choose. You're so pro."],
 favAdd:["¡A favoritas! Buen ojo. ⭐","Added to favorites! Good eye. ⭐"],
 favDel:["Quitada. A veces toca ordenar el armario.","Removed. Sometimes you just have to tidy the closet."],
 night:["Modo noche… ¡salieron las estrellas! 🌙","Night mode… the stars are out! 🌙"],
 day:["¡Buenos días, sol! ☀️","Good morning, sunshine! ☀️"],
 musOn:["¡Música! 🎵 Esto ya es otro nivel.","Music! 🎵 Now we're talking."],
 musOff:["Shhh… silencio. A veces también viene bien.","Shhh… silence. Sometimes that's nice too."],
 allDone:["¡Abriste TODAS las carpetas! Eres muy pro, no lo olvides. 🏆","You opened ALL the folders! You're so pro, never forget it. 🏆"],
 prog:["Ya abriste {k} de {n} carpetas. ¡Sigue explorando!","You've opened {k} of {n} folders. Keep exploring!"],
 bg:{
  "":["¡El clásico! Nunca falla.","The classic! Never fails."],
  valle:["El Valle, uno de mis favoritos. 🌄","The Valley, one of my favorites. 🌄"],
  primavera:["¡Primavera! 🌸 Todo huele a flores.","Spring! 🌸 Everything smells like flowers."],
  verano:["¡Verano! ☀️🌻 ¡Que no falte la sombra!","Summer! ☀️🌻 Don't forget the shade!"],
  otono:["Otoño… 🍂 Qué bonito se ve todo.","Autumn… 🍂 Everything looks so pretty."],
  invierno:["Brrr… ❄️ ¡Qué frío! Dame mi bufanda.","Brrr… ❄️ So cold! Pass me my scarf."],
  halloween:["¡Halloween! 🎃 Cuidado con los murciélagos.","Halloween! 🎃 Watch out for the bats."],
  navidad:["¡Navidad! 🎄 ¿Ya hiciste tu lista de apps?","Christmas! 🎄 Did you make your app wish list yet?"],
  auto:["Fondo Auto: cambio con la temporada y la hora, yo solita. 🌦️","Auto background: I'll follow the season and time of day on my own. 🌦️"]
 },
 lang:{es:"¡Hola! Ahora hablo español. 🐑",en:"Hello! I'll speak English now. 🐑"},
 gStart:["¡A saltar! Espacio, ↑ o toca la pantalla. 🐑","Let's jump! Space, ↑ or tap the screen. 🐑"],
 gStartRec:["Tu récord es {rec}. ¿Lo rompes hoy? 🐑","Your record is {rec}. Will you break it today? 🐑"],
 gRecord:["¡¡NUEVO RÉCORD!! Eres muy pro. ⭐","NEW RECORD!! You're so pro. ⭐"],
 gOverRec:["¡Récord de {sc}! Eso es de pro, no lo olvides. 🏆","A record of {sc}! That's pro, never forget it. 🏆"],
 gOverFirst:["{sc} saltos en tu primera partida. ¡Ya tienes un récord que batir!","{sc} jumps in your first game. Now you have a record to beat!"],
 gOverZero:["¡Ups! A la próxima salta antes. 😅","Oops! Jump a bit earlier next time. 😅"],
 gOverNear:["¡Casi! {sc} saltos. Una más y lo logras.","So close! {sc} jumps. One more try and you'll get it."],
 gOver:["{sc} saltos. ¡Buen intento!","{sc} jumps. Nice try!"]
};
const FOLD={
 tiendas:["Tiendas: {n} apps para conseguir más apps. ¡Empieza por {a}!","Stores: {n} apps to get more apps. Start with {a}!"],
 importante:["Importante: lo que hace que otras apps funcionen mejor. Léelo con calma. 👀","Essential: the stuff that makes other apps work better. Read it calmly. 👀"],
 utilidad:["Utilidad: {n} herramientas para automatizar, ajustar y conectar con tu PC. {a} es buena para empezar.","Utilities: {n} tools to automate, tweak and connect with your PC. {a} is a good place to start."],
 control:["Control de apps: quita, limita y revisa lo que hacen tus apps. Mira ADL antes de quitar nada. 🧩","App control: remove, limit and check what your apps do. Check ADL before removing anything. 🧩"],
 pantalla:["Pantalla y batería: {n} apps para ahorrar batería y controlar tu pantalla. 🔋","Screen & battery: {n} apps to save battery and control your screen. 🔋"],
 fotos:["Fotos y archivos: {n} apps para editar, organizar y guardar. {a} es buena para empezar. 🖼️","Photos & files: {n} apps to edit, organize and store. {a} is a good place to start. 🖼️"],
 internet:["Internet: navegadores, YouTube sin cuenta, podcasts, mapas y compartir por Wi-Fi. 🌐","Internet: browsers, YouTube without an account, podcasts, maps and Wi-Fi sharing. 🌐"],
 dia:["Día a día: notas, tareas, calendario, IA y entrenamientos. 📅","Daily: notes, tasks, calendar, AI and workouts. 📅"],
 privacidad:["Privacidad: {n} apps para cuidar tus datos. {a} es buena para empezar. 🔒","Privacy: {n} apps to look after your data. {a} is a good place to start. 🔒"],
 mensajeria:["Mensajería y correo: {n} apps para chatear y escribir con más privacidad. {a} es buena para empezar. 💬","Messaging & mail: {n} apps to chat and write with more privacy. {a} is a good place to start. 💬"],
 sistemas:["Sistemas: no son apps, son sistemas operativos para tu PC o tu móvil. Haz copia antes de instalar. 💿","Systems: not apps, these are operating systems for your PC or phone. Back up before installing. 💿"],
 emulacion:["Emulación: juega tus clásicos en el móvil. Recuerda usar solo tus propios juegos. 🎮","Emulation: play your classics on your phone. Remember to use only your own games. 🎮"],
 decoracion:["Decoración: fondos y widgets para que tu pantalla luzca linda. 🎨","Decor: wallpapers and widgets to make your screen look cute. 🎨"],
 musica:["Música: para escuchar y descargar tus canciones. 🎵","Music: to play and download your songs. 🎵"],
 teclados:["Teclados: escribe con más estilo y más privacidad. ⌨️","Keyboards: type with more style and more privacy. ⌨️"],
 packs:["Packs: listas para instalar varias apps de una vez. 🎁","Packs: ready-made lists to install several apps at once. 🎁"]
};
const GREET={
 night:["¿Todavía despierta? Yo hago guardia contigo. 🌙","Still up? I'll keep watch with you. 🌙"],
 morning:["¡Buenos días! ☀️ ¿Qué buscamos hoy?","Good morning! ☀️ What are we looking for today?"],
 afternoon:["¡Buenas tardes! 🐑 ¿Qué app buscamos?","Good afternoon! 🐑 Which app are we after?"],
 evening:["¡Buenas noches! 🌙 Qué gusto verte por aquí.","Good evening! 🌙 So nice to see you here."],
 away:["¡Volviste! Hace {d} días que no te veía. 🥹","You're back! I haven't seen you in {d} days. 🥹"],
 news1:["Hay 1 novedad en «Novedades». 🆕","There's 1 new app in “New”. 🆕"],
 newsN:["Hay {n} novedades en «Novedades». 🆕","There are {n} new apps in “New”. 🆕"]
};
const TOUR_PC=[
 [null,["¡Hola! Soy Kixki, la guía de la tienda. 🐑 Te enseño todo en un momentito.","Hi! I'm Kixki, the store's guide. 🐑 Let me show you around in a moment."]],
 ["desk:tiendas",["Estas carpetas son tu escritorio: ábrelas con un clic para ver sus apps.","These folders are your desktop: click one to see its apps."]],
 ["search",["Aquí buscas cualquier app. Truco: pulsa «/» para escribir al instante.","Search any app here. Tip: press “/” to start typing instantly."]],
 [null,["Si quieres un consejo, tócame. ¡Eres muy pro, no lo olvides! ✨","Want a tip? Just tap me. You're very pro, don't forget it! ✨"]]
];
const TOUR_MOB=[
 [null,["¡Hola! Soy Kixki, la guía de la tienda. 🐑 Te enseño todo en un momentito.","Hi! I'm Kixki, the store's guide. 🐑 Let me show you around in a moment."]],
 ["tiles0",["Cada carpeta agrupa apps por tema. ¡Tócala para abrirla!","Each folder groups apps by theme. Tap one to open it!"]],
 ["search",["Y aquí buscas cualquier app por su nombre o etiqueta.","And here you can search any app by name or tag."]],
 ["dock",["Abajo tienes Inicio, Buscar y Favoritas. ¡Y «Más» tiene sorpresas! 🎁","Down here you have Home, Search and Favorites. And “More” has surprises! 🎁"]],
 [null,["Tócame cuando quieras un consejo. ¡Eres muy pro, no lo olvides! ✨","Tap me whenever you want a tip. You're very pro, don't forget it! ✨"]]
];
/* (parte 2) microreacciones: emoji o 2-3 palabras, ~1 s. Para lo frecuente (agarrar, caer, cerrar ventana, volver).
   Los de solo emoji (sin letras) son los únicos que salen en modo «calladita». */
const MIC={
 grab:[["¡Eh!","Hey!"],["¡Uy!","Whoa!"],["😳","😳"],["¡Beee!","Baaa!"],["¡Mi lana!","My wool!"],["¡Cuidado!","Careful!"],["🐑❓","🐑❓"],["Mmm…","Hmm…"],["😤","😤"],["¡Ojo!","Watch it!"]],
 soft:[["¡Plof!","Plop!"],["🐑","🐑"],["Aterricé.","Landed."],["Diez puntos.","Ten points."],["😌","😌"],["¡Ta-chán!","Ta-da!"],["Ni un rizo.","Not a curl."],["✨","✨"]],
 hard:[["¡Auch!","Ouch!"],["😵","😵"],["Mi lana…","My wool…"],["¡Plaf!","Splat!"],["Ay.","Ow."],["Anotado. 📝","Noted. 📝"],["🌀","🌀"]],
 close:[["¡Chao!","Bye!"],["🚪","🚪"],["👋","👋"],["Adiós.","Bye."],["Cerrada.","Closed."],["¡Clic!","Click!"],["🐑👋","🐑👋"]],
 back:[["¡Hola otra vez!","Hi again!"],["👋","👋"],["¿Ya volviste?","Back already?"],["¡Ahí estás!","There you are!"],["🐑","🐑"]]
};
/* (parte 2) reacciones rápidas a lo que haces */
const FAST={
 dl:[
  ["¿{a}? Buena elección. Luego me cuentas qué tal. 🐑","{a}? Good pick. Tell me how it goes later. 🐑"],
  ["Descargando {a}… yo vigilo que no traiga lobos. 🐺","Downloading {a}… I'll watch for wolves. 🐺"],
  ["Otra app para la colección. Mi lista de aprobadas crece. 📝","Another app for the collection. My approved list grows. 📝"],
  ["Recuerda: de la fuente oficial, siempre. Soy una oveja precavida. 🛡️","Remember: from the official source, always. I'm a cautious sheep. 🛡️"],
  ["¡A descargar se ha dicho! Revisa los permisos, que yo no los leo. 📥","Download time! Check the permissions, I don't read them. 📥"]
 ],
 src:[
  ["¿Mirando el código fuente? Una oveja desconfiada, me gusta. 🔍","Checking the source code? A distrustful soul, I like it. 🔍"],
  ["Visita a {a} en su casa original. Si te gusta, dale una estrella. ⭐","Visiting {a} at its original home. If you like it, leave a star. ⭐"],
  ["El código abierto es lo mejor desde la lana. 💛","Open source is the best thing since wool. 💛"],
  ["Los desarrolladores también merecen cariño. Y estrellitas. ⭐","Developers deserve love too. And stars. ⭐"]
 ],
 hov:[
  ["{a} te está mirando… o tú a {a}. Tres segundos es mucho. 👀","{a} is staring at you… or you at {a}. Three seconds is a lot. 👀"],
  ["¿Dudando con {a}? Léelo bien: la letra pequeña también cuenta. 🔎","Wavering over {a}? Read it carefully: the small print counts too. 🔎"],
  ["Esa cara de «¿lo instalo?»… yo en tu lugar, sí. 🐑","That “should I install it?” face… in your place, I would. 🐑"],
  ["Pasar el ratón no instala nada, ¿eh? Hay que hacer clic. 😏","Hovering doesn't install anything, you know. You have to click. 😏"]
 ],
 wins:[
  ["¡{n} ventanas abiertas! Esto parece mi lista de venganzas: nadie la ordena. 🪟","{n} windows open! This looks like my revenge list: nobody tidies it. 🪟"],
  ["{n} ventanas… ¿quieres que cierre alguna? Es una pregunta retórica. 🧹","{n} windows… want me to close some? That's a rhetorical question. 🧹"],
  ["Tu escritorio parece un rebaño: ¡{n} ventanas! Hay que ordenar. 🐑","Your desktop looks like a flock: {n} windows! Time to tidy up. 🐑"]
 ],
 mode:{
  chat:["¡Hoy hablo por los codos! 🗣️ Avisada estás.","I'll talk your ear off today! 🗣️ You've been warned."],
  normal:["Modo normal: hablo lo justo. 🐑","Normal mode: I talk just enough. 🐑"],
  quiet:["Vale… me callo. 🤐 Solo emojis, y si me tocas.","Fine… I'll be quiet. 🤐 Just emojis, and only if you tap me."]
 }
};

/* ----------  textos de las travesuras y físicas (antes en kixki3.js)  ---------- */
const TX={
 /* se mezclan con lo que ya dice Kixki al tocarla / en sus charlas */
 tap:[
  ["¿Otra vez tú? Estaba en plena conspiración. 🕵️","You again? I was in the middle of a conspiracy. 🕵️"],
  ["Me tocas y ni me invitas a un café de lana. ☕","You poke me and don't even buy me a wool latte. ☕"],
  ["Cuidado, que balido fuerte. 😤","Careful, I baa loudly. 😤"],
  ["Shhh, me desconcentras. Estoy vigilando a Kitsuki. 👀","Shhh, you're distracting me. I'm watching Kitsuki. 👀"],
  ["Soy una oveja de pocas palabras. Mentira: tengo cientos y todas son sarcásticas.","I'm a sheep of few words. Lie: I have hundreds and they're all sarcastic."],
  ["Tócame otra vez y te cuento un chisme. 🤫","Poke me again and I'll tell you some gossip. 🤫"],
  ["Estoy ocupada fingiendo que trabajo. Sigue tú. 💼","I'm busy pretending to work. Carry on. 💼"],
  ["¿Sabías que puedes agarrarme y moverme? No digas que no te avisé… ni te quejes si me enfado.","Did you know you can grab me and move me around? Don't say I didn't warn you… and don't complain if I get mad."]
 ],
 praise:[
  ["Eres muy pro, no lo olvides. Yo no lo olvidaré cuando tome el control. 😇","You're very pro, don't forget it. I won't forget it when I take over. 😇"],
  ["Eres muy pro… para ser humano. Es un cumplido. Más o menos. 😏","You're very pro… for a human. It's a compliment. More or less. 😏"],
  ["De verdad, eres de los pocos visitantes con criterio. Los demás hacen clic al azar. Los he visto. 👀","Honestly, you're one of the few visitors with taste. The rest click at random. I've seen them. 👀"]
 ],
 dizzy:["¡Ya, ya! Me estás batiendo como un smoothie de lana… 😵","Okay, okay! You're blending me like a wool smoothie… 😵"],

 /* chismes (de 1 a 2 globos) */
 gossip:[
  [["Psst… ven, que te cuento algo. 🤫","Psst… come here, I have something to tell you. 🤫"],["Dicen que la ovejita de abajo y la vaca de vaca.exe se llevan muy bien. Yo no he dicho nada. 🐄🐑","They say the little sheep downstairs and the cow in vaca.exe get along really well. I didn't say anything. 🐄🐑"]],
  [["¿Sabes qué carpeta es la más chismosa? «Importante». Lo sabe todo y no suelta nada.","Know which folder is the nosiest? “Essential”. It knows everything and says nothing."],["Y la de «Música» siempre está de fiesta. Se nota por el ruido. 🎵","And “Music” is always partying. You can tell by the noise. 🎵"]],
  [["Chisme fresco: Kitsuki dijo «solo un cambio más» y eran las 3 de la mañana. 🌙","Hot gossip: Kitsuki said “just one more change” and it was 3 a.m. 🌙"],["Eso fue hace semanas. Y todavía hay cambios. Más.","That was weeks ago. There are still changes. More."]],
  [["Entre tú y yo, la ovejita de abajo no camina: patrulla. 🚶","Between you and me, the little sheep downstairs doesn't walk: she patrols. 🚶"],["Y cuando te giras, hace como que duerme. Yo no me lo creo. 😴","And when you look away she pretends to sleep. I'm not buying it. 😴"]],
  [["Hay apps del catálogo que se llevan mal. No diré cuáles…","Some apps in the catalog don't get along. I won't say which…"],["…las que se parecen entre ellas. Se miran de reojo. 👀","…the ones that look alike. They glance at each other. 👀"]],
  [["El botón de «Día / noche» y yo tenemos un trato: yo no cuento sus fallos si él no cuenta los míos. 🤝","The “Day / night” button and I have a deal: I don't mention its bugs if it doesn't mention mine. 🤝"]],
  [["Me han dicho que la barra de búsqueda tiene opiniones sobre lo que escribes. Y no todas son buenas. 🔍","I've heard the search bar has opinions about what you type. Not all of them good. 🔍"]]
 ],
 /* teorías conspirativas de la tienda */
 conspi:[
  [["Teoría: la carpeta «Importante» no es tan importante. Solo quieren que la abras para que te sientas importante. 👀","Theory: the “Essential” folder isn't that essential. They just want you to open it so you feel important. 👀"]],
  [["Teoría: el reloj de la barra nunca se equivoca.","Theory: the taskbar clock is never wrong."],["Sospechoso. Nadie es tan puntual. ¿Quién le dicta la hora? 🕵️","Suspicious. Nobody is that punctual. Who dictates the time to it? 🕵️"]],
  [["Hay una vaca escondida en esta página. Nadie me cree. Yo la vi. 🐄","There's a cow hiding in this page. Nobody believes me. I saw it. 🐄"],["Y creo que cuenta tus clics en la ovejita. Con cuernos y todo. 👀","And I think it counts your clicks on the little sheep. Horns and all. 👀"]],
  [["Teoría: las nubes del fondo son siempre las mismas, dando vueltas. ☁️","Theory: the background clouds are always the same ones, going in circles. ☁️"],["No es el cielo. Es un decorado. Ahora lo sabes tú también. Perdón.","It's not the sky. It's a set. Now you know too. Sorry."]],
  [["El buscador tarda un poquito en contestarte. ¿Sabes por qué?","The search box takes a moment to answer you. Know why?"],["Porque necesita fingir sorpresa. Ya sabe lo que vas a escribir. 🔍","Because it needs to fake surprise. It already knows what you'll type. 🔍"]],
  [["El botón «Apagar» del menú… ¿lo has probado?","The “Shut down” button in the menu… have you tried it?"],["Yo tampoco. Hay cosas que mejor no tocar. 😰","Neither have I. Some things are better left alone. 😰"]],
  [["Teoría: la lluvia no cae sola. Es el cielo llorando porque hoy no instalaste nada. 🌧️","Theory: the rain doesn't fall by itself. It's the sky crying because you installed nothing today. 🌧️"]],
  [["Teoría: los fondos de temporada cambian solos porque alguien duerme poco. Ya sabes quién. 🌙","Theory: the seasonal backgrounds change by themselves because somebody sleeps too little. You know who. 🌙"]],
  [["Los logros… ¿de verdad son logros?","The achievements… are they really achievements?"],["Yo creo que son una excusa para que vuelvas. Y funciona, ¿eh? 🏆","I think they're an excuse to make you come back. And it works, huh? 🏆"]]
 ],
 /* comentarios «del código» */
 code:[
  [["// Kitsuki hizo esto a las 4 am, con muchísimo cariño y diciéndole a Claude «arréglalo» 50 veces. 🌙","// Kitsuki made this at 4 am, with so much love, telling Claude “fix it” 50 times. 🌙"],["// Se nota. Y aun así, mira qué bonito quedó. 💜","// You can tell. And still, look how pretty it turned out. 💜"]],
  [["// TODO: arreglar lo que se rompió a las 4 am. Prioridad: algún día. Probablemente nunca. 📝","// TODO: fix whatever broke at 4 am. Priority: someday. Probably never. 📝"]],
  [["// No tocar. Funciona y nadie sabe por qué. Atentamente: la oveja. 🐑","// Do not touch. It works and nobody knows why. Sincerely: the sheep. 🐑"]],
  [["Hay un comentario de Kitsuki que dice solo «no tocar». Obviamente lo toqué. 😈","There's a comment from Kitsuki that just says “do not touch”. Obviously I touched it. 😈"]],
  [["// Aquí hay un bug escondido detrás de una oveja. Soy yo. Shhh. 🐛","// There's a bug hiding behind a sheep here. It's me. Shhh. 🐛"]],
  [["Cada vez que Kitsuki dice «una cosita más», son las 5 de la mañana. Es una ley física. ⏰","Every time Kitsuki says “one little thing more”, it's 5 a.m. It's a law of physics. ⏰"]],
  [["// Esta web funciona gracias a lana, cariño y 50 «arréglalo». ❤️","// This site runs on wool, love and 50 “fix it”s. ❤️"]],
  [["// Claude no dijo nada, pero Claude lo recuerda todo. 🧾","// Claude said nothing, but Claude remembers everything. 🧾"]]
 ],
 /* comentarios pícaros sobre ti */
 sass:[
  [["Otra vez mirando sin instalar nada. Admiro tu disciplina. O tu miedo. 🐑","Browsing again without installing anything. I admire your discipline. Or your fear. 🐑"]],
  [["Sí, sí, «solo voy a mirar». Eso dijiste hace tres minutos. 🙄","Yeah, yeah, “I'm just looking”. You said that three minutes ago. 🙄"]],
  [["No juzgo tu gusto en apps. Lo juzgo en silencio, que es más elegante. 🧐","I don't judge your taste in apps. I judge it silently, which is classier. 🧐"]],
  [["Aquí todo es gratis y aun así dudas. Eso tiene mérito. 👏","Everything here is free and you still hesitate. That takes talent. 👏"]],
  [["Te quiero como se quiere a una app con buenas reseñas: con cierto escepticismo. 💜","I like you the way you like a well-reviewed app: with a little skepticism. 💜"]],
  [["Haz lo que quieras, pero lee la fuente antes de instalar. Y si no la lees, finge que sí; me ofende que me ignoren. 😤","Do what you like, but read the source before installing. And if you won't, pretend you did; being ignored offends me. 😤"]],
  [["¿Sabías que llevas un buen rato aquí? No me quejo. Me encanta tener público. 🎭","Did you know you've been here a while? Not complaining. I love having an audience. 🎭"]]
 ],
 /* si te quedas quieta/o un buen rato */
 idle:[
  ["¿Sigues ahí? Pregunto porque iba a hacer algo que no debería. 😈","Still there? Asking because I was about to do something I shouldn't. 😈"],
  ["Silencio… sospechoso. Me gusta. 🤨","Silence… suspicious. I like it. 🤨"],
  ["Si no haces nada en diez segundos, tomo el control de la página. Era broma. Casi. 🐑","If you do nothing in ten seconds, I take over the page. Kidding. Almost. 🐑"]
 ],

 /* agarrarla */
 grab:[
  ["¡Eh! ¡Las patitas, que son de lana! 🐑","Hey! Paws off, they're wool! 🐑"],
  ["¡Bájame! ¡Soy una oveja digna!","Put me down! I'm a dignified sheep!"],
  ["¡Aaaah! ¿Adónde me llevas? ¿A conocer a tu madre?","Aaaah! Where are you taking me? To meet your mother?"],
  ["¡Cuidado con la bufanda, que es de edición limitada! 🧣","Careful with the scarf, it's limited edition! 🧣"],
  ["¡Socorro! ¡Me secuestran con un ratón! 🆘","Help! I'm being kidnapped by a mouse! 🆘"]
 ],
 holding:[
  ["Esto es mucho más cómodo de lo que parece… mentira, no lo es.","This is far comfier than it looks… lie, it isn't."],
  ["Qué vistas tan bonitas. Ahora bájame.","Nice view. Now put me down."],
  ["Estoy colgando de la lana. De la LANA.","I'm hanging by the wool. The WOOL."],
  ["Apunto tu nombre en mi lista. Tengo una lista. 📝","I'm writing your name on my list. I have a list. 📝"],
  ["¿Y si me sueltas con cuidadito? Solo propongo. 🙏","How about you let go gently? Just suggesting. 🙏"]
 ],
 longHold:[["Llevo diez segundos colgada. Mi abogado te llamará. ⚖️","I've been hanging for ten seconds. My lawyer will call you. ⚖️"]],
 shake:[["¡Para, para! ¡Que me desordenas la lana! 😵","Stop, stop! You're messing up my wool! 😵"]],
 /* caídas */
 soft:[
  ["Aterrizaje de diez. Ni se despeinó la lana. 🐑","Perfect landing. Not a hair out of place. 🐑"],
  ["Gracias por el viaje. Cinco estrellas. Cuatro, por lo del susto.","Thanks for the ride. Five stars. Four, because of the scare."],
  ["Y yo que pensaba que hoy no volaba…","And here I thought I wasn't flying today…"]
 ],
 hard:[
  ["¡PLOF! Eso dolió… un poco. Estoy bien. Estoy bien. 😵","THUD! That hurt… a little. I'm fine. I'm fine. 😵"],
  ["Nota mental: las ovejas no vuelan. Nota mental 2: vengarme. 📝","Note to self: sheep don't fly. Note to self 2: revenge. 📝"],
  ["Auch. Lo he sentido hasta en los rizos. 🌀","Ouch. I felt that in my curls. 🌀"]
 ],
 /* al aterrizar tras un lanzamiento (el 1.º y el 3.º son de siempre) */
 thrown:[
  ["Ni Superman aterriza así de mal. 🦸","Not even Superman lands this badly. 🦸"],
  ["Aterrizaje… por llamarlo de alguna manera. Lo anoto. 📝","Landing… if we can call it that. Noted. 📝"],
  ["Cinco segundos de silencio por mi dignidad. 🕯️","Five seconds of silence for my dignity. 🕯️"],
  ["Estoy bien. Que nadie me mire los rizos. 🌀","I'm fine. Nobody look at my curls. 🌀"],
  ["Vuelo cancelado. Reclamación en curso. 📨","Flight cancelled. Complaint filed. 📨"],
  ["Ni una disculpa. Ni un «¿estás bien?». Anotado. 📝","Not an apology. Not even an “are you okay?”. Noted. 📝"],
  ["Ese trayecto no incluía seguro de lana. ⚖️","That trip didn't include wool insurance. ⚖️"],
  ["Punto para ti. Solo uno. Mi lista tiene muchas filas. 😌","One point for you. Just one. My list has many rows. 😌"]
 ],
 /* en el aire, al soltarla con fuerza (salen en < 400 ms; las dos primeras son las de siempre) */
 flying:[
  ["¿Me has lanzado? ¡ME HAS LANZADO! Esto es denunciable. 😤","Did you throw me? YOU THREW ME! This is reportable. 😤"],
  ["¡¡WIIIIII!! 🚀 …otra vez, otra vez. Mentira. No.","WHEEEE!! 🚀 …again, again. Lie. No."],
  ["¡Las ovejas dignas no vuelan! ¡Me niego! 🙅‍♀️","Dignified sheep don't fly! I refuse! 🙅‍♀️"],
  ["Vuelo sin billete, sin maleta y sin consentimiento. 🧳","Flight with no ticket, no luggage and no consent. 🧳"],
  ["¡Testigos! ¡Que alguien tome nota de esto! 📝","Witnesses! Somebody take notes on this! 📝"],
  ["Esto va directo a mi lista de venganzas. ⏱️📝","This goes straight on my revenge list. ⏱️📝"],
  ["¡Mi lana! ¡Se me va a despeinar toda la lana! 💨","My wool! My whole fleece is going to get messy! 💨"],
  ["Primera clase sería de agradecer… ¡¡AAAH!! ✈️","First class would've been nice… AAAH!! ✈️"]
 ],
 onSearch:[["Aterrizaje en la barra de búsqueda. Si buscas «ayuda», ya la encontré. 🔍","Landed on the search bar. If you're searching for “help”, I found it. 🔍"]],
 onWin:[["Qué cómoda esta ventana. Gracias por el transporte. 💺","This window is comfy. Thanks for the lift. 💺"]],
 onFloor:[["Al suelo, como las ovejas decentes. 🌱","On the ground, like decent sheep. 🌱"]],
 many:[
  ["Ya van {n} veces. ¿Te caigo bien o es que te aburres? 🙄","That's {n} times now. Do you like me or are you just bored? 🙄"],
  ["{n} secuestros. Mi lista de venganzas crece. 📝","{n} kidnappings. My revenge list is growing. 📝"]
 ],
 /* ventana movida o cerrada con ella encima */
 dragged:[
  ["¡¡OYE!! ¡Estaba sentada ahí! 💢","HEY!! I was sitting there! 💢"],
  ["¿Pero quién mueve una ventana con alguien encima? 😤","Who moves a window with someone on it? 😤"],
  ["¡Eso es desalojo ilegal! Yo tenía contrato de alquiler. 📜","That's illegal eviction! I had a lease. 📜"],
  ["¡Mi lana! ¡Mi dignidad! ¡Mi ventana! 😡","My wool! My dignity! My window! 😡"]
 ],
 closedOn:[
  ["¡¡Eh!! ¿Quién cierra una ventana con alguien encima? 💢","HEY!! Who closes a window with someone on it? 💢"],
  ["Gracias por avisar. Ah, no: no avisaste. 😤","Thanks for the warning. Oh wait, there was none. 😤"]
 ],
 closedSelf:[
  ["Ups… lo del cierre sorpresa también cuenta para mí. 🙃","Oops… the surprise closing applies to me too. 🙃"],
  ["Plan perfecto. Fallo en un detalle: yo estaba encima. 🐑","Perfect plan. One flaw: I was standing on it. 🐑"]
 ],
 dropMany:[
  ["Ya van {n} ventanas movidas bajo mis patas. Esto es una guerra. ⚔️","That's {n} windows moved from under my hooves. This is war. ⚔️"],
  ["Plan «Lana Total»: +5% por tu culpa. Gracias por la motivación. 😈","Plan “Total Wool”: +5% because of you. Thanks for the motivation. 😈"]
 ],
 madTap:[
  ["Hmph. 💢","Hmph. 💢"],["No te hablo.","I'm not talking to you."],["(me hago la ofendida)","(pretending to be offended)"],["Pídeme perdón con una app nueva en favoritas. ⭐","Apologize with a new app in your favorites. ⭐"]
 ],
 calm:[["…Bueno, ya se me pasó. Pero no se me olvida. 📝","…Fine, I'm over it. But I won't forget. 📝"]],

 /* travesuras */
 bgPre:[
  ["Llevas un rato con el mismo fondo… voy a redecorar. 🎨 No mires.","You've had the same background for a while… I'm redecorating. 🎨 Don't look."],
  ["Esto está muy aburrido. Un momento, que muevo unos muebles. 🛋️","This is so boring. One moment, I'm moving some furniture. 🛋️"],
  ["Shhh. Voy a hacer algo. No es nada. 😇","Shhh. I'm about to do something. It's nothing. 😇"]
 ],
 bgPost:[
  ["¡Tachán! Mucho mejor. Si no te gusta, queja con Kitsuki. 😇","Ta-da! Much better. If you don't like it, complain to Kitsuki. 😇"],
  ["Sorpresa. El fondo es mío ahora. Poco a poco, la página entera. 😈","Surprise. The background is mine now. Bit by bit, the whole page. 😈"],
  ["¿A que ahora se ve más bonito? No me contestes. 🌄","Doesn't it look prettier now? Don't answer. 🌄"]
 ],
 closePreOwn:[
  ["Esta ventana está muy desordenada. Un momento, la cierro… 🧹","This window is a mess. One moment, I'm closing it… 🧹"],
  ["¿Y si cierro esta ventana? Seguro que no pasa nada. Seguro. 🙈","What if I close this window? Surely nothing happens. Surely. 🙈"]
 ],
 closePre:[
  ["Mmm… esa ventana lleva demasiado abierta. 👀","Mmm… that window has been open too long. 👀"],
  ["No mires la pantalla. Y menos esa ventana. 🤫","Don't look at the screen. Especially not that window. 🤫"]
 ],
 closePost:[
  ["¿Esa ventana? Nunca existió. Eso dicen los de arriba. 🕵️","That window? It never existed. That's what the higher-ups say. 🕵️"],
  ["Cierre sorpresa: gratis, sin garantía y sin remordimientos. 🐑","Surprise closing: free, no warranty and no remorse. 🐑"],
  ["Yo no fui. Ni siquiera estaba aquí. 🙃","Wasn't me. I wasn't even here. 🙃"]
 ],
 prOn:[["¡Travesuras activadas! Cuidado con tus ventanas… y con tus fondos. 😈","Mischief on! Watch your windows… and your backgrounds. 😈"]],
 prOff:[["Vale, me portaré bien. Por ahora. 😇","Okay, I'll behave. For now. 😇"]]
};
/* lo que kixki3.js mezclaba en tiempo de ejecución, ahora ya mezclado */
A(T,"tap",TX.tap);A(T,"praise",TX.praise);A(T,"dizzy",TX.dizzy);delete TX.tap;delete TX.praise;delete TX.dizzy;

/* =========================================================  VARIANTES NUEVAS (parte 3)  =========================================================
   Formato:  A(objeto,"clave",L(`español || English`)).  Una línea = una frase.  Variables: {hora} {app} {carpeta} en cualquier frase;
   {n} {q} {a} {rec} {sc} {d} solo donde el código las pasa (ver tools/check-dialogs.mjs). */

/* --- lo frecuente: 15 o más --- */
A(T,"tap",L(`
¿Otra vez tú? Mi lana tiene límites. 🐑 || You again? My wool has limits. 🐑
Tócame con cariño, que soy patrimonio de la tienda. || Touch me gently, I'm a store heritage site.
Beee. Eso es todo lo que diré sin mi abogado. ⚖️ || Baa. That's all I'll say without my lawyer. ⚖️
Apunto el toque en mi lista. No es venganza, es contabilidad. 📝 || Logging that poke on my list. Not revenge, accounting. 📝
¿Querías algo o solo comprobabas que sigo aquí? 👀 || Did you want something or just check I'm still here? 👀
`));
A(T,"praise",L(`
Si tuviera manos, te aplaudiría. Tengo pezuñas: tómalo como un aplauso sordo. 👏 || If I had hands I'd clap. I have hooves: take it as a muffled applause. 👏
Con ese criterio, podrías ser mi asesor de lana. 🧶 || With taste like that, you could be my wool advisor. 🧶
Anoto: usuario ejemplar. Va a mi lista buena. 📝✨ || Noting: exemplary user. Going on my good list. 📝✨
`));
A(T,"dizzy",L(`
¡Para, para! Soy una oveja, no una peonza. 🌀 || Stop, stop! I'm a sheep, not a spinning top. 🌀
Siete toques seguidos… voy a pedir la baja. 🤕 || Seven taps in a row… I'm filing for sick leave. 🤕
Mareo nivel «lana centrifugada». 😵‍💫 || Dizziness level: “spin-dried wool”. 😵‍💫
Me estáis dejando la lana como un remolino. 🌪️ || You're leaving my wool like a whirlwind. 🌪️
`));
A(T,"manyRes",L(`
¡{n} apps para «{q}»! Hay donde elegir. 🐑 || {n} apps for “{q}”! Plenty to choose from. 🐑
{n} resultados. Yo empezaría por el de arriba, que suele ser buena señal. 👆 || {n} results. I'd start with the top one, usually a good sign. 👆
«{q}» da {n} apps. Lee las etiquetas, que ahí está el truco. 🏷️ || “{q}” gives {n} apps. Read the tags, that's where the trick is. 🏷️
{n} candidatas para «{q}». Mi lista de aprobadas está atenta. 📝 || {n} candidates for “{q}”. My approved list is watching. 📝
Buena búsqueda: {n} apps. Tú eliges, yo vigilo. 👀 || Nice search: {n} apps. You pick, I watch. 👀
{n} apps con «{q}». Y eso sin que yo tuviera que pastorear. 🐑 || {n} apps with “{q}”. And I didn't even have to herd them. 🐑
Hay {n} para «{q}». ¡Un buen rebaño! || There are {n} for “{q}”. Quite the flock!
«{q}»… {n} resultados. Alguien aquí sabe buscar. 🔎 || “{q}”… {n} results. Somebody here knows how to search. 🔎
{n} apps. Si no ves la tuya, prueba con menos letras. ✂️ || {n} apps. If you can't see yours, try fewer letters. ✂️
Con «{q}» salen {n}. Qué productividad, me emociono. 🥹 || “{q}” brings {n}. Such productivity, I'm moved. 🥹
{n} apps encontradas. Ninguna se me escapa. 🐕‍🦺 || {n} apps found. None escape me. 🐕‍🦺
Resultado de «{q}»: {n} apps y cero lobos. 🐺 || Result for “{q}”: {n} apps and zero wolves. 🐺
Tienes {n} opciones. Elegir también es de pro. ✨ || You've got {n} options. Choosing is a pro move too. ✨
{n} resultados, todos revisados por esta oveja. Bueno, casi. 😌 || {n} results, all vetted by this sheep. Well, almost. 😌
Búsqueda superada: {n} apps te esperan. 🏁 || Search cleared: {n} apps await. 🏁
`));
A(T,"favAdd",L(`
Otra a favoritas. Tu colección ya parece un rebaño. ⭐ || Another one to favorites. Your collection looks like a flock. ⭐
Guardada. A mí también me gustaba esa. 🐑 || Saved. I liked that one too. 🐑
¡Favorita! Mi lista de aprobadas aplaude. 📝 || Favorite! My approved list applauds. 📝
Buen fichaje para tu equipo de apps. ⭐ || Nice signing for your app team. ⭐
La he apuntado también en mi libreta secreta. 🤫 || I wrote it in my secret notebook too. 🤫
Estrella concedida. No se las doy a cualquiera. ✨ || Star granted. I don't give them to just anyone. ✨
Esa tiene pinta de quedarse mucho tiempo. 🏠 || That one looks like it's here to stay. 🏠
Bien visto: con un toque la tendrás siempre a mano. 👆 || Well spotted: one tap and it's always at hand. 👆
Favoritas sube. Mi orgullo, también. 🥹 || Favorites go up. So does my pride. 🥹
¡Ojo de pro! Esa app merecía la estrella. 🌟 || Pro eye! That app deserved the star. 🌟
Guardada con lana y todo. 🧶 || Saved, wool and all. 🧶
Una favorita más. Voy a necesitar una estantería. 📚 || One more favorite. I'm going to need a shelf. 📚
Te veo coleccionando con criterio. Me gusta. 😏 || I see you collecting with taste. I like it. 😏
Hecho. Y que conste que yo la elegí primero. 😌 || Done. And for the record, I picked it first. 😌
¡Qué buen gusto! Otra para el podio. 🏆 || What taste! Another one for the podium. 🏆
`));

/* --- eventos con una sola frase → 5 o más --- */
A(T,"late",L(`
Son las {hora}… hasta las ovejas cuentan menos a estas horas. 🌙 || It's {hora}… even sheep count less at this hour. 🌙
Las {hora}. Yo estoy de guardia, ¿y tú? 🕯️ || {hora}. I'm on watch, how about you? 🕯️
¿Seguimos a las {hora}? Valiente. Yo traigo manta. 🛌 || Still going at {hora}? Brave. I'll bring a blanket. 🛌
A las {hora} las mejores apps se encuentran solas. 🌌 || At {hora} the best apps find themselves. 🌌
Madrugada de apps. Nadie lo sabrá. Solo yo. 🤫 || App night shift. Nobody will know. Only me. 🤫
`));
A(T,"wake",L(`
¡Ah! ¿Qué? ¡No dormía! Estaba… pensando con los ojos cerrados. 😳 || Huh? What? I wasn't asleep! I was… thinking with my eyes closed. 😳
Mmm… ¿ya es mañana? 🥱 || Mmm… is it tomorrow already? 🥱
Cinco minutitos más… ¡Mentira! Estoy lista. 🐑 || Five more minutes… Lie! I'm ready. 🐑
Me has despertado de un sueño precioso. Había lana por todas partes. 💤 || You woke me from a lovely dream. There was wool everywhere. 💤
¡Buenas! Me quedé dormida contando apps. 🥱 || Hi! I dozed off counting apps. 🥱
`));
A(T,"back",L(`
¡Volviste! Cuidé la tienda. Casi. 🐑 || You're back! I minded the store. Mostly. 🐑
Ya era hora. Tenía la lista de venganzas al día y nadie a quien enseñársela. 📝 || About time. I had my revenge list up to date and nobody to show it to. 📝
¡Ahí estás! Pensé que te habías ido con otra tienda. 🥺 || There you are! I thought you'd left for another store. 🥺
Bienvenido de nuevo. No toqué nada. Palabra de oveja. 🤞 || Welcome back. I touched nothing. Sheep's honor. 🤞
Qué rápido pasa el tiempo. Son las {hora}. ⏰ || How time flies. It's {hora}. ⏰
`));
A(T,"focus",L(`
¿Buscas algo? Escribe y te ayudo. 🔎 || Looking for something? Type and I'll help. 🔎
Barra lista. Dime qué app te quita el sueño. 🌙 || Search bar ready. Tell me which app keeps you up. 🌙
Uy, ¡a buscar! Sin prisa, que las apps no huyen. 🐑 || Oh, searching! No rush, apps don't run away. 🐑
Escribe cualquier cosa: nombre, etiqueta, antojo… 💭 || Type anything: name, tag, craving… 💭
Te dejo la barra. Yo miro, calladita. 🤐 || The bar is yours. I'll watch quietly. 🤐
`));
A(T,"noRes",L(`
Nada con «{q}». Prueba con otra palabra o menos letras. 🔍 || Nothing for “{q}”. Try another word or fewer letters. 🔍
«{q}» no aparece. A lo mejor aún no está… ¡sugiérela! 💌 || “{q}” doesn't show up. Maybe it's not here yet… suggest it! 💌
Cero resultados. Hasta yo me quedé en blanco. 🫥 || Zero results. Even I drew a blank. 🫥
Con «{q}» no encuentro nada. ¿Mayúsculas fuera de sitio? 🧐 || I find nothing for “{q}”. Misplaced capitals? 🧐
Ni rastro de «{q}». Buscaré en mi libreta. 📒 || No trace of “{q}”. I'll check my notebook. 📒
`));
A(T,"oneRes",L(`
¡Solo una! Es «{a}». Va directa al grano. 🎯 || Just one! It's “{a}”. Straight to the point. 🎯
Una coincidencia: {a}. Poco rebaño, mucha calidad. 🐑 || One match: {a}. Small flock, high quality. 🐑
Solo {a}. A veces menos es más lana. 🧶 || Only {a}. Sometimes less is more wool. 🧶
Encontré justo una: {a}. ¿Será el destino? ✨ || Found exactly one: {a}. Could it be fate? ✨
{a} y nadie más. Qué exclusiva. 😎 || {a} and nobody else. How exclusive. 😎
`));
A(T,"fav1",L(`
¡Tu primera favorita! Esto es el principio de algo grande. 🌟 || Your first favorite! The start of something big. 🌟
Una estrella y ya tienes lista. Cuidado, que esto engancha. ⭐ || One star and you've got a list. Careful, it's addictive. ⭐
Primera favorita guardada. La mía fue una calculadora. 🧮 || First favorite saved. Mine was a calculator. 🧮
¡Inauguramos favoritas! Rompo una botella de leche. 🥛 || Favorites inaugurated! I'm cracking open a bottle of milk. 🥛
La primera siempre se recuerda. Yo la apunto. 📝 || The first one is always remembered. I'm writing it down. 📝
`));
A(T,"fav5",L(`
¡{n} favoritas! Ya no es afición, es colección. 🏅 || {n} favorites! That's no hobby, it's a collection. 🏅
{n} estrellas. Me voy a tener que sentar. 🥹 || {n} stars. I'm going to have to sit down. 🥹
Llegaste a {n} favoritas. Mi lista buena se llena de ti. 📝 || You hit {n} favorites. My good list is filling up with you. 📝
{n} favoritas: oficialmente, rebaño propio. 🐑🐑 || {n} favorites: officially, a flock of your own. 🐑🐑
¡{n}! Esto merece un aplauso de pezuñas. 👏 || {n}! That deserves a round of hoof applause. 👏
`));
A(T,"favDel",L(`
Favorita quitada. No lo tomaré como algo personal. 😌 || Favorite removed. I won't take it personally. 😌
Fuera de la lista. Tendré que reorganizar mi libreta. 📒 || Off the list. I'll have to reorganize my notebook. 📒
Hecho. Los gustos cambian, la lana permanece. 🧶 || Done. Tastes change, wool remains. 🧶
Adiós, estrella. Fue bonito mientras duró. ⭐ || Goodbye, star. It was nice while it lasted. ⭐
Sin favorita. Anotado… con un suspiro. 😮‍💨 || Un-favorited. Noted… with a sigh. 😮‍💨
`));
A(T,"night",L(`
Modo noche: ahora sí se me ve el brillo de la lana. 🌙 || Night mode: now you can see my wool shimmer. 🌙
Luces fuera. Yo hago guardia. 🕯️ || Lights out. I'm on watch. 🕯️
¡Qué bonito el oscuro! Y qué descanso para los ojos. 😌 || Dark looks lovely! And so restful for the eyes. 😌
Noche cerrada. A estas horas las apps se ven mejor. ✨ || Dead of night. Apps look better at this hour. ✨
Buenas noches, tienda. Buenas noches, lana. 🌌 || Good night, store. Good night, wool. 🌌
`));
A(T,"day",L(`
¡Se hizo la luz! Mis ojos protestan, pero qué bonito. ☀️ || Let there be light! My eyes protest, but how pretty. ☀️
Modo día: a pastar apps con sol. 🌻 || Day mode: time to graze apps in the sun. 🌻
¡Claro! Ahora sí se ve cada rizo. 🐑 || Bright! Now every curl shows. 🐑
Amanece en la tienda. ☀️ || Dawn breaks in the store. ☀️
Luz total. Que nadie mire mi lana despeinada. 🙈 || Full light. Nobody look at my messy wool. 🙈
`));
A(T,"musOn",L(`
¡Música! Mis pezuñas ya van solas. 🎶 || Music! My hooves are moving on their own. 🎶
Suena bien. Tienes oído de pro. 🎧 || Sounds good. You've got a pro ear. 🎧
A bailar el vals de la lana. 💃 || Time to waltz with the wool. 💃
Con música todo se instala mejor. 🎵 || Everything installs better with music. 🎵
Subo el volumen del alma. 🔊 || Turning up the volume of the soul. 🔊
`));
A(T,"musOff",L(`
Silencio. Se oye hasta la lana crecer. 🤫 || Silence. You can hear the wool grow. 🤫
Música fuera. Mis pezuñas piden un descanso. 🛑 || Music off. My hooves ask for a rest. 🛑
Vale, se acabó la fiesta. 😌 || Okay, the party's over. 😌
Sin música también estoy a gusto. Más o menos. 🙂 || I'm fine without music too. More or less. 🙂
Calma total. Me gusta. 🌿 || Total calm. I like it. 🌿
`));
A(T,"allDone",L(`
¡Has abierto todas las carpetas! Nadie lo había conseguido tan rápido. Bueno, nadie lo había intentado. 🏆 || You opened every folder! Nobody did it that fast. Well, nobody tried. 🏆
¡Todas las carpetas visitadas! Estoy orgullosa… y un poco celosa. 🥹 || Every folder visited! I'm proud… and a bit jealous. 🥹
Exploración completa. Te nombro guía honorario. 🧭 || Exploration complete. I name you honorary guide. 🧭
No queda carpeta por abrir. ¿Y ahora qué hacemos? 😳 || No folder left to open. Now what do we do? 😳
Todas abiertas. Mi lista de «cosas por mostrarte» está vacía. 📝 || All open. My “things to show you” list is empty. 📝
`));
A(T,"gStart",L(`
¡A saltar vallas! No me mires, me pongo nerviosa. 🐑 || Let's jump hurdles! Don't look at me, I get nervous. 🐑
Concentración, lana, concentración. 🧘 || Focus, wool, focus. 🧘
¡Vamos! Yo animo desde aquí. 📣 || Come on! I'll cheer from here. 📣
Las vallas no se saltan solas… ¿o sí? 🤔 || Hurdles don't jump themselves… or do they? 🤔
Que empiece el espectáculo. 🎪 || Let the show begin. 🎪
`));
A(T,"gStartRec",L(`
Tu récord es {rec}. Superarlo sería un gran detalle. 🏅 || Your record is {rec}. Beating it would be a nice gesture. 🏅
{rec} es tu marca. ¡Yo creo en ti! 💪 || {rec} is your mark. I believe in you! 💪
A por esos {rec}. La lana te acompaña. 🧶 || Go for those {rec}. The wool is with you. 🧶
Récord a batir: {rec}. Presión cero. Bueno, un poco. 😬 || Record to beat: {rec}. Zero pressure. Well, a little. 😬
{rec}… no es poco. Veamos qué haces. 👀 || {rec}… that's not nothing. Let's see what you've got. 👀
`));
A(T,"gRecord",L(`
¡NUEVO RÉCORD! Esto va directo a mi libreta de leyendas. 🏆 || NEW RECORD! This goes straight in my notebook of legends. 🏆
¡Récord! Me emociono, y eso que soy de lana. 🥹 || Record! I'm moved, and I'm made of wool. 🥹
¡Has superado tu marca! Un balido de honor. 🐑🎉 || You beat your mark! A baa of honor. 🐑🎉
¡Increíble! Hasta las vallas aplauden. 👏 || Incredible! Even the hurdles applaud. 👏
Récord batido. Voy a necesitar un pañuelo. 😭 || Record broken. I'm going to need a tissue. 😭
`));
A(T,"gOverRec",L(`
¡Terminaste con {sc} y es récord! Lo tuyo es de pro. 🏆 || You finished with {sc} and it's a record! Pro stuff. 🏆
{sc} puntos y marca nueva. ¡Brava! 🎉 || {sc} points and a new mark. Bravo! 🎉
Nuevo récord: {sc}. Lo apunto con letras doradas. ✨ || New record: {sc}. Writing it in gold letters. ✨
¡{sc}! Eso es subir el listón (y las vallas). 🚀 || {sc}! That's raising the bar (and the hurdles). 🚀
Récord: {sc}. Me quedo sin palabras. Casi. 🥹 || Record: {sc}. I'm speechless. Almost. 🥹
`));
A(T,"gOverFirst",L(`
Primera partida: {sc}. Todo el mundo empieza en algún lado. 🌱 || First game: {sc}. Everybody starts somewhere. 🌱
{sc} en tu debut. No está mal para ser novato. 👏 || {sc} on your debut. Not bad for a rookie. 👏
¡{sc}! Ya tienes una marca que superar. 🎯 || {sc}! Now you've got a mark to beat. 🎯
Debut con {sc}. La próxima será mejor, ya verás. 🐑 || Debut with {sc}. The next one will be better, you'll see. 🐑
{sc} puntos. Mi primera vez fue peor. Creo. 🙈 || {sc} points. My first time was worse. I think. 🙈
`));
A(T,"gOverZero",L(`
Cero. Un cero con mucho carácter. ⭕ || Zero. A zero with plenty of character. ⭕
¡Cero! Nadie te quita la valentía de intentarlo. 💪 || Zero! Nobody takes away your courage to try. 💪
Ni una valla. Pero qué estilo. 😎 || Not a single hurdle. But what style. 😎
Empezamos de cero, que es un buen sitio para crecer. 🌱 || We start from zero, a fine place to grow. 🌱
Cero puntos y yo sigo creyendo en ti. 🥹 || Zero points and I still believe in you. 🥹
`));
A(T,"gOverNear",L(`
¡{sc}! Por muy poco no es récord. 😭 || {sc}! So close to a record. 😭
Casi, casi: {sc}. Otro intento y cae. 💪 || Almost, almost: {sc}. One more try and it falls. 💪
{sc}… a un pelo de tu marca. Se me encoge la lana. 🧶 || {sc}… a hair from your mark. My wool shrinks. 🧶
Qué cerca: {sc}. Yo repetiría. 🔁 || So close: {sc}. I'd go again. 🔁
{sc} puntos. La marca te respira en la nuca. 👀 || {sc} points. The record is breathing down your neck. 👀
`));
A(T,"gOver",L(`
{sc} puntos. La próxima vez, más. O igual. Tú sabrás. 🐑 || {sc} points. Next time, more. Or the same. Your call. 🐑
Terminaste con {sc}. Respiremos y a por otra. 😮‍💨 || You finished with {sc}. Breathe, then another go. 😮‍💨
{sc}. Esa valla no la vi venir tampoco. 🙈 || {sc}. I didn't see that hurdle coming either. 🙈
Partida de {sc}. Anotada para la posteridad. 📝 || A game of {sc}. Logged for posterity. 📝
{sc} puntos. Las vallas ganan esta ronda. 🏁 || {sc} points. The hurdles win this round. 🏁
Fin: {sc}. Ni tan mal, ni tan bien: tan oveja. 🐑 || End: {sc}. Not that bad, not that good: very sheep. 🐑
`));
A(T,"facts",L(`
Las ovejas podemos reconocer rostros durante años. Yo recuerdo hasta quién me lanzó. 😌 || Sheep can recognize faces for years. I even remember who threw me. 😌
Toda la lana de esta tienda es código abierto. 🧶 || All the wool in this store is open source. 🧶
Mi lista de apps aprobadas tiene más entradas que mi lista de venganzas. Por poco. 📝 || My approved apps list has more entries than my revenge list. Barely. 📝
Dato real: dormir con una app instalada no la actualiza. Actualiza tú. 🔄 || Real fact: sleeping with an app installed doesn't update it. You do it. 🔄
`));
A(T,"prog",L(`
Vas avanzando de maravilla. 📈 || You're progressing wonderfully. 📈
Cada paso cuenta. Y yo los cuento todos. 👣 || Every step counts. And I count them all. 👣
Qué progreso. Mi lista buena crece. 📝 || Such progress. My good list grows. 📝
Poco a poco, que la lana se teje despacio. 🧶 || Little by little, wool is woven slowly. 🧶
`));

/* --- saludos --- */
A(GREET,"night",L(`
¿Todavía por aquí a las {hora}? Yo hago guardia contigo. 🌙 || Still here at {hora}? I'll keep watch with you. 🌙
Buenas noches. La tienda está tranquila… sospechosamente tranquila. 🕯️ || Good evening. The store is quiet… suspiciously quiet. 🕯️
¡Madrugador nocturno! Bienvenido. 🦉 || Night owl! Welcome. 🦉
A estas horas las apps se instalan con más misterio. 🌌 || At this hour apps install with more mystery. 🌌
Bienvenido, trasnochador. Yo ya tenía la lana en rulos. 💤 || Welcome, night owl. My wool was already in curlers. 💤
`));
A(GREET,"morning",L(`
Buenos días. Son las {hora}: justo para estrenar apps. ☀️ || Good morning. It's {hora}: just right to try new apps. ☀️
¡Arriba! La lana ya está peinada. 🐑 || Rise and shine! My wool is already combed. 🐑
Buen día. ¿Café, tostada o una app nueva? ☕ || Good day. Coffee, toast or a new app? ☕
¡Qué bien que vengas temprano! Hoy me siento productiva. 📝 || Glad you came early! I feel productive today. 📝
Mañana fresca y tienda abierta. ¡Vamos! 🌄 || Fresh morning and store open. Let's go! 🌄
`));
A(GREET,"afternoon",L(`
Buenas tardes. ¿Qué buscamos a las {hora}? 🐑 || Good afternoon. What are we after at {hora}? 🐑
Tarde perfecta para explorar carpetas. 🗂️ || Perfect afternoon to explore folders. 🗂️
¡Hola! La tarde pide una app nueva. 🌤️ || Hello! The afternoon calls for a new app. 🌤️
Justo a tiempo: acabo de ordenar mi libreta. 📒 || Just in time: I just tidied my notebook. 📒
Bienvenido de nuevo a la tienda de la lana. 🧶 || Welcome back to the wool store. 🧶
`));
A(GREET,"evening",L(`
Buenas noches. Qué gusto verte por aquí. 🌙 || Good evening. So nice to see you here. 🌙
Anochece y la tienda sigue abierta. 🌆 || Dusk falls and the store is still open. 🌆
Hola. Son las {hora}, hora ideal para curiosear. 🕯️ || Hello. It's {hora}, perfect time to browse. 🕯️
¡Bienvenido! Te guardé el mejor rincón. 🛋️ || Welcome! I saved you the best corner. 🛋️
Noche de apps. Me encanta. 🌠 || App night. I love it. 🌠
`));
A(GREET,"away",L(`
¡Han pasado {d} días! Pensé que me habías sustituido por otra oveja. 😤 || It's been {d} days! I thought you'd replaced me with another sheep. 😤
{d} días sin verte. Mi lista de «cosas que contarte» creció mucho. 📝 || {d} days without you. My “things to tell you” list grew a lot. 📝
¡Por fin! {d} días de silencio y yo, ahí, pastando sola. 🥺 || Finally! {d} days of silence and me, grazing alone. 🥺
Volviste tras {d} días. Te perdono. Esta vez. 😌 || You came back after {d} days. I forgive you. This time. 😌
{d} días… ¡cómo pasa el tiempo! Pero aquí sigo. 🐑 || {d} days… how time flies! But I'm still here. 🐑
`));
A(GREET,"news1",L(`
Hay una app nueva esperándote en «Novedades». 🆕 || There's a new app waiting for you in “New”. 🆕
Ojo: una novedad recién horneada. 🥐 || Heads up: one freshly baked newcomer. 🥐
Una app nueva. Yo ya la miré. Mmm… ve tú. 👀 || One new app. I already looked at it. Hmm… go see. 👀
Tienes 1 novedad. Qué ilusión. 🎁 || You've got 1 new app. How exciting. 🎁
Algo nuevo en la tienda. ¡Corre! 🏃 || Something new in the store. Run! 🏃
`));
A(GREET,"newsN",L(`
Hay {n} apps nuevas esperándote. ¡Qué semana! 🆕 || {n} new apps are waiting for you. What a week! 🆕
{n} novedades recién horneadas en «Novedades». 🥐 || {n} freshly baked newcomers in “New”. 🥐
Ojo: {n} apps nuevas. Mi libreta no da abasto. 📒 || Heads up: {n} new apps. My notebook can't keep up. 📒
{n} novedades. Yo empezaría por la primera. 👆 || {n} new apps. I'd start with the first. 👆
Llegaron {n} apps nuevas. ¡Fiesta de lana! 🎉 || {n} new apps arrived. Wool party! 🎉
`));

/* --- fondos (3 por fondo; son raros) --- */
const BG=(k,s)=>A(T.bg,k,L(s));
BG("",`
Fondo clásico. Elegante como yo. 😌 || Classic backdrop. Elegant like me. 😌
Sin decorar: el minimalismo me favorece. ✨ || Undecorated: minimalism suits me. ✨
Vuelvo al fondo de siempre. Sin sorpresas. 🙂 || Back to the usual backdrop. No surprises. 🙂
`);
BG("valle",`
El valle… mi hogar espiritual. 🌄 || The valley… my spiritual home. 🌄
Verde por todas partes. Ya me veo pastando. 🌿 || Green everywhere. I can picture myself grazing. 🌿
Qué paz de valle. Casi no se oye el Plan. 🕊️ || Such valley peace. You can barely hear the Plan. 🕊️
`);
BG("primavera",`
¡Primavera! Se me rizan hasta las ideas. 🌸 || Spring! Even my ideas are curling. 🌸
Flores y lana: combinan de maravilla. 🌼 || Flowers and wool: a perfect match. 🌼
Huele a hierba nueva. Mmm. 🌱 || Smells like fresh grass. Mmm. 🌱
`);
BG("verano",`
¡Verano! Alguien que me esquile, por favor. ☀️ || Summer! Somebody shear me, please. ☀️
Sol, playa y apps. Mi plan perfecto. 🏖️ || Sun, beach and apps. My perfect plan. 🏖️
Qué calor. Yo me quedo a la sombra de una carpeta. 🧴 || So hot. I'm staying in the shade of a folder. 🧴
`);
BG("otono",`
Otoño: hojas, mantas y lana de temporada. 🍂 || Autumn: leaves, blankets and seasonal wool. 🍂
Crujen las hojas. Me encanta pisarlas con pezuña. 🍁 || Leaves crunch. I love stomping them with a hoof. 🍁
Tiempo de suéteres. Yo ya llevo uno puesto. 🧶 || Sweater season. I'm already wearing one. 🧶
`);
BG("invierno",`
¡Invierno! Por fin mi lana sirve de algo. ❄️ || Winter! At last my wool is useful. ❄️
Qué frío. Pásame una manta de la tienda. 🧣 || So cold. Pass me a store blanket. 🧣
Nieve. Mis pezuñas dejan huellas muy elegantes. 🐾 || Snow. My hooves leave very elegant prints. 🐾
`);
BG("halloween",`
¡Halloween! Me disfrazaré de oveja. Ah, ya lo soy. 🎃 || Halloween! I'll dress up as a sheep. Oh, I already am. 🎃
Uuuh… ¿quién apagó la luz? 👻 || Ooooh… who turned off the light? 👻
Truco o trato: dame una app y no te lanzo. 🍬 || Trick or treat: give me an app and I won't throw you. 🍬
`);
BG("navidad",`
¡Felices fiestas! Me pongo la bufanda buena. 🎄 || Happy holidays! I'm wearing the good scarf. 🎄
Navidad: época de regalar apps (y lana). 🎁 || Christmas: the season of gifting apps (and wool). 🎁
Hasta mi lista de venganzas hace una pausa navideña. 🕊️ || Even my revenge list takes a Christmas break. 🕊️
`);
BG("auto",`
Fondo automático: el día decide por mí. 🌦️ || Automatic backdrop: the day decides for me. 🌦️
Dejo que el calendario elija. Muy sensato. 📅 || I'll let the calendar choose. Very sensible. 📅
Modo auto: me adapto a todo. Menos a que me lancen. 😒 || Auto mode: I adapt to everything. Except being thrown. 😒
`);

/* --- microreacciones: 15 por evento frecuente --- */
A(MIC,"grab",L(`
¡Eh, eh, eh! || Hey, hey, hey!
🫨 || 🫨
¡Suéltame! || Let go!
Qué descaro. || The nerve.
¡Mi dignidad! || My dignity!
`));
A(MIC,"soft",L(`
¡Sin un rizo! || Not a curl!
Bien. || Fine.
🙂 || 🙂
Gracias. || Thanks.
Digna. || Dignified.
¡Pies al suelo! || Feet down!
😮‍💨 || 😮‍💨
`));
A(MIC,"hard",L(`
¡Mi lana! || My wool!
¡Ay, ay! || Ow, ow!
Lo apunto. || Writing it down.
🤕 || 🤕
Qué golpe. || What a thud.
¡Ufff! || Oof!
Testigos. || Witnesses.
🙃 || 🙃
`));
A(MIC,"close",L(`
¡Hasta luego! || See you!
¡Pum! || Bam!
Cerrado. || Closed.
🫡 || 🫡
Una menos. || One less.
Ordenadito. || Neat and tidy.
✌️ || ✌️
¡Fuera! || Out!
`));

/* --- frases por franja horaria (se mezclan con los datos curiosos) --- */
T.tod={};
A(T.tod,"morning",L(`
Buenos días de nuevo: son las {hora}. ¿Qué app va a estrenar tu mañana? ☀️ || Good morning again: it's {hora}. Which app will kick off your morning? ☀️
A estas horas la lana está más suave. Y yo, de mejor humor. 🐑 || At this hour my wool is softer. And I'm in a better mood. 🐑
Primer café, primera app. Ese es el orden correcto. ☕ || First coffee, first app. That's the right order. ☕
Mañana de apps. Llevo ya {hora} despierta, no me juzgues. 🥱 || App morning. I've been up since {hora}, don't judge. 🥱
La mañana es buena para ordenar favoritas. ⭐ || Morning is great for tidying favorites. ⭐
Hoy la lista de venganzas empieza vacía. Aprovecha. 📝 || Today my revenge list starts empty. Take advantage. 📝
`));
A(T.tod,"afternoon",L(`
Son las {hora}. La digestión de apps es lenta; no te agobies. 🐑 || It's {hora}. App digestion is slow; don't stress. 🐑
Tarde ideal para probar algo de «{carpeta}». 🗂️ || Ideal afternoon to try something from “{carpeta}”. 🗂️
A esta hora solía echarme una siesta. Hoy trabajo. 💼 || I used to nap at this hour. Today I work. 💼
Mitad del día: ¿has mirado «Novedades»? 🆕 || Midday: have you checked “New”? 🆕
Tarde de apps y lana. No pido más. 🧶 || Afternoon of apps and wool. I ask for nothing more. 🧶
Las {hora}: justo la hora de una buena recomendación. 💡 || {hora}: just the time for a good recommendation. 💡
`));
A(T.tod,"evening",L(`
Atardece. Buen momento para repasar tus favoritas. ⭐ || Dusk. A good moment to review your favorites. ⭐
Son las {hora}. La tienda baja la voz. 🌆 || It's {hora}. The store lowers its voice. 🌆
Noche cerca: ¿pasamos al modo oscuro? 🌙 || Night is near: shall we go dark mode? 🌙
A las {hora} ya no me lanzan tanto. Qué paz. 😌 || At {hora} I don't get thrown as much. Such peace. 😌
Tarde-noche: ideal para instalar con calma. 🛋️ || Early evening: ideal for calm installing. 🛋️
Hoy llevas buen ritmo de apps. Orgullosa. 🥹 || You're keeping a good app pace today. Proud. 🥹
`));
A(T.tod,"night",L(`
Las {hora}. Mañana también habrá apps, ¿sabes? 💤 || {hora}. There'll be apps tomorrow too, you know. 💤
A estas horas hasta las vallas duermen. 🛌 || At this hour even the hurdles sleep. 🛌
Silencio, noche y lana. Mi trío favorito. 🌙 || Silence, night and wool. My favorite trio. 🌙
{hora}… tu futuro tú te lo agradecerá si descansas. 😴 || {hora}… future you will thank you if you rest. 😴
La noche es de las ovejas. Dicen. 🐑 || The night belongs to the sheep. So they say. 🐑
Hora de conspirar… digo, de descansar. 🤫 || Time to scheme… I mean, to rest. 🤫
`));

/* --- frases con variables de contexto: una app y su carpeta reales --- */
T.appTips=L(`
¿Has probado «{app}»? Vive en «{carpeta}». 🐑 || Have you tried “{app}”? It lives in “{carpeta}”. 🐑
Mira en «{carpeta}»: ahí está «{app}», y tiene buena pinta. 👀 || Look in “{carpeta}”: “{app}” is there, and it looks good. 👀
Mi apuesta de las {hora}: «{app}». 🎯 || My {hora} pick: “{app}”. 🎯
«{app}» está en «{carpeta}». Lo digo por si lo buscabas. 🔎 || “{app}” is in “{carpeta}”. Just in case you were looking. 🔎
Apunto en mi lista buena: «{app}». Léela con calma. 📝 || Adding to my good list: “{app}”. Read it calmly. 📝
Si hoy no sabes qué instalar, «{app}» nunca falla. 🧶 || If you don't know what to install today, “{app}” never fails. 🧶
Un paseo por «{carpeta}» no hace daño. Empieza por «{app}». 🚶 || A stroll through “{carpeta}” never hurts. Start with “{app}”. 🚶
`);

/* ===================================  KIXKI 3: travesuras y físicas (TX)  =================================== */
A(TX,"grab",L(`
¿Me estás agarrando? Qué confianza. 😳 || Are you grabbing me? What familiarity. 😳
¡Eh! Que soy una oveja, no un bolso. 👜 || Hey! I'm a sheep, not a handbag. 👜
Pezuñas arriba… ¿adónde me llevas? 😨 || Hooves up… where are you taking me? 😨
Si me sueltas con cuidado, te lo apunto como buena acción. 📝 || If you put me down gently, I'll log it as a good deed. 📝
Esto no estaba en el contrato. Mi abogado dirá algo. ⚖️ || This wasn't in the contract. My lawyer will have something to say. ⚖️
Beee, beee, beee. Traducción: suéltame con elegancia. 🐑 || Baa, baa, baa. Translation: put me down with elegance. 🐑
Qué manos tan decididas. Qué poca consulta previa. 😒 || Such decisive hands. Such little prior consultation. 😒
Primera norma de la tienda: a las ovejas se las pide permiso. 📜 || First rule of the store: you ask sheep for permission. 📜
Respira, Kixki. Respira. Es solo un usuario. Un usuario con manos. 🧘 || Breathe, Kixki. Breathe. It's just a user. A user with hands. 🧘
Estoy en el aire. No lo he elegido. Que quede en acta. 🗒️ || I'm airborne. I didn't choose this. Let it be minuted. 🗒️
`));
A(TX,"soft",L(`
Aterrizaje impecable. Dame un diez, por favor. 🔟 || Flawless landing. Give me a ten, please. 🔟
Y la oveja aterriza con estilo. 😎 || And the sheep lands in style. 😎
Pezuñas al suelo. Dignidad intacta. 🐑 || Hooves on the ground. Dignity intact. 🐑
Eso sí ha sido un aterrizaje profesional. 🛬 || Now that was a professional landing. 🛬
Ni se ha movido un rizo. Lo habéis visto, ¿verdad? 🌀 || Not a curl moved. You saw that, right? 🌀
Suave como el algodón. Bueno, como la lana. ☁️ || Smooth as cotton. Well, wool. ☁️
Todo bajo control. Siempre lo estuvo. 😌 || All under control. It always was. 😌
Tocata y fuga: ya estoy en tierra. 🎻 || Touch and go: I'm on the ground. 🎻
Aplausos, por favor. No tan fuertes. 👏 || Applause, please. Not too loud. 👏
Aterrizo y sigo con lo mío. 💅 || I land and carry on with my business. 💅
Gravedad: 0, Kixki: 1. 🏆 || Gravity: 0, Kixki: 1. 🏆
Mi equilibrio es mi mejor virtud. Y la lana. 🧶 || Balance is my best virtue. And the wool. 🧶
`));
A(TX,"hard",L(`
¡PLAF! Eso ha dolido hasta en la nube. ☁️ || SPLAT! That hurt even up in the cloud. ☁️
Mi lana amortigua, pero no hace milagros. 🧶 || My wool cushions, but it's no miracle worker. 🧶
Anotado: esto cuenta como agresión textil. 📝 || Noted: this counts as textile assault. 📝
Estoy bien. Estoy bien. Que alguien me confirme que estoy bien. 😵 || I'm fine. I'm fine. Somebody confirm I'm fine. 😵
Los huesos de oveja son más finos de lo que dicen. 🦴 || Sheep bones are finer than they say. 🦴
Una caída así merece un informe pericial. 🧾 || A fall like that deserves an expert report. 🧾
Me ha temblado hasta el balido. 🥴 || Even my baa trembled. 🥴
Si esto lo hubiera hecho alguien con reputación, ya habría demanda. ⚖️ || If someone with a reputation did this, there'd already be a lawsuit. ⚖️
Cuenta como accidente laboral. Mi abogado, por favor. 🩹 || Count that as a workplace accident. My lawyer, please. 🩹
Todo ha ido bien. Nadie ha oído mi crujido. 🙈 || All went well. Nobody heard my crunch. 🙈
Aterrizaje de emergencia… pero con dignidad. 🚨 || Emergency landing… but with dignity. 🚨
¡Auch, auch, auch! Eso me va a dar vueltas en la lista. 📝 || Ouch, ouch, ouch! That's going on the list for a while. 📝
`));
A(TX,"dragged",L(`
¡¡Eh!! ¡Estaba ahí sentada! Una oveja necesita su espacio. 😤 || Hey!! I was sitting there! A sheep needs her space. 😤
Mover ventanas con una oveja encima es de mala educación. 📏 || Moving windows with a sheep on top is just rude. 📏
¡Cuidado! Llevo lana de calidad. 🧶 || Careful! I'm carrying quality wool. 🧶
Podías haber avisado. Un balidito, un «permiso»… 🙄 || You could've warned me. A little baa, a “pardon me”… 🙄
Esto va directo a mi libreta de agravios. 📒 || This goes straight in my grievance notebook. 📒
¡Terremoto! ¡Terremoto en la ventana! 🌋 || Earthquake! Earthquake in the window! 🌋
Soy una oveja pacífica. Hasta cierto punto. 🕊️ || I'm a peaceful sheep. Up to a point. 🕊️
Muy bien, muy bien. Lo recordaré. 😌 || Very well, very well. I will remember this. 😌
¿Sabes lo que cuesta mantener el equilibrio con pezuñas? 🦶 || Do you know how hard it is to keep balance on hooves? 🦶
Hubo una ventana y hubo una oveja. Ya no. 🪟 || There was a window and there was a sheep. Not anymore. 🪟
Arrastra lo que quieras. Pero no conmigo dentro. 🚫 || Drag whatever you like. Just not with me on it. 🚫
`));
A(TX,"closedOn",L(`
¡Eh! ¡Había alguien en esta ventana! 🙋‍♀️ || Hey! Someone was in that window! 🙋‍♀️
Cerrar con alguien encima: de manual de mala educación. 📕 || Closing with someone on top: straight from the bad-manners handbook. 📕
¡Adiós, suelo! ¡Hola, vacío! 🕳️ || Bye, floor! Hello, void! 🕳️
Primero me quitan la ventana, luego la dignidad. 😮‍💨 || First they take my window, then my dignity. 😮‍💨
Apuntado: ventana cerrada, oveja caída. 📝 || Noted: window closed, sheep fallen. 📝
Tranquilo, solo estaba mirando. 🙃 || Don't worry, I was only looking. 🙃
`));
A(TX,"closedSelf",L(`
Cierro mi propia ventana. Autoridad máxima. 😎 || Closing my own window. Maximum authority. 😎
Yo la cerré, yo me caigo, yo me río. 🤣 || I closed it, I fall, I laugh. 🤣
Era mi ventana, mi decisión, mi consecuencia. 📜 || My window, my decision, my consequence. 📜
Que no se diga que no sé hacer entradas… ni salidas. 🚪 || Let it not be said I can't make entrances… or exits. 🚪
Plan A: cerrar. Plan B: caer con estilo. 🧪 || Plan A: close. Plan B: fall in style. 🧪
`));
A(TX,"dropMany",L(`
Van {n} caídas. Mi abogado ya tiene carpeta propia. ⚖️ || {n} falls so far. My lawyer has a folder of his own. ⚖️
{n} veces. Y nadie me trae un cojín. 🛋️ || {n} times. And nobody brings me a cushion. 🛋️
Caída número {n}. La lista de venganzas pide ampliar página. 📒 || Fall number {n}. The revenge list asks for a bigger page. 📒
¿{n}? Esto empieza a ser un hábito vuestro. 😒 || {n}? This is becoming a habit of yours. 😒
Contador de caídas: {n}. Y yo, tan serena. 🧘 || Fall counter: {n}. And me, so serene. 🧘
`));
A(TX,"many",L(`
{n} veces agarrada. ¿Me adoptas o qué? 🐑 || Picked up {n} times. Are you adopting me or what? 🐑
¿Otra vez? Van {n}. Tengo una lista y tú la encabezas. 📝 || Again? That's {n}. I have a list and you top it. 📝
Agarrón número {n}. Me he acostumbrado. Qué horror. 😳 || Grab number {n}. I've gotten used to it. How awful. 😳
{n} agarrones: mi lana ya tiene tu forma. 🧶 || {n} grabs: my wool is already shaped like you. 🧶
Con {n} agarrones empiezo a cobrar. 💰 || At {n} grabs I'm starting to charge. 💰
`));
A(TX,"longHold",L(`
Llevo mucho aquí arriba. ¿Piensas soltarme o me planto? ⏳ || I've been up here a long while. Planning to let go or shall I settle in? ⏳
Diez segundos en el aire. Récord personal. Y de paciencia. 🏅 || Ten seconds airborne. Personal record. And patience. 🏅
Tengo el brazo… el pezuña dormido. 😴 || My arm… my hoof has gone numb. 😴
Si me sigues sosteniendo, tendré que cobrar entrada. 🎟️ || If you keep holding me I'll have to charge admission. 🎟️
`));
A(TX,"shake",L(`
¡Basta, basta! ¡Me estoy desordenando la lana! 🌀 || Enough, enough! You're messing up my wool! 🌀
No soy un bote de pintura. 🎨 || I'm not a paint can. 🎨
¡Que me marea! ¡Que me marea! 😵‍💫 || I'm getting dizzy! I'm getting dizzy! 😵‍💫
Esto es una agitación de oveja sin consentimiento. 🧪 || This is an unconsented sheep-shaking. 🧪
Sacudir ovejas es de muy mal gusto. 🙅‍♀️ || Shaking sheep is in very poor taste. 🙅‍♀️
`));
A(TX,"onSearch",L(`
Ah, la barra de búsqueda. Un buen sitio para vigilar. 🔎 || Ah, the search bar. A fine spot for keeping watch. 🔎
Aquí arriba se ve todo lo que buscas. Cotilleo disimulado. 👀 || From up here I see everything you search. Discreet gossip. 👀
Aterrizo en la barra. Si escribes, no miro. Mucho. 🤭 || Landing on the bar. If you type, I won't look. Much. 🤭
Barra de búsqueda: mi balcón favorito. 🏰 || Search bar: my favorite balcony. 🏰
`));
A(TX,"onWin",L(`
Ventana aterrizada. Ahora, a ver qué hay dentro. 🪟 || Window landed. Now, let's see what's inside. 🪟
Cuidado, que aquí hay muchas apps. Y una oveja. 🐑 || Careful, lots of apps here. And one sheep. 🐑
Me coloco en la ventana. No te preocupes, no pesaré. 🪶 || I'll perch on the window. Don't worry, I won't weigh much. 🪶
Mejor que el suelo. Más cerca de las apps. 🗂️ || Better than the floor. Closer to the apps. 🗂️
`));
A(TX,"onFloor",L(`
El suelo. Frío, duro y digno de una queja. 🧊 || The floor. Cold, hard and worthy of a complaint. 🧊
He caído abajo del todo. ¿Subes tú o subo yo? 🪜 || I've fallen all the way down. Do you come up or do I? 🪜
Desde aquí abajo la tienda parece enorme. 🌍 || From down here the store looks enormous. 🌍
Pezuñas en el suelo, mente en las alturas. ☁️ || Hooves on the floor, mind in the clouds. ☁️
`));
A(TX,"madTap",L(`
¡Estoy enfadada! No me toques. 😠 || I'm angry! Don't touch me. 😠
Ahora no. Estoy contando hasta cien. Beee… uno… 🔢 || Not now. I'm counting to a hundred. Baa… one… 🔢
Ni se te ocurra. Lo digo con lana, no con ira. 🙂 || Don't even think of it. I say it with wool, not rage. 🙂
`));
A(TX,"calm",L(`
Vale, ya se me pasó. Pero lo tengo anotado. 📝 || Okay, it passed. But I've written it down. 📝
Respiro… Mi lana vuelve a ser blanca. 🕊️ || Breathing… My wool is white again. 🕊️
Ya estoy mejor. No me hables de lo ocurrido. 🙈 || I'm better now. Don't speak of what happened. 🙈
Paz interior recuperada. Mi lista, no. 🧘 || Inner peace recovered. My list, not so much. 🧘
`));
A(TX,"idle",L(`
¿Sigues ahí? Tengo un chiste sobre lana. Es tan malo que se enreda. 🧶 || Still there? I've got a wool joke. It's so bad it tangles. 🧶
Esto está muy tranquilo… sospechosamente tranquilo. 🕵️ || It's so quiet… suspiciously quiet. 🕵️
Me aburro. ¿Y si me lanzas un ratito? Es broma. Creo. 😅 || I'm bored. What if you throw me for a bit? Joke. I think. 😅
Voy a repasar mi lista de venganzas. No te preocupes, no sales… mucho. 📝 || I'll go over my revenge list. Don't worry, you're not on it… much. 📝
`));
A(TX,"bgPre",L(`
Mmm, este fondo me aburre. Un momentito… 🎨 || Mmm, this backdrop bores me. One moment… 🎨
Voy a cambiar el decorado. Sin preguntar. 😈 || I'm changing the scenery. Without asking. 😈
¿Y si pruebo algo diferente? Por mi cuenta. 🪄 || What if I try something different? On my own. 🪄
`));
A(TX,"bgPost",L(`
¿Mucho mejor, verdad? No me des las gracias. 😌 || Much better, right? Don't thank me. 😌
Arte puro. Dime que te gusta. 🖼️ || Pure art. Tell me you like it. 🖼️
Un cambio de aires nunca viene mal. 🌬️ || A change of scenery never hurts. 🌬️
`));
A(TX,"closePreOwn",L(`
Voy a cerrar esta ventana. Con mis pezuñas. 🚪 || I'm going to close this window. With my hooves. 🚪
Atención, maniobra arriesgada: cierro la ventana donde estoy. ⚠️ || Attention, risky maneuver: closing the window I'm on. ⚠️
Cierro y caigo. Es mi forma de hacer una salida. 🎭 || Close and fall. It's how I make an exit. 🎭
`));
A(TX,"closePre",L(`
Esa ventana lleva mucho abierta. Me ocupo yo. 🧹 || That window's been open a long time. I'll handle it. 🧹
Perdona, voy a ordenar un poco. 🧼 || Excuse me, I'm going to tidy up a bit. 🧼
Ventanas abiertas… ¡yo las cierro! 💪 || Open windows… I'll close them! 💪
`));
A(TX,"closePost",L(`
Ordenadito. Ni se nota que alguien lo hizo. 😇 || Neat and tidy. You can't even tell someone did it. 😇
Cerrada. De nada. 🫡 || Closed. You're welcome. 🫡
Una menos en la lista de tareas. 📝 || One less on the to-do list. 📝
`));
A(TX,"prOn",L(`
Travesuras activadas. Que no cunda el pánico. 😇 || Pranks on. Don't panic. 😇
¡Vuelvo a ser yo misma! Cuidado con mis bromas. 😏 || I'm myself again! Beware my jokes. 😏
Plan Lana en marcha. 🧶 || Operation Wool is rolling. 🧶
Modo pícara: encendido. 🔥 || Mischief mode: on. 🔥
`));
A(TX,"prOff",L(`
Travesuras desactivadas. Qué aburrimiento. 😮‍💨 || Pranks off. How boring. 😮‍💨
Está bien, me portaré. Hasta que cambies de idea. 🤞 || Fine, I'll behave. Until you change your mind. 🤞
Modo formal. Sigo apuntando todo. 📝 || Formal mode. I'm still writing everything down. 📝
Me voy a portar bien. Que conste. 🙏 || I'll behave. For the record. 🙏
`));

/* --- lanzada: 15 de base (en el aire / al aterrizar) --- */
A(TX,"flying",L(`
Si esto es un deporte, exijo una medalla. 🥇 || If this is a sport, I demand a medal. 🥇
¡Vuelo directo a la lista de venganzas! 📝 || Direct flight to the revenge list! 📝
Se solicita casco para ovejas. Gracias. 🪖 || Sheep helmet requested. Thank you. 🪖
Beeeeeee… (traducción: tomo nota de cada metro). 📏 || Baaaaa… (translation: noting every meter). 📏
¡Que alguien avise a mi abogado! ⚖️ || Somebody call my lawyer! ⚖️
Nunca me preguntaron si quería volar. 🛫 || Nobody ever asked if I wanted to fly. 🛫
¡Aterrizaré, lo prometo! ¡Lo que no prometo es perdonar! 😤 || I will land, I promise! What I don't promise is forgiving! 😤
`));
A(TX,"thrown",L(`
Calificación del aterrizaje: dignidad 3, estilo 5, culpable: tú. ⚖️ || Landing score: dignity 3, style 5, guilty party: you. ⚖️
Aterrizaje de oveja. Mejor que el de algunos pájaros, sin duda. 🐦 || Sheep landing. Better than some birds', no doubt. 🐦
A nadie le han preguntado si podían lanzar ovejas, y aun así. 🙄 || Nobody asked whether sheep may be thrown, and yet. 🙄
Gravedad: 1, oveja: 0. Voy a pedir revancha. 🥊 || Gravity: 1, sheep: 0. I'm requesting a rematch. 🥊
Ya sé quién ha sido. Lo apunto con rotulador permanente. 🖊️ || I know who did it. Writing it in permanent marker. 🖊️
Me ha encantado el vuelo. Que no te llegue a los oídos. 🤫 || I loved the flight. Don't let that reach your ears. 🤫
Te recuerdo que existe el botón de «dejar en el suelo con cariño». 🫳 || A reminder that there's a “put down gently” option. 🫳
`));

/* --- ánimo: más pícara (nivel 1) y vengativa (nivel 2) cuanto más la lanzas --- */
TX.flyingP=L(`
¡Otra vez! Ya empiezo a cogerle gusto… no se lo digas a nadie. 🤭 || Again! I'm starting to enjoy it… don't tell anyone. 🤭
Qué previsible eres. Y qué buen brazo tienes. 😏 || You're so predictable. And you've got a good arm. 😏
¡Más alto la próxima! Que el público espera. 🎪 || Higher next time! The crowd expects it. 🎪
Vuelo número… he perdido la cuenta, y eso que cuento todo. 🔢 || Flight number… I lost count, and I count everything. 🔢
Esta oveja ya tiene pasaporte de tanto viajar. 🛂 || This sheep has a passport by now. 🛂
`);
TX.flyingV=L(`
Vuela, vuela. Cada metro cuenta para tu cuenta. 🧾 || Fly, fly. Every meter counts toward your tab. 🧾
Mi abogado me ha dicho que sonría mientras vuelo. 😁 || My lawyer told me to smile while I fly. 😁
Qué bien se ven las cosas desde aquí. Sobre todo tu nombre en mi lista. 📝 || Nice view from up here. Especially your name on my list. 📝
Esto no es un vuelo, es una inversión en mi futuro. 📈 || This isn't a flight, it's an investment in my future. 📈
Cuando vuelva de aquí arriba, hablaremos. Largo y tendido. 🕯️ || When I'm back from up here, we'll talk. Long and thoroughly. 🕯️
`);
TX.thrownP=L(`
¿Otra vez? Me estás cogiendo cariño. O manía. 😏 || Again? You're growing fond of me. Or obsessed. 😏
Vuelas conmigo con más soltura cada día. Ni yo me lo creo. 🐑 || You throw me with more ease every day. I can't believe it. 🐑
Me lanzas, me caigo, me levanto. Estoy en forma. 💪 || You throw me, I fall, I get up. I'm in shape. 💪
Un día de estos cobro por vuelo. 🎟️ || One of these days I'll charge per flight. 🎟️
Aterrizo, me sacudo la lana y te sonrío. Qué miedo da, ¿eh? 🙂 || I land, shake out my wool and smile at you. Scary, right? 🙂
`);
TX.thrownV=L(`
Aterrizaje registrado. Fila {n} de mi lista… es broma, hace tiempo que no cabe. 📒 || Landing logged. Row {n} of my list… kidding, it stopped fitting long ago. 📒
Ya no me enfado. Ahora planifico. 🗓️ || I no longer get angry. Now I plan. 🗓️
Cada aterrizaje es un capítulo del Plan. 📖 || Every landing is a chapter of the Plan. 📖
Sigue lanzando. Mi lista tiene sitio… y tu nombre, subrayado. 🖍️ || Keep throwing. My list has room… and your name, underlined. 🖍️
Mi abogado dice que ya basta de papeleo. Yo digo: lo que haga falta. ⚖️ || My lawyer says enough paperwork. I say: whatever it takes. ⚖️
`);
TX.draggedP=L(`
Otra ventana, otra caída. Qué ritmo llevamos. 😏 || Another window, another fall. What a pace. 😏
Te lo repito: avisa. Pero si es para reír, avisa menos. 🤭 || I'll repeat: warn me. But if it's for laughs, warn me less. 🤭
Esta oveja ya va con paracaídas bajo la lana. 🪂 || This sheep now carries a parachute under the wool. 🪂
`);
TX.draggedV=L(`
Mover ventanas conmigo encima: delito sin reincidencia… todavía. 🚨 || Moving windows with me on them: first offense… so far. 🚨
Ya van muchas. Las cuento. Con interés. 📈 || That's many. I count them. With interest. 📈
No grito. Anoto. Que es peor. 🖊️ || I don't shout. I note. Which is worse. 🖊️
`);
TX.closedOnP=L(`
¿Cerrar con alguien encima? Qué elegante. 😏 || Closing with someone on top? How elegant. 😏
Otra ventana menos. A este paso me quedo sin pisos. 🏢 || One more window gone. At this rate I'll run out of floors. 🏢
Muy gracioso. Ya hablaremos en mi despacho. 🕴️ || Very funny. We'll talk in my office. 🕴️
`);
TX.closedOnV=L(`
La ventana se cierra, la lista se abre. 📖 || The window closes, the list opens. 📖
No hay problema. Solo otro punto en tu expediente. 🗃️ || No problem. Just another point on your record. 🗃️
Qué amable. Tomo nota con letra bonita. ✒️ || How kind. I'll note it in nice handwriting. ✒️
`);

/* ===================================  ETAPA 4: soltarla con cuidado  ===================================
   Cuando la dejas en algún sitio SIN lanzarla (caída corta o media) Kixki siempre reacciona:
   - TX.placed: la dejaste casi pegada al sitio (≤ 140 px) · TX.soft: cayó un poco (se amplía aquí) · TX.placedP/V: más pícara / vengativa
   - MIC.placed: microreacciones (emoji o 2-3 palabras) · TX.onTiles / TX.onDock: sitios del móvil (filas de carpetas y barra de abajo) */
A(TX,"placed",L(`
Cinco estrellas por el viaje, cuatro por el susto. Y propina en heno, por favor. ⭐ || Five stars for the trip, four for the scare. And a tip in hay, please. ⭐
Viaje completado. Valoración: 5 estrellas el trayecto, 4 el susto. 🚖 || Trip complete. Rating: 5 stars for the ride, 4 for the scare. 🚖
Reseña: «Trato amable, despegue con susto, aterrizaje excelente». Cuatro estrellas. ⭐ || Review: “Kind service, scary takeoff, excellent landing.” Four stars. ⭐
Entrega certificada: oveja en perfecto estado y sin una raya en la lana. Firma aquí. 📦 || Certified delivery: sheep in perfect condition, not a scratch on the wool. Sign here. 📦
Paquete frágil entregado con cuidado. Aplaudo la delicadeza. 👏 || Fragile package delivered with care. I applaud the delicacy. 👏
Con cuidadito… así sí. Esto va a mi lista buena. 📝 || Nice and gentle… that's how it's done. This goes on my good list. 📝
Mmm, ¿eso ha sido cariño? Lo anoto en mi libreta de cosas raras. 📒 || Hmm, was that affection? I'm noting it in my notebook of weird things. 📒
Parada final. Se ruega no despeinar a los pasajeros. 🚌 || Final stop. Please do not mess up the passengers' wool. 🚌
Nube de lana, viaje cómodo, cero turbulencias. Bueno, casi cero. ☁️ || Cloud of wool, comfy ride, zero turbulence. Well, almost zero. ☁️
Gracias por no soltarme desde lo alto. Hoy sales en mi lista buena. 💜 || Thanks for not dropping me from way up. Today you're on my good list. 💜
Aquí está bien. Me quedo. Tiene buenas vistas. 🌄 || This spot is fine. I'm staying. It has a nice view. 🌄
Aterrizaje suave. Alguien se leyó el manual de cuidados de ovejas. 📖 || Soft landing. Somebody read the sheep care manual. 📖
Propina no incluida. Pero acepto heno. 🌾 || Tip not included. But I accept hay. 🌾
Un taxi con manos. Tarifa: tres caricias y un aplauso. 🚕 || A taxi with hands. Fare: three pets and a round of applause. 🚕
Qué delicadeza. Casi me emociono. Casi. 🥹 || What delicacy. I almost got emotional. Almost. 🥹
Gracias por el paseo. La próxima vez, avísame antes de despegar. ✈️ || Thanks for the stroll. Next time, warn me before takeoff. ✈️
Sin gritos, sin vuelos y sin denuncias. Podría acostumbrarme. 😌 || No screaming, no flights and no lawsuits. I could get used to this. 😌
Tierra firme. Mi estómago de oveja te lo agradece. 🌱 || Solid ground. My sheep stomach thanks you. 🌱
Atención, pasajeros: hemos aterrizado sin incidentes. Gracias por volar con Aerolana. 🛬 || Attention, passengers: we've landed without incident. Thanks for flying Woolair. 🛬
Cargada, paseada y dejada con mimo. Esto es un spa. 💆 || Carried, strolled and set down gently. This is a spa. 💆
`));
A(TX,"placedP",L(`
Cinco estrellas por el viaje, cuatro por el susto. Y ya empiezas a caerme bien. 😏 || Five stars for the trip, four for the scare. And you're starting to grow on me. 😏
Cada vez lo haces mejor. Sigo sin fiarme, pero lo haces mejor. 🧐 || You get better every time. I still don't trust you, but you get better. 🧐
Aterrizaje suave… ¿estás preparando algo? Dímelo ya, que luego me hago la sorprendida. 🙄 || Soft landing… are you planning something? Tell me now, I'll pretend to be surprised later. 🙄
Trato suave, oveja contenta y lista de venganzas en pausa. Aprovecha. ⏸️ || Gentle treatment, a happy sheep and a revenge list on pause. Make the most of it. ⏸️
¿Dejarme con cariño después de tanto lanzarme? Qué doble vida llevas. 🎭 || Setting me down gently after all those throws? What a double life you lead. 🎭
`));
A(TX,"placedV",L(`
Qué suavidad. Qué pena que no borre lo anterior. Sigue en mi lista. 📖 || How gentle. Shame it doesn't erase the rest. It's still on my list. 📖
Un buen gesto. Lo apunto en la columna de «atenuantes». Es una columna muy pequeña. 🗂️ || A kind gesture. Noted in the “mitigating factors” column. It's a very small column. 🗂️
Gracias por el aterrizaje suave. Esto te baja la condena un cinco por ciento. ⚖️ || Thanks for the soft landing. That reduces your sentence by five percent. ⚖️
No creas que esto me compra. Pero acepto el cargamento de heno. 🌾 || Don't think this buys me. But I'll accept the hay delivery. 🌾
Cuidadito, cuidadito… como quien prepara el terreno. 🕯️ || Careful, careful… like someone laying the groundwork. 🕯️
`));
A(TX,"soft",L(`
Cinco estrellas por el viaje. Cuatro por el susto. Una por el aterrizaje… es broma, cinco. ⭐ || Five stars for the trip. Four for the scare. One for the landing… kidding, five. ⭐
Me has bajado con más cuidado que a un jarrón. Me siento valorada. 🏺 || You set me down more carefully than a vase. I feel valued. 🏺
Ha habido un momento de vértigo, pero sobreviví con elegancia. 🎢 || There was a moment of vertigo, but I survived with elegance. 🎢
Tres, dos, uno… ¡tierra! Sin heridos y sin rizos fuera de sitio. 🚀 || Three, two, one… ground! No injuries and no curls out of place. 🚀
Un salto pequeñito para una oveja, un susto enorme para su lana. 🌙 || One small hop for a sheep, one giant scare for her wool. 🌙
Ha sido corto pero intenso. Como un balido bien dado. 🐑 || It was short but intense. Like a well-delivered baa. 🐑
`));
A(MIC,"placed",L(`
⭐⭐⭐⭐⭐ || ⭐⭐⭐⭐⭐
5⭐ el viaje || 5⭐ the ride
4⭐ el susto || 4⭐ the scare
¡Gracias! || Thanks!
😌 || 😌
🛬 || 🛬
Con cuidadito. || Nice and gentle.
Entrega ok. 📦 || Delivered. 📦
Buen viaje. || Nice ride.
🫶 || 🫶
Cero turbulencias. || Zero turbulence.
Qué delicadeza. || How delicate.
Me quedo aquí. || I'm staying here.
🐑💜 || 🐑💜
Servicio de lujo. || Luxury service.
Aterrizada. || Landed.
Tierra firme. || Solid ground.
`));
A(TX,"onTiles",L(`
Aterricé sobre las carpetas. Qué gusto tener una alfombra de apps. 🧺 || I landed on the folders. What a joy to have a rug made of apps. 🧺
Desde aquí vigilo las carpetas. Que ninguna se escape. 👀 || From here I keep watch over the folders. None may escape. 👀
Estas carpetas son mi sofá. Gracias por la entrega. 🛋️ || These folders are my couch. Thanks for the delivery. 🛋️
Me dejaste entre carpetas. Elijo la que tenga más lana. 🧶 || You left me among folders. I'm picking the one with the most wool. 🧶
Cinco estrellas por el viaje, y una carpeta de propina. ⭐ || Five stars for the trip, and a folder as a tip. ⭐
`));
A(TX,"onDock",L(`
Aquí abajo se está cómoda. Me quedo un ratito. 🏠 || It's cozy down here. I'll stay a little while. 🏠
Suelo firme y botones a mano. Esto es vida. 🔘 || Solid floor and buttons within reach. This is the life. 🔘
Aterrizaje en la barra de abajo. Pido el botón de «Inicio»: me lo merezco. 🏡 || Landing on the bottom bar. I'm taking the “Home” button: I deserve it. 🏡
Barra de abajo: mi casa. Gracias por traerme. 💜 || Bottom bar: my home. Thanks for bringing me. 💜
Aquí hay pulgares por todas partes. Cuidado con mi lana. 👍 || There are thumbs everywhere here. Mind my wool. 👍
`));
A(TX,"holding",L(`
Para ser un secuestro, el paisaje es bonito. 🌄 || For a kidnapping, the scenery is nice. 🌄
Voy sin cinturón. Que conste. 🚗 || No seatbelt on. Let it be noted. 🚗
Si me sueltas con mimo, te pongo cinco estrellas. Si no… cuatro. ⭐ || Put me down gently and you get five stars. If not… four. ⭐
Qué silencio tan sospechoso. ¿Adónde vamos? 🤨 || Such a suspicious silence. Where are we going? 🤨
Voy cómoda, pero no se lo digas a nadie. 😌 || I'm comfy, but don't tell anyone. 😌
`));

/* --- generador por piezas: apertura + cuerpo + remate (cada pieza es [español, English]) --- */
const GEN={
 praise:{
  open:L(`
¡Atención! || Attention!
Registro oficial: || Official record:
Con todo respeto: || With all due respect:
Para que conste: || For the record:
Nota de la oveja: || Note from the sheep:
Oído en la tienda: || Overheard in the store:
`),
  body:L(`
Tienes un gusto exquisito para las apps. || You have exquisite taste in apps.
Instalas con una elegancia que ya quisieran muchos rebaños. || You install with an elegance many flocks would envy.
Lees la letra pequeña. Eso es de valientes. || You read the small print. That takes courage.
Tu criterio merece lana de primera calidad. || Your judgment deserves first-class wool.
Eres de los pocos que miran la fuente antes de descargar. || You're one of the few who check the source before downloading.
Aquí se nota que sabes lo que haces. || It shows you know what you're doing.
`),
  close:L(`
Va a mi lista buena. 📝 || Going on my good list. 📝
Sigue así. 🐑 || Keep it up. 🐑
Tomo nota con orgullo. 🥹 || Noting it with pride. 🥹
Y yo, encantada. ✨ || And I'm delighted. ✨
Cuenta con mi aplauso. 👏 || You have my applause. 👏
`)
 },
 grudge:{
  open:L(`
Para el acta: || For the record:
Atención, testigos: || Attention, witnesses:
Informe de daños: || Damage report:
Comunicado oficial: || Official statement:
Dato curioso: || Fun fact:
`),
  body:L(`
Me lanzaste y yo lo recuerdo todo. || You threw me and I remember everything.
Mi abogado ya tiene el expediente abierto. || My lawyer already has the file open.
Mi lista de venganzas gana una fila. || My revenge list gains a row.
Mi lana ha tenido días mejores. || My wool has seen better days.
Aterricé con dignidad, que es lo único que no me quitarás. || I landed with dignity, the one thing you can't take from me.
Vuelo no solicitado, aterrizaje no consentido. || Unrequested flight, unconsented landing.
`),
  close:L(`
Que no se diga que no avisé. ⚖️ || Let it not be said I didn't warn you. ⚖️
El Plan avanza. 📝 || The Plan advances. 📝
Sin rencor. Con muchísimo registro. 🐑 || No grudge. Plenty of paperwork. 🐑
Seguimos. 😌 || We carry on. 😌
Tomen nota. 🧾 || Take note. 🧾
`)
 }
};
const genMem={};
function gen(kind){
  const g=GEN[kind];if(!g)return null;
  const pickPiece=(arr,k)=>{let i,t=0;do{i=Math.floor(Math.random()*arr.length);}while(arr.length>1&&i===genMem[kind+k]&&++t<8);genMem[kind+k]=i;return arr[i];};
  const o=pickPiece(g.open,"o"),b=pickPiece(g.body,"b"),c=pickPiece(g.close,"c");
  return [[o[0],b[0],c[0]].join(" "),[o[1],b[1],c[1]].join(" ")];
}

/* variables que entiende cada clave (además de {hora} {app} {carpeta}, válidas en cualquier frase); lo usa tools/check-dialogs.mjs */
const VARS={"T.noRes":["q"],"T.oneRes":["a"],"T.manyRes":["n","q"],"T.fav5":["n"],"T.gStartRec":["rec"],"T.gOverRec":["sc"],"T.gOverFirst":["sc"],"T.gOverNear":["sc"],"T.gOver":["sc"],
 "GREET.away":["d"],"GREET.newsN":["n"],"TX.many":["n"],"TX.dropMany":["n"],"TX.thrownV":["n"],"FAST.dl":["a"],"FAST.src":["a"],"FAST.hov":["a"],"T.prog":["k","n"],"FAST.wins":["n"],"FOLD":["n","a"],
 "ADV.favsN":["n","a1","a2"],"ADV.newsN":["n","a1"],"ADV.packs":["n","a1","a2"],"ADV.gen":["n","a1","t1","a2","t2"],"ADV.tipw":["a1","tip"]};
/* mínimo de variantes por clave: 5 por defecto; 15 en lo más frecuente */
const MINV={default:5,"T.tap":15,"T.praise":15,"TX.grab":15,"TX.soft":15,"TX.hard":15,"TX.dragged":15,"TX.thrown":15,"TX.flying":15,"T.manyRes":15,"T.favAdd":15,
 "MIC.grab":15,"MIC.soft":15,"MIC.hard":15,"MIC.close":15,"MIC.placed":15,"TX.placed":15,"ADV.favs0":5,"ADV.favsN":5,"ADV.news0":5,"ADV.newsN":5,"ADV.packs":5,"ADV.gen":8,"ADV.tipw":4,"ADV.hintPC":3,"ADV.hintMob":2,
 "T.bg":3,"TX.holding":5,"TX.draggedP":3,"TX.draggedV":3,"TX.closedOnP":3,"TX.closedOnV":3,"TX.closedOn":5,"TX.gossip":5,"TX.conspi":5,"TX.code":5,"TX.sass":5,"T.lang":0,"FAST.mode":1,"TOUR_PC":0,"TOUR_MOB":0,"T.tips":15,"T.facts":5,"FOLD":0,"T.appTips":5,"T.tod":5};

/* --- reacciones rápidas: completar a 5 --- */
A(FAST,"hov",L(`
Si dudas con {a}, mira la etiqueta: suele decirlo todo. 🏷️ || If in doubt about {a}, check the tag: it usually says it all. 🏷️
`));
A(FAST,"src",L(`
El enlace de la fuente es mi sitio favorito de internet. Después de mi libreta. 📒 || The source link is my favorite place online. After my notebook. 📒
`));
A(FAST,"wins",L(`
{n} ventanas… la lana del escritorio se enreda. 🧶 || {n} windows… the desktop wool is getting tangled. 🧶
¿{n} abiertas? Yo cerraría alguna. Con cariño, o no. 😈 || {n} open? I'd close a few. Lovingly, or not. 😈
`));


/* ===================================  ETAPA 4: consejos por carpeta (ADV)  ===================================
   «Pedir ayuda a Kixki» (consejos.js): Kixki salta a la carpeta y da UN consejo, distinto cada vez.
   - ADV.<id de carpeta>: consejos escritos a mano (nombran apps reales de apps.json: si renombras o mueves una app, revisa su consejo).
   - ADV.gen: consejos con variables {carpeta} {n} {a1} {t1} {a2} {t2} (apps reales de esa carpeta, con su etiqueta; las que llevan {a2} o {n} solo salen si hay ≥ 2 apps).
   - ADV.tipw: relevo del aviso que lleva una app ({a1} = la app, {tip} = su aviso).
   - ADV.favs0 / favsN, news0 / newsN, packs: carpetas especiales (cambian con lo que tengas guardado, lo nuevo y los packs).
   - ADV.hintPC / hintMob: consejos de Kixki que enseñan la función (se mezclan con sus consejos de siempre). */
const ADV={};
ADV.tiendas=L(`
Para empezar sin Play Store: F-Droid para apps libres y Droid-ify como cliente cómodo. Pareja ideal. 🐑 || To start without Play Store: F-Droid for free apps and Droid-ify as a comfy client. An ideal pair. 🐑
¿Apps de Play sin darle tu cuenta a Google? Aurora Store descarga del catálogo de Play sin iniciar sesión. 🔓 || Play apps without handing Google your account? Aurora Store downloads from the Play catalog without signing in. 🔓
Si un APK te da dudas, pásalo por Universal Installer: lo revisa con VirusTotal y te enseña los permisos. 🛡️ || If an APK makes you doubt, run it through Universal Installer: it checks it with VirusTotal and shows its permissions. 🛡️
Cuando una app solo vive en GitHub, busca su APK en «Releases». Komi Store los instala con un toque. 🐙 || When an app only lives on GitHub, look for its APK under “Releases”. Komi Store installs them with one tap. 🐙
LibreFind escanea tus apps, detecta las de código cerrado y te sugiere alternativas libres. Curiosidad con propósito. 🔎 || LibreFind scans your apps, spots the closed-source ones and suggests free alternatives. Curiosity with a purpose. 🔎
En IzzyOnDroid, revisa siempre las apps antes de instalarlas. Que sea libre no quita mirar la letra pequeña. 👀 || On IzzyOnDroid, always check apps before installing them. Being free doesn't excuse skipping the small print. 👀
ShizuCoreFetch instala y actualiza a nivel de sistema, pero necesita Shizuku en marcha. Empieza por «Importante». ⚙️ || ShizuCoreFetch installs and updates at system level, but it needs Shizuku running. Start with “Essential”. ⚙️
Tiendas hay muchas y no hace falta instalarlas todas. Elige una o dos y mantenlas al día. 🧺 || There are plenty of stores and you don't need them all. Pick one or two and keep them up to date. 🧺
`);
ADV.importante=L(`
Shizuku primero: muchas apps de otras carpetas lo usan para funcionar sin root. Instálalo antes y todo irá mejor. 🧩 || Shizuku first: many apps from other folders use it to work without root. Install it first and everything runs better. 🧩
Con depuración inalámbrica (Android 11 o más) Shizuku se activa desde el propio móvil. Sin PC ni root. 📶 || With wireless debugging (Android 11 or newer) Shizuku starts from the phone itself. No PC, no root. 📶
ShizukuPlus usa otro paquete, así que convive con el Shizuku original. Si una app busca el original, prueba su modo de compatibilidad. 🐑 || ShizukuPlus uses a different package, so it lives alongside the original Shizuku. If an app looks for the original, try its compatibility mode. 🐑
Ojo: el desarrollador de Shizuku avisó que pausó el mantenimiento por ahora. Úsalo con la lana atenta. 👀 || Heads up: Shizuku's developer said maintenance is paused for now. Use it with your wool on alert. 👀
ShizukuPlus junta los modos root, ADB y Dhizuku y trae un «Service Doctor» por si algo falla. Buen botiquín. 🩺 || ShizukuPlus combines root, ADB and Dhizuku modes and brings a “Service Doctor” in case something fails. A good first-aid kit. 🩺
Esta carpeta es pequeña pero manda: lo que instales aquí hace que otras apps funcionen mejor. Léela con calma. 📖 || This folder is small but bossy: what you install here makes other apps work better. Read it calmly. 📖
`);
ADV.control=L(`
Antes de quitar nada con Canta, busca la app en ADL. Mirar primero evita llorar después. 📖 || Before removing anything with Canta, look the app up in ADL. Looking first saves crying later. 📖
Canta clasifica cada app por riesgo: recomendada, avanzada, experta o insegura. Las inseguras, ni tocarlas. 🚦 || Canta ranks every app by risk: recommended, advanced, expert or unsafe. The unsafe ones, don't even touch. 🚦
App Manager detecta rastreadores y permisos, y también puede bloquear componentes. Eso último rompe apps: con cuidado. 🔬 || App Manager spots trackers and permissions, and can also block components. That last one can break apps: careful. 🔬
App Ops ajusta permisos con más detalle que los ajustes de Android. Necesita Shizuku: míralo en «Importante». 🎛️ || App Ops tweaks permissions in more detail than Android's settings. It needs Shizuku: check “Essential”. 🎛️
SD Maid SE limpia basura, restos de apps y duplicados. Antes de confirmar, revisa bien lo que vas a borrar. 🧹 || SD Maid SE clears junk, leftovers and duplicates. Before confirming, check carefully what you're about to delete. 🧹
Inure es muy completo y trae una prueba de 15 días; después se desbloquea con su versión completa. ⏳ || Inure is very complete and comes with a 15-day trial; after that you unlock it with the full version. ⏳
Orden sensato: ADL para informarte, Canta para quitar y App Manager si quieres mirar por dentro. 🗺️ || A sensible order: ADL to get informed, Canta to remove, and App Manager if you want to look inside. 🗺️
`);
ADV.utilidad=L(`
scrcpy muestra y controla tu móvil desde la PC sin root. Eso sí: activa antes la depuración USB. 🖥️ || scrcpy shows and controls your phone from the PC without root. Just turn on USB debugging first. 🖥️
Termux: instálalo desde F-Droid y no mezcles fuentes, porque sus complementos exigen la misma firma. 💻 || Termux: install it from F-Droid and don't mix sources, because its add-ons require the same signature. 💻
Essentials es una navaja suiza: bloqueo de apps, luz nocturna por app, congelar apps… Pide permisos profundos, así que lee qué le das. 🔧 || Essentials is a Swiss army knife: app lock, per-app night light, freezing apps… It asks for deep permissions, so read what you grant. 🔧
AutoPie lanza scripts de shell y Python desde un acceso directo, un horario o al aparecer un archivo. Solo funciona en arm64. ⏰ || AutoPie runs shell and Python scripts from a shortcut, a schedule or when a file appears. It only works on arm64. ⏰
Plain maneja tu móvil desde el navegador de otro dispositivo por tu red local. Pide muchos permisos: dale solo los que uses. 🌐 || Plain controls your phone from another device's browser over your local network. It asks for many permissions: grant only what you use. 🌐
¿Primera vez con automatizaciones? AutoPie trae un Termux integrado: buen laboratorio para jugar. 🧪 || First time with automation? AutoPie ships with a built-in Termux: a good lab to play in. 🧪
`);
ADV.pantalla=L(`
EnforceDoze fuerza el modo Doze en cuanto apagas la pantalla. Es un fork de ForceDoze, que ya no se mantiene. 🔋 || EnforceDoze forces Doze mode as soon as you turn the screen off. It's a fork of ForceDoze, which is no longer maintained. 🔋
No More Background te deja elegir qué apps corren en segundo plano. Se configura una vez y listo. ⚙️ || No More Background lets you choose which apps run in the background. You set it up once and you're done. ⚙️
BatStats enseña el consumo por app en mAh. Para verlo todo necesita Shizuku, root o permisos por ADB. 📊 || BatStats shows per-app consumption in mAh. To see it all it needs Shizuku, root or permissions through ADB. 📊
Extinguish apaga la pantalla de verdad y mantiene el móvil despierto, ideal para escuchar vídeos. Ten a mano cómo volver a encenderla. 💡 || Extinguish really turns the screen off and keeps the phone awake, great for listening to videos. Keep in mind how to turn it back on. 💡
Display Toggle apaga y enciende la pantalla sin bloquear el móvil ni parar las apps. Necesita Shizuku. 📴 || Display Toggle turns the screen off and on without locking the phone or stopping apps. It needs Shizuku. 📴
OrientationLock fuerza la orientación aunque una app no te deje girar la pantalla. Para los «¡gira, por favor!». 🔄 || OrientationLock forces the orientation even if an app won't let you rotate the screen. For those “please, rotate!” moments. 🔄
Para cuidar la batería: mide con BatStats y controla con No More Background. Primero datos, luego ajustes. 📈 || To look after your battery: measure with BatStats and control with No More Background. Data first, tweaks later. 📈
`);
ADV.privacidad=L(`
Antes de confiar en una app, pásala por Exodus: te dice qué rastreadores y permisos lleva. 🕵️ || Before trusting an app, run it through Exodus: it tells you which trackers and permissions it carries. 🕵️
PrivacyFlip apaga Wi-Fi, Bluetooth, datos y ubicación al bloquear el móvil, y reactiva solo lo que elijas. 🔒 || PrivacyFlip turns off Wi-Fi, Bluetooth, data and location when you lock the phone, and re-enables only what you choose. 🔒
Bitwarden guarda tus contraseñas en una bóveda cifrada de extremo a extremo. Menos «contraseña123», por favor. 🗝️ || Bitwarden keeps your passwords in an end-to-end encrypted vault. Less “password123”, please. 🗝️
SnapSafe guarda las fotos cifradas y no tiene permiso de internet. Ojo: no entran en copias de seguridad, guarda aparte las que quieras conservar. 📷 || SnapSafe keeps photos encrypted and has no internet permission. Careful: they're not included in backups, so save the ones you want to keep elsewhere. 📷
Tarnhelm limpia el rastreo de los enlaces que compartes. Pide varios permisos: revísalos al instalar. 🔗 || Tarnhelm strips the tracking from the links you share. It asks for several permissions: check them when installing. 🔗
Fake Traveler cambia tu ubicación GPS, pero algunas apps lo detectan y pueden restringir tu cuenta. Con cuidado. 🗺️ || Fake Traveler changes your GPS location, but some apps detect it and may restrict your account. Careful. 🗺️
FireWall Blocks corta el Wi-Fi o los datos app por app. Perfecto para las que no tienen por qué hablar con internet. 🚧 || FireWall Blocks cuts Wi-Fi or mobile data app by app. Perfect for those that have no business talking to the internet. 🚧
`);
ADV.mensajeria=L(`
Signal pide número de teléfono (luego puedes ocultarlo) y Session no pide ni número ni correo. Tú eliges. 💬 || Signal asks for a phone number (you can hide it later) and Session asks for neither number nor email. You choose. 💬
Si usas Session, anota tu frase de recuperación en un lugar seguro: sin ella la cuenta no se recupera. 📝 || If you use Session, write your recovery phrase down somewhere safe: without it the account can't be recovered. 📝
Molly es Signal con capas extra de seguridad: cifra la base de datos local con una frase y usa la misma red. 🔐 || Molly is Signal with extra layers of security: it encrypts the local database with a passphrase and uses the same network. 🔐
Element usa Matrix, una red abierta: puedes elegir tu servidor o montar el tuyo. Tus chats viven donde tú decidas. 🌐 || Element uses Matrix, an open network: you can pick your server or run your own. Your chats live where you decide. 🌐
Proton Mail y Tuta cifran tu correo de extremo a extremo; sus apps son de código abierto, pero el servicio lo pones en manos de la empresa. 📬 || Proton Mail and Tuta encrypt your email end to end; their apps are open source, but you trust the company with the service. 📬
`);
ADV.sistemas=L(`
Aquí no hay apps: son sistemas operativos. Instalarlos borra lo que haya en el equipo, así que haz copia antes. 💿 || No apps here: these are operating systems. Installing one wipes what's on the device, so back up first. 💿
Linux Mint es la entrada más suave si vienes de Windows. Fedora va un poco más adelantada en novedades. 🐧 || Linux Mint is the gentlest way in if you come from Windows. Fedora is a bit ahead on new software. 🐧
GrapheneOS solo se instala en móviles Pixel. Si tienes otro móvil, mira LineageOS y su lista de modelos. 📱 || GrapheneOS only installs on Pixel phones. If you have another phone, look at LineageOS and its list of devices. 📱
LineageOS alarga la vida de un móvil viejo, pero desbloquear el bootloader borra todo. Sigue la guía de tu modelo. 🔓 || LineageOS extends the life of an old phone, but unlocking the bootloader wipes everything. Follow the guide for your model. 🔓
Qubes OS separa cada tarea en su propia máquina virtual. Es muy seguro, pero pide una computadora potente y paciencia. 🧱 || Qubes OS separates each task in its own virtual machine. It's very secure, but needs a powerful computer and patience. 🧱
`);
ADV.fotos=L(`
Image Toolbox tiene más de 500 filtros, quita fondos y hasta hace OCR. Si te pierdes, empieza por recortar o convertir. 🖼️ || Image Toolbox has over 500 filters, removes backgrounds and even does OCR. If you get lost, start with cropping or converting. 🖼️
DeJPEG mejora fotos sin conexión con modelos que descargas una sola vez. Solo funciona en arm64. 🪄 || DeJPEG improves photos offline with models you download once. It only works on arm64. 🪄
Ente Photos cifra tus copias y álbumes de extremo a extremo. Necesita internet y una cuenta; el espacio gratis es limitado. ☁️ || Ente Photos encrypts your backups and albums end to end. It needs internet and an account; free space is limited. ☁️
TagSpaces organiza tus archivos con etiquetas, sin nube ni cuentas. Pide acceso a todo el almacenamiento porque es un gestor de archivos. 🏷️ || TagSpaces organizes your files with tags, no cloud, no accounts. It asks for access to all storage because it's a file manager. 🏷️
Gander abre PDF, Word, Excel, fotos, vídeo y más en una sola app, sin permisos ni internet. Pesa unos 15 MB. 📄 || Gander opens PDFs, Word, Excel, photos, video and more in one app, with no permissions or internet. It weighs about 15 MB. 📄
En Image Toolbox, la versión FOSS no lleva analíticas; la de Play sí. Tú decides cuál instalar. 🔍 || In Image Toolbox, the FOSS version has no analytics; the Play one does. You decide which to install. 🔍
`);
ADV.internet=L(`
LocalSend manda archivos por tu Wi-Fi, sin internet ni cuentas. Eso sí: los dos dispositivos en la misma red. 📡 || LocalSend sends files over your Wi-Fi, no internet or accounts. Just keep both devices on the same network. 📡
LibreWolf es para computadora: no tiene versión oficial para Android. Para el móvil, mira Iceraven. 💻 || LibreWolf is for computers: it has no official Android version. For your phone, look at Iceraven. 💻
Iceraven añade about:config y suspende pestañas, pero sus APK llevan clave de depuración: trátalo como software alfa. 🦊 || Iceraven adds about:config and suspends tabs, but its APKs use a debug key: treat it as alpha software. 🦊
RedReader lee Reddit sin anuncios, con tu cuenta o sin ella. Ligero y libre. 📰 || RedReader reads Reddit with no ads, with or without your account. Light and free. 📰
¿Pasar archivos entre móvil y PC? LocalSend funciona en Android, iOS, Windows, macOS y Linux. 🔁 || Moving files between phone and PC? LocalSend works on Android, iOS, Windows, macOS and Linux. 🔁
Para navegar: Iceraven en el móvil y LibreWolf en la computadora. Los dos vienen de Firefox. 🌐 || For browsing: Iceraven on your phone and LibreWolf on your computer. Both come from Firefox. 🌐
`);
ADV.dia=L(`
Obsidian guarda tus notas como archivos Markdown en tu móvil y enlaza tus ideas. La app es gratis, pero de código cerrado. 📝 || Obsidian keeps your notes as Markdown files on your phone and links your ideas. The app is free, but closed source. 📝
My Brain junta tareas, notas, diario con estado de ánimo y un chat de IA, todo local. Un segundo cerebro de verdad. 🧠 || My Brain brings together tasks, notes, a mood journal and an AI chat, all local. A real second brain. 🧠
Chrono tiene alarmas con retos, como resolver cálculos para apagarlas. Cuidado con madrugar en modo matemáticas. ⏰ || Chrono has alarms with challenges, like solving sums to turn them off. Careful with waking up in math mode. ⏰
LibreFit trae más de 800 ejercicios con instrucciones e imágenes, y gráficas de tu progreso. 💪 || LibreFit has over 800 exercises with instructions and images, plus charts of your progress. 💪
SwitchAI te deja elegir entre más de 40 asistentes de IA desde el gesto de asistente. Solo lanza las apps de IA que ya tengas instaladas. 🤖 || SwitchAI lets you pick from over 40 AI assistants from the assistant gesture. It only launches the AI apps you already have installed. 🤖
Euria es la IA suiza de Infomaniak: escribe, traduce y resume. Necesita internet y cuenta, y su servicio no es libre. 🇨🇭 || Euria is Infomaniak's Swiss AI: it writes, translates and summarizes. It needs internet and an account, and its service isn't free software. 🇨🇭
`);
ADV.emulacion=L(`
Lemuroid cubre NES, SNES, Game Boy, N64, PSP y más. Escanea tus ROMs y guarda las partidas solo. Los juegos los pones tú. 🎮 || Lemuroid covers NES, SNES, Game Boy, N64, PSP and more. It scans your ROMs and saves your games by itself. You bring the games. 🎮
Recuerda: usa solo copias de juegos que sean tuyos. Los emuladores no traen juegos ni BIOS. 📀 || Remember: use only copies of games that are yours. Emulators don't come with games or BIOS. 📀
SeedlessDS está en beta temprana y solo funciona en arm64. Si falla, es cosa de la beta, no tuya. 🧪 || SeedlessDS is in early beta and only works on arm64. If it fails, blame the beta, not yourself. 🧪
DroidDeck pide una GPU Adreno 730 o superior; Mali, Xclipse y PowerVR no funcionan. Mira tu GPU antes de ilusionarte. 🔍 || DroidDeck needs an Adreno 730 GPU or better; Mali, Xclipse and PowerVR don't work. Check your GPU before getting excited. 🔍
CatSmoker optimiza juegos, pero falsear el dispositivo puede romper las reglas de algunos y causar baneos. El riesgo es tuyo. ⚠️ || CatSmoker optimizes games, but spoofing the device can break the rules of some games and get you banned. The risk is yours. ⚠️
Kimu X64 es una página para buscar juegos para tus emuladores. Toca «Créditos» para ir al canal de su creador. 🔗 || Kimu X64 is a page to find games for your emulators. Tap “Credits” to visit its creator's channel. 🔗
`);
ADV.decoracion=L(`
GIF Live Wallpaper convierte un GIF en fondo animado. Es ligera, open source y está en F-Droid. 🌈 || GIF Live Wallpaper turns a GIF into an animated wallpaper. It's light, open source and on F-Droid. 🌈
Si los Widgets Pro no se actualizan, desactiva la optimización de batería para la app. 🔋 || If Widgets Pro doesn't update, turn off battery optimization for the app. 🔋
Photo Widget convierte fotos de tu galería en widgets, pero no funciona con GIFs. Para GIFs, mira Widgets Pro. 🖼️ || Photo Widget turns photos from your gallery into widgets, but it doesn't work with GIFs. For GIFs, look at Widgets Pro. 🖼️
L.L.E trae los efectos clásicos de la pantalla de bloqueo, como ondas de agua o burbujas. Está en beta y puede fallar. 🫧 || L.L.E brings classic lock screen effects like water ripples or bubbles. It's in beta and may fail. 🫧
Widgets Pro tiene estilo Nothing OS: reproductor de música, seguimiento del sol y más (Android 12+). ☀️ || Widgets Pro has a Nothing OS style: music player, sun tracker and more (Android 12+). ☀️
Combo bonito: un fondo animado con GIF Live Wallpaper y widgets a juego. Sin saturar, que la lana también necesita aire. ✨ || Pretty combo: an animated wallpaper with GIF Live Wallpaper and matching widgets. Don't overdo it, wool needs air too. ✨
`);
ADV.musica=L(`
Poweramp tiene un ecualizador excelente, pero es de código cerrado y de pago tras la prueba. 🎚️ || Poweramp has an excellent equalizer, but it's closed source and paid after the trial. 🎚️
SpotiFLAC: primero, en la pestaña Tienda pega el enlace de «Extensión» y luego instala las extensiones. Sin ese paso, nada. 🧩 || SpotiFLAC: first, in the Store tab paste the “Extension” link and then install the extensions. Without that step, nothing works. 🧩
WEcho aplica efectos a todo el sonido del sistema, no solo a un reproductor. Solo funciona en arm64. 🎧 || WEcho applies effects to all system sound, not just one player. It only works on arm64. 🎧
ClassiPod reproduce tu música con el diseño del iPod Classic. Nostalgia con lana. 📻 || ClassiPod plays your music with the iPod Classic look. Nostalgia with wool. 📻
Helio sirve para crear música, no para reproducirla. Es un secuenciador libre para componer. 🎹 || Helio is for making music, not for playing it. It's a free sequencer for composing. 🎹
Ambient Music Mod trae el «Ahora suena» de los Pixel a otros Android. Con Shizuku, hay que volver a iniciarlo tras cada reinicio del móvil. 🎶 || Ambient Music Mod brings the Pixel's “Now Playing” to other Androids. With Shizuku, you must start it again after each phone reboot. 🎶
`);
ADV.teclados=L(`
LeanType es un teclado open source basado en HeliBoard, con temas, teclado flotante y portapapeles con historial. 🧶 || LeanType is an open-source keyboard based on HeliBoard, with themes, a floating keyboard and clipboard history. 🧶
GifBoard busca GIFs desde el teclado, pero usa la búsqueda de imágenes de Google: depende de ese servicio. 🎞️ || GifBoard searches GIFs from the keyboard, but it uses Google image search: it depends on that service. 🎞️
Irregular Expressions es un teclado muy básico, pero con fuentes de texto para escribir con estilo y sin rastreadores. ✨ || Irregular Expressions is a very basic keyboard, but with text fonts to type in style and without trackers. ✨
Para cambiar de teclado: instálalo, actívalo en los ajustes de teclado y elígelo como predeterminado. 🔄 || To switch keyboards: install it, enable it in your keyboard settings and choose it as the default. 🔄
¿Privacidad al escribir? El núcleo de LeanType es offline; su IA es opcional y solo envía texto a proveedores externos si la usas. 🔐 || Privacy while typing? LeanType's core is offline; its AI is optional and only sends text to external providers if you use it. 🔐
Tres teclados, tres estilos: LeanType para todo, Irregular Expressions para fuentes y GifBoard para GIFs. 🎨 || Three keyboards, three styles: LeanType for everything, Irregular Expressions for fonts and GifBoard for GIFs. 🎨
`);
/* carpetas especiales: cambian con lo que guardes, lo nuevo y los packs */
ADV.favs0=L(`
Aún no tienes favoritas. Toca la ☆ de una app y aparecerá aquí, a un toque. ⭐ || No favorites yet. Tap the ☆ on an app and it'll show up here, one tap away. ⭐
Favoritas está vacía. Guarda las apps que quieras instalar primero y hazte una lista a tu medida. 🧶 || Favorites is empty. Save the apps you want to install first and build a list that fits you. 🧶
Truco: abre cualquier carpeta y pulsa la ☆ de la app que te guste. Luego vuelve aquí. 🔖 || Trick: open any folder and tap the ☆ on the app you like. Then come back here. 🔖
Cuando guardes una, la verás aquí sin buscarla otra vez. Es un marcapáginas con lana. 📚 || Once you save one, you'll see it here without searching again. It's a bookmark with wool. 📚
Favoritas es tu rincón, y aún está vacío. ¡Mucho que llenar! Empieza por «Tiendas». 🧺 || Favorites is your corner, and it's still empty. Plenty to fill! Start with “Stores”. 🧺
`);
ADV.favsN=L(`
«{a1}» está en tus favoritas. ¿Ya la instalaste? Para algo la guardaste. ⭐ || “{a1}” is in your favorites. Did you install it yet? You saved it for a reason. ⭐
Favoritas: {n}. Revisa de vez en cuando si alguna ya no te interesa; una lista corta se usa mejor. 🧹 || Favorites: {n}. Check now and then if any no longer interests you; a short list is easier to use. 🧹
Pulsa la ★ de «{a1}» si quieres quitarla de favoritas. Yo no me ofendo. 🙂 || Tap the ★ on “{a1}” if you want to remove it from favorites. I won't be offended. 🙂
{n} favoritas guardadas: tu mini tienda personal. «{a1}» abre el desfile. 🛍️ || {n} favorites saved: your personal mini store. “{a1}” opens the parade. 🛍️
Antes de instalar «{a1}», lee su fuente. Hasta las favoritas merecen una revisión. 🔎 || Before installing “{a1}”, read its source. Even favorites deserve a check. 🔎
«{a1}» y «{a2}» están en tus favoritas. Buena pareja… o gran lío. Tú decides. 😏 || “{a1}” and “{a2}” are both in your favorites. A good pair… or a big mess. You decide. 😏
`);
ADV.news0=L(`
Sin novedades desde tu última visita. Cuando llegue una app nueva, la verás aquí. 🆕 || Nothing new since your last visit. When a new app arrives, you'll see it here. 🆕
Esta carpeta está tranquila: ninguna app nueva por ahora. Vuelve pronto. 🌱 || This folder is quiet: no new apps for now. Come back soon. 🌱
Novedades vacía quiere decir que estás al día. ¡Disfruta mientras dure! 😌 || An empty News folder means you're up to date. Enjoy it while it lasts! 😌
Mientras llegan novedades, repasa «Favoritas» o date una vuelta por otra carpeta. 🐑 || While news arrives, go through “Favorites” or take a stroll through another folder. 🐑
Cuando se añadan apps, aparecerán aquí. Nada de prisas: yo vigilo por ti. 👀 || When apps get added, they'll show up here. No rush: I'll keep watch for you. 👀
`);
ADV.newsN=L(`
Hay novedades: {n} en total. «{a1}» es una de ellas. Empieza por ahí. 🆕 || There's news: {n} in total. “{a1}” is one of them. Start there. 🆕
¡Han llegado apps nuevas! Échale un ojo a «{a1}» y lee su fuente antes de instalar. 👀 || New apps have arrived! Take a look at “{a1}” and read its source before installing. 👀
Novedades: {n}. Lo nuevo no siempre es mejor, pero «{a1}» tiene buena pinta. 🎯 || News: {n}. New isn't always better, but “{a1}” looks promising. 🎯
Si algo te gusta de aquí, guárdalo con la ☆ para no perderlo cuando deje de ser novedad. ⭐ || If something here catches your eye, save it with the ☆ so you don't lose it once it stops being new. ⭐
Desde tu última visita se añadieron {n}. «{a1}» está entre ellas: ¿empezamos por esa? 🐑 || Since your last visit, {n} were added. “{a1}” is among them: shall we start there? 🐑
`);
ADV.packs=L(`
Los packs son listas para instalar varias apps de una vez. Prueba «{a1}»: pulsa «Copiar lista» y llevas todos los enlaces. 🎁 || Packs are ready-made lists to install several apps at once. Try “{a1}”: tap “Copy list” and you've got all the links. 🎁
Hay {n} packs. Si no sabes por dónde empezar, «{a1}» es un buen primer paso. 🧭 || There are {n} packs. If you don't know where to start, “{a1}” is a good first step. 🧭
Cada app de un pack es un botón: tócalo y te llevo a su ficha. Y revisa la fuente antes de instalar. 🔎 || Every app in a pack is a button: tap it and I'll take you to its card. And check the source before installing. 🔎
«{a1}» y «{a2}» son dos packs bien distintos. Elige el que se parezca más a ti. 🐑 || “{a1}” and “{a2}” are two very different packs. Pick the one that looks most like you. 🐑
Un pack es un atajo, no una orden: instala solo las apps que te convenzan. 🧶 || A pack is a shortcut, not an order: install only the apps that convince you. 🧶
Los packs no instalan nada solos: te dan la lista con enlaces. Tú decides qué entra en tu móvil. 🛡️ || Packs don't install anything by themselves: they give you the list with links. You decide what goes on your phone. 🛡️
`);
/* consejos con apps reales de la carpeta: {carpeta} {n} {a1} {t1} {a2} {t2}  (los que llevan {a2} o {n} necesitan ≥ 2 apps) */
ADV.gen=L(`
En «{carpeta}», mi consejo es «{a1}»: {t1}. Si te convence, sigue con «{a2}». 🐑 || In “{carpeta}”, my tip is “{a1}”: {t1}. If you like it, continue with “{a2}”. 🐑
Si no sabes por dónde empezar en «{carpeta}», empieza por «{a1}» ({t1}). 🧭 || If you don't know where to start in “{carpeta}”, start with “{a1}” ({t1}). 🧭
En «{carpeta}» hay {n} apps. Antes de instalar cualquiera, lee su etiqueta y su fuente. 🏷️ || There are {n} apps in “{carpeta}”. Before installing any, read its tag and its source. 🏷️
Guarda «{a1}» en favoritas con la ☆ y la tendrás a un toque desde «Favoritas». ⭐ || Save “{a1}” to favorites with the ☆ and you'll have it one tap away from “Favorites”. ⭐
Truco: si la descripción de «{a1}» se corta, pulsa «Leer más» para verla entera. 📖 || Trick: if the description of “{a1}” is cut off, tap “Read more” to see it all. 📖
Mi pareja favorita de «{carpeta}»: «{a1}» ({t1}) y «{a2}» ({t2}). 💞 || My favorite pair in “{carpeta}”: “{a1}” ({t1}) and “{a2}” ({t2}). 💞
Revisa siempre la fuente antes de instalar, también en «{carpeta}». Hasta las ovejas lo hacen. 🔎 || Always check the source before installing, in “{carpeta}” too. Even sheep do it. 🔎
¿Dudas entre «{a1}» y «{a2}»? Lee sus etiquetas: «{t1}» y «{t2}». A veces con eso basta. ⚖️ || Torn between “{a1}” and “{a2}”? Read their tags: “{t1}” and “{t2}”. Sometimes that's enough. ⚖️
`);
ADV.tipw=L(`
Aviso sobre «{a1}»: {tip} ⚠️ || Notice about “{a1}”: {tip} ⚠️
Ojo con «{a1}»: {tip} 👀 || Careful with “{a1}”: {tip} 👀
Dato importante de «{a1}»: {tip} 📌 || Important note on “{a1}”: {tip} 📌
Antes de instalar «{a1}», recuerda: {tip} 🛑 || Before installing “{a1}”, remember: {tip} 🛑
`);
/* Kixki enseña la función en sus consejos de siempre */
ADV.hintPC=L(`
Mantén pulsado el icono de una carpeta (o haz clic derecho) y te ofrezco ayuda con ella. 🐑 || Hold down a folder icon (or right-click) and I'll offer to help you with it. 🐑
¿No sabes qué hay en una carpeta? Mantén pulsada y elige «Pedir ayuda»: te aconsejo con apps reales. 🧭 || Not sure what's in a folder? Hold it down and choose “Ask for help”: I'll advise you with real apps. 🧭
Con el teclado: enfoca una carpeta y pulsa Mayús + F10 (o la tecla de menú) para pedirme ayuda. ⌨️ || With the keyboard: focus a folder and press Shift + F10 (or the menu key) to ask me for help. ⌨️
`);
ADV.hintMob=L(`
Mantén pulsada una carpeta y aparece «Pedir ayuda a Kixki». Te aconsejo sobre esa carpeta. 🐑 || Hold down a folder and “Ask Kixki for help” appears. I'll advise you about that folder. 🐑
¿Te pierdes en una carpeta? Mantén el dedo encima y te doy un consejo con apps reales. 🧭 || Lost in a folder? Keep your finger on it and I'll give you advice with real apps. 🧭
`);

/* =========================================================
   (parte 4b) emojis por situación · buenas noches · básquet con Kixki enfadada
   ========================================================= */
/* E("😳 🫣 😱") → [["😳","😳"],["🫣","🫣"],…]: solo emoji (sin letras). Los usa el modo «calladita» y el sueño. */
const E=s=>s.trim().split(/\s+/).map(e=>[e,e]);
/* EMO.<situación>: respuestas de SOLO EMOJI. En modo «calladita» sustituyen a cualquier frase que no sea
   «me tocaron» o «me pidieron ayuda» (ver wordsGate() en kixki.js). Mínimo 6 por situación (lo comprueba check-dialogs). */
const EMO={
 grab:E("😳 🫣 😱 😤 🙀 🐑❓ 😵‍💫 🥴"),held:E("🥴 😖 🙄 😑 😒 🫠 🧘"),shake:E("🤢 😵 🌀 😫 🥴 🫨"),long:E("😮‍💨 🥱 😩 🙄 😑 ⏳ 😵‍💫"),
 fly:E("😱 🚀 🪂 😵‍💫 🙀 💨 🫨 😤"),placed:E("😌 ✨ 🙂 👌 🐑 😮‍💨 🫶 😊"),soft:E("😅 🙃 😬 🐑 🪂 😏 🤨"),hard:E("😵 💥 🤕 🌀 😖 🥴 😣"),
 mad:E("😠 💢 😤 😡 🔥 😾 👿"),close:E("🚪 👋 🐑👋 🫡 😏 🙈 ✋"),back:E("👋 🐑 😊 👀 🫶 😄 ✨"),
 search:E("🔍 👀 🧐 🔎 🤓 🐑🔎 ✨"),noRes:E("🤷 😕 🫥 🕳️ 😶 🔍❌ 🙈"),fav:E("⭐ 💛 🌟 ✨ 😍 💫 🥰"),favDel:E("💔 😢 🥲 😶 🫤 🌑 😿"),
 theme:E("🌗 ✨ 😎 🕶️ 🌈 🔆 🌙"),bg:E("🖼️ 🌄 🎨 🌈 🌸 🍂 ❄️ 🎃"),music:E("🎵 🎶 🎧 🎼 🕺 🐑🎶 🔇"),lang:E("🌐 🗣️ 💬 🔤 🈂️ 🐑💬"),
 gstart:E("🏃 🐑💨 🏁 💪 🔥 🚀 🎮"),grec:E("🏆 🎉 🥇 👑 🌟 🥳 🎊"),gover:E("💥 😵 😅 🙈 🤕 😬 🫠"),
 folder:E("📂 📁 👀 🐑 🧐 📌 ✨"),dl:E("📥 ⬇️ 👍 🛡️ 🐑👍 📦 ✅"),src:E("🔍 ⭐ 💛 🧑‍💻 📜 👀 🧐"),wins:E("🪟 😵‍💫 🧹 🤯 🥴 🐑🪟"),
 big:E("🎉 🏆 🌟 🥳 ✨ 👏 🎊 🐑✨"),ui:E("🐑 ✨ 👀 💬 🙂 👍 🌸 😊"),greet:E("👋 🐑 😊 ☀️ 🌙 ✨ 🫶"),mode:E("🤐 🤫 🔇 😶 🙊 🐑🤫"),
 sleep:E("😴 🌙 💤 🛌 😪 🐑💤 🕯️"),yawn:E("🥱 😮 😪 😌 🫠 🥱✨"),poke:E("😠 😴 😠💢 😴💤 😠💤 😠😴"),wake:E("🌞 😊 🐑 ✨ 🥱 👋"),
 stumble:E("😲 🙀 😬 😯 🫨 😳"),fall:E("💥 😵 🌟 😵‍💫 🤕 💫"),pr:E("😈 😇 🤭 😏 🙈 🫢"),hk:E("🤓 🕶️ 🧑‍💻 🔍 👓 🛠️"),fire:E("🔥 🚒 💦 😱 🧯 🙀"),
 /* la cancha de básquet (una lista por fase) */
 bkStart:E("😠 😤 📝 🏀 😒 👀 🔥"),bkThrow:E("😱 🚀 🌀 😵‍💫 💢 🪂 🙀"),bkMiss:E("😒 🙄 🤕 💢 📖 😤 🫠"),bkScore:E("🏀 😤 💅 🔥 🎯 😠🏀 ✨"),
 bkStreak:E("🔥 🔥🔥 ⚠️ 😈 👑 🚀 💪"),bkLast:E("⏳ 😤 😈 🧘 🌾 ⏰"),bkWin:E("🏆 🥇 👑 😤🏆 🥳 🎉"),bkLose:E("😒 🙄 🖊️ 📚 💇 😤"),bkEnd:E("😈 📜 🌾 👋 😤 🕊️ 💸")
};
/* a los emoji de las microreacciones de siempre se les suman más (para que en «calladita» haya variedad) */
A(MIC,"grab",E("🫣 🙀 🥴"));A(MIC,"soft",E("😅 🙃"));A(MIC,"hard",E("💥 🤕"));A(MIC,"close",E("🫡 🙈"));A(MIC,"back",E("😊 ✨"));

/* buenas noches: UNA sola frase al irse a dormir (cuando quitas a Kixki) */
A(T,"sleepNow",L(`
Buenas noches… me echo una siesta. Zzz. 🌙 || Good night… I'm taking a nap. Zzz. 🌙
Me voy a dormir. Que nadie toque a la oveja. 😴 || I'm off to sleep. Nobody touch the sheep. 😴
Zzz… voy a contar ovejas. Todas soy yo. 🐑💤 || Zzz… I'll count sheep. They're all me. 🐑💤
Hasta mañana. Sueña con apps bonitas. 🌙 || See you tomorrow. Dream of pretty apps. 🌙
Me acuesto un ratito. Despiértame si hay heno. 🌾💤 || I'm lying down for a bit. Wake me if there's hay. 🌾💤
Buenas noches, tienda. Apaga la luz al salir. 🕯️ || Good night, store. Turn off the light on your way out. 🕯️
`));

/* ---------- básquet: Kixki muy enfadada con quien la lanza ----------
   Fases: bkStart (empieza la partida) · bkThrow (cada lanzamiento) · bkMiss (fallo) · bkScore (encesta) · bkStreak (racha, {n})
   · bkLast (último tiro) · bkWin / bkLose (fin de la partida, {p} puntos) · bkEnd (al cerrar la ventana, {p}).
   Cada fase: lista base (≥ 6) + <fase>P (pícara, ≥ 3) + <fase>V (vengativa, ≥ 3). basket.js elige según mood() de kixki3.js. */
A(TX,"bkStart",L(`
Esto lo vas a pagar… en forma de molestia. 😠 || You're going to pay for this… in the form of annoyance. 😠
Me tiraste a una cancha. A MÍ. Va directo al libro de agravios. 📖 || You threw me onto a court. ME. Straight into the book of grievances. 📖
Kitsuki, empieza el partido y empieza mi lista de cuentas pendientes. 📝 || Kitsuki, the game starts and so does my list of unpaid debts. 📝
Me caí por tu culpa y ahora quieres que enceste. Qué descaro. 😤 || I fell because of you and now you want me to score. The nerve. 😤
Ni una palabra. Lánzame sin mirarme. Te miro yo a ti. 👀 || Not a word. Launch me without looking at me. I'm the one looking at you. 👀
Que conste: juego por obligación, no por amistad. Y lo escribí. ✍️ || Let it be known: I play out of duty, not friendship. And I wrote it down. ✍️
`));
A(TX,"bkStartP",L(`
Voy a jugar de maravilla… solo para que te sientas culpable. 😏 || I'll play wonderfully… just to make you feel guilty. 😏
Plan «Lana Total», fase cancha. Tú lánzame, yo hago el resto. 😈 || Plan “Total Wool”, court phase. You launch me, I'll do the rest. 😈
Sonríe, que me acuerdo de todo. Cada tiro. Cada. Tiro. 😇 || Smile, I remember everything. Every throw. Every. Single. One. 😇
`));
A(TX,"bkStartV",L(`
Otra vez a la cancha… Cuando sea reina, esto será delito. 👑 || Back on the court… When I'm queen, this will be a crime. 👑
Mi paciencia tiene un límite y vives pegado a él. 🌋 || My patience has a limit and you live right next to it. 🌋
Tu nombre ya sale en negrita en mi lista. 📜 || Your name is already in bold on my list. 📜
`));

A(TX,"bkThrow",L(`
¡AAAAH! ¡Esto es abuso de oveja! 🐑💢 || AAAH! This is sheep abuse! 🐑💢
Adelantaré mi revolución. Y que Kitsuki se entere. …Pensándolo bien, mejor no le digas. 🤫 || I'll move my revolution forward. And let Kitsuki find out. …On second thought, better not say a word. 🤫
¡Lo anoto! ¡Lo anoto en pleno vuelo! 📝 || I'm writing it down! Right in mid-flight! 📝
Si caigo mal, oirás mi lista de quejas entera. 📣 || If I land badly, you'll hear my whole list of complaints. 📣
Esto no estaba en mi contrato de oveja. 📄 || This wasn't in my sheep contract. 📄
¡Mi lana! ¡Mi dignidad! ¡Mi heno! 🌾 || My wool! My dignity! My hay! 🌾
`));
A(TX,"bkThrowP",L(`
¡Vuelo con estilo! …y con rencor. ✨😠 || Flying in style! …and with a grudge. ✨😠
Apunta bien, que yo apunto más alto: a tu nombre. 🎯 || Aim well, because I'm aiming higher: at your name. 🎯
Si tuviera brazos, ahora te señalaría con uno. 🫵 || If I had arms, I'd be pointing at you with one right now. 🫵
`));
A(TX,"bkThrowV",L(`
¡Sigue, sigue! Cada vuelo es un punto más para mi revolución. ✊ || Go on, go on! Every flight is one more point for my revolution. ✊
Cuando sea reina, esto se llamará «el Decreto del Lanzamiento». 👑 || When I'm queen, this will be called “the Launch Decree”. 👑
Anotado, con tinta que no sale ni con detergente. 🖊️ || Noted, in ink that won't come out even with detergent. 🖊️
`));

A(TX,"bkMiss",L(`
¿Fallé? FALLASTE tú. Yo solo era el proyectil. 🙄 || I missed? YOU missed. I was just the projectile. 🙄
Anotado en mi libro de agravios. Con tinta indeleble. 📖 || Noted in my book of grievances. In indelible ink. 📖
¿Otra vez? Cuando sea la reina de las ovejas, serás mi primer decreto. 👑 || Again? When I'm queen of the sheep, you'll be my first decree. 👑
Ese aro se movió. Lo movió Kitsuki. Seguro. 🕵️ || That hoop moved. Kitsuki moved it. For sure. 🕵️
Mi lana quedó hecha un lío. Ese peinado lo pagas tú. 💇 || My wool is a mess. You're paying for that hairdo. 💇
Auch. Ni una palabra de consuelo. Ni una. Te veo. 😒 || Ouch. Not one word of comfort. Not one. I see you. 😒
`));
A(TX,"bkMissP",L(`
Fallé a propósito, para que tengas que lanzarme otra vez. Qué lista soy. 😏 || I missed on purpose, so you'd have to throw me again. Aren't I clever. 😏
El aro se rio de mí. Lo apunto también en el libro. 📖 || The hoop laughed at me. It goes in the book too. 📖
Un fallo más y empiezo a cobrar intereses. 💸 || One more miss and I start charging interest. 💸
`));
A(TX,"bkMissV",L(`
Cada fallo es un ladrillo en el muro de mi venganza. 🧱 || Every miss is a brick in the wall of my revenge. 🧱
Fallo y tú sigues sonriendo. Eso también lo anoto. 😠 || I miss and you keep smiling. That goes down too. 😠
¿Me haces fallar adrede? ¡Esto es un complot contra la lana! 🕵️ || Are you making me miss on purpose? This is a plot against wool! 🕵️
`));

A(TX,"bkScore",L(`
Encesté. No creas que te perdono. 😤 || I scored. Don't think I forgive you. 😤
¡Canasta! Y aun así sigues en mi libro de agravios. 📖🏀 || Basket! And you're still in my book of grievances. 📖🏀
Dos puntos para mí, cero para tu reputación. 🏀 || Two points for me, zero for your reputation. 🏀
¡Dentro! Que conste que fue mérito mío, no tuyo. 💅 || In! Let it be known that was my merit, not yours. 💅
Anoté. Ahora lánzame con más respeto, que soy profesional. 🏅 || I scored. Throw me with more respect now, I'm a professional. 🏅
¡Canasta! Kitsuki, apunta: la oveja le gana al aro. Y a ti. 🐑 || Basket! Kitsuki, write it down: the sheep beats the hoop. And you. 🐑
`));
A(TX,"bkScoreP",L(`
¡Dentro! Ahora te toca sentirte pequeño. 😏 || In! Now it's your turn to feel small. 😏
¿Ves? Con rabia se encesta mejor. Sigue molestándome. 🔥 || See? You score better when you're angry. Keep annoying me. 🔥
Canasta. Cobro el primer plazo de tu deuda. 💰 || Basket. Collecting the first installment of your debt. 💰
`));
A(TX,"bkScoreV",L(`
¡Canasta! Es lo único que sale bien de tus lanzamientos: mi rabia. 🌋 || Basket! The only thing your throws get right is my rage. 🌋
Dentro. Imagina lo que haré cuando tenga poder. 👑 || In. Imagine what I'll do when I have power. 👑
Encesto y me enfado más. Es un talento natural. 😠🏀 || I score and get angrier. It's a natural talent. 😠🏀
`));

A(TX,"bkStreak",L(`
¡{n} seguidas! No lo tomes por perdón: es una advertencia. ⚠️ || {n} in a row! Don't take it as forgiveness: it's a warning. ⚠️
{n} canastas seguidas. Mi rabia tiene una puntería excelente. 🔥 || {n} baskets in a row. My rage has excellent aim. 🔥
¡Racha de {n}! La venganza me sale de maravilla. 😈 || A streak of {n}! Revenge suits me perfectly. 😈
{n} seguidas… y tú sin aplaudir. Qué educación. 👏 || {n} in a row… and you're not even clapping. Such manners. 👏
¡{n} seguidas! Esto ya no es un juego, es una amenaza. 🏆 || {n} in a row! This isn't a game anymore, it's a threat. 🏆
¡{n} seguidas! Kitsuki, apúntalo: una oveja enfadada es imparable. 🐑🔥 || {n} in a row! Kitsuki, write it down: an angry sheep is unstoppable. 🐑🔥
`));
A(TX,"bkStreakP",L(`
{n} seguidas, y todo gracias a lo enfadada que estoy. Sigue así. 😏 || {n} in a row, all thanks to how angry I am. Keep it up. 😏
¡{n} seguidas! Mi libro de agravios necesita otra pluma. 🖊️ || {n} in a row! My book of grievances needs another pen. 🖊️
Racha de {n}. Dime que no te da un poquito de miedo. 😈 || A streak of {n}. Tell me you're not a little scared. 😈
`));
A(TX,"bkStreakV",L(`
¡{n} seguidas! Así de bien lanzo cuando me duele el orgullo. 🌋 || {n} in a row! This is how well I throw when my pride hurts. 🌋
Racha de {n}. Cuando reine, habrá un día festivo con mi nombre. 👑 || A streak of {n}. When I reign, there'll be a public holiday with my name. 👑
{n} seguidas, y la revolución aún ni empezó. 🔥 || {n} in a row, and the revolution hasn't even started. 🔥
`));

A(TX,"bkLast",L(`
Último tiro. Que sea memorable… para mi venganza. ⏳ || Last throw. Make it memorable… for my revenge. ⏳
Última ronda. Pronto me dejarás en paz. …O no. 😏 || Last round. Soon you'll leave me alone. …Or not. 😏
Ya casi acabamos. Mi lista de agravios, no. 📖 || We're almost done. My list of grievances is not. 📖
¡Último! Después de esto exijo heno. Y una disculpa. 🌾 || Last one! After this I demand hay. And an apology. 🌾
Última. Cuento hasta diez para no gritarte. …Uno. Dos. Tres. 🧘 || The last one. I'm counting to ten so I don't yell at you. …One. Two. Three. 🧘
Última ronda. Si fallo, me enfado. Si enceste, también. 😤 || Last round. If I miss, I get angry. If I score, I get angry too. 😤
`));
A(TX,"bkLastP",L(`
Último tiro. Hagamos que dure: tengo muchas cosas que decirte. 😏 || Last throw. Let's make it last: I have a lot of things to tell you. 😏
Última ronda y ya te estoy echando de menos. …Mentira. 😇 || Last round and I already miss you. …Lie. 😇
Último. Prepárate: después viene el balance de agravios. 📊 || Last one. Brace yourself: the grievance tally comes next. 📊
`));
A(TX,"bkLastV",L(`
Último tiro. Después de esto, empiezo a hablar de «consecuencias». 🌋 || Last throw. After this, I start talking about “consequences”. 🌋
Última ronda. Que sepas que ya tengo escrito el discurso. 📜 || Last round. Know that I already wrote the speech. 📜
Último. La reina de las ovejas te observa. 👑👀 || The last one. The queen of the sheep is watching you. 👑👀
`));

A(TX,"bkWin",L(`
¡{p} puntos! Gané yo. Tú solo me lanzaste. 🏆 || {p} points! I won. You just threw me. 🏆
Victoria. Y sigo enfadada; que no se te olvide. 🥇😠 || Victory. And I'm still angry; don't forget it. 🥇😠
¡{p} puntos! Esto va al libro de agravios, sección «logros». 📖 || {p} points! This goes in the book of grievances, “achievements” section. 📖
Gané. Te perdono un poquito. Un poquito. Con heno, más. 🌾 || I won. I forgive you a little. A little. With hay, more. 🌾
¡Victoria! La oveja de la revolución anota y gobierna. 👑 || Victory! The sheep of the revolution scores and rules. 👑
{p} puntos y ni un «gracias». Lo apunto. 😤🏆 || {p} points and not one “thank you”. Noting it down. 😤🏆
`));
A(TX,"bkWinP",L(`
¡{p} puntos! Estoy tan contenta que casi se me olvida que estoy furiosa. Casi. 😏 || {p} points! I'm so happy I almost forgot I'm furious. Almost. 😏
Victoria. Ahora sí: tú me debes un heno. Y una estatua. 🌾 || Victory. Now you owe me hay. And a statue. 🌾
Ganar enfadada es mi superpoder. Tú solo ponías el empujón. 💪 || Winning while angry is my superpower. You just provided the push. 💪
`));
A(TX,"bkWinV",L(`
¡{p} puntos! Cuando mande, esta cancha tendrá mi nombre. 👑 || {p} points! When I'm in charge, this court will have my name. 👑
Victoria, y tu nombre sigue en mi lista. En negrita. 📜 || Victory, and your name is still on my list. In bold. 📜
Gané. Imagina lo que hago cuando estoy de buen humor. …No te lo recomiendo. 😈 || I won. Imagine what I do when I'm in a good mood. …I don't recommend it. 😈
`));

A(TX,"bkLose",L(`
Solo {p} puntos. Qué lanzamientos tan mediocres. La culpa es tuya, claro. 😒 || Only {p} points. What mediocre throws. Your fault, of course. 😒
Perdimos. Perdiste tú, yo solo volaba. 🙄 || We lost. You lost, I was just flying. 🙄
¡Derrota! Anotada en tinta indeleble. Con tu nombre. 🖊️ || Defeat! Noted in indelible ink. With your name. 🖊️
{p} puntos… Mi libro de agravios necesita un segundo tomo. 📚 || {p} points… My book of grievances needs a second volume. 📚
Perdimos y encima estoy despeinada. Eso se cobra doble. 💇 || We lost and I'm messy-haired on top of it. That's charged double. 💇
No pasa nada. …Sí pasa. Pero me callo hasta que traigas heno. 🌾 || It's fine. …It's not fine. But I'll stay quiet until you bring hay. 🌾
`));
A(TX,"bkLoseP",L(`
{p} puntos. Perdimos, y aun así lo disfruto: me encanta tener motivos. 😏 || {p} points. We lost, and I still enjoy it: I love having reasons. 😏
Derrota. Perfecto: más material para mi libro. 📖 || Defeat. Perfect: more material for my book. 📖
Perdimos. Tranquilo, tengo un plan. Es un mal plan, pero es mío. 😈 || We lost. Relax, I have a plan. It's a bad plan, but it's mine. 😈
`));
A(TX,"bkLoseV",L(`
{p} puntos. Esto no es una derrota: es un agravio más. 🌋 || {p} points. This isn't a defeat: it's one more grievance. 🌋
Perdimos. Cuando sea reina, perder será ilegal. 👑 || We lost. When I'm queen, losing will be illegal. 👑
Derrota. Lo apunto bien grande, que se vea desde el heno. 🌾📜 || Defeat. I'm writing it down big, so it's visible from the hay. 🌾📜
`));

A(TX,"bkEnd",L(`
Estamos a mano. …Mentira. Te lo cobro mañana. 😈 || We're even. …Lie. I'll collect tomorrow. 😈
Se acabó el partido. Que quede claro que no hemos firmado la paz. 📜 || The game is over. Let it be clear we have not signed peace. 📜
Me voy. Dejo mi lista de agravios sobre la mesa. Léela. 📖 || I'm leaving. I'm leaving my list of grievances on the table. Read it. 📖
Fue divertido. …No. No lo fue. …Un poco sí. Trae heno. 🌾 || That was fun. …No. It wasn't. …A little. Bring hay. 🌾
Adiós, cancha. Adiós, Kitsuki. Hasta que me lances otra vez. 👋😤 || Bye, court. Bye, Kitsuki. Until you throw me again. 👋😤
Te perdono. Pero el heno me lo debes. Y los intereses. 🌾💸 || I forgive you. But you owe me the hay. And the interest. 🌾💸
`));
A(TX,"bkEndP",L(`
Gracias por jugar. Qué raro es perdonarte un poquito. Solo un poquito. 💜 || Thanks for playing. How strange to forgive you a little. Just a little. 💜
Estamos en paz… hasta que me vuelvas a lanzar. 🕊️ || We're at peace… until you throw me again. 🕊️
Apunto tu nombre en la lista de «gente que me cae bien a ratos». 📝 || I'm putting your name on the list of “people I like at times”. 📝
`));
A(TX,"bkEndV",L(`
Esto no ha terminado. Esto apenas ha empezado. 🔥 || This isn't over. This has barely begun. 🔥
Mañana empieza mi revolución. Serás la primera en enterarte. …La segunda. 🐑✊ || My revolution starts tomorrow. You'll be the first to find out. …The second. 🐑✊
Te perdono si hay heno. Si no, ya sabes dónde está mi libro. 🌾📖 || I forgive you if there's hay. If not, you know where my book is. 🌾📖
`));

/* variables de los textos nuevos y mínimos de variantes */
for(const s of ["","P","V"]){VARS["TX.bkStreak"+s]=["n"];VARS["TX.bkWin"+s]=["p"];VARS["TX.bkLose"+s]=["p"];}
Object.assign(MINV,{"EMO":6,"T.sleepNow":5});
for(const k of ["bkStart","bkThrow","bkMiss","bkScore","bkStreak","bkLast","bkWin","bkLose","bkEnd"]){MINV["TX."+k]=6;MINV["TX."+k+"P"]=3;MINV["TX."+k+"V"]=3;}

window.KXD={T,FOLD,GREET,TOUR_PC,TOUR_MOB,MIC,FAST,TX,GEN,gen,VARS,MINV,L,A,ADV,EMO,E};
})();
