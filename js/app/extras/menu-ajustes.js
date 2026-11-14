/*
  Menú de ajustes (#sm): color de acento, logos pixel, sonido, vista PC/móvil, instalar la app y accesos a Ejecutar,
  juego y QR. rotularMenu() refresca los textos de los botones.
*/

import { guardar, leer } from "../../core/store.js";
import { $ } from "../../core/util.js";
import { menuAjustes } from "../escritorio/ventanas.js";
import { DSK, root } from "../escritorio/vista.js";
import { rdIc } from "./boton-sonido.js";
import { abrirJuego, mostrarPantallaCompleta, abrirQR, abrirEjecutar } from "./ejecutar.js";
import { olvidarEventoInstalar, eventoInstalar } from "./instalar.js";
import { aplicarLogosPixel, logosPixel, fijarLogosPixel } from "./listas.js";
import { beep, fijarSonido, sonidoActivo } from "./sonido.js";

let indiceAcento;

const ACENTOS = ["", "mint", "rose", "dusk"];

const NOMBRES_ACENTO = ["Lila", "Menta", "Rosa", "Atardecer"];

const setAcc = () => {
  ACENTOS[indiceAcento]
    ? (root.dataset.acc = ACENTOS[indiceAcento])
    : root.removeAttribute("data-acc");
  guardar("kixki-acc", ACENTOS[indiceAcento]);
};

export const rotularMenu = () => {
  $("#s-lang").textContent = "Idioma: " + (KXI.lang === "en" ? "English" : "Español");
  $("#s-view").textContent = DSK() ? "Modo móvil" : "Modo PC";
  $("#s-mus").textContent = "Música: " + (KXM.on ? "sí" : "no");
  $("#s-bg").textContent = "Fondo: " + KXB.label();
  $("#s-acc").textContent = "Color: " + NOMBRES_ACENTO[indiceAcento];
  $("#s-pix").textContent = "Logos pixel: " + (logosPixel ? "sí" : "no");
  $("#s-snd").textContent = "Efectos: " + (sonidoActivo ? "sí" : "no");
};

export function iniciar() {
  indiceAcento = Math.max(0, ACENTOS.indexOf(leer("kixki-acc", "")));

  menuAjustes.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="sm" id="s-run">Ejecutar… (Ctrl+K)</button><button type="button" class="sm" id="s-acc"></button><button type="button" class="sm" id="s-pix"></button><button type="button" class="sm" id="s-snd"></button><button type="button" class="sm" id="s-inst" hidden>Instalar app</button><button type="button" class="sm" id="s-mus"></button><button type="button" class="sm" id="s-bg"></button><button type="button" class="sm" id="s-view"></button><button type="button" class="sm" id="s-lang"></button><button type="button" class="sm" id="s-game">Salta Vallas</button><button type="button" class="sm" id="s-sug">Sugerir una app</button><button type="button" class="sm d" id="s-qr">Ábrelo en tu móvil</button><button type="button" class="sm d" id="s-off">Apagar</button>`
  );
  setAcc();
  rotularMenu();
  aplicarLogosPixel();
  addEventListener("kixki-mode", rotularMenu);
  addEventListener("kixki-snd", rotularMenu);
  menuAjustes.addEventListener("click", (e) => {
    const b = e.target.closest("button[id^=s-]");
    if (!b) return;
    const k = b.id;
    if (k === "s-acc") {
      indiceAcento = (indiceAcento + 1) % ACENTOS.length;
      setAcc();
      rotularMenu();
      return;
    }
    if (k === "s-pix") {
      fijarLogosPixel(!logosPixel);
      guardar("kixki-px", logosPixel);
      aplicarLogosPixel();
      rotularMenu();
      return;
    }
    if (k === "s-view") {
      menuAjustes.hidden = true;
      KX.setView(DSK() ? "movil" : "pc");
      return;
    }
    if (k === "s-lang") {
      KXI.set(KXI.lang === "en" ? "es" : "en");
      rotularMenu();
      return;
    }
    if (k === "s-inst") {
      if (eventoInstalar) {
        eventoInstalar.prompt();
        olvidarEventoInstalar();
        $("#s-inst").hidden = true;
      }
      return;
    }
    if (k === "s-mus") {
      KXM.toggle();
      rdIc();
      rotularMenu();
      return;
    }
    if (k === "s-bg") {
      KXB.next();
      rotularMenu();
      return;
    }
    if (k === "s-snd") {
      fijarSonido(!sonidoActivo);
      guardar("kixki-snd", sonidoActivo);
      rdIc();
      rotularMenu();
      beep(880, 0.1);
      return;
    }
    menuAjustes.hidden = true;
    if (k === "s-run") abrirEjecutar();
    else if (k === "s-game") abrirJuego();
    else if (k === "s-qr") abrirQR();
    else if (k === "s-off") mostrarPantallaCompleta("off");
    else if (k === "s-sug")
      window.open(
        "https://github.com/KitsukiLove/KixKi-Store/issues/new?template=sugerir-app.yml&title=" +
          encodeURIComponent("Sugerencia: "),
        "_blank",
        "noopener"
      );
  });
}
