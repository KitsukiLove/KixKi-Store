/* =========================================================
   KIXKI · parte 4 · cancha secreta de básquet
   - Al lanzar a Kixki 10 veces (arrastrarla y soltarla con impulso), aparece una pestañita
     pegada al borde derecho de la pantalla. Al tocarla se abre «basquet.exe».
   - En la cancha: arrastra a Kixki hacia atrás y suéltala (como una resortera) para lanzarla
     a la canasta. Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro.
   - (parte 4b) Al abrir la ventana Kixki SE CAE dentro (kixki.js → KXK.enter, con tropiezo, golpe y estrellitas; un clic o tecla salta la
     animación; con prefers-reduced-motion solo un fundido corto) y entonces empieza la partida: 5 tiros, con 6 puntos ganas.
   - Kixki está MUY enfadada con quien la lanza: sus frases (inicio, cada lanzamiento, fallo, encesta, racha, último tiro, victoria,
     derrota y despedida) viven en dialogs.js (KXD.TX.bk*, con variantes pícaras «P» y vengativas «V» según el ánimo). En «calladita» solo emojis.
   - Se apoya en kixki.js (KXK) y en kixki3.js, que avisa de cada lanzamiento con el evento «throw».
   - Memoria propia en localStorage («kixki-bk»). En la consola: KXBK.unlock() · KXBK.open() · KXBK.state
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const NEED=10;                                   /* lanzamientos necesarios para que aparezca la pestaña */

/* ---------- memoria ---------- */
const LSK="kixki-bk",D0={u:0,best:0,hoops:0,shots:0};
let B;try{B=Object.assign({},D0,JSON.parse(localStorage.getItem(LSK)||"{}"));}catch(e){B=Object.assign({},D0);}
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(B));}catch(e){}};

/* ---------- textos  [español, English] ---------- */
const lang=()=>window.KXI&&KXI.lang==="en"?1:0;
const L=p=>p[lang()];
const TX={
 tab:["Cancha secreta de básquet","Secret basketball court"],
 title:["basquet.exe","hoops.exe"],
 close:["Cerrar","Close"],
 pts:["Puntos","Points"],best:["Mejor","Best"],hoops:["Canastas","Baskets"],
 hint:["Arrastra a Kixki hacia atrás y suéltala para lanzarla. Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro.",
       "Drag Kixki backwards and let go to launch her. Far from the hoop is worth 3 points, close 2, and +1 if she doesn't touch the rim."],
 zone3:["3 pts","3 pts"],zone2:["2 pts","2 pts"],
 clean:["¡Limpia!","Clean!"],
 unlock:[["¡Diez lanzamientos! Ya me duele hasta la lana. 😵 …Mira el borde de la pantalla: salió una pestañita.","Ten throws! Even my wool hurts. 😵 …Look at the edge of the screen: a little tab popped up."]],
 shots:["Tiros","Shots"],
 hintMatch:[" Cada partida son 5 tiros: con 6 puntos ganas."," A game is 5 throws: score 6 points to win."]
};
const lastPick={};
function pick(list,key){
  let i=Math.floor(Math.random()*list.length);
  if(list.length>1&&lastPick[key]===i)i=(i+1)%list.length;
  lastPick[key]=i;return list[i];
}
const fmt=(s,v)=>s.replace(/\{(\w+)\}/g,(a,k)=>v[k]!=null?v[k]:a);

/* ---------- sonido (usa el de la tienda; respeta el interruptor de «Efectos») ---------- */
const beep=(f,d)=>{try{if(window.KXS)KXS.beep(f,d);}catch(e){}};

/* ---------- cancha (coordenadas lógicas 400 × 260) ---------- */
const W=400,H=260,FLOOR=236,R=11,RR=2.5,G=900;
const RIM={x1:330,x2:386,y:112};                 /* aro: borde delantero y trasero */
const BOARD={x:386,w:8,y1:52,y2:118};            /* tablero (pegado al borde derecho) */
const SHOTS=5,WIN_PTS=6;                       /* una partida: 5 tiros; con 6 puntos o más se gana */
const SPAWN_MIN=50,SPAWN_MAX=214,FAR_X=150;      /* a la izquierda de FAR_X valen 3 puntos */

