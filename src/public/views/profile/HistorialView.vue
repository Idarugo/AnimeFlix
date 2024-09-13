<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <h1>Historial de Reproducción</h1>
      <div class="profile-section">
        <WatchHistory :userId="user.id" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import WatchHistory from "../../components/profile/WatchHistory.vue";
import { useAnimeStore } from "../../store/animeStore";
import Sidebar from "../../components/profile/Sidebar.vue";

export default defineComponent({
  name: "HistorialView",
  components: {
    Sidebar,
    WatchHistory,
  },
  setup() {
    const animeStore = useAnimeStore();
    const user = ref(animeStore.user);

    onMounted(() => {
      animeStore.fetchWatchHistory(user.value.id);
    });

    return {
      user,
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
</style>
