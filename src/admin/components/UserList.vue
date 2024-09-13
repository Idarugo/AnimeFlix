<template>
  <main>
    <div class="container">
      <h1>Gestión de Usuarios</h1>
      <h2 class="text-center">Lista de Usuarios</h2>
      <button @click="openAddForm" class="btn btn-primary mb-2">
        Añadir Usuario
      </button>
      <ul class="list-group">
        <li
          v-for="user in users"
          :key="user.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              alt="Avatar"
              class="rounded-circle me-3"
              style="width: 50px; height: 50px"
            />
            <div>
              <p class="mb-0">{{ user.nombre }}</p>
              <p class="mb-0 text-muted">{{ user.email }}</p>
            </div>
          </div>
          <div>
            <button
              @click="openEditForm(user)"
              class="btn btn-success btn-sm me-2"
            >
              Editar
            </button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">
              Eliminar
            </button>
          </div>
        </li>
      </ul>

      <!-- Modal para Agregar/Editar Usuario -->
      <div
        v-if="showFormModal"
        class="modal show"
        tabindex="-1"
        style="display: block"
        aria-modal="true"
        role="dialog"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditMode ? "Editar Usuario" : "Agregar Usuario" }}
              </h5>
              <button
                type="button"
                class="btn-close"
                @click="closeForm"
              ></button>
            </div>
            <div class="modal-body">
              <UserForm
                :initialUser="selectedUser"
                @save="handleSave"
                @cancel="closeForm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import UserForm from "./UserForm.vue";
import { useUserStore } from "../store/userStore";

export default defineComponent({
  name: "UserList",
  components: {
    UserForm,
  },
  setup() {
    const store = useUserStore();
    const showFormModal = ref(false);
    const selectedUser = ref({
      id: null,
      nombre: "",
      email: "",
      avatar_url: "",
      preferencias: "",
    });
    const isEditMode = ref(false);

    onMounted(() => {
      store.fetchUsers();
    });

    const openAddForm = () => {
      selectedUser.value = {
        id: null,
        nombre: "",
        email: "",
        avatar_url: "",
        preferencias: "",
      };
      isEditMode.value = false;
      showFormModal.value = true;
    };

    const openEditForm = (user: any) => {
      selectedUser.value = { ...user };
      isEditMode.value = true;
      showFormModal.value = true;
    };

    const deleteUser = (id: number) => {
      store.deleteUser(id);
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleSave = () => {
      closeForm();
      Swal.fire({
        icon: "success",
        title: isEditMode.value ? "Usuario actualizado" : "Usuario añadido",
        text: isEditMode.value
          ? "El usuario ha sido actualizado correctamente."
          : "El usuario ha sido añadido correctamente.",
      });
    };

    return {
      users: store.users,
      showFormModal,
      selectedUser,
      isEditMode,
      openAddForm,
      openEditForm,
      deleteUser,
      closeForm,
      handleSave,
    };
  },
});
</script>

<style scoped>
@import "../assets/styles/components/sidebar.css";
@import "../assets/styles/components/UserList.css";
</style>
