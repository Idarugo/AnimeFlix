<template>
  <div>
    <h1>Gestión de Clasificación por Edad</h1>
    <ClasificacionEdadList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import ClasificacionEdadList from "../components/ClasificacionEdadList.vue";

export default defineComponent({
  name: "ClasificacionEdadManagement",
  components: {
    ClasificacionEdadList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  