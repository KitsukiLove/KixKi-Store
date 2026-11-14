/* ESLint (formato plano). Uso:  npx eslint .   — o  node tools/lint.mjs
   Reglas elegidas a propósito pocas: cazan errores reales (variables sin declarar, catch vacíos, código muerto)
   sin pelear con el estilo, que ya lo fija Prettier (.prettierrc.json). */
const navegador = {
  window: "readonly", document: "readonly", navigator: "readonly", localStorage: "readonly",
  sessionStorage: "readonly", location: "readonly", history: "readonly", console: "readonly",
  setTimeout: "readonly", clearTimeout: "readonly", setInterval: "readonly", clearInterval: "readonly",
  requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly", requestIdleCallback: "readonly",
  fetch: "readonly", URL: "readonly", Event: "readonly", CustomEvent: "readonly", Image: "readonly",
  Audio: "readonly", AudioContext: "readonly", webkitAudioContext: "readonly", MutationObserver: "readonly",
  IntersectionObserver: "readonly", ResizeObserver: "readonly", matchMedia: "readonly", getComputedStyle: "readonly",
  innerWidth: "readonly", innerHeight: "readonly", addEventListener: "readonly", removeEventListener: "readonly",
  dispatchEvent: "readonly", scrollTo: "readonly", scrollY: "readonly", scrollX: "readonly", devicePixelRatio: "readonly",
  performance: "readonly", NodeFilter: "readonly", Node: "readonly", HTMLElement: "readonly", Element: "readonly",
  DOMParser: "readonly", Blob: "readonly", FileReader: "readonly", TextEncoder: "readonly", TextDecoder: "readonly",
  AbortController: "readonly", Promise: "readonly", Intl: "readonly", crypto: "readonly", caches: "readonly",
  scheduler: "readonly", screen: "readonly", prompt: "readonly", confirm: "readonly", alert: "readonly",
  open: "readonly", close: "readonly", getSelection: "readonly", atob: "readonly", btoa: "readonly",
  structuredClone: "readonly", queueMicrotask: "readonly", self: "readonly", top: "readonly", parent: "readonly",
  URLSearchParams: "readonly", OfflineAudioContext: "readonly", CSS: "readonly", qrcode: "readonly", OffscreenCanvas: "readonly", Path2D: "readonly", DOMRect: "readonly", PointerEvent: "readonly", KeyboardEvent: "readonly",
  MouseEvent: "readonly", TouchEvent: "readonly", FormData: "readonly", Headers: "readonly", Request: "readonly",
  Response: "readonly", XMLHttpRequest: "readonly", WebSocket: "readonly", QRCode: "readonly",
};
/* Variables globales ENTRE archivos (la "deuda" de la estructura vieja). Cada fase de la reestructura las convierte en import y las quita de esta lista:
   cuando la lista quede vacía, ningún archivo depende de otro por una variable suelta. */
const entreArchivos = Object.fromEntries(
  ["KX", "KXS", "KXI", "KXK", "KXK3", "KXK4", "KXQ", "KXV", "KXD", "KXB", "KXBK", "KXM", "KXE", "KXG", "KXT", "KXXP", "KXRAIN", "KXPAS", "KXPET", "KXJ", "KXJ_get", "KXR", "XPGames"].map((n) => [n, "readonly"])
);
const reglas = {
  "no-undef": "error",
  "no-unused-vars": ["warn", { args: "none", caughtErrors: "none", varsIgnorePattern: "^_" }],
  "no-empty": ["warn", { allowEmptyCatch: false }],
  "no-redeclare": "error",
  "no-dupe-keys": "error",
  "no-unreachable": "warn",
  "no-self-assign": "warn",
  "eqeqeq": ["warn", "smart"],
  "prefer-const": "warn",
};
export default [
  { ignores: ["vendor/**", "logos/**", "data/**", "docs/**", "fonts/**", "node_modules/**", "sw.js"] },
  /* Módulos ES: todo js/ salvo las dos excepciones de abajo (se importan desde js/main.js) */
  { files: ["js/**/*.js"], ignores: ["js/xp/xpmode.js", "js/xp/xp-games.js"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...navegador, ...entreArchivos } }, rules: reglas },
  /* Scripts clásicos a propósito: xpmode.js va en <head> sin defer (evita el parpadeo de estilo); xp-games.js lo carga xpmode a demanda */
  { files: ["js/xp/xpmode.js", "js/xp/xp-games.js"], languageOptions: { ecmaVersion: "latest", sourceType: "script", globals: { ...navegador, ...entreArchivos } }, rules: reglas },
  /* tools/: los tests pasan funciones al navegador (page.evaluate), así que ahí «no definido» es ruido: solo se vigilan errores de sintaxis y código muerto */
  { files: ["tools/**/*.mjs", "eslint.config.mjs"], languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { process: "readonly", console: "readonly", Buffer: "readonly", URL: "readonly", setTimeout: "readonly", fetch: "readonly" } }, rules: { "no-redeclare": "error", "no-dupe-keys": "error", "no-unreachable": "warn" } },
];
