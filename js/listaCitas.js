import { ControladorPHP as Controlador } from './controlador.js';

listerners();

/**
 * Listenes para el correcto funcionamiento de la página
 */
function listerners() {
  window.addEventListener('load', tratarDatos, false);
  document.getElementById('volverClientes').addEventListener('click', redireccionarIndex, false);
}

/**
 * Redirecciona a la página de index
 */
function redireccionarIndex() {
  window.location.href = 'index.html';
}

/**
 * Carga la cita de los clientes obteniendo los datos del cliente de localStorage.
 */
async function tratarDatos() {
  const nombreApellidosClienteObject = {
    nombre: localStorage.getItem('nombreCliente'),
    apellidos: localStorage.getItem('apellidosCliente'),
  };

  const nifCliente = localStorage.getItem('nifCliente');
  const respuestaServidor = await Controlador.citasClientes(nifCliente);

  nombreApellidosClientes(nombreApellidosClienteObject);
  citas(respuestaServidor.datos);
}

function citas(respuesta) {
  for (let index = 0; index < respuesta.length; index++) {
    const html = crearHTMLCitasClientes(respuesta[index]);
    insertarCitasHTML(html);
  }
}

function insertarCitasHTML(cita) {
  document.getElementById('listado-citas').innerHTML += cita;
}

function crearHTMLCitasClientes(datos) {
  return `
  
            <tr>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-gray-700">${datos.fecha}</p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-gray-700">${datos.hora}</p>
            </td>
            <td class="px-6 py-4 border-b border-gray-200 leading-5 text-gray-700">
              <p class="text-gray-600">${datos.descripcion}</p>
            </td>
            <td class="px-6 py-4 border-b border-gray-200 leading-5 text-gray-700">
              <p class="text-gray-600">
                ${datos.detalles}
              </p>
            </td>
            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a
                href="#"
                class="block text-red-600 hover:text-red-900 eliminar"
                data-citaid="${datos.id}"
                data-nifcliente="${datos.nifCliente}"
                data-citafecha="${datos.fecha}"
                data-citahora="${datos.hota}"
                >Eliminar cita</a
              >
            </td>
          </tr>
  
  `;
}

/**
 * Obtiene un objeto con los datos del cliente y los introduce en el elemento correcto.
 * @param {object} datos clientes
 */
function nombreApellidosClientes(datos) {
  const { nombre, apellidos } = datos;
  document.getElementById('cita-cliente').innerHTML = `${(nombre, apellidos)}`;
}
