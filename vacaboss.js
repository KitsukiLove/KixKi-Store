/* =========================================================
   KIXKI · parte 6 · vaca.exe se rebela  (logro «Apuñalar por la espalda»)
   - Condición: ya tienes el logro oculto de la amistad con vaca.exe y dejas su ventana abierta un rato (75–110 s).
     Primero hay un aviso («vaca.exe está muy callada…»); si sigues con la ventana abierta, la vaca la rompe y sale al escritorio.
   - Combate: la vaca recorre el escritorio y mancha carpetas. Sube la barra de INFECCIÓN (cada carpeta manchada + el paso del tiempo).
     Agarra a Kixki y lánzala contra la vaca (o usa el botón «Lanzar a Kixki» / la tecla L). 5 de vida: golpe normal = 1, por la espalda = 2.
     Un clic en una carpeta manchada la limpia. Violencia de dibujos animados: «bonk», estrellitas, nada gráfico.
   - Gana: la vaca se deshace en píxeles y confeti, logro «Apuñalar por la espalda» y fondo «Colina XP» (scenes.js).
   - Pierde (infección al 100 %): el fondo pasa a «¡Vacas!» (mosaico de vacas bailando). Se quita desde Ajustes («Restaurar fondo»),
     con el botón de la barra o cambiando de fondo; revancha tras un tiempo de espera.
   - Memoria en localStorage «kixki-vb» (intentos, ganado/perdido, espera). El fondo especial vive en «kixki-bgx» (scenes.js).
   - Se apoya en kixki.js (KXK), kixki2.js (logros, KXQ), kixki3.js (física de lanzar, KXK3) y scenes.js (KXB).
   - Consola: KXV.start({force:1}) · KXV.win() · KXV.lose() · KXV.state · KXV.reset()
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now(),sgn=v=>v<0?-1:1;
const RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
const lang=()=>window.KXI&&KXI.lang==="en"?1:0;
const L=p=>p[lang()];
const fmt=(s,v)=>s.replace(/\{(\w+)\}/g,(a,k)=>v&&v[k]!=null?v[k]:a);
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- ajustes del combate (se pueden tocar desde la consola: KXV.cfg) ---------- */
const CFG={
  dwellMin:75e3,dwellMax:110e3,   /* ventana de vaca.exe abierta antes del aviso */
  warn:3800,                      /* ms entre el aviso y la traición */
  cooldown:8*60e3,                /* espera entre intentos */
  hp:5,                           /* vida de la vaca */
  perIcon:6,                      /* % de infección por carpeta manchada */
  creep:.35,                      /* % por segundo que sube sola (hasta creepMax) */
  creepMax:30,
  speed:120,speedRage:178,        /* px/s */
  munch:.95,                      /* s comiendo una carpeta */
  stun:1.7,invul:.75,             /* s aturdida tras un golpe / s sin poder recibir otro */
  minSpeed:300,                   /* velocidad mínima de Kixki para hacer daño (px/s) */
  tele:[6.5,9.5],teleRage:[4.2,6.2],
  hint:6                          /* s sin lanzar nada y sale la pista */
};

/* ---------- memoria ---------- */
const LSK="kixki-vb",D0={won:0,lost:0,tries:0,next:0,hits:0,backs:0};
let B;try{B=Object.assign({},D0,JSON.parse(localStorage.getItem(LSK)||"{}")||{});}catch(e){B=Object.assign({},D0);}
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(B));}catch(e){}};

