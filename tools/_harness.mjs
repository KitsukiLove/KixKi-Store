/* Utilidades comunes de las pruebas en Chromium headless (servidor estático + Playwright). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {createRequire} from "node:module";
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,"..");
let chromium;
try{({chromium}=await import("playwright"));}
catch(e){const req=createRequire((process.env.PW_PATH||"/opt/node-tools")+"/");({chromium}=req("playwright"));}
const MIME={".html":"text/html",".js":"text/javascript",".css":"text/css",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".gif":"image/gif",".woff2":"font/woff2",".yml":"text/plain",".webmanifest":"application/manifest+json"};
/* Sin internet en las pruebas: las imágenes externas (logos de apps que aún no están en logos/) salen como un punto transparente y la API de GitHub responde vacía, sin errores en la consola */
const PNG1=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==","base64");
export const stubExternal=async pg=>pg.route(u=>!/^http:\/\/127\.0\.0\.1[:/]/.test(u.href),r=>{
  const t=r.request().resourceType(),h={"access-control-allow-origin":"*"};
  if(t==="image")return r.fulfill({status:200,contentType:"image/png",headers:h,body:PNG1});
  return r.fulfill({status:200,contentType:"application/json",headers:h,body:"{}"});});
export function serve(dir=root){
  return new Promise(res=>{
    const s=http.createServer((rq,rs)=>{
      let p=decodeURIComponent(new URL(rq.url,"http://x").pathname);if(p.endsWith("/"))p+="index.html";
      const f=path.join(dir,p);if(!f.startsWith(dir)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){rs.writeHead(404);rs.end("no");return;}
      rs.writeHead(200,{"content-type":MIME[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(rs);
    }).listen(0,"127.0.0.1",()=>res({url:"http://127.0.0.1:"+s.address().port+"/",close:()=>s.close()}));
  });
}
export async function open({mobile=false,url,init,dir,query="",sonido=false}={}){
  const srv=await serve(dir||root);
  const br=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const ctx=await br.newContext(mobile?{viewport:{width:390,height:800},hasTouch:true,isMobile:true,deviceScaleFactor:2}:{viewport:{width:1280,height:800}});
  const pg=await ctx.newPage();
  await stubExternal(pg);
  const errs=[];pg.on("pageerror",e=>errs.push(String(e)));pg.on("console",m=>{if(m.type()==="error")errs.push(m.text());});
  await pg.addInitScript(()=>{try{sessionStorage.setItem("kixki-boot","1");sessionStorage.setItem("kixki-k-s","1");localStorage.setItem("kixki-k",JSON.stringify({v:1,on:true,visits:5,first:1,last:Date.now(),opened:[],fc:{},allDone:0,mode:"normal"}));localStorage.setItem("kixki-k3",JSON.stringify({v:1,pr:false,plan:0,grabs:0,drops:0,closed:0,bgs:0,throws:0}));}catch(e){}});
  /* las pruebas parten en silencio (la página real viene con música y sonido activados; sonido:true lo deja como viene) */
  if(!sonido)await pg.addInitScript(()=>{try{localStorage.setItem("kixki-mus","0");localStorage.setItem("kixki-snd","false");}catch(e){}});
  if(init)await pg.addInitScript(init);
  await pg.goto(url||srv.url+"index.html"+query);
  await pg.waitForFunction(()=>window.KXK&&KXK.ready&&KXK3&&true,null,{timeout:20000});
  await pg.evaluate(()=>{KXK.K.still=true;KXK.debug=false;});      /* quieta: sin paseos ni charla espontánea */
  await pg.waitForTimeout(1800);
  return {pg,br,srv,errs,close:async()=>{await br.close();srv.close();}};
}
export const sleep=ms=>new Promise(r=>setTimeout(r,ms));
