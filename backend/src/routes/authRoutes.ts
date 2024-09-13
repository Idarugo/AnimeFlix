import { Router } from "express";
import { loginHandler, getPerfilHandler, forgotPasswordHandler, resetPasswordHandler } from "../controllers/authController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = Router();

router.post("/login", loginHandler); // Ruta para iniciar sesión
router.post("/forgot-password", forgotPasswordHandler); // Ruta para recuperación de contraseña
router.post("/reset-password", resetPasswordHandler); // Ruta para restablecimiento de contraseña
router.get("/me", authenticateToken, getPerfilHandler); // Ruta para obtener el perfil del usuario autenticado

export default router;