let box=null,court=null,spr=null,sprJ=null,sprH=null,say=null,sayTx=null,dots=[],stats={},wrap=null;
let st=null,raf=0,scale=1,open=false;
let game={pts:0,shot:1,taken:0,streak:0,state:"ready",x0:100,x:100,y:FLOOR-R-2,vx:0,vy:0,ang:0,spin:0,scored:false,touched:false,restT:0,fly:0,pull:null,said:0};
let sayT=0,matchT=0,lastT=0,tabEl=null,skipOn=false;

function build(){
  if(box)return;
  document.body.insertAdjacentHTML("beforeend",
  `<div id="bask" class="ovl" hidden><div class="box" role="dialog" aria-modal="true" aria-labelledby="bk-t">
     <div class="bt"><span id="bk-t"></span><button type="button" class="x" data-x="bask" id="bk-x">✕</button></div>
     <div class="bk-hud"><span><small data-k="pts"></small><b id="bk-p">0</b></span><span><small data-k="best"></small><b id="bk-b">0</b></span><span><small data-k="hoops"></small><b id="bk-h">0</b></span><span><small data-k="shots"></small><b id="bk-s">1/5</b></span></div>
     <div class="bk-wrap" id="bk-wrap"><div class="bk-court" id="bk-court">
        <i class="bk-wall"></i><i class="bk-floor"></i>
        <i class="bk-zone z3"><span data-k="zone3"></span></i><i class="bk-zone z2"><span data-k="zone2"></span></i>
        <i class="bk-pole"></i><i class="bk-board"></i><i class="bk-sq"></i><i class="bk-rim"></i>
        <div class="bk-k" id="bk-k"></div>
        <svg class="bk-net" id="bk-net" viewBox="0 0 54 34" width="54" height="34" shape-rendering="crispEdges" aria-hidden="true"><path d="M1 0L9 33M10 0L16 33M19 0L22 33M27 0V33M35 0L32 33M44 0L38 33M53 0L45 33M3 11H51M6 22H48M9 33H45" fill="none"/></svg>
        <span class="bk-pop" id="bk-pop" aria-hidden="true"></span>
        <div class="bk-say" id="bk-say" hidden><b>Kixki</b><p id="bk-sx"></p></div>
     </div></div>
     <p class="hint" id="bk-hint"></p>
   </div></div>`);
  box=$("#bask");court=$("#bk-court");wrap=$("#bk-wrap");spr=$("#bk-k");say=$("#bk-say");sayTx=$("#bk-sx");
  stats={p:$("#bk-p"),b:$("#bk-b"),h:$("#bk-h"),s:$("#bk-s")};
  /* puntos de la trayectoria */
  for(let i=0;i<14;i++){const d=document.createElement("i");d.className="bk-dot";d.hidden=true;court.append(d);dots.push(d);}
  /* los dibujos de Kixki salen de la propia Kixki, así siempre son iguales (bufanda de tu color incluida) */
  const grab=n=>{const s=document.querySelector("#kixki .f-"+n);if(!s)return null;const c=s.cloneNode(true);c.setAttribute("class","bk-spr");c.removeAttribute("style");c.setAttribute("width","40");c.setAttribute("height","30");return c;};
  sprJ=grab("jump");sprH=grab("happy");
  if(sprJ)spr.append(sprJ);if(sprH)spr.append(sprH);
  court.addEventListener("pointerdown",down);court.addEventListener("pointermove",move);
  court.addEventListener("pointerup",up);court.addEventListener("pointercancel",up);
  addEventListener("resize",fit);
  new MutationObserver(()=>{if(box.hidden&&open)closed();}).observe(box,{attributes:true,attributeFilter:["hidden"]});
  labels();
}
function labels(){
  if(!box)return;
  $("#bk-t").textContent=L(TX.title);$("#bk-x").setAttribute("aria-label",L(TX.close));
  box.querySelectorAll("[data-k]").forEach(e=>{e.textContent=L(TX[e.dataset.k]);});
  $("#bk-hint").textContent=L(TX.hint)+L(TX.hintMatch);
}
function tabLabel(){if(tabEl){tabEl.setAttribute("aria-label",L(TX.tab));tabEl.title=L(TX.tab);}}
function fit(){
  if(!wrap||box.hidden)return;
  /* cabe en el ancho de la ventana y, si el móvil está en horizontal, también en el alto */
  const aw=wrap.parentElement.clientWidth-20-8,ah=Math.max(140,innerHeight-(innerHeight<480?140:230));
  scale=Math.min(aw/W,ah/H,1.2);
  wrap.style.width=Math.round(W*scale)+8+"px";wrap.style.margin="0 auto";
  court.style.transform=`scale(${scale})`;
  wrap.style.height=Math.round(H*scale)+"px";
}
function stat(){stats.p.textContent=game.pts;stats.b.textContent=B.best;stats.h.textContent=B.hoops;stats.s.textContent=Math.min(game.shot,SHOTS)+"/"+SHOTS;}

