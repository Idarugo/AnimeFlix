<template>
  <main>
    <div class="container">
      <h1>Gestión de Reseñas</h1>
      <h2 class="text-center">Lista de Reseñas</h2>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th>Anime</th>
            <th>Usuario</th>
            <th>Calificación</th>
            <th>Comentario</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="resenaStore.resenas.length === 0">
            <td colspan="5" class="text-center">No hay reseñas disponibles.</td>
          </tr>
          <tr v-else v-for="resena in resenaStore.resenas" :key="resena.id">
            <td>{{ resena.anime_titulo }}</td>
            <td>{{ resena.usuario_nombre }}</td>
            <td>{{ resena.calificacion }}</td>
            <td>{{ resena.comentario }}</td>
            <td class="text-center">
              <button
                class="btn btn-eliminar btn-sm"
                @click="openDeleteModal(resena.id)"
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
              ¿Estás seguro de que deseas eliminar esta reseña?
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
                @click="deleteResena"
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
import { Modal } from "bootstrap";
import { useResenaStore } from "../store/resenaStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "ResenaList",
  setup() {
    const resenaStore = useResenaStore();

    onMounted(() => {
      resenaStore.fetchResenas();
    });

    const openDeleteModal = (id: number) => {
      resenaStore.selectedResenaId = id;
      const modalElement = document.getElementById("deleteModal")!;
      const modal = new Modal(modalElement);
      modal.show();
    };

    const deleteResena = () => {
      resenaStore.deleteResena(resenaStore.selectedResenaId);
      const modalElement = document.getElementById("deleteModal")!;
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    };

    return {
      resenaStore,
      openDeleteModal,
      deleteResena,
    };
  },
});
</script>
  
  <style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/ResenaList.css";
</style>
  