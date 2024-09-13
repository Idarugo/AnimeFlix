<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Series</h2>
      <button @click="openAddForm" class="btn btn-agregar mb-2">
        Añadir Serie
      </button>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="serie in series" :key="serie.id">
            <td>{{ serie.titulo }}</td>
            <td>{{ serie.descripcion }}</td>
            <td>
              <button
                @click="openEditForm(serie)"
                class="btn btn-success btn-sm me-2"
              >
                Editar
              </button>
              <button
                @click="confirmDeleteSeries(serie.id)"
                class="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="series.length === 0">
            <td colspan="3" class="text-center">No hay series disponibles.</td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para Agregar/Editar Serie -->
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
                {{ isEditMode ? "Editar Serie" : "Agregar Serie" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <SeriesForm
                :initialSeries="selectedSeries"
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
import { defineComponent, ref, onMounted } from "vue";
import SeriesForm from "./SeriesForm.vue";
import { useSeriesStore } from "../store/seriesStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "SeriesList",
  components: {
    SeriesForm,
  },
  setup() {
    const store = useSeriesStore();
    const showFormModal = ref(false);
    const selectedSeries = ref({ titulo: "", descripcion: "", anime_id: null });
    const isEditMode = ref(false);

    onMounted(() => {
      store.fetchSeriesAdmin();
    });

    const openAddForm = () => {
      selectedSeries.value = { titulo: "", descripcion: "", anime_id: null };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (serie: any) => {
      selectedSeries.value = { ...serie };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const confirmDeleteSeries = (id: number) => {
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
          deleteSeries(id);
          Swal.fire(
            "Eliminada",
            "La serie ha sido eliminada correctamente.",
            "success"
          );
        }
      });
    };

    const deleteSeries = (id: number) => {
      store.deleteSeries(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value ? "Serie actualizada" : "Serie añadida",
        text: isEditMode.value
          ? "La serie ha sido actualizada correctamente."
          : "La serie ha sido añadida correctamente.",
      });
    };

    return {
      series: store.series,
      showFormModal,
      selectedSeries,
      isEditMode,
      openAddForm,
      openEditForm,
      confirmDeleteSeries,
      deleteSeries,
      closeForm,
      handleSave,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/SeriesList.css";
</style>