/* ---------- textos  [español, English] ---------- */
const TX={
 group:["Combate contra vaca.exe","Fight against cow.exe"],
 name:["vaca.exe","cow.exe"],
 hpL:["Vida de la vaca","Cow health"],
 infL:["Infección","Infection"],
 fold:["Carpetas","Folders"],
 throwB:["Lanzar a Kixki","Throw Kixki"],
 throwT:["Lanzar a Kixki contra la vaca (tecla L)","Throw Kixki at the cow (key L)"],
 restore:["Restaurar fondo","Restore wallpaper"],
 restoreT:["Quitar el fondo de vacas y volver al anterior","Remove the cow wallpaper and go back to the previous one"],
 pause:["Pausar vacas","Pause cows"],play:["Reanudar vacas","Resume cows"],
 /* avisos para lectores de pantalla (y para quien no mire la barra) */
 srStart:["¡vaca.exe se ha rebelado! Lanza a Kixki contra ella con el botón «Lanzar a Kixki» o con la tecla L. Los golpes por la espalda valen doble. Haz clic en una carpeta manchada para limpiarla.","cow.exe has rebelled! Throw Kixki at it with the “Throw Kixki” button or the L key. Hits from behind count double. Click a stained folder to clean it."],
 srHit:["Golpe. Vida de la vaca: {hp} de {max}.","Hit. Cow health: {hp} of {max}."],
 srBack:["Golpe por la espalda: doble daño. Vida de la vaca: {hp} de {max}.","Hit from behind: double damage. Cow health: {hp} of {max}."],
 srInf:["Infección al {p} %. Carpetas manchadas: {n} de {t}.","Infection at {p}%. Stained folders: {n} of {t}."],
 srCure:["Carpeta limpia. Quedan {n} manchadas.","Folder cleaned. {n} still stained."],
 srMiss:["Kixki no le dio a la vaca.","Kixki missed the cow."],
 srWin:["¡Victoria! vaca.exe ha sido derrotada. Logro «Apuñalar por la espalda» y nuevo fondo «Colina XP».","Victory! cow.exe is defeated. “Backstab” achievement and new “XP Hill” wallpaper."],
 srLose:["Derrota: la infección llegó al 100 %. El fondo ahora es «¡Vacas!». Puedes restaurarlo en Ajustes.","Defeat: infection reached 100%. The wallpaper is now “Cows!”. You can restore it in Settings."],
 srNoThrow:["Ahora mismo Kixki no puede lanzarse.","Kixki can't be thrown right now."],
 srRestored:["Fondo restaurado.","Wallpaper restored."],
 /* Kixki */
 warn:[
  ["Psst… vaca.exe está muy callada. Demasiado callada. 🐄👀","Psst… cow.exe is very quiet. Way too quiet. 🐄👀"],
  ["¿Has notado que la vaca ya no baila? Eso nunca es buena señal. 😰","Have you noticed the cow stopped dancing? That's never a good sign. 😰"],
  ["Mmm… vaca.exe lleva un rato mirándonos fijamente. Me da mala espina. 🐄","Hmm… cow.exe has been staring at us for a while. I have a bad feeling. 🐄"],
  ["Creo que la vaca está mascando algo más que heno… ¡una idea malvada! 🐄💭","I think the cow is chewing on more than hay… an evil idea! 🐄💭"]
 ],
 start:[
  ["¡Lo sabía! ¡Una vaca no hace amigas sin un plan! Agárrame y lánzame contra ella. 🐑💢","I knew it! A cow doesn't make friends without a plan! Grab me and throw me at her. 🐑💢"],
  ["¡TRAICIÓN! Con lo bien que bailábamos… ¡Lánzame y se lo cobro todo! 😤","BETRAYAL! And we danced so well… Throw me and I'll collect it all! 😤"],
  ["¡Se acabó el baile! Tú me lanzas, yo le doy un pezuñazo. ¡Y por la espalda vale doble! 🐑🗡️","The dance is over! You throw me, I hoof her. And from behind counts double! 🐑🗡️"],
  ["¡Esa vaca va a aprender lo que es una oveja enfadada! ¡Lánzame! 🔥","That cow is about to learn what an angry sheep is! Throw me! 🔥"]
 ],
 hint:[
  ["Agárrame, tira hacia atrás y suelta. O usa el botón «Lanzar a Kixki». ¡Y limpia las carpetas manchadas con un clic! 🎯","Grab me, pull back and let go. Or use the “Throw Kixki” button. And clean stained folders with a click! 🎯"],
  ["¡Hazme volar! Si le doy por la espalda, ¡vale doble! 🗡️","Make me fly! If I hit her from behind, it counts double! 🗡️"]
 ],
 hit:[
  ["¡BONK! Eso es por abusar de mi confianza. 😤","BONK! That's for abusing my trust. 😤"],
  ["¡Toma pezuñazo! Con cariño… y con muchísima rabia. 🐑💥","Take that hoof! With love… and a LOT of rage. 🐑💥"],
  ["¡Auch, pero valió la pena! ¡Otra vez! 🌀","Ouch, but it was worth it! Again! 🌀"],
  ["¡Le di! Anota: la oveja mandó a la vaca a la lona. 📒","Got her! Write it down: the sheep sent the cow to the mat. 📒"]
 ],
 back:[
  ["¡POR LA ESPALDA! Doble daño y cero remordimientos. 😈🗡️","FROM BEHIND! Double damage and zero regrets. 😈🗡️"],
  ["¡Pezuñazo traicionero! Es lo que se merece una traidora. 🐑🗡️","A sneaky hoof! It's what a traitor deserves. 🐑🗡️"],
  ["¡Nunca des la espalda a una oveja enfadada! 😠","Never turn your back on an angry sheep! 😠"],
  ["Ella traicionó primero. Yo solo… devuelvo el favor. 😇🗡️","She betrayed first. I'm just… returning the favour. 😇🗡️"]
 ],
 miss:[
  ["¡Se movió! Apunta mejor, que la lana no se lanza sola. 😒","She moved! Aim better, wool doesn't throw itself. 😒"],
  ["Fallé… y la culpa es tuya, claro. 💢","I missed… and it's your fault, of course. 💢"],
  ["Aterrizaje sin gloria. Otra vez, y esta vez por la espalda. 🎯","Glory-less landing. Again, and this time from behind. 🎯"],
  ["Ni un rasguño a la vaca y yo con la lana despeinada. 😤","Not a scratch on the cow and my wool is all messy. 😤"]
 ],
 cure:[
  ["¡Carpeta limpia! Aquí no se mancha más. 🧼","Folder clean! No more stains here. 🧼"],
  ["¡Fuera manchas! La vaca no se sale con la suya. ✨","Stains out! The cow isn't getting away with this. ✨"],
  ["Una menos. ¡Sigue así, ayudante! 🧽","One less. Keep it up, helper! 🧽"]
 ],
 inf40:[
  ["¡Se están llenando de manchas! ¡Hay que frenarla! 😱","The stains are spreading! We have to stop her! 😱"],
  ["Esto se pone feo: ¡ya hay carpetas con manchas de vaca! 🐄","This is getting ugly: folders already have cow spots! 🐄"]
 ],
 inf70:[
  ["¡Casi toda la página es suya! ¡LÁNZAME YA! 🆘","Almost the whole page is hers! THROW ME NOW! 🆘"],
  ["¡Si esto sigue así, me quedo sin carpetas y sin heno! 😵","If this keeps up, I'll be left without folders and without hay! 😵"]
 ],
 inf90:[
  ["¡Una carpeta más y se acabó! ¡Haz algo! 😵💦","One more folder and it's over! Do something! 😵💦"]
 ],
 rageK:[
  ["Está tambaleándose. ¡Un golpe más! 🔥","She's wobbling. One more hit! 🔥"],
  ["¡Ahora va más rápido! Pero también está más débil. 🐑⚡","She's faster now! But also weaker. 🐑⚡"]
 ],
 win:[
  ["¡VACA DERROTADA! 🎉 Las amigas no traicionan; las traidoras… ¡hacen confeti!","COW DEFEATED! 🎉 Friends don't betray; traitors… make confetti!"],
  ["¡Pezuñazo final! ¡Apuñalar por la espalda, logro desbloqueado! 🏆","Final hoof! Backstab, achievement unlocked! 🏆"]
 ],
 prize:[
  ["Y mira lo que soltó al caer: el fondo «Colina XP». Lo encuentras con el botón de fondos. 🖼️","And look what she dropped: the “XP Hill” wallpaper. You'll find it with the wallpaper button. 🖼️"]
 ],
 lose:[
  ["¡NOOO! ¡Mi página llena de vacas! 😱 Restaura el fondo en Ajustes cuando quieras… y pide la revancha cuando vuelva vaca.exe.","NOOO! My page is full of cows! 😱 Restore the wallpaper in Settings whenever you want… and ask for a rematch when cow.exe returns."],
  ["Nos ganaron las vacas… 🐄 Esto no se queda así: ¡revancha! Y el fondo se restaura desde Ajustes.","The cows beat us… 🐄 This isn't over: rematch! And the wallpaper is restored from Settings."]
 ],
 summonLabel:["Llamar a vaca.exe","Call cow.exe"],
 summonT:["Volver a llamar a vaca.exe para la revancha","Call cow.exe back for the rematch"],
 summonK:[
  ["¿Revancha? ¡Pues la llamo! Pero ojo: ahora ya sabe pelear sucio. 🐑🔥","A rematch? Fine, I'll call her! But careful: now she fights dirty. 🐑🔥"],
  ["¡Que venga la vaca! Esta vez la apunto por la espalda desde el principio. 🎯","Bring on the cow! This time I'm aiming for her back from the start. 🎯"]
 ],
 summonWait:[
  ["vaca.exe sigue lamiéndose las heridas… vuelve en {m} min. 🐄🩹","cow.exe is still licking her wounds… back in {m} min. 🐄🩹"],
  ["Aún no: la vaca está descansando. Prueba en {m} min. 🐄💤","Not yet: the cow is resting. Try again in {m} min. 🐄💤"]
 ],
 restoreK:[
  ["¡Fondo restaurado! Pero la vaca sigue ahí fuera… 🐄👀","Wallpaper restored! But the cow is still out there… 🐄👀"],
  ["Fondo de vuelta. ¡Y que venga la revancha! 😤","Wallpaper back. And bring on the rematch! 😤"]
 ],
 /* la vaca (bocadillo sobre ella) */
 cowBetray:[
  ["¡MUUUU! Esta página ahora es MÍA. 🐄🔥","MOOO! This page is MINE now. 🐄🔥"],
  ["¡MUUU! ¿Amistad? Era parte del plan. 😈","MOOO! Friendship? It was part of the plan. 😈"],
  ["¡MUU-JAJÁ! Ni heno, ni ovejas, ni reglas. 🐄","MOO-HAHA! No hay, no sheep, no rules. 🐄"]
 ],
 cowHit:[
  ["¡Muu…! 🐄💢","Moo…! 🐄💢"],
  ["¡Mu! ¡Eso dolió, lanuda!","Moo! That hurt, fluffy!"],
  ["¡Muuuu! (Me vengaré.)","Mooo! (I will have my revenge.)"]
 ],
 cowRage:[
  ["¡MUUUUUU! Ya no bailo… ¡ahora mando yo!","MOOOOO! I'm not dancing anymore… I'm in charge now!"]
 ],
 cowMunch:[
  ["Ñam. Esta carpeta ya es de la manada. 🐄","Munch. This folder belongs to the herd now. 🐄"],
  ["Muu-ñam. Manchas, manchas… 🐄","Moo-munch. Spots, spots… 🐄"],
  ["¡Mu! Otra para la colección.","Moo! Another one for the collection."]
 ],
 cowTele:[
  ["¡Mu-jajá!","Moo-haha!"],
  ["¡Muu! ¡Aquí!","Moo! Over here!"]
 ],
 cowDie:[
  ["Mu… (Solo quería… bailar…)","Moo… (I just wanted… to dance…)"]
 ],
 cowWin:[
  ["¡MUUUUU! ¡Ahora todo es de la manada! 🐄🐄🐄","MOOOOO! Now everything belongs to the herd! 🐄🐄🐄"]
 ]
};

