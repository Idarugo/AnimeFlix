import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    animes: [] as any[], 
    categories: [] as any[], 
    launches: [] as any[], 
    series: [] as any[], 
    episodes: [] as any[], // Lista de capítulos
    seasons: [] as any[], // Lista de temporadas
    isLoading: false, 
  }),
  actions: {
    // Cargar animes desde una API o base de datos
    async fetchAnimes() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/animes');
        this.animes = await response.json();
      } catch (error) {
        console.error('Error al cargar animes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los animes.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    // Cargar categorías
    async fetchCategories() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/categories');
        this.categories = await response.json();
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    // Añadir una nueva categoría
    addCategory(category: any) {
      this.categories.push({ ...category, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Categoría añadida',
        text: 'La categoría ha sido añadida correctamente.',
      });
    },

    // Actualizar una categoría existente
    updateCategory(updatedCategory: any) {
      const index = this.categories.findIndex(category => category.id === updatedCategory.id);
      if (index !== -1) {
        this.categories[index] = updatedCategory;
        Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'La categoría ha sido actualizada correctamente.',
        });
      }
    },

    // Eliminar una categoría
    deleteCategory(id: number) {
      this.categories = this.categories.filter(category => category.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada',
        text: 'La categoría ha sido eliminada correctamente.',
      });
    },

    // Cargar lanzamientos
    async fetchLaunches() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/launches');
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

    // Añadir un nuevo lanzamiento
    addLaunch(launch: any) {
      this.launches.push({ ...launch, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Lanzamiento añadido',
        text: 'El lanzamiento ha sido añadido correctamente.',
      });
    },

    // Actualizar un lanzamiento existente
    updateLaunch(updatedLaunch: any) {
      const index = this.launches.findIndex(launch => launch.id === updatedLaunch.id);
      if (index !== -1) {
        this.launches[index] = updatedLaunch;
        Swal.fire({
          icon: 'success',
          title: 'Lanzamiento actualizado',
          text: 'El lanzamiento ha sido actualizado correctamente.',
        });
      }
    },

    // Eliminar un lanzamiento
    deleteLaunch(id: number) {
      this.launches = this.launches.filter(launch => launch.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Lanzamiento eliminado',
        text: 'El lanzamiento ha sido eliminado correctamente.',
      });
    },

    // Cargar series
    async fetchSeries() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/series');
        this.series = await response.json();
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

    // Añadir una nueva serie
    addSeries(series: any) {
      this.series.push({ ...series, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Serie añadida',
        text: 'La serie ha sido añadida correctamente.',
      });
    },

    // Actualizar una serie existente
    updateSeries(updatedSeries: any) {
      const index = this.series.findIndex(series => series.id === updatedSeries.id);
      if (index !== -1) {
        this.series[index] = updatedSeries;
        Swal.fire({
          icon: 'success',
          title: 'Serie actualizada',
          text: 'La serie ha sido actualizada correctamente.',
        });
      }
    },

    // Eliminar una serie
    deleteSeries(id: number) {
      this.series = this.series.filter(series => series.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Serie eliminada',
        text: 'La serie ha sido eliminada correctamente.',
      });
    },

    // Cargar capítulos desde una API o base de datos
    async fetchEpisodes() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/episodes');
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

    // Añadir un nuevo capítulo
    addEpisode(episode: any) {
      this.episodes.push({ ...episode, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Capítulo añadido',
        text: 'El capítulo ha sido añadido correctamente.',
      });
    },

    // Actualizar un capítulo existente
    updateEpisode(updatedEpisode: any) {
      const index = this.episodes.findIndex(episode => episode.id === updatedEpisode.id);
      if (index !== -1) {
        this.episodes[index] = updatedEpisode;
        Swal.fire({
          icon: 'success',
          title: 'Capítulo actualizado',
          text: 'El capítulo ha sido actualizado correctamente.',
        });
      }
    },

    // Eliminar un capítulo
    deleteEpisode(id: number) {
      this.episodes = this.episodes.filter(episode => episode.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Capítulo eliminado',
        text: 'El capítulo ha sido eliminado correctamente.',
      });
    },

    // Cargar temporadas desde una API o base de datos
    async fetchSeasons() {
      this.isLoading = true;
      try {
        const response = await fetch('/api/seasons');
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

    // Añadir una nueva temporada
    addSeason(season: any) {
      this.seasons.push({ ...season, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Temporada añadida',
        text: 'La temporada ha sido añadida correctamente.',
      });
    },

    // Actualizar una temporada existente
    updateSeason(updatedSeason: any) {
      const index = this.seasons.findIndex(season => season.id === updatedSeason.id);
      if (index !== -1) {
        this.seasons[index] = updatedSeason;
        Swal.fire({
          icon: 'success',
          title: 'Temporada actualizada',
          text: 'La temporada ha sido actualizada correctamente.',
        });
      }
    },

    // Eliminar una temporada
    deleteSeason(id: number) {
      this.seasons = this.seasons.filter(season => season.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Temporada eliminada',
        text: 'La temporada ha sido eliminada correctamente.',
      });
    },

    // Añadir un nuevo anime
    addAnime(anime: any) {
      this.animes.push({ ...anime, id: Date.now() });
      Swal.fire({
        icon: 'success',
        title: 'Anime añadido',
        text: 'El anime ha sido añadido correctamente.',
      });
    },

    // Actualizar un anime existente
    updateAnime(updatedAnime: any) {
      const index = this.animes.findIndex(anime => anime.id === updatedAnime.id);
      if (index !== -1) {
        this.animes[index] = updatedAnime;
        Swal.fire({
          icon: 'success',
          title: 'Anime actualizado',
          text: 'El anime ha sido actualizado correctamente.',
        });
      }
    },

    // Eliminar un anime
    deleteAnime(id: number) {
      this.animes = this.animes.filter(anime => anime.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Anime eliminado',
        text: 'El anime ha sido eliminado correctamente.',
      });
    },
  },
});