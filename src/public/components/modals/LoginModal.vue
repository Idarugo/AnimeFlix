<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group remember-me">
          <input type="checkbox" id="rememberMe" v-model="rememberMe" />
          <label for="rememberMe">Recuérdame</label>
        </div>
        <div class="form-group">
          <router-link to="/forgot-password" class="forgot-password-link">
            ¿Olvidaste la contraseña?
          </router-link>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAnimeStore } from "../../store/animeStore";
import Swal from "sweetalert2";

export default defineComponent({
  name: "LoginModal",
  setup(_, { emit }) {
    const animeStore = useAnimeStore();
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false); // Estado para la casilla "Recuérdame"

    const login = async () => {
      try {
        const response = await fetch("https://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.value, // Asegúrate de enviar `rememberMe`
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed");
        }

        const data = await response.json();

        // Guardar el token en localStorage si "Recuérdame" está activado, de lo contrario en sessionStorage
        if (rememberMe.value) {
          localStorage.setItem("userToken", data.token);
        } else {
          sessionStorage.setItem("userToken", data.token);
        }

        // Establecer el usuario en el store
        await animeStore.fetchUserProfile();

        // Mostrar éxito
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Has iniciado sesión exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });

        emit("close"); // Cerrar modal de login
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Hubo un problema al iniciar sesión.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error("Error al iniciar sesión:", error);
      }
    };

    const close = () => {
      emit("close");
    };

    return { email, password, rememberMe, login, close };
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
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  padding: 30px;
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: white;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #ff5a5a;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #f3f3f3;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #444;
  background-color: #2c2c2c;
  color: white;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #ff5a5a;
}

.form-group.remember-me {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Alinea el contenido hacia la izquierda */
  gap: 10px; /* Espacio entre el checkbox y el label */
}

.form-group.remember-me input[type="checkbox"] {
  margin-right: 10px; /* Espacio entre el checkbox y el label */
  transform: scale(1.2);
  cursor: pointer;
  width: auto; /* Asegura que el checkbox tenga el ancho adecuado */
  padding: 0; /* Elimina cualquier relleno que pueda estar afectando el tamaño */
  box-sizing: content-box; /* Asegura que el tamaño del checkbox se ajuste al contenido */
}

.form-group.remember-me label {
  font-weight: normal;
  cursor: pointer;
  color: #f3f3f3;
}

.forgot-password-link {
  display: block;
  text-align: right;
  color: #ff5a5a;
  text-decoration: none;
  margin-top: -10px;
  transition: color 0.3s;
}

.forgot-password-link:hover {
  color: #e04c4c;
}

button[type="submit"] {
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

button[type="submit"]:hover {
  background-color: #e04c4c;
}
</style>
