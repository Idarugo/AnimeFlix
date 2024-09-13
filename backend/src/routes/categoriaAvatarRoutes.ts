import { Router } from "express";
import { getCategoriasHandler, createCategoriaHandler, updateCategoriaHandler, deleteCategoriaHandler } from "../controllers/categoriaAvatarController";

const router = Router();

// Ruta para obtener todas las categorías de avatares
router.get("/", getCategoriasHandler);

// Ruta para crear una nueva categoría de avatar
router.post("/", createCategoriaHandler);

// Ruta para actualizar una categoría de avatar existente
router.put("/:categoriaId", updateCategoriaHandler);

// Ruta para eliminar una categoría de avatar
router.delete("/:categoriaId", deleteCategoriaHandler);

export default router;
