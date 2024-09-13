<template>
  <LoginModal />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginModal from "../components/modals/LoginModal.vue";

export default defineComponent({
  name: "LoginView",
  components: {
    LoginModal,
  },
});
</script>

<style scoped>
/* Agrega estilos aquí si es necesario */
</style>
