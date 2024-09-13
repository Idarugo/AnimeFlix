import { Request, Response } from "express";
import { getAllClasificacionEdad, createClasificacionEdad } from "../models/clasificacionEdadModel";

export async function getClasificacionEdadHandler(req: Request, res: Response) {
    try {
        const clasificacionEdad = await getAllClasificacionEdad(req.app.get("pool"));
        res.json(clasificacionEdad);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las Clasificacion Edad" });
    }
}

export async function createClasificacionEdadHandler(req: Request, res: Response) {
    try {
        const result = await createClasificacionEdad(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Clasificacion Edad creada", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la clasificacion edad" });
    }
}
