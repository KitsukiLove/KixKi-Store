/* =====================================================================
   KIXKI STORE · MINIJUEGOS XP  (xp-games.js)  —  sin dependencias
   ---------------------------------------------------------------------
   Juegos:  «Buscalobos» (el buscaminas, con ovejas y lobos)
            «Parejas»    (memoria con los iconos Luna Lana)
   API:     XPGames.open("lobos" | "parejas")   abre (o trae al frente) la ventana
            XPGames.close(nombre)               la cierra
            XPGames.msg({title,text,icon,buttons:["Aceptar","Cancelar"]})
                                                cuadro de mensaje XP → Promise(índice del botón)
   Eventos: document.addEventListener("xpgames",e=>…) con e.detail.type:
            open, close, start, reveal, flag, win, lose, flip, match, miss
            → aquí enchufarás más adelante tus sonidos/logros (no hay ninguno ahora).
   Idioma:  sigue <html lang>; "en" = inglés, lo demás = español.
   ===================================================================== */
(function(){
"use strict";
var D=document,EN=/^en/i.test(D.documentElement.lang||"");
var TX={
 lobos:["Buscalobos","Wolf Hunt"],parejas:["Parejas","Pairs"],game:["Juego","Game"],flagMode:["Bandera","Flag"],
 newg:["Nuevo","New"],easy:["Principiante","Beginner"],mid:["Intermedio","Intermediate"],hard:["Experto","Expert"],
 s6:["Fácil · 12 cartas","Easy · 12 cards"],s8:["Normal · 16 cartas","Normal · 16 cards"],s12:["Difícil · 24 cartas","Hard · 24 cards"],
 close:["Cerrar","Close"],min:["Minimizar","Minimize"],ok:["Aceptar","OK"],again:["Jugar de nuevo","Play again"],
 won:["¡Lo conseguiste!","You did it!"],lost:["¡Un lobo!","A wolf!"],
 wonT:["Despejaste el prado en {t} s.","You cleared the meadow in {t} s."],
 lostT:["Pisaste un lobo, pero las ovejas te perdonan. Prueba otra vez.","You stepped on a wolf, but the sheep forgive you. Try again."],
 pwon:["Encontraste todas las parejas en {m} movimientos y {t} s.","You found every pair in {m} moves and {t} s."],
 best:["Mejor","Best"],moves:["Movimientos","Moves"],hint:["Clic: abrir · Derecho: bandera","Click: open · Right: flag"]
};
function t(k,v){var s=(TX[k]||[k,k])[EN?1:0];if(v)for(var x in v)s=s.replace("{"+x+"}",v[x]);return s;}
function emit(type,game,x){D.dispatchEvent(new CustomEvent("xpgames",{detail:Object.assign({type:type,game:game},x||{})}));}
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function ico(n,s){return '<i class="xpi xpi-'+n+'"'+(s?' style="--s:'+s+'px"':"")+'></i>';}
var BK="kixki-xp-best";
function best(k,v){var o={};try{o=JSON.parse(localStorage.getItem(BK)||"{}");}catch(e){}
  if(v==null)return o[k];if(o[k]==null||v<o[k]){o[k]=v;try{localStorage.setItem(BK,JSON.stringify(o));}catch(e){}return true;}return false;}

/* ---------- ventanas con arrastre ---------- */
var zTop=0,open={},cascade=0;
function front(w){D.querySelectorAll(".xg.on-top").forEach(function(x){x.classList.remove("on-top");});w.classList.add("on-top");}
function mkWin(id,icon,title,body,opts){
  var w=el("div","xp-window xg");w.dataset.g=id;
  w.innerHTML='<div class="xp-titlebar"><span class="xp-title">'+ico(icon,16)+'<span>'+title+'</span></span><span class="xp-controls">'+
   '<button class="xp-min" aria-label="'+t("min")+'"></button><button class="xp-close" aria-label="'+t("close")+'"></button></span></div>';
  w.appendChild(body);if(opts&&opts.status){w.appendChild(opts.status);}
  D.body.appendChild(w);
  var r=w.getBoundingClientRect(),vw=innerWidth,vh=innerHeight,o=(cascade++%5)*34;
  w.style.left=Math.max(6,Math.min(vw-r.width-6,(vw-r.width)/2+o-90))+"px";
  w.style.top=Math.max(6,Math.min(vh-r.height-6,(vh-r.height)/2+o-40))+"px";
  var tb=w.querySelector(".xp-titlebar"),sx,sy,ox,oy,drag=false;
  tb.addEventListener("pointerdown",function(e){front(w);if(e.target.closest("button"))return;drag=true;sx=e.clientX;sy=e.clientY;ox=w.offsetLeft;oy=w.offsetTop;tb.setPointerCapture(e.pointerId);});
  tb.addEventListener("pointermove",function(e){if(!drag)return;w.style.left=Math.max(-r.width+60,Math.min(innerWidth-60,ox+e.clientX-sx))+"px";w.style.top=Math.max(0,Math.min(innerHeight-30,oy+e.clientY-sy))+"px";});
  tb.addEventListener("pointerup",function(){drag=false;});
  tb.addEventListener("dblclick",function(e){if(!e.target.closest("button"))w.classList.toggle("rolled");});
  w.addEventListener("pointerdown",function(){front(w);},true);
  w.querySelector(".xp-min").onclick=function(){w.classList.toggle("rolled");};
  w.querySelector(".xp-close").onclick=function(){close(id);};
  w.addEventListener("keydown",function(e){if(e.key==="Escape"&&!D.querySelector(".xg-scrim"))close(id);});
  front(w);open[id]=w;emit("open",id);return w;
}
function close(id){var w=open[id];if(!w)return;if(w._stop)w._stop();w.remove();delete open[id];emit("close",id);}

/* ---------- menús desplegables ---------- */
function mkBar(items){ /* items:[{label,icon?,toggle?,onToggle?,menu:[{label,checked?,fn}|"-"]}] */
  var bar=el("div","xg-bar");
  items.forEach(function(it){
    var b=el("button","",(it.icon?ico(it.icon):"")+it.label);b.type="button";bar.appendChild(b);
    if(it.toggle){b.setAttribute("aria-pressed","false");b.onclick=function(){var on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on);it.toggle(on);};return;}
    b.setAttribute("aria-haspopup","true");b.setAttribute("aria-expanded","false");
    b.onclick=function(e){e.stopPropagation();var was=b.getAttribute("aria-expanded")==="true";closeMenus();if(was)return;
      var ul=el("ul","xg-menu");ul.setAttribute("role","menu");
      it.menu().forEach(function(m){
        if(m==="-"){ul.appendChild(el("hr"));return;}
        var li=el("li","",m.label);li.tabIndex=0;li.setAttribute("role","menuitemradio");if(m.checked)li.setAttribute("aria-checked","true");
        li.onclick=function(ev){ev.stopPropagation();closeMenus();m.fn();};
        li.onkeydown=function(ev){if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();li.click();}};
        ul.appendChild(li);});
      ul.style.left=b.offsetLeft+"px";bar.appendChild(ul);b.setAttribute("aria-expanded","true");ul.firstChild&&ul.firstChild.focus();};
  });
  return bar;
}
function closeMenus(){D.querySelectorAll(".xg-menu").forEach(function(m){var b=m.parentNode.querySelector('[aria-expanded="true"]');if(b)b.setAttribute("aria-expanded","false");m.remove();});}
D.addEventListener("click",closeMenus);D.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenus();});

