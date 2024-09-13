// src/models/animeModel.ts
import { Pool } from "mysql2/promise";

export async function getAllAnimes(pool: Pool) {
    const sql = `
        SELECT 
            a.id, 
            a.titulo, 
            a.descripcion, 
            a.imagen_url, 
            a.clasificacion_edad_id, 
            a.created_at, 
            a.updated_at,
            GROUP_CONCAT(g.nombre) AS generos 
        FROM 
            animes a
        LEFT JOIN 
            anime_generos ag ON a.id = ag.anime_id 
        LEFT JOIN 
            generos g ON ag.genero_id = g.id 
        GROUP BY 
            a.id
    `;

    const [rows]: [any[], any] = await pool.query(sql);

    // Procesar los resultados para incluir el array de géneros
    return rows.map((row: any) => ({
        ...row,
        generos: row.generos ? row.generos.split(',') : [] // Manejar el caso de valores nulos
    }));
}

// Crear un nuevo anime
export async function createAnime(pool: Pool, animeData: { titulo: string, descripcion: string, imagen_url?: string, clasificacion_edad_id?: number }) {
    const sql = `
        INSERT INTO animes (titulo, descripcion, imagen_url, clasificacion_edad_id) 
        VALUES (?, ?, ?, ?)`;
    
    const [result] = await pool.query(sql, [
        animeData.titulo, 
        animeData.descripcion, 
        animeData.imagen_url || null, 
        animeData.clasificacion_edad_id || null
    ]);
    
    return result;
}

// Actualizar un anime existente
export async function updateAnime(pool: Pool, id: string, animeData: { titulo: string, descripcion: string, imagen_url?: string, clasificacion_edad_id?: number }) {
    const sql = `
        UPDATE animes 
        SET titulo = ?, descripcion = ?, imagen_url = ?, clasificacion_edad_id = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`;

    await pool.query(sql, [
        animeData.titulo, 
        animeData.descripcion, 
        animeData.imagen_url || null, 
        animeData.clasificacion_edad_id || null,
        id
    ]);
}

// Eliminar un anime
export async function deleteAnime(pool: Pool, id: string) {
    const sql = "DELETE FROM animes WHERE id = ?";
    await pool.query(sql, [id]);
}