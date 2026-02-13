<script setup>
import { movinTiles } from '../data/movinTiles'
import MovinTile from '../components/movin/MovinTile.vue'
</script>

<template>
  <div>
    <h1>Movin</h1>

    <div class="grid">
      <MovinTile
        v-for="tile in movinTiles"
        :key="tile.to"
        :title="tile.title"
        :to="tile.to"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 12px;
}
</style>