/* ---------- LED de 7 segmentos ---------- */
var SEG={a:[2.6,.6,8,2.2],f:[.6,2.6,2.2,8],b:[10.2,2.6,2.2,8],g:[2.6,10.4,8,2.2],e:[.6,12.6,2.2,8],c:[10.2,12.6,2.2,8],d:[2.6,20.2,8,2.2]};
var DIG=["abcdef","bc","abdeg","abcdg","bcfg","acdfg","acdefg","abc","abcdefg","abcdfg"];
function ledSVG(n){n=Math.max(-99,Math.min(999,n|0));var s=n<0?"-"+String(Math.abs(n)).padStart(2,"0"):String(n).padStart(3,"0"),h="";
  for(var i=0;i<3;i++){var c=s[i],on=c==="-"?"g":DIG[+c];h+='<g transform="translate('+(i*14)+' 0)">';
    for(var k in SEG){var r=SEG[k];h+='<rect class="'+(on.indexOf(k)>=0?"on":"off")+'" x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx=".8"/>';}h+="</g>";}
  return '<svg viewBox="0 0 41.6 23" aria-hidden="true">'+h+"</svg>";}
function mkLed(){var d=el("div","xg-led");d.set=function(n){d.innerHTML=ledSVG(n);d.setAttribute("aria-label",String(n));};d.set(0);return d;}
function mkStatus(a,b){var s=el("div","xp-status");s.innerHTML="<span></span><span></span>";s.a=s.children[0];s.b=s.children[1];s.a.textContent=a||"";s.b.textContent=b||"";return s;}

