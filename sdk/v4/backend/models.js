// agregado ----

import crypto from 'node:crypto'; // Importación nativa al inicio del archivo

function calcularHashSHA256Sincrono(cadena) 
{

    const hashBuffer = crypto.createHash('sha256').update(cadena).digest();
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    
    let hashHex = "";
    for (let i = 0; i < hashArray.length; i++) 
    {
        let byteHex = hashArray[i].toString(16);
        if (byteHex.length < 2) 
        {
            byteHex = "0" + byteHex;
        }
        hashHex = hashHex + byteHex;
    }
    
    return hashHex;
}

//---------------------
let userSessions = new Map();

function createSession(username) 
{
    const sessionId = "token_" + username + "_" + Date.now();
    userSessions.set(sessionId, {
        username: username,
        loginTime: new Date()
    });
    return sessionId;
}

function getSession(sessionId) 
{
    return userSessions.get(sessionId);
}

function hasSession(sessionId) 
{
    return userSessions.has(sessionId);
}

function deleteSession(sessionId) 
{
    return userSessions.delete(sessionId);
}


// --- modificado ----COMPONENTE: AUTENTICADOR ---
function authenticate(db, username, password) 
{
    const sql = "SELECT password FROM user WHERE username = ?";
    try 
    {
        const stmt = db.prepare(sql);
        const row = stmt.get(username);

        if (row) 
        {
            // Calculamos el hash de la clave ingresada en el formulario web
            const inputPasswordHash = calcularHashSHA256Sincrono(password);
            
            // Comparación directa de los hashes síncronos
            if (row.password === inputPasswordHash) 
            {
                return true;
            }
        }
        return false;
    } 
    catch (err) 
    {
        console.error("Error en el Autenticador:", err);
        throw err;
    }
}
//---------------------------

// --- COMPONENTE: AUTORIZADOR ---
// Valida si el usuario pertenece a un grupo asociado al path del endpoint
function authorize(db, username, endpointPath) 
{
    const sql = `
        SELECT count(*) as total
        FROM access a
        JOIN members m ON a.id_group = m.id_group
        JOIN user u ON m.id_user = u.id
        JOIN endpoint e ON a.id_endpoint = e.id
        WHERE u.username = ? 
          AND e.path = ?
    `;
    try 
    {
        const stmt = db.prepare(sql);
        const row = stmt.get(username, endpointPath); 
        return row.total > 0;
    } 
    catch (err) 
    {
        console.error("Error en el Autorizador:", err);
        throw err;
    }
}

//modificado para el punto 3.3
function createUser(db, username, password) 
{
    const insertUserSql = "INSERT INTO user (username, password) VALUES (?, ?)";
    try 
    {
        // Calculamos el hash síncronamente antes de insertar en la base de datos
        const passwordHash = calcularHashSHA256Sincrono(password);

        const stmt = db.prepare(insertUserSql);
        const result = stmt.run(username, passwordHash); 
        
        return { success: true, userId: result.lastInsertRowid };
    } 
    catch (err) 
    {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') 
        {
            throw new Error("El nombre de usuario ya existe.");
        }
        throw err;
    }
}
//-----------------------------------------------------
export { 
    authenticate, 
    authorize, 
    createUser, 
    createSession, 
    getSession, 
    hasSession, 
    deleteSession 
};