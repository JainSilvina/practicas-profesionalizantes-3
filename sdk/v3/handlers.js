import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { authenticate, createUser, createSession, deleteSession, hasSession } from './models.js';

function default_handler(config, request, response)
{
    try 
    {
        const data = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    } 
    catch (err) 
    {
        response.writeHead(500);
        response.end('Error interno del servidor al cargar la interfaz HTML');
    }
}

function login_handler(config, db, request, response)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const input = Object.fromEntries(url.searchParams);

    const is_valid = authenticate(db, input.username, input.password);

    if (is_valid)
    {
        const sessionId = createSession(input.username);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: "success", sessionId: sessionId }));
    }
    else
    {
        response.writeHead(401, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: "fail", error: "Credenciales incorrectas" }));
    }
}

function logout_handler(config, request, response)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const input = Object.fromEntries(url.searchParams);
    const sessionId = input.sessionId;

    if (sessionId && hasSession(sessionId)) 
    {
        deleteSession(sessionId);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: "success", message: "Sesión cerrada" }));
    } 
    else 
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: "fail", error: "Sesión inválida" }));
    }
}

function register_handler(config, db, request, response)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const input = Object.fromEntries(url.searchParams);

    try 
    {
        const output = createUser(db, input.username, input.password);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function log_handler(request, response) 
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Ejecución de /log SATISFACTORIA." }));
}

function say_hello_handler(request, response) 
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Ejecución de /sayHello SATISFACTORIA." }));
}

export { 
    default_handler, 
    login_handler, 
    logout_handler, 
    register_handler, 
    log_handler, 
    say_hello_handler 
};