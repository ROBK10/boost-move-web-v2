<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-2xl font-bold">Hei, Ole</h1>
      <p class="text-gray-500">Klar for en ny dag?</p>
    </header>

    <!-- Helse Score Card -->
    <div class="card">
      <div class="score">
        <div class="number">{{ healthScore }}</div>
        <div class="label">HELSE SCORE</div>
      </div>
    </div>

    <!-- Boost Card -->
    <div class="card dark">
      <div>
        <div class="small">MAI 2024</div>
        <div class="big">{{ streak }} totalt</div>
      </div>
      <RouterLink to="/movin/boost-moment" class="button">
        Start nå →
      </RouterLink>
    </div>

    <!-- Mental Start -->
    <div class="card">
      <div class="big">Mental start</div>
      <div class="small">2 min pause</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const healthScore = ref(78)
const streak = ref(12)
</script>

<style scoped>
.card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.card.dark {
  background: #111;
  color: white;
}

.score {
  text-align: center;
}

.number {
  font-size: 48px;
  font-weight: 800;
}

.label {
  font-size: 12px;
  letter-spacing: 2px;
  opacity: 0.6;
}

.small {
  font-size: 14px;
  opacity: 0.7;
}

.big {
  font-size: 20px;
  font-weight: 700;
}

.button {
  display: inline-block;
  margin-top: 12px;
  background: white;
  color: black;
  padding: 10px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
}
</style>
