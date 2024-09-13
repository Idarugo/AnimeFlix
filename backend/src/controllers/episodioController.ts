import { Request, Response } from "express";
import { getAllEpisodios, getAllEpisodiosAdmin, createEpisodio, updateEpisodio, deleteEpisodio, getEpisodiosByTemporadaId, getEpisodiosByAnimeId } from "../models/episodioModel";

export async function getEpisodiosHandler(req: Request, res: Response) {
    try {
        const episodios = await getAllEpisodios(req.app.get("pool"));
        res.json(episodios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los episodios" });
    }
}

export async function getEpisodiosByTemporadaIdHandler(req: Request, res: Response) {
    try {
        const temporadaId = parseInt(req.params.temporadaId, 10);
        const episodios = await getEpisodiosByTemporadaId(req.app.get("pool"), temporadaId);
        res.json(episodios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los episodios por temporada" });
    }
}

export async function getEpisodiosHandlerAdmin(req: Request, res: Response) {
    try {
        const episodios = await getAllEpisodiosAdmin(req.app.get("pool"));
        res.json(episodios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los episodios" });
    }
}

export async function createEpisodioHandler(req: Request, res: Response) {
    try {
        const { temporada_id, numero_episodio, titulo, descripcion, video_url } = req.body;

        const result = await createEpisodio(req.app.get("pool"), {
            temporada_id,
            numero_episodio,
            titulo,
            descripcion,
            video_url,
            duracion: "00:00:00" // Ajusta la duración según sea necesario
        });
        res.status(201).json({ message: "Episodio creado", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el episodio" });
    }
}

export async function updateEpisodioHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        console.log("ID del episodio a actualizar:", id);
        console.log("Datos recibidos para actualizar:", req.body);

        const { temporada_id, numero_episodio, titulo, descripcion, video_url } = req.body;

        await updateEpisodio(req.app.get("pool"), id, {
            temporada_id,
            numero_episodio,
            titulo,
            descripcion,
            video_url,
            duracion: "00:00:00" // Ajusta la duración según sea necesario
        });

        res.status(200).json({ message: "Episodio actualizado" });
    } catch (error) {
        console.error("Error al actualizar el episodio:", error);
        res.status(500).json({ error: "Error al actualizar el episodio" });
    }
}


export async function deleteEpisodioHandler(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        await deleteEpisodio(req.app.get("pool"), id);
        res.status(200).json({ message: "Episodio eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el episodio" });
    }
}

export async function getEpisodiosByAnimeIdHandler(req: Request, res: Response) {
    try {
        const animeId = parseInt(req.params.animeId, 10);
        const episodios = await getEpisodiosByAnimeId(req.app.get("pool"), animeId);
        res.json(episodios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los episodios por anime" });
    }
}
