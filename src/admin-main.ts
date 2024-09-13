import './admin/variables.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import AdminApp from './admin/AdminApp.vue';
import adminRouter from './admin/router';


// Importa Bootstrap CSS primero
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
axios.defaults.baseURL = "https://localhost:3000";


// Importa Bootstrap JavaScript y jQuery
import "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Crea la instancia de Pinia
const pinia = createPinia();

// Crea la aplicación del lado admin, usa Pinia y monta el router
createApp(AdminApp)
  .use(pinia)        // Asocia Pinia a la aplicación
  .use(adminRouter)  // Asocia el router del lado admin
  .mount('#admin');  // Monta la aplicación en el elemento con id "admin"
