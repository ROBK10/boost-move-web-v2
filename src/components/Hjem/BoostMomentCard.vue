<template>
  <RouterLink to="/movin/boost-moment" class="link">
    <div class="card">
      
      <div class="top">
        <div class="kicker">Boost Moment</div>
        <div class="icon">⚡</div>
      </div>

      <div class="content">
        <div class="streak">
          {{ streak }}
          <span class="unit">dager streak</span>
        </div>

        <div class="cta">
          <span>Start dagens boost</span>
          <span class="arrow">→</span>
        </div>
      </div>

    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../stores/appStore'

const appStore = useAppStore()

const streak = computed(() => appStore.boostStreak)
</script>

<style scoped>
.link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  display: grid;
  gap: 12px;
  transition: transform 0.15s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kicker {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #f3f4f6;
}

.content {
  display: grid;
  gap: 8px;
}

.streak {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.unit {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #111827;
}

.arrow {
  opacity: 0.7;
}
</style>