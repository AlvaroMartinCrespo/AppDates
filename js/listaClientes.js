import { ControladorPHP as Controlador } from './controlador.js';

// window.location.href = direccion

listener();

/**
 * Listener que comprueba que la página esta cargada para cargar los clientes.
 */
function listener() {
  window.addEventListener('load', cargarClientes, false);
}

/**
 * Async function que llama al controlador y carga los clientes que hay en la base de datos, después llama a la función obtenerClientes, que saca del JSON que recibe los datos de los clientes.
 */
async function cargarClientes() {
  const datos = await Controlador.cargarClientesEnPantalla();
  obtenerClientes(datos);
}

/**
 * Obtiene los datos de los clientes de la función cargarClientes y dentro del bucle llama a la función insertarHTMLCliente con los datos de cada cliente para que se inserten en pantalla.
 * @param {*} datos
 */
function obtenerClientes(datos) {
  const clientes = datos.datos;
  for (let index = 0; index < clientes.length; index++) {
    const clienteDatos = crearHTMLCliente(clientes[index]);
    insertarHTMLCliente(clienteDatos);
  }
}

/**
 * Crea un código HTML con los datos del cliente y los devuelve.
 * @param {JSON} cliente
 * @returns codigo html con los datos del cliente
 */
function crearHTMLCliente(cliente) {
  return `
          <tr>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
          <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold">${cliente.nombre}</p>
          <p class="text-sm leading-10 text-gray-700">${cliente.apellidos}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
          <p class="text-gray-700">${cliente.email}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
          <p class="text-gray-600">${cliente.nif}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
          <p class="text-gray-600">${cliente.telefono}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
          <a
            href="#"
            class="block text-teal-600 hover:text-teal-900 mr-2 crearCita"
            data-clientenombre="Juan"
            data-clienteapellidos="Jiménez Gómez"
            data-clientenif="33489123F"
            >Crear cita</a
          >
          <a
            href="#"
            class="block text-teal-600 hover:text-teal-900 mr-2 verCitas"
            data-clientenombre="Juan"
            dataclienteapellidos="Jiménez Gómez"
            data-clientenif="33489123F"
            >Ver citas</a
          >
          <a
            href="#"
            class="block text-red-600 hover:text-red-900 eliminar"
            data-clientenombre="Juan"
            dataclienteapellidos="Jiménez Gómez"
            data-clientenif="33489123F"
            >Eliminar cliente</a
          >
        </td>
      </tr>
    
    `;
}

/**
 * Inserta los datos de los clientes en la tabla.
 * @param {datos} cliente
 */
function insertarHTMLCliente(cliente) {
  const elemento = (document.getElementById('listado-clientes').innerHTML += cliente);
}
