<template>
  <div>
    <UserList />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import UserList from "../components/UserList.vue";

export default defineComponent({
  name: "UserManagement",
  components: {
    UserList,
  },
});
</script>
  
  <style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
  