/* ---------- sonido (usa el de la tienda; respeta el interruptor de «Efectos») ---------- */
const beep=(f,d)=>{try{if(window.KXS)KXS.beep(f,d);}catch(e){}};
const moo=()=>{beep(150,.16);setTimeout(()=>beep(120,.2),150);setTimeout(()=>beep(94,.3),340);};
const bonk=()=>{beep(240,.05);setTimeout(()=>beep(150,.09),55);};
const pip=f=>beep(f||520,.04);

/* ---------- ayudas ---------- */
let KK=null,K=null,S=null;
const kx=(msg,o)=>KK.say(msg,Object.assign({p:3,cat:"ev",ctx:"boss",always:true,replace:true,ttl:3600},o||{}));
const pickPair=(list,key)=>KK.pick(list,"kv-"+key);
const cowWin=()=>document.querySelector(".vp.cow");
const cowFriend=()=>!!(window.KXQ&&KXQ.state&&KXQ.state.c&&KXQ.state.c.cow);
const icons=()=>$$("#desk .di");

/* ---------- estado del combate ---------- */
let F=null;                 /* combate en marcha (null = no hay) */
let pend=false;             /* aviso previo en curso */
let dw=0,goal=0,seen=false; /* tiempo con la ventana de la vaca abierta */
let hud=null,live=null,bar=null,barPause=null,barRestore=null,menuBtn=null,callBtn=null,cowEl=null;

const busy=()=>!!F||pend;

