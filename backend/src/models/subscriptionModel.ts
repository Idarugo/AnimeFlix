import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Define la interfaz para una suscripción
interface Subscription extends RowDataPacket {
  id: number;
  user_id: number;
  plan_id: number;
  fecha_inicio: string;
  fecha_proximo_pago: string;
  metodo_pago: string; 
  tarjeta_ultimos4: string;
}

// Función para obtener la suscripción de un usuario
export async function getUserSubscription(pool: Pool, userId: number): Promise<Subscription | null> {
  console.log('Ejecutando consulta SQL para suscripción del usuario:', userId);
  const sql = `
    SELECT s.*, mp.nombre as metodo_pago
    FROM suscripciones s
    JOIN metodos_pago mp ON s.metodo_pago_id = mp.id
    WHERE s.user_id = ?
  `;
  const [rows] = await pool.query<Subscription[]>(sql, [userId]);
  console.log('Resultado de la consulta SQL:', rows);
  return rows.length > 0 ? rows[0] : null; 
}


// Función para actualizar una suscripción existente
export async function updateUserSubscription(
  pool: Pool,
  userId: number,
  subscriptionData: {
    plan_id: number;
    fecha_proximo_pago: string;  // Esta fecha ya vendrá en formato 'YYYY-MM-DD'
    metodo_pago_id: number;
    tarjeta_ultimos4: string;
  }
) {
  const sql = `
    UPDATE suscripciones
    SET plan_id = ?, fecha_proximo_pago = ?, metodo_pago_id = ?, tarjeta_ultimos4 = ?
    WHERE user_id = ?
  `;
  const [result] = await pool.query<ResultSetHeader>(sql, [
    subscriptionData.plan_id,
    subscriptionData.fecha_proximo_pago,
    subscriptionData.metodo_pago_id,
    subscriptionData.tarjeta_ultimos4,
    userId
  ]);
  return result;
}

// Función para crear una nueva suscripción
export async function createUserSubscription(
  pool: Pool,
  subscriptionData: {
    user_id: number;
    plan_id: number;
    fecha_inicio: string;  // Esta fecha ya vendrá en formato 'YYYY-MM-DD'
    fecha_proximo_pago: string;  // Esta fecha ya vendrá en formato 'YYYY-MM-DD'
    metodo_pago_id: number;
    tarjeta_ultimos4: string;
  }
) {
  const sql = `
    INSERT INTO suscripciones (user_id, plan_id, fecha_inicio, fecha_proximo_pago, metodo_pago_id, tarjeta_ultimos4)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query<ResultSetHeader>(sql, [
    subscriptionData.user_id,
    subscriptionData.plan_id,
    subscriptionData.fecha_inicio,
    subscriptionData.fecha_proximo_pago,
    subscriptionData.metodo_pago_id,
    subscriptionData.tarjeta_ultimos4
  ]);
  return result;
}

export async function updateCardDetailsInDB(
  pool: Pool,
  userId: number,
  cardData: {
    cardNumber: string;
    expiryDate: string;
    planId: number;
    metodoPagoId: number;
  }
) {
  const sql = `
    UPDATE suscripciones
    SET tarjeta_ultimos4 = ?, fecha_expiracion = ?, plan_id = ?, metodo_pago_id = ?
    WHERE user_id = ?
  `;
  const [result] = await pool.query<ResultSetHeader>(sql, [
    cardData.cardNumber.slice(-4), // Solo guardar los últimos 4 dígitos
    cardData.expiryDate,
    cardData.planId,
    cardData.metodoPagoId,
    userId,
  ]);
  return result;
}


