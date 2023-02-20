import {ControladorPHP as Controlador} from "./controlador.js";

document.getElementById("eliminarBD").addEventListener("click", eliminarDatosSesionEvento, false);

async function eliminarDatosSesionEvento(e) {
    e.preventDefault();
    const respuesta = await Controlador.eliminarBD();
}