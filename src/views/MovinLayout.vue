<!-- src/views/MovinLayout.vue -->
<script setup lang="ts"></script>

<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<style scoped>
.layout {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>