/* Easter egg de la oveja: ventanas de broma a los 100, 500 y 1000 toques. */
(function(){
const VPM=[["ADVERTENCIA OVINA","Has tocado a la oveja 100 veces. Ya está un poco mareada."],["ALERTA NIVEL 2","500 toques detectados. La oveja pide un descanso… y una manta."]];
const VP8=["ERROR 404: ovejas no encontradas","Tu pantalla tiene 1000 ovejas","Lana detectada en el sistema","Se acabó el heno","Beee.exe dejó de funcionar","Ovejas sospechosas cerca","Actualiza tu oveja a la v2","¿Contamos otra vez?"];
function popup(t,m,x,y){const d=document.createElement("div");d.className="vp";d.setAttribute("role","dialog");d.setAttribute("aria-label",t);
  d.style.left=Math.max(8,Math.min(innerWidth-288,x))+"px";d.style.top=Math.max(8,Math.min(innerHeight-170,y))+"px";
  d.innerHTML=`<div class="vh"><span>${t}</span><button type="button" class="vx" aria-label="Cerrar">✕</button></div><p>${m}</p><small>Es una broma de Kixki, no es un virus real.</small><button type="button" class="vb">Entendido</button>`;
  document.body.append(d);window.KXS&&KXS.beep(196,.2);return d;}
function ovFire(n){
  if(n<1000){const p=VPM[n===100?0:1];popup(p[0],p[1],innerWidth/2-140,innerHeight/3);return;}
  VP8.forEach((t,i)=>setTimeout(()=>popup(t,"Esto ya es demasiado… ¿o no? 🐑",Math.random()*innerWidth,Math.random()*innerHeight*.8),i*230));
  setTimeout(()=>{const d=popup("vaca.exe","",innerWidth/2-140,innerHeight/4),b=d.querySelector(".vb");d.classList.add("cow");
    d.querySelector("p").innerHTML='<img src="vaca.gif" width="220" height="220" alt="Una vaca pixelada que baila">';b.textContent="Cerrar todo";b.dataset.all="1";},VP8.length*230+300);}
document.addEventListener("click",e=>{const b=e.target.closest(".vx,.vb");if(!b||!b.closest(".vp"))return;b.dataset.all?document.querySelectorAll(".vp").forEach(v=>v.remove()):b.closest(".vp").remove();});
addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".vp").forEach(v=>v.remove());});

window.KXE={fire:ovFire};
})();
