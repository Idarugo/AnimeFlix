// src/models/animeCategoriasModel.ts
import { Pool } from "mysql2/promise";

// Obtener todos los animes relacionados con una categoría específica
export async function getAnimesByCategoria(pool: Pool, categoriaId: number) {
    const sql = `
        SELECT a.*
        FROM animes a
        JOIN anime_categorias ac ON a.id = ac.anime_id
        WHERE ac.categoria_id = ?
    `;
    const [rows] = await pool.query(sql, [categoriaId]);
    return rows;
}

// Agregar una categoría a un anime
export async function addCategoriaToAnime(pool: Pool, animeId: number, categoriaId: number) {
    const sql = "INSERT INTO anime_categorias (anime_id, categoria_id) VALUES (?, ?)";
    await pool.query(sql, [animeId, categoriaId]);
}

// Eliminar una categoría de un anime
export async function removeCategoriaFromAnime(pool: Pool, animeId: number, categoriaId: number) {
    const sql = "DELETE FROM anime_categorias WHERE anime_id = ? AND categoria_id = ?";
    await pool.query(sql, [animeId, categoriaId]);
}
