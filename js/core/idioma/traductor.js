/*
  Traductor: recorre la página, traduce al vuelo, recuerda el idioma elegido y avisa con el evento «kixki-lang».
*/

import { guardar, leer } from "../store.js";
import { traducir } from "./diccionario.js";
let lang, observador;

const LSK = "kixki-lang";

const ATT = ["aria-label", "placeholder", "title"];

const inKixki = (n) => {
  const e = n && (n.nodeType === 3 ? n.parentNode : n);
  return !!(e && e.closest && e.closest("#kixki"));
};

const arm = () => {
  if (lang === "en")
    observador.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATT,
    });
  else observador.disconnect();
};

function traducirNodo(n) {
  if (n._t !== undefined && n.nodeValue === n._t) return;
  const o = n.nodeValue;
  n._o = o;
  n._t = undefined;
  if (lang !== "en") return;
  const k = o.trim();
  if (!k) return;
  const t = traducir(k);
  if (t === k) return;
  n._t = o.replace(k, () => t);
  n.nodeValue = n._t;
}

function traducirAtributos(e, a) {
  const v = e.getAttribute(a);
  if (v == null) return;
  if (e._ta && e._ta[a] === v) return;
  (e._oa = e._oa || {})[a] = v;
  if (lang !== "en") return;
  const t = traducir(v.trim());
  if (t !== v.trim()) {
    (e._ta = e._ta || {})[a] = t;
    e.setAttribute(a, t);
  }
}

function all(r) {
  const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode()))
    if (!n.parentElement || !n.parentElement.closest("script,style")) traducirNodo(n);
  r.querySelectorAll(ATT.map((a) => `[${a}]`).join(",")).forEach((e) =>
    ATT.forEach((a) => traducirAtributos(e, a))
  );
}

function back() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode()))
    if (n._t !== undefined && n.nodeValue === n._t) {
      n.nodeValue = n._o;
      n._t = undefined;
    }
  document.querySelectorAll(ATT.map((a) => `[${a}]`).join(",")).forEach((e) => {
    if (!e._ta) return;
    for (const a in e._ta) if (e.getAttribute(a) === e._ta[a]) e.setAttribute(a, e._oa[a]);
    e._ta = null;
  });
}

export function iniciar() {
  lang = leer(LSK);
  if (lang !== "en" && lang !== "es") lang = "es";
  /* Kixki ya habla en el idioma activo: su globo (que cambia letra por letra al "teclear") no se traduce; antes cada letra pasaba por el diccionario */

  /* El observador solo existe mientras el idioma es inglés: en español no hay nada que traducir y antes recorría cada nodo nuevo (las 124 apps incluidas) solo para anotarlo. */
  observador = new MutationObserver((ms) => {
    for (const m of ms) {
      if (inKixki(m.target)) continue;
      if (m.type === "characterData") traducirNodo(m.target);
      else if (m.type === "attributes") traducirAtributos(m.target, m.attributeName);
      else
        m.addedNodes.forEach((n) =>
          n.nodeType === 3 ? traducirNodo(n) : n.nodeType === 1 && all(n)
        );
    }
  });

  document.documentElement.lang = lang;
  if (lang === "en") all(document.body);
  arm();
  window.KXI = {
    get lang() {
      return lang;
    },
    set(l) {
      lang = l;
      guardar(LSK, l);
      document.documentElement.lang = l;
      l === "en" ? all(document.body) : back();
      arm();
      dispatchEvent(new Event("kixki-lang"));
    },
    orig(el) {
      const n = el.firstChild;
      return n && n._o !== undefined && n._t !== undefined && n.nodeValue === n._t
        ? n._o.trim()
        : el.textContent.trim();
    },
  };
}
