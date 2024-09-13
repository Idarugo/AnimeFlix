<template>
  <div>
    <h2>{{ isEditing ? "Editar Trabajador" : "Añadir Trabajador" }}</h2>
    <form @submit.prevent="saveTrabajador">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input
          v-model="trabajador.nombre"
          id="nombre"
          type="text"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          v-model="trabajador.email"
          id="email"
          type="email"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña:</label>
        <input
          v-model="trabajador.password"
          id="password"
          type="password"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="rol" class="form-label">Rol:</label>
        <select v-model="trabajador.rol" id="rol" class="form-select" required>
          <option value="admin">Admin</option>
          <option value="moderador">Moderador</option>
        </select>
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditing ? "Guardar Cambios" : "Añadir" }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useTrabajadoresStore } from "../store/trabajadoresStore.ts";

export default defineComponent({
  name: "TrabajadoresForm",
  props: {
    initialTrabajador: {
      type: Object,
      required: false,
      default: () => ({ nombre: "", email: "", password: "", rol: "admin" }),
    },
  },
  setup(props, { emit }) {
    const store = useTrabajadoresStore();
    const trabajador = ref({ ...props.initialTrabajador });
    const isEditing = computed(() => !!trabajador.value.id);

    const saveTrabajador = () => {
      if (isEditing.value) {
        store.updateTrabajador(trabajador.value);
      } else {
        store.addTrabajador(trabajador.value);
      }
      emit("save");
    };

    return {
      trabajador,
      isEditing,
      saveTrabajador,
    };
  },
});
</script>
  

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/trabajadoresList.css";
</style>
  