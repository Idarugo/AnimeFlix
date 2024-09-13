<template>
  <div>
    <h1>Gestión de Notificaciones</h1>
    <NotificationList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import NotificationList from "../components/NotificationList.vue";

export default defineComponent({
  name: "NotificationManagement",
  components: {
    NotificationList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  