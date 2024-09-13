<template>
  <div class="anime-list">
    <h1>Anime List</h1>
    <ul v-if="animes.length">
      <li v-for="anime in animes" :key="anime.id">
        <img
          :src="anime.imagen_url"
          :alt="anime.titulo"
          class="anime-image"
          loading="lazy"
        />
        <h2>{{ anime.titulo }}</h2>
        <p>{{ anime.descripcion }}</p>
        <router-link :to="`/anime/${anime.id}`">Ver detalles</router-link>
      </li>
    </ul>
    <p v-else>No se encontraron animes.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAnimeStore } from "../store/animeStore";

export default defineComponent({
  name: "AnimeList",
  setup() {
    const animeStore = useAnimeStore();

    const animes = computed(() => animeStore.animes);

    return {
      animes,
    };
  },
});
</script>

<style scoped>
.anime-list {
  padding: 20px;
}

.anime-list ul {
  list-style: none;
  padding: 0;
}

.anime-list li {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.anime-image {
  max-width: 200px;
  height: auto;
  margin-right: 20px;
}

.anime-list h2 {
  font-size: 1.5rem;
}

.anime-list p {
  font-size: 1rem;
  color: #333;
}

.anime-list a {
  color: #007bff;
  text-decoration: none;
}
</style>
