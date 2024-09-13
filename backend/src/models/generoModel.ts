import { Pool } from "mysql2/promise";

// Obtener todos los géneros
export async function getAllGeneros(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM generos");
    return rows;
}

// Crear un nuevo género
export async function createGenero(pool: Pool, generoData: { nombre: string }) {
    const sql = "INSERT INTO generos (nombre) VALUES (?)";
    const [result] = await pool.query(sql, [generoData.nombre]);
    return result;
}
