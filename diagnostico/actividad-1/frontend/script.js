const URL_API = "http://localhost:5000/api";

//  Funcion para obtener datos, llenar la tabla y el menu desplegable
async function mostrarStock() {
    try {
        const respuesta = await fetch(`${URL_API}/materiales`);
        const materiales = await respuesta.json();
        
        // Llenar la Tabla
        const tablaBody = document.querySelector("#tabla-stock tbody");
        tablaBody.innerHTML = ""; 

        // Llenar el Selector (menu desplegable) dinamicamente
        const selector = document.getElementById("select-material");
        selector.innerHTML = '<option value="">--Seleccione un Material--</option>';

        materiales.forEach(mat => {
            // Insertar fila en la tabla
            tablaBody.innerHTML += `
                <tr>
                    <td>${mat.nombre}</td>
                    <td>${mat.cantidad}</td>
                    <td>${mat.unidad_medida}</td>
                </tr>
            `;
            
            // Crear y agregar opcion al menu desplegable
            const opcion = document.createElement("option");
            opcion.value = mat.nombre;
            opcion.textContent = mat.nombre;
            selector.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// Funcion para dar de alta un material nuevo
async function crearNuevoMaterial() {
    const nombre = document.getElementById("nuevo-nombre").value;
    const unidad = document.getElementById("nueva-unidad").value;

    if (!nombre || !unidad) {
        alert("Por favor, ingresa nombre y unidad.");
        return;
    }

    try {
        const response = await fetch(`${URL_API}/nuevo-material`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, unidad })
        });

        if (response.ok) {
            alert("¡Material creado con exito!");
            // Limpiar campos
            document.getElementById("nuevo-nombre").value = "";
            document.getElementById("nueva-unidad").value = "";
            // Refrescar tabla y menu sin recargar la pagina
            mostrarStock(); 
        } else {
            const error = await response.json();
            alert("Error: " + error.mensaje);
        }
    } catch (error) {
        alert("Error de conexion al crear material.");
    }
}

// Funcion para enviar una compra o venta
async function procesarOperacion(tipo) {
    const nombre = document.getElementById("select-material").value;
    const cantidad = parseFloat(document.getElementById("input-cantidad").value);

    if (!nombre || isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, selecciona un material y una cantidad valida.");
        return;
    }

    try {
        const response = await fetch(`${URL_API}/operacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, cantidad, tipo })
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(`exito. Nuevo stock: ${resultado.nuevo_stock}`);
            mostrarStock(); 
        } else {
            alert("Error: " + resultado.mensaje);
        }
    } catch (error) {
        alert("No se pudo conectar con el servidor (app.py)");
    }
}

window.onload = mostrarStock;