/* ---------- dibujar ---------- */
function show(){
  spr.style.transform=`translate(${game.x-20}px,${game.y-15}px) rotate(${game.ang}rad)`;
  const air=game.state==="fly",hid=game.state==="enter";     /* mientras cae la Kixki de verdad, la de la cancha espera */
  if(sprJ)sprJ.style.display=!hid&&air?"block":"none";
  if(sprH)sprH.style.display=!hid&&!air?"block":"none";
}
function newShot(keepX){
  if(!keepX)game.x0=Math.round(rnd(SPAWN_MIN,SPAWN_MAX));
  game.shot=Math.min(game.taken+1,SHOTS);
  Object.assign(game,{state:"ready",x:game.x0,y:FLOOR-R-2,vx:0,vy:0,ang:0,spin:0,scored:false,touched:false,restT:0,fly:0,pull:null});
  hideDots();show();
}
function hideDots(){dots.forEach(d=>{d.hidden=true;});}
/* ---- lo que dice Kixki (enfadada): fase → frase de dialogs.js, con ánimo (P pícara / V vengativa) y sin repetir; en «calladita», solo emoji ---- */
const cap=w=>w[0].toUpperCase()+w.slice(1),lastTxt={};
const quiet=()=>!!(window.KXK&&KXK.quiet);
function phrase(phase,vars){
  if(quiet()&&KXK.emoji)return KXK.emoji("bk"+cap(phase));
  const T=(window.KXD&&KXD.TX)||{},k="bk"+cap(phase),md=window.KXK3&&KXK3.mood?KXK3.mood():0;
  let list=T[k]||[];
  if(md>=2&&T[k+"V"]&&Math.random()<.55)list=T[k+"V"];else if(md>=1&&T[k+"P"]&&Math.random()<.5)list=T[k+"P"];
  if(!list.length)return null;
  /* nunca la misma frase dos veces seguidas en una fase (la memoria de KXK.pick es de 30 y las listas son cortas) */
  const free=list.filter(x=>x[0]!==lastTxt[phase]),pool=free.length?free:list;
  const m=window.KXK&&KXK.pick?KXK.pick(pool,"bk-"+phase):pick(pool,"bk-"+phase),v=vars||{};
  lastTxt[phase]=m[0];
  return [fmt(m[0],v),fmt(m[1],v)];
}
function bkSay(phase,vars,ms){const p=phrase(phase,vars);if(p)talk(p,ms);}
function talk(pair,ms){
  sayTx.textContent=L(pair);say.hidden=false;
  clearTimeout(sayT);sayT=setTimeout(()=>{say.hidden=true;},ms||4300);
}
function pop(txt){
  const p=$("#bk-pop");p.textContent=txt;p.classList.remove("on");void p.offsetWidth;p.classList.add("on");
}

