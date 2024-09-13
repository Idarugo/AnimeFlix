<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Temporadas</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Número</th>
            <th scope="col">Serie</th>
            <th scope="col">Anime</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedSeasons.length === 0">
            <td colspan="5" class="text-center">
              No hay temporadas disponibles.
            </td>
          </tr>
          <tr v-else v-for="season in paginatedSeasons" :key="season.id">
            <td>{{ season.titulo }}</td>
            <td>Temporada {{ season.numero_temporada }}</td>
            <td>{{ season.serie_titulo }}</td>
            <td>{{ season.anime_titulo }}</td>
            <td>
              <button
                @click="openEditForm(season)"
                class="btn btn-success btn-sm me-2"
              >
                Editar
              </button>
              <button
                @click="confirmDeleteSeason(season.id)"
                class="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />

      <button @click="openAddForm" class="btn btn-agregar mb-2">
        Añadir Temporada
      </button>

      <!-- Modal para Agregar/Editar Temporada -->
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
                {{ isEditMode ? "Editar Temporada" : "Agregar Temporada" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <SeasonForm
                :initialSeason="selectedSeason"
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
import SeasonForm from "./SeasonForm.vue";
import { useSeasonStore } from "../store/seasonStore";
import Pagination from "./Pagination.vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "SeasonList",
  components: {
    Pagination,
    SeasonForm,
  },
  setup() {
    const store = useSeasonStore();
    const showFormModal = ref(false);
    const selectedSeason = ref({
      id: null,
      serie_id: null,
      numero_temporada: 1,
      titulo: "",
      descripcion: "",
      imagen_url: "",
    });
    const isEditMode = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    const totalPages = computed(() => {
      return Math.ceil(store.seasons.length / itemsPerPage.value);
    });

    const paginatedSeasons = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return store.seasons.slice(start, end);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    onMounted(() => {
      store.fetchSeasonsAdmin();
    });

    const openAddForm = () => {
      selectedSeason.value = {
        id: null,
        serie_id: null,
        numero_temporada: 1,
        titulo: "",
        descripcion: "",
        imagen_url: "",
      };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (season: any) => {
      selectedSeason.value = { ...season };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const confirmDeleteSeason = (id: number) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteSeason(id);
          Swal.fire(
            "Eliminada",
            "La temporada ha sido eliminada correctamente.",
            "success"
          );
        }
      });
    };

    const deleteSeason = (id: number) => {
      store.deleteSeason(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value ? "Temporada actualizada" : "Temporada añadida",
        text: isEditMode.value
          ? "La temporada ha sido actualizada correctamente."
          : "La temporada ha sido añadida correctamente.",
      });
    };

    return {
      seasons: store.seasons,
      paginatedSeasons,
      currentPage,
      totalPages,
      showFormModal,
      selectedSeason,
      isEditMode,
      openAddForm,
      openEditForm,
      confirmDeleteSeason,
      deleteSeason,
      closeForm,
      handleSave,
      handlePageChange,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/SeasonList.css";
</style>