/* Música original generada en el navegador (Web Audio): sin archivos ni derechos de autor.  (parte 8: motor nuevo)
   · Mundo PIXEL → chiptune suave: melodía de pulso redondeado, arpegio de pluma, bajo triangular y percusión muy ligera.
   · Mundo XP    → chillout de principios de los 2000: piano eléctrico, campanitas de cristal, colchón de sintetizador, bajo cálido y ritmo relajado.
   Cada fondo/estación y cada día/noche tiene su pieza (30 en total). Las melodías se componen solas con una semilla fija:
   siempre suenan igual, pero van cambiando por secciones (16 compases) y no se repiten pesadamente.
   Mejoras frente a la versión anterior: reverb, eco suave, filtro cálido, compresor, ritmo "humano" y notas con ataque/caída naturales. */
(function(){
"use strict";
const root=document.documentElement,LSK="kixki-mus";
let ac,fg,E,timer,on=false,cur=null,next=0,bar=0,sw,stT;
const N=m=>440*Math.pow(2,(m-69)/12);
const rng=s=>()=>{s|=0;s=s+1831565813|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
/* acordes (semitonos sobre la fundamental) y escalas */
const Q={t:[0,4,7],n:[0,3,7],M:[0,4,7,11],m:[0,3,7,10],d:[0,4,7,10],M9:[0,4,7,11,14],m9:[0,3,7,10,14],s:[0,5,7,10],M6:[0,4,7,9]};
const SC={maj:[0,2,4,5,7,9,11],pen:[0,2,4,7,9],lyd:[0,2,4,6,7,9,11],dor:[0,2,3,5,7,9,10],min:[0,2,3,5,7,8,10],pmi:[0,3,5,7,10],har:[0,2,3,5,7,8,11]};
/* ritmos de la melodía: 16 posiciones (2 compases en corcheas); 3 densidades */
const RT=[[[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],[1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0]],
 [[1,0,0,1,0,0,1,0,1,0,0,0,1,0,0,0],[1,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0],[1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0]],
 [[1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,0],[1,1,0,1,0,1,0,0,1,0,1,1,0,0,1,0]]];
/* percusión: pasos = corcheas del compás (0..7). k bombo · r toque seco · h charles · sh shaker · sl cascabeles */
const DR={px:{k:[0,4],r:[[2,.5],[6,.5]],h:[[1,.6],[3,.6],[5,.6],[7,.6]]},pxs:{k:[0],r:[[6,.45]],h:[[2,.5],[6,.5]]},
 chill:{k:[0,[5,.8]],r:[[4,.7]],sh:[[0,.5],[1,.8],[2,.5],[3,.8],[4,.5],[5,.8],[6,.5],[7,.8]]},chills:{k:[0],r:[[4,.5]],sh:[[1,.7],[3,.7],[5,.7],[7,.7]]},
 bossa:{k:[0,[3,.8],[6,.8]],r:[[2,.6],[5,.6],[7,.5]],sh:[[0,.5],[1,.7],[2,.5],[3,.7],[4,.5],[5,.7],[6,.5],[7,.7]]},
 bell:{k:[0],sl:[[0,.7],[2,.5],[4,.7],[6,.5]]},bells:{sl:[[0,.5],[4,.5]]},heart:{k:[0,[1,.55]]}};
const BASE={sc:"maj",lead:"pulse",lv:.3,den:1,sus:1.3,pad:0,bass:"tri",bv:.2,arp:0,av:.12,ap:[0,1,2,3,2,1,2,1],dr:null,dv:1,sw:0,dl:.2,rv:.25,seed:1,key:60,bpm:100,lo:64,hi:84,ao:12,sp:0,lp:6000};
/* ───────────── PIXEL ───────────── */
const PXD={
 classic:{bpm:102,key:60,sc:"pen",prog:[[0,"t"],[7,"t"],[9,"n"],[5,"t"]],prog2:[[9,"n"],[5,"t"],[0,"t"],[7,"d"]],lead:"pulse",arp:"pluck",pad:.04,dr:DR.px,seed:3,den:1},
 valle:{bpm:96,key:62,sc:"maj",prog:[[0,"t"],[5,"t"],[7,"t"],[9,"n"]],prog2:[[5,"t"],[7,"t"],[4,"n"],[9,"n"]],lead:"pluck",lv:.34,arp:"pluck",pad:.05,dr:DR.pxs,seed:7,den:1},
 primavera:{bpm:112,key:67,sc:"lyd",prog:[[0,"t"],[4,"n"],[5,"t"],[7,"t"]],prog2:[[9,"n"],[5,"t"],[0,"t"],[7,"t"]],lead:"bell",lv:.3,arp:"pluck",pad:.04,dr:DR.px,seed:11,den:2,sp:.3},
 verano:{bpm:116,key:65,sc:"maj",prog:[[0,"t"],[5,"t"],[7,"d"],[0,"t"]],prog2:[[2,"n"],[7,"d"],[0,"t"],[5,"t"]],lead:"pulse",lv:.28,arp:"pluck",pad:.03,dr:DR.px,seed:13,den:2,ap:[0,2,1,3,0,2,1,3]},
 otono:{bpm:88,key:57,sc:"dor",prog:[[0,"n"],[5,"t"],[3,"t"],[7,"d"]],prog2:[[0,"n"],[10,"t"],[5,"t"],[7,"d"]],lead:"pluck",lv:.36,arp:"pluck",pad:.05,dr:DR.pxs,seed:17,den:1},
 invierno:{bpm:76,key:64,sc:"maj",prog:[[0,"t"],[9,"n"],[5,"t"],[7,"t"]],prog2:[[5,"t"],[0,"t"],[2,"n"],[7,"t"]],lead:"bell",lv:.34,arp:"bell",av:.1,pad:.07,dr:null,seed:19,den:0,sus:2,ap:[0,-1,2,-1,1,-1,3,-1]},
 halloween:{bpm:86,key:57,sc:"har",prog:[[0,"n"],[8,"t"],[7,"d"],[0,"n"]],prog2:[[5,"n"],[3,"t"],[7,"d"],[0,"n"]],lead:"vib",lv:.26,arp:"pluck",pad:.05,dr:DR.heart,seed:23,den:0,sus:2,ap:[0,-1,1,-1,2,-1,1,-1]},
 navidad:{bpm:100,key:60,sc:"maj",prog:[[0,"t"],[9,"n"],[2,"n"],[7,"d"]],prog2:[[5,"t"],[7,"d"],[0,"t"],[0,"t"]],lead:"bell",lv:.32,arp:"bell",av:.11,pad:.04,dr:DR.bell,seed:29,den:1,sp:.35}};
const PXN={
 classic:{bpm:78,key:57,sc:"pmi",prog:[[0,"n"],[8,"t"],[3,"t"],[10,"t"]],prog2:[[5,"n"],[3,"t"],[10,"t"],[7,"d"]],lead:"ep",lv:.3,pad:.07,dr:DR.pxs,ap:[0,-1,1,-1,2,-1,1,-1],seed:5},
 valle:{bpm:72,key:62,sc:"pen",prog:[[0,"t"],[7,"t"],[9,"n"],[5,"t"]],prog2:[[5,"t"],[0,"t"],[7,"t"],[4,"n"]],lead:"bell",lv:.3,pad:.08,dr:null,ap:[0,-1,2,-1,1,-1,3,-1],seed:8,den:0},
 primavera:{bpm:80,key:67,sc:"pen",prog:[[0,"t"],[4,"n"],[5,"t"],[7,"t"]],lead:"ep",lv:.3,pad:.07,dr:null,ap:[0,-1,2,-1,1,-1,3,-1],seed:12,den:0,sp:.4},
 verano:{bpm:84,key:65,sc:"pen",prog:[[0,"t"],[5,"t"],[2,"n"],[7,"d"]],lead:"ep",lv:.3,pad:.07,dr:DR.chills,seed:14,den:1},
 otono:{bpm:68,key:57,sc:"pmi",prog:[[0,"n"],[5,"t"],[3,"t"],[7,"d"]],lead:"ep",lv:.32,pad:.08,dr:null,ap:[0,-1,1,-1,2,-1,1,-1],seed:18,den:0},
 invierno:{bpm:60,key:64,sc:"pen",prog:[[0,"t"],[9,"n"],[5,"t"],[7,"t"]],lead:"bell",lv:.32,pad:.09,dr:null,arp:0,seed:20,den:0,sus:2.4,sp:.5},
 halloween:{bpm:72,key:57,sc:"har",prog:[[0,"n"],[8,"t"],[7,"d"],[0,"n"]],lead:"vib",lv:.26,pad:.08,dr:DR.heart,arp:0,seed:24,den:0,sus:2.4,sp:.4},
 navidad:{bpm:80,key:60,sc:"maj",prog:[[0,"t"],[9,"n"],[2,"n"],[7,"d"]],lead:"bell",lv:.3,pad:.07,dr:DR.bells,arp:"bell",av:.09,ap:[0,-1,-1,-1,2,-1,-1,-1],seed:30,den:0,sp:.4}};
/* ───────────── XP (chillout de los 2000) ───────────── */
const XB={lead:"ep",lv:.3,pad:.07,bass:"sub",bv:.22,arp:0,sc:"maj",dr:DR.chill,sw:.35,dl:.28,rv:.4,sp:.45,sus:1.5,lp:4600,lo:62,hi:86};
const XPD={
 clasica:{bpm:84,key:60,prog:[[0,"M9"],[9,"m9"],[5,"M9"],[7,"d"]],prog2:[[2,"m9"],[7,"d"],[4,"m"],[9,"m9"]],seed:31,den:1},
 primavera:{bpm:92,key:62,sc:"lyd",prog:[[0,"M9"],[4,"m"],[5,"M9"],[7,"M6"]],prog2:[[9,"m"],[5,"M9"],[0,"M9"],[7,"M6"]],seed:32,den:1,sp:.6},
 verano:{bpm:100,key:65,dr:DR.bossa,prog:[[0,"M9"],[5,"M9"],[2,"m9"],[7,"d"]],prog2:[[9,"m9"],[2,"m9"],[7,"d"],[0,"M9"]],seed:33,den:1,sw:.2},
 otono:{bpm:76,key:57,sc:"dor",prog:[[0,"m9"],[5,"M9"],[3,"M9"],[7,"d"]],prog2:[[0,"m9"],[10,"M9"],[5,"M9"],[7,"d"]],seed:34,den:1,dr:DR.chills},
 invierno:{bpm:66,key:60,prog:[[0,"M9"],[4,"m"],[5,"M9"],[9,"m9"]],prog2:[[5,"M9"],[7,"d"],[9,"m9"],[0,"M9"]],seed:35,den:0,dr:null,pad:.1,sus:2.4,sp:.6,lead:"bell"},
 halloween:{bpm:74,key:57,sc:"har",prog:[[0,"m"],[8,"M"],[7,"d"],[0,"m"]],prog2:[[5,"m"],[3,"M"],[7,"d"],[0,"m"]],seed:36,den:0,dr:DR.heart,lead:"vib",lv:.24,pad:.09,sus:2.4,sp:.5},
 navidad:{bpm:88,key:60,prog:[[0,"M"],[9,"m"],[2,"m"],[7,"d"]],prog2:[[5,"M"],[7,"d"],[4,"m"],[0,"M"]],seed:37,den:1,dr:DR.bell,lead:"bell",lv:.32,sp:.5}};
const mk=(b,o)=>Object.assign({},BASE,b||{},o);
const PX={},XP={};
for(const k in PXD)PX[k]={day:mk(0,PXD[k]),night:mk(0,Object.assign({},PXD[k],PXN[k]))};
for(const k in XPD)XP[k]={day:mk(XB,XPD[k]),night:null};
for(const k in XP){const d=XP[k].day;XP[k].night=mk(XB,Object.assign({},XPD[k],{bpm:Math.round(d.bpm*.82),dr:d.dr&&(d.dr===DR.chill||d.dr===DR.bossa)?DR.chills:d.dr===DR.bell?DR.bells:d.dr,lv:d.lv*.9,pad:d.pad*1.25,lp:3800,den:Math.max(0,d.den-1),seed:d.seed+50,key:d.key-(d.key>62?5:0)}));}
PX.vacas=PX.classic;
const pick=()=>{const bg=root.getAttribute("data-bg"),nt=root.getAttribute("data-theme")==="dark"?"night":"day";
  if(bg==="xp"){const s=root.getAttribute("data-xps");return(XP[XP[s]?s:"clasica"])[nt];}
  return(PX[bg]||PX.classic)[nt];};
/* ───────────── motor ───────────── */
function engine(c,dest){
  const mix=c.createGain(),comp=c.createDynamicsCompressor(),lp=c.createBiquadFilter(),rv=c.createConvolver(),rg=c.createGain(),
    dl=c.createDelay(1.5),ds=c.createGain(),df=c.createGain(),dlp=c.createBiquadFilter(),nb=c.createBuffer(1,c.sampleRate,c.sampleRate),pw={};
  comp.threshold.value=-20;comp.ratio.value=3;comp.attack.value=.02;comp.release.value=.35;lp.type="lowpass";lp.frequency.value=6000;lp.Q.value=.25;
  mix.connect(comp);comp.connect(lp);lp.connect(dest);
  const len=c.sampleRate*2.8|0,ir=c.createBuffer(2,len,c.sampleRate);
  for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);let v=0;for(let i=0;i<len;i++){v+=((Math.random()*2-1)-v)*.3;d[i]=v*Math.pow(1-i/len,3.4)*1.6;}}
  rv.buffer=ir;rg.gain.value=.25;mix.connect(rv);rv.connect(rg);rg.connect(lp);
  dlp.type="lowpass";dlp.frequency.value=2400;df.gain.value=.38;ds.gain.value=.2;mix.connect(ds);ds.connect(dl);dl.connect(dlp);dlp.connect(df);df.connect(dl);dlp.connect(lp);
  {const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
  const G=(v,d)=>{const g=c.createGain();g.gain.value=v;g.connect(d||mix);return g;};
  const env=(g,t,a,d,v)=>{g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);};
  const osc=(type,f,t,d,dst)=>{const o=c.createOscillator();o.type=type;o.frequency.value=f;o.connect(dst);o.start(t);o.stop(t+d+.06);return o;};
  const F=(type,f,q,dst)=>{const b=c.createBiquadFilter();b.type=type;b.frequency.value=f;b.Q.value=q;b.connect(dst);return b;};
  const wave=w=>pw[w]||(()=>{const n=24,re=new Float32Array(n),im=new Float32Array(n);for(let k=1;k<n;k++)re[k]=2/(k*Math.PI)*Math.sin(k*Math.PI*w);return pw[w]=c.createPeriodicWave(re,im);})();
  const vib=(o,t,d,cents,hz)=>{const l=c.createOscillator(),g=c.createGain();l.frequency.value=hz;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(cents,t+Math.min(d*.7,.5));l.connect(g);g.connect(o.detune);l.start(t);l.stop(t+d+.06);};
  const noise=(t,d,v,type,f,q,a)=>{const s=c.createBufferSource(),g=G(0);s.buffer=nb;s.connect(F(type,f,q,g));env(g,t,a||.002,d,v);s.start(t,Math.random()*.5,d+.05);};
  const V={
    ep(f,t,d,v){[[1,1,d],[2,.26,d*.5],[4,.06,d*.22],[7,.03,.1]].forEach(([m,a,dd])=>{const g=G(0);env(g,t,.006,dd,v*a);osc("sine",f*m,t,dd+.02,g);});},
    bell(f,t,d,v){[[1,1,1],[2.76,.38,.55],[5.4,.16,.3],[8.9,.06,.16]].forEach(([m,a,k])=>{const g=G(0);env(g,t,.004,d*k,v*a);osc("sine",f*m,t,d*k+.02,g);});},
    pluck(f,t,d,v){const g=G(0),fl=F("lowpass",3200,.7,g);fl.frequency.setValueAtTime(3200,t);fl.frequency.exponentialRampToValueAtTime(500,t+d*.6);env(g,t,.004,d,v);osc("triangle",f,t,d,fl);},
    pulse(f,t,d,v){const g=G(0),fl=F("lowpass",2400,.5,g),o=c.createOscillator();o.setPeriodicWave(wave(.25));o.frequency.value=f;o.connect(fl);o.start(t);o.stop(t+d+.06);env(g,t,.012,d,v);vib(o,t,d,8,5.3);},
    vib(f,t,d,v){const g=G(0),o=osc("sine",f,t,d+.2,g);env(g,t,.18,d,v*1.1);vib(o,t,d+.2,24,5.6);const g2=G(0);env(g2,t,.2,d,v*.18);osc("sine",f*2,t,d,g2);},
    pad(fs,t,d,v){fs.forEach(f=>{[-6,6].forEach(dt=>{const g=G(0),fl=F("lowpass",1000,.3,g),o=osc("sawtooth",f,t,d+1,fl);o.detune.value=dt;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v/fs.length,t+.7);g.gain.setValueAtTime(v/fs.length,t+d);g.gain.linearRampToValueAtTime(.0001,t+d+.9);});});},
    sub(f,t,d,v){const g=G(0);env(g,t,.015,d,v);osc("sine",f,t,d,g);const g2=G(0);env(g2,t,.01,d*.5,v*.5);osc("triangle",f*2,t,d,g2);},
    tri(f,t,d,v){const g=G(0);env(g,t,.008,d,v);osc("triangle",f,t,d,g);},
    kick(t,v){const g=G(0),o=osc("sine",130,t,.3,g);o.frequency.exponentialRampToValueAtTime(46,t+.12);env(g,t,.002,.24,v);},
    hat(t,v){noise(t,.045,v*.18,"highpass",7500,.5);},
    sh(t,v){noise(t,.08,v*.2,"bandpass",5200,1.2,.012);},
    rim(t,v){noise(t,.06,v*.2,"bandpass",1900,2.2);const g=G(0);env(g,t,.002,.06,v*.1);osc("sine",330,t,.06,g);},
    sl(t,v){[3300,4100,5200,6100].forEach(f=>{const g=G(0);env(g,t,.003,.28,v*.05);osc("sine",f*(1+Math.random()*.01),t,.3,g);});noise(t,.1,v*.08,"highpass",6000,.6,.004);}};
  const DRV={k:"kick",r:"rim",h:"hat",sh:"sh",sl:"sl"};
  let ph=null;
  function phrase(P,s,pr){
    const sec=s>>2,pair=(s>>1)&1,r=rng(P.seed*977+pair+[0,pair?30:0,10,pair?40:0][sec]),sc=SC[P.sc],pool=[];
    for(let n=P.lo;n<=P.hi;n++)if(sc.includes(((n-P.key)%12+12)%12))pool.push(n);
    const tp=RT[Math.min(2,P.den)],pat=tp[(r()*tp.length)|0],out=[],ca=pr[(s&3)],cb=pr[((s+1)&3)];
    let idx=(pool.length*.45)|0,last=-1;
    for(let k=0;k<16;k++){if(!pat[k])continue;const ch=k<8?ca:cb,pcs=Q[ch[1]].map(i=>(P.key+ch[0]+i)%12);
      if(k%4===0){let best=idx,bd=99;for(let j=0;j<pool.length;j++){const d=Math.abs(j-idx)+(pcs.includes(pool[j]%12)?0:5)+(j===last?2:0);if(d<bd){bd=d;best=j;}}idx=best;}
      else{idx+=[-2,-1,-1,1,1,2][(r()*6)|0];if(idx>pool.length*.8)idx-=2;if(idx<pool.length*.1)idx+=2;idx=Math.max(0,Math.min(pool.length-1,idx));}
      last=idx;out.push([k,pool[idx],idx]);}
    if(pair===1&&out.length){let b=out[out.length-1][2],bd=99;pool.forEach((n,j)=>{const d=Math.abs(j-out[out.length-1][2])+((n-P.key)%12===0?0:3);if(d<bd){bd=d;b=j;}});out[out.length-1][1]=pool[b];}
    return out;}
  return{
    set(P){dl.delayTime.value=60/P.bpm*.75;ds.gain.value=P.dl;rg.gain.value=P.rv;lp.frequency.value=P.lp;ph=null;},
    bar(P,b,t){
      const sp=60/P.bpm,e=sp/2,s=b%16,sec=s>>2,pr=(sec===2&&P.prog2)||P.prog,ch=pr[s&3],rt=P.key+ch[0],iv=Q[ch[1]],intro=b<4;
      const at=st=>t+st*e+(st&1?e*P.sw*.33:0)+(Math.random()-.5)*.012,vr=()=>.86+Math.random()*.28;
      if(P.pad){const vo=iv.map(i=>{let n=rt+i;while(n<54)n+=12;while(n>=72)n-=12;return N(n);});V.pad(vo,t,sp*4,P.pad*1.5);}
      if(P.bass){let r=rt;while(r>=53)r-=12;while(r<41)r+=12;(P.bp||[[0,0,3],[3,0,2],[6,7,2]]).forEach(([st,i,l])=>V[P.bass](N(r+i),at(st),l*e*1.1,P.bv*vr()));}
      if(P.arp&&!intro){const tn=iv.slice(0,4).map(i=>{let n=rt+i+P.ao;while(n<57)n+=12;while(n>=79)n-=12;return n;});
        P.ap.forEach((a,st)=>{if(a>=0)V[P.arp](N(tn[a%tn.length]),at(st),e*(P.arp==="bell"?5:1.6),P.av*vr());});}
      if(P.dr)for(const k in P.dr)P.dr[k].forEach(x=>{const st=typeof x==="number"?x:x[0],v=typeof x==="number"?1:x[1];V[DRV[k]](at(st),v*vr());});
      if(!intro){if((s&1)===0)ph=phrase(P,s,pr);
        if(ph)ph.forEach(([k,n],i)=>{if((k>>3)!==(s&1))return;const nx=ph[i+1],l=Math.min(nx?nx[0]-k:6,5);V[P.lead](N(n),at(k&7),Math.max(.25,l*e*P.sus),P.lv*1.45*vr());});
        if(P.sp&&Math.random()<P.sp){const tn=iv[(Math.random()*iv.length)|0];let n=rt+tn+24;while(n>96)n-=12;V.bell(N(n),at([2,4,6][(Math.random()*3)|0]),sp*3,P.lv*.7);}}}
  };}
