<template>
  <nav aria-label="Page navigation">
    <ul class="pagination justify-content-center">
      <li
        class="page-item"
        :class="{ disabled: currentPage === 1 }"
        @click.prevent="changePage(currentPage - 1)"
      >
        <a class="page-link" href="#">Anterior</a>
      </li>
      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
        @click.prevent="changePage(page)"
      >
        <a class="page-link" href="#">{{ page }}</a>
      </li>
      <li
        class="page-item"
        :class="{ disabled: currentPage === totalPages }"
        @click.prevent="changePage(currentPage + 1)"
      >
        <a class="page-link" href="#">Siguiente</a>
      </li>
    </ul>
  </nav>
</template>
  
  <script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ["page-changed"],
  methods: {
    changePage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit("page-changed", page);
      }
    },
  },
});
</script>
  
  <style scoped>
.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

.page-item.active .page-link {
  background-color: var(--admin-button-background-color);
  color: var(--admin-button-text-color);
}
</style>
  