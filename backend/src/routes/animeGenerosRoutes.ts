import { Router } from "express";
import { getAnimeByGeneroHandler, addGeneroToAnimeHandler, removeGeneroFromAnimeHandler } from "../controllers/animeGenerosController";

const router = Router();

router.get("/by-genero/:generoId", getAnimeByGeneroHandler);
router.post("/add-genero", addGeneroToAnimeHandler);
router.delete("/remove-genero", removeGeneroFromAnimeHandler);

export default router;
