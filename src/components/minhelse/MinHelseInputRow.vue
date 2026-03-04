<script setup lang="ts">
export type Point = {
  label: string
  value: number
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    rightMode: "value" | "stepper" | "button"
    valueText?: string
    iconBg?: string
    points?: Point[]   // ✅ optional
    onPlus?: () => void
    onMinus?: () => void
    onClick?: () => void
  }>(),
  {
    points: () => [],
    iconBg: "rgba(17,24,39,0.06)",
  }
)
</script>

<template>
  <div class="row">
    <div class="left">
      <div class="icon" :style="{ background: props.iconBg }"></div>

      <div class="txt">
        <div class="t">{{ props.title }}</div>
        <div v-if="props.subtitle" class="s">{{ props.subtitle }}</div>
      </div>
    </div>

    <div class="right">
      <template v-if="props.rightMode === 'value'">
        <div class="val">{{ props.valueText }}</div>
      </template>

      <template v-else-if="props.rightMode === 'stepper'">
        <button class="step" type="button" @click="props.onMinus?.()">–</button>
        <div class="val">{{ props.valueText }}</div>
        <button class="step" type="button" @click="props.onPlus?.()">+</button>
      </template>

      <template v-else>
        <button class="btn" type="button" @click="props.onClick?.()">Velg</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.row{
  background:#fff;
  border-radius:28px;
  padding: 16px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow:0 12px 36px rgba(20,20,20,0.06);
  border:1px solid rgba(17,24,39,0.05);
}

.left{ display:flex; gap:14px; align-items:center; min-width:0; }
.icon{ width:54px; height:54px; border-radius:18px; }
.txt{ min-width:0; }
.t{ font-size:18px; font-weight:900; color:#111827; }
.s{ margin-top:4px; font-size:13px; font-weight:800; color:rgba(17,24,39,0.45); letter-spacing:.02em; }

.right{ display:flex; gap:10px; align-items:center; }
.val{ font-size:28px; font-weight:900; color:#111827; min-width:56px; text-align:center; }

.step{
  width:46px;height:46px;border-radius:16px;border:none;
  background: rgba(17,24,39,0.06);
  font-weight:900; font-size:22px; cursor:pointer;
}

.btn{
  height:46px; padding: 0 16px; border-radius:16px; border:none;
  background:#0b0f17; color:#fff; font-weight:900; cursor:pointer;
}
</style>