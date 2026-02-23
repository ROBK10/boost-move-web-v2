<script setup>
import HealthScoreCard from '../components/Hjem/HealthScoreCard.vue'
</script>

<template>
  <div class="hjem">
    <HealthScoreCard />
  </div>
</template>

<style scoped>
.hjem {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>