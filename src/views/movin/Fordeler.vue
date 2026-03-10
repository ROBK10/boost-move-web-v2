<script setup lang="ts">
import { computed, reactive } from "vue"
import { useRouter } from "vue-router"
import { getFordelerCategories } from "@/data/fordelerContent"
import BaseAccordion from "@/components/ui/BaseAccordion.vue"

const router = useRouter()

function goBack() {
  router.push("/movin")
}

function openLink() {
  // V2: open partner / external page
}

const categories = computed(() => getFordelerCategories())


/**
 * V1 UI state (ikke lagring enda)
 */
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
            <p class="subtitle">Samarbeidspartnere og fordeler</p>
          </div>
        </div>

        <button class="linkBtn" type="button" @click="openLink" aria-label="Link">
          <span class="linkIcon" aria-hidden="true"></span>
        </button>
      </header>

      <BaseAccordion :categories="categories" auto-open-first @item-click="openItem">
        <template #default="{ item: it }">
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
        </template>
      </BaseAccordion>
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
  min-width: 0;
}

.back{
  width:42px;height:42px;border:none;background:white;border-radius:999px;
  box-shadow:0 10px 30px rgba(20,20,20,0.08);
  cursor:pointer;
  display:grid;
  place-items:center;
  flex-shrink: 0;
}

.chev{
  width:12px;height:12px;
  border-left:2px solid rgba(17,24,39,0.55);
  border-bottom:2px solid rgba(17,24,39,0.55);
  transform:rotate(45deg);
}

.linkBtn{
  width:42px;
  height:42px;
  border:none;
  background: rgba(255,255,255,0.75);
  border-radius:999px;
  box-shadow:0 10px 24px rgba(20,20,20,0.08);
  cursor:pointer;
  display:grid;
  place-items:center;
  flex-shrink: 0;
}

.linkIcon{
  width:18px;
  height:18px;
  position: relative;
  display:inline-block;
}
.linkIcon::before{
  content:"";
  position:absolute;
  left:2px;
  top:8px;
  width:14px;
  height:2px;
  background: rgba(17,24,39,0.55);
  transform: rotate(-25deg);
}
.linkIcon::after{
  content:"";
  position:absolute;
  left:10px;
  top:2px;
  width:10px;
  height:10px;
  border-radius: 999px;
  border: 2px solid rgba(17,24,39,0.55);
  box-sizing: border-box;
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

.left{ display:flex; align-items:center; gap:12px; min-width:0; }

.thumb{
  width:64px;
  height:64px;
  border-radius:16px;
  background: rgba(17,24,39,0.10);
  position:relative;
  display:grid;
  place-items:center;
  flex-shrink:0;
  overflow:hidden;
}

.check{
  position:absolute;
  left:8px;
  top:8px;
  width:16px;
  height:16px;
  border-radius:6px;
  background: rgba(16,185,129,0.95);
}
.ghostMark{
  position:absolute;
  left:8px;
  top:8px;
  width:16px;
  height:16px;
  border-radius:6px;
  background: rgba(17,24,39,0.10);
}

.docPreview{
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255,255,255,0.7);
  box-shadow: inset 0 0 0 1px rgba(17,24,39,0.08);
}

.text{ min-width:0; text-align:left; }
.rowTitle{
  font-size:18px;
  font-weight:900;
  color: rgba(17,24,39,0.92);
  line-height:1.15;
}
.rowSub{
  margin-top:4px;
  font-size:14px;
  font-weight:700;
  color: rgba(17,24,39,0.55);
  line-height:1.2;
}

.actions{ display:flex; gap:10px; flex-shrink:0; }

.iconBtn{
  width:42px;
  height:42px;
  border-radius:999px;
  border:none;
  background: rgba(255,255,255,0.75);
  box-shadow:0 10px 24px rgba(20,20,20,0.08);
  display:grid;
  place-items:center;
  cursor:pointer;
}

.iconBtn.on{ background: rgba(16,185,129,0.12); }

.star{
  width:18px;
  height:18px;
  display:inline-block;
  background: rgba(17,24,39,0.55);
  clip-path: polygon(
    50% 0%,
    62% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    38% 35%
  );
}
.iconBtn.on .star{ background: rgba(16,185,129,0.95); }

.dl{
  width: 18px;
  height: 18px;
  position: relative;
  display: inline-block;
}
.dl::before{
  content:"";
  position:absolute;
  left: 8px;
  top: 2px;
  width: 2px;
  height: 10px;
  background: rgba(17,24,39,0.55);
}
.dl::after{
  content:"";
  position:absolute;
  left: 5px;
  top: 9px;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(17,24,39,0.55);
  border-bottom: 2px solid rgba(17,24,39,0.55);
  transform: rotate(45deg);
}
.iconBtn.on .dl::before{ background: rgba(16,185,129,0.95); }
.iconBtn.on .dl::after{
  border-right-color: rgba(16,185,129,0.95);
  border-bottom-color: rgba(16,185,129,0.95);
}

</style>