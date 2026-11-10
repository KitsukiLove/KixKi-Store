/* =========================================================
   KIXKI · etapa 4 · pedirle consejo sobre una carpeta
   - Mantén pulsada una carpeta (~500 ms; en PC también clic derecho, en móvil la ficha de la carpeta) y aparece
     el botón flotante «🐑 Pedir ayuda a Kixki» junto al icono.
   - Al pulsarlo, Kixki salta a esa carpeta (visitFolder) y da UN consejo propio de ella, distinto cada vez:
     escrito a mano (ADV.<carpeta> en dialogs.js) o armado con apps reales de esa carpeta (nombre, etiqueta, aviso).
   - Detalles: el clic que sigue a mantener pulsado NO abre la carpeta · si el dedo se mueve (scroll) se cancela ·
     el menú contextual del móvil queda desactivado en las carpetas · teclado: tecla de menú o Mayús + F10 sobre una
     carpeta enfocada · lectores de pantalla: el botón recibe el foco, Esc lo cierra y devuelve el foco.
   - Sin llamadas externas (la CSP no las permite). Memoria propia en localStorage («kixki-k4»).
   - Avisa con el evento «advice» (e.detail = {id, n, count, total}); kixki2.js lo cuenta para los logros
     «Consejera» (3 carpetas) y «Sabelotodo» (todas).
   - En la consola: KXK4.open("privacidad") · KXK4.ask("privacidad") · KXK4.advice("fotos") · KXK4.state
   Se apoya en kixki.js (KXK) y dialogs.js (KXD.ADV).
   ========================================================= */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const now=()=>Date.now();

/* ---------- memoria ---------- */
const LSK="kixki-k4",D0={v:1,asked:{},total:0};
let S4;try{S4=Object.assign({},D0,JSON.parse(localStorage.getItem(LSK)||"{}"));if(!S4.asked||typeof S4.asked!=="object")S4.asked={};}catch(e){S4=Object.assign({},D0);}
const save=()=>{try{localStorage.setItem(LSK,JSON.stringify(S4));}catch(e){}};

/* ---------- textos de la interfaz [español, English] (los consejos viven en dialogs.js → ADV) ---------- */
const UI={
 ask:["Pedir ayuda a Kixki","Ask Kixki for help"],
 group:["Kixki, tu guía","Kixki, your guide"],
 hint:["Mantén pulsada la carpeta (o pulsa Mayús + F10) para pedirle ayuda a Kixki sobre ella.","Hold the folder down (or press Shift + F10) to ask Kixki for help with it."]
};

