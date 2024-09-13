import { Router } from "express";
import { getEpisodiosHandler, getEpisodiosHandlerAdmin, createEpisodioHandler, updateEpisodioHandler, deleteEpisodioHandler, getEpisodiosByTemporadaIdHandler, getEpisodiosByAnimeIdHandler } from "../controllers/episodioController";

const router = Router();

router.get("/", getEpisodiosHandler);
router.get("/admin/", getEpisodiosHandlerAdmin);
router.get("/temporada/:temporadaId", getEpisodiosByTemporadaIdHandler);
router.get("/anime/:animeId", getEpisodiosByAnimeIdHandler); // Asegúrate de que esta función existe en el controlador
router.post("/", createEpisodioHandler);
router.put("/:id", updateEpisodioHandler);
router.delete("/:id", deleteEpisodioHandler);

export default router;
