<template>
  <div>
    <h1>Gestión de Historial de Visualización</h1>
    <HistorialList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import HistorialList from "../components/HistorialList.vue";

export default defineComponent({
  name: "HistorialManagement",
  components: {
    HistorialList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  