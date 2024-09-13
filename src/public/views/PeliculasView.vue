<template>
  <div class="peliculas-view">
    <Navbar />

    <div class="peliculas-content">
      <h1>Películas</h1>
      <AnimeCarousel
        v-if="moviesAnimes.length"
        :title="'Películas Populares'"
        :animes="moviesAnimes"
        @select="openModal"
      />
      <p v-else>No se encontraron películas.</p>

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
import { defineComponent, computed } from "vue";
import { useAnimeStore } from "../store/animeStore";
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";
import AnimeCarousel from "../components/shared/AnimeCarousel.vue";
import AnimeDetailModal from "../components/modals/AnimeDetailModal.vue";

export default defineComponent({
  name: "PeliculasView",
  components: {
    Navbar,
    FooterView,
    AnimeCarousel,
    AnimeDetailModal,
  },
  setup() {
    const animeStore = useAnimeStore();

    // Cargar películas cuando se monta el componente
    animeStore.fetchAnimesByCategoria(2); // Asumiendo que el ID 2 corresponde a "Películas"

    return {
      moviesAnimes: computed(() => animeStore.animesPorCategoria),
      isModalOpen: computed(() => animeStore.isModalOpen),
      selectedAnime: computed(() => animeStore.selectedAnime),
      openModal: animeStore.openModal,
      closeModal: animeStore.closeModal,
    };
  },
});
</script>

<style scoped>
.peliculas-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.peliculas-content {
  padding: 100px 20px 40px; /* Asegura que el contenido no se superponga con el navbar */
  flex-grow: 1;
  color: white;
}

.peliculas-content h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
}

.peliculas-content p {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
