import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { default_handler, show_message_handler } from './handlers/index.mjs';
import { register_handler } from './handlers/auth.mjs';

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

const router = new Map();
router.set('/', default_handler);
router.set('/register', register_handler);
router.set('/showMessage', show_message_handler);

const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${config.server.ip}`);
    const handler = router.get(url.pathname);
    
    if (handler) await handler(req, res);
    else {
        res.writeHead(404);
        res.end("Ruta no encontrada");
    }
});

server.listen(config.server.port, config.server.ip, () => {
    console.log(`Servidor en http://${config.server.ip}:${config.server.port}`);
});