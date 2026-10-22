try{if(localStorage.getItem("kixki-view")==="pc")document.querySelector("meta[name=viewport]").content="width=1100, viewport-fit=cover";}catch(e){}
/* Fondos intercambiables en pixel art: Clásico, Valle, Halloween y Navidad.
   Cada uno cambia de colores solo según el tema día/noche. */
(function(){
const root=document.documentElement,box=document.getElementById("bgx"),KEYS=["","valle","primavera","verano","otono","invierno","halloween","navidad","xp","auto","vacas"],NAMES=["Clásico","Valle","Primavera","Verano","Otoño","Invierno","Halloween","Navidad","Colina XP","Auto (temporada)","¡Vacas!"];
/* (parte 6) dos fondos especiales que no salen en el ciclo hasta ganarlos: «xp» (premio por vencer a vaca.exe) y «vacas» (castigo si pierdes).
   Memoria propia «kixki-bgx»: xp = premio ganado · cursed = el castigo está puesto · prev = el fondo que tenías antes del castigo */
let X={xp:0,cursed:0,prev:"",pause:0};try{X=Object.assign(X,JSON.parse(localStorage.getItem("kixki-bgx")||"{}")||{});}catch(e){}
const saveX=()=>{try{localStorage.setItem("kixki-bgx",JSON.stringify(X));}catch(e){}};
const okKey=k=>k==="vacas"?!!X.cursed:k==="xp"?!!X.xp:true;
const persist=()=>{try{localStorage.setItem("kixki-bg",JSON.stringify(KEYS[i]));}catch(e){}};
let i=0;try{i=Math.max(0,KEYS.indexOf(JSON.parse(localStorage.getItem("kixki-bg"))||""));}catch(e){}
if(!okKey(KEYS[i]))i=0;
const R=(x,y,w,h,c)=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const hill=(y,a,p,ph,c)=>{let s="";for(let x=0;x<64;x++)s+=R(x,Math.round(y+a*Math.sin(x/p+ph)),1,40,c);return s;};
const disc=(cx,cy,r,c)=>{let s="";for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));s+=R(cx-w,cy+y,2*w+1,1,c);}return s;};
const Rn=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
/* cada nube es un grupo: pxbg.css la hace cruzar el cielo a su ritmo (cd = duración, cl = punto de partida) */
const cloud=(x,y)=>`<g class="c pcl" style="--cd:${200+(x*7+y*13)%140}s;--cl:-${(x*29+y*17)%200}s">`+Rn(x,y+1,7,2)+Rn(x+1,y,4,1)+Rn(x+3,y-1,2,1)+"</g>";
const pine=(x,y,h)=>{let s=R(x,y+h,1,2,"t");for(let j=0;j<h;j++){const k=(j/2)|0;s+=R(x-k,y+j,1+2*k,1,"p");}return s+R(x,y+3,1,1,"o")+R(x-1,y+7,1,1,"o")+R(x+1,y+6,1,1,"o");};
const pump=(x,y)=>R(x,y+1,5,3,"o")+R(x+1,y,3,1,"o")+R(x+2,y-1,1,1,"t")+R(x+1,y+2,1,1,"k")+R(x+3,y+2,1,1,"k");
const bat=(x,y)=>R(x,y,1,1,"k")+R(x+4,y,1,1,"k")+R(x+2,y,1,1,"k")+R(x+1,y+1,3,1,"k");
const dead=(x,y)=>R(x,y,2,14,"k")+R(x-4,y+3,4,1,"k")+R(x-4,y+1,1,3,"k")+R(x+2,y+5,5,1,"k")+R(x+6,y+2,1,4,"k");
const tree=(x,y,r,c)=>R(x,y+r,1,6,"t")+disc(x,y,r,c);
const flower=(x,y,c)=>R(x,y,1,1,c)+R(x,y+1,1,1,"p");
const sunf=(x,y)=>R(x-1,y,3,3,"o")+R(x,y+1,1,1,"t")+R(x,y+3,1,4,"p");
const ST=[[4,3],[12,8],[20,2],[27,10],[35,4],[44,9],[52,3],[58,11],[8,14],[40,15],[61,6],[31,16]].map(([x,y],j)=>R(x,y,1,1,"st tw"+(j%3))).join("");
/* geometría de la Colina XP: cada capa = [x0,y0, curva, curva…] con curvas cúbicas [c1x,c1y,c2x,c2y,x,y]; viewBox 64x40 */
const HL=[[0,24.5,[9,21.5,20,20.4,32,21.6],[44,22.8,54,23.4,64,21.4]],[0,27,[10,23,22,21.2,36,22.4],[50,23.6,56,25.6,64,23.6]],
 [0,29,[7,20.5,18,14.8,30,15],[42,15.2,53,20.6,64,25.4]],[0,35,[12,30.5,30,29.6,46,31.4],[54,32.3,60,34,64,33.2]]];
const hd=L=>`M${L[0]} ${L[1]}`+L.slice(2).map(c=>"C"+c.join(" ")).join("")+"V40H0Z";
const hpath=(L,c)=>`<path class="${c}" d="${hd(L)}"/>`;
const XST=(()=>{let o="",a=7;const r=()=>(a=(a*16807)%2147483647)/2147483647;for(let j=0;j<52;j++)o+=`<circle class="st" cx="${(r()*64).toFixed(1)}" cy="${(r()*17).toFixed(1)}" r="${(.06+r()*.12).toFixed(2)}"/>`;return o;})();
const XPDEFS=`<defs><radialGradient id="xpcl"><stop offset="0" class="xcs"/><stop offset=".55" class="xcs" stop-opacity=".9"/><stop offset="1" class="xcs" stop-opacity="0"/></radialGradient></defs>`;
const XPDEFS2=`<defs><linearGradient id="xph" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" class="xa"/><stop offset=".5" class="xb"/><stop offset="1" class="xc"/></linearGradient>`
 +`<linearGradient id="xpf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="xb"/><stop offset="1" class="xc"/></linearGradient>`
 +`<linearGradient id="xpsh" x1="0" y1="0" x2=".55" y2=".85"><stop offset="0" class="xp" stop-opacity=".7"/><stop offset=".55" class="xp" stop-opacity=".12"/><stop offset="1" class="xp" stop-opacity="0"/></linearGradient></defs>`;
