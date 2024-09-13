<template>
  <div class="reset-password-container">
    <h2>Restablecer Contraseña</h2>
    <form @submit.prevent="resetPassword">
      <div class="form-group">
        <label for="password">Nueva Contraseña</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Nueva Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
        />
      </div>
      <button type="submit">Restablecer Contraseña</button>
    </form>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

export default defineComponent({
  name: "ResetPasswordView",
  setup() {
    const route = useRoute();
    const password = ref("");
    const confirmPassword = ref("");

    const resetPassword = async () => {
      if (password.value !== confirmPassword.value) {
        Swal.fire({
          title: "Error",
          text: "Las contraseñas no coinciden.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        return;
      }

      try {
        const response = await fetch(
          "https://localhost:3000/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: route.query.token,
              newPassword: password.value,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Error al restablecer la contraseña"
          );
        }

        Swal.fire({
          title: "¡Contraseña restablecida!",
          text: "Tu contraseña ha sido actualizada correctamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });

        // Redirigir al login u otra página
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error.message || "Hubo un problema al restablecer la contraseña.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error("Error al restablecer la contraseña:", error);
      }
    };

    return { password, confirmPassword, resetPassword };
  },
});
</script>
  
  <style scoped>
/* Estilos similares a los de la página de recuperación de contraseña */
.reset-password-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  background: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  color: white;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #ff5a5a;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #1e1e1e;
  color: white;
  font-size: 16px;
}

input:focus {
  border-color: #ff5a5a;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #ff5a5a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e04c4c;
}
</style>
  