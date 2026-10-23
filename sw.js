const V="kixki-v26",SHELL=["./","index.html","styles.css","pixel-ui.css","pxbg.css","pxbg.js","app.js","apps.json","data/meta.json","manifest.webmanifest","scenes.js","xpbg.js","xpbg.css","music.js","i18n.js","eggs.js","kixki.css","dialogs.js","kixki.js","kixki2.css","kixki2.js","kixki3.css","kixki3.js","basket.css","basket.js","consejos.css","consejos.js","vacaboss.css","vacaboss.js","vaca.gif","vaca-jefa.gif","vaca-jefa.png","xpmode.js","xp.css","xp-icons.css","xp-games.css","xp-games.js","vallas.js","lluvia.js","lluvia.css","logo.png","icon-32.png","icon-180.png","icon-192.png","icon-512.png","icon-maskable-192.png","icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
/* Mismo origen: responde al instante desde caché y se actualiza en segundo plano.
   Solo se guardan respuestas correctas (nunca 404/500). */
self.addEventListener("fetch",e=>{
  const rq=e.request;
  if(rq.method!=="GET"||new URL(rq.url).origin!==location.origin)return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(rq);
    const net=fetch(rq).then(r=>{if(r.ok)c.put(rq,r.clone());return r;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}
    const r=await net;
    return r||(rq.mode==="navigate"?c.match("./"):Response.error());
  }));
});
