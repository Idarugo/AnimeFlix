<template>
  <main>
    <div class="container">
      <h2 class="text-center">Lista de Categorías</h2>

      <ul class="list-group">
        <li
          v-for="category in paginatedCategories"
          :key="category.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ category.nombre }}
          <div>
            <button
              @click="openEditForm(category)"
              class="btn btn-success btn-sm me-2"
            >
              Editar
            </button>
            <button
              @click="confirmDeleteCategory(category.id)"
              class="btn btn-danger btn-sm"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />

      <button @click="openAddForm" class="btn btn-agregar mt-3">
        Añadir Categoría
      </button>

      <!-- Modal para Agregar/Editar Categoría -->
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
                {{ isEditMode ? "Editar Categoría" : "Agregar Categoría" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <CategoryForm
                :initialCategory="selectedCategory"
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
import { defineComponent, ref, computed, onMounted } from "vue";
import CategoryForm from "./CategoryForm.vue";
import Pagination from "./Pagination.vue"; // Importar componente de paginación
import { useCategoryStore } from "../store/categoryStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "CategoryList",
  components: {
    CategoryForm,
    Pagination, // Registrar componente de paginación
  },
  setup() {
    const store = useCategoryStore();
    const showFormModal = ref(false);
    const selectedCategory = ref({ nombre: "" });
    const isEditMode = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    onMounted(() => {
      store.fetchCategories();
    });

    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return store.categories.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(store.categories.length / itemsPerPage.value);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    const openAddForm = () => {
      selectedCategory.value = { nombre: "" };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (category: any) => {
      selectedCategory.value = { ...category };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value ? "Categoría actualizada" : "Categoría añadida",
        text: isEditMode.value
          ? "La categoría ha sido actualizada correctamente."
          : "La categoría ha sido añadida correctamente.",
      });
    };

    const confirmDeleteCategory = (id: number) => {
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
          deleteCategory(id);
          Swal.fire(
            "Eliminada",
            "La categoría ha sido eliminada correctamente.",
            "success"
          );
        }
      });
    };

    const deleteCategory = (id: number) => {
      store.deleteCategory(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    return {
      categories: store.categories,
      paginatedCategories,
      totalPages,
      currentPage,
      showFormModal,
      selectedCategory,
      isEditMode,
      openAddForm,
      openEditForm,
      handleSave,
      confirmDeleteCategory,
      closeForm,
      handlePageChange,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/CategoryList.css";
</style>