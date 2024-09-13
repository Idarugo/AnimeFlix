<template>
  <main>
    <EpisodeList />
  </main>
</template>
    
    <script lang="ts">
import { defineComponent } from "vue";
import EpisodeList from "../components/EpisodeList.vue";

export default defineComponent({
  name: "EpisodeManagement",
  components: {
    EpisodeList,
  },
});
</script>
    
    <style scoped>
/* Estilos adicionales si es necesario */
</style>
    