import { Router } from "express";
import {
  getNotificacionesHandler,
  createNotificacionHandler,
  markAsReadHandler,
  deleteNotificacionHandler,
  getAllNotificacionesHandler, // Nueva función
} from "../controllers/notificacionController";

const router = Router();

router.get("/", getAllNotificacionesHandler); // Nueva ruta para obtener todas las notificaciones
router.get("/:userId", getNotificacionesHandler);
router.post("/", createNotificacionHandler);
router.put("/:id/read", markAsReadHandler); // Nueva ruta para marcar como leída
router.delete("/:id", deleteNotificacionHandler); // Nueva ruta para eliminar notificación

export default router;
