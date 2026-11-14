/*
  Parpadeo de las ovejas: un temporizador (no una animación infinita) para ahorrar batería.
*/

/* Parpadeo de las ovejas: cada 5,5 s los ojos se aclaran 0,17 s (un temporizador en vez de una animación infinita: ahorra mucha batería) */
export function iniciar() {
  const r = document.documentElement;
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const go = () => {
    if (!document.hidden) {
      r.classList.add("bk");
      setTimeout(() => r.classList.remove("bk"), 170);
    }
    setTimeout(go, 5500);
  };
  setTimeout(go, 5200);
}
