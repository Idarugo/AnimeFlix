import { Request, Response } from "express";
import { getListasByUser, addAnimeToLista, deleteAnimeFromLista } from "../models/listaModel";

// Obtener listas
export async function getListasHandler(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
        const listas = await getListasByUser(req.app.get("pool"), Number(userId));
        res.json(listas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las listas" }); 
    }
}

// Añadir anime a la lista
export async function addAnimeToListaHandler(req: Request, res: Response) {
    try {
        const result = await addAnimeToLista(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Anime añadido a la lista", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al añadir el anime a la lista" });
    }
}

// Eliminar anime de la lista
export async function deleteAnimeFromListaHandler(req: Request, res: Response) {
    const userId = req.params.userId;
    const animeId = req.params.animeId;

    try {
        console.log("Query de eliminación:", `DELETE FROM listas WHERE user_id = ${userId} AND anime_id = ${animeId}`);
        
        const result: any = await deleteAnimeFromLista(req.app.get("pool"), Number(userId), Number(animeId));
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Anime eliminado de la lista" });
        } else {
            res.status(404).json({ message: "Anime no encontrado en la lista" });
        }
    } catch (error) {
        console.error('Error al eliminar el anime de la lista:', error);
        res.status(500).json({ error: "Error al eliminar el anime de la lista" });
    }
}