/* ---------- entrada: resortera ---------- */
const MAXPULL=125,POWER=5.6;
function pt(e){const r=court.getBoundingClientRect();return {x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale};}
function velOf(p){
  let dx=game.x0-p.x,dy=(FLOOR-R-2)-p.y;const m=Math.hypot(dx,dy);
  if(m>MAXPULL){dx*=MAXPULL/m;dy*=MAXPULL/m;}
  return {vx:dx*POWER,vy:dy*POWER,m:Math.min(m,MAXPULL)};
}
function down(e){
  if(game.state!=="ready"||e.button)return;
  try{court.setPointerCapture(e.pointerId);}catch(_){}
  game.pull={id:e.pointerId};move(e);e.preventDefault();
}
function move(e){
  if(!game.pull||e.pointerId!==game.pull.id)return;
  const v=velOf(pt(e));game.pull.v=v;
  game.ang=clamp(-v.vy/900,-.5,.5);                 /* se inclina un poco al estirarse */
  /* trayectoria: los primeros ~1 s de vuelo */
  dots.forEach((d,i)=>{
    const t=(i+1)*.075,x=game.x0+v.vx*t,y=(FLOOR-R-2)+v.vy*t+.5*G*t*t;
    if(v.m<12||y>FLOOR||x>W){d.hidden=true;return;}
    d.hidden=false;d.style.transform=`translate(${Math.round(x-2)}px,${Math.round(y-2)}px)`;
  });
  show();
}
function up(e){
  const p=game.pull;if(!p||e.pointerId!==p.id)return;game.pull=null;hideDots();
  const v=p.v;
  if(!v||v.m<14){game.ang=0;show();return;}                  /* un tironcito pequeño no lanza */
  game.vx=v.vx;game.vy=v.vy;game.spin=v.vx>0?5:-5;
  beginFlight();
  beep(300,.08);
}
/* un tiro sale (de verdad o simulado): cuenta, y Kixki protesta en el aire */
function beginFlight(){
  game.state="fly";game.fly=0;game.restT=0;game.scored=false;game.taken++;B.shots++;save();stat();
  clearTimeout(lastT);bkSay("throw",null,2800);
}

/* ---------- física ---------- */
function stepPhys(h){
  const prevY=game.y;
  game.vy+=G*h;game.x+=game.vx*h;game.y+=game.vy*h;game.ang+=game.spin*h;
  /* paredes y techo */
  if(game.x<R){game.x=R;game.vx=Math.abs(game.vx)*.6;}
  if(game.x>W-R){game.x=W-R;game.vx=-Math.abs(game.vx)*.6;}
  if(game.y<R){game.y=R;game.vy=Math.abs(game.vy)*.5;}
  /* tablero */
  if(game.x+R>BOARD.x&&game.y>BOARD.y1-R*.4&&game.y<BOARD.y2){
    game.x=BOARD.x-R;game.vx=-Math.abs(game.vx)*.55;game.touched=true;beep(220,.05);
  }
  /* borde delantero del aro (un punto pequeño) */
  const dx=game.x-RIM.x1,dy=game.y-RIM.y,d=Math.hypot(dx,dy),mn=R+RR;
  if(d<mn&&d>.001){
    const nx=dx/d,ny=dy/d,vn=game.vx*nx+game.vy*ny;
    game.x=RIM.x1+nx*mn;game.y=RIM.y+ny*mn;
    if(vn<0){game.vx-=1.55*vn*nx;game.vy-=1.55*vn*ny;game.spin*=.7;}
    if(!game.touched||vn<-80)beep(260,.05);
    game.touched=true;
  }
  /* ¡canasta! baja cruzando el aro por dentro */
  if(!game.scored&&game.vy>0&&prevY<RIM.y&&game.y>=RIM.y&&game.x>RIM.x1+3&&game.x<RIM.x2){scored();}
  /* la red frena un poco */
  if(game.scored&&game.y>RIM.y&&game.y<RIM.y+34&&game.x>RIM.x1&&game.x<RIM.x2){game.vx*=1-4*h;game.vy*=1-2.2*h;}
  /* suelo */
  const fy=FLOOR-R-2;
  if(game.y>fy){
    game.y=fy;
    if(game.vy>140){game.vy=-game.vy*.48;game.vx*=.82;game.spin*=.6;beep(150,.05);}
    else{game.vy=0;game.vx*=Math.max(0,1-5*h);game.spin*=Math.max(0,1-6*h);}
  }
}
function scored(){
  game.scored=true;
  const far=game.x0<FAR_X,clean=!game.touched,pts=(far?3:2)+(clean?1:0);
  game.pts+=pts;B.hoops++;
  if(game.pts>B.best)B.best=game.pts;
  save();stat();
  pop("+"+pts+(clean?" "+L(TX.clean):""));
  $("#bk-net").classList.remove("sw");void $("#bk-net").offsetWidth;$("#bk-net").classList.add("sw");
  beep(660,.09);setTimeout(()=>beep(880,.12),110);
  /* Kixki responde: siempre que Kitsuki pagará */
  game.streak++;
  if(game.streak>=2)bkSay("streak",{n:game.streak},4600);else bkSay("score",null,4600);
  try{if(window.KXK)KXK.emit("hoop",{pts,n:B.hoops,clean,streak:game.streak});}catch(e){}
}
function loop(t){
  if(!open)return;
  raf=requestAnimationFrame(loop);
  if(document.hidden){st=t;return;}
  const dt=Math.min(.034,((t-(st||t))/1000)||0);st=t;
  if(game.state==="fly"){
    const n=3,h=dt/n;
    for(let i=0;i<n;i++)stepPhys(h);
    game.fly+=dt;
    const resting=game.y>=FLOOR-R-2-.5&&Math.abs(game.vx)<12&&Math.abs(game.vy)<20;
    game.restT=resting?game.restT+dt:0;
    if(game.restT>.7||game.fly>8)endShot();
    show();
  }
}

