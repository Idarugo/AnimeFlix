<template>
  <div
    class="hero-banner"
    :style="{
      backgroundImage: `url(${bannerImage})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }"
  >
    <div class="banner-overlay">
      <div class="banner-content">
        <h1>{{ title || "Título no disponible" }}</h1>
        <p>{{ description || "Descripción no disponible" }}</p>
        <div class="banner-buttons">
          <button @click="reproducirAnime" class="reproducir-button">
            Reproducir
          </button>
          <button @click="agregarALista" class="mi-lista-button">
            Mi Lista
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Anime } from "../../types/Anime";
import { useAnimeStore } from "../../store/animeStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "HeroBanner",
  props: {
    bannerImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    anime: {
      type: Object as () => Anime,
      required: true,
    },
  },
  setup(props) {
    const animeStore = useAnimeStore();

    const reproducirAnime = async () => {
      if (!props.anime || typeof props.anime.id !== "number") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Anime no válido o sin ID.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      const episodios = await animeStore.fetchEpisodesByAnimeId(props.anime.id);
      if (episodios.length > 0) {
        const primerEpisodio = episodios[0];
        if (primerEpisodio.video_url) {
          playEpisode(primerEpisodio.video_url);

          animeStore.addToWatchHistory(props.anime);
        } else {
          Swal.fire({
            icon: "error",
            title: "Episodio no disponible",
            text: "El primer episodio no tiene una URL de video válida.",
            confirmButtonText: "Entendido",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Temporada no disponible",
          text: "No hay temporadas disponibles para este anime.",
          confirmButtonText: "Entendido",
        });
      }
    };

    const agregarALista = () => {
      animeStore.addToFavorites(props.anime);
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

    return {
      reproducirAnime,
      agregarALista,
    };
  },
});
</script>

<style scoped>
.hero-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 10px;
  position: relative;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  height: 50vh;
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

.banner-overlay {
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
}

.banner-content {
  text-align: center;
  color: white;
  max-width: 60%;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.5;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.banner-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.banner-buttons button {
  background-color: #ff9800;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.banner-buttons button:hover {
  background-color: #e88e00;
  transform: translateY(-2px);
}

.reproducir-button {
  background-color: #e50914;
}

.reproducir-button:hover {
  background-color: #d40813;
}

.mi-lista-button {
  background-color: #ffffff;
  color: #333;
}

.mi-lista-button:hover {
  background-color: #f0f0f0;
}
</style>
