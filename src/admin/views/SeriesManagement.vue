<template>
  <div>
    <h1>Gestión de Series</h1>
    <SeriesList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SeriesList from "../components/SeriesList.vue";

export default defineComponent({
  name: "SeriesManagement",
  components: {
    SeriesList,
  },
});
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