/* nube de algodón: varias bolitas con borde difuminado + base plana; s = escala */
const xcloud=(x,y,k)=>{const P=[[-5,1.2,3],[-2,-.6,4.2],[2.4,.1,3.6],[5.8,1.4,2.8],[-3,1.9,3],[1.2,2,3.2]];
  return `<g class="c">${P.map(([a,b,r])=>`<circle cx="${(x+a*k).toFixed(2)}" cy="${(y+b*k).toFixed(2)}" r="${(r*k).toFixed(2)}" fill="url(#xpcl)"/>`).join("")}<ellipse cx="${x}" cy="${(y+2.4*k).toFixed(2)}" rx="${(8*k).toFixed(2)}" ry="${(1.6*k).toFixed(2)}" fill="url(#xpcl)"/></g>`;};
const XPDEFS_X=`<defs><radialGradient id="xpcs"><stop offset="0" stop-color="#4a5468"/><stop offset=".6" stop-color="#586277" stop-opacity=".85"/><stop offset="1" stop-color="#586277" stop-opacity="0"/></radialGradient><radialGradient id="xpsun"><stop offset="0" class="xsa" stop-opacity=".95"/><stop offset=".3" class="xsa" stop-opacity=".5"/><stop offset="1" class="xsa" stop-opacity="0"/></radialGradient><radialGradient id="xpgl"><stop offset="0" stop-color="#ffb44a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a1e" stop-opacity="0"/></radialGradient></defs>`;
/* ===== Colina XP · estaciones (parte 7c) =====
   Misma colina «Bliss» en las siete versiones (Clásica, Primavera, Verano, Otoño, Invierno, Halloween, Navidad).
   Cada una cambia paleta (día y noche), sol/luna y los objetos del paisaje. Las nubes, el viento, los pájaros y las
   partículas (pétalos, hojas, nieve, luciérnagas) los añade xpbg.js. Elegir: menú Inicio → «Estación» (o Auto = según la fecha). */
const XPV=["clasica","primavera","verano","otono","invierno","halloween","navidad"];
const XPN={es:["Clásica","Primavera","Verano","Otoño","Invierno","Halloween","Navidad"],en:["Classic","Spring","Summer","Autumn","Winter","Halloween","Christmas"]};
let XPS="auto";try{XPS=JSON.parse(localStorage.getItem("kixki-xps"))||"auto";}catch(e){}
if(XPS!=="auto"&&XPV.indexOf(XPS)<0)XPS="auto";
const xpv=()=>XPS==="auto"?seasonKey(new Date()):XPS;
function crest(L,x){
  let x0=L[0],y0=L[1];
  for(let n=2;n<L.length;n++){const c=L[n];
    if(x<=c[4]||n===L.length-1){let lo=0,hi=1;
      for(let k=0;k<18;k++){const t=(lo+hi)/2,u=1-t,bx=u*u*u*x0+3*u*u*t*c[0]+3*u*t*t*c[2]+t*t*t*c[4];if(bx<x)lo=t;else hi=t;}
      const t=(lo+hi)/2,u=1-t;return u*u*u*y0+3*u*u*t*c[1]+3*u*t*t*c[3]+t*t*t*c[5];}
    x0=c[4];y0=c[5];}
  return L[1];
}
const ry=x=>crest(HL[2],x);
const F=n=>+n.toFixed(2);
const CI=(x,y,r,c,o)=>`<circle cx="${F(x)}" cy="${F(y)}" r="${F(r)}" fill="${c}"${o?` opacity="${o}"`:""}/>`;
const RC=(x,y,w,h,c,rx)=>`<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" fill="${c}"${rx?` rx="${F(rx)}"`:""}/>`;
const EL=(x,y,rx,ry_,c,o)=>`<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(rx)}" ry="${F(ry_)}" fill="${c}"${o?` opacity="${o}"`:""}/>`;
const PL=(pts,c,o)=>`<polygon points="${pts.map(p=>F(p[0])+","+F(p[1])).join(" ")}" fill="${c}"${o?` opacity="${o}"`:""}/>`;
const LN=(d,c,w)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${F(w)}" stroke-linecap="round" stroke-linejoin="round"/>`;
let GL=[];/* lo que brilla de noche (ventanas, caras, luces) va aparte para que no se oscurezca con el resto */
const tRound=(x,s,a,b,sp,y=ry(x)+.25)=>{s*=1.45;let o=RC(x-.06*s,y-1*s,.12*s,1.05*s,"#5b3d22")+CI(x-.5*s,y-1.25*s,.62*s,b)+CI(x+.5*s,y-1.3*s,.6*s,b)+CI(x,y-1.75*s,.8*s,b)+CI(x-.18*s,y-1.95*s,.5*s,a)+CI(x+.32*s,y-1.62*s,.4*s,a,.9);
  if(sp)[[-.5,-1.3],[.1,-2],[.55,-1.45],[-.2,-1.55],[.3,-1.8],[-.6,-1.1]].forEach(q=>{o+=CI(x+q[0]*s,y+q[1]*s,.1*s,sp);});
  return `<g>${o}</g>`;};
