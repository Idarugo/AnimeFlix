import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  getUsuariosHandler,
  createUsuarioHandler,
  updateUsuarioHandler,
  deleteUsuarioHandler,
  getPerfilUsuarioHandler,
  getUsuarioWithAvatarHandler
} from "../controllers/usuarioController";

const router = Router();

router.get("/", authenticateToken, getUsuariosHandler);
router.post("/", createUsuarioHandler);
router.put("/:id", authenticateToken, updateUsuarioHandler);
router.delete("/:id", authenticateToken, deleteUsuarioHandler);
router.get("/me", authenticateToken, getPerfilUsuarioHandler);
router.get("/:id/avatar", authenticateToken, getUsuarioWithAvatarHandler);


export default router;
