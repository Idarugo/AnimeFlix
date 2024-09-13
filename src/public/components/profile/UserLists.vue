<template>
  <div class="user-lists">
    <ul v-if="userLists.length > 0">
      <li v-for="anime in userLists" :key="anime.id">
        <img :src="anime.imagen_url" alt="Imagen del anime" />
        <span>{{ anime.titulo }}</span>
        <!-- Botón para eliminar el anime de la lista -->
        <button @click="removeFromList(anime)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No tienes animes en tu lista.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from "vue";
import { useAnimeStore } from "../../store/animeStore";
import type { Anime } from "../../store/animeStore";

export default defineComponent({
  name: "UserLists",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const animeStore = useAnimeStore();
    const userLists: Ref<Anime[]> = ref([]); // Define correctamente el tipo

    onMounted(() => {
      animeStore.fetchUserLists(props.userId).then(() => {
        userLists.value = animeStore.listas; // Asigna el array de `Anime`
      });
    });

    const removeFromList = (anime: Anime) => {
      animeStore.removeFromFavorites(anime.id).then(() => {
        userLists.value = animeStore.listas; // Vuelve a actualizar la lista después de eliminar
      });
    };

    return {
      userLists,
      removeFromList,
    };
  },
});
</script>

<style scoped>
.user-lists ul {
  list-style: none;
  padding: 0;
}
.user-lists li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.user-lists img {
  width: 50px;
  height: 75px;
  margin-right: 10px;
}
.user-lists span {
  font-size: 18px;
  margin-right: 10px; /* Añade un espacio entre el título y el botón */
}
.user-lists button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.user-lists button:hover {
  background-color: #ff1a1a;
}
.user-lists p {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>
