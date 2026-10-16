/* =========================================================
   KIXKI · la oveja guía  (parte 2)
   - LOGROS: Kixki te felicita («¡Eres muy pro, no lo olvides!») cuando haces cosas como romper tu récord en el
     Salta Vallas, abrir todas las carpetas, buscar, guardar favoritas, cambiar de fondo… En PC y en móvil.
     Aviso con tarjeta arriba + confeti + Kixki celebrando. Se ven en el menú Kixki / Más → «Logros».
   - CHARLA: en PC, Kixki baja a hablar con la ovejita que camina sola abajo (cada rato, o desde el menú,
     o cuando le haces muchas cosquillas a la ovejita). De noche la encuentra dormida.
   - PISTAS: de vez en cuando Kixki te susurra qué logro te queda más cerca.
   - PARAGUAS: cuando empieza a llover, Kixki baja a ver a la ovejita de abajo (solo PC) y le baja un paraguas para que no se moje.
     Se queda sobre ella mientras llueva y se recoge solo al parar. Probar: KXQ.umbrella(true) (hace llover) / KXQ.umbrella(false)
   - EASTER EGG «Modo Hacker»: si abres la consola (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C) o el inspector, Kixki se pone lentes y
     sudadera con capucha y te saluda en su globo. Al cerrar el inspector, vuelve a ser la de siempre. Probar: KXQ.hacker(true/false)
   - Todo se guarda en localStorage ("kixki-a"). API para pruebas en la consola: KXQ.list(), KXQ.grant("id"), KXQ.reset()
   Depende de: kixki.js (parte 1: evento "kixki-evt", window.KXK) y app.js (evento "kixki-game").
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;

/* Nombre de la ovejita de abajo (cámbialo aquí si quieres darle otro) */
const PET_NAME=["Ovejita","Little sheep"];

/* ---------- iconos de pixel art para los logros ---------- */
const ICON={
 star:["....g....","....g....","...ggg...","ggggggggg",".ggggggg.","..ggggg..","..gg.gg..",".gg...gg.",".g.....g."],
 folder:[".hhhh....","hhhhhhhhh","hgggggggh","hgggggggh","hgggggggh","hgggggggh","hgggggggh","hhhhhhhhh"],
 search:[".cccc....","c....c...","c....c...","c....c...",".cccc....",".....hh..","......hh.",".......hh"],
 heart:[".pp...pp.","pppp.pppp","ppppppppp","ppppppppp",".ppppppp.","..ppppp..","...ppp...","....p...."],
 trophy:["ggggggggg","g.ggggg.g","g.ggggg.g",".ggggggg.","..ggggg..","...ggg...","....g....","...hhh...","..hhhhh.."],
 moon:["..vvvv...",".vvv.....","vvv......","vvv......","vvv......","vvv......",".vvv.....","..vvvvvv.","...vvvv.."],
 note:["...nnnnn.","...n...n.","...n...n.","...n...n.","...n...n.",".nnn.nnn.","nnnn.nnnn","nnnn.nnnn"],
 crown:["g...g...g","gg.ggg.gg","ggggggggg","ggggggggg","ghghghghg","hhhhhhhhh"],
 bolt:["....ggg..","...ggg...","..ggg....",".ggggggg.","....ggg..","...ggg...","..gg.....",".g......."],
 key:[".gggg....","g....g...","g....g...",".gggg....","..g......","..gg.....","..g......","..gg....."],
 gift:["..pp.pp..",".p..p..p.","....p....","rrrrprrrr","rwwwpwwwr","rwwwpwwwr","rrrrprrrr","rwwwpwwwr","rrrrrrrrr"],
 drop:["....c....","...ccc...","...ccc...","..ccccc..",".ccccccc.",".ccwcccc.",".ccccccc.","..ccccc.."],
 globe:["..nnnnn..",".nnwwnnn.","nnwnnnnnn","nnnnwwnnn","nnnnnwnnn","nnnnnnnnn",".nnnnnnn.","..nnnnn.."],
 sheep:["..wwwww..",".wwwwwww.","dwwwwwwwd","dfffffffd",".fefffef.",".fffpfff.","..fffff..","...f.f..."],
 ghost:["..wwwww..",".wwwwwww.",".wewwwew.",".wwwwwww.",".wwwmwww.",".wwwwwww.",".ww.w.ww."],
 jump:["....a....","...aaa...","..aaaaa..",".aaaaaaa.","...aaa...","...aaa...","...aaa...","ooooooooo"],
 tag:["aaaaaa...","aaaaaaa..","aaa.aaaa.","aaaaaaaaa","aaaaaaaa.","aaaaaaa..","aaaaaa..."],
 bucket:[".kkkkkkk.","kcwcccwck","klllllllk",".klllllk.",".klllllk.","..klllk..","..kkkkk.."],
 flameA:["....x....","...xx..x.","..xxx.xx.",".xxyxxxx.",".xxyyxxx.","xxyyyyxxx","xxyyyyyxx",".xxyyyxx.","..xxxxx.."],
 flameB:[".....x...",".x...xx..",".xx.xxx..",".xxxxyxx.",".xxxyyxx.","xxxyyyyxx","xxyyyyyxx",".xxyyyxx.","..xxxxx.."],
 q:["..aaaaa..",".aa...aa.","......aa.",".....aa..","....aa...",".........","....aa..."]
};
function ic(name,px,cls){
  const rows=ICON[name]||ICON.star,m={};
  rows.forEach((row,y)=>{let x=0;while(x<row.length){const c=row[x];if(c==="."){x++;continue;}let x2=x+1;while(x2<row.length&&row[x2]===c)x2++;
    (m[c]=m[c]||[]).push(`M${x} ${y}h${x2-x}v1h-${x2-x}z`);x=x2;}});
  const w=Math.max(...rows.map(r=>r.length));
  return `<svg class="kq-i ${cls||""}" viewBox="0 0 ${w} ${rows.length}" width="${w*px}" height="${rows.length*px}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(m).map(c=>`<path class="q-${c}" d="${m[c].join("")}"/>`).join("")}</svg>`;
}
function sprite(rows,px,cls){ /* la misma paleta que Kixki (clases k-*) */
  const m={};
  rows.forEach((row,y)=>{let x=0;while(x<row.length){const c=row[x];if(c==="."){x++;continue;}let x2=x+1;while(x2<row.length&&row[x2]===c)x2++;
    (m[c]=m[c]||[]).push(`M${x} ${y}h${x2-x}v1h-${x2-x}z`);x=x2;}});
  return `<svg class="${cls||""}" viewBox="0 0 ${rows[0].length} ${rows.length}" width="${rows[0].length*px}" height="${rows.length*px}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${Object.keys(m).map(c=>`<path class="k-${c}" d="${m[c].join("")}"/>`).join("")}</svg>`;
}

/* ---------- textos de la interfaz ---------- */
const UI={
 head:["¡Logro desbloqueado!","Achievement unlocked!"],
 title:["logros.exe","achievements.exe"],
 menu:["Logros","Achievements"],
 petMenu:["Hablar con la ovejita","Chat with the little sheep"],
 close:["Cerrar","Close"],
 lvl:["Nivel","Level"],
 secret:["Secreto","Secret"],
 hid:["Oculto","Hidden"],
 pc:["Solo en PC","PC only"],
 nw:["¡Nuevo!","New!"],
 locked:["Bloqueado","Locked"],
 sumHead:["¡Kixki revisó tu historial!","Kixki checked your history!"],
 sumName:["{n} logros que ya tenías","{n} achievements you already had"],
 sumDesc:["Míralos en el menú Kixki → Logros.","See them in the Kixki menu → Achievements."],
 many:["{n} logros nuevos de golpe","{n} new achievements at once"],
 manyDesc:["Toca para verlos todos.","Tap to see them all."],
 offNote:["Kixki está descansando. Enciéndela en el menú Kixki.","Kixki is resting. Turn her on in the Kixki menu."],
 pcOnly:["La ovejita de abajo solo vive en el modo PC. 🐑","The little sheep downstairs only lives in PC mode. 🐑"]
};
const CAT={e:["Explorar","Explore"],f:["Favoritas","Favorites"],g:["Salta Vallas","Fence Jump"],s:["A tu estilo","Your style"],w:["Clima","Weather"],k:["Kixki y amigas","Kixki & friends"],v:["Constancia","Loyalty"]};
const LV=[["Corderito","Little lamb"],["Oveja curiosa","Curious sheep"],["Oveja lista","Smart sheep"],["Oveja pro","Pro sheep"],["Oveja experta","Expert sheep"],["Oveja suprema","Supreme sheep"]];
const LV_TH=[0,.1,.3,.55,.8,1];

/* ---------- lista de logros ----------
   a(id, icono, categoría, [nombre es/en], [descripción es/en], condición(ctx), opciones)
   opciones: hid (oculto del todo hasta desbloquearlo) · secret + h (pista) · pc (solo PC) · big (confeti grande) · quiet (la parte 1 ya habla de eso) · game · k (frase de Kixki) */
const A=[];
const a=(id,i,c,n,d,f,o)=>A.push(Object.assign({id,i,c,n,d,f},o||{}));
/* — Explorar — */
a("fold1","folder","e",["Primer paso","First step"],["Abre tu primera carpeta.","Open your first folder."],c=>c.folders>=1);
a("fold5","folder","e",["Curiosidad en marcha","Curiosity in motion"],["Abre 5 carpetas distintas.","Open 5 different folders."],c=>c.folders>=5);
a("foldall","crown","e",["Mapa completo","Full map"],["Abre TODAS las carpetas.","Open ALL the folders."],c=>c.allDone||(c.total>0&&c.folders>=c.total),{big:1,quiet:1});
a("search1","search","e",["Con lupa","Magnifier in hand"],["Busca una app por su nombre.","Search for an app by name."],c=>c.searches>=1);
a("search10","search","e",["Ojo de lince","Eagle eye"],["Haz 10 búsquedas.","Run 10 searches."],c=>c.searches>=10);
a("tag","tag","e",["Filtro maestro","Filter master"],["Usa una etiqueta para filtrar el catálogo.","Use a tag to filter the catalog."],c=>c.tags>=1);
a("run","bolt","e",["Atajo de pro","Pro shortcut"],["Abre «Ejecutar» (Ctrl + K o desde el menú).","Open “Run” (Ctrl + K or from the menu)."],c=>c.run>=1);
a("nores","ghost","e",["Misterio sin resolver","Unsolved mystery"],["Busca algo que no existe en la tienda.","Search for something that isn't in the store."],c=>c.nores>=1,
  {secret:1,h:["Hay cosas que no están en la tienda…","Some things aren't in the store…"],k:["¡Buscaste algo que no existe! Ese misterio queda en el rebaño. 👻","You searched for something that doesn't exist! That mystery stays in the flock. 👻"]});
