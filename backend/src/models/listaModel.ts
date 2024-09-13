import { Pool } from "mysql2/promise";

// Obtener todas las listas de un usuario
export async function getListasByUser(pool: Pool, userId: number) {
    const [rows] = await pool.query(
        `SELECT 
            l.id, 
            a.titulo as anime_titulo, 
            a.descripcion as anime_descripcion, 
            a.imagen_url as anime_imagen_url
         FROM listas l
         JOIN animes a ON l.anime_id = a.id
         WHERE l.user_id = ?`, 
        [userId]
    );
    return rows;
}

// Añadir un anime a la lista de un usuario
export async function addAnimeToLista(pool: Pool, listaData: { user_id: number, anime_id: number }) {
    const sql = "INSERT INTO listas (user_id, anime_id) VALUES (?, ?)";
    const [result] = await pool.query(sql, [listaData.user_id, listaData.anime_id]);
    return result;
}

// Eliminar un anime de la lista de un usuario
export async function deleteAnimeFromLista(pool: any, userId: number, animeId: number) {
    try {
        const query = "DELETE FROM listas WHERE user_id = ? AND anime_id = ?";
        console.log("Ejecutando query:", query, [userId, animeId]);
        const [result] = await pool.query(query, [userId, animeId]);
        console.log("Resultado del query de eliminación:", result);
        return result;
    } catch (error) {
        console.error("Error en deleteAnimeFromLista:", error);
        throw error;
    }
}
