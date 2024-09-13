import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useSeasonStore = defineStore('season', {
  state: () => ({
    seasons: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchSeasons() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/temporadas');
        this.seasons = await response.json();
      } catch (error) {
        console.error('Error al cargar temporadas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las temporadas.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSeasonsAdmin() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/temporadas/admin/');
        this.seasons = await response.json();
      } catch (error) {
        console.error('Error al cargar temporadas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las temporadas.',
        });
      } finally {
        this.isLoading = false;
      }
    },



    async addSeason(season: any) {
      try {
        const response = await fetch('http://localhost:3000/api/temporadas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(season),
        });
        const data = await response.json();
        this.seasons.push({ ...season, id: data.id });
        Swal.fire({
          icon: 'success',
          title: 'Temporada añadida',
          text: 'La temporada ha sido añadida correctamente.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir la temporada.',
        });
      }
    },

    async updateSeason(updatedSeason: any) {
      try {
        const response = await fetch(`http://localhost:3000/api/temporadas/${updatedSeason.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSeason),
        });
        if (response.ok) {
          const index = this.seasons.findIndex(season => season.id === updatedSeason.id);
          if (index !== -1) {
            this.seasons[index] = updatedSeason;
            Swal.fire({
              icon: 'success',
              title: 'Temporada actualizada',
              text: 'La temporada ha sido actualizada correctamente.',
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la temporada.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la temporada.',
        });
      }
    },

    async deleteSeason(id: number) {
      try {
        const response = await fetch(`http://localhost:3000/api/temporadas/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.seasons = this.seasons.filter(season => season.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Temporada eliminada',
            text: 'La temporada ha sido eliminada correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la temporada.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la temporada.',
        });
      }
    },
  },
});