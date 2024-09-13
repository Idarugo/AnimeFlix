<template>
  <div>
    <h1>Gestión de Lanzamientos</h1>
    <LaunchList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LaunchList from "../components/LaunchList.vue";

export default defineComponent({
  name: "LaunchManagement",
  components: {
    LaunchList,
  },
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