const tPine=(x,s,snow,lights,y=ry(x)+.25)=>{
  s*=1.4;let o=RC(x-.07*s,y-.25*s,.14*s,.35*s,"#4a3220");const W=[.92,.74,.54],C=["#1d6538","#287a45","#349150"],lc=["#ff4d4d","#ffd23a","#4dd0ff","#ff8fd0"];
  for(let j=0;j<3;j++){const yb=y-.2*s-j*.58*s,w=W[j]*s,ya=yb-1*s;
    o+=PL([[x-w,yb],[x,ya],[x+w,yb]],C[j]);
    if(snow)o+=PL([[x,ya],[x-w*.52,ya+.52*s],[x-w*.2,ya+.4*s],[x,ya+.55*s],[x+w*.24,ya+.4*s],[x+w*.52,ya+.52*s]],"#fff",.95);
    if(lights)for(let q=0;q<3;q++){const f=(q+.6)/3.2,lx=x+(q%2?1:-1)*w*(.2+f*.55)*(q===1?.6:1),ly=ya+(yb-ya)*(.35+f*.5);
      GL.push(`<circle class="xl" cx="${F(lx)}" cy="${F(ly)}" r="${F(.075*s)}" fill="${lc[(j+q)%4]}" style="--ld:${F((j*3+q)*.37)}s"/>`);}}
  if(lights)GL.push(`<circle class="xl" cx="${F(x)}" cy="${F(y-.2*s-2*.58*s-1*s)}" r="${F(.13*s)}" fill="#ffe27a" style="--ld:0s"/>`);
  return `<g>${o}</g>`;};
const tBare=(x,s,col,snow,y=ry(x)+.25)=>{
  s*=1.35;  const B=["M0 -1.1Q-.5 -1.3 -.95 -1.95","M-.02 -1.6Q.35 -1.8 .75 -2.4","M.02 -.95Q.5 -1.05 .9 -1.55","M-.04 -.8Q-.4 -.85 -.8 -1.15","M-.2 -1.8Q-.25 -2.1 -.2 -2.4"];
  let o=`<g transform="translate(${F(x)} ${F(y)}) scale(${s})">`+LN("M0 0C0 -.8 -.04 -1.3 -.08 -2.1",col,.17)+B.map(d=>LN(d,col,.075)).join("");
  if(snow)o+=LN("M-.01 -1.2Q-.4 -1.38 -.82 -1.88","#fff",.04)+LN("M-.01 -1.7Q.3 -1.85 .65 -2.28","#fff",.04)+LN("M.03 -1.0Q.45 -1.1 .8 -1.5","#fff",.04);
  return o+"</g>";};
const tPump=(x,y,s)=>{
  GL.push(`<g transform="translate(${F(x)} ${F(y)}) scale(${s})"><circle r="1.5" cy="-.45" fill="url(#xpgl)" opacity=".55"/>`
    +`<polygon class="xg" points="-.5,-.62 -.2,-.62 -.35,-.9" fill="#ffe066"/><polygon class="xg" points=".2,-.62 .5,-.62 .35,-.9" fill="#ffe066"/>`
    +`<path class="xg" d="M-.5 -.28Q0 .02 .5 -.28L.3 -.1L.15 -.28L0 -.08L-.15 -.28L-.3 -.1Z" fill="#ffe066"/></g>`);
  return `<g transform="translate(${F(x)} ${F(y)}) scale(${s})">`+EL(0,-.45,.9,.68,"#d9631a")+EL(-.42,-.45,.5,.66,"#ee8226")+EL(.42,-.45,.5,.66,"#ee8226")+EL(0,-.45,.32,.68,"#f59a3a")+RC(-.07,-1.28,.14,.3,"#4b6a2a",.04)+"</g>";};
const tSnowman=(x,y,s)=>(s*=1.3,`<g transform="translate(${F(x)} ${F(y)}) scale(${s})">`+EL(0,.02,.8,.12,"#9fb4d6",.35)+CI(0,-.55,.55,"#fff")+CI(0,-1.28,.4,"#fff")+CI(0,-1.82,.3,"#fff")
  +RC(-.2,-2.3,.4,.34,"#222a44")+RC(-.34,-2.0,.68,.06,"#222a44")+CI(-.1,-1.86,.04,"#222a44")+CI(.1,-1.86,.04,"#222a44")+PL([[0,-1.78],[.3,-1.74],[0,-1.7]],"#ff8a1e")
  +RC(-.32,-1.58,.64,.12,"#6b3fe0",.05)+RC(.12,-1.52,.1,.34,"#6b3fe0",.04)+CI(0,-1.2,.04,"#222a44")+CI(0,-.95,.04,"#222a44")+CI(0,-.7,.04,"#222a44")
  +LN("M-.38 -1.2L-.85 -1.55","#5b3d22",.05)+LN("M.38 -1.2L.85 -1.5","#5b3d22",.05)+"</g>");
