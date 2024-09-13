<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <button @click="closeModal" class="back-button">← Regresar</button>
        <h2>Elige un ícono para el perfil</h2>
        <div class="current-avatar">
          <img :src="currentAvatarUrl" alt="Avatar actual" />
        </div>
      </div>

      <!-- Mostrar avatares organizados por categorías -->
      <div
        v-for="(categoryAvatars, categoryName) in groupedAvatars"
        :key="categoryName"
      >
        <h3>{{ categoryName }}</h3>
        <div class="avatar-grid">
          <div
            v-for="avatar in categoryAvatars"
            :key="avatar.id"
            class="avatar"
            :class="{ selected: avatar.id === selectedAvatarId }"
            @click="selectAvatar(avatar.id, avatar.url)"
          >
            <img :src="avatar.url" :alt="avatar.nombre" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useAnimeStore } from "../../store/animeStore";

export default defineComponent({
  name: "AvatarModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    avatarId: {
      type: Number,
      required: false,
    },
  },
  emits: ["close", "avatarSelected"],
  setup(props, { emit }) {
    const animeStore = useAnimeStore();
    const avatars = ref([]);
    const categories = ref([]);
    const selectedAvatarId = ref(props.avatarId || null);

    onMounted(async () => {
      categories.value = await animeStore.fetchAvatarCategories();
      avatars.value = await animeStore.fetchAvatars();
    });

    const selectAvatar = (avatarId: number, avatarUrl: string) => {
      selectedAvatarId.value = avatarId;
      emit("avatarSelected", { avatarId, avatarUrl });
    };

    const closeModal = () => {
      emit("close");
    };

    const currentAvatarUrl = computed(() => {
      const selectedAvatar = avatars.value.find(
        (avatar) => avatar.id === selectedAvatarId.value
      );
      return selectedAvatar ? selectedAvatar.url : "";
    });

    const groupedAvatars = computed(() => {
      const groups: any = {};

      categories.value.forEach((category: any) => {
        groups[category.nombre] = [];
      });

      avatars.value.forEach((avatar: any) => {
        const category = categories.value.find(
          (cat: any) => cat.id === avatar.categoria_id
        );
        const categoryName = category ? category.nombre : "Otros";
        groups[categoryName].push(avatar);
      });

      return groups;
    });

    return {
      avatars,
      categories,
      selectedAvatarId,
      selectAvatar,
      closeModal,
      currentAvatarUrl,
      groupedAvatars,
    };
  },
});
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #1c1c1c;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
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

.back-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