/* ---------- cuadro de mensaje ---------- */
function msg(o){
  return new Promise(function(res){
    var sc=el("div","xg-scrim"),w=el("div","xp-window xg-msg"),btns=o.buttons||[t("ok")];
    w.setAttribute("role","alertdialog");w.setAttribute("aria-modal","true");
    w.innerHTML='<div class="xp-titlebar"><span class="xp-title">'+(o.title||"Kixki")+'</span><span class="xp-controls"><button class="xp-close" aria-label="'+t("close")+'"></button></span></div>'+
     '<div class="xp-body">'+ico(o.icon||"info")+'<div class="xg-tx">'+(o.text||"")+'</div></div><div class="xg-bt"></div>';
    var bt=w.querySelector(".xg-bt");
    function done(i){D.removeEventListener("keydown",key,true);sc.remove();res(i);}
    btns.forEach(function(l,i){var b=el("button","xp-button"+(i===0?" default":""),l);b.type="button";b.onclick=function(){done(i);};bt.appendChild(b);});
    w.querySelector(".xp-close").onclick=function(){done(btns.length>1?btns.length-1:0);};
    function key(e){if(e.key==="Escape"){e.stopPropagation();done(btns.length>1?btns.length-1:0);}if(e.key==="Tab"){var f=w.querySelectorAll("button"),a=D.activeElement;if(e.shiftKey&&a===f[0]){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&a===f[f.length-1]){e.preventDefault();f[0].focus();}}}
    D.addEventListener("keydown",key,true);sc.appendChild(w);D.body.appendChild(sc);bt.firstChild.focus();
  });
}

/* =====================================================================
   BUSCALOBOS
   ===================================================================== */
