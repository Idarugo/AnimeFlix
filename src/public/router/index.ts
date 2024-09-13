import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MiListaView from '../views/MiListaView.vue';
import VideoPlayerView from '../views/VideoPlayerView.vue';
import SeriesView from '../views/SeriesView.vue';
import PeliculasView from '../views/PeliculasView.vue';
import NovedadesView from '../views/NovedadesView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import LaunchCalendar from '../views/LaunchCalendar.vue';
import SeasonView from '../views/SeasonView.vue';
import SearchResultsView from '../views/SearchResultsView.vue';
import SobreNosotrosView from "../views/SobreNosotrosView.vue";
import ContactoView from "../views/ContactoView.vue";
import PoliticaPrivacidadView from "../views/PoliticaPrivacidadView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";
import ProfileView from '../views/ProfileView.vue';
import Membresia from '../views/profile/Membresia.vue';
import HistorialView from '../views/profile/HistorialView.vue';
import PreferenciaView from '../views/profile/PreferenciaView.vue';
import PerfilView from '../views/profile/PerfileView.vue';
import MiListaUsuarioView from '../views/profile/MiListaView.vue';
import SeguridadView from '../views/profile/SeguridadView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/mi-lista', name: 'mi-lista', component: MiListaView },
  { path: '/watch', name: 'VideoPlayer', component: VideoPlayerView },
  { path: '/series', name: 'series', component: SeriesView },
  { path: '/peliculas', name: 'peliculas', component: PeliculasView },
  { path: '/novedades', name: 'novedades', component: NovedadesView },
  { path: '/account', name: 'account', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/calendario', name: 'calendario', component: LaunchCalendar },
  { path: '/lanzamientos', name: 'lanzamientos', component: LaunchCalendar },
  { path: '/anime/:animeId/season/:seasonId', name: 'season-view', component: SeasonView },
  { path: '/resultados', name: 'ResultadosBusqueda', component: SearchResultsView },
  { path: '/:catchAll(.*)', component: NotFoundView },
  { path: "/sobre-nosotros", name: "sobre-nosotros", component: SobreNosotrosView },
  { path: "/contacto", name: "contacto", component: ContactoView },
  { path: "/politica-privacidad", name: "politica-privacidad", component: PoliticaPrivacidadView },
  { path: '/perfil', name: 'PerfilView', component: PerfilView },
  { path: '/membresia', name: 'Membresia', component: Membresia },
  { path: '/milista', name: 'MiListaView', component: MiListaView },
  { path: '/historial', name: 'HistorialView', component: HistorialView },
  { path: '/lista', name: 'MiListaUsuarioView', component: MiListaUsuarioView },
  { path: '/preferencias', name: 'PreferenciaView', component: PreferenciaView },
  { path: '/seguridad', name: 'SeguridadView', component: SeguridadView },
  { path: '/forgot-password', name: 'ForgotPassword', component: () => import('../views/ForgotPasswordView.vue') },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  { path: '/cambiar-plan', name: 'ChangePlan', component: () => import('../components/profile/ChangePlanModal.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
