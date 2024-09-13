import { Router } from "express";
import { 
    getSeriesHandler,
    getSeriesHandlerAdmin,
    createSerieHandler,
    updateSerieHandler,  
    deleteSerieHandler 
} from "../controllers/serieController";
import { getTemporadasBySerieId } from "../controllers/temporadaController"; // Importa el controlador de temporadas

const router = Router();

router.get("/", getSeriesHandler);
router.get("/admin/", getSeriesHandlerAdmin);

// Nueva ruta para obtener temporadas por serie_id
router.get("/:serieId/seasons", getTemporadasBySerieId);

router.post("/", createSerieHandler);
router.put("/:id", updateSerieHandler);  
router.delete("/:id", deleteSerieHandler); 

export default router;
