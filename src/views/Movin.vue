<script setup>
import { useRoute } from 'vue-router'
import { movinTiles } from '@/data/movinTiles'
import MovinTile from '@/components/movin/MovinTile.vue'

const route = useRoute()

// Vi er på "Movin oversikt" kun når path er akkurat /movin
const isMovinIndex = () => route.path === '/movin'
</script>

<template>
  <div>
    <!-- Vis grid kun på /movin -->
    <div v-if="isMovinIndex()">
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

    <!-- Her rendres child routes: /movin/boost-moment osv -->
    <router-view v-else />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 12px;
}
</style>