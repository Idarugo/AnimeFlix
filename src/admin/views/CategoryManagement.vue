<template>
  <div>
    <h1>Gestión de Categorías</h1>
    <CategoryList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CategoryList from "../components/CategoryList.vue";

export default defineComponent({
  name: "CategoryManagement",
  components: {
    CategoryList,
  },
});
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
