// Servidor local mínimo para probar la página sin subirla a GitHub.
//
// Por qué existe: los módulos ES (<script type="module">) no se ejecutan al abrir index.html con doble clic
// (file://), el navegador los bloquea. Con este servidor sí funcionan, igual que en GitHub Pages.
//
// Uso:   node tools/serve.mjs [puerto]      →  http://localhost:8080
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PUERTO = Number(process.argv[2]) || 8080;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".txt": "text/plain; charset=utf-8",
};

/** Convierte la URL pedida en una ruta de disco, sin permitir salir de la carpeta del proyecto. */
function rutaSegura(urlPedida) {
  const limpia = decodeURIComponent(urlPedida.split("?")[0].split("#")[0]);
  const ruta = normalize(join(RAIZ, limpia));
  const dentro = ruta === RAIZ || ruta.startsWith(RAIZ + sep);
  return dentro ? ruta : null;
}

async function resolverArchivo(ruta) {
  const info = await stat(ruta);
  return info.isDirectory() ? join(ruta, "index.html") : ruta;
}

const servidor = createServer(async (peticion, respuesta) => {
  try {
    const ruta = rutaSegura(peticion.url || "/");
    if (!ruta) {
      respuesta.writeHead(403).end("Prohibido");
      return;
    }
    const archivo = await resolverArchivo(ruta);
    const cuerpo = await readFile(archivo);
    respuesta.writeHead(200, {
      "Content-Type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    respuesta.end(cuerpo);
  } catch {
    // Archivo inexistente o ilegible: para el navegador es un 404 normal, no un fallo del servidor.
    respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("No encontrado");
  }
});

servidor.listen(PUERTO, () => {
  console.log(`KixKi Store en  http://localhost:${PUERTO}   (Ctrl+C para parar)`);
});
