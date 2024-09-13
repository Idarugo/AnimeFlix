<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Administrar Membresía</h2>
      <p>Aquí puedes cambiar tu plan o actualizar tu método de pago.</p>

      <div class="modal-options">
        <button @click="togglePlanSelection">Cambiar de Plan</button>
        <button @click="openPaymentModal">Actualizar Método de Pago</button>
      </div>

      <!-- Modal para seleccionar un plan -->
      <div v-if="showPlanSelection" class="plan-selection">
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
                {{ plan.duracion_en_meses }} mes</strong
              >
            </p>
          </div>
        </div>
        <button
          :disabled="!selectedPlan"
          @click="confirmPlanChange"
          class="confirm-button"
        >
          Confirmar Cambio de Plan
        </button>
      </div>

      <button class="close-modal-button" @click="closeModal">Cerrar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useMembershipStore } from "../../store/membershipStore"; // Ajusta la ruta si es necesario
import type { Plan } from "../../store/membershipStore"; // Importa el tipo Plan

export default defineComponent({
  name: "MembershipModal",
  emits: ["update-payment", "close"],
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const membershipStore = useMembershipStore();
    const showPlanSelection = ref(false);
    const selectedPlan = ref<number | null>(null);
    const plans = ref<Plan[]>([]); // Tipo explícito Plan[]

    onMounted(async () => {
      await membershipStore.fetchMembershipPlans();
      plans.value = membershipStore.plans;
    });

    const togglePlanSelection = () => {
      showPlanSelection.value = !showPlanSelection.value;
    };

    const selectPlan = (planId: number) => {
      selectedPlan.value = planId;
    };

    const confirmPlanChange = async () => {
      if (!selectedPlan.value) {
        Swal.fire(
          "Error",
          "Por favor, selecciona un plan antes de confirmar",
          "error"
        );
        return;
      }

      await membershipStore.createSubscription({
        planId: selectedPlan.value,
        metodoPagoId: 1, // Ajustar según el método de pago seleccionado
      });

      Swal.fire(
        "Plan cambiado",
        "Tu suscripción ha sido actualizada",
        "success"
      );
      closeModal();
    };

    const openPaymentModal = () => {
      Swal.fire({
        title: "Actualizar Método de Pago",
        html: `
          <input type="text" id="card-number" class="swal2-input" placeholder="Número de Tarjeta">
          <input type="text" id="expiry-date" class="swal2-input" placeholder="Fecha de Expiración (MM/AA)">
          <input type="text" id="cvv" class="swal2-input" placeholder="CVV">
        `,
        preConfirm: () => {
          const cardNumber = (
            Swal.getPopup()!.querySelector("#card-number") as HTMLInputElement
          ).value;
          const expiryDate = (
            Swal.getPopup()!.querySelector("#expiry-date") as HTMLInputElement
          ).value;
          const cvv = (
            Swal.getPopup()!.querySelector("#cvv") as HTMLInputElement
          ).value;

          if (!cardNumber || !expiryDate || !cvv) {
            Swal.showValidationMessage("Todos los campos son obligatorios");
            return null;
          }

          return { cardNumber, expiryDate, cvv };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const paymentInfo = result.value;
          emit("update-payment", paymentInfo);
          Swal.fire("Método de pago actualizado", "", "success");
        }
      });
    };

    const closeModal = () => {
      emit("close");
    };

    return {
      showPlanSelection,
      plans,
      selectedPlan,
      togglePlanSelection,
      selectPlan,
      confirmPlanChange,
      openPaymentModal,
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
  background-color: rgba(0, 0, 0, 0.6);
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

.modal-options button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin: 10px 0;
  width: 100%;
  text-align: center;
}

.modal-options button:hover {
  background-color: #d40812;
}

.plan-selection {
  margin-top: 20px;
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

.close-modal-button {
  background-color: transparent;
  color: #333;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}
</style>
