<template>
  <div class="subscription-form">
    <h2>Adquirir una Membresía</h2>
    <p>Selecciona un plan y añade un método de pago para comenzar.</p>

    <!-- Planes de suscripción -->
    <div class="plan-selection">
      <h3>Selecciona un plan:</h3>
      <div class="plans">
        <div
          v-for="plan in plans"
          :key="plan.id"
          :class="['plan-option', { selected: selectedPlan === plan.id }]"
          @click="selectPlan(plan.id)"
        >
          <h4>{{ plan.nombre }}</h4>
          <p>{{ plan.descripcion }}</p>
          <p>
            <strong
              >{{ plan.precio }} CLP /
              {{ plan.duracion_en_meses }} meses</strong
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Formulario de método de pago -->
    <div class="payment-info">
      <h3>Ingresa tu método de pago:</h3>
      <input
        v-model="payment.cardNumber"
        type="text"
        placeholder="Número de Tarjeta"
        class="input-field"
      />
      <input
        v-model="payment.expiryDate"
        type="text"
        placeholder="Fecha de Expiración (MM/AA)"
        class="input-field"
      />
      <input
        v-model="payment.cvv"
        type="text"
        placeholder="CVV"
        class="input-field"
      />
    </div>

    <button
      :disabled="!selectedPlan || !isPaymentInfoValid"
      @click="confirmSubscription"
      class="confirm-button"
    >
      Confirmar Suscripción
    </button>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useAnimeStore } from "../../store/animeStore";

export default defineComponent({
  name: "SubscriptionForm",
  setup() {
    const animeStore = useAnimeStore();
    const selectedPlan = ref<number | null>(null);
    const payment = ref({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });

    const isPaymentInfoValid = computed(() => {
      return (
        payment.value.cardNumber.length === 16 &&
        payment.value.expiryDate.length === 5 &&
        payment.value.cvv.length === 3
      );
    });

    const selectPlan = (planId: number) => {
      selectedPlan.value = planId;
    };

    const confirmSubscription = async () => {
      if (selectedPlan.value && isPaymentInfoValid.value) {
        try {
          const metodoPagoId = 1; // Aquí puedes manejar los métodos de pago seleccionados.
          const fechaInicio = new Date().toISOString().split("T")[0];

          // Llama al store para crear la suscripción
          await animeStore.createSubscription({
            planId: selectedPlan.value,
            metodoPagoId,
          });

          Swal.fire({
            title: "¡Suscripción adquirida!",
            text: "Tu suscripción ha sido creada correctamente.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al procesar la suscripción.",
            icon: "error",
          });
        }
      }
    };

    onMounted(async () => {
      // Cargar los planes de membresía al montar el componente
      await animeStore.fetchMembershipPlans();
    });

    return {
      plans: animeStore.plans,
      selectedPlan,
      payment,
      isPaymentInfoValid,
      selectPlan,
      confirmSubscription,
    };
  },
});
</script>
  
  <style scoped>
.subscription-form {
  text-align: center;
}

.plans {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-option {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.plan-option.selected {
  border-color: #e50914;
  background-color: #ffecec;
}

.payment-info {
  margin-top: 20px;
}

.input-field {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 80%;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.confirm-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
}

.confirm-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
  