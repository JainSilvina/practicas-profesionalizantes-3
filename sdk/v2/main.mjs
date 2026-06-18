import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { defaultHandler, showMessageHandler } from './handlers/index.mjs';
import { 
    registerHandler, 
    deleteUserHandler, 
    createGroupHandler, 
    deleteGroupHandler,          
    addMemberToGroupHandler,     
    removeMemberFromGroupHandler,
    updateUserRoleHandler 
} from './handlers/authHandler.mjs';

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));

const router = new Map();
router.set('/', defaultHandler);
router.set('/register', registerHandler);
router.set('/deleteUser', deleteUserHandler); 
router.set('/createGroup', createGroupHandler);
router.set('/deleteGroup', deleteGroupHandler);                   
router.set('/addMemberToGroup', addMemberToGroupHandler);            
router.set('/removeMemberFromGroup', removeMemberFromGroupHandler);
router.set('/updateUserRole', updateUserRoleHandler); 
router.set('/showMessage', showMessageHandler);

// Despachador de rutas 
function requestDispatcher(req, res) {
    const url = new URL(req.url, `http://${config.server.ip}`);
    const handler = router.get(url.pathname);
    
    if (handler) {
        handler(req, res);
    } else {
        res.writeHead(404);
        res.end("Ruta no encontrada");
    }
}

function serverListeningCallback() {
    console.log(`Servidor corriendo en http://${config.server.ip}:${config.server.port}`);
}

const server = createServer(requestDispatcher);
server.listen(config.server.port, config.server.ip, serverListeningCallback);