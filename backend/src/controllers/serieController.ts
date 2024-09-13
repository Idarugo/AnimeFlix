import { Request, Response } from "express";
import { 
    getAllSeries,
    getAllSeriesAdmin,
    createSerie,
    updateSerie,  // Nueva función para actualizar
    deleteSerie   // Nueva función para eliminar
} from "../models/serieModel";

export async function getSeriesHandler(req: Request, res: Response) {
    try {
        const series = await getAllSeries(req.app.get("pool"));
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las series" });
    }
}

export async function getSeriesHandlerAdmin(req: Request, res: Response) {
    try {
        const series = await getAllSeriesAdmin(req.app.get("pool"));
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las series" });
    }
}

export async function createSerieHandler(req: Request, res: Response) {
    try {
        const result = await createSerie(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Serie creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la serie" });
    }
}

export async function updateSerieHandler(req: Request, res: Response) {
    try {
        await updateSerie(req.app.get("pool"), req.params.id, req.body);
        res.status(200).json({ message: "Serie actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la serie" });
    }
}

export async function deleteSerieHandler(req: Request, res: Response) {
    try {
        await deleteSerie(req.app.get("pool"), req.params.id);
        res.status(200).json({ message: "Serie eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la serie" });
    }
}