<template>
  <div>
    <h2>{{ isEditMode ? "Editar Clasificación" : "Agregar Clasificación" }}</h2>
    <form @submit.prevent="saveClasificacion">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          v-model="clasificacion.nombre"
          id="nombre"
          class="form-control"
          required
        />
      </div>
      <div class="form-group mt-3">
        <label for="descripcion">Descripción:</label>
        <textarea
          v-model="clasificacion.descripcion"
          id="descripcion"
          class="form-control"
          required
        ></textarea>
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditMode ? "Guardar Cambios" : "Agregar Clasificación" }}
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
import { useClasificacionEdadStore } from "../store/clasificacionEdadStore";

export default defineComponent({
  name: "ClasificacionEdadForm",
  props: {
    initialClasificacion: {
      type: Object,
      required: false,
      default: () => ({ nombre: "", descripcion: "" }),
    },
  },
  setup(props, { emit }) {
    const clasificacionEdadStore = useClasificacionEdadStore();
    const clasificacion = ref({ ...props.initialClasificacion });
    const isEditMode = ref(!!props.initialClasificacion.id);

    const saveClasificacion = () => {
      if (isEditMode.value) {
        clasificacionEdadStore.updateClasificacionEdad(clasificacion.value);
      } else {
        clasificacionEdadStore.addClasificacionEdad(clasificacion.value);
      }
      emit("save");
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      clasificacion,
      isEditMode,
      saveClasificacion,
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
  