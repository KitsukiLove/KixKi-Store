/*
  Textos de vaca.exe y del combate [español, English].
*/

/* ---------- textos  [español, English] ---------- */
export const TEXTOS = {
  group: ["Combate contra vaca.exe", "Fight against cow.exe"],
  name: ["vaca.exe", "cow.exe"],
  hpL: ["Vida de la vaca", "Cow health"],
  infL: ["Infección", "Infection"],
  fold: ["Carpetas", "Folders"],
  throwB: ["Lanzar a Kixki", "Throw Kixki"],
  throwT: ["Lanzar a Kixki contra la vaca (tecla L)", "Throw Kixki at the cow (key L)"],
  restore: ["Restaurar fondo", "Restore wallpaper"],
  restoreT: [
    "Quitar el fondo de vacas y volver al anterior",
    "Remove the cow wallpaper and go back to the previous one",
  ],
  pause: ["Pausar vacas", "Pause cows"],
  play: ["Reanudar vacas", "Resume cows"],
  /* avisos para lectores de pantalla (y para quien no mire la barra) */
  srStart: [
    "¡vaca.exe se ha rebelado! Lanza a Kixki contra ella con el botón «Lanzar a Kixki» o con la tecla L. Los golpes por la espalda valen doble. Haz clic en una carpeta manchada para limpiarla.",
    "cow.exe has rebelled! Throw Kixki at it with the “Throw Kixki” button or the L key. Hits from behind count double. Click a stained folder to clean it.",
  ],
  srHit: ["Golpe. Vida de la vaca: {hp} de {max}.", "Hit. Cow health: {hp} of {max}."],
  srBack: [
    "Golpe por la espalda: doble daño. Vida de la vaca: {hp} de {max}.",
    "Hit from behind: double damage. Cow health: {hp} of {max}.",
  ],
  srInf: [
    "Infección al {p} %. Carpetas manchadas: {n} de {t}.",
    "Infection at {p}%. Stained folders: {n} of {t}.",
  ],
  srCure: ["Carpeta limpia. Quedan {n} manchadas.", "Folder cleaned. {n} still stained."],
  srMiss: ["Kixki no le dio a la vaca.", "Kixki missed the cow."],
  srWin: [
    "¡Victoria! vaca.exe ha sido derrotada. Logro «Apuñalar por la espalda» y nuevo fondo «Colina XP».",
    "Victory! cow.exe is defeated. “Backstab” achievement and new “XP Hill” wallpaper.",
  ],
  srLose: [
    "Derrota: la infección llegó al 100 %. El fondo ahora es «¡Vacas!». Puedes restaurarlo en Ajustes.",
    "Defeat: infection reached 100%. The wallpaper is now “Cows!”. You can restore it in Settings.",
  ],
  srNoThrow: ["Ahora mismo Kixki no puede lanzarse.", "Kixki can't be thrown right now."],
  srRestored: ["Fondo restaurado.", "Wallpaper restored."],
  /* Kixki */
  warn: [
    [
      "Psst… vaca.exe está muy callada. Demasiado callada. 🐄👀",
      "Psst… cow.exe is very quiet. Way too quiet. 🐄👀",
    ],
    [
      "¿Has notado que la vaca ya no baila? Eso nunca es buena señal. 😰",
      "Have you noticed the cow stopped dancing? That's never a good sign. 😰",
    ],
    [
      "Mmm… vaca.exe lleva un rato mirándonos fijamente. Me da mala espina. 🐄",
      "Hmm… cow.exe has been staring at us for a while. I have a bad feeling. 🐄",
    ],
    [
      "Creo que la vaca está mascando algo más que heno… ¡una idea malvada! 🐄💭",
      "I think the cow is chewing on more than hay… an evil idea! 🐄💭",
    ],
  ],
  start: [
    [
      "¡Lo sabía! ¡Una vaca no hace amigas sin un plan! Agárrame y lánzame contra ella. 🐑💢",
      "I knew it! A cow doesn't make friends without a plan! Grab me and throw me at her. 🐑💢",
    ],
    [
      "¡TRAICIÓN! Con lo bien que bailábamos… ¡Lánzame y se lo cobro todo! 😤",
      "BETRAYAL! And we danced so well… Throw me and I'll collect it all! 😤",
    ],
    [
      "¡Se acabó el baile! Tú me lanzas, yo le doy un pezuñazo. ¡Y por la espalda vale doble! 🐑🗡️",
      "The dance is over! You throw me, I hoof her. And from behind counts double! 🐑🗡️",
    ],
    [
      "¡Esa vaca va a aprender lo que es una oveja enfadada! ¡Lánzame! 🔥",
      "That cow is about to learn what an angry sheep is! Throw me! 🔥",
    ],
  ],
  hint: [
    [
      "Agárrame, tira hacia atrás y suelta. O usa el botón «Lanzar a Kixki». ¡Y limpia las carpetas manchadas con un clic! 🎯",
      "Grab me, pull back and let go. Or use the “Throw Kixki” button. And clean stained folders with a click! 🎯",
    ],
    [
      "¡Hazme volar! Si le doy por la espalda, ¡vale doble! 🗡️",
      "Make me fly! If I hit her from behind, it counts double! 🗡️",
    ],
  ],
  hit: [
    ["¡BONK! Eso es por abusar de mi confianza. 😤", "BONK! That's for abusing my trust. 😤"],
    [
      "¡Toma pezuñazo! Con cariño… y con muchísima rabia. 🐑💥",
      "Take that hoof! With love… and a LOT of rage. 🐑💥",
    ],
    ["¡Auch, pero valió la pena! ¡Otra vez! 🌀", "Ouch, but it was worth it! Again! 🌀"],
    [
      "¡Le di! Anota: la oveja mandó a la vaca a la lona. 📒",
      "Got her! Write it down: the sheep sent the cow to the mat. 📒",
    ],
  ],
  back: [
    [
      "¡POR LA ESPALDA! Doble daño y cero remordimientos. 😈🗡️",
      "FROM BEHIND! Double damage and zero regrets. 😈🗡️",
    ],
    [
      "¡Pezuñazo traicionero! Es lo que se merece una traidora. 🐑🗡️",
      "A sneaky hoof! It's what a traitor deserves. 🐑🗡️",
    ],
    [
      "¡Nunca des la espalda a una oveja enfadada! 😠",
      "Never turn your back on an angry sheep! 😠",
    ],
    [
      "Ella traicionó primero. Yo solo… devuelvo el favor. 😇🗡️",
      "She betrayed first. I'm just… returning the favour. 😇🗡️",
    ],
  ],
  miss: [
    [
      "¡Se movió! Apunta mejor, que la lana no se lanza sola. 😒",
      "She moved! Aim better, wool doesn't throw itself. 😒",
    ],
    ["Fallé… y la culpa es tuya, claro. 💢", "I missed… and it's your fault, of course. 💢"],
    [
      "Aterrizaje sin gloria. Otra vez, y esta vez por la espalda. 🎯",
      "Glory-less landing. Again, and this time from behind. 🎯",
    ],
    [
      "Ni un rasguño a la vaca y yo con la lana despeinada. 😤",
      "Not a scratch on the cow and my wool is all messy. 😤",
    ],
  ],
  cure: [
    ["¡Carpeta limpia! Aquí no se mancha más. 🧼", "Folder clean! No more stains here. 🧼"],
    [
      "¡Fuera manchas! La vaca no se sale con la suya. ✨",
      "Stains out! The cow isn't getting away with this. ✨",
    ],
    ["Una menos. ¡Sigue así, ayudante! 🧽", "One less. Keep it up, helper! 🧽"],
  ],
  inf40: [
    [
      "¡Se están llenando de manchas! ¡Hay que frenarla! 😱",
      "The stains are spreading! We have to stop her! 😱",
    ],
    [
      "Esto se pone feo: ¡ya hay carpetas con manchas de vaca! 🐄",
      "This is getting ugly: folders already have cow spots! 🐄",
    ],
  ],
  inf70: [
    [
      "¡Casi toda la página es suya! ¡LÁNZAME YA! 🆘",
      "Almost the whole page is hers! THROW ME NOW! 🆘",
    ],
    [
      "¡Si esto sigue así, me quedo sin carpetas y sin heno! 😵",
      "If this keeps up, I'll be left without folders and without hay! 😵",
    ],
  ],
  inf90: [
    [
      "¡Una carpeta más y se acabó! ¡Haz algo! 😵💦",
      "One more folder and it's over! Do something! 😵💦",
    ],
  ],
  rageK: [
    ["Está tambaleándose. ¡Un golpe más! 🔥", "She's wobbling. One more hit! 🔥"],
    [
      "¡Ahora va más rápido! Pero también está más débil. 🐑⚡",
      "She's faster now! But also weaker. 🐑⚡",
    ],
  ],
  win: [
    [
      "¡VACA DERROTADA! 🎉 Las amigas no traicionan; las traidoras… ¡hacen confeti!",
      "COW DEFEATED! 🎉 Friends don't betray; traitors… make confetti!",
    ],
    [
      "¡Pezuñazo final! ¡Apuñalar por la espalda, logro desbloqueado! 🏆",
      "Final hoof! Backstab, achievement unlocked! 🏆",
    ],
  ],
  prize: [
    [
      "Y mira lo que soltó al caer: el fondo «Colina XP». Lo encuentras con el botón de fondos. 🖼️",
      "And look what she dropped: the “XP Hill” wallpaper. You'll find it with the wallpaper button. 🖼️",
    ],
  ],
  lose: [
    [
      "¡NOOO! ¡Mi página llena de vacas! 😱 Restaura el fondo en Ajustes cuando quieras… y pide la revancha cuando vuelva vaca.exe.",
      "NOOO! My page is full of cows! 😱 Restore the wallpaper in Settings whenever you want… and ask for a rematch when cow.exe returns.",
    ],
    [
      "Nos ganaron las vacas… 🐄 Esto no se queda así: ¡revancha! Y el fondo se restaura desde Ajustes.",
      "The cows beat us… 🐄 This isn't over: rematch! And the wallpaper is restored from Settings.",
    ],
  ],
  summonLabel: ["Llamar a vaca.exe", "Call cow.exe"],
  summonT: ["Volver a llamar a vaca.exe para la revancha", "Call cow.exe back for the rematch"],
  summonK: [
    [
      "¿Revancha? ¡Pues la llamo! Pero ojo: ahora ya sabe pelear sucio. 🐑🔥",
      "A rematch? Fine, I'll call her! But careful: now she fights dirty. 🐑🔥",
    ],
    [
      "¡Que venga la vaca! Esta vez la apunto por la espalda desde el principio. 🎯",
      "Bring on the cow! This time I'm aiming for her back from the start. 🎯",
    ],
  ],
  summonWait: [
    [
      "vaca.exe sigue lamiéndose las heridas… vuelve en {m} min. 🐄🩹",
      "cow.exe is still licking her wounds… back in {m} min. 🐄🩹",
    ],
    [
      "Aún no: la vaca está descansando. Prueba en {m} min. 🐄💤",
      "Not yet: the cow is resting. Try again in {m} min. 🐄💤",
    ],
  ],
  restoreK: [
    [
      "¡Fondo restaurado! Pero la vaca sigue ahí fuera… 🐄👀",
      "Wallpaper restored! But the cow is still out there… 🐄👀",
    ],
    [
      "Fondo de vuelta. ¡Y que venga la revancha! 😤",
      "Wallpaper back. And bring on the rematch! 😤",
    ],
  ],
  /* la vaca (bocadillo sobre ella) */
  cowBetray: [
    ["¡MUUUU! Esta página ahora es MÍA. 🐄🔥", "MOOO! This page is MINE now. 🐄🔥"],
    ["¡MUUU! ¿Amistad? Era parte del plan. 😈", "MOOO! Friendship? It was part of the plan. 😈"],
    ["¡MUU-JAJÁ! Ni heno, ni ovejas, ni reglas. 🐄", "MOO-HAHA! No hay, no sheep, no rules. 🐄"],
  ],
  cowHit: [
    ["¡Muu…! 🐄💢", "Moo…! 🐄💢"],
    ["¡Mu! ¡Eso dolió, lanuda!", "Moo! That hurt, fluffy!"],
    ["¡Muuuu! (Me vengaré.)", "Mooo! (I will have my revenge.)"],
  ],
  cowRage: [
    [
      "¡MUUUUUU! Ya no bailo… ¡ahora mando yo!",
      "MOOOOO! I'm not dancing anymore… I'm in charge now!",
    ],
  ],
  cowMunch: [
    ["Ñam. Esta carpeta ya es de la manada. 🐄", "Munch. This folder belongs to the herd now. 🐄"],
    ["Muu-ñam. Manchas, manchas… 🐄", "Moo-munch. Spots, spots… 🐄"],
    ["¡Mu! Otra para la colección.", "Moo! Another one for the collection."],
  ],
  cowTele: [
    ["¡Mu-jajá!", "Moo-haha!"],
    ["¡Muu! ¡Aquí!", "Moo! Over here!"],
  ],
  cowDie: [["Mu… (Solo quería… bailar…)", "Moo… (I just wanted… to dance…)"]],
  cowWin: [
    [
      "¡MUUUUU! ¡Ahora todo es de la manada! 🐄🐄🐄",
      "MOOOOO! Now everything belongs to the herd! 🐄🐄🐄",
    ],
  ],
};
