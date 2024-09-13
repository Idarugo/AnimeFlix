<template>
  <div>
    <h1>Gestión de Géneros</h1>
    <GeneroList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import GeneroList from "../components/GeneroList.vue";

export default defineComponent({
  name: "GenerosManagement",
  components: {
    GeneroList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  