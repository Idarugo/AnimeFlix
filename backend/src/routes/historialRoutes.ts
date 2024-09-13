import { Router } from "express";
import { getHistorialHandler, addAnimeToHistorialHandler, getAllHistorialHandler, deleteHistorialHandler } from "../controllers/historialController";

const router = Router();

router.get("/", getAllHistorialHandler); // Nueva ruta para obtener todo el historial
router.get("/:userId", getHistorialHandler);
router.post("/", addAnimeToHistorialHandler);
router.delete("/:historialId", deleteHistorialHandler); // Ruta para eliminar historial


export default router;


