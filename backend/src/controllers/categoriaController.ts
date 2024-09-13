import { Request, Response } from "express";
import { getAllCategorias, createCategoria, updateCategoria, deleteCategoria,getAnimesByCategorias } from "../models/categoriaModel";

export async function getCategoriasHandler(req: Request, res: Response) {
    try {
        const categorias = await getAllCategorias(req.app.get("pool"));
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
}

export async function createCategoriaHandler(req: Request, res: Response) {
    try {
        const result = await createCategoria(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Categoría creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría" });
    }
}

export async function updateCategoriaHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await updateCategoria(req.app.get("pool"), id, req.body);
        res.json({ message: "Categoría actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la categoría" });
    }
}

export async function deleteCategoriaHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteCategoria(req.app.get("pool"), id);
        res.json({ message: "Categoría eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la categoría" });
    }
}


export async function getAnimesByCategoriasHandler(req: Request, res: Response) {
    try {
        const { categorias } = req.query; // Expecting categorias as a comma-separated string like "Películas,Terror"
        const categoriasArray = categorias ? (categorias as string).split(",") : [];
        const animes = await getAnimesByCategorias(req.app.get("pool"), categoriasArray);
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los animes por categorías" });
    }
}