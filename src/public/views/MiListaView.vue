<template>
  <div class="my-list-view">
    <Navbar />

    <div class="content">
      <h1>Mi Lista</h1>
      <div v-if="animeStore.isAuthenticated && userLists.length">
        <div class="anime-list">
          <AnimeCard
            v-for="anime in userLists"
            :key="anime.id"
            :anime="anime"
            :isInMyListView="true"
            @select="openModal"
            @remove="removeFromList"
          />
        </div>
      </div>
      <p v-else>No has añadido ningún anime a tu lista.</p>

      <!-- El modal -->
      <AnimeDetailModal
        :isOpen="isModalOpen"
        :anime="selectedAnime"
        @close="closeModal"
      />
    </div>

    <FooterView />
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useAnimeStore } from "../store/animeStore";
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";
import AnimeCard from "../components/AnimeCard.vue";
import AnimeDetailModal from "../components/modals/AnimeDetailModal.vue";

export default defineComponent({
  name: "MiListaView",
  components: {
    Navbar,
    FooterView,
    AnimeCard,
    AnimeDetailModal,
  },
  setup() {
    const animeStore = useAnimeStore();
    const userId = animeStore.user.id;

    onMounted(() => {
      if (userId) {
        animeStore.fetchUserLists(userId); // Carga la lista de favoritos
      }
    });

    const userLists = computed(() => animeStore.listas);
    const isModalOpen = computed(() => animeStore.isModalOpen);
    const selectedAnime = computed(() => animeStore.selectedAnime);

    const openModal = (anime: any) => {
      animeStore.openModal(anime);
    };

    const closeModal = () => {
      animeStore.closeModal();
    };

    const removeFromList = (anime: any) => {
      animeStore.removeFromFavorites(anime.id);
    };

    return {
      userLists,
      isModalOpen,
      selectedAnime,
      openModal,
      closeModal,
      removeFromList,
      animeStore,
    };
  },
});
</script>

  
<style scoped>
.my-list-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 100px 20px 40px; /* Asegura que el contenido no se superponga con el navbar */
  flex-grow: 1;
  background-color: var(--background-color);
  color: var(--text-color);
}

.content h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
}

.anime-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center; /* Centra las tarjetas */
}

.content p {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
