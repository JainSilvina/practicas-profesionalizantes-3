//Verificación en la Base de Datos:
//Si quieres estar 100% segura de que el Caso de Uso impactó en el archivo, puedes revisar la base de datos desde la terminal (si tienes instalado sqlite3 CLI):
//sqlite3 db.sqlite3 "SELECT * FROM user;"   O 
//se crea un script de consulta:Crea un archivo llamado check_db.mjs en la carpeta principal
//se ejecuta por terminal de linux
// node check_db.mjs


import { db } from './database.mjs';

db.all("SELECT * FROM user", [], (err, rows) => {
    if (err) {
        console.error("Error al leer la base de datos:", err.message);
    } else {
        console.table(rows); // Esto mostrara los datos en una tabla bonita por la terminal de linux
    }
    db.close();
});

