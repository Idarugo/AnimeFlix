import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export interface Plan {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_en_meses: number;
}

export interface MetodoPago {
  id: number;
  nombre: string;
}

export interface Subscription {
  user_id: number;
  plan_id: number;
  fecha_inicio: string;
  fecha_proximo_pago: string;
  tarjeta_ultimos4: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
}

export const useMembershipStore = defineStore('membership', {
  state: () => ({
    plans: [] as Plan[],
    metodosPago: [] as MetodoPago[],
    subscription: null as Subscription | null,
    user: null as User | null, 
    isLoading: false,
  }),

  getters: {
    getPlanName: (state) => (planId: number) => {
      const plan = state.plans.find((p) => p.id === planId);
      return plan ? plan.nombre : "Plan no encontrado";
    },
  },
  
  actions: {
    async fetchMembershipPlans() {
      try {
        this.isLoading = true;
        const response = await fetch('https://localhost:3000/api/membership-plans');
        if (!response.ok) throw new Error("Error al cargar los planes");
        this.plans = await response.json();
      } catch (error) {
        console.error("Error al cargar los planes:", error);
        Swal.fire("Error", "No se pudieron cargar los planes de membresía", "error");
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMetodosPago() {
      try {
        this.isLoading = true;
        const response = await fetch('https://localhost:3000/api/metodosPago');
        if (!response.ok) throw new Error("Error al cargar los métodos de pago");
        this.metodosPago = await response.json();
      } catch (error) {
        console.error("Error al cargar los métodos de pago:", error);
        Swal.fire("Error", "No se pudieron cargar los métodos de pago", "error");
      } finally {
        this.isLoading = false;
      }
    },
    
    async createSubscription({ planId, metodoPagoId, fechaInicio, fechaProximoPago }: 
      { planId: number, metodoPagoId: number, fechaInicio: string, fechaProximoPago: string }) {
      
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      
      if (!token) {
        Swal.fire("Error", "No estás autenticado. Inicia sesión primero.", "error");
        return;
      }
    
      if (!this.user || !this.user.id) {
        Swal.fire("Error", "Usuario no identificado.", "error");
        return;
      }
    
      const formattedFechaInicio = fechaInicio || new Date().toISOString().split("T")[0];
      const formattedFechaProximoPago = fechaProximoPago || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0];
      
      try {
        this.isLoading = true;
        const response = await fetch(`https://localhost:3000/api/subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: this.user.id, 
            plan_id: planId,
            fecha_inicio: formattedFechaInicio,
            fecha_proximo_pago: formattedFechaProximoPago,
            metodo_pago_id: metodoPagoId,
            tarjeta_ultimos4: '1234'  // Puedes ajustar esto si tienes un campo dinámico
          }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al crear la suscripción: ${response.status} - ${errorText}`);
        }
    
        const result = await response.json();
        this.subscription = result;
        Swal.fire('Suscripción creada', 'Tu suscripción ha sido creada correctamente.', 'success');
      } catch (error: any) {
        console.error("Error al crear la suscripción:", error.message || error);
        Swal.fire('Error', 'Hubo un problema al crear la suscripción.', 'error');
      } finally {
        this.isLoading = false;
      }
    },    

    async updateSubscriptionAndPaymentMethod({
      planId,
      metodoPagoId,
      fechaInicio,
      fechaProximoPago,
      tarjetaUltimos4,
    }: {
      planId: number;
      metodoPagoId: number;
      fechaInicio: string;
      fechaProximoPago: string;
      tarjetaUltimos4: string;
    }) {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token no encontrado");
    
      if (!this.user || !this.user.id) {
        Swal.fire("Error", "Usuario no identificado.", "error");
        return;
      }
    
      try {
        const response = await fetch(`https://localhost:3000/api/subscriptions/${this.user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_id: planId,
            fecha_inicio: fechaInicio,
            fecha_proximo_pago: fechaProximoPago,
            metodo_pago_id: metodoPagoId,
            tarjeta_ultimos4: tarjetaUltimos4,
          }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error en la actualización: ${errorText}`);
          throw new Error(`Error en la actualización: ${response.status} - ${errorText}`);
        }
    
        const result = await response.json();
        this.subscription = result;
        Swal.fire('Suscripción actualizada', 'Tu suscripción ha sido actualizada correctamente.', 'success');
      } catch (error) {
        console.error("Error al actualizar la suscripción:", error);
        Swal.fire('Error', 'Hubo un problema al actualizar la suscripción.', 'error');
      }
    },    
    
    async fetchUserSubscription(userId: number) {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) throw new Error("Token no encontrado. Inicia sesión nuevamente.");
    
      try {
        this.isLoading = true;
        const response = await fetch(`https://localhost:3000/api/subscriptions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    
        if (!response.ok) {
          if (response.status === 404) {
            this.subscription = null;
          } else {
            throw new Error("Error al obtener la suscripción.");
          }
        } else {
          this.subscription = await response.json();
        }
      } catch (error) {
        console.error("Error al obtener la suscripción:", error);
        Swal.fire("Error", "Hubo un problema al cargar la suscripción.", "error");
      } finally {
        this.isLoading = false;
      }
    },
    
    setUser(user: User) {
      this.user = user;
    },

    async setUserFromToken() {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) {
        console.error("Token no encontrado.");
        return;
      }
      
      try {
        this.isLoading = true;
        const response = await fetch("https://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al verificar el token");
        
        const userData = await response.json();
        this.user = userData;
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
