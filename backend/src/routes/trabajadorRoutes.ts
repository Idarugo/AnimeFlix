import { Router } from "express";
import { getTrabajadoresHandler, createTrabajadorHandler, updateTrabajadorHandler, deleteTrabajadorHandler } from "../controllers/trabajadorController";

const router = Router();

router.get("/", getTrabajadoresHandler);
router.post("/", createTrabajadorHandler);
router.put("/:id", updateTrabajadorHandler);
router.delete("/:id", deleteTrabajadorHandler);

export default router;
