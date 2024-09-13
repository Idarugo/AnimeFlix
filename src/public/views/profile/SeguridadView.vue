<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <h1>Seguridad de la Cuenta</h1>
      <div class="profile-section">
        <h2>Modificar Contraseña</h2>
        <div class="security-field">
          <label for="current-password">Contraseña Actual:</label>
          <input
            type="password"
            id="current-password"
            v-model="currentPassword"
          />
        </div>
        <div class="security-field">
          <label for="new-password">Nueva Contraseña:</label>
          <input type="password" id="new-password" v-model="newPassword" />
        </div>
        <div class="security-field">
          <label for="confirm-password">Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
          />
        </div>
        <button class="save-button" @click="updatePassword">
          Guardar Cambios
        </button>
      </div>
    </main>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref } from "vue";
import Sidebar from "../../components/profile/Sidebar.vue";
import Swal from "sweetalert2";
import { useAnimeStore } from "../../store/animeStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SeguridadView",
  components: {
    Sidebar,
  },
  setup() {
    const animeStore = useAnimeStore();
    const router = useRouter();

    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const updatePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        Swal.fire({
          title: "Error",
          text: "Las contraseñas no coinciden.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        return;
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de usuario.");
      }

      try {
        const response = await fetch(
          `https://localhost:3000/api/usuarios/${animeStore.user.id}/update-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword: currentPassword.value,
              newPassword: newPassword.value,
            }),
          }
        );

        if (!response.ok) throw new Error("Error al actualizar la contraseña");

        Swal.fire({
          title: "Guardado",
          text: "Tu contraseña ha sido actualizada exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });

        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar tu contraseña.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error("Error al actualizar la contraseña:", error);
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      updatePassword,
    };
  },
});
</script>
  
  <style scoped>
.account-settings {
  display: flex;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100vh; /* Asegura que ocupe toda la altura de la pantalla */
}

.profile-view {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto; /* Permite el desplazamiento si el contenido es muy largo */
}

.back-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;
}

.back-button:hover {
  background-color: #d40812;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.profile-section {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.security-field {
  margin-bottom: 20px;
}

.security-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.security-field input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.save-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

.save-button:hover {
  background-color: #d40812;
}
</style>
  