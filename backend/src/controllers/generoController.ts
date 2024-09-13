import { Request, Response } from "express";
import { getAllGeneros, createGenero } from "../models/generoModel";

export async function getGenerosHandler(req: Request, res: Response) {
    try {
        const generos = await getAllGeneros(req.app.get("pool"));
        res.json(generos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los géneros" });
    }
}

export async function createGeneroHandler(req: Request, res: Response) {
    try {
        const result = await createGenero(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Género creado", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear el género" });
    }
}
