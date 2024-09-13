<template>
  <div>
    <h2>{{ isEditing ? "Editar Episodio" : "Añadir Episodio" }}</h2>
    <form @submit.prevent="saveEpisode">
      <div class="mb-3">
        <label for="season" class="form-label">Temporada:</label>
        <select
          v-model="episode.temporada_id"
          id="season"
          class="form-select"
          required
        >
          <option value="" disabled selected>Seleccione una temporada</option>
          <option v-for="season in seasons" :key="season.id" :value="season.id">
            {{ season.anime_titulo }} - {{ season.titulo }} (Temporada
            {{ season.numero_temporada }})
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="number" class="form-label">Número de Episodio:</label>
        <input
          v-model="episode.numero_episodio"
          id="number"
          type="number"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="title" class="form-label">Título del Episodio:</label>
        <input
          v-model="episode.titulo"
          id="title"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descripción:</label>
        <textarea
          v-model="episode.descripcion"
          id="description"
          class="form-control"
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="video_url" class="form-label">Enlace de Video:</label>
        <input
          v-model="episode.video_url"
          id="video_url"
          type="text"
          class="form-control"
          placeholder="Pega el enlace del video aquí"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">
        {{ isEditing ? "Guardar Cambios" : "Añadir" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useEpisodeStore } from "../store/episodeStore";
import { useSeasonStore } from "../store/seasonStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "EpisodeForm",
  props: {
    initialEpisode: {
      type: Object,
      required: false,
      default: () => ({
        numero_episodio: 1,
        titulo: "",
        descripcion: "",
        video_url: "", // Cambiado a un string para el enlace
        temporada_id: null,
      }),
    },
  },
  setup(props, { emit }) {
    const episode = ref({ ...props.initialEpisode });
    const seasonStore = useSeasonStore();
    const isEditing = computed(() => !!episode.value.id);

    onMounted(() => {
      seasonStore.fetchSeasonsAdmin(); // Cargar las temporadas disponibles para el select
    });

    const saveEpisode = async () => {
      const store = useEpisodeStore();

      if (isEditing.value) {
        await store.updateEpisode(episode.value.id, episode.value);
        Swal.fire({
          icon: "success",
          title: "Episodio actualizado",
          text: "El episodio ha sido actualizado correctamente.",
        });
      } else {
        await store.addEpisode(episode.value);
        Swal.fire({
          icon: "success",
          title: "Episodio añadido",
          text: "El episodio ha sido añadido correctamente.",
        });
      }
      emit("save");
    };

    return {
      episode,
      isEditing,
      saveEpisode,
      seasons: seasonStore.seasons, // Obtener las temporadas del store
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/EpisodeList.css";
</style>