/* ---------- interfaz: barra del combate ---------- */
function buildHud(){
  if(hud)return;
  document.body.insertAdjacentHTML("beforeend",
   `<div id="kv-hud" class="kv-hud" role="group" hidden>
      <div class="kv-row"><b class="kv-nm"></b><span class="kv-hp" id="kv-hp" role="img"></span></div>
      <div class="kv-row"><span class="kv-l" id="kv-il"></span><div class="kv-bar" id="kv-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><span class="kv-pc" id="kv-pc" aria-hidden="true">0%</span></div>
      <div class="kv-row"><span class="kv-fc" id="kv-fc"></span><button type="button" class="kv-th" id="kv-th" aria-keyshortcuts="L"></button></div>
    </div>
    <div id="kv-live" class="kk-sr" role="status" aria-live="polite"></div>`);
  hud=$("#kv-hud");live=$("#kv-live");
  $("#kv-th").addEventListener("click",()=>{if(!aimThrow())sr(L(TX.srNoThrow));});
  labels();
}
function sr(t){if(!live)return;live.textContent="";setTimeout(()=>{if(live)live.textContent=t;},40);}
function labels(){
  if(hud){
    hud.setAttribute("aria-label",L(TX.group));
    $(".kv-nm",hud).textContent="🐄 "+L(TX.name);
    $("#kv-il").textContent=L(TX.infL);$("#kv-bar").setAttribute("aria-label",L(TX.infL));
    const b=$("#kv-th");b.textContent=L(TX.throwB);b.title=L(TX.throwT);
    if(F){hpView();infView();}
  }
  if(menuBtn){menuBtn.textContent=L(TX.restore);menuBtn.title=L(TX.restoreT);}
  if(callBtn){callBtn.textContent="🐄 "+L(TX.summonLabel);callBtn.title=L(TX.summonT);}
  if(barRestore){barRestore.textContent="↩ "+L(TX.restore);barRestore.title=L(TX.restoreT);}
  if(barPause)barPauseLabel();
}
function hpView(){
  if(!F)return;const hp=F.cow.hp,max=CFG.hp;
  $("#kv-hp").innerHTML=Array.from({length:max},(_,i)=>`<i class="${i<hp?"on":""}"></i>`).join("");
  $("#kv-hp").setAttribute("aria-label",L(TX.hpL)+": "+hp+"/"+max);
  const m=$(".kv-mini",cowEl);if(m)m.innerHTML=Array.from({length:max},(_,i)=>`<i class="${i<hp?"on":""}"></i>`).join("");
}
function infPct(){return F?Math.min(100,Math.round(F.inf.size*CFG.perIcon+F.creep)):0;}
function infView(){
  if(!F)return;const p=infPct(),n=icons().length;
  const bb=$("#kv-bar");bb.setAttribute("aria-valuenow",p);bb.setAttribute("aria-valuetext",p+"%");
  $("i",bb).style.width=p+"%";$("#kv-pc").textContent=p+"%";
  hud.classList.toggle("hot",p>=70);
  $("#kv-fc").textContent=L(TX.fold)+" "+F.inf.size+"/"+n;
}

/* ---------- la vaca ---------- */
const SPR=124;                                    /* tamaño del dibujo en pantalla */
function buildCow(x,y){
  cowEl=document.createElement("div");cowEl.id="kv-cow";cowEl.className="kv-cow emerge";cowEl.setAttribute("aria-hidden","true");
  cowEl.innerHTML=`<div class="kv-say" hidden></div><div class="kv-mini"></div><div class="kv-sp"><img class="kv-img" src="vaca-jefa.gif" width="${SPR}" height="${SPR}" alt=""><i class="kv-weak"></i></div><i class="kv-rg">💢</i>`;
  if(RM())$(".kv-img",cowEl).src="vaca-jefa.png";
  document.body.append(cowEl);
  place(x,y,1,0);
}
function place(x,y,dir,bob){
  cowEl.style.transform=`translate3d(${Math.round(x-SPR/2)}px,${Math.round(y-SPR-(bob||0))}px,0)`;
  if(cowEl._d!==dir){cowEl._d=dir;cowEl.style.setProperty("--d",dir);}
}
let sayT=0;
function cowSay(pair){
  if(!cowEl)return;const b=$(".kv-say",cowEl);if(!b)return;
  b.textContent=L(pair);b.hidden=false;clearTimeout(sayT);sayT=setTimeout(()=>{b.hidden=true;},RM()?1800:2300);
}
function fx(kind,x,y,text){
  const e=document.createElement("i");e.className="kv-fx "+kind;e.style.left=Math.round(x)+"px";e.style.top=Math.round(y)+"px";
  if(text)e.textContent=text;
  document.body.append(e);setTimeout(()=>e.remove(),RM()?700:1000);
}
function stars(x,y,n){
  if(RM()){fx("st",x,y,"✦");return;}
  for(let i=0;i<n;i++){
    const e=document.createElement("i");e.className="kv-star";e.textContent=["✦","★","✧"][i%3];
    e.style.cssText=`left:${Math.round(x)}px;top:${Math.round(y)}px;--dx:${Math.round(rnd(-46,46))}px;--dy:${Math.round(rnd(-58,-14))}px`;
    document.body.append(e);setTimeout(()=>e.remove(),800);
  }
}
function poof(x,y){
  if(RM())return;fx("poof",x,y);
}
function shatter(r){
  const cols=4,rows=4,w=r.width/cols,h=r.height/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    const e=document.createElement("i");e.className="kv-shard"+(j===0?" bar":"");
    e.style.cssText=`left:${Math.round(r.left+i*w)}px;top:${Math.round(r.top+j*h)}px;width:${Math.ceil(w)}px;height:${Math.ceil(h)}px;--dx:${Math.round((i-1.5)*rnd(40,80))}px;--dy:${Math.round(rnd(60,240))}px;--r:${Math.round(rnd(-160,160))}deg`;
    document.body.append(e);setTimeout(()=>e.remove(),1200);
  }
}
function pixelBurst(x,y){
  const cols=["#14101f","#ffffff","#ff9fd0","#ffd23a","#9be37a","#14101f"];
  const n=RM()?10:34;
  for(let i=0;i<n;i++){
    const e=document.createElement("i");e.className="kv-px";
    const a=rnd(0,6.283),d=rnd(40,150);
    e.style.cssText=`left:${Math.round(x)}px;top:${Math.round(y)}px;background:${cols[i%cols.length]};--dx:${Math.round(Math.cos(a)*d)}px;--dy:${Math.round(Math.sin(a)*d-40)}px`;
    document.body.append(e);setTimeout(()=>e.remove(),1300);
  }
}

