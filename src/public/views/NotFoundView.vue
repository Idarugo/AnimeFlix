<template>
  <div class="not-found">
    <h1>404 - Página No Encontrada</h1>
    <button @click="goHome">Ir al Inicio</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotFoundView",
  setup() {
    const router = useRouter();
    const goHome = () => {
      router.push("/");
    };
    return {
      goHome,
    };
  },
});
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px;
  color: white;
}

button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #f40612;
}
</style>
