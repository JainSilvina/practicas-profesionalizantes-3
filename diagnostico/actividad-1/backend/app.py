from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app) # Permite que el frontend se conecte sin bloqueos

def get_db_connection():
    # Asegurate de que database.db este en la misma carpeta que app.py
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# RUTA 1: Obtener todos los materiales para la tabla
@app.route('/api/materiales', methods=['GET'])
def listar_materiales():
    conn = get_db_connection()
    materiales = conn.execute('SELECT * FROM materiales').fetchall()
    conn.close()
    return jsonify([dict(row) for row in materiales])

# RUTA 2: Procesar Compra o Venta
@app.route('/api/operacion', methods=['POST'])
def procesar_operacion():
    datos = request.json
    nombre = datos.get('nombre')
    cantidad = float(datos.get('cantidad'))
    tipo = datos.get('tipo') # 'compra' o 'venta'

    conn = get_db_connection()
    material = conn.execute('SELECT * FROM materiales WHERE nombre = ?', (nombre,)).fetchone()

    if not material:
        return jsonify({"mensaje": "Material no encontrado"}), 404

    # Logica de stock
    if tipo == 'compra':
        nuevo_stock = material['cantidad'] + cantidad
    else:
        nuevo_stock = material['cantidad'] - cantidad

    # VALIDACION: No permitir stock negativo
    if nuevo_stock < 0:
        conn.close()
        return jsonify({"mensaje": "Error: El stock no puede ser negativo"}), 400

    # Actualizar en la base de datos
    conn.execute('UPDATE materiales SET cantidad = ? WHERE nombre = ?', (nuevo_stock, nombre))
    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "nuevo_stock": nuevo_stock})

# RUTA 3: Agregar un material completamente nuevo (SOLO UNA VEZ)
@app.route('/api/nuevo-material', methods=['POST'])
def agregar_material():
    datos = request.json
    nombre = datos.get('nombre')
    unidad = datos.get('unidad') # 'kg', 'unidades', etc.

    if not nombre or not unidad:
        return jsonify({"mensaje": "Faltan datos"}), 400

    conn = get_db_connection()
    try:
        # Insertamos el nuevo material con cantidad inicial 0
        conn.execute('INSERT INTO materiales (nombre, cantidad, unidad_medida) VALUES (?, ?, ?)', 
                     (nombre, 0, unidad))
        conn.commit()
        conn.close()
        return jsonify({"status": "ok", "mensaje": "Material creado con exito"})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"mensaje": "Ese material ya existe"}), 400

# EL ARRANQUE DEL SERVIDOR SIEMPRE AL FINAL
if __name__ == '__main__':
    app.run(debug=True, port=5000)