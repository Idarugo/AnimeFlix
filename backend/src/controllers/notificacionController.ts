import { Request, Response } from "express";
import { getAllNotificaciones, getNotificacionesByUser, createNotificacion, markNotificacionAsRead, deleteNotificacion } from "../models/notificacionModel";

export async function getAllNotificacionesHandler(req: Request, res: Response) {
    try {
        const notificaciones = await getAllNotificaciones(req.app.get("pool"));
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

// Obtener todas las notificaciones de un usuario
export async function getNotificacionesHandler(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
        const notificaciones = await getNotificacionesByUser(req.app.get("pool"), Number(userId));
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
}

// Crear una nueva notificación
export async function createNotificacionHandler(req: Request, res: Response) {
    try {
        const result = await createNotificacion(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Notificación creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la notificación" });
    }
}

// Marcar notificación como leída
export async function markAsReadHandler(req: Request, res: Response) {
    try {
        await markNotificacionAsRead(req.app.get("pool"), Number(req.params.id));
        res.json({ message: "Notificación marcada como leída" });
    } catch (error) {
        res.status(500).json({ error: "Error al marcar la notificación como leída" });
    }
}

// Eliminar notificación
export async function deleteNotificacionHandler(req: Request, res: Response) {
    try {
        await deleteNotificacion(req.app.get("pool"), Number(req.params.id));
        res.json({ message: "Notificación eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la notificación" });
    }
}
