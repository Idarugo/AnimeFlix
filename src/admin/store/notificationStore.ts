import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/notificaciones');
        this.notifications = await response.json();
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las notificaciones.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async markAsRead(id: number) {
      try {
        await fetch(`http://localhost:3000/api/notificaciones/${id}/read`, {
          method: 'PUT',
        });
        this.notifications = this.notifications.map((notification) =>
          notification.id === id ? { ...notification, leido: true } : notification
        );
        Swal.fire({
          icon: 'success',
          title: 'Notificación leída',
          text: 'La notificación ha sido marcada como leída.',
        });
      } catch (error) {
        console.error('Error al marcar la notificación como leída:', error);
      }
    },

    async deleteNotification(id: number) {
      try {
        await fetch(`http://localhost:3000/api/notificaciones/${id}`, {
          method: 'DELETE',
        });
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== id
        );
        Swal.fire({
          icon: 'success',
          title: 'Notificación eliminada',
          text: 'La notificación ha sido eliminada correctamente.',
        });
      } catch (error) {
        console.error('Error al eliminar la notificación:', error);
      }
    },
  },
});
