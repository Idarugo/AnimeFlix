<template>
  <div>
    <h2>{{ isEditMode ? "Editar Usuario" : "Añadir Usuario" }}</h2>
    <form @submit.prevent="saveUser">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre:</label>
        <input
          v-model="user.nombre"
          id="nombre"
          type="text"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          v-model="user.email"
          id="email"
          type="email"
          class="form-control"
          required
        />
      </div>

      <div class="mb-3">
        <label for="avatar_url" class="form-label">Avatar URL:</label>
        <input
          v-model="user.avatar_url"
          id="avatar_url"
          type="text"
          class="form-control"
        />
      </div>

      <!-- Previsualización de Avatar -->
      <div v-if="user.avatar_url" class="mb-3">
        <label class="form-label">Previsualización de Avatar:</label>
        <div class="text-center">
          <img
            :src="user.avatar_url"
            alt="Avatar"
            class="img-fluid rounded-circle"
            style="max-height: 100px"
          />
        </div>
      </div>

      <div class="mb-3">
        <label for="preferencias" class="form-label">Preferencias:</label>
        <textarea
          v-model="user.preferencias"
          id="preferencias"
          class="form-control"
        ></textarea>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary me-2">
          {{ isEditMode ? "Guardar Cambios" : "Añadir Usuario" }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUserStore } from "../store/userStore";

export default defineComponent({
  name: "UserForm",
  props: {
    initialUser: {
      type: Object,
      required: false,
      default: () => ({
        id: null,
        nombre: "",
        email: "",
        avatar_url: "",
        preferencias: "",
      }),
    },
  },
  setup(props, { emit }) {
    const store = useUserStore();
    const user = ref({ ...props.initialUser });
    const isEditMode = ref(!!user.value.id);

    const saveUser = () => {
      if (isEditMode.value) {
        store.updateUser(user.value);
      } else {
        store.addUser(user.value);
      }
      emit("save");
    };

    return {
      user,
      isEditMode,
      saveUser,
    };
  },
});
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
