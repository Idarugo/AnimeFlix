<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <h1>Mis Listas</h1>
      <div class="profile-section">
        <UserLists :userId="user.id" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import UserLists from "../../components/profile/UserLists.vue";
import Sidebar from "../../components/profile/Sidebar.vue";
import { useAnimeStore } from "../../store/animeStore";

export default defineComponent({
  name: "MiListaView",
  components: {
    Sidebar,
    UserLists,
  },
  setup() {
    const animeStore = useAnimeStore();
    const user = ref(animeStore.user);

    onMounted(() => {
      animeStore.fetchUserLists(user.value.id);
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
