<template>
  <div>
    <form @submit.prevent="saveSeries">
      <div class="form-group mb-3">
        <label for="anime" class="form-label">Anime:</label>
        <select
          v-model="series.anime_id"
          id="anime"
          class="form-select"
          required
        >
          <option value="" disabled>Seleccione un anime</option>
          <option
            v-for="anime in animeStore.animes"
            :key="anime.id"
            :value="anime.id"
          >
            {{ anime.titulo }}
          </option>
        </select>
      </div>
      <div class="form-group mb-3">
        <label for="seriesTitle" class="form-label">Título de la Serie</label>
        <input
          type="text"
          id="seriesTitle"
          v-model="series.titulo"
          class="form-control"
          placeholder="Ingrese el título de la serie"
          required
        />
      </div>
      <div class="form-group mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          id="description"
          v-model="series.descripcion"
          class="form-control"
          placeholder="Ingrese una descripción"
        ></textarea>
      </div>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-agregar me-2">
          {{ isEditMode ? "Guardar Cambios" : "Agregar Serie" }}
        </button>
        <button type="button" class="btn btn-secondary" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useSeriesStore } from "../store/seriesStore";
import { useAnimeStore } from "../store/animeStore";

export default defineComponent({
  name: "SeriesForm",
  props: {
    initialSeries: {
      type: Object,
      required: false,
      default: () => ({ titulo: "", descripcion: "", anime_id: null }),
    },
  },
  setup(props, { emit }) {
    const store = useSeriesStore();
    const animeStore = useAnimeStore();
    const series = ref({ ...props.initialSeries });
    const isEditMode = ref(!!props.initialSeries.id);

    onMounted(() => {
      animeStore.fetchAnimes();
    });

    const saveSeries = () => {
      if (isEditMode.value) {
        store.updateSeries(series.value);
      } else {
        store.addSeries(series.value);
      }
      emit("save");
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      series,
      isEditMode,
      saveSeries,
      cancel,
      animeStore,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/SeasonList.css";
</style>