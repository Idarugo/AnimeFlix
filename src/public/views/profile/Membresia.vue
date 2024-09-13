<template>
  <div class="account-settings">
    <Sidebar />

    <main class="profile-view">
      <h1>Membresía</h1>

      <!-- Mostrar un mensaje o un spinner mientras se cargan los datos -->
      <div v-if="isLoading">
        <p>Cargando información de la suscripción...</p>
      </div>

      <!-- Si tiene suscripción -->
      <div v-else-if="hasSubscription">
        <div class="membership-info">
          <h2>Información de la Membresía</h2>

          <!-- Información del Plan -->
          <div class="membership-section">
            <p><strong>Plan:</strong> {{ membership.planName }}</p>
            <button @click="openChangePlanModal">Cambiar Plan</button>
          </div>

          <!-- Próximo Pago -->
          <div class="membership-section">
            <p>
              <strong>Próximo pago:</strong>
              {{ formatDate(membership.nextPaymentDate) }}
            </p>
          </div>

          <!-- Información del Método de Pago -->
          <div class="membership-section">
            <p>
              <strong>Método de pago:</strong> **** {{ membership.cardLast4 }}
            </p>
            <button @click="openChangePaymentMethodModal">
              Cambiar Método de Pago
            </button>
          </div>

          <!-- Actualizar Tarjeta -->
          <div class="membership-section">
            <button @click="openUpdateCardDetailsModal">
              Actualizar Tarjeta
            </button>
          </div>
        </div>
      </div>

      <!-- Si no tiene suscripción -->
      <div v-else>
        <p>No tienes una suscripción activa</p>
        <button @click="openSubscriptionFlow">Adquirir Suscripción</button>
      </div>

      <!-- Modals para Planes, Métodos de Pago, Tarjetas -->
      <MembershipSelectionModal
        v-if="step === 1 && isModalOpen"
        :isOpen="isModalOpen"
        :isEditing="hasSubscription"
        @close="closeModal"
        @next="handlePlanUpdate"
        @update-plan="handlePlanUpdate"
      />

      <PaymentMethodSelectionModal
        v-if="step === 2 && isModalOpen"
        :isOpen="isModalOpen"
        :isEditing="hasSubscription"
        @close="closeModal"
        @next="handlePaymentMethodUpdate"
      />

      <CardDetailsModal
        v-if="step === 3 && isModalOpen"
        :isOpen="isModalOpen"
        :isEditing="hasSubscription"
        :selectedPlanId="selectedPlanId"
        :selectedMethodId="selectedMethodId"
        @close="closeModal"
        @subscription-completed="handleSubscriptionCompleted"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useMembershipStore } from "../../store/membershipStore";
import Sidebar from "../../components/profile/Sidebar.vue";
import MembershipSelectionModal from "../../components/modals/MembershipSelectionModal.vue";
import PaymentMethodSelectionModal from "../../components/modals/PaymentMethodSelectionModal.vue";
import CardDetailsModal from "../../components/modals/CardDetailsModal.vue";
import Swal from "sweetalert2";

export default defineComponent({
  components: {
    Sidebar,
    MembershipSelectionModal,
    PaymentMethodSelectionModal,
    CardDetailsModal,
  },
  setup() {
    const membershipStore = useMembershipStore();
    const isModalOpen = ref(false);
    const step = ref(1);
    const hasSubscription = ref(false);
    const isLoading = ref(true);
    const membership = ref({
      startDate: "",
      planName: "",
      nextPaymentDate: "",
      cardLast4: "",
    });

    const user = ref(membershipStore.user);
    const selectedPlanId = ref<number | null>(null);
    const selectedMethodId = ref<number | null>(null);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    };

    onMounted(async () => {
      isLoading.value = true;
      await membershipStore.fetchMembershipPlans();

      if (!user.value) {
        await membershipStore.setUserFromToken();
        user.value = membershipStore.user;
      }

      if (user.value) {
        await membershipStore.fetchUserSubscription(user.value.id);

        if (membershipStore.subscription?.plan_id) {
          hasSubscription.value = true;
          membership.value = {
            startDate: membershipStore.subscription.fecha_inicio,
            planName: membershipStore.getPlanName(
              membershipStore.subscription.plan_id
            ),
            nextPaymentDate: membershipStore.subscription.fecha_proximo_pago,
            cardLast4: membershipStore.subscription.tarjeta_ultimos4,
          };
        } else {
          hasSubscription.value = false;
        }
      } else {
        hasSubscription.value = false;
      }

      isLoading.value = false;
    });

    const openSubscriptionFlow = () => {
      isModalOpen.value = true;
      step.value = 1;
    };

    const openChangePlanModal = () => {
      isModalOpen.value = true;
      step.value = 1;
    };

    const openChangePaymentMethodModal = () => {
      isModalOpen.value = true;
      step.value = 2;
    };

    const openUpdateCardDetailsModal = () => {
      isModalOpen.value = true;
      step.value = 3;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const handlePlanUpdate = async (planId: number) => {
      selectedPlanId.value = planId;

      // Si es modificación, actualiza directamente
      if (hasSubscription.value) {
        await membershipStore.updateSubscriptionAndPaymentMethod({
          planId: selectedPlanId.value,
          metodoPagoId: membershipStore.subscription?.metodo_pago_id || 0, // Método de pago existente
          fechaInicio: membership.value.startDate,
          fechaProximoPago: membership.value.nextPaymentDate,
          tarjetaUltimos4: membership.value.cardLast4,
        });
        closeModal();
      } else {
        step.value = 2; // Si es nueva suscripción, avanza al siguiente paso
      }
    };

    const handlePaymentMethodUpdate = async (methodId: number) => {
      selectedMethodId.value = methodId;
      step.value = 3;
    };

    const handleSubscriptionCompleted = async () => {
      await membershipStore.fetchUserSubscription(membershipStore.user!.id);
      isModalOpen.value = false;
      Swal.fire(
        "Éxito",
        "La suscripción se ha completado correctamente",
        "success"
      );
    };

    return {
      isModalOpen,
      step,
      membership,
      hasSubscription,
      isLoading,
      user,
      selectedPlanId,
      selectedMethodId,
      openChangePlanModal,
      openChangePaymentMethodModal,
      openUpdateCardDetailsModal,
      closeModal,
      openSubscriptionFlow,
      handlePlanUpdate,
      handlePaymentMethodUpdate,
      handleSubscriptionCompleted,
      formatDate,
    };
  },
});
</script>

<style scoped>
.account-settings {
  display: flex;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100vh;
}

.profile-view {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.membership-info,
.no-membership {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
  width: 100%;
  text-align: center;
}

button:hover {
  background-color: #d40812;
}
</style>
