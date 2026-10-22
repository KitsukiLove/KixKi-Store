// Node 18+. Descarga logos, estadísticas de GitHub, fuentes y el generador de QR
// para que los visitantes NO hagan peticiones a terceros. Uso: node tools/sync.mjs
import fs from "node:fs/promises";
const J=JSON.parse(await fs.readFile("apps.json","utf8"));
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const H={"User-Agent":"kixki-sync",...(process.env.GITHUB_TOKEN?{Authorization:"Bearer "+process.env.GITHUB_TOKEN}:{})};
const get=async(u,o={})=>{const r=await fetch(u,{headers:H,...o});if(!r.ok)throw new Error(r.status+" "+u);return r;};
const repoOf=a=>{for(const [,u] of a.links){const m=u.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/)||u.match(/[?&]repo=([^\/&]+)\/([^&]+)/);if(m)return[m[1],m[2]];}return null;};
const cands=a=>{if(a.logo)return a.logo;const r=repoOf(a);if(!r)return[];const b=`https://raw.githubusercontent.com/${r[0]}/${r[1]}/HEAD/`;
  return[b+"fastlane/metadata/android/en-US/images/icon.png",b+"metadata/en-US/images/icon.png",`https://github.com/${r[0]}.png?size=160`];};
for(const d of["logos","data","vendor","fonts"])await fs.mkdir(d,{recursive:true});
const meta={built:new Date().toISOString(),logos:{},repos:{}};
for(const c of J.categories)for(const a of c.apps){
  const s=slug(a.name);
  for(const u of cands(a)){try{const r=await get(u),t=r.headers.get("content-type")||"";if(!t.startsWith("image/"))continue;
    const x=t.includes("svg")?"svg":t.includes("jpeg")?"jpg":t.includes("webp")?"webp":"png";
    await fs.writeFile(`logos/${s}.${x}`,Buffer.from(await r.arrayBuffer()));meta.logos[s]=`logos/${s}.${x}`;break;}catch{}}
  if(!meta.logos[s])console.warn("Sin logo (se mostrará la inicial):",a.name);
  const rp=repoOf(a);if(rp){const k=rp.join("/");if(!meta.repos[k])try{const j=await(await get("https://api.github.com/repos/"+k)).json();meta.repos[k]={s:j.stargazers_count,p:j.pushed_at,a:j.archived};}catch{console.warn("Sin datos de",k);}}
}
await fs.writeFile("data/meta.json",JSON.stringify(meta));
try{await fs.writeFile("vendor/qrcode.min.js",Buffer.from(await(await get("https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js")).arrayBuffer()));}catch(e){console.warn("QR:",e.message);}
try{ // fuentes locales + quita el enlace a Google Fonts del index
  let css=await(await get("https://fonts.googleapis.com/css2?family=Jersey+10&family=Pixelify+Sans:wght@400..700&display=swap",{headers:{"User-Agent":"Mozilla/5.0 Chrome/124 Safari/537.36"}})).text();
  let n=0;for(const u of new Set(css.match(/https:\/\/fonts\.gstatic\.com[^)]+/g)||[])){const f=`f${n++}.woff2`;await fs.writeFile("fonts/"+f,Buffer.from(await(await get(u)).arrayBuffer()));css=css.split(u).join(f);}
  await fs.writeFile("fonts/fonts.css",css);
  let h=await fs.readFile("index.html","utf8");
  h=h.replace(/<!-- fonts:start -->[\s\S]*?<!-- fonts:end -->/,'<!-- fonts:start -->\n<link rel="stylesheet" href="fonts/fonts.css">\n<!-- fonts:end -->');
  await fs.writeFile("index.html",h);
}catch(e){console.warn("Fuentes:",e.message);}
console.log("Listo:",Object.keys(meta.logos).length,"logos,",Object.keys(meta.repos).length,"repositorios");