/* ---------- carpetas manchadas ---------- */
function infect(d,quiet){
  if(!F||F.inf.has(d))return;
  F.inf.add(d);d.classList.add("kv-inf");
  if(!quiet){pip(180);const r=d.getBoundingClientRect();if(r.width)stars(r.left+r.width/2,r.top+r.height/2,3);}
  infView();
}
function cure(d,user){
  if(!F||!F.inf.has(d))return;
  F.inf.delete(d);d.classList.remove("kv-inf");
  if(user){
    pip(660);setTimeout(()=>pip(880),70);F.cures++;
    const r=d.getBoundingClientRect();if(r.width)stars(r.left+r.width/2,r.top+r.height/2,4);
    sr(fmt(L(TX.srCure),{n:F.inf.size}));
    if(F.cures===1||F.cures%4===0)kx(TX.cure,{key:"cure",cd:5000,replace:false});
  }
  infView();
}
function cureAll(fancy){
  if(!F)return;
  [...F.inf].forEach((d,i)=>{F.inf.delete(d);setTimeout(()=>{d.classList.remove("kv-inf");if(fancy&&!RM()){const r=d.getBoundingClientRect();if(r.width)stars(r.left+r.width/2,r.top+r.height/2,2);}},fancy&&!RM()?i*60:0);});
  $$("#desk .di.kv-inf").forEach(d=>{if(!F||!F.inf.has(d))d.classList.remove("kv-inf");});
}
document.addEventListener("click",e=>{
  if(!F||F.over)return;
  const d=e.target.closest&&e.target.closest("#desk .di.kv-inf");if(!d)return;
  e.preventDefault();e.stopImmediatePropagation();cure(d,true);
},true);

/* ---------- puntería: lanzar a Kixki con un botón o la tecla L (el combate se puede jugar sin arrastrar) ---------- */
function aimThrow(){
  if(!F||F.over||!window.KXK3||!KXK3.launch)return false;
  const c=F.cow;if(c.st==="emerge"||c.st==="dying")return false;
  const G=1900,kx0=K.x,ky0=K.y-20;
  const T=clamp(Math.abs(c.x-kx0)/1250,.5,.9);
  const tx=c.x+(c.mvx||0)*T*.8,ty=c.y-48;
  const v0x=(tx-kx0)*.6/(1-Math.exp(-.6*T));            /* la velocidad horizontal se frena un poco por el roce */
  const v0y=(ty-ky0-.5*G*T*T)/T;
  return KXK3.launch(v0x,v0y);
}
addEventListener("keydown",e=>{
  if(!F||F.over||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key!=="l"&&e.key!=="L")return;
  const t=e.target;if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
  e.preventDefault();if(!aimThrow())sr(L(TX.srNoThrow));
});

/* ---------- empezar ---------- */
function eligible(){
  return cowFriend()&&!B.won&&now()>=B.next&&KK.ready&&S.on&&!K.off&&!document.hidden&&!F&&!pend
    &&!$("#game:not([hidden])")&&!$("#bask:not([hidden])")&&!(window.KXK3&&KXK3.held);
}
function tick(){
  if(F||pend||document.hidden)return;
  const v=cowWin();
  if(!v){dw=0;seen=false;return;}
  if(!seen){seen=true;dw=0;goal=rnd(CFG.dwellMin,CFG.dwellMax);}
  if(!eligible())return;
  dw+=1000;
  if(dw>=goal)warn(v);
}
function warn(v){
  pend=true;v.classList.add("kv-sus");
  kx(TX.warn,{key:"warn",cd:0});
  moo();
  setTimeout(()=>{
    pend=false;
    if(!cowWin()||!eligible()){const w=cowWin();if(w)w.classList.remove("kv-sus");dw=0;seen=false;return;}
    start({v:cowWin()});
  },RM()?2500:CFG.warn);
}
function start(o){
  o=o||{};
  if(F)return false;
  if(!KK||!KK.ready||!S.on)return false;
  if(!o.force&&!eligible()&&!pend&&!o.v)return false;
  buildHud();
  const v=o.v||cowWin();
  const r=v?v.getBoundingClientRect():{left:innerWidth/2-140,top:Math.max(80,innerHeight/3-60),width:280,height:330};
  B.tries++;B.next=now()+CFG.cooldown;save();
  F={t0:now(),last:performance.now(),raf:0,over:false,cow:null,inf:new Set(),creep:0,time:0,hits:0,backs:0,throws:0,cures:0,
     mile:{},wasFly:false,flyThrown:false,hitThis:false,remoteT:0,offT:0,stillWas:K.still,hintDone:false,hintT:0,pLast:0};
  const c=F.cow={x:clamp(r.left+r.width/2,60,innerWidth-60),y:clamp(r.top+r.height*.78,170,innerHeight-8),vx:0,mvx:0,dir:1,hp:CFG.hp,st:"emerge",timer:RM()?.4:1.1,
     tgt:null,teleT:rnd(CFG.tele[0],CFG.tele[1]),invul:0,rage:false,hop:0,munch:0,bob:0};
  K.still=true;if(KK.el)KK.el.classList.add("kv-top");
  /* la ventana se rompe en pedazos (sin despedida: kixki2.js mira KXV.busy()) */
  if(!RM())shatter(r);
  if(v){v.remove();}
  document.querySelectorAll(".vp.cow").forEach(x=>x.remove());
  buildCow(c.x,c.y);
  hud.hidden=false;hpView();infView();
  moo();
  cowSay(pickPair(TX.cowBetray,"betray"));
  try{KK.interrupt();}catch(e){}
  setTimeout(()=>{if(F)KK.relocate&&KK.relocate();},120);
  setTimeout(()=>{if(F&&!F.over)kx(TX.start,{key:"start",cd:0});},650);
  sr(L(TX.srStart));
  F.raf=requestAnimationFrame(frame);
  return true;
}

