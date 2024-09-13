<template>
  <div class="main-layout">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "../components/Sidebar.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Sidebar,
  },
});
</script>

<style scoped>
.main-layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: var(--admin-background-color);
  color: var(--admin-text-color);
}
</style>
