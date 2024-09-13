import { Request, Response } from "express";
import { getAnimesByGenero, addGeneroToAnime, removeGeneroFromAnime } from "../models/animeGenerosModel";

// Obtener animes por género
export async function getAnimeByGeneroHandler(req: Request, res: Response) {
    try {
        const { generoId } = req.params;
        const animes = await getAnimesByGenero(req.app.get("pool"), parseInt(generoId));
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los animes por género" });
    }
}

// Agregar un género a un anime
export async function addGeneroToAnimeHandler(req: Request, res: Response) {
    try {
        const { animeId, generoId } = req.body;
        await addGeneroToAnime(req.app.get("pool"), animeId, generoId);
        res.status(201).json({ message: "Género agregado al anime" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el género al anime" });
    }
}

// Eliminar un género de un anime
export async function removeGeneroFromAnimeHandler(req: Request, res: Response) {
    try {
        const { animeId, generoId } = req.body;
        await removeGeneroFromAnime(req.app.get("pool"), animeId, generoId);
        res.json({ message: "Género eliminado del anime" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el género del anime" });
    }
}