/* ───────────── reproducción ───────────── */
function tick(){const P=cur;if(!P||!E)return;while(next<ac.currentTime+.9){E.bar(P,bar++,next);next+=240/P.bpm;}}
function fade(v,s){if(!ac||!fg)return;const t=ac.currentTime;fg.gain.cancelScheduledValues(t);fg.gain.setValueAtTime(fg.gain.value,t);fg.gain.linearRampToValueAtTime(v,t+s);}
function begin(n){cur=n;bar=0;if(E)E.set(n);if(ac)next=ac.currentTime+.08;}
/* Cambio de fondo/estación/tema: baja el volumen, cambia de pieza y vuelve a subirlo (sin cortes si no cambió nada) */
function theme(){const n=pick();if(n===cur)return;
  if(!cur||!on){cur=n;return;}
  clearTimeout(sw);fade(0,.8);
  sw=setTimeout(()=>{if(!on)return;const q=pick();if(q!==cur)begin(q);fade(1,1.6);},860);}
function start(){
  if(on&&timer)return;
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  if(!fg){fg=ac.createGain();fg.gain.value=0;const m=ac.createGain();m.gain.value=.42;fg.connect(m);m.connect(ac.destination);E=engine(ac,fg);}
  clearTimeout(stT);clearTimeout(sw);cur=null;on=false;theme();ac.resume();on=true;begin(cur||pick());
  clearInterval(timer);timer=setInterval(tick,150);fade(1,1.2);}
