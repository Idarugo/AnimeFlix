<template>
  <div>
    <h2>{{ isEditMode ? "Editar Lanzamiento" : "Añadir Lanzamiento" }}</h2>
    <form @submit.prevent="saveLaunch">
      <div class="form-group mb-3">
        <label for="episodio" class="form-label">Episodio:</label>
        <select
          v-model="launch.episodio_id"
          id="episodio"
          class="form-select"
          required
        >
          <option disabled value="">Seleccione un episodio</option>
          <option
            v-for="episodio in store.episodes"
            :key="episodio.id"
            :value="episodio.id"
          >
            {{ episodio.anime_titulo }} - {{ episodio.titulo }}
          </option>
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="releaseDate" class="form-label"
          >Fecha de Lanzamiento:</label
        >
        <input
          type="date"
          v-model="launch.fecha_lanzamiento"
          id="releaseDate"
          class="form-control"
          required
        />
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-agregar">
          {{ isEditMode ? "Guardar Cambios" : "Añadir Lanzamiento" }}
        </button>
        <button type="button" class="btn btn-secondary ms-2" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useLaunchStore } from "../store/launchStore";
import { useEpisodeStore } from "../store/episodeStore";

export default defineComponent({
  name: "LaunchForm",
  props: {
    initialLaunch: {
      type: Object,
      required: false,
      default: () => ({ episodio_id: null, fecha_lanzamiento: "" }),
    },
  },
  setup(props, { emit }) {
    const store = useLaunchStore();
    const episodioStore = useEpisodeStore();
    const launch = ref({ ...props.initialLaunch });
    const isEditMode = ref(!!launch.value.id);

    watch(
      () => props.initialLaunch,
      (newLaunch) => {
        launch.value = { ...newLaunch };
        isEditMode.value = !!newLaunch.id;
      }
    );

    onMounted(() => {
      episodioStore.fetchEpisodesAdmin();
    });

    const saveLaunch = async () => {
      try {
        launch.value.episodio_id = parseInt(launch.value.episodio_id, 10);

        if (isEditMode.value) {
          await store.updateLaunch(launch.value);
        } else {
          await store.addLaunch(launch.value);
        }
        emit("save");
      } catch (error) {
        console.error("Error al guardar el lanzamiento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el lanzamiento.",
        });
      }
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      launch,
      isEditMode,
      saveLaunch,
      cancel,
      store: episodioStore,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/LaunchList.css";
</style>