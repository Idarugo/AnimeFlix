import { Pool } from "mysql2/promise";

// Obtener todas las reseñas de un anime específico
export async function getResenasByAnimeId(pool: Pool, animeId: number) {
  const [rows] = await pool.query(`
      SELECT resenas.id, resenas.calificacion, resenas.comentario, resenas.created_at, 
             usuarios.nombre AS usuario_nombre
      FROM resenas
      JOIN usuarios ON resenas.user_id = usuarios.id
      WHERE resenas.anime_id = ?
  `, [animeId]);
  return rows;
}

// Crear una nueva reseña
export async function createResena(pool: Pool, resenaData: { anime_id: number, user_id: number, calificacion: number, comentario: string }) {
  const sql = "INSERT INTO resenas (anime_id, user_id, calificacion, comentario) VALUES (?, ?, ?, ?)";
  const [result] = await pool.query(sql, [resenaData.anime_id, resenaData.user_id, resenaData.calificacion, resenaData.comentario]);
  return result;
}

// Eliminar una reseña por su ID
export async function deleteResena(pool: Pool, resenaId: number) {
  const sql = "DELETE FROM resenas WHERE id = ?";
  await pool.query(sql, [resenaId]);
}
