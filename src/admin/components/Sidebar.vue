<template>
  <div>
    <div class="menu" @click="toggleSidebar">
      <ion-icon name="menu-outline" v-if="!sidebarCollapsed"></ion-icon>
      <ion-icon name="close-outline" v-else></ion-icon>
    </div>

    <div
      class="barra-lateral"
      :class="{ 'mini-barra-lateral': sidebarCollapsed }"
    >
      <div>
        <div class="nombre-pagina">
          <ion-icon
            id="cloud"
            name="custom-icon"
            class="custom-icon"
            @click="toggleSidebar"
          ></ion-icon>
          <span>Administrador</span>
        </div>
        <div class="boton">
          <ion-icon class="lupa" name="search-outline"></ion-icon>
          <input
            class="buscar"
            type="text"
            placeholder="Buscar...."
            v-model="searchTerm"
            @input="filtrarLista"
          />
        </div>
      </div>

      <nav class="navegacion">
        <ul class="listado">
          <li v-for="item in filteredMenuItems" :key="item.name">
            <router-link :to="item.route" class="nav-link">
              <ion-icon :name="item.icon"></ion-icon>
              <span v-if="!sidebarCollapsed">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div>
        <div class="linea"></div>

        <div class="modo-oscuro" @click="toggleDarkMode">
          <div class="info">
            <ion-icon name="moon-outline"></ion-icon>
            <span>Modo Noche</span>
          </div>
          <div class="switch">
            <div class="base">
              <div class="circulo" :class="{ prendido: darkMode }"></div>
            </div>
          </div>
        </div>

        <div class="usuario">
          <img src="../assets/img/usuario.png" alt="Imagen de usuario" />
          <div class="info-usuario">
            <div class="nombre-email">
              <span class="nombre">Marcelo H</span>
              <span class="email">marcelohidalgop14@gmail.com</span>
            </div>
            <router-link to="/admin/informacion-personal" class="nav-link">
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "Sidebar",
  setup() {
    const sidebarCollapsed = ref(false);
    const darkMode = ref(localStorage.getItem("darkMode") === "true");
    const searchTerm = ref("");

    const menuItems = [
      { name: "Principal", route: "/", icon: "stats-chart-outline" },
      { name: "Animes", route: "/animes", icon: "film-outline" },
      { name: "Series", route: "/series", icon: "tv-outline" },
      { name: "Temporadas", route: "/seasons", icon: "calendar-outline" },
      { name: "Episodios", route: "/episodes", icon: "play-outline" },
      { name: "Lanzamientos", route: "/launches", icon: "rocket-outline" },
      { name: "Categorías", route: "/categories", icon: "albums-outline" },
      { name: "Géneros", route: "/generos", icon: "list-outline" },
      { name: "Trabajadores", route: "/trabajadores", icon: "people-outline" },
      { name: "Usuarios", route: "/usuarios", icon: "person-outline" },
      { name: "Reseñas", route: "/resenas", icon: "star-outline" },
      {
        name: "Clasificación por Edad",
        route: "/clasificacion",
        icon: "shield-outline",
      },
      {
        name: "Notificaciones",
        route: "/notificaciones",
        icon: "notifications-outline",
      },
      {
        name: "Historial de Visualización",
        route: "/historial",
        icon: "time-outline",
      },
    ];

    const filteredMenuItems = computed(() => {
      return menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      document.body.classList.toggle("dark-mode", darkMode.value);
      localStorage.setItem("darkMode", darkMode.value.toString());
    };

    return {
      sidebarCollapsed,
      darkMode,
      searchTerm,
      filteredMenuItems,
      toggleSidebar,
      toggleDarkMode,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";

/* Estilos adicionales para el sidebar */
.otros-submenu {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: none;
  left: 0;
  position: relative;
  top: 0;
  width: 100%;
  z-index: 2;
}

.navegacion > ul > li {
  position: relative;
}

.flecha-rotada {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.otros-submenu {
  display: block;
}
</style>
