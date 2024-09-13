import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

interface Anime {
  id?: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  clasificacion_edad_id: number | null;
}

export const useAnimeStore = defineStore('anime', {
  state: () => ({
    animes: [] as Anime[],
    selectedAnime: null as Anime | null,
    isEditMode: false,
  }),
  actions: {
    setSelectedAnime(anime: Anime | null) {
      this.selectedAnime = anime ? { ...anime } : null;
      this.isEditMode = !!anime;
    },
    async fetchAnimes() {
      try {
        const response = await fetch('https://localhost:3000/api/animes');
        this.animes = await response.json();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los animes.' });
      }
    },
    async addAnime(formData: FormData) {
      try {
        const response = await fetch('https://localhost:3000/api/animes', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al crear anime');
        }

        const newAnime = await response.json();
        this.animes.push(newAnime);
        Swal.fire('Éxito', 'Anime creado exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al crear el anime', 'error');
        console.error('Error al crear anime:', error);
      }
    },
    async updateAnime(id: number, formData: FormData) {
      try {
        const response = await fetch(`https://localhost:3000/api/animes/${id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al actualizar anime');
        }

        const updatedAnime = await response.json();
        const index = this.animes.findIndex(anime => anime.id === id);
        if (index !== -1) {
          this.animes[index] = updatedAnime;
        }
        Swal.fire('Éxito', 'Anime actualizado exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al actualizar el anime', 'error');
        console.error('Error al actualizar anime:', error);
      }
    },
    async deleteAnime(id: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/animes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar anime');
        }

        this.animes = this.animes.filter(anime => anime.id !== id);
        Swal.fire('Éxito', 'Anime eliminado exitosamente', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar el anime', 'error');
        console.error('Error al eliminar anime:', error);
      }
    },
  },
});