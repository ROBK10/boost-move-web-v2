<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useMovin } from "@/composables/useMovin"
import PartnerBadge from "@/components/movin/PartnerBadge.vue"

const route = useRoute()
const router = useRouter()
const { getBySlug } = useMovin()

const slug = computed(() => String(route.params.slug ?? ""))
const article = computed(() => getBySlug(slug.value))

function goBack() {
  router.back()
}

function openPdf() {
  if (article.value?.pdf) window.open(article.value.pdf, "_blank")
}

const categoryLabel: Record<string, string> = {
  knowzone:   "KnowZone",
  fordeler:   "Fordeler",
  programmer: "Programmer",
  maler:      "Maler",
}
</script>

<template>
  <div class="page" v-if="article">
    <!-- Header -->
    <header class="top">
      <button class="back" type="button" @click="goBack" aria-label="Tilbake">
        <span class="chev" aria-hidden="true"></span>
      </button>
      <div class="catBadge">{{ categoryLabel[article.category] ?? article.category }}</div>
    </header>

    <!-- Hero image -->
    <div v-if="article.image" class="hero">
      <img :src="article.image" :alt="article.title" class="heroImg" />
    </div>

    <!-- Title block -->
    <div class="titleBlock">
      <h1 class="title">{{ article.title }}</h1>
    </div>

    <!-- Article content -->
    <article class="content" v-html="article.content"></article>

    <!-- Footer -->
    <footer class="footer">
      <PartnerBadge :partner="article.partner" :partner-logo="article.partner_logo" />

      <button
        v-if="article.pdf"
        class="pdfBtn"
        type="button"
        @click="openPdf"
      >
        <span class="dlIcon" aria-hidden="true"></span>
        Last ned original PDF
      </button>

      <div class="copyright">© Boost Move</div>
    </footer>
  </div>

  <!-- Not found -->
  <div v-else class="notFound">
    <button class="back" type="button" @click="goBack" aria-label="Tilbake">
      <span class="chev" aria-hidden="true"></span>
    </button>
    <p class="notFoundText">Fant ikke artikkelen.</p>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding-bottom: 110px;
}

/* Header */
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px 12px;
  gap: 12px;
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

.catBadge {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(17, 24, 39, 0.45);
  background: rgba(17, 24, 39, 0.06);
  border-radius: 999px;
  padding: 6px 12px;
}

/* Hero */
.hero {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: rgba(17, 24, 39, 0.06);
}

.heroImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Title */
.titleBlock {
  padding: 20px 16px 0;
}

.title {
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #111827;
}

/* Article content */
.content {
  padding: 16px 16px 0;
  font-size: 15px;
  line-height: 1.65;
  font-weight: 500;
  color: rgba(17, 24, 39, 0.75);
}

.content :deep(h1),
.content :deep(h2),
.content :deep(h3) {
  font-size: 17px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.90);
  letter-spacing: -0.02em;
  margin: 20px 0 6px;
  line-height: 1.25;
}

.content :deep(p) {
  margin: 0 0 12px;
}

.content :deep(ul),
.content :deep(ol) {
  padding-left: 20px;
  margin: 0 0 12px;
}

.content :deep(li) {
  margin-bottom: 6px;
}

.content :deep(hr) {
  border: none;
  border-top: 1px solid rgba(17, 24, 39, 0.08);
  margin: 20px 0;
}

.content :deep(a) {
  color: rgba(17, 24, 39, 0.55);
  text-decoration: underline;
}

.content :deep(em) {
  color: rgba(17, 24, 39, 0.45);
  font-style: normal;
}

/* Footer */
.footer {
  margin: 24px 16px 0;
  padding: 20px;
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(17, 24, 39, 0.06);
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pdfBtn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: #111827;
  color: white;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: opacity 120ms ease;
}
.pdfBtn:active { opacity: 0.82; }

.dlIcon {
  width: 16px; height: 16px;
  position: relative; display: inline-block; flex-shrink: 0;
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

.copyright {
  font-size: 12px;
  font-weight: 600;
  color: rgba(17, 24, 39, 0.28);
  text-align: center;
}

/* Not found */
.notFound {
  max-width: 520px;
  margin: 0 auto;
  padding: 18px 16px;
}

.notFoundText {
  margin-top: 20px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(17, 24, 39, 0.55);
}
</style>
