import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { 
  getUserSubscriptionHandler, 
  createUserSubscriptionHandler, 
  updateUserSubscriptionHandler,
  updateCardDetailsHandler // Agregar este controlador
} from "../controllers/subscriptionController";

const router = Router();

// Rutas para suscripciones de usuarios
router.get("/:userId",getUserSubscriptionHandler);
router.post("/", createUserSubscriptionHandler);
router.put("/:userId", updateUserSubscriptionHandler);
router.put("/:userId/card", updateCardDetailsHandler);  // Nueva ruta para actualizar los detalles de la tarjeta

export default router;
