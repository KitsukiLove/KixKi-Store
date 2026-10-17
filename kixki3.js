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
const TX=(window.KXD||{}).TX;   /* los textos viven en dialogs.js */
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
  /* (parte 3) ánimo: cuanto más la lanzas y más avanza el Plan, más pícara (1) y más vengativa (2) se pone */
  const mood=()=>{const t=(S3.throws|0)+(S3.drops|0),p=S3.plan|0;return p>=12||t>=25?2:p>=4||t>=8?1:0;};
  const mpk=(name,key)=>{const m=mood();let list=TX[name];
    if(m>=2&&TX[name+"V"]&&Math.random()<.55)list=TX[name+"V"];else if(m>=1&&TX[name+"P"]&&Math.random()<.5)list=TX[name+"P"];
    return pk(list,key);};
  const thrownLine=()=>{const m=mood(),g=m>=1&&Math.random()<.3&&KK.D&&KK.D.gen?KK.D.gen("grudge"):null;return F2(g||mpk("thrown","k3th2"),{n:S3.throws|0});};

  /* --- Kixki habla más pícara: sus frases se mezclan con las de siempre --- */
  try{
    const T=KK.T;
    if(T){
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
    if(now()<H.madUntil){e.stopPropagation();e.preventDefault();say(pk(TX.madTap,"k3mt"),{p:3,cat:"ev",key:"k3madtap",cd:1200,words:true});   /* tocarla = permiso para hablar (4b) */}
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
    /* (parte 2) agarrarla es frecuente: casi siempre una microreacción (~1 s); frase entera solo la 1.ª vez, cada 4 y de vez en cuando */
    if(n>=4&&n%4===0)say(F2(pk(TX.many,"k3many"),{n}),{p:3,cat:"ev",key:"k3grab",cd:0});
    else if(n===1||Math.random()<.15)say(pk(TX.grab,"k3grab"),{p:3,cat:"ev",key:"k3grab",cd:2500});
    else KK.micro("grab",{key:"k3grab",cd:1200});
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
      if(++H.shakeN>=6){H.shakeN=0;say(pk(TX.shake,"k3shake"),{p:3,cat:"ev",key:"k3shake",cd:6000});}
    }
    if(dx)H.lastDx=dx;
  }
  function heldLoop(){
    if(!H.held)return;
    if(K.off||!S.on){abortAll();return;}
    const v=H.samples.length>1?(H.samples[H.samples.length-1].x-H.samples[0].x)/Math.max(.016,(H.samples[H.samples.length-1].t-H.samples[0].t)/1000):0;
    if(!RM())setTilt(v*.014);
    const t=now();
    /* (etapa 4) respiro entre líneas: no empieza otra mientras no pasen ~1,6 s desde que se cerró el globo anterior
       (antes salían una tras otra sin pausa y la de soltarla se encontraba el globo ocupado) */
    if(t>H.holdT&&!K.talking&&KK.quietFor()>1600&&H.holdN<4){H.holdN++;H.holdT=t+rnd(3600,5600);say(pk(TX.holding,"k3hold"),{p:2,cat:"ev",ctx:"hold",replace:false,instant:false,ttl:900,key:"k3hold",cd:2500});}
    if(t-H.holdAt>10000&&!H.longSaid){H.longSaid=true;say(pk(TX.longHold,"k3long"),{p:3,cat:"ev",key:"k3long",cd:0});}
    requestAnimationFrame(heldLoop);
  }
  function release(){
    H.held=false;H.longSaid=false;
    /* (etapa 4) al soltarla, lo que dijo mientras la llevabas ya no vale: se cierra ese globo y se descartan sus frases en cola.
       Así hay un respiro limpio y la frase de soltarla/aterrizar nunca se encuentra el globo ocupado. */
    KK.interrupt("hold");
    const s=H.samples,L=s[s.length-1];let vx=0,vy=0;
    if(s.length>=2&&performance.now()-L.t<90){const a=s[0],dt=(L.t-a.t)/1000;if(dt>.01){vx=(L.x-a.x)/dt;vy=(L.y-a.y)/dt;}}
    vx=clamp(vx,-1500,1500);vy=clamp(vy,-1200,900);
    const thrown=Math.hypot(vx,vy)>THROW_V,fly={said:false};
    /* cada lanzamiento de verdad se cuenta (a los 10 aparece la cancha de básquet, basket.js) y TAMBIÉN se comenta:
       misma condición, sin importar la altura ni la dirección, y la frase sale al soltarla, no al aterrizar */
    if(thrown){
      const n=S3.throws=(S3.throws|0)+1;save();KK.emit("throw",{n});
      if(now()>=H.madUntil)say(mpk("flying","k3fly"),{p:3,cat:"ev",key:"k3th",cd:1500,onStart:()=>{fly.said=true;}});
    }
    startFall({vx,vy,thrown,fly,reason:"release"});
  }

  /* ---- caer ---- */
  const G=1900,THROW_V=850;                         /* px/s: a partir de aquí soltarla es «lanzarla» */
  function startFall(o){
    cancelFall();
    H.held=false;K.tour=H;K.stage="air";
    el.classList.add("kk-air");el.classList.remove("kk-held");
    EX.setMode("idle");
    const F=H.fall={vx:o.vx||0,vy:o.vy||0,y0:K.y,thrown:!!o.thrown,fly:o.fly||null,reason:o.reason||"release",bounced:false,raf:0,imp:0};
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
  /* (etapa 4) soltarla SIN lanzarla ahora siempre reacciona (antes: una frase entera de cada 6, y la microreacción
     se descartaba si el globo de «agarrar» seguía en pantalla o no habían pasado 1,4 s desde la anterior).
     Reglas: es un evento físico (reemplaza el globo, sin esperar), sin pausa entre micros y con su propia lista de frases. */
  const PLACED_H=140;                                /* caída de hasta 140 px = «dejada con cuidado» (sin rebote) */
  const quietMode=()=>KK.mode==="quiet";
  const fullGap=()=>now()-(H.lastFull||0)>4500;       /* nunca dos frases largas seguidas: entre medias, una micro */
  function landLines(id,h,imp,F){
    if(now()<H.madUntil)return;
    const o={p:2,cat:"ev",key:"k3land",cd:3500,ctx:"land"};
    if(F.thrown){
      /* si ya gritó en el aire, al aterrizar solo a veces remata (y sin pisar el grito); si no pudo, se queja ahora */
      if(F.fly&&F.fly.said){if(Math.random()<.75)say(imp>1000||h>320?pk(TX.hard,"k3th2"):thrownLine(),Object.assign(o,{replace:false}));}
      else say(thrownLine(),o);
    }
    else if(imp>1000||h>320){
      /* caída desde muy alto, sin lanzarla */
      if(!quietMode()&&fullGap()&&Math.random()<.5){H.lastFull=now();say(pk(TX.hard,"k3hd"),Object.assign(o,{cd:0}));}
      else KK.micro("hard",{key:"k3land",cd:0,replace:true,nogap:true});
    }
    else gentleLines(id,h);
  }
  function gentleLines(id,h){
    const placed=h<=PLACED_H,md=KK.mode;
    const spot=id==="search"?TX.onSearch:id.startsWith("w:")?TX.onWin:id==="floor"?TX.onFloor:id.startsWith("tiles")?TX.onTiles:id==="dock"?TX.onDock:null;
    H.softN=(H.softN|0)+1;
    /* probabilidad de frase entera: «calladita» nunca (solo emojis), «charlatana» casi siempre, normal: 80 % si la dejas con cuidado, 60 % si cayó un poco */
    const chance=md==="quiet"?0:md==="chat"?.92:placed?.8:.6;
    if(fullGap()&&Math.random()<chance){
      H.lastFull=now();
      const m=spot&&Math.random()<.35?pk(spot,"k3sp"):placed?mpk("placed","k3pl"):mpk("soft","k3sf");
      say(m,{p:2,cat:"ev",key:"k3land",cd:0,ctx:"land"});
    }
    else KK.micro(placed?"placed":"soft",{key:"k3land",cd:0,replace:true,nogap:true});
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
    else if(why==="close")m=mpk("closedOn","k3co");
    else if(n>=3&&n%3===0)m=F2(pk(TX.dropMany,"k3dm"),{n});
    else m=mpk("dragged","k3dr");
    if(why!=="close"||!self)bumpPlan(1);
    say(m,{p:3,cat:"ev",key:"k3drop",cd:0,mood:undefined});
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
  const canAct=()=>S.on&&K.ready&&!K.off&&!K.still&&!K.game&&!K.talking&&!K.tour&&K.mode!=="hop"&&K.mode!=="sleep"&&!H.held&&!H.fall&&!P.busy&&!document.hidden&&!wd;
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
      H.selfClose=on;K.noMic=now()+2500;
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
    if(!canAct()||KK.mode==="quiet")return;          /* (4b) «calladita»: ni travesuras ni escenas espontáneas */
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

  window.KXK3={state:S3,THROW_V,
    bg:()=>canAct()?bgPrank():Promise.resolve(false),
    close:()=>canAct()?closePrank():Promise.resolve(false),
    scene:t=>scene((SC[t]||SC[pickType()])()),
    fall:()=>fallOff("drag"),
    mood,
    plan:v=>{if(v!=null){S3.plan=v|0;save();}return S3.plan;},
    thr:(bg,cl)=>{if(bg!=null)thrBg=bg;if(cl!=null)thrCl=cl;sess=Math.max(sess,180000);gapUntil=0;}};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 3:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
