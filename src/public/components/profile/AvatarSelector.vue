<template>
  <div class="avatar-selector">
    <h3>Elige un ícono para el perfil</h3>

    <!-- Categorías -->
    <div class="categories">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category.id)"
        :class="{ selected: selectedCategoryId === category.id }"
      >
        {{ category.nombre }}
      </button>
    </div>

    <!-- Avatares -->
    <div class="avatar-grid">
      <div
        v-for="avatar in filteredAvatars"
        :key="avatar.id"
        class="avatar"
        :class="{ selected: avatar.id === selectedAvatarId }"
        @click="selectAvatar(avatar.id)"
      >
        <img :src="avatar.url" :alt="avatar.nombre" />
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useAnimeStore } from "../../store/animeStore";

export default defineComponent({
  name: "AvatarSelector",
  props: {
    avatarId: {
      type: Number,
      required: false,
    },
  },
  emits: ["avatarSelected"],
  setup(props, { emit }) {
    const animeStore = useAnimeStore();
    const avatars = ref([]);
    const categories = ref([]);
    const selectedCategoryId = ref(null);
    const selectedAvatarId = ref(props.avatarId || null);

    onMounted(async () => {
      categories.value = await animeStore.fetchAvatarCategories();
      avatars.value = await animeStore.fetchAvatars();
    });

    const selectCategory = (categoryId: number) => {
      selectedCategoryId.value = categoryId;
    };

    const filteredAvatars = computed(() => {
      if (!selectedCategoryId.value) {
        return avatars.value;
      }
      return avatars.value.filter(
        (avatar) => avatar.categoria_id === selectedCategoryId.value
      );
    });

    const selectAvatar = (avatarId: number) => {
      selectedAvatarId.value = avatarId;
      emit("avatarSelected", avatarId); // Emitir avatarId seleccionado
    };

    return {
      avatars,
      categories,
      selectedCategoryId,
      selectedAvatarId,
      filteredAvatars,
      selectCategory,
      selectAvatar,
    };
  },
});
</script>
  
<style scoped>
.avatar-selector {
  text-align: center;
  margin-bottom: 40px;
}

.categories {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.categories button {
  background-color: #444;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.categories button.selected {
  background-color: #007bb5;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  justify-items: center;
  align-items: center;
}

.avatar {
  cursor: pointer;
  border: 2px solid transparent;
  padding: 5px;
  border-radius: 50%;
  transition: border-color 0.3s;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar.selected {
  border-color: #4caf50;
}
</style>
