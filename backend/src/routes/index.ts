import express from "express";

import animeCategoriasRoutes from './animeCategoriasRoutes';
import animeGenerosRoutes from './animeGenerosRoutes';
import animeRoutes from './animeRoutes';
import authRoutes from './authRoutes';
import avatarRoutes from './avatarRoutes';
import generoRoutes from './generoRoutes';
import categoriaRoutes from './categoriaRoutes';
import categoriaAvatarRoutes from './categoriaAvatarRoutes';
import clasificacionEdadRoutes from './clasificacionEdadRoutes';
import membershipPlanRoutes from './membershipPlanRoutes';
import metodosPagoRoutes from './metodosPagoRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import contactoRoutes from './contactoRoutes';
import serieRoutes from './serieRoutes';
import temporadaRoutes from './temporadaRoutes';
import episodioRoutes from './episodioRoutes';
import resenaRoutes from './resenaRoutes';
import lanzamientoRoutes from './lanzamientoRoutes';
import listaRoutes from './listaRoutes';
import historialRoutes from './historialRoutes';
import notificacionRoutes from './notificacionRoutes';
import usuarioRoutes from './usuarioRoutes';
import trabajadorRoutes from './trabajadorRoutes';

const router = express.Router(); // Única declaración de `router`

// Ruta base /api
router.get("/", (req, res) => {
    res.send("¡Bienvenido a la API de mi aplicación!");
});

// Usar rutas específicas
router.use('/animeCategorias', animeCategoriasRoutes);
router.use('/animeGeneros', animeGenerosRoutes);
router.use('/animes', animeRoutes);
router.use('/auth', authRoutes);
router.use('/avatars', avatarRoutes);
router.use('/generos', generoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/categories-avatar', categoriaAvatarRoutes);
router.use('/clasificacion_edad', clasificacionEdadRoutes);
router.use('/contactos', contactoRoutes);
router.use('/series', serieRoutes);
router.use('/temporadas', temporadaRoutes);
router.use('/episodios', episodioRoutes);
router.use('/resenas', resenaRoutes);
router.use('/lanzamientos', lanzamientoRoutes);
router.use('/listas', listaRoutes);
router.use('/membership-plans', membershipPlanRoutes);
router.use('/metodosPago', metodosPagoRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/historiales', historialRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/trabajadores', trabajadorRoutes);

export default router;
