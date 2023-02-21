export class ControladorPHP {
  /**
   * Método que elimina la base de datos para el caso de que se necesite
   * establecer el estado inicial.
   * La siguiente petición al servidor creará de nuevo la base de datos
   * y la rellenará con algunos datos de prueba.
   * @returns Respuesta del servidor en formato JSON
   */
  static async eliminarBD() {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'eliminarBD',
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Petición al servidor mediante POST, en el cuerpo de la petición mandamos getClientes, y nos devuelve un JSON con los datos de los clientes.
   * @returns lista clientes en formato JSON
   */
  static async cargarClientesEnPantalla() {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'getClientes',
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Función que obtiene por parámetros un objeto del cliente, manda un petición al servidor mediante POST con el método setCliente y el cliente en el cuerpo de la petición, y devuelve una respuesta en JSON con el resutlado y datos.
   * @param {objeto} cliente
   * @returns json respuesta servidor
   */
  static async enviarCliente(cliente) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'setCliente',
          cliente: cliente,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Se le pasa por parámetros el nif del cliente para mandarlo en el cuerpo de la petición junto con el metodo getCitasClientes, y nos devuelve un JSON con todas las citas del cliente.
   * @param {nif cliente} nif
   * @returns JSON con las citas de los clientes
   */
  static async citasClientes(nif) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'getCitasCliente',
          nifCliente: nif,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }
}
