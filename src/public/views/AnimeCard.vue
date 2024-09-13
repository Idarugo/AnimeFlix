<template>
  <div class="anime-card">
    <img
      :src="anime.images.jpg.image_url"
      :alt="`Imagen del anime ${anime.title}`"
      class="anime-image"
      loading="lazy"
    />
    <div class="anime-info">
      <h3>{{ anime.title }}</h3>
      <div class="share-buttons">
        <!-- Botón para compartir en Twitter -->
        <a
          :href="twitterShareUrl"
          target="_blank"
          aria-label="Compartir en Twitter"
        >
          <font-awesome-icon icon="fa-brands fa-twitter" />
        </a>
        <!-- Botón para compartir en Facebook -->
        <a
          :href="facebookShareUrl"
          target="_blank"
          aria-label="Compartir en Facebook"
        >
          <font-awesome-icon icon="fa-brands fa-facebook" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // Importa FontAwesomeIcon

export default defineComponent({
  name: "AnimeCard",
  components: {
    FontAwesomeIcon, // Registra el componente FontAwesomeIcon
  },
  props: {
    anime: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // URL para compartir en Twitter
    const twitterShareUrl = computed(
      () =>
        `https://twitter.com/intent/tweet?text=Mira este anime: ${encodeURIComponent(
          props.anime.title
        )} en AnimeFlix!&url=${encodeURIComponent(window.location.href)}`
    );

    // URL para compartir en Facebook
    const facebookShareUrl = computed(
      () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}`
    );

    return {
      twitterShareUrl,
      facebookShareUrl,
    };
  },
});
</script>

<style scoped>
.anime-card {
  /* estilos */
}
.anime-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
}

.share-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.share-buttons a {
  color: var(--link-color);
  font-size: 20px;
}

.share-buttons a:hover {
  color: var(--link-hover-color);
}
</style>
