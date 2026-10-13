/* Música original generada en el navegador (Web Audio): sin archivos ni derechos de autor.
   Cambia según el fondo (Clásico, Valle, Halloween, Navidad) y según día/noche. */
(function(){
const root=document.documentElement,LSK="kixki-mus",T={M:[0,4,7],m:[0,3,7]};
let ac,mg,timer,on=false,step=0,next=0,cur=null;
const N=m=>440*Math.pow(2,(m-69)/12),rnd=Math.random;
const PM=[0,2,4,7,9],PE=[0,3,5,7,10],PH=[0,3,5,6,7,10];
const PRG={
 classic:{day:{e:.4,k:60,s:PM,w:"square",v:.05,c:[[48,"M"],[45,"m"],[41,"M"],[43,"M"]]},night:{e:.65,k:57,s:PE,w:"triangle",v:.07,c:[[45,"m"],[41,"M"],[48,"M"],[43,"M"]]}},
 valle:{day:{e:.36,k:62,s:PM,w:"triangle",v:.08,c:[[50,"M"],[45,"M"],[47,"m"],[43,"M"]]},night:{e:.6,k:65,s:PM,w:"sine",v:.09,c:[[41,"M"],[48,"M"],[38,"m"],[46,"M"]]}},
 halloween:{day:{e:.5,k:57,s:PH,w:"triangle",v:.07,c:[[45,"m"],[41,"M"],[45,"m"],[40,"M"]]},night:{e:.7,k:57,s:PH,w:"sine",v:.09,c:[[45,"m"],[41,"M"],[45,"m"],[40,"M"]]}},
 navidad:{day:{e:.33,k:72,s:PM,w:"sine",b:1,v:.08,c:[[48,"M"],[41,"M"],[43,"M"],[48,"M"]]},night:{e:.5,k:67,s:PM,w:"sine",b:1,v:.09,c:[[43,"M"],[48,"M"],[40,"m"],[45,"m"]]}}
};
function tone(f,t,d,type,v){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05);}
function tick(){const P=cur;
  while(next<ac.currentTime+.4){const b=P.c[(step>>3)%4],t=T[b[1]],s=step%8;
    if(s===0)tone(N(b[0]),next,P.e*7,"triangle",.45);
    tone(N(b[0]+12+t[[0,1,2,1,0,1,2,1][s]]+(s%4===3?12:0)),next,P.e*1.6,P.w,P.v);
    if((s===0||s===3||s===6)&&rnd()<.7){const n=P.k+12+P.s[(rnd()*P.s.length)|0];tone(N(n),next,P.e*3,"triangle",.18);if(P.b)tone(N(n+12)*1.005,next,P.e*2,"sine",.05);}
    next+=P.e;step++;}}
function theme(){const p=PRG[root.getAttribute("data-bg")]||PRG.classic,n=p[root.getAttribute("data-theme")==="dark"?"night":"day"];if(n!==cur){cur=n;step=0;}}
function start(){
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  if(!mg){mg=ac.createGain();mg.gain.value=.16;const l=ac.createBiquadFilter();l.type="lowpass";l.frequency.value=2600;
    const d=ac.createDelay(),f=ac.createGain();d.delayTime.value=.42;f.gain.value=.33;
    mg.connect(l);l.connect(ac.destination);l.connect(d);d.connect(f);f.connect(d);d.connect(ac.destination);}
  theme();ac.resume();on=true;next=ac.currentTime+.1;clearInterval(timer);timer=setInterval(tick,120);}
function stop(){on=false;clearInterval(timer);if(ac)ac.suspend();}
new MutationObserver(theme).observe(root,{attributes:true,attributeFilter:["data-theme","data-bg"]});
document.addEventListener("visibilitychange",()=>{if(!ac||!on)return;document.hidden?ac.suspend():ac.resume();});
window.KXM={get on(){return on;},toggle(){on?stop():start();try{localStorage.setItem(LSK,on?"1":"0");}catch(e){}return on;}};
try{if(localStorage.getItem(LSK)==="1"){on=true;addEventListener("pointerdown",()=>{if(on)start();},{once:true});}}catch(e){}
})();
