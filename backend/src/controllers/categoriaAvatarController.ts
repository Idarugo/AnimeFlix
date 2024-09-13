import { Request, Response } from "express";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../models/categoriaAvatarModel";

// Controlador para obtener todas las categorías de avatares
export async function getCategoriasHandler(req: Request, res: Response) {
    try {
        const categorias = await getCategorias(req.app.get("pool"));
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías de avatares" });
    }
}

// Controlador para crear una nueva categoría de avatar
export async function createCategoriaHandler(req: Request, res: Response) {
    const { nombre } = req.body;

    try {
        const result = await createCategoria(req.app.get("pool"), nombre);

        if (result.affectedRows > 0) {
            res.status(201).json({ message: "Categoría creada correctamente" });
        } else {
            res.status(400).json({ message: "No se pudo crear la categoría" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría de avatar" });
    }
}

// Controlador para actualizar una categoría de avatar existente
export async function updateCategoriaHandler(req: Request, res: Response) {
    const categoriaId = Number(req.params.categoriaId);
    const { nombre } = req.body;

    try {
        const result = await updateCategoria(req.app.get("pool"), categoriaId, nombre);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Categoría actualizada correctamente" });
        } else {
            res.status(404).json({ message: "Categoría no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la categoría de avatar" });
    }
}

// Controlador para eliminar una categoría de avatar
export async function deleteCategoriaHandler(req: Request, res: Response) {
    const categoriaId = Number(req.params.categoriaId);

    try {
        const result = await deleteCategoria(req.app.get("pool"), categoriaId);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Categoría eliminada correctamente" });
        } else {
            res.status(404).json({ message: "Categoría no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la categoría de avatar" });
    }
}
