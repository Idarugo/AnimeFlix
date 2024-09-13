import { Pool } from "mysql2/promise";

// Obtener todas las clasificaciones por edad
export async function getAllClasificacionEdad(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM clasificacion_edad");
    return rows;
}

// Crear una nueva clasificación por edad
export async function createClasificacionEdad(
    pool: Pool,
    clasificacionEdadData: { nombre: string; descripcion: string }
) {
    const sql = "INSERT INTO clasificacion_edad (nombre, descripcion) VALUES (?, ?)";
    const [result] = await pool.query(sql, [clasificacionEdadData.nombre, clasificacionEdadData.descripcion]);
    return result;
}
