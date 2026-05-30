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


// --- COMPONENTE: AUTENTICADOR ---
function authenticate(db, username, password) 
{
    const sql = "SELECT password FROM user WHERE username = ?";
    try 
    {
        const stmt = db.prepare(sql);
        const row = stmt.get(username);

        if (row && row.password === password) 
        {
            return true;
        }
        return false;
    } 
    catch (err) 
    {
        console.error("Error en el Autenticador:", err);
        throw err;
    }
}


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

function createUser(db, username, password) 
{
    const insertUserSql = "INSERT INTO user (username, password) VALUES (?, ?)";
    try 
    {
        const stmt = db.prepare(insertUserSql);
        const result = stmt.run(username, password);
        return { success: true, userId: result.lastInsertRowid };
    } 
    catch (err) 
    {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') 
        {
            throw new Error("El nombre de usuario ya existe.");
        }
        throw new Error("Error al crear el usuario: " + err.message);
    }
}

export { 
    authenticate, 
    authorize, 
    createUser, 
    createSession, 
    getSession, 
    hasSession, 
    deleteSession 
};