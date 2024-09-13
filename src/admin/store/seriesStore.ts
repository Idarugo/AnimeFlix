import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useSeriesStore = defineStore('series', {
  state: () => ({
    series: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchSeriesAdmin() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/series/admin/');
        if (!response.ok) {
          throw new Error('Error al obtener las series');
        }
        this.series = await response.json();
        console.log('Series fetched:', this.series); // Verifica aquí los datos
      } catch (error) {
        console.error('Error al cargar series:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las series.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addSeries(series: any) {
      try {
        const response = await fetch('http://localhost:3000/api/series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(series),
        });
        const data = await response.json();
        this.series.push({ ...series, id: data.id });
        Swal.fire({
          icon: 'success',
          title: 'Serie añadida',
          text: 'La serie ha sido añadida correctamente.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir la serie.',
        });
      }
    },

    async updateSeries(updatedSeries: any) {
      try {
        const response = await fetch(`http://localhost:3000/api/series/${updatedSeries.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSeries),
        });
        if (response.ok) {
          const index = this.series.findIndex(series => series.id === updatedSeries.id);
          if (index !== -1) {
            this.series[index] = updatedSeries;
            Swal.fire({
              icon: 'success',
              title: 'Serie actualizada',
              text: 'La serie ha sido actualizada correctamente.',
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la serie.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la serie.',
        });
      }
    },

    async deleteSeries(id: number) {
      try {
        const response = await fetch(`http://localhost:3000/api/series/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.series = this.series.filter(series => series.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Serie eliminada',
            text: 'La serie ha sido eliminada correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la serie.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la serie.',
        });
      }
    },
  },
});