import { Pool, ResultSetHeader } from "mysql2/promise";

// Función para obtener todos los planes de membresía
export async function getAllMembershipPlans(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM planes_membresia");
    return rows;
}

// Función para crear un nuevo plan de membresía
export async function createMembershipPlan(pool: Pool, planData: { nombre: string, descripcion: string, precio: number, duracion_en_meses: number }) {
    const sql = "INSERT INTO planes_membresia (nombre, descripcion, precio, duracion_en_meses) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query<ResultSetHeader>(sql, [planData.nombre, planData.descripcion, planData.precio, planData.duracion_en_meses]);
    return result;
}
