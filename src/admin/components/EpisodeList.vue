<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Episodios</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Título del Episodio</th>
            <th>Anime</th>
            <th>Temporada</th>
            <th>Número de Episodio</th>
            <th>Video</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedEpisodes.length === 0">
            <td colspan="6" class="text-center">
              No hay episodios disponibles.
            </td>
          </tr>
          <tr v-else v-for="episode in paginatedEpisodes" :key="episode.id">
            <td>{{ episode.titulo }}</td>
            <td>{{ episode.anime_titulo }}</td>
            <td>{{ episode.temporada_nombre }}</td>
            <td>{{ episode.numero_episodio }}</td>
            <td>
              <a :href="episode.video_url" target="_blank">Ver Video</a>
              <br />
              <video
                v-if="isValidVideoUrl(episode.video_url)"
                width="200"
                controls
              >
                <source :src="episode.video_url" type="video/mp4" />
                Tu navegador no soporta la previsualización de video.
              </video>
            </td>
            <td>
              <button
                @click="openEditForm(episode)"
                class="btn btn-success btn-sm me-2"
              >
                Editar
              </button>
              <button
                @click="confirmDeleteEpisode(episode.id)"
                class="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />

      <button @click="openAddForm" class="btn btn-primary mt-2">
        Añadir Episodio
      </button>

      <div
        v-if="showFormModal"
        class="modal show"
        tabindex="-1"
        style="display: block"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? "Editar Episodio" : "Agregar Episodio" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <EpisodeForm
                :initialEpisode="selectedEpisode"
                @save="handleSave"
                @cancel="closeForm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import EpisodeForm from "./EpisodeForm.vue";
import Pagination from "./Pagination.vue";
import { useEpisodeStore } from "../store/episodeStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "EpisodeList",
  components: {
    Pagination,
    EpisodeForm,
  },
  setup() {
    const store = useEpisodeStore();
    const showFormModal = ref(false);
    const selectedEpisode = ref({
      id: null,
      titulo: "",
      descripcion: "",
      numero_episodio: 1,
      video_url: "",
      temporada_id: null,
      anime_titulo: "",
      temporada_nombre: "",
    });
    const isEditMode = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const totalPages = computed(() => {
      return Math.ceil(store.episodes.length / itemsPerPage.value);
    });

    const paginatedEpisodes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return store.episodes.slice(start, end);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    onMounted(() => {
      store.fetchEpisodesAdmin();
    });

    const openAddForm = () => {
      selectedEpisode.value = {
        id: null,
        titulo: "",
        descripcion: "",
        numero_episodio: 1,
        video_url: "",
        temporada_id: null,
        anime_titulo: "",
        temporada_nombre: "",
      };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (episode: any) => {
      selectedEpisode.value = { ...episode };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const confirmDeleteEpisode = (id: number) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteEpisode(id);
          Swal.fire(
            "Eliminado",
            "El episodio ha sido eliminado correctamente.",
            "success"
          );
        }
      });
    };

    const deleteEpisode = (id: number) => {
      store.deleteEpisode(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value ? "Episodio actualizado" : "Episodio añadido",
        text: isEditMode.value
          ? "El episodio ha sido actualizado correctamente."
          : "El episodio ha sido añadido correctamente.",
      });
    };

    const isValidVideoUrl = (url: string) => {
      return (
        url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")
      );
    };

    return {
      episodes: store.episodes,
      paginatedEpisodes,
      currentPage,
      totalPages,
      showFormModal,
      selectedEpisode,
      isEditMode,
      openAddForm,
      openEditForm,
      confirmDeleteEpisode,
      deleteEpisode,
      closeForm,
      handleSave,
      handlePageChange,
      isValidVideoUrl,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/EpisodeList.css";
</style>