import { defineStore } from "pinia";
import Swal from "sweetalert2";

export const useGeneroStore = defineStore("genero", {
  state: () => ({
    generos: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchGeneros() {
      this.isLoading = true;
      try {
        const response = await fetch("https://localhost:3000/api/generos");
        this.generos = await response.json();
      } catch (error) {
        console.error("Error al cargar géneros:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los géneros.",
        });
      } finally {
        this.isLoading = false;
      }
    },

    addGenero(genero: any) {
      this.generos.push({ ...genero, id: Date.now() });
      Swal.fire({
        icon: "success",
        title: "Género añadido",
        text: "El género ha sido añadido correctamente.",
      });
    },

    updateGenero(updatedGenero: any) {
      const index = this.generos.findIndex(
        (genero) => genero.id === updatedGenero.id
      );
      if (index !== -1) {
        this.generos[index] = updatedGenero;
        Swal.fire({
          icon: "success",
          title: "Género actualizado",
          text: "El género ha sido actualizado correctamente.",
        });
      }
    },

    deleteGenero(id: number) {
      this.generos = this.generos.filter((genero) => genero.id !== id);
      Swal.fire({
        icon: "success",
        title: "Género eliminado",
        text: "El género ha sido eliminado correctamente.",
      });
    },
  },
});
