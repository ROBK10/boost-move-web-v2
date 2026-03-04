<script setup lang="ts">
import { computed } from "vue"
import BaseCard from "@/components/ui/BaseCard.vue"

const props = defineProps<{
  title: string
  unit?: string
  placeholder?: string
  type?: "number" | "text"
  step?: string | number
  min?: string | number
  max?: string | number
  modelValue: string | number | null
  hint?: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: string | number | null): void
}>()

const inputType = computed(() => props.type ?? "number")

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (v === "") return emit("update:modelValue", null)
  if (inputType.value === "number") return emit("update:modelValue", Number(v))
  emit("update:modelValue", v)
}
</script>

<template>
  <BaseCard>
    <div class="top">
      <div class="title">{{ title }}</div>
      <div class="unit" v-if="unit">{{ unit }}</div>
    </div>

    <input
      class="input"
      :type="inputType"
      :placeholder="placeholder"
      :value="modelValue ?? ''"
      :step="step"
      :min="min"
      :max="max"
      @input="onInput"
    />

    <div v-if="hint" class="hint">{{ hint }}</div>
  </BaseCard>
</template>

<style scoped>
.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.title {
  font-weight: 900;
  letter-spacing: -0.01em;
  color: rgba(17, 24, 39, 0.92);
}

.unit {
  font-size: 12px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.45);
}

.input {
  margin-top: 10px;
  width: 100%;
  padding: 12px 12px;
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 14px;
  font-weight: 800;
  outline: none;
}

.input:focus {
  border-color: rgba(17, 24, 39, 0.28);
}

.hint {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.45);
}
</style>