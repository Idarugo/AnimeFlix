import { Router } from "express";
import { getContactosHandler, createContactoHandler, deleteContactoHandler } from "../controllers/contactoController";

const router = Router();

router.get("/", getContactosHandler);
router.post("/", createContactoHandler);
router.delete("/:id", deleteContactoHandler);

export default router;
