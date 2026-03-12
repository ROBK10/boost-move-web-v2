<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { findFordelById } from "@/data/fordelerContent"

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id || ""))
const item = computed(() => findFordelById(id.value))

const index = ref(0)

watch(
  () => id.value,
  () => { index.value = 0 }
)

const total = computed(() => item.value?.sections.length ?? 0)
const hasSections = computed(() => total.value > 0)
const isPdfOnly = computed(() => !!item.value?.pdfOnly)

const isFirst = computed(() => index.value <= 0)
const isLast = computed(() => total.value > 0 && index.value >= total.value - 1)

const section = computed(() => {
  if (!item.value || item.value.sections.length === 0) return null
  return item.value.sections[index.value] ?? null
})

function goBack() {
  router.push("/movin/fordeler")
}

function prev() {
  if (isFirst.value) return
  index.value -= 1
}

function next() {
  if (isLast.value) return
  index.value += 1
}

function complete() {
  router.push("/movin/fordeler")
}

function openPdf() {
  if (item.value?.pdfUrl) window.open(item.value.pdfUrl, "_blank")
}
</script>

<template>
  <div class="page" v-if="item">
    <div class="container">

      <!-- Header -->
      <header class="top">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
        <div class="progress" v-if="hasSections">
          <span class="progressText">{{ index + 1 }}/{{ total }}</span>
        </div>
      </header>

      <h1 class="title">{{ item.title }}</h1>
      <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>

      <!-- Partner logo credit (from /partners/logos/) -->
      <div v-if="item.logo" class="logoWrap">
        <img :src="item.logo" :alt="item.title + ' logo'" class="logoImg" />
      </div>

      <!-- Member benefit image (from /fordeler/images/) -->
      <div v-if="item.image" class="heroWrap" :class="{ 'heroWrap--noLogo': !item.logo }">
        <img :src="item.image" :alt="item.title" class="heroImg" />
      </div>

      <!-- PDF-only partners (no image): show PDF CTA with logo above -->
      <div v-if="isPdfOnly" class="pdfCard">
        <div class="pdfCardIcon" aria-hidden="true"></div>
        <p class="pdfCardText">Fordelsinfo er tilgjengelig som PDF-dokument.</p>
        <button class="pdfBtn" type="button" @click="openPdf">
          <span class="dlIcon" aria-hidden="true"></span>
          Åpne fordelsinfo
        </button>
      </div>

      <!-- Info note for image-only partners -->
      <div v-if="(item.image || item.logo) && !hasSections && !isPdfOnly" class="infoCard">
        <p class="infoText">Mer info om fordelen kommer snart.</p>
        <a v-if="item.pdfUrl" :href="item.pdfUrl" target="_blank" class="pdfInline">
          <span class="pdfIcon" aria-hidden="true"></span>
          Last ned fordelsinfo
        </a>
      </div>

      <!-- Text content with paginated sections -->
      <main class="content" v-if="hasSections">
        <section class="section" v-if="section">
          <h2 class="h2">{{ section.h }}</h2>
          <p class="p">{{ section.p }}</p>
        </section>
        <a v-if="item.pdfUrl" :href="item.pdfUrl" target="_blank" class="pdfInline">
          <span class="pdfIcon" aria-hidden="true"></span>
          Last ned fordelsinfo
        </a>
      </main>

      <!-- Bottom nav -->
      <div class="bottom" v-if="hasSections">
        <button class="navBtn" type="button" @click="prev" :disabled="isFirst">Forrige</button>
        <button v-if="!isLast" class="primary" type="button" @click="next">
          Neste <span class="arrow" aria-hidden="true"></span>
        </button>
        <button v-else class="complete" type="button" @click="complete">COMPLETE</button>
      </div>

      <div class="bottom" v-else>
        <button class="complete" type="button" @click="goBack">Tilbake</button>
      </div>

    </div>
  </div>

  <div v-else class="container">
    <p>Fant ikke innholdet.</p>
    <button class="complete" type="button" @click="goBack">Tilbake</button>
  </div>
</template>

<style scoped>
.page { width: 100%; }
.container { max-width: 520px; margin: 0 auto; padding: 18px 16px 120px; }

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.back {
  width: 42px; height: 42px;
  border: none; background: white; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer; display: grid; place-items: center;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(17, 24, 39, 0.55);
  border-bottom: 2px solid rgba(17, 24, 39, 0.55);
  transform: rotate(45deg);
}

.progress {
  background: rgba(17, 24, 39, 0.06);
  padding: 10px 12px; border-radius: 999px;
}
.progressText { font-weight: 900; color: rgba(17, 24, 39, 0.65); letter-spacing: -0.01em; }