/* — Favoritas — */
a("fav1","heart","f",["Corazón de lana","Heart of wool"],["Guarda tu primera app favorita.","Save your first favorite app."],c=>c.favMax>=1);
a("fav5","heart","f",["Buen gusto","Great taste"],["Ten 5 apps en favoritas.","Have 5 apps in favorites."],c=>c.favMax>=5);
a("fav10","star","f",["Coleccionista","Collector"],["Ten 10 apps en favoritas.","Have 10 apps in favorites."],c=>c.favMax>=10);
/* — Salta Vallas — */
a("g1","jump","g",["Primer salto","First jump"],["Juega al Salta Vallas.","Play Fence Jump."],c=>c.plays>=1,{game:1});
a("g10","jump","g",["Salto olímpico","Olympic jump"],["Llega a 10 saltos en una partida.","Reach 10 jumps in one run."],c=>c.runMax>=10,{game:1,k:["¡10 saltos! Eso es de pro, no lo olvides. 🐑","10 jumps! That's pro stuff, never forget it. 🐑"]});
a("g25","star","g",["Con alas de lana","Woolly wings"],["Llega a 25 saltos en una partida.","Reach 25 jumps in one run."],c=>c.runMax>=25,{game:1,big:1});
a("grec","trophy","g",["¡Récord roto!","Record broken!"],["Supera tu propio récord en el Salta Vallas.","Beat your own record in Fence Jump."],c=>c.recBroken,{game:1,big:1,quiet:1});
a("gp10","jump","g",["Una más y paro","Just one more"],["Juega 10 partidas.","Play 10 runs."],c=>c.plays>=10,{game:1});
a("g50","trophy","g",["Leyenda ovina","Sheepy legend"],["Llega a 50 saltos en una partida.","Reach 50 jumps in one run."],c=>c.runMax>=50,
  {game:1,big:1,secret:1,h:["Solo las leyendas llegan tan lejos…","Only legends get this far…"]});
/* — A tu estilo — */
a("theme","moon","s",["Día y noche","Day and night"],["Cambia entre modo claro y oscuro.","Switch between light and dark mode."],c=>c.theme>=1);
a("night","moon","s",["Búho de lana","Woolly owl"],["Visita la tienda de madrugada (23:00 a 5:00).","Visit the store in the small hours (11 pm to 5 am)."],c=>c.night,
  {k:["¡Un búho de lana! Yo también hago guardia. 🌙","A woolly owl! I keep watch too. 🌙"]});
a("bg4","drop","s",["Cambio de aires","Change of scenery"],["Prueba 4 fondos distintos.","Try 4 different backgrounds."],c=>c.bgs>=4);
a("acc","drop","s",["Toque de color","Splash of color"],["Cambia el color de acento.","Change the accent color."],c=>c.acc>=1);
a("music","note","s",["Ritmo ovino","Sheepy beat"],["Activa la música.","Turn the music on."],c=>c.music);
a("lang","globe","s",["Políglota","Polyglot"],["Cambia el idioma de la página.","Change the page language."],c=>c.lang);
a("view","key","s",["Doble vida","Double life"],["Cambia entre modo móvil y modo PC.","Switch between mobile and PC mode."],c=>c.view);
a("qr","gift","s",["Pásalo al móvil","Pass it on"],["Abre el código QR de la tienda.","Open the store's QR code."],c=>c.qr,{pc:1});
/* — Clima — */
a("rain1","drop","w",["Día de lluvia","Rainy day"],["Ve cómo empieza a llover en la tienda (en el menú: Lluvia).","Watch it start raining in the store (in the menu: Rain)."],c=>c.rain>=1);
a("glass","drop","w",["Gotas en la pantalla","Drops on the screen"],["Deja la página quieta bajo la lluvia hasta que las gotas lleguen a la pantalla.","Leave the page still in the rain until drops hit the screen."],c=>c.glass);
a("wipe","drop","w",["Limpiaparabrisas","Windshield wiper"],["Limpia 5 gotas de la pantalla con el dedo o el ratón.","Wipe 5 drops off the screen with your finger or mouse."],c=>c.wiped>=5,{k:["¡Pantalla limpia! Qué manos tan pro. ✨","Clean screen! Such pro hands. ✨"]});
a("firerain","bucket","w",["Bendita lluvia","Blessed rain"],["Deja que la lluvia apague el fuego de la ovejita de verano.","Let the rain put out the little sheep's summer fire."],c=>c.fireRain>=1,{pc:1,k:["¡La lluvia llegó justo a tiempo! A veces el cielo ayuda. 🌧️","The rain came just in time! Sometimes the sky helps. 🌧️"]});
/* — Kixki y amigas — */
a("tap7","sheep","k",["Cosquillas","Tickles"],["Toca a Kixki muchas veces seguidas.","Tap Kixki many times in a row."],c=>c.tapFast,
  {secret:1,h:["A Kixki le encantan los toques rápidos…","Kixki loves quick taps…"],k:["¡Jajaja! ¡Cosquillas! Logro secreto desbloqueado. 🤫","Hahaha! Tickles! Secret achievement unlocked. 🤫"]});
a("tap50","sheep","k",["Amistad de lana","Woolly friendship"],["Toca a Kixki 50 veces en total.","Tap Kixki 50 times in total."],c=>c.tapsK>=50);
a("petchat","sheep","k",["Cotilla de rebaño","Flock gossip"],["Presencia una charla entre Kixki y la ovejita de abajo.","Watch a chat between Kixki and the little sheep downstairs."],c=>c.petChats>=1,
  {pc:1,k:["¡Ay! Me pillaste cotilleando con mi amiga. 🙈","Oops! You caught me gossiping with my friend. 🙈"]});
a("petchat5","sheep","k",["Rebaño unido","United flock"],["Presencia 5 charlas con la ovejita.","Watch 5 chats with the little sheep."],c=>c.petChats>=5,{pc:1});
a("pet10","sheep","k",["Lluvia de ovejas","Sheep shower"],["Toca 10 veces a la ovejita que camina abajo.","Tap the walking sheep downstairs 10 times."],c=>c.pet>=10,{pc:1});
a("pet100","sheep","k",["Ovejita mareada","Dizzy sheep"],["Toca 100 veces a la ovejita.","Tap the little sheep 100 times."],c=>c.pet>=100,{pc:1,big:1});
a("fire1","bucket","k",["Cuerpo de bomberos","Fire brigade"],["Apaga con agua a la ovejita cuando se incendie (fondo de verano, de día, solo en PC).","Put out the little sheep when she catches fire (summer background, daytime, PC only)."],c=>c.fireUser>=1,
  {pc:1,big:1,k:["¡Fuego apagado! Eres muy pro, no lo olvides. 🚒","Fire's out! You're so pro, never forget it. 🚒"]});
a("firefast","bucket","k",["Manguera veloz","Speedy hose"],["Apaga a la ovejita en menos de 6 segundos.","Put the little sheep out in under 6 seconds."],c=>c.fireFast>=1,{pc:1});
a("firekixki","bucket","k",["Rescatada por Kixki","Rescued by Kixki"],["Deja que Kixki apague el fuego por ti.","Let Kixki put the fire out for you."],c=>c.fireKixki>=1,{pc:1,k:["¡Esta vez me tocó a mí! La próxima, tú. 😉","My turn this time! Yours next. 😉"]});
a("cow","sheep","k",["Rebaño mixto","Mixed herd"],["Haz amistad con la vaca bailarina de vaca.exe.","Make friends with the dancing cow from cow.exe."],c=>c.cow,
  {hid:1,big:1,k:["¡Somos de rebaños distintos… pero hoy bailamos juntas! 🐄🐑 ¡Logro oculto!","We're from different herds… but today we dance together! 🐄🐑 Hidden achievement!"]});
a("throw10","sheep","k",["Oveja voladora","Flying sheep"],["Lanza a Kixki 10 veces.","Throw Kixki 10 times."],c=>c.throws>=10,
  {secret:1,h:["A Kixki le va el vuelo… si la lanzas con ganas.","Kixki loves to fly… if you really throw her."],quiet:1});
a("hoop1","trophy","k",["¡Canasta!","Basket!"],["Mete a Kixki en la canasta secreta.","Get Kixki into the secret hoop."],c=>c.hoops>=1,
  {secret:1,h:["Busca una pestañita en el borde de la pantalla…","Look for a little tab on the edge of the screen…"],quiet:1});
a("hoop10","trophy","k",["Estrella de la NBA (ovina)","Woolly NBA star"],["Anota 10 canastas con Kixki.","Score 10 baskets with Kixki."],c=>c.hoops>=10,{big:1,quiet:1});
/* — Constancia — */
a("visit3","key","v",["De la casa","Part of the flock"],["Visita la tienda en 3 ocasiones distintas.","Visit the store on 3 different occasions."],c=>c.visits>=3);
a("visit10","crown","v",["Rebaño fiel","Loyal flock"],["Visita la tienda 10 veces.","Visit the store 10 times."],c=>c.visits>=10,{big:1});
a("konami","key","v",["Código ovejuno","Sheepy code"],["Introduce el código secreto de los videojuegos.","Enter the classic secret video game code."],c=>c.konami,
  {secret:1,h:["Un clásico de los videojuegos con flechas…","A video game classic with arrow keys…"],k:["¡El código ovejuno! Eso solo lo conocen los pros de verdad. 🎮","The sheepy code! Only true pros know that one. 🎮"]});
a("half","star","v",["A medio camino","Halfway there"],["Consigue la mitad de los logros.","Earn half of the achievements."],()=>count()>=Math.ceil(A.filter(x=>!x.hid).length/2),{});
a("pro","crown","v",["Eres muy pro","You're so pro"],["Consigue todos los demás logros.","Earn all the other achievements."],()=>A.every(x=>x.id==="pro"||x.hid||ST.u[x.id]),
  {big:1,k:["¡¡LOS CONSEGUISTE TODOS!! Eres muy pro, no lo olvides jamás. 👑","YOU GOT THEM ALL!! You're so pro, never forget it. 👑"]});

/* ---------- memoria de los logros ---------- */
const LSK="kixki-a";
let ST;try{ST=JSON.parse(localStorage.getItem(LSK)||"{}")||{};}catch(e){ST={};}
ST.u=ST.u||{};ST.c=ST.c||{};ST.seenAt=+ST.seenAt||0;
const C=ST.c;
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(ST));}catch(e){}};
const count=()=>A.reduce((n,x)=>n+(ST.u[x.id]?1:0),0);
/* logros ocultos (hid): no salen en la lista, ni en el total, hasta que se desbloquean */
const NV=()=>A.reduce((n,x)=>n+(!x.hid||ST.u[x.id]?1:0),0);
const lsNum=k=>{try{return +JSON.parse(localStorage.getItem(k)||"0")||0;}catch(e){return 0;}};
const inc=(k,n=1)=>{C[k]=(C[k]|0)+n;};
const mx=(k,v)=>{if(v>(C[k]|0))C[k]=v;};
const level=u=>{const f=u/NV();let i=0;for(let j=0;j<LV_TH.length-1;j++)if(f>=LV_TH[j])i=j;return u>=NV()?LV.length-1:i;};