/* ---------- partida: 5 tiros ---------- */
function endShot(){
  if(!game.scored){game.streak=0;bkSay("miss",null,3600);}
  if(game.taken>=SHOTS){endMatch();return;}
  newShot();
  /* el último tiro: avisa un momento después, para no pisar la frase del fallo o la canasta */
  if(game.taken===SHOTS-1){clearTimeout(lastT);lastT=setTimeout(()=>{if(open&&game.state==="ready")bkSay("last",null,3600);},1700);}
}
function endMatch(){
  game.state="over";hideDots();show();
  const win=game.pts>=WIN_PTS;
  B.matches=(B.matches|0)+1;if(win)B.wins=(B.wins|0)+1;save();
  bkSay(win?"win":"lose",{p:game.pts},4600);
  try{if(window.KXK)KXK.emit("match",{pts:game.pts,win});}catch(e){}
  clearTimeout(matchT);matchT=setTimeout(()=>{if(open)startMatch(true);},5000);
}
function startMatch(talkIt){
  Object.assign(game,{pts:0,taken:0,streak:0,shot:1});
  newShot();stat();
  if(talkIt)bkSay("start",null,4200);
}

/* ---------- entrada: Kixki se cae dentro de la ventana (kixki.js → KXK.enter) ---------- */
/* dónde caen sus pies, en pantalla: el suelo de la cancha bajo el punto de salida del tiro (se calcula en vivo) */
function feet(){
  if(!court||box.hidden)return null;
  const r=court.getBoundingClientRect();
  return {x:r.left+game.x0*scale,y:r.top+(game.y+15)*scale};
}
/* un clic o una tecla saltan la animación (Esc cierra la ventana, Tab y los modificadores no cuentan; la ✕ tampoco) */
function skipEv(e){
  if(game.state!=="enter"||!window.KXK)return;
  if(e.type==="keydown"&&/^(Escape|Tab|Shift|Control|Alt|Meta|CapsLock)$/.test(e.key))return;
  if(e.type==="pointerdown"&&e.target&&e.target.closest&&e.target.closest("#bk-x"))return;
  if(e.type==="pointerdown"){e.stopPropagation();e.preventDefault();}      /* el clic que salta la animación no debe agarrar a Kixki ni lanzar un tiro */
  KXK.skipEnter();
}
function hookSkip(on){
  if(on===skipOn)return;skipOn=on;
  const f=on?addEventListener:removeEventListener;
  f.call(window,"pointerdown",skipEv,true);f.call(window,"keydown",skipEv,true);
}
function poof(){
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  for(let k=0;k<5;k++){const d=document.createElement("i");d.className="bk-poof";
    d.style.cssText=`left:${Math.round(game.x0+(k-2)*7)}px;top:${FLOOR-18}px;--px:${(k-2)*9}px`;court.append(d);setTimeout(()=>d.remove(),560);}
}
function reveal(){
  hookSkip(false);
  if(!open||game.state!=="enter")return;
  game.state="ready";show();
  spr.classList.remove("in");void spr.offsetWidth;spr.classList.add("in");poof();
  bkSay("start",null,4400);
}

