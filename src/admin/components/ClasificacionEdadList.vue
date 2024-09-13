<template>
  <div class="container">
    <h2 class="text-center">Lista de Clasificación por Edad</h2>
    <button class="btn btn-primary mb-3" @click="openAddForm">
      Agregar Clasificación
    </button>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clasificacion in clasificaciones" :key="clasificacion.id">
          <td>{{ clasificacion.nombre }}</td>
          <td>{{ clasificacion.descripcion }}</td>
          <td class="text-center">
            <button
              class="btn btn-success btn-sm me-2"
              @click="openEditForm(clasificacion)"
            >
              Editar
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteClasificacion(clasificacion.id)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para Agregar/Editar Clasificación -->
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
              {{
                isEditMode ? "Editar Clasificación" : "Agregar Clasificación"
              }}
            </h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <ClasificacionEdadForm
              :initialClasificacion="selectedClasificacion"
              @save="closeForm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ClasificacionEdadForm from "./ClasificacionEdadForm.vue";
import { useClasificacionEdadStore } from "../store/clasificacionEdadStore";

export default defineComponent({
  name: "ClasificacionEdadList",
  components: {
    ClasificacionEdadForm,
  },
  setup() {
    const clasificacionEdadStore = useClasificacionEdadStore();
    const showFormModal = ref(false);
    const selectedClasificacion = ref({ nombre: "", descripcion: "" });
    const isEditMode = ref(false);

    onMounted(() => {
      clasificacionEdadStore.fetchClasificacionesEdad();
    });

    const openAddForm = () => {
      selectedClasificacion.value = { nombre: "", descripcion: "" };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (clasificacion: any) => {
      selectedClasificacion.value = { ...clasificacion };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const deleteClasificacion = (id: number) => {
      clasificacionEdadStore.deleteClasificacionEdad(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    return {
      clasificaciones: clasificacionEdadStore.clasificaciones,
      showFormModal,
      selectedClasificacion,
      isEditMode,
      openAddForm,
      openEditForm,
      deleteClasificacion,
      closeForm,
    };
  },
});
</script>
  
  <style scoped>
/* Estilos específicos para la lista de clasificaciones por edad */
</style>
  