/* ---------- bucle del combate ---------- */
const visible=r=>r.width>0&&r.height>0&&r.bottom>70&&r.top<innerHeight-30&&r.right>0&&r.left<innerWidth;
function pickTarget(){
  const c=F.cow,free=icons().filter(d=>!F.inf.has(d));
  if(!free.length)return null;
  let best=null,bd=1e9;
  for(const d of free){
    const r=d.getBoundingClientRect();if(!visible(r))continue;
    const x=r.left+r.width/2,y=clamp(r.bottom+4,170,innerHeight-8),dd=Math.hypot(x-c.x,y-c.y)+rnd(0,70);
    if(dd<bd){bd=dd;best=d;}
  }
  return best;
}
function aim(c,tx,ty,dt,sp){
  const dx=tx-c.x,dy=ty-c.y,d=Math.hypot(dx,dy);
  if(d<7)return true;
  const s=Math.min(d,sp*dt);c.x+=dx/d*s;c.y+=dy/d*s;
  if(Math.abs(dx)>5)c.dir=sgn(dx);
  return false;
}
function frame(t){
  if(!F)return;
  F.raf=requestAnimationFrame(frame);
  const dt=Math.min(.05,(t-F.last)/1000);F.last=t;
  if(document.hidden)return;
  if(!KK.ready||!S.on){if(!F.offT)F.offT=t;if(t-F.offT>2500)abort("off");return;}
  F.offT=0;
  if(K.off)return;                          /* ventana grande u otra pantalla encima: el combate espera */
  if(F.over){return;}
  F.time+=dt;
  const c=F.cow,px=c.x;
  c.invul=Math.max(0,c.invul-dt);
  F.creep=Math.min(CFG.creepMax,F.creep+CFG.creep*dt);
  /* carpetas que ya no existen (se volvió a dibujar el escritorio) */
  for(const d of [...F.inf])if(!d.isConnected)F.inf.delete(d);
  const speed=c.rage?CFG.speedRage:CFG.speed;
  switch(c.st){
    case "emerge":
      c.timer-=dt;if(c.timer<=0){c.st="pick";cowEl.classList.remove("emerge");}
      break;
    case "pick":{
      const d=pickTarget();
      if(d){c.tgt=d;c.st="move";break;}
      if(!icons().some(x=>!F.inf.has(x))){endLose();return;}
      /* hay carpetas libres pero fuera de la pantalla: pasea y el contagio avanza solo */
      c.st="wander";c.wx=rnd(80,innerWidth-80);c.wy=rnd(200,innerHeight-30);F.remoteT=0;
      break;
    }
    case "wander":{
      aim(c,c.wx,c.wy,dt,speed*.8);
      F.remoteT+=dt;
      if(F.remoteT>2.6){
        const free=icons().filter(d=>!F.inf.has(d));
        if(free.length){infect(free[0],false);}
        F.remoteT=0;
      }
      if(Math.hypot(c.wx-c.x,c.wy-c.y)<8){c.wx=rnd(80,innerWidth-80);c.wy=rnd(200,innerHeight-30);}
      if(pickTarget())c.st="pick";
      break;
    }
    case "move":{
      const d=c.tgt;
      if(!d||!d.isConnected||F.inf.has(d)){c.st="pick";break;}
      const r=d.getBoundingClientRect();
      if(!visible(r)){c.st="pick";break;}
      const tx=r.left+r.width/2,ty=clamp(r.bottom+4,170,innerHeight-8);
      c.hop+=dt*(c.rage?12:9);
      if(aim(c,tx,ty,dt,speed)){c.st="munch";c.munch=CFG.munch;cowEl.classList.add("munch");if(Math.random()<.5)cowSay(pickPair(TX.cowMunch,"munch"));}
      c.teleT-=dt;
      if(c.teleT<=0)teleport(c);
      break;
    }
    case "munch":{
      c.munch-=dt;
      if(c.munch<=0){
        cowEl.classList.remove("munch");
        const d=c.tgt;if(d&&d.isConnected)infect(d);
        c.tgt=null;c.st="pause";c.timer=c.rage?.15:.35;
      }
      break;
    }
    case "pause":
      c.timer-=dt;if(c.timer<=0)c.st="pick";
      break;
    case "stun":
      c.timer-=dt;
      c.x+=c.kvx*dt;c.kvx*=1-4*dt;
      if(c.timer<=0){cowEl.classList.remove("stun");c.st="pick";}
      break;
    case "tele":
      c.timer-=dt;
      if(c.timer<=0){
        if(c.tphase===1){
          c.x=c.nx;c.y=c.ny;c.tphase=2;c.timer=RM()?.05:.22;cowEl.classList.remove("tp-out");cowEl.classList.add("tp-in");poof(c.x,c.y-30);
        }else{cowEl.classList.remove("tp-in");c.st="pick";}
      }
      break;
  }
  c.x=clamp(c.x,50,innerWidth-50);c.y=clamp(c.y,160,innerHeight-6);
  c.mvx=dt>0?(c.x-px)/dt*.5+c.mvx*.5:0;
  c.bob=RM()||(c.st!=="move"&&c.st!=="wander")?0:Math.abs(Math.sin(c.hop))*14;
  place(c.x,c.y,c.dir,c.bob);

  /* --- Kixki volando: ¿le da a la vaca? --- */
  const fly=window.KXK3&&KXK3.flight?KXK3.flight():null;
  const flying=!!(window.KXK3&&KXK3.flying);
  if(flying&&!F.wasFly){F.wasFly=true;F.flyThrown=false;F.hitThis=false;}
  if(fly)F.flyThrown=true;
  if(!flying&&F.wasFly){
    F.wasFly=false;
    if(F.flyThrown&&!F.hitThis){sr(L(TX.srMiss));if(Math.random()<.7)kx(TX.miss,{key:"miss",cd:4000,replace:false,ttl:2600});}
  }
  if(fly&&c.invul<=0&&c.st!=="emerge"&&c.st!=="dying"&&Math.hypot(fly.vx,fly.vy)>=CFG.minSpeed){
    const kxp=K.x,kyp=K.y-20,bx0=c.x-44,bx1=c.x+44,by0=c.y-98,by1=c.y;
    const nx=clamp(kxp,bx0,bx1),ny=clamp(kyp,by0,by1);
    if(Math.hypot(kxp-nx,kyp-ny)<22){F.hitThis=true;onHit(c);}
  }
  /* --- pista si todavía no ha lanzado a Kixki --- */
  if(!F.hintDone&&F.time>CFG.hint&&F.throws===0&&!F.wasFly&&!(window.KXK3&&KXK3.held)){F.hintDone=true;kx(TX.hint,{key:"hint",cd:0,replace:false});}
  if(!F.hintDone&&window.KXK3&&(KXK3.held||F.wasFly))F.hintDone=true;
  if(flying&&F.wasFly&&!F.counted){F.counted=true;F.throws++;}
  if(!flying)F.counted=false;
  /* --- infección: avisos y derrota --- */
  const p=infPct();
  if(p!==F.pLast){F.pLast=p;infView();}
  for(const [m,key,list] of [[40,"i40",TX.inf40],[70,"i70",TX.inf70],[90,"i90",TX.inf90]]){
    if(p>=m&&!F.mile[key]){F.mile[key]=1;kx(list,{key,cd:0,replace:false,ttl:2800});sr(fmt(L(TX.srInf),{p,n:F.inf.size,t:icons().length}));}
  }
  if(p>=100)endLose();
}
function teleport(c){
  c.teleT=c.rage?rnd(CFG.teleRage[0],CFG.teleRage[1]):rnd(CFG.tele[0],CFG.tele[1]);
  const a=rnd(0,6.283),d=rnd(110,240);
  c.nx=clamp(c.x+Math.cos(a)*d,60,innerWidth-60);c.ny=clamp(c.y+Math.sin(a)*d*.6,180,innerHeight-8);
  poof(c.x,c.y-30);pip(300);
  if(RM()){c.x=c.nx;c.y=c.ny;return;}
  c.st="tele";c.tphase=1;c.timer=.25;cowEl.classList.add("tp-out");
  if(Math.random()<.5)cowSay(pickPair(TX.cowTele,"tele"));
}

