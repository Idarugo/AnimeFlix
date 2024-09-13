import { Request, Response } from "express";
import { getAllTemporadas,getTemporadasBySerie, getAllTemporadasAdmin, createTemporada, updateTemporada, deleteTemporada } from "../models/temporadaModel";

export async function getTemporadasHandler(req: Request, res: Response) {
    try {
        const temporadas = await getAllTemporadas(req.app.get("pool"));
        res.json(temporadas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las temporadas" });
    }
}

export async function getTemporadasBySerieId(req: Request, res: Response) {
    try {
        const serieId = parseInt(req.params.serieId, 10);
        const temporadas = await getTemporadasBySerie(req.app.get("pool"), serieId);
        res.json(temporadas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las temporadas" });
    }
}


export async function getTemporadasHandlerAdmin(req: Request, res: Response) {
    try {
        const temporadas = await getAllTemporadasAdmin(req.app.get("pool"));
        res.json(temporadas);
    } catch (error) {
        console.error('Error en getTemporadasHandlerAdmin:', error);
        res.status(500).json({ error: "Error al obtener los temporadas" });
    }
}

export async function createTemporadaHandler(req: Request, res: Response) {
    try {
        const result = await createTemporada(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Temporada creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la temporada" });
    }
}

export async function updateTemporadaHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); // Convertir req.params.id a número
        await updateTemporada(req.app.get("pool"), id, req.body);
        res.status(200).json({ message: "Temporada actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la temporada" });
    }
}

export async function deleteTemporadaHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10); // Convertir req.params.id a número
        await deleteTemporada(req.app.get("pool"), id);
        res.status(200).json({ message: "Temporada eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la temporada" });
    }
}