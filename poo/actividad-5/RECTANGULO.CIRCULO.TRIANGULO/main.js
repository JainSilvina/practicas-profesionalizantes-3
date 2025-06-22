// --- Variables Globales y Referencias a Elementos del DOM ---
// Obtenemos una referencia al canvas y su contexto 2D.
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Array para almacenar todas las figuras que se han creado.
const allShapes = [];
let activeShape = null;

// Referencias a los elementos HTML para la interfaz de usuario.
const shapeColorPicker = document.getElementById('shapeColorPicker');
const selectedColorBox = document.getElementById('selectedColorBox');
const figureListTableBody = document.querySelector('#figureListTable tbody');
const activeShapeNameSpan = document.getElementById('activeShapeName');

// Constantes para la velocidad de movimiento y rotación de las figuras.
const MOVEMENT_SPEED = 5;
const ROTATION_SPEED = 0.05; // En radianes

// --- Oyentes de Eventos para la Interfaz de Usuario ---
// Asignamos funciones a los clics de los botones para crear figuras.
document.getElementById('createRectangleBtn').addEventListener('click', createRectangle);
document.getElementById('createCircleBtn').addEventListener('click', createCircle);
document.getElementById('createTriangleBtn').addEventListener('click', createTriangle); // Ahora llama a la función para el triángulo

// El selector de color actualiza el cuadro de muestra de color.
shapeColorPicker.addEventListener('input', (event) => {
    selectedColorBox.style.backgroundColor = event.target.value;
});

// El único controlador de movimiento para el teclado escucha el evento 'keydown' en todo el documento.
document.addEventListener('keydown', handleGlobalMovement);

// --- Funciones de Dibujo y Gestión del Canvas ---

// Limpia todo el contenido del canvas.
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Dibuja todas las figuras almacenadas en el array 'allShapes' en el canvas.
function drawAllShapes() {
    clearCanvas(); // Primero, limpia el canvas para redibujar todo desde cero.
    allShapes.forEach(shape => shape.draw(ctx)); // Luego, dibuja cada figura.
}

// --- Funciones para Crear Figuras ---

// Función asíncrona para crear un rectángulo.
async function createRectangle() {
    let id = prompt('Ingrese el identificador (nombre único) para el rectángulo:');
    // Valida que el ID no esté vacío y que sea único.
    if (!id || allShapes.some(s => s.id === id)) {
        alert('ID inválido o ya existente. Por favor, ingrese un ID único.');
        return;
    }

    let dimensions = prompt('Ingrese ancho y alto del rectángulo (ej: 100,50):');
    if (!dimensions) return; // Si el usuario cancela el prompt.
    let [width, height] = dimensions.split(',').map(Number); // Divide la cadena y convierte a números.
    // Valida que las dimensiones sean números positivos.
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert('Dimensiones inválidas. Ingrese números positivos.');
        return;
    }

    let coords = prompt('Ingrese la coordenada (x,y) para el rectángulo (ej: 100,100):');
    if (!coords) return;
    let [x, y] = coords.split(',').map(Number);
    // Valida que las coordenadas sean números.
    if (isNaN(x) || isNaN(y)) {
        alert('Coordenadas inválidas. Ingrese números.');
        return;
    }

    const color = shapeColorPicker.value; // Obtiene el color del selector de color.
    const newRect = new Rectangle(id, x, y, width, height, color); // Crea una nueva instancia de Rectangle.
    allShapes.push(newRect); // Añade el nuevo rectángulo al array de todas las figuras.
    updateFigureList(); // Actualiza la tabla de figuras.
    drawAllShapes(); // Redibuja todas las figuras en el canvas.
}

// Función asíncrona para crear un círculo
async function createCircle() {
    let id = prompt('Ingrese el identificador (nombre único) para el círculo:');
    if (!id || allShapes.some(s => s.id === id)) {
        alert('ID inválido o ya existente. Por favor, ingrese un ID único.');
        return;
    }

    let radiusStr = prompt('Ingrese el radio del círculo (ej: 50):');
    if (!radiusStr) return;
    let radius = Number(radiusStr);
    if (isNaN(radius) || radius <= 0) {
        alert('Radio inválido. Ingrese un número positivo.');
        return;
    }

    let coords = prompt('Ingrese la coordenada (x,y) para el círculo (ej: 200,200):');
    if (!coords) return;
    let [x, y] = coords.split(',').map(Number);
    if (isNaN(x) || isNaN(y)) {
        alert('Coordenadas inválidas. Ingrese números.');
        return;
    }

    const color = shapeColorPicker.value;
    const newCircle = new Circle(id, x, y, radius, color);
    allShapes.push(newCircle);
    updateFigureList();
    drawAllShapes();
}

