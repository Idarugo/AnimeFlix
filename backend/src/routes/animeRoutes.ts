import { Router } from "express";
import multer from "multer";
import path from "path";
import { getAnimesHandler, createAnimeHandler, updateAnimeHandler, deleteAnimeHandler} from "../controllers/animeController";

const router = Router();

// Configurar multer para almacenar las imágenes en la carpeta src/uploads/animes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/animes"));  // Ruta relativa desde routes a src/uploads/animes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Rutas
router.get("/", getAnimesHandler);
router.post("/", upload.single('imagen'), createAnimeHandler); // Aquí se carga la imagen
router.put("/:id", upload.single('imagen'), updateAnimeHandler); // Aquí también se permite la carga de imagen al actualizar
router.delete("/:id", deleteAnimeHandler);

export default router;
