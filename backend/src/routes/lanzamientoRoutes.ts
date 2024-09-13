import { Router } from "express";
import { getLanzamientosHandler, getLanzamientosHandlerAdmin, createLanzamientoHandler, updateLanzamientoHandler, deleteLanzamientoHandler } from "../controllers/lanzamientoController";

const router = Router();

router.get("/", getLanzamientosHandler);
router.get("/admin", getLanzamientosHandlerAdmin);
router.post("/", createLanzamientoHandler);
router.put("/:id", updateLanzamientoHandler);
router.delete("/:id", deleteLanzamientoHandler);

export default router;