function boot(){
  if(window.KXK4||!window.KXK)return;
  const KK=KXK,K=KK.K,S=KK.state,ADV=(KK.D&&KK.D.ADV)||{};
  const L=()=>window.KXI&&KXI.lang==="en"?1:0;
  const RM=()=>matchMedia("(prefers-reduced-motion:reduce)").matches;
  const desk=$("#desk");if(!desk)return;
  const HOLD=500,MOVE_MOUSE=6,MOVE_TOUCH=10;
  const ready=()=>!!S.on&&KK.ready&&!K.off&&!K.game;
  const foldIds=()=>$$("#app .cat").map(e=>e.id);

  /* ---------- botón flotante ---------- */
  const pop=document.createElement("div");
  pop.id="kc-pop";pop.className="kc-pop";pop.setAttribute("role","group");pop.hidden=true;
  pop.innerHTML=`<button type="button" class="kc-ask"><span class="kc-em" aria-hidden="true">🐑</span> <span class="kc-t"></span></button>`;
  const askBtn=$(".kc-ask",pop),askTx=$(".kc-t",pop);
  const hint=document.createElement("span");hint.id="kc-hint";hint.className="kk-sr";
  document.body.append(pop,hint);
  function labels(){
    const l=L();askTx.textContent=UI.ask[l];pop.setAttribute("aria-label",UI.group[l]);hint.textContent=UI.hint[l];
    $$(".di",desk).forEach(d=>d.setAttribute("aria-describedby","kc-hint"));
  }
  labels();
  if(window.KXI&&!KXI._k4){KXI._k4=1;const o=KXI.set;KXI.set=function(l){o.call(KXI,l);labels();closePop();};}

  /* ---------- abrir / cerrar ---------- */
  const O={id:null,el:null,at:0,viaKey:false,autoT:0};
  function place(di){
    const r=di.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight,vw=innerWidth,vh=innerHeight,gap=8;
    let x,y;
    if(r.right+gap+w<=vw-8){x=r.right+gap;y=r.top+(r.height-h)/2;}              /* a la derecha del icono (PC) */
    else{
      x=r.left+(r.width-w)/2;
      y=r.top-h-gap>=8?r.top-h-gap:r.bottom+gap;                                 /* encima (o debajo si no cabe) en las fichas del móvil */
    }
    x=Math.max(8,Math.min(vw-8-w,x));y=Math.max(8,Math.min(vh-8-h,y));
    pop.style.left=Math.round(x)+"px";pop.style.top=Math.round(y)+"px";
  }
  function openPop(di,viaKey){
    if(!di||!ready())return false;
    const id=di.dataset.id;
    if(O.id===id&&!pop.hidden){if(viaKey)askBtn.focus({preventScroll:true});return true;}
    closePop(true);
    O.id=id;O.el=di;O.at=now();O.viaKey=!!viaKey;
    di.classList.add("kc-on");
    pop.hidden=false;place(di);
    try{askBtn.focus({preventScroll:true});}catch(e){}                           /* el lector de pantalla lo anuncia al recibir el foco */
    try{if(navigator.vibrate)navigator.vibrate(12);}catch(e){}
    clearTimeout(O.autoT);O.autoT=setTimeout(function tick(){
      if(pop.hidden)return;
      if(!ready()){closePop();return;}
      if(pop.contains(document.activeElement)){O.autoT=setTimeout(tick,3000);return;}   /* con el foco dentro no se esconde sola */
      closePop();
    },9000);
    return true;
  }
  function closePop(silent){
    clearTimeout(O.autoT);
    const hadFocus=pop.contains(document.activeElement),el=O.el;
    if(el)el.classList.remove("kc-on");
    pop.hidden=true;O.id=null;O.el=null;
    if(hadFocus&&el&&el.isConnected&&!silent){try{el.focus({preventScroll:true});}catch(e){}}
  }

  /* ---------- mantener pulsado ---------- */
  const P={t:0,v:0,di:null,x:0,y:0,touch:false,fired:false,pid:null};
  let swallow=0;
  function cancelPress(){
    clearTimeout(P.t);clearTimeout(P.v);
    if(P.di)P.di.classList.remove("kc-press");
    P.di=null;P.pid=null;
  }
  desk.addEventListener("pointerdown",e=>{
    if(e.button||!e.isPrimary)return;                                           /* solo el botón principal / un dedo */
    const di=e.target.closest&&e.target.closest(".di");if(!di||!ready()){cancelPress();return;}
    cancelPress();
    P.di=di;P.x=e.clientX;P.y=e.clientY;P.touch=e.pointerType!=="mouse";P.fired=false;P.pid=e.pointerId;
    P.v=setTimeout(()=>{if(P.di===di)di.classList.add("kc-press");},170);        /* el aro de «mantén» solo se ve si sigues pulsando */
    P.t=setTimeout(()=>{
      if(P.di!==di)return;
      P.fired=true;swallow=now()+1500;di.classList.remove("kc-press");
      openPop(di,false);
    },HOLD);
  });
  addEventListener("pointermove",e=>{
    if(!P.di||e.pointerId!==P.pid||P.fired)return;
    if(Math.hypot(e.clientX-P.x,e.clientY-P.y)>(P.touch?MOVE_TOUCH:MOVE_MOUSE))cancelPress();   /* el dedo se movió (scroll): cancelar */
  },true);
  const up=e=>{
    if(!P.di||e.pointerId!==P.pid)return;
    const fired=P.fired;cancelPress();
    if(fired)setTimeout(()=>{swallow=0;},700);                                  /* el clic que sigue ya no abrirá la carpeta */
    else swallow=0;
  };
  addEventListener("pointerup",up,true);addEventListener("pointercancel",e=>{if(P.di&&e.pointerId===P.pid&&!P.fired)cancelPress();else up(e);},true);
  /* el «click» posterior a mantener pulsado no abre la carpeta (captura en window: va antes que app.js) */
  addEventListener("click",e=>{
    const di=e.target&&e.target.closest&&e.target.closest("#desk .di");
    if(di&&now()<swallow){swallow=0;e.stopImmediatePropagation();e.preventDefault();}
  },true);
  /* clic derecho / menú contextual del móvil / tecla de menú: en vez del menú del navegador, la ayuda de Kixki */
  desk.addEventListener("contextmenu",e=>{
    const di=e.target.closest&&e.target.closest(".di");if(!di)return;
    e.preventDefault();
    if(!ready())return;
    if(e.pointerType==="touch"||P.fired||P.di===di)swallow=Math.max(swallow,now()+1500);
    openPop(di,e.pointerType==="");                                              /* pointerType "" = lo abrió el teclado */
  });
  /* teclado: tecla de menú o Mayús + F10 con una carpeta enfocada */
  desk.addEventListener("keydown",e=>{
    const di=e.target.closest&&e.target.closest(".di");if(!di)return;
    if(e.key==="ContextMenu"||(e.key==="F10"&&e.shiftKey)){e.preventDefault();openPop(di,true);}
  });
  /* dentro del botón */
  pop.addEventListener("keydown",e=>{
    if(e.key==="Escape"){e.preventDefault();e.stopPropagation();closePop();}
    else if(e.key==="Tab"){closePop(true);}
  });
  pop.addEventListener("focusout",e=>{
    const to=e.relatedTarget;
    if(!to||(!pop.contains(to)&&!(O.el&&O.el.contains(to))))setTimeout(()=>{if(!pop.contains(document.activeElement)&&!pop.hidden&&now()-O.at>400&&!O.viaKey)closePop(true);},0);
  });
  /* tocar fuera, desplazarse, redimensionar, cambiar de pestaña… */
  addEventListener("pointerdown",e=>{if(!pop.hidden&&!pop.contains(e.target))closePop(true);},true);
  addEventListener("scroll",()=>{if(!pop.hidden&&now()-O.at>450)closePop(true);},{passive:true,capture:true});
  addEventListener("resize",()=>{if(!pop.hidden)closePop(true);});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)closePop(true);});
  addEventListener("blur",()=>closePop(true));

  /* ---------- armar el consejo ---------- */
  const text=e=>e?e.textContent.replace(/\s+/g," ").trim():"";
  function folderApps(id){
    const out=[];
    $$(`#${CSS.escape(id)} .app`).forEach(a=>{
      if(a.hidden)return;
      const h=$("h3",a);if(!h)return;
      const tp=$(".tip span:last-child",a);
      out.push({a:text(h),t:text($(".tag",a)),tip:tp?text(tp):""});
    });
    return out;
  }
  const shuffle=l=>{const a=l.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const vars=raw=>[...String(raw).matchAll(/\{(\w+)\}/g)].map(m=>m[1]);
  /* una plantilla vale solo si todas sus variables tienen valor */
  const fits=(pair,v)=>vars(pair[0]).every(k=>v[k]!=null&&v[k]!=="");
  const fill=(pair,v)=>[KK.fmt(pair[0],v),KK.fmt(pair[1],v)];
  const pickFit=(list,key,v)=>{const ok=(list||[]).filter(p=>fits(p,v));return ok.length?KK.pick(ok,key):null;};

  function advice(id){
    const apps=folderApps(id),sh=shuffle(apps),t=$(`#${CSS.escape(id)} .tbt`);
    const v={carpeta:text(t).replace(/\.exe$/i,""),n:apps.length,a1:sh[0]&&sh[0].a,t1:sh[0]&&sh[0].t,a2:sh[1]&&sh[1].a,t2:sh[1]&&sh[1].t};
    let pair=null,vv=v;
    if(id==="favs")pair=apps.length?pickFit(ADV.favsN,"adv:favsN",v):KK.pick(ADV.favs0,"adv:favs0");
    else if(id==="news")pair=apps.length?pickFit(ADV.newsN,"adv:newsN",v):KK.pick(ADV.news0,"adv:news0");
    else if(id==="packs")pair=pickFit(ADV.packs,"adv:packs",v);
    else{
      const withTip=apps.filter(x=>x.tip),r=Math.random(),hand=ADV[id];
      if(withTip.length&&r<.2){
        const w=withTip[Math.floor(Math.random()*withTip.length)];
        vv=Object.assign({},v,{a1:w.a,tip:w.tip});
        pair=pickFit(ADV.tipw,"adv:tipw",vv);
        if(!pair)vv=v;
      }
      if(!pair&&hand&&hand.length&&r<.7)pair=KK.pick(hand,"adv:"+id);
      if(!pair&&apps.length)pair=pickFit(ADV.gen,"adv:gen",v);
      if(!pair&&hand&&hand.length)pair=KK.pick(hand,"adv:"+id);
    }
    if(!pair)return null;
    return fill(pair,vv);
  }

  /* ---------- pedir ayuda ---------- */
  let tok=0;
  async function ask(id){
    closePop(true);
    if(!ready()||!foldIds().includes(id))return false;
    const line=advice(id);if(!line)return false;
    const my=++tok;
    KK.interrupt();K.tour=null;
    return KK.visitFolder(id,{line,p:3,cat:"ui",always:true,replace:true,ttl:15000,ctx:"advice",words:true,   /* pedir ayuda = permiso para hablar con texto, incluso en «calladita» */
      
      onStart:()=>{if(my===tok)record(id);}});
  }
  function record(id){
    S4.asked[id]=(S4.asked[id]|0)+1;S4.total=(S4.total|0)+1;save();
    const ids=foldIds();
    KK.emit("advice",{id,n:S4.asked[id],count:ids.filter(x=>S4.asked[x]).length,total:ids.length});
  }
  askBtn.addEventListener("click",e=>{
    e.stopPropagation();
    if(e.detail>0&&now()-O.at<350){e.preventDefault();return;}                               /* el dedo aún estaba levantándose: no cuenta */
    const id=O.id;if(id)ask(id);
  });

  /* ---------- Kixki enseña la función en sus consejos de siempre ---------- */
  try{
    const tips=KK.T&&KK.T.tips;
    if(tips&&ADV.hintPC)tips.push(...ADV.hintPC.map(t=>({pc:1,t})),...(ADV.hintMob||[]).map(t=>({mob:1,t})));
  }catch(e){}

  window.KXK4={state:S4,open:id=>openPop($(`#desk .di[data-id="${id}"]`),true),close:()=>closePop(),ask,advice,
    reset:()=>{S4.asked={};S4.total=0;save();}};
}
const run=()=>{try{boot();}catch(e){try{console.warn("Kixki 4:",e);}catch(_){}}};
window.KXK?run():addEventListener("kixki-ready",run,{once:true});
})();
