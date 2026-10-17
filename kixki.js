/* =========================================================
   KIXKI · la oveja guía  (parte 1)
   - Vive en la página y se pasea por: la barra de búsqueda, las carpetas del escritorio (PC),
     la fila de carpetas y la barra inferior (móvil), las ventanas abiertas (PC) y el Salta Vallas.
   - Habla (español / English) con globos retro: consejos, ánimos y reacciones a lo que haces.
   - Guarda su memoria en localStorage ("kixki-k"). Se apaga desde el menú Kixki / Más.
   - Todas sus frases pasan por un gestor único (prioridad, categorías, caducidad, enfriamiento, presupuesto):
     ver la sección «gestor de diálogos» más abajo. Depurar: KXK.debug = true · KXK.timeline().
   - (parte 4b) «Kixki: no» = se DUERME (se acuesta donde no estorba, sin hablar ni pasear; si la tocan se despierta un instante con 😠/😴).
     Modo «calladita» = SOLO EMOJIS: ningún globo lleva texto salvo que la toquen o le pidan ayuda (opción words:true de say()).
     enter(id,{fall}) = la coreografía de entrar en la ventana de un minijuego (subir al borde, o caerse dentro en el básquet).
   - Para la parte 2 (logros): avisa de todo con el evento  "kixki-evt"  → e.detail = {t:"folder"|"search"|…}
   Depende de: app.js (avisa con "kixki-ready" y "kixki-game"), i18n.js y music.js.
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),now=()=>Date.now();
const wait=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- memoria ---------- */
const LSK="kixki-k",S0={v:1,on:true,visits:0,first:0,last:0,opened:[],fc:{},allDone:0,mode:"normal"};
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
const KXD=window.KXD||{};
const {T,FOLD,GREET,TOUR_PC,TOUR_MOB,MIC,FAST}=KXD;   /* los textos viven en dialogs.js */
const EMO=KXD.EMO||{ui:[["🐑","🐑"]]};                /* (parte 4b) respuestas de solo emoji por situación */
const UI={
 aria:["Kixki, tu guía. Tócala para que te hable.","Kixki, your guide. Tap her and she'll talk to you."],
 close:["Cerrar","Close"],
 tip:["Pedirle un consejo a Kixki","Ask Kixki for a tip"],
 onT:["Kixki: sí","Kixki: on"],offT:["Kixki: durmiendo 💤","Kixki: sleeping 💤"],
 zzAria:["Kixki está durmiendo. Tócala y se despierta un momento.","Kixki is sleeping. Tap her and she wakes up for a moment."],
 zzSr:["Kixki está durmiendo","Kixki is sleeping"],
 modeT:{chat:["Kixki: charlatana 🗣️","Kixki: chatty 🗣️"],normal:["Kixki: normal 🐑","Kixki: normal 🐑"],quiet:["Kixki: calladita 🤐","Kixki: quiet 🤐"]}
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
  /* variables de contexto: {hora} {app} {carpeta} valen en cualquier frase (se calculan solo si la frase las usa) */
  const pad2=n=>String(n).padStart(2,"0");
  function randApp(){
    const hs=$$("#app .cat:not(#favs):not(#news):not(#packs) .app h3");if(!hs.length)return null;
    const h=hs[Math.floor(Math.random()*hs.length)],c=h.closest(".cat"),t=c&&c.querySelector(".tbt");
    return {app:h.textContent.trim(),carpeta:t?t.textContent.replace(/\.exe$/i,"").trim():""};
  }
  function ctxVars(raw,v){
    const o=Object.assign({},v);
    if(o.a!=null&&o.app==null)o.app=o.a;
    if(/\{hora\}/.test(raw)&&o.hora==null){const d=new Date();o.hora=pad2(d.getHours())+":"+pad2(d.getMinutes());}
    if(/\{(app|carpeta)\}/.test(raw)&&(o.app==null||o.carpeta==null)){
      const r=randApp(),en=lang()==="en";
      if(o.app==null)o.app=r?r.app:en?"an app":"una app";
      if(o.carpeta==null)o.carpeta=r&&r.carpeta?r.carpeta:en?"some folder":"alguna carpeta";
    }
    return o;
  }
  const emit=(t,d)=>dispatchEvent(new CustomEvent("kixki-evt",{detail:Object.assign({t},d)}));

  /* ---------- DOM ---------- */
  const el=document.createElement("div");
  el.id="kixki";el.dataset.f="idle";el.dataset.m="idle";el.classList.add("kk-off");
  el.innerHTML=`<div class="kk-sh"></div><button type="button" class="kk-body"><span class="kk-flip">${Object.keys(FR).map(k=>svg(FR[k],k)).join("")}</span><span class="kk-zz" aria-hidden="true">z<i style="font-style:normal">Z</i></span><span class="kk-stars" aria-hidden="true"><i>★</i><i>✦</i><i>★</i></span></button>`+
   `<div class="kk-bub" hidden><span class="kk-nm">Kixki</span><button type="button" class="kk-x">✕</button><p class="kk-tx"><span class="g" aria-hidden="true"></span><span class="v" aria-hidden="true"></span></p>`+
   `<svg class="kk-tl" viewBox="0 0 8 4" width="24" height="12" shape-rendering="crispEdges" aria-hidden="true"><path class="o" d="M0 0h8v1H0zM1 1h6v1H1zM2 2h4v1H2zM3 3h2v1H3z"/><path class="i" d="M1 0h6v1H1zM2 1h4v1H2zM3 2h2v1H3z"/></svg></div>`+
   `<div class="kk-sr" role="status" aria-live="polite"></div>`;
  document.body.append(el);
  const body=$(".kk-body",el),bub=$(".kk-bub",el),gh=$(".g",bub),vi=$(".v",bub),sr=$(".kk-sr",el),bx=$(".kk-x",el);

  /* ---------- estado ---------- */
  const K={x:0,y:-80,dir:1,mode:"idle",frame:"idle",stage:null,talking:false,off:true,ready:false,tour:null,hl:null,dis:0,game:false,pend:null,snooze:false,poking:false,enter:null};
  let cur=null,raf=0,mv=null,brainT=0,lastAct=now(),nextChat=now()+rnd(16000,26000);
  const Q=[],cd={};
  /* (parte 2) memoria de no repetir: las últimas 30 frases, guardadas en localStorage (antes 14 y se perdían al recargar) */
  const RECK="kixki-k-rec",RECN=30;
  const recent=(()=>{try{const a=JSON.parse(localStorage.getItem(RECK)||"[]");return Array.isArray(a)?a.filter(x=>typeof x==="string").slice(-RECN):[];}catch(e){return[];}})();
  let recT=0;const saveRec=()=>{clearTimeout(recT);recT=setTimeout(()=>{try{localStorage.setItem(RECK,JSON.stringify(recent));}catch(e){}},400);};
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
  const PLAT={},free=id=>id==="dock"||id==="game"||id==="bask"||!!PLAT[id];
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
    /* ventanas de minijuego: borde superior de la caja (Salta Vallas «game» y cancha de básquet «bask») */
    if(id==="game"||id==="bask"){const sel=id==="game"?"#game":"#bask",g=$(sel);if(!g||g.hidden)return null;const bx=sel+" .box",r=R(bx);if(!r)return null;const a=r.left+34;return {a,b:Math.max(a,r.right-34),y:()=>((R(bx)||r).top-3)};}
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
  function walk(tx,sp){
    return new Promise(res=>{
      let g=geo(K.stage);if(!g||RM()){res();return;}
      tx=clamp(tx,g.a,g.b);if(Math.abs(tx-K.x)<4){res();return;}
      stopMove();setMode("walk");face(tx>K.x?1:-1);
      let last=performance.now(),acc=0,st=0;const SP=sp||36;mv={res};
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
  function land(id,x,g){K.stage=id;K.x=x;K.y=g.y(x);if(K.snooze){setMode("sleep");frame("sleep");}else{setMode("idle");frame("idle");}place();}
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

  /* ---------- gestor de diálogos ----------
     say(mensaje,{p,key,cd,mood,hl,vars, cat,ctx,ttl,replace,instant,force}) → promesa: true si se dijo entera, false si no.
     - cat: «ev» eventos físicos (agarrar, lanzar, caer, ventana) · «sp» charla espontánea (con presupuesto por minuto)
            · «amb» reacciones de fondo (p1) · «ui» respuestas a lo que haces (p2-p3).
     - Un «ev» REEMPLAZA el globo actual en vez de esperar su turno, se escribe de golpe y, si no puede salir en
       600 ms (ttl), se descarta: una frase vieja es peor que ninguna.
     - Las demás con p ≥ 2 hacen cola (máx. 4) y también caducan (12 s). Sale primero la de más prioridad.
     - El enfriamiento (key + cd) solo se gasta cuando la frase se dice de verdad.
     - interrupt(ctx) corta el globo y limpia la cola de ese contexto (sin ctx: toda la cola).
     - KXK.debug = true → línea de tiempo de cada frase en la consola; KXK.timeline() la devuelve. */
  const DLG={budget:5,win:60000,sp:[],gap:{sp:15000,mic:1400},last:{}};
  /* (parte 2) modo de charla: cambia el presupuesto de espontáneas, la pausa entre ellas y cada cuánto charla sola */
  const MODES={
   chat:{budget:9,gap:8000,chat:.55,amb:true,words:true},
   normal:{budget:5,gap:15000,chat:1,amb:true,words:true},
   quiet:{budget:1,gap:45000,chat:2.5,amb:false,words:false}
  };
  const MD=()=>MODES[S.mode]||MODES.normal;
  function applyMode(){const m=MD();DLG.budget=m.budget;DLG.gap.sp=m.gap;DLG.sp=[];}
  applyMode();
  /* (parte 2) no hablar mientras escribes, arrastras una ventana o juegas */
  const U={typeAt:0,win:false};
  const typing=()=>now()-U.typeAt<1500;
  const busy=()=>typing()||U.win||K.game;
  /* ¿esta frase debe callarse ahora? (los eventos físicos y las respuestas directas con p ≥ 3 nunca) */
  function blocked(m){
    if(m.always)return false;
    const soft=m.cat==="sp"||m.cat==="amb"||m.cat==="mic"||m.opt||(m.cat==="ui"&&m.p<3);
    if(!soft)return false;
    if(busy())return true;
    const md=MD();
    if(!md.amb&&(m.cat==="amb"||m.opt))return true;
    return false;
  }
  const idle0=()=>{if(cur&&(cur.cat==="sp"||cur.cat==="amb"||cur.cat==="mic"||cur.opt)&&!cur.always)done(cur,"busy");};
  addEventListener("keydown",e=>{
    const t=e.target;if(!t||!t.closest||e.ctrlKey||e.metaKey||e.altKey||e.key==="Shift"||e.key==="Escape")return;
    if(t.closest("input,textarea,[contenteditable=true]")){U.typeAt=now();idle0();}
  },true);
  addEventListener("pointerdown",e=>{
    if(!e.target||!e.target.closest)return;
    if(!e.target.closest("input,textarea"))U.typeAt=0;            /* un clic fuera del campo = ya no estás escribiendo */
    if(!isPC()||e.button)return;
    const tb=e.target.closest(".cat .tb");if(tb&&!e.target.closest(".wb")){U.win=true;idle0();}
  },true);
  const winUp=()=>{U.win=false;};
  addEventListener("pointerup",winUp,true);addEventListener("pointercancel",winUp,true);
  const DBG={on:false},LOG=[];let mid=0;
  try{DBG.on=/[?&]kxdebug(=1)?(&|$)/.test(location.search)||localStorage.getItem("kixki-dbg")==="1";}catch(e){}
  function lg(ev,m,x){
    const r={t:Math.round(performance.now()),ev};
    if(m){r.id=m.id;r.cat=m.cat;r.p=m.p;if(m.key)r.key=m.key;r.txt=m.text.slice(0,28);}
    if(x!==undefined)r.x=x;
    LOG.push(r);if(LOG.length>400)LOG.shift();
    if(DBG.on)try{console.log("[kixki] "+r.t+"ms "+ev+" #"+(r.id||"-")+" "+(r.cat||"")+" "+(r.key||"")+" "+(x!==undefined?x:"")+" "+(r.txt||""));}catch(e){}
  }
  /* tamaño del globo: se mide UNA vez por frase (no en cada fotograma); el texto fantasma reserva el sitio entero */
  let bw=0,bh=0;const lb={l:null,t:null,b:null};
  function measure(){bw=bub.offsetWidth;bh=bub.offsetHeight;lb.l=lb.t=lb.b=null;}
  addEventListener("resize",()=>{bw=0;});
  function layoutBubble(){
    if(bub.hidden)return;
    if(!bw)measure();
    const hx=K.x+K.dir*16,left=clamp(hx-bw/2,8,Math.max(8,innerWidth-8-bw));
    const l=Math.round(left-K.x),t=Math.round(clamp(hx-left,16,bw-16)),b=K.y-45-14-bh<6;
    if(l!==lb.l){lb.l=l;bub.style.left=l+"px";}
    if(t!==lb.t){lb.t=t;bub.style.setProperty("--tx",t+"px");}
    if(b!==lb.b){lb.b=b;bub.classList.toggle("below",b);}
  }
  const PUN=/[.,!?…:;]/;
  const beep=f=>{if(window.KXS)try{KXS.beep(f,.03);}catch(e){}};
  function begin(m){
    cur=m;K.talking=true;stopMove();clearTimeout(m.tq);
    if(m.key)cd[m.key]=now()+m.cdMs;                 /* el enfriamiento se gasta aquí, no antes */
    if(m.cat==="sp")DLG.sp.push(now());
    DLG.last[m.cat]=now();
    if(K.mode==="sleep")frame("idle");
    setMode("talk");
    const g=geo(K.stage);if(g&&g.face)face(g.face);
    if(m.hl){K.hl=m.hl;m.hl.classList.add("kk-pt");}
    bub.classList.toggle("mic",!!m.micro);
    gh.textContent=m.text;vi.textContent="";bub.hidden=false;
    if(m.sr)sr.textContent=m.text;
    measure();layoutBubble();
    lg("begin",m,Math.round(performance.now()-m.t0));
    if(m.onStart)try{m.onStart();}catch(e){}
    const cs=Array.from(m.text),n=cs.length,hurry=m.instant||Q.length>0;
    m.cs=cs;m.i=0;
    if(RM()||!n){m.i=n;vi.textContent=m.text;typed(m);return;}
    if(m.instant){                                    /* con prisa: la frase entera de golpe, con un parpadeo de boca */
      m.i=n;vi.textContent=m.text;frame(m.mood==="happy"?"happy":"talk");beep(620);
      m.t=setTimeout(()=>typed(m),180);return;
    }
    const spd=hurry?8:14;
    const step=()=>{
      if(cur!==m)return;
      if(m.i>=n){vi.textContent=m.text;typed(m);return;}
      const ch=cs[m.i++];vi.textContent=cs.slice(0,m.i).join("");
      if(ch!==" "){frame(m.i%6<3?"talk":(m.mood==="happy"?"happy":"idle"));if(m.i%3===0)beep(500+((m.i*37)%240));}
      /* pausa corta solo al final de una oración o cláusula: nunca por cada signo repetido («…», «?!») */
      let w=spd;
      if(PUN.test(ch)&&cs[m.i]===" ")w=/[.!?…]/.test(ch)?(hurry?40:90):(hurry?20:50);
      m.t=setTimeout(step,w);
    };
    step();
  }
  /* mostrar la frase entera ya (clic en el globo mientras escribe) */
  function finishTyping(m){
    if(cur!==m||!m.cs||m.i>=m.cs.length)return false;
    clearTimeout(m.t);m.i=m.cs.length;vi.textContent=m.text;typed(m);return true;
  }
  function typed(m){
    if(cur!==m)return;
    lg("typed",m,Math.round(performance.now()-m.t0));
    frame(m.mood==="happy"?"happy":"idle");
    if(m.mood==="happy"&&!RM())el.classList.add("kk-cheer");
    m.t=setTimeout(()=>done(m,"auto"),m.micro?clamp(700+m.text.length*60,900,1400):m.cat==="ev"?clamp(1800+m.text.length*40,2600,6000):clamp(2200+m.text.length*50,3200,9500));
  }
  function teardown(c){
    clearTimeout(c.t);cur=null;K.talking=false;bub.hidden=true;K.endAt=now();
    if(K.hl){K.hl.classList.remove("kk-pt");K.hl=null;}
    if(K.mode==="talk")setMode("idle");
    frame("idle");el.classList.remove("kk-cheer");
  }
  function done(m,how){
    if(cur!==m)return;
    teardown(m);lg("done",m,how);
    if(how==="user"){if(++K.dis>=3){K.dis=0;nextChat=now()+120000;}}else K.dis=0;
    m.res(true);
    /* un respiro entre un globo y el siguiente: si cierras el globo tú, enseguida; si se cierra solo, una pausa visible */
    setTimeout(flushQ,how==="user"?140:420);brain(rnd(1800,3800));
  }
  function clearQ(ctx){
    for(let i=Q.length-1;i>=0;i--){const q=Q[i];if(ctx&&q.ctx!==ctx)continue;Q.splice(i,1);clearTimeout(q.tq);lg("drop",q,"clear");q.res(false);}
  }
  function interrupt(ctx){
    const c=cur;if(c){teardown(c);lg("stop",c,"interrupt");c.res(false);}
    clearQ(ctx);
  }
  function enq(m){
    Q.push(m);lg("queue",m,Q.length);
    m.tq=setTimeout(()=>{const i=Q.indexOf(m);if(i<0)return;Q.splice(i,1);lg("drop",m,"ttl");m.res(false);},m.ttl);
  }
  let flushT=0;
  function flushQ(){
    if(K.talking||K.off||K.mode==="hop")return;
    while(Q.length){
      let bi=-1;for(let i=0;i<Q.length;i++)if(!blocked(Q[i])&&(bi<0||Q[i].p>Q[bi].p))bi=i;   /* la de más prioridad; a igualdad, la más antigua */
      if(bi<0){clearTimeout(flushT);flushT=setTimeout(flushQ,600);return;}      /* todas esperan a que dejes de escribir/arrastrar */
      const m=Q.splice(bi,1)[0];clearTimeout(m.tq);
      if(m.key&&(cd[m.key]||0)>now()){lg("drop",m,"cd");m.res(false);continue;}
      begin(m);return;
    }
  }
  const spent=()=>{const t=now();DLG.sp=DLG.sp.filter(x=>t-x<DLG.win);return DLG.sp.length>=DLG.budget;};
  /* ---------- (parte 4b) modo «calladita»: SOLO EMOJIS ----------
     En «calladita» ningún globo lleva texto salvo que (a) la toquen o (b) le pidan ayuda (words:true en say()).
     Lo demás: las frases espontáneas y de ambiente se descartan; las respuestas a lo que haces (agarrar, lanzar, buscar,
     juegos, logros, eventos especiales…) se cambian por un emoji de la situación (EMO.<situación>, en dialogs.js).
     Con emo:"kind" el sitio que llama dice qué emoji quiere; si no, se deduce de la clave (EKEY). */
  const EKEY=[[/^k3(grab|many|long)/,"grab"],[/^k3hold/,"held"],[/^k3shake/,"shake"],[/^k3th/,"fly"],[/^k3land/,"placed"],[/^k3(drop|madtap)/,"mad"],[/^k3pr/,"pr"],
   [/^(search|focus)/,"search"],[/^fav/,"fav"],[/^theme/,"theme"],[/^bg/,"bg"],[/^mus/,"music"],[/^gstart/,"gstart"],[/^grec/,"grec"],[/^gover/,"gover"],
   [/^fold:/,"folder"],[/^fast-dl/,"dl"],[/^fast-src/,"src"],[/^manywin/,"wins"],[/^back/,"back"],[/^lang/,"lang"],[/^modemsg/,"mode"],[/^hk/,"hk"],
   [/^zz-/,"sleep"],[/^bkclose/,"bkEnd"],[/^bkunlock/,"big"]];
  const kindOf=o=>{const k=o.key||"";for(const [re,v] of EKEY)if(re.test(k))return v;return (o.p||1)>=3?"big":"ui";};
  const LETTERS=/\p{L}/u;
  function wordsGate(msg,o){
    if(S.mode!=="quiet"||o.words||o.micro)return [msg,o];
    let kind=typeof o.emo==="string"?o.emo:"";
    if(!kind){
      if(o.cat==="sp"||o.cat==="amb"||o.opt||(!o.cat&&(o.p||1)<2))return null;   /* espontánea o de ambiente: en silencio */
      kind=kindOf(o);
    }
    return [pick(EMO[kind]||EMO.ui,"emo-"+kind),Object.assign({},o,{emoji:true,opt:false})];
  }
  const emo=(kind,o)=>say(pick(EMO[kind]||EMO.ui,"emo-"+kind),Object.assign({p:1,micro:true,always:true,nogap:true,cd:0,replace:true},o));
  function say(msg,o={}){
    return new Promise(res=>{
      const gt=wordsGate(msg,o);
      if(!gt){lg("reject",{id:++mid,cat:o.cat,p:o.p,key:o.key,text:""},"quiet");res(false);return;}
      msg=gt[0];o=gt[1];
      /* una clave con varias frases (lista de pares): elige una sin repetir las recientes */
      if(Array.isArray(msg)&&Array.isArray(msg[0]))msg=pick(msg,"l-"+(o.key||"x"));
      const mic=!!o.micro,p=o.p||1,cat=o.cat||(mic?"mic":p===1?"amb":"ui"),ev=cat==="ev",em=!!o.emoji;
      const m={id:++mid,text:(()=>{const raw=tx(msg);return fmt(raw,ctxVars(raw,o.vars));})(),p,cat,ctx:o.ctx||cat,key:o.key,cdMs:o.cd||0,mood:o.mood,hl:o.hl,sr:p>1&&!mic&&!em,res,micro:mic||em,opt:!!o.opt,always:!!o.always,words:!!o.words,
        ttl:o.ttl!=null?o.ttl:mic?300:em?(ev?600:2500):ev?600:12000,instant:o.instant!=null?!!o.instant:ev||mic||em,replace:o.replace!=null?!!o.replace:ev,t0:performance.now(),onStart:o.onStart};
      const no=why=>{lg("reject",m,why);res(false);};
      if((!S.on&&!o.zz)||K.off||!K.ready&&!o.force)return no("off");
      /* red de seguridad: en «calladita» no sale ningún texto con letras si no la tocaron ni le pidieron ayuda */
      if(S.mode==="quiet"&&!m.words&&LETTERS.test(m.text))return no("quiet-words");
      if(m.key&&(cd[m.key]||0)>now())return no("cd");
      if(blocked(m))return no(busy()?"busy-user":"quiet");
      if(mic&&K.mode==="hop")return no("hop");
      const gp=DLG.gap[cat];if(gp&&!o.nogap&&now()-(DLG.last[cat]||0)<gp)return no("cat-cd");   /* nogap: un evento físico (soltarla) no espera a la pausa entre micros */
      if(cat==="sp"&&spent())return no("budget");
      lg("req",m);
      if(K.talking){
        if(m.replace||p>cur.p){const c=cur;teardown(c);lg("stop",c,"replaced");c.res(false);begin(m);}
        else if(p>=2&&Q.length<4&&!(m.key&&Q.some(q=>q.key===m.key)))enq(m);
        else no("busy");
        return;
      }
      if(K.mode==="hop"){if(Q.length<4)enq(m);else no("full");return;}
      begin(m);
    });
  }
  const idOf=m=>Array.isArray(m)?m[0]:m.t[0];
  function pick(list,key){
    const ok=list.filter(m=>!recent.includes(key+":"+idOf(m))),pool=ok.length?ok:list,m=pool[Math.floor(Math.random()*pool.length)];
    recent.push(key+":"+idOf(m));if(recent.length>RECN)recent.shift();saveRec();return m;
  }
  const praise=()=>Math.random()<.4&&KXD.gen?KXD.gen("praise"):pick(T.praise,"praise");
  const pickTip=()=>pick(T.tips.filter(t=>(!t.pc||isPC())&&(!t.mob||!isPC())),"tip").t;
  function pickMisc(){
    const h=new Date().getHours(),list=[...T.facts],bg=root.getAttribute("data-bg");
    if(h>=23||h<5)list.push(...T.late);
    /* (parte 3) frases según la franja horaria y con una app/carpeta reales */
    const slot=h<5||h>=22?"night":h<12?"morning":h<19?"afternoon":"evening";
    list.push(...(T.tod&&T.tod[slot]||[]));
    if(randApp())list.push(...(T.appTips||[]));
    if(bg==="halloween"||bg==="navidad")list.push(...[].concat(T.bg[bg]));
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
  /* o.line = frase propia (p. ej. un consejo de la parte 4); si no, la frase de siempre de esa carpeta */
  async function visitFolder(id,o={}){
    if(!S.on||K.snooze)return false;                    /* (4b) dormida: no visita carpetas */
    const line=o.line||folderLine(id);if(!line)return false;
    if(o.line){o=Object.assign({},o);delete o.line;}
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
  const searching=()=>{const x=$("#q");return !!x&&(x.value.trim().length>=2||typing());};
  function onFolder(id,st){
    S.fc[id]=(S.fc[id]||0)+1;
    const first=!S.opened.includes(id);if(first)S.opened.push(id);
    save();const total=allIds().length;
    emit("folder",{id,first,state:st,count:S.opened.length,total});
    K.tour=null;
    if(!S.on)return;                                    /* (4b) dormida: no visita carpetas */
    if(S.opened.length>=total&&!S.allDone){S.allDone=1;save();emit("allfolders",{total});say(T.allDone,{p:3,mood:"happy"});return;}
    if(!isPC()&&st==="max"){K.pend=id;return;}
    if(searching())return;                  /* (parte 2) buscar abre todas las ventanas: no saltar de carpeta en carpeta */
    if(S.fc[id]<=2||Math.random()<.18)visitFolder(id,{p:first?2:1,key:"fold:"+id,cd:30000,emo:"folder"});
  }

  /* ---------- cerebro: qué hace cuando nadie le dice nada ---------- */
  const alive=()=>S.on&&!K.off&&K.ready&&!document.hidden&&!K.talking&&!K.tour&&K.mode!=="hop";
  function brain(ms){clearTimeout(brainT);brainT=setTimeout(think,ms==null?rnd(2600,6200):ms);}
  const dark=()=>root.getAttribute("data-theme")==="dark";
  function chatter(){
    const w=Math.random();nextChat=now()+rnd(26000,50000)*MD().chat;
    if(w<.2&&(isPC()||!K.game)&&Math.random()<.9){const ids=["tiendas","importante","control","utilidad","pantalla","privacidad","fotos","internet","dia","emulacion","decoracion","musica","teclados","packs"].filter(i=>$(`#desk .di[data-id="${i}"]`));
      visitFolder(ids[Math.floor(Math.random()*ids.length)],{p:1,key:"chat",cat:"sp"});return;}
    const m=w<.55?pickTip():w<.85?praise():pickMisc();say(m,{p:1,key:"chat",cat:"sp"});
  }
  async function think(){
    if(!alive()||K.still){brain(2500);return;}                 /* K.still = true: quieta del todo (para pruebas automáticas) */
    const idle=now()-lastAct;
    if(K.mode==="sleep"){brain(6000);return;}
    if(dark()&&idle>150000&&K.mode==="idle"){setMode("sleep");frame("sleep");brain(6000);return;}
    const g=geo(K.stage);
    if(!g||!usable(K.stage)&&!free(K.stage)){await relocate();brain();return;}
    if(K.game){brain(4000);return;}
    if(now()>=nextChat&&idle<240000&&S.mode!=="quiet"){chatter();brain(5000);return;}   /* (4b) «calladita»: ninguna visita ni frase espontánea */
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
    if(S.mode==="quiet"){say(GREET.morning,{p:2,emo:"greet",key:"greet"});return;}      /* (4b) «calladita»: ni tour ni saludo con texto, solo un emoji */
    if(first){await tour();return;}
    const h=new Date().getHours(),days=Math.floor((now()-prev)/864e5);
    const m=days>=3?T_fmt(GREET.away,{d:days}):h<5||h>=23?GREET.night:h<12?GREET.morning:h<19?GREET.afternoon:GREET.evening;
    await say(m,{p:2});
    const nn=cnt("news");if(nn>0){await wait(350);say(nn===1?GREET.news1:T_fmt(GREET.newsN,{n:nn}),{p:2});}
  }
  const T_fmt=(pair,v)=>{if(Array.isArray(pair[0]))pair=pick(pair,"tf");return [fmt(pair[0],v),fmt(pair[1],v)];};

  /* ---------- reacciones a lo que haces ---------- */
  const q=$("#q");let sT=0;
  async function onSearch(){
    const v=q.value.trim();if(v.length<2)return;
    const apps=$$("#app .cat:not(#favs):not(#news):not(#packs) .app:not([hidden])"),n=apps.length,a=n?apps[0].querySelector("h3").textContent.trim():"";
    emit("search",{q:v,n});
    if(!S.on||K.off)return;
    /* (parte 2) ya no espera a llegar a la barra: salta sin esperar y la frase sale al aterrizar (o ya, si está cerca) */
    if(usable("search")&&K.stage!=="search"&&alive())hop("search");
    say(n===0?T_fmt(T.noRes,{q:v}):n===1?T_fmt(T.oneRes,{a}):T_fmt(T.manyRes,{n,q:v}),{p:2,key:"search",cd:2500,ctx:"search",ttl:2500,always:true,emo:n===0?"noRes":"search"});
  }
  q.addEventListener("input",()=>{
    clearTimeout(sT);K.tour=null;
    clearQ("search");if(cur&&cur.ctx==="search")done(cur,"stale");      /* la respuesta a una búsqueda vieja ya no sirve */
    sT=setTimeout(onSearch,420);
  });
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
      say(!added?T.favDel:n===1?T.fav1:n%5===0?T_fmt(T.fav5,{n}):T.favAdd,{p:2,key:"fav",cd:4000,emo:added?"fav":"favDel",mood:added&&(n===1||n%5===0)?"happy":undefined});
    },40);
  });
  let prevTheme=root.getAttribute("data-theme");
  new MutationObserver(()=>{
    const t=root.getAttribute("data-theme");if(t===prevTheme)return;prevTheme=t;emit("theme",{dark:t==="dark"});
    if(K.mode==="sleep"&&!K.snooze){setMode("idle");frame("idle");}
    if(K.ready)say(t==="dark"?T.night:T.day,{p:2,cat:"ui",opt:true,key:"theme",cd:8000,ttl:2500,emo:"theme"});
  }).observe(root,{attributes:true,attributeFilter:["data-theme"]});
  let prevBg=window.KXB?KXB.label():"";
  addEventListener("kixki-bg",()=>{
    if(!window.KXB)return;const l=KXB.label();if(l===prevBg)return;prevBg=l;
    const auto=/^Auto/.test(l),k=auto?"auto":(root.getAttribute("data-bg")||"");emit("bg",{k});
    if(K.ready&&T.bg[k])say(T.bg[k],{p:1,key:"bg",cd:5000,emo:"bg"});
  });
  let prevMus=!!(window.KXM&&KXM.on);
  document.addEventListener("click",e=>{
    if(!e.target.closest("#rd,#s-mus"))return;
    setTimeout(()=>{const on=!!(window.KXM&&KXM.on);if(on===prevMus)return;prevMus=on;emit("music",{on});say(on?T.musOn:T.musOff,{p:1,key:"mus",cd:10000,emo:"music"});},80);
  });
  addEventListener("kixki-game",e=>onGame(e.detail||{}));
  function onGame(d){
    emit("game",d);
    if(!S.on)return;
    if(d.t==="start"||d.t==="retry"){
      K.game=true;el.classList.add("kk-top");K.tour=null;idle0();
      if(d.t==="start")setTimeout(async()=>{if(!K.game)return;await enter("game");if(!K.game)return;
        say(d.rec>0?T_fmt(T.gStartRec,{rec:d.rec}):T.gStart,{p:2,key:"gstart",cd:15000,always:true});},350);
    }else if(d.t==="record")say(T.gRecord,{p:3,mood:"happy",key:"grec",cd:6000});
    else if(d.t==="over"){
      const m=d.nr&&!d.first?T_fmt(T.gOverRec,{sc:d.sc}):d.first&&d.sc>0?T_fmt(T.gOverFirst,{sc:d.sc}):d.sc===0?T.gOverZero:d.sc>=d.rec*.8&&d.rec>2?T_fmt(T.gOverNear,{sc:d.sc}):T_fmt(T.gOver,{sc:d.sc});
      say(m,{p:3,mood:d.nr&&!d.first?"happy":undefined,key:"gover",cd:2500});
    }
  }
  /* idioma: avisa y traduce sus textos fijos */
  function labels(){
    const L=lang()==="en"?1:0;
    body.setAttribute("aria-label",(K.snooze?UI.zzAria:UI.aria)[L]);bx.setAttribute("aria-label",UI.close[L]);
    const t=$("#s-kx-tip"),o=$("#s-kx-on"),md=$("#s-kx-mode");if(t)t.textContent=UI.tip[L];if(o)o.textContent=(S.on?UI.onT:UI.offT)[L];
    if(md){md.textContent=UI.modeT[S.mode in MODES?S.mode:"normal"][L];md.hidden=!S.on;}
  }
  if(window.KXI&&!KXI._kk){KXI._kk=1;const o=KXI.set;KXI.set=function(l){o.call(KXI,l);labels();emit("lang",{lang:l});interrupt();if(K.ready)say(T.lang[l==="en"?"en":"es"],{p:2,key:"lang",cd:2500,emo:"lang"});};}
  /* volver a la pestaña */
  let hiddenAt=0;
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){hiddenAt=Date.now();return;}
    const away=hiddenAt?Date.now()-hiddenAt:0;
    if(K.ready&&away>=25000)say(T.back,{p:2,cat:"ui",opt:true,key:"back",cd:60000,ttl:3000,emo:"back"});
    else if(K.ready&&away>=6000)micro("back",{key:"backm",cd:20000});
    resync();
  });

  /* ---------- (parte 2) microreacciones y reacciones rápidas ---------- */
  const hasWord=t=>/\p{L}/u.test(t);
  /* kind → MIC[kind]; en modo «calladita» solo salen las de emoji; devuelve la promesa de say() */
  function micro(kind,o={}){
    let pool=(MIC[kind]||[]).slice();
    if(!MD().words)pool=pool.concat(EMO[kind]||[]).filter(m=>!hasWord(m[0]));      /* «calladita»: solo emoji (los de MIC y los de EMO) */
    if(!pool.length)return Promise.resolve(false);
    return say(pick(pool,"mic-"+kind),Object.assign({p:1,micro:true,cd:0},o));
  }
  const appName=a=>{const h=a&&a.querySelector("h3");return h?h.textContent.trim():"";};
  /* clic en «Descarga»/«APK» o en la fuente (GitHub, Repositorio…) */
  document.addEventListener("click",e=>{
    const b=e.target.closest&&e.target.closest(".app .links a.btn,.app .links button.btn");if(!b||!S.on||!K.ready)return;
    const t=b.textContent.trim(),a=appName(b.closest(".app"));
    const kind=/^(descarga|apk|play|google play)/i.test(t)?"dl":/github|gitlab|repositorio|fuente|source|cr[eé]ditos/i.test(t)?"src":"";
    if(!kind)return;
    emit("click-"+kind,{a});
    say(pick(FAST[kind],"fast-"+kind),{p:2,cat:"ui",opt:true,key:"fast-"+kind,cd:6000,ttl:2500,vars:{a},emo:kind});
  },true);
  /* ratón 3 s sobre la misma app (solo con ratón) */
  if(matchMedia("(hover:hover)").matches){
    let hv=null;
    const clearHv=()=>{if(hv){clearTimeout(hv.t);hv=null;}};
    document.addEventListener("pointerover",e=>{
      if(e.pointerType==="touch")return;
      const c=e.target.closest&&e.target.closest("#app .app");
      if(!c){clearHv();return;}
      if(hv&&hv.c===c)return;
      clearHv();
      hv={c,t:setTimeout(()=>{
        const c0=hv&&hv.c;hv=null;
        if(!c0||!S.on||K.off||!K.ready||!c0.isConnected||c0.hidden)return;
        say(pick(FAST.hov,"fast-hov"),{p:1,cat:"sp",key:"hover",cd:25000,ttl:1500,vars:{a:appName(c0)||"esta app"}});
      },3000)};
    },true);
    document.addEventListener("pointerdown",clearHv,true);
    addEventListener("blur",clearHv);
  }
  /* muchas ventanas abiertas a la vez (solo PC) */
  let manyShown=false;
  function checkWins(){
    if(!isPC()||searching()){manyShown=false;return;}
    const n=$$("#app .cat:not(.min):not(.max)").filter(x=>!x.hidden).length;
    if(n>=5&&!manyShown){manyShown=true;if(K.ready&&S.on&&!K.off)say(pick(FAST.wins,"fast-wins"),{p:2,cat:"ui",opt:true,key:"manywin",cd:90000,ttl:3000,vars:{n},emo:"wins"});}
    else if(n<=3)manyShown=false;
  }

  /* ---------- tocar a Kixki ---------- */
  let taps=[];
  body.addEventListener("click",()=>{
    if(K.enter)return;                                  /* (4b) entrando en una ventana: no se le habla */
    act();if(K.snooze){poke();return;}                  /* (4b) dormida: se despierta un instante (😠/😴) y vuelve a dormir */
    const t=now();taps=taps.filter(x=>t-x<4000);taps.push(t);emit("tap",{n:taps.length});
    if(window.KXS)try{KXS.baa();}catch(e){}
    if(taps.length>=7){taps=[];say(T.dizzy,{p:3,key:"dizzy",cd:9000,words:true});setTimeout(()=>{if(alive()){const c=candidates().filter(i=>i!==K.stage);if(c.length)hop(c[0]);}},2600);return;}
    if(cur)done(cur,"user");
    const r=Math.random();
    say(r<.5?pickTip():r<.78?pick(T.tap,"tap"):praise(),{p:2,words:true});    /* (4b) tocarla = permiso para hablar con texto, incluso en «calladita» */
  });
  bub.addEventListener("click",()=>{if(cur&&!finishTyping(cur))done(cur,"user");});
  if(matchMedia("(hover:hover)").matches){
    bub.addEventListener("mouseenter",()=>{if(cur&&cur.t&&K.talking&&bub.hidden===false&&vi.textContent===cur.text)clearTimeout(cur.t);});
    bub.addEventListener("mouseleave",()=>{if(cur&&vi.textContent===cur.text){const c=cur;clearTimeout(c.t);c.t=setTimeout(()=>done(c,"auto"),1800);}});
  }
  addEventListener("keydown",e=>{if(e.key==="Escape"&&cur)done(cur,"user");});

  /* ---------- actividad del visitante (para dormir y despertar) ---------- */
  function act(){
    lastAct=now();
    if(K.snooze)return;                                 /* (4b) dormida por la opción del menú: solo la despierta tocarla a ella */
    if(K.mode==="sleep"){setMode("idle");frame("idle");say(T.wake,{p:1,key:"wake",cd:60000});}
  }
  ["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev,act,{passive:true,capture:true}));
  addEventListener("scroll",()=>{lastAct=now();resync();},{passive:true});
  addEventListener("resize",resync);

  /* ---------- menú: apagar a Kixki y pedirle un consejo ---------- */
  const sm=KX.sm||$("#sm");
  if(sm){
    const ref=$("#s-sug",sm);
    const html=`<button type="button" class="sm" id="s-kx-tip"></button><button type="button" class="sm" id="s-kx-mode"></button><button type="button" class="sm" id="s-kx-on"></button>`;
    ref?ref.insertAdjacentHTML("beforebegin",html):sm.insertAdjacentHTML("beforeend",html);
    sm.addEventListener("click",e=>{
      const b=e.target.closest("#s-kx-tip,#s-kx-on,#s-kx-mode");if(!b)return;
      if(b.id==="s-kx-mode"){setTalk(null);return;}
      if(b.id==="s-kx-on"){S.on=!S.on;save();const r=applyOn();labels();if(S.on)r.then(()=>setTimeout(()=>say(praise(),{p:2}),500));}
      else if(S.on){setTimeout(()=>say(pickTip(),{p:3,words:true}),250);}          /* pedir un consejo = petición directa: puede hablar con texto */
      else{S.on=true;save();const r=applyOn();labels();r.then(()=>setTimeout(()=>say(pickTip(),{p:3,words:true}),300));}
    });
  }
  /* charlatana → normal → calladita (m = nombre para fijarlo; null = siguiente) */
  function setTalk(m){
    const order=["chat","normal","quiet"];
    S.mode=m&&MODES[m]?m:order[(order.indexOf(S.mode)+1)%3];
    save();applyMode();labels();emit("mode",{mode:S.mode});
    nextChat=now()+rnd(8000,16000)*MD().chat;
    if(S.on&&K.ready&&!K.off)say(FAST.mode[S.mode],{p:3,key:"modemsg",cd:0});
  }
  /* ---------- (parte 4b) quitar a Kixki = que se duerma ----------
     Ya no desaparece: se acuesta (sprite de dormir + «zZ») donde no estorba y se queda así, visible. Dormida no camina, no habla,
     no reacciona al entorno ni visita carpetas (todo eso ya comprueba S.on). Una sola frase de buenas noches al irse a dormir
     (T.sleepNow). Si la tocan se despierta un instante con 😠/😴 y vuelve a dormir. Al reactivar la opción: bostezo, se estira y vuelve.
     Estado: S.on (localStorage «kixki-k») · pose: K.snooze + clases kk-snooze/kk-lie. Lector de pantalla: «Kixki está durmiendo», una vez. */
  const REST_RE=/^(search|dock|floor|tiles\d)$/;
  const restId=()=>isPC()?(usable("floor")?"floor":"search"):"dock";
  const restX=(id,g)=>id==="floor"?clamp(innerWidth*.84,g.a,g.b):id==="dock"?Math.max(g.a,g.b-12):(g.a+g.b)/2;
  const announce=t=>{sr.textContent="";setTimeout(()=>{sr.textContent=t;},60);};
  let zzTok=0,pokeT=0;
  function pose(on){
    K.snooze=on;el.classList.toggle("kk-snooze",on);el.classList.toggle("kk-lie",on);
    if(on){setMode("sleep");frame("sleep");}else{if(K.mode==="sleep")setMode("idle");frame("idle");}
    labels();
  }
  async function goSleep(silent){
    const tok=++zzTok,wasHop=K.mode==="hop";
    clearTimeout(pokeT);K.poking=false;el.classList.remove("kk-stretch");
    cancelEnter();K.tour=null;interrupt();stopMove();
    if(K.mode==="hop"||K.mode==="walk"){setMode("idle");frame("idle");}
    /* una sola frase de buenas noches (en «calladita», un emoji) */
    if(!silent&&K.ready&&!K.off&&!document.hidden){
      await say(T.sleepNow,{p:3,cat:"ui",zz:true,always:true,replace:true,key:"zz-bye",ttl:3000});
      if(tok!==zzTok)return;
    }
    /* si no está en un sitio que no estorba (barra, filas, barra de tareas), se va a uno; si lo está, se queda donde está */
    const keep=!wasHop&&REST_RE.test(K.stage||"")&&usable(K.stage);
    if(!keep&&K.ready&&!K.off){const rid=restId();if(usable(rid)){const g=geo(rid);await hop(rid,restX(rid,g));if(tok!==zzTok)return;}}
    pose(true);announce(UI.zzSr[lang()==="en"?1:0]);emit("sleep",{on:true});
  }
  async function wakeUp(){
    const tok=++zzTok,was=K.snooze;
    clearTimeout(pokeT);K.poking=false;
    if(!was||K.off||!K.ready){pose(false);if(K.ready&&!K.off){const g=geo(K.stage);if(!g||!usable(K.stage)&&!free(K.stage))relocate(true);else resync();brain(2500);}return;}
    emit("sleep",{on:false});
    interrupt();el.classList.remove("kk-snooze","kk-lie");K.snooze=false;setMode("idle");frame("talk");labels();     /* bostezo: boca abierta */
    emo("yawn",{p:2});setTimeout(()=>{if(tok===zzTok&&!K.snooze&&K.mode==="talk"||K.mode==="idle"&&tok===zzTok)frame("talk");},260);
    await wait(RM()?250:900);if(tok!==zzTok)return;
    if(!RM()){el.classList.add("kk-stretch");beep(300);setTimeout(()=>beep(380),200);await wait(750);if(tok!==zzTok)return;el.classList.remove("kk-stretch");}   /* se estira */
    frame("idle");
    const id=candidates()[0]||home();                   /* y vuelve a lo suyo */
    if(id!==K.stage&&usable(id)&&!K.game)await hop(id);else resync();
    if(tok===zzTok)brain(2500);
  }
  /* la tocan mientras duerme: se levanta un instante enfadada o somnolienta y vuelve a dormir */
  function poke(){
    if(!K.snooze||K.poking)return;
    K.poking=true;clearTimeout(pokeT);emit("poke",{});
    el.classList.remove("kk-lie");setMode("idle");frame("idle");
    if(window.KXS)try{KXS.baa();}catch(e){}
    emo("poke",{p:3,zz:true,ttl:700});
    pokeT=setTimeout(()=>{K.poking=false;if(!K.snooze)return;interrupt();el.classList.add("kk-lie");setMode("sleep");frame("sleep");},1500);
  }
  function applyOn(){return S.on?wakeUp():goSleep();}

  /* ---------- (parte 4b) entrar en la ventana de un minijuego ----------
     enter(id,{fall,hide,target,onImpact}) → promesa: true = lista para jugar (o no hacía falta animar), false = cancelada.
     · Salta Vallas («game»): salta y se sube al borde de la ventana (lo de siempre).
     · Básquet («bask», fall:true): sube, camina hasta el borde, se tropieza y CAE dentro de la ventana (golpe + estrellitas);
       target() = dónde caen sus pies (la cancha lo calcula en vivo); hide:true la esconde al llegar (la cancha dibuja su propia Kixki).
     · prefers-reduced-motion: sin saltos ni caída, solo un fundido corto.
     · skipEnter() la salta (clic o tecla); cancelEnter() limpia TODO si cierran la ventana a medias (clases, temporizadores, estado). */
  const kxs=(f,d)=>{if(window.KXS)try{KXS.beep(f,d);}catch(e){}};
  const sfxAt=(E,list)=>list.forEach(([f,d,at])=>E.t.push(setTimeout(()=>kxs(f,d),at)));
  const sfxTrip=E=>sfxAt(E,[[330,.05,0],[270,.06,110],[220,.07,230]]);
  const sfxFall=E=>sfxAt(E,[[640,.06,0],[560,.06,60],[480,.06,120],[400,.06,180],[330,.06,240],[270,.06,300],[220,.06,360]]);
  const sfxThud=E=>sfxAt(E,[[110,.12,0],[85,.14,70],[900,.04,190],[1180,.05,260]]);
  function cleanEnter(){
    el.classList.remove("kk-air","kk-dizzy","kk-sq");el.style.removeProperty("--tilt");
    $$(".kk-sp",el).forEach(x=>x.remove());
  }
  function cancelEnter(){
    const E=K.enter;if(!E)return false;
    K.enter=null;cancelAnimationFrame(E.raf);E.t.forEach(clearTimeout);E.w.splice(0).forEach(f=>{try{f();}catch(e){}});
    stopMove();cleanEnter();
    if(K.mode==="hop"||K.mode==="walk")setMode(K.snooze?"sleep":"idle");
    if(!K.snooze)frame("idle");
    emit("enterend",{id:E.id,how:"cancel"});
    return true;
  }
  function skipEnter(){
    const E=K.enter;if(!E||E.skip)return false;
    E.skip=true;cancelAnimationFrame(E.raf);E.t.forEach(clearTimeout);E.t.length=0;E.w.splice(0).forEach(f=>{try{f();}catch(e){}});stopMove();return true;
  }
  function sparks(){
    if(RM())return;
    for(let i=0;i<6;i++){const s=document.createElement("i");s.className="kk-sp";s.style.setProperty("--sx",Math.round((i-2.5)*15)+"px");s.style.setProperty("--sy",-(20+(i%2)*14)+"px");el.append(s);setTimeout(()=>s.remove(),640);}
  }
  async function enter(id,o={}){
    cancelEnter();el.classList.remove("kk-in");
    K.game=true;el.classList.add("kk-top");
    const hideNow=()=>{if(o.hide)el.classList.add("kk-in");};
    if(!K.ready||K.off||!S.on||!usable(id)){hideNow();return true;}      /* nada que animar: dormida, escondida o sin sitio */
    const E={id,fall:!!o.fall,skip:false,raf:0,t:[],w:[]};
    K.enter=E;K.tour=null;idle0();emit("enter",{id,fall:E.fall});
    const gone=()=>K.enter!==E;
    const nap=ms=>new Promise(r=>{E.t.push(setTimeout(r,ms));E.w.push(r);});
    const tgt=()=>{try{return o.target?o.target():null;}catch(e){return null;}};
    const fin=how=>{
      const tg=E.fall&&tgt();if(tg){K.x=tg.x;K.y=tg.y;}
      cleanEnter();if(!K.snooze){setMode("idle");frame("idle");}hideNow();place();
      if(K.enter===E)K.enter=null;
      emit("enterend",{id,how:how||(E.skip?"skip":"done")});return true;
    };
    try{
      interrupt();
      if(RM()){                                                       /* sin movimiento: fundido corto, sin caída */
        if(E.fall){el.classList.add("kk-in");await nap(180);}
        else if(K.stage!==id)await hop(id);
        return gone()?false:fin();
      }
      /* 1) sube al borde de la ventana (para la caída, empieza lejos del borde por el que se va a caer) */
      const edgeOf=g=>{const t=tgt();return t&&Math.abs(g.a-t.x)<Math.abs(g.b-t.x)?g.a:g.b;};
      if(K.stage!==id){
        const g=geo(id),ex=edgeOf(g),other=ex===g.b?g.a:g.b;
        await hop(id,E.fall?ex+(other-ex)*.38:undefined);
      }
      if(gone())return false;if(E.skip)return fin();
      if(!E.fall)return fin("up");
      /* 2) camina hasta el borde */
      const g1=geo(id);if(!g1)return gone()?false:fin();
      const ex1=edgeOf(g1);
      await walk(ex1,66);
      if(gone())return false;if(E.skip)return fin();
      /* 3) se tropieza */
      setMode("idle");frame("jump");emo("stumble",{p:2});sfxTrip(E);
      for(const d of [-10,7,-16]){el.style.setProperty("--tilt",d+"deg");await nap(130);if(gone())return false;if(E.skip)return fin();}
      /* 4) cae dentro de la ventana */
      const x0=K.x,y0=K.y,tg0=tgt()||{x:x0,y:y0+160},T=clamp(Math.sqrt(2*Math.max(60,tg0.y-y0)/1900)*1000+160,380,950);
      el.classList.add("kk-air");setMode("hop");sfxFall(E);
      await new Promise(res=>{
        E.w.push(res);const t0=performance.now();
        const tick=t=>{
          if(K.enter!==E||E.skip){res();return;}
          const tg=tgt()||tg0,u=Math.min(1,(t-t0)/T);
          K.x=x0+(tg.x-x0)*(1-(1-u)*(1-u));K.y=y0+(tg.y-y0)*u*u;
          el.style.setProperty("--tilt",Math.round(-330*u)+"deg");place();
          if(u<1){E.raf=requestAnimationFrame(tick);return;}
          res();
        };
        E.raf=requestAnimationFrame(tick);
      });
      if(gone())return false;if(E.skip)return fin();
      /* 5) golpe: se chafa, polvo, estrellitas y mareo */
      const tg=tgt()||tg0;K.x=tg.x;K.y=tg.y;el.style.removeProperty("--tilt");place();
      setMode("idle");frame("idle");el.classList.remove("kk-air");el.classList.add("kk-sq","kk-dizzy");
      dust();sparks();sfxThud(E);
      if(o.onImpact)try{o.onImpact();}catch(e){}
      emo("fall",{p:2});
      await nap(950);
      if(gone())return false;
      return fin();
    }catch(e){cancelEnter();return false;}
  }
  labels();

  /* ---------- vigilante: ventanas, carpetas, pantalla completa, juego ---------- */
  const prevSt={};let scanQ=0,wasOff=true,prevPC=isPC();
  function scan(){
    scanQ=0;
    $$("#app .cat").forEach(s=>{
      const st=s.classList.contains("min")?"min":s.classList.contains("max")?"max":"normal",p=prevSt[s.id];prevSt[s.id]=st;
      if(p==="min"&&st!=="min"&&K.ready)onFolder(s.id,st);
      /* el usuario cierra una ventana: micro (si Kixki no iba encima y no es una travesura suya) */
      else if(p&&p!=="min"&&st==="min"&&K.ready&&S.on&&!K.off&&K.stage!=="w:"+s.id&&now()>=(K.noMic||0))micro("close",{key:"micro-close",cd:900});
    });
    checkWins();
    const gameOpen=!!($("#game")&&!$("#game").hidden)||!!($("#bask")&&!$("#bask").hidden);
    if(K.game&&!gameOpen){K.game=false;cancelEnter();el.classList.remove("kk-top","kk-in");if(K.ready){if(S.on)relocate();else resync();}}   /* (4b) cierran la ventana, incluso a medias: todo limpio */
    const off=!!$(".cat.max")||!!$("#boot:not([hidden])")||!!$("#run:not([hidden])")||!!$("#qr:not([hidden])");
    if(off!==wasOff){
      wasOff=off;K.off=off;
      if(off){cancelEnter();interrupt();stopMove();el.classList.add("kk-off");}
      else if(K.ready){
        el.classList.remove("kk-off");
        const g=geo(K.stage);if(!g||!usable(K.stage)&&!free(K.stage))relocate(true);else resync();
        if(K.pend){const id=K.pend;K.pend=null;setTimeout(()=>visitFolder(id,{p:1,key:"fold:"+id,cd:30000}),700);}
        brain(2500);
      }
    }
    if(isPC()!==prevPC){prevPC=isPC();K.tour=null;if(K.ready){interrupt();K.stage=null;relocate(true);}}
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
    if(!S.on){                                           /* (4b) la dejaron dormida: aparece ya acostada, sin tour ni saludo */
      await wait(40);                                   /* deja que kixki3 registre «floor» */
      const rid=restId(),sid=usable(rid)?rid:id,g2=geo(sid)||g;
      K.stage=sid;K.x=restX(sid,g2);K.y=g2.y(K.x);place();
      if(!K.off)el.classList.remove("kk-off");
      pose(true);announce(UI.zzSr[lang()==="en"?1:0]);return;
    }
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
    /* (etapa 4) vaciar la cola de un contexto sin cortar el globo; ms desde que se cerró el último globo (0 si habla); el globo actual */
    clearQ,quietFor:()=>K.talking?0:now()-(K.endAt||0),get cur(){return cur;},
    /* (parte 4: gestor de diálogos) */
    get debug(){return DBG.on;},set debug(v){DBG.on=!!v;try{localStorage.setItem("kixki-dbg",v?"1":"0");}catch(e){}},
    timeline:()=>LOG.slice(),clearTimeline:()=>{LOG.length=0;},
    /* presupuesto de frases espontáneas por minuto (y pausa mínima entre ellas, en ms); al cambiarlo se vacía el recuento */
    budget:(n,gap)=>{if(n!=null){DLG.budget=Math.max(0,n|0);DLG.sp=[];}if(gap!=null)DLG.gap.sp=Math.max(0,gap|0);return DLG.budget;},
    plat:(id,fn)=>{PLAT[id]=fn;},
    /* (parte 3) textos, variables y generador por piezas */
    D:KXD,ctxVars,randApp,
    /* (parte 2) modo de charla y microreacciones */
    get mode(){return S.mode;},setTalk,micro,busy,busyWhy:()=>({typing:typing(),win:U.win,game:!!K.game}),recentList:()=>recent.slice(),
    /* (parte 3: travesuras y físicas, kixki3.js) */
    ex:{place,land,setMode,frame,face,stopMove,R,topWin,say,layoutBubble},
    /* (parte 4b) dormir, solo emojis y entrada a ventanas */
    enter,skipEnter,cancelEnter,get entering(){return !!K.enter;},emo,emoji:(kind)=>pick(EMO[kind]||EMO.ui,"emo-"+kind),get quiet(){return S.mode==="quiet";},
    get sleeping(){return K.snooze;},setOn:v=>{S.on=!!v;save();const r=applyOn();labels();return r;},poke};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki:",e);const x=document.getElementById("kixki");if(x)x.remove();}catch(_){}}};
window.KXR?run():addEventListener("kixki-ready",run,{once:true});
})();
