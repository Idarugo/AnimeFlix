import { Router } from "express";
import { addAnimeToListaHandler, getListasHandler, deleteAnimeFromListaHandler } from "../controllers/listaController";

const router = Router();

// Añadir anime a la lista del usuario
router.post("/", addAnimeToListaHandler);

// Obtener lista de animes del usuario
router.get("/:userId", getListasHandler);

// Eliminar anime de la lista del usuario
router.delete("/:userId/:animeId", deleteAnimeFromListaHandler); // Nueva ruta para eliminar un anime de la lista

export default router;
