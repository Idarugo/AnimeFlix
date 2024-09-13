import { Router } from "express";
import { getCategoriasHandler, createCategoriaHandler, updateCategoriaHandler, deleteCategoriaHandler, getAnimesByCategoriasHandler } from "../controllers/categoriaController";

const router = Router();

router.get("/", getCategoriasHandler);
router.post("/", createCategoriaHandler);
router.put("/:id", updateCategoriaHandler);
router.delete("/:id", deleteCategoriaHandler);

// Nueva ruta para obtener animes filtrados por categorías
router.get("/animes", getAnimesByCategoriasHandler);

export default router;
