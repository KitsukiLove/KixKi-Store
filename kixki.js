/* =========================================================
   KIXKI · la oveja guía  (parte 1)
   - Vive en la página y se pasea por: la barra de búsqueda, las carpetas del escritorio (PC),
     la fila de carpetas y la barra inferior (móvil), las ventanas abiertas (PC) y el Salta Vallas.
   - Habla (español / English) con globos retro: consejos, ánimos y reacciones a lo que haces.
   - Guarda su memoria en localStorage ("kixki-k"). Se apaga desde el menú Kixki / Más.
   - Para la parte 2 (logros): avisa de todo con el evento  "kixki-evt"  → e.detail = {t:"folder"|"search"|…}
   Depende de: app.js (avisa con "kixki-ready" y "kixki-game"), i18n.js y music.js.
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now();
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- memoria ---------- */
const LSK="kixki-k",S0={v:1,on:true,visits:0,first:0,last:0,opened:[],fc:{},allDone:0};
let S;try{S=Object.assign({},S0,JSON.parse(localStorage.getItem(LSK)||"{}"));}catch(e){S=Object.assign({},S0);}
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(S));}catch(e){}};

/* ---------- sprites (20×15, miran a la derecha) ----------
   w lana · s sombra de lana · f cara · d oreja · e ojo · g brillo · p nariz · c mejilla · m boca
   a bufanda · b sombra de bufanda · y estrella · l pezuña */
const TOP=["................y...","...............yyy..","....www.....wwwywww..".slice(0,20),"..wwwwwww.wwwwwwwww.",".wwwwwwwwwwwwwwwwww.",".wwwwwwwwwwwwwwwwww."];
/* (parte 2) cara más pequeña: 4×4 px en vez de 6×7, y más lana alrededor */
const R6={open:"wwwwwwwwwwwwwwdfgef.",blink:"wwwwwwwwwwwwwwdffff.",happy:"wwwwwwwwwwwwwwdffef."};
const R7={open:"wwwwwwwwwwwwwwdfeef.",blink:"wwwwwwwwwwwwwwdfeef.",happy:"wwwwwwwwwwwwwwdfefe."};
const R8="wwwwwwwwwwwwwwwcfpf.";
const R9={idle:"wwwwwwwwwwwaaaaafff.",open:"wwwwwwwwwwwaaaaafmf."};
const R10={idle:"swwwwwwwwwwwabbbb...",open:"swwwwwwwwwwwabbbb..."};
const R11=".swwwwwwwwwwwwbb....",R12="..ssssssssssss......";
const LEG={a:["...ll..ll...........","...ll..ll..........."],b:["..ll....ll..........","..ll....ll.........."],
  c:["....ll..ll..........","....ll..ll.........."],j:["....l....l..........","...................."]};
const mk=(eye,mouth,leg)=>[...TOP,R6[eye],R7[eye],R8,R9[mouth],R10[mouth],R11,R12,...LEG[leg]];
const FR={idle:mk("open","idle","a"),blink:mk("blink","idle","a"),talk:mk("open","open","a"),walkB:mk("open","idle","b"),
  walkC:mk("open","idle","c"),jump:mk("open","open","j"),happy:mk("happy","open","a"),sleep:mk("blink","idle","a")};
const PX=3;
function svg(rows,name){
  const m={};
  rows.forEach((row,y)=>{let x=0;while(x<row.length){const c=row[x];if(c==="."){x++;continue;}let x2=x+1;while(x2<row.length&&row[x2]===c)x2++;
    (m[c]=m[c]||[]).push(`M${x} ${y}h${x2-x}v1h-${x2-x}z`);x=x2;}});
  return `<svg class="kk-f f-${name}" viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length*PX}" height="${rows.length*PX}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(m).map(c=>`<path class="k-${c}" d="${m[c].join("")}"/>`).join("")}</svg>`;
}

/* ---------- lo que dice Kixki: [español, English] ---------- */
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
 utilidad:["Utilidad: {n} herramientas de seguridad y control. {a} es buena para empezar.","Utilities: {n} tools for security and control. {a} is a good place to start."],
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
const UI={
 aria:["Kixki, tu guía. Tócala para que te hable.","Kixki, your guide. Tap her and she'll talk to you."],
 close:["Cerrar","Close"],
 tip:["Pedirle un consejo a Kixki","Ask Kixki for a tip"],
 onT:["Kixki: sí","Kixki: on"],offT:["Kixki: no","Kixki: off"]
};

