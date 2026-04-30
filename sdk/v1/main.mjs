import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import sqlite3 from 'sqlite3';
import { resolve } from 'node:path';

// --- CONFIGURACIoN ---
function load_config() {
    try {
        const data = readFileSync('./config.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error cargando config.json");
        process.exit(1); 
    }
}

const config = load_config();

// --- BASE DE DATOS ---
//Se delega la ruta de la DB al archivo config.json
const dbPath = resolve(config.database.path);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error DB:", err.message);
    else console.log("Conectado a SQLite en:", config.database.path);
});

// --- LOGICA DE NEGOCIO ---
// Funcion preparada para recibir datos dinamicos
export function register(db, username, password) {
    const sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [username, password], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, username });
        });
    });
}

// --- HANDLERS ---

function default_handler(request, response) {
    try {
        //  Ruta obtenida de config.json
        const html = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
    } catch (error) {
        response.writeHead(404);
        response.end("Archivo HTML no encontrado.");
    }
}

// Cambiar para el metodo post
async function register_handler(request, response) {
    if (request.method === "POST") {
        let body = '';

        // Escuchamos los datos que llegan en el cuerpo de la peticion
        request.on('data', chunk => {
            body += chunk.toString();
        });

        // Una vez que termino de llegar toda la informacion
        request.on('end', async () => {
            try {
                // Se parsea los datos del formulario (form-urlencoded)
                const params = new URLSearchParams(body);
                const username = params.get('username');
                const password = params.get('password');

                if (!username || !password) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    return response.end(JSON.stringify({ status: false, error: "Faltan datos" }));
                }

                // Inserta en la base de datos
                const resultado = await register(db, username, password);
                
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ 
                    status: true, 
                    message: "Usuario registrado con POST con éxito", 
                    data: resultado 
                }));
            } catch (error) {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ status: false, error: error.message }));
            }
        });
    } else {
        response.writeHead(405); // Metodo no permitido si intentan un GET
        response.end("Se requiere método POST");
    }
}

function show_message_handler(request, response) {
    console.log("Peticion recibida en el servidor!");
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
}

// --- RUTEADOR Y SERVIDOR ---
let router = new Map();
router.set('/', default_handler);
router.set('/register', register_handler);
router.set('/showMessage', show_message_handler);

let server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${config.server.ip}`);
    const handler = router.get(url.pathname);
    if (handler) await handler(req, res);
    else {
        res.writeHead(404);
        res.end("Ruta no encontrada");
    }
});

server.listen(config.server.port, config.server.ip, () => {
    console.log(`Servidor iniciado en http://${config.server.ip}:${config.server.port}`);
});