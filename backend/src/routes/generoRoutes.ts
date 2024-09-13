import { Router } from "express";
import { getGenerosHandler, createGeneroHandler } from "../controllers/generoController";

const router = Router();

router.get("/", getGenerosHandler);
router.post("/", createGeneroHandler);

export default router;
