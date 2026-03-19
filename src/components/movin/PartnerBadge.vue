<script setup lang="ts">
defineProps<{
  partner: string
  partnerLogo: string | null
}>()
</script>

<template>
  <div class="badge">
    <img
      v-if="partnerLogo"
      :src="partnerLogo"
      :alt="partner"
      class="logo"
    />
    <span class="name">Levert i samarbeid med {{ partner }}</span>
  </div>
</template>

<style scoped>
.badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  height: 32px;
  max-width: 80px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.name {
  font-size: 13px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  line-height: 1.3;
}
</style>
