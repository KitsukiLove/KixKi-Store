/*
  Variantes extra de T (lo frecuente, saludos, fondos, microreacciones, franjas horarias y frases con app y carpeta).
*/

import { A, L } from "./ayudas.js";
import { GREET } from "./carpetas-y-tour.js";
import { MIC } from "./micro-rapidas.js";
import { T } from "./textos.js";
/* --- fondos (3 por fondo; son raros) --- */
const BG = (k, s) => A(T.bg, k, L(s));

export function iniciar() {
  /* =========================================================  VARIANTES NUEVAS (parte 3)  =========================================================
   Formato:  A(objeto,"clave",L(`español || English`)).  Una línea = una frase.  Variables: {hora} {app} {carpeta} en cualquier frase;
   {n} {q} {a} {rec} {sc} {d} solo donde el código las pasa (ver tools/check-dialogs.mjs). */

  /* --- lo frecuente: 15 o más --- */
  A(
    T,
    "tap",
    L(`
¿Otra vez tú? Mi lana tiene límites. 🐑 || You again? My wool has limits. 🐑
Tócame con cariño, que soy patrimonio de la tienda. || Touch me gently, I'm a store heritage site.
Beee. Eso es todo lo que diré sin mi abogado. ⚖️ || Baa. That's all I'll say without my lawyer. ⚖️
Apunto el toque en mi lista. No es venganza, es contabilidad. 📝 || Logging that poke on my list. Not revenge, accounting. 📝
¿Querías algo o solo comprobabas que sigo aquí? 👀 || Did you want something or just check I'm still here? 👀
`)
  );
  A(
    T,
    "praise",
    L(`
Si tuviera manos, te aplaudiría. Tengo pezuñas: tómalo como un aplauso sordo. 👏 || If I had hands I'd clap. I have hooves: take it as a muffled applause. 👏
Con ese criterio, podrías ser mi asesor de lana. 🧶 || With taste like that, you could be my wool advisor. 🧶
Anoto: usuario ejemplar. Va a mi lista buena. 📝✨ || Noting: exemplary user. Going on my good list. 📝✨
`)
  );
  A(
    T,
    "dizzy",
    L(`
¡Para, para! Soy una oveja, no una peonza. 🌀 || Stop, stop! I'm a sheep, not a spinning top. 🌀
Siete toques seguidos… voy a pedir la baja. 🤕 || Seven taps in a row… I'm filing for sick leave. 🤕
Mareo nivel «lana centrifugada». 😵‍💫 || Dizziness level: “spin-dried wool”. 😵‍💫
Me estáis dejando la lana como un remolino. 🌪️ || You're leaving my wool like a whirlwind. 🌪️
`)
  );
  A(
    T,
    "manyRes",
    L(`
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
`)
  );
  A(
    T,
    "favAdd",
    L(`
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
`)
  );
  /* --- eventos con una sola frase → 5 o más --- */
  A(
    T,
    "late",
    L(`
Son las {hora}… hasta las ovejas cuentan menos a estas horas. 🌙 || It's {hora}… even sheep count less at this hour. 🌙
Las {hora}. Yo estoy de guardia, ¿y tú? 🕯️ || {hora}. I'm on watch, how about you? 🕯️
¿Seguimos a las {hora}? Valiente. Yo traigo manta. 🛌 || Still going at {hora}? Brave. I'll bring a blanket. 🛌
A las {hora} las mejores apps se encuentran solas. 🌌 || At {hora} the best apps find themselves. 🌌
Madrugada de apps. Nadie lo sabrá. Solo yo. 🤫 || App night shift. Nobody will know. Only me. 🤫
`)
  );
  A(
    T,
    "wake",
    L(`
¡Ah! ¿Qué? ¡No dormía! Estaba… pensando con los ojos cerrados. 😳 || Huh? What? I wasn't asleep! I was… thinking with my eyes closed. 😳
Mmm… ¿ya es mañana? 🥱 || Mmm… is it tomorrow already? 🥱
Cinco minutitos más… ¡Mentira! Estoy lista. 🐑 || Five more minutes… Lie! I'm ready. 🐑
Me has despertado de un sueño precioso. Había lana por todas partes. 💤 || You woke me from a lovely dream. There was wool everywhere. 💤
¡Buenas! Me quedé dormida contando apps. 🥱 || Hi! I dozed off counting apps. 🥱
`)
  );
  A(
    T,
    "back",
    L(`
¡Volviste! Cuidé la tienda. Casi. 🐑 || You're back! I minded the store. Mostly. 🐑
Ya era hora. Tenía la lista de venganzas al día y nadie a quien enseñársela. 📝 || About time. I had my revenge list up to date and nobody to show it to. 📝
¡Ahí estás! Pensé que te habías ido con otra tienda. 🥺 || There you are! I thought you'd left for another store. 🥺
Bienvenido de nuevo. No toqué nada. Palabra de oveja. 🤞 || Welcome back. I touched nothing. Sheep's honor. 🤞
Qué rápido pasa el tiempo. Son las {hora}. ⏰ || How time flies. It's {hora}. ⏰
`)
  );
  A(
    T,
    "focus",
    L(`
¿Buscas algo? Escribe y te ayudo. 🔎 || Looking for something? Type and I'll help. 🔎
Barra lista. Dime qué app te quita el sueño. 🌙 || Search bar ready. Tell me which app keeps you up. 🌙
Uy, ¡a buscar! Sin prisa, que las apps no huyen. 🐑 || Oh, searching! No rush, apps don't run away. 🐑
Escribe cualquier cosa: nombre, etiqueta, antojo… 💭 || Type anything: name, tag, craving… 💭
Te dejo la barra. Yo miro, calladita. 🤐 || The bar is yours. I'll watch quietly. 🤐
`)
  );
  A(
    T,
    "noRes",
    L(`
Nada con «{q}». Prueba con otra palabra o menos letras. 🔍 || Nothing for “{q}”. Try another word or fewer letters. 🔍
«{q}» no aparece. A lo mejor aún no está… ¡sugiérela! 💌 || “{q}” doesn't show up. Maybe it's not here yet… suggest it! 💌
Cero resultados. Hasta yo me quedé en blanco. 🫥 || Zero results. Even I drew a blank. 🫥
Con «{q}» no encuentro nada. ¿Mayúsculas fuera de sitio? 🧐 || I find nothing for “{q}”. Misplaced capitals? 🧐
Ni rastro de «{q}». Buscaré en mi libreta. 📒 || No trace of “{q}”. I'll check my notebook. 📒
`)
  );
  A(
    T,
    "oneRes",
    L(`
¡Solo una! Es «{a}». Va directa al grano. 🎯 || Just one! It's “{a}”. Straight to the point. 🎯
Una coincidencia: {a}. Poco rebaño, mucha calidad. 🐑 || One match: {a}. Small flock, high quality. 🐑
Solo {a}. A veces menos es más lana. 🧶 || Only {a}. Sometimes less is more wool. 🧶
Encontré justo una: {a}. ¿Será el destino? ✨ || Found exactly one: {a}. Could it be fate? ✨
{a} y nadie más. Qué exclusiva. 😎 || {a} and nobody else. How exclusive. 😎
`)
  );
  A(
    T,
    "fav1",
    L(`
¡Tu primera favorita! Esto es el principio de algo grande. 🌟 || Your first favorite! The start of something big. 🌟
Una estrella y ya tienes lista. Cuidado, que esto engancha. ⭐ || One star and you've got a list. Careful, it's addictive. ⭐
Primera favorita guardada. La mía fue una calculadora. 🧮 || First favorite saved. Mine was a calculator. 🧮
¡Inauguramos favoritas! Rompo una botella de leche. 🥛 || Favorites inaugurated! I'm cracking open a bottle of milk. 🥛
La primera siempre se recuerda. Yo la apunto. 📝 || The first one is always remembered. I'm writing it down. 📝
`)
  );
  A(
    T,
    "fav5",
    L(`
¡{n} favoritas! Ya no es afición, es colección. 🏅 || {n} favorites! That's no hobby, it's a collection. 🏅
{n} estrellas. Me voy a tener que sentar. 🥹 || {n} stars. I'm going to have to sit down. 🥹
Llegaste a {n} favoritas. Mi lista buena se llena de ti. 📝 || You hit {n} favorites. My good list is filling up with you. 📝
{n} favoritas: oficialmente, rebaño propio. 🐑🐑 || {n} favorites: officially, a flock of your own. 🐑🐑
¡{n}! Esto merece un aplauso de pezuñas. 👏 || {n}! That deserves a round of hoof applause. 👏
`)
  );
  A(
    T,
    "favDel",
    L(`
Favorita quitada. No lo tomaré como algo personal. 😌 || Favorite removed. I won't take it personally. 😌
Fuera de la lista. Tendré que reorganizar mi libreta. 📒 || Off the list. I'll have to reorganize my notebook. 📒
Hecho. Los gustos cambian, la lana permanece. 🧶 || Done. Tastes change, wool remains. 🧶
Adiós, estrella. Fue bonito mientras duró. ⭐ || Goodbye, star. It was nice while it lasted. ⭐
Sin favorita. Anotado… con un suspiro. 😮‍💨 || Un-favorited. Noted… with a sigh. 😮‍💨
`)
  );
  A(
    T,
    "night",
    L(`
Modo noche: ahora sí se me ve el brillo de la lana. 🌙 || Night mode: now you can see my wool shimmer. 🌙
Luces fuera. Yo hago guardia. 🕯️ || Lights out. I'm on watch. 🕯️
¡Qué bonito el oscuro! Y qué descanso para los ojos. 😌 || Dark looks lovely! And so restful for the eyes. 😌
Noche cerrada. A estas horas las apps se ven mejor. ✨ || Dead of night. Apps look better at this hour. ✨
Buenas noches, tienda. Buenas noches, lana. 🌌 || Good night, store. Good night, wool. 🌌
`)
  );
  A(
    T,
    "day",
    L(`
¡Se hizo la luz! Mis ojos protestan, pero qué bonito. ☀️ || Let there be light! My eyes protest, but how pretty. ☀️
Modo día: a pastar apps con sol. 🌻 || Day mode: time to graze apps in the sun. 🌻
¡Claro! Ahora sí se ve cada rizo. 🐑 || Bright! Now every curl shows. 🐑
Amanece en la tienda. ☀️ || Dawn breaks in the store. ☀️
Luz total. Que nadie mire mi lana despeinada. 🙈 || Full light. Nobody look at my messy wool. 🙈
`)
  );
  A(
    T,
    "musOn",
    L(`
¡Música! Mis pezuñas ya van solas. 🎶 || Music! My hooves are moving on their own. 🎶
Suena bien. Tienes oído de pro. 🎧 || Sounds good. You've got a pro ear. 🎧
A bailar el vals de la lana. 💃 || Time to waltz with the wool. 💃
Con música todo se instala mejor. 🎵 || Everything installs better with music. 🎵
Subo el volumen del alma. 🔊 || Turning up the volume of the soul. 🔊
`)
  );
  A(
    T,
    "musOff",
    L(`
Silencio. Se oye hasta la lana crecer. 🤫 || Silence. You can hear the wool grow. 🤫
Música fuera. Mis pezuñas piden un descanso. 🛑 || Music off. My hooves ask for a rest. 🛑
Vale, se acabó la fiesta. 😌 || Okay, the party's over. 😌
Sin música también estoy a gusto. Más o menos. 🙂 || I'm fine without music too. More or less. 🙂
Calma total. Me gusta. 🌿 || Total calm. I like it. 🌿
`)
  );
  A(
    T,
    "allDone",
    L(`
¡Has abierto todas las carpetas! Nadie lo había conseguido tan rápido. Bueno, nadie lo había intentado. 🏆 || You opened every folder! Nobody did it that fast. Well, nobody tried. 🏆
¡Todas las carpetas visitadas! Estoy orgullosa… y un poco celosa. 🥹 || Every folder visited! I'm proud… and a bit jealous. 🥹
Exploración completa. Te nombro guía honorario. 🧭 || Exploration complete. I name you honorary guide. 🧭
No queda carpeta por abrir. ¿Y ahora qué hacemos? 😳 || No folder left to open. Now what do we do? 😳
Todas abiertas. Mi lista de «cosas por mostrarte» está vacía. 📝 || All open. My “things to show you” list is empty. 📝
`)
  );
  A(
    T,
    "gStart",
    L(`
¡A saltar vallas! No me mires, me pongo nerviosa. 🐑 || Let's jump hurdles! Don't look at me, I get nervous. 🐑
Concentración, lana, concentración. 🧘 || Focus, wool, focus. 🧘
¡Vamos! Yo animo desde aquí. 📣 || Come on! I'll cheer from here. 📣
Las vallas no se saltan solas… ¿o sí? 🤔 || Hurdles don't jump themselves… or do they? 🤔
Que empiece el espectáculo. 🎪 || Let the show begin. 🎪
`)
  );
  A(
    T,
    "gStartRec",
    L(`
Tu récord es {rec}. Superarlo sería un gran detalle. 🏅 || Your record is {rec}. Beating it would be a nice gesture. 🏅
{rec} es tu marca. ¡Yo creo en ti! 💪 || {rec} is your mark. I believe in you! 💪
A por esos {rec}. La lana te acompaña. 🧶 || Go for those {rec}. The wool is with you. 🧶
Récord a batir: {rec}. Presión cero. Bueno, un poco. 😬 || Record to beat: {rec}. Zero pressure. Well, a little. 😬
{rec}… no es poco. Veamos qué haces. 👀 || {rec}… that's not nothing. Let's see what you've got. 👀
`)
  );
  A(
    T,
    "gRecord",
    L(`
¡NUEVO RÉCORD! Esto va directo a mi libreta de leyendas. 🏆 || NEW RECORD! This goes straight in my notebook of legends. 🏆
¡Récord! Me emociono, y eso que soy de lana. 🥹 || Record! I'm moved, and I'm made of wool. 🥹
¡Has superado tu marca! Un balido de honor. 🐑🎉 || You beat your mark! A baa of honor. 🐑🎉
¡Increíble! Hasta las vallas aplauden. 👏 || Incredible! Even the hurdles applaud. 👏
Récord batido. Voy a necesitar un pañuelo. 😭 || Record broken. I'm going to need a tissue. 😭
`)
  );
  A(
    T,
    "gOverRec",
    L(`
¡Terminaste con {sc} y es récord! Lo tuyo es de pro. 🏆 || You finished with {sc} and it's a record! Pro stuff. 🏆
{sc} puntos y marca nueva. ¡Brava! 🎉 || {sc} points and a new mark. Bravo! 🎉
Nuevo récord: {sc}. Lo apunto con letras doradas. ✨ || New record: {sc}. Writing it in gold letters. ✨
¡{sc}! Eso es subir el listón (y las vallas). 🚀 || {sc}! That's raising the bar (and the hurdles). 🚀
Récord: {sc}. Me quedo sin palabras. Casi. 🥹 || Record: {sc}. I'm speechless. Almost. 🥹
`)
  );
  A(
    T,
    "gOverFirst",
    L(`
Primera partida: {sc}. Todo el mundo empieza en algún lado. 🌱 || First game: {sc}. Everybody starts somewhere. 🌱
{sc} en tu debut. No está mal para ser novato. 👏 || {sc} on your debut. Not bad for a rookie. 👏
¡{sc}! Ya tienes una marca que superar. 🎯 || {sc}! Now you've got a mark to beat. 🎯
Debut con {sc}. La próxima será mejor, ya verás. 🐑 || Debut with {sc}. The next one will be better, you'll see. 🐑
{sc} puntos. Mi primera vez fue peor. Creo. 🙈 || {sc} points. My first time was worse. I think. 🙈
`)
  );
  A(
    T,
    "gOverZero",
    L(`
Cero. Un cero con mucho carácter. ⭕ || Zero. A zero with plenty of character. ⭕
¡Cero! Nadie te quita la valentía de intentarlo. 💪 || Zero! Nobody takes away your courage to try. 💪
Ni una valla. Pero qué estilo. 😎 || Not a single hurdle. But what style. 😎
Empezamos de cero, que es un buen sitio para crecer. 🌱 || We start from zero, a fine place to grow. 🌱
Cero puntos y yo sigo creyendo en ti. 🥹 || Zero points and I still believe in you. 🥹
`)
  );
  A(
    T,
    "gOverNear",
    L(`
¡{sc}! Por muy poco no es récord. 😭 || {sc}! So close to a record. 😭
Casi, casi: {sc}. Otro intento y cae. 💪 || Almost, almost: {sc}. One more try and it falls. 💪
{sc}… a un pelo de tu marca. Se me encoge la lana. 🧶 || {sc}… a hair from your mark. My wool shrinks. 🧶
Qué cerca: {sc}. Yo repetiría. 🔁 || So close: {sc}. I'd go again. 🔁
{sc} puntos. La marca te respira en la nuca. 👀 || {sc} points. The record is breathing down your neck. 👀
`)
  );
  A(
    T,
    "gOver",
    L(`
{sc} puntos. La próxima vez, más. O igual. Tú sabrás. 🐑 || {sc} points. Next time, more. Or the same. Your call. 🐑
Terminaste con {sc}. Respiremos y a por otra. 😮‍💨 || You finished with {sc}. Breathe, then another go. 😮‍💨
{sc}. Esa valla no la vi venir tampoco. 🙈 || {sc}. I didn't see that hurdle coming either. 🙈
Partida de {sc}. Anotada para la posteridad. 📝 || A game of {sc}. Logged for posterity. 📝
{sc} puntos. Las vallas ganan esta ronda. 🏁 || {sc} points. The hurdles win this round. 🏁
Fin: {sc}. Ni tan mal, ni tan bien: tan oveja. 🐑 || End: {sc}. Not that bad, not that good: very sheep. 🐑
`)
  );
  A(
    T,
    "facts",
    L(`
Las ovejas podemos reconocer rostros durante años. Yo recuerdo hasta quién me lanzó. 😌 || Sheep can recognize faces for years. I even remember who threw me. 😌
Toda la lana de esta tienda es código abierto. 🧶 || All the wool in this store is open source. 🧶
Mi lista de apps aprobadas tiene más entradas que mi lista de venganzas. Por poco. 📝 || My approved apps list has more entries than my revenge list. Barely. 📝
Dato real: dormir con una app instalada no la actualiza. Actualiza tú. 🔄 || Real fact: sleeping with an app installed doesn't update it. You do it. 🔄
`)
  );
  A(
    T,
    "prog",
    L(`
Vas avanzando de maravilla. 📈 || You're progressing wonderfully. 📈
Cada paso cuenta. Y yo los cuento todos. 👣 || Every step counts. And I count them all. 👣
Qué progreso. Mi lista buena crece. 📝 || Such progress. My good list grows. 📝
Poco a poco, que la lana se teje despacio. 🧶 || Little by little, wool is woven slowly. 🧶
`)
  );
  /* --- saludos --- */
  A(
    GREET,
    "night",
    L(`
¿Todavía por aquí a las {hora}? Yo hago guardia contigo. 🌙 || Still here at {hora}? I'll keep watch with you. 🌙
Buenas noches. La tienda está tranquila… sospechosamente tranquila. 🕯️ || Good evening. The store is quiet… suspiciously quiet. 🕯️
¡Madrugador nocturno! Bienvenido. 🦉 || Night owl! Welcome. 🦉
A estas horas las apps se instalan con más misterio. 🌌 || At this hour apps install with more mystery. 🌌
Bienvenido, trasnochador. Yo ya tenía la lana en rulos. 💤 || Welcome, night owl. My wool was already in curlers. 💤
`)
  );
  A(
    GREET,
    "morning",
    L(`
Buenos días. Son las {hora}: justo para estrenar apps. ☀️ || Good morning. It's {hora}: just right to try new apps. ☀️
¡Arriba! La lana ya está peinada. 🐑 || Rise and shine! My wool is already combed. 🐑
Buen día. ¿Café, tostada o una app nueva? ☕ || Good day. Coffee, toast or a new app? ☕
¡Qué bien que vengas temprano! Hoy me siento productiva. 📝 || Glad you came early! I feel productive today. 📝
Mañana fresca y tienda abierta. ¡Vamos! 🌄 || Fresh morning and store open. Let's go! 🌄
`)
  );
  A(
    GREET,
    "afternoon",
    L(`
Buenas tardes. ¿Qué buscamos a las {hora}? 🐑 || Good afternoon. What are we after at {hora}? 🐑
Tarde perfecta para explorar carpetas. 🗂️ || Perfect afternoon to explore folders. 🗂️
¡Hola! La tarde pide una app nueva. 🌤️ || Hello! The afternoon calls for a new app. 🌤️
Justo a tiempo: acabo de ordenar mi libreta. 📒 || Just in time: I just tidied my notebook. 📒
Bienvenido de nuevo a la tienda de la lana. 🧶 || Welcome back to the wool store. 🧶
`)
  );
  A(
    GREET,
    "evening",
    L(`
Buenas noches. Qué gusto verte por aquí. 🌙 || Good evening. So nice to see you here. 🌙
Anochece y la tienda sigue abierta. 🌆 || Dusk falls and the store is still open. 🌆
Hola. Son las {hora}, hora ideal para curiosear. 🕯️ || Hello. It's {hora}, perfect time to browse. 🕯️
¡Bienvenido! Te guardé el mejor rincón. 🛋️ || Welcome! I saved you the best corner. 🛋️
Noche de apps. Me encanta. 🌠 || App night. I love it. 🌠
`)
  );
  A(
    GREET,
    "away",
    L(`
¡Han pasado {d} días! Pensé que me habías sustituido por otra oveja. 😤 || It's been {d} days! I thought you'd replaced me with another sheep. 😤
{d} días sin verte. Mi lista de «cosas que contarte» creció mucho. 📝 || {d} days without you. My “things to tell you” list grew a lot. 📝
¡Por fin! {d} días de silencio y yo, ahí, pastando sola. 🥺 || Finally! {d} days of silence and me, grazing alone. 🥺
Volviste tras {d} días. Te perdono. Esta vez. 😌 || You came back after {d} days. I forgive you. This time. 😌
{d} días… ¡cómo pasa el tiempo! Pero aquí sigo. 🐑 || {d} days… how time flies! But I'm still here. 🐑
`)
  );
  A(
    GREET,
    "news1",
    L(`
Hay una app nueva esperándote en «Novedades». 🆕 || There's a new app waiting for you in “New”. 🆕
Ojo: una novedad recién horneada. 🥐 || Heads up: one freshly baked newcomer. 🥐
Una app nueva. Yo ya la miré. Mmm… ve tú. 👀 || One new app. I already looked at it. Hmm… go see. 👀
Tienes 1 novedad. Qué ilusión. 🎁 || You've got 1 new app. How exciting. 🎁
Algo nuevo en la tienda. ¡Corre! 🏃 || Something new in the store. Run! 🏃
`)
  );
  A(
    GREET,
    "newsN",
    L(`
Hay {n} apps nuevas esperándote. ¡Qué semana! 🆕 || {n} new apps are waiting for you. What a week! 🆕
{n} novedades recién horneadas en «Novedades». 🥐 || {n} freshly baked newcomers in “New”. 🥐
Ojo: {n} apps nuevas. Mi libreta no da abasto. 📒 || Heads up: {n} new apps. My notebook can't keep up. 📒
{n} novedades. Yo empezaría por la primera. 👆 || {n} new apps. I'd start with the first. 👆
Llegaron {n} apps nuevas. ¡Fiesta de lana! 🎉 || {n} new apps arrived. Wool party! 🎉
`)
  );
  BG(
    "",
    `
Fondo clásico. Elegante como yo. 😌 || Classic backdrop. Elegant like me. 😌
Sin decorar: el minimalismo me favorece. ✨ || Undecorated: minimalism suits me. ✨
Vuelvo al fondo de siempre. Sin sorpresas. 🙂 || Back to the usual backdrop. No surprises. 🙂
`
  );
  BG(
    "valle",
    `
El valle… mi hogar espiritual. 🌄 || The valley… my spiritual home. 🌄
Verde por todas partes. Ya me veo pastando. 🌿 || Green everywhere. I can picture myself grazing. 🌿
Qué paz de valle. Casi no se oye el Plan. 🕊️ || Such valley peace. You can barely hear the Plan. 🕊️
`
  );
  BG(
    "primavera",
    `
¡Primavera! Se me rizan hasta las ideas. 🌸 || Spring! Even my ideas are curling. 🌸
Flores y lana: combinan de maravilla. 🌼 || Flowers and wool: a perfect match. 🌼
Huele a hierba nueva. Mmm. 🌱 || Smells like fresh grass. Mmm. 🌱
`
  );
  BG(
    "verano",
    `
¡Verano! Alguien que me esquile, por favor. ☀️ || Summer! Somebody shear me, please. ☀️
Sol, playa y apps. Mi plan perfecto. 🏖️ || Sun, beach and apps. My perfect plan. 🏖️
Qué calor. Yo me quedo a la sombra de una carpeta. 🧴 || So hot. I'm staying in the shade of a folder. 🧴
`
  );
  BG(
    "otono",
    `
Otoño: hojas, mantas y lana de temporada. 🍂 || Autumn: leaves, blankets and seasonal wool. 🍂
Crujen las hojas. Me encanta pisarlas con pezuña. 🍁 || Leaves crunch. I love stomping them with a hoof. 🍁
Tiempo de suéteres. Yo ya llevo uno puesto. 🧶 || Sweater season. I'm already wearing one. 🧶
`
  );
  BG(
    "invierno",
    `
¡Invierno! Por fin mi lana sirve de algo. ❄️ || Winter! At last my wool is useful. ❄️
Qué frío. Pásame una manta de la tienda. 🧣 || So cold. Pass me a store blanket. 🧣
Nieve. Mis pezuñas dejan huellas muy elegantes. 🐾 || Snow. My hooves leave very elegant prints. 🐾
`
  );
  BG(
    "halloween",
    `
¡Halloween! Me disfrazaré de oveja. Ah, ya lo soy. 🎃 || Halloween! I'll dress up as a sheep. Oh, I already am. 🎃
Uuuh… ¿quién apagó la luz? 👻 || Ooooh… who turned off the light? 👻
Truco o trato: dame una app y no te lanzo. 🍬 || Trick or treat: give me an app and I won't throw you. 🍬
`
  );
  BG(
    "navidad",
    `
¡Felices fiestas! Me pongo la bufanda buena. 🎄 || Happy holidays! I'm wearing the good scarf. 🎄
Navidad: época de regalar apps (y lana). 🎁 || Christmas: the season of gifting apps (and wool). 🎁
Hasta mi lista de venganzas hace una pausa navideña. 🕊️ || Even my revenge list takes a Christmas break. 🕊️
`
  );
  BG(
    "auto",
    `
Fondo automático: el día decide por mí. 🌦️ || Automatic backdrop: the day decides for me. 🌦️
Dejo que el calendario elija. Muy sensato. 📅 || I'll let the calendar choose. Very sensible. 📅
Modo auto: me adapto a todo. Menos a que me lancen. 😒 || Auto mode: I adapt to everything. Except being thrown. 😒
`
  );
  /* --- microreacciones: 15 por evento frecuente --- */
  A(
    MIC,
    "grab",
    L(`
¡Eh, eh, eh! || Hey, hey, hey!
🫨 || 🫨
¡Suéltame! || Let go!
Qué descaro. || The nerve.
¡Mi dignidad! || My dignity!
`)
  );
  A(
    MIC,
    "soft",
    L(`
¡Sin un rizo! || Not a curl!
Bien. || Fine.
🙂 || 🙂
Gracias. || Thanks.
Digna. || Dignified.
¡Pies al suelo! || Feet down!
😮‍💨 || 😮‍💨
`)
  );
  A(
    MIC,
    "hard",
    L(`
¡Mi lana! || My wool!
¡Ay, ay! || Ow, ow!
Lo apunto. || Writing it down.
🤕 || 🤕
Qué golpe. || What a thud.
¡Ufff! || Oof!
Testigos. || Witnesses.
🙃 || 🙃
`)
  );
  A(
    MIC,
    "close",
    L(`
¡Hasta luego! || See you!
¡Pum! || Bam!
Cerrado. || Closed.
🫡 || 🫡
Una menos. || One less.
Ordenadito. || Neat and tidy.
✌️ || ✌️
¡Fuera! || Out!
`)
  );
  /* --- frases por franja horaria (se mezclan con los datos curiosos) --- */
  T.tod = {};
  A(
    T.tod,
    "morning",
    L(`
Buenos días de nuevo: son las {hora}. ¿Qué app va a estrenar tu mañana? ☀️ || Good morning again: it's {hora}. Which app will kick off your morning? ☀️
A estas horas la lana está más suave. Y yo, de mejor humor. 🐑 || At this hour my wool is softer. And I'm in a better mood. 🐑
Primer café, primera app. Ese es el orden correcto. ☕ || First coffee, first app. That's the right order. ☕
Mañana de apps. Llevo ya {hora} despierta, no me juzgues. 🥱 || App morning. I've been up since {hora}, don't judge. 🥱
La mañana es buena para ordenar favoritas. ⭐ || Morning is great for tidying favorites. ⭐
Hoy la lista de venganzas empieza vacía. Aprovecha. 📝 || Today my revenge list starts empty. Take advantage. 📝
`)
  );
  A(
    T.tod,
    "afternoon",
    L(`
Son las {hora}. La digestión de apps es lenta; no te agobies. 🐑 || It's {hora}. App digestion is slow; don't stress. 🐑
Tarde ideal para probar algo de «{carpeta}». 🗂️ || Ideal afternoon to try something from “{carpeta}”. 🗂️
A esta hora solía echarme una siesta. Hoy trabajo. 💼 || I used to nap at this hour. Today I work. 💼
Mitad del día: ¿has mirado «Novedades»? 🆕 || Midday: have you checked “New”? 🆕
Tarde de apps y lana. No pido más. 🧶 || Afternoon of apps and wool. I ask for nothing more. 🧶
Las {hora}: justo la hora de una buena recomendación. 💡 || {hora}: just the time for a good recommendation. 💡
`)
  );
  A(
    T.tod,
    "evening",
    L(`
Atardece. Buen momento para repasar tus favoritas. ⭐ || Dusk. A good moment to review your favorites. ⭐
Son las {hora}. La tienda baja la voz. 🌆 || It's {hora}. The store lowers its voice. 🌆
Noche cerca: ¿pasamos al modo oscuro? 🌙 || Night is near: shall we go dark mode? 🌙
A las {hora} ya no me lanzan tanto. Qué paz. 😌 || At {hora} I don't get thrown as much. Such peace. 😌
Tarde-noche: ideal para instalar con calma. 🛋️ || Early evening: ideal for calm installing. 🛋️
Hoy llevas buen ritmo de apps. Orgullosa. 🥹 || You're keeping a good app pace today. Proud. 🥹
`)
  );
  A(
    T.tod,
    "night",
    L(`
Las {hora}. Mañana también habrá apps, ¿sabes? 💤 || {hora}. There'll be apps tomorrow too, you know. 💤
A estas horas hasta las vallas duermen. 🛌 || At this hour even the hurdles sleep. 🛌
Silencio, noche y lana. Mi trío favorito. 🌙 || Silence, night and wool. My favorite trio. 🌙
{hora}… tu futuro tú te lo agradecerá si descansas. 😴 || {hora}… future you will thank you if you rest. 😴
La noche es de las ovejas. Dicen. 🐑 || The night belongs to the sheep. So they say. 🐑
Hora de conspirar… digo, de descansar. 🤫 || Time to scheme… I mean, to rest. 🤫
`)
  );
  /* --- frases con variables de contexto: una app y su carpeta reales --- */
  T.appTips = L(`
¿Has probado «{app}»? Vive en «{carpeta}». 🐑 || Have you tried “{app}”? It lives in “{carpeta}”. 🐑
Mira en «{carpeta}»: ahí está «{app}», y tiene buena pinta. 👀 || Look in “{carpeta}”: “{app}” is there, and it looks good. 👀
Mi apuesta de las {hora}: «{app}». 🎯 || My {hora} pick: “{app}”. 🎯
«{app}» está en «{carpeta}». Lo digo por si lo buscabas. 🔎 || “{app}” is in “{carpeta}”. Just in case you were looking. 🔎
Apunto en mi lista buena: «{app}». Léela con calma. 📝 || Adding to my good list: “{app}”. Read it calmly. 📝
Si hoy no sabes qué instalar, «{app}» nunca falla. 🧶 || If you don't know what to install today, “{app}” never fails. 🧶
Un paseo por «{carpeta}» no hace daño. Empieza por «{app}». 🚶 || A stroll through “{carpeta}” never hurts. Start with “{app}”. 🚶
`);
}
