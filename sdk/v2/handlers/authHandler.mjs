import { URLSearchParams } from 'node:url';
import { 
    getUserByUsername, 
    registerUser, 
    deleteUser,
    createGroup,
    deleteGroup,             
    addMemberToGroup,        
    removeMemberFromGroup,   
    updateUserRole 
} from '../services/userService.mjs';

export function registerHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    request.on('data', function (chunk) {
        body += chunk.toString();
    });
    
    request.on('end', function () {
        try {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');

            if (!username || !password) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ error: "Faltan datos" }));
            }

            const existingUser = getUserByUsername(username);
            if (existingUser) {
                response.writeHead(409, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ status: false, error: "El usuario ya existe" }));
            }

            const resultado = registerUser(username, password);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}

export function deleteUserHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    request.on('data', function (chunk) {
        body += chunk.toString();
    });

    request.on('end', function () {
        try {
            const params = new URLSearchParams(body);
            const username = params.get('username');

            if (!username) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ status: false, error: "Falta el nombre de usuario" }));
            }

            const resultado = deleteUser(username);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}

export function createGroupHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    request.on('data', function (chunk) {
        body += chunk.toString();
    });

    request.on('end', function () {
        try {
            const params = new URLSearchParams(body);
            const name = params.get('name');

            if (!name) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ status: false, error: "Falta el nombre del grupo" }));
            }

            const resultado = createGroup(name);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}

export function updateUserRoleHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    request.on('data', function (chunk) {
        body += chunk.toString();
    });

    request.on('end', function () {
        try {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const role = params.get('role');

            if (!username || !role) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ status: false, error: "Faltan datos" }));
            }

            const resultado = updateUserRole(username, role);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: false, error: error.message }));
        }
    });
}
//agregado  
export function deleteGroupHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    
    request.on('data', function recibirBloque(chunk) {
        body += chunk.toString();
    });

    request.on('end', function procesarBajaGrupo() {
        try {
            const params = new URLSearchParams(body);
            // error por no usar 'name' que es lo que manda el formulario
            const name = params.get('name'); 

            if (!name) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ error: "Faltan datos (name)" }));
            }

            const resultado = deleteGroup(name);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}///////
export function addMemberToGroupHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    
    request.on('data', function recibirBloque(chunk) {
        body += chunk.toString();
    });

    request.on('end', function procesarVinculoMiembro() {
        try {
            const params = new URLSearchParams(body);
            const groupId = params.get('groupId');
            const userId = params.get('userId');

            if (!groupId || !userId) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ error: "Faltan datos" }));
            }

            const resultado = addMemberToGroup(groupId, userId);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}

export function removeMemberFromGroupHandler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    
    request.on('data', function recibirBloque(chunk) {
        body += chunk.toString();
    });

    request.on('end', function procesarDesvinculoMiembro() {
        try {
            const params = new URLSearchParams(body);
            const groupId = params.get('groupId');
            const userId = params.get('userId');

            if (!groupId || !userId) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ error: "Faltan datos" }));
            }

            const resultado = removeMemberFromGroup(groupId, userId);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}
//////////////////////////
