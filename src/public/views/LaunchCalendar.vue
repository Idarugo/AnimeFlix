<template>
  <div class="launch-calendar-view">
    <Navbar />
    <div class="content">
      <h2>📅 Calendario de Lanzamientos</h2>
      <div v-if="lanzamientos.length" class="lanzamientos-grid">
        <div
          v-for="lanzamiento in lanzamientos"
          :key="lanzamiento.lanzamiento_id"
          class="lanzamiento-item"
        >
          <img
            :src="
              lanzamiento.temporada_imagen_url ||
              'https://via.placeholder.com/150x225'
            "
            :alt="lanzamiento.temporada_titulo || 'Sin título'"
            class="lanzamiento-image"
          />
          <div class="lanzamiento-info">
            <h3>{{ lanzamiento.temporada_titulo || "Sin título" }}</h3>
            <p><strong>Episodio:</strong> {{ lanzamiento.episodio_titulo }}</p>
            <p>
              <strong>Fecha de lanzamiento:</strong>
              {{ formatDate(lanzamiento.fecha_lanzamiento) }}
            </p>
            <button
              :class="{ 'in-list': isInFavorites(lanzamiento) }"
              @click="toggleFavorite(lanzamiento)"
              :disabled="isInFavorites(lanzamiento)"
            >
              {{
                isInFavorites(lanzamiento)
                  ? "En Mi Lista"
                  : "Agregar a Mi Lista"
              }}
            </button>
          </div>
        </div>
      </div>
      <p v-else class="no-lanzamientos">No hay lanzamientos próximos.</p>
    </div>
    <FooterView />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useAnimeStore } from "../store/animeStore";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";

export default defineComponent({
  name: "LaunchCalendar",
  components: {
    Navbar,
    FooterView,
  },
  setup() {
    const animeStore = useAnimeStore();
    const lanzamientos = ref([]);
    const router = useRouter();

    onMounted(async () => {
      await animeStore.fetchLanzamientos();
      lanzamientos.value = animeStore.lanzamientos;
    });

    const isInFavorites = (lanzamiento: any) => {
      return animeStore.favorites.some(
        (fav) => fav.episodio_id === lanzamiento.episodio_id
      );
    };

    const toggleFavorite = (lanzamiento: any) => {
      if (!isInFavorites(lanzamiento)) {
        animeStore.addToFavorites(lanzamiento);
        Swal.fire({
          title: "Añadido",
          text: `${
            lanzamiento.temporada_titulo || "Sin título"
          } ha sido añadido a tu lista.`,
          icon: "success",
          confirmButtonText: "Entendido",
        });
      }
    };

    const goBack = () => {
      router.back();
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return {
      lanzamientos,
      isInFavorites,
      toggleFavorite,
      goBack,
      formatDate,
    };
  },
});
</script>

<style scoped>
.launch-calendar-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 100px 20px 40px; /* Ajusta el padding para no superponerse con el Navbar */
  flex-grow: 1;
  max-width: 800px;
  margin: 0 auto;
  background-color: var(--background-secondary);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.back-button {
  background-color: #ff5a5a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.back-button:hover {
  background-color: #e04c4c;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
}

.lanzamientos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.lanzamiento-item {
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.lanzamiento-item:hover {
  transform: translateY(-5px);
}

.lanzamiento-image {
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
}

.lanzamiento-info {
  padding: 15px;
}

.lanzamiento-info h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.lanzamiento-info p {
  margin: 5px 0;
  color: var(--text-secondary);
}

.lanzamiento-info button {
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.lanzamiento-info button:hover {
  background-color: #45a049;
}

.lanzamiento-info button.in-list {
  background-color: #ff9800;
}

.lanzamiento-info button.in-list:hover {
  background-color: #fb8c00;
}

.no-lanzamientos {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
