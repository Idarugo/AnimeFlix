import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await fetch('https://localhost:3000/api/categorias');
        this.categories = await response.json();
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addCategory(category: any) {
      try {
        const response = await fetch('https://localhost:3000/api/categorias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(category),
        });

        if (response.ok) {
          const newCategory = await response.json();
          this.categories.push({ ...category, id: newCategory.id });
          Swal.fire({
            icon: 'success',
            title: 'Categoría añadida',
            text: 'La categoría ha sido añadida correctamente.',
          });
        } else {
          throw new Error('No se pudo añadir la categoría');
        }
      } catch (error) {
        console.error('Error al añadir categoría:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir la categoría.',
        });
      }
    },

    async updateCategory(updatedCategory: any) {
      try {
        const response = await fetch(`https://localhost:3000/api/categorias/${updatedCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCategory),
        });

        if (response.ok) {
          const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
            Swal.fire({
              icon: 'success',
              title: 'Categoría actualizada',
              text: 'La categoría ha sido actualizada correctamente.',
            });
          }
        } else {
          throw new Error('No se pudo actualizar la categoría');
        }
      } catch (error) {
        console.error('Error al actualizar categoría:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la categoría.',
        });
      }
    },

    async deleteCategory(id: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/categorias/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.categories = this.categories.filter(cat => cat.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Categoría eliminada',
            text: 'La categoría ha sido eliminada correctamente.',
          });
        } else {
          throw new Error('No se pudo eliminar la categoría');
        }
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la categoría.',
        });
      }
    },
  },
});