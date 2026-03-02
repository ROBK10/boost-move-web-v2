<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getProgrammerCategories } from "@/data/programmerContent"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

function openLink() {
  console.log("open link (placeholder)")
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
const checked = reactive<Record<string, boolean>>({})

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
            <p class="subtitle">Mine programmer</p>
          </div>
        </div>

        <button class="linkBtn" type="button" @click="openLink" aria-label="Link">
          <span class="linkIcon" aria-hidden="true"></span>
        </button>
      </header>

      <section class="list">
        <div v-for="cat in categories" :key="cat.id" class="catBlock">
          <button class="catRow" type="button" @click="toggleCategory(cat.id)">
            <div class="catTitle">{{ cat.title }}</div>
            <span class="catChev" :class="{ open: openCategoryId === cat.id }"></span>
          </button>

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
                  <div v-if="checked[it.id]" class="check"></div>
                  <div v-else class="ghostMark"></div>
                  <div class="docPreview"></div>
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
.list{ display:flex; flex-direction:column; gap:12px; }

.catRow{
  width:100%;border:none;
  background: rgba(17,24,39,0.04);
  border-radius:18px;
  padding:18px 16px;
  display:flex;align-items:center;justify-content:space-between;
  cursor:pointer;
}
.catTitle{ font-size:18px;font-weight:900;color:rgba(17,24,39,0.92); }

.catChev{
  width:10px;height:10px;
  border-right:2px solid rgba(17,24,39,0.45);
  border-bottom:2px solid rgba(17,24,39,0.45);
  transform: rotate(45deg);
  transition: transform 120ms ease;
}
.catChev.open{ transform: rotate(-135deg); }

.items{ margin-top:10px;display:flex;flex-direction:column;gap:12px; }

.itemRow{
  width:100%;border:none;
  background: rgba(17,24,39,0.04);
  border-radius:18px;
  padding:14px 12px;
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;cursor:pointer;
}

.left{ display:flex;align-items:center;gap:12px; }

.thumb{
  width:64px;height:64px;border-radius:16px;
  background: rgba(17,24,39,0.10);
  position:relative;display:grid;place-items:center;
}

.check{
  position:absolute;left:8px;top:8px;
  width:16px;height:16px;border-radius:6px;
  background: rgba(16,185,129,0.95);
}
.ghostMark{
  position:absolute;left:8px;top:8px;
  width:16px;height:16px;border-radius:6px;
  background: rgba(17,24,39,0.10);
}

.docPreview{
  width:52px;height:52px;border-radius:12px;
  background: rgba(255,255,255,0.7);
  box-shadow: inset 0 0 0 1px rgba(17,24,39,0.08);
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
</style>