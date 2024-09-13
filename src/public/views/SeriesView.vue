<template>
  <div class="series-view">
    <Navbar />

    <div class="series-content">
      <h1>Series</h1>
      <AnimeCarousel
        v-if="seriesAnimes.length"
        :title="'Series Populares'"
        :animes="seriesAnimes"
        @select="openModal"
      />
      <p v-else>No se encontraron series.</p>

      <AnimeDetailModal
        v-if="selectedAnime"
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
  name: "SeriesView",
  components: {
    Navbar,
    FooterView,
    AnimeCarousel,
    AnimeDetailModal,
  },
  setup() {
    const animeStore = useAnimeStore();

    // Asigna los animes que vienen del store filtrados por la categoría
    const seriesAnimes = computed(() => animeStore.animesPorCategoria);

    return {
      seriesAnimes,
      isModalOpen: computed(() => animeStore.isModalOpen),
      selectedAnime: computed(() => animeStore.selectedAnime),
      openModal: animeStore.openModal,
      closeModal: animeStore.closeModal,
    };
  },
});
</script>

<style scoped>
.series-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.series-content {
  padding: 100px 20px 40px; /* Asegurarse de que el contenido no se superponga con el navbar */
  flex-grow: 1;
  color: white;
}

.series-content h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
}

.series-content p {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
