<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

import { movinTiles } from "@/data/movinTiles"
import MovinTile from "@/components/movin/MovinTile.vue"

const route = useRoute()

const isMovinIndex = computed(() => route.path === "/movin")
</script>

<template>
  <div class="page">
    <!-- Movin index / hub -->
    <div v-if="isMovinIndex" class="container">
      <header class="head">
        <h1 class="title">Movin</h1>
        <p class="subtitle">Din ressurs-hub for wellness</p>
      </header>

      <div class="grid">
        <MovinTile
          v-for="tile in movinTiles"
          :key="tile.to"
          :title="tile.title"
          :subtitle="tile.subtitle"
          :to="tile.to"
          :icon="tile.icon"
          :variant="tile.variant"
        />
      </div>
    </div>

    <!-- Child routes: /movin/boost-moment osv -->
    <router-view v-else />
  </div>
</template>

<style scoped>
.page {
  width: 100%;
}

/* holder innholdet sentrert som en app */
.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 0;
}

.head {
  margin-bottom: 18px;
}

.title {
  margin: 0;
  font-size: 46px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
</style>