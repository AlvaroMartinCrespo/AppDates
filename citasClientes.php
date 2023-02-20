<?php

// Creación de la base de datos si no existe
$nombreServidor = "localhost";
$usuario = "root";
$clave = "";
$nombreBD = "clientes_citas";

$conn = new mysqli($nombreServidor, $usuario, $clave);

if ($conn->connect_error) {
    die("Falló la conexión" . mysqli_connect_errno());
}
try {
    $sqlquery = "CREATE DATABASE " . $nombreBD . ";";
    if ($conn->query($sqlquery)) {
        $sqlquery = "USE " . $nombreBD . ";";
        $conn->query($sqlquery);
        $sqlquery = "CREATE TABLE IF NOT EXISTS Cliente (
        nombre varchar(30) NOT NULL,
        apellidos varchar(50) NOT NULL,
        email varchar(100) NOT NULL,
        telefono varchar(9) NOT NULL,
        nif varchar(9),
        PRIMARY KEY(nif)
    );";
        $conn->query($sqlquery);
        $sqlquery = "INSERT IGNORE INTO Cliente (nombre, apellidos, email, telefono, nif)
        VALUES ('Juan', 'Jiménez Gómez', 'nombre@dominio.com', '666555444', '33489123F'),
               ('María José', 'Tello Vázquez', 'tello@gmail.com', '654128934', '28356490D'),
               ('Rubén', 'Amancio Lerate', 'amancio@outlook.es', '674181862', '22629014M');";
        $conn->query($sqlquery);

        $sqlquery = "CREATE TABLE IF NOT EXISTS Cita (
        id int NOT NULL AUTO_INCREMENT,
        nifCliente varchar(9) NOT NULL,
        fecha varchar(10) NOT NULL,
        hora varchar(5) NOT NULL,
        descripcion varchar(200) NOT NULL,
        detalles varchar(400),
        PRIMARY KEY(id),
        FOREIGN KEY (nifCliente) REFERENCES Cliente(nif)
    );";
        $conn->query($sqlquery);
        $sqlquery = "INSERT IGNORE INTO Cita (id, nifCliente, fecha, hora, descripcion, detalles)
        VALUES (1, '33489123F', '2023-08-16', '20:30', 'Necesita sistema de gestión para sus talleres de vehículos', 'El sistema puede complicarse debido a que se trata de una empresa con 30 talleres'),
               (2, '33489123F', '2023-03-31', '10:00', 'Recuperación de datos de discos duros', 'Tiene 6 equipos que no arrancan y necesita recuperar los datos de los discos duros');";
        $conn->query($sqlquery);

    } else {
        $sqlquery = "USE " . $nombreBD . ";";
        $conn->query($sqlquery);
    }
} catch (Exception $e) {
    $sqlquery = "USE " . $nombreBD . ";";
    $conn->query($sqlquery);
}


// Modelo de objetos
class Cita
{
    //id, nifCliente, fecha, hora, descripcion, detalles
    public $id = "";
    public $nifCliente = "";
    public $fecha = "";
    public $hora = "";
    public $descripcion = "";
    public $detalles = "";
    // Con el constructor disparamos un echo cada vez que se instancia la clase
    function __construct($id, $nifCliente, $fecha, $hora, $descripcion, $detalles)
    {
        $this->id = $id;
        $this->nifCliente = $nifCliente;
        $this->fecha = $fecha;
        $this->hora = $hora;
        $this->descripcion = $descripcion;
        $this->detalles = $detalles;
    }
}

//nombre, apellidos, email, telefono, nif
//id, nifCliente, fecha, hora, descripcion, detalles
class Cliente
{
    public $nombre = "";
    public $apellidos = "";
    public $email = "";
    public $telefono = "";
    public $nif = "";
    // Con el constructor disparamos un echo cada vez que se instancia la clase
    function __construct($nombre, $apellidos, $email, $telefono, $nif)
    {
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->email = $email;
        $this->telefono = $telefono;
        $this->nif = $nif;
    }
}

// Recogemos los datos de la petición (es un JSON)
$json = file_get_contents('php://input');
// Lo convertimos en un objeto PHP
$datos = json_decode($json);
// Obtenemos el método de la petición
$metodo = $datos->metodo;

