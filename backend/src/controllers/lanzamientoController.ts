import { Request, Response } from "express";
import { getAllLanzamientos, getAllLanzamientosAdmin, createLanzamiento, updateLanzamiento, deleteLanzamiento } from "../models/lanzamientoModel";

// Obtener todos los lanzamientos
export async function getLanzamientosHandler(req: Request, res: Response) {
    try {
        const lanzamientos = await getAllLanzamientos(req.app.get("pool"));
        res.json(lanzamientos);
    } catch (error) {
        console.error('Error en getLanzamientosHandler:', error);
        res.status(500).json({ error: "Error al obtener los lanzamientos" });
    }
}

// Obtener lanzamientos con detalles adicionales para la vista de administrador
export async function getLanzamientosHandlerAdmin(req: Request, res: Response) {
    try {
        const lanzamientos = await getAllLanzamientosAdmin(req.app.get("pool"));
        res.json(lanzamientos);
    } catch (error) {
        console.error('Error en getLanzamientosHandlerAdmin:', error);
        res.status(500).json({ error: "Error al obtener los lanzamientos" });
    }
}

// Crear un nuevo lanzamiento
export async function createLanzamientoHandler(req: Request, res: Response) {
    try {
        const episodio_id = parseInt(req.body.episodio_id, 10); // Asegurarte de que sea un número entero
        const result = await createLanzamiento(req.app.get("pool"), { episodio_id, fecha_lanzamiento: req.body.fecha_lanzamiento });
        res.status(201).json({ message: "Lanzamiento creado", id: (result as any).insertId });
    } catch (error) {
        console.error('Error en createLanzamientoHandler:', error);
        res.status(500).json({ error: "Error al crear el lanzamiento" });
    }
}

// Actualizar un lanzamiento existente
export async function updateLanzamientoHandler(req: Request, res: Response) {
    try {
        const episodio_id = parseInt(req.body.episodio_id, 10); // Asegurarte de que sea un número entero
        await updateLanzamiento(req.app.get("pool"), req.params.id, { episodio_id, fecha_lanzamiento: req.body.fecha_lanzamiento });
        res.json({ message: "Lanzamiento actualizado" });
    } catch (error) {
        console.error('Error en updateLanzamientoHandler:', error);
        res.status(500).json({ error: "Error al actualizar el lanzamiento" });
    }
}


// Eliminar un lanzamiento
export async function deleteLanzamientoHandler(req: Request, res: Response) {
    try {
      await deleteLanzamiento(req.app.get("pool"), req.params.id);
      res.json({ message: "Lanzamiento eliminado" });
    } catch (error) {
      console.error('Error en deleteLanzamientoHandler:', error);
      res.status(500).json({ error: "Error al eliminar el lanzamiento" });
    }
  }
