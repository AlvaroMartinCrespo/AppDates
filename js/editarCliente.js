import { ControladorPHP as Controlador } from './controlador.js';

listeners();
enfocarPrimerElementoFormulario();

function listeners() {
  window.addEventListener('load', cargarNombre, false);
  window.addEventListener('click', redireccionarAListaClientes, false);
  window.addEventListener('click', enviarFormulario, false);

  const inputs = document.getElementsByTagName('input');

  for (let index = 0; index < inputs.length; index++) {
    if (inputs[index].id !== 'cancelar' && inputs[index].value !== 'Editar Cliente') {
      inputs[index].addEventListener('blur', comprobarCampo, false);
      inputs[index].addEventListener('invalid', mostrarErrorCampo, false);
      inputs[index].addEventListener('input', correccionCampo, false);
    }
  }
}

/**
 * Enfoca el primer elemento del formulario.
 */
function enfocarPrimerElementoFormulario() {
  const inputs = document.getElementsByTagName('input');
  inputs[0].focus();
}

/**
 * Carga el nombre y apellido del usuario para mostrarlo en pantalla.
 */
function cargarNombre() {
  const nombre = localStorage.getItem('nombre');
  const apellidos = localStorage.getItem('apellidos');
  document.getElementById('nombreCliente').innerHTML = `${nombre} ${apellidos}`;
}

/**
 * Redirecciona al index donde muestra los clientes.
 * @param {evento} e
 */
function redireccionarAListaClientes(e) {
  if (e.target.id === 'cancelar') {
    window.location.href = './index.html';
  }
}

/**
 * Se comprueba la información del formulario, si es correcto se recoge la información y se envia para servidor.
 * @param {evento} e
 */
async function enviarFormulario(e) {
  if (e.target.type === 'submit') {
    e.preventDefault();
    if (comprobarFormulario()) {
      const datosFormulario = recogerDatosFormulario();
      await Controlador.enviarCliente(datosFormulario); //Usar la función del controlador de editar cliente.
      window.location.href = 'nuevo-cliente.html';
    }
    marcarPrimerElementoEnRojo();
  }
}

/**
 * Recoge los datos del formulario y los devuelve como objeto.
 * @returns objeto con los datos del cliente
 */
function recogerDatosFormulario() {
  let datos = {};
  const formulario = document.getElementById('formulario');
  const formularioDatos = new FormData(formulario);
  const telefonoCliente = formularioDatos.get('telefono').replace(/\s+/g, '');
  return (datos = {
    nombre: formularioDatos.get('nombre'),
    apellidos: formularioDatos.get('apellidos'),
    email: formularioDatos.get('email'),
    telefono: telefonoCliente,
  });
}

/**
 * Marca el primer elemento que tenga error.
 */
function marcarPrimerElementoEnRojo() {
  const campo = document.querySelector('.border-red-600');
  if (campo) {
    campo.focus();
  }
}

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

  if (e.target.id === 'email' || e.target.id === 'telefono') {
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
