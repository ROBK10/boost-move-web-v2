<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { findMalById } from "@/data/malerContent"

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id || ""))
const item = computed(() => findMalById(id.value))

const isPdfOnly = computed(() => !!item.value?.pdfOnly)
const hasImage = computed(() => !!item.value?.image)
const hasPdf = computed(() => !!item.value?.pdfUrl)

function goBack() {
  router.push("/movin/maler")
}

function openPdf() {
  if (item.value?.pdfUrl) {
    window.open(item.value.pdfUrl, "_blank")
  }
}
</script>

<template>
  <div class="page" v-if="item">
    <div class="container">
      <header class="top">
        <button class="back" type="button" @click="goBack" aria-label="Tilbake">
          <span class="chev" aria-hidden="true"></span>
        </button>
      </header>

      <h1 class="title">{{ item.title }}</h1>
      <p v-if="item.subtitle" class="subtitle">{{ item.subtitle }}</p>

      <!-- Template preview image -->
      <div v-if="hasImage" class="previewWrap">
        <img :src="item.image" :alt="item.title" class="previewImg" />
      </div>

      <!-- PDF-only card (no preview) -->
      <div v-if="isPdfOnly && !hasImage" class="pdfCard">
        <div class="pdfCardIcon" aria-hidden="true"></div>
        <p class="pdfCardText">Denne malen er tilgjengelig som PDF for utskrift.</p>
        <button class="pdfBtn" type="button" @click="openPdf">
          <span class="dlIcon" aria-hidden="true"></span>
          Last ned mal (PDF)
        </button>
      </div>

      <!-- Image + PDF download -->
      <div v-if="hasImage && hasPdf" class="downloadCard">
        <p class="downloadHint">Klar til utskrift på A4</p>
        <button class="pdfBtn" type="button" @click="openPdf">
          <span class="dlIcon" aria-hidden="true"></span>
          Last ned mal (PDF)
        </button>
      </div>

      <!-- Image only (no PDF available) -->
      <div v-if="hasImage && !hasPdf" class="infoCard">
        <p class="infoText">Lagre bildet for utskrift.</p>
      </div>

      <!-- No image, no pdf -->
      <div v-if="!hasImage && !hasPdf" class="pdfCard">
        <p class="pdfCardText">Innhold kommer snart.</p>
      </div>

      <div class="bottom">
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

.top { display: flex; align-items: center; margin-bottom: 16px; }

.back {
  width: 42px;
  height: 42px;
  border: none;
  background: white;
  border-radius: 999px;
  box-shadow: 0 10px 30px rgba(20, 20, 20, 0.08);
  cursor: pointer;
  display: grid;
  place-items: center;
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
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* Template preview */
.previewWrap {
  margin-top: 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.12);
  border: 1px solid rgba(17, 24, 39, 0.06);
  background: white;
}

.previewImg {
  width: 100%;
  display: block;
  object-fit: contain;
}

/* Download card (appears below preview when PDF available) */
.downloadCard {
  margin-top: 14px;
  background: white;
  border-radius: 20px;
  padding: 16px 18px;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.05);
  border: 1px solid rgba(17, 24, 39, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.downloadHint {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: rgba(17, 24, 39, 0.55);
}

/* Info card (image-only, no PDF) */
.infoCard {
  margin-top: 14px;
  background: white;
  border-radius: 20px;
  padding: 14px 18px;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.05);
  border: 1px solid rgba(17, 24, 39, 0.05);
}

.infoText {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.45);
}

/* PDF-only card (no image) */
.pdfCard {
  margin-top: 24px;
  background: white;
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.07);
  border: 1px solid rgba(17, 24, 39, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}

.pdfCardIcon {
  width: 52px;
  height: 60px;
  border: 2px solid rgba(17, 24, 39, 0.12);
  border-radius: 8px;
  position: relative;
  background: rgba(17, 24, 39, 0.03);
}

.pdfCardIcon::before {
  content: "PDF";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: rgba(17, 24, 39, 0.40);
}

.pdfCardText {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
  line-height: 1.5;
}

.pdfBtn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 24px;
  border: none;
  border-radius: 16px;
  background: #111827;
  color: white;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 120ms ease;
}

.pdfBtn:active { opacity: 0.8; }

.dlIcon {
  width: 16px;
  height: 16px;
  position: relative;
  display: inline-block;
  flex-shrink: 0;
}

.dlIcon::before {
  content: "";
  position: absolute;
  left: 7px; top: 1px;
  width: 2px; height: 9px;
  background: white;
}

.dlIcon::after {
  content: "";
  position: absolute;
  left: 4px; top: 7px;
  width: 8px; height: 8px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
}

/* Bottom nav */
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 86px;
  padding: 0 16px;
  display: flex;
}

.complete {
  flex: 1;
  height: 58px;
  border: none;
  border-radius: 18px;
  background: rgba(185, 255, 0, 0.95);
  color: #111827;
  font-weight: 900;
  cursor: pointer;
}
</style>
