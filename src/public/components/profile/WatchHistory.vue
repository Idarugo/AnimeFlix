<template>
  <div class="watch-history">
    <ul v-if="watchHistory.length > 0">
      <li v-for="history in watchHistory" :key="history.id">
        {{ history.anime_titulo }} - {{ history.fecha_visto }}
        <button @click="deleteHistory(history.id)">Eliminar</button>
      </li>
    </ul>
    <p v-else>No tienes historial de reproducción.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useAnimeStore } from "../../store/animeStore";

export default defineComponent({
  name: "WatchHistory",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const animeStore = useAnimeStore();
    const watchHistory = computed(() => animeStore.watchHistory);

    onMounted(() => {
      animeStore.fetchWatchHistory(props.userId);
    });

    const deleteHistory = (historyId: number) => {
      animeStore.deleteFromWatchHistory(historyId);
    };

    return {
      watchHistory,
      deleteHistory,
    };
  },
});
</script>

<style scoped>
.watch-history ul {
  list-style: none;
  padding: 0;
}
.watch-history li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.watch-history button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.watch-history button:hover {
  background-color: #ff1a1a;
}
.watch-history p {
  text-align: center;
  font-size: 18px;
  color: #999;
}
</style>
