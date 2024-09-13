<template>
  <div class="page-container">
    <Navbar />
    <div class="about-us">
      <h1>Sobre Nosotros</h1>
      <div class="about-content">
        <img
          src="../assets/img/equipo.png"
          alt="Nuestro equipo"
          class="about-image"
          loading="lazy"
        />
        <div class="about-text">
          <p>
            Bienvenido a AnimeFlix, tu plataforma de anime favorita donde puedes
            disfrutar de una amplia selección de series, películas y
            lanzamientos recientes. Estamos dedicados a brindarte la mejor
            experiencia de visualización con contenido de alta calidad.
          </p>
          <p>
            Nuestro objetivo es proporcionar una experiencia inmersiva y
            entretenida para todos los amantes del anime. Con un equipo
            apasionado por el anime, nos esforzamos por ofrecer las últimas
            novedades y los mejores títulos para que disfrutes.
          </p>
        </div>
      </div>
    </div>
    <FooterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";

export default defineComponent({
  name: "SobreNosotrosView",
  components: {
    Navbar,
    FooterView,
  },
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121212;
}

.about-us {
  padding: 100px 20px 40px; /* Ajuste del padding-top */
  max-width: 1200px;
  margin: 0 auto;
  flex-grow: 1;
  color: #fff;
  background: linear-gradient(to right, #141e30, #243b55);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-us h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
  color: #ff9800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-image {
  width: 100%;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.about-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-text p {
  line-height: 1.8;
  font-size: 18px;
  margin-bottom: 15px;
  text-align: justify;
}

@media (min-width: 768px) {
  .about-content {
    flex-direction: row;
    gap: 40px;
  }

  .about-image {
    width: 50%;
  }

  .about-text {
    width: 50%;
  }
}

@media (min-width: 1200px) {
  .about-us {
    padding: 120px 40px 60px;
  }

  .about-us h1 {
    font-size: 48px;
    margin-bottom: 40px;
  }

  .about-text p {
    font-size: 20px;
  }
}
</style>
