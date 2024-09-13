<template>
  <button class="admin-button">
    <slot />
  </button>
</template>
    
  <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminButton",
});
</script>
    
  <style scoped>
.admin-button {
  background-color: var(--admin-button-background-color);
  color: var(--admin-button-text-color);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.admin-button:hover {
  background-color: var(--admin-button-hover-background-color);
}
</style>
  