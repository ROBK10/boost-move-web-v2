<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const route = useRoute()
const router = useRouter()
const { getBySlug } = useMovin()
const { isFave, toggleFave, isCompleted, markCompleted } = useMovinState()

const slug = computed(() => String(route.params.slug ?? ""))
const article = computed(() => getBySlug(slug.value))

function goBack() {
  router.push("/movin/maler")
}

function openPdf() {
  if (article.value?.pdf) {
    markCompleted(slug.value)
    window.open(article.value.pdf, "_blank")
  }
}
</script>

<template>
  <div class="page" v-if="article">
    <div class="container">

      <!-- Header -->
      <header class="top">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div class="topRight">
          <span v-if="isCompleted(slug)" class="doneBadge">
            <span class="doneDot" aria-hidden="true"></span>
            Lastet ned
          </span>
          <button
            class="starBtn"
            type="button"
            :class="{ active: isFave(slug) }"
            @click="toggleFave(slug)"
            :aria-label="isFave(slug) ? 'Fjern favoritt' : 'Legg til favoritt'"
          >
            <span class="starIcon" aria-hidden="true"></span>
          </button>
        </div>
      </header>

      <h1 class="title">{{ article.title }}</h1>

      <!-- Preview image -->
      <div v-if="article.image" class="previewWrap">
        <img :src="article.image" :alt="article.title" class="previewImg" />
      </div>

      <!-- No preview placeholder -->
      <div v-else class="pdfCard">
        <div class="pdfCardIcon" aria-hidden="true"></div>
        <p class="pdfCardText">Mal tilgjengelig som PDF for utskrift.</p>
      </div>

      <!-- Download card -->
      <div v-if="article.pdf" class="downloadCard">
        <p class="downloadHint">Klar til utskrift på A4</p>
        <button class="pdfBtn" type="button" @click="openPdf">
          <span class="dlIcon" aria-hidden="true"></span>
          Last ned PDF
        </button>
      </div>

      <!-- Partner credit -->
      <div class="credit">
        <template v-if="article.partner_logo">
          <img :src="article.partner_logo" :alt="article.partner" class="creditLogo" />
        </template>
        <span>Levert i samarbeid med {{ article.partner }}</span>
      </div>

    </div>
  </div>

  <div v-else class="page">
    <div class="container">
      <button class="back" type="button" @click="goBack" aria-label="Tilbake">
        <span class="chev" aria-hidden="true"></span>
      </button>
      <p class="notFound">Fant ikke malen.</p>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 120px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.back {
  width: 42px; height: 42px;
  border: none; background: white; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20,20,20,0.08);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(17,24,39,0.55);
  border-bottom: 2px solid rgba(17,24,39,0.55);
  transform: rotate(45deg);
}

.topRight {
  display: flex; align-items: center; gap: 10px;
}

.doneBadge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 800;
  color: rgba(17,24,39,0.70);
  background: rgba(185,255,0,0.25);
  border-radius: 999px;
  padding: 5px 10px 5px 7px;
}

.doneDot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: rgba(60,120,0,0.65);
  flex-shrink: 0;
}

.starBtn {
  width: 40px; height: 40px;
  background: rgba(17,24,39,0.05); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(17,24,39,0.10); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 18px; height: 18px; display: block;
  background: rgba(17,24,39,0.38);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }

.title {
  margin: 0 0 20px;
  font-size: 28px; line-height: 1.1;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}

.previewWrap {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(17,24,39,0.12);
  border: 1px solid rgba(17,24,39,0.06);
  background: white;
  margin-bottom: 14px;
}

.previewImg {
  width: 100%; display: block; object-fit: contain;
}

.pdfCard {
  background: white;
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 8px 28px rgba(17,24,39,0.07);
  border: 1px solid rgba(17,24,39,0.06);
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; text-align: center;
  margin-bottom: 14px;
}

.pdfCardIcon {
  width: 52px; height: 60px;
  border: 2px solid rgba(17,24,39,0.12);
  border-radius: 8px; position: relative;
  background: rgba(17,24,39,0.03);
}
.pdfCardIcon::before {
  content: "PDF";
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 900;
  letter-spacing: 0.05em; color: rgba(17,24,39,0.40);
}

.pdfCardText {
  margin: 0; font-size: 14px; font-weight: 700;
  color: rgba(17,24,39,0.55); line-height: 1.5;
}

.downloadCard {
  background: white;
  border-radius: 20px;
  padding: 16px 18px;
  box-shadow: 0 4px 16px rgba(17,24,39,0.05);
  border: 1px solid rgba(17,24,39,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.downloadHint {
  margin: 0;
  font-size: 14px; font-weight: 800; color: rgba(17,24,39,0.75);
}

.pdfBtn {
  display: inline-flex; align-items: center; gap: 8px;
  height: 44px; padding: 0 18px;
  border: none; border-radius: 12px;
  background: #111827; color: white;
  font-size: 13px; font-weight: 900;
  cursor: pointer; flex-shrink: 0;
  transition: opacity 120ms ease;
}
.pdfBtn:active { opacity: 0.82; }

.dlIcon {
  width: 14px; height: 14px;
  position: relative; display: inline-block; flex-shrink: 0;
}
.dlIcon::before {
  content: ""; position: absolute;
  left: 6px; top: 1px; width: 2px; height: 8px; background: white;
}
.dlIcon::after {
  content: ""; position: absolute;
  left: 3px; top: 6px; width: 8px; height: 8px;
  border-right: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(45deg);
}

.credit {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px; font-weight: 700;
  color: rgba(17,24,39,0.38);
  padding: 0 4px;
}

.creditLogo {
  height: 24px; max-width: 60px;
  object-fit: contain; flex-shrink: 0;
}

.notFound {
  margin-top: 20px;
  font-size: 15px; font-weight: 700;
  color: rgba(17,24,39,0.45);
}
</style>