const tCabin=(x,s,y=ry(x)+.3)=>{
  s*=1.3;
  GL.push(`<g transform="translate(${F(x)} ${F(y)}) scale(${s})"><circle cx="-.5" cy="-.6" r=".7" fill="url(#xpgl)" opacity=".55"/><rect class="xw" x="-.72" y="-.78" width=".42" height=".4" fill="#ffd36e"/><rect class="xw" x=".28" y="-.78" width=".42" height=".4" fill="#ffd36e"/></g>`
    +`<g transform="translate(${F(x+.62*s)} ${F(y-1.9*s)}) scale(${s})"><circle class="xsm" r=".16" fill="#fff" opacity="0" style="--ld:0s"/><circle class="xsm" r=".2" fill="#fff" opacity="0" style="--ld:1.6s"/><circle class="xsm" r=".14" fill="#fff" opacity="0" style="--ld:3.2s"/></g>`);
  return `<g transform="translate(${F(x)} ${F(y)}) scale(${s})">`+RC(.42,-1.95,.26,.6,"#7a5a4a")+RC(-1.1,-1.1,2.2,1.15,"#8a5a32")+RC(-1.1,-.75,2.2,.05,"#6b4425")+RC(-1.1,-.45,2.2,.05,"#6b4425")
    +PL([[-1.3,-1.08],[0,-2.0],[1.3,-1.08]],"#7a2a2a")+PL([[-1.3,-1.08],[0,-2.0],[1.3,-1.08],[1.18,-1.08],[0,-1.84],[-1.18,-1.08]],"#fff",.95)+RC(-.14,-.68,.3,.7,"#4a2f18")+"</g>";};
