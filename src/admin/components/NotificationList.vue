<template>
  <main>
    <div class="container">
      <h2>Lista de Notificaciones</h2>
      <button @click="openAddForm" class="btn btn-primary mb-2">
        Añadir Notificación
      </button>
      <ul class="list-group">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ notification.mensaje }} - {{ notification.tipo }}
          <div>
            <button
              @click="markAsRead(notification.id)"
              class="btn btn-success btn-sm me-2"
            >
              Marcar como Leída
            </button>
            <button
              @click="deleteNotification(notification.id)"
              class="btn btn-danger btn-sm"
            >
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useNotificationStore } from "../store/notificationStore";

export default defineComponent({
  name: "NotificationList",
  setup() {
    const store = useNotificationStore();

    onMounted(() => {
      store.fetchNotifications();
    });

    const markAsRead = (id: number) => {
      store.markAsRead(id);
    };

    const deleteNotification = (id: number) => {
      store.deleteNotification(id);
    };

    const openAddForm = () => {
      // Lógica para abrir el formulario de añadir notificación
    };

    return {
      notifications: store.notifications,
      markAsRead,
      deleteNotification,
      openAddForm,
    };
  },
});
</script>

<style scoped>
/* Estilos adicionales para la lista de notificaciones */
</style>
