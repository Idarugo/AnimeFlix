import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useEpisodeStore = defineStore('episode', {
  state: () => ({
    episodes: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchEpisodes() {
      this.isLoading = true;
      try {
        const response = await fetch('https://localhost:3000/api/episodios');
        this.episodes = await response.json();
      } catch (error) {
        console.error('Error al cargar episodios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los episodios.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchEpisodesAdmin() {
      this.isLoading = true;
      try {
        const response = await fetch('https://localhost:3000/api/episodios/admin/');
        this.episodes = await response.json();
      } catch (error) {
        console.error('Error al cargar episodios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los episodios.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addEpisode(episode: any) {
      try {
        const response = await fetch('https://localhost:3000/api/episodios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(episode),
        });
        const data = await response.json();
        this.episodes.push({ ...episode, id: data.id });
        Swal.fire({
          icon: 'success',
          title: 'Episodio añadido',
          text: 'El episodio ha sido añadido correctamente.',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir el episodio.',
        });
      }
    },

    async updateEpisode(updatedEpisode: any) {
      console.log("Updating episode with ID:", updatedEpisode.id); // Verificar el ID
      console.log("Data sent to backend:", updatedEpisode); // Verificar los datos enviados
    
      try {
        const response = await fetch(`https://localhost:3000/api/episodios/${updatedEpisode.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Asegúrate de que estás enviando JSON
          },
          body: JSON.stringify(updatedEpisode), // Convertir a JSON
        });
    
        if (response.ok) {
          const index = this.episodes.findIndex(episode => episode.id === updatedEpisode.id);
          if (index !== -1) {
            this.episodes[index] = updatedEpisode;
            Swal.fire({
              icon: 'success',
              title: 'Episodio actualizado',
              text: 'El episodio ha sido actualizado correctamente.',
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el episodio.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el episodio.',
        });
      }
    },
    

    async deleteEpisode(id: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/episodios/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.episodes = this.episodes.filter(episode => episode.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Episodio eliminado',
            text: 'El episodio ha sido eliminado correctamente.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el episodio.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el episodio.',
        });
      }
    },
  },
});