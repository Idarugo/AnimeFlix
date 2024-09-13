<template>
  <div class="page-container">
    <Navbar />

    <div class="contact">
      <h1>Contacto</h1>
      <p>
        Para cualquier consulta, no dudes en contactarnos a través del siguiente
        formulario:
      </p>
      <form @submit.prevent="submitForm" class="contact-form">
        <label for="name">Nombre:</label>
        <input type="text" id="name" v-model="name" required />

        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" v-model="email" required />

        <label for="message">Mensaje:</label>
        <textarea id="message" v-model="message" required></textarea>

        <button type="submit">Enviar</button>
      </form>
    </div>

    <FooterView />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2";
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";

export default defineComponent({
  name: "ContactoView",
  components: {
    Navbar,
    FooterView,
  },
  setup() {
    const name = ref("");
    const email = ref("");
    const message = ref("");

    const submitForm = async () => {
      // Validar que los campos no estén vacíos o con solo espacios
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        Swal.fire({
          title: "Campos Vacíos",
          text: "Por favor, completa todos los campos antes de enviar.",
          icon: "warning",
          confirmButtonText: "Entendido",
        });
        return;
      }

      try {
        const response = await fetch("https://localhost:3000/api/contactos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: name.value,
            email: email.value,
            mensaje: message.value,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al enviar el mensaje de contacto");
        }

        Swal.fire({
          title: "Mensaje Enviado",
          text: "Tu mensaje ha sido enviado exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });

        // Limpiar el formulario después de enviarlo
        name.value = "";
        email.value = "";
        message.value = "";
      } catch (error) {
        console.error("Error al enviar el mensaje de contacto:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo más tarde.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
      }
    };

    return {
      name,
      email,
      message,
      submitForm,
    };
  },
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contact {
  padding: 100px 20px 40px; /* Añadido padding-top para evitar superposición */
  max-width: 800px;
  margin: 0 auto;
  flex-grow: 1;
  color: #fff;
  background: linear-gradient(to right, #141e30, #243b55);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.contact h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 20px;
}

.contact p {
  text-align: center;
  margin-bottom: 30px;
  font-size: 18px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact label {
  font-weight: bold;
  font-size: 16px;
}

.contact input,
.contact textarea {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: #f5f5f5;
}

.contact button {
  background-color: #e50914;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
}

.contact button:hover {
  background-color: #f40612;
}
</style>
