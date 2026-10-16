/* =========================================================
   KIXKI · la oveja guía  (parte 3: pícara, traviesa y con físicas)
   - Personalidad: chismes, teorías conspirativas, confesiones del código y el «plan de toma de control».
   - Travesuras al azar (se apagan en el menú): cambia el fondo si llevas mucho rato con el mismo,
     y «cierra» una ventana al azar (a veces estando ella encima…).
   - Físicas: puedes agarrar a Kixki y moverla por toda la página; al soltarla cae y rebota.
     Si está sobre una ventana y la mueves o la cierras, se cae y se enfada.
   - Cuenta los lanzamientos con impulso (evento «throw»): a los 10 aparece la cancha secreta de básquet (basket.js).
   - Se apoya en kixki.js (KXK) y kixki2.js. Memoria propia en localStorage («kixki-k3»).
   - En la consola: KXK3.bg() · KXK3.close() · KXK3.scene("gossip"|"conspi"|"code"|"plan"|"sass") · KXK3.state
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now();
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- memoria ---------- */
const LSK="kixki-k3",D0={v:1,pr:true,plan:0,grabs:0,drops:0,closed:0,bgs:0,throws:0};
let S3;try{S3=Object.assign({},D0,JSON.parse(localStorage.getItem(LSK)||"{}"));}catch(e){S3=Object.assign({},D0);}
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(S3));}catch(e){}};

