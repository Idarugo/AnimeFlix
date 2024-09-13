import { Pool } from "mysql2/promise";

export async function getAllCategorias(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM categorias");
    return rows;
}

export async function createCategoria(pool: Pool, categoriaData: { nombre: string }) {
    const sql = "INSERT INTO categorias (nombre) VALUES (?)";
    const [result] = await pool.query(sql, [categoriaData.nombre]);
    return result;
}

export async function updateCategoria(pool: Pool, id: string, categoriaData: { nombre: string }) {
    const sql = "UPDATE categorias SET nombre = ? WHERE id = ?";
    const [result] = await pool.query(sql, [categoriaData.nombre, id]);
    return result;
}

export async function deleteCategoria(pool: Pool, id: string) {
    const sql = "DELETE FROM categorias WHERE id = ?";
    const [result] = await pool.query(sql, [id]);
    return result;
}

export async function getAnimesByCategorias(pool: Pool, categorias: string[]) {
    if (categorias.length === 0) return [];

    const sql = `
        SELECT DISTINCT a.*
        FROM animes a
        JOIN anime_categorias ac ON a.id = ac.anime_id
        JOIN categorias c ON ac.categoria_id = c.id
        WHERE c.nombre IN (?)
        GROUP BY a.id
        HAVING COUNT(DISTINCT c.id) = ?;
    `;

    const [rows] = await pool.query(sql, [categorias, categorias.length]);
    return rows;
}
