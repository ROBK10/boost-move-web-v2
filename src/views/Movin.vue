<script setup>
import { movinTiles } from '../data/movinTiles'
import MovinTile from '../components/movin/MovinTile.vue'
</script>

<template>
  <div class="page">
    <h1>Movin</h1>

    <!-- Tiles / meny -->
    <div class="grid">
      <MovinTile
        v-for="tile in movinTiles"
        :key="tile.to"
        :title="tile.title"
        :to="tile.to"
      />
    </div>

    <!-- Her rendres undersidene: BoostMoment, KomIGang, osv -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: 16px;
}

.grid {
  display: grid;
  gap: 12px;
}

.content {
  margin-top: 8px;
}
</style>