/* =========================================================  ARRANQUE  */
function boot(){
  if(window.KXK)return;
  const root=document.documentElement,KX=window.KX||{DSK:()=>false};
  const RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
  const isPC=()=>!!KX.DSK();
  const lang=()=>window.KXI&&KXI.lang==="en"?"en":"es";
  const tx=m=>Array.isArray(m)?m[lang()==="en"?1:0]:m;
  const fmt=(s,v)=>v?s.replace(/\{(\w+)\}/g,(a,k)=>v[k]!=null?v[k]:a):s;
  const emit=(t,d)=>dispatchEvent(new CustomEvent("kixki-evt",{detail:Object.assign({t},d)}));

  /* ---------- DOM ---------- */
  const el=document.createElement("div");
  el.id="kixki";el.dataset.f="idle";el.dataset.m="idle";el.classList.add("kk-off");
  el.innerHTML=`<div class="kk-sh"></div><button type="button" class="kk-body"><span class="kk-flip">${Object.keys(FR).map(k=>svg(FR[k],k)).join("")}</span><span class="kk-zz" aria-hidden="true">z<i style="font-style:normal">Z</i></span></button>`+
   `<div class="kk-bub" hidden><span class="kk-nm">Kixki</span><button type="button" class="kk-x">✕</button><p class="kk-tx"><span class="g" aria-hidden="true"></span><span class="v" aria-hidden="true"></span></p>`+
   `<svg class="kk-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div>`+
   `<div class="kk-sr" role="status" aria-live="polite"></div>`;
  document.body.append(el);
  const body=$(".kk-body",el),bub=$(".kk-bub",el),gh=$(".g",bub),vi=$(".v",bub),sr=$(".kk-sr",el),bx=$(".kk-x",el);

  /* ---------- estado ---------- */
  const K={x:0,y:-80,dir:1,mode:"idle",frame:"idle",stage:null,talking:false,off:true,ready:false,tour:null,hl:null,dis:0,game:false,pend:null};
  let cur=null,raf=0,mv=null,brainT=0,lastAct=now(),nextChat=now()+rnd(16000,26000);
  const Q=[],cd={},recent=[];
  const setMode=m=>{K.mode=m;el.dataset.m=m;};
  const frame=f=>{if(K.frame!==f){K.frame=f;el.dataset.f=f;}};
  const face=d=>{K.dir=d;el.style.setProperty("--kd",d);};
  const place=()=>{el.style.transform=`translate3d(${Math.round(K.x)}px,${Math.round(K.y)}px,0)`;if(!bub.hidden)layoutBubble();};

  /* ---------- plataformas: dónde puede estar Kixki ----------
     Cada plataforma devuelve {a,b,y(x)}: tramo horizontal y altura de los pies. Se recalcula siempre en vivo,
     así ella sigue a la barra o a la ventana aunque se desplace la página o arrastres una ventana. */
  const R=sel=>{const e=typeof sel==="string"?$(sel):sel;if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return r.width>8&&r.height>4?r:null;};
  const okY=y=>y>=54&&y<=innerHeight-8;
  const yAt=(sg,x)=>{if(x<=sg[0].a)return sg[0].y;for(let i=0;i<sg.length;i++){if(x<=sg[i].b)return sg[i].y;
    if(sg[i+1]&&x<sg[i+1].a){const u=(x-sg[i].b)/(sg[i+1].a-sg[i].b);return sg[i].y+(sg[i+1].y-sg[i].y)*u;}}return sg[sg.length-1].y;};
  const topWin=()=>{let best=null,bz=-1;$$("#app .cat:not(.min):not(.max)").forEach(e=>{if(e.hidden)return;const z=+getComputedStyle(e).zIndex||0;if(z>=bz){bz=z;best=e;}});return best;};
  /* (parte 2) plataformas extra que registran otros módulos, p. ej. «pet» = la ovejita de abajo */
  const PLAT={},free=id=>id==="dock"||id==="game"||!!PLAT[id];
  function geo(id){
    if(!id)return null;
    if(PLAT[id]){try{return PLAT[id]()||null;}catch(e){return null;}}
    if(id==="search"){const r=R(".search");if(!r)return null;const a=r.left+32;return {a,b:Math.max(a,r.right-32),y:()=>r.top-1};}
    if(id==="dock"){const r=R("#dock");if(!r)return null;const a=r.left+40;return {a,b:Math.max(a,r.right-40),y:()=>r.top+1};}
    if(id.startsWith("tiles")){
      const row=+id.slice(5),T=$$("#desk .di").slice(row*3,row*3+3).map(e=>R(e)).filter(Boolean);
      if(!T.length||isPC())return null;
      const sg=T.map(r=>({a:r.left+28,b:Math.max(r.left+28,r.right-28),y:r.top-4}));
      return {a:sg[0].a,b:sg[sg.length-1].b,y:x=>yAt(sg,x),tiles:T};
    }
    if(id==="win"){
      if(!isPC())return null;const w=topWin();if(!w)return null;const p=w.querySelector(".panel"),r=R(p);if(!r)return null;
      const a=r.left+34;return {a,b:Math.max(a,r.right-34),y:()=>{const q=R(p);return (q||r).top-3;}};
    }
    if(id.startsWith("desk:")){
      if(!isPC())return null;const di=$(`#desk .di[data-id="${id.slice(5)}"]`),r=R(di);if(!r)return null;
      const mid=(r.top+r.bottom)/2,row=$$("#desk .di").map(e=>R(e)).filter(q=>q&&Math.abs((q.top+q.bottom)/2-mid)<24);
      const rx=Math.max(...row.map(q=>q.right))+34;
      return {a:rx,b:rx,y:()=>r.top+86,face:-1,hl:di};
    }
    if(id==="game"){const g=$("#game");if(!g||g.hidden)return null;const r=R("#game .box");if(!r)return null;const a=r.left+34;return {a,b:Math.max(a,r.right-34),y:()=>r.top-3};}
    return null;
  }
  const usable=id=>{const g=geo(id);if(!g)return false;const y=g.y(g.a);
    if(free(id))return y>=54&&y<=innerHeight+4;
    return okY(y)&&y<=innerHeight-(isPC()?56:96);};
  const home=()=>isPC()?"search":"dock";
  const candidates=()=>(isPC()?["search","win"]:["search","tiles0","tiles1","tiles2","dock"]).filter(usable);
  const pickX=g=>g.b>g.a?rnd(g.a,g.b):g.a;

  /* ---------- movimiento: caminar por la plataforma o saltar a otra ---------- */
  function stopMove(){cancelAnimationFrame(raf);raf=0;if(mv){const r=mv.res;mv=null;r&&r();}}
  function walk(tx){
    return new Promise(res=>{
      let g=geo(K.stage);if(!g||RM()){res();return;}
      tx=clamp(tx,g.a,g.b);if(Math.abs(tx-K.x)<4){res();return;}
      stopMove();setMode("walk");face(tx>K.x?1:-1);
      let last=performance.now(),acc=0,st=0;const SP=36;mv={res};
      const end=()=>{raf=0;mv=null;if(K.mode==="walk"){setMode("idle");frame("idle");}res();};
      const tick=t=>{
        if(document.hidden){last=t;raf=requestAnimationFrame(tick);return;}
        const dt=Math.min(.05,(t-last)/1000);last=t;g=geo(K.stage);if(!g){end();return;}
        K.x+=K.dir*SP*dt;if((K.dir>0&&K.x>=tx)||(K.dir<0&&K.x<=tx))K.x=tx;
        K.y=g.y(K.x);acc+=dt;if(acc>.17){acc=0;st=(st+1)%4;frame(["walkB","idle","walkC","idle"][st]);}
        place();if(K.x===tx)end();else raf=requestAnimationFrame(tick);
      };
      raf=requestAnimationFrame(tick);
    });
  }
  function dust(){
    if(RM())return;
    [[-10,-8],[0,0],[10,8]].forEach(([dx,mx])=>{const d=document.createElement("i");d.className="kk-d";d.style.setProperty("--dx",dx+"px");d.style.setProperty("--mx",mx+"px");el.append(d);setTimeout(()=>d.remove(),560);});
  }
  function land(id,x,g){K.stage=id;K.x=x;K.y=g.y(x);setMode("idle");frame("idle");place();}
  function hop(id,tx){
    return new Promise(res=>{
      const g=geo(id);if(!g){res(false);return;}
      const x1=tx==null?pickX(g):clamp(tx,g.a,g.b);
      if(RM()||K.stage===null&&K.y<0&&false){stopMove();land(id,x1,g);if(g.face)face(g.face);res(true);flushQ();return;}
      stopMove();setMode("hop");frame("jump");
      const x0=K.x,y0=K.y,dist=Math.hypot(x1-x0,g.y(x1)-y0),T=clamp(380+dist*.85,450,1250),H=clamp(46+dist*.13,46,160),t0=performance.now();
      face(x1>=x0?1:-1);mv={res:()=>res(false)};
      const tick=t=>{
        const u=Math.min(1,(t-t0)/T),gg=geo(id);if(!gg){raf=0;mv=null;setMode("idle");frame("idle");res(false);return;}
        const yy=gg.y(x1);K.x=x0+(x1-x0)*u;K.y=y0+(yy-y0)*u-4*H*u*(1-u);place();
        if(u<1){raf=requestAnimationFrame(tick);return;}
        raf=0;mv=null;land(id,x1,gg);if(gg.face)face(gg.face);dust();res(true);flushQ();
      };
      raf=requestAnimationFrame(tick);
    });
  }
  /* si su plataforma desaparece (te desplazaste, cambiaste de modo…), busca otra */
  async function relocate(tele){
    if(K.off)return;
    interrupt();
    let id=candidates()[0]||home();if(K.game&&usable("game"))id="game";
    const g=geo(id);if(!g)return;
    if(tele||RM()){stopMove();land(id,(g.a+g.b)/2,g);return;}
    await hop(id,(g.a+g.b)/2);
  }
  let lostT=0,rq=0;
  function resync(){
    if(rq)return;
    rq=requestAnimationFrame(()=>{
      rq=0;if(K.off||!K.ready||K.mode==="hop"||K.mode==="walk")return;
      const g=geo(K.stage);
      if(!g||!(free(K.stage)?true:usable(K.stage))){clearTimeout(lostT);lostT=setTimeout(()=>{const g2=geo(K.stage);if(!g2||!usable(K.stage))relocate();},520);return;}
      clearTimeout(lostT);K.x=clamp(K.x,g.a,g.b);K.y=g.y(K.x);place();
    });
  }

  /* ---------- globo de diálogo ---------- */
  function layoutBubble(){
    if(bub.hidden)return;
    const bw=bub.offsetWidth,bh=bub.offsetHeight,hx=K.x+K.dir*16;
    const left=clamp(hx-bw/2,8,Math.max(8,innerWidth-8-bw));
    bub.style.left=(left-K.x)+"px";bub.style.setProperty("--tx",clamp(hx-left,16,bw-16)+"px");
    bub.classList.toggle("below",K.y-45-14-bh<6);
  }
  function begin(m){
    cur=m;K.talking=true;stopMove();
    if(K.mode==="sleep")frame("idle");
    setMode("talk");
    const g=geo(K.stage);if(g&&g.face)face(g.face);
    if(m.hl){K.hl=m.hl;m.hl.classList.add("kk-pt");}
    gh.textContent=m.text;vi.textContent="";bub.hidden=false;
    if(m.sr)sr.textContent=m.text;
    layoutBubble();
    let i=0;const n=m.text.length,spd=RM()?0:24;
    const step=()=>{
      if(cur!==m)return;
      if(!spd||i>=n){vi.textContent=m.text;typed(m);return;}
      const ch=m.text[i];i++;vi.textContent=m.text.slice(0,i);
      if(ch!==" "){frame(i%6<3?"talk":(m.mood==="happy"?"happy":"idle"));if(i%3===0&&window.KXS)try{KXS.beep(500+((i*37)%240),.03);}catch(e){}}
      m.t=setTimeout(step,/[.,!?…]/.test(ch)?170:spd);
    };
    step();
  }
  function typed(m){
    if(cur!==m)return;
    frame(m.mood==="happy"?"happy":"idle");
    if(m.mood==="happy"&&!RM())el.classList.add("kk-cheer");
    m.t=setTimeout(()=>done(m,"auto"),clamp(2200+m.text.length*50,3200,9500));
  }
  function done(m,how){
    if(cur!==m)return;
    clearTimeout(m.t);cur=null;K.talking=false;bub.hidden=true;
    if(K.hl){K.hl.classList.remove("kk-pt");K.hl=null;}
    if(K.mode==="talk")setMode("idle");
    frame("idle");el.classList.remove("kk-cheer");
    if(how==="user"){if(++K.dis>=3){K.dis=0;nextChat=now()+120000;}}else K.dis=0;
    m.res(true);
    setTimeout(flushQ,420);brain(rnd(1800,3800));
  }
  function interrupt(){
    if(!cur)return;const c=cur;clearTimeout(c.t);cur=null;K.talking=false;bub.hidden=true;
    if(K.hl){K.hl.classList.remove("kk-pt");K.hl=null;}
    el.classList.remove("kk-cheer");if(K.mode==="talk")setMode("idle");frame("idle");c.res(false);
  }
  function flushQ(){if(K.talking||K.off||!Q.length||K.mode==="hop")return;begin(Q.shift());}
  /* say(mensaje, {p: prioridad 1-3, key, cd, mood, hl, vars}) → promesa true si se dijo */
  function say(msg,o={}){
    return new Promise(res=>{
      if(!S.on||K.off||!K.ready&&!o.force){res(false);return;}
      const key=o.key;if(key&&(cd[key]||0)>now()){res(false);return;}
      const p=o.p||1,m={text:fmt(tx(msg),o.vars),p,mood:o.mood,hl:o.hl,sr:p>1,res};
      if(key)cd[key]=now()+(o.cd||0);
      if(K.talking){
        if(p>cur.p){interrupt();begin(m);}
        else if(p>=2&&Q.length<4)Q.push(m);
        else res(false);
        return;
      }
      if(K.mode==="hop"){if(Q.length<4)Q.push(m);else res(false);return;}
      begin(m);
    });
  }
  const idOf=m=>Array.isArray(m)?m[0]:m.t[0];
  function pick(list,key){
    const ok=list.filter(m=>!recent.includes(key+":"+idOf(m))),pool=ok.length?ok:list,m=pool[Math.floor(Math.random()*pool.length)];
    recent.push(key+":"+idOf(m));if(recent.length>14)recent.shift();return m;
  }
  const pickTip=()=>pick(T.tips.filter(t=>(!t.pc||isPC())&&(!t.mob||!isPC())),"tip").t;
  function pickMisc(){
    const h=new Date().getHours(),list=[...T.facts],bg=root.getAttribute("data-bg");
    if(h>=23||h<5)list.push(T.late);
    if(bg==="halloween"||bg==="navidad")list.push(T.bg[bg]);
    const pk=$("#pick b");if(pk)list.push(["Hoy te sugiero «"+pk.textContent+"». ¿Le echas un vistazo?","Today I suggest “"+pk.textContent+"”. Want to take a look?"]);
    return pick(list,"misc");
  }

  /* ---------- carpetas ---------- */
  const allIds=()=>$$("#app .cat").map(e=>e.id);
  const cnt=id=>{const c=$(`#${id} .chip`);return c?(parseInt(c.textContent)||0):0;};
  const firstApp=id=>{const h=$(`#${id} .app h3`);return h?h.textContent.trim():"";};
  function folderLine(id){
    const n=cnt(id),a=firstApp(id);
    if(id==="favs")return n?[`Tus favoritas: ${n}. ¡Buen gusto! ⭐`,`Your favorites: ${n}. Great taste! ⭐`]:["Aún no tienes favoritas. Toca la ☆ de una app y aparecerá aquí.","No favorites yet. Tap the ☆ on an app and it'll show up here."];
    if(id==="news")return n?[`¡Novedades! Hay ${n} app${n===1?"":"s"} nueva${n===1?"":"s"} desde tu última visita. 🆕`,`News! There ${n===1?"is":"are"} ${n} new app${n===1?"":"s"} since your last visit. 🆕`]:["Sin novedades por ahora. Cuando haya apps nuevas, las verás aquí.","Nothing new for now. When new apps arrive, you'll see them here."];
    const f=FOLD[id];return f?[fmt(f[0],{n,a}),fmt(f[1],{n,a})]:null;
  }
  async function visitFolder(id,o={}){
    const line=folderLine(id);if(!line)return false;
    if(isPC()){
      const di=$(`#desk .di[data-id="${id}"]`);
      if(!usable("desk:"+id))return say(line,o);
      await hop("desk:"+id);
      return say(line,Object.assign({hl:di},o));
    }
    const i=$$("#desk .di").findIndex(e=>e.dataset.id===id),row=Math.floor(i/3),sid="tiles"+row;
    if(i>=0&&usable(sid)){const g=geo(sid),r=g.tiles[i%3];await hop(sid,r?r.left+r.width/2:undefined);}
    return say(line,o);
  }
  function onFolder(id,st){
    S.fc[id]=(S.fc[id]||0)+1;
    const first=!S.opened.includes(id);if(first)S.opened.push(id);
    save();const total=allIds().length;
    emit("folder",{id,first,state:st,count:S.opened.length,total});
    K.tour=null;
    if(S.opened.length>=total&&!S.allDone){S.allDone=1;save();emit("allfolders",{total});say(T.allDone,{p:3,mood:"happy"});return;}
    if(!isPC()&&st==="max"){K.pend=id;return;}
    if(S.fc[id]<=2||Math.random()<.18)visitFolder(id,{p:first?2:1,key:"fold:"+id,cd:30000});
  }

  /* ---------- cerebro: qué hace cuando nadie le dice nada ---------- */
  const alive=()=>S.on&&!K.off&&K.ready&&!document.hidden&&!K.talking&&!K.tour&&K.mode!=="hop";
  function brain(ms){clearTimeout(brainT);brainT=setTimeout(think,ms==null?rnd(2600,6200):ms);}
  const dark=()=>root.getAttribute("data-theme")==="dark";
  function chatter(){
    const w=Math.random();nextChat=now()+rnd(26000,50000);
    if(w<.2&&(isPC()||!K.game)&&Math.random()<.9){const ids=["tiendas","importante","utilidad","decoracion","musica","teclados","packs"].filter(i=>$(`#desk .di[data-id="${i}"]`));
      visitFolder(ids[Math.floor(Math.random()*ids.length)],{p:1,key:"chat"});return;}
    const m=w<.55?pickTip():w<.85?pick(T.praise,"praise"):pickMisc();say(m,{p:1,key:"chat"});
  }
  async function think(){
    if(!alive()){brain(2500);return;}
    const idle=now()-lastAct;
    if(K.mode==="sleep"){brain(6000);return;}
    if(dark()&&idle>150000&&K.mode==="idle"){setMode("sleep");frame("sleep");brain(6000);return;}
    const g=geo(K.stage);
    if(!g||!usable(K.stage)&&!free(K.stage)){await relocate();brain();return;}
    if(K.game){brain(4000);return;}
    if(now()>=nextChat&&idle<240000){chatter();brain(5000);return;}
    const r=Math.random();
    if(g.b-g.a>40&&r<.62)await walk(rnd(g.a,g.b));
    else if(r<.92){const c=candidates().filter(i=>i!==K.stage);if(c.length)await hop(c[Math.floor(Math.random()*c.length)]);}
    brain();
  }
  /* parpadeo */
  (function blink(){setTimeout(()=>{if(K.mode==="idle"&&K.frame==="idle"&&!K.off&&!document.hidden){frame("blink");setTimeout(()=>{if(K.frame==="blink")frame("idle");},130);}blink();},rnd(2600,6000));})();

  /* ---------- presentación y tour de la primera visita ---------- */
  async function tour(){
    const tok=K.tour={},steps=isPC()?TOUR_PC:TOUR_MOB;
    for(const [st,m] of steps){
      if(K.tour!==tok||K.off)break;
      if(st&&st!==K.stage&&usable(st)){await hop(st);if(K.tour!==tok)break;}
      const ok=await say(m,{p:2});if(!ok&&K.tour!==tok)break;
      await wait(450);
    }
    if(K.tour===tok)K.tour=null;
  }
  async function greet(){
    const first=!S.first,prev=S.last;let again=false;
    try{again=!!sessionStorage.getItem("kixki-k-s");sessionStorage.setItem("kixki-k-s","1");}catch(e){}
    if(!again)S.visits++;
    if(!S.first)S.first=now();S.last=now();save();
    emit("visit",{n:S.visits,first,prev,again});
    if(again)return;
    if(first){await tour();return;}
    const h=new Date().getHours(),days=Math.floor((now()-prev)/864e5);
    const m=days>=3?T_fmt(GREET.away,{d:days}):h<5||h>=23?GREET.night:h<12?GREET.morning:h<19?GREET.afternoon:GREET.evening;
    await say(m,{p:2});
    const nn=cnt("news");if(nn>0){await wait(350);say(nn===1?GREET.news1:T_fmt(GREET.newsN,{n:nn}),{p:2});}
  }
  const T_fmt=(pair,v)=>[fmt(pair[0],v),fmt(pair[1],v)];

  /* ---------- reacciones a lo que haces ---------- */
  const q=$("#q");let sT=0;
  async function onSearch(){
    const v=q.value.trim();if(v.length<2)return;
    const apps=$$("#app .cat:not(#favs):not(#news):not(#packs) .app:not([hidden])"),n=apps.length,a=n?apps[0].querySelector("h3").textContent.trim():"";
    emit("search",{q:v,n});
    if(!S.on||K.off)return;
    if(usable("search")&&K.stage!=="search"&&alive())await hop("search");
    say(n===0?T_fmt(T.noRes,{q:v}):n===1?T_fmt(T.oneRes,{a}):T_fmt(T.manyRes,{n,q:v}),{p:2,key:"search",cd:7000});
  }
  q.addEventListener("input",()=>{clearTimeout(sT);K.tour=null;sT=setTimeout(onSearch,850);});
  q.addEventListener("focus",async()=>{
    if(!S.on||K.off||!K.ready)return;
    if(usable("search")&&K.stage!=="search"&&alive())await hop("search");
    say(T.focus,{p:1,key:"focus",cd:120000});
  });
  const favCount=()=>{try{return JSON.parse(localStorage.getItem("kixki-fav")||"[]").length;}catch(e){return 0;}};
  let prevFav=favCount();
  document.addEventListener("click",e=>{
    if(!e.target.closest(".star"))return;
    setTimeout(()=>{
      const n=favCount(),added=n>prevFav;prevFav=n;emit("fav",{n,added});
      say(!added?T.favDel:n===1?T.fav1:n%5===0?T_fmt(T.fav5,{n}):T.favAdd,{p:2,key:"fav",cd:4000,mood:added&&(n===1||n%5===0)?"happy":undefined});
    },40);
  });
  let prevTheme=root.getAttribute("data-theme");
  new MutationObserver(()=>{
    const t=root.getAttribute("data-theme");if(t===prevTheme)return;prevTheme=t;emit("theme",{dark:t==="dark"});
    if(K.mode==="sleep"){setMode("idle");frame("idle");}
    if(K.ready)say(t==="dark"?T.night:T.day,{p:1,key:"theme",cd:8000});
  }).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  let prevBg=window.KXB?KXB.label():"";
  addEventListener("kixki-bg",()=>{
    if(!window.KXB)return;const l=KXB.label();if(l===prevBg)return;prevBg=l;
    const auto=/^Auto/.test(l),k=auto?"auto":(root.getAttribute("data-bg")||"");emit("bg",{k});
    if(K.ready&&T.bg[k])say(T.bg[k],{p:1,key:"bg",cd:5000});
  });
  let prevMus=!!(window.KXM&&KXM.on);
  document.addEventListener("click",e=>{
    if(!e.target.closest("#rd,#s-mus"))return;
    setTimeout(()=>{const on=!!(window.KXM&&KXM.on);if(on===prevMus)return;prevMus=on;emit("music",{on});say(on?T.musOn:T.musOff,{p:1,key:"mus",cd:10000});},80);
  });
  addEventListener("kixki-game",e=>onGame(e.detail||{}));
  function onGame(d){
    emit("game",d);
    if(!S.on)return;
    if(d.t==="start"||d.t==="retry"){
      K.game=true;el.classList.add("kk-top");K.tour=null;
      if(d.t==="start")setTimeout(async()=>{if(!K.game)return;if(K.stage!=="game"&&usable("game"))await hop("game");
        say(d.rec>0?T_fmt(T.gStartRec,{rec:d.rec}):T.gStart,{p:2,key:"gstart",cd:15000});},350);
    }else if(d.t==="record")say(T.gRecord,{p:3,mood:"happy",key:"grec",cd:6000});
    else if(d.t==="over"){
      const m=d.nr&&!d.first?T_fmt(T.gOverRec,{sc:d.sc}):d.first&&d.sc>0?T_fmt(T.gOverFirst,{sc:d.sc}):d.sc===0?T.gOverZero:d.sc>=d.rec*.8&&d.rec>2?T_fmt(T.gOverNear,{sc:d.sc}):T_fmt(T.gOver,{sc:d.sc});
      say(m,{p:3,mood:d.nr&&!d.first?"happy":undefined,key:"gover",cd:2500});
    }
  }
  /* idioma: avisa y traduce sus textos fijos */
  function labels(){
    const L=lang()==="en"?1:0;
    body.setAttribute("aria-label",UI.aria[L]);bx.setAttribute("aria-label",UI.close[L]);
    const t=$("#s-kx-tip"),o=$("#s-kx-on");if(t)t.textContent=UI.tip[L];if(o)o.textContent=(S.on?UI.onT:UI.offT)[L];
  }
  if(window.KXI&&!KXI._kk){KXI._kk=1;const o=KXI.set;KXI.set=function(l){o.call(KXI,l);labels();emit("lang",{lang:l});interrupt();if(K.ready)say(T.lang[l==="en"?"en":"es"],{p:2,key:"lang",cd:2500});};}
  /* volver a la pestaña */
  let hiddenAt=0;
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){hiddenAt=Date.now();return;}
    if(hiddenAt&&Date.now()-hiddenAt>90000&&K.ready){say(T.back,{p:1,key:"back",cd:60000});}
    resync();
  });

  /* ---------- tocar a Kixki ---------- */
  let taps=[];
  body.addEventListener("click",()=>{
    act();const t=now();taps=taps.filter(x=>t-x<4000);taps.push(t);emit("tap",{n:taps.length});
    if(window.KXS)try{KXS.baa();}catch(e){}
    if(taps.length>=7){taps=[];say(T.dizzy,{p:3,key:"dizzy",cd:9000});setTimeout(()=>{if(alive()){const c=candidates().filter(i=>i!==K.stage);if(c.length)hop(c[0]);}},2600);return;}
    if(cur)done(cur,"user");
    const r=Math.random();
    say(r<.5?pickTip():r<.78?pick(T.tap,"tap"):pick(T.praise,"praise"),{p:2});
  });
  bub.addEventListener("click",()=>{if(cur)done(cur,"user");});
  if(matchMedia("(hover:hover)").matches){
    bub.addEventListener("mouseenter",()=>{if(cur&&cur.t&&K.talking&&bub.hidden===false&&vi.textContent===cur.text)clearTimeout(cur.t);});
    bub.addEventListener("mouseleave",()=>{if(cur&&vi.textContent===cur.text){const c=cur;clearTimeout(c.t);c.t=setTimeout(()=>done(c,"auto"),1800);}});
  }
  addEventListener("keydown",e=>{if(e.key==="Escape"&&cur)done(cur,"user");});

  /* ---------- actividad del visitante (para dormir y despertar) ---------- */
  function act(){
    lastAct=now();
    if(K.mode==="sleep"){setMode("idle");frame("idle");say(T.wake,{p:1,key:"wake",cd:60000});}
  }
  ["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,act,{passive:true,capture:true}));
  addEventListener("scroll",()=>{lastAct=now();resync();},{passive:true});
  addEventListener("resize",resync);

  /* ---------- menú: apagar a Kixki y pedirle un consejo ---------- */
  const sm=KX.sm||$("#sm");
  if(sm){
    const ref=$("#s-sug",sm);
    const html=`<button type="button" class="sm" id="s-kx-tip"></button><button type="button" class="sm" id="s-kx-on"></button>`;
    ref?ref.insertAdjacentHTML("beforebegin",html):sm.insertAdjacentHTML("beforeend",html);
    sm.addEventListener("click",e=>{
      const b=e.target.closest("#s-kx-tip,#s-kx-on");if(!b)return;
      if(b.id==="s-kx-on"){S.on=!S.on;save();applyOn();labels();if(S.on)setTimeout(()=>say(pick(T.praise,"praise"),{p:2}),700);}
      else if(S.on){setTimeout(()=>say(pickTip(),{p:3}),250);}
      else{S.on=true;save();applyOn();labels();setTimeout(()=>say(pickTip(),{p:3}),700);}
    });
  }
  function applyOn(){
    if(!S.on){interrupt();Q.length=0;stopMove();el.classList.add("kk-gone");}
    else{el.classList.remove("kk-gone");if(K.ready){const g=geo(K.stage);if(!g||!usable(K.stage))relocate(true);else resync();}}
  }
  labels();

  /* ---------- vigilante: ventanas, carpetas, pantalla completa, juego ---------- */
  const prevSt={};let scanQ=0,wasOff=true,prevPC=isPC();
  function scan(){
    scanQ=0;
    $$("#app .cat").forEach(s=>{
      const st=s.classList.contains("min")?"min":s.classList.contains("max")?"max":"normal",p=prevSt[s.id];prevSt[s.id]=st;
      if(p==="min"&&st!=="min"&&K.ready)onFolder(s.id,st);
    });
    const gameOpen=!!($("#game")&&!$("#game").hidden);
    if(K.game&&!gameOpen){K.game=false;el.classList.remove("kk-top");if(K.ready&&S.on)relocate();}
    const off=!S.on||!!$(".cat.max")||!!$("#boot:not([hidden])")||!!$("#run:not([hidden])")||!!$("#qr:not([hidden])");
    if(off!==wasOff){
      wasOff=off;K.off=off;
      if(off){interrupt();Q.length=0;stopMove();el.classList.add("kk-off");}
      else if(K.ready){
        el.classList.remove("kk-off");
        const g=geo(K.stage);if(!g||!usable(K.stage)&&!free(K.stage))relocate(true);else resync();
        if(K.pend){const id=K.pend;K.pend=null;setTimeout(()=>visitFolder(id,{p:1,key:"fold:"+id,cd:30000}),700);}
        brain(2500);
      }
    }
    if(isPC()!==prevPC){prevPC=isPC();K.tour=null;if(K.ready){interrupt();Q.length=0;K.stage=null;relocate(true);}}
    if(S.opened.length&&false)save();
  }
  new MutationObserver(()=>{if(!scanQ)scanQ=requestAnimationFrame(scan);}).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","hidden"]});
  scan();

  /* ---------- aparece ---------- */
  async function start(){
    for(let i=0;i<24&&$("#boot:not([hidden])");i++)await wait(300);
    scan();
    /* (parte 2) la carpeta que la página abre sola en PC cuenta como abierta; si no, «abrir todas» sería imposible */
    $$("#app .cat:not(.min)").forEach(x=>{if(!S.opened.includes(x.id))S.opened.push(x.id);});save();
    const id=home(),g=geo(id)||geo(candidates()[0]);
    K.ready=true;if(!g){return;}
    K.x=(g.a+g.b)/2;K.y=-70;place();
    if(S.on&&!K.off)el.classList.remove("kk-off");
    await wait(350);
    await hop(id,(g.a+g.b)/2);
    brain(7000);
    greet();
  }
  start();

  /* ---------- lo que Kixki ofrece a la parte 2 ---------- */
  window.KXK={say,hop,walk,geo,emit,pick,state:S,save,get stage(){return K.stage;},get ready(){return K.ready;},isPC,
    tx,fmt,T,wait,visitFolder,usable,relocate,
    /* (parte 2) */
    K,alive,interrupt,brain,dark,rows:FR,el,
    plat:(id,fn)=>{PLAT[id]=fn;},
    /* (parte 3: travesuras y físicas, kixki3.js) */
    ex:{place,land,setMode,frame,face,stopMove,R,topWin,say,layoutBubble}};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki:",e);const x=document.getElementById("kixki");if(x)x.remove();}catch(_){}}};
window.KXR?run():addEventListener("kixki-ready",run,{once:true});
})();