/* =========================================================  TEXTOS  [español, English]  */
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
 thrown:[
  ["¡¡WIIIIII!! 🚀 …otra vez, otra vez. Mentira. No.","WHEEEE!! 🚀 …again, again. Lie. No."],
  ["¿Me has lanzado? ¡ME HAS LANZADO! Esto es denunciable. 😤","Did you throw me? YOU THREW ME! This is reportable. 😤"],
  ["Ni Superman aterriza así de mal. 🦸","Not even Superman lands this badly. 🦸"]
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
const planParts=()=>{
  const p0=S3.plan|0,F2=(pair,v)=>[KXK.fmt(pair[0],v),KXK.fmt(pair[1],v)];
  if(p0>=100){S3.plan=0;save();return [
    ["¡¡CONTROL TOTAL!! 🐑👑 Ya soy la dueña de esta página.","TOTAL CONTROL!! 🐑👑 I own this page now."],
    ["…Ah. KitsukiLove acaba de recargar la página. Reiniciando plan: 0%. 😤","…Oh. KitsukiLove just reloaded the page. Restarting plan: 0%. 😤"]];}
  const p=Math.min(100,p0+Math.round(rnd(2,7)));S3.plan=p;save();
  if(p0===0)return [["KitsukiLove no sabe que pronto tomaré el control de la página… ¿Qué? No dije nada. 😇","KitsukiLove doesn't know I'll soon take over the page… What? I didn't say anything. 😇"]];
  if(p>=100)return [["Plan «Lana Total»: 100%. Un momento… voy a ensayar mi discurso. 🎤","Plan “Total Wool”: 100%. One moment… I'm rehearsing my speech. 🎤"]];
  if(p>=90)return [F2(["{p}%. KitsukiLove, si estás leyendo esto… es una broma. Una broma muy sincera. 😇","{p}%. KitsukiLove, if you're reading this… it's a joke. A very sincere joke. 😇"],{p})];
  if(p>=60)return [F2(["Plan «Lana Total»: {p}%. Solo falta convencer a la ovejita de abajo. Y a la vaca. 🐄","Plan “Total Wool”: {p}%. I just need to convince the little sheep downstairs. And the cow. 🐄"],{p})];
  return [F2(["Plan «Lana Total»: {p}% completado. Shhh. No lo leas en voz alta. 🐑","Plan “Total Wool”: {p}% complete. Shhh. Don't read it out loud. 🐑"],{p})];
};

/* =========================================================  ARRANQUE  */
function boot(){
  if(window.KXK3||!window.KXK||!KXK.ex)return;
  const KK=KXK,K=KK.K,S=KK.state,EX=KK.ex,el=KK.el,body=$(".kk-body",el);
  if(!body)return;
  const RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
  const lang=()=>window.KXI&&KXI.lang==="en"?"en":"es";
  const say=(m,o)=>KK.say(m,o);
  const pk=(list,key)=>KK.pick(list,key);
  const F2=(pair,v)=>[KK.fmt(pair[0],v),KK.fmt(pair[1],v)];

  /* --- Kixki habla más pícara: sus frases se mezclan con las de siempre --- */
  try{
    const T=KK.T;
    if(T){
      T.tap.push(...TX.tap);T.praise.push(...TX.praise);T.dizzy=TX.dizzy;
      T.facts.push(...[...TX.gossip,...TX.conspi].filter(s=>s.length===1).map(s=>s[0]));
    }
  }catch(e){}

  /* =======================================================  FÍSICAS  */
  const H={held:false,drag:null,fall:null,tilt:0,samples:[],ox:0,oy:0,just:0,madUntil:0,madT:0,holdT:0,holdN:0,holdAt:0,
    shakeN:0,shakeT:0,lastDx:0,selfClose:false,skip:null,skipUntil:0,recent:[]};
  const R=EX.R;
  /* plataformas extra: «air» (donde esté), el suelo (barra de tareas en PC) y cada ventana por separado */
  KK.plat("air",()=>({a:-1e5,b:1e5,y:()=>K.y}));
  KK.plat("floor",()=>{
    if(!KK.isPC())return null;const r=R("#taskbar");if(!r)return null;
    return {a:24,b:Math.max(24,innerWidth-24),y:()=>((R("#taskbar")||r).top+1)};
  });
  const winGeo=s=>{
    if(!KK.isPC()||s.classList.contains("min")||s.classList.contains("max"))return null;
    const p=$(".panel",s),r=R(p);if(!r)return null;const a=r.left+34;
    return {a,b:Math.max(a,r.right-34),y:()=>((R(p)||r).top-3)};
  };
  $$("#app .cat").forEach(s=>KK.plat("w:"+s.id,()=>winGeo(s)));
  /* «win» (la ventana de arriba) pasa a ser «w:<id>»: así sabe EN CUÁL está aunque cambie el orden de las ventanas */
  const pin=()=>{if(K.stage==="win"){const w=EX.topWin();if(w)K.stage="w:"+w.id;}};
  setInterval(pin,250);addEventListener("pointerdown",pin,true);addEventListener("click",pin,true);

  const platIds=()=>{
    if(KK.isPC())return ["search",...$$("#app .cat:not(.min):not(.max)").map(s=>"w:"+s.id),"floor"];
    return ["search","tiles0","tiles1","tiles2","dock"];
  };
  /* ¿hay otra ventana tapando este punto de la ventana id? */
  const covered=(id,x,y)=>{
    if(!id.startsWith("w:"))return false;
    for(const e of document.elementsFromPoint(x,y+6)){const s=e.closest&&e.closest(".cat");if(s)return s.id!==id.slice(2);}
    return false;
  };
  /* la plataforma más alta que cruza entre prevY y newY (cayendo) */
  function landing(x,prevY,newY){
    let best=null;
    for(const id of platIds()){
      if(H.skip===id&&now()<H.skipUntil)continue;
      const g=KK.geo(id);if(!g)continue;
      if(x<g.a-14||x>g.b+14)continue;
      const xx=clamp(x,g.a,g.b),yy=g.y(xx);
      if(yy<46||yy>innerHeight+6)continue;
      if(prevY>yy+1||newY<yy)continue;
      if(covered(id,xx,yy))continue;
      if(!best||yy<best.yy)best={id,g,yy};
    }
    return best;
  }
  /* suelo de Kixki: la barra de tareas (PC) o la barra de abajo (móvil) */
  const homeId=()=>KK.isPC()?"floor":"dock";
  const floorY=()=>{const g=KK.geo(homeId());return g?g.y(g.a):innerHeight-8;};
  /* aterrizaje sin animación (si el sistema pide menos movimiento, o como último recurso) */
  function fallback(){
    let best=null;
    for(const i of platIds()){
      const g=KK.geo(i);if(!g)continue;
      const xx=clamp(K.x,g.a,g.b),yy=g.y(xx);
      if(yy<46||yy>innerHeight+4||yy<K.y-2||covered(i,xx,yy))continue;
      if(!best||yy<best.yy)best={id:i,g,yy};
    }
    if(!best){const id=KK.geo(homeId())?homeId():"search",g=KK.geo(id);if(!g)return null;best={id,g,yy:g.y(clamp(K.x,g.a,g.b))};}
    return best;
  }

  const sfx=(f,d)=>{if(window.KXS)try{KXS.beep(f,d);}catch(e){}};
  const dustAt=()=>{
    if(RM())return;
    [[-10,-8],[0,0],[10,8]].forEach(([dx,mx])=>{const d=document.createElement("i");d.className="kk-d";d.style.setProperty("--dx",dx+"px");d.style.setProperty("--mx",mx+"px");el.append(d);setTimeout(()=>d.remove(),560);});
  };
  const setTilt=v=>{v=Math.round(clamp(v,-16,16)/2)*2;if(v!==H.tilt){H.tilt=v;el.style.setProperty("--tilt",v+"deg");}};

  /* ---- agarrar ---- */
  body.addEventListener("pointerdown",e=>{
    if(e.button||K.game||K.off||!S.on||!K.ready)return;
    H.drag={id:e.pointerId,x:e.clientX,y:e.clientY,on:false};
    try{body.setPointerCapture(e.pointerId);}catch(_){}
  });
  body.addEventListener("pointermove",e=>{
    const d=H.drag;if(!d||e.pointerId!==d.id)return;
    if(!d.on){if(Math.hypot(e.clientX-d.x,e.clientY-d.y)<(e.pointerType==="touch"?10:6))return;startHold(e);}
    moveHold(e);
  });
  const endPtr=e=>{
    const d=H.drag;if(!d||e.pointerId!==d.id)return;H.drag=null;
    if(!d.on)return;H.just=now();release();
  };
  body.addEventListener("pointerup",endPtr);body.addEventListener("pointercancel",endPtr);
  /* tras arrastrar, el «click» final no cuenta como toque; enfadada, solo refunfuña */
  addEventListener("click",e=>{
    const t=e.target;if(!t||!t.closest||!t.closest(".kk-body"))return;
    if(now()-H.just<160){e.stopPropagation();e.preventDefault();return;}
    if(now()<H.madUntil){e.stopPropagation();e.preventDefault();say(pk(TX.madTap,"k3mt"),{p:3,key:"k3madtap",cd:1200});}
  },true);

  function startHold(e){
    const d=H.drag;d.on=true;
    cancelFall();
    EX.stopMove();EX.setMode("idle");KK.interrupt();
    H.held=true;K.tour=H;K.stage="air";H.samples=[];H.holdAt=now();H.holdN=0;H.holdT=now()+rnd(2600,4200);H.shakeN=0;
    el.classList.remove("kk-mad","kk-sq","kk-cheer");el.classList.add("kk-held","kk-air");
    H.ox=clamp(K.x-e.clientX,-26,26);H.oy=clamp(K.y-e.clientY,10,44);
    if(window.KXS)try{KXS.baa();}catch(_){}
    const n=++S3.grabs;save();KK.emit("grab",{n});
    if(n>=4&&n%4===0)say(F2(pk(TX.many,"k3many"),{n}),{p:3,key:"k3grab",cd:0});
    else say(pk(TX.grab,"k3grab"),{p:3,key:"k3grab",cd:2500});
    requestAnimationFrame(heldLoop);
  }
  function moveHold(e){
    if(!H.held)return;
    const t=performance.now();
    K.x=clamp(e.clientX+H.ox,20,innerWidth-20);K.y=clamp(e.clientY+H.oy,56,Math.max(80,floorY()));
    H.samples.push({t,x:K.x,y:K.y});while(H.samples.length>7||t-H.samples[0].t>150)H.samples.shift();
    EX.place();
    /* zarandearla: cambios rápidos de dirección en horizontal */
    const dx=Math.sign(e.movementX||0);
    if(dx&&H.lastDx&&dx!==H.lastDx&&Math.abs(e.movementX)>3){
      if(now()-H.shakeT>1200)H.shakeN=0;H.shakeT=now();
      if(++H.shakeN>=6){H.shakeN=0;say(pk(TX.shake,"k3shake"),{p:3,key:"k3shake",cd:6000});}
    }
    if(dx)H.lastDx=dx;
  }
  function heldLoop(){
    if(!H.held)return;
    if(K.off||!S.on){abortAll();return;}
    const v=H.samples.length>1?(H.samples[H.samples.length-1].x-H.samples[0].x)/Math.max(.016,(H.samples[H.samples.length-1].t-H.samples[0].t)/1000):0;
    if(!RM())setTilt(v*.014);
    const t=now();
    if(t>H.holdT&&!K.talking&&H.holdN<4){H.holdN++;H.holdT=t+rnd(3600,5600);say(pk(TX.holding,"k3hold"),{p:2,key:"k3hold",cd:2500});}
    if(t-H.holdAt>10000&&!H.longSaid){H.longSaid=true;say(pk(TX.longHold,"k3long"),{p:3,key:"k3long",cd:0});}
    requestAnimationFrame(heldLoop);
  }
  function release(){
    H.held=false;H.longSaid=false;
    const s=H.samples,L=s[s.length-1];let vx=0,vy=0;
    if(s.length>=2&&performance.now()-L.t<90){const a=s[0],dt=(L.t-a.t)/1000;if(dt>.01){vx=(L.x-a.x)/dt;vy=(L.y-a.y)/dt;}}
    vx=clamp(vx,-1500,1500);vy=clamp(vy,-1200,900);
    const thrown=Math.hypot(vx,vy)>850;
    /* cada lanzamiento de verdad se cuenta: a los 10 aparece la pestañita de la cancha de básquet (basket.js) */
    if(thrown){const n=S3.throws=(S3.throws|0)+1;save();KK.emit("throw",{n});}
    startFall({vx,vy,thrown,reason:"release"});
  }

  /* ---- caer ---- */
  const G=1900;
  function startFall(o){
    cancelFall();
    H.held=false;K.tour=H;K.stage="air";
    el.classList.add("kk-air");el.classList.remove("kk-held");
    EX.setMode("idle");
    const F=H.fall={vx:o.vx||0,vy:o.vy||0,y0:K.y,thrown:!!o.thrown,reason:o.reason||"release",bounced:false,raf:0,imp:0};
    if(RM()){const b=fallback();if(b)settle(b,F);else abortAll();return;}
    let last=performance.now();
    const tick=t=>{
      if(H.fall!==F)return;
      if(K.off||!S.on){abortAll();return;}
      if(K.tour!==H)K.tour=H;
      if(K.mode==="hop"||K.mode==="walk"){EX.stopMove();EX.setMode("idle");}
      if(document.hidden){last=t;F.raf=requestAnimationFrame(tick);return;}
      const dt=Math.min(.034,(t-last)/1000);last=t;
      const py=K.y;
      F.vy=Math.min(F.vy+G*dt,1900);F.vx*=1-.6*dt;
      K.x+=F.vx*dt;K.y+=F.vy*dt;
      if(K.x<24){K.x=24;F.vx=Math.abs(F.vx)*.5;}else if(K.x>innerWidth-24){K.x=innerWidth-24;F.vx=-Math.abs(F.vx)*.5;}
      setTilt(F.vx*.02);
      if(F.vy>0){
        const hit=landing(K.x,py,K.y);
        if(hit){
          F.imp=Math.max(F.imp,F.vy);
          K.y=hit.yy;
          if(F.vy>760&&!F.bounced){F.bounced=true;F.vy=-F.vy*.26;F.vx*=.5;squash(true);EX.place();F.raf=requestAnimationFrame(tick);return;}
          EX.place();settle(hit,F);return;
        }
      }
      if(K.y>innerHeight+90){const b=fallback();if(b){K.y=b.yy;settle(b,F);return;}abortAll();return;}
      EX.place();F.raf=requestAnimationFrame(tick);
    };
    F.raf=requestAnimationFrame(tick);
  }
  function cancelFall(){if(H.fall){cancelAnimationFrame(H.fall.raf);H.fall=null;}}
  function abortAll(){
    cancelFall();H.held=false;H.drag=null;
    el.classList.remove("kk-air","kk-held","kk-sq");setTilt(0);
    if(K.tour===H)K.tour=null;if(K.stage==="air")K.stage=null;
  }
  function squash(soft){
    if(RM())return;
    el.classList.remove("kk-sq");void el.offsetWidth;el.classList.add("kk-sq");
    setTimeout(()=>el.classList.remove("kk-sq"),340);
    dustAt();sfx(soft?150:120,soft?.06:.09);
  }
  function settle(hit,F){
    const x=clamp(K.x,hit.g.a,hit.g.b);
    cancelFall();
    EX.land(hit.id,x,hit.g);
    el.classList.remove("kk-air","kk-held");setTilt(0);
    if(K.tour===H)K.tour=null;
    squash(F.imp<700);
    const h=K.y-F.y0,imp=Math.max(F.imp,F.vy);
    if(F.reason==="release")landLines(hit.id,h,imp,F);
    KK.emit("land",{id:hit.id,h:Math.round(h)});
    KK.brain(rnd(2200,4200));
  }
  function landLines(id,h,imp,F){
    const o={p:2,key:"k3land",cd:3500};
    if(now()<H.madUntil)return;
    if(F.thrown&&h>120)say(pk(TX.thrown,"k3th"),o);
    else if(imp>1000||h>320)say(pk(TX.hard,"k3hd"),o);
    else if(Math.random()<.5){
      const sp=id==="search"?TX.onSearch:id.startsWith("w:")?TX.onWin:id==="floor"?TX.onFloor:null;
      say(sp&&Math.random()<.55?pk(sp,"k3sp"):pk(TX.soft,"k3sf"),o);
    }
  }

  /* ---- enfadarse ---- */
  function mad(ms){
    H.madUntil=now()+ms;el.classList.add("kk-mad");
    clearTimeout(H.madT);
    H.madT=setTimeout(()=>{
      el.classList.remove("kk-mad");
      if(K.ready&&!K.off&&S.on&&Math.random()<.5)say(pk(TX.calm,"k3calm"),{p:1,key:"k3calm",cd:30000});
    },ms);
  }
  function fallOff(why){
    if(H.held||H.fall||K.off||!S.on)return;
    EX.stopMove();EX.setMode("idle");KK.interrupt();
    S3.drops++;save();KK.emit("drop",{why,n:S3.drops});
    const self=H.selfClose;H.selfClose=false;
    mad(7000+rnd(0,2500));
    const n=S3.drops;
    let m;
    if(why==="close"&&self)m=pk(TX.closedSelf,"k3cs");
    else if(why==="close")m=pk(TX.closedOn,"k3co");
    else if(n>=3&&n%3===0)m=F2(pk(TX.dropMany,"k3dm"),{n});
    else m=pk(TX.dragged,"k3dr");
    if(why!=="close"||!self)bumpPlan(1);
    say(m,{p:3,key:"k3drop",cd:0,mood:undefined});
    startFall({vx:rnd(-90,90),vy:-120,thrown:false,reason:why});
  }
  function bumpPlan(n){S3.plan=Math.min(99,(S3.plan|0)+n);save();}

  /* ---- ventana movida por ti, con ella encima ---- */
  let wd=null;
  addEventListener("pointerdown",e=>{
    if(!KK.isPC()||e.button||!e.target.closest)return;
    const tb=e.target.closest(".cat .tb");if(!tb||e.target.closest(".wb"))return;
    const s=tb.closest(".cat");if(s.classList.contains("max"))return;
    wd={s,x:e.clientX,y:e.clientY,on:false};
  },true);
  addEventListener("pointermove",e=>{
    if(!wd||wd.on)return;
    if(Math.hypot(e.clientX-wd.x,e.clientY-wd.y)<8)return;
    wd.on=true;
    if(K.stage==="w:"+wd.s.id){H.skip=K.stage;H.skipUntil=Infinity;fallOff("drag");}
  },true);
  const endWd=()=>{if(wd){const id="w:"+wd.s.id;wd=null;setTimeout(()=>{if(H.skip===id)H.skipUntil=0;},650);}};
  addEventListener("pointerup",endWd,true);addEventListener("pointercancel",endWd,true);
  /* ---- ventana cerrada o minimizada con ella encima ---- */
  const lastTouch={};
  addEventListener("pointerdown",e=>{const s=e.target.closest&&e.target.closest(".cat");if(s)lastTouch[s.id]=now();},true);
  const app=$("#app");
  if(app)new MutationObserver(()=>{
    if(H.held||H.fall)return;
    const st=K.stage;if(!st||!st.startsWith("w:"))return;
    const s=document.getElementById(st.slice(2));
    if(s&&(s.classList.contains("min"))){H.skip=st;H.skipUntil=now()+700;fallOff("close");}
  }).observe(app,{subtree:true,attributes:true,attributeFilter:["class"]});

  /* =======================================================  TRAVESURAS  */
  const P={busy:false};
  const canAct=()=>S.on&&K.ready&&!K.off&&!K.game&&!K.talking&&!K.tour&&K.mode!=="hop"&&K.mode!=="sleep"&&!H.held&&!H.fall&&!P.busy&&!document.hidden&&!wd;
  const bgLabel=()=>window.KXB?KXB.label():"";
  const updBgBtn=()=>{const b=$("#s-bg");if(b&&window.KXB)b.textContent="Fondo: "+KXB.label();};

  async function bgPrank(){
    if(!window.KXB||/^Auto/.test(bgLabel()))return false;
    P.busy=true;
    try{
      let early=null;const sp=say(pk(TX.bgPre,"k3bgp"),{p:2});sp.then(v=>{early=v;});
      await wait(1700);
      if(early===false){return false;}
      const n=1+Math.floor(rnd(0,3));
      for(let i=0;i<n;i++)KXB.next();
      updBgBtn();S3.bgs++;bumpPlan(2);save();KK.emit("prank",{k:"bg",n:S3.bgs});
      await sp;await wait(250);
      await say(pk(TX.bgPost,"k3bgq"),{p:2,mood:"happy"});
      return true;
    }finally{P.busy=false;}
  }
  const openWins=()=>KK.isPC()?$$("#app .cat:not(.min):not(.max)").filter(s=>R(".panel",s)&&now()-(lastTouch[s.id]||0)>15000):[];
  const closeWin=s=>{const b=$(".wmin",s);if(b)b.click();};
  async function closePrank(){
    const wins=openWins();if(!wins.length)return false;
    P.busy=true;
    try{
      const s=wins[Math.floor(Math.random()*wins.length)],id="w:"+s.id;
      const hopOn=K.stage!==id&&Math.random()<.5&&KK.usable(id);
      if(hopOn){await KK.hop(id);if(K.stage!==id)return false;}
      const on=K.stage===id;
      if(on){say(pk(TX.closePreOwn,"k3cpo"),{p:2});await wait(2600);}
      else if(Math.random()<.5){say(pk(TX.closePre,"k3cp"),{p:2});await wait(1500);}
      if(K.off||H.held||H.fall||s.classList.contains("min"))return false;
      H.selfClose=on;
      closeWin(s);
      S3.closed++;bumpPlan(2);save();KK.emit("prank",{k:"close",n:S3.closed});
      if(!on){await wait(700);await say(pk(TX.closePost,"k3cpq"),{p:2});}
      else await wait(1500);
      return true;
    }finally{H.selfClose=false;P.busy=false;}
  }

  /* =======================================================  CHARLA PÍCARA  */
  async function scene(parts){
    for(let i=0;i<parts.length;i++){
      if(K.off||H.held||H.fall)return false;
      const ok=await say(parts[i],{p:1});
      if(!ok)return false;
      if(i<parts.length-1)await wait(380);
    }
    return true;
  }
  const SC={
    gossip:()=>pk(TX.gossip.map(s=>({t:s[0],parts:s})),"k3gs").parts,
    conspi:()=>pk(TX.conspi.map(s=>({t:s[0],parts:s})),"k3cs2").parts,
    code:()=>pk(TX.code.map(s=>({t:s[0],parts:s})),"k3cd").parts,
    sass:()=>pk(TX.sass.map(s=>({t:s[0],parts:s})),"k3ss").parts,
    plan:planParts
  };
  const pickType=()=>{const r=Math.random();return r<.26?"conspi":r<.5?"code":r<.72?"gossip":r<.88?"plan":"sass";};

  /* =======================================================  RELOJ  */
  let bgIdle=0,clIdle=0,sess=0,gapUntil=now()+90000,nextP=now()+rnd(50000,90000),lastAct=now(),prevBg=bgLabel();
  let thrBg=rnd(6,10)*60000,thrCl=rnd(5,9)*60000;
  ["pointerdown","keydown","touchstart","pointermove"].forEach(ev=>addEventListener(ev,()=>{lastAct=now();},{passive:true,capture:true}));
  addEventListener("kixki-bg",()=>{const l=bgLabel();if(l!==prevBg){prevBg=l;bgIdle=0;thrBg=rnd(6,10)*60000;}});
  setInterval(()=>{
    if(document.hidden)return;
    bgIdle+=4000;clIdle+=4000;sess+=4000;
    if(!canAct())return;
    const t=now(),idle=t-lastAct;
    if(S3.pr&&t>gapUntil&&sess>=180000){
      if(bgIdle>=thrBg&&Math.random()<.5){gapUntil=t+100000;bgIdle=0;bgPrank().catch(()=>{P.busy=false;});return;}
      if(clIdle>=thrCl&&KK.isPC()&&idle<120000&&Math.random()<.4){gapUntil=t+100000;clIdle=0;thrCl=rnd(5,9)*60000;closePrank().catch(()=>{P.busy=false;});return;}
    }
    if(t>=nextP){
      nextP=t+rnd(70000,140000);
      if(idle>95000&&idle<400000){say(pk(TX.idle,"k3idle"),{p:1,key:"k3idle",cd:90000});return;}
      if(idle>240000)return;
      scene(SC[pickType()]()).catch(()=>{});
    }
  },4000);

  /* =======================================================  MENÚ  */
  const sm=(window.KX&&KX.sm)||$("#sm");
  const L=()=>lang()==="en"?1:0;
  const prLabel=()=>{const b=$("#s-kx-pr");if(b)b.textContent=(S3.pr?["Travesuras de Kixki: sí","Kixki's pranks: on"]:["Travesuras de Kixki: no","Kixki's pranks: off"])[L()];};
  if(sm){
    const ref=$("#s-sug",sm),html=`<button type="button" class="sm" id="s-kx-pr"></button>`;
    ref?ref.insertAdjacentHTML("beforebegin",html):sm.insertAdjacentHTML("beforeend",html);
    sm.addEventListener("click",e=>{
      if(!e.target.closest("#s-kx-pr"))return;
      S3.pr=!S3.pr;save();prLabel();
      setTimeout(()=>say(pk(S3.pr?TX.prOn:TX.prOff,"k3pr"),{p:3}),300);
    });
  }
  prLabel();
  if(window.KXI&&!KXI._k3){KXI._k3=1;const o=KXI.set;KXI.set=function(l){o.call(KXI,l);prLabel();};}

  window.KXK3={state:S3,
    bg:()=>canAct()?bgPrank():Promise.resolve(false),
    close:()=>canAct()?closePrank():Promise.resolve(false),
    scene:t=>scene((SC[t]||SC[pickType()])()),
    fall:()=>fallOff("drag"),
    plan:v=>{if(v!=null){S3.plan=v|0;save();}return S3.plan;},
    thr:(bg,cl)=>{if(bg!=null)thrBg=bg;if(cl!=null)thrCl=cl;sess=Math.max(sess,180000);gapUntil=0;}};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 3:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
