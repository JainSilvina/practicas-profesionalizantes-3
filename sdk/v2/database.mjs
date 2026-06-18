import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const configContenido = readFileSync('./config.json', 'utf-8');
const config = JSON.parse(configContenido);
const dbPath = resolve(config.database.path);


export const db = new DatabaseSync(dbPath);
console.log("Conectado a SQLite mediante node:sqlite");