import { Pool } from "mysql2/promise";

// Obtener todos los lanzamientos
export async function getAllLanzamientos(pool: Pool) {
    const query = `
        SELECT 
            l.id AS lanzamiento_id,
            e.id AS episodio_id,
            e.titulo AS episodio_titulo,
            t.titulo AS temporada_titulo,
            t.imagen_url AS temporada_imagen_url,
            t.descripcion AS temporada_descripcion, 
            s.titulo AS serie_titulo,
            l.fecha_lanzamiento AS fecha_lanzamiento
        FROM 
            lanzamientos l
        INNER JOIN 
            episodios e ON l.episodio_id = e.id
        INNER JOIN 
            temporadas t ON e.temporada_id = t.id
        INNER JOIN 
            series s ON t.serie_id = s.id
        ORDER BY 
            l.fecha_lanzamiento DESC;
    `;
    
    const [rows] = await pool.query(query);
    return rows;
}


// Obtener lanzamientos con detalles adicionales para la vista de administrador
export async function getAllLanzamientosAdmin(pool: Pool) {
    const [rows] = await pool.query(`
        SELECT 
            lanzamientos.id, 
            episodios.titulo AS episodio_titulo, 
            series.titulo AS serie_titulo, 
            lanzamientos.fecha_lanzamiento 
        FROM 
            lanzamientos 
        JOIN 
            episodios ON lanzamientos.episodio_id = episodios.id 
        JOIN 
            temporadas ON episodios.temporada_id = temporadas.id 
        JOIN 
            series ON temporadas.serie_id = series.id
    `);
    return rows;
}

// Crear un nuevo lanzamiento
export async function createLanzamiento(pool: Pool, lanzamientoData: { episodio_id: number, fecha_lanzamiento: string }) {
    const sql = "INSERT INTO lanzamientos (episodio_id, fecha_lanzamiento) VALUES (?, ?)";
    const [result] = await pool.query(sql, [lanzamientoData.episodio_id, lanzamientoData.fecha_lanzamiento]);
    return result;
}

// Actualizar un lanzamiento existente
export async function updateLanzamiento(pool: Pool, id: string, lanzamientoData: { episodio_id: number, fecha_lanzamiento: string }) {
    const sql = "UPDATE lanzamientos SET episodio_id = ?, fecha_lanzamiento = ? WHERE id = ?";
    await pool.query(sql, [lanzamientoData.episodio_id, lanzamientoData.fecha_lanzamiento, id]);
}


// Eliminar un lanzamiento
export async function deleteLanzamiento(pool: Pool, id: string) {
    const sql = "DELETE FROM lanzamientos WHERE id = ?";
    await pool.query(sql, [id]);
  }