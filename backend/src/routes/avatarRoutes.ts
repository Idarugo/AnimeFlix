import { Router } from "express";
import { getAvataresHandler, updateAvatarHandler } from "../controllers/avatarController";

const router = Router();

// Ruta para obtener todos los avatares
router.get("/", getAvataresHandler);

// Ruta para actualizar el avatar de un usuario
router.put("/usuarios/:userId", updateAvatarHandler);

export default router;