const tStone=(x,s,y=ry(x)+.35)=>(s*=1.25,`<g transform="translate(${F(x)} ${F(y)}) scale(${s})"><path d="M-.34 0V-.7Q-.34 -1.05 0 -1.05Q.34 -1.05 .34 -.7V0Z" fill="#3b3350"/><path d="M-.34 0V-.7Q-.34 -1.05 0 -1.05Q.34 -1.05 .34 -.7" fill="none" stroke="#6a5f86" stroke-width=".05"/>${LN("M0 -.85V-.5M-.14 -.7H.14","#6a5f86",.05)}</g>`);
const tFence=(x0,n,y0,col)=>{let o="";for(let i=0;i<n;i++){const x=x0+i*.9,y=y0+i*.0;o+=RC(x,y-.9,.12,.9,col,.03)+PL([[x,y-.9],[x+.06,y-1.03],[x+.12,y-.9]],col);}return o+RC(x0-.05,y0-.65,n*.9,.08,col)+RC(x0-.05,y0-.3,n*.9,.08,col);};
function xpScene(v){
  GL=[];
  const sk=XPDEFS+XPDEFS_X;
  let sun="",body="",back="";
  const sunAt=(x,y,r)=>`<circle class="xglow" cx="${x}" cy="${y}" r="${r*2.6}" fill="url(#xpsun)"/><circle class="xs0" cx="${x}" cy="${y}" r="${r}"/><circle class="st" cx="${x}" cy="${y}" r="${r*.8}"/>`;
  if(v==="clasica"){sun=`<circle class="st" cx="44" cy="4.6" r="1.9"/>`;}
  else if(v==="primavera"){sun=sunAt(48,5.4,1.6,1);body=tRound(9,.95,"#ffc9de","#f59ac0","#fff3f8")+tRound(14.5,.7,"#ffdcea","#f7a8c8","#fff")+tRound(47,1.05,"#ffc9de","#f59ac0","#fff3f8")+tRound(53,.75,"#ffdcea","#f7a8c8","#fff")+tRound(41,.6,"#c9f09a","#8fd56a");back=tRound(2.5,.7,"#ffc9de","#f59ac0","#fff3f8",crest(HL[0],2.5)+.2)+tRound(60.5,.8,"#ffc9de","#f59ac0","#fff3f8",crest(HL[0],60.5)+.2);}
  else if(v==="verano"){sun=sunAt(50,6,2.3,1);body=tRound(10,1,"#6cc04a","#3c9a34")+tRound(15,.7,"#7ccf55","#46a63a")+tRound(44,1.15,"#6cc04a","#3c9a34")+tRound(52,.8,"#7ccf55","#46a63a")+tRound(57,.6,"#6cc04a","#3c9a34");back=tRound(3,.7,"#5fb842","#3a9232",crest(HL[0],3)+.2)+tRound(61,.8,"#5fb842","#3a9232",crest(HL[0],61)+.2);}
  else if(v==="otono"){sun=sunAt(10,9,2.6,1);body=tRound(10.5,1.05,"#f2a23a","#d9531e")+tRound(16,.75,"#f6c04a","#e2802a")+tRound(43,1.1,"#f4a83a","#c9461a")+tRound(50,.8,"#f6c04a","#e2802a")+tRound(55,.65,"#f2a23a","#d9531e")+tBare(34,.8,"#4a3022");back=tRound(2.5,.7,"#f2a23a","#d9531e","",crest(HL[0],2.5)+.2)+tRound(61,.8,"#f6c04a","#e2802a","",crest(HL[0],61)+.2);}
  else if(v==="invierno"){sun=sunAt(14,6.6,1.5,1);body=tPine(10,1.15,1,0)+tPine(14.5,.8,1,0)+tPine(46,1.15,1,0)+tPine(52,.85,1,0)+tBare(38,.85,"#4a3a34",1)+tSnowman(50,ry(50)+(31-ry(50))*.34,1.1);back=tPine(2.5,.7,1,0,crest(HL[0],2.5)+.2)+tPine(61,.75,1,0,crest(HL[0],61)+.2);}
  else if(v==="halloween"){sun=`<circle class="xglow" cx="46" cy="7.2" r="8.5" fill="url(#xpsun)"/><circle class="st" cx="46" cy="7.2" r="3.4"/><circle cx="44.7" cy="6.2" r=".7" fill="#e08a2a" opacity=".35"/><circle cx="47.4" cy="8.2" r="1" fill="#e08a2a" opacity=".3"/><circle cx="46.6" cy="5.4" r=".45" fill="#e08a2a" opacity=".3"/>`;
    body=tBare(12,1.7,"#120a1e")+tStone(39.5,.8)+tStone(43,.95)+tStone(47,.75)+tFence(52,5,ry(54)+.5,"#1a1026")+tPump(20,ry(20)+(30-ry(20))*.34,.95)+tPump(28.5,ry(28)+(30-ry(28))*.42,.8)+tPump(36,ry(36)+(30-ry(36))*.5,1.4)+tPump(51,ry(51)+(31-ry(51))*.5,1.25)+tPump(59,ry(59)+(31-ry(59))*.5,1.0);
    back=tBare(3,.9,"#120a1e",0,crest(HL[0],3)+.2);}
  else if(v==="navidad"){sun=`<circle class="xglow" cx="46" cy="6" r="6" fill="url(#xpsun)"/><circle class="st" cx="46" cy="6" r="1.9"/>`;
    body=tPine(10,1.25,1,1)+tPine(15.5,.9,1,1)+tPine(43.5,1.25,1,1)+tPine(50,1.0,1,1)+tPine(56,.7,1,1)+tCabin(29.5,.8)+tSnowman(23.5,ry(23)+(31-ry(23))*.4,.9);
    back=tPine(2.5,.7,1,1,crest(HL[0],2.5)+.2)+tPine(61,.75,1,1,crest(HL[0],61)+.2);}
  return {smooth:1,
    top:XST+sk+sun,
    bot:XPDEFS2+hpath(HL[0],"t")+`<g class="xs">${back}</g>`+hpath(HL[1],"o")+hpath(HL[2],"xm")+`<path fill="url(#xpsh)" d="${hd(HL[2])}"/><g class="xs">${body}</g><g class="xgl">${GL.join("")}</g>`+hpath(HL[3],"xf")};
}
const SC={
 valle:{top:ST+disc(33,7,4,"a")+cloud(6,5)+cloud(20,12)+cloud(44,3),bot:hill(20,2.5,7,0,"g1")+hill(26,2,5,2,"g2")+hill(32,1.5,9,4,"g3")+[[6,34],[13,36],[22,35],[30,37],[41,34],[50,36],[58,35]].map(([x,y])=>R(x,y,1,1,"o")).join("")},
 halloween:{top:ST+disc(18,9,6,"a")+bat(26,5)+bat(33,12)+bat(40,6),bot:hill(24,2,8,1,"g1")+hill(29,1.5,6,3,"g2")+hill(34,1,10,0,"g3")+dead(32,12)+pump(8,31)+pump(15,33)+pump(24,34)+pump(38,32)},
 navidad:{top:ST+disc(18,7,3,"a"),bot:hill(26,2,9,0,"g1")+pine(8,18,9)+pine(17,20,8)+pine(29,15,12)+pine(39,21,7)+hill(31,1.5,6,2,"g2")+hill(35,1,8,4,"g3")},
 primavera:{top:ST+disc(50,7,4,"a")+cloud(8,6)+cloud(26,12)+cloud(36,3),bot:hill(22,2,7,1,"g1")+tree(14,14,4,"o")+tree(47,16,3,"o")+hill(28,1.5,5,0,"g2")+hill(33,1.5,9,3,"g3")+[[6,34,"o"],[12,31,"a"],[20,35,"o"],[27,33,"a"],[36,32,"o"],[44,34,"a"],[52,31,"o"],[58,35,"a"]].map(([x,y,c])=>flower(x,y,c)).join("")},
 verano:{top:ST+disc(14,8,6,"a")+cloud(38,5)+cloud(50,13),bot:hill(21,2,8,2,"g1")+hill(27,2,6,0,"g2")+hill(33,1.5,10,3,"g3")+[[7,29],[19,31],[33,28],[47,30],[58,32]].map(([x,y])=>sunf(x,y)).join("")},
 otono:{top:ST+disc(48,8,4,"a")+cloud(8,6)+cloud(26,12),bot:hill(24,2,8,1,"g1")+tree(12,15,5,"p")+tree(30,18,4,"o")+tree(52,14,5,"p")+hill(30,1.5,6,3,"g2")+hill(35,1,8,0,"g3")+[[6,36],[20,34],[40,36],[58,34]].map(([x,y])=>R(x,y,2,1,"o")).join("")},
 invierno:{top:ST+disc(48,7,3,"a")+cloud(10,6)+cloud(30,12),bot:hill(24,2,8,1,"g1")+dead(10,16)+dead(46,18)+pine(28,19,7)+hill(30,1.5,6,2,"g2")+hill(35,1,8,4,"g3")},
 /* «Colina XP» (partes 7b y 7c): colina verde estilo «Bliss» dibujada a mano en vectores (no es la imagen de Microsoft). La geometría está en HL
    (la usan el dibujo, el pasto de xpbg.js y la lluvia de lluvia.js). Siete estaciones: ver xpScene(). */
 get xp(){return xpScene(xpv());}
};
/* Colores: s1-s4 cielo, g1-g3 colinas, a sol/luna, t tronco, o detalle, c nubes, p pino, k siluetas */
const P={
 valle:[["#5db7f5","#7ccaf9","#a3dcfb","#cdeefe","#8bdc72","#5cc25f","#3ea24d","#ffe27a","#7a4a2a","#ff9fd0","#ffffff","#2f8f5b","#2a1650"],["#070d2e","#0e1a4d","#1a2d6d","#2b4690","#245a4a","#1b4a3b","#133a2e","#fff3c4","#3b2a22","#ffd36e","#6f86c8","#1f6b45","#070d2e"]],
 halloween:[["#6b2d8f","#a8408f","#ee7a4a","#ffb35c","#4a2466","#35194d","#231235","#ffd36e","#1b0f2e","#ff8a1e","#e9a6c8","#1b0f2e","#1b0f2e"],["#0c0620","#190b3d","#2b1259","#46207a","#2a1648","#1c0f33","#120a24","#ffb347","#07030f","#ff8a1e","#5a3a8a","#07030f","#07030f"]],
 navidad:[["#8cc6f0","#acd8f6","#cbe7fa","#e8f5ff","#ffffff","#e9f2ff","#d3e4fa","#fff3b0","#6b4226","#e8394d","#ffffff","#2f8f5b","#2a1650"],["#070b2a","#0f1b4a","#1b2f6b","#2d4a8f","#cfe0ff","#a9c2ee","#8aa6d8","#fff7d0","#4a2d1a","#ffd36e","#8aa6d8","#1f6b45","#070b2a"]],
 primavera:[["#8fd3f7","#b2e3fa","#d6f1fd","#f1fbff","#a5e682","#7fd16a","#5bb857","#fff09a","#7a4a2a","#ff8fc7","#ffffff","#3fa05a","#2f6f46"],["#0b1238","#142257","#233a7a","#36508f","#2f6a55","#245a47","#1a4a3a","#f4f1d0","#3b2a22","#ff9fd0","#6f86c8","#26734b","#0b1238"]],
 verano:[["#3fa8f0","#69bff6","#98d5fb","#c9ebfd","#b8e05a","#8fcf4a","#6db83d","#ffd23a","#7a4a2a","#ffc21a","#ffffff","#3d9b3d","#2a6a2a"],["#060a26","#0d1744","#1a2d6d","#2e4c94","#3d6a3a","#2f5a2f","#234a26","#fff3c4","#3b2a22","#ffe27a","#5a74b8","#2b6b30","#060a26"]],
 otono:[["#e9a35c","#f2bf7c","#f8d9a3","#fdeccb","#d29a3c","#b9772c","#9a5a24","#ffe08a","#5a3a22","#e8742c","#fff1d6","#d9601f","#4a2a15"],["#1a0f2e","#2b1a3f","#45274a","#63364f","#4a3220","#3a2819","#2a1c12","#ffd9a0","#2e1d12","#e8742c","#7a5a8a","#a8461a","#10081a"]],
 xp:[["#2b6ad6","#4b8fe6","#7db5f0","#c5e3f7","#9fe04e","#58b52b","#2c8a1c","#fff3c4","#79b36f","#4fa535","#ffffff","#c9f27e","#1e6a16"],["#060d2e","#0e1d52","#1a3a82","#2c5aa8","#2f7a35","#22592a","#163f1f","#fff3c4","#2a5a55","#1d4a28","#7d93cc","#3e8e48","#0c2a12"]],
 xp_primavera:[["#5aa9ee","#86c5f6","#b6e0fb","#e4f5ff","#b4f070","#6ccf3c","#2e9a30","#fff6c9","#8cc79a","#62b84a","#ffffff","#d6f78e","#1e6a16"],["#0a1038","#132460","#24408a","#3a5ea6","#3e8a4a","#2a6a3a","#1b4a2a","#f4f1d0","#2f6a5a","#25623a","#8aa0d8","#58a860","#0c2a12"]],
 xp_verano:[["#1f7fe0","#3f9cf0","#79bff8","#bfe3fb","#c5e84a","#8cc53a","#4f8f22","#ffe27a","#9cc56e","#7fb03a","#ffffff","#e6f56a","#2f6a1a"],["#050a2a","#0b1850","#183a82","#2a5aa8","#47803a","#356a2c","#244f1f","#fff3c4","#35633f","#2e5a2e","#7d93cc","#6aa84a","#0c2a12"]],
 xp_otono:[["#e7a05a","#f2bf85","#f9dcb0","#fdeed2","#e8c04a","#c98a2a","#8f5420","#fff0c0","#b8905a","#b5702a","#fff3e0","#f3d070","#5a2d12"],["#1a0f33","#2e1a4a","#51305a","#7a4a5e","#7a5a2a","#5e4020","#3f2a14","#ffd9a0","#4a3828","#4a3220","#9a7aa8","#a8803a","#1a0c06"]],
 xp_invierno:[["#8fb0d6","#b4cbe6","#d6e4f2","#eef4fa","#ffffff","#dce9f8","#b2c8e6","#fff8dc","#c6d6ec","#e6eefa","#ffffff","#f4f9ff","#47617f"],["#070b26","#101c4e","#1e3578","#34509c","#a8c0e8","#8aa6d8","#6a86bb","#f4f6ff","#5a72a6","#7a94c8","#9fb2e0","#cfe0ff","#1a2646"]],
 xp_halloween:[["#2a1450","#6b2d8f","#d2584a","#ffa24a","#6a4a8a","#3f2a5e","#241438","#ffb04a","#3a2358","#2e1b48","#c98ab8","#b283e8","#0e0618"],["#07031a","#12082e","#241049","#3a1a62","#40305f","#2c2046","#1a1230","#ff9a2e","#2a1b44","#1f1436","#6a4a8a","#8a5fc8","#05020c"]],
 xp_navidad:[["#7fa6d8","#a9c6e8","#cfe0f4","#eef5fc","#ffffff","#e4eefb","#bcd0ee","#fff6cf","#c9d9ee","#eaf1fb","#ffffff","#f2f7ff","#2f6a4a"],["#060a28","#0c1a50","#1a3278","#2a4c9a","#b4c9ec","#93aedb","#6f8cc0","#fff7d0","#566fa6","#7a94c8","#9fb2e0","#d6e4ff","#142040"]],
 vacas:[["#ffd9ee","#ffcbe6","#ffbde0","#ffb0da","#ffffff","#ffffff","#ffffff","#ffffff","#2a1650","#2a1650","#ffffff","#2a1650","#2a1650"],["#e7a3d6","#e39ad2","#de90cd","#d986c8","#ffffff","#ffffff","#ffffff","#ffffff","#2a1650","#2a1650","#ffffff","#2a1650","#2a1650"]],
 invierno:[["#a9c8e8","#c3daf0","#dcebf8","#f1f7fd","#ffffff","#eaf2fc","#d6e5f6","#fff8d0","#5a4636","#a9c2ee","#c9d9ee","#2f7f5b","#4a3a30"],["#060a22","#0e1a46","#1c3068","#2f4c8e","#cfe0ff","#aac2ee","#88a4d8","#f4f6ff","#2e2a2a","#8aa6d8","#8aa6d8","#1f5f45","#1a1622"]]
};
/* Temporada según la fecha (hemisferio norte) y horas de luz aproximadas de cada una */
const seasonKey=d=>{const m=d.getMonth()+1,y=d.getDate(),v=m*100+y;
  if((m===10&&y>=10)||(m===11&&y<=2))return"halloween";
  if(m===12||(m===1&&y<=6))return"navidad";
  return v<320?"invierno":v<621?"primavera":v<922?"verano":"otono";};
