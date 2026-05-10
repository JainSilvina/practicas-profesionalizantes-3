import { db } from './database.mjs';

const sql = `
-- 1. Agregamos la columna para los permisos
ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user';

-- 2. Insertamos registros variados para probar queries (como pide la consigna)
INSERT INTO user (username, password, role) VALUES 
('admin_isabel', 'hash_admin_01', 'admin'),
('editor_mar_del_plata', 'hash_edit_02', 'editor'),
('alumno_test_01', 'hash_user_03', 'user'),
('alumno_test_02', 'hash_user_04', 'user'),
('arquitecto_pba', 'hash_admin_05', 'admin'),
('visitante_anonimo', 'hash_guest_06', 'guest'),
('tester_qa', 'hash_user_07', 'user'),
('coordinador_gral', 'hash_admin_08', 'admin'),
('biblioteca_digital', 'hash_edit_09', 'editor'),
('usuario_final_10', 'hash_user_10', 'user');
`;

db.exec(sql, (err) => {
    if (err) {
        console.error("Error al actualizar la base:", err.message);
    } else {
        console.log("¡Éxito! Columna 'role' añadida y registros insertados.");
    }
    db.close();
});