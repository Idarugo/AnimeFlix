<template>
  <aside class="sidebar">
    <button @click="goBack" class="back-button">← Regresar</button>
    <router-link to="/account" class="sidebar-link"
      >Descripción general</router-link
    >
    <router-link to="/membresia" class="sidebar-link">Membresía</router-link>
    <router-link to="/historial" class="sidebar-link">Historial</router-link>
    <router-link to="/lista" class="sidebar-link">Mi Lista</router-link>
    <router-link to="/preferencias" class="sidebar-link"
      >Preferencias</router-link
    >
    <router-link to="/seguridad" class="sidebar-link">Seguridad</router-link>
    <router-link to="/perfil" class="sidebar-link">Perfiles</router-link>
  </aside>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Sidebar",
  setup() {
    const router = useRouter();

    const goBack = () => {
      // Redirige siempre a la ruta HomeView
      router.push({ name: "home" });
    };

    return {
      goBack,
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
}

.sidebar {
  width: 240px;
  padding: 20px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
}

.sidebar-link {
  display: block;
  padding: 10px 15px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 10px;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: #e50914;
  color: #fff;
}

.profile-view {
  flex-grow: 1;
  padding: 40px;
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

.profile-overview {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.profile-overview h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.overview-details p {
  margin-bottom: 10px;
  color: #333;
}

.profile-quick-links {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
}

.profile-quick-links h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.quick-link {
  display: block;
  color: #e50914;
  text-decoration: none;
  margin-bottom: 10px;
  font-weight: bold;
}

.quick-link:hover {
  text-decoration: underline;
}
</style>
  