import { ControladorPHP as Controlador } from './controlador.js';

// window.location.href = direccion

listener();

/**
 * Creación de listeners para el correcto funcionamiento de la página.
 */
function listener() {
  window.addEventListener('load', cargarClientes, false);
  document.getElementById('crearCliente').addEventListener('click', crearCliente, false);
  window.addEventListener('click', redireccionar, false);
}

/**
 * Redicciona a la página correspondiente según el botón al que haga click.
 * @param {evento} e
 */
async function redireccionar(e) {
  for (let index = 0; index < e.target.classList.length; index++) {
    if (e.target.classList[index] === 'crearCita') {
      crearCita(e);
    } else if (e.target.classList[index] === 'verCitas') {
      verCitas(e);
    } else if (e.target.classList[index] === 'eliminar') {
      await eliminarCliente(e);
    }
  }
}

/**
 * Almacenamos en el localstorage el nif ya que lo necesitamos para la cita
 * @param {event} e
 */
function crearCita(e) {
  localStorage.clear();
  const { nif } = obtenerDatosClientes(e);
  localStorage.setItem('nifCliente', nif);
  window.location.href = './nueva-cita.html';
}

/**
 * Guardamos en el localstorage todos los datos del cliente para ver la cita de los clientes
 * @param {event} e
 */
function verCitas(e) {
  localStorage.clear();
  const { nombre, apellidos, nif } = obtenerDatosClientes(e);
  localStorage.setItem('nombreCliente', nombre);
  localStorage.setItem('nifCliente', nif);
  localStorage.setItem('apellidosCliente', apellidos);
  window.location.href = './lista-citas.html';
}

/**
 * Se obtienen los datos del cliente, se elimina y hace una redirección al index para cargar de nuevo los datos.
 * @param {event} e
 */
async function eliminarCliente(e) {
  const { nombre, apellidos, nif } = obtenerDatosClientes(e);
  if (window.confirm(`Seguro que deseas eliminar al cliente ${nombre} ${apellidos}`)) {
    const respuesta = await Controlador.eliminarCliente(nif);
    window.location.href = './index.html';
  }
}

/**
 * Se le pasa el evento y se obtienen del elemento del evento los datos del cliente.
 * @param {event} e
 * @returns objeto con los datos del cliente
 */
function obtenerDatosClientes(e) {
  let datos = {};
  const nombreCliente = e.target.getAttribute('data-clientenombre');
  const nifCliente = e.target.getAttribute('data-clientenif');
  const apellidosCliente = e.target.getAttribute('data-clienteapellidos');
  return (datos = {
    nombre: nombreCliente,
    apellidos: apellidosCliente,
    nif: nifCliente,
  });
}

/**
 * Al pulsarel botón redirecciona la página a crear-cliente.html.
 */
function crearCliente() {
  window.location.href = './nuevo-cliente.html';
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
  const nifConGuion = cliente.nif.replace(/(\d{8})/, '$1-');
  const telefonoConEspacios = cliente.telefono.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
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
          <p class="text-gray-600">${nifConGuion}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 leading-5 text-gray-700">
          <p class="text-gray-600">${telefonoConEspacios}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
          <a
            href="#"
            class="block text-teal-600 hover:text-teal-900 mr-2 crearCita"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
            >Crear cita</a
          >
          <a
            href="#"
            class="block text-teal-600 hover:text-teal-900 mr-2 verCitas"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
            >Ver citas</a
          >
          <a
            href="#"
            class="block text-red-600 hover:text-red-900 eliminar"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
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
