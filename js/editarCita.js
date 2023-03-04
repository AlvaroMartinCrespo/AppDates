import { ControladorPHP as Controlador } from './controlador.js';

listeners();
invalidarFormulario();
enfocarPrimerElementoFormulario();

/**
 * Creamos los listeners para el correcto funcionamiento de la página.
 */
function listeners() {
  document.getElementById('cancelar').addEventListener('click', redireccionarIndex, false);
  window.addEventListener('click', enviarFormulario, false);
  window.addEventListener('load', cargarInformacion, false);
  const campos = document.querySelectorAll('.auto-validable');
  for (let index = 0; index < campos.length; index++) {
    campos[index].addEventListener('blur', comprobarError, false);
    campos[index].addEventListener('invalid', notificarError, false);
    campos[index].addEventListener('input', corregirError, false);
  }
}

/**
 * Recoge los datos de la cita del localStorage y los devuleve en forna de objeto.
 * @returns objeto datos cita
 */
function obtenerInformacionCita() {
  let datos = {};
  return (datos = {
    fecha: localStorage.getItem('fecha'),
    hora: localStorage.getItem('hora'),
    id: localStorage.getItem('idCita'),
  });
}

/**
 * Obtiene fecha y hora de obtenerInformacionCita y los introduce en los input de fecha y hora del form, luego obtiene descripción y detalles, llamando a un método del controlador que devuelve la cita mediante su id, y los introduce en los input de descripción y detalles.
 */
async function cargarInformacion() {
  const { fecha, hora, id } = obtenerInformacionCita();
  const datos = await Controlador.getCita(id);
  const descripcion = datos.datos[0].descripcion;
  const detalles = datos.datos[0].detalles;
  document.getElementById('hora').value = hora;
  document.getElementById('fecha').value = fecha;
  document.getElementById('descripcion').value = descripcion;
  document.getElementById('detalles').value = detalles;
}

/**
 * Enfoca el primer elemento del formulario.
 */
function enfocarPrimerElementoFormulario() {
  const inputs = document.getElementsByTagName('input');
  inputs[0].focus();
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
      const respuesta = await Controlador.actualizarCita(datos);
      if (tratarRespuesta(respuesta)) window.location.href = 'lista-citas.html';
    }
    marcarPrimerElementoEnRojo();
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
  // document.querySelector('.border-red-600').focus();
  return valido;
}

/**
 * Se le pasa el json de la respuesta del servidor, si la respuesta es 'no' se tratan los errores.
 * @param {json respuesta} respuesta
 */
function tratarRespuesta(respuesta) {
  let valido = true;
  console.log(respuesta);
  if (respuesta.resultado === 'no') {
    for (let index = 0; index < respuesta.camposError.length; index++) {
      document.getElementById(respuesta.camposError[index]).classList.add('border-red-600');
      document.getElementById(`error-${respuesta.camposError[index]}`).innerHTML = respuesta.mensajesError[index];
    }
    marcarPrimerElementoEnRojo();
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
  const idCita = localStorage.getItem('idCita');
  const formularioDatos = new FormData(formulario);
  return (datos = {
    nifCliente: nifCliente,
    idCita: idCita,
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
