// --- Clase Base para Formas ---
// Esta clase define propiedades y métodos comunes para todas las figuras.
class Shape {
    //Constructor para la clase base Shape.
    //Este constructor inicializa las propiedades básicas que toda figura compartirá.
    
    constructor(id, x, y, color = 'black', angle = 0) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
    }

    draw(ctx) {
        // Por defecto, esta función no hace nada, se sobrescribe en las subclases.
    }

    rotate(radians) {//Rota la figura por un ángulo dado
        this.angle += radians;
    }

    /**
     * Mueve la figura hacia adelante (en la dirección de su ángulo actual).
     */
    moveForward(distance) {
        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);
    }

    /**Mueve la figura hacia atrás/Reutiliza el método moveForward con una distancia negativa*/
    moveBackward(distance) {
        this.moveForward(-distance);
    }

    /**
     * Obtiene los límites de la figura (su "caja contenedora").
     * Debe ser implementado por cada subclase */
    
    getBounds() {
        throw new Error("El metodo getBounds() debe ser implementado por las subclases");
    }
}

// --- Clase Rectángulo (hereda de Shape) ---
// Define un rectángulo con propiedades de ancho y alto, y cómo dibujarse.
class Rectangle extends Shape {
    
    constructor(id, x, y, width, height, color, angle = 0) {
        super(id, x, y, color, angle);
        this.width = width;
        this.height = height;
        this.type = 'R'; // Propiedad para identificar el tipo de figura en la tabla.
    }

   
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    getBounds() {
        const halfDiagonal = Math.sqrt(this.width * this.width + this.height * this.height) / 2;
        return {
            left: this.x - halfDiagonal,
            right: this.x + halfDiagonal,
            top: this.y - halfDiagonal,
            bottom: this.y + halfDiagonal
        };
    }
}

// --- Clase Círculo (hereda de Shape) ---
// Define un círculo con una propiedad de radio, y cómo dibujarse.
class Circle extends Shape {
    
    constructor(id, x, y, radius, color, angle = 0) {
        super(id, x, y, color, angle);
        this.radius = radius;
        this.type = 'C'; // Propiedad para identificar el tipo de figura en la tabla.
    }

   
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

   
    getBounds() {
        return {
            left: this.x - this.radius,
            right: this.x + this.radius,
            top: this.y - this.radius,
            bottom: this.y + this.radius
        };
    }
}

// --- Clase Triángulo (hereda de Shape) ---
// Define un triángulo equilátero con una propiedad de longitud de lado, y cómo dibujarse.
class Triangle extends Shape {
  
    constructor(id, x, y, sideLength, color, angle = 0) {
        super(id, x, y, color, angle);
        this.sideLength = sideLength;
        this.height = (Math.sqrt(3) / 2) * sideLength; // Altura de un triángulo equilátero.
        this.type = 'T'; // Propiedad para identificar el tipo de figura en la tabla.
    }

   
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;

        ctx.beginPath();
        // Define los vértices del triángulo equilátero.
        ctx.moveTo(0, -this.height / 2); // Vértice superior
        ctx.lineTo(this.sideLength / 2, this.height / 2); // Vértice inferior derecho
        ctx.lineTo(-this.sideLength / 2, this.height / 2); // Vértice inferior izquierdo
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    getBounds() {
        const maxDimension = Math.max(this.sideLength, this.height);
        return {
            left: this.x - maxDimension / 2,
            right: this.x + maxDimension / 2,
            top: this.y - maxDimension / 2,
            bottom: this.y + maxDimension / 2
        };
    }
}