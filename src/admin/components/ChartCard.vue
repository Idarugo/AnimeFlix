<!-- src/components/ChartCard.vue -->
<template>
  <div class="chart card bg-light">
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
  
  <style scoped>
/* Agrega estilos adicionales aquí si es necesario */
</style>
  