/* ---------- abrir y cerrar ---------- */
function openWin(){
  build();labels();
  box.hidden=false;open=true;
  fit();requestAnimationFrame(fit);
  clearTimeout(matchT);clearTimeout(lastT);
  Object.assign(game,{pts:0,taken:0,streak:0,shot:1});
  newShot();stat();
  st=null;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  try{$("#bk-x").focus({preventScroll:true});}catch(e){}
  /* la Kixki de la página se sube a la ventana, se tropieza y cae dentro; solo entonces empieza el juego */
  game.state="enter";show();
  if(window.KXK&&KXK.enter){
    hookSkip(true);
    KXK.enter("bask",{fall:true,hide:true,target:feet}).then(()=>{if(open&&game.state==="enter")reveal();}).catch(()=>{if(open&&game.state==="enter")reveal();});
  }else reveal();
}
function closed(){
  open=false;cancelAnimationFrame(raf);clearTimeout(sayT);clearTimeout(matchT);clearTimeout(lastT);say.hidden=true;
  hookSkip(false);
  const played=game.taken>0||game.pts>0,pts=game.pts;
  if(window.KXK&&KXK.cancelEnter)KXK.cancelEnter();         /* cerraron a medias: sin estados colgados */
  game.state="idle";hideDots();
  if(played&&window.KXK&&KXK.ready){
    const m=phrase("end",{p:pts});
    /* un momento después: al cerrar, Kixki vuelve a su sitio (relocate) y eso corta cualquier globo; así la despedida sale al llegar */
    if(m)setTimeout(()=>{try{KXK.say(m,{p:2,key:"bkclose",cd:0,emo:"bkEnd"});}catch(e){}},160);
  }
}
/* Esc y tocar fuera de la ventana la cierran: ya lo hace app.js con la clase «ovl» */

/* ---------- la pestañita del borde ---------- */
function makeTab(anim){
  if(tabEl)return;
  tabEl=document.createElement("button");tabEl.type="button";tabEl.id="bk-tab";
  tabEl.innerHTML=`<svg viewBox="0 0 10 10" width="20" height="20" shape-rendering="crispEdges" aria-hidden="true"><path fill="#c94a12" d="M3 0h4v1h2v1h1v6H9v1H7v1H3V9H1V8H0V2h1V1h2z"/><path fill="#ff8a2e" d="M3 1h4v1h1v1H7v1h2v2H7v1h1v1H7v1H3V8H2V7h1V6H1V4h2V3H2V2h1z"/><path fill="#7a2b00" d="M4 1h1v8H4zM0 4h10v1H0z" opacity=".55"/></svg>`;
  tabEl.addEventListener("click",()=>{openWin();});
  document.body.append(tabEl);tabLabel();
  if(anim)tabEl.classList.add("new");
  setTimeout(()=>tabEl&&tabEl.classList.remove("new"),3600);
}
function unlock(first){
  if(!B.u){B.u=1;save();}
  makeTab(!!first);
  if(first&&window.KXK){
    setTimeout(()=>{try{KXK.say(TX.unlock[0],{p:3,key:"bkunlock",cd:0});}catch(e){}},2200);
  }
}

/* ---------- arranque ---------- */
function boot(){
  if(window.KXBK)return;
  if(B.u)makeTab(false);
  addEventListener("kixki-evt",e=>{
    const d=e.detail||{};
    if(d.t==="throw"&&!B.u&&(d.n|0)>=NEED)unlock(true);
  });
  if(window.KXI&&!KXI._bk){KXI._bk=1;const o=KXI.set;KXI.set=function(l){o.call(KXI,l);labels();tabLabel();};}
  window.KXBK={state:B,unlock:()=>unlock(true),open:openWin,need:NEED,
    /* para las pruebas automáticas: estado de la partida y un tiro simulado («score» o «miss») que pasa por el mismo código que uno real */
    match:()=>({pts:game.pts,shot:game.shot,taken:game.taken,streak:game.streak,state:game.state,open}),
    sim:kind=>{if(!open||game.state!=="ready")return false;beginFlight();if(kind==="score")setTimeout(()=>{if(open&&game.state==="fly"&&!game.scored)scored();},450);game.y=FLOOR-R-2;game.vx=0;game.vy=0;return true;},
    shots:SHOTS,win:WIN_PTS,phrase};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 4:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
