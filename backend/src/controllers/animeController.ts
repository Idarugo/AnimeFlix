import { Request, Response } from "express";
import { getAllAnimes, createAnime, updateAnime, deleteAnime} from "../models/animeModel";

// Controlador para obtener todos los animes
export async function getAnimesHandler(req: Request, res: Response) {
    try {
        const animes = await getAllAnimes(req.app.get("pool"));
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los animes" });
    }
}
// Controlador para crear un nuevo anime
export async function createAnimeHandler(req: Request, res: Response) {
    try {
        const imagen_url = req.file ? `/uploads/animes/${req.file.filename}` : null; // Guardar la URL de la imagen
        const result = await createAnime(req.app.get("pool"), { ...req.body, imagen_url });
        res.status(201).json({ message: "Anime creado", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el anime" });
    }
}

// Controlador para actualizar un anime existente
export async function updateAnimeHandler(req: Request, res: Response) {
    try {
        const imagen_url = req.file ? `/uploads/animes/${req.file.filename}` : req.body.imagen_url;
        await updateAnime(req.app.get("pool"), req.params.id, { ...req.body, imagen_url });
        res.status(200).json({ message: "Anime actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el anime" });
    }
}

// Controlador para eliminar un anime
export async function deleteAnimeHandler(req: Request, res: Response) {
    try {
        await deleteAnime(req.app.get("pool"), req.params.id);
        res.status(200).json({ message: "Anime eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el anime" });
    }
}
