<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import { useMovinState } from "@/composables/useMovinState"

const route = useRoute()
const router = useRouter()
const { getBySlug } = useMovin()
const { isFave, toggleFave } = useMovinState()

const slug = computed(() => String(route.params.slug ?? ""))
const article = computed(() => getBySlug(slug.value))

function goBack() {
  router.push("/movin/fordeler")
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

        <button
          class="starBtn"
          type="button"
          :class="{ active: isFave(slug) }"
          @click="toggleFave(slug)"
          :aria-label="isFave(slug) ? 'Fjern favoritt' : 'Legg til favoritt'"
        >
          <span class="starIcon" aria-hidden="true"></span>
        </button>
      </header>

      <!-- Partner logo -->
      <div v-if="article.partner_logo" class="logoWrap">
        <img :src="article.partner_logo" :alt="article.partner" class="logoImg" />
      </div>

      <h1 class="title">{{ article.title }}</h1>

      <!-- Full content — single page -->
      <div class="contentCard">
        <div class="content" v-html="article.content"></div>
      </div>

      <!-- PDF download -->
      <div v-if="article.pdf" class="pdfSection">
        <button class="pdfBtn" type="button" @click="openPdf">
          <span class="dlIcon" aria-hidden="true"></span>
          Last ned original PDF
        </button>
      </div>

      <!-- Credit -->
      <div class="credit">
        <template v-if="article.partner_logo">
          <img :src="article.partner_logo" :alt="article.partner" class="creditLogo" />
        </template>
        <span>Levert i samarbeid med {{ article.partner }}</span>
      </div>
      <p class="copyright">© Boost Move</p>

    </div>
  </div>

  <div v-else class="page">
    <div class="container">
      <button class="back" type="button" @click="goBack" aria-label="Tilbake">
        <span class="chev" aria-hidden="true"></span>
      </button>
      <p class="notFoundText">Fant ikke innholdet.</p>
    </div>
  </div>
</template>

<style scoped>
.page { width: 100%; }

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 18px 16px 120px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.back {
  width: 42px; height: 42px;
  border: none; background: #023238; border-radius: 999px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  cursor: pointer; display: grid; place-items: center; flex-shrink: 0;
}

.chev {
  width: 12px; height: 12px;
  border-left: 2px solid rgba(209,231,229,0.5);
  border-bottom: 2px solid rgba(209,231,229,0.5);
  transform: rotate(45deg);
}

.starBtn {
  width: 40px; height: 40px;
  background: rgba(209,231,229,0.06); border: none; border-radius: 999px;
  display: grid; place-items: center; cursor: pointer;
  transition: background 120ms ease;
}
.starBtn:active { background: rgba(209,231,229,0.1); }
.starBtn.active { background: rgba(251,191,36,0.18); }

.starIcon {
  width: 18px; height: 18px; display: block;
  background: rgba(209,231,229,0.3);
  clip-path: polygon(50% 0%,62% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,38% 35%);
  transition: background 120ms ease;
}
.starBtn.active .starIcon { background: rgba(251,191,36,0.95); }

/* Partner logo */
.logoWrap {
  background: #023238;
  border-radius: 16px;
  border: 1px solid rgba(209,231,229,0.08);
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  display: flex; align-items: center; justify-content: center;
  padding: 16px 24px; min-height: 72px;
  margin-bottom: 14px;
}

.logoImg {
  max-width: 100%; max-height: 56px;
  object-fit: contain; display: block;
}

.title {
  margin: 0 0 16px;
  font-size: 26px; line-height: 1.1;
  font-weight: 900; letter-spacing: -0.03em; color: #FFFFFF;
}

/* Full content card */
.contentCard {
  background: #023238;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  border: 1px solid rgba(209,231,229,0.08);
  overflow: hidden;
  margin-bottom: 16px;
}

.content {
  padding: 22px 20px 24px;
  font-size: 15px; line-height: 1.70;
  font-weight: 500; color: #D1E7E5;
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
  font-size: 18px; font-weight: 900;
  color: #FFFFFF; letter-spacing: -0.02em;
  margin: 18px 0 10px; line-height: 1.2;
}
.content :deep(h1:first-child),
.content :deep(h2:first-child),
.content :deep(h3:first-child) { margin-top: 0; }

.content :deep(p) { margin: 0 0 12px; }
.content :deep(p:last-child) { margin-bottom: 0; }
.content :deep(ul), .content :deep(ol) { padding-left: 20px; margin: 0 0 12px; }
.content :deep(li) { margin-bottom: 6px; }
.content :deep(hr) { border: none; border-top: 1px solid rgba(209,231,229,0.1); margin: 16px 0; }
.content :deep(em) { color: rgba(209,231,229,0.35); font-style: normal; }
.content :deep(a) { color: rgba(209,231,229,0.6); text-decoration: underline; }
.content :deep(strong) { font-weight: 800; color: rgba(209,231,229,0.95); }

/* PDF */
.pdfSection {
  margin-bottom: 16px;
}

.pdfBtn {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; width: 100%; height: 50px;
  border: none; border-radius: 14px;
  background: #023238; color: white;
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
  left: 6px; top: 0; width: 2px; height: 9px; background: #023238;
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
  color: rgba(209,231,229,0.35);
  padding: 0 4px;
}

.creditLogo {
  height: 24px; max-width: 60px;
  object-fit: contain; flex-shrink: 0;
}

.copyright {
  margin: 6px 0 0;
  font-size: 11px; font-weight: 600;
  color: rgba(209,231,229,0.25);
  padding: 0 4px;
}

.notFoundText {
  margin-top: 20px;
  font-size: 15px; font-weight: 700;
  color: rgba(209,231,229,0.35);
}
</style>
