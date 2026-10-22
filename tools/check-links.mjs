// Revisa que todos los enlaces de apps.json respondan. Falla (exit 1) si alguno está roto.
import fs from "node:fs/promises";
const J=JSON.parse(await fs.readFile("apps.json","utf8"));let bad=0;
for(const c of J.categories)for(const a of c.apps)for(const [lb,u] of a.links){
  try{const r=await fetch(u,{redirect:"follow",signal:AbortSignal.timeout(15000),headers:{"User-Agent":"kixki-linkcheck"}});
    if(r.status===403||r.status===429)console.warn("?",a.name,lb,r.status);
    else if(!r.ok){bad++;console.error("✗",a.name,lb,r.status,u);}}
  catch(e){bad++;console.error("✗",a.name,lb,e.message,u);}}
console.log(bad?`${bad} enlaces con problemas`:"Todos los enlaces responden");process.exit(bad?1:0);
