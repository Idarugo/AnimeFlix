<template>
  <main>
    <div class="container">
      <h1>Gestión de Animes</h1>
      <h2 class="text-center">Lista de Animes</h2>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Clasificación de Edad</th>
            <th>Fecha de Creación</th>
            <th>Última Actualización</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="animeStore.animes.length === 0">
            <td colspan="6" class="text-center">No hay animes disponibles.</td>
          </tr>
          <tr v-else v-for="anime in paginatedAnimes" :key="anime.id">
            <td>{{ anime.titulo }}</td>
            <td>{{ truncateText(anime.descripcion, 20) }}</td>
            <td>{{ getClasificacion(anime.clasificacion_edad_id) }}</td>
            <td>{{ formatDate(anime.created_at) }}</td>
            <td>{{ formatDate(anime.updated_at) }}</td>
            <td class="text-center">
              <button
                class="btn btn-success btn-sm me-2"
                @click="openEditModal(anime)"
              >
                Modificar
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="openDeleteModal(anime.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Componente de Paginación -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />

      <button class="btn btn-agregar" @click="openAddModal">
        Agregar Anime
      </button>

      <!-- Modal para Agregar/Modificar Anime -->
      <div
        class="modal fade"
        id="animeModal"
        tabindex="-1"
        aria-labelledby="animeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title w-100" id="animeModalLabel">
                {{
                  animeStore.isEditMode ? "Modificar Anime" : "Agregar Anime"
                }}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <AnimeForm
                :animeId="animeStore.selectedAnime?.id"
                @save="closeModal"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para Confirmar Eliminación -->
      <div
        class="modal fade"
        id="deleteModal"
        tabindex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title w-100 text-center" id="deleteModalLabel">
                Confirmar Eliminación
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              ¿Estás seguro de que deseas eliminar este anime?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button type="button" class="btn btn-danger" @click="deleteAnime">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAnimeStore } from "../store/animeStore";
import Pagination from "./Pagination.vue";
import AnimeForm from "./AnimeForm.vue";
import { truncateText } from "../utils/filters";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "AnimeList",
  components: {
    Pagination,
    AnimeForm,
  },
  setup() {
    const animeStore = useAnimeStore();
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const totalPages = computed(() => {
      return Math.ceil(animeStore.animes.length / itemsPerPage.value);
    });

    const paginatedAnimes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return animeStore.animes.slice(start, end);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const openAddModal = () => {
      animeStore.selectedAnime = {
        titulo: "",
        descripcion: "",
        imagen_url: "",
        clasificacion_edad_id: null,
      }; // Restablecer el anime seleccionado
      animeStore.isEditMode = false; // Establecer modo de edición en falso
      const modalElement = document.getElementById("animeModal")!;
      const modal = new Modal(modalElement);
      modal.show();
    };

    const openEditModal = (anime: Anime) => {
      animeStore.setSelectedAnime(anime); // Asegura que el anime seleccionado se guarda correctamente
      const modalElement = document.getElementById("animeModal")!;
      const modal = new Modal(modalElement);
      modal.show();
    };

    const saveAnime = () => {
      if (animeStore.isEditMode) {
        animeStore.updateAnime(animeStore.selectedAnime);
      } else {
        animeStore.addAnime(animeStore.selectedAnime);
      }

      const modalElement = document.getElementById("animeModal")!;
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    };

    const openDeleteModal = (id: number) => {
      animeStore.selectedAnimeId = id;
      const modalElement = document.getElementById("deleteModal")!;
      const modal = new Modal(modalElement);
      modal.show();
    };

    const deleteAnime = () => {
      animeStore.deleteAnime(animeStore.selectedAnimeId);
      const modalElement = document.getElementById("deleteModal")!;
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    };

    const closeModal = () => {
      const modalElement = document.getElementById("animeModal")!;
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    };

    const getClasificacion = (id: number) => {
      const clasificaciones = {
        1: "PG-13",
        2: "R-18",
        // Agrega más clasificaciones si es necesario
      };
      return clasificaciones[id] || "Desconocida";
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      animeStore.fetchAnimes().then(() => {
        console.log(animeStore.animes); // Verifica si los datos están llegando
      });
    });

    return {
      animeStore,
      currentPage,
      totalPages,
      paginatedAnimes,
      handlePageChange,
      openAddModal,
      openEditModal,
      saveAnime,
      openDeleteModal,
      deleteAnime,
      closeModal,
      getClasificacion,
      formatDate,
      truncateText,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/AnimeList.css";
</style>