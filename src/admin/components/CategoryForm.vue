<template>
  <div>
    <h2>{{ isEditMode ? "Editar Categoría" : "Agregar Categoría" }}</h2>
    <form @submit.prevent="saveCategory">
      <div class="form-group mb-3">
        <label for="categoryName" class="form-label"
          >Nombre de la Categoría</label
        >
        <input
          type="text"
          id="categoryName"
          v-model="category.nombre"
          class="form-control"
          placeholder="Ingrese el nombre de la categoría"
          required
        />
      </div>
      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-agregar">
          {{ isEditMode ? "Guardar Cambios" : "Agregar Categoría" }}
        </button>
        <button type="button" class="btn btn-secondary ms-2" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useCategoryStore } from "../store/categoryStore";

export default defineComponent({
  name: "CategoryForm",
  props: {
    initialCategory: {
      type: Object,
      required: false,
      default: () => ({ nombre: "" }),
    },
  },
  setup(props, { emit }) {
    const store = useCategoryStore();
    const category = ref({ ...props.initialCategory });
    const isEditMode = ref(!!props.initialCategory.id);

    // Watch for changes in initialCategory to update the local state
    watch(
      () => props.initialCategory,
      (newCategory) => {
        category.value = { ...newCategory };
        isEditMode.value = !!newCategory.id;
      }
    );

    const saveCategory = async () => {
      try {
        if (isEditMode.value) {
          await store.updateCategory(category.value);
        } else {
          await store.addCategory(category.value);
        }
        emit("save");
      } catch (error) {
        console.error("Error al guardar la categoría:", error);
      }
    };

    const cancel = () => {
      emit("cancel");
    };

    return {
      category,
      isEditMode,
      saveCategory,
      cancel,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/CategoryList.css";
</style>