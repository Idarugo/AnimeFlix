import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './public/App.vue';
import router from './public/router/index';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';  // Importa la colección de marcas (brands)
import { useAnimeStore } from './public/store/animeStore';  // Importa la tienda

import axios from "axios";

// Cambiar la URL a HTTPS
axios.defaults.baseURL = "https://localhost:3000"; // Asegúrate de que tu servidor esté configurado para HTTPS

// Agrega todos los iconos sólidos y de marcas de FontAwesome a la biblioteca
library.add(fas, fab);

const app = createApp(App);

// Registra el componente FontAwesomeIcon globalmente
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount('#app');

// Después de montar la aplicación, aplica el tema guardado en `localStorage`
const animeStore = useAnimeStore();
document.documentElement.setAttribute('data-theme', animeStore.theme);
