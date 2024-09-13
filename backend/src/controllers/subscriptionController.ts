import { Request, Response } from "express";
import { getUserSubscription, createUserSubscription, updateUserSubscription, updateCardDetailsInDB } from "../models/subscriptionModel";

// Controlador para obtener la suscripción de un usuario
export async function getUserSubscriptionHandler(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      console.log('ID de usuario inválido:', req.params.userId);
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    console.log('Buscando suscripción para el usuario:', userId);
    const subscription = await getUserSubscription(req.app.get("pool"), userId);
    console.log('Resultado de la búsqueda de suscripción:', subscription);

    if (subscription) {
      console.log('Suscripción encontrada:', subscription);
      return res.json(subscription);
    } else {
      console.log('Usuario sin suscripción');
      return res.status(200).json({ message: "Usuario sin suscripción", subscription: null });
    }        
  } catch (error) {
    console.error("Error al obtener suscripción:", error);
    res.status(500).json({ error: "Error al obtener la suscripción del usuario" });
  }
}

// Función para actualizar una suscripción existente
export async function updateUserSubscriptionHandler(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    let { plan_id, fecha_proximo_pago, metodo_pago_id, tarjeta_ultimos4 } = req.body;

    console.log("Datos recibidos en el backend:", {
      plan_id,
      fecha_proximo_pago,
      metodo_pago_id,
      tarjeta_ultimos4,
    });

    if (isNaN(userId) || !plan_id || !fecha_proximo_pago || !metodo_pago_id || !tarjeta_ultimos4) {
      console.error("Datos incompletos o ID de usuario inválido");
      return res.status(400).json({ error: "Datos incompletos o ID de usuario inválido" });
    }

    // Formatear fecha_proximo_pago a 'YYYY-MM-DD'
    fecha_proximo_pago = fecha_proximo_pago.split('T')[0]; // Eliminar la parte de la hora

    const result = await updateUserSubscription(req.app.get("pool"), userId, {
      plan_id,
      fecha_proximo_pago,
      metodo_pago_id,
      tarjeta_ultimos4,
    });

    if (result.affectedRows === 0) {
      console.error("No se encontró una suscripción para actualizar");
      return res.status(404).json({ error: "No se encontró una suscripción para actualizar" });
    }

    console.log("Suscripción actualizada correctamente");
    res.status(200).json({ message: "Suscripción actualizada" });
  } catch (error) {
    console.error("Error al actualizar suscripción:", error);
    res.status(500).json({ error: "Error al actualizar la suscripción" });
  }
}

// Función para crear una nueva suscripción de usuario
export async function createUserSubscriptionHandler(req: Request, res: Response) {
  try {
    let { user_id, plan_id, fecha_inicio, fecha_proximo_pago, metodo_pago_id, tarjeta_ultimos4 } = req.body;

    if (!user_id || !plan_id || !fecha_inicio || !fecha_proximo_pago || !metodo_pago_id || !tarjeta_ultimos4) {
      return res.status(400).json({ error: "Datos de suscripción incompletos" });
    }

    // Formatear fechas para que sean solo 'YYYY-MM-DD'
    fecha_proximo_pago = fecha_proximo_pago.split('T')[0];
    fecha_inicio = fecha_inicio.split('T')[0];

    const result = await createUserSubscription(req.app.get("pool"), {
      user_id,
      plan_id,
      fecha_inicio,
      fecha_proximo_pago,
      metodo_pago_id,
      tarjeta_ultimos4
    });

    res.status(201).json({ message: "Suscripción creada", id: result.insertId });
  } catch (error) {
    console.error("Error al crear suscripción:", error);
    res.status(500).json({ error: "Error al crear la suscripción" });
  }
}

// Controlador para actualizar los detalles de la tarjeta
export async function updateCardDetailsHandler(req: Request, res: Response) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { cardNumber, expiryDate, planId, metodoPagoId } = req.body;

    if (isNaN(userId) || !cardNumber || !expiryDate) {
      return res.status(400).json({ error: "Datos incompletos o ID de usuario inválido" });
    }

    const result = await updateCardDetailsInDB(req.app.get("pool"), userId, {
      cardNumber,
      expiryDate,
      planId,
      metodoPagoId,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No se encontró una suscripción para actualizar" });
    }

    res.status(200).json({ message: "Detalles de la tarjeta actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar los detalles de la tarjeta:", error);
    res.status(500).json({ error: "Error al actualizar los detalles de la tarjeta" });
  }
}



