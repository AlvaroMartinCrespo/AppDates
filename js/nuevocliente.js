import { ControladorPHP as Controlador } from './controlador.js';

listeners();
invalidarFormulario();

// console.log(document.getElementsByTagName('input'));

/**
 * Listeners
 */
function listeners() {
  document.getElementById('cancelar').addEventListener('click', redireccionar, false);
  window.addEventListener('click', enviarFormulario, false);
  //Comprobar campos inputs
  const inputs = document.getElementsByTagName('input');
  for (let index = 0; index < inputs.length; index++) {
    if (inputs[index].id !== 'cancelar' && inputs[index].value !== 'Agregar Cliente') {
      inputs[index].addEventListener('blur', comprobarCampo, false);
      inputs[index].addEventListener('invalid', mostrarErrorCampo, false);
      inputs[index].addEventListener('input', correccionCampo, false);
    }
  }
}

/**
 * Marca en rojo el primer elemento que tenga la clase border-red-600
 */
function marcarPrimerElementoEnRojo() {
  const campo = document.querySelector('.border-red-600');
  if (campo) {
    campo.focus();
  }
}

/**
 * Se comprueba que el boton clicado es el botón submit, después se comprueba que el formulario es correcto, si lo es se recogen los datos del formulario y se mandan a la función que manda los datos al servidor para que se introduzca al cliente, en caso de que el formulario no sea correcto  no se manda el formulario y se marcan el rojo los inputs que sean incorrectos.
 * @param {evento} e
 */
async function enviarFormulario(e) {
  if (e.target.type === 'submit') {
    e.preventDefault();
    if (comprobarFormulario()) {
      const datosFormulario = recogerDatosFormulario();
      const respuesta = await Controlador.enviarCliente(datosFormulario);
      if (tratarRespuestaServidor(respuesta)) window.location.href = 'nuevo-cliente.html';
    }
  }
  marcarPrimerElementoEnRojo();
}

/**
 * Si el resultado de la respuesta es 'no', se deben tratar los errores.
 * @param {JSON} respuesta
 */
function tratarRespuestaServidor(respuesta) {
  let valido = true;
  if (respuesta.resultado === 'no') {
    for (let index = 0; index < respuesta.camposError.length; index++) {
      document.getElementById(respuesta.camposError[index]).classList.add('border-red-600');
      document.getElementById(`error-${respuesta.camposError[index]}`).innerHTML = respuesta.mensajesError[index];
    }
    valido = false;
  }
  marcarPrimerElementoEnRojo();
  return valido;
}

/**
 * Obtenemos el formulario y todos sus datos, se devuelve un objeto con los datos del cliente.
 * @returns objeto con los datos del cliente
 */
function recogerDatosFormulario() {
  let datos = {};
  const formulario = document.getElementById('formulario');
  const formularioDatos = new FormData(formulario);
  const telefonoCliente = formularioDatos.get('telefono').replace(/\s+/g, '');
  const nifCliente = formularioDatos.get('nif').replace('-', '');
  return (datos = {
    nombre: formularioDatos.get('nombre'),
    apellidos: formularioDatos.get('apellidos'),
    email: formularioDatos.get('email'),
    telefono: telefonoCliente,
    nif: nifCliente,
  });
}

/**
 * Comprueba si todos los inputs del formulario son correctos.
 * @returns boolean
 */
function comprobarFormulario(e) {
  let valido = true;
  const inputs = document.getElementsByTagName('input');
  for (let index = 0; index < inputs.length; index++) {
    if (inputs[index].id !== 'cancelar' && inputs[index].value !== 'Agregar Cliente') {
      if (!inputs[index].checkValidity()) {
        inputs[index].blur();
        valido = false;
      }
    }
  }
  return valido;
}

/**
 * Comprueba con cada input si el campo es valido o no, en caso de que sea valido elimina el mensaje de error.
 * @param {evento} e
 */
function correccionCampo(e) {
  if (e.target.checkValidity()) {
    document.getElementById(`error-${e.target.name}`).innerHTML = '';
    e.target.classList.remove('border-red-600');
  }
}

/**
 * Si un campo es inválido, se llama a esta función donde se obtiene el tipo de error y lo imprime en pantalla en el campo de error correspondiente al elemento.
 * @param {evento} e
 */
function mostrarErrorCampo(e) {
  const mensajeError = mensajeTipoError(e);

  if (e.target.id === 'email' || e.target.id === 'telefono' || e.target.id === 'nif') {
    document.getElementById(`error-${e.target.name}`).innerHTML = e.target.title;
    e.target.classList.add('border-red-600');
  } else {
    document.getElementById(`error-${e.target.name}`).innerHTML = mensajeError;
    e.target.classList.add('border-red-600');
  }
}

/**
 * Comprueba si el campo introducido es valido o no.
 * @param {event} e
 * @returns boolean
 */
function comprobarCampo(e) {
  return e.target.checkValidity();
}

/**
 * Se le pasa el evento del elemento correspondiente y mediante el metodo validity obtenemos el error que tiene.
 * @param {evento} e
 * @returns string error
 */
function mensajeTipoError(e) {
  let mensaje = '';
  if (e.target.validity.valueMissing) {
    mensaje = 'El campo no puede estar vacío.';
  } else if (e.target.validity.tooLong) {
    mensaje = 'Demasiado largo.';
  } else if (e.target.validity.tooShort) {
    mensaje = 'Demasiado corto.';
  }
  return mensaje;
}

/**
 * Redirecciona a la página principal donde se listan los clientes.
 */
function redireccionar() {
  window.location.href = 'index.html';
}

/**
 * No se comprueba nada desde HTML, se comprueban los inputs desde JS.
 */
function invalidarFormulario() {
  document.getElementById('formulario').setAttribute('novalidate', true);
}
