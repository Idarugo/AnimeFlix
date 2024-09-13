<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <router-link to="/">
          <img
            src="../assets/img/logo.png"
            alt="AnimeFlix Logo"
            loading="lazy"
          />
        </router-link>
      </div>
      <div class="footer-links">
        <ul>
          <li>
            <router-link to="/sobre-nosotros">Sobre Nosotros</router-link>
          </li>
          <li><router-link to="/contacto">Contacto</router-link></li>
          <li>
            <router-link to="/politica-privacidad"
              >Política de Privacidad</router-link
            >
          </li>
        </ul>
      </div>
      <div class="footer-social">
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com" target="_blank" aria-label="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <i class="fab fa-instagram"></i>
        </a>
        <a href="https://youtube.com" target="_blank" aria-label="YouTube">
          <i class="fab fa-youtube"></i>
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 AnimeFlix. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>


<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterView",
});
</script>

<style scoped>
.footer {
  background-color: var(--navbar-background);
  color: var(--text-color);
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-logo img {
  width: 120px;
  height: auto;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
}

.footer-links ul li {
  margin: 0;
}

.footer-links a {
  color: var(--link-color);
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
}

.footer-links a:hover {
  color: var(--link-hover-color);
}

.footer-social a {
  color: var(--link-color);
  margin-right: 15px;
  font-size: 20px;
}

.footer-social a:hover {
  color: var(--link-hover-color);
}

.footer-bottom {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.footer-bottom p {
  margin: 0;
}
</style>
