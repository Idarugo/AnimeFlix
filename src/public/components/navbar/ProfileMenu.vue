<template>
  <div class="profile-menu">
    <ul>
      <li @click="openSettings">Configuración</li>
      <li @click="logout">Cerrar sesión</li>
    </ul>

    <!-- Modal de Configuración -->
    <div v-if="isSettingsOpen" class="settings-modal">
      <div class="settings-content">
        <h2>Configuración</h2>
        <div class="setting-item">
          <label for="theme">Tema</label>
          <select id="theme" v-model="selectedTheme" @change="changeTheme">
            <option value="light">Modo Claro</option>
            <option value="dark">Modo Oscuro</option>
          </select>
        </div>
        <div class="setting-item">
          <label for="language">Idioma</label>
          <select
            id="language"
            v-model="selectedLanguage"
            @change="changeLanguage"
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <!-- Agrega más opciones de idioma según sea necesario -->
          </select>
        </div>
        <button @click="closeSettings">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useAnimeStore } from "../../store/animeStore";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ProfileMenu",
  setup() {
    const animeStore = useAnimeStore();
    const { locale } = useI18n(); // Para manejar el idioma

    const isSettingsOpen = ref(false);
    const selectedTheme = ref(animeStore.theme);
    const selectedLanguage = ref(locale.value);

    const openSettings = () => {
      isSettingsOpen.value = true;
    };

    const closeSettings = () => {
      isSettingsOpen.value = false;
    };

    const changeTheme = () => {
      animeStore.toggleTheme();
    };

    const changeLanguage = () => {
      locale.value = selectedLanguage.value;
    };

    const logout = () => {
      console.log("Cerrar sesión clicked");
    };

    return {
      isSettingsOpen,
      selectedTheme,
      selectedLanguage,
      openSettings,
      closeSettings,
      changeTheme,
      changeLanguage,
      logout,
    };
  },
});
</script>

<style scoped>
.profile-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: var(--navbar-background);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.profile-menu ul {
  list-style: none;
  margin: 0;
  padding: 10px;
}

.profile-menu ul li {
  padding: 10px;
  cursor: pointer;
  color: var(--link-color);
}

.profile-menu ul li:hover {
  color: var(--link-hover-color);
}

.settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  color: var(--text-color);
}

.setting-item select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid var(--text-color);
}
</style>
