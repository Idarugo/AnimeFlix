<template>
  <div>
    <ResenaList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import ResenaList from "../components/ResenaList.vue";

export default defineComponent({
  name: "ResenaManagement",
  components: {
    ResenaList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  