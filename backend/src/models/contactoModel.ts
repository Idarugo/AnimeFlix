import { Pool } from "mysql2/promise";

export async function getAllContactos(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM contacto");
    return rows;
}

export async function createContacto(pool: Pool, contactoData: { nombre: string, email: string, mensaje: string }) {
    const sql = "INSERT INTO contacto (nombre, email, mensaje) VALUES (?, ?, ?)";
    const [result] = await pool.query(sql, [contactoData.nombre, contactoData.email, contactoData.mensaje]);
    return result;
}

export async function deleteContacto(pool: Pool, id: string) {
    const sql = "DELETE FROM contacto WHERE id = ?";
    const [result] = await pool.query(sql, [id]);
    return result;
}
