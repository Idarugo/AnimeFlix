<template>
  <div
    class="carousel-item"
    @mouseover="showOptions = true"
    @mouseleave="showOptions = false"
  >
    <img :src="imageUrl" class="anime-image" alt="Anime Image" loading="lazy" />
    <div class="anime-info">
      <h3>{{ anime.serie_titulo || anime.titulo }}</h3>
    </div>
    <div v-if="showOptions" class="anime-options">
      <button v-if="!isInList" @click.stop="addToList">+ Mi Lista</button>
      <button v-else @click.stop="removeFromList">- Quitar de Mi Lista</button>
      <button @click.stop="playAnime">▶ Reproducir</button>
      <button @click.stop="viewDetails">i Detalles</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useAnimeStore } from "../store/animeStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "AnimeCard",
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const showOptions = ref(false);
    const animeStore = useAnimeStore();

    const isInList = computed(() =>
      animeStore.favorites.some((fav) => fav.id === props.anime.id)
    );

    const imageUrl = computed(() => {
      return props.anime.imagen_url || "https://via.placeholder.com/150";
    });

    const addToList = () => {
      if (!isInList.value) {
        animeStore.addToFavorites(props.anime);
        Swal.fire({
          title: "Añadido a Mi Lista",
          text: `${
            props.anime.serie_titulo || props.anime.titulo
          } ha sido añadido a tu lista.`,
          icon: "success",
          confirmButtonText: "Entendido",
        });
      } else {
        Swal.fire({
          title: "Ya en Mi Lista",
          text: `${
            props.anime.serie_titulo || props.anime.titulo
          } ya está en tu lista.`,
          icon: "info",
          confirmButtonText: "Entendido",
        });
      }
    };

    const removeFromList = () => {
      animeStore.removeFromFavorites(props.anime.id);
      Swal.fire({
        title: "Eliminado de Mi Lista",
        text: `${
          props.anime.serie_titulo || props.anime.titulo
        } ha sido eliminado de tu lista.`,
        icon: "warning",
        confirmButtonText: "Entendido",
      });
    };

    const playAnime = async () => {
      console.log("Intentando reproducir anime", props.anime);

      try {
        const seasons = await animeStore.fetchSeasons(props.anime.id);

        if (seasons.length > 0) {
          const episodes = await animeStore.fetchEpisodes(seasons[0].id);

          if (episodes.length > 0) {
            const primerEpisodio = episodes[0];

            if (primerEpisodio.video_url) {
              playEpisode(primerEpisodio.video_url);

              // Agregar el anime al historial después de reproducir
              animeStore.addToWatchHistory(props.anime);
            } else {
              Swal.fire({
                title: "Episodio no disponible",
                text: "El primer episodio no tiene una URL de video válida.",
                icon: "error",
                confirmButtonText: "Entendido",
              });
            }
          } else {
            Swal.fire({
              title: "Episodio no disponible",
              text: "No hay episodios disponibles para reproducir.",
              icon: "error",
              confirmButtonText: "Entendido",
            });
          }
        } else {
          Swal.fire({
            title: "Temporada no disponible",
            text: "No hay temporadas disponibles para este anime.",
            icon: "error",
            confirmButtonText: "Entendido",
          });
        }
      } catch (error) {
        console.error("Error al intentar reproducir el anime", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al intentar reproducir el anime.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      }
    };

    // Lógica para reproducir el episodio
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

    const viewDetails = () => {
      emit("select", props.anime);
    };

    return {
      imageUrl,
      showOptions,
      addToList,
      removeFromList,
      isInList,
      playAnime,
      viewDetails,
    };
  },
});
</script>

<style scoped>
.carousel-item {
  position: relative;
  margin-right: 10px;
  min-width: 180px;
  cursor: pointer;
}

.anime-image {
  border-radius: 10px;
  height: 270px;
  object-fit: cover;
  width: 100%;
}

.anime-info {
  text-align: center;
  margin-top: 5px;
  font-size: 14px;
  color: var(--text-color);
}

.anime-options {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px;
  display: flex;
  justify-content: space-around;
  border-radius: 0 0 10px 10px;
}

.anime-options button {
  background-color: var(--link-color);
  border: none;
  color: var(--text-color);
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 5px;
}

.anime-options button:hover {
  background-color: var(--link-hover-color);
}
</style>
