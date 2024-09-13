<template>
  <div>
    <TrabajadoresList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import TrabajadoresList from "../components/TrabajadoresList.vue";

export default defineComponent({
  name: "TrabajadoresManagement",
  components: {
    TrabajadoresList,
  },
});
</script>
  