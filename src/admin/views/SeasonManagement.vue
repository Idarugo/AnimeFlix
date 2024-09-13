<template>
  <SeasonList />
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import SeasonList from "../components/SeasonList.vue";

export default defineComponent({
  name: "SeasonManagement",
  components: {
    SeasonList,
  },
});
</script>
  
  <style scoped>
/* Estilos adicionales si es necesario */
</style>
  