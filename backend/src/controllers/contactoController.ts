import { Request, Response } from "express";
import { getAllContactos, createContacto, deleteContacto } from "../models/contactoModel";

export async function getContactosHandler(req: Request, res: Response) {
    try {
        const contactos = await getAllContactos(req.app.get("pool"));
        res.json(contactos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los mensajes de contacto" });
    }
}

export async function createContactoHandler(req: Request, res: Response) {
    try {
        const result = await createContacto(req.app.get("pool"), req.body);
        res.status(201).json({ message: "Mensaje de contacto enviado", id: (result as any).insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al enviar el mensaje de contacto" });
    }
}
export async function deleteContactoHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteContacto(req.app.get("pool"), id);
        res.json({ message: "Mensaje de contacto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el mensaje de contacto" });
    }
}
