<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>
        {{
          isEditing ? "Modificar Método de Pago" : "Seleccionar Método de Pago"
        }}
      </h2>
      <p>Elige tu método de pago preferido.</p>

      <div class="payment-methods">
        <div
          v-for="metodo in paymentMethods"
          :key="metodo.id"
          :class="[
            'payment-option',
            { selected: selectedMethod === metodo.id },
          ]"
          @click="selectPaymentMethod(metodo.id)"
        >
          <h4>{{ metodo.nombre }}</h4>
        </div>
      </div>

      <button
        :disabled="!selectedMethod"
        @click="goToCardDetails"
        class="confirm-button"
      >
        Siguiente: Introducir Detalles de Pago
      </button>
      <button class="close-modal-button" @click="closeModal">Cancelar</button>
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
    isEditing: Boolean,
  },
  emits: ["close", "next", "update-method"],
  setup(props, { emit }) {
    const membershipStore = useMembershipStore();
    const selectedMethod = ref<number | null>(null);

    onMounted(async () => {
      await membershipStore.fetchMetodosPago();
    });

    const selectPaymentMethod = (methodId: number) => {
      selectedMethod.value = methodId;
    };

    const goToCardDetails = () => {
      if (!selectedMethod.value) {
        // Validación para asegurarse de que el método de pago esté seleccionado
        return Swal.fire(
          "Error",
          "Por favor selecciona un método de pago",
          "error"
        );
      }

      if (props.isEditing) {
        emit("update-method", selectedMethod.value); // Emitimos modificación del método de pago
      } else {
        emit("next", selectedMethod.value); // Emitimos el siguiente paso para creación
      }
    };

    const closeModal = () => {
      emit("close");
    };

    return {
      paymentMethods: membershipStore.metodosPago,
      selectedMethod,
      selectPaymentMethod,
      goToCardDetails,
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

.payment-option {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.payment-option:hover {
  background-color: #f0f0f0;
}

.payment-option.selected {
  border-color: #e50914;
  background-color: #ffecec;
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
</style>
