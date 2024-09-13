import { Pool, ResultSetHeader } from "mysql2/promise";

// Función para obtener todos los avatares de la base de datos
export async function getAvatares(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM avatares");
    return rows;
}

// Función para actualizar la URL del avatar de un usuario
export async function updateAvatarUrl(pool: Pool, userId: number, avatarUrl: string) {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE usuarios SET avatar_url = ? WHERE id = ?",
        [avatarUrl, userId]
    );
    return result;
}
