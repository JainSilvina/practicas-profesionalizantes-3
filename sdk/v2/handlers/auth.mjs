import { db } from '../database.mjs';

// Funcion para verificar si el usuario ya existe
async function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE username = ?`;
        db.get(sql, [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function registerUser(username, password) {
    const sql = `INSERT INTO user (username, password) VALUES (?, ?)`;
    return new Promise((resolve, reject) => {
        db.run(sql, [username, password], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, username });
        });
    });
}

//  nueva funciones  deleteUser y updateUserRole---------------------------

async function deleteUser(username) {
    const sql = `DELETE FROM user WHERE username = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [username], function (err) {
            if (err) reject(err);
            else resolve({ deleted: this.changes });
        });
    });
}

async function updateUserRole(username, newRole) {
    const sql = `UPDATE user SET role = ? WHERE username = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, [newRole, username], function (err) {
            if (err) reject(err);
            else resolve({ updated: this.changes });
        });
    });
}
//-----------------------------------------------------------

export async function register_handler(request, response) {
    if (request.method !== "POST") {
        response.writeHead(405);
        return response.end("Se requiere método POST");
    }

    let body = '';
    request.on('data', chunk => body += chunk.toString());
    request.on('end', async () => {
        try {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');

            if (!username || !password) {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                return response.end(JSON.stringify({ error: "Faltan datos" }));
            }

            const existingUser = await getUserByUsername(username);
            if (existingUser) {
                response.writeHead(409, { 'Content-Type': 'application/json' }); // 409: Conflict
                return response.end(JSON.stringify({ 
                    status: false, 
                    error: "El nombre de usuario ya está registrado" 
                }));
            }

            const resultado = await registerUser(username, password);
            response.writeHead(201, { 'Content-Type': 'application/json' }); // 201: Created
            response.end(JSON.stringify({ status: true, data: resultado }));

        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}

// nueva funcion delete_User_handler------------------------------
export async function delete_user_handler(request, response) {
    let body = '';
    request.on('data', chunk => body += chunk.toString());
    request.on('end', async () => {
        const params = new URLSearchParams(body);
        const username = params.get('username');
        try {
            const resultado = await deleteUser(username);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: true, data: resultado }));
        } catch (error) {
            response.writeHead(500);
            response.end(JSON.stringify({ error: error.message }));
        }
    });
}
//----------------------------------------------------------------------------