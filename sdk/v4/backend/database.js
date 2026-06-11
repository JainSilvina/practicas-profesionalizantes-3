import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';

function connect_db(path) 
{
    const dbPath = resolve(path);
    try 
    {
        return new DatabaseSync(dbPath);
    } 
    catch (err) 
    {
        throw new Error("Error al conectar a la base de datos: " + err.message);
    }
}

export { connect_db };