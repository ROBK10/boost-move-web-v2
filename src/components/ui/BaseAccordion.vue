<script setup lang="ts">
import { ref, watch } from "vue"

type AccordionItem = { id: string }
type AccordionCategory = {
  id: string
  title: string
  items: AccordionItem[]
}

const props = withDefaults(
  defineProps<{
    categories: AccordionCategory[]
    autoOpenFirst?: boolean
  }>(),
  {
    autoOpenFirst: false,
  }
)

const emit = defineEmits<{
  (e: "item-click", itemId: string): void
}>()

const openCategoryId = ref<string | null>(null)

watch(
  () => props.categories,
  (categories) => {
    if (props.autoOpenFirst && categories.length > 0 && !openCategoryId.value) {
      openCategoryId.value = categories[0]?.id ?? null
    }
  },
  { immediate: true }
)

function toggleCategory(id: string) {
  openCategoryId.value = openCategoryId.value === id ? null : id
}

function handleItemClick(itemId: string) {
  emit("item-click", itemId)
}
</script>

<template>
  <section class="list">
    <div v-for="cat in categories" :key="cat.id" class="catBlock">
      <button class="catRow" type="button" @click="toggleCategory(cat.id)">
        <div class="catTitle">{{ cat.title }}</div>
        <span class="catChev" :class="{ open: openCategoryId === cat.id }" aria-hidden="true"></span>
      </button>

      <div v-if="openCategoryId === cat.id" class="items">
        <button
          v-for="it in cat.items"
          :key="it.id"
          class="itemRow"
          type="button"
          @click="handleItemClick(it.id)"
        >
          <slot :item="it" :category="cat" />
        </button>

        <div v-if="cat.items.length === 0" class="empty">
          Innhold kommer snart.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list{ display:flex; flex-direction:column; gap:12px; }

.catRow{
  width:100%;
  border:none;
  background: rgba(17,24,39,0.04);
  border-radius:18px;
  padding: 18px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  cursor:pointer;
}
.catTitle{
  font-size:18px;
  font-weight:900;
  color: rgba(17,24,39,0.92);
}
.catChev{
  width:10px;height:10px;
  border-right:2px solid rgba(17,24,39,0.45);
  border-bottom:2px solid rgba(17,24,39,0.45);
  transform: rotate(45deg);
  transition: transform 120ms ease;
}
.catChev.open{ transform: rotate(-135deg); }

.items{
  margin-top: 10px;
  display:flex;
  flex-direction:column;
  gap: 12px;
}

.itemRow{
  width:100%;
  border:none;
  background: rgba(17,24,39,0.04);
  border-radius:18px;
  padding:14px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  cursor:pointer;
}

.empty{
  font-size:14px;
  font-weight:800;
  color: rgba(17,24,39,0.45);
  padding: 10px 4px 0;
}
</style>
