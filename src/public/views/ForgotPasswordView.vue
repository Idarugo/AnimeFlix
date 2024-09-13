<template>
  <div class="forgot-password-container">
    <h2>Recuperar Contraseña</h2>
    <form @submit.prevent="sendResetLink">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <button type="submit">Enviar Enlace de Recuperación</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default defineComponent({
  name: "ForgotPasswordView",
  setup() {
    const email = ref("");
    const router = useRouter();

    const sendResetLink = async () => {
      try {
        // Mostrar el modal de carga
        Swal.fire({
          title: "Enviando enlace...",
          text: "Por favor, espera un momento.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const response = await fetch(
          "http://localhost:3000/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.value }),
          }
        );

        // Cerrar el modal de carga
        Swal.close();

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send reset link");
        }

        Swal.fire({
          title: "¡Enlace enviado!",
          text: "Revisa tu correo para recuperar tu contraseña.",
          icon: "success",
          confirmButtonText: "Entendido",
        }).then(() => {
          // Redirigir al home después de mostrar el mensaje de éxito
          router.push({ name: "home" });
        });
      } catch (error) {
        // Cerrar el modal de carga en caso de error
        Swal.close();

        Swal.fire({
          title: "Error",
          text:
            error.message ||
            "Hubo un problema al enviar el enlace de recuperación.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error("Error al enviar enlace de recuperación:", error);
      }
    };

    return { email, sendResetLink };
  },
});
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: auto;
  padding: 30px;
  background: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