// Se ejecuta una función para cada método de la petición
if ($metodo === "getClientes") {
    getClientes($conn);
} else if ($metodo === "eliminarCliente") {
    $nif = $datos->nif;
    eliminarCliente($conn, $nif);
} else if ($metodo === "setCliente") {
    $clienteJSON = $datos->cliente;
    setCliente($conn, $clienteJSON);
} else if ($metodo === "setCita") {
    $citaJSON = $datos->cita;
    setCita($conn, $citaJSON);
} else if ($metodo === "eliminarCita") {
    $id = $datos->id;
    eliminarCita($conn, $id);
} else if ($metodo === "getCitasCliente") {
    $nif = $datos->nifCliente;
    getCitasCliente($conn, $nif);
} else if ($metodo === "eliminarBD") {
    // Este método tiene fines de depuración. Se resetean los datos de la sesión
    eliminarBD($conn, $nombreBD);
} else if ($metodo === "getCitas") {
    // Este método tiene fines de depuración. Obtiene todas las citas del sistema,
    // no importa el cliente al que pertenezcan
    getCitas($conn);
}

function setCita($conn, $citaJSON)
{
    $sqlquery = "SELECT * FROM Cita WHERE Cita.nifCliente='$citaJSON->nifCliente' AND
                Cita.fecha='$citaJSON->fecha' AND
                Cita.hora='$citaJSON->hora'";
    $citasFechaHora = $conn->query($sqlquery);
    $arrayCitasFechaHora = obtenerArrayDeConsultaCitas($citasFechaHora);

    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => array(),
        "mensajesError" => array(),
        "datos" => $citaJSON
    ];
    if (count($arrayCitasFechaHora) > 0) {
        $devolver->resultado = "no";
        array_push($devolver->camposError, "fecha", "hora");
        array_push($devolver->mensajesError, "Debes cambiar la fecha o la hora", "Debes cambiar la fecha o la hora");
    } else {
        $sqlquery = "INSERT INTO Cita (id, nifCliente, fecha, hora, descripcion, detalles)
               VALUES (NULL, '$citaJSON->nifCliente', '$citaJSON->fecha', '$citaJSON->hora', '$citaJSON->descripcion', '$citaJSON->detalles');";
        // echo "<br>".$sqlquery."<br>";
        $conn->query($sqlquery);
    }

    echo json_encode($devolver);
}

function setCliente($conn, $clienteJSON)
{
    $sqlquery = "SELECT * FROM Cliente WHERE Cliente.nif='$clienteJSON->nif'";
    $clientesNIF = $conn->query($sqlquery);
    $arrayClientesNIF = obtenerArrayDeConsultaClientes($clientesNIF);
    $sqlquery = "SELECT * FROM Cliente WHERE Cliente.email='$clienteJSON->email'";
    $clientesEmail = $conn->query($sqlquery);
    $arrayClientesEmail = obtenerArrayDeConsultaClientes($clientesEmail);

    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => array(),
        "mensajesError" => array(),
        "datos" => $clienteJSON
    ];
    if (count($arrayClientesNIF) === 0 && count($arrayClientesEmail) === 0) {
        $sqlquery = "INSERT INTO Cliente (nombre, apellidos, email, telefono, nif)
               VALUES ('$clienteJSON->nombre', '$clienteJSON->apellidos', '$clienteJSON->email', '$clienteJSON->telefono', '$clienteJSON->nif');";
        // echo "<br>".$sqlquery."<br>";
        $conn->query($sqlquery);

    } else {
        if (count($arrayClientesNIF) > 0) {
            $devolver->resultado = "no";
            array_push($devolver->camposError, "nif");
            array_push($devolver->mensajesError, "El NIF $clienteJSON->nif ya se encuentra en el sistema");
        }
        if (count($arrayClientesEmail) > 0) {
            $devolver->resultado = "no";
            array_push($devolver->camposError, "email");
            array_push($devolver->mensajesError, "El correo electrónico $clienteJSON->email ya se encuentra en el sistema");
        }
    }

    echo json_encode($devolver);
}

