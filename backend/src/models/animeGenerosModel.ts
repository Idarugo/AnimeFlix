import { Pool } from "mysql2/promise";

// Obtener todos los animes relacionados con un género específico
export async function getAnimesByGenero(pool: Pool, generoId: number) {
    const sql = `
        SELECT a.*
        FROM animes a
        JOIN anime_generos ag ON a.id = ag.anime_id
        WHERE ag.genero_id = ?
    `;
    const [rows] = await pool.query(sql, [generoId]);
    return rows;
}

// Agregar un género a un anime
export async function addGeneroToAnime(pool: Pool, animeId: number, generoId: number) {
    const sql = "INSERT INTO anime_generos (anime_id, genero_id) VALUES (?, ?)";
    await pool.query(sql, [animeId, generoId]);
}

// Eliminar un género de un anime
export async function removeGeneroFromAnime(pool: Pool, animeId: number, generoId: number) {
    const sql = "DELETE FROM anime_generos WHERE anime_id = ? AND genero_id = ?";
    await pool.query(sql, [animeId, generoId]);
}
