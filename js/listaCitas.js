import { ControladorPHP as Controlador } from './controlador.js';

listerners();

/**
 * Listenes para el correcto funcionamiento de la página
 */
function listerners() {
  window.addEventListener('load', tratarDatos, false);
  document.getElementById('volverClientes').addEventListener('click', redireccionarIndex, false);
  window.addEventListener('click', eliminarCita, false);
  document.getElementById('crearCita').addEventListener('click', redireccionarCrearCita, false);
}

/**
 * Redirecciona a la ventana de crear citas.
 */
function redireccionarCrearCita() {
  window.location.href = 'nueva-cita.html';
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
/**
 * Comprobamos que el botón pulsado es el botón de eliminar cita, obtenemos el id de la cita del elemento y se lo pasamos a la función del controlador de eliminar la cita, nos devolerá una respuesta.
 * @param {evento} e
 */
async function eliminarCita(e) {
  for (let index = 0; index < e.target.classList.length; index++) {
    if (e.target.classList[index] === 'eliminar') {
      const idCita = e.target.getAttribute('data-citaid');
      const nifCliente = e.target.getAttribute('data-nifcliente');
      const datosCita = await Controlador.citaClienteId(nifCliente);
      console.log(datosCita);
      if (
        window.confirm(`Seguro que desea eliminar la cita del ${console.log('fecha')} a las ${console.log('horaCita')}`)
      ) {
        const respuesta = await Controlador.eliminarCita(idCita);
        window.location.href = './lista-citas.html';
      }
    }
  }
}

/**
 * Obtiene la respuesta del servidor, llama a la funcion para crear la plantilla con la respuesta y luego llama a la función para insertar la plantilla en el HTML.
 * @param {json} respuesta
 */
function citas(respuesta) {
  for (let index = 0; index < respuesta.length; index++) {
    const html = crearHTMLCitasClientes(respuesta[index]);
    insertarCitasHTML(html);
  }
}

/**
 * Obtiene la plantilla HTML de la cita con los datos y lo introduce en el elemento correspondiente.
 * @param {string} cita
 */
function insertarCitasHTML(cita) {
  document.getElementById('listado-citas').innerHTML += cita;
}

/**
 * Crea la plantilla HTML con los datos de la cita que se va a imprimir por pantalla.
 * @param {Json} datos
 * @returns plantilla HTML con los datos de la cita.
 */
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
