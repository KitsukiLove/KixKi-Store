/* =========================================================
   CARGA DIFERIDA · los módulos de Kixki se cargan cuando la página ya se ve y está inactiva
   (dialogs.js pesa ~146 KB: antes bloqueaba el arranque en el celular).

   - Orden (importante, no lo cambies): dialogs → kixki → kixki2 → kixki3 → basket → consejos → vacaboss.
     Se descargan en paralelo, pero se ejecutan en ese orden (async=false).
   - Sus CSS se cargan ANTES que los scripts (Kixki no aparece sin estilos) y se insertan antes de los CSS del
     modo XP (xp.css …), para que XP siga ganando la cascada como antes.
   - Para añadir un módulo nuevo de Kixki: ponlo en JS (y su CSS en CSS) y en sw.js → SHELL.
   - Ningún otro archivo depende de que estos módulos estén ya cargados: todos los usos están protegidos
     (window.KXK && …) y el aviso "kixki-ready" ya se dispara en app.js antes de ellos.
   ========================================================= */
(function(){
"use strict";
var CSS=["kixki.css","kixki2.css","kixki3.css","basket.css","consejos.css","vacaboss.css"],
    JS=["dialogs.js","kixki.js","kixki2.js","kixki3.js","basket.js","consejos.js","vacaboss.js"],
    started=false;

function scripts(){
  JS.forEach(function(f){
    var s=document.createElement("script");
    s.src=f;s.async=false;                    /* async=false: se ejecutan en el orden de la lista */
    document.body.appendChild(s);
  });
}
function go(){
  if(started)return;started=true;
  var pending=CSS.length,done=false;
  var fin=function(){if(done)return;done=true;scripts();};
  var firstXP=document.head.querySelector("link[data-xp]");   /* si el modo XP ya puso sus CSS, los nuestros van antes */
  CSS.forEach(function(h){
    var l=document.createElement("link");l.rel="stylesheet";l.href=h;
    l.onload=l.onerror=function(){if(--pending<=0)fin();};
    document.head.insertBefore(l,firstXP||null);
  });
  setTimeout(fin,3000);                       /* red de seguridad: si algún CSS no responde, no se queda sin Kixki */
}
function later(){
  if("requestIdleCallback" in window)requestIdleCallback(go,{timeout:1500});
  else setTimeout(go,150);
}
if(document.readyState==="complete")later();
else addEventListener("load",later,{once:true});
})();
