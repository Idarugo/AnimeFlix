<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Lanzamientos</h2>

      <ul class="list-group">
        <li
          v-for="launch in paginatedLaunches"
          :key="launch.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ launch.serie_titulo }} - {{ launch.episodio_titulo }} -
          {{ formatDate(launch.fecha_lanzamiento) }}
          <div>
            <button
              @click="openEditForm(launch)"
              class="btn btn-success btn-sm me-2"
            >
              Editar
            </button>
            <button
              @click="confirmDeleteLaunch(launch.id)"
              class="btn btn-danger btn-sm"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />

      <button @click="openAddForm" class="btn btn-agregar mt-3">
        Añadir Lanzamiento
      </button>

      <!-- Modal para Agregar/Editar Lanzamiento -->
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
                {{ isEditMode ? "Editar Lanzamiento" : "Agregar Lanzamiento" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <LaunchForm
                :initialLaunch="selectedLaunch"
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
import LaunchForm from "./LaunchForm.vue";
import Pagination from "./Pagination.vue";
import { useLaunchStore } from "../store/launchStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "LaunchList",
  components: {
    LaunchForm,
    Pagination,
  },
  setup() {
    const store = useLaunchStore();
    const showFormModal = ref(false);
    const selectedLaunch = ref({
      episodio_id: null,
      fecha_lanzamiento: "",
    });
    const isEditMode = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
      store.fetchLaunchesAdmin();
    });

    const paginatedLaunches = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return store.launches.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(store.launches.length / itemsPerPage.value);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const openAddForm = () => {
      selectedLaunch.value = {
        episodio_id: null,
        fecha_lanzamiento: "",
      };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (launch: any) => {
      selectedLaunch.value = { ...launch };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value
          ? "Lanzamiento actualizado"
          : "Lanzamiento añadido",
        text: isEditMode.value
          ? "El lanzamiento ha sido actualizado correctamente."
          : "El lanzamiento ha sido añadido correctamente.",
      });
    };

    const confirmDeleteLaunch = (id: number) => {
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
          deleteLaunch(id);
          Swal.fire(
            "Eliminado",
            "El lanzamiento ha sido eliminado correctamente.",
            "success"
          );
        }
      });
    };

    const deleteLaunch = (id: number) => {
      store.deleteLaunch(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const formatDate = (dateString: string) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return {
      launches: store.launches,
      paginatedLaunches,
      totalPages,
      currentPage,
      showFormModal,
      selectedLaunch,
      isEditMode,
      openAddForm,
      openEditForm,
      handleSave,
      confirmDeleteLaunch,
      closeForm,
      handlePageChange,
      formatDate,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/LaunchList.css";
</style>