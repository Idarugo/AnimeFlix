<template>
  <div>
    <AnimeList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AnimeList from "../components/AnimeList.vue";

export default defineComponent({
  name: "AnimeManagement",
  components: {
    AnimeList,
  },
});
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
