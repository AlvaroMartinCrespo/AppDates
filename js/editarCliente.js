import { ControladorPHP as Controlador } from './controlador.js';

listeners();

function listeners() {
  window.addEventListener('load', cargarNombre, false);
  window.addEventListener('click', redireccionarAListaClientes, false);
}

/**
 * Carga el nombre y apellido del usuario para mostrarlo en pantalla.
 */
function cargarNombre() {
  const nombre = localStorage.getItem('nombre');
  const apellidos = localStorage.getItem('apellidos');
  document.getElementById('nombreCliente').innerHTML = `${nombre} ${apellidos}`;
}

function redireccionarAListaClientes(e) {
  if (e.target.id === 'cancelar') {
    window.location.href = './index.html';
  }
}
