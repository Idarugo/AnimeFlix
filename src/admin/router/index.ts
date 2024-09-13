import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import Dashboard from '../views/Dashboard.vue';
import AnimeManagement from '../views/AnimeManagement.vue';
import CategoryManagement from '../views/CategoryManagement.vue';
import LaunchManagement from '../views/LaunchManagement.vue';
import SeriesManagement from '../views/SeriesManagement.vue';
import EpisodeManagement from '../views/EpisodeManagement.vue';
import SeasonManagement from '../views/SeasonManagement.vue';
import TrabajadoresManagement from '../views/TrabajadoresManagement.vue';
import UsuariosManagement from '../views/UserManagement.vue';
import ResenasManagement from '../views/ResenaManagement.vue';
import GenerosManagement from '../views/GenerosManagement.vue';
import ClasificacionManagement from '../views/ClasificacionEdadManagement.vue'; 
import NotificacionesManagement from '../views/NotificacionesManagement.vue'; 
import HistorialManagement from '../views/HistorialManagement.vue'; 
import AdminLogin from '../views/Login.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },
      { path: 'animes', name: 'AnimeManagement', component: AnimeManagement },
      { path: 'categories', name: 'CategoryManagement', component: CategoryManagement },
      { path: 'launches', name: 'LaunchManagement', component: LaunchManagement },
      { path: 'series', name: 'SeriesManagement', component: SeriesManagement },
      { path: 'episodes', name: 'EpisodeManagement', component: EpisodeManagement },
      { path: 'seasons', name: 'SeasonManagement', component: SeasonManagement },
      { path: 'trabajadores', name: 'TrabajadoresManagement', component: TrabajadoresManagement },
      { path: 'usuarios', name: 'UsuariosManagement', component: UsuariosManagement },
      { path: 'resenas', name: 'ResenasManagement', component: ResenasManagement },
      { path: 'generos', name: 'GenerosManagement', component: GenerosManagement },
      { path: 'clasificacion', name: 'ClasificacionManagement', component: ClasificacionManagement },
      { path: 'notificaciones', name: 'NotificacionesManagement', component: NotificacionesManagement },
      { path: 'historial', name: 'HistorialManagement', component: HistorialManagement },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'admin-login',
    component: AdminLogin,
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
});

export default router;
