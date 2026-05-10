import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

export function default_handler(request, response) {
    try {
        const html = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
    } catch (error) {
        response.writeHead(404);
        response.end("HTML no encontrado");
    }
}

export function show_message_handler(request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: "Petición recibida" }));
}