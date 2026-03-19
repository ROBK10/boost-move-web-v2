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
  background: #023238;
  border-radius: 22px;
  padding: 14px 14px 12px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
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
  color: rgba(209,231,229,0.95);
}

.hint {
  font-size: 12px;
  font-weight: 800;
  color: rgba(209,231,229,0.35);
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
  background: rgba(209,231,229,0.1);
}

.dot.off {
  background: rgba(239, 68, 68, 0.85);
}

.dot.on {
  background: rgba(34, 197, 94, 0.85);
}
</style>