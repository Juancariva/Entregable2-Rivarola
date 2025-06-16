alert(`¡Bienvenido al juego de adivinar el número!

Pistas que podés recibir si fallás:
- Estás un poco alto/bajo (diferencia de 1 número).
- Estás muy alto/bajo (diferencia de 2 números).
- Estás demasiado alto/bajo (diferencia de 3 o más números).`);

let puntaje = 0;
let nivelesSuperados = [];
let intentosIniciales = 2;

function jugarNivel(nivel) {
  let numeroSecreto = Math.floor(Math.random() * (nivel * 5)) + 1;
  let intentos = intentosIniciales;
  let adivinanza;

  while (intentos > 0) {
    adivinanza = parseInt(prompt(`Nivel ${nivel} - Adivina el número (1 a ${nivel * 5}). Te quedan ${intentos} intentos:`));

    if (isNaN(adivinanza)) {
      alert("Por favor, ingresá un número válido.");
      continue;
    }

    if (adivinanza === numeroSecreto) {
      alert("¡Correcto!");
      puntaje = puntaje + (nivel * 10);
      nivelesSuperados.push(nivel);
      if (nivel % 2 === 1) {
      intentosIniciales = Math.min(intentosIniciales + 1, 5); // en los niveles impares suma 1 intento (nivel 1, 3, 5, etc), pero no más de 5
      }
      return true;
    }

    let diferencia = Math.abs(adivinanza - numeroSecreto);
    if (adivinanza > numeroSecreto) {
      if (diferencia === 1) alert("Estás un poco alto.");
      else if (diferencia === 2) alert("Estás muy alto.");
      else alert("Estás demasiado alto.");
    } else {
      if (diferencia === 1) alert("Estás un poco bajo.");
      else if (diferencia === 2) alert("Estás muy bajo.");
      else alert("Estás demasiado bajo.");
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

alert(`Juego terminado. \nPuntaje: ${puntaje}\nNiveles superados: ${nivelesSuperados.join(" - ")}`);
