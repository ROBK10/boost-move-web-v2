<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { getKnowZoneCategories } from "@/data/knowZoneContent"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

const categories = computed(() => getKnowZoneCategories())

const openCategoryId = ref<string | null>(null)

function toggleCategory(id: string) {
  openCategoryId.value = openCategoryId.value === id ? null : id
}

const starred = reactive<Record<string, boolean>>({})
const downloaded = reactive<Record<string, boolean>>({})
const checked = reactive<Record<string, boolean>>({})

function toggleStar(id: string) { starred[id] = !starred[id] }
function toggleDownload(id: string) { downloaded[id] = !downloaded[id] }
function openItem(id: string) { router.push(`/movin/knowzone/${id}`) }
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="head">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div>
          <h1 class="title">KnowZone</h1>
          <p class="subtitle">Min kunnskapsbase</p>
        </div>
      </header>

      <section class="list">
        <div v-for="cat in categories" :key="cat.id" class="catBlock">

          <!-- Category header -->
          <button
            class="catRow"
            :class="{ 'catRow--open': openCategoryId === cat.id }"
            type="button"
            @click="toggleCategory(cat.id)"
            :aria-expanded="openCategoryId === cat.id"
          >
            <div class="catLeft">
              <!-- Per-category icon -->
              <div class="catIcon" aria-hidden="true">

                <!-- vanedannelse: repeat/habit -->
                <svg v-if="cat.id === 'vanedannelse'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>

                <!-- kunnskap-trening: activity pulse -->
                <svg v-else-if="cat.id === 'kunnskap-trening'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>

                <!-- ernaering: leaf -->
                <svg v-else-if="cat.id === 'ernaering'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 8C8 10 5.9 16.17 3.82 20.82 8.88 18.46 15.07 15.39 17 8z"/>
                  <path d="M3.82 20.82C2.2 16.17 2 8 9 7"/>
                </svg>

                <!-- hormoner: waves -->
                <svg v-else-if="cat.id === 'hormoner'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12h2l2-7 4 14 3-9 2 4h7"/>
                </svg>

                <!-- muskelbalanse: symmetry arrows -->
                <svg v-else-if="cat.id === 'muskelbalanse'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22"/>
                  <path d="M7 7L2 12l5 5"/>
                  <path d="M17 7l5 5-5 5"/>
                </svg>

                <!-- urpraksis: sun -->
                <svg v-else-if="cat.id === 'urpraksis'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>

                <!-- fallback: book -->
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>

              <span class="catTitle">{{ cat.title }}</span>
            </div>
            <span class="catChev" :class="{ open: openCategoryId === cat.id }" aria-hidden="true"></span>
          </button>

          <!-- Items -->
          <Transition name="expand">
            <div v-if="openCategoryId === cat.id" class="items">
              <button
                v-for="it in cat.items"
                :key="it.id"
                class="itemRow"
                type="button"
                @click="openItem(it.id)"
              >
                <div class="left">
                  <div class="thumb">
                    <div v-if="checked[it.id]" class="check" aria-hidden="true"></div>
                    <div v-else class="ghostMark" aria-hidden="true"></div>
                    <div class="docPreview" aria-hidden="true"></div>
                  </div>
                  <div class="text">
                    <div class="rowTitle">{{ it.title }}</div>
                    <div class="rowSub">{{ it.subtitle }}</div>
                  </div>
                </div>

                <div class="actions" @click.stop>
                  <button
                    class="iconBtn"
                    type="button"
                    :class="{ on: !!starred[it.id] }"
                    @click="toggleStar(it.id)"
                    aria-label="Favoritt"
                  >
                    <span class="star" aria-hidden="true"></span>
                  </button>
                  <button
                    class="iconBtn"
                    type="button"
                    :class="{ on: !!downloaded[it.id] }"
                    @click="toggleDownload(it.id)"
                    aria-label="Last ned"
                  >
                    <span class="dl" aria-hidden="true"></span>
                  </button>
                </div>
              </button>

              <div v-if="cat.items.length === 0" class="empty">
                Innhold kommer snart.
              </div>
            </div>
          </Transition>

        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 110px;
}

