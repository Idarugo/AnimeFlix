import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useLaunchStore = defineStore('launch', {
  state: () => ({
    launches: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchLaunchesAdmin() {
      this.isLoading = true;
      try {
        const response = await fetch('https://localhost:3000/api/lanzamientos/admin/');
        this.launches = await response.json();
      } catch (error) {
        console.error('Error al cargar lanzamientos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los lanzamientos.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addLaunch(launch: any) {
      try {
          const response = await fetch('https://localhost:3000/api/lanzamientos', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(launch),
          });
   
          if (response.ok) {
              await this.fetchLaunchesAdmin(); // Refresca la lista de lanzamientos
              Swal.fire({
                  icon: 'success',
                  title: 'Lanzamiento añadido',
                  text: 'El lanzamiento ha sido añadido correctamente.',
              });
          } else {
              Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo añadir el lanzamiento.',
              });
          }
      } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo añadir el lanzamiento.',
          });
      }
   },   

   updateLaunch: async function (updatedLaunch: any) {
    try {
        const response = await fetch(`https://localhost:3000/api/lanzamientos/${updatedLaunch.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLaunch),
        });

        if (response.ok) {
            const index = this.launches.findIndex(launch => launch.id === updatedLaunch.id);
            if (index !== -1) {
                this.launches[index] = updatedLaunch;
                Swal.fire({
                    icon: 'success',
                    title: 'Lanzamiento actualizado',
                    text: 'El lanzamiento ha sido actualizado correctamente.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el lanzamiento.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el lanzamiento.',
        });
        console.error('Error al actualizar el lanzamiento:', error);
    }
},

async deleteLaunch(id: number) {
  try {
    const response = await fetch(`https://localhost:3000/api/lanzamientos/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      this.launches = this.launches.filter(launch => launch.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Lanzamiento eliminado',
        text: 'El lanzamiento ha sido eliminado correctamente.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el lanzamiento.',
      });
    }
  } catch (error) {
    console.error('Error al eliminar lanzamiento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar el lanzamiento.',
    });
  }
},
  },
});