import { Pool } from "mysql2/promise";

// Obtener todas las temporadas
export async function getAllTemporadas(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM temporadas");
    return rows;
}


export async function getTemporadasBySerie(pool: Pool, serieId: number) {
    const query = `
        SELECT 
            temporadas.id, 
            temporadas.numero_temporada, 
            temporadas.titulo, 
            temporadas.descripcion, 
            temporadas.imagen_url, 
            series.titulo AS serie_titulo, 
            animes.titulo AS anime_titulo, 
            clasificacion_edad.nombre AS clasificacion_edad_nombre, 
            clasificacion_edad.descripcion AS clasificacion_edad_descripcion
        FROM 
            temporadas 
        JOIN 
            series ON temporadas.serie_id = series.id 
        JOIN 
            animes ON series.anime_id = animes.id
        LEFT JOIN 
            clasificacion_edad ON animes.clasificacion_edad_id = clasificacion_edad.id
        WHERE 
            series.id = ?
    `;
    
    const [rows] = await pool.query(query, [serieId]);
    return rows;
}

export async function getAllTemporadasAdmin(pool: Pool) {
    const [rows] = await pool.query(`
        SELECT 
            temporadas.id, 
            temporadas.numero_temporada, 
            temporadas.titulo, 
            temporadas.descripcion, 
            temporadas.imagen_url, 
            series.titulo AS serie_titulo, 
            animes.titulo AS anime_titulo
        FROM 
            temporadas 
        JOIN 
            series ON temporadas.serie_id = series.id 
        JOIN 
            animes ON series.anime_id = animes.id
    `);
    return rows;
}
// Crear una nueva temporada
export async function createTemporada(pool: Pool, temporadaData: { serie_id: number, numero_temporada: number, titulo: string, descripcion: string, imagen_url?: string }) {
    const sql = "INSERT INTO temporadas (serie_id, numero_temporada, titulo, descripcion, imagen_url) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.query(sql, [temporadaData.serie_id, temporadaData.numero_temporada, temporadaData.titulo, temporadaData.descripcion, temporadaData.imagen_url]);
    return result;
}

// Actualizar una temporada
export async function updateTemporada(pool: Pool, id: number, temporadaData: { serie_id: number, numero_temporada: number, titulo: string, descripcion: string, imagen_url?: string }) {
    const sql = "UPDATE temporadas SET serie_id = ?, numero_temporada = ?, titulo = ?, descripcion = ?, imagen_url = ? WHERE id = ?";
    await pool.query(sql, [temporadaData.serie_id, temporadaData.numero_temporada, temporadaData.titulo, temporadaData.descripcion, temporadaData.imagen_url, id]);
}

// Eliminar una temporada
export async function deleteTemporada(pool: Pool, id: number) {
    const sql = "DELETE FROM temporadas WHERE id = ?";
    await pool.query(sql, [id]);
}