const SUN={invierno:[8,18],navidad:[8,18],otono:[7,19],halloween:[7,18],primavera:[7,20],verano:[6,21]};
const nightNow=()=>{const d=new Date(),h=d.getHours(),r=SUN[seasonKey(d)];return h<r[0]||h>=r[1];};
const PT={navidad:[26,"",0],invierno:[40,"",0],otono:[16,"var(--o)",1],primavera:[12,"var(--o)",1]};
let lastN=null;
/* ===== Mundo (Pixel / Colina XP) y Estación (parte 8) =====
   Dos ajustes que se entienden solos: «Fondo» elige el mundo (Pixel o Colina XP, si ya la ganaste) y «Estación» elige
   la temporada DEL mundo activo. Al cambiar de mundo se conserva la estación (Otoño pixel ↔ Otoño XP).
   Memoria: kixki-bg (clave del fondo pixel, o «xp») y kixki-xps (estación de la Colina XP). */
const SEA={es:{auto:"Auto","":"Clásico",clasica:"Clásica",valle:"Valle",primavera:"Primavera",verano:"Verano",otono:"Otoño",invierno:"Invierno",halloween:"Halloween",navidad:"Navidad"},
  en:{auto:"Auto","":"Classic",clasica:"Classic",valle:"Meadow",primavera:"Spring",verano:"Summer",otono:"Autumn",invierno:"Winter",halloween:"Halloween",navidad:"Christmas"}};
