
<script setup>
import BaseCard from '../ui/BaseCard.vue'

defineProps({
  title: String,
  unit: String,
  placeholder: String,
  modelValue: [String, Number],
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <BaseCard>
    <div class="row">
      <div class="title">{{ title }}</div>
      <div class="unit" v-if="unit">{{ unit }}</div>
    </div>

    <input
      class="input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </BaseCard>
</template>

<style scoped>
.row { display: flex; justify-content: space-between; align-items: baseline; }
.title { font-weight: 800; }
.unit { opacity: 0.7; font-size: 12px; }
.input { margin-top: 10px; width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 10px; }
</style>