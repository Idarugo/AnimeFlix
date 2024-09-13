import { Pool, RowDataPacket } from "mysql2/promise";

// Definir una interfaz para el tipo de episodio
interface Episodio extends RowDataPacket {
  id: number;
  temporada_id: number;
  numero_episodio: number;
  titulo: string;
  descripcion: string;
  video_url: string;
  duracion: string;
}

// Obtener episodios por temporada_id
export async function getEpisodiosByTemporadaId(pool: Pool, temporadaId: number): Promise<Episodio[]> {
  const [rows] = await pool.query<Episodio[]>("SELECT * FROM episodios WHERE temporada_id = ?", [temporadaId]);
  return rows;
}
// Obtener todos los episodios
export async function getAllEpisodios(pool: Pool): Promise<Episodio[]> {
  const [rows] = await pool.query<Episodio[]>("SELECT * FROM episodios");
  return rows;
}

// Obtener todos los episodios con detalles adicionales
export async function getAllEpisodiosAdmin(pool: Pool): Promise<Episodio[]> {
  const [rows] = await pool.query<Episodio[]>(`
    SELECT episodios.*, temporadas.titulo AS temporada_nombre, animes.titulo AS anime_titulo
    FROM episodios
    JOIN temporadas ON episodios.temporada_id = temporadas.id
    JOIN series ON temporadas.serie_id = series.id
    JOIN animes ON series.anime_id = animes.id
  `);
  return rows;
}

// Obtener un episodio por ID
export async function getEpisodioById(pool: Pool, id: number): Promise<Episodio | null> {
  const [rows] = await pool.query<Episodio[]>("SELECT * FROM episodios WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Crear un nuevo episodio
export async function createEpisodio(pool: Pool, episodioData: Omit<Episodio, 'id'>): Promise<any> {
  const sql = "INSERT INTO episodios (temporada_id, numero_episodio, titulo, descripcion, video_url, duracion) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [
    episodioData.temporada_id,
    episodioData.numero_episodio,
    episodioData.titulo,
    episodioData.descripcion,
    episodioData.video_url,
    episodioData.duracion,
  ]);
  return result;
}

// Actualizar un episodio existente
export async function updateEpisodio(pool: Pool, id: number, episodioData: Omit<Episodio, 'id'>): Promise<void> {
    const sql = "UPDATE episodios SET temporada_id = ?, numero_episodio = ?, titulo = ?, descripcion = ?, video_url = ?, duracion = ? WHERE id = ?";
    console.log("Ejecutando SQL:", sql);
    console.log("Con datos:", episodioData);

    await pool.query(sql, [
        episodioData.temporada_id,
        episodioData.numero_episodio,
        episodioData.titulo,
        episodioData.descripcion,
        episodioData.video_url,
        episodioData.duracion,
        id,
    ]);
}


// Eliminar un episodio
export async function deleteEpisodio(pool: Pool, id: number): Promise<void> {
  const sql = "DELETE FROM episodios WHERE id = ?";
  await pool.query(sql, [id]);
}

// Añadir esta nueva función para obtener episodios por animeId
export async function getEpisodiosByAnimeId(pool: Pool, animeId: number): Promise<Episodio[]> {
  const [rows] = await pool.query<Episodio[]>(
    `SELECT episodios.* FROM episodios 
     JOIN temporadas ON episodios.temporada_id = temporadas.id
     JOIN series ON temporadas.serie_id = series.id
     WHERE series.anime_id = ?`,
    [animeId]
  );
  return rows;
}
