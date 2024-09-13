<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Administrar Membresía</h2>
      <p>Aquí puedes cambiar tu plan o actualizar tu método de pago.</p>

      <div class="modal-options">
        <button @click="togglePlanSelection">Cambiar de Plan</button>
        <button @click="handleUpdatePayment">Actualizar Método de Pago</button>
      </div>

      <!-- Modal interno para seleccionar un plan -->
      <div v-if="showPlanSelection" class="plan-selection">
        <h3>Selecciona un plan:</h3>
        <div class="plans">
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="['plan-option', { selected: selectedPlan === plan.id }]"
            @click="selectPlan(plan.id)"
          >
            <h4>{{ plan.name }}</h4>
            <p>{{ plan.description }}</p>
            <p>
              <strong>{{ plan.price }} CLP / mes</strong>
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
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2";

export default defineComponent({
  name: "MembershipModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Asegúrate de recibir el segundo argumento del setup
    const showPlanSelection = ref(false);
    const selectedPlan = ref<number | null>(null);

    const plans = ref([
      {
        id: 1,
        name: "Plan Básico",
        description: "Acceso a contenido limitado en una sola pantalla",
        price: 6990,
      },
      {
        id: 2,
        name: "Plan Estándar",
        description: "Acceso a contenido en dos pantallas simultáneamente",
        price: 9990,
      },
      {
        id: 3,
        name: "Plan Premium",
        description:
          "Acceso a contenido en cuatro pantallas simultáneamente con calidad 4K",
        price: 12990,
      },
    ]);

    const togglePlanSelection = () => {
      showPlanSelection.value = !showPlanSelection.value;
    };

    const selectPlan = (planId: number) => {
      selectedPlan.value = planId;
    };

    const confirmPlanChange = () => {
      if (selectedPlan.value) {
        Swal.fire({
          title: "Cambio de Plan",
          text: "¡Tu cambio de plan se realizó exitosamente!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Lógica para actualizar el plan del usuario
          console.log(`Plan seleccionado: ${selectedPlan.value}`);
          closeModal(); // Cierra el modal después de la confirmación
        });
      }
    };

    const closeModal = () => {
      emit("close"); // Emitir el evento para cerrar el modal
    };

    return {
      showPlanSelection,
      plans,
      selectedPlan,
      togglePlanSelection,
      selectPlan,
      confirmPlanChange,
      closeModal, // Asegúrate de devolver la función en el return
    };
  },
  methods: {
    handleUpdatePayment() {
      const paymentInfo = {
        cardNumber: "**** **** **** 1234",
        expiryDate: "12/25",
        cvv: "123",
      };
      this.$emit("update-payment", paymentInfo);
    },
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

.plan-option h4 {
  margin: 0;
  font-size: 1.2rem;
}

.plan-option p {
  margin: 5px 0;
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
