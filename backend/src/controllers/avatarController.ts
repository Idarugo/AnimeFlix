import { Request, Response } from "express";
import { getAvatares, updateAvatarUrl } from "../models/avatarModel";

// Controlador para obtener todos los avatares
export async function getAvataresHandler(req: Request, res: Response) {
    try {
        const avatares = await getAvatares(req.app.get("pool"));
        res.json(avatares);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los avatares" });
    }
}




// Controlador para actualizar el avatar de un usuario
export async function updateAvatarHandler(req: Request, res: Response) {
    const userId = Number(req.params.userId);
    const { avatar_url } = req.body;

    try {
        const result = await updateAvatarUrl(req.app.get("pool"), userId, avatar_url);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Avatar actualizado correctamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el avatar" });
    }
}
