<template>
  <div class="carousel">
    <h2>{{ title }}</h2>
    <div class="carousel-wrapper">
      <AnimeCard
        v-for="anime in animes"
        :key="anime.mal_id"
        :anime="anime"
        @select="$emit('select', anime)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Anime } from "../../types/Anime";
import AnimeCard from "../AnimeCard.vue";

export default defineComponent({
  name: "AnimeCarousel",
  components: {
    AnimeCard,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    animes: {
      type: Array as () => Anime[],
      required: true,
    },
  },
});
</script>


<style scoped>
.carousel {
  padding: 20px 0;
}

.carousel-wrapper {
  display: flex;
  overflow-x: scroll;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}
</style>
