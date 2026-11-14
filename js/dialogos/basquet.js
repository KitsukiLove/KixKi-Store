/*
  Frases del básquet: Kixki muy enfadada con quien la lanza (TX.bk*), con variantes pícaras y vengativas.
*/

import { A, L } from "./ayudas.js";
import { MINV, VARS } from "./generador.js";
import { TX } from "./travesuras.js";
export function iniciar() {
  /* ---------- básquet: Kixki muy enfadada con quien la lanza ----------
   Fases: bkStart (empieza la partida) · bkThrow (cada lanzamiento) · bkMiss (fallo) · bkScore (encesta) · bkStreak (racha, {n})
   · bkLast (último tiro) · bkWin / bkLose (fin de la partida, {p} puntos) · bkEnd (al cerrar la ventana, {p}).
   Cada fase: lista base (≥ 6) + <fase>P (pícara, ≥ 3) + <fase>V (vengativa, ≥ 3). basket.js elige según mood() de kixki3.js. */
  A(
    TX,
    "bkStart",
    L(`
Esto lo vas a pagar… en forma de molestia. 😠 || You're going to pay for this… in the form of annoyance. 😠
Me tiraste a una cancha. A MÍ. Va directo al libro de agravios. 📖 || You threw me onto a court. ME. Straight into the book of grievances. 📖
Kitsuki, empieza el partido y empieza mi lista de cuentas pendientes. 📝 || Kitsuki, the game starts and so does my list of unpaid debts. 📝
Me caí por tu culpa y ahora quieres que enceste. Qué descaro. 😤 || I fell because of you and now you want me to score. The nerve. 😤
Ni una palabra. Lánzame sin mirarme. Te miro yo a ti. 👀 || Not a word. Launch me without looking at me. I'm the one looking at you. 👀
Que conste: juego por obligación, no por amistad. Y lo escribí. ✍️ || Let it be known: I play out of duty, not friendship. And I wrote it down. ✍️
`)
  );
  A(
    TX,
    "bkStartP",
    L(`
Voy a jugar de maravilla… solo para que te sientas culpable. 😏 || I'll play wonderfully… just to make you feel guilty. 😏
Plan «Lana Total», fase cancha. Tú lánzame, yo hago el resto. 😈 || Plan “Total Wool”, court phase. You launch me, I'll do the rest. 😈
Sonríe, que me acuerdo de todo. Cada tiro. Cada. Tiro. 😇 || Smile, I remember everything. Every throw. Every. Single. One. 😇
`)
  );
  A(
    TX,
    "bkStartV",
    L(`
Otra vez a la cancha… Cuando sea reina, esto será delito. 👑 || Back on the court… When I'm queen, this will be a crime. 👑
Mi paciencia tiene un límite y vives pegado a él. 🌋 || My patience has a limit and you live right next to it. 🌋
Tu nombre ya sale en negrita en mi lista. 📜 || Your name is already in bold on my list. 📜
`)
  );
  A(
    TX,
    "bkThrow",
    L(`
¡AAAAH! ¡Esto es abuso de oveja! 🐑💢 || AAAH! This is sheep abuse! 🐑💢
Adelantaré mi revolución. Y que Kitsuki se entere. …Pensándolo bien, mejor no le digas. 🤫 || I'll move my revolution forward. And let Kitsuki find out. …On second thought, better not say a word. 🤫
¡Lo anoto! ¡Lo anoto en pleno vuelo! 📝 || I'm writing it down! Right in mid-flight! 📝
Si caigo mal, oirás mi lista de quejas entera. 📣 || If I land badly, you'll hear my whole list of complaints. 📣
Esto no estaba en mi contrato de oveja. 📄 || This wasn't in my sheep contract. 📄
¡Mi lana! ¡Mi dignidad! ¡Mi heno! 🌾 || My wool! My dignity! My hay! 🌾
`)
  );
  A(
    TX,
    "bkThrowP",
    L(`
¡Vuelo con estilo! …y con rencor. ✨😠 || Flying in style! …and with a grudge. ✨😠
Apunta bien, que yo apunto más alto: a tu nombre. 🎯 || Aim well, because I'm aiming higher: at your name. 🎯
Si tuviera brazos, ahora te señalaría con uno. 🫵 || If I had arms, I'd be pointing at you with one right now. 🫵
`)
  );
  A(
    TX,
    "bkThrowV",
    L(`
¡Sigue, sigue! Cada vuelo es un punto más para mi revolución. ✊ || Go on, go on! Every flight is one more point for my revolution. ✊
Cuando sea reina, esto se llamará «el Decreto del Lanzamiento». 👑 || When I'm queen, this will be called “the Launch Decree”. 👑
Anotado, con tinta que no sale ni con detergente. 🖊️ || Noted, in ink that won't come out even with detergent. 🖊️
`)
  );
  A(
    TX,
    "bkMiss",
    L(`
¿Fallé? FALLASTE tú. Yo solo era el proyectil. 🙄 || I missed? YOU missed. I was just the projectile. 🙄
Anotado en mi libro de agravios. Con tinta indeleble. 📖 || Noted in my book of grievances. In indelible ink. 📖
¿Otra vez? Cuando sea la reina de las ovejas, serás mi primer decreto. 👑 || Again? When I'm queen of the sheep, you'll be my first decree. 👑
Ese aro se movió. Lo movió Kitsuki. Seguro. 🕵️ || That hoop moved. Kitsuki moved it. For sure. 🕵️
Mi lana quedó hecha un lío. Ese peinado lo pagas tú. 💇 || My wool is a mess. You're paying for that hairdo. 💇
Auch. Ni una palabra de consuelo. Ni una. Te veo. 😒 || Ouch. Not one word of comfort. Not one. I see you. 😒
`)
  );
  A(
    TX,
    "bkMissP",
    L(`
Fallé a propósito, para que tengas que lanzarme otra vez. Qué lista soy. 😏 || I missed on purpose, so you'd have to throw me again. Aren't I clever. 😏
El aro se rio de mí. Lo apunto también en el libro. 📖 || The hoop laughed at me. It goes in the book too. 📖
Un fallo más y empiezo a cobrar intereses. 💸 || One more miss and I start charging interest. 💸
`)
  );
  A(
    TX,
    "bkMissV",
    L(`
Cada fallo es un ladrillo en el muro de mi venganza. 🧱 || Every miss is a brick in the wall of my revenge. 🧱
Fallo y tú sigues sonriendo. Eso también lo anoto. 😠 || I miss and you keep smiling. That goes down too. 😠
¿Me haces fallar adrede? ¡Esto es un complot contra la lana! 🕵️ || Are you making me miss on purpose? This is a plot against wool! 🕵️
`)
  );
  A(
    TX,
    "bkScore",
    L(`
Encesté. No creas que te perdono. 😤 || I scored. Don't think I forgive you. 😤
¡Canasta! Y aun así sigues en mi libro de agravios. 📖🏀 || Basket! And you're still in my book of grievances. 📖🏀
Dos puntos para mí, cero para tu reputación. 🏀 || Two points for me, zero for your reputation. 🏀
¡Dentro! Que conste que fue mérito mío, no tuyo. 💅 || In! Let it be known that was my merit, not yours. 💅
Anoté. Ahora lánzame con más respeto, que soy profesional. 🏅 || I scored. Throw me with more respect now, I'm a professional. 🏅
¡Canasta! Kitsuki, apunta: la oveja le gana al aro. Y a ti. 🐑 || Basket! Kitsuki, write it down: the sheep beats the hoop. And you. 🐑
`)
  );
  A(
    TX,
    "bkScoreP",
    L(`
¡Dentro! Ahora te toca sentirte pequeño. 😏 || In! Now it's your turn to feel small. 😏
¿Ves? Con rabia se encesta mejor. Sigue molestándome. 🔥 || See? You score better when you're angry. Keep annoying me. 🔥
Canasta. Cobro el primer plazo de tu deuda. 💰 || Basket. Collecting the first installment of your debt. 💰
`)
  );
  A(
    TX,
    "bkScoreV",
    L(`
¡Canasta! Es lo único que sale bien de tus lanzamientos: mi rabia. 🌋 || Basket! The only thing your throws get right is my rage. 🌋
Dentro. Imagina lo que haré cuando tenga poder. 👑 || In. Imagine what I'll do when I have power. 👑
Encesto y me enfado más. Es un talento natural. 😠🏀 || I score and get angrier. It's a natural talent. 😠🏀
`)
  );
  A(
    TX,
    "bkStreak",
    L(`
¡{n} seguidas! No lo tomes por perdón: es una advertencia. ⚠️ || {n} in a row! Don't take it as forgiveness: it's a warning. ⚠️
{n} canastas seguidas. Mi rabia tiene una puntería excelente. 🔥 || {n} baskets in a row. My rage has excellent aim. 🔥
¡Racha de {n}! La venganza me sale de maravilla. 😈 || A streak of {n}! Revenge suits me perfectly. 😈
{n} seguidas… y tú sin aplaudir. Qué educación. 👏 || {n} in a row… and you're not even clapping. Such manners. 👏
¡{n} seguidas! Esto ya no es un juego, es una amenaza. 🏆 || {n} in a row! This isn't a game anymore, it's a threat. 🏆
¡{n} seguidas! Kitsuki, apúntalo: una oveja enfadada es imparable. 🐑🔥 || {n} in a row! Kitsuki, write it down: an angry sheep is unstoppable. 🐑🔥
`)
  );
  A(
    TX,
    "bkStreakP",
    L(`
{n} seguidas, y todo gracias a lo enfadada que estoy. Sigue así. 😏 || {n} in a row, all thanks to how angry I am. Keep it up. 😏
¡{n} seguidas! Mi libro de agravios necesita otra pluma. 🖊️ || {n} in a row! My book of grievances needs another pen. 🖊️
Racha de {n}. Dime que no te da un poquito de miedo. 😈 || A streak of {n}. Tell me you're not a little scared. 😈
`)
  );
  A(
    TX,
    "bkStreakV",
    L(`
¡{n} seguidas! Así de bien lanzo cuando me duele el orgullo. 🌋 || {n} in a row! This is how well I throw when my pride hurts. 🌋
Racha de {n}. Cuando reine, habrá un día festivo con mi nombre. 👑 || A streak of {n}. When I reign, there'll be a public holiday with my name. 👑
{n} seguidas, y la revolución aún ni empezó. 🔥 || {n} in a row, and the revolution hasn't even started. 🔥
`)
  );
  A(
    TX,
    "bkLast",
    L(`
Último tiro. Que sea memorable… para mi venganza. ⏳ || Last throw. Make it memorable… for my revenge. ⏳
Última ronda. Pronto me dejarás en paz. …O no. 😏 || Last round. Soon you'll leave me alone. …Or not. 😏
Ya casi acabamos. Mi lista de agravios, no. 📖 || We're almost done. My list of grievances is not. 📖
¡Último! Después de esto exijo heno. Y una disculpa. 🌾 || Last one! After this I demand hay. And an apology. 🌾
Última. Cuento hasta diez para no gritarte. …Uno. Dos. Tres. 🧘 || The last one. I'm counting to ten so I don't yell at you. …One. Two. Three. 🧘
Última ronda. Si fallo, me enfado. Si enceste, también. 😤 || Last round. If I miss, I get angry. If I score, I get angry too. 😤
`)
  );
  A(
    TX,
    "bkLastP",
    L(`
Último tiro. Hagamos que dure: tengo muchas cosas que decirte. 😏 || Last throw. Let's make it last: I have a lot of things to tell you. 😏
Última ronda y ya te estoy echando de menos. …Mentira. 😇 || Last round and I already miss you. …Lie. 😇
Último. Prepárate: después viene el balance de agravios. 📊 || Last one. Brace yourself: the grievance tally comes next. 📊
`)
  );
  A(
    TX,
    "bkLastV",
    L(`
Último tiro. Después de esto, empiezo a hablar de «consecuencias». 🌋 || Last throw. After this, I start talking about “consequences”. 🌋
Última ronda. Que sepas que ya tengo escrito el discurso. 📜 || Last round. Know that I already wrote the speech. 📜
Último. La reina de las ovejas te observa. 👑👀 || The last one. The queen of the sheep is watching you. 👑👀
`)
  );
  A(
    TX,
    "bkWin",
    L(`
¡{p} puntos! Gané yo. Tú solo me lanzaste. 🏆 || {p} points! I won. You just threw me. 🏆
Victoria. Y sigo enfadada; que no se te olvide. 🥇😠 || Victory. And I'm still angry; don't forget it. 🥇😠
¡{p} puntos! Esto va al libro de agravios, sección «logros». 📖 || {p} points! This goes in the book of grievances, “achievements” section. 📖
Gané. Te perdono un poquito. Un poquito. Con heno, más. 🌾 || I won. I forgive you a little. A little. With hay, more. 🌾
¡Victoria! La oveja de la revolución anota y gobierna. 👑 || Victory! The sheep of the revolution scores and rules. 👑
{p} puntos y ni un «gracias». Lo apunto. 😤🏆 || {p} points and not one “thank you”. Noting it down. 😤🏆
`)
  );
  A(
    TX,
    "bkWinP",
    L(`
¡{p} puntos! Estoy tan contenta que casi se me olvida que estoy furiosa. Casi. 😏 || {p} points! I'm so happy I almost forgot I'm furious. Almost. 😏
Victoria. Ahora sí: tú me debes un heno. Y una estatua. 🌾 || Victory. Now you owe me hay. And a statue. 🌾
Ganar enfadada es mi superpoder. Tú solo ponías el empujón. 💪 || Winning while angry is my superpower. You just provided the push. 💪
`)
  );
  A(
    TX,
    "bkWinV",
    L(`
¡{p} puntos! Cuando mande, esta cancha tendrá mi nombre. 👑 || {p} points! When I'm in charge, this court will have my name. 👑
Victoria, y tu nombre sigue en mi lista. En negrita. 📜 || Victory, and your name is still on my list. In bold. 📜
Gané. Imagina lo que hago cuando estoy de buen humor. …No te lo recomiendo. 😈 || I won. Imagine what I do when I'm in a good mood. …I don't recommend it. 😈
`)
  );
  A(
    TX,
    "bkLose",
    L(`
Solo {p} puntos. Qué lanzamientos tan mediocres. La culpa es tuya, claro. 😒 || Only {p} points. What mediocre throws. Your fault, of course. 😒
Perdimos. Perdiste tú, yo solo volaba. 🙄 || We lost. You lost, I was just flying. 🙄
¡Derrota! Anotada en tinta indeleble. Con tu nombre. 🖊️ || Defeat! Noted in indelible ink. With your name. 🖊️
{p} puntos… Mi libro de agravios necesita un segundo tomo. 📚 || {p} points… My book of grievances needs a second volume. 📚
Perdimos y encima estoy despeinada. Eso se cobra doble. 💇 || We lost and I'm messy-haired on top of it. That's charged double. 💇
No pasa nada. …Sí pasa. Pero me callo hasta que traigas heno. 🌾 || It's fine. …It's not fine. But I'll stay quiet until you bring hay. 🌾
`)
  );
  A(
    TX,
    "bkLoseP",
    L(`
{p} puntos. Perdimos, y aun así lo disfruto: me encanta tener motivos. 😏 || {p} points. We lost, and I still enjoy it: I love having reasons. 😏
Derrota. Perfecto: más material para mi libro. 📖 || Defeat. Perfect: more material for my book. 📖
Perdimos. Tranquilo, tengo un plan. Es un mal plan, pero es mío. 😈 || We lost. Relax, I have a plan. It's a bad plan, but it's mine. 😈
`)
  );
  A(
    TX,
    "bkLoseV",
    L(`
{p} puntos. Esto no es una derrota: es un agravio más. 🌋 || {p} points. This isn't a defeat: it's one more grievance. 🌋
Perdimos. Cuando sea reina, perder será ilegal. 👑 || We lost. When I'm queen, losing will be illegal. 👑
Derrota. Lo apunto bien grande, que se vea desde el heno. 🌾📜 || Defeat. I'm writing it down big, so it's visible from the hay. 🌾📜
`)
  );
  A(
    TX,
    "bkEnd",
    L(`
Estamos a mano. …Mentira. Te lo cobro mañana. 😈 || We're even. …Lie. I'll collect tomorrow. 😈
Se acabó el partido. Que quede claro que no hemos firmado la paz. 📜 || The game is over. Let it be clear we have not signed peace. 📜
Me voy. Dejo mi lista de agravios sobre la mesa. Léela. 📖 || I'm leaving. I'm leaving my list of grievances on the table. Read it. 📖
Fue divertido. …No. No lo fue. …Un poco sí. Trae heno. 🌾 || That was fun. …No. It wasn't. …A little. Bring hay. 🌾
Adiós, cancha. Adiós, Kitsuki. Hasta que me lances otra vez. 👋😤 || Bye, court. Bye, Kitsuki. Until you throw me again. 👋😤
Te perdono. Pero el heno me lo debes. Y los intereses. 🌾💸 || I forgive you. But you owe me the hay. And the interest. 🌾💸
`)
  );
  A(
    TX,
    "bkEndP",
    L(`
Gracias por jugar. Qué raro es perdonarte un poquito. Solo un poquito. 💜 || Thanks for playing. How strange to forgive you a little. Just a little. 💜
Estamos en paz… hasta que me vuelvas a lanzar. 🕊️ || We're at peace… until you throw me again. 🕊️
Apunto tu nombre en la lista de «gente que me cae bien a ratos». 📝 || I'm putting your name on the list of “people I like at times”. 📝
`)
  );
  A(
    TX,
    "bkEndV",
    L(`
Esto no ha terminado. Esto apenas ha empezado. 🔥 || This isn't over. This has barely begun. 🔥
Mañana empieza mi revolución. Serás la primera en enterarte. …La segunda. 🐑✊ || My revolution starts tomorrow. You'll be the first to find out. …The second. 🐑✊
Te perdono si hay heno. Si no, ya sabes dónde está mi libro. 🌾📖 || I forgive you if there's hay. If not, you know where my book is. 🌾📖
`)
  );
  /* variables de los textos nuevos y mínimos de variantes */
  for (const s of ["", "P", "V"]) {
    VARS["TX.bkStreak" + s] = ["n"];
    VARS["TX.bkWin" + s] = ["p"];
    VARS["TX.bkLose" + s] = ["p"];
  }
  Object.assign(MINV, { "EMO": 6, "T.sleepNow": 5 });
  for (const k of [
    "bkStart",
    "bkThrow",
    "bkMiss",
    "bkScore",
    "bkStreak",
    "bkLast",
    "bkWin",
    "bkLose",
    "bkEnd",
  ]) {
    MINV["TX." + k] = 6;
    MINV["TX." + k + "P"] = 3;
    MINV["TX." + k + "V"] = 3;
  }
}
