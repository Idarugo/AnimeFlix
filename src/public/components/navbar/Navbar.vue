<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">
        <img src="../../assets/img/logo.png" alt="AnimeFlix" loading="lazy" />
      </router-link>
    </div>

    <ul class="nav-links">
      <li>
        <router-link to="/">Inicio</router-link>
      </li>
      <li>
        <router-link to="/series" @click="fetchSeries">Series</router-link>
      </li>
      <li>
        <router-link to="/peliculas" @click="fetchPeliculas"
          >Películas</router-link
        >
      </li>
      <li>
        <router-link to="/novedades" @click="fetchNovedades"
          >Novedades populares</router-link
        >
      </li>
      <li><router-link to="/mi-lista">Mi lista</router-link></li>
      <li><router-link to="/lanzamientos">Lanzamientos</router-link></li>
    </ul>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar animes..."
        @keyup.enter="searchAnimes"
      />
    </div>

    <div class="notifications">
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="notifications-icon"
        @click="toggleNotifications"
      />
      <span v-if="notifications.length" class="notification-count">
        {{ notifications.length }}
      </span>
      <div v-if="showNotifications" class="notifications-menu">
        <p v-if="notifications.length === 0">No tienes notificaciones nuevas</p>
        <ul v-else>
          <li v-for="notification in notifications" :key="notification.id">
            {{ notification.mensaje || "Mensaje no disponible" }}
            <button @click="removeNotification(notification.id)">
              Marcar como leída
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="profile">
      <img
        v-if="isAuthenticated"
        :src="avatarUrl || 'ruta/a/imagen/por/defecto.png'"
        alt="Profile"
        loading="lazy"
        @click.stop="toggleProfileMenu"
        class="profile-image"
      />
      <button v-else class="login-button" @click="openLoginModal">
        Iniciar Sesión
      </button>
    </div>

    <div v-if="isProfileMenuOpen" class="profile-menu">
      <router-link to="/account">Mi Perfil</router-link>
      <p @click="toggleTheme">
        Cambiar a {{ theme === "dark" ? "Modo Claro" : "Modo Oscuro" }}
      </p>
      <p @click="cerrarSesion">Cerrar Sesión</p>
    </div>

    <!-- Modal de Inicio de Sesión -->
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useAnimeStore } from "../../store/animeStore";
import { useRouter } from "vue-router";
import LoginModal from "../modals/LoginModal.vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "Navbar",
  components: { LoginModal },
  setup() {
    const animeStore = useAnimeStore();
    const router = useRouter();
    const isProfileMenuOpen = ref(false);
    const showNotifications = ref(false);
    const searchQuery = ref("");
    const showLoginModal = ref(false);
    const avatarUrl = ref("");

    const isAuthenticated = computed(() => animeStore.isAuthenticated);
    const user = computed(() => animeStore.user);
    const notifications = computed(() => [...animeStore.notifications]);

    watch(
      () => animeStore.theme,
      async () => {
        if (isAuthenticated.value && user.value?.id) {
          await fetchUserWithAvatar(user.value.id);
        }
      }
    );

    onMounted(async () => {
      if (isAuthenticated.value && user.value?.id) {
        await fetchUserWithAvatar(user.value.id);
        await animeStore.fetchNotificaciones(user.value.id);
      }
    });

    const fetchUserWithAvatar = async (userId: number) => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token)
          throw new Error("Token no encontrado. Inicia sesión nuevamente.");

        const response = await fetch(
          `https://localhost:3000/api/usuarios/${userId}/avatar`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok)
          throw new Error("Error al obtener el avatar del usuario");

        const userData = await response.json();
        avatarUrl.value = `https://localhost:3000${userData.avatar_url}`;
      } catch (error) {
        console.error("Error al obtener el avatar del usuario:", error);
      }
    };

    const toggleProfileMenu = () => {
      isProfileMenuOpen.value = !isProfileMenuOpen.value;
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const removeNotification = async (id: number) => {
      try {
        await fetch(`https://localhost:3000/api/notificaciones/${id}`, {
          method: "DELETE",
        });
        animeStore.clearNotification(id);
      } catch (error) {
        console.error("Error al eliminar la notificación:", error);
      }
    };

    const searchAnimes = () => {
      if (searchQuery.value.trim()) {
        animeStore.searchAnimes(searchQuery.value);
        router.push({
          name: "ResultadosBusqueda",
          query: { q: searchQuery.value },
        });
      }
    };

    const openLoginModal = () => {
      showLoginModal.value = true;
    };

    const closeLoginModal = () => {
      showLoginModal.value = false;
    };

    const cerrarSesion = () => {
      localStorage.removeItem("userToken");
      animeStore.$reset();
      animeStore.isAuthenticated = false;
      isProfileMenuOpen.value = false;

      Swal.fire({
        title: "Sesión Cerrada",
        text: "Has cerrado sesión exitosamente.",
        icon: "success",
        confirmButtonText: "Entendido",
      });

      router.push({ name: "home" });
    };

    const fetchSeries = async () => {
      await animeStore.fetchAnimesByCategoria(1);
    };

    const fetchPeliculas = async () => {
      await animeStore.fetchAnimesByCategoria(2);
    };

    const fetchNovedades = async () => {
      await animeStore.fetchAnimesByCategoria(3);
    };

    return {
      toggleProfileMenu,
      toggleNotifications,
      isProfileMenuOpen,
      showNotifications,
      notifications,
      searchQuery,
      searchAnimes,
      toggleTheme: animeStore.toggleTheme,
      theme: animeStore.theme,
      fetchSeries,
      fetchPeliculas,
      fetchNovedades,
      isAuthenticated,
      showLoginModal,
      openLoginModal,
      closeLoginModal,
      cerrarSesion,
      user,
      avatarUrl,
      removeNotification,
    };
  },
});
</script>


<style scoped>
/* Estilos de la Navbar */
.navbar {
  background-color: var(--navbar-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  height: 70px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logo img {
  width: 80px;
  height: auto;
  object-fit: cover;
  border-radius: 50%;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
}

.nav-links a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  position: relative;
  padding: 5px 0;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--link-hover-color);
}

.nav-links a:before {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #ff5a5a;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
}

.nav-links a:hover:before {
  visibility: visible;
  width: 100%;
}

.search-bar {
  flex-grow: 1;
  margin: 0 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  outline: none;
  transition: background-color 0.3s, border-color 0.3s;
}

.search-bar input:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.profile {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-right: 50px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.login-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 50px;
}

.login-button:hover {
  background-color: #f40612;
}

.profile-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.profile-menu p,
.profile-menu a {
  margin: 10px 0;
  cursor: pointer;
  color: var(--link-color);
  transition: color 0.3s;
}

.profile-menu p:hover,
.profile-menu a:hover {
  color: var(--link-hover-color);
}

.notifications {
  position: relative;
  margin-left: 20px;
}

.notifications-icon {
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--link-color);
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.notifications-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  width: 300px;
}

.notifications-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications-menu li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.notifications-menu button {
  background: none;
  border: none;
  color: var(--link-color);
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s;
}

.notifications-menu button:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .navbar {
    justify-content: space-between;
  }

  .profile img {
    width: 30px;
    height: 30px;
  }
}
</style>
