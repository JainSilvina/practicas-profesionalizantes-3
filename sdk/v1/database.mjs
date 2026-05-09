import sqlite3 from 'sqlite3';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync('./config.json', 'utf-8'));
const dbPath = resolve(config.database.path);

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error DB:", err.message);
    else console.log("Conectado a SQLite");
});