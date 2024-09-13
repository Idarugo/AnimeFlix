<template>
  <div class="notification-preferences">
    <label>
      <input type="checkbox" v-model="preferences.email" />
      Notificaciones por Email
    </label>
    <label>
      <input type="checkbox" v-model="preferences.sms" />
      Notificaciones por SMS
    </label>
    <button @click="savePreferences">Guardar Cambios</button>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2"; // Importar SweetAlert2

export default defineComponent({
  name: "NotificationPreferences",
  props: {
    userId: {
      type: Number,
      required: true,
    },
    preferences: {
      type: Object,
      required: true,
    },
  },
  emits: ["preferencesUpdated"],
  setup(props, { emit }) {
    const preferences = ref({ ...props.preferences });

    const savePreferences = () => {
      emit("preferencesUpdated", preferences.value);

      // Mostrar el mensaje de éxito con SweetAlert2
      Swal.fire({
        title: "Guardado",
        text: "Tus preferencias han sido guardadas exitosamente.",
        icon: "success",
        confirmButtonText: "Entendido",
      });
    };

    return {
      preferences,
      savePreferences,
    };
  },
});
</script>

<style scoped>
.notification-preferences {
  display: flex;
  flex-direction: column;
}

.notification-preferences label {
  margin-bottom: 10px;
}

.notification-preferences button {
  margin-top: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.notification-preferences button:hover {
  background-color: #45a049;
}
</style>
