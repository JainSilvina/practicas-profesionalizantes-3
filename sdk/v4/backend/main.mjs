import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';

import { connect_db } from './database.js';
import { authorize, getSession, hasSession } from './models.js'; 
import * as handlers from './handlers.js';

function default_config() 
{
    return {
        server: { ip: '0.0.0.0', port: 3000 }, 
        database: { path: './db.sqlite3' }
    };
}

function load_config() 
{
    try {
        const data = readFileSync('./config.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return default_config();
    }
}

const config = load_config();
const db = connect_db(config.database.path);

let router = new Map();

// Mapeo correcto traspasando los argumentos a las funciones lineales de handlers.js
router.set('/login', function(request, response) { return handlers.login_handler(config, db, request, response); });
router.set('/logout', function(request, response) { return handlers.logout_handler(config, request, response); });
router.set('/register', function(request, response) { return handlers.register_handler(config, db, request, response); });

// Endpoints protegidos mapeados con sus nombres exactos de handlers.js
router.set('/log', handlers.log_handler);
router.set('/sayHello', handlers.say_hello_handler); // CORREGIDO: say_hello_handler usa guiones bajos

function request_dispatcher(request, response) 
{
    //  Cabeceras CORS obligatorias (Punto 1)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Pre-vuelo CORS obligatorio
    if (request.method === 'OPTIONS') 
    {
        response.writeHead(204);
        response.end();
        return;
    }

    //  Extraer path limpio
    const urlParseada = new URL(request.url, `http://localhost:3000`);
    const path = urlParseada.pathname; 

    // Interceptar /login y /register si vienen por POST para inyectar los datos en searchParams 
    // y mantener la compatibilidad con la estructura actual de tu handlers.js sin romper nada.
    if ((path === '/login' || path === '/register') && request.method === 'POST') {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });
        request.on('end', () => {
            try {
                const datos = JSON.parse(body);
                // Inyectamos de forma dinámica los parámetros en el request.url original
                request.url = `${path}?username=${encodeURIComponent(datos.username || '')}&password=${encodeURIComponent(datos.password || '')}`;
            } catch (e) {
                // Si el formato no es JSON, continúa de forma nativa
            }
            
            const handler = router.get(path);
            if (handler) return handler(request, response);
        });
        return;
    }

    // Buscar si existe un manejador para el resto de las rutas
    const handler = router.get(path);

    if (handler)
    {
        // Endpoints del sistema que requieren evaluación de sesión y permisos
        const endpointsProtegidos = ['/log', '/sayHello'];
        
        if (endpointsProtegidos.includes(path)) 
        {
            const sessionId = urlParseada.searchParams.get("sessionId");    
            
            // Verificación robusta de la existencia de la sesión
            if (!sessionId || !hasSession(sessionId)) 
            {
                response.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ error: "401 Unauthorized: Debe iniciar sesión." }));
                return;
            }

            const sessionData = getSession(sessionId);
            if (!sessionData || !sessionData.username) {
                response.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ error: "401 Unauthorized: Estructura de sesión inválida." }));
                return;
            }

            const usuarioActivo = sessionData.username;
            // Quitamos la barra inicial para que coincida con la base de datos ('log' o 'sayHello')
            const pathLimpio = path.startsWith('/') ? path.slice(1) : path;

            // CONTROL DEL COMPONENTE AUTORIZADOR 
            const estaAutorizado = authorize(db, usuarioActivo, pathLimpio);
            
            if (!estaAutorizado) 
            {
                response.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ error: "403 Forbidden: Acción denegada para este usuario." }));
                return;
            }
        }

        return handler(request, response);
    }
    else
    {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(`Ruta ${path} no encontrada.`);
    }
}

const server = createServer(request_dispatcher);

server.listen(config.server.port, config.server.ip, function() 
{
    console.log(`Servidor WebAPI corriendo en http://${config.server.ip}:${config.server.port}/`);
});