/* =====================================================================
   KIXKI STORE · «Cambiar estilo» (xpmode.js)
   ---------------------------------------------------------------------
   Conecta el XP-Kit (xp.css · xp-icons.css · xp-games.css · xp-games.js)
   con la tienda. El modo XP es un PREMIO: se desbloquea al vencer a
   vaca.exe (parte 6). Mientras no lo ganes, estos archivos ni se cargan.

   · Desbloqueo: lo da vacaboss.js al ganar (KXB.unlockXP() → «kixki-bgx».xp).
     Aquí solo se lee ese dato; no se toca nada de vacaboss.js ni de scenes.js.
   · Botón: Ajustes (Kixki en PC · «Más» en móvil) → «Cambiar estilo». Al ganar
     aparece además una pastilla flotante «🎨 Cambiar estilo» hasta que la usas.
   · Activo: <html data-style="xp"> + los 3 CSS al FINAL del <head> (tienen que
     ir los últimos) + juegos XP (Buscalobos y Parejas) en Ajustes.
   · Se recuerda en localStorage «kixki-xp» ("1" = XP). Si se quita el
     desbloqueo (KXV.reset()), vuelve solo al estilo pixel.
   · Pixel = quitar los 3 <link> y el atributo: así de simple y sin rastro.
   · Consola: KXXP.set(true|false) · KXXP.toggle() · KXXP.unlocked() · KXXP.on

   Este archivo va en el <head>, SIN defer y DESPUÉS de todos los CSS, para
   aplicar el estilo antes de pintar (sin parpadeo). La CSP ya lo permite
   ('self'); no hace falta tocarla.
   ===================================================================== */
