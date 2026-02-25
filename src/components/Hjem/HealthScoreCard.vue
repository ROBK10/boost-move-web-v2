<script setup>
const props = defineProps({
  score: { type: Number, default: 0 },
})
</script>
<template>
   <RouterLink to="/min-helse" class="link">
    <div class="card">
      <h2 class="title">Helse score</h2>
      <div class="score">{{ score }}</div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  background: white;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
}

.score {
  font-size: 48px;
  font-weight: 800;
  color: #111827;
}
</style>