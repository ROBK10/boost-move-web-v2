<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getFordelerCategories } from "@/data/fordelerContent"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

function openLink() {
  // V2: open partner / external page
}

const categories = computed(() => getFordelerCategories())

const openCategoryId = ref<string | null>(null)

onMounted(() => {
  openCategoryId.value = categories.value[0]?.id ?? null
})

function toggleCategory(id: string) {
  openCategoryId.value = openCategoryId.value === id ? null : id
}

const starred = reactive<Record<string, boolean>>({})
const downloaded = reactive<Record<string, boolean>>({})

function toggleStar(id: string) { starred[id] = !starred[id] }
function toggleDownload(id: string) { downloaded[id] = !downloaded[id] }

function openItem(id: string) {
  router.push(`/movin/fordeler/${id}`)
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="head">
        <div class="headLeft">
          <button class="back" type="button" @click="goBack" aria-label="Tilbake">
            <span class="chev" aria-hidden="true"></span>
          </button>

          <div>
            <h1 class="title">Mine fordeler</h1>
            <p class="subtitle">Ressurser og samarbeidspartnere</p>
          </div>
        </div>

        <button class="linkBtn" type="button" @click="openLink" aria-label="Link">
          <span class="linkIcon" aria-hidden="true"></span>
        </button>
      </header>

      <section class="list">
        <div v-for="cat in categories" :key="cat.id" class="catBlock">
          <!-- Category pill -->
          <button
            class="catRow"
            :class="{ 'catRow--open': openCategoryId === cat.id }"
            type="button"
            @click="toggleCategory(cat.id)"
            :aria-expanded="openCategoryId === cat.id"
          >
            <div class="catText">
              <div class="catTitle">{{ cat.title }}</div>
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
                  <div class="thumb" :class="{ 'thumb--logo': !!it.logo }">
                    <!-- Partner logo: contained, white bg -->
                    <img
                      v-if="it.logo"
                      :src="it.logo"
                      :alt="it.title"
                      class="thumbLogo"
                      aria-hidden="true"
                    />
                    <!-- Member benefit image: cover fill -->
                    <img
                      v-else-if="it.image"
                      :src="it.image"
                      :alt="it.title"
                      class="thumbImg"
                      aria-hidden="true"
                    />
                    <!-- PDF-only badge -->
                    <div v-else-if="it.pdfOnly" class="pdfMark" aria-hidden="true">PDF</div>
                    <!-- Fallback -->
                    <div v-else class="docPreview" aria-hidden="true"></div>
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
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.headLeft {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.back {
  width: 42px; height: 42px;
  border: none; background: white; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.linkBtn {
  width: 42px; height: 42px;
  border: none; background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  box-shadow: 0 10px 24px rgba(20, 20, 20, 0.08);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.linkIcon { width: 18px; height: 18px; position: relative; display: inline-block; }
.linkIcon::before {
  content: ""; position: absolute;
  left: 2px; top: 8px; width: 14px; height: 2px;
  background: rgba(17, 24, 39, 0.55);
  transform: rotate(-25deg);
}
.linkIcon::after {
  content: ""; position: absolute;
  left: 10px; top: 2px; width: 10px; height: 10px;
  border-radius: 999px;
  border: 2px solid rgba(17, 24, 39, 0.55);
  box-sizing: border-box;
}

/* Typography */
.title {
  margin: 0;
  font-size: 34px; line-height: 1.05;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}
.subtitle {
  margin: 8px 0 0;
  font-size: 14px; font-weight: 700; color: rgba(17, 24, 39, 0.45);
}

/* List */
.list { display: flex; flex-direction: column; gap: 10px; }
.catBlock { display: flex; flex-direction: column; }

/* Category pill */
.catRow {
  width: 100%;
  border: 1px solid rgba(17, 24, 39, 0.06);
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
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.10);
  border-color: rgba(17, 24, 39, 0.10);
  background: #f8f9fb;
}
.catRow:active { background: rgba(17, 24, 39, 0.03); }

.catText { display: flex; flex-direction: column; gap: 4px; text-align: left; min-width: 0; }
.catTitle {
  font-size: 17px; font-weight: 900;
  color: rgba(17, 24, 39, 0.92); letter-spacing: -0.01em;
}

.catChev {
  width: 10px; height: 10px;
  border-right: 2px solid rgba(17, 24, 39, 0.35);
  border-bottom: 2px solid rgba(17, 24, 39, 0.35);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  flex-shrink: 0;
}
.catChev.open { transform: rotate(-135deg); }

/* Items list */
.items { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }

/* Item row */
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
.itemRow:hover { background: rgba(17, 24, 39, 0.02); box-shadow: 0 4px 14px rgba(17, 24, 39, 0.08); }
.itemRow:active { background: rgba(17, 24, 39, 0.04); }

.left { display: flex; align-items: center; gap: 12px; min-width: 0; }

/* Thumbnail box */
.thumb {
  width: 64px; height: 64px;
  border-radius: 16px;
  background: rgba(17, 24, 39, 0.10);
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

/* Logo variant: white bg with padding */
.thumb--logo {
  background: white;
  border: 1px solid rgba(17, 24, 39, 0.07);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.06);
  padding: 6px;
}

/* Logo: contain, fill white box */
.thumbLogo {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
}

/* Benefit image: cover fill */
.thumbImg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.docPreview {
  width: 52px; height: 52px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 0 0 1px rgba(17, 24, 39, 0.08);
}

.pdfMark {
  font-size: 9px; font-weight: 900;
  letter-spacing: 0.06em;
  color: rgba(17, 24, 39, 0.45);
  border: 1.5px solid rgba(17, 24, 39, 0.20);
  border-radius: 5px;
  padding: 3px 5px;
}

.text { min-width: 0; text-align: left; }
.rowTitle {
  font-size: 15px; font-weight: 900;
  color: rgba(17, 24, 39, 0.92); line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rowSub {
  margin-top: 3px;
  font-size: 12px; font-weight: 700;
  color: rgba(17, 24, 39, 0.5); line-height: 1.3;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.actions { display: flex; gap: 8px; flex-shrink: 0; }

.iconBtn {
  width: 44px; height: 44px;
  border-radius: 999px; border: none;
  background: rgba(17, 24, 39, 0.05);
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.iconBtn:active { background: rgba(17, 24, 39, 0.10); }
.iconBtn.on { background: rgba(16, 185, 129, 0.12); }

.star {
  width: 16px; height: 16px;
  display: inline-block;
  background: rgba(17, 24, 39, 0.45);
  clip-path: polygon(50% 0%, 62% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 38% 35%);
}
.iconBtn.on .star { background: rgba(16, 185, 129, 0.95); }

.dl { width: 16px; height: 16px; position: relative; display: inline-block; }
.dl::before {
  content: ""; position: absolute;
  left: 7px; top: 2px; width: 2px; height: 9px;
  background: rgba(17, 24, 39, 0.45);
}
.dl::after {
  content: ""; position: absolute;
  left: 4px; top: 8px; width: 8px; height: 8px;
  border-right: 2px solid rgba(17, 24, 39, 0.45);
  border-bottom: 2px solid rgba(17, 24, 39, 0.45);
  transform: rotate(45deg);
}
.iconBtn.on .dl::before { background: rgba(16, 185, 129, 0.95); }
.iconBtn.on .dl::after {
  border-right-color: rgba(16, 185, 129, 0.95);
  border-bottom-color: rgba(16, 185, 129, 0.95);
}

.empty { font-size: 14px; font-weight: 700; color: rgba(17, 24, 39, 0.38); padding: 12px 4px; }

.expand-enter-active { transition: opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1); }
.expand-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.expand-enter-from { opacity: 0; transform: translateY(-8px); }
.expand-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