/* ---------- golpe ---------- */
function onHit(c){
  const from=sgn(K.x-c.x)||-1,                /* de qué lado viene Kixki (−1 = izquierda) */
        near=Math.abs(K.x-c.x)<12,
        back=!near&&from===-c.dir;           /* la vaca mira al lado contrario de donde viene Kixki = por la espalda */
  const dmg=back?2:1;
  c.hp=Math.max(0,c.hp-dmg);F.hits++;if(back)F.backs++;B.hits++;if(back)B.backs++;save();
  c.invul=CFG.invul;c.st="stun";c.timer=back?CFG.stun*1.2:CFG.stun;c.kvx=-from*(back?280:200);c.tgt=null;
  cowEl.classList.remove("munch","tp-out","tp-in");cowEl.classList.add("stun");
  cowEl.classList.remove("hit");void cowEl.offsetWidth;cowEl.classList.add("hit");setTimeout(()=>cowEl&&cowEl.classList.remove("hit"),420);
  if(KXK3.bump)KXK3.bump(from*330,-430);
  bonk();stars(c.x,c.y-60,back?9:5);
  fx("pop"+(back?" back":""),c.x,c.y-118,back?(lang()?"DOUBLE!":"¡DOBLE!"):"BONK!");
  hpView();
  sr(fmt(L(back?TX.srBack:TX.srHit),{hp:c.hp,max:CFG.hp}));
  if(c.hp<=0){endWin();return;}
  cowSay(pickPair(TX.cowHit,"cowhit"));
  kx(back?TX.back:TX.hit,{key:back?"back":"hit",cd:0});
  if(!c.rage&&c.hp<=2){
    c.rage=true;cowEl.classList.add("rage");moo();
    setTimeout(()=>{if(F&&!F.over){cowSay(pickPair(TX.cowRage,"rage"));kx(TX.rageK,{key:"rage",cd:0,replace:false});}},900);
  }
}

/* ---------- final ---------- */
function stopLoop(){if(F)cancelAnimationFrame(F.raf);}
function cleanup(){
  if(!F)return;
  stopLoop();
  const f=F;
  K.still=f.stillWas;if(KK.el)KK.el.classList.remove("kv-top");
  if(cowEl){cowEl.remove();cowEl=null;}
  $$(".kv-clone").forEach(e=>e.remove());
  $$("#desk .di.kv-inf").forEach(d=>d.classList.remove("kv-inf"));
  if(hud)hud.hidden=true;
  F=null;pend=false;dw=0;seen=false;
}
function abort(why){
  if(!F)return;
  B.next=now()+30e3;B.tries=Math.max(0,B.tries-1);save();
  cleanup();
}
async function endWin(){
  if(!F||F.over)return;
  const f=F;f.over=true;const c=f.cow;c.st="dying";
  cowEl.classList.add("dying");cowSay(pickPair(TX.cowDie,"die"));
  sr(L(TX.srWin));
  await wait(RM()?500:1000);
  if(F!==f)return;
  pixelBurst(c.x,c.y-50);moo();
  if(window.KXQ&&KXQ.confetti)try{KXQ.confetti(60);}catch(e){}
  if(cowEl)cowEl.style.visibility="hidden";
  cureAll(true);
  B.won=1;save();
  /* premio: fondo «Colina XP» (si tenías puesto el castigo, se quita primero) */
  if(window.KXB){
    KXB.unlockXP();
    if(KXB.cursed())KXB.restore();
    KXB.use("xp");syncBgLabel();
  }
  KK.emit("cowboss",{r:"win",hits:f.hits,backs:f.backs});
  const k=K.el||KK.el;if(k&&!RM()){k.classList.add("kk-cheer");setTimeout(()=>k.classList.remove("kk-cheer"),2600);}
  kx(TX.win,{key:"win",cd:0,ttl:5200});
  setTimeout(()=>{if(F===f)kx(TX.prize,{key:"prize",cd:0,replace:false,ttl:6000});},4600);
  setTimeout(()=>{if(F===f)cleanup();},9000);
}
async function endLose(){
  if(!F||F.over)return;
  const f=F;f.over=true;const c=f.cow;c.st="win";
  cowEl.classList.remove("stun","munch");cowSay(pickPair(TX.cowWin,"cowwin"));moo();
  sr(L(TX.srLose));
  icons().forEach(d=>infect(d,true));
  /* la manada se multiplica un momento */
  if(!RM())for(let i=0;i<6;i++){
    const e=document.createElement("img");e.className="kv-clone";e.src="vaca-jefa.gif";e.alt="";e.width=96;e.height=96;e.setAttribute("aria-hidden","true");
    e.style.cssText=`left:${Math.round(rnd(20,innerWidth-110))}px;top:${Math.round(rnd(120,innerHeight-130))}px;animation-delay:${Math.round(i*90)}ms`;
    document.body.append(e);
  }
  await wait(RM()?700:2600);
  if(F!==f)return;
  if(window.KXB)KXB.curse();
  B.lost++;save();syncBgLabel();syncBar();
  KK.emit("cowboss",{r:"lose",tries:B.tries});
  $$(".kv-clone").forEach(e=>e.remove());
  cureAll(false);
  if(cowEl)cowEl.style.visibility="hidden";
  kx(TX.lose,{key:"lose",cd:0,ttl:6500});
  setTimeout(()=>{if(F===f)cleanup();},3500);
}

