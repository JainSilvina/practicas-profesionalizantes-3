import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const configContenido = readFileSync('./config.json', 'utf-8');
const config = JSON.parse(configContenido);
const dbPath = resolve(config.database.path);
const db = new DatabaseSync(dbPath);

const sqlInit = `
-- Crear tablas si no existen 
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS userGroup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS groupMember (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupId INTEGER,
    userId INTEGER,
    FOREIGN KEY(groupId) REFERENCES userGroup(id),
    FOREIGN KEY(userId) REFERENCES user(id)
);

-- Insertar registros iniciales de prueba
INSERT OR IGNORE INTO user (username, password, role) VALUES 
('admin_isabel', 'hash_admin_01', 'admin'),
('editor_mar_del_plata', 'hash_edit_02', 'editor'),
('alumno_test_01', 'hash_user_03', 'user'),
('coordinador_gral', 'hash_admin_08', 'admin');

INSERT OR IGNORE INTO userGroup (name) VALUES ('Comisión A'), ('Administradores');
`;

try {
    db.exec(sqlInit);
    console.log("¡Éxito! Estructuras de tablas verificadas y registros insertados.");
} catch (error) {
    console.error("Error al actualizar la base:", error.message);
}