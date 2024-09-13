<template>
  <div class="page-container">
    <Navbar />

    <div class="privacy-policy">
      <h1>Política de Privacidad</h1>
      <p>
        En AnimeFlix, valoramos tu privacidad y estamos comprometidos con la
        protección de tus datos personales. Esta política de privacidad describe
        cómo recopilamos, usamos y protegemos tu información.
      </p>
      <p>
        Para más detalles sobre nuestras prácticas de privacidad, por favor
        revisa la política completa a continuación.
      </p>
      <h2>Información que Recopilamos</h2>
      <p>
        Recopilamos información personal que nos proporcionas al registrarte en
        nuestro sitio, como tu nombre, dirección de correo electrónico y
        preferencias de anime.
      </p>
      <h2>Cómo Usamos tu Información</h2>
      <p>
        Utilizamos la información que recopilamos para mejorar nuestra
        plataforma, proporcionarte contenido personalizado y enviarte
        notificaciones relevantes.
      </p>
      <h2>Protección de tu Información</h2>
      <p>
        Implementamos medidas de seguridad avanzadas para proteger tus datos
        personales y garantizar que estén seguros en nuestra plataforma.
      </p>
    </div>

    <FooterView />
  </div>
</template>
  
<script lang="ts">
import Navbar from "../components/navbar/Navbar.vue";
import FooterView from "../components/FooterView.vue";

export default {
  name: "PoliticaPrivacidadView",
  components: {
    Navbar,
    FooterView,
  },
};
</script>
  
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.privacy-policy {
  padding: 100px 20px 40px; /* Añadido padding-top para evitar superposición */
  max-width: 1000px;
  margin: 0 auto;
  flex-grow: 1;
  color: #fff;
  background: linear-gradient(to right, #141e30, #243b55);
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.privacy-policy h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 30px;
}

.privacy-policy h2 {
  margin-top: 30px;
  font-size: 24px;
  color: #e50914;
}

.privacy-policy p {
  line-height: 1.8;
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
