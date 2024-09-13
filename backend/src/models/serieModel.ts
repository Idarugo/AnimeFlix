import { Pool } from "mysql2/promise";

// Obtener todas las series
export async function getAllSeries(pool: Pool) {
    const [rows] = await pool.query(`
        SELECT 
            series.id, 
            series.titulo AS serie_titulo, 
            animes.titulo AS anime_titulo,
            animes.imagen_url, 
            animes.descripcion,
            clasificacion_edad.nombre AS clasificacion_edad_nombre,
            clasificacion_edad.descripcion AS clasificacion_edad_descripcion
        FROM series 
        JOIN animes ON series.anime_id = animes.id
        LEFT JOIN clasificacion_edad ON animes.clasificacion_edad_id = clasificacion_edad.id
    `);
    return rows;
}



export async function getAllSeriesAdmin(pool: Pool) {
    const [rows] = await pool.query("SELECT series.id, series.titulo AS serie_titulo, animes.titulo AS anime_titulo FROM series JOIN animes ON series.anime_id = animes.id");
    return rows;
}

// Crear una nueva serie
export async function createSerie(pool: Pool, serieData: { anime_id: number, titulo: string, descripcion: string }) {
    const sql = "INSERT INTO series (anime_id, titulo, descripcion) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [serieData.anime_id, serieData.titulo, serieData.descripcion]);
    return result;
}

// Actualizar una serie existente
export async function updateSerie(pool: Pool, id: string, serieData: { anime_id: number, titulo: string, descripcion: string }) {
    const sql = "UPDATE series SET anime_id = ?, titulo = ?, descripcion = ? WHERE id = ?";
    await pool.query(sql, [serieData.anime_id, serieData.titulo, serieData.descripcion, id]);
}

// Eliminar una serie
export async function deleteSerie(pool: Pool, id: string) {
    const sql = "DELETE FROM series WHERE id = ?";
    await pool.query(sql, [id]);
}