import { db } from '../database.mjs';

// ==========================================
//           ABM USUARIOS Y ROLES
// ==========================================

export function getUserByUsername(username) {
    const query = db.prepare(`SELECT * FROM user WHERE username = ?`);
    return query.get(username);
}

export function registerUser(username, password) {
    const query = db.prepare(`INSERT INTO user (username, password) VALUES (?, ?)`);
    const result = query.run(username, password);
    return { id: result.lastInsertRowid, username };
}

export function deleteUser(username) {
    const query = db.prepare(`DELETE FROM user WHERE username = ?`);
    const result = query.run(username);
    return { deleted: result.changes };
}

export function updateUserRole(username, newRole) {
    const query = db.prepare(`UPDATE user SET role = ? WHERE username = ?`);
    const result = query.run(newRole, username);
    return { updated: result.changes };
}

// ==========================================
//               ABM GRUPOS
// ==========================================

export function createGroup(name) {
    const query = db.prepare(`INSERT INTO userGroup (name) VALUES (?)`);
    const result = query.run(name);
    return { id: result.lastInsertRowid, name };
}

export function deleteGroup(name) {
    const query = db.prepare(`DELETE FROM userGroup WHERE name = ?`);
    const result = query.run(name);
    return { deleted: result.changes };
}

// ==========================================
//              ABM MIEMBROS
// ==========================================

export function addMemberToGroup(groupId, userId) {
    const query = db.prepare(`INSERT INTO groupMember (groupId, userId) VALUES (?, ?)`);
    const result = query.run(groupId, userId);
    return { id: result.lastInsertRowid, groupId, userId };
}

export function removeMemberFromGroup(groupId, userId) {
    const query = db.prepare(`DELETE FROM groupMember WHERE groupId = ? AND userId = ?`);
    const result = query.run(groupId, userId);
    return { deleted: result.changes };
}