(function(){
"use strict";
var D=document,R=D.documentElement;
var KEY="kixki-xp",SEEN="kixki-xp-seen",CSS=["xp.css","xp-icons.css","xp-games.css"];
function get(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function put(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function unlocked(){try{var x=JSON.parse(get("kixki-bgx")||"{}");return !!(x&&x.xp);}catch(e){return false;}}
function link(f){return '<link rel="stylesheet" href="'+f+'" data-xp>';}
var on=false;

/* ---------- 1 · arranque temprano (antes de pintar) ---------- */
if(get(KEY)==="1"&&unlocked()){
  on=true;R.setAttribute("data-style","xp");
  if(D.readyState==="loading")D.write(CSS.map(link).join(""));   /* bloquea el pintado hasta tener el estilo: sin parpadeo */
  else addCss();
}

function addCss(){
  CSS.forEach(function(f){
    if(D.querySelector('link[data-xp][href="'+f+'"]'))return;
    var l=D.createElement("link");l.rel="stylesheet";l.href=f;l.setAttribute("data-xp","");D.head.appendChild(l);   /* al final del head = gana la cascada */
  });
}
function dropCss(){Array.prototype.forEach.call(D.querySelectorAll("link[data-xp]"),function(l){l.remove();});}

/* ---------- 2 · textos [español, English] ---------- */
var TX={
 style:["Cambiar estilo","Change style"],px:["Pixel","Pixel"],xp:["XP","XP"],
 wolf:["Buscalobos (XP)","Wolf Hunt (XP)"],pairs:["Parejas (XP)","Pairs (XP)"],
 pill:["🎨 Cambiar estilo","🎨 Change style"],close:["Cerrar","Close"],
 srOn:["Estilo XP activado.","XP style on."],srOff:["Estilo pixel activado.","Pixel style on."],
 srUnlock:["Desbloqueaste «Cambiar estilo» en Ajustes: el modo XP.","You unlocked “Change style” in Settings: XP mode."],
 kOn:["¡Beee! Qué nostalgia… esta colina es de otra época. 🌄🐑","Baa! So nostalgic… this hill is from another era. 🌄🐑"],
 kOff:["Volvemos a los pixeles: cuadraditos, pero con cariño. 🟪🐑","Back to pixels: blocky, but lovable. 🟪🐑"],
 kUnlock:["¡Venciste a vaca.exe! Se desbloqueó «Cambiar estilo» (Ajustes): ¡prueba el modo XP! 🎨🐑","You beat cow.exe! “Change style” is unlocked (Settings): try XP mode! 🎨🐑"]
};
var en=function(){return window.KXI&&KXI.lang==="en"?1:0;};
var L=function(p){return p[en()];};
var $=function(s,r){return (r||D).querySelector(s);};
var kx=function(p,o){try{if(window.KXK&&KXK.ready!==false&&KXK.say)KXK.say(p,Object.assign({p:2,cat:"ui",cd:0,always:false,ttl:5200},o||{}));}catch(e){}};

/* ---------- 3 · activar / desactivar ---------- */
function loadGames(cb){
  if(window.XPGames){cb();return;}
  var s=$('script[data-xp]');
  if(s){s.addEventListener("load",cb,{once:true});return;}
  s=D.createElement("script");s.src="xp-games.js";s.setAttribute("data-xp","");s.onload=cb;D.head.appendChild(s);
}
function set(v,quiet){
  v=!!v;
  if(v&&!unlocked())return false;                 /* sin ganar a la vaca no hay XP */
  if(v===on){sync();return on;}
  on=v;put(KEY,on?"1":"0");
  if(on){R.setAttribute("data-style","xp");addCss();
    /* con el estilo XP, si tenías el fondo Clásico se pone la Colina XP (y al volver al pixel se devuelve el Clásico) */
    try{if(window.KXB&&KXB.has("xp")&&!R.getAttribute("data-bg")){put("kixki-xp-bg","1");KXB.use("xp");}}catch(e){}}
  else{
    try{if(get("kixki-xp-bg")==="1"&&R.getAttribute("data-bg")==="xp"&&window.KXB)KXB.use("");put("kixki-xp-bg","0");}catch(e){}
    try{if(window.XPGames)XPGames.list.forEach(function(n){XPGames.close(n);});}catch(e){}
    R.removeAttribute("data-style");dropCss();
  }
  put(SEEN,"1");sync();
  if(!quiet){live(L(on?TX.srOn:TX.srOff));kx(on?TX.kOn:TX.kOff,{key:"xp-"+(on?"on":"off")});}
  try{dispatchEvent(new CustomEvent("kixki-style",{detail:{style:on?"xp":"pixel"}}));}catch(e){}
  return on;
}

/* ---------- 4 · interfaz (menú + pastilla) ---------- */
var live_=null,pill=null,btn=null,g1=null,g2=null,was=unlocked(),css=false,wait=0;
function live(t){if(!live_)return;live_.textContent="";setTimeout(function(){live_.textContent=t;},60);}
function uiCss(){
  if(css)return;css=true;
  var s=D.createElement("style");s.id="xp-ui-css";
  s.textContent=".xp-pill{position:fixed;left:50%;bottom:calc(64px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9500;display:flex;gap:6px;align-items:center;max-width:calc(100vw - 20px)}"
   +":root:not(.dsk) .xp-pill{bottom:calc(96px + env(safe-area-inset-bottom,0px))}"
   +".xp-pill[hidden]{display:none}.xp-pill .btn{white-space:nowrap}.xp-pill .vx{align-self:stretch}"
   +"@media (prefers-reduced-motion:no-preference){.xp-pill:not([hidden]) .btn{animation:xp-pop .5s steps(5) 1}}"
   +"@keyframes xp-pop{0%{transform:scale(.6)}60%{transform:scale(1.12)}100%{transform:scale(1)}}";
  D.head.appendChild(s);
}
function build(){
  var sm=$("#sm");if(!sm||btn)return !!btn;
  uiCss();
  var ref=$("#s-bg",sm);
  var html='<button type="button" class="sm" id="s-xp" hidden></button>'
          +'<button type="button" class="sm" id="s-xpg1" hidden></button>'
          +'<button type="button" class="sm" id="s-xpg2" hidden></button>';
  ref?ref.insertAdjacentHTML("afterend",html):sm.insertAdjacentHTML("beforeend",html);
  btn=$("#s-xp",sm);g1=$("#s-xpg1",sm);g2=$("#s-xpg2",sm);
  btn.addEventListener("click",function(){sm.hidden=true;set(!on);});
  g1.addEventListener("click",function(){sm.hidden=true;loadGames(function(){XPGames.open("lobos");});});
  g2.addEventListener("click",function(){sm.hidden=true;loadGames(function(){XPGames.open("parejas");});});
  D.body.insertAdjacentHTML("beforeend",
    '<span id="xp-live" class="sr" role="status" aria-live="polite"></span>'
   +'<div id="xp-pill" class="xp-pill" role="group" hidden><button type="button" class="btn p" id="xp-pill-go"></button><button type="button" class="vx" id="xp-pill-x"></button></div>');
  live_=$("#xp-live");pill=$("#xp-pill");
  $("#xp-pill-go").addEventListener("click",function(){set(true);});
  $("#xp-pill-x").addEventListener("click",function(){put(SEEN,"1");sync();});
  /* el menú se vuelve a pintar cada vez que se abre (idioma, estado) */
  new MutationObserver(sync).observe(sm,{attributes:true,attributeFilter:["hidden"]});
  if(window.KXI&&!KXI._xp){KXI._xp=1;var o=KXI.set;KXI.set=function(l){var r=o.call(KXI,l);sync();return r;};}
  return true;
}
function sync(){
  var u=unlocked();
  if(!u&&on){on=false;R.removeAttribute("data-style");dropCss();put(KEY,"0");}   /* reset del premio → vuelve a pixel */
  if(!btn)return;
  btn.hidden=!u;
  btn.textContent=L(TX.style)+": "+L(on?TX.xp:TX.px);
  btn.setAttribute("aria-pressed",String(on));
  g1.hidden=g2.hidden=!(u&&on);
  g1.textContent=L(TX.wolf);g2.textContent=L(TX.pairs);
  var fight=window.KXV&&KXV.fight,busy=!!(window.KXV&&KXV.busy&&KXV.busy())&&!(fight&&fight.over);   /* combate ya decidido = ya se puede ofrecer */
  var showPill=u&&!on&&get(SEEN)!=="1"&&!busy;
  pill.hidden=!showPill;
  if(u&&!on&&get(SEEN)!=="1"&&busy&&!wait)wait=setTimeout(function(){wait=0;sync();},900);   /* aún en pleno combate: reintentar al acabar */
  $("#xp-pill-go").textContent=L(TX.pill);
  var x=$("#xp-pill-x");x.textContent="✕";x.setAttribute("aria-label",L(TX.close));
  if(u&&!was){                                        /* acaba de ganar: avisar una vez */
    was=true;live(L(TX.srUnlock));
    setTimeout(function(){kx(TX.kUnlock,{key:"xp-unlock",p:3});},6800);   /* deja terminar el mensaje de victoria */
  }
  if(!u)was=false;
}

/* ---------- 5 · arranque de la interfaz ---------- */
var tries=0;
function boot(){
  if(!build()){if(++tries<60)setTimeout(boot,250);return;}
  addEventListener("kixki-bg",sync);                  /* vacaboss: ganar/perder cambia el fondo y avisa */
  addEventListener("kixki-evt",function(e){if(e.detail&&e.detail.t==="cowboss")setTimeout(sync,50);});
  sync();
}
if(D.readyState==="loading")D.addEventListener("DOMContentLoaded",boot);else boot();

window.KXXP={get on(){return on;},set:set,toggle:function(){return set(!on);},unlocked:unlocked,sync:sync};
})();
