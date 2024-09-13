import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useHistorialStore = defineStore('historial', {
  state: () => ({
    historial: [] as any[],
    isLoading: false,
    selectedHistorialId: null as number | null, // ID del historial seleccionado para eliminar
  }),
  actions: {
    async fetchHistorial() {
      this.isLoading = true;
      try {
        const response = await fetch('https://localhost:3000/api/historial/1'); // Cambia el ID de usuario según sea necesario
        this.historial = await response.json();
      } catch (error) {
        console.error('Error al cargar el historial:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el historial.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async deleteHistorial(id: number) {
      try {
        // Aquí deberías implementar la lógica para eliminar el registro del historial
        this.historial = this.historial.filter(item => item.id !== id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El registro del historial ha sido eliminado correctamente.',
        });
      } catch (error) {
        console.error('Error al eliminar el historial:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el registro del historial.',
        });
      }
    },
  },
});
