import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as any[],
    isLoading: false,
  }),
  actions: {
    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        this.users = await response.json();
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    async addUser(user: any) {
      try {
        console.log('Enviando datos del usuario al servidor:', user);
        const response = await fetch('http://localhost:3000/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error al agregar usuario:', errorData);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo añadir el usuario.',
          });
          return;
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        this.users.push({ ...user, id: data.id });
        Swal.fire({
          icon: 'success',
          title: 'Usuario añadido',
          text: 'El usuario ha sido añadido correctamente.',
        });
      } catch (error) {
        console.error('Error en la solicitud para agregar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo añadir el usuario.',
        });
      }
    },

    async updateUser(updatedUser: any) {
      try {
        console.log('Actualizando usuario con ID:', updatedUser.id);
        const response = await fetch(`http://localhost:3000/api/usuarios/${updatedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });

        if (response.ok) {
          const index = this.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado',
              text: 'El usuario ha sido actualizado correctamente.',
            });
          }
        } else {
          const errorData = await response.json();
          console.error('Error al actualizar usuario:', errorData);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el usuario.',
          });
        }
      } catch (error) {
        console.error('Error en la solicitud para actualizar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario.',
        });
      }
    },

    async deleteUser(id: number) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.users = this.users.filter(user => user.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: 'El usuario ha sido eliminado correctamente.',
          });
        } else {
          const errorData = await response.json();
          console.error('Error al eliminar usuario:', errorData);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario.',
          });
        }
      } catch (error) {
        console.error('Error en la solicitud para eliminar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el usuario.',
        });
      }
    },
  },
});