// Función asíncrona para crear un triángulo
async function createTriangle() {
    let id = prompt('Ingrese el identificador (nombre único) para el triángulo:');
    if (!id || allShapes.some(s => s.id === id)) {
        alert('ID inválido o ya existente. Por favor, ingrese un ID único.');
        return;
    }

    let sideLengthStr = prompt('Ingrese la longitud de un lado del triángulo (ej: 80):');
    if (!sideLengthStr) return;
    let sideLength = Number(sideLengthStr);
    if (isNaN(sideLength) || sideLength <= 0) {
        alert('Longitud de lado inválida. Ingrese un número positivo.');
        return;
    }

    let coords = prompt('Ingrese la coordenada (x,y) para el triángulo (ej: 300,150):');
    if (!coords) return;
    let [x, y] = coords.split(',').map(Number);
    if (isNaN(x) || isNaN(y)) {
        alert('Coordenadas inválidas. Ingrese números.');
        return;
    }

    const color = shapeColorPicker.value;
    const newTriangle = new Triangle(id, x, y, sideLength, color);
    allShapes.push(newTriangle);
    updateFigureList();
    drawAllShapes();
}


// --- Gestión de la Lista de Figuras en la Tabla ---

// Actualiza el contenido de la tabla de figuras.
function updateFigureList() {
    figureListTableBody.innerHTML = ''; // Limpia todas las filas existentes en la tabla.
    allShapes.forEach(shape => { // Itera sobre cada figura en el array 'allShapes'.
        const row = figureListTableBody.insertRow(); // Inserta una nueva fila en la tabla.
        row.dataset.shapeId = shape.id; // Almacena el ID de la figura como un atributo de datos en la fila.

        const typeCell = row.insertCell(); // Inserta una celda para el tipo de figura.
        typeCell.textContent = shape.type; // Muestra el tipo (R, C, T).

        const idCell = row.insertCell(); // Inserta una celda para el ID/Nombre de la figura.
        idCell.textContent = shape.id;

        // Añade un oyente de clic a la fila para seleccionar la figura cuando se hace clic en ella.
        row.addEventListener('click', () => selectShape(shape));

        // Si esta fila corresponde a la figura activa, le añade una clase para resaltarla visualmente.
        if (activeShape && activeShape.id === shape.id) {
            row.classList.add('active-row');
        } else {
            row.classList.remove('active-row'); // Asegura que las filas no activas no tengan la clase.
        }
    });
    updateActiveShapeIndicator(); // Actualiza el texto debajo del canvas.
}

// Selecciona una figura como la 'activeShape'.
function selectShape(shape) {
    activeShape = shape; // Establece la figura clickeada como la activa.
    updateFigureList(); // Vuelve a renderizar la tabla para que se refleje el resaltado de la fila activa.
    updateActiveShapeIndicator(); // Actualiza el indicador de texto.
}

// Actualiza el texto que muestra el nombre de la figura activa.
function updateActiveShapeIndicator() {
    activeShapeNameSpan.textContent = activeShape ? activeShape.id : 'Ninguna';
}

// Esta función es el corazón del control de movimiento.
// Se ejecuta cada vez que se presiona una tecla.
function handleGlobalMovement(event) {
    // Si no hay ninguna figura activa seleccionada, no hacemos nada.
    if (!activeShape) return;

    let moved = false; // Bandera para saber si se realizó un movimiento o rotación.

    // Usa un 'switch' para reaccionar a diferentes teclas (flechas).
    switch (event.key) {
        case 'ArrowUp':
            activeShape.moveForward(MOVEMENT_SPEED); // Mueve la figura activa hacia adelante.
            moved = true;
            break;
        case 'ArrowDown':
            activeShape.moveBackward(MOVEMENT_SPEED); // Mueve la figura activa hacia atrás.
            moved = true;
            break;
        case 'ArrowLeft':
            activeShape.rotate(-ROTATION_SPEED); // Rota la figura activa a la izquierda.
            moved = true;
            break;
        case 'ArrowRight':
            activeShape.rotate(ROTATION_SPEED); // Rota la figura activa a la derecha.
            moved = true;
            break;
    }

    // Si la figura se movió o rotó, actualizamos su posición en el canvas.
    if (moved) {
        limitShapeMovement(activeShape); // Asegura que la figura no salga del canvas.
        drawAllShapes(); // Redibuja todas las figuras (incluida la que se movió).
        event.preventDefault(); // Evita el comportamiento predeterminado del navegador (por ejemplo, desplazarse con las flechas).
    }
}

// Limita el movimiento de una figura para que no salga del canvas.
function limitShapeMovement(shape) {
    const bounds = shape.getBounds(); // Obtiene los límites de la figura (izq, der, arriba, abajo).

    // Ajusta la posición X de la figura si se sale de los límites horizontales del canvas.
    if (bounds.left < 0) {
        shape.x -= bounds.left; // Mueve la figura a la derecha para que su borde izquierdo esté en 0.
    } else if (bounds.right > canvas.width) {
        shape.x -= (bounds.right - canvas.width); // Mueve la figura a la izquierda para que su borde derecho esté en el ancho del canvas.
    }

    // Ajusta la posición Y de la figura si se sale de los límites verticales del canvas.
    if (bounds.top < 0) {
        shape.y -= bounds.top; // Mueve la figura hacia abajo para que su borde superior esté en 0.
    } else if (bounds.bottom > canvas.height) {
        shape.y -= (bounds.bottom - canvas.height); // Mueve la figura hacia arriba para que su borde inferior esté en la altura del canvas.
    }
}

// --- Configuración Inicial al Cargar la Página ---
// Esta función se ejecuta una vez que la página HTML ha cargado completamente.
window.onload = function() {
    drawAllShapes(); 
};