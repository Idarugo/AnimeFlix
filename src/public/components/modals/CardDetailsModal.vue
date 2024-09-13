<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>
        {{
          isEditing
            ? "Actualizar Detalles de la Tarjeta"
            : "Completar los Detalles de la Tarjeta"
        }}
      </h2>

      <!-- Tarjeta de crédito animada -->
      <div class="card-container" :class="{ flipped: isFlipped }">
        <div class="card front">
          <p>{{ formattedCardNumber || "**** **** **** ****" }}</p>
          <p>{{ formattedExpiryDate || "MM/AA" }}</p>
        </div>
        <div class="card back">
          <p>{{ cvv || "***" }}</p>
        </div>
      </div>

      <!-- Número de Tarjeta -->
      <input
        type="text"
        v-model="cardNumber"
        placeholder="Número de Tarjeta"
        maxlength="19"
        @input="onCardNumberInput"
        autocomplete="cc-number"
        name="ccnumber"
      />

      <!-- Fecha de Expiración -->
      <input
        type="text"
        v-model="formattedExpiryDate"
        placeholder="Fecha de Expiración (MM/AA)"
        maxlength="5"
        @input="onExpiryDateInput"
        autocomplete="cc-exp"
        name="cc-exp"
      />

      <!-- CVV -->
      <input
        type="text"
        v-model="cvv"
        placeholder="CVV"
        maxlength="3"
        @focus="flipCard"
        @blur="flipCard"
        autocomplete="cc-csc"
        name="cc-csc"
      />

      <!-- Botones -->
      <div class="button-group">
        <button :disabled="!isFormValid" @click="confirmSubscription">
          {{ isEditing ? "Actualizar Tarjeta" : "Confirmar Suscripción" }}
        </button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useMembershipStore } from "../../store/membershipStore";
import Swal from "sweetalert2";

export default defineComponent({
  props: {
    isOpen: Boolean,
    isEditing: Boolean,
    selectedPlanId: Number,
    selectedMethodId: Number,
  },
  emits: ["close", "subscription-completed"],
  setup(props, { emit }) {
    const membershipStore = useMembershipStore();
    const cardNumber = ref("");
    const formattedCardNumber = ref("");
    const expiryDate = ref("");
    const formattedExpiryDate = ref("");
    const cvv = ref("");
    const isFlipped = ref(false);

    // Formatear el número de tarjeta
    const onCardNumberInput = () => {
      const rawValue = cardNumber.value.replace(/\D/g, ""); // Eliminar todo lo que no sea dígito
      const formattedValue = rawValue.replace(/(.{4})/g, "$1 ").trim(); // Formatear cada 4 dígitos
      formattedCardNumber.value = formattedValue;
      cardNumber.value = rawValue;
    };

    // Formatear la fecha de expiración
    const onExpiryDateInput = () => {
      const rawValue = formattedExpiryDate.value.replace(/\D/g, ""); // Eliminar todo lo que no sea dígito
      if (rawValue.length <= 2) {
        formattedExpiryDate.value = rawValue; // Si es menor de 2, solo mostrar los primeros 2 caracteres
      } else {
        formattedExpiryDate.value = `${rawValue.slice(0, 2)}/${rawValue.slice(
          2,
          4
        )}`; // Formatear MM/AA
      }
    };

    // Voltear la tarjeta al enfocar el campo CVV
    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    // Validar el formulario
    const isFormValid = computed(() => {
      const cleanedCardNumber = cardNumber.value.replace(/\s/g, ""); // Elimina los espacios del número de tarjeta
      return (
        cleanedCardNumber.length === 16 && // Número de tarjeta debe tener 16 dígitos
        formattedExpiryDate.value.length === 5 && // Fecha de expiración debe tener formato MM/AA
        cvv.value.length === 3 && // CVV debe tener 3 dígitos
        !isNaN(Number(cvv.value)) // CVV debe ser un número
      );
    });

    // Confirmar y enviar la suscripción o la actualización de la tarjeta
    const confirmSubscription = async () => {
      if (!isFormValid.value) {
        return Swal.fire(
          "Error",
          "Todos los campos de la tarjeta son obligatorios",
          "error"
        );
      }

      const cleanedCardNumber = cardNumber.value.replace(/\s/g, ""); // Limpiar el número de tarjeta

      try {
        const subscriptionData = {
          planId: props.selectedPlanId || membershipStore.subscription.plan_id, // Usa el plan actual si no se selecciona uno nuevo
          metodoPagoId:
            props.selectedMethodId ||
            membershipStore.subscription.metodo_pago_id, // Usa el método actual si no se selecciona uno nuevo
          cardNumber: cleanedCardNumber,
          expiryDate: formattedExpiryDate.value,
          cvv: cvv.value,
        };

        // Si estamos editando, actualizamos la tarjeta
        if (props.isEditing) {
          await membershipStore.updateCardDetails(subscriptionData);
        } else {
          await membershipStore.createSubscription(subscriptionData);
        }

        emit("subscription-completed");
      } catch (error) {
        Swal.fire(
          "Error",
          "Hubo un problema al gestionar la suscripción",
          "error"
        );
      }
    };

    // Cerrar modal
    const closeModal = () => {
      emit("close");
    };

    return {
      cardNumber,
      formattedCardNumber,
      expiryDate,
      formattedExpiryDate,
      cvv,
      isFlipped,
      onCardNumberInput,
      onExpiryDateInput,
      flipCard,
      isFormValid,
      confirmSubscription,
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
  padding: 30px 20px;
  border-radius: 12px;
  width: 360px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-container {
  width: 260px;
  height: 140px;
  perspective: 1000px;
  margin: 20px auto;
  position: relative;
}

.card {
  width: 100%;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.front {
  background-color: #5469d4;
  color: white;
}

.back {
  background-color: #333;
  color: white;
  transform: rotateY(180deg);
}

.card-container.flipped .front {
  transform: rotateY(180deg);
}

.card-container.flipped .back {
  transform: rotateY(0);
}

input {
  display: block;
  width: 90%;
  padding: 10px;
  margin: 15px auto;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.button-group {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

button {
  background-color: #e50914;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[disabled] {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not([disabled]) {
  background-color: #d40812;
}
</style>
