// Node 18+. Descarga logos y estadísticas de GitHub para que los visitantes NO hagan peticiones a terceros.
// Uso:  node tools/sync.mjs            -> SOLO baja los logos de apps nuevas (las que aún no están en data/meta.json)
//                                          y refresca las estrellas (si GitHub falla, conserva las anteriores).
//       node tools/sync.mjs --logos    -> vuelve a bajar TODOS los logos.
//       node tools/sync.mjs --fuentes  -> además vuelve a bajar fuentes y QR (normalmente NO hace falta: ya están en fonts/ y vendor/).
// Añadir una app: pega su bloque en apps.json, corre este script y sube apps.json + data/meta.json + logos/.
import fs from "node:fs/promises";
const J=JSON.parse(await fs.readFile("apps.json","utf8"));
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const H={"User-Agent":"kixki-sync",...(process.env.GITHUB_TOKEN?{Authorization:"Bearer "+process.env.GITHUB_TOKEN}:{})};
const get=async(u,o={})=>{const r=await fetch(u,{headers:H,...o});if(!r.ok)throw new Error(r.status+" "+u);return r;};
const repoOf=a=>{for(const [,u] of a.links){const m=u.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/)||u.match(/[?&]repo=([^\/&]+)\/([^&]+)/);if(m)return[m[1],m[2]];}return null;};
const cands=a=>{if(a.logo)return a.logo;const r=repoOf(a);if(!r)return[];const b=`https://raw.githubusercontent.com/${r[0]}/${r[1]}/HEAD/`;
  return[b+"fastlane/metadata/android/en-US/images/icon.png",b+"metadata/en-US/images/icon.png",`https://github.com/${r[0]}.png?size=160`];};
for(const d of["logos","data","vendor","fonts"])await fs.mkdir(d,{recursive:true});
const ALL=process.argv.includes("--logos"),FONTS=process.argv.includes("--fuentes");
let old={logos:{},repos:{}};try{old=Object.assign(old,JSON.parse(await fs.readFile("data/meta.json","utf8")));}catch{}
const meta={built:new Date().toISOString(),logos:{},repos:{}};
for(const c of J.categories)for(const a of c.apps){
  const s=slug(a.name);
  if(!ALL&&old.logos[s]){try{await fs.access(old.logos[s]);meta.logos[s]=old.logos[s];}catch{}}   /* ya tiene logo: no se vuelve a bajar */
  if(!meta.logos[s])for(const u of cands(a)){try{const r=await get(u),t=r.headers.get("content-type")||"";if(!t.startsWith("image/"))continue;
    const x=t.includes("svg")?"svg":t.includes("jpeg")?"jpg":t.includes("webp")?"webp":"png";
    await fs.writeFile(`logos/${s}.${x}`,Buffer.from(await r.arrayBuffer()));meta.logos[s]=`logos/${s}.${x}`;break;}catch{}}
  if(!meta.logos[s])console.warn("Sin logo (se mostrará la inicial):",a.name);
  const rp=repoOf(a);if(rp){const k=rp.join("/");if(!meta.repos[k])try{const j=await(await get("https://api.github.com/repos/"+k)).json();meta.repos[k]={s:j.stargazers_count,p:j.pushed_at,a:j.archived};}catch{if(old.repos[k])meta.repos[k]=old.repos[k];console.warn("Sin datos de",k,old.repos[k]?"(se conservan los anteriores)":"");}}
}

/* ---------- logos de letras (mismo dibujo que tools/logos-letras.py): para toda app que no tenga logo ---------- */
import crypto from "node:crypto";
const PXF={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"001001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",O:"010101101101010",P:"110101110100100",Q:"010101101110011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111"};
const hls=(h,l,s)=>{const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p;};return [f(h+1/3),f(h),f(h-1/3)];};
const hexc=(h,s,l)=>"#"+hls(h,l,s).map(v=>Math.round(v*255).toString(16).padStart(2,"0")).join("");
function letterSVG(name){
  const hue=(parseInt(crypto.createHash("md5").update(name).digest("hex").slice(0,4),16)%360)/360,bg=hexc(hue,.55,.62),dk=hexc(hue,.5,.36);
  const words=(name.match(/[A-Za-z0-9]+/g)||[]).flatMap(w=>w.replace(/([a-z0-9])(?=[A-Z])/g,"$1 ").split(" ")).filter(Boolean);
  const L=words.map(w=>(w.replace(/[^A-Za-z]/g,"")[0]||"").toUpperCase()).filter(Boolean);
  const t=L.length>=2?L[0]+L[1]:(name.replace(/[^A-Za-z]/g,"").toUpperCase()+"X").slice(0,2);
  const on=new Set();[...t].forEach((ch,i)=>{const r=PXF[ch]||PXF.X;for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(r[y*3+x]==="1")on.add((3+i*4+x)+","+(4+y));});
  let tx="",sh="";on.forEach(k=>{const[x,y]=k.split(",").map(Number);tx+=`M${x} ${y}h1v1h-1z`;if(!on.has(x+","+(y+1)))sh+=`M${x} ${y+1}h1v1h-1z`;});
  const rect=(cells)=>cells.map(([x,y])=>`M${x} ${y}h1v1h-1z`).join("");
  const tile=[];for(let x=1;x<12;x++)tile.push([x,0]);for(let x=1;x<12;x++)tile.push([x,12]);for(let y=1;y<12;y++)for(let x=0;x<13;x++)tile.push([x,y]);
  const hl=[];for(let x=1;x<12;x++)hl.push([x,0]);hl.push([0,1]);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 13 13" shape-rendering="crispEdges"><path fill="${bg}" d="${rect(tile)}"/><path fill="#fff" fill-opacity=".22" d="${rect(hl)}"/><path fill="${dk}" d="${sh}"/><path fill="#ffffff" d="${tx}"/></svg>`;
}
{let n=0;for(const c of J.categories)for(const a of c.apps){const s=slug(a.name),f=`logos/${s}.svg`;if(meta.logos[s])continue;try{await fs.access(f);}catch{await fs.writeFile(f,letterSVG(a.name));n++;}}if(n)console.log("Logos de letras creados:",n);}
await fs.writeFile("data/meta.json",JSON.stringify(meta));
if(FONTS)try{await fs.writeFile("vendor/qrcode.min.js",Buffer.from(await(await get("https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js")).arrayBuffer()));}catch(e){console.warn("QR:",e.message);}
if(FONTS)try{ // fuentes locales + quita el enlace a Google Fonts del index
  let css=await(await get("https://fonts.googleapis.com/css2?family=Jersey+10&family=Pixelify+Sans:wght@400..700&display=swap",{headers:{"User-Agent":"Mozilla/5.0 Chrome/124 Safari/537.36"}})).text();
  let n=0;for(const u of new Set(css.match(/https:\/\/fonts\.gstatic\.com[^)]+/g)||[])){const f=`f${n++}.woff2`;await fs.writeFile("fonts/"+f,Buffer.from(await(await get(u)).arrayBuffer()));css=css.split(u).join(f);}
  await fs.writeFile("fonts/fonts.css",css);
  let h=await fs.readFile("index.html","utf8");
  h=h.replace(/<!-- fonts:start -->[\s\S]*?<!-- fonts:end -->/,'<!-- fonts:start -->\n<link rel="stylesheet" href="fonts/fonts.css">\n<!-- fonts:end -->');
  await fs.writeFile("index.html",h);
}catch(e){console.warn("Fuentes:",e.message);}
console.log("Listo:",Object.keys(meta.logos).length,"logos,",Object.keys(meta.repos).length,"repositorios");
