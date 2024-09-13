import { Request, Response } from "express";
import { getAllMetodosPago } from "../models/metodosPagoModel";

// Controlador para obtener todos los métodos de pago
export async function getMetodosPagoHandler(req: Request, res: Response) {
    try {
        const metodosPago = await getAllMetodosPago(req.app.get("pool"));
        res.json(metodosPago);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los métodos de pago" });
    }
}
