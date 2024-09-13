<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Seleccionar Método de Pago</h2>

      <!-- Listar métodos de pago -->
      <div
        v-for="method in methods"
        :key="method.id"
        :class="['method-option', { selected: selectedMethod === method.id }]"
        @click="selectMethod(method.id)"
      >
        <h4>{{ method.nombre }}</h4>
      </div>

      <!-- Botón de acción -->
      <button :disabled="!selectedMethod" @click="goToNextStep">
        Siguiente: Detalles de Pago
      </button>
      <button @click="closeModal">Cancelar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useMembershipStore } from "../../store/membershipStore";
import Swal from "sweetalert2";

export default defineComponent({
  props: {
    isOpen: Boolean,
  },
  emits: ["close", "next"],
  setup(props, { emit }) {
    const membershipStore = useMembershipStore();
    const selectedMethod = ref<number | null>(null);

    // Cargar los métodos de pago al montar el componente
    onMounted(async () => {
      await membershipStore.fetchMetodosPago();
    });

    // Selecciona un método de pago
    const selectMethod = (methodId: number) => {
      selectedMethod.value = methodId;
    };

    // Continúa con los detalles de pago
    const goToNextStep = () => {
      if (!selectedMethod.value) {
        Swal.fire("Error", "Por favor selecciona un método de pago", "error");
        return;
      }

      emit("next", selectedMethod.value);
    };

    // Cierra el modal
    const closeModal = () => {
      emit("close");
    };

    return {
      methods: membershipStore.metodosPago, // Los métodos de pago se cargan del store
      selectedMethod,
      selectMethod,
      goToNextStep,
      closeModal,
    };
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.method-option {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.method-option:hover {
  background-color: #f0f0f0;
}

button {
  background-color: #e50914;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

button + button {
  background-color: #555;
}

button:hover {
  background-color: #d40812;
}

button[disabled]:hover {
  background-color: #ccc;
}

.selected {
  border: 2px solid #e50914;
  background-color: #fdecea;
}
</style>
