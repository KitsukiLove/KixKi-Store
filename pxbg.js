/* Vida para los fondos pixel (parte 8). Crea una capa #pxfx detrás de la página y de vez en cuando suelta
   un bichito pixel: pájaros (día), mariposas (primavera/verano), luciérnagas y estrellas fugaces (noche),
   murciélagos (Halloween). Solo con un fondo pixel puesto; nada de esto se usa en el modo XP ni en ¡Vacas!. */
(function(){
const root=document.documentElement,bgx=document.getElementById("bgx");if(!bgx)return;
const fx=document.createElement("div");fx.id="pxfx";fx.setAttribute("aria-hidden","true");bgx.after(fx);
const rnd=Math.random,still=matchMedia("(prefers-reduced-motion:reduce)");
const active=()=>{const b=root.getAttribute("data-bg");return b&&b!=="xp"&&b!=="vacas"&&!document.hidden&&!still.matches&&!bgx.classList.contains("kv-pause");};
const night=()=>root.getAttribute("data-theme")==="dark"||root.getAttribute("data-bg")==="halloween";
function put(cls,css,life,html){if(fx.childElementCount>14)return;const e=document.createElement("i");e.className=cls;e.style.cssText=css;fx.appendChild(e);setTimeout(()=>e.remove(),life);return e;}
function bird(){const d=22+rnd()*14,y=6+rnd()*26,n=1+((rnd()*3)|0);
  for(let j=0;j<n;j++){const e=put("pb"+(rnd()<.5?" u":""),`top:${y+j*3.5+(rnd()*3)}vh;margin-left:${-j*34}px;--d:${d+j*.6}s;animation-delay:0s,${rnd()*.4}s`,(d+3)*1000);
    if(e){let u=0;e.dataset.f=0;const t=setInterval(()=>{if(!e.isConnected)return clearInterval(t);e.classList.toggle("u");},260+j*15);}}}
function butter(){const x=8+rnd()*45,y=30+rnd()*35;put("pm"+(rnd()<.5?" y":""),`left:${x}vw;top:${y}vh;--d:${16+rnd()*8}s`,25000);}
function fly(){const x=rnd()*92,y=45+rnd()*45;put("pf",`left:${x}vw;top:${y}vh;--d:${7+rnd()*6}s;animation-delay:0s,${rnd()*1.5}s`,14000);}
function bat(){put("pw",`top:${6+rnd()*30}vh;--d:${12+rnd()*8}s`,21000);}
function shoot(){put("ps",`left:${5+rnd()*45}vw;top:${3+rnd()*22}vh`,1300);}
function loop(){
  if(active()){const b=root.getAttribute("data-bg"),nt=night();
    if(b==="halloween"){if(rnd()<.55)bat();if(rnd()<.35)shoot();}
    else if(nt){if(b!=="invierno"||rnd()<.5)for(let j=0,n=2+((rnd()*3)|0);j<n&&b!=="invierno"&&b!=="navidad";j++)fly();if(rnd()<.4)shoot();}
    else{if(b!=="navidad"&&b!=="invierno"&&rnd()<.6)bird();if((b==="primavera"||b==="verano")&&rnd()<.7)butter();}}
  setTimeout(loop,5000+rnd()*7000);}
setTimeout(loop,2500);
addEventListener("kixki-bg",()=>{fx.textContent="";});
})();
