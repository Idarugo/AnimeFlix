<!-- src/views/AdminDashboard.vue -->
<template>
  <main>
    <div class="container">
      <h1>Panel de Control</h1>
      <div class="row">
        <!-- Gráfico de Animes por Género -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Animes por Género">
            <bar-chart v-if="animeChartData" :data="animeChartData"></bar-chart>
          </ChartCard>
        </div>

        <!-- Gráfico de Lanzamientos Recientes -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Lanzamientos Recientes">
            <line-chart
              v-if="launchChartData"
              :data="launchChartData"
            ></line-chart>
          </ChartCard>
        </div>

        <!-- Gráfico de Categorías por Anime -->
        <div class="col-lg-4 mb-4">
          <ChartCard title="Categorías por Anime">
            <pie-chart
              v-if="categoryChartData"
              :data="categoryChartData"
            ></pie-chart>
          </ChartCard>
        </div>

        <!-- Listado de Series Disponibles -->
        <div class="col-lg-4 mb-4">
          <ChartCard title="Series Disponibles">
            <ul class="lista">
              <li v-for="serie in series" :key="serie.id">
                <p>{{ serie.titulo }}</p>
                <p>
                  <strong>{{ serie.categoria }}</strong>
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Reseñas Recientes -->
        <div class="col-lg-12 mb-4">
          <ChartCard title="Reseñas Recientes">
            <ul class="lista">
              <li v-for="resena in resenas" :key="resena.id">
                <p>{{ resena.comentario }}</p>
                <p>
                  <strong
                    >- Usuario {{ resena.usuario_nombre }} ({{
                      formatDate(resena.created_at)
                    }})</strong
                  >
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Notificaciones Recientes -->
        <div class="col-lg-12 mb-4">
          <ChartCard title="Notificaciones Recientes">
            <ul class="lista">
              <li v-for="notificacion in notificaciones" :key="notificacion.id">
                <p>{{ notificacion.mensaje }}</p>
                <p>
                  <strong
                    >- {{ notificacion.tipo }} ({{
                      formatDate(notificacion.created_at)
                    }})</strong
                  >
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Historial de Visualización -->
        <div class="col-lg-12 mb-4">
          <ChartCard title="Historial de Visualización">
            <ul class="lista">
              <li v-for="historial in historiales" :key="historial.id">
                <p>{{ historial.anime_titulo }}</p>
                <p>
                  <strong
                    >- Visto por Usuario {{ historial.usuario_nombre }} el
                    {{ formatDate(historial.fecha_visto) }}</strong
                  >
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Clasificación por Edad -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Clasificación por Edad">
            <ul class="lista">
              <li
                v-for="clasificacion in clasificaciones"
                :key="clasificacion.id"
              >
                <p>{{ clasificacion.nombre }}</p>
                <p>
                  <strong>{{ clasificacion.descripcion }}</strong>
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Géneros -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Géneros">
            <ul class="lista">
              <li v-for="genero in generos" :key="genero.id">
                <p>{{ genero.nombre }}</p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Trabajadores -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Trabajadores">
            <ul class="lista">
              <li v-for="trabajador in trabajadores" :key="trabajador.id">
                <p>{{ trabajador.nombre }}</p>
                <p>
                  <strong>{{ trabajador.email }}</strong>
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>

        <!-- Listado de Usuarios -->
        <div class="col-lg-6 mb-4">
          <ChartCard title="Usuarios">
            <ul class="lista">
              <li v-for="usuario in usuarios" :key="usuario.id">
                <p>{{ usuario.nombre }}</p>
                <p>
                  <strong>{{ usuario.email }}</strong>
                </p>
              </li>
            </ul>
          </ChartCard>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { defineComponent } from "vue";
import { Bar, Line, Pie } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
import ChartCard from "../components/ChartCard.vue";

import {
  fetchAnimeData,
  fetchLaunchData,
  fetchCategoryData,
  fetchSeriesData,
  fetchResenaData,
  fetchNotificacionData,
  fetchHistorialData,
  fetchClasificacionData,
  fetchGeneroData,
  fetchTrabajadorData,
  fetchUsuarioData,
} from "../services/dataService";

Chart.register(...registerables);

export default defineComponent({
  name: "AdminDashboard",
  components: {
    BarChart: Bar,
    LineChart: Line,
    PieChart: Pie,
    ChartCard,
  },
  data() {
    return {
      animeChartData: null,
      launchChartData: null,
      categoryChartData: null,
      series: [],
      resenas: [],
      notificaciones: [],
      historiales: [],
      clasificaciones: [],
      generos: [],
      trabajadores: [],
      usuarios: [],
    };
  },
  mounted() {
    this.fetchData();
    this.setAutoRefresh();
  },
  methods: {
    async fetchData() {
      try {
        await Promise.all([
          this.fetchAnimeData(),
          this.fetchLaunchData(),
          this.fetchCategoryData(),
          this.fetchSeriesData(),
          this.fetchResenaData(),
          this.fetchNotificacionData(),
          this.fetchHistorialData(),
          this.fetchClasificacionData(),
          this.fetchGeneroData(),
          this.fetchTrabajadorData(),
          this.fetchUsuarioData(),
        ]);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    },

    async fetchAnimeData() {
      const data = await fetchAnimeData();
      this.processAnimeData(data);
    },

    async fetchLaunchData() {
      const data = await fetchLaunchData();
      this.processLaunchData(data);
    },

    async fetchCategoryData() {
      const data = await fetchCategoryData();
      this.processCategoryData(data);
    },

    async fetchSeriesData() {
      this.series = await fetchSeriesData();
    },

    async fetchResenaData() {
      this.resenas = await fetchResenaData();
    },

    async fetchNotificacionData() {
      this.notificaciones = await fetchNotificacionData();
    },

    async fetchHistorialData() {
      this.historiales = await fetchHistorialData();
    },

    async fetchClasificacionData() {
      this.clasificaciones = await fetchClasificacionData();
    },

    async fetchGeneroData() {
      this.generos = await fetchGeneroData();
    },

    async fetchTrabajadorData() {
      this.trabajadores = await fetchTrabajadorData();
    },

    async fetchUsuarioData() {
      this.usuarios = await fetchUsuarioData();
    },

    processAnimeData(data) {
      const genreCounts = data.reduce((acc, anime) => {
        const genre = anime.genero;
        if (!acc[genre]) {
          acc[genre] = 0;
        }
        acc[genre]++;
        return acc;
      }, {});

      this.animeChartData = {
        labels: Object.keys(genreCounts),
        datasets: [
          {
            label: "Animes",
            backgroundColor: "#42b983",
            data: Object.values(genreCounts),
          },
        ],
      };
    },

    processLaunchData(data) {
      this.launchChartData = {
        labels: data.map((l) => l.fecha),
        datasets: [
          {
            label: "Lanzamientos",
            borderColor: "#f87979",
            data: data.map((l) => l.cantidad),
          },
        ],
      };
    },

    processCategoryData(data) {
      const categoryCounts = data.reduce((acc, category) => {
        const categoryName = category.nombre;
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
        acc[categoryName]++;
        return acc;
      }, {});

      this.categoryChartData = {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            label: "Categorías",
            backgroundColor: ["#f87979", "#7acb6e", "#3498db"],
            data: Object.values(categoryCounts),
          },
        ],
      };
    },

    setAutoRefresh() {
      setInterval(() => {
        this.fetchData();
      }, 10000);
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
});
</script>

<style scoped>
@import "../assets/styles/views/Dashboard.css";
@import "../assets/styles/components/sidebar.css";
</style>