const PXS=["auto","","valle","primavera","verano","otono","invierno","halloween","navidad"],XPL=["auto"].concat(XPV);
const L2=()=>window.KXI&&KXI.lang==="en"?"en":"es";
const worldOf=()=>KEYS[i]==="xp"?"xp":KEYS[i]==="vacas"?"vacas":"pixel";
const seasonOf=()=>worldOf()==="xp"?XPS:(KEYS[i]===""?"clasica":KEYS[i]);
const seaName=(id)=>{if(id==="clasica"&&worldOf()==="pixel")id="";return SEA[L2()][id]||id;};
const seaEff=()=>{const w=worldOf();if(w==="xp")return xpv();const k=KEYS[i];return k==="auto"?seasonKey(new Date()):k;};
const wName=w=>w==="xp"?"Colina XP":w==="vacas"?(L2()==="en"?"Cows!":"¡Vacas!"):"Pixel";
function setSeason(id){
  const w=worldOf();if(w==="vacas")return false;
  if(w==="xp"){if(XPL.indexOf(id)<0)return false;XPS=id;try{localStorage.setItem("kixki-xps",JSON.stringify(id));}catch(e){}lastN=null;apply();return true;}
  const k=id==="clasica"?"":id;if(PXS.indexOf(k)<0)return false;i=KEYS.indexOf(k);lastN=null;persist();apply();return true;
}
function setWorld(w){
  const cur=worldOf();if(w===cur||cur==="vacas")return false;
  if(w==="xp"){if(!X.xp)return false;const k=KEYS[i];XPS=k==="auto"?"auto":(k===""||k==="valle")?"clasica":k;
    try{localStorage.setItem("kixki-xps",JSON.stringify(XPS));}catch(e){}i=KEYS.indexOf("xp");}
  else{i=KEYS.indexOf(XPS==="auto"?"auto":XPS==="clasica"?"":XPS);if(i<0)i=0;}
  lastN=null;persist();apply();return true;
}
/* En modo Auto el día/noche sigue la hora local; si lo cambias a mano, se respeta hasta el siguiente cambio de hora */
function autoSync(){if(KEYS[i]!=="auto"&&!(KEYS[i]==="xp"&&XPS==="auto"))return;const n=nightNow();if(n===lastN)return;lastN=n;
  const t=n?"dark":"light";if(root.getAttribute("data-theme")!==t){root.setAttribute("data-theme",t);const m=document.getElementById("tc");if(m)m.setAttribute("content",n?"#150c33":"#efe6ff");}}