/* Header */
.head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.back {
  width: 44px;
  height: 44px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.chev {
  width: 12px;
  height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.title {
  margin: 0;
  font-size: 34px;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Accordion list */
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.catBlock {
  display: flex;
  flex-direction: column;
}

/* Category row */
.catRow {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.07);
  background: white;
  border-radius: 20px;
  padding: 16px 18px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.06);
  transition: box-shadow 160ms ease, background 120ms ease, border-color 160ms ease;
}

.catRow--open {
  background: #f8f9fb;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.10);
  border-color: rgba(17, 24, 39, 0.11);
}

.catRow:active { background: rgba(17, 24, 39, 0.03); }

.catLeft {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

/* Category icon bubble */
.catIcon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.06);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: rgba(17, 24, 39, 0.65);
  transition: background 120ms ease;
}

.catRow--open .catIcon {
  background: #111827;
  color: white;
}

.catTitle {
  font-size: 17px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  letter-spacing: -0.01em;
  text-align: left;
  line-height: 1.2;
}

.catChev {
  width: 10px;
  height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.32);
  border-bottom: 2px solid rgba(17, 24, 39, 0.32);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
}
.catChev.open { transform: rotate(-135deg); }

/* Items */
.items {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.itemRow {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.05);
  background: white;
  border-radius: 16px;
  padding: 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.05);
  transition: background 120ms ease, box-shadow 120ms ease;
}

.itemRow:hover {
  background: rgba(17, 24, 39, 0.02);
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.08);
}

.itemRow:active { background: rgba(17, 24, 39, 0.04); }

.left { display: flex; align-items: center; gap: 12px; min-width: 0; }

.thumb {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(17, 24, 39, 0.07);
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.check {
  position: absolute;
  left: 7px;
  top: 7px;
  width: 14px;
  height: 14px;
  border-radius: 5px;
  background: rgba(16, 185, 129, 0.95);
}

.ghostMark {
  position: absolute;
  left: 7px;
  top: 7px;
  width: 14px;
  height: 14px;
  border-radius: 5px;
  background: rgba(17, 24, 39, 0.10);
}

.docPreview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.08);
}

.text { min-width: 0; text-align: left; }

.rowTitle {
  font-size: 15px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.92);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rowSub {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.5);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions { display: flex; gap: 8px; flex-shrink: 0; }

.iconBtn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: rgba(17, 24, 39, 0.05);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 120ms ease;
}

.iconBtn:active { background: rgba(17, 24, 39, 0.10); }
.iconBtn.on { background: rgba(16, 185, 129, 0.12); }

.star {
  width: 16px;
  height: 16px;
  display: inline-block;
  background: rgba(17, 24, 39, 0.45);
  clip-path: polygon(50% 0%, 62% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 38% 35%);
}
.iconBtn.on .star { background: rgba(16, 185, 129, 0.95); }

.dl { width: 16px; height: 16px; position: relative; display: inline-block; }
.dl::before {
  content: "";
  position: absolute;
  left: 7px; top: 2px;
  width: 2px; height: 9px;
  background: rgba(17, 24, 39, 0.45);
}
.dl::after {
  content: "";
  position: absolute;
  left: 4px; top: 8px;
  width: 8px; height: 8px;
  border-right: 2px solid rgba(17, 24, 39, 0.45);
  border-bottom: 2px solid rgba(17, 24, 39, 0.45);
  transform: rotate(45deg);
}
.iconBtn.on .dl::before { background: rgba(16, 185, 129, 0.95); }
.iconBtn.on .dl::after {
  border-right-color: rgba(16, 185, 129, 0.95);
  border-bottom-color: rgba(16, 185, 129, 0.95);
}

.empty {
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.38);
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
