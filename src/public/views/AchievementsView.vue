<template>
  <div class="achievements-view">
    <h2>Mis Logros</h2>
    <div v-if="unlockedAchievements.length" class="achievements-list">
      <div
        v-for="achievement in unlockedAchievements"
        :key="achievement.id"
        class="achievement-item"
      >
        <h3>{{ achievement.name }}</h3>
        <p>{{ achievement.description }}</p>
      </div>
    </div>
    <p v-else>No has desbloqueado ningún logro todavía.</p>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, computed } from "vue";
import { useAnimeStore } from "../public/store/animeStore";

export default defineComponent({
  name: "AchievementsView",
  setup() {
    const animeStore = useAnimeStore();

    return {
      unlockedAchievements: computed(() => animeStore.unlockedAchievements),
    };
  },
});
</script>
  
  <style scoped>
.achievements-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.achievements-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.achievement-item {
  padding: 15px;
  background-color: var(--background-light);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.achievement-item h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}
</style>
  