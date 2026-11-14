/*
  Reloj de la barra inferior (se actualiza cada 20 s).
*/

let clk;

const clock = () => {
  clk.textContent = new Date().toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function iniciar() {
  clk = document.getElementById("clk");

  clock();
  setInterval(clock, 20000);
}
