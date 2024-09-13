import { Router } from "express";
import { getResenasHandler, createResenaHandler, deleteResenaHandler } from "../controllers/resenaController";

const router = Router();

// Ruta para obtener las reseñas filtradas por animeId
router.get("/", getResenasHandler);

// Ruta para crear una nueva reseña
router.post("/", createResenaHandler);

// Ruta para eliminar una reseña por su ID
router.delete("/:id", deleteResenaHandler);

export default router;
