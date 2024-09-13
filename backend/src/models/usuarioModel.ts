import bcrypt from "bcrypt";
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Función para verificar la contraseña al iniciar sesión
export async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, storedPassword);
}

export async function getUsuarioByEmail(pool: Pool, email: string) {
  const [rows] = await pool.query<RowDataPacket[]>( // Especifica que esperas un array de RowDataPacket
      "SELECT * FROM usuarios WHERE email = ?", 
      [email]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function storePasswordResetToken(pool: Pool, userId: number, token: string) {
  const sql = "UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE id = ?";
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora desde ahora
  await pool.query(sql, [token, expires, userId]);
}

// Función para obtener un usuario por el token de recuperación
export async function getUserByResetToken(pool: Pool, token: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token]
  );
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

// Obtener todos los usuarios
export async function getAllUsuarios(pool: Pool) {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
}

// Crear un nuevo usuario con la contraseña encriptada
export async function createUsuario(pool: Pool, usuarioData: { nombre: string, email: string, password: string, avatar_id?: number, preferencias?: string }) {
  const hashedPassword = await bcrypt.hash(usuarioData.password, 10); // Encriptar la contraseña
  const sql = "INSERT INTO usuarios (nombre, email, password, avatar_id, preferencias) VALUES (?, ?, ?, ?, ?)";
  const [result] = await pool.query(sql, [usuarioData.nombre, usuarioData.email, hashedPassword, usuarioData.avatar_id, usuarioData.preferencias || null]);
  return result;
}

export async function updateUsuario(pool: any, id: number, data: any) {
  let query = "UPDATE usuarios SET ";
  const fields = [];

  if (data.nombre) {
    fields.push("nombre = ?");
  }
  if (data.email) {
    fields.push("email = ?");
  }
  if (data.avatar_id) {
    fields.push("avatar_id = ?"); // Cambia `avatar_url` por `avatar_id`
  }
  if (data.password) {
    fields.push("password = ?");
  }

  query += fields.join(", ");
  query += " WHERE id = ?";

  const parameters = [...Object.values(data), id];
  console.log("Consulta SQL:", query, "Parámetros:", parameters);

  const [result] = await pool.query(query, parameters);
  return result;
}

// Eliminar un usuario
export async function deleteUsuario(pool: Pool, id: number) {
  const sql = "DELETE FROM usuarios WHERE id = ?";
  await pool.query(sql, [id]);
}

export async function getUsuarioWithAvatarById(pool: Pool, userId: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT usuarios.id, usuarios.nombre, usuarios.email, usuarios.preferencias, avatares.url as avatar_url
     FROM usuarios 
     LEFT JOIN avatares ON usuarios.avatar_id = avatares.id
     WHERE usuarios.id = ?`,
    [userId]
  );

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}