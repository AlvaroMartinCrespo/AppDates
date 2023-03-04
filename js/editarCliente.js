import { ControladorPHP as Controlador } from './controlador.js';

listeners();
enfocarPrimerElementoFormulario();

function listeners() {
  window.addEventListener('load', cargarInformacion, false);
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

function datos() {
  return (datos = {
    nombre: localStorage.getItem('nombre'),
    apellidos: localStorage.getItem('apellidos'),
    email: localStorage.getItem('email'),
    telefono: localStorage.getItem('telefono'),
    nif: localStorage.getItem('nif'),
  });
}

/**
 * Carga el nombre y apellido del usuario para mostrarlo en pantalla.
 */
function cargarInformacion() {
  const { nombre, apellidos, email, telefono, nif } = datos();
  document.getElementById('nombreCliente').innerHTML = `${nombre} ${apellidos}`;
  document.getElementById('nombre').value = nombre;
  document.getElementById('apellidos').value = apellidos;
  document.getElementById('email').value = email;
  document.getElementById('telefono').value = telefono;
  añadirNifDesactivado(nif);
}

/**
 * Creamos un elemento input y lo introducimos en el html con los datos del nif.
 * Le agregamos el atributo disabled para que no se pueda cambiar.
 * @param {string} nif
 */
function añadirNifDesactivado(nif) {
  const telefonoInput = document.getElementById('telefono').parentElement;
  const divForm = document.createElement('div');
  divForm.classList.add('mb-4');
  divForm.innerHTML = `<label class="block text-gray-700 text-sm font-bold mb-2" for="nif">Nif</label><input value="${nif}" class="bg-gray-300 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline auto-validable" id="nif" name="nif" type="text" required/>`;
  telefonoInput.insertAdjacentElement('afterend', divForm);
  document.getElementById('nif').setAttribute('disabled', '');
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
      await Controlador.actualizarCliente(datosFormulario); //Usar la función del controlador de editar cliente.
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
    nif: localStorage.getItem('nif'),
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
