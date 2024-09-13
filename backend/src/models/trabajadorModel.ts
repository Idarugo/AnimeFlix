import { Pool } from "mysql2/promise";

export async function getAllTrabajadores(pool: Pool) {
  const [rows] = await pool.query("SELECT * FROM trabajadores");
  return rows;
}

export async function createTrabajador(pool: Pool, trabajadorData: { nombre: string, email: string, password: string, rol: string }) {
  const sql = "INSERT INTO trabajadores (nombre, email, password, rol) VALUES (?, ?, ?, ?)";
  const [result] = await pool.query(sql, [trabajadorData.nombre, trabajadorData.email, trabajadorData.password, trabajadorData.rol]);
  return result;
}

export async function updateTrabajador(pool: Pool, id: number, trabajadorData: { nombre: string, email: string, password: string, rol: string }) {
  const sql = "UPDATE trabajadores SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?";
  await pool.query(sql, [trabajadorData.nombre, trabajadorData.email, trabajadorData.password, trabajadorData.rol, id]);
}

export async function deleteTrabajador(pool: Pool, id: number) {
  const sql = "DELETE FROM trabajadores WHERE id = ?";
  await pool.query(sql, [id]);
}