let built="";
function apply(){
  let k=KEYS[i];
  if(k==="auto"){autoSync();k=seasonKey(new Date());}else if(k==="xp"&&XPS==="auto")autoSync();
  if(!k){root.removeAttribute("data-bg");box.innerHTML="";built="";dispatchEvent(new Event("kixki-bg"));return;}
  root.setAttribute("data-bg",k);
  const n=root.getAttribute("data-theme")==="dark"?1:0;
  let pk=k,xv="";
  if(k==="xp"){xv=xpv();root.setAttribute("data-xps",xv);if(xv!=="clasica")pk="xp_"+xv;}else root.removeAttribute("data-xps");
  "s1 s2 s3 s4 g1 g2 g3 a t o c p k".split(" ").forEach((v,j)=>box.style.setProperty("--"+v,P[pk][n][j]));
  box.style.setProperty("--so",n||k==="halloween"||xv==="halloween"?1:0);
  box.style.setProperty("--co",k==="xp"?(xv==="halloween"?.6:n?.5:1):k==="halloween"||k==="navidad"?0:(n?.45:1));
  box.classList.toggle("kv-pause",!!X.pause);
  if(k==="vacas"){if(built!==k){built=k;box.innerHTML='<i class="kv-mos a"></i><i class="kv-mos b"></i>';}dispatchEvent(new Event("kixki-bg"));return;}
  const bk=k==="xp"?"xp:"+xv:k;
  if(built!==bk){built=bk;const sr=SC[k].smooth?"geometricPrecision":"crispEdges";
    box.innerHTML=`<svg class="top" viewBox="0 0 64 24" shape-rendering="${sr}" aria-hidden="true">${SC[k].top}</svg><svg class="bot" viewBox="0 0 64 40" shape-rendering="${sr}" aria-hidden="true">${SC[k].bot}</svg>`+(PT[k]?Array.from({length:PT[k][0]},(_,j)=>`<i class="snow" style="left:${(j*37+9)%100}%;--d:${9+(j*5)%8}s;--dl:-${(j*3)%9}s;--z:${(PT[k][2]?3:2)+(j%3)}px${PT[k][2]?";background:"+PT[k][1]:""}"></i>`).join(""):"");}
  dispatchEvent(new Event("kixki-bg"));
}
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:["data-theme"]});
function restore(){X.cursed=0;const p=KEYS.indexOf(X.prev);i=p>=0&&okKey(X.prev)&&X.prev!=="vacas"?p:0;X.prev="";saveX();lastN=null;persist();apply();}
window.KXB={
  /* label() = el MUNDO («Pixel», «Colina XP», «¡Vacas!») · full() = mundo + estación · season() = id de la estación del mundo activo */
  label:()=>wName(worldOf()),
  full:()=>wName(worldOf())+(worldOf()==="vacas"?"":" · "+(seasonOf()==="auto"?"Auto ("+seaName(seaEff())+")":seaName(seasonOf()))),
  hill:HL,
  world:worldOf,setWorld,
  season:id=>id===undefined?seasonOf():setSeason(id),
  seasons:()=>(worldOf()==="xp"?XPL:PXS).map(id=>({id:id===""?"clasica":id,name:seaName(worldOf()==="xp"?id:id)})),
  seasonLabel:()=>worldOf()==="vacas"?"":seasonOf()==="auto"?"Auto · "+seaName(seaEff()):seaName(seasonOf()),
  nextSeason(){const w=worldOf();if(w==="vacas"){restore();return;}const L=(w==="xp"?XPL:PXS).map(x=>x===""?"clasica":x),c=L.indexOf(seasonOf());setSeason(L[(c+1)%L.length]);},
  /* estaciones de la Colina XP (compatibilidad): xps() = lo elegido, xpv() = la que se ve ahora, xps(v) la cambia */
  XPV,xpv,xpn:v=>XPN[L2()][XPV.indexOf(v)]||v,
  xps(v){if(v===undefined)return XPS;if(v!=="auto"&&XPV.indexOf(v)<0)return XPS;XPS=v;try{localStorage.setItem("kixki-xps",JSON.stringify(v));}catch(e){}if(KEYS[i]==="xp")apply();else dispatchEvent(new Event("kixki-bg"));return XPS;},
  crest,
  /* desde «¡Vacas!» el botón de fondos te devuelve el que tenías; si no, pasa al siguiente que tengas disponible (los candados se saltan) */
  /* botón «Fondo»: con la Colina XP ganada alterna Pixel ↔ XP; si no, recorre las estaciones pixel */
  next(){if(KEYS[i]==="vacas"){restore();return;}
    if(X.xp){setWorld(worldOf()==="xp"?"pixel":"xp");return;}
    KXB.nextSeason();},
  /* (parte 6) usados por vacaboss.js */
  has:k=>okKey(k),cursed:()=>!!X.cursed&&KEYS[i]==="vacas",paused:()=>!!X.pause,
  unlockXP(){X.xp=1;saveX();},
  use(k){const j=KEYS.indexOf(k);if(j<0||!okKey(k)||k==="vacas")return false;if(KEYS[i]==="vacas"){X.cursed=0;X.prev="";saveX();}i=j;lastN=null;persist();apply();return true;},
  curse(){if(KEYS[i]!=="vacas")X.prev=KEYS[i];X.cursed=1;saveX();i=KEYS.indexOf("vacas");lastN=null;persist();apply();},
  restore,
  pause(v){X.pause=v==null?(X.pause?0:1):(v?1:0);saveX();box.classList.toggle("kv-pause",!!X.pause);return !!X.pause;}};
apply();
/* Cada minuto: cambio día/noche y de temporada en modo Auto, sin tocar nada más */
const auto=()=>{if(KEYS[i]==="auto"&&!document.hidden){autoSync();if(seasonKey(new Date())!==built)apply();}
  else if(KEYS[i]==="xp"&&XPS==="auto"&&!document.hidden&&"xp:"+xpv()!==built)apply();};
setInterval(auto,60000);document.addEventListener("visibilitychange",auto);
})();
