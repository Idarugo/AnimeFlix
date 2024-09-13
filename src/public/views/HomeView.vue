<template>
  <div class="home">
    <Navbar />
    <FilterBar />

    <LoadingSpinner v-if="isLoading" />
    <div v-else>
      <HeroBanner
        v-if="featuredAnime"
        :bannerImage="featuredAnime?.imagen_url || ''"
        :title="featuredAnime?.titulo || 'Título no disponible'"
        :description="featuredAnime?.descripcion || 'Descripción no disponible'"
        :anime="featuredAnime"
      >
        <template #actions>
          <button @click="playAnime(featuredAnime)">Reproducir</button>
        </template>
      </HeroBanner>
      <p v-else>Cargando anime destacado...</p>

      <div v-if="watchHistory?.length">
        <AnimeCarousel
          title="Visto Recientemente"
          :animes="watchHistory"
          @select="openModal"
        />
      </div>
      <p v-else>No has visto ningún anime recientemente.</p>

      <div v-if="!searchQuery && allAnimes?.length">
        <AnimeCarousel
          title="Todos los Animes"
          :animes="allAnimes"
          @select="openModal"
        />
      </div>

      <div v-if="searchQuery && filteredAnimes?.length">
        <AnimeCarousel
          title="Resultados de la Búsqueda"
          :animes="filteredAnimes"
          @select="openModal"
        />
      </div>
      <p v-else-if="searchQuery">No se encontraron animes.</p>

      <div v-if="recommendations?.length">
        <AnimeCarousel
          title="Recomendados para ti"
          :animes="recommendations"
          @select="openModal"
          @update-recommendations="animeStore.generateRecommendations"
        />
      </div>
      <p v-else>No hay recomendaciones disponibles.</p>

      <div v-if="newReleases?.length">
        <AnimeCarousel
          title="Nuevos Lanzamientos"
          :animes="newReleases"
          @select="openModal"
        />
      </div>
      <p v-else>No se encontraron nuevos lanzamientos.</p>

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
import {
  defineAsyncComponent,
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useAnimeStore, AnimeStore } from "../store/animeStore";
import FooterView from "../components/FooterView.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    Navbar: defineAsyncComponent(
      () => import("../components/navbar/Navbar.vue")
    ),
    FilterBar: defineAsyncComponent(
      () => import("../components/FilterBar.vue")
    ),
    HeroBanner: defineAsyncComponent(
      () => import("../components/shared/HeroBanner.vue")
    ),
    AnimeCarousel: defineAsyncComponent(
      () => import("../components/shared/AnimeCarousel.vue")
    ),
    AnimeDetailModal: defineAsyncComponent(
      () => import("../components/modals/AnimeDetailModal.vue")
    ),
    LoadingSpinner: defineAsyncComponent(
      () => import("../components/shared/LoadingSpinner.vue")
    ),
    FooterView,
  },
  setup() {
    const animeStore = useAnimeStore() as AnimeStore;
    const currentAnimeIndex = ref(0);
    const searchQuery = computed(() => animeStore.searchResults.length > 0);

    let intervalId: ReturnType<typeof setInterval> | null = null;

    onMounted(async () => {
      await animeStore.fetchAnimes();
      await animeStore.fetchLanzamientos();
      await animeStore.fetchWatchHistory(animeStore.user.id);

      animeStore.generateRecommendations(); // Genera recomendaciones al montar la vista
      startAnimeRotation();
    });

    const watchHistory = computed(() => {
      const seenTitles = new Set();
      return animeStore.watchHistory.filter((anime) => {
        if (seenTitles.has(anime.titulo)) {
          return false;
        } else {
          seenTitles.add(anime.titulo);
          return true;
        }
      });
    });

    watch(
      () => animeStore.user.id,
      async (newUserId) => {
        if (newUserId) {
          await animeStore.fetchWatchHistory(newUserId);
        }
      }
    );

    const startAnimeRotation = () => {
      intervalId = setInterval(() => {
        if (animeStore.animes.length > 1) {
          currentAnimeIndex.value =
            (currentAnimeIndex.value + 1) % animeStore.animes.length;
        }
      }, 10000);
    };

    onUnmounted(() => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    });

    const featuredAnime = computed(() => {
      return animeStore.animes[currentAnimeIndex.value] || null;
    });

    const playAnime = async (anime: any) => {
      await animeStore.playEpisode(anime.video_url);
      animeStore.addToWatchHistory(anime);
    };

    const newReleases = computed(() =>
      animeStore.lanzamientos.map((lanzamiento) => ({
        ...lanzamiento,
        titulo: lanzamiento.temporada_titulo,
        imagen_url: lanzamiento.temporada_imagen_url,
        descripcion: `Nuevo episodio disponible: ${lanzamiento.episodio_titulo}`,
      }))
    );

    const allAnimes = computed(() => animeStore.animes);

    const recommendations = computed(() => animeStore.recommendations);

    return {
      featuredAnime,
      isLoading: computed(() => animeStore.isLoading),
      watchHistory,
      recommendations,
      filteredAnimes: computed(() => animeStore.applyFilters()),
      newReleases,
      allAnimes,
      isModalOpen: computed(() => animeStore.isModalOpen),
      selectedAnime: computed(() => animeStore.selectedAnime),
      openModal: animeStore.openModal,
      closeModal: animeStore.closeModal,
      playAnime,
      searchQuery,
    };
  },
});
</script>

<style scoped>
.home {
  background-color: var(--background-color);
  color: var(--text-color);
  padding-top: 120px;
  padding-bottom: 20px;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero-banner {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.anime-carousel {
  transition: transform 0.3s ease;
}

.anime-carousel:hover {
  transform: scale(1.02);
}
</style>
