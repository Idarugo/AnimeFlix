<template>
  <div v-if="isOpen && anime" class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">X</button>
      <div class="modal-body">
        <div class="anime-header">
          <img
            :src="animeImage"
            alt="Anime Image"
            loading="lazy"
            class="anime-image"
          />
        </div>

        <div class="anime-info">
          <h1>{{ title }}</h1>
          <p v-if="averageRating">
            Calificación promedio: {{ averageRating }}⭐
          </p>
          <p>{{ description }}</p>

          <div class="episode-header">
            <h2>Episodios</h2>
            <div v-if="seasons.length > 0" class="season-select">
              <select
                v-model="selectedSeasonId"
                @change="fetchEpisodes"
                class="season-dropdown"
              >
                <option
                  v-for="season in seasons"
                  :key="season.id"
                  :value="season.id"
                >
                  {{ season.titulo }}
                </option>
              </select>
            </div>
          </div>

          <div class="episode-header">
            <h4>{{ selectedSeasonTitle }} - {{ classificationAge }}</h4>
          </div>

          <div v-if="episodes.length > 0" class="episode-list">
            <div
              v-for="episode in episodes"
              :key="episode.id"
              class="episode-item"
            >
              <img
                :src="animeImage"
                class="episode-image"
                alt="Episode Image"
              />
              <div class="episode-info">
                <h3>{{ episode.titulo }}</h3>
                <p>{{ episode.descripcion }}</p>
                <p class="duration">{{ episode.duracion }}</p>
              </div>
              <button
                @click="playEpisode(episode.video_url)"
                class="play-button"
              >
                ▶ Ver Episodio
              </button>
            </div>
          </div>
          <p v-else>Este anime no tiene episodios disponibles.</p>

          <div id="anime-player-container"></div>

          <div class="share-section">
            <h3>Compartir en Redes Sociales</h3>
            <div class="share-buttons">
              <button @click="shareOnFacebook">Facebook</button>
              <button @click="shareOnTwitter">Twitter</button>
              <button @click="shareOnWhatsApp">WhatsApp</button>
            </div>
          </div>

          <!-- Sección de reseñas -->
          <div class="reviews-section">
            <h2>Reseñas</h2>
            <div v-if="reviews.length">
              <div v-for="review in reviews" :key="review.id" class="review">
                <p>
                  <strong>{{ review.usuario_nombre }}</strong> -
                  {{ review.calificacion }}⭐
                </p>
                <p>{{ review.comentario }}</p>
                <p class="review-date">
                  {{ new Date(review.created_at).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <p v-else>
              No hay reseñas para este anime. ¡Sé el primero en dejar una
              reseña!
            </p>

            <h3>Añadir Reseña</h3>
            <div class="add-review">
              <input
                v-model="newReview.user"
                type="text"
                placeholder="Tu nombre"
                disabled
              />
              <textarea
                v-model="newReview.comment"
                placeholder="Escribe tu reseña aquí"
              ></textarea>
              <select v-model="newReview.rating">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}⭐</option>
              </select>
              <button @click="submitReview">Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useAnimeStore, AnimeStore } from "../../store/animeStore";
import { Anime, Episode, Season } from "../../types/Anime";

