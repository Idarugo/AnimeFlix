<template>
  <div class="season-view">
    <h2>{{ seasonTitle }}</h2>
    <div v-if="episodes.length" class="episodes-list">
      <div v-for="episode in episodes" :key="episode.id" class="episode-item">
        <p>
          <strong>Episodio {{ episode.mal_id }}:</strong> {{ episode.title }}
        </p>
        <button
          :class="{ watched: episode.watched }"
          @click="markAsWatched(episode.id)"
          :disabled="episode.watched"
        >
          {{ episode.watched ? "Visto" : "Marcar como visto" }}
        </button>
      </div>
    </div>
    <p v-else>No hay episodios disponibles para esta temporada.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useAnimeStore } from "../store/animeStore";
import { useRoute } from "vue-router";

// Definir el tipo de Episodio
interface Episode {
  id: number;
  mal_id: number;
  title: string;
  watched: boolean;
}

export default defineComponent({
  name: "SeasonView",
  setup() {
    const animeStore = useAnimeStore();
    const route = useRoute();
    const episodes = ref<Episode[]>([]);

    const seasonId = parseInt(route.params.seasonId as string);
    const seasonTitle = ref(route.params.seasonTitle as string);

    onMounted(async () => {
      await animeStore.fetchSeasonEpisodes(seasonId);
      episodes.value = animeStore.currentSeasonEpisodes;
    });

    const markAsWatched = (episodeId: number) => {
      animeStore.markEpisodeAsWatched(episodeId);
    };

    return {
      episodes,
      seasonTitle,
      markAsWatched,
    };
  },
});
</script>
