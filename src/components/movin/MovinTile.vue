<script setup>
import BaseCard from '@/components/ui/BaseCard.vue'
import { RouterLink } from 'vue-router'

defineProps({
  title: String,
  to: String,
})
</script>

<template>
  <RouterLink class="tile" :to="to">
    <BaseCard>
      <div class="title">{{ title }}</div>
    </BaseCard>
  </RouterLink>
</template>

<style scoped>
.tile {
  text-decoration: none;
  color: inherit;
  display: block;
}

.title {
  font-weight: 700;
}
</style>