function stop(){on=false;clearInterval(timer);timer=0;clearTimeout(sw);fade(0,.5);clearTimeout(stT);stT=setTimeout(()=>{if(!on&&ac)ac.suspend();},650);}
new MutationObserver(theme).observe(root,{attributes:true,attributeFilter:["data-theme","data-bg","data-xps"]});
document.addEventListener("visibilitychange",()=>{if(!ac||!on)return;document.hidden?ac.suspend():ac.resume();});
/* _render: para probar sin altavoces (devuelve un WAV 16 bits en base64) */
async function render(bg,xps,night,secs,sr){const P=(bg==="xp"?(XP[xps]||XP.clasica):(PX[bg]||PX.classic))[night?"night":"day"];
  const oc=new OfflineAudioContext(2,sr*secs,sr),g=oc.createGain();g.gain.value=.42;g.connect(oc.destination);const en=engine(oc,g);en.set(P);
  const bl=240/P.bpm;for(let b=0,t=.05;t<secs;b++,t+=bl)en.bar(P,b,t);
  const buf=await oc.startRendering(),L=buf.getChannelData(0),R=buf.getChannelData(1),n=L.length,u=new DataView(new ArrayBuffer(44+n*4));
  const w=(o,s)=>[...s].forEach((c,i)=>u.setUint8(o+i,c.charCodeAt(0)));w(0,"RIFF");u.setUint32(4,36+n*4,true);w(8,"WAVEfmt ");u.setUint32(16,16,true);u.setUint16(20,1,true);u.setUint16(22,2,true);u.setUint32(24,sr,true);u.setUint32(28,sr*4,true);u.setUint16(32,4,true);u.setUint16(34,16,true);w(36,"data");u.setUint32(40,n*4,true);
  for(let i=0;i<n;i++){u.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]))*32767,true);u.setInt16(46+i*4,Math.max(-1,Math.min(1,R[i]))*32767,true);}
  let s="";const by=new Uint8Array(u.buffer);for(let i=0;i<by.length;i+=8192)s+=String.fromCharCode.apply(null,by.subarray(i,i+8192));return btoa(s);}
window.KXM={get on(){return on;},toggle(){on?stop():start();try{localStorage.setItem(LSK,on?"1":"0");}catch(e){}return on;},_render:render,_pieces:()=>({px:Object.keys(PX),xp:Object.keys(XP)})};
try{const sv=localStorage.getItem(LSK);if(sv==="1"||sv===null){on=true;let g=0;const go=()=>{if(g||!on)return;g=1;start();};/* sin guardado = música activada; el navegador exige un toque o tecla para dejarla sonar */addEventListener("pointerdown",go,{once:true});addEventListener("keydown",go,{once:true});}}catch(e){}
})();
