<script setup>
import HealthScoreCard from '../components/Hjem/HealthScoreCard.vue'
import BoostMomentCard from '../components/Hjem/BoostMomentCard.vue'
import DagensInnsiktCard from '../components/Hjem/DagensInnsiktCard.vue'
import KomIGangMentaltCard from '../components/Hjem/KomIGangMentaltCard.vue'
</script>

<template>
  <div class="hjem">

    <!-- Header -->
    <div class="header">
      <h1>Hjem</h1>

      <div class="bell">
        🔔
        <span class="badge"></span>
      </div>
    </div>

    <!-- Kort -->
    <HealthScoreCard :score="78" />
    <BoostMomentCard />
    <DagensInnsiktCard />
    <KomIGangMentaltCard />

  </div>
</template>

<style scoped>
.hjem {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
}

/* Bell */
.bell {
  position: relative;
  font-size: 22px;
  cursor: pointer;
}

/* Red notification dot */
.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 999px;
}
</style>