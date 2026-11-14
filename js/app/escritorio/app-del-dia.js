/*
  «Hoy te sugiero»: una app distinta cada día.
*/

import { setState } from "../catalogo/ventanas-cat.js";
import { front } from "./ventanas.js";
import { DSK } from "./vista.js";
let apps, appDelDia;

export function iniciar() {
  apps = [...document.querySelectorAll(".app")];
  appDelDia = apps[Math.floor(Date.now() / 864e5) % apps.length];
  document
    .getElementById("count")
    .insertAdjacentHTML(
      "afterend",
      `<button type="button" class="pick" id="pick">🐑 Hoy te sugiero: <b>${appDelDia.querySelector("h3").textContent}</b></button>`
    );
  document.getElementById("pick").onclick = () => {
    const s = appDelDia.closest(".cat");
    if (s.classList.contains("min")) setState(s, DSK() ? "normal" : "max");
    front(s);
    appDelDia.scrollIntoView({ block: "center", behavior: "smooth" });
    appDelDia.classList.add("hl");
    setTimeout(() => appDelDia.classList.remove("hl"), 3500);
  };
}