/* ---------- fondo «¡Vacas!»: restaurar y pausar ---------- */
function syncBgLabel(){const b=$("#s-bg");if(b&&window.KXB)b.textContent="Fondo: "+KXB.label();const g=$("#bgb");if(g&&window.KXB)g.title="Fondo: "+KXB.label();}
function barPauseLabel(){const p=KXB.paused()||RM();barPause.textContent=p?"▶ "+L(TX.play):"⏸ "+L(TX.pause);barPause.setAttribute("aria-pressed",String(!!KXB.paused()));}
function buildBar(){
  if(bar)return;
  document.body.insertAdjacentHTML("beforeend",`<div id="kv-wp" class="kv-wp" role="group" hidden><button type="button" class="kv-b" id="kv-bp"></button><button type="button" class="kv-b" id="kv-br"></button></div>`);
  bar=$("#kv-wp");barPause=$("#kv-bp");barRestore=$("#kv-br");
  barPause.addEventListener("click",()=>{KXB.pause();barPauseLabel();});
  barRestore.addEventListener("click",()=>restoreBg());
  labels();
}
function syncMenu(){
  if(!callBtn)return;
  callBtn.hidden=!(cowFriend()&&!B.won&&!F&&!pend&&!cowWin());
}
function summon(){
  if(F||pend||cowWin()||B.won||!cowFriend())return false;
  const left=B.next-now();
  if(left>0){if(KK.ready&&S.on)kx(TX.summonWait,{key:"summonw",cd:0,always:false,p:2,vars:{m:Math.max(1,Math.ceil(left/60e3))}});return false;}
  if(!window.KXE||!KXE.cow)return false;
  KXE.cow();
  if(KK.ready&&S.on&&!K.off)setTimeout(()=>kx(TX.summonK,{key:"summon",cd:0,always:false,p:2}),400);
  return true;
}
function syncBar(){
  const on=!!(window.KXB&&KXB.cursed());
  if(on)buildBar();
  if(bar)bar.hidden=!on;
  if(menuBtn)menuBtn.hidden=!on;
  if(on&&barPause)barPauseLabel();
  syncMenu();
}
function restoreBg(){
  if(!window.KXB||!KXB.cursed())return;
  KXB.restore();syncBgLabel();syncBar();sr(L(TX.srRestored));
  if(KK.ready&&S.on&&!K.off)kx(TX.restoreK,{key:"restore",cd:0,always:false,p:2,ttl:4500});
}
function buildMenu(){
  const sm=$("#sm");if(!sm||menuBtn)return;
  const ref=$("#s-bg",sm);
  const html='<button type="button" class="sm" id="s-kv-bg" hidden></button>';
  ref?ref.insertAdjacentHTML("afterend",html):sm.insertAdjacentHTML("beforeend",html);
  menuBtn=$("#s-kv-bg");
  menuBtn.addEventListener("click",()=>{restoreBg();sm.hidden=true;});
  /* revancha: volver a llamar a vaca.exe (los 1000 toques solo la abren una vez en la vida) */
  menuBtn.insertAdjacentHTML("afterend",'<button type="button" class="sm" id="s-kv-call" hidden></button>');
  callBtn=$("#s-kv-call");
  callBtn.addEventListener("click",()=>{sm.hidden=true;summon();});
  new MutationObserver(syncMenu).observe(sm,{attributes:true,attributeFilter:["hidden"]});
  labels();
}

/* ---------- arranque ---------- */
function boot(){
  if(window.KXV||!window.KXK||!window.KXK3||!window.KXQ||!window.KXB||!$("#desk"))return false;
  KK=KXK;K=KK.K;S=KK.state;
  buildMenu();
  addEventListener("kixki-bg",()=>{syncBar();});
  syncBar();
  if(window.KXI&&!KXI._kv){KXI._kv=1;const o=KXI.set;KXI.set=function(l){const r=o.call(KXI,l);labels();return r;};}
  setInterval(tick,1000);
  addEventListener("pagehide",()=>{if(F)abort("hide");});
  window.KXV={state:B,cfg:CFG,TX,busy,
    get active(){return !!F;},
    get cow(){return F?F.cow:null;},
    get fight(){return F;},
    start,aimThrow,summon,win:()=>{if(F)endWin();},lose:()=>{if(F)endLose();},abort,restore:restoreBg,
    infected:()=>F?F.inf.size:0,
    reset(){Object.assign(B,D0);save();try{localStorage.removeItem("kixki-bgx");}catch(e){}if(F)abort("reset");if(window.KXB&&KXB.cursed())KXB.restore();syncBar();}};
  return true;
}
let tries=0;
const run=()=>{try{if(!boot()&&++tries<60&&!window.KXV)setTimeout(run,250);}catch(e){try{console.warn("Kixki 6:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
