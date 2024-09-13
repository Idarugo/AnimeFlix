<template>
  <div class="filter-bar">
    <select
      v-model="selectedGenre"
      @change="applyGenreFilter"
      class="filter-select"
    >
      <option value="">Género</option>
      <option v-for="genre in filteredGenres" :key="genre.id" :value="genre.id">
        {{ genre.nombre }}
      </option>
    </select>

    <input
      type="number"
      v-model="selectedDuration"
      placeholder="Duración (min)"
      @input="applyFilters"
      class="filter-input"
    />
    <input
      type="number"
      v-model="selectedPopularity"
      placeholder="Popularidad (máx)"
      @input="applyFilters"
      class="filter-input"
    />

    <button @click="clearFilters" class="clear-button">Limpiar Filtros</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAnimeStore } from "../store/animeStore";

export default defineComponent({
  name: "FilterBar",
  setup() {
    const animeStore = useAnimeStore();

    const genres = ref<any[]>([]);
    const selectedGenre = ref<string | null>(null);
    const selectedDuration = ref<number | null>(null);
    const selectedPopularity = ref<number | null>(null);

    const applyGenreFilter = () => {
      if (selectedGenre.value) {
        animeStore.fetchAnimesByGenero(parseInt(selectedGenre.value));
      } else {
        animeStore.fetchAnimes();
      }
    };

    const applyFilters = () => {
      animeStore.setFilter("duration", selectedDuration.value);
      animeStore.setFilter("popularity", selectedPopularity.value);
      animeStore.applyFilters();
    };

    const clearFilters = () => {
      selectedGenre.value = null;
      selectedDuration.value = null;
      selectedPopularity.value = null;
      animeStore.clearFilters();
      animeStore.fetchAnimes();
    };

    const fetchGenres = async () => {
      try {
        const response = await fetch("https://localhost:3000/api/generos");
        const data = await response.json();
        genres.value = data;
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();

    return {
      selectedGenre,
      selectedDuration,
      selectedPopularity,
      applyGenreFilter,
      applyFilters,
      clearFilters,
      filteredGenres: genres,
    };
  },
});
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  justify-content: center;
  background-color: var(--navbar-background);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filter-select,
.filter-input {
  padding: 12px 15px;
  border-radius: 5px;
  border: 1px solid var(--link-hover-color, #ccc);
  background-color: var(--input-background-color, #1a1a1a);
  color: var(--text-color, #ffffff);
  font-size: 14px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.filter-select option {
  background-color: var(--input-background-color, #1a1a1a);
  color: var(--text-color, #ffffff);
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--link-hover-color, #888);
  background-color: var(--input-background-hover, #333);
}

.clear-button {
  background-color: #e50914;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.clear-button:hover {
  background-color: #d40813;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: center;
  }

  .filter-select,
  .filter-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .clear-button {
    width: 100%;
  }
}
</style>
