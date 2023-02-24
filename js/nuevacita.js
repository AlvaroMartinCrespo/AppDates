import { ControladorPHP as Controlador } from './controlador.js';

listeners();
invalidarFormulario();

/**
 * Creamos los listeners para el correcto funcionamiento de la página.
 */
function listeners() {
  document.getElementById('cancelar').addEventListener('click', redireccionarIndex, false);
  window.addEventListener('click', enviarFormulario, false);
  const campos = document.querySelectorAll('.auto-validable');
  for (let index = 0; index < campos.length; index++) {
    campos[index].addEventListener('blur', comprobarError, false);
    campos[index].addEventListener('invalid', notificarError, false);
    campos[index].addEventListener('input', corregirError, false);
  }
}

/**
 * Por cada evento input que reciba el campo se comprueba si es válido.
 * @param {evento} e
 */
function corregirError(e) {
  if (e.target.checkValidity()) {
    document.getElementById(`error-${e.target.name}`).innerHTML = '';
    e.target.classList.remove('border-red-600');
  }
}

/**
 * Si el campo no es válido se llamará a esta función y se insertará en el campo de error correspondiente al input el error.
 * @param {evento} e
 */
function notificarError(e) {
  document.getElementById(`error-${e.target.name}`).innerHTML = 'Este campo no puede estar vacío';
  e.target.classList.add('border-red-600');
}

/**
 * Comprobamos si el campo es válido
 * @param {evento} e
 * @returns boolean
 */
function comprobarError(e) {
  return e.target.checkValidity();
}

/**
 * Redirecciona al index.
 */
function redireccionarIndex() {
  window.location.href = './index.html';
}

// TO DO
//Comprobar si funciona el introducir citas en bbdd.

/**
 * Si le damos click al botón submit se comprobará si el formulario es correcto, si es correcto se recogeran los datos del formulario y se le enviaran los datos a la función del controlador para que se comunique con el servidor mandando la información y nos devolverá una respuesta que trataremos más adelante.
 * @param {evento} e
 */
async function enviarFormulario(e) {
  if (e.target.type === 'submit') {
    e.preventDefault();
    if (comprobarFormulario()) {
      const datos = recogerDatosFormulario();
      const respuesta = await Controlador.crearCitaCliente(datos);
      if (tratarRespuesta(respuesta)) window.location.href = 'nueva-cita.html';
    }
  }
}

/**
 * Comprueba que todos los campos del formulario son correctos.
 * @returns boolean
 */
function comprobarFormulario() {
  let valido = true;
  const inputs = document.querySelectorAll('.auto-validable');
  for (let index = 0; index < inputs.length; index++) {
    if (!inputs[index].checkValidity()) {
      inputs[index].blur();
      valido = false;
    }
  }
  document.querySelector('.border-red-600').focus();
  return valido;
}

/**
 * Se le pasa el json de la respuesta del servidor, si la respuesta es 'no' se tratan los errores.
 * @param {json respuesta} respuesta
 */
function tratarRespuesta(respuesta) {
  let valido = true;
  if (respuesta.resultado === 'no') {
    for (let index = 0; index < respuesta.camposError.length; index++) {
      document.getElementById(`error-${respuesta.camposError[index]}`).innerHTML = respuesta.mensajesError[index];
    }
    valido = false;
  }
  return valido;
}

/**
 * Obtenemos los datos del formulario lo convertirmos en un objeto y lo devolvemos.
 * @returns objeto datos formulario
 */
function recogerDatosFormulario() {
  let datos = {};
  const nifCliente = localStorage.getItem('nifCliente');
  const formulario = document.getElementById('formulario');
  const formularioDatos = new FormData(formulario);
  return (datos = {
    nifCliente: nifCliente,
    fecha: formularioDatos.get('fecha'),
    hora: formularioDatos.get('hora'),
    descripcion: formularioDatos.get('descripcion'),
    detalles: formularioDatos.get('detalles'),
  });
}

/**
 * Invalida el formulario
 */
function invalidarFormulario() {
  document.getElementById('formulario').setAttribute('novalidate', true);
}