/* =========================================================  ARRANQUE  */
function boot(){
  if(window.KXQ||!window.KXK)return;
  const KK=KXK,K=KK.K,S=KK.state,root=document.documentElement,KX=window.KX||{};
  const lang=()=>window.KXI&&KXI.lang==="en"?"en":"es";
  const L=()=>lang()==="en"?1:0;
  const tx=m=>Array.isArray(m)?m[L()]:m;
  const fmt=(s,v)=>v?s.replace(/\{(\w+)\}/g,(x,k)=>v[k]!=null?v[k]:x):s;
  const isPC=()=>KK.isPC();
  const rainOn=()=>!!(window.KXRAIN&&KXRAIN.on());
  const pick=l=>l[Math.floor(Math.random()*l.length)];

  /* ---------- contexto: todo lo que miden las condiciones ---------- */
  const ctx=()=>({
    folders:S.opened.length,total:$$("#app .cat").length,allDone:!!S.allDone,
    searches:C.searches|0,nores:C.nores|0,tags:C.tags|0,run:C.run|0,
    favMax:C.favMax|0,
    plays:Math.max(C.plays|0,lsNum("kixki-gp"),lsNum("kixki-rec")>0?1:0),runMax:Math.max(C.runMax|0,lsNum("kixki-rec")),recBroken:!!C.recBroken,
    theme:C.theme|0,night:!!C.night,bgs:(C.bgs||[]).length,acc:C.acc|0,music:!!C.music,lang:!!C.lang,view:!!C.view,qr:!!C.qr,
    tapFast:!!C.tapFast,tapsK:C.tapsK|0,petChats:C.petChats|0,pet:lsNum("kixki-ov"),fireUser:C.fireUser|0,fireFast:C.fireFast|0,fireKixki:C.fireKixki|0,
    visits:S.visits|0,konami:!!C.konami,
    rain:C.rainSeen|0,glass:!!C.glass,wiped:C.wiped|0,fireRain:C.fireRain|0,cow:!!C.cow,
    throws:C.throws|0,hoops:C.hoops|0
  });

  /* ---------- DOM: tarjeta de aviso, confeti, ventana de logros, charla ---------- */
  const mk=(html)=>{const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild;};
  const toastEl=mk(`<div class="kq-toast" id="kq-toast" hidden><button type="button" class="kq-tb"><span class="kq-ti"></span><span class="kq-tt"><b class="kq-th"></b><span class="kq-tn"></span><small class="kq-td"></small></span></button></div>`);
  const srEl=mk(`<div class="kk-sr" id="kq-sr" role="status" aria-live="polite"></div>`);
  const panel=mk(`<div id="logros" class="ovl" hidden role="dialog" aria-modal="true" aria-labelledby="kq-h"><div class="box kq-box"><div class="bt"><span id="kq-h"></span><button type="button" class="x" data-x="logros"></button></div><div class="kq-top"><span class="kq-av"></span><div class="kq-lv"></div></div><p class="kq-say"></p><div class="kq-list" tabindex="0"></div></div></div>`);
  const petWrap=mk(`<div id="kq-pet" aria-hidden="true"><div class="kk-bub kq-pb" hidden><span class="kk-nm"></span><button type="button" class="kk-x" tabindex="-1">✕</button><p class="kk-tx"><span class="g"></span><span class="v"></span></p><svg class="kk-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div></div>`);
  document.body.append(toastEl,srEl,panel,petWrap);
  const tb=$(".kq-tb",toastEl),tIc=$(".kq-ti",toastEl),tH=$(".kq-th",toastEl),tN=$(".kq-tn",toastEl),tD=$(".kq-td",toastEl);
  const pTitle=$("#kq-h",panel),pX=$(".x",panel),pAv=$(".kq-av",panel),pLv=$(".kq-lv",panel),pSay=$(".kq-say",panel),pList=$(".kq-list",panel);
  const pb=$(".kq-pb",petWrap),pbNm=$(".kk-nm",pb),pbG=$(".g",pb),pbV=$(".v",pb),pbX=$(".kk-x",pb);
  const say=s=>{srEl.textContent="";setTimeout(()=>{srEl.textContent=s;},30);};

  /* ---------- aviso de logro: tarjeta arriba, sonido, confeti ---------- */
  const tq=[];let tBusy=false;
  function queueToast(o){tq.push(o);if(!tBusy)runToasts();}
  async function runToasts(){
    tBusy=true;
    while(tq.length){
      const o=tq.shift();
      tIc.innerHTML=ic(o.i||"trophy",4);tH.textContent=tx(o.head||UI.head);tN.textContent=tx(o.n);tD.textContent=o.d?tx(o.d):"";
      toastEl.hidden=false;void toastEl.offsetWidth;toastEl.classList.add("in");
      say(tx(o.head||UI.head)+" "+tx(o.n)+(o.d?". "+tx(o.d):""));
      [660,880,1320].forEach((f,i)=>setTimeout(()=>{if(window.KXS)try{KXS.beep(f,.09);}catch(e){}},i*120));
      await wait(o.long?5200:4400);
      toastEl.classList.remove("in");await wait(RM()?60:300);toastEl.hidden=true;
    }
    tBusy=false;
  }
  tb.addEventListener("click",()=>{toastEl.classList.remove("in");toastEl.hidden=true;openPanel();});
  function confetti(n=26){
    if(RM())return;
    const cols=["#ffc23a","#ff8fc7","#7ef0c4","#8b6cf0","#fffaf0","#4aa3e8"];
    for(let i=0;i<n;i++){const e=document.createElement("i");e.className="kq-cf";
      e.style.cssText=`left:${rnd(2,98)}%;--dx:${rnd(-70,70)}px;--t:${rnd(1.8,3)}s;animation-delay:${rnd(0,.5)}s;background:${cols[i%cols.length]}`;
      document.body.append(e);setTimeout(()=>e.remove(),3800);}
  }
  function sparks(){
    if(RM()||!KK.el||KK.el.classList.contains("kk-off")||KK.el.classList.contains("kk-gone"))return;
    const cols=["#ffc23a","#ff8fc7","#fffaf0","#7ef0c4"];
    for(let i=0;i<10;i++){const e=document.createElement("i");e.className="kq-sp";
      e.style.cssText=`--sx:${Math.round(rnd(-46,46))}px;--sy:${-Math.round(rnd(20,78))}px;--c:${cols[i%4]};left:${Math.round(rnd(-10,10))}px`;
      KK.el.append(e);setTimeout(()=>e.remove(),760);}
  }

  /* ---------- Kixki celebra ---------- */
  const GEN=[
   ["¡Logro desbloqueado: «{n}»! Eres muy pro, no lo olvides. 🏆","Achievement unlocked: “{n}”! You're so pro, never forget it. 🏆"],
   ["«{n}» conseguido. Eso no lo logra cualquiera. ✨","“{n}” earned. Not just anyone gets that. ✨"],
   ["¡Beee! ¡Otro logro! «{n}» ya es tuyo. 🐑","Baaa! Another one! “{n}” is yours now. 🐑"],
   ["¡Mira eso! «{n}». ¡Qué nivel! 💪","Look at that! “{n}”. What a level! 💪"],
   ["«{n}»… ¡y sin despeinarte la lana! Eres muy pro. 😎","“{n}”… and without ruffling your wool! You're so pro. 😎"]
  ];
  const pendSay=[];
  const gameOpen=()=>{const g=$("#game");return !!g&&!g.hidden;};
  function speak(msg,vars,o={}){
    if(o.game&&gameOpen()){pendSay.push([msg,vars]);return;}
    KK.say(msg,{p:3,mood:"happy",vars});
  }
  function flushSay(){
    if(!pendSay.length||gameOpen())return;
    const [m,v]=pendSay.pop();pendSay.length=0;
    KK.say(m,{p:3,mood:"happy",vars:v});
  }
  setInterval(flushSay,1200);
  function announce(got,lv0){
    const loud=got.filter(x=>!x.quiet),big=got.some(x=>x.big);
    if(got.length>3)queueToast({i:"trophy",head:UI.head,n:[fmt(UI.many[0],{n:got.length}),fmt(UI.many[1],{n:got.length})],d:UI.manyDesc,long:1});
    else got.forEach(x=>queueToast({i:x.i,n:x.n,d:x.d,long:x.big}));
    sparks();if(big)confetti(got.some(x=>x.id==="pro")?60:28);
    if(loud.length){
      let msg,vars;
      if(loud.length>1){msg=[`¡${loud.length} logros de golpe! Eres muy pro, no lo olvides. 🏆`,`${loud.length} achievements at once! You're so pro, never forget it. 🏆`];}
      else{const x=loud[0];msg=x.k||pick(GEN);vars={n:tx(x.n)};}
      speak(msg,vars,{game:loud.every(x=>x.game)});
    }
    const lv1=level(count());
    if(lv1>lv0)setTimeout(()=>speak([`¡Subiste de nivel! Ahora eres «${LV[lv1][0]}». ⭐`,`You leveled up! You're now “${LV[lv1][1]}”. ⭐`],null,{game:true}),loud.length?400:0);
  }
  /* mira si hay logros nuevos (silent = ponerse al día sin avisar) */
  function sweep(silent){
    const c=ctx(),got=[],lv0=level(count());
    for(let again=true;again;){again=false;
      for(const x of A){if(ST.u[x.id])continue;let ok=false;try{ok=!!x.f(c);}catch(e){}
        if(ok){ST.u[x.id]=now();got.push(x);again=true;}}}
    if(got.length){save();if(!silent)announce(got,lv0);refreshMenu();if(!panel.hidden)renderPanel();}
    return got;
  }

  /* ---------- ventana «Logros» ---------- */
  let lastFocus=null;
  const dateOf=t=>{try{return new Date(t).toLocaleDateString(lang(),{day:"numeric",month:"short"});}catch(e){return"";}};
  function nextHint(){return A.find(x=>!ST.u[x.id]&&!x.secret&&!x.hid&&x.id!=="pro"&&x.id!=="half");}
  function kixkiLine(u){
    const N=NV();
    if(u>=N)return["¡TODOS! Eres muy pro, no lo olvides jamás. 👑","ALL of them! You're so pro, never forget it. 👑"];
    if(u===0)return["Aún no tienes logros. ¡Abre una carpeta y empezamos! 🐑","No achievements yet. Open a folder and let's get started! 🐑"];
    const n=nextHint();
    if(!n)return[`Llevas ${u} de ${N}. ¡Solo quedan los secretos! 🤫`,`You have ${u} of ${N}. Only the secret ones are left! 🤫`];
    return[`Llevas ${u} de ${N}. Siguiente reto: «${n.n[0]}»: ${n.d[0]}`,`You have ${u} of ${N}. Next challenge: “${n.n[1]}”: ${n.d[1]}`];
  }
  function renderPanel(){
    const u=count(),N=NV(),lv=level(u),prev=+ST._prevSeen||0;
    pTitle.textContent=tx(UI.title);pX.setAttribute("aria-label",tx(UI.close));pX.textContent="✕";
    pAv.innerHTML=sprite(KK.rows.happy,3);
    const cells=20,on=Math.round(u/N*cells);
    pLv.innerHTML=`<span class="kq-lt">${tx(UI.lvl)}</span> <b>${tx(LV[lv])}</b><span class="kq-num">${u} / ${N} · ${Math.round(u/N*100)}%</span><span class="kq-bar" role="img" aria-label="${u}/${N}">${Array.from({length:cells},(_,i)=>`<i class="${i<on?"on":""}"></i>`).join("")}</span>`;
    pSay.textContent=tx(kixkiLine(u));
    pList.innerHTML=Object.keys(CAT).map(k=>{
      const list=A.filter(x=>x.c===k&&(!x.hid||ST.u[x.id])),got=list.filter(x=>ST.u[x.id]).length;
      if(!list.length)return "";
      return `<section class="kq-g"><h3>${tx(CAT[k])}<small>${got}/${list.length}</small></h3><ul>${list.map(x=>{
        const un=!!ST.u[x.id],hide=x.secret&&!un,fresh=un&&ST.u[x.id]>prev;
        return `<li class="kq-it ${un?"on":"off"}${fresh?" nw":""}"><span class="kq-ic">${ic(hide?"q":x.i,4)}</span><span class="kq-in"><b>${hide?"???":tx(x.n)}</b><small>${hide?tx(x.h||UI.secret):tx(x.d)}</small></span><span class="kq-st">${un?(fresh?`<em class="kq-new">${tx(UI.nw)}</em>`:"")+"✓ "+dateOf(ST.u[x.id]):""}${!un&&x.pc?`<em class="kq-pc">${tx(UI.pc)}</em>`:""}${hide&&!x.pc?`<em class="kq-sc">${tx(UI.secret)}</em>`:""}${un&&x.hid?`<em class="kq-sc">${tx(UI.hid)}</em>`:""}</span></li>`;}).join("")}</ul></section>`;}).join("");
  }
  function openPanel(){
    lastFocus=document.activeElement;
    ST._prevSeen=ST.seenAt;ST.seenAt=now();save();refreshMenu();
    renderPanel();panel.hidden=false;pList.scrollTop=0;
    try{pX.focus({preventScroll:true});}catch(e){}
  }
  new MutationObserver(()=>{if(panel.hidden&&lastFocus){try{lastFocus.focus({preventScroll:true});}catch(e){}lastFocus=null;}}).observe(panel,{attributes:true,attributeFilter:["hidden"]});
  /* Tab se queda dentro de la ventana */
  panel.addEventListener("keydown",e=>{if(e.key!=="Tab")return;const f=[pX,pList];const i=f.indexOf(document.activeElement);
    e.preventDefault();(f[(i+(e.shiftKey?-1:1)+f.length)%f.length]).focus();});

  /* ---------- menú Kixki / Más ---------- */
  const sm=KX.sm||$("#sm");
  let btnA=null,btnP=null;
  if(sm){
    const html=`<button type="button" class="sm" id="s-kx-ach"></button><button type="button" class="sm" id="s-kx-pet"></button>`;
    const ref=$("#s-kx-on",sm)||$("#s-sug",sm);
    ref?ref.insertAdjacentHTML("beforebegin",html):sm.insertAdjacentHTML("beforeend",html);
    btnA=$("#s-kx-ach",sm);btnP=$("#s-kx-pet",sm);
    sm.addEventListener("click",e=>{
      const b=e.target.closest("#s-kx-ach,#s-kx-pet");if(!b)return;
      if(b.id==="s-kx-ach"){openPanel();return;}
      if(!isPC()){queueToast({i:"sheep",head:["Kixki","Kixki"],n:UI.pcOnly});return;}
      if(!S.on){queueToast({i:"sheep",head:["Kixki","Kixki"],n:UI.offNote});return;}
      petChat("user");
    });
  }
  function refreshMenu(){
    if(!btnA)return;
    const fresh=A.some(x=>ST.u[x.id]>ST.seenAt);
    btnA.innerHTML=`${ic("trophy",2)}<span>${tx(UI.menu)} ${count()}/${NV()}</span>${fresh?'<i class="kq-dot" aria-hidden="true"></i>':""}`;
    btnP.textContent=tx(UI.petMenu);
  }
  refreshMenu();

  /* ---------- lo que hace el visitante → contadores ---------- */
  addEventListener("kixki-evt",e=>{
    const d=e.detail||{};
    switch(d.t){
      case "search":inc("searches");if(d.n===0)C.nores=1;break;
      case "fav":mx("favMax",d.n|0);break;
      case "theme":inc("theme");break;
      case "bg":{const k=d.k||"clasico";C.bgs=C.bgs||[];if(!C.bgs.includes(k))C.bgs.push(k);break;}
      case "music":if(d.on)C.music=1;break;
      case "lang":C.lang=1;refreshMenu();if(!panel.hidden)renderPanel();break;
      case "tap":inc("tapsK");if((d.n|0)>=7)C.tapFast=1;break;
      case "throw":mx("throws",d.n|0);break;
      case "hoop":inc("hoops");break;
      case "visit":{const h=new Date().getHours();if(!d.again&&(h>=23||h<5))C.night=1;break;}
      default:break;
    }
    save();sweep();
  });
  addEventListener("kixki-game",e=>{
    const d=e.detail||{};
    if(d.t==="start"||d.t==="retry")inc("plays");
    else if(d.t==="score")mx("runMax",d.sc|0);
    else if(d.t==="record")C.recBroken=1;
    else if(d.t==="over"){mx("runMax",d.sc|0);if(d.nr&&!d.first&&d.sc>0)C.recBroken=1;setTimeout(flushSay,1700);}
    save();sweep();
  });
  addEventListener("kixki-rain",e=>{
    const d=e.detail||{};
    if(d.t==="start")inc("rainSeen");else if(d.t==="glass")C.glass=1;else if(d.t==="wipe")mx("wiped",d.n|0);
    save();sweep();
  });
  /* clics que la parte 1 no avisa (en captura para ir antes que app.js) */
  addEventListener("click",e=>{
    const t=e.target;if(!t||!t.closest)return;
    if(t.closest(".chips .fl,.bdg span"))inc("tags");
    if(t.closest("#vw,#s-view"))C.view=1;
    if(t.closest("#pet"))setTimeout(()=>{sweep();petTap();},60);
    save();sweep();
  },true);
  const watch=(sel,key)=>{const el=$(sel);if(!el)return;let was=el.hidden;
    new MutationObserver(()=>{if(was&&!el.hidden){C[key]=1;save();sweep();}was=el.hidden;}).observe(el,{attributes:true,attributeFilter:["hidden"]});};
  watch("#run","run");watch("#qr","qr");
  new MutationObserver(()=>{inc("acc");save();sweep();}).observe(root,{attributes:true,attributeFilter:["data-acc"]});
  const KONAMI=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let ki=0;
  addEventListener("keydown",e=>{
    const k=e.key&&e.key.length===1?e.key.toLowerCase():e.key;
    if(k===KONAMI[ki]){ki++;if(ki===KONAMI.length){ki=0;C.konami=1;save();sweep();}}else ki=k===KONAMI[0]?1:0;
    if(e.key==="Escape"&&chatting)K.tour=null;/* Esc corta la charla */
  });

  /* ---------- consejos y piropos nuevos para la parte 1 ---------- */
  const T=KK.T;
  T.tips.push(
    {t:["Mira tus logros en el menú Kixki → «Logros». ¡A ver cuántos llevas! 🏆","Check your achievements in the Kixki menu → “Achievements”. Let's see how many you have! 🏆"]},
    {t:["Hay logros secretos escondidos. ¡Prueba cosas raras! 🤫","There are secret achievements hidden around. Try weird things! 🤫"]},
    {pc:1,t:["A veces bajo a charlar con la ovejita de abajo. ¡Se pone muy graciosa! 🐑","Sometimes I go down to chat with the little sheep downstairs. She gets really funny! 🐑"]},
    {pc:1,t:["Si le haces cosquillas muy rápido a la ovejita de abajo, ¡me asomo a ver qué pasa!","If you tickle the little sheep downstairs really fast, I'll pop down to see what's going on!"]},
    {pc:1,t:["En el menú Kixki puedes pedirme que baje a hablar con la ovejita.","In the Kixki menu you can ask me to go chat with the little sheep."]},
    {t:["Si llueve en la tienda, ¡deja la página quieta y verás cómo chocan las gotas con la pantalla! 💧","If it rains in the store, leave the page still and watch the drops hit the screen! 💧"]},
    {pc:1,t:["Si la ovejita se incendia y empieza a llover, ¡la lluvia la apaga solita! 🌧️","If the little sheep catches fire and it starts to rain, the rain puts her out by itself! 🌧️"]},
    {pc:1,t:["En verano, con el sol fuerte, la ovejita de abajo a veces se calienta demasiado… ¡ten el agua lista! 💦","In summer, with the sun blazing, the little sheep downstairs sometimes overheats… keep the water ready! 💦"]},
    {mob:1,t:["En «Más» está «Logros»: ¡mira cuáles llevas y cuáles te faltan! 🏆","“More” has “Achievements”: see which ones you have and which are missing! 🏆"]}
  );
  T.praise.push(
    ["Cada logro cuenta. ¡Y tú vas sumando! No lo olvides: eres muy pro. 🏆","Every achievement counts. And you keep adding them! Don't forget: you're so pro. 🏆"],
    ["Hasta los logros secretos te tienen miedo. 🤫","Even the secret achievements are scared of you. 🤫"]
  );

  /* ---------- pistas ocasionales ---------- */
  let hintAt=now()+rnd(100000,160000);
  setInterval(()=>{
    if(now()<hintAt||!KK.alive()||K.game||chatting||fireOn)return;
    const n=nextHint();hintAt=now()+rnd(150000,260000);if(!n)return;
    KK.say([`Psst… te falta «${n.n[0]}»: ${n.d[0]}`,`Psst… you're missing “${n.n[1]}”: ${n.d[1]}`],{p:1,key:"hint",cd:90000});
  },6000);

  /* =========================================================
     CHARLA CON LA OVEJITA DE ABAJO (solo PC)
     ========================================================= */
  const PETS=window.KXPET=window.KXPET||{hold:false};
  const petEl=()=>$("#pet"),petPi=()=>$("#pet .pi");
  const petBox=()=>{if(!isPC())return null;const p=petPi();if(!p)return null;const r=p.getBoundingClientRect();return r.width>8&&r.height>8?r:null;};
  let petSide=1;/* 1 = Kixki a la izquierda de la ovejita · -1 = a la derecha */
  KK.plat("pet",()=>{
    const r=petBox();if(!r)return null;
    petSide=(r.left>=110||r.right+110>innerWidth)?1:-1;
    const x=petSide>0?r.left-26:r.right+26;
    return {a:x,b:x,y:()=>{const q=petBox();return q?q.bottom:r.bottom;},face:petSide};
  });
  /* guion: [quién, es, en]  ·  k = Kixki, p = ovejita  ·  {n} toques · {f}/{t} carpetas · {a}/{N} logros */
  const DAY=[
   {id:"hola",l:[
    ["k","¡Hola, amiga! Bajé a verte un ratito. 🐑","Hi, friend! I came down to see you for a bit. 🐑"],
    ["p","¡Beee! ¡Qué sorpresa! ¿Cómo va el piso de arriba?","Baaa! What a surprise! How's it going upstairs?"],
    ["k","Lleno de apps y de gente curiosa. ¡Me encanta!","Full of apps and curious people. I love it!"],
    ["p","Yo aquí abajo solo paseo de lado a lado. Es mi trabajo.","Down here I just stroll back and forth. That's my job."],
    ["k","¡Y lo haces genial! Eres muy pro, no lo olvides.","And you do it great! You're so pro, never forget it."],
    ["p","Beee… se me ponen rojas las orejas. 😊","Baaa… my ears are turning red. 😊"]]},
   {id:"visita",l:[
    ["p","Oye, hoy hay alguien mirando la tienda con mucha atención…","Hey, someone's been looking at the store really carefully today…"],
    ["k","Ya lo vi. Tiene ojo de pro. 👀","I saw. Pro-level eyes. 👀"],
    ["p","¿Crees que se llevará alguna app?","Think they'll pick up an app?"],
    ["k","Seguro. Y si no sabe cuál, para eso estoy yo.","Sure. And if they can't decide, that's what I'm here for."],
    ["p","Y yo para pasear de fondo y dar ambiente.","And I'm here to stroll in the background and set the mood."],
    ["k","¡Ambiente de primera! 🎶","First-class mood! 🎶"]]},
   {id:"paraguas",when:()=>rainOn()&&UMB.on,l:[
    ["p","¡Con el paraguas de Kixki ni una gotita! Beee.","Not a single drop with Kixki's umbrella! Baaa."],
    ["k","Cuidar de mi rebaño es lo mío. ☂️","Looking after my flock is what I do. ☂️"],
    ["p","Pues tu rebaño te lo agradece. Beee. 💜","Well, your flock thanks you. Baaa. 💜"]]},
   {id:"lluvia",when:()=>rainOn()&&!UMB.on,l:[
    ["p","¡Llueve! Mi lana huele a oveja mojada… beee.","It's raining! My wool smells like wet sheep… baaa."],
    ["k","A mí me encanta el sonido de la lluvia. ¡Es como música! 🌧️","I love the sound of rain. It's like music! 🌧️"],
    ["p","Pues a mí me encoge la lana.","Well, it shrinks my wool."],
    ["k","Jajaja. Luego te secamos al solecito. ☀️","Hahaha. We'll dry you in the sun later. ☀️"]]},
   {id:"toques",when:c=>c.pet>=5,l:[
    ["p","Me han tocado {n} veces. ¡Alguien me quiere mucho!","I've been tapped {n} times. Someone really likes me!"],
    ["k","Es que eres adorable. Yo también me sé el truco de las cosquillas.","That's because you're adorable. I know the tickle trick too."],
    ["p","¡Ni se te ocurra! Beee.","Don't you dare! Baaa."],
    ["k","Jajaja. Prometo portarme bien. 🐑","Hahaha. I promise to behave. 🐑"]]},
   {id:"carpetas",when:c=>c.folders>=1,l:[
    ["k","Por cierto: nuestra visita ya abrió {f} de {t} carpetas.","By the way: our visitor has opened {f} of {t} folders."],
    ["p","¿Y las demás a qué esperan?","And what are the rest waiting for?"],
    ["k","Tiempo al tiempo. Cada quien explora a su ritmo.","All in good time. Everyone explores at their own pace."],
    ["p","Pues que se apure, que quiero conocer la de Música. 🎵","Well, tell them to hurry up, I want to see the Music one. 🎵"]]},
   {id:"juego",l:[
    ["k","¿Has probado el Salta Vallas? Es nuestro juego.","Have you tried Fence Jump? It's our game."],
    ["p","¡Yo salto mejor que tú!","I jump better than you!"],
    ["k","Eso habrá que verlo. 😏","We'll have to see about that. 😏"],
    ["p","Pero primero mi siesta.","But first, my nap."],
    ["k","Siempre hay una siesta primero. 💤","There's always a nap first. 💤"]]},
   {id:"contar",l:[
    ["k","¿Sabías que contar ovejas ayuda a dormir?","Did you know counting sheep helps you sleep?"],
    ["p","¡Y yo soy de las que se cuentan! Uno… beee… dos…","And I'm one of the ones that get counted! One… baaa… two…"],
    ["k","¡No te duermas ahora, que apenas son las {h}!","Don't fall asleep now, it's only {h}!"],
    ["p","Tres… ¡es que me sale solo!","Three… it just comes out on its own!"]]},
   {id:"ejercicio",l:[
    ["p","Oye, ¿no te cansas de saltar de la barra a las carpetas?","Hey, don't you get tired of hopping from the bar to the folders?"],
    ["k","¡Para nada! Es mi ejercicio diario. 💪","Not at all! It's my daily workout. 💪"],
    ["p","Entonces mis pasitos también cuentan.","Then my little steps count too."],
    ["k","Cuentan doble. Eres una atleta de la lana.","They count double. You're a wool athlete."]]},
   {id:"gorro",when:()=>!!$("#pet .hat"),l:[
    ["k","¡Qué gorro tan bonito llevas hoy!","What a lovely hat you're wearing today!"],
    ["p","¿Verdad? Es de la temporada. Me siento elegantísima.","Right? It's seasonal. I feel so elegant."],
    ["k","Elegantísima. Mejor que yo con mi bufanda.","So elegant. Better than me with my scarf."],
    ["p","Tu bufanda es lo mejor de ti, Kixki.","Your scarf is the best thing about you, Kixki."],
    ["k","¡Beee! ¡Gracias! 🧣","Baaa! Thank you! 🧣"]]},
   {id:"logros",when:c=>count()>=3,l:[
    ["k","Nuestra visita ya lleva {a} de {N} logros.","Our visitor already has {a} of {N} achievements."],
    ["p","¿Y a mí cuándo me dan uno?","And when do I get one?"],
    ["k","Tú tienes el de «Ovejita más paseadora» desde siempre.","You've had “Most walked little sheep” forever."],
    ["p","¡Beee! Ese es mi favorito.","Baaa! That's my favorite."]]}
  ];
  const NIGHT=[
   {id:"n1",l:[
    ["k","Shhh… ¿estás dormida? Solo vine a decirte buenas noches. 🌙","Shhh… are you asleep? I just came to say good night. 🌙"],
    ["p","Zzz… ¿Kixki…? Beee… zzz…","Zzz… Kixki…? Baaa… zzz…"],
    ["k","Duerme, amiga. Yo hago guardia.","Sleep, friend. I'll keep watch."]]},
   {id:"n2",l:[
    ["k","Está dormida… mejor no la despierto. Dulces sueños. 💤","She's asleep… better not wake her. Sweet dreams. 💤"],
    ["p","Zzz… cuatro mil… beee… cuatro mil uno…","Zzz… four thousand… baaa… four thousand and one…"],
    ["k","Contando ovejas incluso dormida. ¡Qué profesional! 🐑","Counting sheep even in her sleep. So professional! 🐑"]]},
   {id:"n3",l:[
    ["k","Buenas noches, ovejita. Mañana te cuento qué buscó la gente. 🌙","Good night, little sheep. Tomorrow I'll tell you what people searched for. 🌙"],
    ["p","Mmm… no te olvides de mí… zzz…","Mmm… don't forget about me… zzz…"],
    ["k","Jamás. Eres de las buenas. 💜","Never. You're one of the good ones. 💜"]]}
  ];
  const TICKLE={id:"tickle",l:[
    ["p","¡Jajaja! ¡Beee! ¡Cosquillas, cosquillas!","Hahaha! Baaa! Tickles, tickles!"],
    ["k","¡Ya, ya, que me la vas a marear! 😆","Okay, okay, you'll make her dizzy! 😆"],
    ["p","Beee… ¡no pares! Es broma, sí pares.","Baaa… don't stop! Just kidding, do stop."],
    ["k","Mejor la dejamos pasear. ¡Gracias por los cariños!","Let's let her stroll. Thanks for the cuddles!"]]};
  const lastScripts=[];
  function pickScript(kind){
    if(kind==="tickle"&&!KK.dark())return TICKLE;
    const c=ctx(),pool=(KK.dark()?NIGHT:DAY).filter(s=>!s.when||s.when(c)),ok=pool.filter(s=>!lastScripts.includes(s.id)),s=pick(ok.length?ok:pool);
    lastScripts.push(s.id);if(lastScripts.length>3)lastScripts.shift();return s;
  }

  /* globo de la ovejita (mismo estilo que el de Kixki) */
  let pcur=null,petFacing=1;
  function playout(){
    if(pb.hidden)return;const r=petBox();if(!r)return;
    const head=r.left+r.width*(petFacing>0?.74:.26);
    petWrap.style.transform=`translate3d(${Math.round(head)}px,${Math.round(r.bottom)}px,0)`;
    const bw=pb.offsetWidth,bh=pb.offsetHeight,left=clamp(head-bw/2,8,Math.max(8,innerWidth-8-bw));
    pb.style.left=(left-head)+"px";pb.style.setProperty("--tx",clamp(head-left,16,bw-16)+"px");
    pb.classList.toggle("below",r.bottom-45-14-bh<6);
  }
  addEventListener("resize",playout);
  function pdone(m,how){
    if(!m||pcur!==m)return;
    clearTimeout(m.t);pcur=null;pb.hidden=true;const p=petEl();if(p)p.classList.remove("kq-talk");m.res(true);
  }
  function pint(){
    if(!pcur)return;const m=pcur;clearTimeout(m.t);pcur=null;pb.hidden=true;const p=petEl();if(p)p.classList.remove("kq-talk");m.res(false);
  }
  function petSay(msg,vars,o){
    return new Promise(res=>{
      pint();
      const text=fmt(tx(msg),vars),m={text,res,t:0};pcur=m;
      pbNm.textContent=tx(PET_NAME);pbG.textContent=text;pbV.textContent="";pb.hidden=false;playout();
      say(tx(PET_NAME)+": "+text);
      const p=petEl(),night=KK.dark();
      if(p&&!night&&!RM())p.classList.add("kq-talk");
      if(window.KXS&&!night)try{KXS.baa();}catch(e){}
      let i=0;const n=text.length,spd=RM()?0:26;
      const step=()=>{
        if(pcur!==m)return;
        if(!spd||i>=n){pbV.textContent=text;m.t=setTimeout(()=>pdone(m,"auto"),(o&&o.ms)||clamp(2300+text.length*52,3300,9500));if(p)p.classList.remove("kq-talk");return;}
        const ch=text[i];i++;pbV.textContent=text.slice(0,i);
        if(ch!==" "&&i%3===0&&window.KXS)try{KXS.beep(620+((i*41)%260),.03);}catch(e){}
        m.t=setTimeout(step,/[.,!?…]/.test(ch)?170:spd);
      };
      step();
    });
  }
  pb.addEventListener("click",()=>pdone(pcur,"user"));

  /* la charla en sí */
  let fireOn=false,chatting=false,nextVisit=now()+rnd(45000,80000),tapTimes=[],lastTickle=0;
  async function petChat(kind){
    if(chatting||fireOn||!isPC()||!KK.ready||!S.on||K.off)return false;
    if(kind==="auto"&&(K.tour||K.talking||K.mode!=="idle"))return false;
    if(!petBox())return false;
    chatting=true;nextVisit=now()+rnd(100000,190000);
    const tok={};K.tour=tok;/* mientras charla, el cerebro de Kixki no la manda a otro sitio; si el visitante hace algo, la parte 1 lo pone a null */
    const dog=setInterval(()=>{if(K.tour!==tok||K.off||!S.on)pint();},250);
    let done=false;const p=petEl(),pi=petPi();
    try{
      PETS.hold=true;KK.interrupt();
      if(p)p.classList.add("kq-chat");
      const ok=await KK.hop("pet");
      if(!ok||K.tour!==tok)return false;
      /* la ovejita se gira hacia Kixki */
      petFacing=KK.dark()?1:-petSide;if(pi&&!KK.dark())pi.style.transform=petFacing<0?"scaleX(-1)":"";
      await wait(RM()?0:380);
      const sc=pickScript(kind),c=ctx(),vars={n:c.pet,f:c.folders,t:c.total,a:count(),N:NV(),h:new Date().toLocaleTimeString(lang(),{hour:"2-digit",minute:"2-digit"})};
      for(const [who,es,en] of sc.l){
        if(K.tour!==tok||K.off||!S.on)return false;
        const ok2=who==="k"?await KK.say([es,en],{p:2,vars}):await petSay([es,en],vars);
        if(!ok2||K.tour!==tok)return false;
        await wait(RM()?0:240);
      }
      done=true;return true;
    }finally{
      clearInterval(dog);pint();
      PETS.hold=false;if(p)p.classList.remove("kq-chat","kq-talk");if(pi)pi.style.transform="";
      chatting=false;if(K.tour===tok)K.tour=null;
      if(done){inc("petChats");save();sweep();}
      if(KK.stage==="pet"&&!K.off&&S.on)setTimeout(()=>{if(!chatting&&KK.stage==="pet")KK.relocate();},400);
    }
  }
  /* cosquillas: muchos toques rápidos a la ovejita y Kixki se asoma */
  function petTap(){
    if(!isPC()||chatting)return;
    const t=now();tapTimes=tapTimes.filter(x=>t-x<3500);tapTimes.push(t);
    if(tapTimes.length>=5&&t-lastTickle>90000&&KK.alive()){lastTickle=t;tapTimes=[];petChat("tickle");}
  }
  /* visitas solas de vez en cuando */
  setInterval(()=>{
    if(!isPC()||!KK.ready||chatting||fireOn)return;
    if(KK.stage==="pet"&&KK.alive()){KK.relocate();return;}/* por si se quedó abajo */
    if(now()>=nextFire){if(summerDay()&&!rainOn())petFire();else nextFire=now()+30000;return;}
    if(now()<nextVisit||!KK.alive()||K.game||K.mode!=="idle"||document.activeElement===$("#q"))return;
    petChat("auto");
  },4000);
  addEventListener("kixki-mode",()=>{if(!isPC()){PETS.hold=false;}});

  /* =========================================================
     PARAGUAS DE KIXKI: en cuanto llueve (y si estamos en modo PC), Kixki baja a ver a la ovejita de abajo y le baja un paraguas.
     El paraguas es hijo de #pet: la acompaña al pasear, y se recoge solo cuando la lluvia para.
     ========================================================= */
  const UMB={on:false,busy:false,el:null,next:0};
  const wet=()=>!!(window.KXRAIN&&KXRAIN.raining);
  const UMBR=[".......bbbbbbb.......","....bawwwaaawwwab....","..baaawwwaaawwwaaab..",".baaaawwwaaawwwaaaab.","bwaaaawwwaaawwwaaaawb","bwaaaawwwaaawwwaaaawb","bwaaaawwwaaawwwaaaawb","bwaaaawwwaaawwwaaaawb","b....b....b....b....b","..........l..........","..........l..........","..........l..........","..........l..........","..........l..........","..........l.........."];
  const UMBL={
    day:[
      ["¡Ovejita, está lloviendo! Espera, te bajo un paraguas. ☂️","Little sheep, it's raining! Hold on, I'm lowering an umbrella for you. ☂️"],
      ["¡Beee! ¡Gracias, Kixki! Ahora mi lana sigue esponjosa. ☂️","Baaa! Thanks, Kixki! Now my wool stays fluffy. ☂️"],
      ["Para eso estamos las amigas. ¡Y ojo con los charcos! 💦","That's what friends are for. And watch out for puddles! 💦"]
    ],
    night:[
      ["Shhh… llueve y tú dormida sin paraguas. Te bajo uno. ☂️","Shhh… it's raining and you're asleep without an umbrella. Lowering one for you. ☂️"],
      ["Zzz… qué calentita… gracias, Kixki… zzz…","Zzz… so cozy… thanks, Kixki… zzz…"],
      ["Dulces sueños bajo la lluvia. 🌧️💤","Sweet dreams in the rain. 🌧️💤"]
    ]
  };
  function umbShow(){
    const p=petEl();if(!p||UMB.el)return;
    const e=document.createElement("div");e.className="kq-umb";e.innerHTML=sprite(UMBR,3);
    p.append(e);p.classList.add("kq-rainy");UMB.el=e;UMB.on=true;
  }
  function umbHide(quick){
    const e=UMB.el,p=petEl();UMB.on=false;UMB.el=null;
    if(p)p.classList.remove("kq-rainy");
    if(!e)return;
    if(quick||RM()){e.remove();return;}
    e.classList.add("out");setTimeout(()=>e.remove(),600);
  }
  async function umbLend(){
    if(UMB.busy||UMB.on||chatting||fireOn||!isPC()||!wet()||!KK.ready||!KK.alive()||K.game||!petBox())return null;/* null = aún no es buen momento: reintenta pronto */
    UMB.busy=true;chatting=true;nextVisit=now()+rnd(100000,190000);
    const tok={};K.tour=tok;/* igual que en la charla: mientras ocurre, el cerebro de Kixki no la manda a otro sitio */
    const dog=setInterval(()=>{if(K.tour!==tok||K.off||!S.on)pint();},250);
    const p=petEl(),pi=petPi(),night=KK.dark(),L=night?UMBL.night:UMBL.day;
    try{
      PETS.hold=true;KK.interrupt();
      if(p)p.classList.add("kq-chat");
      const ok=await KK.hop("pet");
      if(!ok||K.tour!==tok)return false;
      petFacing=night?1:-petSide;if(pi&&!night)pi.style.transform=petFacing<0?"scaleX(-1)":"";
      await wait(RM()?0:300);
      if(!(await KK.say(L[0],{p:2}))||K.tour!==tok)return false;
      if(!wet())return false;                           /* escampó mientras hablaba: no hace falta */
      umbShow();                                        /* el paraguas baja hasta la ovejita */
      await wait(RM()?0:800);
      if(K.tour!==tok||K.off||!S.on)return false;
      if(!(await petSay(L[1]))||K.tour!==tok)return false;
      await wait(RM()?0:240);
      await KK.say(L[2],{p:2});
      return true;
    }finally{
      clearInterval(dog);pint();
      PETS.hold=false;if(p)p.classList.remove("kq-chat","kq-talk");if(pi)pi.style.transform="";
      chatting=false;UMB.busy=false;if(K.tour===tok)K.tour=null;
      if(KK.stage==="pet"&&!K.off&&S.on)setTimeout(()=>{if(!chatting&&KK.stage==="pet")KK.relocate();},400);
    }
  }
  setInterval(()=>{
    if(document.hidden||UMB.busy)return;
    if(UMB.on&&!wet()){umbHide();return;}                /* dejó de llover: recoge el paraguas */
    if(!UMB.on&&wet()&&isPC()&&now()>=UMB.next)umbLend().then(ok=>{if(ok===false)UMB.next=now()+25000;});/* false = se interrumpió: espera un poco antes de insistir */
  },1500);

  /* =========================================================
     INCENDIO DE VERANO: de día y con el fondo de verano, la ovejita de abajo
     a veces se prende fuego y corre de un lado a otro. Tócala (3 veces) para echarle agua;
     si tardas, Kixki baja a apagarla.
     ========================================================= */
  const fx=mk('<div id="kq-fx" aria-hidden="true"></div>');document.body.append(fx);
  const summerDay=()=>root.getAttribute("data-bg")==="verano"&&root.getAttribute("data-theme")!=="dark"&&isPC();
  let nextFire=now()+rnd(60000,130000);
  const FIRE_LIMIT=14;/* segundos antes de que baje Kixki */
  const SHOUT=[["¡Beee! ¡Me quemo!","Baaa! I'm burning!"],["¡Aguaaa! ¡Beee!","Waaater! Baaa!"],["¡Que alguien me eche agua!","Somebody throw water on me!"],["¡Tócame para apagarme!","Tap me to put me out!"],["¡Está muy calientee!","It's so hoooot!"]];
  const fxAt=(x,y,cls,css,ms)=>{const e=document.createElement("i");e.className=cls;e.style.cssText=`left:${Math.round(x)}px;top:${Math.round(y)}px;${css||""}`;fx.append(e);setTimeout(()=>e.remove(),ms||900);return e;};
  function setFlames(p,n){
    let box=$(".kq-fire",p);
    if(n<=0){if(box)box.remove();return;}
    if(!box){box=document.createElement("div");box.className="kq-fire";p.append(box);}
    const sc={3:[4,5,4],2:[3,4,3],1:[2,3,2]}[n];
    box.innerHTML=sc.map((k,i)=>`<span class="kq-fl" style="--d:-${(i*.09).toFixed(2)}s">${ic("flameA",k,"fa")}${ic("flameB",k,"fb")}</span>`).join("");
  }
  async function petFire(force){
    if(fireOn||chatting||!isPC()||!petEl()||!petBox())return false;
    if(!force&&(!summerDay()||rainOn()||!KK.ready||!S.on||K.off||K.game||K.tour||document.hidden))return false;
    fireOn=true;nextFire=now()+rnd(200000,420000);
    const p=petEl(),pi=petPi();
    let stage=3,t=0,x=typeof PETS.x==="number"?PETS.x:petBox().left,dirp=PETS.dir>=0?1:-1,turn=rnd(.7,1.4),shoutT=.3,shoutI=0,emb=0,rescuing=false,stopping=false,mult=1,finished=false,by="",rainT=0;
    const tok={};
    PETS.hold=true;p.classList.add("kq-burn");setFlames(p,3);pint();
    say(tx(["¡La ovejita se está quemando! Tócala para echarle agua.","The little sheep is on fire! Tap her to splash water on her."]));
    KK.say(["¡¡La ovejita se está quemando!! ¡Tócala para echarle agua! 💦","The little sheep is on fire!! Tap her to splash water on her! 💦"],{p:3});
    if(window.KXS)try{KXS.baa();}catch(e){}
    const SPD={3:250,2:200,1:140};
    function bucket(){
      const r=petBox();if(!r)return;const cx=r.left+r.width/2;
      const b=fxAt(cx-18,r.top-58,"kq-bk","");b.innerHTML=ic("bucket",4);
      for(let i=0;i<9;i++)setTimeout(()=>{const q=petBox();if(q)fxAt(q.left+q.width/2+rnd(-22,22),q.top-18,"kq-wd",`--dy:${Math.round(rnd(34,60))}px;animation-delay:0s`,650);},200+i*45);
      if(window.KXS)try{KXS.beep(520,.1);setTimeout(()=>KXS.beep(390,.1),90);}catch(e){}
    }
    function splash(who){
      if(stage<=0||finished)return;
      stage--;bucket();setFlames(p,stage);
      if(stage===2)petSay(["¡Más agua!","More water!"],null,{ms:1800});
      else if(stage===1)petSay(["¡Casi, casi!","Almost there!"],null,{ms:1800});
      else out(who);
    }
    async function out(who){
      finished=true;stopping=true;by=who;
      const r=petBox();if(r)for(let i=0;i<10;i++)fxAt(r.left+rnd(8,r.width-8),r.top+rnd(-6,10),"kq-em",`--c:#e6edf7;--ex:${Math.round(rnd(-12,12))}px`,1000);
      p.classList.remove("kq-burn");
      petFacing=dirp>0?1:-1;
      petSay(who==="rain"?["¡Llueve! ¡Ufff, qué alivio! 🌧️","It's raining! Phew, what a relief! 🌧️"]:who==="kixki"?["Gracias, Kixki… huelo a lana chamuscada. 😅","Thanks, Kixki… I smell like toasted wool. 😅"]:["¡Ufff! ¡Gracias! Qué alivio. 💦","Phew! Thank you! What a relief. 💦"],null,{ms:3200});
      if(who==="rain")KK.say(["¡La lluvia apagó el fuego solita! 🌧️ Qué suerte tiene esta ovejita.","The rain put the fire out all by itself! 🌧️ Lucky little sheep."],{p:3,mood:"happy"});
      else if(who!=="kixki")KK.say(["¡Fuego apagado! Eres muy pro, no lo olvides. 🚒","Fire's out! You're so pro, never forget it. 🚒"],{p:3,mood:"happy"});
      if(who==="user"){inc("fireUser");if(t<6)inc("fireFast");}else if(who==="kixki")inc("fireKixki");else if(who==="rain")inc("fireRain");
      save();sweep();
      await wait(1900);end();
    }
    function end(){
      fireOn=false;finished=true;PETS.hold=false;
      p.classList.remove("kq-burn");setFlames(p,0);pint();
      if(pi)pi.style.transform=PETS.dir<0?"scaleX(-1)":"";
      removeEventListener("pointerdown",down,true);
    }
    function down(e){
      if(!fireOn||rescuing||finished)return;
      const r=petBox();if(!r)return;const pad=26;
      if(e.clientX>=r.left-pad&&e.clientX<=r.right+pad&&e.clientY>=r.top-pad-34&&e.clientY<=r.bottom+pad)splash("user");
    }
    addEventListener("pointerdown",down,true);
    async function rescue(){
      rescuing=true;
      if(!(KK.ready&&S.on&&!K.off)){/* sin Kixki: lluvia fresca */
        for(let i=0;i<3&&!finished;i++){bucket();stage--;setFlames(p,stage);await wait(420);}
        if(!finished)out("auto");return;
      }
      K.tour=tok;
      KK.say(["¡Aguanta, ovejita! ¡Voy yo! 🚒","Hold on, little sheep! I'm coming! 🚒"],{p:3});
      stopping=true;await wait(RM()?0:650);
      let ok=false;try{ok=await KK.hop("pet");}catch(e){}
      if(K.tour!==tok&&!ok){if(!finished){stage=0;setFlames(p,0);out("auto");}return;}
      for(let i=0;i<3&&!finished;i++){bucket();stage--;setFlames(p,stage);await wait(520);}
      if(!finished)await out("kixki");
      if(by==="kixki")KK.say(["¡Listo! Esta vez me tocó a mí. 🚒","Done! My turn this time. 🚒"],{p:3,mood:"happy"});
      if(K.tour===tok)K.tour=null;
      setTimeout(()=>{if(!chatting&&KK.stage==="pet")KK.relocate();},900);
    }
    let last=performance.now();
    (function frame(ts){
      if(!fireOn)return;
      const dt=Math.min(.05,(ts-last)/1000);last=ts;
      if(!isPC()||!petEl()){end();return;}
      if(!document.hidden)t+=dt;
      if(stopping)mult=Math.max(0,mult-dt*2.8);
      if(!RM()&&mult>0){
        x+=dirp*SPD[Math.max(1,stage)]*mult*dt;
        const mx=innerWidth-130;if(x>mx){x=mx;dirp=-1;turn=rnd(.7,1.5);}if(x<120){x=120;dirp=1;turn=rnd(.7,1.5);}
        turn-=dt;if(turn<=0){dirp=-dirp;turn=rnd(.6,1.6);}
      }
      PETS.x=x;PETS.dir=dirp;p.style.transform=`translateX(${x}px)`;if(pi)pi.style.transform=dirp<0?"scaleX(-1)":"";
      petFacing=dirp>0?1:-1;if(pcur)playout();
      emb-=dt;if(emb<=0&&stage>0){emb=.11;const r=petBox();if(r)fxAt(r.left+rnd(6,r.width-10),r.top+rnd(-6,8),"kq-em",`--c:${["#ff7a1a","#ffd23a","#ff5a1f","#7a6a8a"][Math.floor(rnd(0,4))]};--ex:${Math.round(rnd(-10,10))}px`,900);}
      shoutT-=dt;if(shoutT<=0&&!finished&&!rescuing){shoutT=2.8;petSay(SHOUT[shoutI++%SHOUT.length],null,{ms:2400});}
      if(rainOn()&&!finished){rainT+=dt;if(rainT>1.4){stage=0;setFlames(p,0);out("rain");}}else rainT=0;
      if(t>=FIRE_LIMIT&&!rescuing&&!finished)rescue();
      requestAnimationFrame(frame);
    })(performance.now());
    return true;
  }

  /* =========================================================
     VACA.EXE (easter egg de los 1000 toques): Kixki sube a la ventana de la vaca y charlan.
     Si la acaricias 3 veces, o dejas que acabe la charla, se desbloquea un logro OCULTO
     (no aparece en la lista hasta que lo consigues).
     ========================================================= */
  const cowEl=()=>document.querySelector(".vp.cow");
  KK.plat("cow",()=>{
    const v=cowEl();if(!v)return null;const r=v.getBoundingClientRect();if(r.width<60)return null;
    const a=r.left+34;
    return {a,b:Math.max(a,r.right-34),y:()=>{const q=v.getBoundingClientRect();return q.top-2;}};
  });
  const COW=[
    ["k","¿¿Una VACA?? ¡Eh! Aquí las estrellas de la pantalla somos las ovejas. 🐑","A COW?? Hey! Around here the screen stars are the sheep. 🐑"],
    ["c","¡Muuu! 🐄","Moooo! 🐄"],
    ["k","Vaya… ¿tú eres la famosa vaca.exe? Nadie me avisó de que venías.","Wow… are you the famous cow.exe? Nobody told me you were coming."],
    ["c","Muuu. (Llevo horas bailando y nadie me aplaude.)","Moo. (I've been dancing for hours and nobody applauds.)"],
    ["k","¡Pues yo sí! ¡Bravo! 👏 Acaríciala y verás cómo se alegra.","Well I do! Bravo! 👏 Pet her and watch her cheer up."],
    ["c","¡Mu-mu-música! 🎶","Mu-mu-music! 🎶"]
  ];
  const PATS=[["¡Muuu! 💕","Moooo! 💕"],["¡Muu-muuu! 🎶","Moo-mooo! 🎶"],["¡MUUUUU! ✨","MOOOOO! ✨"]];
  let cowBusy=false,pats=0;
  const cowBeep=()=>{if(window.KXS)try{KXS.beep(130,.22);setTimeout(()=>KXS.beep(104,.28),170);}catch(e){}};
  function cowHeart(v){
    if(RM())return;const r=v.getBoundingClientRect(),i=document.createElement("i");i.className="kq-ht";
    i.style.cssText=`left:${Math.round(r.width/2+rnd(-60,60))}px;top:${Math.round(r.height*.5)}px`;i.innerHTML=ic("heart",3);
    v.append(i);setTimeout(()=>i.remove(),1300);
  }
  function cowSay(v,msg){
    return new Promise(res=>{
      const b=$(".kq-cb",v);if(!b){res(false);return;}
      const text=tx(msg);b.textContent=text;b.classList.add("in");say("🐄: "+text);cowBeep();
      const ms=RM()?900:clamp(1900+text.length*45,2300,5200);
      const iv=setInterval(()=>{if(!v.isConnected){clearTimeout(t);clearInterval(iv);res(false);}},200);
      const t=setTimeout(()=>{clearInterval(iv);b.classList.remove("in");res(true);},ms);
    });
  }
  function befriend(){if(C.cow)return;C.cow=1;save();sweep();}
  async function cowChat(v){
    if(cowBusy)return;cowBusy=true;
    const tok={};let i=0,fails=0;
    try{
      while((chatting||fireOn)&&v.isConnected)await wait(600);
      await wait(RM()?0:700);
      while(i<COW.length&&v.isConnected&&fails<4){
        if(!(KK.ready&&S.on&&!K.off))return;
        /* (re)sube a la ventana de la vaca; si algo la interrumpe, espera un poco y sigue donde iba */
        if(K.tour!==tok||KK.stage!=="cow"){
          K.tour=tok;KK.interrupt();
          const ok=await KK.hop("cow");
          if(!ok||K.tour!==tok){fails++;await wait(1800);continue;}
          await wait(RM()?0:300);
        }
        if(KK.el)KK.el.classList.add("kq-cowtop");/* por encima de las ventanas de broma */
        const [who,es,en]=COW[i];
        const r=who==="k"?await KK.say([es,en],{p:2}):await cowSay(v,[es,en]);
        if(!r||K.tour!==tok){if(!v.isConnected)return;fails++;await wait(1800);continue;}
        i++;await wait(RM()?0:240);
      }
      if(i>=COW.length&&v.isConnected)befriend();
    }finally{cowBusy=false;if(K.tour===tok)K.tour=null;setTimeout(()=>{if(!cowBusy&&KK.el)KK.el.classList.remove("kq-cowtop");},2500);}
  }
  function cowGone(){
    const was=C.cow;pats=0;
    if(!(KK.ready&&S.on&&!K.off))return;
    setTimeout(()=>{if(KK.stage==="cow"&&!cowEl())KK.relocate();},350);
    setTimeout(()=>{try{KK.say(was?["¡Adiós, vaca.exe! Fue un placer bailar contigo. 👋","Bye, cow.exe! It was a pleasure dancing with you. 👋"]:["¡Ey, se fue la vaca! Bueno… ¡adiós! 👋","Hey, the cow left! Oh well… bye! 👋"],{p:2,key:"cow-bye",cd:20000});}catch(e){}},700);
  }
  new MutationObserver(ms=>{
    for(const m of ms){
      m.addedNodes.forEach(n=>{
        if(n.nodeType!==1||!n.matches||!n.matches(".vp.cow")||n.querySelector(".kq-cb"))return;
        const img=n.querySelector("img");
        if(img)img.insertAdjacentHTML("afterend",'<div class="kq-cb" aria-live="off"></div>');
        pats=0;cowChat(n);
      });
      m.removedNodes.forEach(n=>{if(n.nodeType===1&&n.matches&&n.matches(".vp.cow"))cowGone();});
    }
  }).observe(document.body,{childList:true});
  document.addEventListener("click",e=>{
    const im=e.target&&e.target.closest&&e.target.closest(".vp.cow img");if(!im)return;
    const v=im.closest(".vp.cow");cowHeart(v);cowBeep();
    const b=$(".kq-cb",v);if(b&&!b.classList.contains("in")){b.textContent=tx(PATS[Math.min(pats,PATS.length-1)]);b.classList.add("in");clearTimeout(b._t);b._t=setTimeout(()=>b.classList.remove("in"),1700);}
    pats++;if(pats>=3)befriend();
  });
  window.addEventListener("pointerup",()=>{if(cowEl())dispatchEvent(new Event("resize"));});/* Kixki sigue a la ventana si la arrastras */

  /* ---------- listo: ponerse al día sin avisar y enseñar qué había ---------- */
  const first=!ST.init;ST.init=1;
  const caught=sweep(true);save();
  if(first&&caught.length){
    setTimeout(()=>{
      queueToast({i:"trophy",head:UI.sumHead,n:[fmt(UI.sumName[0],{n:caught.length}),fmt(UI.sumName[1],{n:caught.length})],d:UI.sumDesc,long:1});
      KK.say([`¡Oye! Revisé tu historial y ya tenías ${caught.length} logros. ¡Eres muy pro, no lo olvides! 🏆`,`Hey! I checked your history and you already had ${caught.length} achievements. You're so pro, never forget it! 🏆`],{p:2});
    },9000);
  }
  refreshMenu();

  /* ---------- EASTER EGG · Modo Hacker (F12 / inspector) ----------
     Detecta que abres las herramientas de desarrollador por dos vías: los atajos de teclado (F12, Ctrl+Shift+I/J/C, Cmd+Opt+I/J/C)
     y el tamaño de la ventana (inspector acoplado a un lado o abajo; en móvil/táctil no se mide). Kixki cambia su sprite por uno
     con lentes y sudadera (se redibuja cada fotograma, así camina, salta y habla igual) y suelta un saludo en su globo. */
  const HK={on:false,key:false,miss:0,pend:false,boot:true,talked:false,since:0,orig:null,hack:null};
  const HKL={
    first:[
      ["¡Hola, mente curiosa! 🕶️ Veo que abriste la consola. Saludos desde el detrás de escena… pero por favor, no rompas nada del código. 🙏","Hello, curious mind! 🕶️ I see you opened the console. Greetings from behind the scenes… but please, don't break anything in the code. 🙏"],
      ["Modo hacker activado. 😎 Qué ojo técnico tienes. Mira todo lo que quieras, pero no toques nada, ¿sí? Está armado con lana y cariño.","Hacker mode on. 😎 What a technical eye you have. Look all you want, but don't touch anything, okay? It's held together with wool and love."],
      ["¡Te pillé inspeccionando! 🔍 Me encanta tu curiosidad técnica. Solo te pido una cosa: no rompas nada del código.","Caught you inspecting! 🔍 I love your technical curiosity. I only ask one thing: don't break anything in the code."]
    ],
    again:[
      ["¡Otra vez por aquí, hacker! 🕶️ Recuerda: mirar sí, romper no.","Back again, hacker! 🕶️ Remember: looking is fine, breaking is not."],
      ["Capucha puesta de nuevo. 😎 Todo en orden en el código… ¡y que siga así!","Hood back on. 😎 Everything's fine in the code… let's keep it that way!"],
      ["La consola otra vez… ¡me encanta tu curiosidad! No toques el código, ¿vale? 🙏","The console again… I love your curiosity! Don't touch the code, okay? 🙏"]
    ],
    bye:[
      ["Uf, me quito la capucha. 🐑 Gracias por no romper nada.","Phew, hood off. 🐑 Thanks for not breaking anything."],
      ["Consola cerrada. ¡Volvió la lana! Si encontraste un bug… shhh, será nuestro secreto. 🤫","Console closed. The wool is back! If you found a bug… shhh, it'll be our secret. 🤫"]
    ]
  };
  /* sprite hacker: se calcula a partir de los fotogramas normales de Kixki (lana → sudadera, lentes con brillo verde) */
  function hackify(rows,name){
    const r=rows.map(s=>s.split(""));
    const put=(y,x,c)=>{if(r[y]&&x>=0&&x<r[y].length)r[y][x]=c;};
    r.forEach((row,y)=>{if(y>12)return;row.forEach((c,x)=>{
      if(c==="w"||c==="a")row[x]="h";else if(c==="s"||c==="b")row[x]="i";else if(c==="y")row[x]=y<2?".":"h";});});
    for(let x=13;x<=18;x++)put(5,x,"j");                 /* borde de la capucha sobre la cara */
    for(let y=6;y<=8;y++)put(y,14,"j");                   /* …y a un lado */
    put(9,14,"j");put(10,14,"j");                         /* cordones */
    for(let x=4;x<=8;x++)put(10,x,"j");                   /* bolsillo canguro */
    put(6,5,"n");put(7,6,"n");put(8,5,"n");put(8,7,"n");put(8,8,"n"); /* «>_» en la espalda */
    const eyes=name==="blink"||name==="sleep"?["vvvv","vvvv"]:name==="happy"?["vtnv","nnnn"]:["vtvv","vnnv"];
    put(6,14,"v");[...eyes[0]].forEach((c,i)=>put(6,15+i,c));[...eyes[1]].forEach((c,i)=>put(7,15+i,c));
    return r.map(a=>a.join(""));
  }
  function hkSwap(on){
    const el=KK.el;
    if(!HK.orig){
      HK.orig={};HK.hack={};
      Object.keys(KK.rows).forEach(k=>{
        const sv=$(".f-"+k,el);if(!sv)return;
        HK.orig[k]=sv.innerHTML;
        const t=document.createElement("template");t.innerHTML=sprite(hackify(KK.rows[k],k),3);
        HK.hack[k]=t.content.firstElementChild.innerHTML;
      });
    }
    Object.keys(HK.orig).forEach(k=>{const sv=$(".f-"+k,el);if(sv)sv.innerHTML=on?HK.hack[k]:HK.orig[k];});
    el.classList.toggle("kk-hk",on);
  }
  const hkSeen=()=>{try{return +sessionStorage.getItem("kixki-hk")||0;}catch(e){return 0;}};
  const hkMark=()=>{try{sessionStorage.setItem("kixki-hk",String(Date.now()));}catch(e){}};
  const hkCan=()=>S.on&&KK.ready&&!K.off;
  function hkSay(kind){
    if(kind==="off"){
      HK.pend=false;
      if(HK.talked&&Date.now()-HK.since>4000&&hkCan())KK.say(KK.pick(HKL.bye,"hk"),{p:1,key:"hk-bye",cd:6000});
      return;
    }
    const first=!hkSeen();
    if(HK.boot&&!first)return;                            /* recarga con el inspector abierto: se pone los lentes sin repetir el saludo */
    if(!hkCan()){HK.pend=true;return;}                    /* Kixki aún no sale (pantalla de arranque, ventana maximizada…): saluda cuando pueda */
    HK.pend=false;HK.talked=true;hkMark();
    KK.say(KK.pick(first?HKL.first:HKL.again,"hk"),{p:3,key:"hk",cd:4000});
  }
  function hkSet(on){HK.on=on;HK.miss=0;hkSwap(on);if(on)HK.since=Date.now();hkSay(on?"on":"off");}
  const hkMQ=matchMedia("(hover:hover) and (pointer:fine)");
  /* inspector acoplado: se come espacio en UN eje (en los dos a la vez es zoom del navegador, no inspector) */
  const hkSize=()=>{
    if(!hkMQ.matches)return false;
    const dw=outerWidth-innerWidth,dh=outerHeight-innerHeight;
    return (dw>170)!==(dh>170);
  };
  function hkEval(){
    const s=hkSize();
    if(s)HK.key=false;                                    /* el tamaño ya lo confirma: desde ahora manda el detector */
    if(HK.key||s){HK.miss=0;if(!HK.on)hkSet(true);}
    else if(HK.on&&++HK.miss>=2)hkSet(false);             /* dos lecturas seguidas «cerrado» para evitar parpadeos */
  }
  addEventListener("keydown",e=>{
    if(e.repeat)return;
    const isF12=e.key==="F12";
    const combo=(e.ctrlKey&&e.shiftKey||e.metaKey&&e.altKey)&&/^Key[IJCK]$/.test(e.code||"");
    if(!isF12&&!combo)return;
    if(!HK.on)HK.key=true;                                /* abrir: se activa ya, sin esperar a que cambie el tamaño */
    else if(isF12||e.code==="KeyI")HK.key=false;          /* F12 y Ctrl+Shift+I también cierran */
    hkEval();setTimeout(hkEval,350);setTimeout(hkEval,1200);
  },true);
  addEventListener("resize",hkEval);
  setInterval(()=>{
    if(document.hidden)return;
    hkEval();
    if(HK.pend&&HK.on&&hkCan())hkSay("on");
  },1200);
  hkEval();HK.boot=false;

  window.KXQ={
    open:openPanel,list:()=>A.filter(x=>!x.hid||ST.u[x.id]).map(x=>({id:x.id,name:x.n[0],done:!!ST.u[x.id]})),state:ST,
    grant(id){const x=A.find(y=>y.id===id);if(!x||ST.u[id])return false;const lv0=level(count());ST.u[id]=now();save();announce([x],lv0);refreshMenu();sweep();return true;},
    reset(){ST.u={};ST.c={};ST.seenAt=0;ST.init=1;Object.keys(C).forEach(k=>delete C[k]);save();refreshMenu();if(!panel.hidden)renderPanel();},
    chat:petChat,fire:()=>petFire(true),cow:()=>window.KXE&&KXE.fire(1000),confetti,sparks,
    umbrella(v){if(v===false){UMB.next=now()+3e4;umbHide(true);return false;}UMB.next=0;if(!wet()&&window.KXRAIN)KXRAIN.start(90000);return true;},
    hacker(v){HK.key=v==null?!HK.on:!!v;hkEval();setTimeout(hkEval,350);setTimeout(hkEval,1200);return HK.on;}
  };
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 2:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
