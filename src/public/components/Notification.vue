<template>
  <div class="notification-wrapper" v-if="notifications.length">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-modal"
    >
      <p>{{ notification.mensaje || "Mensaje no disponible" }}</p>
      <button @click="removeNotification(notification.id)">X</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useAnimeStore, AnimeStore } from "../store/animeStore";

export default defineComponent({
  name: "Notification",
  setup() {
    const animeStore = useAnimeStore() as AnimeStore;

    const notifications = computed(() => [...animeStore.notifications]); // Desestructurar Proxy

    const removeNotification = async (id: number) => {
      try {
        await fetch(`https://localhost:3000/api/notificaciones/${id}`, {
          method: "DELETE",
        });
        animeStore.clearNotification(id); // Remueve la notificación del store en el frontend
      } catch (error) {
        console.error("Error al eliminar la notificación:", error);
      }
    };

    onMounted(async () => {
      if (animeStore.isAuthenticated) {
        // Verifica si el usuario está autenticado
        await animeStore.fetchNotificaciones(animeStore.user.id); // Carga las notificaciones
      }
    });

    return {
      notifications,
      removeNotification,
    };
  },
});
</script>

<style scoped>
.notification-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1002;
}

.notification-modal {
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.notification-modal p {
  margin: 0;
  padding-right: 10px;
  flex-grow: 1;
}

.notification-modal button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.notification-modal button:hover {
  transform: scale(1.1);
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

.notification-modal.fade-out {
  animation: fadeOut 0.3s forwards;
}
</style>
