<template>
  <main>
    <div class="container">
      <h2 class="text-center">Historial de Visualización</h2>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Usuario</th>
            <th>Anime</th>
            <th>Fecha Visto</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="historialStore.historial.length === 0">
            <td colspan="4" class="text-center">
              No hay registros disponibles.
            </td>
          </tr>
          <tr
            v-else
            v-for="registro in historialStore.historial"
            :key="registro.id"
          >
            <td>{{ registro.usuario_nombre }}</td>
            <td>{{ registro.anime_titulo }}</td>
            <td>{{ new Date(registro.fecha_visto).toLocaleDateString() }}</td>
            <td class="text-center">
              <button
                class="btn btn-eliminar btn-sm"
                @click="openDeleteModal(registro.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
              ¿Estás seguro de que deseas eliminar este registro del historial?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-cancelar"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-eliminar"
                @click="deleteHistorial"
              >
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
import { defineComponent, onMounted } from "vue";
import { useHistorialStore } from "../store/historialStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "HistorialList",
  setup() {
    const historialStore = useHistorialStore();

    const openDeleteModal = (id: number) => {
      historialStore.selectedHistorialId = id;
      const modalElement = document.getElementById("deleteModal")!;
      const modal = new Modal(modalElement);
      modal.show();
    };

    const deleteHistorial = () => {
      historialStore.deleteHistorial(historialStore.selectedHistorialId);
      const modalElement = document.getElementById("deleteModal")!;
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    };

    onMounted(() => {
      historialStore.fetchHistorial(); // Carga el historial de todos los usuarios
    });

    return {
      historialStore,
      openDeleteModal,
      deleteHistorial,
    };
  },
});
</script>
  
  <style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/HistorialList.css";
</style>
  