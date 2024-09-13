<template>
  <div>
    <h2 class="text-center">
      {{ isEditing ? "Editar Temporada" : "Añadir Temporada" }}
    </h2>
    <form @submit.prevent="saveSeason">
      <!-- Seleccionar Serie -->
      <div class="mb-3">
        <label for="serie" class="form-label">Serie:</label>
        <select
          v-model="season.serie_id"
          id="serie"
          class="form-select"
          required
        >
          <option value="" disabled>Seleccione una serie</option>
          <option
            v-for="serie in seriesStore.series"
            :key="serie.id"
            :value="serie.id"
          >
            {{ serie.anime_titulo }} - {{ serie.serie_titulo }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="number" class="form-label">Número de Temporada:</label>
        <input
          v-model="season.numero_temporada"
          id="number"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="title" class="form-label">Título:</label>
        <input
          v-model="season.titulo"
          id="title"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descripción:</label>
        <textarea
          v-model="season.descripcion"
          id="description"
          class="form-control"
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Imagen URL:</label>
        <input
          v-model="season.imagen_url"
          id="image"
          type="text"
          class="form-control"
        />
      </div>

      <!-- Previsualización de Imagen -->
      <div v-if="season.imagen_url" class="mb-3">
        <label class="form-label">Previsualización de Imagen:</label>
        <div class="text-center">
          <img
            :src="season.imagen_url"
            alt="Imagen de la temporada"
            class="img-fluid"
            style="max-height: 200px"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditing ? "Guardar Cambios" : "Añadir" }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useSeasonStore } from "../store/seasonStore";
import { useSeriesStore } from "../store/seriesStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "SeasonForm",
  props: {
    initialSeason: {
      type: Object,
      required: false,
      default: () => ({
        serie_id: null,
        numero_temporada: 1,
        titulo: "",
        descripcion: "",
        imagen_url: "",
      }),
    },
  },
  setup(props, { emit }) {
    const seasonStore = useSeasonStore();
    const seriesStore = useSeriesStore();
    const season = ref({ ...props.initialSeason });
    const isEditing = computed(() => !!season.value.id);

    onMounted(() => {
      seriesStore.fetchSeriesAdmin();
    });

    const saveSeason = async () => {
      if (isEditing.value) {
        await seasonStore.updateSeason(season.value);
        Swal.fire({
          icon: "success",
          title: "Temporada actualizada",
          text: "La temporada ha sido actualizada correctamente.",
        });
      } else {
        await seasonStore.addSeason(season.value);
        Swal.fire({
          icon: "success",
          title: "Temporada añadida",
          text: "La temporada ha sido añadida correctamente.",
        });
      }
      emit("save"); // Cierra el modal después de guardar
    };

    return {
      season,
      isEditing,
      saveSeason,
      seriesStore,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/SeasonList.css";
</style>