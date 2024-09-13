import { Pool, ResultSetHeader } from "mysql2/promise";

// Función para obtener todas las categorías de avatares
export async function getCategorias(pool: Pool) {
    const [rows] = await pool.query("SELECT * FROM avatar_categorias");
    return rows;
}

// Función para crear una nueva categoría de avatar
export async function createCategoria(pool: Pool, nombre: string) {
    const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO avatar_categorias (nombre) VALUES (?)",
        [nombre]
    );
    return result;
}

// Función para actualizar una categoría de avatar existente
export async function updateCategoria(pool: Pool, categoriaId: number, nombre: string) {
    const [result] = await pool.query<ResultSetHeader>(
        "UPDATE avatar_categorias SET nombre = ? WHERE id = ?",
        [nombre, categoriaId]
    );
    return result;
}

// Función para eliminar una categoría de avatar
export async function deleteCategoria(pool: Pool, categoriaId: number) {
    const [result] = await pool.query<ResultSetHeader>(
        "DELETE FROM avatar_categorias WHERE id = ?",
        [categoriaId]
    );
    return result;
}

