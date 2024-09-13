import { Router } from "express";
import { getMetodosPagoHandler } from "../controllers/metodosPagoController";

const router = Router();

// Ruta para obtener todos los métodos de pago
router.get("/", getMetodosPagoHandler);

export default router;
