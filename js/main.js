// Constantes generales
const dificultad = 5;
const puntosNivel = 10;
const maxIntentos = 7;

// Objeto para encapsular el estado del juego
const juego = { 
  nivel: 1, 
  puntaje: 0, 
  nivelesSuperados: [], 
  intentosIniciales: 3, 
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

// Recuperar datos del localStorage (si hay)
recuperarDatos();

// Si no hay número secreto, iniciar nuevo nivel
if (!juego.numeroSecreto) {  
  iniciarNivel();
} else {              
  actualizarInterfaz();     
}

btnAdivinar.addEventListener("click", () => {
  const adivinanza = parseInt(inputNumero.value);

  if (isNaN(adivinanza)) {
    mostrarMensaje("Por favor, ingresá un número válido.", "error");
    return;
  }

  if (adivinanza === juego.numeroSecreto) {
    mostrarMensaje("¡Correcto! 🎉", "acierto");

    juego.puntaje += juego.nivel * puntosNivel;
    juego.nivelesSuperados.push(juego.nivel);

    // Sumar un intento si el nivel es impar, sin pasarse del tope que es 7 en este caso
    if (juego.nivel % 2 === 1) {
      juego.intentosIniciales = Math.min(juego.intentosIniciales + 1, maxIntentos);
    }

    actualizarResultados();

    if (juego.nivel === 10) {
      ganasteMensaje.classList.remove("oculto");
      desactivarInput();
      localStorage.removeItem("juego");
    } else {
      Swal.fire({
        title: `¡Nivel ${juego.nivel} superado! 🎉`, 
        text: "Vamos al siguiente nivel",            
        icon: "success",                             
        timer: 1500, 
        timerProgressBar: true, 
        showConfirmButton: false, 
        allowOutsideClick: false,
        allowEscapeKey: false               
      }).then(() => {                                
        juego.nivel++;                               
        iniciarNivel();                             
  });                                           
}
  } else {
    juego.intentos--;
    mostrarPista(adivinanza);

    if (juego.intentos <= 0) {
      mostrarMensaje(`Perdiste. El número era ${juego.numeroSecreto}`, "error");
      desactivarInput();
      localStorage.removeItem("juego");
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
  juego.numeroSecreto = Math.floor(Math.random() * (juego.nivel * dificultad)) + 1;
  juego.intentos = juego.intentosIniciales;
  actualizarInterfaz();
  guardarEnStorage();
}

function actualizarInterfaz() { 
  nivelInfo.textContent = `Nivel: ${juego.nivel}`; 
  intentosInfo.textContent = `Intentos restantes: ${juego.intentos}`; 
  rangoInfo.textContent = `El número está entre 1 y ${juego.nivel * dificultad}`; 
  puntajeInfo.textContent = `Puntaje: ${juego.puntaje}`; // Nuevo
  nivelesSuperadosInfo.textContent = `Niveles superados: ${juego.nivelesSuperados.join(", ")}`; 
  mensaje.textContent = "";
  inputNumero.disabled = false;
  btnAdivinar.disabled = false;
  inputNumero.focus();
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.style.color = tipo === "acierto" ? "green" : tipo === "error" ? "red" : "#333";
}

function mostrarPista(adivinanza) {
  const diferencia = Math.abs(adivinanza - juego.numeroSecreto);
  if (adivinanza > juego.numeroSecreto) {
    if (diferencia === 1) {
      mostrarMensaje(`${adivinanza} es un poco alto.`);
    } else if (diferencia === 2) {
      mostrarMensaje(`${adivinanza} es muy alto.`);
    } else {
      mostrarMensaje(`${adivinanza} es demasiado alto.`);
    }
  } else {
    if (diferencia === 1) {
      mostrarMensaje(`${adivinanza} es un poco bajo.`);
    } else if (diferencia === 2) {
      mostrarMensaje(`${adivinanza} es muy bajo.`);
    } else {
      mostrarMensaje(`${adivinanza} es demasiado bajo.`);
    }
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
      text: 'No se pudieron recuperar los datos del juego. Se reiniciara el juego.',
      confirmButtonText: 'Entendido',
      allowOutsideClick: false,
      allowEscapeKey: false
    });

    localStorage.removeItem("juego");  // limpiar los datos si están con algun error o corruptos
  } finally {
    // Notificación indicando que se cargaron (o reiniciaron) los datos
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Datos cargados (o reiniciados)',
      showConfirmButton: false,
      timer: 2000
    });
  }
}  