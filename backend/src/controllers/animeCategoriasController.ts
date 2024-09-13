// src/controllers/animeCategoriasController.ts
import { Request, Response } from "express";
import { getAnimesByCategoria, addCategoriaToAnime, removeCategoriaFromAnime } from "../models/animeCategoriasModel";

// Obtener animes por categoría
export async function getAnimeByCategoriaHandler(req: Request, res: Response) {
    try {
        const { categoriaId } = req.params;
        const animes = await getAnimesByCategoria(req.app.get("pool"), parseInt(categoriaId));
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los animes por categoría" });
    }
}

// Agregar una categoría a un anime
export async function addCategoriaToAnimeHandler(req: Request, res: Response) {
    try {
        const { animeId, categoriaId } = req.body;
        await addCategoriaToAnime(req.app.get("pool"), animeId, categoriaId);
        res.status(201).json({ message: "Categoría agregada al anime" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar la categoría al anime" });
    }
}

// Eliminar una categoría de un anime
export async function removeCategoriaFromAnimeHandler(req: Request, res: Response) {
    try {
        const { animeId, categoriaId } = req.body;
        await removeCategoriaFromAnime(req.app.get("pool"), animeId, categoriaId);
        res.json({ message: "Categoría eliminada del anime" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la categoría del anime" });
    }
}