function getCitas($conn)
{
    $sqlquery = "SELECT * FROM Cita ORDER BY Cita.fecha, Cita.hora;";
    $citas = $conn->query($sqlquery);
    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => [""],
        "mensajesError" => [""],
        "datos" => obtenerArrayDeConsultaCitas($citas)
    ];
    echo json_encode($devolver);
}

function eliminarCliente($conn, $nif)
{
    $devolver = "";
    $sqlquery = "SELECT * FROM Cliente WHERE nif='$nif';";
    $clienteEliminar = obtenerArrayDeConsultaClientes($conn->query($sqlquery))[0];

    //Eliminamos las citas del cliente
    $sqlquery = "DELETE FROM Cita WHERE Cita.nifCliente='$nif';";
    $conn->query($sqlquery);

    $sqlquery = "DELETE FROM Cliente WHERE nif='$nif';";
    if ($conn->query($sqlquery)) {
        // Se construye la respuesta
        $devolver = (object) [
            "resultado" => "ok",
            "camposError" => [""],
            "mensajesError" => [""],
            "datos" => $clienteEliminar
        ];
    } else {
        // Se construye la respuesta
        $devolver = (object) [
            "resultado" => "no",
            "camposError" => [""],
            "mensajesError" => ["El cliente no se ha podido eliminar porque no existe"],
            "datos" => $clienteEliminar
        ];

    }
    echo json_encode($devolver);
}

function eliminarCita($conn, $id)
{
    $devolver = "";
    $sqlquery = "SELECT * FROM Cita WHERE id='$id';";
    $cita = $conn->query($sqlquery);
    $sqlquery = "DELETE FROM Cita WHERE id='$id';";
    if ($conn->query($sqlquery)) {
        // Se construye la respuesta
        $devolver = (object) [
            "resultado" => "ok",
            "camposError" => [""],
            "mensajesError" => [""],
            "datos" => obtenerArrayDeConsultaCitas($cita)[0]
        ];
    } else {
        // Se construye la respuesta
        $devolver = (object) [
            "resultado" => "no",
            "camposError" => [""],
            "mensajesError" => ["La cita no se ha podido eliminar porque no existe"],
            "datos" => obtenerArrayDeConsultaCitas($cita)[0]
        ];
    }
    echo json_encode($devolver);
}

function getCitasCliente($conn, $nif)
{
    $sqlquery = "SELECT * FROM Cita WHERE Cita.nifCliente='" . $nif . "' ORDER BY fecha, hora;";
    $citas = $conn->query($sqlquery);
    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => [""],
        "mensajesError" => [""],
        "datos" => obtenerArrayDeConsultaCitas($citas)
    ];
    echo json_encode($devolver);
}

function getClientes($conn)
{
    $sqlquery = "SELECT * FROM Cliente ORDER BY apellidos;";
    $clientes = $conn->query($sqlquery);
    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => [""],
        "mensajesError" => [""],
        "datos" => obtenerArrayDeConsultaClientes($clientes)
    ];
    echo json_encode($devolver);
}

function obtenerArrayDeConsultaCitas($resulset)
{
    $devolver = array();
    while ($fila = mysqli_fetch_assoc($resulset)) {
        $cita = new Cita($fila["id"], $fila["nifCliente"], $fila["fecha"], $fila["hora"], $fila["descripcion"], $fila["detalles"]);
        array_push($devolver, $cita);
    }
    return $devolver;
}

function obtenerArrayDeConsultaClientes($resulset)
{
    $devolver = array();
    while ($fila = mysqli_fetch_assoc($resulset)) {
        $cliente = new Cliente($fila["nombre"], $fila["apellidos"], $fila["email"], $fila["telefono"], $fila["nif"]);
        array_push($devolver, $cliente);
    }
    return $devolver;
}

function eliminarBD($conn, $nombreBD)
{
    $sqlquery = "DROP DATABASE $nombreBD;";
    $conn->query($sqlquery);
    $devolver = (object) [
        "resultado" => "ok",
        "camposError" => [""],
        "mensajesError" => [""],
        "datos" => ""
    ];
    echo json_encode($devolver);
}

?>