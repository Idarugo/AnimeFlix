<template>
  <div class="search-results">
    <button @click="goBack" class="back-button">← Volver</button>
    <h1>Resultados de la Búsqueda</h1>
    <div v-if="searchResults.length">
      <AnimeCarousel :animes="searchResults" @select="openModal" />
    </div>
    <p v-else>No se encontraron animes que coincidan con tu búsqueda.</p>

    <!-- El modal para detalles de anime -->
    <AnimeDetailModal
      :isOpen="isModalOpen"
      :anime="selectedAnime"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAnimeStore } from "../store/animeStore";
import AnimeCarousel from "../components/shared/AnimeCarousel.vue";
import AnimeDetailModal from "../components/modals/AnimeDetailModal.vue";
import { useRouter } from "vue-router";
import { Anime } from "../types/Anime";

export default defineComponent({
  name: "SearchResultsView",
  components: {
    AnimeCarousel,
    AnimeDetailModal,
  },
  setup() {
    const animeStore = useAnimeStore();
    const router = useRouter();

    // Fuerza temporalmente el estado del modal a true para pruebas
    animeStore.isModalOpen = true;

    return {
      searchResults: computed(() => animeStore.searchResults as Anime[]),
      isModalOpen: animeStore.isModalOpen,
      selectedAnime: animeStore.selectedAnime,
      openModal: (anime: Anime) => {
        animeStore.openModal(anime);
      },
      closeModal: animeStore.closeModal,
      goBack: () => {
        router.back();
      },
    };
  },
});
</script>


<style scoped>
.search-results {
  padding: 20px;
  color: var(--text-color);
}

.search-results h1 {
  margin-bottom: 20px;
}

.search-results p {
  font-size: 18px;
  margin-top: 20px;
}

.back-button {
  background-color: var(--link-color);
  color: var(--text-color);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: var(--link-hover-color);
}
</style>


<style scoped>
.search-results {
  padding: 20px;
  color: var(--text-color);
}

.search-results h1 {
  margin-bottom: 20px;
}

.search-results p {
  font-size: 18px;
  margin-top: 20px;
}

.back-button {
  background-color: var(--link-color);
  color: var(--text-color);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: var(--link-hover-color);
}
</style>