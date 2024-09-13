// src/routes/animeRoutes.ts
import { Router } from "express";
import { getAnimeByCategoriaHandler, addCategoriaToAnimeHandler, removeCategoriaFromAnimeHandler } from "../controllers/animeCategoriasController";

const router = Router();

router.get("/by-categoria/:categoriaId", getAnimeByCategoriaHandler);
router.post("/add-categoria", addCategoriaToAnimeHandler);
router.delete("/remove-categoria", removeCategoriaFromAnimeHandler);

export default router;
