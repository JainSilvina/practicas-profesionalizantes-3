import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';

import { connectDb } from './database.js';
import { authenticateById, authorizeById } from './models.js';//   nuevo
import * as handlers from './handlers.js';

function defaultConfig() 
{
    return {
        server: { ip: '0.0.0.0', port: 3000 }, 
        database: { path: './db.sqlite3' }
    };
}

function loadConfig() 
{
    try {
        const data = readFileSync('./config.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return defaultConfig();
    }
}

const config = loadConfig();
const db = connectDb(config.database.path);

let router = new Map();

router.set('/login', function(request, response) { return handlers.loginHandler(config, db, request, response); });
router.set('/logout', function(request, response) { return handlers.logoutHandler(config, request, response); });
router.set('/register', function(request, response) { return handlers.registerHandler(config, db, request, response); });

router.set('/log', handlers.logHandler);
router.set('/sayHello', handlers.sayHelloHandler);

function requestDispatcher(request, response) 
{ 
    // Cabeceras CORS 
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id, x-api-key, x-api-version');

    if (request.method === 'OPTIONS') 
    {
        response.writeHead(204);
        response.end();
        return;
    }

    const urlParseada = new URL(request.url, 'http://localhost:' + config.server.port);
    const path = urlParseada.pathname; 

  //post
    if (path === '/register' && request.method === 'POST') {
        let body = '';
        request.on('data', function(chunk) { body += chunk.toString(); });
        request.on('end', function() {
            try {
                const datos = JSON.parse(body);
               
                request.bodyParameters = datos;
            } catch (e) {
                response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ exception: "BadRequest", detail: "Formato JSON inválido en el cuerpo." }));
                return;
            }
            
            const handler = router.get(path);
            if (handler) {
                handler(request, response);
            }
        });
        return; 
    }

    const handler = router.get(path);

    if (handler)
    {
        const endpointsProtegidos = ['/log', '/sayHello'];
        
        if (endpointsProtegidos.includes(path)) 
        {
            const userId = request.headers['x-user-id'];   
            const apiKey = request.headers['x-api-key'];   
            
            // 401
            if (!userId || !apiKey) 
            {
                response.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ exception: "Unauthorized", detail: "Cabeceras de autenticación ausentes." }));
                return;
            }

            const estaAutenticado = authenticateById(db, userId, apiKey);
            if (!estaAutenticado) 
            {
                response.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ exception: "Unauthorized", detail: "Credenciales incorrectas." }));
                return;
            }

            const pathLimpio = path.startsWith('/') ? path.slice(1) : path;
            const estaAutorizado = authorizeById(db, userId, pathLimpio);
            
            // 403
            if (!estaAutorizado) 
            {
                response.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ exception: "Forbidden", detail: "Acción denegada para este usuario." }));
                return;
            }
        }

        return handler(request, response);
    }
    else
    {
        //  404
        response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ exception: "NotFound", detail: "Ruta " + path + " no encontrada." }));
    }
}
//----
const server = createServer(requestDispatcher);

server.listen(config.server.port, config.server.ip, function() 
{
    console.log(`Servidor WebAPI corriendo en http://${config.server.ip}:${config.server.port}/`);
});