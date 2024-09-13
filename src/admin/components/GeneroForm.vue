<template>
  <div>
    <h2>{{ isEditMode ? "Editar Género" : "Agregar Género" }}</h2>
    <form @submit.prevent="saveGenero">
      <div class="form-group">
        <label for="nombre">Nombre del Género:</label>
        <input
          type="text"
          v-model="genero.nombre"
          id="nombre"
          class="form-control"
          required
        />
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditMode ? "Guardar Cambios" : "Agregar Género" }}
        </button>
        <button type="button" class="btn btn-secondary" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref } from "vue";
import { useGeneroStore } from "../store/generoStore";

export default defineComponent({
  name: "GeneroForm",
  props: {
    initialGenero: {
      type: Object,
      required: false,
      default: () => ({ nombre: "" }),
    },
  },
  setup(props, { emit }) {
    const generoStore = useGeneroStore();
    const genero = ref({ ...props.initialGenero });
    const isEditMode = ref(!!props.initialGenero.id);

    const saveGenero = () => {
      if (isEditMode.value) {
        generoStore.updateGenero(genero.value);
      } else {
        generoStore.addGenero(genero.value);
      }
      emit("save");
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      genero,
      isEditMode,
      saveGenero,
      cancel,
    };
  },
});
</script>
  
  <style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
  