export default defineComponent({
  name: "AnimeDetailModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    anime: {
      type: Object as () => Anime | null,
      required: true,
    },
  },
  setup(props, { emit }) {
    const animeStore = useAnimeStore() as AnimeStore;
    const newReview = ref({
      user: animeStore.user.nombre,
      comment: "",
      rating: 5,
    });

    const reviews = computed(
      () => animeStore.reviews[props.anime?.id || 0] || []
    );

    const averageRating = computed(() =>
      animeStore.getAverageRating(props.anime?.id || 0)
    );
    const animeImage = computed(
      () => props.anime?.imagen_url || "https://via.placeholder.com/300"
    );
    const title = computed(() => props.anime?.titulo || "Sin título");
    const description = computed(
      () => props.anime?.descripcion || "Descripción no disponible"
    );

    const seasons = ref<Season[]>([]);
    const episodes = ref<Episode[]>([]);
    const selectedSeasonId = ref<number | null>(null);

    const classificationAge = computed(() => {
      if (props.anime && selectedSeasonId.value) {
        const selectedSeason = seasons.value.find(
          (season) => season.id === selectedSeasonId.value
        );
        if (selectedSeason) {
          return `${selectedSeason.clasificacion_edad_nombre} - ${selectedSeason.clasificacion_edad_descripcion}`;
        }
      }
      return "Sin clasificación";
    });

    const selectedSeasonTitle = computed(() => {
      const season = seasons.value.find((s) => s.id === selectedSeasonId.value);
      return season ? season.titulo : "1";
    });

    const fetchSeasons = async () => {
      if (props.anime?.id) {
        seasons.value = await animeStore.fetchSeasons(props.anime.id);
        if (seasons.value.length > 0) {
          selectedSeasonId.value = seasons.value[0].id;
          await fetchEpisodes();
        }
      }
    };

    const fetchEpisodes = async () => {
      if (selectedSeasonId.value) {
        episodes.value = await animeStore.fetchEpisodes(selectedSeasonId.value);
      }
    };

    const fetchReviews = async () => {
      if (props.anime?.id) {
        await animeStore.fetchReviews(props.anime.id);
      }
    };

    const playEpisode = (videoUrl: string) => {
      let videoContainer = document.getElementById("anime-player-container");

      if (!videoContainer) {
        videoContainer = document.createElement("div");
        videoContainer.id = "anime-player-container";
        videoContainer.className = "fullscreen-video-container";
        document.body.appendChild(videoContainer);
      }

      if (videoContainer) {
        videoContainer.innerHTML = `
    <iframe id="fullscreen-iframe" width="100%" height="100%" frameborder="0" src="${videoUrl}?autoplay=1&muted=1" allowfullscreen allow="autoplay;"></iframe>
    <button id="close-video" class="close-video-button">Cerrar</button>
  `;

        const closeButton = document.getElementById("close-video");
        if (closeButton) {
          closeButton.onclick = () => {
            videoContainer.innerHTML = "";
            videoContainer.style.display = "none";
          };
        }

        videoContainer.style.display = "block";

        const iframe = document.getElementById(
          "fullscreen-iframe"
        ) as HTMLIFrameElement;

        if (iframe.requestFullscreen) {
          iframe.requestFullscreen().then(() => {
            const iframeContentWindow = iframe.contentWindow;
            if (iframeContentWindow) {
              iframeContentWindow.postMessage('{"method":"play"}', "*");
            }
          });

          document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
              videoContainer.innerHTML = "";
              videoContainer.style.display = "none";
            }
          });
        }
      } else {
        console.error("No se pudo encontrar el contenedor del video");
      }
    };

    const submitReview = async () => {
      if (newReview.value.comment) {
        await animeStore.submitReview(props.anime?.id || 0, {
          calificacion: newReview.value.rating,
          comentario: newReview.value.comment,
        });
        newReview.value.comment = "";
        newReview.value.rating = 5;
        fetchReviews(); // Recargar reseñas después de enviar
      }
    };

    const closeModal = () => {
      emit("close");
    };

    watch(
      () => props.isOpen,
      (newValue) => {
        if (newValue && props.anime) {
          fetchSeasons();
          fetchReviews();
        }
      }
    );

    return {
      reviews,
      newReview,
      averageRating,
      submitReview,
      closeModal,
      title,
      description,
      animeImage,
      seasons,
      episodes,
      selectedSeasonId,
      selectedSeasonTitle,
      classificationAge,
      fetchSeasons,
      fetchEpisodes,
      playEpisode,
    };
  },
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 50px;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background-color: var(--background-color);
  padding: 20px;
  width: 80%;
  max-width: 900px;
  border-radius: 10px;
  position: relative;
  color: var(--text-color);
  z-index: 1001;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.anime-image {
  max-height: 300px;
  width: auto;
  margin-bottom: 15px;
  border-radius: 10px;
}

.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-button:hover {
  transform: scale(1.2);
}

.episode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.season-select {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.season-dropdown {
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  padding: 8px;
  border-radius: 5px;
  font-size: 1rem;
}

.episode-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.episode-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #222;
  padding: 10px;
  border-radius: 8px;
}

.episode-image {
  width: 150px;
  height: 84px;
  border-radius: 4px;
  object-fit: cover;
}

.episode-info {
  flex-grow: 1;
}

.episode-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
}

.duration {
  margin-top: 5px;
  font-size: 0.9rem;
  color: #bbb;
}

.play-button {
  background-color: #e50914;
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.play-button:hover {
  background-color: #f6121d;
}

.reviews-section {
  margin-top: 20px;
}

.review {
  background-color: #2a2a2a;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.add-review {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-review input,
.add-review textarea,
.add-review select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #333;
  color: var(--text-color);
}

.add-review button {
  background-color: var(--link-color);
  color: var(--text-color);
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-review button:hover {
  background-color: var(--link-hover-color);
}

.anime-info h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.anime-info p {
  margin-bottom: 10px;
}

.average-rating {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f39c12;
}

.share-section {
  margin-top: 20px;
}

.share-buttons {
  display: flex;
  gap: 10px;
}

.view-seasons-button {
  margin-top: 20px;
  display: inline-block;
  padding: 10px 15px;
  background-color: #ff9800;
  color: #fff;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
}

.view-seasons-button:hover {
  background-color: #fb8c00;
}

.fullscreen-video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: none;
  justify-content: center;
  align-items: center;
}

.close-video-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: 2px solid white;
  color: white;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  z-index: 1001;
}
</style>
