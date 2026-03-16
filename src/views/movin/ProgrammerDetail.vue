<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovin, splitSteps } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const route = useRoute()
const router = useRouter()
const { getBySlug } = useMovin()
const { isFave, toggleFave, getProgress, setProgress, clearProgress } = useMovinState()

const slug = computed(() => String(route.params.slug ?? ""))
const article = computed(() => getBySlug(slug.value))

const steps = computed(() =>
  article.value ? splitSteps(article.value.content) : []
)

const currentStep = ref(0)
const completed = ref(false)

function restoreProgress() {
  currentStep.value = getProgress(slug.value)
  completed.value = false
}

onMounted(restoreProgress)
watch(slug, restoreProgress)

const total = computed(() => steps.value.length)
const isLast = computed(() => currentStep.value >= total.value - 1)

function next() {
  if (isLast.value) {
    clearProgress(slug.value)
    completed.value = true
  } else {
    currentStep.value += 1
    setProgress(slug.value, currentStep.value)
  }
}

function goBack() {
  router.push("/movin/programmer")
}

function openPdf() {
  if (article.value?.pdf) window.open(article.value.pdf, "_blank")
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
          <div v-if="!completed" class="badge">{{ currentStep + 1 }} / {{ total }}</div>
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

      <!-- Title -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- Progress bar -->
      <div v-if="!completed" class="progressTrack">
        <div
          class="progressBar"
          :style="{ width: ((currentStep + 1) / total * 100) + '%' }"
        ></div>
      </div>

      <!-- READING MODE -->
      <template v-if="!completed">
        <div class="stepCard">
          <div class="stepContent" v-html="steps[currentStep]"></div>
        </div>

        <div class="navRow">
          <button class="nextBtn" type="button" @click="next">
            <span>{{ isLast ? 'Fullfør' : 'Neste' }}</span>
            <span class="nextChev" aria-hidden="true"></span>
          </button>
        </div>
      </template>

      <!-- COMPLETED MODE -->
      <template v-else>
        <div class="doneCard">
          <div class="doneCheck" aria-hidden="true"></div>
          <p class="doneTitle">Bra jobba!</p>
          <p class="doneSub">Du har lest gjennom programmet.</p>
        </div>

        <div class="pdfSection" v-if="article.pdf">
          <button class="pdfBtn" type="button" @click="openPdf">
            <span class="dlIcon" aria-hidden="true"></span>
            Last ned original PDF
          </button>
        </div>

        <div class="credit">
          <template v-if="article.partner_logo">
            <img :src="article.partner_logo" :alt="article.partner" class="creditLogo" />
          </template>
          <span>Levert i samarbeid med {{ article.partner }}</span>
        </div>

        <p class="copyright">© Boost Move</p>

        <div class="backRow">
          <button class="backToList" type="button" @click="goBack">
            <span class="backChev" aria-hidden="true"></span>
            Tilbake til programmer
          </button>
        </div>
      </template>

    </div>
  </div>

  <div v-else class="page">
    <div class="container">
      <button class="back" type="button" @click="goBack" aria-label="Tilbake">
        <span class="chev" aria-hidden="true"></span>
      </button>
      <p style="margin-top:20px;color:rgba(17,24,39,0.5);font-weight:700">Fant ikke programmet.</p>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px 140px;
}

/* Header */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
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
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  background: rgba(17,24,39,0.06);
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 13px; font-weight: 800;
  color: rgba(17,24,39,0.55);
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

/* Title */
.title {
  margin: 0 0 14px;
  font-size: 26px; line-height: 1.1;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}

/* Progress bar */
.progressTrack {
  height: 4px;
  background: rgba(17,24,39,0.07);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 18px;
}

.progressBar {
  height: 100%;
  background: #b9ff00;
  border-radius: 2px;
  transition: width 300ms cubic-bezier(0.22,1,0.36,1);
}

/* Step card */
.stepCard {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(17,24,39,0.08);
  border: 1px solid rgba(17,24,39,0.05);
  overflow: hidden;
}

.stepContent {
  padding: 22px 20px 24px;
  font-size: 15px; line-height: 1.70;
  font-weight: 500; color: rgba(17,24,39,0.78);
}

