import { Pool } from "mysql2/promise";

// Obtener todas las notificaciones
export async function getAllNotificaciones(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM notificaciones");
    return rows;
}

// Obtener todas las notificaciones de un usuario
export async function getNotificacionesByUser(pool: Pool, userId: number) {
    const [rows] = await pool.query("SELECT * FROM notificaciones WHERE user_id = ?", [userId]);
    return rows;
}

// Crear una nueva notificación
export async function createNotificacion(pool: Pool, notificacionData: { user_id: number, tipo: string, mensaje: string }) {
    const sql = "INSERT INTO notificaciones (user_id, tipo, mensaje) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [notificacionData.user_id, notificacionData.tipo, notificacionData.mensaje]);
    return result;
}

// Marcar notificación como leída
export async function markNotificacionAsRead(pool: Pool, id: number) {
    const sql = "UPDATE notificaciones SET leido = TRUE WHERE id = ?";
    await pool.query(sql, [id]);
}

// Eliminar notificación
export async function deleteNotificacion(pool: Pool, id: number) {
    const sql = "DELETE FROM notificaciones WHERE id = ?";
    await pool.query(sql, [id]);
}