<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <h1>Preferencias de Notificaciones</h1>
      <div class="profile-section">
        <NotificationPreferences
          :userId="user.id"
          :preferences="user.preferences"
          @preferencesUpdated="updatePreferences"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import NotificationPreferences from "../../components/profile/NotificationPreferences.vue";
import Sidebar from "../../components/profile/Sidebar.vue";
import { useAnimeStore } from "../../store/animeStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PreferenciaView",
  components: {
    NotificationPreferences,
    Sidebar,
  },
  setup() {
    const animeStore = useAnimeStore();
    const user = ref(animeStore.user);
    const router = useRouter();

    const updatePreferences = (newPreferences: any) => {
      animeStore.updatePreferences(newPreferences);
    };

    const goBack = () => router.back();

    return {
      user,
      updatePreferences,
      goBack,
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

.back-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;
}

.back-button:hover {
  background-color: #d40812;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.profile-section {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}
</style>
