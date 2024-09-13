import { Pool, ResultSetHeader } from "mysql2/promise";

// Obtener todo el historial
export async function getAllHistorial(pool: Pool) {
    const [rows] = await pool.query(
        `SELECT h.id, h.fecha_visto, a.titulo as anime_titulo, u.nombre as usuario_nombre
         FROM historial h
         JOIN animes a ON h.anime_id = a.id
         JOIN usuarios u ON h.user_id = u.id`
    );
    return rows;
}

// Obtener el historial de un usuario
export async function getHistorialByUser(pool: Pool, userId: number) {
    const [rows] = await pool.query(
        `SELECT 
            h.id, 
            h.fecha_visto, 
            a.titulo as anime_titulo, 
            a.descripcion as anime_descripcion, 
            a.imagen_url as anime_imagen_url, 
            u.nombre as usuario_nombre
         FROM historial h
         JOIN animes a ON h.anime_id = a.id
         JOIN usuarios u ON h.user_id = u.id
         WHERE h.user_id = ?
         GROUP BY h.anime_id, a.titulo, a.descripcion, a.imagen_url, u.nombre
         ORDER BY fecha_visto DESC`, 
        [userId]
    );
    return rows;
}

// Añadir un anime al historial de un usuario
export async function addAnimeToHistorial(pool: Pool, historialData: { user_id: number, anime_id: number, fecha_visto: string }) {
    // Verifica si el anime ya existe en el historial del usuario
    const [rows] = await pool.query<any[]>(
        "SELECT id FROM historial WHERE user_id = ? AND anime_id = ?", 
        [historialData.user_id, historialData.anime_id]
    );

    // Si ya existe, actualiza la fecha en lugar de insertar una nueva entrada
    if (rows.length > 0) {
        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE historial SET fecha_visto = ? WHERE user_id = ? AND anime_id = ?", 
            [historialData.fecha_visto, historialData.user_id, historialData.anime_id]
        );
        return result;
    } else {
        // Si no existe, inserta una nueva entrada
        const sql = "INSERT INTO historial (user_id, anime_id, fecha_visto) VALUES (?, ?, ?)";
        const [result] = await pool.query<ResultSetHeader>(sql, [historialData.user_id, historialData.anime_id, historialData.fecha_visto]);
        return result;
    }
}

export async function deleteHistorial(pool: Pool, historialId: number): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM historial WHERE id = ?", [historialId]);
    return result;
}
