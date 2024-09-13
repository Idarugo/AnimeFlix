import { Request, Response } from "express";
import { getResenasByAnimeId, createResena, deleteResena } from "../models/resenaModel";

// Controlador para obtener las reseñas de un anime específico
export async function getResenasHandler(req: Request, res: Response) {
    const animeId = Number(req.query.animeId);
    if (!animeId) {
        return res.status(400).json({ error: "animeId es requerido" });
    }

    try {
        const resenas = await getResenasByAnimeId(req.app.get("pool"), animeId);
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las reseñas" });
    }
}

// Controlador para crear una nueva reseña
export async function createResenaHandler(req: Request, res: Response) {
    try {
        const result = await createResena(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Reseña creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la reseña" });
    }
}

// Controlador para eliminar una reseña por su ID
export async function deleteResenaHandler(req: Request, res: Response) {
    const resenaId = req.params.id;
    try {
        await deleteResena(req.app.get("pool"), Number(resenaId));
        res.status(200).json({ message: "Reseña eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la reseña" });
    }
}
