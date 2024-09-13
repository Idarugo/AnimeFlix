<template>
  <div class="container">
    <h2 class="text-center">Lista de Géneros</h2>
    <button class="btn btn-primary mb-3" @click="openAddForm">
      Agregar Género
    </button>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Nombre</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genero in generos" :key="genero.id">
          <td>{{ genero.nombre }}</td>
          <td class="text-center">
            <button
              class="btn btn-success btn-sm me-2"
              @click="openEditForm(genero)"
            >
              Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteGenero(genero.id)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para Agregar/Editar Género -->
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
              {{ isEditMode ? "Editar Género" : "Agregar Género" }}
            </h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <GeneroForm :initialGenero="selectedGenero" @save="closeForm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import GeneroForm from "./GeneroForm.vue";
import { useGeneroStore } from "../store/generoStore";

export default defineComponent({
  name: "GeneroList",
  components: {
    GeneroForm,
  },
  setup() {
    const generoStore = useGeneroStore();
    const showFormModal = ref(false);
    const selectedGenero = ref({ nombre: "" });
    const isEditMode = ref(false);

    onMounted(() => {
      generoStore.fetchGeneros();
    });

    const openAddForm = () => {
      selectedGenero.value = { nombre: "" };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (genero: any) => {
      selectedGenero.value = { ...genero };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const deleteGenero = (id: number) => {
      generoStore.deleteGenero(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    return {
      generos: generoStore.generos,
      showFormModal,
      selectedGenero,
      isEditMode,
      openAddForm,
      openEditForm,
      deleteGenero,
      closeForm,
    };
  },
});
</script>
  
  <style scoped>
/* Estilos específicos para la lista de géneros */
</style>
  