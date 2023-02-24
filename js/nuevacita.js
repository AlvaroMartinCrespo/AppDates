import { ControladorPHP as Controlador } from './controlador.js';

listeners();
invalidarFormulario();

/**
 * Creamos los listeners para el correcto funcionamiento de la página.
 */
function listeners() {
  document.getElementById('cancelar').addEventListener('click', redireccionarIndex, false);
  window.addEventListener('click', enviarFormulario, false);
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
    if (comprobarFormulario()) {
      const datos = recogerDatosFormulario();
      // console.log(datos);
      e.preventDefault();
      const respuesta = await Controlador.crearCitaCliente(datos);
      tratarRespuesta(respuesta);
    } else {
      e.preventDefault();
      //Blur en los errores para que se queden en rojo.
    }
  }
}

/**
 * Comprueba que todos los campos del formulario son correctos.
 * @returns boolean
 */
function comprobarFormulario() {
  return true;
}

/**
 * Se le pasa el json de la respuesta del servidor, si la respuesta es 'no' se tratan los errores.
 * @param {json respuesta} respuesta
 */
function tratarRespuesta(respuesta) {}

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
