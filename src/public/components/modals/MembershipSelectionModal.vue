<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>{{ isEditing ? "Modificar Membresía" : "Seleccionar Membresía" }}</h2>

      <!-- Listar planes -->
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
            >{{ plan.precio }} CLP / {{ plan.duracion_en_meses }} mes</strong
          >
        </p>
      </div>

      <!-- Botón de acción -->
      <button :disabled="!selectedPlan" @click="goToNextStep">
        Siguiente: Método de Pago
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
    isEditing: Boolean, // Saber si estamos editando o agregando
  },
  emits: ["close", "next", "update-plan"],
  setup(props, { emit }) {
    const membershipStore = useMembershipStore();
    const selectedPlan = ref<number | null>(null); // Controla el plan seleccionado

    // Cargar los planes al montar el componente
    onMounted(async () => {
      await membershipStore.fetchMembershipPlans();
    });

    // Función para seleccionar un plan
    const selectPlan = (planId: number) => {
      selectedPlan.value = planId;
    };

    // Función para manejar el flujo siguiente según si es agregar o modificar
    const goToNextStep = () => {
      if (!selectedPlan.value) {
        // Validación para asegurarse de que se haya seleccionado un plan
        return Swal.fire("Error", "Por favor selecciona un plan", "error");
      }

      // Determinar si es agregar o modificar según la propiedad `isEditing`
      if (props.isEditing) {
        emit("update-plan", selectedPlan.value); // Emitimos actualización del plan
      } else {
        emit("next", selectedPlan.value); // Emitimos el siguiente paso (método de pago)
      }
    };

    // Función para cerrar el modal
    const closeModal = () => {
      emit("close");
    };

    return {
      plans: membershipStore.plans, // Lista de planes obtenidos
      selectedPlan, // Plan seleccionado
      selectPlan, // Función para seleccionar un plan
      goToNextStep, // Función para ir al siguiente paso
      closeModal, // Función para cerrar el modal
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

.plan-option {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.plan-option:hover {
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
