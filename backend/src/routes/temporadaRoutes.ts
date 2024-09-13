import { Router } from "express";
import {getTemporadasHandler, getTemporadasBySerieId, getTemporadasHandlerAdmin, createTemporadaHandler, updateTemporadaHandler, deleteTemporadaHandler } from "../controllers/temporadaController";

const router = Router();

router.get("/", getTemporadasHandler);
router.get("/admin/", getTemporadasHandlerAdmin);

// Nueva ruta para obtener temporadas por serie_id
router.get("/series/:serieId/seasons", getTemporadasBySerieId);

router.post("/", createTemporadaHandler);
router.put("/:id", updateTemporadaHandler); 
router.delete("/:id", deleteTemporadaHandler);

export default router;
