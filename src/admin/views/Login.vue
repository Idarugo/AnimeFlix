<template>
  <div class="login-container">
    <h1>Inicio de Sesión</h1>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="username">Usuario</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit" class="login-button">Ingresar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Importar SweetAlert2

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    const login = () => {
      if (username.value === "admin" && password.value === "admin") {
        Swal.fire({
          title: "Inicio de Sesión Exitoso",
          text: "Bienvenido al panel de administración",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          // Cambiamos la redirección para que apunte al inicio de la administración
          router.push("/admin/");
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Credenciales incorrectas",
          icon: "error",
          confirmButtonText: "Intentar de nuevo",
        });
      }
    };

    return {
      username,
      password,
      login,
    };
  },
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background: var(--background-color); /* Usa la variable de fondo de tu tema */
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  color: var(--text-color); /* Usa la variable de color de texto de tu tema */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color); /* Usa la variable de color de texto de tu tema */
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-color); /* Usa la variable de color de texto de tu tema */
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color); /* Usa la variable de color de borde de tu tema */
  background-color: var(
    --input-background-color
  ); /* Usa la variable de fondo de input de tu tema */
  color: var(--text-color); /* Usa la variable de color de texto de tu tema */
}

button.login-button {
  width: 100%;
  padding: 10px;
  background-color: var(
    --button-color
  ); /* Usa la variable de color de botón de tu tema */
  color: var(--text-color); /* Usa la variable de color de texto de tu tema */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button.login-button:hover {
  background-color: var(
    --button-hover-color
  ); /* Usa la variable de color de hover de botón de tu tema */
}
</style>