var LV={easy:[9,9,10],mid:[16,16,40],hard:[16,30,99]};
function lobos(){
  if(open.lobos){front(open.lobos);open.lobos.classList.remove("rolled");return;}
  var lvl="easy",flagMode=false,S,tm,body=el("div","xp-body"),status=mkStatus("",""),top=el("div","xg-top xg-sunk"),
      cnt=mkLed(),clk=mkLed(),face=el("button","xg-face","");face.type="button";face.setAttribute("aria-label",t("newg"));
  var wrap=el("div","xg-frame"),grid=el("div","xg-grid xg-sunk");grid.setAttribute("role","grid");
  top.append(cnt,face,clk);wrap.append(top,grid);
  var bar=mkBar([{label:t("game"),menu:function(){return[{label:t("newg"),fn:reset},"-"].concat(Object.keys(LV).filter(function(k){return k!=="hard"||innerWidth>=700;}).map(function(k){return{label:t(k),checked:k===lvl,fn:function(){lvl=k;reset();}};}));}},
                 {label:t("flagMode"),icon:"bandera",toggle:function(on){flagMode=on;}}]);
  body.style.padding="6px";body.appendChild(wrap);
  var w=mkWin("lobos","lobo",t("lobos"),body,{status:status});w.insertBefore(bar,body);w._stop=function(){clearInterval(tm);};
  function face_(n){face.innerHTML=ico(n);}
  function bestTxt(){var b=best("lobos-"+lvl);return t("best")+" ("+t(lvl)+"): "+(b!=null?b+" s":"—");}
  function reset(){
    clearInterval(tm);var c=LV[lvl];S={h:c[0],w:c[1],m:c[2],mine:[],adj:[],o:[],f:[],started:false,over:false,opened:0,flags:0,time:0};
    var n=S.h*S.w;for(var i=0;i<n;i++){S.mine.push(0);S.adj.push(0);S.o.push(0);S.f.push(0);}
    grid.style.setProperty("--cols",S.w);grid.innerHTML="";grid.style.gridTemplateColumns="";
    for(i=0;i<n;i++){var b=el("button","xg-c");b.type="button";b.dataset.i=i;b.setAttribute("role","gridcell");b.setAttribute("aria-label",(i%S.w+1)+","+(Math.floor(i/S.w)+1));grid.appendChild(b);}
    cnt.set(S.m);clk.set(0);face_("sheep");status.a.textContent=t("hint");status.b.textContent=bestTxt();
    var r=w.getBoundingClientRect();if(r.right>innerWidth-4)w.style.left=Math.max(4,innerWidth-r.width-4)+"px";
  }
  function nb(i,fn){var x=i%S.w,y=(i/S.w)|0;for(var dy=-1;dy<=1;dy++)for(var dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;var a=x+dx,b=y+dy;if(a>=0&&b>=0&&a<S.w&&b<S.h)fn(b*S.w+a);}}
  function place(safe){var n=S.h*S.w,k=0;while(k<S.m){var r=(Math.random()*n)|0;if(S.mine[r]||Math.abs(r%S.w-safe%S.w)<2&&Math.abs(((r/S.w)|0)-((safe/S.w)|0))<2)continue;S.mine[r]=1;k++;}
    for(var i=0;i<n;i++)if(!S.mine[i])nb(i,function(j){if(S.mine[j])S.adj[i]++;});}
  function paint(i){var c=grid.children[i];c.className="xg-c"+(S.o[i]?" o":"")+(S.f[i]?" f":"");c.innerHTML="";
    if(S.f[i])c.innerHTML=ico("bandera");else if(S.o[i]&&S.mine[i])c.innerHTML=ico("lobo");else if(S.o[i]&&S.adj[i]){c.textContent=S.adj[i];c.classList.add("n"+S.adj[i]);}}
  function reveal(i){
    if(S.over||S.o[i]||S.f[i])return;
    if(!S.started){S.started=true;place(i);tm=setInterval(function(){S.time=Math.min(999,S.time+1);clk.set(S.time);},1000);emit("start","lobos",{level:lvl});}
    if(S.mine[i]){lose(i);return;}
    var q=[i];while(q.length){var k=q.pop();if(S.o[k]||S.f[k])continue;S.o[k]=1;S.opened++;paint(k);if(!S.adj[k])nb(k,function(j){if(!S.o[j]&&!S.f[j])q.push(j);});}
    emit("reveal","lobos");if(S.opened===S.w*S.h-S.m)win();
  }
  function flag(i){if(S.over||S.o[i])return;S.f[i]^=1;S.flags+=S.f[i]?1:-1;paint(i);cnt.set(S.m-S.flags);emit("flag","lobos",{on:!!S.f[i]});}
  function chord(i){if(!S.o[i]||!S.adj[i])return;var f=0;nb(i,function(j){f+=S.f[j];});if(f!==S.adj[i])return;nb(i,function(j){reveal(j);});}
  function end(){S.over=true;clearInterval(tm);}
  function lose(i){end();for(var k=0;k<S.mine.length;k++){if(S.mine[k]&&!S.f[k]){S.o[k]=1;paint(k);}if(!S.mine[k]&&S.f[k]){grid.children[k].classList.add("w");}}
    grid.children[i].classList.add("x");face_("lobo");emit("lose","lobos");
    msg({title:t("lobos"),icon:"lobo",text:"<b>"+t("lost")+"</b><br>"+t("lostT"),buttons:[t("again"),t("close")]}).then(function(r){r===0?reset():0;});}
  function win(){end();for(var k=0;k<S.mine.length;k++)if(S.mine[k]&&!S.f[k]){S.f[k]=1;paint(k);}cnt.set(0);face_("trofeo");
    var rec=best("lobos-"+lvl,S.time);status.b.textContent=bestTxt();emit("win","lobos",{time:S.time,level:lvl,record:rec===true});
    msg({title:t("lobos"),icon:"trofeo",text:"<b>"+t("won")+"</b><br>"+t("wonT",{t:S.time}),buttons:[t("again"),t("close")]}).then(function(r){r===0?reset():0;});}
  face.onclick=reset;
  var press=null,held=false;
  grid.addEventListener("click",function(e){var c=e.target.closest(".xg-c");if(!c)return;if(held){held=false;return;}var i=+c.dataset.i;if(flagMode&&!S.o[i])flag(i);else if(S.o[i])chord(i);else reveal(i);});
  grid.addEventListener("contextmenu",function(e){var c=e.target.closest(".xg-c");if(!c)return;e.preventDefault();flag(+c.dataset.i);});
  grid.addEventListener("pointerdown",function(e){var c=e.target.closest(".xg-c");if(!c||e.pointerType==="mouse")return;press=setTimeout(function(){held=true;flag(+c.dataset.i);if(navigator.vibrate)navigator.vibrate(18);},430);});
  ["pointerup","pointerleave","pointercancel","pointermove"].forEach(function(n){grid.addEventListener(n,function(){clearTimeout(press);});});
  grid.addEventListener("keydown",function(e){var c=e.target.closest(".xg-c");if(!c)return;var i=+c.dataset.i,d={ArrowRight:1,ArrowLeft:-1,ArrowDown:S.w,ArrowUp:-S.w}[e.key];
    if(d){var j=i+d;if(j>=0&&j<S.h*S.w&&!(Math.abs(d)===1&&((j/S.w)|0)!==((i/S.w)|0))){e.preventDefault();grid.children[j].focus();}}
    else if(e.key==="f"||e.key==="F"){e.preventDefault();flag(i);}});
  reset();emit("ready","lobos");
}

