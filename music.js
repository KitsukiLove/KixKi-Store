/* Música original generada en el navegador (Web Audio), sin archivos de audio ni derechos de autor.
   Día: pentatónica mayor, alegre y tranquila. Noche: pentatónica menor, lenta y suave. */
(function(){
const root=document.documentElement,LSK="kixki-mus";
let ac,mg,timer,on=false,step=0,next=0,mode="day";
const N=m=>440*Math.pow(2,(m-69)/12),rnd=Math.random;
const PRG={
 day:{e:.4,k:60,s:[0,2,4,7,9],c:[{r:48,t:[0,4,7]},{r:45,t:[0,3,7]},{r:41,t:[0,4,7]},{r:43,t:[0,4,7]}]},
 night:{e:.65,k:57,s:[0,3,5,7,10],c:[{r:45,t:[0,3,7]},{r:41,t:[0,4,7]},{r:48,t:[0,4,7]},{r:43,t:[0,4,7]}]}
};
function tone(f,t,d,type,v){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05);}
function tick(){const P=PRG[mode];
  while(next<ac.currentTime+.4){const b=P.c[(step>>3)%4],s=step%8;
    if(s===0)tone(N(b.r),next,P.e*7,"triangle",.5);
    tone(N(b.r+12+b.t[[0,1,2,1,0,1,2,1][s]]+(s%4===3?12:0)),next,P.e*1.6,"square",.06);
    if((s===0||s===3||s===6)&&rnd()<.7)tone(N(P.k+12+P.s[(rnd()*5)|0]),next,P.e*3,"triangle",.2);
    next+=P.e;step++;}}
function theme(){const m=root.getAttribute("data-theme")==="dark"?"night":"day";if(m!==mode){mode=m;step=0;}}
function start(){if(on&&ac&&ac.state!=="closed"){ac.resume();return;}
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  if(!mg){mg=ac.createGain();mg.gain.value=.16;const d=ac.createDelay(),f=ac.createGain();d.delayTime.value=.42;f.gain.value=.35;
    mg.connect(ac.destination);mg.connect(d);d.connect(f);f.connect(d);d.connect(ac.destination);}
  theme();ac.resume();on=true;next=ac.currentTime+.1;clearInterval(timer);timer=setInterval(tick,120);}
function stop(){on=false;clearInterval(timer);if(ac)ac.suspend();}
new MutationObserver(theme).observe(root,{attributes:true,attributeFilter:["data-theme"]});
document.addEventListener("visibilitychange",()=>{if(!ac||!on)return;document.hidden?ac.suspend():ac.resume();});
window.KXM={get on(){return on;},toggle(){on?stop():start();try{localStorage.setItem(LSK,on?"1":"0");}catch(e){}return on;}};
try{if(localStorage.getItem(LSK)==="1"){on=true;addEventListener("pointerdown",()=>{if(on)start();},{once:true});}}catch(e){}
})();
