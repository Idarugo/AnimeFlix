import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useResenaStore = defineStore('resena', {
  state: () => ({
    resenas: [] as any[],
    isLoading: false,
    selectedResenaId: null as number | null, // Para manejar el ID de la reseña seleccionada para eliminar
  }),
  actions: {
    async fetchResenas() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/resenas');
        this.resenas = await response.json();
      } catch (error) {
        console.error('Error al cargar reseñas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las reseñas.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async deleteResena(id: number) {
      try {
        await fetch(`http://localhost:3000/api/resenas/${id}`, {
          method: 'DELETE',
        });
        this.resenas = this.resenas.filter(resena => resena.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Reseña eliminada',
          text: 'La reseña ha sido eliminada correctamente.',
        });
      } catch (error) {
        console.error('Error al eliminar reseña:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reseña.',
        });
      }
    },
  },
});
