import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useClasificacionEdadStore = defineStore("clasificacionEdad", {
  state: () => ({
    clasificaciones: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchClasificacionesEdad() {
      this.isLoading = true;
      try {
        const response = await fetch("https://localhost:3000/api/clasificacion_edad");
        this.clasificaciones = await response.json();
      } catch (error) {
        console.error("Error al cargar clasificaciones por edad:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las clasificaciones por edad.",
        });
      } finally {
        this.isLoading = false;
      }
    },

    addClasificacionEdad(clasificacion: any) {
      this.clasificaciones.push({ ...clasificacion, id: Date.now() });
      Swal.fire({
        icon: "success",
        title: "Clasificación añadida",
        text: "La clasificación ha sido añadida correctamente.",
      });
    },

    updateClasificacionEdad(updatedClasificacion: any) {
      const index = this.clasificaciones.findIndex(
        (clasificacion) => clasificacion.id === updatedClasificacion.id
      );
      if (index !== -1) {
        this.clasificaciones[index] = updatedClasificacion;
        Swal.fire({
          icon: "success",
          title: "Clasificación actualizada",
          text: "La clasificación ha sido actualizada correctamente.",
        });
      }
    },

    deleteClasificacionEdad(id: number) {
      this.clasificaciones = this.clasificaciones.filter(
        (clasificacion) => clasificacion.id !== id
      );
      Swal.fire({
        icon: "success",
        title: "Clasificación eliminada",
        text: "La clasificación ha sido eliminada correctamente.",
      });
    },
  },
});
