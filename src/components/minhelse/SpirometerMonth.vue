<script setup lang="ts">
type Day = {
  date: string
  tracked: boolean
}

defineProps<{
  title?: string
  days: Day[]
}>()
</script>

<template>
  <div class="card">
    <div class="top">
      <div class="t">{{ title ?? "Spirometer (måned)" }}</div>
      <div class="hint">{{ days.length }} dager</div>
    </div>

    <div class="grid" aria-label="Månedssporing">
      <span
        v-for="d in days"
        :key="d.date"
        class="dot"
        :class="d.tracked ? 'on' : 'off'"
        :title="d.date"
      />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 22px;
  padding: 14px 14px 12px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.06);
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.t {
  font-weight: 900;
  letter-spacing: -0.02em;
  color: rgba(17, 24, 39, 0.92);
}

.hint {
  font-size: 12px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 18px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.12);
}

.dot.off {
  background: rgba(239, 68, 68, 0.85);
}

.dot.on {
  background: rgba(34, 197, 94, 0.85);
}
</style>