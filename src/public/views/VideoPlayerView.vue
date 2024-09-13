<template>
  <div class="video-player">
    <div class="controls">
      <button class="back-button" @click="goBack">
        <font-awesome-icon icon="arrow-left" />
      </button>
      <div class="playback-info">{{ animeTitle }} - {{ episodeTitle }}</div>
      <div class="video-options">
        <font-awesome-icon icon="flag" />
      </div>
    </div>
    <div class="video-screen">
      <img
        src="https://via.placeholder.com/1200x675.png?text=Simulated+Video"
        alt="Video"
        ref="videoElement"
        loading="lazy"
      />
    </div>
    <div class="video-controls">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressWidth + '%' }"></div>
      </div>
      <div class="control-buttons">
        <button @click="rewind" class="control-icon">
          <font-awesome-icon icon="backward" />
        </button>
        <button @click="playPause" class="control-icon">
          <font-awesome-icon :icon="[isPlaying ? 'pause' : 'play']" />
        </button>
        <button @click="forward" class="control-icon">
          <font-awesome-icon icon="forward" />
        </button>
        <button @click="toggleVolume" class="control-icon">
          <font-awesome-icon :icon="isMuted ? 'volume-mute' : 'volume-up'" />
        </button>
        <button @click="toggleSubtitles" class="control-icon">
          <font-awesome-icon icon="closed-captioning" />
        </button>
        <button @click="toggleAudioOptions" class="control-icon">
          <font-awesome-icon icon="comment-dots" />
        </button>
        <button @click="togglePlaybackSpeed" class="control-icon">
          <font-awesome-icon icon="tachometer-alt" />
        </button>
        <button @click="toggleFullscreen" class="control-icon">
          <font-awesome-icon icon="expand" />
        </button>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "VideoPlayerView",
  props: {
    animeTitle: {
      type: String,
      required: true,
    },
    episodeTitle: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isPlaying = ref(false);
    const isMuted = ref(false);
    const progressWidth = ref(50);
    const videoElement = ref<HTMLImageElement | null>(null);

    const playPause = () => {
      isPlaying.value = !isPlaying.value;
    };

    const rewind = () => {
      progressWidth.value = Math.max(0, progressWidth.value - 10);
    };

    const forward = () => {
      progressWidth.value = Math.min(100, progressWidth.value + 10);
    };

    const toggleVolume = () => {
      isMuted.value = !isMuted.value;
    };

    const toggleSubtitles = () => {
      console.log("Subtítulos activados/desactivados");
    };

    const toggleAudioOptions = () => {
      console.log("Opciones de audio");
    };

    const togglePlaybackSpeed = () => {
      console.log("Cambio de velocidad de reproducción");
    };

    const toggleFullscreen = () => {
      if (videoElement.value) {
        if (!document.fullscreenElement) {
          videoElement.value.requestFullscreen().catch((err) => {
            console.error(
              `Error al intentar activar pantalla completa: ${err.message}`
            );
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    const goBack = () => {
      window.history.back();
    };

    return {
      ...props,
      isPlaying,
      isMuted,
      progressWidth,
      playPause,
      rewind,
      forward,
      toggleVolume,
      toggleSubtitles,
      toggleAudioOptions,
      togglePlaybackSpeed,
      toggleFullscreen,
      goBack,
      videoElement,
    };
  },
});
</script>
  
<style scoped>
.video-player {
  background-color: var(--background-color);
  color: var(--text-color);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.controls {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
}

.playback-info {
  flex-grow: 1;
  text-align: center;
  font-size: 16px;
}

.video-options {
  cursor: pointer;
  font-size: 24px;
}

.video-screen {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.video-screen img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.video-controls {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
}

.progress-bar {
  background-color: #444;
  height: 5px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.progress {
  background-color: red;
  height: 100%;
  border-radius: 5px;
}

.control-buttons {
  display: flex;
  justify-content: space-around;
}

.control-icon {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
  margin: 0 10px;
  transition: transform 0.2s ease;
}

.control-icon:hover {
  transform: scale(1.2);
  color: var(--link-color);
}
</style>
