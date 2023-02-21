import { ControladorPHP as Controlador } from './controlador.js';

listeners();
invalidarFormulario();
/**
 * Listeners
 */
function listeners() {
  document.getElementById('cancelar').addEventListener('click', redireccionar, false);
  window.addEventListener('click', enviarFormulario, false);
  //Comprobar
  document.getElementById('nombre').addEventListener('blur', comprobarNombre, false);
  document.getElementById('apellidos').addEventListener('blur', comprobarApellidos, false);
  document.getElementById('email').addEventListener('blur', comprobarEmail, false);
  document.getElementById('telefono').addEventListener('blur', comprobarTelefono, false);
  document.getElementById('nif').addEventListener('blur', comprobarNif, false);
  //Notificar error
  document.getElementById('nombre').addEventListener('invalid', notificarNombre, false);
  document.getElementById('apellidos').addEventListener('invalid', notificarApellidos, false);
  document.getElementById('email').addEventListener('invalid', notificarEmail, false);
  document.getElementById('telefono').addEventListener('invalid', notificarTelefono, false);
  document.getElementById('nif').addEventListener('invalid', notificarNif, false);
  //Comprobar si se ha corregido
  document.getElementById('nombre').addEventListener('input', correccionNombre, false);
  document.getElementById('apellidos').addEventListener('input', correccionApellidos, false);
  document.getElementById('email').addEventListener('input', correccionEmail, false);
  document.getElementById('telefono').addEventListener('input', correccionTelefono, false);
  document.getElementById('nif').addEventListener('input', correccionNif, false);
}

/**
 * Se comprueba que el boton clicado es el botón submit, después se comprueba que el formulario es correcto, si lo es se recogen los datos del formulario y se mandan a la función que manda los datos al servidor para que se introduzca al cliente, en caso de que el formulario no sea correcto  no se manda el formulario y se marcan el rojo los inputs que sean incorrectos.
 * @param {evento} e
 */
async function enviarFormulario(e) {
  if (e.target.type === 'submit') {
    if (comprobarFormulario()) {
      const datosFormulario = recogerDatosFormulario();
      const respuesta = await Controlador.enviarCliente(datosFormulario);
      tratarRespuestaServidor(respuesta);
    } else {
      e.preventDefault();
      //Blur en los errores para que se queden en rojo.
    }
  }
}

/**
 * Si el resultado de la respuesta es 'no', se deben tratar los errores.
 * @param {JSON} respuesta
 */
function tratarRespuestaServidor(respuesta) {
  if (respuesta.resultado === 'no') {
    //Se devuelven los datos erroneos que nos ha devuelto el servidor.
  }
}

/**
 * Obtenemos el formulario y todos sus datos, se devuelve un objeto con los datos del cliente.
 * @returns objeto con los datos del cliente
 */
function recogerDatosFormulario() {
  let datos = {};
  const formulario = document.getElementById('formulario');
  const formularioDatos = new FormData(formulario);
  console.log(formularioDatos.get('nombre'));
  return (datos = {
    nombre: formularioDatos.get('nombre'),
    apellidos: formularioDatos.get('apellidos'),
    email: formularioDatos.get('email'),
    telefono: formularioDatos.get('telefono'),
    nif: formularioDatos.get('nif'),
  });
}

/**
 * Comprueba si todos los inputs del formulario son correctos.
 * @returns boolean
 */
function comprobarFormulario() {
  //Se comprueban los inputs del formulario
  return true;
}

//Comprobar corrección

function correccionApellidos() {}

function correccionEmail() {}

function correccionNif() {}

function correccionNombre() {}

function correccionTelefono() {}

//Notificar errores

function notificarApellidos() {}

function notificarEmail() {}

function notificarNif() {}

function notificarNombre() {}

function notificarTelefono() {}

//Comprobar errores

function comprobarApellidos() {}

function comprobarEmail() {}

function comprobarNif() {}

function comprobarTelefono() {}

function comprobarNombre() {}

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
