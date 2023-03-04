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
    } else if (e.target.classList[index] === 'editar') {
      editarCliente(e);
    }
  }
}

/**
 * Se limpia el localStorage, se añade el nombre y los apellidos del cliente a editar
 * @param {evento} e
 */
function editarCliente(e) {
  localStorage.clear();
  const { nombre, apellidos, nif, email, telefono } = obtenerDatosClientes(e);
  localStorage.setItem('nombre', nombre);
  localStorage.setItem('apellidos', apellidos);
  localStorage.setItem('nif', nif);
  localStorage.setItem('email', email);
  localStorage.setItem('telefono', telefono);
  console.log(localStorage);
  window.location.href = './editar-cliente.html';
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
  const telefonoCliente = e.target.getAttribute('data-clientetelefono');
  const emailCliente = e.target.getAttribute('data-clienteemail');
  return (datos = {
    nombre: nombreCliente,
    apellidos: apellidosCliente,
    nif: nifCliente,
    email: emailCliente,
    telefono: telefonoCliente,
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
 * Obtiene los datos de los clientes de la función cargarClientes y dentro del bucle se crea la fila y se añade al elemento padre, a continuación se añade la información de las citas en la fila.
 * @param {*} datos
 */
function obtenerClientes(datos) {
  const clientes = datos.datos;
  const elementoPadre = document.getElementById('listado-clientes');
  for (let index = 0; index < clientes.length; index++) {
    const fila = document.createElement('tr');
    elementoPadre.appendChild(fila);
    fila.innerHTML = crearHTMLCliente(clientes[index]);
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
            data-clientetelefono="${cliente.telefono}"
            data-clienteemail="${cliente.email}"
            >Crear cita</a
          >
          <a
            href="#"
            class="block text-teal-600 hover:text-teal-900 mr-2 verCitas"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
            data-clientetelefono="${cliente.telefono}"
            data-clienteemail="${cliente.email}"
            >Ver citas</a
          >
          <a
            href="#"
            class="block text-red-600 hover:text-red-900 eliminar"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
            data-clientetelefono="${cliente.telefono}"
            data-clienteemail="${cliente.email}"
            >Eliminar cliente</a
          >
          <a
            href="#"
            class="block text-red-600 hover:text-red-900 editar"
            data-clientenombre="${cliente.nombre}"
            data-clienteapellidos="${cliente.apellidos}"
            data-clientenif="${cliente.nif}"
            data-clientetelefono="${cliente.telefono}"
            data-clienteemail="${cliente.email}"
            >Editar Cliente</a
          >
        </td>
      
    
    `;
}
