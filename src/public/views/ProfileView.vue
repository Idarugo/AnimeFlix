<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <h1>Cuenta</h1>

      <!-- Mostrar información general del perfil -->
      <div class="profile-overview">
        <h2>Información de Perfil</h2>
        <div class="overview-details">
          <p><strong>Nombre:</strong> {{ user?.nombre || "Cargando..." }}</p>
          <p><strong>Email:</strong> {{ user?.email || "Cargando..." }}</p>
          <p>
            <strong>Miembro desde:</strong>
            {{
              membership.startDate
                ? formatDate(membership.startDate)
                : "Fecha no disponible"
            }}
          </p>
          <p>
            <strong>Último acceso:</strong>
            {{ lastLogin ? formatDate(lastLogin) : "Fecha no disponible" }}
          </p>
        </div>
      </div>

      <div class="profile-quick-links">
        <h2>Accesos Rápidos</h2>
        <ul>
          <li>
            <router-link to="/membresia" class="quick-link">
              Administrar Membresía
            </router-link>
          </li>
          <li>
            <router-link to="/preferencias" class="quick-link">
              Modificar Preferencias
            </router-link>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useAnimeStore } from "../store/animeStore"; // Importar animeStore
import { useMembershipStore } from "../store/membershipStore"; // Importar membershipStore
import Sidebar from "../components/profile/Sidebar.vue";

export default defineComponent({
  name: "ProfileView",
  components: {
    Sidebar,
  },
  setup() {
    const animeStore = useAnimeStore(); // Usar el animeStore para datos de usuario
    const membershipStore = useMembershipStore(); // Usar el membershipStore para datos de membresía
    const user = ref(animeStore.user);
    const membership = ref({
      startDate: "",
      planName: "",
    });
    const lastLogin = ref("");

    // Función para formatear la fecha en DD-MM-YY
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    };

    onMounted(async () => {
      // Cargar datos del perfil del usuario desde animeStore
      animeStore.fetchUserProfile();
      user.value = animeStore.user;

      // Cargar datos de la membresía desde membershipStore
      if (!user.value) {
        await membershipStore.setUserFromToken();
      }

      await membershipStore.fetchUserSubscription(user.value?.id || 0);
      membership.value = {
        startDate: membershipStore.subscription?.fecha_inicio || "",
        planName: membershipStore.getPlanName(
          membershipStore.subscription?.plan_id || 0
        ),
      };

      // Cargar el último acceso desde animeStore (si es aplicable)
      lastLogin.value = await animeStore.fetchLastLogin();
    });

    return {
      user,
      membership,
      lastLogin,
      formatDate,
    };
  },
});
</script>

<style scoped>
.account-settings {
  display: flex;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100vh; /* Asegura que ocupe toda la altura de la pantalla */
}

.profile-view {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto; /* Permite el desplazamiento si el contenido es muy largo */
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.profile-overview {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.profile-overview h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.overview-details p {
  margin-bottom: 10px;
  color: #333;
}

.profile-quick-links {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.profile-quick-links h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.quick-link {
  display: block;
  color: #e50914;
  text-decoration: none;
  margin-bottom: 10px;
  font-weight: bold;
}

.quick-link:hover {
  text-decoration: underline;
}
</style>
