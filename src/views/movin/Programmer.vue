<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getProgrammerCategories } from "@/data/programmerContent"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

function openLink() {
  // V2: open external resource link
}

const categories = computed(() => getProgrammerCategories())

const openCategoryId = ref<string | null>(null)

// Åpne Oppstart automatisk (som i video)
onMounted(() => {
  openCategoryId.value = "oppstart"
})

function toggleCategory(id: string) {
  openCategoryId.value = openCategoryId.value === id ? null : id
}

// V1 UI state
const starred = reactive<Record<string, boolean>>({})
const downloaded = reactive<Record<string, boolean>>({})

function toggleStar(id: string) {
  starred[id] = !starred[id]
}

function toggleDownload(id: string) {
  downloaded[id] = !downloaded[id]
}

function openItem(id: string) {
  router.push(`/movin/programmer/${id}`)
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
            <h1 class="title">Programmer</h1>
            <p class="subtitle">Strukturerte treningsprogrammer</p>
          </div>
        </div>

        <button class="linkBtn" type="button" @click="openLink" aria-label="Link">
          <span class="linkIcon" aria-hidden="true"></span>
        </button>
      </header>

      <section class="list">
        <div v-for="cat in categories" :key="cat.id" class="catBlock">
          <button class="catRow" :class="{ 'catRow--open': openCategoryId === cat.id }" type="button" @click="toggleCategory(cat.id)">
            <div class="catTitle">{{ cat.title }}</div>
            <div class="catRight">
              <a
                v-if="cat.pdfUrl"
                :href="cat.pdfUrl"
                target="_blank"
                class="catPdfBadge"
                @click.stop
                aria-label="Last ned program som PDF"
              >PDF</a>
              <span class="catChev" :class="{ open: openCategoryId === cat.id }" aria-hidden="true"></span>
            </div>
          </button>

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
                  <div v-if="it.pdfOnly" class="pdfMark" aria-hidden="true">PDF</div>
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
                  :class="{ on: !!starred[it.id] }"
                  @click="toggleStar(it.id)"
                >
                  <span class="star"></span>
                </button>

                <button
                  class="iconBtn"
                  :class="{ on: !!downloaded[it.id] }"
                  @click="toggleDownload(it.id)"
                >
                  <span class="dl"></span>
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
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.headLeft {
  display:flex;
  align-items:flex-start;
  gap: 12px;
}

.back{
  width:42px;height:42px;border:none;background:white;border-radius:999px;
  box-shadow:0 10px 30px rgba(20,20,20,0.08);
  cursor:pointer;
  display:grid;
  place-items:center;
}

.chev{
  width:12px;height:12px;
  border-left:2px solid rgba(17,24,39,0.55);
  border-bottom:2px solid rgba(17,24,39,0.55);
  transform:rotate(45deg);
}

.linkBtn{
  width:42px;height:42px;border:none;background:rgba(255,255,255,0.75);
  border-radius:999px;
  box-shadow:0 10px 24px rgba(20,20,20,0.08);
  cursor:pointer;
  display:grid;
  place-items:center;
}

.linkIcon{
  width:18px;height:18px;position:relative;display:inline-block;
}
.linkIcon::before{
  content:"";
  position:absolute;
  left:2px;top:8px;width:14px;height:2px;
  background: rgba(17,24,39,0.55);
  transform: rotate(-25deg);
}
.linkIcon::after{
  content:"";
  position:absolute;
  left:10px;top:2px;width:10px;height:10px;
  border-radius:999px;
  border:2px solid rgba(17,24,39,0.55);
}

/* Typography */
.title{
  margin:0;
  font-size:34px;
  line-height:1.05;
  font-weight:900;
  letter-spacing:-0.03em;
  color:#111827;
}
.subtitle{
  margin:8px 0 0;
  font-size:14px;
  font-weight:700;
  color:rgba(17,24,39,0.45);
}

/* List */
.list{ display:flex; flex-direction:column; gap:10px; }

.catRow{
  width:100%;
  border: 1px solid rgba(17,24,39,0.06);
  background: white;
  border-radius:20px;
  padding:16px 18px;
  min-height: 64px;
  display:flex;align-items:center;justify-content:space-between;
  gap: 12px;
  cursor:pointer;
  box-shadow: 0 4px 16px rgba(17,24,39,0.06);
  transition: box-shadow 160ms ease, background 120ms ease, border-color 160ms ease;
}
.catRow--open {
  box-shadow: 0 8px 28px rgba(17,24,39,0.10);
  border-color: rgba(17,24,39,0.10);
  background: #fafafa;
}
.catRow:active { background: rgba(17,24,39,0.03); }
.catTitle{ font-size:17px;font-weight:900;color:rgba(17,24,39,0.92);letter-spacing:-0.01em; }

.catRight {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.catPdfBadge {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: rgba(17, 24, 39, 0.55);
  border: 1.5px solid rgba(17, 24, 39, 0.18);
  border-radius: 6px;
  padding: 3px 7px;
  text-decoration: none;
  transition: background 120ms ease, color 120ms ease;
}

.catPdfBadge:hover {
  background: rgba(17, 24, 39, 0.06);
  color: rgba(17, 24, 39, 0.85);
}

.catChev{
  width:10px;height:10px;
  border-right:2px solid rgba(17,24,39,0.35);
  border-bottom:2px solid rgba(17,24,39,0.35);
  transform: rotate(45deg);
  transition: transform 200ms cubic-bezier(0.22,1,0.36,1);
  flex-shrink:0;
}
.catChev.open{ transform: rotate(-135deg); }

.items{ margin-top:8px;display:flex;flex-direction:column;gap:8px; }

.itemRow{
  width:100%;
  border: 1px solid rgba(17,24,39,0.05);
  background: white;
  border-radius:16px;
  padding:14px 14px;
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;cursor:pointer;
  box-shadow: 0 2px 8px rgba(17,24,39,0.05);
  transition: background 120ms ease, box-shadow 120ms ease;
}
.itemRow:hover {
  background: rgba(17,24,39,0.02);
  box-shadow: 0 4px 14px rgba(17,24,39,0.08);
}
.itemRow:active { background: rgba(17,24,39,0.04); }

.left{ display:flex;align-items:center;gap:12px;min-width:0; }

.thumb{
  width:64px;height:64px;border-radius:16px;
  background: rgba(17,24,39,0.10);
  position:relative;display:grid;place-items:center;
  flex-shrink:0;overflow:hidden;
}

.docPreview{
  width:52px;height:52px;border-radius:12px;
  background: rgba(255,255,255,0.7);
  box-shadow: inset 0 0 0 1px rgba(17,24,39,0.08);
}

.pdfMark{
  font-size:9px;font-weight:900;
  letter-spacing:0.06em;
  color:rgba(17,24,39,0.45);
  border:1.5px solid rgba(17,24,39,0.20);
  border-radius:5px;
  padding:3px 5px;
}

.rowTitle{ font-size:18px;font-weight:900;color:rgba(17,24,39,0.92); }
.rowSub{ margin-top:4px;font-size:14px;font-weight:700;color:rgba(17,24,39,0.55); }

.actions{ display:flex;gap:10px; }

.iconBtn{
  width:42px;height:42px;border-radius:999px;border:none;
  background: rgba(255,255,255,0.75);
  box-shadow:0 10px 24px rgba(20,20,20,0.08);
  display:grid;place-items:center;cursor:pointer;
}

.iconBtn.on{ background: rgba(16,185,129,0.12); }

.star{
  width:18px;height:18px;display:inline-block;
  background: rgba(17,24,39,0.55);
  clip-path: polygon(
    50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%
  );
}
.iconBtn.on .star{ background: rgba(16,185,129,0.95); }

.dl{
  width:18px;height:18px;position:relative;display:inline-block;
}
.dl::before{
  content:"";position:absolute;left:8px;top:2px;
  width:2px;height:10px;background: rgba(17,24,39,0.55);
}
.dl::after{
  content:"";position:absolute;left:5px;top:9px;
  width:8px;height:8px;
  border-right:2px solid rgba(17,24,39,0.55);
  border-bottom:2px solid rgba(17,24,39,0.55);
  transform: rotate(45deg);
}
.iconBtn.on .dl::before{ background: rgba(16,185,129,0.95); }
.iconBtn.on .dl::after{
  border-right-color: rgba(16,185,129,0.95);
  border-bottom-color: rgba(16,185,129,0.95);
}

.empty{
  font-size:14px;font-weight:800;color:rgba(17,24,39,0.45);
  padding:10px 4px 0;
}

.expand-enter-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.expand-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.expand-enter-from { opacity: 0; transform: translateY(-8px); }
.expand-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>