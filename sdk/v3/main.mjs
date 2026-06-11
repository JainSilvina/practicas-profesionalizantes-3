import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';

import { connect_db } from './database.js';
import { authorize, getSession, hasSession } from './models.js';
import * as handlers from './handlers.js';

function default_config() 
{
    return {
        server: { ip: '127.0.0.1', port: 3000, default_path: './default.html' },
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
router.set('/', function(req, res) { return handlers.default_handler(config, req, res); });
router.set('/login', function(req, res) { return handlers.login_handler(config, db, req, res); });
router.set('/logout', function(req, res) { return handlers.logout_handler(config, req, res); });
router.set('/register', function(req, res) { return handlers.register_handler(config, db, req, res); });

// Endpoints del sistema a evaluar
router.set('/log', handlers.log_handler);
router.set('/sayHello', handlers.say_hello_handler);

function request_dispatcher(request, response)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        const endpointsProtegidos = ['/log', '/sayHello'];
        
        if (endpointsProtegidos.includes(path)) 
        {
            const sessionId = url.searchParams.get("sessionId");    
            if (!sessionId || !hasSession(sessionId)) 
            {
                response.writeHead(401, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: "401 Unauthorized: Debe iniciar sesión primero." }));
                return;
            }


    const sessionData = getSession(sessionId);
    const usuarioActivo = sessionData.username;

    const pathLimpio = path.startsWith('/') ? path.slice(1) : path;

    // 2. Control del componente Autorizador
    const estaAutorizado = authorize(db, usuarioActivo, pathLimpio);
            
            if (!estaAutorizado) 
            {
                response.writeHead(403, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: "403 Forbidden: Acción denegada para este usuario." }));
                return;
            }
        }

        return handler(request, response);
    }
    else
    {
        response.writeHead(404);
        response.end('Método no encontrado');
    }
}

const server = createServer(request_dispatcher);

server.listen(config.server.port, config.server.ip, function() 
{
    console.log(`Servidor síncrono corriendo en http://${config.server.ip}:${config.server.port}/`);
});
