<template>
  <div class="account-settings">
    <Sidebar />
    <main class="profile-view">
      <div class="header-with-avatar">
        <h1>Cuenta</h1>
        <img
          :src="user.avatarUrl || defaultAvatarUrl"
          alt="Avatar"
          class="avatar-img"
        />
      </div>

      <div class="quick-links">
        <h2>Vínculos Rápidos</h2>
        <ul>
          <li>
            <button class="quick-link-button" @click="changePlan">
              Cambiar de plan
            </button>
          </li>
          <li>
            <button class="quick-link-button" @click="managePaymentMethod">
              Administrar forma de pago
            </button>
          </li>
        </ul>
      </div>

      <div class="profile-info">
        <h2>Información de Usuario</h2>
        <div class="profile-field">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="user.nombre" />
        </div>
        <div class="profile-field">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="user.email" />
        </div>
        <div class="profile-field">
          <label for="password">Contraseña:</label>
          <input type="password" v-model="password" placeholder="Contraseña" />
        </div>
      </div>

      <button class="select-avatar-button" @click="openAvatarModal">
        Cambiar Avatar
      </button>

      <button class="save-button" @click="saveUserPreferences">
        Guardar Cambios
      </button>

      <AvatarModal
        v-if="isAvatarModalOpen"
        :showModal="isAvatarModalOpen"
        :avatarId="user.avatar_id"
        @close="closeAvatarModal"
        @avatarSelected="updateAvatar"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import AvatarModal from "../../components/profile/AvatarModal.vue";
import Sidebar from "../../components/profile/Sidebar.vue";
import { useAnimeStore } from "../../store/animeStore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PerfilView",
  components: {
    AvatarModal,
    Sidebar,
  },
  setup() {
    const animeStore = useAnimeStore();
    const user = ref(animeStore.user);
    const router = useRouter();
    const password = ref("");
    const isAvatarModalOpen = ref(false);
    const defaultAvatarUrl = ref("path/to/default/avatar.png"); // Cambia esto a la ruta de tu avatar por defecto.

    onMounted(async () => {
      const profile = await animeStore.fetchUserProfile();
      if (profile.avatarUrl) {
        user.value.avatarUrl = profile.avatarUrl; // Asegura que la URL del avatar se cargue correctamente
      }
    });

    const openAvatarModal = () => {
      isAvatarModalOpen.value = true;
    };

    const closeAvatarModal = () => {
      isAvatarModalOpen.value = false;
    };

    const updateAvatar = ({
      avatarId,
      avatarUrl,
    }: {
      avatarId: number;
      avatarUrl: string;
    }) => {
      user.value.avatar_id = avatarId;
      user.value.avatarUrl = avatarUrl;
      animeStore.updateAvatar(avatarId);
      closeAvatarModal();
    };

    const saveUserPreferences = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No se encontró el token de usuario.");
      }

      const updateData = {
        nombre: user.value.nombre,
        email: user.value.email,
        avatar_id: user.value.avatar_id,
      };

      if (password.value) {
        updateData.password = password.value;
      }

      try {
        const response = await fetch(
          `https://localhost:3000/api/usuarios/${user.value.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) throw new Error("Error al guardar las preferencias");

        animeStore.user = {
          ...animeStore.user,
          ...updateData,
        };

        Swal.fire({
          title: "Guardado",
          text: "Tus preferencias han sido guardadas exitosamente.",
          icon: "success",
          confirmButtonText: "Entendido",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar tus preferencias.",
          icon: "error",
          confirmButtonText: "Entendido",
        });
        console.error("Error al guardar las preferencias:", error);
      }
    };

    const changePlan = () => console.log("Cambiar plan");
    const managePaymentMethod = () => console.log("Administrar forma de pago");
    const goBack = () => router.back();

    return {
      user,
      password,
      defaultAvatarUrl,
      updateAvatar,
      saveUserPreferences,
      openAvatarModal,
      closeAvatarModal,
      isAvatarModalOpen,
      goBack,
      changePlan,
      managePaymentMethod,
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
  height: 100vh; /* Asegura que ocupe toda la altura de la pantalla */
}

.profile-view {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto; /* Permite el desplazamiento si el contenido es muy largo */
}

.back-button {
  background-color: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;
}

.back-button:hover {
  background-color: #d40812;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #333;
}

.quick-links,
.profile-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.quick-links h2,
.profile-info h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.save-button,
.select-avatar-button {
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

.save-button:hover,
.select-avatar-button:hover {
  background-color: #d40812;
}

.quick-links ul {
  list-style-type: none;
  padding: 0;
}

.quick-links li {
  margin-bottom: 10px;
}

.quick-link-button {
  color: #e50914;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}

.quick-link-button:hover {
  text-decoration: underline;
}

.profile-field {
  margin-bottom: 20px;
}

.profile-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.profile-field input {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.header-with-avatar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header-with-avatar h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #333;
}

.header-with-avatar .avatar-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 20px;
}
</style>
