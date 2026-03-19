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
      <button
        class="catRow"
        :class="{ 'catRow--open': openCategoryId === cat.id }"
        type="button"
        @click="toggleCategory(cat.id)"
      >
        <div class="catLeft">
          <slot name="category-icon" :category="cat" />
          <span class="catTitle">{{ cat.title }}</span>
        </div>
        <span class="catChev" :class="{ open: openCategoryId === cat.id }" aria-hidden="true"></span>
      </button>

      <Transition name="expand">
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
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.list { display: flex; flex-direction: column; gap: 10px; }

.catBlock { display: flex; flex-direction: column; }

.catRow {
  width: 100%;
  border: none;
  background: #023238;
  border-radius: 20px;
  padding: 16px 18px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  transition: box-shadow 160ms ease, background 120ms ease, border-color 160ms ease;
}

.catRow--open {
  box-shadow: 0 8px 28px rgba(0,0,0,0.3);
  border-color: rgba(209,231,229,0.1);
  background: #fafafa;
}

.catRow:active { background: rgba(209,231,229,0.04); }

.catLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.catTitle {
  font-size: 17px;
  font-weight: 900;
  color: rgba(209,231,229,0.95);
  letter-spacing: -0.01em;
  text-align: left;
}

.catChev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(209,231,229,0.3);
  border-bottom: 2px solid rgba(209,231,229,0.3);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
}
.catChev.open { transform: rotate(-135deg); }

.items {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.itemRow {
  width: 100%;
  border: none;
  background: #023238;
  border-radius: 16px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 1px solid rgba(209,231,229,0.08);
  transition: background 120ms ease, box-shadow 120ms ease;
}

.itemRow:hover {
  background: rgba(209,231,229,0.04);
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
}

.itemRow:active { background: rgba(209,231,229,0.06); }

.empty {
  font-size: 14px;
  font-weight: 700;
  color: rgba(209,231,229,0.35);
  padding: 12px 4px;
}

/* Expand transition */
.expand-enter-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.expand-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.expand-enter-from { opacity: 0; transform: translateY(-8px); }
.expand-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
