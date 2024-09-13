import { defineStore } from "pinia";
import { watch } from "vue";
import Swal from "sweetalert2";

export interface Genre {
  id: number;
  nombre: string;
}

export interface Anime {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  clasificacion_edad_id: number;
  generos: Genre[];
}

interface Episode {
  id: number;
  temporada_id: number;
  numero_episodio: number;
  titulo: string;
  descripcion: string;
  video_url: string;
  duracion: string;
}

interface Season {
  id: number;
  serie_id: number;
  numero_temporada: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  episodes: Episode[];
}

interface Lanzamiento {
  lanzamiento_id: number;
  episodio_id: number;
  episodio_titulo: string;
  temporada_titulo: string;
  temporada_imagen_url: string;
  serie_titulo: string;
  fecha_lanzamiento: string;
}

interface Review {
  id: number;
  anime_id: number;
  user_id: number;
  calificacion: number;
  comentario: string;
  created_at: string;
  usuario_nombre: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  avatar_id?: number;
  preferences: any;
}

interface Subscription {
  user_id: number;
  plan_id: number;
  fecha_inicio: string;
  fecha_proximo_pago: string;
  tarjeta_ultimos4: string;
}

export const useAnimeStore = defineStore('anime', {
  state: () => ({
    user: {
      id: 0,
      nombre: "",
      email: "",
      avatar_id: null, // Maneja avatar_id en lugar de avatar_url
      preferences: {},
    },
    isAuthenticated: false,
    avatars: [] as Array<{ id: number; nombre: string; url: string }>,
    animes: [] as Anime[],
    plans: [] as Array<{ id: number; nombre: string; descripcion: string; precio: number; duracion_en_meses: number }>,
    subscription: null as Subscription | null,
    metodosPago: [] as Array<{ id: number; nombre: string }>,
    searchResults: [] as Anime[],
    favorites: [] as Anime[],
    recommendations: [] as Anime[],
    userLists: [] as any[],
    watchHistory: [] as any[],
    reviews: {} as Record<number, Review[]>,
    isModalOpen: false,
    selectedAnime: null as Anime | null,
    notifications: [] as { id: number; message: string }[],
    animesPorCategoria: [] as Anime[],
    animesPorGenero: [] as Anime[],
    listas: [] as Anime[],
    historial: [] as any[],
    isLoading: false,
    filters: {
      genre: null as string | null,
      year: null as number | null,
      duration: null as number | null,
      popularity: null as number | null,
    },
    theme: localStorage.getItem('theme') || 'dark',
    lanzamientos: [] as Lanzamiento[],
    seasons: [] as Season[],
    currentSeasonEpisodes: [] as Episode[],
    achievements: [] as any[],
    unlockedAchievements: [] as any[],
  }),

  actions: {
    async fetchAvatars() {
      try {
        const response = await fetch("https://localhost:3000/api/avatars");
        if (!response.ok) throw new Error("Error al cargar avatares");
        
        const avatarsData = await response.json();
    
        // Agregar la URL base al campo de url
        this.avatars = avatarsData.map((avatar: any) => ({
          ...avatar,
          url: `https://localhost:3000${avatar.url}`, // Concatenar la URL base con el path del avatar
        }));
    
        return this.avatars;
      } catch (error) {
        console.error("Error al cargar avatares:", error);
      }
    },
    async fetchUserProfile() {
      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const response = await fetch(`https://localhost:3000/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Error al cargar el perfil del usuario");
          this.user = await response.json(); // Aquí se carga toda la información del usuario
          this.isAuthenticated = true;
        } catch (error) {
          console.error('Error al cargar el perfil del usuario:', error);
          this.logout();
        }
      }
    },    
    async updateAvatar(newAvatarId: number) {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("No se encontró el token de usuario.");
        }

        // Envía avatar_id al servidor
        const response = await fetch(`https://localhost:3000/api/usuarios/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar_id: newAvatarId }), // Envía avatar_id
        });

        if (!response.ok) throw new Error('Error al actualizar el avatar');

        // Actualiza el estado en Pinia
        this.user.avatar_id = newAvatarId;
        this.user.avatar_url = this.avatars.find(avatar => avatar.id === newAvatarId)?.url || this.user.avatar_url;

        Swal.fire({
          title: "Avatar actualizado",
          text: "Tu avatar ha sido actualizado exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar tu avatar.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error('Error al actualizar el avatar:', error);
      }
    },
    async fetchAnimes() {
      this.isLoading = true;
      try {
        const animeResponse = await fetch('https://localhost:3000/api/animes');
        if (!animeResponse.ok) {
          throw new Error('Error en la respuesta de los animes');
        }
        const animeData = await animeResponse.json();
    
        this.animes = animeData.map((anime: any) => ({
          ...anime,
          imagen_url: anime.imagen_url
            ? `https://localhost:3000${anime.imagen_url}`
            : 'https://via.placeholder.com/300',
          clasificacion_edad_nombre: anime.clasificacion_edad_id?.nombre || '',
          clasificacion_edad_descripcion: anime.clasificacion_edad_id?.descripcion || '',
        }));
    
        console.log("Animes cargados:", this.animes);
      } catch (error) {
        console.error('Error al cargar animes', error);
      } finally {
        this.isLoading = false;
      }
    }, 
    searchAnimes(query: string) {
      this.searchResults = this.animes.filter(anime =>
        anime.titulo.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Resultados de búsqueda:", this.searchResults);
    },
    async addToWatchHistory(anime: Anime) {
      const existingAnime = this.watchHistory.find(item => item.id === anime.id);
      if (existingAnime) {
          this.watchHistory = this.watchHistory.filter(item => item.id !== anime.id);
      }
  
      this.watchHistory.unshift(anime);
  
      await fetch('https://localhost:3000/api/historiales', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              user_id: this.user.id,
              anime_id: anime.id,
              fecha_visto: new Date().toISOString().split('T')[0], 
          }),
      });
  
      if (this.watchHistory.length > 10) {
          this.watchHistory.pop();
      }
  },  
    async fetchAnimesByCategoria(categoriaId: number) {
      this.isLoading = true;
      try {
        const response = await fetch(`https://localhost:3000/api/animeCategorias/by-categoria/${categoriaId}`);
        if (!response.ok) {
          throw new Error('Error en la respuesta de los animes por categoría');
        }
        const animeData = await response.json();

        this.animesPorCategoria = animeData.map((anime: any) => ({
          ...anime,
          imagen_url: anime.imagen_url
            ? `https://localhost:3000${anime.imagen_url}`
            : 'https://via.placeholder.com/300',
        }));

        console.log("Animes por categoría cargados:", this.animesPorCategoria);
      } catch (error) {
        console.error('Error al cargar animes por categoría', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAnimesByGenero(generoId: number) {
      this.isLoading = true;
      try {
        const response = await fetch(`https://localhost:3000/api/animeGeneros/by-genero/${generoId}`);
        if (!response.ok) {
          throw new Error('Error en la respuesta de los animes por género');
        }
        const animeData = await response.json();

        this.animes = animeData.map((anime: any) => ({
          ...anime,
          imagen_url: anime.imagen_url
            ? `https://localhost:3000${anime.imagen_url}`
            : 'https://via.placeholder.com/300',
        }));

        console.log("Animes por género cargados:", this.animes);
      } catch (error) {
        console.error('Error al cargar animes por género', error);
      } finally {
        this.isLoading = false;
      }
    },
    generateRecommendations() {
      console.log("Generando recomendaciones...");
      if (this.favorites.length > 0) {
        const favoriteGenres = this.favorites.flatMap(fav => fav.generos.map(genero => genero.nombre));
        console.log("Géneros favoritos:", favoriteGenres);
        this.recommendations = this.animes.filter(anime =>
          anime.generos.some(genero => favoriteGenres.includes(genero.nombre))
        );
        console.log("Recomendaciones generadas:", this.recommendations);
      } else {
        this.recommendations = [];
        console.log("No hay favoritos para generar recomendaciones.");
      }
    },    
    applyFilters() {
      return this.animes.filter(anime => {
        const matchesGenre = this.filters.genre
          ? anime.generos.some((genero: any) => genero.nombre === this.filters.genre)
          : true;
        const matchesYear = this.filters.year
          ? new Date(anime.created_at).getFullYear() === this.filters.year
          : true;
        const matchesDuration = this.filters.duration
          ? anime.duracion && anime.duracion <= this.filters.duration
          : true;
        const matchesPopularity = this.filters.popularity
          ? anime.popularity && anime.popularity <= this.filters.popularity
          : true;
        return matchesGenre && matchesYear && matchesDuration && matchesPopularity;
      });
    },
    setFilter<K extends keyof typeof this.filters>(filter: K, value: typeof this.filters[K]) {
      this.filters[filter] = value;
    },
    clearFilters() {
      this.filters = {
        genre: null,
        year: null,
        duration: null,
        popularity: null,
      };
    },
    addReview(animeId: number, review: { rating: number; comment: string; user: string }) {
      if (!this.reviews[animeId]) {
        this.reviews[animeId] = [];
      }
      this.reviews[animeId].push(review);
      Swal.fire({
        title: 'Reseña Añadida',
        text: 'Tu reseña ha sido guardada.',
        icon: 'success',
        confirmButtonText: 'Entendido',
      });

      // Desbloquear logro por escribir la primera reseña
      this.unlockAchievement(3);
    },
    getAverageRating(animeId: number) {
      if (!this.reviews[animeId] || this.reviews[animeId].length === 0) {
        return null;
      }
      const total = this.reviews[animeId].reduce((acc, review) => acc + review.calificacion, 0);
      return (total / this.reviews[animeId].length).toFixed(1);
    },
    async checkForNewEpisodes() {
      console.log("Revisando nuevos episodios...");
      const notifiedEpisodes = JSON.parse(localStorage.getItem('notifiedEpisodes') || '[]');
      for (const favorite of this.favorites) {
        if (!notifiedEpisodes.includes(favorite.id)) {  // Cambié `mal_id` a `id` para ser consistente con tus datos.
          const message = `Nuevo episodio disponible para ${favorite.titulo}`;
          
          // Crear notificación en el backend
          try {
            const response = await fetch(`https://localhost:3000/api/notificaciones`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: this.user.id,
                tipo: 'nuevo_episodio',
                mensaje: message,
              }),
            });
    
            if (!response.ok) {
              throw new Error('Error al crear la notificación');
            }
    
            const newNotification = await response.json();
    
            this.notifications.push({
              id: newNotification.id,
              message: message,
            });
    
            notifiedEpisodes.push(favorite.id);
            localStorage.setItem('notifiedEpisodes', JSON.stringify(notifiedEpisodes));
            console.log(message);
          } catch (error) {
            console.error('Error al crear la notificación:', error);
          }
        }
      }
    },
    async fetchNotificaciones(userId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/notificaciones/${userId}`);
        if (!response.ok) throw new Error('Error al obtener las notificaciones');
        const data = await response.json();
        this.notifications = data; // Guarda las notificaciones en el store
        console.log('Notificaciones obtenidas:', this.notifications); // Asegúrate de que esto muestra las notificaciones
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
      }
    },      
    clearNotification(notificationId: number) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== notificationId
      );
    },
    openModal(anime: any) {
      this.selectedAnime = anime;
      this.isModalOpen = true;
    },    
    closeModal() {
      this.isModalOpen = false;
      this.selectedAnime = null;
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    },
    getUserProfile() {
      return this.user;
    },
    async fetchLanzamientos() {
      try {
        const response = await fetch('https://localhost:3000/api/lanzamientos');
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        this.lanzamientos = data;
        console.log("Lanzamientos obtenidos:", this.lanzamientos);
      } catch (error) {
        console.error('Error al obtener los lanzamientos:', error);
      }
    },
    async fetchSeasons(animeId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/series/${animeId}/seasons`);
        if (!response.ok) {
          throw new Error('Error en la respuesta de las temporadas');
        }
        return await response.json();
      } catch (error) {
        console.error('Error al obtener las temporadas:', error);
        return [];
      }
    },
    async fetchEpisodes(temporadaId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/episodios/temporada/${temporadaId}`);
        if (!response.ok) {
          throw new Error('Error en la respuesta de los episodios');
        }
        return await response.json();
      } catch (error) {
        console.error('Error al obtener los episodios:', error);
        return [];
      }
    },
    markEpisodeAsWatched(episodeId: number) {
      const episode = this.currentSeasonEpisodes.find(ep => ep.id === episodeId);
      if (episode) {
        episode.watched = true;
        Swal.fire({
          title: 'Episodio Marcado',
          text: `El episodio ha sido marcado como visto.`,
          icon: 'success',
          confirmButtonText: 'Entendido',
        });
      }
    },
    async playEpisode(videoUrl: string) {
      if (videoUrl) {
        window.open(videoUrl, "_blank");
      } else {
        Swal.fire({
          title: "Episodio no disponible",
          text: "No se ha encontrado el episodio seleccionado.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      }
    },
    initializeAchievements() {
      this.achievements = [
        { id: 1, name: "Primer Anime Visto", description: "Ve tu primer anime.", unlocked: false },
        { id: 2, name: "5 Animes Vistos", description: "Ve cinco animes.", unlocked: false },
        { id: 3, name: "Primera Reseña", description: "Escribe tu primera reseña.", unlocked: false },
        // Puedes añadir más logros aquí...
      ];
    },
    unlockAchievement(achievementId: number) {
      const achievement = this.achievements.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        this.unlockedAchievements.push(achievement);
        Swal.fire({
          title: "Logro Desbloqueado",
          text: `Has desbloqueado el logro: ${achievement.name}`,
          icon: 'success',
          confirmButtonText: 'Entendido',
        });
      }
    },
    async fetchReviews(animeId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/resenas?animeId=${animeId}`);
        if (!response.ok) throw new Error('Error al obtener las reseñas');
        const reviewsData = await response.json();
        this.reviews[animeId] = reviewsData;
      } catch (error) {
        console.error('Error al obtener las reseñas:', error);
      }
    },
    async submitReview(animeId: number, review: { calificacion: number; comentario: string }) {
      try {
        const response = await fetch('https://localhost:3000/api/resenas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            anime_id: animeId,
            user_id: this.user.id,
            calificacion: review.calificacion,
            comentario: review.comentario,
          }),
        });

        if (!response.ok) throw new Error('Error al enviar la reseña');

        const newReview = await response.json();
        if (!this.reviews[animeId]) {
          this.reviews[animeId] = [];
        }
        this.reviews[animeId].push(newReview);
        Swal.fire({
          title: 'Reseña Añadida',
          text: 'Tu reseña ha sido guardada.',
          icon: 'success',
          confirmButtonText: 'Entendido',
        });

      } catch (error) {
        console.error('Error al enviar la reseña:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar tu reseña. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    }, 
    async addToFavorites(anime: Anime) {
      if (!this.user || !this.user.id) {
        Swal.fire({
          title: "Inicia sesión",
          text: "Debes iniciar sesión para agregar animes a tu lista.",
          icon: "warning",
          confirmButtonText: "Entendido"
        });
        return;
      }
    
      const existingAnime = this.favorites.find(fav => fav.id === anime.id);
    
      if (!existingAnime) {
        this.favorites.push(anime);
        const response = await fetch('https://localhost:3000/api/listas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: this.user.id,
            anime_id: anime.id,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Error al añadir el anime a la lista.');
        }
      }
    }, 
    async removeFromFavorites(animeId: number) {
      const response = await fetch(`https://localhost:3000/api/listas/${this.user.id}/${animeId}`, {
        method: 'DELETE',
      });
    
      if (!response.ok) {
        throw new Error('Error al eliminar el anime de la lista.');
      }
    
      this.favorites = this.favorites.filter(anime => anime.id !== animeId);
    },    
    logout() {
      localStorage.removeItem("userToken");
      this.isAuthenticated = false;
      this.$reset();
    },
    async fetchUserLists(userId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/listas/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener las listas del usuario');
        }
        const listasData = await response.json();

        this.listas = listasData.map((anime: any) => ({
          ...anime,
          titulo: anime.anime_titulo || 'Título no disponible',
          descripcion: anime.anime_descripcion || 'Sin descripción disponible',
          imagen_url: anime.anime_imagen_url
            ? `https://localhost:3000${anime.anime_imagen_url}`
            : 'https://via.placeholder.com/300',
        }));
      } catch (error) {
        console.error('Error al obtener las listas del usuario:', error);
      }
    },
    async fetchWatchHistory(userId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/historiales/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de reproducción');
        }
        const historyData = await response.json();

        this.watchHistory = historyData.map((history: any) => ({
          ...history,
          titulo: history.anime_titulo || 'Título no disponible',
          imagen_url: history.anime_imagen_url
            ? `https://localhost:3000${history.anime_imagen_url}`
            : 'https://via.placeholder.com/300',
          descripcion: history.anime_descripcion || 'Sin descripción disponible',
          fecha_visto: history.fecha_visto ? new Date(history.fecha_visto).toLocaleDateString() : 'Fecha no disponible',
        }));
        console.log('Historial de reproducción:', this.watchHistory);
      } catch (error) {
        console.error('Error al obtener el historial de reproducción:', error);
      }
    },
    async deleteFromWatchHistory(historyId: number) {
      try {
        const response = await fetch(`https://localhost:3000/api/historiales/${historyId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el historial de reproducción');
        }

        this.watchHistory = this.watchHistory.filter((history: any) => history.id !== historyId);

        Swal.fire({
          title: 'Eliminado',
          text: 'El historial ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonText: 'Entendido',
        });
      } catch (error) {
        console.error('Error al eliminar el historial de reproducción:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al eliminar el historial. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Entendido',
        });
      }
    },
    async fetchAvatarCategories() {
      try {
        const response = await fetch("https://localhost:3000/api/categories-avatar");
        if (!response.ok) throw new Error("Error al cargar categorías de avatares");
        return await response.json();
      } catch (error) {
        console.error("Error al cargar categorías de avatares:", error);
      }
    },
    async saveUserPreferences() {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de usuario.");
      }
    
      const updateData: any = {
        nombre: this.user.nombre,
        email: this.user.email,
        avatar_id: this.user.avatar_id, // Asegúrate de incluir avatar_id en la actualización
      };
    
      if (this.user.password) {
        updateData.password = this.user.password;
      }
    
      try {
        const response = await fetch(`https://localhost:3000/api/usuarios/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData),
        });
    
        if (!response.ok) throw new Error('Error al guardar las preferencias');
    
        // Actualizar el store con la nueva URL del avatar, si es necesario
        const avatarResponse = await fetch(`https://localhost:3000/api/usuarios/${this.user.id}/avatar`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (avatarResponse.ok) {
          const avatarData = await avatarResponse.json();
          this.user.avatar_url = avatarData.avatar_url;
        }
    
        Swal.fire({
          title: "Guardado",
          text: "Tus preferencias han sido guardadas exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar tus preferencias.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error('Error al guardar las preferencias:', error);
      }
    },    
    updatePreferences(newPreferences: any) {
      this.user.preferences = newPreferences;
    },
    async fetchEpisodesByAnimeId(animeId: number) {
      try {
        const seasonsResponse = await fetch(`https://localhost:3000/api/series/${animeId}/seasons`);
        if (!seasonsResponse.ok) {
          throw new Error('Error en la respuesta de las temporadas');
        }
        const seasons = await seasonsResponse.json();

        if (seasons.length === 0) {
          throw new Error('No se encontraron temporadas para este anime');
        }

        const temporadaId = seasons[0].id;
        const episodesResponse = await fetch(`https://localhost:3000/api/episodios/temporada/${temporadaId}`);
        if (!episodesResponse.ok) {
          throw new Error('Error en la respuesta de los episodios');
        }
        return await episodesResponse.json();
      } catch (error) {
        console.error('Error al obtener los episodios:', error);
        return [];
      }
    },
    initWatchers() {
      watch(
        () => this.favorites,  // Observa cambios en la lista de favoritos
        () => {
          this.generateRecommendations();  // Regenera las recomendaciones cuando cambia `favorites`
        },
        { deep: true }  // Este `deep: true` asegura que Vue observe cambios en las propiedades internas del array
      );
    },
    afterEach() {
      this.initWatchers();
    },
    setup() {
    watch(() => this.favorites, this.generateRecommendations, { deep: true });
    },
    async fetchUserSubscription() {
      try {
        const response = await fetch(`/api/subscriptions/${this.user.id}`);
        
        if (!response.ok) {
          const errorText = await response.text(); // Lee el texto completo en caso de error
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
    
        if (data.subscription === null) {
          // Si el usuario no tiene suscripción, muestra un mensaje o habilita la opción de suscribirse
          console.log("El usuario no tiene suscripción.");
          Swal.fire({
            title: "No tienes una suscripción activa",
            text: "Por favor, selecciona un plan para suscribirte.",
            icon: "info",
            confirmButtonText: "Entendido",
          });
          return;
        }
    
        this.subscription = data;
      } catch (error) {
        console.error("Error al cargar la suscripción del usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar la suscripción. Verifica si el servicio está disponible.",
          icon: "error",
        });
      }
    },     
    async fetchMembershipPlans() {
      try {
        const response = await fetch('/api/membership-plans');
        if (!response.ok) throw new Error("Error al cargar los planes");
        
        this.plans = await response.json();
      } catch (error) {
        console.error("Error al cargar los planes:", error);
        Swal.fire("Error", "No se pudieron cargar los planes de membresía", "error");
      }
    },         
    async createSubscription({ planId, metodoPagoId }: { planId: number, metodoPagoId: number }) {
      try {
        const response = await fetch(`/api/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: this.user.id,
            plan_id: planId,
            fecha_inicio: new Date().toISOString(),
            fecha_proximo_pago: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            metodo_pago_id: metodoPagoId,
            tarjeta_ultimos4: '1234' // Simula los últimos 4 dígitos de la tarjeta
          }),
        });
    
        if (!response.ok) {
          throw new Error("Error al crear la suscripción");
        }
    
        const result = await response.json();
        console.log("Suscripción creada:", result);
        
        // Actualiza la suscripción del usuario
        this.fetchUserSubscription();
      } catch (error) {
        console.error("Error al crear la suscripción:", error);
      }
    },         
    async updateSubscriptionPlan(planId: number) {
      try {
        const response = await fetch(`/api/subscriptions/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan_id: planId }),
        });

        if (!response.ok) throw new Error("Error al actualizar el plan");

        this.fetchUserSubscription(); // Refresca la suscripción después de actualizar
      } catch (error) {
        console.error("Error al actualizar el plan:", error);
      }
    },
    async updatePaymentMethod(paymentDetails: { cardNumber: string; expiryDate: string; cvv: string }) {
      try {
        const response = await fetch('https://localhost:3000/api/metodos-pago', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardNumber: paymentDetails.cardNumber,
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv,
            userId: this.user.id, // Asumiendo que el ID del usuario se maneja en el store
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el método de pago');
        }

        const data = await response.json();
        this.metodosPago.push(data); // Actualiza la lista de métodos de pago

        Swal.fire({
          title: 'Método de pago agregado',
          text: 'Tu método de pago ha sido agregado exitosamente.',
          icon: 'success',
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al agregar tu método de pago.',
          icon: 'error',
        });
        console.error('Error al agregar el método de pago:', error);
      }
    },
    async fetchMetodosPago() {
      try {
        const response = await fetch("/api/metodos-pago", {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error("Error al obtener los métodos de pago");

        this.metodosPago = await response.json();
      } catch (error) {
        console.error("Error al cargar los métodos de pago", error);
      }
    },
  },
});

export type AnimeStore = ReturnType<typeof useAnimeStore>;
