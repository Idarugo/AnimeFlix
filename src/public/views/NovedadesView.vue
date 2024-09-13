<template>
  <div class="novedades-populares-view">
    <Navbar />

    <div class="novedades-content">
      <h1>Novedades Populares</h1>
      <AnimeCarousel
        v-if="popularAnimes.length"
        :title="'Novedades Populares'"
        :animes="popularAnimes"
        @select="openModal"
      />
      <p v-else>No se encontraron novedades populares.</p>

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
  name: "NovedadesPopularesView",
  components: {
    Navbar,
    FooterView,
    AnimeCarousel,
    AnimeDetailModal,
  },
  setup() {
    const animeStore = useAnimeStore();

    // Cargar novedades populares cuando se monta el componente
    animeStore.fetchAnimesByCategoria(3); // Asumiendo que el ID 3 corresponde a "Novedades Populares"

    return {
      popularAnimes: computed(() => animeStore.animesPorCategoria),
      isModalOpen: computed(() => animeStore.isModalOpen),
      selectedAnime: computed(() => animeStore.selectedAnime),
      openModal: animeStore.openModal,
      closeModal: animeStore.closeModal,
    };
  },
});
</script>

<style scoped>
.novedades-populares-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.novedades-content {
  padding: 100px 20px 40px; /* Asegura que el contenido no se superponga con el navbar */
  flex-grow: 1;
  color: white;
}

.novedades-content h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
}

.novedades-content p {
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
}
</style>
