const CONFIG = {
  dificultad: 5,
  puntosNivel: 10,
  maxIntentos: 7,
  intentosIniciales: 3
};

// Objeto para encapsular el estado del juego
const juego = { 
  nivel: 1, 
  puntaje: 0, 
  nivelesSuperados: [], 
  intentosIniciales: CONFIG.intentosIniciales, 
  intentos: 0, 
  numeroSecreto: null 
};

const inputNumero = document.getElementById("input-numero");
const btnAdivinar = document.getElementById("btn-adivinar");
const mensaje = document.getElementById("mensaje");
const nivelInfo = document.getElementById("nivel-info");
const intentosInfo = document.getElementById("intentos-info");
const rangoInfo = document.getElementById("rango-info");
const puntajeInfo = document.getElementById("puntaje-info");
const nivelesSuperadosInfo = document.getElementById("niveles-superados");
const ganasteMensaje = document.getElementById("ganaste");

// ======= INIT: cargar config por fetch y luego levantar juego =======
document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  await cargarConfiguracion();        // <- fetch al JSON
  juego.intentosIniciales = CONFIG.intentosIniciales; // aplica config al juego
  await recuperarDatos();             
  if (!juego.numeroSecreto) iniciarNivel(); else actualizarInterfaz();
}

// ======= FETCH de config.json =======
async function cargarConfiguracion() {
  try {
    const resp = await fetch("data/config.json");
    if (!resp.ok) throw new Error("No se pudo cargar la configuración");
    const data = await resp.json();
    // pisa valores por los del JSON
    CONFIG.dificultad       = Number(data.dificultad)       || CONFIG.dificultad;
    CONFIG.puntosNivel      = Number(data.puntosNivel)      || CONFIG.puntosNivel;
    CONFIG.maxIntentos      = Number(data.maxIntentos)      || CONFIG.maxIntentos;
    CONFIG.intentosIniciales= Number(data.intentosIniciales)|| CONFIG.intentosIniciales;
  } catch (error) {
    await Swal.fire({
      icon: "warning",
      title: "Usando configuración por defecto",
      text: "No se pudo cargar data/config.json."
    });
  } finally {
    // Toast para mostrar qué config quedó aplicada
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: `Config aplicada — Dificultad: ${CONFIG.dificultad}`,
      showConfirmButton: false,
      timer: 1500
    });
  }
}

// ======= Eventos =======
btnAdivinar.addEventListener("click", adivinar);
inputNumero.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnAdivinar.click();
});

// ======= Lógica =======
function iniciarNivel() {
  juego.numeroSecreto = Math.floor(Math.random() * (juego.nivel * CONFIG.dificultad)) + 1;
  juego.intentos = juego.intentosIniciales;
  actualizarInterfaz();
  guardarEnStorage();
}

function actualizarInterfaz() {
  nivelInfo.textContent = `Nivel: ${juego.nivel}`;
  intentosInfo.textContent = `Intentos restantes: ${juego.intentos}`;
  rangoInfo.textContent = `El número está entre 1 y ${juego.nivel * CONFIG.dificultad}`;
  puntajeInfo.textContent = `Puntaje: ${juego.puntaje}`;
  nivelesSuperadosInfo.textContent = `Niveles superados: ${juego.nivelesSuperados.join(", ") || "—"}`;
  mensaje.textContent = "";
  inputNumero.disabled = false;
  btnAdivinar.disabled = false;
  inputNumero.focus();
}

function adivinar() {
  const adivinanza = parseInt(inputNumero.value);
  if (isNaN(adivinanza)) {
    mostrarMensaje("Por favor, ingresá un número válido.", "error");
    return;
  }

  if (adivinanza === juego.numeroSecreto) {
    mostrarMensaje("¡Correcto! 🎉", "acierto");

    juego.puntaje += juego.nivel * CONFIG.puntosNivel;
    juego.nivelesSuperados.push(juego.nivel);

    // niveles impares suman un intento (tope configurable)
    if (juego.nivel % 2 === 1) {
      juego.intentosIniciales = Math.min(juego.intentosIniciales + 1, CONFIG.maxIntentos);
    }

    actualizarResultados();

    if (juego.nivel === 10) {
      // Final con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Ganaste el juego!",
        text: `Puntaje final: ${juego.puntaje}`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      }).then(() => {
        ganasteMensaje.classList.remove("oculto");
        desactivarInput();
        localStorage.removeItem("juego");
      });
    } else {
      // Subir de nivel con SweetAlert2
      Swal.fire({
        title: `¡Nivel ${juego.nivel} superado! 🎉`,
        text: "Vamos al siguiente nivel",
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(() => {
        juego.nivel++;
        iniciarNivel();
      });
    }
  } else {
    juego.intentos--;
    mostrarPista(adivinanza);

    if (juego.intentos <= 0) {
      // Perdiste con SweetAlert2
      Swal.fire({
        icon: "error",
        title: "¡Sin intentos!",
        text: `Perdiste. El número era ${juego.numeroSecreto}`,
        confirmButtonText: "Reiniciar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      }).then(() => {
        desactivarInput();
        localStorage.removeItem("juego");
        // Reiniciar partida limpia
        Object.assign(juego, {
          nivel: 1,
          puntaje: 0,
          nivelesSuperados: [],
          intentosIniciales: CONFIG.intentosIniciales,
          intentos: 0,
          numeroSecreto: null
        });
        iniciarNivel();
      });
    } else {
      actualizarIntentos();
      guardarEnStorage();
    }
  }

  inputNumero.value = "";
}

function mostrarPista(adivinanza) {
  const diferencia = Math.abs(adivinanza - juego.numeroSecreto);
  if (adivinanza > juego.numeroSecreto) {
    if (diferencia === 1) mostrarMensaje(`${adivinanza} es un poco alto.`);
    else if (diferencia === 2) mostrarMensaje(`${adivinanza} es muy alto.`);
    else mostrarMensaje(`${adivinanza} es demasiado alto.`);
  } else {
    if (diferencia === 1) mostrarMensaje(`${adivinanza} es un poco bajo.`);
    else if (diferencia === 2) mostrarMensaje(`${adivinanza} es muy bajo.`);
    else mostrarMensaje(`${adivinanza} es demasiado bajo.`);
  }
}

function actualizarIntentos() {
  intentosInfo.textContent = `Intentos restantes: ${juego.intentos}`;
}

function actualizarResultados() {
  puntajeInfo.textContent = `Puntaje: ${juego.puntaje}`;
  nivelesSuperadosInfo.textContent = `Niveles superados: ${juego.nivelesSuperados.join(", ")}`;
  guardarEnStorage();
}

function desactivarInput() {
  inputNumero.disabled = true;
  btnAdivinar.disabled = true;
}

function guardarEnStorage() {
  localStorage.setItem("juego", JSON.stringify(juego));  
}

async function recuperarDatos() {
  try {
    const datosGuardados = localStorage.getItem("juego");

    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados);            
      Object.assign(juego, datos);                         
    }
  } catch (error) {
    // Alerta si ocurre un error al recuperar los datos
    await Swal.fire({
      icon: 'error',
      title: '⚠️ Error al cargar los datos',
      text: 'No se pudieron recuperar los datos del juego. Se reiniciará el juego.',
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    localStorage.removeItem("juego");  // limpiar los datos si están con algun error o corruptos
  }
}  

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.style.color = tipo === "acierto" ? "green" : tipo === "error" ? "red" : "#333";
}
