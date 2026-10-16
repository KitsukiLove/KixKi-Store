/* =========================================================
   KIXKI · parte 4 · cancha secreta de básquet
   - Al lanzar a Kixki 10 veces (arrastrarla y soltarla con impulso), aparece una pestañita
     pegada al borde derecho de la pantalla. Al tocarla se abre «basquet.exe».
   - En la cancha: arrastra a Kixki hacia atrás y suéltala (como una resortera) para lanzarla
     a la canasta. Lejos del aro valen 3 puntos, cerca 2, y +1 si no toca el aro.
   - Cada canasta: Kixki responde que Kitsuki pagará por esto.
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
 intro:[["Ejem. ¿De verdad vas a lanzarme a una canasta? 🏀","Ahem. Are you really going to throw me into a hoop? 🏀"]],
 /* al encestar: siempre dice que Kitsuki pagará */
 score:[
  ["¡Kitsuki pagará por esto! 😤","Kitsuki is going to pay for this! 😤"],
  ["¡Canasta! Y encima de pelota… ¡Kitsuki pagará por esto! 🏀","Basket! And as a ball, too… Kitsuki is going to pay for this! 🏀"],
  ["Me lanzas, anoto y la factura es para Kitsuki. ¡Kitsuki pagará por esto! 💸","You throw me, I score, and Kitsuki gets the bill. Kitsuki is going to pay for this! 💸"],
  ["¡Doble de lana y triple de rabia! Kitsuki pagará por esto. 🐑","Double the wool, triple the rage! Kitsuki is going to pay for this. 🐑"],
  ["Anoté yo, pero el castigo es para Kitsuki: ¡Kitsuki pagará por esto! 😈","I scored, but the punishment is Kitsuki's: Kitsuki is going to pay for this! 😈"]
 ],
 scoreMany:[
  ["¡{n} canastas! Una por cada vez que Kitsuki me dejó sin heno. ¡Kitsuki pagará por esto! 🔥","{n} baskets! One for every time Kitsuki left me without hay. Kitsuki is going to pay for this! 🔥"]
 ],
 miss:[
  ["Fallé… pero la culpa es de Kitsuki, que no puso un aro más grande. 😒","I missed… but it's Kitsuki's fault for not building a bigger hoop. 😒"],
  ["¡Auch! Eso también lo pagará Kitsuki. 🤕","Ouch! Kitsuki will pay for that too. 🤕"],
  ["Cuidado con la lana, que se despeina. 💢","Careful with the wool, it gets messy. 💢"],
  ["Tú apunta mejor y yo me quejo mejor. 😤","You aim better and I'll complain better. 😤"]
 ],
 closeSay:[
  ["¡Qué partido! Anoté {p} puntos y Kitsuki pagará por esto. 🏀","What a game! I scored {p} points and Kitsuki is going to pay for this. 🏀"]
 ]
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
const SPAWN_MIN=50,SPAWN_MAX=214,FAR_X=150;      /* a la izquierda de FAR_X valen 3 puntos */

let box=null,court=null,spr=null,sprJ=null,sprH=null,say=null,sayTx=null,dots=[],stats={},wrap=null;
let st=null,raf=0,scale=1,open=false;
let game={pts:0,state:"ready",x0:100,x:100,y:FLOOR-R-2,vx:0,vy:0,ang:0,spin:0,scored:false,touched:false,restT:0,fly:0,pull:null,said:0};
let sayT=0,tabEl=null;

function build(){
  if(box)return;
  document.body.insertAdjacentHTML("beforeend",
  `<div id="bask" class="ovl" hidden><div class="box" role="dialog" aria-modal="true" aria-labelledby="bk-t">
     <div class="bt"><span id="bk-t"></span><button type="button" class="x" data-x="bask" id="bk-x">✕</button></div>
     <div class="bk-hud"><span><small data-k="pts"></small><b id="bk-p">0</b></span><span><small data-k="best"></small><b id="bk-b">0</b></span><span><small data-k="hoops"></small><b id="bk-h">0</b></span></div>
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
  stats={p:$("#bk-p"),b:$("#bk-b"),h:$("#bk-h")};
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
  $("#bk-hint").textContent=L(TX.hint);
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
function stat(){stats.p.textContent=game.pts;stats.b.textContent=B.best;stats.h.textContent=B.hoops;}

/* ---------- dibujar ---------- */
function show(){
  spr.style.transform=`translate(${game.x-20}px,${game.y-15}px) rotate(${game.ang}rad)`;
  const air=game.state==="fly";
  if(sprJ)sprJ.style.display=air?"block":"none";
  if(sprH)sprH.style.display=air?"none":"block";
}
function newShot(){
  game.x0=Math.round(rnd(SPAWN_MIN,SPAWN_MAX));
  Object.assign(game,{state:"ready",x:game.x0,y:FLOOR-R-2,vx:0,vy:0,ang:0,spin:0,scored:false,touched:false,restT:0,fly:0,pull:null});
  hideDots();show();
}
function hideDots(){dots.forEach(d=>{d.hidden=true;});}
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
  game.state="fly";game.vx=v.vx;game.vy=v.vy;game.spin=v.vx>0?5:-5;game.fly=0;game.restT=0;
  B.shots++;save();
  beep(300,.08);
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
  const many=B.hoops>0&&B.hoops%5===0;
  const m=many?TX.scoreMany[0]:pick(TX.score,"sc");
  talk(many?[fmt(m[0],{n:B.hoops}),fmt(m[1],{n:B.hoops})]:m,5200);
  game.said=1;
  try{if(window.KXK)KXK.emit("hoop",{pts,n:B.hoops,clean});}catch(e){}
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
    if(game.restT>.7||game.fly>8){
      if(!game.scored&&!game.said&&Math.random()<.6)talk(pick(TX.miss,"ms"),3600);
      game.said=0;newShot();
    }
    show();
  }
}

/* ---------- abrir y cerrar ---------- */
function openWin(){
  build();labels();stat();
  box.hidden=false;open=true;
  fit();requestAnimationFrame(fit);
  game.pts=0;game.said=0;newShot();stat();
  if(!B.seen){B.seen=1;save();talk(TX.intro[0],4200);}
  st=null;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  try{$("#bk-x").focus({preventScroll:true});}catch(e){}
}
function closed(){
  open=false;cancelAnimationFrame(raf);clearTimeout(sayT);say.hidden=true;
  if(game.pts>0&&window.KXK&&KXK.ready){
    const m=TX.closeSay[0];
    try{KXK.say([fmt(m[0],{p:game.pts}),fmt(m[1],{p:game.pts})],{p:2,key:"bkclose",cd:0});}catch(e){}
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
  window.KXBK={state:B,unlock:()=>unlock(true),open:openWin,need:NEED};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 4:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
