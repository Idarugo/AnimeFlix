import { Pool, RowDataPacket } from "mysql2/promise";

interface MetodoPago extends RowDataPacket {
    id: number;
    nombre: string;
}

// Función para obtener todos los métodos de pago
export async function getAllMetodosPago(pool: Pool): Promise<MetodoPago[]> {
    const [rows] = await pool.query<MetodoPago[]>("SELECT * FROM metodos_pago");
    return rows;
}
