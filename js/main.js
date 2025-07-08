// Constantes y variables principales
const dificultad = 5;
const puntosNivel = 10;
const maxIntentos = 7;

let nivel = 1;
let puntaje = 0;
let nivelesSuperados = [];
let intentosIniciales = 3;
let numeroSecreto;
let intentos;

const inputNumero = document.getElementById("input-numero");
const btnAdivinar = document.getElementById("btn-adivinar");
const mensaje = document.getElementById("mensaje");
const nivelInfo = document.getElementById("nivel-info");
const intentosInfo = document.getElementById("intentos-info");
const rangoInfo = document.getElementById("rango-info");
const puntajeInfo = document.getElementById("puntaje-info");
const nivelesSuperadosInfo = document.getElementById("niveles-superados");
const ganasteMensaje = document.getElementById("ganaste");

// Recuperar datos primero (antes de iniciar nivel)
recuperarDatos();

// Si no hay número secreto recuperado, iniciar nivel nuevo
if (!numeroSecreto) {  
  iniciarNivel();
} else {              
  // Actualizar interfaz con datos recuperados   
  nivelInfo.textContent = `Nivel: ${nivel}`;     
  intentosInfo.textContent = `Intentos restantes: ${intentos}`;  
  rangoInfo.textContent = `El número está entre 1 y ${nivel * dificultad}`;  
  puntajeInfo.textContent = `Puntaje: ${puntaje}`;                 
  nivelesSuperadosInfo.textContent = `Niveles superados: ${nivelesSuperados.join(", ")}`;  // NUEVO
  inputNumero.disabled = false;  
  btnAdivinar.disabled = false;  
  mensaje.textContent = "";  
  inputNumero.focus();     
}

btnAdivinar.addEventListener("click", () => {
  const adivinanza = parseInt(inputNumero.value);

  if (isNaN(adivinanza)) {
    mostrarMensaje("Por favor, ingresá un número válido.", "error");
    return;
  }

  if (adivinanza === numeroSecreto) {
    mostrarMensaje("¡Correcto! 🎉", "acierto");

    puntaje += nivel * puntosNivel;
    nivelesSuperados.push(nivel);

    // Sumar un intento si el nivel es impar, sin pasarse del tope que es 7 en este caso
    if (nivel % 2 === 1) {
      intentosIniciales = Math.min(intentosIniciales + 1, maxIntentos);
    }

    actualizarResultados();

    if (nivel === 10) {
      ganasteMensaje.classList.remove("oculto");
      desactivarInput();
      localStorage.clear();
    } else {
      nivel++;
      iniciarNivel();
    }
  } else {
    intentos--;
    mostrarPista(adivinanza);

    if (intentos <= 0) {
      mostrarMensaje(`Perdiste. El número era ${numeroSecreto}`, "error");
      desactivarInput();
      localStorage.removeItem("puntaje");
      localStorage.removeItem("nivelesSuperados");
      localStorage.removeItem("nivel");       
      localStorage.removeItem("intentos");   
      localStorage.removeItem("numeroSecreto");
    } else {
      actualizarIntentos();
      guardarEnStorage();
    }
  }

  inputNumero.value = "";
});

inputNumero.addEventListener("keydown", (e) => { 
  if (e.key === "Enter") {                       
    btnAdivinar.click();                         
  }                                              
});                                             

function iniciarNivel() {
  numeroSecreto = Math.floor(Math.random() * (nivel * dificultad)) + 1;
  intentos = intentosIniciales;

  nivelInfo.textContent = `Nivel: ${nivel}`;
  intentosInfo.textContent = `Intentos restantes: ${intentos}`;
  rangoInfo.textContent = `El número está entre 1 y ${nivel * dificultad}`;
  mensaje.textContent = "";
  inputNumero.disabled = false;
  btnAdivinar.disabled = false;
  inputNumero.focus();
  guardarEnStorage();
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.style.color = tipo === "acierto" ? "green" : tipo === "error" ? "red" : "#333";
}

function mostrarPista(adivinanza) {
  const diferencia = Math.abs(adivinanza - numeroSecreto);
  if (adivinanza > numeroSecreto) {
    if (diferencia === 1) {
      mostrarMensaje("Estás un poco alto.");
    } else if (diferencia === 2) {
      mostrarMensaje("Estás muy alto.");
    } else {
      mostrarMensaje("Estás demasiado alto.");
    }
  } else {
    if (diferencia === 1) {
      mostrarMensaje("Estás un poco bajo.");
    } else if (diferencia === 2) {
      mostrarMensaje("Estás muy bajo.");
    } else {
      mostrarMensaje("Estás demasiado bajo.");
    }
  }
}

function actualizarIntentos() {
  intentosInfo.textContent = `Intentos restantes: ${intentos}`;
}

function actualizarResultados() {
  puntajeInfo.textContent = `Puntaje: ${puntaje}`;
  nivelesSuperadosInfo.textContent = `Niveles superados: ${nivelesSuperados.join(", ")}`;
  guardarEnStorage();
}

function desactivarInput() {
  inputNumero.disabled = true;
  btnAdivinar.disabled = true;
}

function guardarEnStorage() {
  localStorage.setItem("puntaje", puntaje);
  localStorage.setItem("nivelesSuperados", JSON.stringify(nivelesSuperados));
  localStorage.setItem("nivel", nivel);              
  localStorage.setItem("intentos", intentos);        
  localStorage.setItem("numeroSecreto", numeroSecreto);  
}

function recuperarDatos() {
  const puntajeGuardado = localStorage.getItem("puntaje");
  const nivelesGuardados = localStorage.getItem("nivelesSuperados");
  const nivelGuardado = localStorage.getItem("nivel");          
  const intentosGuardados = localStorage.getItem("intentos");    
  const numeroSecretoGuardado = localStorage.getItem("numeroSecreto");

  if (puntajeGuardado) {
    puntaje = parseInt(puntajeGuardado);
    puntajeInfo.textContent = `Puntaje: ${puntaje}`;
  }

  if (nivelesGuardados) {
    nivelesSuperados = JSON.parse(nivelesGuardados);
    nivelesSuperadosInfo.textContent = `Niveles superados: ${nivelesSuperados.join(", ")}`;
  }

  if (nivelGuardado) {
    nivel = parseInt(nivelGuardado);
  }

  if (intentosGuardados) {
    intentos = parseInt(intentosGuardados);
  }

  if (numeroSecretoGuardado) {
    numeroSecreto = parseInt(numeroSecretoGuardado);
  }
}