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

  /**
   * Se le pasa el objeto cita y mediante fetch se lo mandamos al servidor y nos devolvera una respuesta
   * @param {object} cita
   * @returns respuesta del servidor
   */
  static async enviarCitas(cita) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'setCita',
          cita: cita,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Se le pasa el nif del cliente para eliminar al cliente, el servidor nos devuelve una respuesta.
   * @param {string} nifCliente
   * @returns respuesta del servidor
   */
  static async eliminarCliente(nifCliente) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'eliminarCliente',
          nif: nifCliente,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Se le pasa el id de la cita y lo manda al servidor junto con el metodo eliminarCita, el servidor nos retornara una respuesta.
   * @param {number} idCita
   * @returns respuesta  del servidor
   */
  static async eliminarCita(idCita) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'eliminarCita',
          id: idCita,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Le pasamos el nif del cliente, y la manda junto con el método getCitasCliente al servidor, nos dará una respuesta con la cita del cliente que tenga ese nif.
   * @param {number} idCita
   * @returns respuesta del servidor
   */
  static async citaClienteId(nifCliente) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'getCitasCliente',
          nifCliente: nifCliente,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Se le pasa los datos de una cita en formato JSON y se manda junto con el método setCita al servidor que posteriormente no devolvera un JSON de respuesta.
   * @param {citaJson} cita
   * @returns respuesta del servidor
   */
  static async crearCitaCliente(cita) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'setCita',
          cita: cita,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Recibe un objeto cliente con sus datos y envía una petición al servidor con los datos y el método de actualizar cliente.
   * Por último el servidor mandará una respuesta.
   * @param {object} cliente
   * @returns respuesta servidor JSON
   */
  static async actualizarCliente(cliente) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'actualizarCliente',
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
   * Recibe un objeto con los datos de la cita, los envía junto con el método actualizarCita al servidor.
   * Luego el servidor mandará la respuesta.
   * @param {object} cita
   * @returns respuesta servidor JSON
   */
  static async actualizarCita(cita) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'actualizarCita',
          cita: cita,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }

  /**
   * Función de utilidad que al pasarle por parámetros un id de una cita te duvuelve la cita con todos sus datos.
   * @param {number} id
   * @returns respuesta cita servidor JSON
   */
  static async getCita(id) {
    let respuestaJSON = null;
    try {
      const respuesta = await fetch(`citasClientes.php`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          metodo: 'getCita',
          id: id,
        }),
      });
      respuestaJSON = await respuesta.json();
    } catch (error) {
      console.error(error.message);
    }
    return respuestaJSON;
  }
}
