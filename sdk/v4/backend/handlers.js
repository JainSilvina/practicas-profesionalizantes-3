import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { createUser } from './models.js';


function loginHandler(config, db, request, response)
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Credenciales listas para usar en cabeceras HTTP." }));
}

function logoutHandler(config, request, response)
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Cabeceras de autenticación removidas." }));
}

function registerHandler(config, db, request, response)
{
    // 
    const input = request.bodyParameters || {};

    if (!input.username || !input.password) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ exception: "InvalidArgument", detail: "Faltan parámetros requeridos (username/password)." }));
        return;
    }

    try 
    {
        const output = createUser(db, input.username, input.password);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        // excepciones de negocio/dominio mapeadas al código 422
        response.writeHead(422, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ exception: "DomainException", detail: err.message }));
    }
}
function logHandler(request, response) 
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Ejecución de /log SATISFACTORIA." }));
}

function sayHelloHandler(request, response) 
{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: "success", message: "Ejecución de /sayHello SATISFACTORIA." }));
}

export { 
    loginHandler, 
    logoutHandler, 
    registerHandler, 
    logHandler, 
    sayHelloHandler 
};