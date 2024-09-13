import { Request, Response } from "express";
import { getAllHistorial, getHistorialByUser, addAnimeToHistorial, deleteHistorial } from "../models/historialModel";

export async function getAllHistorialHandler(req: Request, res: Response) {
    try {
        const historial = await getAllHistorial(req.app.get("pool"));
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener todo el historial" });
    }
}

export async function getHistorialHandler(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
        const historial = await getHistorialByUser(req.app.get("pool"), Number(userId));
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el historial" });
    }
}

export async function addAnimeToHistorialHandler(req: Request, res: Response) {
    try {
        const result = await addAnimeToHistorial(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Anime añadido/actualizado en el historial", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al añadir/actualizar el anime en el historial" });
    }
}


export async function deleteHistorialHandler(req: Request, res: Response) {
    const historialId = req.params.historialId;
    try {
        const result = await deleteHistorial(req.app.get("pool"), Number(historialId));
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Historial eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Historial no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el historial" });
    }
}