.stepContent :deep(h1),
.stepContent :deep(h2),
.stepContent :deep(h3) {
  font-size: 18px; font-weight: 900;
  color: #111827; letter-spacing: -0.02em;
  margin: 0 0 12px; line-height: 1.2;
}

.stepContent :deep(p) { margin: 0 0 12px; }
.stepContent :deep(p:last-child) { margin-bottom: 0; }
.stepContent :deep(ul), .stepContent :deep(ol) { padding-left: 20px; margin: 0 0 12px; }
.stepContent :deep(li) { margin-bottom: 6px; }
.stepContent :deep(hr) { border: none; border-top: 1px solid rgba(17,24,39,0.08); margin: 16px 0; }
.stepContent :deep(em) { color: rgba(17,24,39,0.45); font-style: normal; }
.stepContent :deep(a) { color: rgba(17,24,39,0.55); text-decoration: underline; }
.stepContent :deep(strong) { font-weight: 800; color: rgba(17,24,39,0.88); }

/* Navigation */
.navRow { padding: 16px 0 0; }

.nextBtn {
  width: 100%; height: 56px;
  border: none; border-radius: 18px;
  background: #111827; color: white;
  font-size: 15px; font-weight: 900;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: opacity 120ms ease;
}
.nextBtn:active { opacity: 0.85; }

.nextChev {
  width: 9px; height: 9px;
  border-right: 2.5px solid rgba(255,255,255,0.85);
  border-top: 2.5px solid rgba(255,255,255,0.85);
  transform: rotate(45deg);
}

/* Done card */
.doneCard {
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(17,24,39,0.08);
  border: 1px solid rgba(17,24,39,0.05);
  padding: 32px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  margin-bottom: 20px;
}

.doneCheck {
  width: 56px; height: 56px;
  border-radius: 999px;
  background: rgba(185,255,0,0.20);
  position: relative; flex-shrink: 0;
}
.doneCheck::after {
  content: "";
  position: absolute;
  left: 15px; top: 18px;
  width: 10px; height: 14px;
  border-right: 3px solid #5a9000;
  border-bottom: 3px solid #5a9000;
  transform: rotate(35deg);
}

.doneTitle {
  margin: 0;
  font-size: 20px; font-weight: 900;
  color: #111827; letter-spacing: -0.02em;
}

.doneSub {
  margin: 0;
  font-size: 14px; font-weight: 600;
  color: rgba(17,24,39,0.45);
}

/* PDF section */
.pdfSection {
  background: rgba(17,24,39,0.03);
  border: 1px solid rgba(17,24,39,0.07);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 16px;
}

.pdfLabel {
  margin: 0 0 12px;
  font-size: 13px; font-weight: 700;
  color: rgba(17,24,39,0.45);
}

.pdfBtn {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; width: 100%; height: 50px;
  border: none; border-radius: 14px;
  background: #111827; color: white;
  font-size: 14px; font-weight: 900;
  cursor: pointer; transition: opacity 120ms ease;
}
.pdfBtn:active { opacity: 0.85; }

.dlIcon {
  width: 14px; height: 14px;
  position: relative; display: inline-block; flex-shrink: 0;
}
.dlIcon::before {
  content: ""; position: absolute;
  left: 6px; top: 0; width: 2px; height: 9px; background: white;
}
.dlIcon::after {
  content: ""; position: absolute;
  left: 3px; top: 5px; width: 8px; height: 8px;
  border-right: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(45deg);
}

/* Credit */
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

.copyright {
  margin: 6px 0 0;
  font-size: 11px; font-weight: 600;
  color: rgba(17,24,39,0.25);
  padding: 0 4px;
}

/* Back to list */
.backRow {
  padding: 20px 0 0;
}

.backToList {
  width: 100%;
  height: 50px;
  border: 1.5px solid rgba(17,24,39,0.12);
  border-radius: 14px;
  background: transparent;
  color: rgba(17,24,39,0.55);
  font-size: 14px; font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 120ms ease, border-color 120ms ease;
  letter-spacing: -0.01em;
}
.backToList:active { background: rgba(17,24,39,0.04); border-color: rgba(17,24,39,0.20); }

.backChev {
  width: 8px; height: 8px;
  border-left: 2px solid rgba(17,24,39,0.55);
  border-bottom: 2px solid rgba(17,24,39,0.55);
  transform: rotate(45deg);
  margin-top: 1px;
}
</style>
