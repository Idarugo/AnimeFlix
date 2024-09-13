<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Trabajadores</h2>
      <button @click="openAddForm" class="btn btn-primary mb-3">
        Añadir Trabajador
      </button>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="trabajadores.length === 0">
            <td colspan="4" class="text-center">
              No hay trabajadores disponibles.
            </td>
          </tr>
          <tr v-else v-for="trabajador in trabajadores" :key="trabajador.id">
            <td>{{ trabajador.nombre }}</td>
            <td>{{ trabajador.email }}</td>
            <td>{{ trabajador.rol }}</td>
            <td>
              <button
                @click="openEditForm(trabajador)"
                class="btn btn-success btn-sm me-2"
              >
                Editar
              </button>
              <button
                @click="deleteTrabajador(trabajador.id)"
                class="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal para Agregar/Editar Trabajador -->
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
                {{ isEditMode ? "Editar Trabajador" : "Añadir Trabajador" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <TrabajadoresForm
                :initialTrabajador="selectedTrabajador"
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
import { defineComponent, ref, onMounted, computed } from "vue";
import TrabajadoresForm from "./TrabajadoresForm.vue";
import { useTrabajadoresStore } from "../store/trabajadoresStore.ts";

export default defineComponent({
  name: "TrabajadoresList",
  components: {
    TrabajadoresForm,
  },
  setup() {
    const store = useTrabajadoresStore();
    const showFormModal = ref(false);
    const selectedTrabajador = ref({
      id: null,
      nombre: "",
      email: "",
      password: "",
      rol: "admin",
    });
    const isEditMode = ref(false);

    onMounted(() => {
      store.fetchTrabajadores();
    });

    const openAddForm = () => {
      selectedTrabajador.value = {
        id: null,
        nombre: "",
        email: "",
        password: "",
        rol: "admin",
      };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (trabajador: any) => {
      selectedTrabajador.value = { ...trabajador };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const deleteTrabajador = (id: number) => {
      store.deleteTrabajador(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value
          ? "Trabajador actualizado"
          : "Trabajador añadido",
        text: isEditMode.value
          ? "El trabajador ha sido actualizado correctamente."
          : "El trabajador ha sido añadido correctamente.",
      });
    };

    return {
      trabajadores: store.trabajadores,
      showFormModal,
      selectedTrabajador,
      isEditMode,
      openAddForm,
      openEditForm,
      deleteTrabajador,
      closeForm,
      handleSave,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/trabajadoresList.css";
</style>