.title {
  margin: 0; font-size: 28px; line-height: 1.1;
  font-weight: 900; letter-spacing: -0.03em; color: #111827;
}
.subtitle {
  margin: 10px 0 0; font-size: 14px; font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Partner brand logo (clean, from /partners/logos/) */
.logoWrap {
  margin-top: 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 2px 12px rgba(17, 24, 39, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  min-height: 80px;
}

.logoImg {
  max-width: 100%; max-height: 80px;
  object-fit: contain; display: block;
}

/* Member benefit image (from /fordeler/images/) */
.heroWrap {
  margin-top: 10px;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(17, 24, 39, 0.08);
  border: 1px solid rgba(17, 24, 39, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  padding: 20px;
}

.heroWrap--noLogo {
  margin-top: 20px;
  min-height: 180px;
}

.heroImg {
  max-width: 100%; max-height: 280px;
  object-fit: contain; display: block;
}

/* Info note */
.infoCard {
  margin-top: 12px;
  background: white;
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 2px 10px rgba(17, 24, 39, 0.04);
  border: 1px solid rgba(17, 24, 39, 0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.infoText {
  margin: 0;
  font-size: 14px; font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Inline PDF link */
.pdfInline {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
  text-decoration: none;
}
.pdfInline:hover { color: rgba(17, 24, 39, 0.85); }

.pdfIcon {
  width: 14px; height: 16px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
  display: inline-block; flex-shrink: 0;
}

/* Text content card */
.content {
  margin-top: 18px;
  background: white; border-radius: 28px; padding: 18px;
  box-shadow: 0 12px 36px rgba(20, 20, 20, 0.06);
  border: 1px solid rgba(17, 24, 39, 0.05);
  min-height: 120px;
  display: flex; flex-direction: column; gap: 16px;
}

.section { display: flex; flex-direction: column; gap: 12px; }

.h2 {
  margin: 0; font-size: 20px; font-weight: 900;
  color: rgba(17, 24, 39, 0.92); letter-spacing: -0.02em;
}

.p {
  margin: 0; font-size: 15px; line-height: 1.6;
  font-weight: 650; color: rgba(17, 24, 39, 0.70); white-space: pre-line;
}

/* PDF-only card */
.pdfCard {
  margin-top: 20px;
  background: white; border-radius: 24px; padding: 24px 20px;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.07);
  border: 1px solid rgba(17, 24, 39, 0.06);
  display: flex; flex-direction: column; align-items: center;
  gap: 14px; text-align: center;
}

.pdfCardIcon {
  width: 52px; height: 60px;
  border: 2px solid rgba(17, 24, 39, 0.12);
  border-radius: 8px; position: relative;
  background: rgba(17, 24, 39, 0.03);
}
.pdfCardIcon::before {
  content: "PDF";
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 900;
  letter-spacing: 0.05em; color: rgba(17, 24, 39, 0.40);
}

.pdfCardText {
  margin: 0; font-size: 14px; font-weight: 700;
  color: rgba(17, 24, 39, 0.55); line-height: 1.5;
}

.pdfBtn {
  display: inline-flex; align-items: center; gap: 10px;
  height: 52px; padding: 0 24px;
  border: none; border-radius: 16px;
  background: #111827; color: white;
  font-size: 15px; font-weight: 900;
  cursor: pointer; transition: opacity 120ms ease;
}
.pdfBtn:active { opacity: 0.8; }

.dlIcon {
  width: 16px; height: 16px;
  position: relative; display: inline-block;
}
.dlIcon::before {
  content: ""; position: absolute;
  left: 7px; top: 1px; width: 2px; height: 9px; background: white;
}
.dlIcon::after {
  content: ""; position: absolute;
  left: 4px; top: 7px; width: 8px; height: 8px;
  border-right: 2px solid white; border-bottom: 2px solid white;
  transform: rotate(45deg);
}

/* Bottom nav */
.bottom {
  position: fixed; left: 0; right: 0; bottom: 86px;
  padding: 0 16px; display: flex; gap: 10px; justify-content: center;
}

.navBtn {
  flex: 1; height: 58px; border: none; border-radius: 18px;
  background: rgba(17, 24, 39, 0.06); color: rgba(17, 24, 39, 0.85);
  font-weight: 900; cursor: pointer;
}
.navBtn:disabled { opacity: 0.45; cursor: default; }

.primary {
  flex: 1; height: 58px; border: none; border-radius: 18px;
  background: #0b0f17; color: white; font-weight: 900; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}

.complete {
  flex: 1; height: 58px; border: none; border-radius: 18px;
  background: rgba(185, 255, 0, 0.95); color: #111827;
  font-weight: 900; cursor: pointer;
}

.arrow {
  width: 10px; height: 10px;
  border-right: 2px solid rgba(255, 255, 255, 0.85);
  border-top: 2px solid rgba(255, 255, 255, 0.85);
  transform: rotate(45deg);
}
</style>
