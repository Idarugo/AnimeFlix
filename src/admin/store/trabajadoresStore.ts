import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useTrabajadoresStore = defineStore('trabajadores', {
  state: () => ({
    trabajadores: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchTrabajadores() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/trabajadores');
        this.trabajadores = await response.json();
      } catch (error) {
        console.error('Error al cargar trabajadores:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los trabajadores.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addTrabajador(trabajador: any) {
      try {
        const response = await fetch('http://localhost:3000/api/trabajadores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trabajador),
        });
        const data = await response.json();
        this.trabajadores.push({ ...trabajador, id: data.id });
        Swal.fire({
          icon: 'success',
          title: 'Trabajador añadido',
          text: 'El trabajador ha sido añadido correctamente.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir el trabajador.',
        });
      }
    },

    async updateTrabajador(updatedTrabajador: any) {
      try {
        const response = await fetch(`http://localhost:3000/api/trabajadores/${updatedTrabajador.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTrabajador),
        });
        if (response.ok) {
          const index = this.trabajadores.findIndex(trabajador => trabajador.id === updatedTrabajador.id);
          if (index !== -1) {
            this.trabajadores[index] = updatedTrabajador;
            Swal.fire({
              icon: 'success',
              title: 'Trabajador actualizado',
              text: 'El trabajador ha sido actualizado correctamente.',
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el trabajador.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el trabajador.',
        });
      }
    },

    async deleteTrabajador(id: number) {
      try {
        const response = await fetch(`http://localhost:3000/api/trabajadores/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.trabajadores = this.trabajadores.filter(trabajador => trabajador.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Trabajador eliminado',
            text: 'El trabajador ha sido eliminado correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el trabajador.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el trabajador.',
        });
      }
    },
  },
});