/* =====================================================================
   PAREJAS
   ===================================================================== */
var POOL=["sheep","tiendas","importante","control","utilidad","pantalla","privacidad","fotos","internet","dia","emulacion","decoracion","musica","teclados","favs","news","packs","search","home","moon","sun","trofeo"];
var PL={s6:[4,3],s8:[4,4],s12:[6,4]};
function parejas(){
  if(open.parejas){front(open.parejas);open.parejas.classList.remove("rolled");return;}
  var lvl="s8",S,tm,body=el("div","xp-body"),status=mkStatus("",""),top=el("div","xg-top xg-sunk"),
      mv=mkLed(),clk=mkLed(),face=el("button","xg-face","");face.type="button";face.setAttribute("aria-label",t("newg"));
  var deck=el("div","xg-deck xg-sunk"),wrap=el("div","xg-frame");
  face.innerHTML=ico("cartas");top.append(mv,face,clk);wrap.append(top,deck);body.style.padding="6px";body.appendChild(wrap);
  var bar=mkBar([{label:t("game"),menu:function(){return[{label:t("newg"),fn:reset},"-"].concat(Object.keys(PL).map(function(k){return{label:t(k),checked:k===lvl,fn:function(){lvl=k;reset();}};}));}}]);
  var w=mkWin("parejas","cartas",t("parejas"),body,{status:status});w.insertBefore(bar,body);w._stop=function(){clearInterval(tm);};
  function bestTxt(){var b=best("parejas-"+lvl);return t("best")+": "+(b!=null?b+" "+(EN?"moves":"mov."):"—");}
  function reset(){
    clearInterval(tm);var c=PL[lvl],n=c[0]*c[1],ic=POOL.slice().sort(function(){return Math.random()-.5;}).slice(0,n/2),cards=ic.concat(ic).sort(function(){return Math.random()-.5;});
    S={n:n,first:null,lock:false,moves:0,found:0,time:0,started:false};deck.style.setProperty("--cols",c[0]);deck.innerHTML="";
    cards.forEach(function(k,i){var b=el("button","xg-card",'<span class="bk">'+ico("sheep")+'</span><span class="fr">'+ico(k)+"</span>");b.type="button";b.dataset.k=k;b.setAttribute("aria-label",(EN?"Card ":"Carta ")+(i+1));deck.appendChild(b);});
    mv.set(0);clk.set(0);status.a.textContent=t("moves")+": 0";status.b.textContent=bestTxt();
    var r=w.getBoundingClientRect();if(r.right>innerWidth-4)w.style.left=Math.max(4,innerWidth-r.width-4)+"px";
  }
  deck.addEventListener("click",function(e){
    var c=e.target.closest(".xg-card");if(!c||S.lock||c.classList.contains("up"))return;
    if(!S.started){S.started=true;tm=setInterval(function(){S.time=Math.min(999,S.time+1);clk.set(S.time);},1000);emit("start","parejas");}
    c.classList.add("up");c.setAttribute("aria-label",c.dataset.k);emit("flip","parejas");
    if(!S.first){S.first=c;return;}
    var a=S.first;S.first=null;S.moves++;mv.set(S.moves);status.a.textContent=t("moves")+": "+S.moves;
    if(a.dataset.k===c.dataset.k){a.classList.add("ok");c.classList.add("ok");S.found++;emit("match","parejas");
      if(S.found===S.n/2){clearInterval(tm);var rec=best("parejas-"+lvl,S.moves);status.b.textContent=bestTxt();emit("win","parejas",{moves:S.moves,time:S.time,record:rec===true});
        setTimeout(function(){msg({title:t("parejas"),icon:"trofeo",text:"<b>"+t("won")+"</b><br>"+t("pwon",{m:S.moves,t:S.time}),buttons:[t("again"),t("close")]}).then(function(r){r===0?reset():0;});},450);}}
    else{S.lock=true;emit("miss","parejas");setTimeout(function(){a.classList.remove("up");c.classList.remove("up");S.lock=false;},800);}
  });
  face.onclick=reset;reset();emit("ready","parejas");
}

window.XPGames={open:function(n){({lobos:lobos,parejas:parejas}[n]||function(){})();},close:close,msg:msg,list:["lobos","parejas"]};
})();
