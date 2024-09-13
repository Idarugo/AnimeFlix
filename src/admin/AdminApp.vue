<template>
  <div>
    <div :class="['admin-container', { 'dark-mode': darkMode }]">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "AdminApp",
  setup() {
    const darkMode = ref(localStorage.getItem("darkMode") === "true");

    return {
      darkMode,
    };
  },
});
</script>

<style scoped>
.admin-container {
  background-color: var(--sidebar-color);
  color: var(--text-color);
  min-height: 100vh;
}

.container {
  background-color: var(--sidebar-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  padding: 50px;
}

.stats {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.chart,
.card {
  background-color: var(--card-background-color);
  border-radius: 8px;
  box-shadow: 0 4px 6px var(--shadow-color);
  padding: 20px;
}

.container h1 {
  color: var(--text-color);
  margin-bottom: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li:last-child {
  border-bottom: none;
}

ul li p {
  margin: 0;
  color: var(--text-color);
}

ul li p strong {
  color: var(--text-color);
}

ul li p small {
  color: var(--text-color);
}

ul li h3 {
  color: var(--text-color);
  margin-top: 0;
}
</style>
