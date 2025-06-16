alert("¡Bienvenido al juego de adivinar el número!");

let puntaje = 0;
let nivelesSuperados = [];

function jugarNivel(nivel) {
  let numeroSecreto = Math.floor(Math.random() * (nivel * 3)) + 1;
  let intentos = 3;
  let adivinanza;

  while (intentos > 0) {
    adivinanza = parseInt(prompt(`Nivel ${nivel} - Adivina el número (1 a ${nivel * 3}). Te quedan ${intentos} intentos:`));

    if (adivinanza === numeroSecreto) {
      alert("¡Correcto!");
      puntaje = puntaje + (nivel * 10);
      nivelesSuperados.push(nivel);
      return true;
    } else if (adivinanza > numeroSecreto) {
      alert("Demasiado alto");
    } else {
      alert("Demasiado bajo");
    }
    intentos--;
  }

  alert(`Perdiste. El número era ${numeroSecreto}`);
  return false;
}

let nivel = 1;
while (true) {
  let seguir = jugarNivel(nivel);
  if (!seguir) break;
  nivel++;
}

alert(`Juego terminado. Puntaje: ${puntaje}\nNiveles superados: ${nivelesSuperados.join(", ")}`);
