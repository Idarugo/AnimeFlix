import { Router } from "express";
import { getClasificacionEdadHandler, createClasificacionEdadHandler } from "../controllers/clasificacionEdadController";

const router = Router();

router.get("/", getClasificacionEdadHandler);
router.post("/", createClasificacionEdadHandler);

export default router;
